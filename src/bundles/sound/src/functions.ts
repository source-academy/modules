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
 * common case where `leftWave === rightWave` (the same Wave, by reference), produced by
 * `make_sound`. Every combinator below only ever has to deal with this one shape, so combining a
 * "mono" Sound with a genuinely stereo one is a non-issue - there's nothing to convert. Where
 * `leftWave === rightWave`, functions here avoid redundantly recomputing the same wave twice (see
 * `play`, `samplesToSound`) - both for performance and so a user-supplied wave's steps aren't
 * doubled up for no reason.
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
import type { SoundTabRpc } from './protocol';
import type { Sound, SoundProducer, SoundTransformer, Wave } from './types';

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
  /** Track if a sound is currently playing */
  isPlaying: boolean;
}

export const globalVars: BundleGlobalVars = {
  micPermissionGranted: null,
  isPlaying: false
};

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
    if (t > decay_period || t < 0) {
      return 0;
    }
    return 1 - t / decay_period;
  };
}

function validateDuration(func_name: string, duration: unknown): asserts duration is number {
  if (typeof duration !== 'number') {
    throw new EvaluatorParameterTypeError(func_name, 'duration', 'number', duration);
  }
  if (duration < 0) {
    throw new EvaluatorRuntimeError(`${func_name}: Sound duration must be greater than or equal to 0`);
  }
}

function validateWave(func_name: string, wave: unknown, lr?: 'left' | 'right'): asserts wave is Wave {
  if (typeof wave !== 'function') {
    throw new EvaluatorParameterTypeError(func_name, lr === undefined ? 'wave' : `${lr} wave`, 'a wave', wave);
  }
}

// ---------------------------------------------
// Core Sound representation
// ---------------------------------------------

/** Wraps `wave` so that it (and anything sampling it) reads 0 once `t` reaches `duration`. */
function clipToDuration(wave: Wave, duration: number): Wave {
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
 * (where the left and right channels are the same wave, by construction) - for a Sound built via
 * `make_stereo_sound` with genuinely different channels, this returns the left channel; use
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
  for (let i = 0; i < length; i += 1) {
    let temp = yield* wave(i / FS);
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
  return async function* (t: number) {
    const index = t * sampleRate;
    const lowerIndex = Math.floor(index);
    const upperIndex = lowerIndex + 1;
    const ratio = index - lowerIndex;
    const upper = samples[upperIndex] ?? 0;
    const lower = samples[lowerIndex] ?? 0;
    return lower * (1 - ratio) + upper * ratio;
  };
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
 * Initialize recording by obtaining permission to use the default device microphone.
 * @returns string "obtaining recording permission"
 */
export function init_record(): string {
  void io()
    .requestMicPermission()
    .then(granted => {
      globalVars.micPermissionGranted = granted;
    });
  return 'obtaining recording permission';
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
 * Sound promise (a nullary function that throws until the recording has finished processing,
 * then returns the recorded Sound). The recorded Sound uses however many channels the input
 * device actually has - a mono microphone (by far the most common case) produces a Sound whose
 * left and right channels are the same wave.
 *
 * @example
 * ```ts
 * init_record();
 * const stop = record(0.5); // record after 0.5 seconds.
 * const promise = stop();   // stop recording and get sound promise
 * const sound = promise();  // retrieve the recorded sound
 * play(sound);              // and do whatever with it
 * ```
 * @param buffer pause before recording, in seconds
 */
export function record(buffer: number): () => () => Sound {
  validateDuration('record', buffer);
  if (globalVars.isPlaying) {
    throw new EvaluatorRuntimeError('record: Cannot record while another sound is playing!');
  }
  assertMicPermission('record');

  const started = new Promise<void>(resolve => {
    setTimeout(() => {
      void play_recording_signal().then(() => {
        setTimeout(() => {
          void io()
            .startRecording()
            .then(() => resolve());
        }, recording_signal_ms);
      });
    }, pre_recording_signal_pause_ms + buffer * 1000);
  });

  return () => {
    let recordedSound: Sound | null = null;
    void started
      .then(() => io().stopRecording())
      .then(({ left, right, sampleRate }) => {
        recordedSound = samplesToSound(left, right, sampleRate);
      });
    void play_recording_signal();

    const promise = () => {
      if (recordedSound === null) {
        throw new EvaluatorRuntimeError('recording still being processed');
      }
      return recordedSound;
    };
    return promise;
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
 * const sound = promise();            // retrieve the recorded sound
 * play(sound);                        // and do whatever with it
 * ```
 * @param duration duration in seconds
 * @param buffer pause before recording, in seconds
 */
export function record_for(duration: number, buffer: number): () => Sound {
  validateDuration('record_for', duration);
  validateDuration('record_for', buffer);
  if (globalVars.isPlaying) {
    throw new EvaluatorRuntimeError('record_for: Cannot record while another sound is playing!');
  }
  assertMicPermission('record_for');

  let recordedSound: Sound | null = null;

  // order of events for record_for:
  // pre-recording-signal pause | recording signal |
  // pre-recording pause | recording | recording signal
  setTimeout(() => {
    void play_recording_signal().then(() => {
      setTimeout(() => {
        void io()
          .startRecording()
          .then(() => {
            setTimeout(() => {
              void io()
                .stopRecording()
                .then(({ left, right, sampleRate }) => {
                  recordedSound = samplesToSound(left, right, sampleRate);
                });
              void play_recording_signal();
            }, duration * 1000);
          });
      }, recording_signal_ms + buffer * 1000);
    });
  }, pre_recording_signal_pause_ms);

  const promise = () => {
    if (recordedSound === null) {
      throw new EvaluatorRuntimeError('recording still being processed');
    }
    return recordedSound;
  };
  return promise;
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
 * Plays the given Sound using the computer's sound device on top of any Sounds that are
 * currently playing. Returns (without waiting for playback to finish) once the sound has
 * started, matching the original module's fire-and-forget behaviour.
 * @example play(sine_sound(440, 5));
 */
export async function* play(sound: Sound): AsyncGenerator<void, Sound, undefined> {
  if (!is_sound(sound)) {
    throw new EvaluatorParameterTypeError('play', 'sound', 'a Sound', sound);
  }
  if (globalVars.isPlaying) {
    throw new EvaluatorRuntimeError('play: Previous sound still playing!');
  }

  const { duration } = sound;
  if (duration < 0) {
    throw new EvaluatorRuntimeError('play: duration of sound is negative');
  }
  if (duration === 0) {
    return sound;
  }

  const leftSamples = yield* sampleWave(sound.leftWave, duration);
  // Mono sounds have leftWave === rightWave: sample once instead of twice.
  const rightSamples = sound.rightWave === sound.leftWave ? leftSamples : yield* sampleWave(sound.rightWave, duration);
  globalVars.isPlaying = true;
  // Fire-and-forget: playback runs in the background, matching the original's non-blocking
  // semantics. (Since playSamples() resolves only once the host reports real playback completion,
  // a genuinely blocking `play` is one `await` away should that ever be wanted instead.)
  void io()
    .playSamples(leftSamples, rightSamples, FS)
    .finally(() => {
      globalVars.isPlaying = false;
    });
  return sound;
}

/** Stops all currently playing sounds. */
export function stop(): void {
  io().$stopPlayback();
  globalVars.isPlaying = false;
}

// ---------------------------------------------
// Oscillators
// ---------------------------------------------
//
// Each `*_wave` function returns a bare, duration-independent Wave; the corresponding `*_sound`
// function is a thin convenience wrapper: `sine_sound(freq, duration) = make_sound(sine_wave(freq), duration)`.

/** A wave that is a random value every `1/FS` seconds. */
export function noise_wave(): Wave {
  return async function* (_t: number) {
    return Math.random() * 2 - 1;
  };
}

/** Makes noise: a random wave sampled every `1/FS` seconds. */
export function noise_sound(duration: number): Sound {
  validateDuration('noise_sound', duration);
  return make_sound(noise_wave(), duration);
}

/** A wave that is always 0. */
export function silence_wave(): Wave {
  return async function* (_t: number) {
    return 0;
  };
}

/** Makes a silence Sound with given duration. */
export function silence_sound(duration: number): Sound {
  validateDuration('silence_sound', duration);
  return make_sound(silence_wave(), duration);
}

/** A sine wave of the given frequency. */
export function sine_wave(freq: number): Wave {
  return async function* (t: number) {
    return Math.sin(2 * Math.PI * t * freq);
  };
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
  return async function* (t: number) {
    return (4 / Math.PI) * fourier_expansion_square(t);
  };
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
  return async function* (t: number) {
    return (8 / Math.PI / Math.PI) * fourier_expansion_triangle(t);
  };
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
  return async function* (t: number) {
    return 1 / 2 - (1 / Math.PI) * fourier_expansion_sawtooth(t);
  };
}

/** Makes a sawtooth wave Sound with given frequency and duration. */
export function sawtooth_sound(freq: number, duration: number): Sound {
  validateDuration('sawtooth_sound', duration);
  return make_sound(sawtooth_wave(freq), duration);
}

// ---------------------------------------------
// Composition Operators
// ---------------------------------------------

/** Joins `wave1` (for `duration1` seconds) then `wave2`, both starting at t=0 of their own clock. */
function joinWaves(wave1: Wave, duration1: number, wave2: Wave): Wave {
  return async function* (t: number) {
    return t < duration1 ? yield* wave1(t) : yield* wave2(t - duration1);
  };
}

/**
 * Makes a new Sound by combining the sounds in a given list where the second Sound is appended
 * to the end of the first Sound, the third Sound is appended to the end of the second Sound, and
 * so on. The effect is that the Sounds in the list are joined end-to-end.
 * @example consecutively([sine_sound(200, 2), sine_sound(400, 3)]);
 */
export function consecutively(sounds: Sound[]): Sound {
  return sounds.reduce((acc: Sound, s: Sound) => make_stereo_sound(
    joinWaves(acc.leftWave, acc.duration, s.leftWave),
    joinWaves(acc.rightWave, acc.duration, s.rightWave),
    acc.duration + s.duration
  ), silence_sound(0));
}

/** Sums `wave1` (while `t <= duration1`) and `wave2` (while `t <= duration2`). */
function sumWaves(wave1: Wave, duration1: number, wave2: Wave, duration2: number): Wave {
  return async function* (t: number) {
    let sum = 0;
    if (t <= duration1) {
      sum += yield* wave1(t);
    }
    if (t <= duration2) {
      sum += yield* wave2(t);
    }
    return sum;
  };
}

/** Divides every sample of `wave` by `count`. */
function normalisedWave(wave: Wave, count: number): Wave {
  return async function* (t: number) {
    return (yield* wave(t)) / count;
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
  const mushed_sound = sounds.reduce((acc: Sound, s: Sound) => {
    const new_dur = Math.max(acc.duration, s.duration);
    return make_stereo_sound(
      sumWaves(acc.leftWave, acc.duration, s.leftWave, s.duration),
      sumWaves(acc.rightWave, acc.duration, s.rightWave, s.duration),
      new_dur
    );
  }, silence_sound(0));

  const len = sounds.length;
  return make_stereo_sound(
    normalisedWave(mushed_sound.leftWave, len),
    normalisedWave(mushed_sound.rightWave, len),
    mushed_sound.duration
  );
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
  return async function* (x: number) {
    if (x < attack_time) {
      return (yield* wave(x)) * (x / attack_time);
    }
    if (x < attack_time + decay_time) {
      return (
        ((1 - sustain_level) * linear_decay(decay_time)(x - attack_time) + sustain_level)
        * (yield* wave(x))
      );
    }
    if (x < duration - release_time) {
      return (yield* wave(x)) * sustain_level;
    }
    return (
      (yield* wave(x))
      * sustain_level
      * linear_decay(release_time)(x - (duration - release_time))
    );
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
export function adsr(
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
    return make_stereo_sound(
      adsrWave(sound.leftWave, duration, attack_time, decay_time, sustain_level, release_time),
      adsrWave(sound.rightWave, duration, attack_time, decay_time, sustain_level, release_time),
      duration
    );
  };
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
  return modulator => make_stereo_sound(
    phaseModWave(modulator.leftWave, freq, amount),
    phaseModWave(modulator.rightWave, freq, amount),
    duration
  );
}

// ---------------------------------------------
// Stereo-specific operations
// ---------------------------------------------

/** Multiplies every sample of `wave` by `gain`. */
function gainWave(wave: Wave, gain: number): Wave {
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
  const averaged: Wave = leftWave === rightWave ? leftWave : async function* (t: number) {
    return 0.5 * ((yield* leftWave(t)) + (yield* rightWave(t)));
  };
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
  return async function* (t: number) {
    const output = (yield* modulator.leftWave(t)) + (yield* modulator.rightWave(t));
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
    adsr(0, 0.6, 0, 0.05),
    adsr(0, 0.6618, 0, 0.05),
    adsr(0, 0.7618, 0, 0.05),
    adsr(0, 0.9071, 0, 0.05)
  ]);
}

/** Returns a Sound reminiscent of a cello, playing a given note for a given duration. */
export function cello(note: number, duration: number): Sound {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, [
    adsr(0.05, 0, 1, 0.1),
    adsr(0.05, 0, 1, 0.15),
    adsr(0, 0, 0.2, 0.15)
  ]);
}

/** Returns a Sound reminiscent of a piano, playing a given note for a given duration. */
export function piano(note: number, duration: number): Sound {
  return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration, [
    adsr(0, 0.515, 0, 0.05),
    adsr(0, 0.32, 0, 0.05),
    adsr(0, 0.2, 0, 0.05)
  ]);
}

/** Returns a Sound reminiscent of a trombone, playing a given note for a given duration. */
export function trombone(note: number, duration: number): Sound {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, [
    adsr(0.2, 0, 1, 0.1),
    adsr(0.3236, 0.6, 0, 0.1)
  ]);
}

/** Returns a Sound reminiscent of a violin, playing a given note for a given duration. */
export function violin(note: number, duration: number): Sound {
  return stacking_adsr(sawtooth_sound, midi_note_to_frequency(note), duration, [
    adsr(0.35, 0, 1, 0.15),
    adsr(0.35, 0, 1, 0.15),
    adsr(0.45, 0, 1, 0.15),
    adsr(0.45, 0, 1, 0.15)
  ]);
}
