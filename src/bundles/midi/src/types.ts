export enum Accidental {
  SHARP = '#',
  FLAT = 'b',
  NATURAL = '♮'
}

export type NoteName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
type NotesWithSharps = 'A' | 'C' | 'D' | 'F' | 'G';
type NotesWithFlats = 'A' | 'B' | 'D' | 'E' | 'G';

export type Note = {} & (NoteName | `${NoteName}${Accidental.NATURAL}` | `${NotesWithFlats}${Accidental.FLAT}` | `${NotesWithSharps}${Accidental.SHARP}`);
export type NoteWithOctave = (Note | `${Note}${number}`);

export type MIDINote = number;
