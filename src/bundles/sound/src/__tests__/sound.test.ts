/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it, test } from 'vitest';
import * as funcs from '../functions';
import type { Sound } from '../types';

describe(funcs.make_sound, () => {
  test('Should error gracefully when duration is negative', () => {
    expect(() => funcs.make_sound(() => 0, -1))
      .toThrow('Sound duration must be greater than or equal to 0');
  });

  test('Should not error when duration is zero', () => {
    expect(() => funcs.make_sound(() => 0, 0)).not.toThrow();
  });
});

describe(funcs.play, () => {
  test('Should error gracefully when duration is negative', () => {
    const sound = [(t) => 0, -1];
    expect(() => funcs.play(sound as any))
      .toThrow('play: duration of sound is negative');
  });

  test('Should not error when duration is zero', () => {
    const sound = funcs.make_sound((t) => 0, 0);
    expect(() => funcs.play(sound)).not.toThrow();
  });
});

describe(funcs.play_in_tab, () => {
  test('Should error gracefully when duration is negative', () => {
    const sound = [(t) => 0, -1];
    expect(() => funcs.play_in_tab(sound as any))
      .toThrow('play_in_tab: duration of sound is negative');
  });

  test('Should not error when duration is zero', () => {
    const sound = funcs.make_sound((t) => 0, 0);
    expect(() => funcs.play_in_tab(sound)).not.toThrow();
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
    const sound0 = funcs.make_sound(() => 1, 10);
    const sound1 = funcs.make_sound(() => 0, 10);

    const newSound = funcs.simultaneously([sound0, [sound1, null]]);
    const points = evaluateSound(newSound);

    expect(points.length).toEqual(10);

    for (const p of points) {
      expect(p).toEqual(0.5);
    }
  });

  it('works with sounds of different durations', () => {
    const sound0 = funcs.make_sound(() => 1, 10);
    const sound1 = funcs.make_sound(() => 2, 5);

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
    const sound0 = funcs.make_sound(() => 1, 2);
    const sound1 = funcs.make_sound(() => 2, 1);

    const newSound = funcs.consecutively([sound0, [sound1, null]]);
    const points = evaluateSound(newSound);

    expect(points.length).toEqual(3);
    for (let i = 0; i < 2; i++) {
      expect(points[i]).toEqual(1);
    }

    expect(points[2]).toEqual(2);
  });
});
