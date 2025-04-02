import {
  head,
  tail,
  is_pair
} from 'js-slang/dist/stdlib/list';
import { type Sound, type Wave } from '../sound/types';
import { type FrequencySample } from '../sound_fft/types';
export function is_sound(x: any): x is Sound {
  return (
    is_pair(x)
        && typeof get_wave(x) === 'function'
        && typeof get_duration(x) === 'number'
  );
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
/**
 * Accesses the magnitude of a given frequency sample.
 *
 * @param frequency_sample given frequency sample
 * @return the magnitude of the frequency sample
 */
export function get_magnitude(frequency_sample: FrequencySample): number {
  return head(frequency_sample);
}
