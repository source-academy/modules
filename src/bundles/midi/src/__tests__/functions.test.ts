import { list_to_vector } from 'js-slang/dist/stdlib/list';
import { describe, expect, test } from 'vitest';
import * as funcs from '../functions';
import { Accidental, type Note, type NoteWithOctave } from '../types';
import { noteToValues } from '../utils';

describe('scales', () => {
  test('major_scale', () => {
    const c0 = funcs.letter_name_to_midi_note('C0');
    const scale = funcs.major_scale(c0);
    expect(list_to_vector(scale)).toMatchObject([12, 14, 16, 17, 19, 21, 23, 24]);
  });

  test('minor_scale', () => {
    const a0 = funcs.letter_name_to_midi_note('A0');
    const scale = funcs.minor_scale(a0);
    expect(list_to_vector(scale)).toMatchObject([21, 23, 24, 26, 28, 29, 31, 33]);
  });
});

describe(funcs.midi_note_to_letter_name, () => {
  describe('Test with sharps', () => {
    test.each([
      [12, 'C0'],
      [13, 'C#0'],
      [36, 'C2'],
      [69, 'A4'],
    ] as [number, NoteWithOctave][])('%i should equal %s', (note, noteName) => expect(funcs.midi_note_to_letter_name(note, Accidental.SHARP)).toEqual(noteName));
  });

  describe('Test with flats', () => {
    test.each([
      [12, 'C0'],
      [13, 'Db0'],
      [36, 'C2'],
      [69, 'A4'],
    ] as [number, NoteWithOctave][])('%i should equal %s', (note, noteName) => expect(funcs.midi_note_to_letter_name(note, Accidental.FLAT)).toEqual(noteName));
  });

  test('Invalid accidental should throw an error, not silently fall back to flat', () => {
    expect(() => funcs.midi_note_to_letter_name(13, Accidental.NATURAL)).toThrow(
      'midi_note_to_letter_name: Expected sharp or flat for accidental, got "♮".',
    );
    expect(() => funcs.midi_note_to_letter_name(13, 'banana' as any)).toThrow(
      'midi_note_to_letter_name: Expected sharp or flat for accidental, got "banana".',
    );
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
    const [actualNote, actualAccidental, actualOctave] = noteToValues(note, '');
    expect(actualNote).toEqual(expectedNote);
    expect(actualAccidental).toEqual(expectedAccidental);
    expect(actualOctave).toEqual(expectedOctave);
  });

  test('Invalid note should throw an error', () => {
    expect(() => noteToValues('Fb9' as any, 'noteToValues')).toThrow('noteToValues: Invalid Note with Octave: Fb9');
  });
});

describe(funcs.add_octave_to_note, () => {
  test('Valid note and octave', () => {
    expect(funcs.add_octave_to_note('C', 4)).toEqual('C4');
    expect(funcs.add_octave_to_note('F#', 0)).toEqual('F#0');
  });

  test('Invalid octave should throw an error', () => {
    expect(() => funcs.add_octave_to_note('C', -1)).toThrow('add_octave_to_note: Expected integer ≥ 0 for octave, got -1.');
    expect(() => funcs.add_octave_to_note('C', 2.5)).toThrow('add_octave_to_note: Expected integer ≥ 0 for octave, got 2.5.');
  });

  test('Invalid note should throw an error, not silently interpolate', () => {
    expect(() => funcs.add_octave_to_note('garbage', 4)).toThrow(
      'add_octave_to_note: Expected a note without an octave for note, got "garbage".',
    );
    expect(() => funcs.add_octave_to_note('C4', 4)).toThrow(
      'add_octave_to_note: Expected a note without an octave for note, got "C4".',
    );
  });

  test('Rejects accidentals that do not exist for that note name', () => {
    expect(() => funcs.add_octave_to_note('B#', 4)).toThrow(
      'add_octave_to_note: Expected a note without an octave for note, got "B#".',
    );
    expect(() => funcs.add_octave_to_note('E#', 4)).toThrow(
      'add_octave_to_note: Expected a note without an octave for note, got "E#".',
    );
    expect(() => funcs.add_octave_to_note('Cb', 4)).toThrow(
      'add_octave_to_note: Expected a note without an octave for note, got "Cb".',
    );
    expect(() => funcs.add_octave_to_note('Fb', 4)).toThrow(
      'add_octave_to_note: Expected a note without an octave for note, got "Fb".',
    );
  });

  test('Normalizes lowercase note names', () => {
    expect(funcs.add_octave_to_note('c', 4)).toEqual('C4');
    expect(funcs.add_octave_to_note('f#', 0)).toEqual('F#0');
  });
});

describe(funcs.get_octave, () => {
  test('Valid note with octave', () => {
    expect(funcs.get_octave('C4')).toEqual(4);
    expect(funcs.get_octave('F#0')).toEqual(0);

    // If octave is left out, it should default to 4
    expect(funcs.get_octave('F')).toEqual(4);
  });

  test('Invalid note should throw an error', () => {
    expect(() => funcs.get_octave('Fb9' as any)).toThrow('get_octave: Invalid Note with Octave: Fb9');
  });
});

describe(funcs.key_signature_to_key, () => {
  test('Valid key signatures', () => {
    expect(funcs.key_signature_to_key(Accidental.SHARP, 0)).toEqual('C');
    expect(funcs.key_signature_to_key(Accidental.SHARP, 2)).toEqual('D');
    expect(funcs.key_signature_to_key(Accidental.FLAT, 3)).toEqual('Eb');
  });

  test('Invalid number of accidentals should throw an error', () => {
    expect(() => funcs.key_signature_to_key(Accidental.SHARP, -1)).toThrow('key_signature_to_key: Expected integer ∈ [0, 6] for numAccidentals, got -1.');
    expect(() => funcs.key_signature_to_key(Accidental.SHARP, 7)).toThrow('key_signature_to_key: Expected integer ∈ [0, 6] for numAccidentals, got 7.');
    expect(() => funcs.key_signature_to_key(Accidental.SHARP, 2.5)).toThrow('key_signature_to_key: Expected integer ∈ [0, 6] for numAccidentals, got 2.5.');
  });

  test('Invalid accidental should throw an error', () => {
    expect(() => funcs.key_signature_to_key('invalid' as any, 2)).toThrow('key_signature_to_key: Expected sharp or flat for accidental, got "invalid".');
  });
});

describe(funcs.is_note_with_octave, () => {
  test('Valid NoteWithOctaves', () => {
    expect(funcs.is_note_with_octave('C4')).toBe(true);
    expect(funcs.is_note_with_octave('F#0')).toBe(true);
    expect(funcs.is_note_with_octave('Ab9')).toBe(true);
    expect(funcs.is_note_with_octave('C')).toBe(true);
    expect(funcs.is_note_with_octave('F#')).toBe(true);
  });

  test('Invalid NoteWithOctaves', () => {
    expect(funcs.is_note_with_octave('Invalid')).toBe(false);
    expect(funcs.is_note_with_octave(123)).toBe(false);
  });
});
