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
    points.push(await sampleAt(sound.wave, i));
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
});

describe('Concurrent playback functions', () => {
  afterEach(() => {
    funcs.globalVars.isPlaying = false;
  });

  describe(funcs.play, () => {
    it('Should error gracefully when duration is negative', async () => {
      // Bypasses make_sound's own validation to construct an otherwise-well-formed Sound with a
      // negative duration directly, exercising play's own (redundant, defence-in-depth) check.
      const sound: Sound = { wave: constantWave(0), duration: -1 };
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
});
