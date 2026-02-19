export enum Accidental {
  SHARP = '#',
  FLAT = 'b',
  NATURAL = '♮'
}

export type NoteName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
type NotesWithSharps = 'A' | 'C' | 'D' | 'F' | 'G';
type NotesWithFlats = 'A' | 'B' | 'D' | 'E' | 'G';

// & {} is a weird trick with typescript that causes intellisense to evaluate every single option
// so you see all the valid notes instead of just the type definition below
export type Note = {} & (NoteName | `${NoteName}${Accidental.NATURAL}` | `${NotesWithFlats}${Accidental.FLAT}` | `${NotesWithSharps}${Accidental.SHARP}`);
export type NoteWithOctave = Note | `${Note}${number}`;

/**
 * An integer representing a MIDI note value. Refer to {@link https://i.imgur.com/qGQgmYr.png|this} mapping from
 * letter name to midi notes.
 */
export type MIDINote = number;
