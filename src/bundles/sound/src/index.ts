/**
 * The sounds library provides functions for constructing and playing sounds.
 *
 * A wave is a function that takes in a number `t` and returns a number representing the
 * amplitude at time `t`. (Internally, `Wave` is `(t: number) => AsyncGenerator<void, number,
 * undefined>` - see the `Wave` type in types.ts for why - but that's invisible from Source: a
 * plain `t => ...` function is all a wave ever needs to be.)
 *
 * A Sound is always stereo internally - pair(pair(left_wave, right_wave), duration), where
 * duration is the length of the sound in seconds. "Mono" isn't a separate concept: it's just the
 * common case where left_wave and right_wave are the same wave, produced by the constructor
 * make_sound. make_stereo_sound builds a genuinely stereo Sound from two different waves.
 * Accessors get_wave (an alias of get_left_wave), get_left_wave, get_right_wave, and get_duration
 * are provided.
 *
 * Sound Discipline: for all sounds, each channel's wave function applied to a time `t` beyond its
 * duration returns 0, that is: `(get_left_wave(sound))(get_duration(sound) + x) === 0` (and the
 * same for get_right_wave) for any x >= 0.
 *
 * Two functions which combine Sounds, `consecutively` and `simultaneously` are given.
 * Additionally, we provide sound transformation functions `adsr` and `phase_mod` which take in a
 * Sound and return a Sound, and stereo-specific transformations `pan`, `pan_mod`, and `squash`.
 *
 * Finally, the provided `play` function takes in a Sound and plays it using your computer's
 * sound system; `record`/`record_for` record a Sound using however many channels your
 * microphone actually has (a mono mic produces a Sound whose left and right channels are the
 * same wave).
 *
 * @module sound
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */
import { EvaluatorParameterTypeError, EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
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
  get_left_wave as get_left_wave_func,
  get_right_wave as get_right_wave_func,
  get_wave as get_wave_func,
  init_record as init_record_func,
  is_sound as is_sound_func,
  make_sound as make_sound_func,
  make_stereo_sound as make_stereo_sound_func,
  noise_sound as noise_sound_func,
  noise_wave as noise_wave_func,
  pan as pan_func,
  pan_mod as pan_mod_func,
  phase_mod as phase_mod_func,
  piano as piano_func,
  play as play_func,
  play_wave as play_wave_func,
  play_waves as play_waves_func,
  record as record_func,
  record_for as record_for_func,
  sawtooth_sound as sawtooth_sound_func,
  sawtooth_wave as sawtooth_wave_func,
  setSoundIO,
  silence_sound as silence_sound_func,
  silence_wave as silence_wave_func,
  simultaneously as simultaneously_func,
  sine_sound as sine_sound_func,
  sine_wave as sine_wave_func,
  square_sound as square_sound_func,
  square_wave as square_wave_func,
  squash as squash_func,
  stop as stop_func,
  triangle_sound as triangle_sound_func,
  triangle_wave as triangle_wave_func,
  trombone as trombone_func,
  violin as violin_func
} from './functions';
import { SOUND_CHANNEL_ID, type SoundTabRpc } from './protocol';
import type { Sound, SoundTransformer, Wave } from './types';

type SoundTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

// stacking_adsr is reimplemented below (rather than calling functions.ts's stacking_adsr) because
// its `waveform`/`envelopes` arguments are user-supplied Conductor closures here, not the plain
// internal SoundProducer/SoundTransformer functions.ts's pure version expects.

// closureToWave/waveToConductorClosure each independently build a brand-new wrapper object per
// call, by construction (that's what lets them stay stateless, evaluator-scoped functions). But
// get_wave/get_left_wave/get_right_wave each independently decode-then-re-encode the *same*
// underlying Sound, and the module's own Sound Discipline documents "mono is just the common case
// where left_wave and right_wave are the same wave" as an invariant a cadet program can rely on
// (e.g. `get_wave(s) == get_left_wave(s)`) - without caching, two separate calls decoding the same
// closure id would produce two distinct Wave objects, and re-encoding those would produce two
// distinct Conductor closures, silently breaking that invariant across accessor calls. These two
// caches (keyed per evaluator, so they can't leak or collide across different runs/evaluators)
// make both directions idempotent: decoding the same closure id twice returns the same Wave
// object, and encoding the same Wave object twice returns the same Conductor closure.
const waveDecodeCache = new WeakMap<IDataHandler, Map<number, Wave>>();
const closureEncodeCache = new WeakMap<IDataHandler, WeakMap<Wave, Promise<TypedValue<DataType.CLOSURE>>>>();

/**
 * Wraps a Conductor closure (a user-supplied Wave, called as `wave(t)`) as an internal
 * (generator-based) Wave. `yield*`s through the closure call rather than draining it, so
 * stepping/breakpoints inside a student's own wave function propagate up to whatever's driving
 * the top-level generator. This is also the module boundary where an untyped closure's return
 * value is validated to actually be a number, once, before it enters the rest of this file's
 * fully-typed pipeline - functions.ts's own `Wave` consumers (`play`, combinators, ...) trust that
 * contract and don't re-check it.
 */
function closureToWave(evaluator: IDataHandler, closure: TypedValue<DataType.CLOSURE>): Wave {
  let decoded = waveDecodeCache.get(evaluator);
  if (!decoded) {
    decoded = new Map();
    waveDecodeCache.set(evaluator, decoded);
  }
  const cachedWave = decoded.get(closure.value);
  if (cachedWave) return cachedWave;

  const wave = (async function* (t: number): AsyncGenerator<void, number, undefined> {
    // closure_call_unchecked's return type is generic over any DataType (Conductor's DataType.CLOSURE
    // argument type doesn't itself encode the closure's return type), so a student-supplied wave
    // isn't guaranteed to actually return a number - check at runtime rather than just asserting it.
    const result = yield* evaluator.closure_call_unchecked(closure, [{ type: DataType.NUMBER, value: t }]);
    if (result.type !== DataType.NUMBER) {
      throw new EvaluatorRuntimeError(`Expected a wave to return a number, got ${DataType[result.type]}`);
    }
    return result.value;
  }) as Wave;

  // The fast path: an evaluator whose closures can prove they never need a real host round-trip
  // exposes closure_call_sync, letting a student-authored wave function be sampled without a
  // microtask per sample - the same escape hatch this module's own built-in waves already use
  // (see types.ts's Wave.sync doc), just one layer further out.
  //
  // closure_call_sync is a method on GenericDataHandler, the *shared* IDataHandler implementation
  // across all of py-slang's engines - it's always present, regardless of which engine is actually
  // running, so its mere presence does NOT mean this specific closure supports the fast path (only
  // an engine/closure combination that actually attached a `.sync` twin does; today that's some,
  // not all, py2js closures - CSE and PVML closures never have one). Whether *this* closure has one
  // is a static property of how it was compiled, not something that depends on which `t` it's
  // eventually sampled at - so it's safe to determine once, right now, with a single probe call,
  // rather than discovering it only when a real sample throws. The probe is genuinely free unless
  // the closure really does have a `.sync` twin: closure_call_sync's own contract only returns
  // `undefined` for an unsupported *argument* type before the underlying function ever runs (a wave
  // closure's argument is always DataType.NUMBER, always supported) - the only way real student
  // code executes here is if a `.sync` twin actually exists, in which case this probe call reuses
  // that exact result as this Wave's very first real sample too, rather than throwing it away.
  const syncCall = (
    evaluator as IDataHandler & {
      closure_call_sync?: (
        c: TypedValue<DataType.CLOSURE>,
        args: TypedValue<DataType>[],
      ) => TypedValue<DataType> | undefined;
    }
  ).closure_call_sync?.bind(evaluator);
  const probe = syncCall?.(closure, [{ type: DataType.NUMBER, value: 0 }]);
  if (probe !== undefined) {
    if (probe.type !== DataType.NUMBER) {
      throw new EvaluatorRuntimeError(`Expected a wave to return a number, got ${DataType[probe.type]}`);
    }
    const probedSample: [t: number, value: number] = [0, probe.value];
    Object.assign(wave, {
      sync: (t: number): number => {
        if (t === probedSample[0]) return probedSample[1];
        const result = syncCall!(closure, [{ type: DataType.NUMBER, value: t }]);
        // Already proven above that this closure has a working `.sync` twin - a later decline
        // would mean the closure's result type is inconsistent between calls, which is an actual
        // student-code bug (e.g. a wave that sometimes returns a string), not an engine gap.
        if (result === undefined) {
          throw new EvaluatorRuntimeError('Expected a wave to consistently return a number');
        }
        if (result.type !== DataType.NUMBER) {
          throw new EvaluatorRuntimeError(`Expected a wave to return a number, got ${DataType[result.type]}`);
        }
        return result.value;
      },
    });
  }

  decoded.set(closure.value, wave);
  return wave;
}

/** Wraps an internal (pure, evaluator-free) Wave as a Conductor closure. */
function waveToConductorClosure(evaluator: IDataHandler, wave: Wave): Promise<TypedValue<DataType.CLOSURE>> {
  let encoded = closureEncodeCache.get(evaluator);
  if (!encoded) {
    encoded = new WeakMap();
    closureEncodeCache.set(evaluator, encoded);
  }
  const cachedClosure = encoded.get(wave);
  if (cachedClosure) return cachedClosure;

  async function* conductorWave(t: TypedValue<DataType.NUMBER>) {
    return { type: DataType.NUMBER as const, value: yield* wave(t.value) };
  }
  // Mirrors closureToWave's fast path in the other direction: a Sound built entirely from
  // sync-capable waves (built-ins, or a py2js closure that got one via closure_call_sync) stays
  // sync-capable once it crosses back into Python (e.g. as make_sound's/consecutively's return
  // value) and back into a module again (e.g. play() on that same Sound) - without this, every
  // Sound handed back to a student loses its fast path the instant it's constructed, regardless
  // of how it was built.
  if (wave.sync) {
    const sync = wave.sync;
    Object.assign(conductorWave, {
      sync: (t: TypedValue<DataType.NUMBER>): TypedValue<DataType.NUMBER> => ({
        type: DataType.NUMBER as const,
        value: sync(t.value)
      })
    });
  }
  const closurePromise = evaluator.closure_make({ returnType: DataType.NUMBER, args: [DataType.NUMBER] }, conductorWave);
  encoded.set(wave, closurePromise);
  return closurePromise;
}

/** Wraps the internal (pure, evaluator-free) Sound representation as a Conductor PAIR. */
async function soundToConductor(evaluator: IDataHandler, sound: Sound): Promise<TypedValue<DataType.PAIR>> {
  const leftClosure = await waveToConductorClosure(evaluator, sound.leftWave);
  const rightClosure = sound.rightWave === sound.leftWave
    ? leftClosure
    : await waveToConductorClosure(evaluator, sound.rightWave);
  const wavesPair = await evaluator.pair_make(leftClosure, rightClosure);
  return evaluator.pair_make(wavesPair, { type: DataType.NUMBER, value: sound.duration });
}

/**
 * A pair is just an array of length 2 (no distinct "pair" representation, per
 * source-academy/py-slang#307) - a value built here via `pair_make` (e.g. `soundToConductor`'s own
 * output) is tagged `DataType.PAIR`, but the exact same value round-tripped back in through Python
 * (assigned to a variable and passed to another module call) arrives tagged `DataType.ARRAY`
 * instead, since `pythonToModule` now always builds a flat ARRAY for a Python list/pair of any
 * length. Both are equally valid; `pair_head`/`pair_tail` already read either shape identically
 * (py-slang's own `GenericDataHandler` bridge).
 */
function isPairLike(value: TypedValue<DataType>): boolean {
  return value.type === DataType.PAIR || value.type === DataType.ARRAY;
}

/**
 * Reads a Conductor LIST's elements regardless of whether it's tagged as a genuine PAIR/EMPTY_LIST
 * chain or a flat DataType.ARRAY (see `isPairLike`'s doc comment - the same round-tripping applies
 * to a real Python list of any length, e.g. `consecutively`'s/`simultaneously`'s own list argument,
 * not just a 2-element pair).
 */
async function readListElements(evaluator: IDataHandler, value: TypedValue<DataType>): Promise<TypedValue<DataType>[]> {
  if (value.type === DataType.ARRAY) {
    const length = await evaluator.array_length(value);
    const elements: TypedValue<DataType>[] = [];
    for (let i = 0; i < length; i += 1) {
      elements.push(await evaluator.array_get(value, i));
    }
    return elements;
  }
  const elements: TypedValue<DataType>[] = [];
  let current: TypedValue<DataType> = value;
  while (current.type === DataType.PAIR) {
    elements.push(await evaluator.pair_head(current));
    current = await evaluator.pair_tail(current);
  }
  return elements;
}

/** Unwraps a Conductor PAIR/ARRAY (or throws) into the internal Sound representation. */
async function conductorToSound(evaluator: IDataHandler, value: TypedValue<DataType>): Promise<Sound> {
  const invalid = () => new Error('Expected a Sound (a pair of (pair of left/right waves) and duration)');
  if (!value || !isPairLike(value)) {
    throw invalid();
  }
  const wavesTv = await evaluator.pair_head(value as TypedValue<DataType.PAIR>);
  const durationTv = await evaluator.pair_tail(value as TypedValue<DataType.PAIR>);
  if (!isPairLike(wavesTv) || durationTv.type !== DataType.NUMBER) {
    throw invalid();
  }
  const leftTv = await evaluator.pair_head(wavesTv as TypedValue<DataType.PAIR>);
  const rightTv = await evaluator.pair_tail(wavesTv as TypedValue<DataType.PAIR>);
  if (leftTv.type !== DataType.CLOSURE || rightTv.type !== DataType.CLOSURE) {
    throw invalid();
  }
  const leftWave = closureToWave(evaluator, leftTv);
  // leftTv/rightTv are fresh TypedValue wrappers either way, but .value is just a numeric closure
  // id - if it's the same id, this is a mono Sound and should stay that way (same Wave reference)
  // rather than getting two distinct-but-identical wrappers around it.
  const rightWave = leftTv.value === rightTv.value ? leftWave : closureToWave(evaluator, rightTv);
  return { leftWave, rightWave, duration: durationTv.value };
}

/** Walks a Conductor LIST of Sounds (either shape - see `readListElements`) into a plain array. */
async function conductorListToSounds(evaluator: IDataHandler, value: TypedValue<DataType>): Promise<Sound[]> {
  const elements = await readListElements(evaluator, value);
  const sounds: Sound[] = [];
  for (const element of elements) {
    sounds.push(await conductorToSound(evaluator, element));
  }
  return sounds;
}

/**
 * Wraps an internal SoundTransformer (Sound -> Sound) as a Conductor closure (PAIR -> PAIR).
 * `transformer` itself never touches user closures directly (adsr/phase_mod/pan/pan_mod are pure
 * math over the Sound's waves), so no yield*-threading is needed at this specific boundary - the
 * transformer's body runs synchronously up to the point where it constructs new generator-based
 * Waves, which are only actually driven (and potentially yield) once those Waves get sampled later.
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

/**
 * Wraps a nullary `() => Promise<Sound>` "sound promise" as a Conductor closure - calling it from
 * Source genuinely waits for the recording to finish processing before returning, rather than
 * needing to be called again later.
 */
async function soundPromiseToConductor(evaluator: IDataHandler, promise: () => Promise<Sound>): Promise<TypedValue<DataType.CLOSURE>> {
  return evaluator.closure_make({ returnType: DataType.PAIR, args: [] }, async function* () {
    return soundToConductor(evaluator, await promise());
  });
}

export default class SoundModulePlugin extends BaseModulePlugin {
  id = 'sound';
  override exportedNames = [
    'adsr',
    'bell',
    'cello',
    'consecutively',
    'get_duration',
    'get_left_wave',
    'get_right_wave',
    'get_wave',
    'init_record',
    'is_sound',
    'make_sound',
    'make_stereo_sound',
    'noise_sound',
    'noise_wave',
    'pan',
    'pan_mod',
    'phase_mod',
    'piano',
    'play',
    'play_wave',
    'play_waves',
    'record',
    'record_for',
    'sawtooth_sound',
    'sawtooth_wave',
    'silence_sound',
    'silence_wave',
    'simultaneously',
    'sine_sound',
    'sine_wave',
    'square_sound',
    'square_wave',
    'squash',
    'stacking_adsr',
    'stop',
    'triangle_sound',
    'triangle_wave',
    'trombone',
    'violin'
  ] as const;
  static override channelAttach = [SOUND_CHANNEL_ID];

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

  @moduleMethod([DataType.CLOSURE, DataType.CLOSURE, DataType.NUMBER], DataType.PAIR)
  async* make_stereo_sound(
    left_wave: TypedValue<DataType.CLOSURE>,
    right_wave: TypedValue<DataType.CLOSURE>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(
      this.evaluator,
      make_stereo_sound_func(closureToWave(this.evaluator, left_wave), closureToWave(this.evaluator, right_wave), duration.value)
    );
  }

  @moduleMethod([DataType.PAIR], DataType.CLOSURE)
  async* get_wave(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const internal = await conductorToSound(this.evaluator, sound);
    return waveToConductorClosure(this.evaluator, get_wave_func(internal));
  }

  @moduleMethod([DataType.PAIR], DataType.CLOSURE)
  async* get_left_wave(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const internal = await conductorToSound(this.evaluator, sound);
    return waveToConductorClosure(this.evaluator, get_left_wave_func(internal));
  }

  @moduleMethod([DataType.PAIR], DataType.CLOSURE)
  async* get_right_wave(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const internal = await conductorToSound(this.evaluator, sound);
    return waveToConductorClosure(this.evaluator, get_right_wave_func(internal));
  }

  @moduleMethod([DataType.PAIR], DataType.NUMBER)
  async* get_duration(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const internal = await conductorToSound(this.evaluator, sound);
    return { type: DataType.NUMBER, value: get_duration_func(internal) };
  }

  // No declared arg type: is_sound is a predicate that must accept a value of any Conductor
  // DataType (not just PAIR/ARRAY) and answer false rather than throw.
  @moduleMethod([], DataType.BOOLEAN)
  async* is_sound(value?: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType.BOOLEAN>, undefined> {
    if (!value || !isPairLike(value)) {
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
    return { type: DataType.CONST_STRING, value: await init_record_func() };
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

  @moduleMethod([DataType.CLOSURE, DataType.CLOSURE, DataType.NUMBER], DataType.PAIR)
  async* play_waves(
    left_wave: TypedValue<DataType.CLOSURE>,
    right_wave: TypedValue<DataType.CLOSURE>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    this.__ensureTabLoaded();
    const result = yield* play_waves_func(closureToWave(this.evaluator, left_wave), closureToWave(this.evaluator, right_wave), duration.value);
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

  @moduleMethod([], DataType.CLOSURE)
  async* noise_wave(): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return waveToConductorClosure(this.evaluator, noise_wave_func());
  }

  @moduleMethod([DataType.NUMBER], DataType.PAIR)
  async* noise_sound(duration: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, noise_sound_func(duration.value));
  }

  @moduleMethod([], DataType.CLOSURE)
  async* silence_wave(): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return waveToConductorClosure(this.evaluator, silence_wave_func());
  }

  @moduleMethod([DataType.NUMBER], DataType.PAIR)
  async* silence_sound(duration: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, silence_sound_func(duration.value));
  }

  @moduleMethod([DataType.NUMBER], DataType.CLOSURE)
  async* sine_wave(freq: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return waveToConductorClosure(this.evaluator, sine_wave_func(freq.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* sine_sound(
    freq: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, sine_sound_func(freq.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER], DataType.CLOSURE)
  async* square_wave(freq: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return waveToConductorClosure(this.evaluator, square_wave_func(freq.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* square_sound(
    freq: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, square_sound_func(freq.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER], DataType.CLOSURE)
  async* triangle_wave(freq: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return waveToConductorClosure(this.evaluator, triangle_wave_func(freq.value));
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.PAIR)
  async* triangle_sound(
    freq: TypedValue<DataType.NUMBER>,
    duration: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    return soundToConductor(this.evaluator, triangle_sound_func(freq.value, duration.value));
  }

  @moduleMethod([DataType.NUMBER], DataType.CLOSURE)
  async* sawtooth_wave(freq: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return waveToConductorClosure(this.evaluator, sawtooth_wave_func(freq.value));
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

    const envelopeElements = await readListElements(evaluator, envelopes);
    const envelopeClosures: TypedValue<DataType.CLOSURE>[] = [];
    for (const envelope of envelopeElements) {
      if (envelope.type !== DataType.CLOSURE) {
        throw new EvaluatorParameterTypeError('stacking_adsr', 'envelopes', 'a list of functions', envelope.value);
      }
      envelopeClosures.push(envelope);
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

  @moduleMethod([DataType.PAIR], DataType.PAIR)
  async* squash(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.PAIR>, undefined> {
    const internal = await conductorToSound(this.evaluator, sound);
    return soundToConductor(this.evaluator, squash_func(internal));
  }

  @moduleMethod([DataType.NUMBER], DataType.CLOSURE)
  async* pan(amount: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return transformerToConductor(this.evaluator, pan_func(amount.value));
  }

  @moduleMethod([DataType.PAIR], DataType.CLOSURE)
  async* pan_mod(modulator: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const internal = await conductorToSound(this.evaluator, modulator);
    return transformerToConductor(this.evaluator, pan_mod_func(internal));
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
