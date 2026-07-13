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
import { DataType, type IFunctionSignature, type TypedValue } from '@sourceacademy/conductor/types';

import { assertAccidental, scaleToConductorList } from './conductorAdapters';
import {
  FLAT,
  NATURAL,
  SHARP,
  aeolian_scale as aeolian_scale_func,
  dorian_scale as dorian_scale_func,
  ionian_scale as ionian_scale_func,
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
import type { MIDINote, NoteWithOctave } from './types';

export default class MidiModulePlugin extends BaseModulePlugin {
  id = 'midi';
  exportedNames = [
    'letter_name_to_midi_note',
    'midi_note_to_letter_name',
    'midi_note_to_frequency',
    'letter_name_to_frequency',
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
  static channelAttach = [];
  constructor(conduit: IConduit, channels: IChannel<any>[], evaluator: IInterfacableEvaluator) {
    super(conduit, channels, evaluator);
    this.__bindExportedMethods();
    // BaseModulePlugin.initialise() only registers exportedNames whose value is a function, so
    // these plain string constants are pushed onto `exports` directly instead.
    this.exports.push(
      { symbol: 'SHARP', value: { type: DataType.CONST_STRING, value: SHARP } },
      { symbol: 'FLAT', value: { type: DataType.CONST_STRING, value: FLAT } },
      { symbol: 'NATURAL', value: { type: DataType.CONST_STRING, value: NATURAL } }
    );
  }

  // See binary_tree's index.ts / source-academy/conductor#41 for why this is needed: evaluators
  // call the registered closure as a bare function, so `this` inside the method body is
  // undefined unless bound to the instance first.
  private __bindExportedMethods() {
    for (const name of this.exportedNames) {
      const method = this[name];
      if (typeof method !== 'function') continue;

      const signature = (method as { signature?: IFunctionSignature<any, any> }).signature;
      const boundMethod = method.bind(this) as typeof method & { signature?: IFunctionSignature<any, any> };
      boundMethod.signature = signature;
      Object.defineProperty(this, name, {
        configurable: true,
        value: boundMethod
      });
    }
  }

  @moduleMethod([DataType.CONST_STRING], DataType.NUMBER)
  async* letter_name_to_midi_note(note: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, unknown> {
    return { type: DataType.NUMBER, value: letter_name_to_midi_note_func(note.value as NoteWithOctave) };
  }

  @moduleMethod([DataType.NUMBER, DataType.CONST_STRING], DataType.CONST_STRING)
  async* midi_note_to_letter_name(
    note: TypedValue<DataType.NUMBER>,
    accidental: TypedValue<DataType.CONST_STRING>
  ): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, unknown> {
    assertAccidental(accidental.value, midi_note_to_letter_name_func.name);
    return { type: DataType.CONST_STRING, value: midi_note_to_letter_name_func(note.value as MIDINote, accidental.value) };
  }

  @moduleMethod([DataType.NUMBER], DataType.NUMBER)
  async* midi_note_to_frequency(note: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, unknown> {
    return { type: DataType.NUMBER, value: midi_note_to_frequency_func(note.value as MIDINote) };
  }

  @moduleMethod([DataType.CONST_STRING], DataType.NUMBER)
  async* letter_name_to_frequency(note: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, unknown> {
    return { type: DataType.NUMBER, value: letter_name_to_frequency_func(note.value as NoteWithOctave) };
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* major_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, major_scale_func(key.value as MIDINote));
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* ionian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, ionian_scale_func(key.value as MIDINote));
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* dorian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, dorian_scale_func(key.value as MIDINote));
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* phrygian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, phrygian_scale_func(key.value as MIDINote));
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* lydian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, lydian_scale_func(key.value as MIDINote));
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* mixolydian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, mixolydian_scale_func(key.value as MIDINote));
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* minor_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, minor_scale_func(key.value as MIDINote));
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* aeolian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, aeolian_scale_func(key.value as MIDINote));
  }

  @moduleMethod([DataType.NUMBER], DataType.LIST)
  async* locrian_scale(key: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await scaleToConductorList(this.evaluator, locrian_scale_func(key.value as MIDINote));
  }
}
