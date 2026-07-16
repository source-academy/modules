import { afterEach, beforeEach, describe, expect, it, test } from 'vitest';
import * as funcs from '../functions';
import type { Sound, Wave } from '../types';
import { mockSoundTabRpc, type MockSoundTabRpc } from './utils';

let io: MockSoundTabRpc;

beforeEach(() => {
  io = mockSoundTabRpc();
  funcs.setSoundIO(io);
  funcs.globalVars.isPlaying = false;
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
      .toThrow('make_sound: Sound duration must be greater than or equal to 0');
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

describe('Concurrent playback functions', () => {
  afterEach(() => {
    funcs.globalVars.isPlaying = false;
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

    test('Concurrently playing two sounds should error', async () => {
      // Never resolves during the test, simulating playback still in progress - matches real
      // AudioContext playback, which genuinely takes as long as the sound's duration.
      io.playSamples.mockReturnValue(new Promise(() => {}));
      const sound = funcs.silence_sound(10);
      await drain(funcs.play(sound));
      await expect(drain(funcs.play(sound))).rejects.toThrow('play: Previous sound still playing!');
    });

    test('a mono Sound is only sampled once (left and right samples are the same array)', async () => {
      await drain(funcs.play(funcs.sine_sound(440, 0.01)));
      expect(io.playSamples).toHaveBeenCalledOnce();
      const [left, right] = io.playSamples.mock.calls[0];
      expect(left).toBe(right);
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
        .rejects.toThrow('play_wave: Sound duration must be greater than or equal to 0');
    });

    it('Should error gracefully when duration is not a number', async () => {
      await expect(drain(funcs.play_wave(constantWave(0), true as any)))
        .rejects.toThrow('play_wave: Expected number for duration, got true.');
    });

    it('Should error gracefully when wave is not a function', async () => {
      await expect(drain(funcs.play_wave(true as any, 0)))
        .rejects.toThrow('play_wave: Expected a wave for wave, got true.');
    });

    test('Concurrently playing two sounds should error', async () => {
      io.playSamples.mockReturnValue(new Promise(() => {}));
      const wave = constantWave(0);
      await drain(funcs.play_wave(wave, 10));
      await expect(drain(funcs.play_wave(wave, 10))).rejects.toThrow('play: Previous sound still playing!');
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

    it('sets isPlaying to false and tells the host to stop playback', () => {
      funcs.globalVars.isPlaying = true;
      funcs.stop();
      expect(funcs.globalVars.isPlaying).toEqual(false);
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
