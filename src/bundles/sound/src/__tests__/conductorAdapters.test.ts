import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import { describe, expect, test } from 'vitest';
import { lookupSoundRecord, rememberSoundRecord, rememberSoundSampler, restoreSoundSampler } from '../conductorAdapters';
import type { Sound, SoundSampler, Wave } from '../types';

function closure(id: number): TypedValue<DataType.CLOSURE> {
  return {
    type: DataType.CLOSURE,
    value: id as TypedValue<DataType.CLOSURE>['value']
  };
}

async function* silentWave(): ReturnType<Wave> {
  return 0;
}

async function* sampler(_duration: number): ReturnType<SoundSampler> {
  const samples = new Float32Array(0);
  return { left: samples, right: samples };
}

function decodedSound(duration: number): Omit<Sound, 'sampleChannels'> {
  return { leftWave: silentWave, rightWave: silentWave, duration };
}

describe('Sound sampler Conductor metadata', () => {
  test('survives fresh closure wrappers for the same evaluator and Sound identity', () => {
    const evaluator = {} as IDataHandler;
    const sound = { ...decodedSound(1), sampleChannels: sampler };
    rememberSoundSampler(evaluator, sound, closure(11), closure(12));

    const restored = restoreSoundSampler(evaluator, decodedSound(1), closure(11), closure(12));

    expect(restored.sampleChannels).toBe(sampler);
  });

  test('does not leak to another duration, closure pair, or evaluator', () => {
    const evaluator = {} as IDataHandler;
    const sound = { ...decodedSound(1), sampleChannels: sampler };
    rememberSoundSampler(evaluator, sound, closure(11), closure(12));

    expect(restoreSoundSampler(evaluator, decodedSound(2), closure(11), closure(12)).sampleChannels)
      .toBeUndefined();
    expect(restoreSoundSampler(evaluator, decodedSound(1), closure(11), closure(13)).sampleChannels)
      .toBeUndefined();
    expect(restoreSoundSampler({} as IDataHandler, decodedSound(1), closure(11), closure(12)).sampleChannels)
      .toBeUndefined();
  });
});

describe('Sound record cache (get_wave/get_left_wave/get_right_wave/get_duration .sync twins)', () => {
  test('round-trips a record for the same evaluator and pair id', () => {
    const evaluator = {} as IDataHandler;
    const record = { leftClosure: closure(11), rightClosure: closure(12), duration: 5 };
    rememberSoundRecord(evaluator, 100, record);

    expect(lookupSoundRecord(evaluator, 100)).toEqual(record);
  });

  test('does not leak to another pair id or evaluator', () => {
    const evaluator = {} as IDataHandler;
    const record = { leftClosure: closure(11), rightClosure: closure(12), duration: 5 };
    rememberSoundRecord(evaluator, 100, record);

    expect(lookupSoundRecord(evaluator, 101)).toBeUndefined();
    expect(lookupSoundRecord({} as IDataHandler, 100)).toBeUndefined();
  });
});
