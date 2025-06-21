/**
 * Bundle for manipulating MIDI notes
 *
 * @module MIDI
 * @author Lee Yi
 */

import { Accidental, type MIDINote, type Note, type NoteName, type NoteWithOctave } from './types';

function noteToValues(note: NoteWithOctave, func_name: string = noteToValues.name) {
  const match = /([A-G])([#♮b]?)(\d*)/.exec(note.toUpperCase());
  if (match === null) throw new Error(`${func_name}: Invalid Note with Octave: ${note}`);

  const [, noteName, accidental, octaveStr] = match;

  switch (accidental) {
    case Accidental.SHARP: {
      if (noteName === 'B' || noteName === 'E') {
        throw new Error(`${func_name}: Invalid Note with Octave: ${note}`);
      }

      break;
    }
    case Accidental.FLAT: {
      if (noteName === 'F' || noteName === 'C') {
        throw new Error(`${func_name}: Invalid Note with Octave: ${note}`);
      }
      break;
    }
  }
  const octave = octaveStr === '' ? 4 : parseInt(octaveStr);

  return [
    noteName,
    accidental !== '' ? accidental : Accidental.NATURAL,
    octave
  ] as [NoteName, Accidental, number];
}

/**
 * Converts a letter name to its corresponding MIDI note.
 * The letter name is represented in standard pitch notation.
 * Examples are "A5", "Db3", "C#7".
 * Refer to <a href="https://i.imgur.com/qGQgmYr.png">this mapping from
 * letter name to midi notes.
 *
 * @param letter_name given letter name
 * @return the corresponding midi note
 * @example letter_name_to_midi_note("C4"); // Returns 60
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

function midiNoteToNoteName(midiNote: MIDINote, accidental: 'flat' | 'sharp'): Note {
  switch (midiNote % 12) {
    case 0:
      return 'C';
    case 1:
      return accidental === 'sharp' ? 'C#' : 'Db';
    case 2:
      return 'D';
    case 3:
      return accidental === 'sharp' ? 'D#' : 'Eb';
    case 4:
      return 'E';
    case 5:
      return 'F';
    case 6:
      return accidental === 'sharp' ? 'F#' : 'Gb';
    case 7:
      return 'G';
    case 8:
      return accidental === 'sharp' ? 'G#' : 'Ab';
    case 9:
      return 'A';
    case 10:
      return accidental === 'sharp' ? 'A#' : 'Bb';
    case 11:
      return 'B';
    default:
      throw new Error(`Invalid MIDI note value ${midiNote}`);
  }
}

/**
 * Convert a MIDI note into its letter representation
 * @param midiNote Note to convert
 * @param accidental Whether to return the letter as with a sharp or with a flat
 * @function
 */
export function midi_note_to_letter_name(midiNote: MIDINote, accidental: 'flat' | 'sharp'): NoteWithOctave {
  const octave = Math.floor(midiNote / 12);
  const note = midiNoteToNoteName(midiNote, accidental);
  return `${note}${octave}`;
}

/**
 * Converts a MIDI note to its corresponding frequency.
 *
 * @param note given MIDI note
 * @return the frequency of the MIDI note
 * @example midi_note_to_frequency(69); // Returns 440
 * @function
 */
export function midi_note_to_frequency(note: MIDINote): number {
  // A4 = 440Hz = midi note 69
  return 440 * 2 ** ((note - 69) / 12);
}

/**
 * Converts a letter name to its corresponding frequency.
 *
 * @param letter_name given letter name
 * @return the corresponding frequency
 * @example letter_name_to_frequency("A4"); // Returns 440
 */
export function letter_name_to_frequency(note: NoteWithOctave): number {
  return midi_note_to_frequency(letter_name_to_midi_note(note));
}
