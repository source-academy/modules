/**
 * Bundle that provides functions for manipulating MIDI notes, converting between letter names
 * and frequencies.
 *
 * @module MIDI
 * @author leeyi45
 */

import { Accidental, type MIDINote, type NoteWithOctave } from './types';
import { midiNoteToNoteName, noteToValues } from './utils';

/**
 * Converts a letter name to its corresponding MIDI note.
 * The letter name is represented in standard pitch notation.
 * Examples are "A5", "Db3", "C#7".
 * Refer to [this](https://i.imgur.com/qGQgmYr.png) mapping from
 * letter name to midi notes.
 *
 * @param note given letter name
 * @returns the corresponding midi note
 * @example
 * ```
 * letter_name_to_midi_note("C4"); // Returns 60
 * ```
 * @function
 */
export function letter_name_to_midi_note(note: NoteWithOctave): MIDINote {
  const [noteName, accidental, octave] = noteToValues(note, letter_name_to_midi_note.name);

  let res = 12; // C0 is midi note 12
  switch (noteName) {
    case 'C':
      break;
    case 'D':
      res += 2;
      break;

    case 'E':
      res += 4;
      break;

    case 'F':
      res += 5;
      break;

    case 'G':
      res += 7;
      break;

    case 'A':
      res += 9;
      break;

    case 'B':
      res += 11;
      break;

    default:
      break;
  }

  switch (accidental) {
    case Accidental.FLAT: {
      res -= 1;
      break;
    }
    case Accidental.SHARP: {
      res += 1;
      break;
    }
    case Accidental.NATURAL:
      break;
  }

  return res + 12 * octave;
}

/**
 * Convert a MIDI note into its letter representation
 * @param midiNote Note to convert
 * @param accidental Whether to return the letter as with a sharp or with a flat
 * @function
 */
export function midi_note_to_letter_name(midiNote: MIDINote, accidental: 'flat' | 'sharp'): NoteWithOctave {
  const octave = Math.floor(midiNote / 12) - 1;
  const note = midiNoteToNoteName(midiNote, accidental, midi_note_to_letter_name.name);
  return `${note}${octave}`;
}

/**
 * Converts a MIDI note to its corresponding frequency.
 *
 * @param note given MIDI note
 * @returns the frequency of the MIDI note
 * @function
 * @example midi_note_to_frequency(69); // Returns 440
 */
export function midi_note_to_frequency(note: MIDINote): number {
  // A4 = 440Hz = midi note 69
  return 440 * 2 ** ((note - 69) / 12);
}

/**
 * Converts a letter name to its corresponding frequency.
 *
 * @param note given letter name
 * @returns the corresponding frequency
 * @example letter_name_to_frequency("A4"); // Returns 440
 */
export function letter_name_to_frequency(note: NoteWithOctave): number {
  return midi_note_to_frequency(letter_name_to_midi_note(note));
}

export * from './scales';

/**
 * String representing the sharp symbol '#'
 */
export const SHARP = Accidental.SHARP;

/**
 * String representing the flat symbol 'b'
 */
export const FLAT = Accidental.FLAT;

/**
 * String representing the natural symbol '♮'
 */
export const NATURAL = Accidental.NATURAL;
