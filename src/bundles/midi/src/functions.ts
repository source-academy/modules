/**
 * Pure, evaluator-free implementations of the MIDI bundle's functions. Kept separate from the
 * Conductor-facing `index.ts` plugin because other bundles (`sound`, `stereo_sound`) import these
 * directly as plain TypeScript, not through Conductor's TypedValue/IDataHandler boundary.
 *
 * @module MIDI
 * @author leeyi45
 */

import { EvaluatorParameterTypeError, assertNumberWithinRange } from '@sourceacademy/conductor/common';
import { Accidental, type MIDINote, type Note, type NoteWithOctave } from './types';
import { midiNoteToNoteName, noteToValues, parseNoteWithOctave } from './utils';

/**
 * Returns a boolean value indicating whether the given value is a {@link NoteWithOctave|note name with octave}.
 * @function
 */
export function is_note_with_octave(value: unknown): value is NoteWithOctave {
  return parseNoteWithOctave(value) !== null;
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
export function letter_name_to_midi_note(note: string): MIDINote {
  const [noteName, accidental, octave] = noteToValues(note, 'letter_name_to_midi_note');

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
export function midi_note_to_letter_name(midiNote: MIDINote, accidental: string): NoteWithOctave {
  const octave = Math.floor(midiNote / 12) - 1;
  const note = midiNoteToNoteName(midiNote, accidental, 'midi_note_to_letter_name');
  return `${note}${octave}`;
}

/**
 * Converts a {@link MIDINote|MIDI note} to its corresponding frequency.
 *
 * @param note given MIDI note
 * @returns the frequency of the MIDI note
 * @function
 * @example
 * ```
 * midi_note_to_frequency(69); // Returns 440
 * ```
 */
export function midi_note_to_frequency(note: MIDINote): number {
  assertNumberWithinRange(note, 'midi_note_to_frequency');
  // A4 = 440Hz = midi note 69
  return 440 * 2 ** ((note - 69) / 12);
}

/**
 * Converts a {@link NoteWithOctave|note name} to its corresponding frequency.
 *
 * @param note given letter name
 * @returns the corresponding frequency (in Hz)
 * @example
 * ```
 * letter_name_to_frequency('A4'); // Returns 440
 * ```
 */
export function letter_name_to_frequency(note: string): number {
  return midi_note_to_frequency(letter_name_to_midi_note(note));
}

/**
 * Takes the given {@link Note} and adds the octave number to it.
 * @function
 * @example
 * ```
 * add_octave_to_note('C', 4); // Returns "C4"
 * ```
 */
export function add_octave_to_note(note: string, octave: number): NoteWithOctave {
  assertNumberWithinRange(octave, 'add_octave_to_note', 0, undefined, true, 'octave');
  // A bare note only - no octave digits of its own (parseNoteWithOctave alone would happily
  // accept "C4" here too, taking the digits as an octave we'd then silently ignore).
  const match = /^([A-Ga-g])([#♮b]?)$/.exec(note);
  // Reuses parseNoteWithOctave as the single canonical validator, so this rejects exactly the
  // same spellings noteToValues/parseNoteWithOctave would (e.g. B#, E#, Cb, Fb - accidentals that
  // don't exist for those note names) instead of a separate, more permissive regex.
  if (match === null || parseNoteWithOctave(note) === null) {
    // EvaluatorParameterTypeError (Conductor's own error type) is the correct, student-facing
    // error here - the throw-runtime-error rule doesn't yet recognise it (only js-slang's
    // RuntimeSourceError), so there's no error class available that would actually satisfy it.
    // eslint-disable-next-line @sourceacademy/throw-runtime-error
    throw new EvaluatorParameterTypeError('add_octave_to_note', 'note', 'a note without an octave', note);
  }
  const [, noteName, accidental] = match;
  // Normalizes the note name's case; preserves the accidental exactly as given (including
  // whether the natural symbol was written at all - both are valid, equivalent spellings).
  return `${noteName.toUpperCase()}${accidental}${octave}` as NoteWithOctave;
}

/**
 * Gets the octave number from a given {@link NoteWithOctave|note name with octave}.
 * @function
 */
export function get_octave(note: string): number {
  const [, , octave] = noteToValues(note, 'get_octave');
  return octave;
}

/**
 * Gets the letter name from a given {@link NoteWithOctave|note name with octave} (without the accidental).
 * @function
 * @example
 * ```
 * get_note_name('C#4'); // Returns "C"
 * get_note_name('Eb3'); // Returns "E"
 * ```
 */
export function get_note_name(note: string): Note {
  const [noteName] = noteToValues(note, 'get_note_name');
  return noteName;
}

/**
 * Gets the accidental from a given {@link NoteWithOctave|note name with octave}.
 * @function
 */
export function get_accidental(note: string): Accidental {
  const [, accidental] = noteToValues(note, 'get_accidental');
  return accidental;
}

/**
 * Converts the key signature to the corresponding key
 * @function
 * @example
 * ```
 * key_signature_to_key(SHARP, 2); // Returns "D", since the key of D has 2 sharps
 * key_signature_to_key(FLAT, 3); // Returns "Eb", since the key of Eb has 3 flats
 * ```
 */
export function key_signature_to_key(accidental: string, numAccidentals: number): Note {
  assertNumberWithinRange(numAccidentals, 'key_signature_to_key', 0, 6, true, 'numAccidentals');

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
      // EvaluatorParameterTypeError is the correct, student-facing error here - the
      // throw-runtime-error rule doesn't yet recognise Conductor's own error types.
      // eslint-disable-next-line @sourceacademy/throw-runtime-error
      throw new EvaluatorParameterTypeError('key_signature_to_key', 'accidental', 'sharp or flat', accidental);
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
