import { Accidental, type MIDINote, type Note, type NoteName, type NoteWithOctave } from './types';

export function noteToValues(note: NoteWithOctave, func_name: string = noteToValues.name) {
  const match = /^([A-Ga-g])([#♮b]?)(\d*)$/.exec(note);
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
    noteName.toUpperCase(),
    accidental !== '' ? accidental : Accidental.NATURAL,
    octave
  ] as [NoteName, Accidental, number];
}

export function midiNoteToNoteName(midiNote: MIDINote, accidental: 'flat' | 'sharp', func_name: string = midiNoteToNoteName.name): Note {
  switch (midiNote % 12) {
    case 0:
      return 'C';
    case 1:
      return accidental === 'sharp' ? `C${Accidental.SHARP}` : `D${Accidental.FLAT}`;
    case 2:
      return 'D';
    case 3:
      return accidental === 'sharp' ? `D${Accidental.SHARP}` : `E${Accidental.FLAT}`;
    case 4:
      return 'E';
    case 5:
      return 'F';
    case 6:
      return accidental === 'sharp' ? `F${Accidental.SHARP}` : `G${Accidental.FLAT}`;
    case 7:
      return 'G';
    case 8:
      return accidental === 'sharp' ? `G${Accidental.SHARP}` : `A${Accidental.FLAT}`;
    case 9:
      return 'A';
    case 10:
      return accidental === 'sharp' ? `A${Accidental.SHARP}` : `B${Accidental.FLAT}`;
    case 11:
      return 'B';
    default:
      throw new Error(`${func_name}: Invalid MIDI note value ${midiNote}`);
  }
}
