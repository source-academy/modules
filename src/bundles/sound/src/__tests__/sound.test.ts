import { afterEach, beforeEach, describe, expect, it, test } from 'vitest';
import * as funcs from '../functions';
import type { Sound, Wave } from '../types';
import { mockSoundTabRpc, type MockSoundTabRpc } from './utils';

let io: MockSoundTabRpc;

beforeEach(() => {
  io = mockSoundTabRpc();
  funcs.setSoundIO(io);
  funcs.globalVars.activePlayCount = 0;
});

/**
 * Fully resolves a generator, discarding intermediate yields - the test-side equivalent of
 * functions.ts's own (unexported) drainGenerator, since none of the waves under test ever yield.
 */
async function drain<T>(generator: AsyncGenerator<void, T, undefined>): Promise<T> {
  let next = await generator.next();
  while (!next.done) {
    next = await generator.next();
  }
  return next.value;
}

function constantWave(value: number): Wave {
  return async function* () {
    return value;
  };
}

async function sampleAt(wave: Wave, t: number): Promise<number> {
  return drain(wave(t));
}

async function evaluateSound(sound: Sound): Promise<number[]> {
  const points: number[] = [];
  for (let i = 0; i < sound.duration; i += 1) {
    points.push(await sampleAt(sound.leftWave, i));
  }
  return points;
}

describe(funcs.make_sound, () => {
  it('Should error gracefully when duration is negative', () => {
    expect(() => funcs.make_sound(constantWave(0), -1))
      .toThrow('make_sound: Sound duration must be a finite number greater than or equal to 0');
  });

  it('Should error gracefully when duration is NaN or Infinity', () => {
    expect(() => funcs.make_sound(constantWave(0), NaN))
      .toThrow('make_sound: Sound duration must be a finite number greater than or equal to 0');
    expect(() => funcs.make_sound(constantWave(0), Infinity))
      .toThrow('make_sound: Sound duration must be a finite number greater than or equal to 0');
  });

  it('Should not error when duration is zero', () => {
    expect(() => funcs.make_sound(constantWave(0), 0)).not.toThrow();
  });

  it('Should error gracefully when wave is not a function', () => {
    expect(() => funcs.make_sound(true as any, 1))
      .toThrow('make_sound: Expected a wave for wave, got true.');
  });

  it('produces a Sound whose left and right channels are the same wave', () => {
    const sound = funcs.make_sound(constantWave(0), 1);
    expect(funcs.get_left_wave(sound)).toBe(funcs.get_right_wave(sound));
    expect(funcs.get_wave(sound)).toBe(funcs.get_left_wave(sound));
  });
});

describe(funcs.make_stereo_sound, () => {
  it('Should error gracefully when either wave is not a function', () => {
    expect(() => funcs.make_stereo_sound(true as any, constantWave(0), 1))
      .toThrow('make_stereo_sound: Expected a wave for left wave, got true.');
    expect(() => funcs.make_stereo_sound(constantWave(0), true as any, 1))
      .toThrow('make_stereo_sound: Expected a wave for right wave, got true.');
  });

  it('produces a Sound with genuinely different left/right channels', async () => {
    const sound = funcs.make_stereo_sound(constantWave(1), constantWave(-1), 1);
    expect(funcs.get_left_wave(sound)).not.toBe(funcs.get_right_wave(sound));
    await expect(sampleAt(funcs.get_left_wave(sound), 0)).resolves.toEqual(1);
    await expect(sampleAt(funcs.get_right_wave(sound), 0)).resolves.toEqual(-1);
  });

  it('same wave passed for both channels preserves the left===right invariant', () => {
    const wave = constantWave(0);
    const sound = funcs.make_stereo_sound(wave, wave, 1);
    expect(funcs.get_left_wave(sound)).toBe(funcs.get_right_wave(sound));
  });
});

describe('Sequential playback queue functions', () => {
  afterEach(() => {
    funcs.globalVars.activePlayCount = 0;
  });

  describe(funcs.play, () => {
    it('Should error gracefully when duration is negative', async () => {
      // Bypasses make_sound's own validation to construct an otherwise-well-formed Sound with a
      // negative duration directly, exercising play's own (redundant, defence-in-depth) check.
      const wave = constantWave(0);
      const sound: Sound = { leftWave: wave, rightWave: wave, duration: -1 };
      await expect(drain(funcs.play(sound))).rejects.toThrow('play: duration of sound is negative');
    });

    it('Should not error when duration is zero', async () => {
      const sound = funcs.make_sound(constantWave(0), 0);
      await expect(drain(funcs.play(sound))).resolves.toBe(sound);
    });

    it('Should throw error when given not a sound', async () => {
      await expect(drain(funcs.play(0 as any))).rejects.toThrow('play: Expected a Sound for sound, got 0.');
    });

    test('repeated/looped play() calls each dispatch playSamples() immediately, independently of each other', async () => {
      io.playSamples.mockReturnValue(new Promise(() => {})); // never resolves on its own

      const sound = funcs.silence_sound(10);
      await expect(drain(funcs.play(sound))).resolves.toBe(sound);
      await expect(drain(funcs.play(sound))).resolves.toBe(sound);

      // Sequencing so playback doesn't overlap is the host's job now (see
      // SoundTabPlugin.playSamples) - this Run's Worker can be torn down as soon as the program
      // finishes, well before a call that waited its turn here would ever get to fire, so play()
      // dispatches every call's RPC as soon as it's sampled instead of queueing locally.
      expect(io.playSamples).toHaveBeenCalledTimes(2);
      expect(funcs.globalVars.activePlayCount).toBe(2);
    });

    test('activePlayCount drops by one as each dispatched play() actually finishes, independently', async () => {
      let resolveFirst: () => void;
      let resolveSecond: () => void;
      io.playSamples.mockReturnValueOnce(new Promise<void>(resolve => { resolveFirst = resolve; }));
      io.playSamples.mockReturnValueOnce(new Promise<void>(resolve => { resolveSecond = resolve; }));

      await drain(funcs.play(funcs.silence_sound(10)));
      await drain(funcs.play(funcs.silence_sound(10)));
      expect(io.playSamples).toHaveBeenCalledTimes(2); // both dispatched already
      expect(funcs.globalVars.activePlayCount).toBe(2);

      resolveSecond!(); // the second one finishes first - order no longer matters
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(funcs.globalVars.activePlayCount).toBe(1);

      resolveFirst!();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(funcs.globalVars.activePlayCount).toBe(0);
    });

    test('a mono Sound is only sampled once (left and right samples are the same array)', async () => {
      await drain(funcs.play(funcs.sine_sound(440, 0.01)));
      expect(io.playSamples).toHaveBeenCalledOnce();
      const [left, right] = io.playSamples.mock.calls[0];
      expect(left).toBe(right);
    });

    test('a stale playSamples completion after stop() cannot decrement a newer play()\'s count', async () => {
      let resolveA: () => void;
      io.playSamples.mockReturnValueOnce(new Promise<void>(resolve => {
        resolveA = resolve;
      }));
      await drain(funcs.play(funcs.silence_sound(10)));
      expect(funcs.globalVars.activePlayCount).toBe(1);

      funcs.stop();
      expect(funcs.globalVars.activePlayCount).toBe(0);

      io.playSamples.mockReturnValueOnce(new Promise(() => {})); // B's playback still in progress
      await drain(funcs.play(funcs.silence_sound(10)));
      expect(funcs.globalVars.activePlayCount).toBe(1); // B's own count, unrelated to A
      expect(io.playSamples).toHaveBeenCalledTimes(2); // A and B each dispatched independently

      resolveA!(); // A's late completion arrives, well after stop()
      await new Promise(resolve => setTimeout(resolve, 0));
      // A's completion is stale (post-stop()) and doesn't touch the count, which still reflects
      // only B (whose own playSamples() call never resolves in this test).
      expect(funcs.globalVars.activePlayCount).toBe(1);
    });

    test('a genuinely stereo Sound samples each channel separately', async () => {
      const sound = funcs.make_stereo_sound(constantWave(1), constantWave(-1), 0.01);
      await drain(funcs.play(sound));
      expect(io.playSamples).toHaveBeenCalledOnce();
      const [left, right] = io.playSamples.mock.calls[0];
      expect(left).not.toBe(right);
      expect(left[0]).toEqual(1);
      expect(right[0]).toEqual(-1);
    });
  });

  describe(funcs.play_wave, () => {
    it('Should error gracefully when duration is negative', async () => {
      await expect(drain(funcs.play_wave(constantWave(0), -1)))
        .rejects.toThrow('play_wave: Sound duration must be a finite number greater than or equal to 0');
    });

    it('Should error gracefully when duration is not a number', async () => {
      await expect(drain(funcs.play_wave(constantWave(0), true as any)))
        .rejects.toThrow('play_wave: Expected number for duration, got true.');
    });

    it('Should error gracefully when wave is not a function', async () => {
      await expect(drain(funcs.play_wave(true as any, 0)))
        .rejects.toThrow('play_wave: Expected a wave for wave, got true.');
    });

    test('repeated play_wave() calls each dispatch immediately, independently of each other', async () => {
      io.playSamples.mockReturnValue(new Promise(() => {})); // never resolves on its own
      const wave = constantWave(0);
      await expect(drain(funcs.play_wave(wave, 10))).resolves.not.toBeUndefined();
      await expect(drain(funcs.play_wave(wave, 10))).resolves.not.toBeUndefined();
      expect(io.playSamples).toHaveBeenCalledTimes(2);
      expect(funcs.globalVars.activePlayCount).toBe(2);
    });
  });

  describe(funcs.play_waves, () => {
    it('plays given distinct left/right waves', async () => {
      await drain(funcs.play_waves(constantWave(1), constantWave(-1), 0.01));
      const [left, right] = io.playSamples.mock.calls.at(-1)!;
      expect(left[0]).toEqual(1);
      expect(right[0]).toEqual(-1);
    });
  });

  describe(funcs.stop, () => {
    test('Calling stop without ever calling any playback functions should not throw an error', () => {
      expect(funcs.stop).not.toThrowError();
    });

    it('resets activePlayCount to 0 and tells the host to stop playback', () => {
      funcs.globalVars.activePlayCount = 3;
      funcs.stop();
      expect(funcs.globalVars.activePlayCount).toEqual(0);
      expect(io.$stopPlayback).toHaveBeenCalledOnce();
    });
  });
});

describe(funcs.simultaneously, () => {
  it('works with sounds of the same duration', async () => {
    const sound0 = funcs.make_sound(constantWave(1), 10);
    const sound1 = funcs.make_sound(constantWave(0), 10);

    const newSound = funcs.simultaneously([sound0, sound1]);
    const points = await evaluateSound(newSound);

    expect(points.length).toEqual(10);
    for (const p of points) {
      expect(p).toEqual(0.5);
    }
  });

  it('works with sounds of different durations', async () => {
    const sound0 = funcs.make_sound(constantWave(1), 10);
    const sound1 = funcs.make_sound(constantWave(2), 5);

    const newSound = funcs.simultaneously([sound0, sound1]);
    const points = await evaluateSound(newSound);

    expect(points.length).toEqual(10);
    for (let i = 0; i < 5; i += 1) {
      expect(points[i]).toEqual(1.5);
    }
    for (let i = 5; i < 10; i += 1) {
      expect(points[i]).toEqual(0.5);
    }
  });

  it('combines left and right channels independently', async () => {
    const sound0 = funcs.make_stereo_sound(constantWave(1), constantWave(2), 5);
    const sound1 = funcs.make_stereo_sound(constantWave(3), constantWave(4), 5);

    const newSound = funcs.simultaneously([sound0, sound1]);
    expect(await sampleAt(funcs.get_left_wave(newSound), 0)).toBeCloseTo(2); // (1+3)/2
    expect(await sampleAt(funcs.get_right_wave(newSound), 0)).toBeCloseTo(3); // (2+4)/2
  });

  it('sums more than two overlapping sounds correctly', async () => {
    const sounds = [1, 2, 3, 4].map(v => funcs.make_sound(constantWave(v), 1));
    const newSound = funcs.simultaneously(sounds);
    expect(await sampleAt(funcs.get_left_wave(newSound), 0)).toBeCloseTo((1 + 2 + 3 + 4) / 4);
  });

  it('returns a silent Sound for an empty list', () => {
    const newSound = funcs.simultaneously([]);
    expect(funcs.get_duration(newSound)).toEqual(0);
  });
});

describe(funcs.consecutively, () => {
  it('works', async () => {
    const sound0 = funcs.make_sound(constantWave(1), 2);
    const sound1 = funcs.make_sound(constantWave(2), 1);

    const newSound = funcs.consecutively([sound0, sound1]);
    const points = await evaluateSound(newSound);

    expect(points.length).toEqual(3);
    for (let i = 0; i < 2; i += 1) {
      expect(points[i]).toEqual(1);
    }
    expect(points[2]).toEqual(2);
  });

  it('joins left and right channels independently', async () => {
    const sound0 = funcs.make_stereo_sound(constantWave(1), constantWave(2), 1);
    const sound1 = funcs.make_stereo_sound(constantWave(3), constantWave(4), 1);

    const newSound = funcs.consecutively([sound0, sound1]);
    expect(await sampleAt(funcs.get_left_wave(newSound), 0)).toEqual(1);
    expect(await sampleAt(funcs.get_left_wave(newSound), 1)).toEqual(3);
    expect(await sampleAt(funcs.get_right_wave(newSound), 0)).toEqual(2);
    expect(await sampleAt(funcs.get_right_wave(newSound), 1)).toEqual(4);
  });

  it('correctly picks the active sound out of a chain of more than two', async () => {
    const sounds = [
      funcs.make_sound(constantWave(1), 1),
      funcs.make_sound(constantWave(2), 1),
      funcs.make_sound(constantWave(3), 1),
      funcs.make_sound(constantWave(4), 1)
    ];
    const newSound = funcs.consecutively(sounds);
    expect(funcs.get_duration(newSound)).toEqual(4);
    for (let i = 0; i < 4; i += 1) {
      expect(await sampleAt(funcs.get_left_wave(newSound), i)).toEqual(i + 1);
    }
  });

  it('returns a silent Sound for an empty list', () => {
    const newSound = funcs.consecutively([]);
    expect(funcs.get_duration(newSound)).toEqual(0);
  });
});

describe(funcs.squash, () => {
  it('averages the left and right channels, producing a mono Sound', async () => {
    const sound = funcs.make_stereo_sound(constantWave(1), constantWave(-1), 1);
    const squashed = funcs.squash(sound);
    expect(funcs.get_left_wave(squashed)).toBe(funcs.get_right_wave(squashed));
    expect(await sampleAt(funcs.get_left_wave(squashed), 0)).toEqual(0);
  });

  it('skips the averaging math for an already-mono Sound', async () => {
    const sound = funcs.make_sound(constantWave(1), 1);
    const squashed = funcs.squash(sound);
    expect(funcs.get_left_wave(squashed)).toBe(funcs.get_right_wave(squashed));
    expect(await sampleAt(funcs.get_left_wave(squashed), 0)).toEqual(1);
  });
});

describe(funcs.pan, () => {
  it('hard left pan (-1) silences the right channel', async () => {
    const sound = funcs.make_sound(constantWave(1), 1);
    const panned = funcs.pan(-1)(sound);
    expect(await sampleAt(funcs.get_left_wave(panned), 0)).toBeCloseTo(1);
    expect(await sampleAt(funcs.get_right_wave(panned), 0)).toBeCloseTo(0);
  });

  it('hard right pan (1) silences the left channel', async () => {
    const sound = funcs.make_sound(constantWave(1), 1);
    const panned = funcs.pan(1)(sound);
    expect(await sampleAt(funcs.get_left_wave(panned), 0)).toBeCloseTo(0);
    expect(await sampleAt(funcs.get_right_wave(panned), 0)).toBeCloseTo(1);
  });

  it('balanced pan (0) evenly splits both channels', async () => {
    const sound = funcs.make_sound(constantWave(1), 1);
    const panned = funcs.pan(0)(sound);
    expect(await sampleAt(funcs.get_left_wave(panned), 0)).toBeCloseTo(0.5);
    expect(await sampleAt(funcs.get_right_wave(panned), 0)).toBeCloseTo(0.5);
  });
});

describe(funcs.pan_mod, () => {
  it('modulates the pan amount using the modulator Sound', async () => {
    const modulator = funcs.make_sound(constantWave(1), 1); // amount = 1+1 clamped to 1: hard right
    const sound = funcs.make_sound(constantWave(1), 1);
    const panned = funcs.pan_mod(modulator)(sound);
    expect(await sampleAt(funcs.get_left_wave(panned), 0)).toBeCloseTo(0);
    expect(await sampleAt(funcs.get_right_wave(panned), 0)).toBeCloseTo(1);
  });
});

describe(funcs.adsr, () => {
  it('does not produce NaN at the very end of the sound when release_ratio is 0', async () => {
    // x === duration - release_time reaches linear_decay(release_time)(0); with release_time
    // === 0 this used to compute 1 - 0/0 = NaN.
    const sound = funcs.make_sound(constantWave(1), 1);
    const shaped = funcs.adsr(0.2, 0.3, 0.5, 0)(sound);
    const lastSample = await sampleAt(funcs.get_left_wave(shaped), 1);
    expect(lastSample).not.toBeNaN();
    expect(lastSample).toEqual(0);
  });

  it('preserves a mono Sound as mono', () => {
    const sound = funcs.make_sound(constantWave(1), 1);
    const shaped = funcs.adsr(0.2, 0.3, 0.5, 0.1)(sound);
    expect(funcs.get_left_wave(shaped)).toBe(funcs.get_right_wave(shaped));
  });

  it('accepts ratios that sum to exactly 1', () => {
    expect(() => funcs.adsr(0.2, 0.3, 0.5, 0.5)).not.toThrow();
  });

  it('rejects ratios that sum to more than 1', () => {
    expect(() => funcs.adsr(0.5, 0.5, 0.5, 0.5)).toThrow(
      'adsr: attack_ratio + decay_ratio + release_ratio must not exceed 1, got 1.5',
    );
  });

  it('rejects an out-of-range ratio even if the sum is <= 1', () => {
    expect(() => funcs.adsr(-0.1, 0.3, 0.5, 0.1)).toThrow(
      'adsr: attack_ratio must be between 0 and 1, got -0.1',
    );
    expect(() => funcs.adsr(0.2, 1.5, 0.5, 0.1)).toThrow(
      'adsr: decay_ratio must be between 0 and 1, got 1.5',
    );
  });

  it('rejects an out-of-range sustain_level', () => {
    expect(() => funcs.adsr(0.2, 0.3, 1.5, 0.1)).toThrow(
      'adsr: sustain_level must be between 0 and 1, got 1.5',
    );
    expect(() => funcs.adsr(0.2, 0.3, -0.5, 0.1)).toThrow(
      'adsr: sustain_level must be between 0 and 1, got -0.5',
    );
  });

  it('rejects a non-finite ratio', () => {
    expect(() => funcs.adsr(NaN, 0.3, 0.5, 0.1)).toThrow();
    expect(() => funcs.adsr(0.2, Infinity, 0.5, 0.1)).toThrow();
  });
});

describe(funcs.phase_mod, () => {
  it('preserves a mono modulator as mono', () => {
    const modulator = funcs.make_sound(constantWave(0.5), 1);
    const modulated = funcs.phase_mod(440, 1, 1)(modulator);
    expect(funcs.get_left_wave(modulated)).toBe(funcs.get_right_wave(modulated));
  });

  it('modulates each channel using that channel\'s own wave for a genuinely stereo modulator', async () => {
    const modulator = funcs.make_stereo_sound(constantWave(0), constantWave(0.5), 1);
    const modulated = funcs.phase_mod(0, 1, 1)(modulator);
    // sin(0 + amount * modulatorSample): left modulator is 0 -> sin(0) = 0; right modulator is
    // 0.5 -> sin(0.5) - if the right channel's wave leaked in as the left's modulator too (or
    // vice versa), these would be equal.
    const left = await sampleAt(funcs.get_left_wave(modulated), 0);
    const right = await sampleAt(funcs.get_right_wave(modulated), 0);
    expect(left).toBeCloseTo(0);
    expect(right).toBeCloseTo(Math.sin(0.5));
    expect(left).not.toBeCloseTo(right, 1);
  });
});

describe('Instruments', () => {
  // Regression test: each instrument's envelopes used to be built via the now-validated adsr(),
  // so trombone's second harmonic (ratios summing to 1.0236, a longstanding quirk present since
  // before the Conductor migration - see git history) would throw as soon as trombone() was
  // called. They must use the unvalidated adsrTransformer() internally instead, preserving each
  // instrument's existing tuning exactly.
  const instruments = [
    ['bell', funcs.bell],
    ['cello', funcs.cello],
    ['piano', funcs.piano],
    ['trombone', funcs.trombone],
    ['violin', funcs.violin],
  ] as const;

  for (const [name, instrument] of instruments) {
    it(`${name} constructs a valid Sound without throwing`, () => {
      const sound = instrument(60, 1);
      expect(funcs.is_sound(sound)).toBe(true);
      expect(funcs.get_duration(sound)).toBeCloseTo(1);
    });
  }
});
