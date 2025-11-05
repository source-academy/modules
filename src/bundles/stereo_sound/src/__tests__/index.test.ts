import { describe, expect, it } from 'vitest';
import * as funcs from '../functions';
import type { Sound } from '../types';

function evaluateSound(sound: Sound) {
  const leftWave = funcs.get_left_wave(sound);
  const rightWave = funcs.get_right_wave(sound);
  const duration = funcs.get_duration(sound);

  const output: [number, number][] = [];
  for (let i = 0; i < duration; i++) {
    const left = leftWave(i);
    const right = rightWave(i);
    output.push([left, right]);
  }

  return output;
}

describe(funcs.pan, () => {
  it('should mute the left channel when panned all the way right', () => {
    const sound = funcs.make_stereo_sound(
      () => 1,
      () => 1,
      10
    );

    const newSound = funcs.pan(1)(sound);
    const points = evaluateSound(newSound);

    for (const [left, right] of points) {
      expect(left).toEqual(0);
      expect(right).toEqual(1);
    }
  });

  it('should mute the right channel when panned all the way left', () => {
    const sound = funcs.make_stereo_sound(
      () => 1,
      () => 1,
      10
    );

    const newSound = funcs.pan(-1)(sound);
    const points = evaluateSound(newSound);

    for (const [left, right] of points) {
      expect(left).toEqual(1);
      expect(right).toEqual(0);
    }
  });
});

describe(funcs.squash, () => {
  it('works', () => {
    const sound = funcs.make_stereo_sound(
      () => 1,
      () => 0,
      10
    );

    const newSound = funcs.squash(sound);
    const points = evaluateSound(newSound);
    for (const [left, right] of points) {
      expect(left).toEqual(0.5);
      expect(right).toEqual(0.5);
    }
  });
});

describe(funcs.simultaneously, () => {
  it('works with sounds of the same duration', () => {
    const leftSound = funcs.make_stereo_sound(() => 1, () => 0, 10);
    const rightSound = funcs.make_stereo_sound(() => 0, () => 2, 10);

    const newSound = funcs.simultaneously([leftSound, [rightSound, null]]);
    const points = evaluateSound(newSound);

    expect(points.length).toEqual(10);

    for (const [left, right] of points) {
      expect(left).toEqual(0.5);
      expect(right).toEqual(1);
    }
  });

  it('works with sounds of different durations', () => {
    const leftSound = funcs.make_stereo_sound(() => 1, () => 0, 10);
    const rightSound = funcs.make_stereo_sound(() => 0, () => 2, 5);

    const newSound = funcs.simultaneously([leftSound, [rightSound, null]]);
    const points = evaluateSound(newSound);

    expect(points.length).toEqual(10);

    for (let i = 0; i < 5; i++) {
      const [left, right] = points[i];
      expect(left).toEqual(0.5);
      expect(right).toEqual(1);
    }

    for (let i = 5; i < 10; i++) {
      const [left, right] = points[i];
      expect(left).toEqual(0.5);
      expect(right).toEqual(0);
    }
  });
});

describe(funcs.consecutively, () => {
  it('works', () => {
    const leftSound = funcs.make_stereo_sound(() => 1, () => 0, 2);
    const rightSound = funcs.make_stereo_sound(() => 0, () => 2, 1);

    const newSound = funcs.consecutively([leftSound, [rightSound, null]]);
    const points = evaluateSound(newSound);

    expect(points.length).toEqual(3);
    for (let i = 0; i < 2; i++) {
      const [left, right] = points[i];
      expect(left).toEqual(1);
      expect(right).toEqual(0);
    }

    expect(points[2]).toEqual([0, 2]);
  });
});

describe(funcs.make_sound, () => {
  it('Should error gracefully when duration is negative', () => {
    expect(() => funcs.make_sound(() => 0, -1))
      .toThrow('make_sound: Sound duration must be greater than or equal to 0');
  });

  it('Should not error when duration is zero', () => {
    expect(() => funcs.make_sound(() => 0, 0)).not.toThrow();
  });

  it('Should error gracefully when wave is not a function', () => {
    expect(() => funcs.make_sound(true as any, 1))
      .toThrow('make_sound: wave must be a Wave, got true');
  });
});

describe(funcs.play, () => {
  it('Should error gracefully when duration is negative', () => {
    const sound: Sound = [[() => 0, () => 0], -1];
    expect(() => funcs.play(sound))
      .toThrow('play: duration of sound is negative');
  });

  it('Should not error when duration is zero', () => {
    const sound = funcs.make_sound(() => 0, 0);
    expect(() => funcs.play(sound)).not.toThrow();
  });

  it('Should throw error when given not a sound', () => {
    expect(() => funcs.play(0 as any)).toThrow('play is expecting sound, but encountered 0');
  });
});

describe(funcs.play_wave, () => {
  it('Should error gracefully when duration is negative', () => {
    expect(() => funcs.play_wave(() => 0, -1))
      .toThrow('play_wave: Sound duration must be greater than or equal to 0');
  });

  it('Should error gracefully when duration is not a number', () => {
    expect(() => funcs.play_wave(() => 0, true as any))
      .toThrow('play_wave expects a number for duration, got true');
  });

  it('Should error gracefully when wave is not a function', () => {
    expect(() => funcs.play_wave(true as any, 0))
      .toThrow('play_wave: wave must be a Wave, got true');
  });
});

describe(funcs.play_in_tab, () => {
  it('Should error gracefully when duration is negative', () => {
    const sound: Sound = [[() => 0, () => 0], -1];
    expect(() => funcs.play_in_tab(sound))
      .toThrow('play_in_tab: duration of sound is negative');
  });

  it('Should not error when duration is zero', () => {
    const sound: Sound = [[() => 0, () => 0], 0];
    expect(() => funcs.play_in_tab(sound)).not.toThrow();
  });

  it('Should throw error when given not a sound', () => {
    expect(() => funcs.play_in_tab(0 as any)).toThrow('play_in_tab is expecting sound, but encountered 0');
  });
});
