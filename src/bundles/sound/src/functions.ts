import { midi_note_to_frequency } from '@sourceacademy/bundle-midi';
import type { MIDINote } from '@sourceacademy/bundle-midi/types';
import { InvalidCallbackError, InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { isFunctionOfLength } from '@sourceacademy/modules-lib/utilities';
import {
  accumulate,
  head,
  is_null,
  is_pair,
  length,
  list,
  pair,
  tail,
  type List
} from 'js-slang/dist/stdlib/list';
import type {
  Sound,
  SoundProducer,
  SoundPromise,
  SoundTransformer,
  Wave
} from './types';

// Global Constants and Variables
export const FS: number = 44100; // Output sample rate
const fourier_expansion_level: number = 5; // fourier expansion level
/**
 * duration of recording signal in milliseconds
 */
const recording_signal_ms = 100;
/**
 * duration of pause after "record" before recording signal is played
 */
const pre_recording_signal_pause_ms = 200;

interface BundleGlobalVars {
  /**
   * Can be one of 3 values:\
   * 1. `null`: `init_record` has not been called
   * 2. `MediaStream`: `init_record` has been called and allowed permissions
   * 3. `false`:`init_record` has been called and disallowed permissions
   */
  stream: MediaStream | false | null;
  recordedSound: Sound | null;

  /**
   * Track if a sound is currently playing
   */
  isPlaying: boolean;

  /**
   * Singular audio context for all playback functions
   */
  audioplayer: AudioContext | null;
}

export const globalVars: BundleGlobalVars = {
  stream: null,
  recordedSound: null,
  isPlaying: false,
  audioplayer: null
};

/**
 * Returns the current AudioContext in use for the bundle. If
 * none, initializes a new context and returns it.
 */
function getAudioContext() {
  if (!globalVars.audioplayer) {
    globalVars.audioplayer = new AudioContext();
  }
  return globalVars.audioplayer;
}

// linear decay from 1 to 0 over decay_period
function linear_decay(decay_period: number): (t: number) => number {
  return (t) => {
    if (t > decay_period || t < 0) {
      return 0;
    }
    return 1 - t / decay_period;
  };
}

// ---------------------------------------------
// Microphone Functionality
// ---------------------------------------------
/**
 * Determine if the user has already provided permission to use the
 * microphone and return the provided MediaStream if they have.
 */
function getAudioStream(func_name: string) {
  if (globalVars.stream === null) {
    throw new Error(`${func_name}: Call init_record(); to obtain permission to use microphone`);
  } else if (globalVars.stream === false) {
    throw new Error(`${func_name}: Permission has been denied.\n
        Re-start browser and call init_record();\n
        to obtain permission to use microphone.`);
  }

  return globalVars.stream;
}

/**
 * Set up the provided MediaRecorder and begin the recording
 * process.
 */
function start_recording(mediaRecorder: MediaRecorder) {
  const data: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => e.data.size && data.push(e.data);
  mediaRecorder.start();
  mediaRecorder.onstop = () => process(data);
}

function play_recording_signal() {
  play(sine_sound(1200, recording_signal_ms / 1000));
}

/**
 * Converts the data received from the MediaRecorder into an AudioBuffer.
 */
function process(data: Blob[]) {
  const audioContext = new AudioContext();
  const blob = new Blob(data);
  const url = URL.createObjectURL(blob);
  fetch(url)
    .then(async response => {
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      save(decodedBuffer);
    });
}

/**
 * Converts the data stored in the provided AudioBuffer, converts it
 * into a Sound and then stores it into the `globalVars.recordedSound`
 * variable.
 */
function save(audioBuffer: AudioBuffer) {
  const array = audioBuffer.getChannelData(0);
  const duration = array.length / FS;
  globalVars.recordedSound = make_sound((t) => {
    const index = t * FS;
    const lowerIndex = Math.floor(index);
    const upperIndex = lowerIndex + 1;
    const ratio = index - lowerIndex;
    const upper = array[upperIndex] ? array[upperIndex] : 0;
    const lower = array[lowerIndex] ? array[lowerIndex] : 0;
    return lower * (1 - ratio) + upper * ratio;
  }, duration);
}

/**
 * Initialize recording by obtaining permission
 * to use the default device microphone
 *
 * @returns string "obtaining recording permission"
 */
export function init_record(): string {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => {
      globalVars.stream = stream;
    }, () => {
      globalVars.stream = false;
    });
  return 'obtaining recording permission';
}

/**
 * Records a sound until the returned stop function is called.
 * Takes a buffer duration (in seconds) as argument, and
 * returns a nullary stop. A call to the stop function returns a Sound promise.
 *
 * How the function behaves in detail:
 * 1. `record` is called.
 * 2. The function waits for the given buffer duration.
 * 3. The recording signal is played.
 * 4. Recording begins when the recording signal finishes.
 * 5. Recording stops when the returned stop function is called.
 *
 * @example
 * ```ts
 * init_record();
 * const stop = record(0.5); // record after 0.5 seconds.
 * const promise = stop();   // stop recording and get sound promoie
 * const sound = promise();  // retrieve the recorded sound
 * play(sound);              // and do whatever with it
 * ```
 * @param buffer - pause before recording, in seconds
 */
export function record(buffer: number): () => SoundPromise {
  if (typeof buffer !== 'number' || buffer < 0) {
    throw new Error(`${record.name}: Expected a positive number for buffer, got ${buffer}`);
  }

  if (globalVars.isPlaying) {
    throw new Error(`${record.name}: Cannot record while another sound is playing!`);
  }

  const stream = getAudioStream(record.name);
  const mediaRecorder = new MediaRecorder(stream);

  setTimeout(() => {
    play_recording_signal();
    setTimeout(() => {
      start_recording(mediaRecorder);
    }, recording_signal_ms);
  }, pre_recording_signal_pause_ms + buffer * 1000);

  return () => {
    mediaRecorder.stop();
    play_recording_signal();
    const promise = () => {
      if (globalVars.recordedSound === null) {
        throw new Error('recording still being processed');
      } else {
        return globalVars.recordedSound;
      }
    };

    // TODO: Remove when ReplResult is properly implemented
    promise.toReplString = () => '<SoundPromise>';
    promise.toString = () => '<SoundPromise>';
    return promise;
  };
}

/**
 * Records a sound of a given duration. Returns a Sound promise.
 *
 * How the function behaves in detail:
 * 1. `record_for` is called.
 * 2. The function waits for the given buffer duration.
 * 3. The recording signal is played.
 * 4. Recording begins when the recording signal finishes.
 * 5. The recording signal plays to signal the end after the given duration.
 *
 * @example
 * ```
 * init_record();
 * const promise = record_for(2, 0.5); // begin recording after 0.5s for 2s
 * const sound = promise();            // retrieve the recorded sound
 * play(sound);                        // and do whatever with it
 * ```
 * @param duration duration in seconds
 * @param buffer pause before recording, in seconds
 */
export function record_for(duration: number, buffer: number): SoundPromise {
  if (globalVars.isPlaying) {
    throw new Error(`${record_for.name}: Cannot record while another sound is playing!`);
  }

  const stream = getAudioStream(record_for.name);
  const mediaRecorder = new MediaRecorder(stream);

  // order of events for record_for:
  // pre-recording-signal pause | recording signal |
  // pre-recording pause | recording | recording signal

  setTimeout(() => {
    play_recording_signal();
    setTimeout(() => {
      start_recording(mediaRecorder);
      setTimeout(() => {
        mediaRecorder.stop();
        play_recording_signal();
      }, duration * 1000);
    }, recording_signal_ms + buffer * 1000);
  }, pre_recording_signal_pause_ms);

  const promise = () => {
    if (globalVars.recordedSound === null) {
      throw new Error('recording still being processed');
    } else {
      return globalVars.recordedSound;
    }
  };

  promise.toReplString = () => '<SoundPromise>';
  // TODO: Remove when ReplResult is properly implemented
  promise.toString = () => '<SoundPromise>';
  return promise;
}

/**
 * Throws an exception if duration is not a number or if
 * number is negative
 */
function validateDuration(func_name: string, duration: unknown): asserts duration is number {
  if (typeof duration !== 'number') {
    throw new InvalidParameterTypeError('number', duration, func_name, 'duration');
  }

  if (duration < 0) {
    throw new Error(`${func_name}: Sound duration must be greater than or equal to 0`);
  }
}

/**
 * Throws an exception if wave is not a function
 */
function validateWave(func_name: string, wave: unknown): asserts wave is Wave {
  if (!isFunctionOfLength(wave, 1)) {
    throw new InvalidCallbackError('Wave', wave, func_name);
  }
}

/**
 * Makes a Sound with given wave function and duration.
 * The wave function is a function: number -> number
 * that takes in a non-negative input time and returns an amplitude
 * between -1 and 1.
 *
 * @param wave wave function of the Sound
 * @param duration duration of the Sound
 * @returns with wave as wave function and duration as duration
 * @example const s = make_sound(t => Math_sin(2 * Math_PI * 440 * t), 5);
 */
export function make_sound(wave: Wave, duration: number): Sound {
  validateDuration(make_sound.name, duration);
  validateWave(make_sound.name, wave);

  return pair((t: number) => (t >= duration ? 0 : wave(t)), duration);
}

/**
 * Accesses the wave function of a given Sound.
 *
 * @param sound given Sound
 * @returns the wave function of the Sound
 * @example get_wave(make_sound(t => Math_sin(2 * Math_PI * 440 * t), 5)); // Returns t => Math_sin(2 * Math_PI * 440 * t)
 */
export function get_wave(sound: Sound): Wave {
  return head(sound);
}

/**
 * Accesses the duration of a given Sound.
 *
 * @param sound given Sound
 * @returns the duration of the Sound
 * @example get_duration(make_sound(t => Math_sin(2 * Math_PI * 440 * t), 5)); // Returns 5
 */
export function get_duration(sound: Sound): number {
  return tail(sound);
}

/**
 * Checks if the argument is a Sound
 *
 * @param x input to be checked
 * @returns true if x is a Sound, false otherwise
 * @example is_sound(make_sound(t => 0, 2)); // Returns true
 */
export function is_sound(x: unknown): x is Sound {
  return (
    is_pair(x)
    && typeof get_wave(x) === 'function'
    && typeof get_duration(x) === 'number'
  );
}

/**
 * Plays the given Wave using the computer’s sound device, for the duration
 * given in seconds.
 *
 * @param wave the wave function to play, starting at 0
 * @returns the resulting Sound
 * @example play_wave(t => math_sin(t * 3000), 5);
 */
export function play_wave(wave: Wave, duration: number): Sound {
  validateDuration(play_wave.name, duration);
  validateWave(play_wave.name, wave);

  return play(make_sound(wave, duration));
}

/**
 * Plays the given Sound using the computer’s sound device
 * on top of any Sounds that are currently playing.
 *
 * @param sound the Sound to play
 * @returns the given Sound
 * @example play(sine_sound(440, 5));
 */
export function play(sound: Sound): Sound {
  // Type-check sound
  if (!is_sound(sound)) {
    throw new Error(`${play.name} is expecting sound, but encountered ${sound}`);
  } else if (globalVars.isPlaying) {
    throw new Error(`${play.name}: Previous sound still playing!`);
  }

  const duration = get_duration(sound);
  if (duration < 0) {
    throw new Error(`${play.name}: duration of sound is negative`);
  } else if (duration === 0) {
    return sound;
  }

  const audioplayer = getAudioContext();

  // Create mono buffer
  const theBuffer = audioplayer.createBuffer(
    1,
    Math.ceil(FS * duration),
    FS
  );

  const channel = theBuffer.getChannelData(0);

  let temp: number;
  let prev_value = 0;

  const wave = get_wave(sound);
  for (let i = 0; i < channel.length; i += 1) {
    temp = wave(i / FS);
    // clip amplitude
    if (temp > 1) {
      channel[i] = 1;
    } else if (temp < -1) {
      channel[i] = -1;
    } else {
      channel[i] = temp;
    }

    // smoothen out sudden cut-outs
    if (channel[i] === 0 && Math.abs(channel[i] - prev_value) > 0.01) {
      channel[i] = prev_value * 0.999;
    }

    prev_value = channel[i];
  }

  // Connect data to output destination
  const source = audioplayer.createBufferSource();
  source.buffer = theBuffer;
  source.connect(audioplayer.destination);
  globalVars.isPlaying = true;
  source.start();
  source.onended = () => {
    source.disconnect(audioplayer.destination);
    globalVars.isPlaying = false;
  };
  return sound;
}

/**
 * Stops all currently playing sounds.
 */
export function stop(): void {
  if (globalVars.audioplayer) {
    globalVars.audioplayer.close();
  }
  globalVars.isPlaying = false;
}

// Primitive sounds

/**
 * Makes a noise Sound with given duration
 *
 * @param duration the duration of the noise sound
 * @returns resulting noise Sound
 * @example noise_sound(5);
 * @category Primitive
 */
export function noise_sound(duration: number): Sound {
  validateDuration(noise_sound.name, duration);
  return make_sound((_t) => Math.random() * 2 - 1, duration);
}

/**
 * Makes a silence Sound with given duration
 *
 * @param duration the duration of the silence Sound
 * @returns resulting silence Sound
 * @example silence_sound(5);
 * @category Primitive
 */
export function silence_sound(duration: number): Sound {
  validateDuration(silence_sound.name, duration);
  return make_sound((_t) => 0, duration);
}

/**
 * Makes a sine wave Sound with given frequency and duration
 *
 * @param freq the frequency of the sine wave Sound
 * @param duration the duration of the sine wave Sound
 * @returns resulting sine wave Sound
 * @example sine_sound(440, 5);
 * @category Primitive
 */
export function sine_sound(freq: number, duration: number): Sound {
  validateDuration(sine_sound.name, duration);
  return make_sound((t) => Math.sin(2 * Math.PI * t * freq), duration);
}

/**
 * Makes a square wave Sound with given frequency and duration
 *
 * @param f the frequency of the square wave Sound
 * @param duration the duration of the square wave Sound
 * @returns resulting square wave Sound
 * @example square_sound(440, 5);
 * @category Primitive
 */
export function square_sound(f: number, duration: number): Sound {
  validateDuration(square_sound.name, duration);
  function fourier_expansion_square(t: number) {
    let answer = 0;
    for (let i = 1; i <= fourier_expansion_level; i += 1) {
      answer += Math.sin(2 * Math.PI * (2 * i - 1) * f * t) / (2 * i - 1);
    }
    return answer;
  }
  return make_sound(
    (t) => (4 / Math.PI) * fourier_expansion_square(t),
    duration
  );
}

/**
 * Makes a triangle wave Sound with given frequency and duration
 *
 * @param freq the frequency of the triangle wave Sound
 * @param duration the duration of the triangle wave Sound
 * @returns resulting triangle wave Sound
 * @example triangle_sound(440, 5);
 * @category Primitive
 */
export function triangle_sound(freq: number, duration: number): Sound {
  validateDuration(triangle_sound.name, duration);
  function fourier_expansion_triangle(t: number) {
    let answer = 0;
    for (let i = 0; i < fourier_expansion_level; i += 1) {
      answer
        += ((-1) ** i * Math.sin((2 * i + 1) * t * freq * Math.PI * 2))
        / (2 * i + 1) ** 2;
    }
    return answer;
  }
  return make_sound(
    (t) => (8 / Math.PI / Math.PI) * fourier_expansion_triangle(t),
    duration
  );
}

/**
 * Makes a sawtooth wave Sound with given frequency and duration
 *
 * @param freq the frequency of the sawtooth wave Sound
 * @param duration the duration of the sawtooth wave Sound
 * @returns resulting sawtooth wave Sound
 * @example sawtooth_sound(440, 5);
 * @category Primitive
 */
export function sawtooth_sound(freq: number, duration: number): Sound {
  validateDuration(sawtooth_sound.name, duration);
  function fourier_expansion_sawtooth(t: number) {
    let answer = 0;
    for (let i = 1; i <= fourier_expansion_level; i += 1) {
      answer += Math.sin(2 * Math.PI * i * freq * t) / i;
    }
    return answer;
  }
  return make_sound(
    (t) => 1 / 2 - (1 / Math.PI) * fourier_expansion_sawtooth(t),
    duration
  );
}

// Composition Operators

/**
 * Makes a new Sound by combining the sounds in a given list
 * where the second Sound is appended to the end of the first Sound,
 * the third Sound is appended to the end of the second Sound, and
 * so on. The effect is that the Sounds in the list are joined end-to-end
 *
 * @param list_of_sounds given list of Sounds
 * @returns the combined Sound
 * @example consecutively(list(sine_sound(200, 2), sine_sound(400, 3)));
 */
export function consecutively(list_of_sounds: List): Sound {
  function consec_two(ss1: Sound, ss2: Sound) {
    const wave1 = get_wave(ss1);
    const wave2 = get_wave(ss2);
    const dur1 = get_duration(ss1);
    const dur2 = get_duration(ss2);
    const new_wave: Wave = t => (t < dur1 ? wave1(t) : wave2(t - dur1));
    return make_sound(new_wave, dur1 + dur2);
  }
  return accumulate(consec_two, silence_sound(0), list_of_sounds);
}

/**
 * Makes a new Sound by combining the Sounds in a given list.
 * In the result sound, the component sounds overlap such that
 * they start at the beginning of the result sound. To achieve
 * this, the amplitudes of the component sounds are added together
 * and then divided by the length of the list.
 *
 * @param list_of_sounds given list of Sounds
 * @returns the combined Sound
 * @example simultaneously(list(sine_sound(200, 2), sine_sound(400, 3)))
 */
export function simultaneously(list_of_sounds: List): Sound {
  function simul_two(ss1: Sound, ss2: Sound) {
    const wave1 = get_wave(ss1);
    const wave2 = get_wave(ss2);
    const dur1 = get_duration(ss1);
    const dur2 = get_duration(ss2);

    const new_wave: Wave = t => {
      let sum = 0;
      if (t <= dur1) {
        sum += wave1(t);
      }

      if (t <= dur2) {
        sum += wave2(t);
      }

      return sum;
    };

    // new_dur is higher of the two dur
    const new_dur = dur1 < dur2 ? dur2 : dur1;
    return make_sound(new_wave, new_dur);
  }

  const mushed_sounds = accumulate(simul_two, silence_sound(0), list_of_sounds);
  const len = length(list_of_sounds);
  const normalised_wave: Wave = t => head(mushed_sounds)(t) / len;
  const highest_duration = tail(mushed_sounds);
  return make_sound(normalised_wave, highest_duration);
}

/**
 * Utility function for wrapping Sound transformers. Adds the toReplString representation
 * and adds check for verifying that the given input is a Sound.
 */
function wrapSoundTransformer(transformer: SoundTransformer): SoundTransformer {
  function wrapped(sound: Sound) {
    if (!is_sound(sound)) {
      throw new InvalidParameterTypeError('Sound', sound, 'SoundTransformer');
    }

    return transformer(sound);
  }

  wrapped.toReplString = () => '<SoundTransformer>';
  // TODO: Remove when ReplResult is properly implemented
  wrapped.toString = () => '<SoundTransformer>';
  return wrapped;
}

/**
 * Returns an envelope: a function from Sound to Sound.
 * When the adsr envelope is applied to a Sound, it returns
 * a new Sound with its amplitude modified according to parameters
 * The relative amplitude increases from 0 to 1 linearly over the
 * attack proportion, then decreases from 1 to sustain level over the
 * decay proportion, and remains at that level until the release
 * proportion when it decays back to 0.
 * @param attack_ratio proportion of Sound in attack phase
 * @param decay_ratio proportion of Sound decay phase
 * @param sustain_level sustain level between 0 and 1
 * @param release_ratio proportion of Sound in release phase
 * @returns Envelope a function from Sound to Sound
 * @example adsr(0.2, 0.3, 0.3, 0.1)(sound);
 */
export function adsr(
  attack_ratio: number,
  decay_ratio: number,
  sustain_level: number,
  release_ratio: number
): SoundTransformer {
  return wrapSoundTransformer(sound => {
    const wave = get_wave(sound);
    const duration = get_duration(sound);

    const attack_time = duration * attack_ratio;
    const decay_time = duration * decay_ratio;
    const release_time = duration * release_ratio;

    return make_sound((x) => {
      if (x < attack_time) {
        return wave(x) * (x / attack_time);
      }
      if (x < attack_time + decay_time) {
        return (
          ((1 - sustain_level) * linear_decay(decay_time)(x - attack_time)
            + sustain_level)
          * wave(x)
        );
      }
      if (x < duration - release_time) {
        return wave(x) * sustain_level;
      }
      return (
        wave(x)
        * sustain_level
        * linear_decay(release_time)(x - (duration - release_time))
      );
    }, duration);
  });
}

/**
 * Returns a Sound that results from applying a list of envelopes
 * to a given wave form. The wave form is a Sound generator that
 * takes a frequency and a duration as arguments and produces a
 * Sound with the given frequency and duration. Each envelope is
 * applied to a harmonic: the first harmonic has the given frequency,
 * the second has twice the frequency, the third three times the
 * frequency etc. The harmonics are then layered simultaneously to
 * produce the resulting Sound.
 * @param waveform function from pair(frequency, duration) to Sound
 * @param base_frequency frequency of the first harmonic
 * @param duration duration of the produced Sound, in seconds
 * @param envelopes – list of envelopes, which are functions from Sound to Sound
 * @returns Sound resulting Sound
 * @example stacking_adsr(sine_sound, 300, 5, list(adsr(0.1, 0.3, 0.2, 0.5), adsr(0.2, 0.5, 0.6, 0.1), adsr(0.3, 0.1, 0.7, 0.3)));
 */
export function stacking_adsr(
  waveform: SoundProducer,
  base_frequency: number,
  duration: number,
  envelopes: List
): Sound {
  function zip(lst: List, n: number) {
    if (is_null(lst)) {
      return lst;
    }
    return pair(pair(n, head(lst)), zip(tail(lst), n + 1));
  }

  return simultaneously(accumulate(
    (x: any, y: any) => pair(tail(x)(waveform(base_frequency * head(x), duration)), y),
    null,
    zip(envelopes, 1)
  ));
}

/**
 * Returns a Sound transformer which uses its argument
 * to modulate the phase of a (carrier) sine wave
 * of given frequency and duration with a given Sound.
 * Modulating with a low frequency Sound results in a vibrato effect.
 * Modulating with a Sound with frequencies comparable to
 * the sine wave frequency results in more complex wave forms.
 *
 * @param freq the frequency of the sine wave to be modulated
 * @param duration the duration of the output Sound
 * @param amount the amount of modulation to apply to the carrier sine wave
 * @returns function which takes in a Sound and returns a Sound
 * @example phase_mod(440, 5, 1)(sine_sound(220, 5));
 */
export function phase_mod(
  freq: number,
  duration: number,
  amount: number
): SoundTransformer {
  return wrapSoundTransformer(modulator => {
    const wave = get_wave(modulator);
    return make_sound(
      t => Math.sin(2 * Math.PI * t * freq + amount * wave(t)),
      duration
    );
  });
}

// Instruments

/**
 * returns a Sound reminiscent of a bell, playing
 * a given note for a given duration
 * @param note MIDI note
 * @param duration duration in seconds
 * @returns Sound resulting bell Sound with given pitch and duration
 * @example bell(40, 1);
 * @category Instrument
 */
export function bell(note: MIDINote, duration: number): Sound {
  return stacking_adsr(
    square_sound,
    midi_note_to_frequency(note),
    duration,
    list(
      adsr(0, 0.6, 0, 0.05),
      adsr(0, 0.6618, 0, 0.05),
      adsr(0, 0.7618, 0, 0.05),
      adsr(0, 0.9071, 0, 0.05)
    )
  );
}

/**
 * returns a Sound reminiscent of a cello, playing
 * a given note for a given duration
 * @param note MIDI note
 * @param duration duration in seconds
 * @returns Sound resulting cello Sound with given pitch and duration
 * @example cello(36, 5);
 * @category Instrument
 */
export function cello(note: MIDINote, duration: number): Sound {
  return stacking_adsr(
    square_sound,
    midi_note_to_frequency(note),
    duration,
    list(adsr(0.05, 0, 1, 0.1), adsr(0.05, 0, 1, 0.15), adsr(0, 0, 0.2, 0.15))
  );
}

/**
 * returns a Sound reminiscent of a piano, playing
 * a given note for a given duration
 * @param note MIDI note
 * @param duration duration in seconds
 * @returns Sound resulting piano Sound with given pitch and duration
 * @example piano(48, 5);
 * @category Instrument
 *
 */
export function piano(note: MIDINote, duration: number): Sound {
  return stacking_adsr(
    triangle_sound,
    midi_note_to_frequency(note),
    duration,
    list(adsr(0, 0.515, 0, 0.05), adsr(0, 0.32, 0, 0.05), adsr(0, 0.2, 0, 0.05))
  );
}

/**
 * returns a Sound reminiscent of a trombone, playing
 * a given note for a given duration
 * @param note MIDI note
 * @param duration duration in seconds
 * @returns Sound resulting trombone Sound with given pitch and duration
 * @example trombone(60, 2);
 * @category Instrument
 */
export function trombone(note: MIDINote, duration: number): Sound {
  return stacking_adsr(
    square_sound,
    midi_note_to_frequency(note),
    duration,
    list(adsr(0.2, 0, 1, 0.1), adsr(0.3236, 0.6, 0, 0.1))
  );
}

/**
 * returns a Sound reminiscent of a violin, playing
 * a given note for a given duration
 * @param note MIDI note
 * @param duration duration in seconds
 * @returns Sound resulting violin Sound with given pitch and duration
 * @example violin(53, 4);
 * @category Instrument
 */
export function violin(note: MIDINote, duration: number): Sound {
  return stacking_adsr(
    sawtooth_sound,
    midi_note_to_frequency(note),
    duration,
    list(
      adsr(0.35, 0, 1, 0.15),
      adsr(0.35, 0, 1, 0.15),
      adsr(0.45, 0, 1, 0.15),
      adsr(0.45, 0, 1, 0.15)
    )
  );
}
