/**
 * Pure, evaluator-free implementations of the sound bundle's functions. `play`/`record`/
 * `record_for`/`init_record`/`stop` are the exception: actual audio I/O (AudioContext output,
 * getUserMedia/MediaRecorder) only works on the browser main thread, not inside Conductor's
 * runner Worker, so those go through the `SoundTabRpc` host bridge (wired up by
 * `SoundModulePlugin` in index.ts, over the module's own `SOUND_CHANNEL_ID` channel) instead of
 * touching those APIs directly. Everything else - oscillators, envelopes, combinators,
 * instruments - is plain math with no evaluator/browser dependency at all.
 *
 * A Sound is always stereo internally (`{leftWave, rightWave, duration}`); "mono" is just the
 * common case, produced by `make_sound`, where `leftWave` and `rightWave` have the same behavior -
 * `leftWave(t) == rightWave(t)` for all `t`. Every combinator below only ever has to deal with this
 * one shape, so combining a "mono" Sound with a genuinely stereo one is a non-issue - there's
 * nothing to convert. `make_sound` itself happens to implement this by giving both channels the
 * same Wave object (`leftWave === rightWave`, a real JS reference), and functions here take
 * advantage of that specific implementation choice where it holds to avoid redundantly recomputing
 * the same wave twice (see `play`, `samplesToSound`) - both for performance and so a user-supplied
 * wave's steps aren't doubled up for no reason. That's an implementation detail this file relies
 * on, not something the Sound Discipline promises a cadet program - two Waves with identical
 * behavior aren't required to be the same reference.
 *
 * Functions that sample a Wave (anything that might end up calling a user-supplied wave function
 * via a Conductor closure) are generators that `yield*` through nested wave calls, rather than
 * plain async functions, so that stepping/breakpoints inside a student's own wave function are
 * preserved all the way up to whatever's driving the top-level CSE machine. Only the outermost
 * orchestration functions (`record`/`record_for`/`play_recording_signal`), which never touch user
 * code, drain a generator down to a plain Promise for convenience.
 *
 * @module sound
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */
import { midi_note_to_frequency } from '@sourceacademy/bundle-midi/functions';
import { EvaluatorParameterTypeError, EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { delay } from 'es-toolkit/promise';
import type { SoundTabRpc } from './protocol';
import type { Sound, SoundProducer, SoundTransformer, SyncWave, Wave } from './types';

export const FS: number = 44100; // Output sample rate
const fourier_expansion_level: number = 5;
/** duration of recording signal in milliseconds */
const recording_signal_ms = 100;
/** duration of pause after "record"/"record_for" before recording signal is played */
const pre_recording_signal_pause_ms = 200;

interface BundleGlobalVars {
  /**
   * Can be one of 3 values:
   * 1. `null`: `init_record` has not been called
   * 2. `true`: `init_record` has been called and allowed permission
   * 3. `false`: `init_record` has been called and disallowed permission
   */
  micPermissionGranted: boolean | null;
  /**
   * Number of play()s currently sampling and/or actually playing through the host - repeated or
   * looped play() calls stack (play concurrently) rather than erroring, so this is a count rather
   * than a single flag. record()/record_for() still refuse to start while this is nonzero, to avoid
   * the mic picking up whatever's playing through the speakers.
   */
  activePlayCount: number;
}

export const globalVars: BundleGlobalVars = {
  micPermissionGranted: null,
  activePlayCount: 0
};

/**
 * Bumped only by stop(), so a play() already in flight when stop() is called recognises its own
 * completion as stale and skips decrementing activePlayCount a second time - stop() already reset
 * the count to 0 immediately, and by then a new, unrelated play() may have started and be relying
 * on that count itself.
 */
let playGeneration = 0;

let soundIO: SoundTabRpc | undefined;

/** Wires up the host bridge. Called once by {@link SoundModulePlugin}'s constructor. */
export function setSoundIO(bridge: SoundTabRpc): void {
  soundIO = bridge;
}

function io(): SoundTabRpc {
  if (!soundIO) {
    throw new EvaluatorRuntimeError('Sound I/O bridge is not initialised');
  }
  return soundIO;
}

/**
 * Fully resolves a generator, discarding intermediate yields. Only safe for generators that
 * never wrap user-supplied code (see the module doc comment above).
 */
async function drainGenerator<T>(generator: AsyncGenerator<void, T, undefined>): Promise<T> {
  let next = await generator.next();
  while (!next.done) {
    next = await generator.next();
  }
  return next.value;
}

// linear decay from 1 to 0 over decay_period
function linear_decay(decay_period: number): (t: number) => number {
  return t => {
    if (decay_period <= 0 || t > decay_period || t < 0) {
      return 0;
    }
    return 1 - t / decay_period;
  };
}

function validateDuration(func_name: string, duration: unknown): asserts duration is number {
  if (typeof duration !== 'number') {
    throw new EvaluatorParameterTypeError(func_name, 'duration', 'number', duration);
  }
  if (!Number.isFinite(duration) || duration < 0) {
    throw new EvaluatorRuntimeError(`${func_name}: Sound duration must be a finite number greater than or equal to 0`);
  }
}

function validateWave(func_name: string, wave: unknown, lr?: 'left' | 'right'): asserts wave is Wave {
  if (typeof wave !== 'function') {
    throw new EvaluatorParameterTypeError(func_name, lr === undefined ? 'wave' : `${lr} wave`, 'a wave', wave);
  }
}

/**
 * Validates adsr()'s ratio/level parameters. attack_ratio/decay_ratio/release_ratio must each be a
 * finite number in [0, 1], their sum must not exceed 1 (they carve up the Sound's duration into
 * disjoint phases - overlapping attack/decay with release produces a discontinuous jump rather than
 * a smooth envelope), and sustain_level must be a finite number in [0, 1].
 */
function validateAdsrParams(
  func_name: string,
  attack_ratio: unknown,
  decay_ratio: unknown,
  sustain_level: unknown,
  release_ratio: unknown
): void {
  const ratios: [string, unknown][] = [
    ['attack_ratio', attack_ratio],
    ['decay_ratio', decay_ratio],
    ['release_ratio', release_ratio]
  ];
  for (const [name, ratio] of ratios) {
    if (typeof ratio !== 'number' || !Number.isFinite(ratio)) {
      throw new EvaluatorParameterTypeError(func_name, name, 'number', ratio);
    }
    if (ratio < 0 || ratio > 1) {
      throw new EvaluatorRuntimeError(`${func_name}: ${name} must be between 0 and 1, got ${ratio}`);
    }
  }
  if (typeof sustain_level !== 'number' || !Number.isFinite(sustain_level)) {
    throw new EvaluatorParameterTypeError(func_name, 'sustain_level', 'number', sustain_level);
  }
  if (sustain_level < 0 || sustain_level > 1) {
    throw new EvaluatorRuntimeError(`${func_name}: sustain_level must be between 0 and 1, got ${sustain_level}`);
  }
  const total = (attack_ratio as number) + (decay_ratio as number) + (release_ratio as number);
  if (total > 1) {
    throw new EvaluatorRuntimeError(
      `${func_name}: attack_ratio + decay_ratio + release_ratio must not exceed 1, got ${total}`
    );
  }
}

// ---------------------------------------------
// Core Sound representation
// ---------------------------------------------

/**
 * Builds a Wave out of a plain synchronous function - the fast path for waves that never need to
 * cross into user code (see `Wave.sync`'s doc in types.ts). The generator wrapper is still
 * provided so `wave(t)` keeps working exactly as before anywhere `sync` isn't checked.
 */
function syncWave(fn: SyncWave): Wave {
  const wave = (async function* (t: number) {
    return fn(t);
  }) as Wave;
  return Object.assign(wave, { sync: fn });
}

/** Wraps `wave` so that it (and anything sampling it) reads 0 once `t` reaches `duration`. */
function clipToDuration(wave: Wave, duration: number): Wave {
  if (wave.sync) {
    const sync = wave.sync;
    return syncWave(t => (t >= duration ? 0 : sync(t)));
  }
  return async function* (t: number) {
    if (t >= duration) {
      return 0;
    }
    return yield* wave(t);
  };
}

/**
 * Makes a stereo Sound with given left/right wave functions and duration. Each wave function is a
 * function: number -> number that takes in a non-negative input time and returns an amplitude
 * between -1 and 1.
 * @example make_stereo_sound(t => Math.sin(2 * Math.PI * 440 * t), t => Math.sin(2 * Math.PI * 300 * t), 5);
 */
export function make_stereo_sound(left_wave: Wave, right_wave: Wave, duration: number): Sound {
  validateDuration('make_stereo_sound', duration);
  validateWave('make_stereo_sound', left_wave, 'left');
  validateWave('make_stereo_sound', right_wave, 'right');
  const leftWave = clipToDuration(left_wave, duration);
  // Preserves the "mono means leftWave === rightWave" invariant instead of just happening to
  // behave the same: lets play/samplesToSound/etc. sample a mono Sound's wave once instead of
  // twice.
  const rightWave = left_wave === right_wave ? leftWave : clipToDuration(right_wave, duration);
  return { leftWave, rightWave, duration };
}

/**
 * Makes a Sound with given wave function and duration, using the same wave for both channels.
 * The wave function is a function: number -> number that takes in a non-negative input time and
 * returns an amplitude between -1 and 1.
 * @example make_sound(t => Math.sin(2 * Math.PI * 440 * t), 5);
 */
export function make_sound(wave: Wave, duration: number): Sound {
  validateDuration('make_sound', duration);
  validateWave('make_sound', wave);
  return make_stereo_sound(wave, wave, duration);
}

/** Accesses the left channel's wave function of a given Sound. */
export function get_left_wave(sound: Sound): Wave {
  return sound.leftWave;
}

/**
 * Accesses the wave function of a given Sound. Meaningful for any Sound built via `make_sound`
 * (where the left and right wave functions have the same behavior) - for a Sound built via
 * `make_stereo_sound` with channels that don't, this returns the left channel; use
 * `get_left_wave`/`get_right_wave` to be explicit about which channel you mean.
 */
export function get_wave(sound: Sound): Wave {
  return get_left_wave(sound);
}

/** Accesses the right channel's wave function of a given Sound. */
export function get_right_wave(sound: Sound): Wave {
  return sound.rightWave;
}

/** Accesses the duration of a given Sound. */
export function get_duration(sound: Sound): number {
  return sound.duration;
}

/** Checks if the argument is a Sound. */
export function is_sound(x: unknown): x is Sound {
  return (
    typeof x === 'object'
    && x !== null
    && typeof (x as Sound).leftWave === 'function'
    && typeof (x as Sound).rightWave === 'function'
    && typeof (x as Sound).duration === 'number'
  );
}

// ---------------------------------------------
// Playback and recording (host-bridged)
// ---------------------------------------------

/** Samples `wave` at FS Hz for `duration` seconds into a clipped, smoothed PCM buffer. */
async function* sampleWave(wave: Wave, duration: number): AsyncGenerator<void, Float32Array<ArrayBuffer>, undefined> {
  const length = Math.ceil(FS * duration);
  const channel = new Float32Array(length);
  let prev_value = 0;
  const sync = wave.sync;
  for (let i = 0; i < length; i += 1) {
    // The fast path: no generator allocation, no Promise, no microtask per sample - see
    // `Wave.sync`'s doc in types.ts. Falls back to the yield*-driven path (which threads a
    // student-supplied wave's steps up to the CSE machine) the moment `sync` is unset.
    let temp = sync ? sync(i / FS) : yield* wave(i / FS);
    if (temp > 1) {
      temp = 1;
    } else if (temp < -1) {
      temp = -1;
    }
    if (temp === 0 && Math.abs(temp - prev_value) > 0.01) {
      temp = prev_value * 0.999;
    }
    channel[i] = temp;
    prev_value = temp;
  }
  return channel;
}

/** Builds a Wave that linearly interpolates between recorded PCM samples. */
function interpolatedWave(samples: Float32Array<ArrayBuffer>, sampleRate: number): Wave {
  return syncWave(t => {
    const index = t * sampleRate;
    const lowerIndex = Math.floor(index);
    const upperIndex = lowerIndex + 1;
    const ratio = index - lowerIndex;
    const upper = samples[upperIndex] ?? 0;
    const lower = samples[lowerIndex] ?? 0;
    return lower * (1 - ratio) + upper * ratio;
  });
}

/** Wraps recorded PCM sample(s) into a Sound. */
function samplesToSound(left: Float32Array<ArrayBuffer>, right: Float32Array<ArrayBuffer>, sampleRate: number): Sound {
  const duration = left.length / sampleRate;
  const leftWave = interpolatedWave(left, sampleRate);
  const rightWave = right === left ? leftWave : interpolatedWave(right, sampleRate);
  return make_stereo_sound(leftWave, rightWave, duration);
}

// Never touches user code (always plays a fixed internal sine_sound), so draining to a plain
// Promise here is safe - there's no stepping/breakpoint visibility to lose.
function play_recording_signal(): Promise<Sound> {
  return drainGenerator(play(sine_sound(1200, recording_signal_ms / 1000)));
}

/**
 * Initialize recording by obtaining permission to use the default device microphone. Waits for
 * the user to actually respond to the (host-shown) permission prompt before returning, so a script
 * can safely call record()/record_for() right on the next line without racing the asynchronous
 * permission grant - calling init_record() and then immediately record() used to intermittently
 * fail with "Call init_record()..." even though permission had genuinely just been granted,
 * because record() ran before the prompt had actually been answered.
 * @returns string describing the outcome: "permission granted" or "permission denied"
 */
export async function init_record(): Promise<string> {
  const granted = await io().requestMicPermission();
  globalVars.micPermissionGranted = granted;
  return granted ? 'permission granted' : 'permission denied';
}

function assertMicPermission(func_name: string): void {
  if (globalVars.micPermissionGranted === null) {
    throw new EvaluatorRuntimeError(`${func_name}: Call init_record(); to obtain permission to use microphone`);
  }
  if (globalVars.micPermissionGranted === false) {
    throw new EvaluatorRuntimeError(
      `${func_name}: Permission has been denied.\nRe-start browser and call init_record();\nto obtain permission to use microphone.`
    );
  }
}

/**
 * Records a sound until the returned stop function is called. Takes a buffer duration (in
 * seconds) as argument, and returns a nullary stop function. Calling the stop function returns a
 * Sound promise (a nullary function that waits for the recording to finish processing before
 * returning the recorded Sound - so evaluation genuinely pauses there rather than needing to be
 * called again later). The recorded Sound uses however many channels the input device actually
 * has - a mono microphone (by far the most common case) produces a Sound whose left and right
 * wave functions have the same behavior.
 *
 * @example
 * ```ts
 * init_record();
 * const stop = record(0.5); // record after 0.5 seconds.
 * const promise = stop();   // stop recording and get sound promise
 * const sound = promise();  // waits for processing to finish, then retrieves the recorded Sound
 * play(sound);              // and do whatever with it
 * ```
 * @param buffer pause before recording, in seconds
 */
export function record(buffer: number): () => () => Promise<Sound> {
  validateDuration('record', buffer);
  if (globalVars.activePlayCount > 0) {
    throw new EvaluatorRuntimeError(`${record.name}: Cannot record while another sound is playing!`);
  }
  assertMicPermission('record');

  const started = (async () => {
    await delay(pre_recording_signal_pause_ms + buffer * 1000);
    await play_recording_signal();
    await delay(recording_signal_ms);
    await io().startRecording();
  })();

  return () => {
    const recordingDone: Promise<Sound> = started
      .then(() => io().stopRecording())
      .then(({ left, right, sampleRate }) => samplesToSound(left, right, sampleRate));
    void play_recording_signal();
    return () => recordingDone;
  };
}

/**
 * Records a sound of a given duration. Returns a Sound promise. Uses however many channels the
 * input device actually has, same as `record`.
 *
 * How the function behaves in detail:
 * 1. `record_for` is called.
 * 2. The function waits for the given buffer duration.
 * 3. The recording signal is played.
 * 4. Recording begins when the recording signal finishes.
 * 5. The recording signal plays to signal the end after the given duration.
 *
 * @example
 * ```ts
 * init_record();
 * const promise = record_for(2, 0.5); // begin recording after 0.5s for 2s
 * const sound = promise();            // waits for it to finish, then retrieves the recorded Sound
 * play(sound);                        // and do whatever with it
 * ```
 * @param duration duration in seconds
 * @param buffer pause before recording, in seconds
 */
export function record_for(duration: number, buffer: number): () => Promise<Sound> {
  validateDuration('record_for', duration);
  validateDuration('record_for', buffer);
  if (globalVars.activePlayCount > 0) {
    throw new EvaluatorRuntimeError(`${record_for.name}: Cannot record while another sound is playing!`);
  }
  assertMicPermission('record_for');

  // order of events for record_for:
  // pre-recording-signal pause | recording signal |
  // pre-recording pause | recording | recording signal
  const recordingDone: Promise<Sound> = (async () => {
    await delay(pre_recording_signal_pause_ms);
    await play_recording_signal();
    await delay(recording_signal_ms + buffer * 1000);
    await io().startRecording();
    await delay(duration * 1000);
    const { left, right, sampleRate } = await io().stopRecording();
    void play_recording_signal();
    return samplesToSound(left, right, sampleRate);
  })();

  return () => recordingDone;
}

/**
 * Plays the given Wave using the computer's sound device, for the duration given in seconds, on
 * both channels.
 * @example play_wave(t => Math.sin(t * 3000), 5);
 */
export async function* play_wave(wave: Wave, duration: number): AsyncGenerator<void, Sound, undefined> {
  validateDuration('play_wave', duration);
  validateWave('play_wave', wave);
  return yield* play(make_sound(wave, duration));
}

/**
 * Plays the given left/right Waves using the computer's sound device, for the duration given in
 * seconds.
 * @example play_waves(t => Math.sin(t * 3000), t => Math.sin(t * 6000), 5);
 */
export async function* play_waves(left_wave: Wave, right_wave: Wave, duration: number): AsyncGenerator<void, Sound, undefined> {
  validateDuration('play_waves', duration);
  validateWave('play_waves', left_wave, 'left');
  validateWave('play_waves', right_wave, 'right');
  return yield* play(make_stereo_sound(left_wave, right_wave, duration));
}

/**
 * Plays the given Sound using the computer's sound device, queued after any Sounds that are
 * currently playing or already queued - like consecutively, but built up call-by-call rather than
 * pre-combined into one Sound, so repeated/looped play() calls play one after another instead of
 * overlapping. Returns (without waiting for playback to finish) once the sound has been queued,
 * matching the original module's fire-and-forget behaviour.
 *
 * The actual queueing (so playback doesn't overlap) happens on the host side (see
 * `SoundTabPlugin.playSamples`), not here - this Run's evaluator Worker is terminated as soon as
 * the program finishes, which can happen well before a sound that's still queued behind another
 * gets its turn. Deferring the RPC call itself until then would silently drop it. Instead, every
 * play() dispatches its playSamples() call immediately once sampling finishes, so the message is
 * always sent before the Worker can be torn down; only the host, which outlives the Worker, needs
 * to actually sequence playback.
 * @example play(sine_sound(440, 5));
 */
export async function* play(sound: Sound): AsyncGenerator<void, Sound, undefined> {
  if (!is_sound(sound)) {
    throw new EvaluatorParameterTypeError(play.name, 'sound', 'a Sound', sound);
  }

  const { duration } = sound;
  if (duration < 0) {
    throw new EvaluatorRuntimeError(`${play.name}: duration of sound is negative`);
  }
  if (duration === 0) {
    return sound;
  }

  // Sampling the whole duration into a buffer happens before playback can start at all, and takes
  // time proportional to duration - tell the tab now so it can show that as distinct from idle,
  // rather than looking stalled during what can be a noticeable wait for longer sounds. Awaited
  // (not fire-and-forget) so this can't race the tab's own (possibly still in-progress) loading.
  await io().notifyConstructing();
  const leftSamples = yield* sampleWave(sound.leftWave, duration);
  // Mono sounds have leftWave === rightWave: sample once instead of twice.
  const rightSamples = sound.rightWave === sound.leftWave ? leftSamples : yield* sampleWave(sound.rightWave, duration);
  globalVars.activePlayCount += 1;
  const generation = playGeneration;
  // Fire-and-forget from the caller's perspective (matching the original's non-blocking
  // semantics) - the script continues without waiting for this to settle.
  void (async () => {
    try {
      await io().playSamples(leftSamples, rightSamples, FS);
    } finally {
      // If stop() happened in the meantime, `generation` is stale: stop() already reset the count
      // to 0, and by now a new, unrelated play() may have started and be relying on it itself.
      if (generation === playGeneration) {
        globalVars.activePlayCount = Math.max(0, globalVars.activePlayCount - 1);
      }
    }
  })();
  return sound;
}

/** Stops all currently playing sounds, and cancels any that were queued behind them. */
export function stop(): void {
  io().$stopPlayback();
  globalVars.activePlayCount = 0;
  playGeneration += 1;
}

// ---------------------------------------------
// Oscillators
// ---------------------------------------------
//
// Each `*_wave` function returns a bare, duration-independent Wave; the corresponding `*_sound`
// function is a thin convenience wrapper: `sine_sound(freq, duration) = make_sound(sine_wave(freq), duration)`.

/** A wave that is a random value every `1/FS` seconds. */
export function noise_wave(): Wave {
  return syncWave(() => Math.random() * 2 - 1);
}

/** Makes noise: a random wave sampled every `1/FS` seconds. */
export function noise_sound(duration: number): Sound {
  validateDuration('noise_sound', duration);
  return make_sound(noise_wave(), duration);
}

/** A wave that is always 0. */
export function silence_wave(): Wave {
  return syncWave(() => 0);
}

/** Makes a silence Sound with given duration. */
export function silence_sound(duration: number): Sound {
  validateDuration('silence_sound', duration);
  return make_sound(silence_wave(), duration);
}

/** A sine wave of the given frequency. */
export function sine_wave(freq: number): Wave {
  return syncWave(t => Math.sin(2 * Math.PI * t * freq));
}

/** Makes a sine wave Sound with given frequency and duration. */
export function sine_sound(freq: number, duration: number): Sound {
  validateDuration('sine_sound', duration);
  return make_sound(sine_wave(freq), duration);
}

/** A square wave of the given frequency, approximated via a Fourier expansion. */
export function square_wave(freq: number): Wave {
  function fourier_expansion_square(t: number) {
    let answer = 0;
    for (let i = 1; i <= fourier_expansion_level; i += 1) {
      answer += Math.sin(2 * Math.PI * (2 * i - 1) * freq * t) / (2 * i - 1);
    }
    return answer;
  }
  return syncWave(t => (4 / Math.PI) * fourier_expansion_square(t));
}

/** Makes a square wave Sound with given frequency and duration. */
export function square_sound(freq: number, duration: number): Sound {
  validateDuration('square_sound', duration);
  return make_sound(square_wave(freq), duration);
}

/** A triangle wave of the given frequency, approximated via a Fourier expansion. */
export function triangle_wave(freq: number): Wave {
  function fourier_expansion_triangle(t: number) {
    let answer = 0;
    for (let i = 0; i < fourier_expansion_level; i += 1) {
      answer
        += ((-1) ** i * Math.sin((2 * i + 1) * t * freq * Math.PI * 2))
        / (2 * i + 1) ** 2;
    }
    return answer;
  }
  return syncWave(t => (8 / Math.PI / Math.PI) * fourier_expansion_triangle(t));
}

/** Makes a triangle wave Sound with given frequency and duration. */
export function triangle_sound(freq: number, duration: number): Sound {
  validateDuration('triangle_sound', duration);
  return make_sound(triangle_wave(freq), duration);
}

/** A sawtooth wave of the given frequency, approximated via a Fourier expansion. */
export function sawtooth_wave(freq: number): Wave {
  function fourier_expansion_sawtooth(t: number) {
    let answer = 0;
    for (let i = 1; i <= fourier_expansion_level; i += 1) {
      answer += Math.sin(2 * Math.PI * i * freq * t) / i;
    }
    return answer;
  }
  return syncWave(t => 1 / 2 - (1 / Math.PI) * fourier_expansion_sawtooth(t));
}

/** Makes a sawtooth wave Sound with given frequency and duration. */
export function sawtooth_sound(freq: number, duration: number): Sound {
  validateDuration('sawtooth_sound', duration);
  return make_sound(sawtooth_wave(freq), duration);
}

// ---------------------------------------------
// Composition Operators
// ---------------------------------------------

/**
 * Builds a Wave that picks whichever sound is "active" at time `t` and delegates directly into
 * it - a flat scan rather than a chain of nested joins, so sampling stays a single `yield*` hop
 * deep no matter how many sounds are chained (nesting `sounds.length` joins would mean up to
 * `sounds.length` nested generator delegations per sample, at 44100 samples/sec).
 */
function consecutiveWave(sounds: Sound[], channel: (s: Sound) => Wave): Wave {
  const waves = sounds.map(channel);
  if (waves.every(w => w.sync)) {
    const syncs = waves.map(w => w.sync as SyncWave);
    return syncWave(t => {
      let remaining = t;
      for (let i = 0; i < sounds.length; i += 1) {
        if (remaining < sounds[i].duration) {
          return syncs[i](remaining);
        }
        remaining -= sounds[i].duration;
      }
      return 0;
    });
  }
  return async function* (t: number) {
    let remaining = t;
    for (let i = 0; i < sounds.length; i += 1) {
      if (remaining < sounds[i].duration) {
        return yield* waves[i](remaining);
      }
      remaining -= sounds[i].duration;
    }
    return 0;
  };
}

/**
 * Makes a new Sound by combining the sounds in a given list where the second Sound is appended
 * to the end of the first Sound, the third Sound is appended to the end of the second Sound, and
 * so on. The effect is that the Sounds in the list are joined end-to-end.
 * @example consecutively([sine_sound(200, 2), sine_sound(400, 3)]);
 */
export function consecutively(sounds: Sound[]): Sound {
  if (sounds.length === 0) {
    return silence_sound(0);
  }
  const total_duration = sounds.reduce((acc, s) => acc + s.duration, 0);
  const leftWave = consecutiveWave(sounds, s => s.leftWave);
  // Keeps a chain of entirely-mono Sounds mono (same reference for both channels) instead of
  // building two behaviourally-identical-but-distinct waves, so play/etc. still only sample once.
  const rightWave = sounds.every(s => s.leftWave === s.rightWave)
    ? leftWave
    : consecutiveWave(sounds, s => s.rightWave);
  return make_stereo_sound(leftWave, rightWave, total_duration);
}

/**
 * Builds a Wave that sums every sound's (still-active) sample at time `t` and divides by the
 * count - a flat scan rather than a chain of nested sums, for the same reason as
 * `consecutiveWave` above.
 */
function simultaneousWave(sounds: Sound[], channel: (s: Sound) => Wave): Wave {
  const count = sounds.length;
  const waves = sounds.map(channel);
  if (waves.every(w => w.sync)) {
    const syncs = waves.map(w => w.sync as SyncWave);
    return syncWave(t => {
      let sum = 0;
      for (let i = 0; i < sounds.length; i += 1) {
        if (t <= sounds[i].duration) {
          sum += syncs[i](t);
        }
      }
      return sum / count;
    });
  }
  return async function* (t: number) {
    let sum = 0;
    for (let i = 0; i < sounds.length; i += 1) {
      if (t <= sounds[i].duration) {
        sum += yield* waves[i](t);
      }
    }
    return sum / count;
  };
}

/**
 * Makes a new Sound by combining the Sounds in a given list. In the result sound, the component
 * sounds overlap such that they start at the beginning of the result sound. To achieve this, the
 * amplitudes of the component sounds are added together and then divided by the length of the
 * list.
 * @example simultaneously([sine_sound(200, 2), sine_sound(400, 3)]);
 */
export function simultaneously(sounds: Sound[]): Sound {
  if (sounds.length === 0) {
    return silence_sound(0);
  }
  const max_duration = Math.max(...sounds.map(s => s.duration));
  const leftWave = simultaneousWave(sounds, s => s.leftWave);
  const rightWave = sounds.every(s => s.leftWave === s.rightWave)
    ? leftWave
    : simultaneousWave(sounds, s => s.rightWave);
  return make_stereo_sound(leftWave, rightWave, max_duration);
}

/** Shapes `wave` according to the given ADSR envelope timings. */
function adsrWave(
  wave: Wave,
  duration: number,
  attack_time: number,
  decay_time: number,
  sustain_level: number,
  release_time: number
): Wave {
  // The envelope multiplier at `x`, independent of `wave` - shared by both the fast and
  // yield*-driven paths below so the branching logic exists exactly once.
  function envelopeAt(x: number): number {
    if (x < attack_time) {
      return x / attack_time;
    }
    if (x < attack_time + decay_time) {
      return (1 - sustain_level) * linear_decay(decay_time)(x - attack_time) + sustain_level;
    }
    if (x < duration - release_time) {
      return sustain_level;
    }
    return sustain_level * linear_decay(release_time)(x - (duration - release_time));
  }
  if (wave.sync) {
    const sync = wave.sync;
    return syncWave(x => envelopeAt(x) * sync(x));
  }
  return async function* (x: number) {
    return envelopeAt(x) * (yield* wave(x));
  };
}

/**
 * Returns an envelope: a function from Sound to Sound. When the adsr envelope is applied to a
 * Sound, it returns a new Sound with its amplitude modified according to parameters, applied to
 * each channel independently. The relative amplitude increases from 0 to 1 linearly over the
 * attack proportion, then decreases from 1 to sustain level over the decay proportion, and
 * remains at that level until the release proportion when it decays back to 0.
 * @param attack_ratio proportion of Sound in attack phase
 * @param decay_ratio proportion of Sound decay phase
 * @param sustain_level sustain level between 0 and 1
 * @param release_ratio proportion of Sound in release phase
 * @example adsr(0.2, 0.3, 0.3, 0.1)(sound);
 */
/**
 * The actual envelope-shaping logic behind adsr(), without the student-facing parameter
 * validation. Used both by the public adsr() (validated) and directly by this file's own
 * instrument definitions (piano/violin/cello/trombone/bell), whose envelope values were tuned once
 * and shipped as part of the original (pre-Conductor) sound module - trombone's second harmonic in
 * particular has summed to just over 1 (1.0236) for as long as that instrument has existed, and
 * changing it now would silently alter its timbre from what students have always heard.
 */
function adsrTransformer(
  attack_ratio: number,
  decay_ratio: number,
  sustain_level: number,
  release_ratio: number
): SoundTransformer {
  return sound => {
    const { duration } = sound;
    const attack_time = duration * attack_ratio;
    const decay_time = duration * decay_ratio;
    const release_time = duration * release_ratio;
    const leftWave = adsrWave(sound.leftWave, duration, attack_time, decay_time, sustain_level, release_time);
    const rightWave = sound.leftWave === sound.rightWave
      ? leftWave
      : adsrWave(sound.rightWave, duration, attack_time, decay_time, sustain_level, release_time);
    return make_stereo_sound(leftWave, rightWave, duration);
  };
}

export function adsr(
  attack_ratio: number,
  decay_ratio: number,
  sustain_level: number,
  release_ratio: number
): SoundTransformer {
  validateAdsrParams('adsr', attack_ratio, decay_ratio, sustain_level, release_ratio);
  return adsrTransformer(attack_ratio, decay_ratio, sustain_level, release_ratio);
}

/**
 * Returns a Sound that results from applying a list of envelopes to a given wave form. The wave
 * form is a Sound generator that takes a frequency and a duration as arguments and produces a
 * Sound with the given frequency and duration. Each envelope is applied to a harmonic: the first
 * harmonic has the given frequency, the second has twice the frequency, the third three times the
 * frequency etc. The harmonics are then layered simultaneously to produce the resulting Sound.
 * @param waveform function from (frequency, duration) to Sound
 * @param base_frequency frequency of the first harmonic
 * @param duration duration of the produced Sound, in seconds
 * @param envelopes list of envelopes, which are functions from Sound to Sound
 * @example stacking_adsr(sine_sound, 300, 5, [adsr(0.1, 0.3, 0.2, 0.5), adsr(0.2, 0.5, 0.6, 0.1), adsr(0.3, 0.1, 0.7, 0.3)]);
 */
export function stacking_adsr(
  waveform: SoundProducer,
  base_frequency: number,
  duration: number,
  envelopes: SoundTransformer[]
): Sound {
  const harmonics = envelopes.map((envelope, i) => envelope(waveform(base_frequency * (i + 1), duration)));
  return simultaneously(harmonics);
}

/** Modulates the phase of a carrier sine wave of `freq` using `modulatorWave` as the modulator. */
function phaseModWave(modulatorWave: Wave, freq: number, amount: number): Wave {
  if (modulatorWave.sync) {
    const sync = modulatorWave.sync;
    return syncWave(t => Math.sin(2 * Math.PI * t * freq + amount * sync(t)));
  }
  return async function* (t: number) {
    return Math.sin(2 * Math.PI * t * freq + amount * (yield* modulatorWave(t)));
  };
}

/**
 * Returns a Sound transformer which uses its argument to modulate the phase of a (carrier) sine
 * wave of given frequency and duration with a given Sound, applied to each channel independently
 * (using that channel's own wave as the modulator). Modulating with a low frequency Sound results
 * in a vibrato effect. Modulating with a Sound with frequencies comparable to the sine wave
 * frequency results in more complex wave forms.
 * @param freq the frequency of the sine wave to be modulated
 * @param duration the duration of the output Sound
 * @param amount the amount of modulation to apply to the carrier sine wave
 * @example phase_mod(440, 5, 1)(sine_sound(220, 5));
 */
export function phase_mod(freq: number, duration: number, amount: number): SoundTransformer {
  return modulator => {
    const leftWave = phaseModWave(modulator.leftWave, freq, amount);
    const rightWave = modulator.leftWave === modulator.rightWave
      ? leftWave
      : phaseModWave(modulator.rightWave, freq, amount);
    return make_stereo_sound(leftWave, rightWave, duration);
  };
}

// ---------------------------------------------
// Stereo-specific operations
// ---------------------------------------------

/** Multiplies every sample of `wave` by `gain`. */
function gainWave(wave: Wave, gain: number): Wave {
  if (wave.sync) {
    const sync = wave.sync;
    return syncWave(t => gain * sync(t));
  }
  return async function* (t: number) {
    return gain * (yield* wave(t));
  };
}

/**
 * Centers a Sound by averaging its left and right channels, resulting in an effectively mono
 * Sound (both channels are the same, averaged, wave).
 * @param sound the sound to be squashed
 * @returns a new Sound with the left and right channels averaged
 */
export function squash(sound: Sound): Sound {
  const { leftWave, rightWave, duration } = sound;
  let averaged: Wave;
  if (leftWave === rightWave) {
    averaged = leftWave;
  } else if (leftWave.sync && rightWave.sync) {
    const leftSync = leftWave.sync;
    const rightSync = rightWave.sync;
    averaged = syncWave(t => 0.5 * (leftSync(t) + rightSync(t)));
  } else {
    averaged = async function* (t: number) {
      return 0.5 * ((yield* leftWave(t)) + (yield* rightWave(t)));
    };
  }
  return make_sound(averaged, duration);
}

/**
 * Returns a Sound Transformer that pans a sound based on the pan amount. The input sound is
 * first squashed to mono. An amount of `-1` is a hard left pan, `0` is balanced, `1` is hard
 * right pan.
 * @param amount the pan amount, from -1 to 1
 * @returns a Sound Transformer that pans a Sound
 */
export function pan(amount: number): SoundTransformer {
  const clamped = Math.max(-1, Math.min(1, amount));
  return sound => {
    const { leftWave: wave, duration } = squash(sound);
    return make_stereo_sound(
      gainWave(wave, (1 - clamped) / 2),
      gainWave(wave, (1 + clamped) / 2),
      duration
    );
  };
}

/** Modulates the pan amount at time `t` using `modulator`'s two channels, clamped to [-1, 1]. */
function panModAmountWave(modulator: Sound): Wave {
  const { leftWave, rightWave } = modulator;
  if (leftWave.sync && rightWave.sync) {
    const leftSync = leftWave.sync;
    const rightSync = rightWave.sync;
    return syncWave(t => Math.max(-1, Math.min(1, leftSync(t) + rightSync(t))));
  }
  return async function* (t: number) {
    const output = (yield* leftWave(t)) + (yield* rightWave(t));
    return Math.max(-1, Math.min(1, output));
  };
}

/**
 * Returns a Sound Transformer that uses a Sound to pan another Sound. The modulator's two
 * channels are summed and clamped to `[-1, 1]` to compute the pan amount at each point in time.
 * `-1` is a hard left pan, `0` is balanced, `1` is hard right pan.
 * @param modulator the Sound used to modulate the pan of another sound
 * @returns a Sound Transformer that pans a Sound
 */
export function pan_mod(modulator: Sound): SoundTransformer {
  const amountWave = panModAmountWave(modulator);
  return sound => {
    const { leftWave: wave, duration } = squash(sound);
    if (amountWave.sync && wave.sync) {
      const amountSync = amountWave.sync;
      const sync = wave.sync;
      return make_stereo_sound(
        syncWave(t => ((1 - amountSync(t)) / 2) * sync(t)),
        syncWave(t => ((1 + amountSync(t)) / 2) * sync(t)),
        duration
      );
    }
    return make_stereo_sound(
      async function* (t: number) {
        return ((1 - (yield* amountWave(t))) / 2) * (yield* wave(t));
      },
      async function* (t: number) {
        return ((1 + (yield* amountWave(t))) / 2) * (yield* wave(t));
      },
      duration
    );
  };
}

// ---------------------------------------------
// Instruments
// ---------------------------------------------

/** Returns a Sound reminiscent of a bell, playing a given note for a given duration. */
export function bell(note: number, duration: number): Sound {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, [
    adsrTransformer(0, 0.6, 0, 0.05),
    adsrTransformer(0, 0.6618, 0, 0.05),
    adsrTransformer(0, 0.7618, 0, 0.05),
    adsrTransformer(0, 0.9071, 0, 0.05)
  ]);
}

/** Returns a Sound reminiscent of a cello, playing a given note for a given duration. */
export function cello(note: number, duration: number): Sound {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, [
    adsrTransformer(0.05, 0, 1, 0.1),
    adsrTransformer(0.05, 0, 1, 0.15),
    adsrTransformer(0, 0, 0.2, 0.15)
  ]);
}

/** Returns a Sound reminiscent of a piano, playing a given note for a given duration. */
export function piano(note: number, duration: number): Sound {
  return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration, [
    adsrTransformer(0, 0.515, 0, 0.05),
    adsrTransformer(0, 0.32, 0, 0.05),
    adsrTransformer(0, 0.2, 0, 0.05)
  ]);
}

/**
 * Returns a Sound reminiscent of a trombone, playing a given note for a given duration. The second
 * harmonic's envelope ratios sum to just over 1 (1.0236) - a longstanding quirk present in this
 * instrument since before the Conductor migration, preserved here via adsrTransformer (rather than
 * the validated adsr()) so trombone's timbre doesn't silently change.
 */
export function trombone(note: number, duration: number): Sound {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, [
    adsrTransformer(0.2, 0, 1, 0.1),
    adsrTransformer(0.3236, 0.6, 0, 0.1)
  ]);
}

/** Returns a Sound reminiscent of a violin, playing a given note for a given duration. */
export function violin(note: number, duration: number): Sound {
  return stacking_adsr(sawtooth_sound, midi_note_to_frequency(note), duration, [
    adsrTransformer(0.35, 0, 1, 0.15),
    adsrTransformer(0.35, 0, 1, 0.15),
    adsrTransformer(0.45, 0, 1, 0.15),
    adsrTransformer(0.45, 0, 1, 0.15)
  ]);
}
