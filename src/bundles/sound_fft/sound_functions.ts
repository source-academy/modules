import {
  head,
  tail,
  pair,
  is_pair
} from 'js-slang/dist/stdlib/list';
import { type Sound, type Wave } from '../sound/types';

export function is_sound(x: any): x is Sound {
  return (
    is_pair(x)
        && typeof get_wave(x) === 'function'
        && typeof get_duration(x) === 'number'
  );
}

/**
 * Makes a Sound with given wave function and duration.
 * The wave function is a function: number -> number
 * that takes in a non-negative input time and returns an amplitude
 * between -1 and 1.
 *
 * @param wave wave function of the Sound
 * @param duration duration of the Sound
 * @return with wave as wave function and duration as duration
 * @example const s = make_sound(t => Math_sin(2 * Math_PI * 440 * t), 5);
 */
export function make_sound(wave: Wave, duration: number): Sound {
  if (duration < 0) {
    throw new Error('Sound duration must be greater than or equal to 0');
  }

  return pair((t: number) => (t >= duration ? 0 : wave(t)), duration);
}

/**
 * Accesses the wave function of a given Sound.
 *
 * @param sound given Sound
 * @return the wave function of the Sound
 * @example get_wave(make_sound(t => Math_sin(2 * Math_PI * 440 * t), 5)); // Returns t => Math_sin(2 * Math_PI * 440 * t)
 */
export function get_wave(sound: Sound): Wave {
  return head(sound);
}

/**
 * Accesses the duration of a given Sound.
 *
 * @param sound given Sound
 * @return the duration of the Sound
 * @example get_duration(make_sound(t => Math_sin(2 * Math_PI * 440 * t), 5)); // Returns 5
 */
export function get_duration(sound: Sound): number {
  return tail(sound);
}
