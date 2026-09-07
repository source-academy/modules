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

export type SoundRecord = {
  leftClosure: TypedValue<DataType.CLOSURE>;
  rightClosure: TypedValue<DataType.CLOSURE>;
  duration: number;
};

/**
 * Shadow of soundToConductor's own output, letting get_wave/get_left_wave/get_right_wave/
 * get_duration answer via a `.sync` twin (index.ts's static block) instead of their always-async
 * body's conductorToSound round-trip - needed because student code routinely calls these accessors
 * *inside* a wave closure's own body (e.g. `t < get_duration(s1) ? ...`), which runs on the
 * synchronous trampoline once closureToWave's probe succeeds; a real round-trip from there throws
 * outright rather than suspending (see closureToWave's doc comment in index.ts).
 *
 * Keyed by plain pair identifier, not gated here on `.type === DataType.PAIR` (callers do that via
 * isPairLike before reaching in): per isPairLike's doc comment, a pair is just an array of length 2
 * with no distinct representation, so the same underlying value keeps the same identifier whether
 * currently tagged PAIR (fresh from pair_make) or ARRAY (round-tripped back in through Python) - and
 * a Sound reached through a Python variable, the overwhelming common case, always arrives
 * ARRAY-tagged. Scoped per evaluator (so it can't leak or collide across different runs), same as
 * soundSamplerCache above.
 */
const soundRecordCache = new WeakMap<IDataHandler, Map<number, SoundRecord>>();

export function rememberSoundRecord(evaluator: IDataHandler, pairId: number, record: SoundRecord): void {
  let records = soundRecordCache.get(evaluator);
  if (!records) {
    records = new Map();
    soundRecordCache.set(evaluator, records);
  }
  records.set(pairId, record);
}

export function lookupSoundRecord(evaluator: IDataHandler, pairId: number): SoundRecord | undefined {
  return soundRecordCache.get(evaluator)?.get(pairId);
}
