// MIDI conversion functions

import { type List, pair } from 'js-slang/dist/stdlib/list';

const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const FLAT_NOTES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'] as const;

type NoteName = (typeof SHARP_NOTES | typeof FLAT_NOTES)[number];
type NoteModifier = '#' | 'b' | '♭';

const MAJOR_SCALE = [2, 2, 1, 2, 2, 2, 1];
const NOTE_NAME_REGEX = /([a-gA-G])([#b♭])?(\d*)/;

function parseNoteWithOctave(note: string): {
  note: NoteName,
  sharp_flat?: NoteModifier,
  octave: number,
} {
  const matches = NOTE_NAME_REGEX.exec(note);
  if (!matches) throw new Error(`Invalid note: ${note}`);

  const noteName = matches[1].toUpperCase() as NoteName;
  let sharp_flat: NoteModifier | undefined;
  let octave = 0;

  if (matches.length === 3) {
    if (!Number.isInteger(matches[2])) sharp_flat = matches[2] as NoteModifier;
    else octave = parseInt(matches[2]);
  } else if (matches.length === 4) {
    sharp_flat = matches[2] as NoteModifier;
    octave = parseInt(matches[3]);
  }

  return {
    note: noteName,
    sharp_flat,
    octave,
  };
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
 */
export function letter_name_to_midi_note(note: string): number {
  const { note: n, sharp_flat, octave } = parseNoteWithOctave(note);
  let res = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  }[n] + 12;

  if (sharp_flat) {
    if (sharp_flat === '#') res += 1;
    else res -= 1;
  }

  return res + octave * 12;
}

/**
 * Convert a MIDI note to its corressponding note name
 * @param midi_note Given MIDI note
 * @param sharp_or_flat Whether to return note value as a sharp or as a flat
 * @returns Note name
 */
export function midi_note_to_letter_name(midi_note: number, sharp_or_flat: 'sharp' | 'flat'): string {
  if (!Number.isInteger(midi_note) || midi_note < 12) throw new Error('midi_note_to_letter_name expects a positive integer greater than 12');

  const loweredSharpOrFlat = sharp_or_flat.toLowerCase() as 'sharp' | 'flat';
  if (loweredSharpOrFlat !== 'flat' && loweredSharpOrFlat !== 'sharp') throw new Error(`Expected either 'flat' or 'sharp', got ${sharp_or_flat}`);

  // C0 is midi note 12
  // Each octave is 12 notes
  const noteNum = midi_note % 12;
  const octave = (midi_note - noteNum) / 12 - 1;

  return `${(loweredSharpOrFlat === 'sharp' ? SHARP_NOTES : FLAT_NOTES)[noteNum]}${octave}`;
}

/**
 * Converts a MIDI note to its corresponding frequency.
 *
 * @param midi_note given MIDI note
 * @return the frequency of the MIDI note
 * @example midi_note_to_frequency(69); // Returns 440
 */
export function midi_note_to_frequency(midi_note: number): number {
  // A4 = 440Hz = midi note 69
  return 440 * 2 ** ((midi_note - 69) / 12);
}

/**
 * Converts a letter name to its corresponding frequency.
 *
 * @param letter_name given letter name
 * @return the corresponding frequency
 * @example letter_name_to_frequency("A4"); // Returns 440
 */
export function letter_name_to_frequency(note: string): number {
  return midi_note_to_frequency(letter_name_to_midi_note(note));
}

/**
 * Get the corresponding MIDI notes for the major scale in the given key (including the octave)
 * @param key Note name for the key of the scale
 * @returns List of MIDI notes
 */
export function major_scale(key: string): List {
  const startNote = letter_name_to_midi_note(key) + 12;

  function toList(midiNote: number, i: number, lst: List) {
    if (i === -1) return lst;
    const newNote = midiNote - MAJOR_SCALE[i];
    return toList(newNote, i - 1, pair(newNote, lst));
  }

  return toList(startNote, MAJOR_SCALE.length - 1, pair(startNote, null));
}
