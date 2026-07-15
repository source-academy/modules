/**
 * The sounds library provides functions for constructing and playing sounds.
 *
 * A wave is a function that takes in a number `t` and returns a number representing the
 * amplitude at time `t`.
 *
 * A Sound is a pair(wave, duration) where duration is the length of the sound in seconds.
 * The constructor make_sound and accessors get_wave and get_duration are provided.
 *
 * Sound Discipline: for all sounds, the wave function applied to a time `t` beyond its duration
 * returns 0, that is: `(get_wave(sound))(get_duration(sound) + x) === 0` for any x >= 0.
 *
 * Two functions which combine Sounds, `consecutively` and `simultaneously` are given.
 * Additionally, we provide sound transformation functions `adsr` and `phase_mod` which take in a
 * Sound and return a Sound.
 *
 * Finally, the provided `play` function takes in a Sound and plays it using your computer's
 * sound system.
 *
 * @module sound
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */
import { makeRpc, type IChannel, type IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';

import {
  adsr as adsr_func,
  bell as bell_func,
  cello as cello_func,
  consecutively as consecutively_func,
  get_duration as get_duration_func,
  get_wave as get_wave_func,
  init_record as init_record_func,
  is_sound as is_sound_func,
  make_sound as make_sound_func,
  noise_sound as noise_sound_func,
  phase_mod as phase_mod_func,
  piano as piano_func,
  play as play_func,
  play_wave as play_wave_func,
  record as record_func,
  record_for as record_for_func,
  sawtooth_sound as sawtooth_sound_func,
  setSoundIO,
  silence_sound as silence_sound_func,
  simultaneously as simultaneously_func,
  sine_sound as sine_sound_func,
  square_sound as square_sound_func,
  stop as stop_func,
  triangle_sound as triangle_sound_func,
  trombone as trombone_func,
  violin as violin_func
} from './functions';
import { SOUND_CHANNEL_ID, type SoundTabRpc } from './protocol';
import type { Sound, SoundTransformer } from './types';

type SoundTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

// stacking_adsr is reimplemented below (rather than calling functions.ts's stacking_adsr) because
// its `waveform`/`envelopes` arguments are user-supplied Conductor closures here, not the plain
// internal SoundProducer/SoundTransformer functions.ts's pure version expects.

/**
 * Wraps a Conductor closure (a user-supplied Wave, called as `wave(t)`) as an internal
 * (generator-based) Wave. `yield*`s through the closure call rather than draining it, so
 * stepping/breakpoints inside a student's own wave function propagate up to whatever's driving
 * the top-level generator.
 */
function closureToWave(evaluator: IDataHandler, closure: TypedValue<DataType.CLOSURE>) {
  return async function* (t: number): AsyncGenerator<void, number, undefined> {
    // closure_call_unchecked's return type is generic over any DataType (the closure's actual
    // return type isn't statically known from a bare TypedValue<DataType.CLOSURE>); a Wave is
    // only ever constructed from a closure the caller already expects to be number-returning.
    const result = yield* evaluator.closure_call_unchecked(closure, [{ type: DataType.NUMBER, value: t }]);
    return result.value as number;
  };
}

/** Wraps the internal (pure, evaluator-free) Sound representation as a Conductor PAIR. */
async function soundToConductor(evaluator: IDataHandler, sound: Sound): Promise<TypedValue<DataType.PAIR>> {
  const waveClosure = await evaluator.closure_make(
    { returnType: DataType.NUMBER, args: [DataType.NUMBER] },
    async function* (t: TypedValue<DataType.NUMBER>) {
      return { type: DataType.NUMBER as const, value: yield* sound.wave(t.value) };
    }
  );
  return evaluator.pair_make(waveClosure, { type: DataType.NUMBER, value: sound.duration });
}

/** Unwraps a Conductor PAIR (or throws) into the internal Sound representation. */
async function conductorToSound(evaluator: IDataHandler, value: TypedValue<DataType>): Promise<Sound> {
  if (!value || value.type !== DataType.PAIR) {
    throw new Error('Expected a Sound (a pair of wave and duration)');
  }
  const waveTv = await evaluator.pair_head(value);
  const durationTv = await evaluator.pair_tail(value);
  if (waveTv.type !== DataType.CLOSURE || durationTv.type !== DataType.NUMBER) {
    throw new Error('Expected a Sound (a pair of wave and duration)');
  }
  return {
    wave: closureToWave(evaluator, waveTv),
    duration: durationTv.value
  };
}

/** Walks a Conductor LIST (pair chain) of Sounds into a plain array of the internal representation. */
async function conductorListToSounds(evaluator: IDataHandler, value: TypedValue<DataType>): Promise<Sound[]> {
  const sounds: Sound[] = [];
  let current = value;
  while (current.type === DataType.PAIR) {
    sounds.push(await conductorToSound(evaluator, await evaluator.pair_head(current)));
    current = await evaluator.pair_tail(current);
  }
  return sounds;
}

/**
 * Wraps an internal SoundTransformer (Sound -> Sound) as a Conductor closure (PAIR -> PAIR).
 * `transformer` itself never touches user closures directly (adsr/phase_mod are pure math over
 * `sound.wave`), so no yield*-threading is needed at this specific boundary - the transformer's
 * body runs synchronously up to the point where it constructs a new generator-based Wave, which
 * is only actually driven (and potentially yields) once that Wave gets sampled later.
 */
async function transformerToConductor(
  evaluator: IDataHandler,
  transformer: SoundTransformer
): Promise<TypedValue<DataType.CLOSURE>> {
  return evaluator.closure_make(
    { returnType: DataType.PAIR, args: [DataType.PAIR] },
    async function* (soundTv: TypedValue<DataType.PAIR>) {
      const sound = await conductorToSound(evaluator, soundTv);
      return soundToConductor(evaluator, transformer(sound));
    }
  );
}

/** Wraps a nullary `() => Sound` "sound promise" (throws until ready) as a Conductor closure. */
async function soundPromiseToConductor(evaluator: IDataHandler, promise: () => Sound): Promise<TypedValue<DataType.CLOSURE>> {
  return evaluator.closure_make({ returnType: DataType.PAIR, args: [] }, async function* () {
    return soundToConductor(evaluator, promise());
  });
}

export default class SoundModulePlugin extends BaseModulePlugin {
  id = 'sound';
  exportedNames = [
    'adsr',
    'bell',
    'cello',
    'consecutively',
    'get_duration',
    'get_wave',
    'init_record',
    'is_sound',
    'make_sound',
    'noise_sound',
    'phase_mod',
    'piano',
    'play',
    'play_wave',
    'record',
    'record_for',
    'sawtooth_sound',
    'silence_sound',
    'simultaneously',
    'sine_sound',
    'square_sound',
    'stacking_adsr',
    'stop',
    'triangle_sound',
    'trombone',
    'violin'
  ] as const;
  static channelAttach = [SOUND_CHANNEL_ID];

  private readonly __tabLoader: SoundTabLoader | undefined;
  private __tabLoaded = false;

  constructor(
    conduit: IConduit,
    [soundChannel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader?: SoundTabLoader
  ) {
    super(conduit, [soundChannel], evaluator);
    if (!soundChannel) {
      throw new Error('Sound channel is required but was not provided.');
    }
    this.__tabLoader = tabLoader;
    // The tab is the web plugin for playback/recording: it does the actual AudioContext/
    // MediaRecorder work (only available on the browser main thread, not inside this runner's
    // Worker) and replies over the same channel via Conductor's RPC helper.
    setSoundIO(makeRpc<Record<string, never>, SoundTabRpc>(soundChannel, {}));
  }

  /**
   * Loads the host-side tab, lazily - only the first time a host-bridged function (play/record/
   * etc.) is actually called, so purely computational uses of this module (building/combining
   * Sounds without ever playing or recording one) never spawn a tab.
   */
  private __ensureTabLoaded(): void {
    if (this.__tabLoaded || this.__tabLoader === undefined) return;

    const tabName = this.__tabLoader.tabs[0];
    if (tabName === undefined) return;

    this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
  }

  @moduleMethod([DataType.CLOSURE, DataType.NUMBER], DataType.PAIR)
  async* make_sound(
    wave: TypedValue<DataType.CLOSURE>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, make_sound_func(closureToWave(this.evaluator, wave), duration.value));
  }

  @moduleMethod([DataType.PAIR], DataType.CLOSURE)
  async* get_wave(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const internal = await conductorToSound(this.evaluator, sound);
    const wave = get_wave_func(internal);
    return this.evaluator.closure_make(
      { returnType: DataType.NUMBER, args: [DataType.NUMBER] },
      async function* (t: TypedValue<DataType.NUMBER>) {
        return { type: DataType.NUMBER as const, value: yield* wave(t.value) };
      }
    );
  }

  @moduleMethod([DataType.PAIR], DataType.NUMBER)
  async* get_duration(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const internal = await conductorToSound(this.evaluator, sound);
    return { type: DataType.NUMBER, value: get_duration_func(internal) };
  }

  // No declared arg type: is_sound is a predicate that must accept a value of any Conductor
  // DataType (not just PAIR) and answer false rather than throw.
  @moduleMethod([], DataType.BOOLEAN)
  async* is_sound(value?: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType.BOOLEAN>, undefined> {
    if (!value || value.type !== DataType.PAIR) {
      return { type: DataType.BOOLEAN, value: false };
    }
    try {
      const internal = await conductorToSound(this.evaluator, value);
      return { type: DataType.BOOLEAN, value: is_sound_func(internal) };
    } catch {
      return { type: DataType.BOOLEAN, value: false };
    }
  }

  @moduleMethod([], DataType.CONST_STRING)
  async* init_record(): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, undefined> {
    this.__ensureTabLoaded();
    return { type: DataType.CONST_STRING, value: init_record_func() };
  }

  @moduleMethod([DataType.NUMBER], DataType.CLOSURE)
  async* record(buffer: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    this.__ensureTabLoaded();
    const evaluator = this.evaluator;
    const stopFn = record_func(buffer.value);
    return evaluator.closure_make({ returnType: DataType.CLOSURE, args: [] }, async function* () {
      const soundPromise = stopFn();
      return soundPromiseToConductor(evaluator, soundPromise);
    });
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.CLOSURE)
  async* record_for(
    duration: TypedValue<DataType.NUMBER>,
    buffer: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    this.__ensureTabLoaded();
    const soundPromise = record_for_func(duration.value, buffer.value);
    return soundPromiseToConductor(this.evaluator, soundPromise);
  }

  @moduleMethod([DataType.CLOSURE, DataType.NUMBER], DataType.PAIR)
  async* play_wave(
    wave: TypedValue<DataType.CLOSURE>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    this.__ensureTabLoaded();
    const result = yield* play_wave_func(closureToWave(this.evaluator, wave), duration.value);
    return soundToConductor(this.evaluator, result);
  }

  @moduleMethod([DataType.PAIR], DataType.PAIR)
  async* play(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    this.__ensureTabLoaded();
    const internal = await conductorToSound(this.evaluator, sound);
    const result = yield* play_func(internal);
    return soundToConductor(this.evaluator, result);
  }

  @moduleMethod([], DataType.VOID)
  async* stop(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    stop_func();
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.NUMBER], DataType.PAIR)
  async* noise_sound(duration: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, noise_sound_func(duration.value));
  }

  @moduleMethod([DataType.NUMBER], DataType.PAIR)
  async* silence_sound(duration: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, silence_sound_func(duration.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* sine_sound(
    freq: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, sine_sound_func(freq.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* square_sound(
    freq: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, square_sound_func(freq.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* triangle_sound(
    freq: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, triangle_sound_func(freq.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* sawtooth_sound(
    freq: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, sawtooth_sound_func(freq.value, duration.value));
  }

  @moduleMethod([DataType.LIST], DataType.PAIR)
  async* consecutively(sounds: TypedValue<DataType.LIST>): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    const internalSounds = await conductorListToSounds(this.evaluator, sounds);
    return soundToConductor(this.evaluator, consecutively_func(internalSounds));
  }

  @moduleMethod([DataType.LIST], DataType.PAIR)
  async* simultaneously(sounds: TypedValue<DataType.LIST>): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    const internalSounds = await conductorListToSounds(this.evaluator, sounds);
    return soundToConductor(this.evaluator, simultaneously_func(internalSounds));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.CLOSURE)
  async* adsr(
    attack_ratio: TypedValue<DataType.NUMBER>,
    decay_ratio: TypedValue<DataType.NUMBER>,
    sustain_level: TypedValue<DataType.NUMBER>,
    release_ratio: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const transformer = adsr_func(attack_ratio.value, decay_ratio.value, sustain_level.value, release_ratio.value);
    return transformerToConductor(this.evaluator, transformer);
  }

  @moduleMethod([DataType.CLOSURE, DataType.NUMBER, DataType.NUMBER, DataType.LIST], DataType.PAIR)
  async* stacking_adsr(
    waveform: TypedValue<DataType.CLOSURE>,
    base_frequency: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>,
    envelopes: TypedValue<DataType.LIST>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    const evaluator = this.evaluator;

    const envelopeClosures: TypedValue<DataType.CLOSURE>[] = [];
    let current: TypedValue<DataType> = envelopes;
    while (current.type === DataType.PAIR) {
      envelopeClosures.push((await evaluator.pair_head(current)) as TypedValue<DataType.CLOSURE>);
      current = await evaluator.pair_tail(current);
    }

    const harmonics: Sound[] = [];
    for (let i = 0; i < envelopeClosures.length; i += 1) {
      const harmonicTv = yield* evaluator.closure_call_unchecked(waveform, [
        { type: DataType.NUMBER, value: base_frequency.value * (i + 1) },
        { type: DataType.NUMBER, value: duration.value }
      ]);
      const harmonic = await conductorToSound(evaluator, harmonicTv);
      const harmonicSoundTv = await soundToConductor(evaluator, harmonic);
      const shapedTv = yield* evaluator.closure_call_unchecked(envelopeClosures[i], [harmonicSoundTv]);
      harmonics.push(await conductorToSound(evaluator, shapedTv));
    }

    return soundToConductor(evaluator, simultaneously_func(harmonics));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.CLOSURE)
  async* phase_mod(
    freq: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>,
    amount: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const transformer = phase_mod_func(freq.value, duration.value, amount.value);
    return transformerToConductor(this.evaluator, transformer);
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* bell(
    note: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, bell_func(note.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* cello(
    note: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, cello_func(note.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* piano(
    note: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, piano_func(note.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* trombone(
    note: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, trombone_func(note.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* violin(
    note: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, violin_func(note.value, duration.value));
  }
}
