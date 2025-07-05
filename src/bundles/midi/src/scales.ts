import { pair, type List } from 'js-slang/dist/stdlib/list';
import type { MIDINote } from './types';

const major_intervals = [2, 2, 1, 2, 2, 2, 1];

/**
 * There are 7 modes of the major scale we are just made by shuffling the major scale's
 * intervals around, so we can reuse this function.
 */
function make_from_major_scale(root: MIDINote, mode: number) {
  let output: List = pair(root + 12, null);
  let note = root + 12;

  for (let i = major_intervals.length - 1; i >= 0; i--) {
    const interval = major_intervals[(mode - 1 + i) % major_intervals.length];
    note -= interval;
    output = pair(note, output);
  }

  return output;
}

/**
 * Generate a list of MIDI notes representing the major scale
 * for the given key (including the octave)
 */
export function major_scale(key: MIDINote) {
  return make_from_major_scale(key, 1);
}

/**
 * Alias for the {@link major_scale|major_scale} function
 * @function
 */
export const ionian_scale = major_scale;

/**
 * Generate a list of MIDI notes representing the dorian scale
 * for the given key (including the octave)
 */
export function dorian_scale(key: MIDINote) {
  return make_from_major_scale(key, 2);
}

/**
 * Generate a list of MIDI notes representing the phrygian scale
 * for the given key (including the octave)
 */
export function phrygian_scale(key: MIDINote) {
  return make_from_major_scale(key, 3);
}

/**
 * Generate a list of MIDI notes representing the lydian scale
 * for the given key (including the octave)
 */
export function lydian_scale(key: MIDINote) {
  return make_from_major_scale(key, 4);
}

/**
 * Generate a list of MIDI notes representing the mixolydian scale
 * for the given key (including the octave)
 */
export function mixolydian_scale(key: MIDINote) {
  return make_from_major_scale(key, 5);
}

/**
 * Generate a list of MIDI notes representing the minor scale
 * for the given key (including the octave)
 */
export function minor_scale(key: MIDINote) {
  return make_from_major_scale(key, 6);
}

/**
 * Alias for the {@link minor_scale|minor_scale} function
 * @function
 */
export const aeolian_scale = minor_scale;

/**
 * Generate a list of MIDI notes representing the locrian scale
 * for the given key (including the octave)
 */
export function locrian_scale(key: MIDINote) {
  return make_from_major_scale(key, 7);
}
