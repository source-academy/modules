/**
 * Bundle that provides functions for manipulating MIDI notes, converting between letter names
 * and frequencies.
 *
 * @module MIDI
 * @author leeyi45
 */

import { InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { Accidental, type MIDINote, type Note, type NoteWithOctave } from './types';
import { midiNoteToNoteName, noteToValues, parseNoteWithOctave } from './utils';

/**
 * Returns a boolean value indicating whether the given value is a {@link NoteWithOctave|note name with octave}.
 */
export function is_note_with_octave(value: unknown): value is NoteWithOctave {
  const res = parseNoteWithOctave(value);
  return res !== null;
}

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
 * letter_name_to_midi_note('C4'); // Returns 60
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
 * Convert a {@link MIDINote|MIDI note} into its {@link NoteWithOctave|letter representation}
 *
 * @param midiNote Note to convert
 * @param accidental Whether to return the letter as with a sharp or with a flat
 * @function
 * @example
 * ```
 * midi_note_to_letter_name(61, SHARP); // Returns "C#4"
 * midi_note_to_letter_name(61, FLAT);  // Returns "Db4"
 *
 * // Notes without accidentals return the same letter name
 * // regardless of whether SHARP or FLAT is passed in
 * midi_note_to_letter_name(60, FLAT);  // Returns "C4"
 * midi_note_to_letter_name(60, SHARP); // Returns "C4"
 * ```
 */
export function midi_note_to_letter_name(midiNote: MIDINote, accidental: Accidental.FLAT | Accidental.SHARP): NoteWithOctave {
  const octave = Math.floor(midiNote / 12) - 1;
  const note = midiNoteToNoteName(midiNote, accidental, midi_note_to_letter_name.name);
  return `${note}${octave}`;
}

/**
 * Converts a {@link MIDINote|MIDI note} to its corresponding frequency.
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
 * Converts a {@link NoteWithOctave|note name} to its corresponding frequency.
 *
 * @param note given letter name
 * @returns the corresponding frequency (in Hz)
 * @example letter_name_to_frequency("A4"); // Returns 440
 */
export function letter_name_to_frequency(note: NoteWithOctave): number {
  return midi_note_to_frequency(letter_name_to_midi_note(note));
}

/**
 * Takes the given {@link Note|Note} and adds the octave number to it.
 * @example
 * ```
 * add_octave_to_note('C', 4); // Returns "C4"
 * ```
 */
export function add_octave_to_note(note: Note, octave: number): NoteWithOctave {
  if (!Number.isInteger(octave) || octave < 0) {
    throw new Error(`${add_octave_to_note.name}: Octave must be an integer greater than 0`);
  }

  return `${note}${octave}`;
}

/**
 * Gets the octave number from a given {@link NoteWithOctave|note name with octave}.
 */
export function get_octave(note: NoteWithOctave): number {
  const [,, octave] = noteToValues(note, get_octave.name);
  return octave;
}

/**
 * Gets the letter name from a given {@link NoteWithOctave|note name with octave} (without the accidental).
 * @example
 * ```
 * get_note_name('C#4'); // Returns "C"
 * get_note_name('Eb3'); // Returns "E"
 * ```
 */
export function get_note_name(note: NoteWithOctave): Note {
  const [noteName] = noteToValues(note, get_note_name.name);
  return noteName;
}

/**
 * Gets the accidental from a given {@link NoteWithOctave|note name with octave}.
 */
export function get_accidental(note: NoteWithOctave): Accidental {
  const [, accidental] = noteToValues(note, get_accidental.name);
  return accidental;
}

/**
 * Converts the key signature to the corresponding key
 * @example
 * ```
 * key_signature_to_keys(SHARP, 2); // Returns "D", since the key of D has 2 sharps
 * key_signature_to_keys(FLAT, 3); // Returns "Eb", since the key of Eb has 3 flats
 * ```
 */
export function key_signature_to_keys(accidental: Accidental.FLAT | Accidental.SHARP, numAccidentals: number): Note {
  if (!Number.isInteger(numAccidentals) || numAccidentals < 0 || numAccidentals > 6) {
    throw new Error(`${key_signature_to_keys.name}: Number of accidentals must be a number between 0 and 6`);
  }

  switch (accidental) {
    case Accidental.SHARP: {
      const keys: Note[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
      return keys[numAccidentals];
    }
    case Accidental.FLAT: {
      const keys: Note[] = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
      return keys[numAccidentals];
    }
    default:
      throw new InvalidParameterTypeError('accidental', accidental, key_signature_to_keys.name);
  }
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
