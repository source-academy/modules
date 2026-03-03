import { Accidental, type MIDINote, type Note, type NoteName, type NoteWithOctave } from './types';

export function parseNoteWithOctave(note: NoteWithOctave): [NoteName, Accidental, number] | null;
export function parseNoteWithOctave(note: unknown): [NoteName, Accidental, number] | null;
export function parseNoteWithOctave(note: unknown): [NoteName, Accidental, number] | null {
  if (typeof note !== 'string') return null;

  const match = /^([A-Ga-g])([#♮b]?)(\d*)$/.exec(note);
  if (match === null) return null;

  const [, noteName, accidental, octaveStr] = match;

  switch (accidental) {
    case Accidental.SHARP: {
      if (noteName === 'B' || noteName === 'E') return null;
      break;
    }
    case Accidental.FLAT: {
      if (noteName === 'F' || noteName === 'C') return null;
      break;
    }
  }
  const octave = octaveStr === '' ? 4 : parseInt(octaveStr);

  return [
    noteName.toUpperCase(),
    accidental !== '' ? accidental : Accidental.NATURAL,
    octave
  ] as [NoteName, Accidental, number];
}

export function noteToValues(note: NoteWithOctave, func_name: string): [NoteName, Accidental, number] {
  const res = parseNoteWithOctave(note);
  if (res === null) {
    throw new Error(`${func_name}: Invalid Note with Octave: ${note}`);
  }
  return res;
}

export function midiNoteToNoteName(midiNote: MIDINote, accidental: Accidental.FLAT | Accidental.SHARP, func_name: string): Note {
  switch (midiNote % 12) {
    case 0:
      return 'C';
    case 1:
      return accidental === Accidental.SHARP ? `C${Accidental.SHARP}` : `D${Accidental.FLAT}`;
    case 2:
      return 'D';
    case 3:
      return accidental === Accidental.SHARP ? `D${Accidental.SHARP}` : `E${Accidental.FLAT}`;
    case 4:
      return 'E';
    case 5:
      return 'F';
    case 6:
      return accidental === Accidental.SHARP ? `F${Accidental.SHARP}` : `G${Accidental.FLAT}`;
    case 7:
      return 'G';
    case 8:
      return accidental === Accidental.SHARP ? `G${Accidental.SHARP}` : `A${Accidental.FLAT}`;
    case 9:
      return 'A';
    case 10:
      return accidental === Accidental.SHARP ? `A${Accidental.SHARP}` : `B${Accidental.FLAT}`;
    case 11:
      return 'B';
    default:
      throw new Error(`${func_name}: Invalid MIDI note value ${midiNote}`);
  }
}
