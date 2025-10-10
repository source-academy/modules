import { head, tail, type List } from 'js-slang/dist/stdlib/list';
import { describe, expect, test } from 'vitest';
import { letter_name_to_midi_note, midi_note_to_letter_name } from '..';
import { major_scale, minor_scale } from '../scales';
import { Accidental, type Note, type NoteWithOctave } from '../types';
import { noteToValues } from '../utils';

function list_to_array(list: List) {
  const output: number[] = [];
  while (list !== null) {
    output.push(head(list));
    list = tail(list);
  }

  return output;
}

describe('scales', () => {
  test('major_scale', () => {
    const c0 = letter_name_to_midi_note('C0');
    const scale = major_scale(c0);
    expect(list_to_array(scale)).toMatchObject([12, 14, 16, 17, 19, 21, 23, 24]);
  });

  test('minor_scale', () => {
    const a0 = letter_name_to_midi_note('A0');
    const scale = minor_scale(a0);
    expect(list_to_array(scale)).toMatchObject([21, 23, 24, 26, 28, 29, 31, 33]);
  });
});

describe(midi_note_to_letter_name, () => {
  describe('Test with sharps', () => {
    test.each([
      [12, 'C0'],
      [13, 'C#0'],
      [36, 'C2'],
      [69, 'A4'],
    ] as [number, NoteWithOctave][])('%i should equal %s', (note, noteName) => expect(midi_note_to_letter_name(note, 'sharp')).toEqual(noteName));
  });

  describe('Test with flats', () => {
    test.each([
      [12, 'C0'],
      [13, 'Db0'],
      [36, 'C2'],
      [69, 'A4'],
    ] as [number, NoteWithOctave][])('%i should equal %s', (note, noteName) => expect(midi_note_to_letter_name(note, 'flat')).toEqual(noteName));
  });
});

describe(noteToValues, () => {
  test.each([
    ['C0', 'C', Accidental.NATURAL, 0],
    ['C3', 'C', Accidental.NATURAL, 3],
    ['F#12', 'F', Accidental.SHARP, 12],
    ['Ab9', 'A', Accidental.FLAT, 9],
    ['Bb4', 'B', Accidental.FLAT, 4],
    // Leaving out octave should set it to 4 automatically
    ['a', 'A', Accidental.NATURAL, 4]
  ] as [NoteWithOctave, Note, Accidental, number][])('%s', (note, expectedNote, expectedAccidental, expectedOctave) => {
    const [actualNote, actualAccidental, actualOctave] = noteToValues(note);
    expect(actualNote).toEqual(expectedNote);
    expect(actualAccidental).toEqual(expectedAccidental);
    expect(actualOctave).toEqual(expectedOctave);
  });

  test('Invalid note should throw an error', () => {
    expect(() => noteToValues('Fb9' as any)).toThrowError('noteToValues: Invalid Note with Octave: Fb9');
  });
});
