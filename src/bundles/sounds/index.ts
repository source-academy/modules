/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-use-before-define, @typescript-eslint/no-unused-vars */
import { Wave, Sound, SoundProducer, UnaryComposition, List } from './types';
import {
  pair,
  head,
  tail,
  list,
  length,
  is_null,
  is_pair,
  accumulate,
} from './list';
import { RIFFWAVE } from './riffwave';

// Constants

const FS: number = 44100; // Output sample rate
const fourier_expansion_level: number = 5; // fourier expansion level

/* Uncomment if using oversampling
const oversample_factor : number = 1; // Oversample frequency multiple
const biquad_filter_count : number= 1; // how many times to apply filter
// The two params for a low pass biquad filter
const biquad_filter_cutoff : number = 20000; // cutoff frequency
const biquad_filter_Q : number = Math.SQRT1_2; // don't change this. Fixed value for lowpass

// Calculations for Low Pass Biquad filter
const biquad_omega : number = 2 * Math.PI * biquad_filter_cutoff / (FS * oversample_factor);
const biquad_alpha : number = Math.sin(biquad_omega / (2 * biquad_filter_Q));
const biquad_a0 : number = 1 + biquad_alpha; // used to normalise things
const biquad_a1 : number = -2 * Math.cos(biquad_omega) / biquad_a0;
const biquad_a2 : number = (1 - biquad_alpha) / biquad_a0;
const biquad_b1 : number = (1 - Math.cos(biquad_omega)) / biquad_a0;
const biquad_b0 : number = biquad_b1 / 2;
const biquad_b2 : number = biquad_b0;
*/

/**
 * Bundle for Source Academy Sounds Module
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */

// ---------------------------------------------
// Low-level sound support
// ---------------------------------------------

/* Uncomment if using oversampling
// Samples a continuous wave to a discrete waves at given sampling frequency which
// is a  multiple of FS
function discretize(wave : Wave, duration : number, factor : number) : number[] {    
  let vector : number[] = [];
  for (let i = 0; i < duration * FS * factor; i++) {
      vector.push(wave( i / (FS * factor)));
  }
  return vector;
}

// filters the data based on the biquad filter parameters
function biquad_lowpass(data : number[]) : number[] {
  let x_n : number = 0, x_n1 : number = 0, x_n2 : number = 0;
  if (data.length >= 1) {
      x_n = data[0];
      data[0] = biquad_b0 * x_n;
  }
  if (data.length >= 2) {
      x_n1 = x_n;
      x_n = data[1];
      data[1] = biquad_b0 * x_n + biquad_b1 * x_n1 - biquad_a1 * data[0];
  }
  if (data.length >= 3) {
      for (let i = 2; i < data.length; i++) {
          x_n2 = x_n1;
          x_n1 = x_n;
          x_n = data[i];
          data[i] = biquad_b0 * x_n + biquad_b1 * x_n1 + biquad_b2 * x_n2
                      - biquad_a1 * data[i - 1] - biquad_a2 * data[i - 2];
      }
  }
  return data;
}

// Downsamples data by a given factor
function downsample(data : number[], factor : number) : number[] {
  let output : number[] = [];
  for (let i = 0; i < data.length; i+= factor) {
      output.push(data[i]);
  }
  return output;
}
*/

// ---------------------------------------------
// Source API for Students
// ---------------------------------------------

// Data abstractions:
// time: real value in seconds  x > 0
// amplitude: real value -1 <= x <= 1 (enforced: -2 <= x <= 2)
// duration: real value in seconds 0 < x < Infinity
// sound: (time -> amplitude) x duration

/**
 * Makes a Sound from a wave and a duration.
 * The wave is a function from a non-negative time (in seconds)
 * to an amplitude value that should lie between
 * -1 and 1. The duration is given in seconds.
 * @param {function} wave - given wave function
 * @param {Number} duration - in seconds
 * @returns {Sound}
 */
function make_sound(wave: Wave, duration: number): Sound {
  return pair((t: number) => (t >= duration ? 0 : wave(t)), duration);
}

/**
 * Accesses the wave of a Sound.
 * The wave is a function from a non-negative time (in seconds)
 * to an amplitude value that should lie between
 * -1 and 1.
 * @param {Sound} sound - given sound
 * @returns {function} wave function of the sound
 */
function get_wave(sound: Sound): Wave {
  return head(sound);
}

/**
 * Accesses the duration of a Sound, in seconds.
 * @param {Sound} sound - given Sound
 * @returns {Number} duration in seconds
 */
function get_duration(sound: Sound): number {
  return tail(sound);
}

/**
 * Checks if a given value is a Sound
 * @param {value} x - given value
 * @returns {boolean} whether <CODE>x</CODE> is a Sound
 */
function is_sound(x: any): boolean {
  return (
    is_pair(x) &&
    typeof get_wave(x) === 'function' &&
    typeof get_duration(x) === 'number'
  );
}

// Singular audio context for all playback functions
let audioplayer: AudioContext;
// Track if a sound is currently playing
let isPlaying: boolean;

// Instantiates new audio context
function init_audioCtx(): void {
  audioplayer = new window.AudioContext();
  // audioplayer = new (window.AudioContext || window.webkitAudioContext)();
}

// Fully processes a sound before playback
// Frontloads processing so the sound plays back properly,
//   but possibly with a delay
/**
 * plays a given Sound using your computer's sound device
 * @param {Sound} sound - given Sound
 * @returns {Sound} given Sound
 */
function play(sound: Sound): Sound {
  // Type-check sound
  if (!is_sound(sound)) {
    throw new Error(`play is expecting sound, but encountered ${sound}`);
    // If a sound is already playing, terminate execution.
  } else if (isPlaying) {
    throw new Error('play: audio system still playing previous sound');
  } else if (get_duration(sound) <= 0) {
    return sound;
  } else {
    // Instantiate audio context if it has not been instantiated.
    if (!audioplayer) {
      init_audioCtx();
    }

    // Create mono buffer
    const theBuffer = audioplayer.createBuffer(
      1,
      Math.ceil(FS * get_duration(sound)),
      FS
    );
    const channel = theBuffer.getChannelData(0);

    let temp: number;
    let prev_value = 0;

    const wave = get_wave(sound);
    for (let i = 0; i < channel.length; i += 1) {
      temp = wave(i / FS);
      // clip amplitude
      // channel[i] = temp > 1 ? 1 : temp < -1 ? -1 : temp;
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
	
	// quantize
    for (let i = 0; i < channel.length; i += 1) {
        channel[i] = Math.floor(channel[i] * 32767.999);
    }

    // eslint-disable-next-line no-console
    console.log(channel);
    const currentOutput: number[] = []; 
    for (let i = 0; i < channel.length; i += 1) {
      currentOutput[i] = channel[i];
    }
	const riffwave = new RIFFWAVE([]);
    riffwave.header.sampleRate = FS;
    riffwave.header.numChannels = 1;
    riffwave.header.bitsPerSample = 16;
    riffwave.Make(currentOutput);
    const audio = new Audio(riffwave.dataURI);
        
    const source2 = audioplayer.createMediaElementSource(audio);
    const webplayer = <HTMLAudioElement>document.getElementById("sound-tab-player");

    webplayer.src = riffwave.dataURI;
    source2.connect(audioplayer.destination);

    // Connect data to output destination
    isPlaying = true;
    audio.play();
    audio.onended = () => {
      source2.disconnect(audioplayer.destination);
      isPlaying = false;
    };

    return sound;
  }
}

/**
 * plays a given sound without regard if a sound is already playing
 * @param {Sound} sound - given sound
 * @returns {undefined}  undefined
 */
function play_concurrently(sound: Sound): void {
  // Type-check sound
  if (!is_sound(sound)) {
    throw new Error(
      `play_concurrently is expecting sound, but encountered ${sound}`
    );
  } else if (get_duration(sound) <= 0) {
    // Do nothing
  } else {
    // Instantiate audio context if it has not been instantiated.
    if (!audioplayer) {
      init_audioCtx();
    }

    // Create mono buffer
    const theBuffer = audioplayer.createBuffer(
      1,
      Math.ceil(FS * get_duration(sound)),
      FS
    );
    const channel = theBuffer.getChannelData(0);

    /* Code for implementation based on oversampling.
    // Oversample at specified rate
    let data = discretize(get_wave(sound), get_duration(sound), oversample_factor);

    // Filter out high frequencies. also smoothens out any sudden cutouts
    for (let i = 0; i < biquad_filter_count; i++) {
      data = biquad_lowpass(data);
    }

    // Resample back to original sampling rate
    data = downsample(data, oversample_factor);
      
    // Copy data back from discretized data. Due to rounding, channel.length <= data.length
    for (let i = 0; i < channel.length; i++) {
      channel[i] = data[i];
    }

    // A Catch-all hard-clip if too far beyond the expected range of [-1, 1]
    for (let i = 0; i < channel.length; i++) {
      channel[i] = channel[i] > 2 ? 2 : channel[i] < -2 ? -2 : channel[i];
    }
    */

    let temp: number;
    let prev_value = 0;

    const wave = get_wave(sound);
    for (let i = 0; i < channel.length; i += 1) {
      temp = wave(i / FS);
      // clip amplitude
      if (temp > 2) {
        channel[i] = 2;
      } else if (temp < -2) {
        channel[i] = -2;
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
    isPlaying = true;
    source.start();
    source.onended = () => {
      source.disconnect(audioplayer.destination);
      isPlaying = false;
    };
  }
}

/**
 * Stops playing the current sound
 * @returns {undefined} undefined
 */
function stop(): void {
  audioplayer.close();
  isPlaying = false;
}

// Concats a list of sounds
/**
 * makes a new sound by combining the sounds in a given
 * list so that
 * they are arranged consecutively. Let us say the durations
 * of the sounds are <CODE>d1</CODE>, ..., <CODE>dn</CODE> and the wave
 * functions are <CODE>w1</CODE>, ..., <CODE>wn</CODE>. Then the resulting
 * sound has the duration of the sum of <CODE>d1</CODE>, ..., <CODE>dn</CODE>.
 * The wave function <CODE>w</CODE> of the resulting sound uses <CODE>w1</CODE> for the first
 * <CODE>d1</CODE> seconds, <CODE>w2</CODE> for the next
 * <CODE>d2</CODE> seconds etc. We specify that <CODE>w(d1) = w2(0)</CODE>,
 * <CODE>w(d1+d2) = w3(0)</CODE>, etc
 * @param {list_of_sounds} sounds - given list of sounds
 * @returns {Sound} resulting sound
 */
function consecutively(list_of_sounds: List): Sound {
  function consec_two(ss1: Sound, ss2: Sound) {
    const wave1 = head(ss1);
    const wave2 = head(ss2);
    const dur1 = tail(ss1);
    const dur2 = tail(ss2);
    const new_wave = (t: number) => (t < dur1 ? wave1(t) : wave2(t - dur1));
    return make_sound(new_wave, dur1 + dur2);
  }
  return accumulate(consec_two, silence_sound(0), list_of_sounds);
}

// Mushes a list of sounds together
/**
 * makes a new sound by combining the sounds in a given
 * list so that
 * they play simutaneously, all starting at the beginning of the
 * resulting sound
 * @param {list_of_sounds} sounds - given list of sounds
 * @returns {Sound} resulting sound
 */
function simultaneously(list_of_sounds: List): Sound {
  function musher(ss1: Sound, ss2: Sound) {
    const wave1 = head(ss1);
    const wave2 = head(ss2);
    const dur1 = tail(ss1);
    const dur2 = tail(ss2);
    // new_wave assumes sound discipline (ie, wave(t) = 0 after t > dur)
    const new_wave = (t: number) => wave1(t) + wave2(t);
    // new_dur is higher of the two dur
    const new_dur = dur1 < dur2 ? dur2 : dur1;
    return make_sound(new_wave, new_dur);
  }

  const mushed_sounds = accumulate(musher, silence_sound(0), list_of_sounds);
  const normalised_wave = (t: number) =>
    head(mushed_sounds)(t) / length(list_of_sounds);
  const highest_duration = tail(mushed_sounds);
  return make_sound(normalised_wave, highest_duration);
}

/**
 * makes a Sound of a given duration by randomly
 * generating amplitude values
 * @param {Number} duration - duration of result sound, in seconds
 * @returns {Sound} resulting noise sound
 */
function noise_sound(duration: number): Sound {
  return make_sound((t) => Math.random() * 2 - 1, duration);
}

/**
 * makes a sine wave Sound with given frequency and a given duration
 * @param {Number} freq - frequency of result Sound, in Hz, <CODE>freq</CODE> ≥ 0
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting sine Sound
 */
function sine_sound(freq: number, duration: number): Sound {
  return make_sound((t) => Math.sin(2 * Math.PI * t * freq), duration);
}

/**
 * makes a silence Sound with a given duration
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting silence Sound
 */
function silence_sound(duration: number): Sound {
  return make_sound((t) => 0, duration);
}

/**
 * makes a square wave Sound with given frequency and a given duration
 * @param {Number} freq - frequency of result Sound, in Hz, <CODE>freq</CODE> ≥ 0
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting square Sound
 */
function square_sound(f: number, duration: number): Sound {
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
  /* If using oversampling
  return make_sound(t => t * f < Math.floor(t * f) + 0.5 ? -1 : 1, duration);
  */
}

/**
 * makes a triangle wave Sound with given frequency and a given duration
 * @param {Number} freq - frequency of result Sound, in Hz, <CODE>freq</CODE> ≥ 0
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting triangle Sound
 */
function triangle_sound(freq: number, duration: number): Sound {
  function fourier_expansion_triangle(t: number) {
    let answer = 0;
    for (let i = 0; i < fourier_expansion_level; i += 1) {
      answer +=
        ((-1) ** i * Math.sin((2 * i + 1) * t * freq * Math.PI * 2)) /
        (2 * i + 1) ** 2;
    }
    return answer;
  }
  return make_sound(
    (t) => (8 / Math.PI / Math.PI) * fourier_expansion_triangle(t),
    duration
  );
  /* If using oversampling
  return make_sound(t => 2 * Math.abs(2 * (t * freq - Math.floor(1 / 2 + t * freq))), duration);
  */
}

/**
 * makes a sawtooth wave Sound with given frequency and a given duration
 * @param {Number} freq - frequency of result Sound, in Hz; <CODE>freq</CODE> ≥ 0
 * @param {Number} duration - duration of result Sound, in seconds
 * @returns {Sound} resulting sawtooth Sound
 */
function sawtooth_sound(freq: number, duration: number): Sound {
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
  /* If using oversampling
  return make_sound(t => 2 * (t * freq - Math.floor(1 / 2 + t * freq)), duration);
  */
}

/**
 * converts a letter name <CODE>str</CODE> to corresponding midi note.
 * Examples for letter names are <CODE>"A5"</CODE>, <CODE>"B3"</CODE>, <CODE>"D#4"</CODE>.
 * See <a href="https://i.imgur.com/qGQgmYr.png">mapping from
 * letter name to midi notes</a>
 * @param {string} str - given letter name
 * @returns {Number} midi value of the corresponding note
 */
function letter_name_to_midi_note(note: string): number {
  // we don't consider double flat/ double sharp
  let res = 12; // C0 is midi note 12
  const n = note[0].toUpperCase();
  switch (n) {
    case 'D':
      res += 2;
      break;

    case 'E':
      res += 4;
      break;

    case 'F':
      res += 5;
      break;

    case 'G':
      res += 7;
      break;

    case 'A':
      res += 9;
      break;

    case 'B':
      res += 11;
      break;

    default:
      break;
  }

  if (note.length === 2) {
    res += parseInt(note[1], 10) * 12;
  } else if (note.length === 3) {
    switch (note[1]) {
      case '#':
        res += 1;
        break;

      case 'b':
        res -= 1;
        break;

      default:
        break;
    }
    res += parseInt(note[2], 10) * 12;
  }
  return res;
}

/**
 * converts a midi note <CODE>n</CODE> to corresponding frequency.
 * The note is given as an integer Number.
 * @param {Number} n - given midi note
 * @returns {Number} frequency of the note in Hz
 */
function midi_note_to_frequency(note: number): number {
  // A4 = 440Hz = midi note 69
  return 440 * 2 ** ((note - 69) / 12);
}

/**
 * converts a letter name <CODE>str</CODE> to corresponding frequency.
 * First converts <CODE>str</CODE> to a note using <CODE>letter_name_to_midi_note</CODE>
 * and then to a frequency using <CODE>midi_note_to_frequency</CODE>
 * @param {string} str - given letter name
 * @returns {Number} frequency of corresponding note in Hz
 */
function letter_name_to_frequency(note: string): number {
  return midi_note_to_frequency(letter_name_to_midi_note(note));
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

/**
 * Returns an envelope: a function from Sound to Sound.
 * When the envelope is applied to a Sound, it returns
 * a new Sound that results from applying ADSR to
 * the given Sound. The Attack, Sustain and
 * Release ratios are given in the first, second and fourth
 * arguments, and the Sustain level is given in
 * the third argument as a fraction between 0 and 1.
 * @param {Number} attack_ratio - proportion of Sound in attack phase
 * @param {Number} decay_ratio - proportion of Sound decay phase
 * @param {Number} sustain_level - sustain level between 0 and 1
 * @param {Number} release_ratio - proportion of Sound release phase
 * @returns {function} envelope: function from Sound to Sound
 */
function adsr(
  attack_ratio: number,
  decay_ratio: number,
  sustain_level: number,
  release_ratio: number
): UnaryComposition {
  return (sound) => {
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
          ((1 - sustain_level) * linear_decay(decay_time)(x - attack_time) +
            sustain_level) *
          wave(x)
        );
      }
      if (x < duration - release_time) {
        return wave(x) * sustain_level;
      }
      return (
        wave(x) *
        sustain_level *
        linear_decay(release_time)(x - (duration - release_time))
      );
    }, duration);
  };
}

// waveform is a function that accepts freq, dur and returns Sound
/**
 * Returns a Sound that results from applying a list of envelopes
 * to a given wave form. The wave form should be a Sound generator that
 * takes a frequency and a duration as arguments and produces a
 * Sound with the given frequency and duration. Each envelope is
 * applied to a harmonic: the first harmonic has the given frequency,
 * the second has twice the frequency, the third three times the
 * frequency etc.
 * @param {function} waveform - function from frequency and duration to Sound
 * @param {Number} base_frequency - frequency of the first harmonic
 * @param {Number} duration - duration of the produced Sound, in seconds
 * @param {list_of_envelope} envelopes - each a function from Sound to Sound
 * @returns {Sound} resulting Sound
 */
function stacking_adsr(
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

  return simultaneously(
    accumulate(
      (x: any, y: any) =>
        pair(tail(x)(waveform(base_frequency * head(x), duration)), y),
      null,
      zip(envelopes, 1)
    )
  );
}

// instruments for students

/**
 * returns a Sound that is reminiscent of a trombone, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting trombone Sound with given given pitch and duration
 */
function trombone(note: number, duration: number): Sound {
  return stacking_adsr(
    square_sound,
    midi_note_to_frequency(note),
    duration,
    list(adsr(0.2, 0, 1, 0.1), adsr(0.3236, 0.6, 0, 0.1))
  );
}

/**
 * returns a Sound that is reminiscent of a piano, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting piano Sound with given given pitch and duration
 */
function piano(note: number, duration: number): Sound {
  return stacking_adsr(
    triangle_sound,
    midi_note_to_frequency(note),
    duration,
    list(adsr(0, 0.515, 0, 0.05), adsr(0, 0.32, 0, 0.05), adsr(0, 0.2, 0, 0.05))
  );
}

/**
 * returns a Sound that is reminiscent of a bell, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting bell Sound with given given pitch and duration
 */
function bell(note: number, duration: number): Sound {
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
 * returns a Sound that is reminiscent of a violin, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting violin Sound with given given pitch and duration
 */
function violin(note: number, duration: number): Sound {
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

/**
 * returns a Sound that is reminiscent of a cello, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {Number} note - midi note
 * @param {Number} duration - duration in seconds
 * @returns {Sound} resulting cello Sound with given given pitch and duration
 */
function cello(note: number, duration: number): Sound {
  return stacking_adsr(
    square_sound,
    midi_note_to_frequency(note),
    duration,
    list(adsr(0.05, 0, 1, 0.1), adsr(0.05, 0, 1, 0.15), adsr(0, 0, 0.2, 0.15))
  );
}

/*
function phase_mod(freq : number, duration : Duration, sound : Sound, amount : number) : Sound {
  return make_sound(t => )
}
*/

// Un-comment the next line if your bundle requires the use of variables
// declared in cadet-frontend or js-slang.
// export default (_params: __Params) => ({
export default () => ({
  // Constructor/Accessors/Typecheck
  make_sound,
  get_wave,
  get_duration,
  is_sound,
  // Play-related
  play,
  play_concurrently,
  stop,
  // Composition
  consecutively,
  simultaneously,
  // Basic waveforms
  noise_sound,
  silence_sound,
  sine_sound,
  sawtooth_sound,
  triangle_sound,
  square_sound,
  // MIDI
  letter_name_to_midi_note,
  midi_note_to_frequency,
  letter_name_to_frequency,
  // ADSR related
  adsr,
  stacking_adsr,
  // Instruments
  bell,
  cello,
  piano,
  trombone,
  violin,
});
