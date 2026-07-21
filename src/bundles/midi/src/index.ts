/**
 * Bundle that provides functions for manipulating MIDI notes, converting between letter names
 * and frequencies.
 *
 * @module MIDI
 * @author leeyi45
 */
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';

import { scaleToConductorList } from './conductorAdapters';
import {
  FLAT,
  NATURAL,
  SHARP,
  add_octave_to_note as add_octave_to_note_func,
  aeolian_scale as aeolian_scale_func,
  dorian_scale as dorian_scale_func,
  get_accidental as get_accidental_func,
  get_note_name as get_note_name_func,
  get_octave as get_octave_func,
  ionian_scale as ionian_scale_func,
  is_note_with_octave as is_note_with_octave_func,
  key_signature_to_key as key_signature_to_key_func,
  letter_name_to_frequency as letter_name_to_frequency_func,
  letter_name_to_midi_note as letter_name_to_midi_note_func,
  locrian_scale as locrian_scale_func,
  lydian_scale as lydian_scale_func,
  major_scale as major_scale_func,
  midi_note_to_frequency as midi_note_to_frequency_func,
  midi_note_to_letter_name as midi_note_to_letter_name_func,
  minor_scale as minor_scale_func,
  mixolydian_scale as mixolydian_scale_func,
  phrygian_scale as phrygian_scale_func
} from './functions';

export default class MidiModulePlugin extends BaseModulePlugin {
  id = 'midi';
  override exportedNames = [
    'letter_name_to_midi_note',
    'midi_note_to_letter_name',
    'midi_note_to_frequency',
    'letter_name_to_frequency',
    'is_note_with_octave',
    'add_octave_to_note',
    'get_octave',
    'get_note_name',
    'get_accidental',
    'key_signature_to_key',
    'major_scale',
    'ionian_scale',
    'dorian_scale',
    'phrygian_scale',
    'lydian_scale',
    'mixolydian_scale',
    'minor_scale',
    'aeolian_scale',
    'locrian_scale'
  ] as const;
  static override channelAttach = [];
  constructor(conduit: IConduit, channels: IChannel<any>[], evaluator: IInterfacableEvaluator) {
    super(conduit, channels, evaluator);
    // BaseModulePlugin.initialise() only registers exportedNames whose value is a function, so
    // these plain string constants are pushed onto `exports` directly instead.
    this.exports.push(
      { symbol: 'SHARP', value: { type: DataType.CONST_STRING, value: SHARP } },
      { symbol: 'FLAT', value: { type: DataType.CONST_STRING, value: FLAT } },
      { symbol: 'NATURAL', value: { type: DataType.CONST_STRING, value: NATURAL } }
    );
  }

  /**
   * Converts a letter name to its corresponding MIDI note. The letter name is represented in
   * standard pitch notation. Examples are "A5", "Db3", "C#7". Refer to
   * [this](https://i.imgur.com/qGQgmYr.png) mapping from letter name to midi notes.
   * @param note given letter name
   * @returns the corresponding midi note
   * @example
   * ```
   * letter_name_to_midi_note('C4'); // Returns 60
   * ```
   * @function
   *
   * @category Notes
   */
  @moduleMethod([DataType.CONST_STRING], DataType.NUMBER)
  async* letter_name_to_midi_note(note: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, unknown> {
    return { type: DataType.NUMBER, value: letter_name_to_midi_note_func(note.value) };
  }

  /**
   * Convert a MIDI note into its letter representation.
   * @param note Note to convert
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
   *
   * @category Notes
   */
  @moduleMethod([DataType.NUMBER, DataType.CONST_STRING], DataType.CONST_STRING)
  async* midi_note_to_letter_name(
    note: TypedValue<DataType.NUMBER>,
    accidental: TypedValue<DataType.CONST_STRING>
  ): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, unknown> {
    return {
      type: DataType.CONST_STRING,
      value: midi_note_to_letter_name_func(note.value, accidental.value)
    };
  }

  /**
   * Converts a MIDI note to its corresponding frequency.
   * @param note given MIDI note
   * @returns the frequency of the MIDI note
   * @function
   * @example
   * ```
   * midi_note_to_frequency(69); // Returns 440
   * ```
   *
   * @category Notes
   */
  @moduleMethod([DataType.NUMBER], DataType.NUMBER)
  async* midi_note_to_frequency(note: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, unknown> {
    return { type: DataType.NUMBER, value: midi_note_to_frequency_func(note.value) };
  }

  /**
   * Converts a note name to its corresponding frequency.
   * @param note given letter name
   * @returns the corresponding frequency (in Hz)
   * @example
   * ```
   * letter_name_to_frequency('A4'); // Returns 440
   * ```
   * @function
   *
   * @category Notes
   */
  @moduleMethod([DataType.CONST_STRING], DataType.NUMBER)
  async* letter_name_to_frequency(note: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, unknown> {
    return { type: DataType.NUMBER, value: letter_name_to_frequency_func(note.value) };
  }

  /**
   * Returns a boolean value indicating whether the given value is a note name with octave.
   * @function
   *
   * @category Notes
   */
  // No declared arg type: is_note_with_octave is a predicate that must accept a value of any
  // Conductor DataType (not just strings) and answer false rather than throw.
  @moduleMethod([], DataType.BOOLEAN)
  async* is_note_with_octave(value?: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType.BOOLEAN>, unknown> {
    return { type: DataType.BOOLEAN, value: is_note_with_octave_func(value?.value) };
  }

  /**
   * Takes the given note and adds the octave number to it.
   * @function
   * @example
   * ```
   * add_octave_to_note('C', 4); // Returns "C4"
   * ```
   *
   * @category Notes
   */
  @moduleMethod([DataType.CONST_STRING, DataType.NUMBER], DataType.CONST_STRING)
  async* add_octave_to_note(
    note: TypedValue<DataType.CONST_STRING>,
    octave: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, unknown> {
    return { type: DataType.CONST_STRING, value: add_octave_to_note_func(note.value, octave.value) };
  }

  /**
   * Gets the octave number from a given note name with octave.
   * @function
   *
   * @category Notes
   */
  @moduleMethod([DataType.CONST_STRING], DataType.NUMBER)
  async* get_octave(note: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, unknown> {
    return { type: DataType.NUMBER, value: get_octave_func(note.value) };
  }

  /**
   * Gets the letter name from a given note name with octave (without the accidental).
   * @function
   * @example
   * ```
   * get_note_name('C#4'); // Returns "C"
   * get_note_name('Eb3'); // Returns "E"
   * ```
   *
   * @category Notes
   */
  @moduleMethod([DataType.CONST_STRING], DataType.CONST_STRING)
  async* get_note_name(note: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, unknown> {
    return { type: DataType.CONST_STRING, value: get_note_name_func(note.value) };
  }

  /**
   * Gets the accidental from a given note name with octave.
   * @function
   *
   * @category Notes
   */
  @moduleMethod([DataType.CONST_STRING], DataType.CONST_STRING)
  async* get_accidental(note: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, unknown> {
    return { type: DataType.CONST_STRING, value: get_accidental_func(note.value) };
  }

  /**
   * Converts the key signature to the corresponding key.
   * @function
   * @example
   * ```
   * key_signature_to_key(SHARP, 2); // Returns "D", since the key of D has 2 sharps
   * key_signature_to_key(FLAT, 3); // Returns "Eb", since the key of Eb has 3 flats
   * ```
   *
   * @category Notes
   */
  @moduleMethod([DataType.CONST_STRING, DataType.NUMBER], DataType.CONST_STRING)
  async* key_signature_to_key(
    accidental: TypedValue<DataType.CONST_STRING>,
    numAccidentals: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, unknown> {
    return {
      type: DataType.CONST_STRING,
      value: key_signature_to_key_func(accidental.value, numAccidentals.value)
    };
  }

  /**
   * Generate a list of MIDI notes representing the major scale for the given key (including the
   * octave).
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* major_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, major_scale_func(key.value));
  }

  /**
   * Alias for the major_scale function.
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* ionian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, ionian_scale_func(key.value));
  }

  /**
   * Generate a list of MIDI notes representing the dorian scale for the given key (including the
   * octave).
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* dorian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, dorian_scale_func(key.value));
  }

  /**
   * Generate a list of MIDI notes representing the phrygian scale for the given key (including
   * the octave).
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* phrygian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, phrygian_scale_func(key.value));
  }

  /**
   * Generate a list of MIDI notes representing the lydian scale for the given key (including the
   * octave).
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* lydian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, lydian_scale_func(key.value));
  }

  /**
   * Generate a list of MIDI notes representing the mixolydian scale for the given key (including
   * the octave).
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* mixolydian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, mixolydian_scale_func(key.value));
  }

  /**
   * Generate a list of MIDI notes representing the minor scale for the given key (including the
   * octave).
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* minor_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, minor_scale_func(key.value));
  }

  /**
   * Alias for the minor_scale function.
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* aeolian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, aeolian_scale_func(key.value));
  }

  /**
   * Generate a list of MIDI notes representing the locrian scale for the given key (including
   * the octave).
   * @function
   *
   * @category Scales
   */
  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* locrian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, locrian_scale_func(key.value));
  }
}
