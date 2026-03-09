import { stringify } from 'js-slang/dist/utils/stringify';
import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import * as funcs from '../functions';
import * as play_in_tab from '../play_in_tab';
import type { Sound, Wave } from '../types';
import { mockAudioContext } from './utils';

vi.stubGlobal('AudioContext', function () { return mockAudioContext; });

describe(funcs.make_sound, () => {
  it('Should error gracefully when duration is negative', () => {
    expect(() => funcs.make_sound(() => 0, -1))
      .toThrow('make_sound: Sound duration must be greater than or equal to 0');
  });

  it('Should not error when duration is zero', () => {
    expect(() => funcs.make_sound(_t => 0, 0)).not.toThrow();
  });

  it('Should error gracefully when wave is not a function', () => {
    expect(() => funcs.make_sound(true as any, 1))
      .toThrow('make_sound: Expected Wave, got true');
  });

  it('Should error if the provided function does not take exactly one parameter', () => {
    expect(() => funcs.make_sound(((_t, _u) => 0) as any, 1))
      .toThrow('make_sound: Expected Wave, got (_t, _u) => 0.');
  });
});

describe('Concurrent playback functions', () => {
  beforeEach(() => {
    funcs.globalVars.audioplayer = null;
  });

  afterEach(() => {
    funcs.globalVars.isPlaying = false;
  });

  describe(funcs.play, () => {
    it('Should error gracefully when duration is negative', () => {
      const sound: Sound = [() => 0, -1];
      expect(() => funcs.play(sound))
        .toThrow('play: duration of sound is negative');
    });

    it('Should not error when duration is zero', () => {
      const sound = funcs.make_sound(_t => 0, 0);
      expect(() => funcs.play(sound)).not.toThrow();
    });

    it('Should throw error when given not a sound', () => {
      expect(() => funcs.play(0 as any)).toThrow('play is expecting sound, but encountered 0');
    });

    test('Concurrently playing two sounds should error', () => {
      const sound = funcs.silence_sound(10);
      expect(() => funcs.play(sound)).not.toThrow();
      expect(() => funcs.play(sound)).toThrowError('play: Previous sound still playing');
    });
  });

  describe(funcs.play_wave, () => {
    it('Should error gracefully when duration is negative', () => {
      expect(() => funcs.play_wave(_t => 0, -1))
        .toThrow('play_wave: Sound duration must be greater than or equal to 0');
    });

    it('Should error gracefully when duration is not a number', () => {
      expect(() => funcs.play_wave(_t => 0, true as any))
        .toThrow('play_wave: Expected number for duration, got true');
    });

    it('Should error gracefully when wave is not a function', () => {
      expect(() => funcs.play_wave(true as any, 0))
        .toThrow('play_wave: Expected Wave, got true');
    });

    test('Concurrently playing two sounds should error', () => {
      const wave: Wave = _t => 0;
      expect(() => funcs.play_wave(wave, 10)).not.toThrow();
      expect(() => funcs.play_wave(wave, 10)).toThrowError('play: Previous sound still playing');
    });
  });

  describe(funcs.stop, () => {
    test('Calling stop without ever calling any playback functions should not throw an error', () => {
      expect(funcs.stop).not.toThrowError();
    });

    it('sets isPlaying to false', () => {
      funcs.globalVars.isPlaying = true;
      funcs.stop();
      expect(funcs.globalVars.isPlaying).toEqual(false);
    });
  });
});

describe(play_in_tab.play_in_tab, () => {
  it('Should error gracefully when duration is negative', () => {
    const sound = [_t => 0, -1];
    expect(() => play_in_tab.play_in_tab(sound as any))
      .toThrow('play_in_tab: duration of sound is negative');
  });

  it('Should not error when duration is zero', () => {
    const sound = funcs.make_sound(_t => 0, 0);
    expect(() => play_in_tab.play_in_tab(sound)).not.toThrow();
  });

  it('Should throw error when given not a sound', () => {
    expect(() => play_in_tab.play_in_tab(0 as any)).toThrow('play_in_tab: Expected Sound, got 0');
  });

  test('Multiple calls does not cause an error', () => {
    const sound = funcs.silence_sound(10);
    expect(() => play_in_tab.play_in_tab(sound)).not.toThrow();
    expect(() => play_in_tab.play_in_tab(sound)).not.toThrow();
    expect(() => play_in_tab.play_in_tab(sound)).not.toThrow();
  });
});

function evaluateSound(sound: Sound) {
  const [wave, duration] = sound;

  const points: number[] = [];
  for (let i = 0; i < duration; i++) {
    points.push(wave(i));
  }

  return points;
}

describe(funcs.simultaneously, () => {
  it('works with sounds of the same duration', () => {
    const sound0 = funcs.make_sound(_t => 1, 10);
    const sound1 = funcs.make_sound(_t => 0, 10);

    const newSound = funcs.simultaneously([sound0, [sound1, null]]);
    const points = evaluateSound(newSound);

    expect(points.length).toEqual(10);

    for (const p of points) {
      expect(p).toEqual(0.5);
    }
  });

  it('works with sounds of different durations', () => {
    const sound0 = funcs.make_sound(_t => 1, 10);
    const sound1 = funcs.make_sound(_t => 2, 5);

    const newSound = funcs.simultaneously([sound0, [sound1, null]]);
    const points = evaluateSound(newSound);

    expect(points.length).toEqual(10);

    for (let i = 0; i < 5; i++) {
      expect(points[i]).toEqual(1.5);
    }

    for (let i = 5; i < 10; i++) {
      expect(points[i]).toEqual(0.5);
    }
  });
});

describe(funcs.consecutively, () => {
  it('works', () => {
    const sound0 = funcs.make_sound(_t => 1, 2);
    const sound1 = funcs.make_sound(_t => 2, 1);

    const newSound = funcs.consecutively([sound0, [sound1, null]]);
    const points = evaluateSound(newSound);

    expect(points.length).toEqual(3);
    for (let i = 0; i < 2; i++) {
      expect(points[i]).toEqual(1);
    }

    expect(points[2]).toEqual(2);
  });
});

describe('Sound transformers', () => {
  describe(funcs.phase_mod, () => {
    it('throws when given not a sound', () => {
      expect(() => funcs.phase_mod(0, 1, 1)(0 as any)).toThrowError('SoundTransformer: Expected Sound, got 0');
    });

    test('returned transformer toReplString representation', () => {
      expect(stringify(funcs.phase_mod(0, 1, 1))).toEqual('<SoundTransformer>');
    });
  });
});
