/**
 * Undecorated helpers for the Conductor boundary. Keeping them outside index.ts makes them
 * importable from Vitest, whose transform does not use this bundle's standard-decorator settings.
 */
import type { DataType, IDataHandler, TypedValue } from '@sourceacademy/conductor/types';
import type { Sound, SoundSampler } from './types';

// sampleChannels is an internal playback optimisation and cannot be represented in the public
// [[left_wave, right_wave], duration] Sound pair. Preserve it using stable Conductor closure ids:
// Python round-trips recreate TypedValue/pair wrappers, while those ids still refer to the same
// waves. The evaluator key scopes both ids and cache lifetime to a single run.
const soundSamplerCache = new WeakMap<
  IDataHandler,
  Map<number, Map<number, Map<number, SoundSampler>>>
>();

export function rememberSoundSampler(
  evaluator: IDataHandler,
  sound: Sound,
  leftClosure: TypedValue<DataType.CLOSURE>,
  rightClosure: TypedValue<DataType.CLOSURE>
): void {
  if (!sound.sampleChannels) return;

  let byLeftClosure = soundSamplerCache.get(evaluator);
  if (!byLeftClosure) {
    byLeftClosure = new Map();
    soundSamplerCache.set(evaluator, byLeftClosure);
  }
  let byRightClosure = byLeftClosure.get(leftClosure.value);
  if (!byRightClosure) {
    byRightClosure = new Map();
    byLeftClosure.set(leftClosure.value, byRightClosure);
  }
  let byDuration = byRightClosure.get(rightClosure.value);
  if (!byDuration) {
    byDuration = new Map();
    byRightClosure.set(rightClosure.value, byDuration);
  }
  byDuration.set(sound.duration, sound.sampleChannels);
}

export function restoreSoundSampler(
  evaluator: IDataHandler,
  sound: Omit<Sound, 'sampleChannels'>,
  leftClosure: TypedValue<DataType.CLOSURE>,
  rightClosure: TypedValue<DataType.CLOSURE>
): Sound {
  const sampleChannels = soundSamplerCache
    .get(evaluator)
    ?.get(leftClosure.value)
    ?.get(rightClosure.value)
    ?.get(sound.duration);
  return sampleChannels ? { ...sound, sampleChannels } : sound;
}
