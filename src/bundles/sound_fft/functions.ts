import FFT from 'fft.js';
import {
  pair,
  head,
  tail,
  set_tail,
  accumulate,
  list_to_vector,
  type List
} from 'js-slang/dist/stdlib/list';
import type { Sound } from '../sound/types';
import { vector_to_list } from './list';
import {
  make_sound,
  get_wave,
  get_duration
} from './sound_functions';
import type {
  TimeSamples,
  FrequencySample,
  AugmentedSample,
  FrequencySamples,
  FrequencyList,
  Filter
} from './types';

// TODO: Export FS from 'sound', then import it here.
// We cannot import yet since we didn't export it.
const FS: number = 44100;

// CONVERSION

function time_to_frequency(time_samples: TimeSamples): FrequencySamples {
  const n = time_samples.length;
  const fft = new FFT(n);

  const flatDomain = fft.createComplexArray();
  const fullSamples = fft.createComplexArray();

  fft.toComplexArray(time_samples, fullSamples);
  fft.transform(flatDomain, fullSamples);

  const frequencyDomain = new Array(n);
  for (let i = 0; i < n; i++) {
    const real = flatDomain[i * 2];
    const imag = flatDomain[i * 2 + 1];
    const magnitude = Math.sqrt(real * real + imag * imag);
    const phase = Math.atan2(imag, real);
    frequencyDomain[i] = pair(magnitude, phase);
  }

  return frequencyDomain;
}

function frequency_to_time(frequency_samples: FrequencySamples): TimeSamples {
  const n = frequency_samples.length;
  const fft = new FFT(n);

  const timeDomain = fft.createComplexArray();
  const flatDomain = fft.createComplexArray();

  for (let i = 0; i < n; i++) {
    const magnitude = get_magnitude_fs(frequency_samples[i]);
    const phase = get_phase_fs(frequency_samples[i]);
    const real = magnitude * Math.cos(phase);
    const imag = magnitude * Math.sin(phase);
    flatDomain[i * 2] = real;
    flatDomain[i * 2 + 1] = imag;
  }

  fft.inverseTransform(timeDomain, flatDomain);

  const timeSamples = new Array(n);
  fft.fromComplexArray(timeDomain, timeSamples);
  return timeSamples;
}

function next_power_of_2(x: number): number {
  const lowerPowerOf2: number = 1 << 31 - Math.clz32(x);
  if (lowerPowerOf2 == x) {
    return lowerPowerOf2;
  } else {
    return lowerPowerOf2 * 2;
  }
}

// Pad to power-of-2
function sound_to_time_samples(sound: Sound): TimeSamples {
  const baseSize = Math.ceil(FS * get_duration(sound));
  const sampleSize = next_power_of_2(baseSize);
  const wave = get_wave(sound);

  const sample = new Array(sampleSize);
  for (let i = 0; i < sampleSize; i += 1) {
    sample[i] = wave(i / FS);
  }

  return sample;
}

function time_samples_to_sound(time_samples: TimeSamples): Sound {
  const duration = time_samples.length / FS;
  return make_sound((t) => {
    const index = t * FS;
    const lowerIndex = Math.floor(index);
    const upperIndex = lowerIndex + 1;
    const ratio = index - lowerIndex;
    const upper = time_samples[upperIndex] ? time_samples[upperIndex] : 0;
    const lower = time_samples[lowerIndex] ? time_samples[lowerIndex] : 0;
    return lower * (1 - ratio) + upper * ratio;
  }, duration);
}

function frequency_to_list(frequency_samples: FrequencySamples): FrequencyList {
  const len = frequency_samples.length;
  const augmented_samples: AugmentedSample[] = new Array(len);
  for (let i = 0; i < len; i++) {
    augmented_samples[i] = pair(i * FS / len, frequency_samples[i]);
  }
  const frequency_list: FrequencyList = vector_to_list(augmented_samples);
  return frequency_list;
}

function list_to_frequency(frequency_list: FrequencyList): FrequencySamples {
  const augmented_samples: AugmentedSample[] = list_to_vector(frequency_list);
  const frequency_samples: FrequencySamples = new Array(augmented_samples.length);
  for (let i = 0; i < augmented_samples.length; i++) {
    frequency_samples[i] = tail(augmented_samples[i]);
  }
  return frequency_samples;
}

/**
 * Returns the frequency-domain representation of the given Sound.
 *
 * The length of the returned list is the smallest power of 2 that is larger
 * than or equal to the duration of the sound multiplied by the sampling
 * rate (44,100).
 *
 * Converting a Sound to its frequency-domain representation and back
 * may produce a Sound with a longer duration.
 * @param sound given Sound
 * @returns the frequency-domain representation of the given Sound
 * @example const f = sound_to_frequency(sine_sound(440, 1));
 */
export function sound_to_frequency(sound: Sound): FrequencyList {
  const time_samples: TimeSamples = sound_to_time_samples(sound);
  const frequency_samples: FrequencySamples = time_to_frequency(time_samples);
  const frequency_list: FrequencyList = frequency_to_list(frequency_samples);
  return frequency_list;
}

/**
 * Returns the Sound with the given frequency-domain representation.
 *
 * The duration of the returned Sound in seconds is the length of the
 * frequency-domain representation (which is a power of 2), divided by the
 * sampling rate (44,100).
 *
 * Converting a Sound to its frequency-domain representation and back
 * may produce a Sound with a longer duration.
 * @param frequency_list given frequency-domain representation
 * @returns the Sound with the given frequency-domain representation
 * @example
 * ```typescript
 * const f = sound_to_frequency(sine_sound(440, 1));
 * const s = frequency_to_sound(f);
 * ```
 */
export function frequency_to_sound(frequency_list: FrequencyList): Sound {
  const frequency_samples: FrequencySamples = list_to_frequency(frequency_list);
  const time_samples: TimeSamples = frequency_to_time(frequency_samples);
  const sound: Sound = time_samples_to_sound(time_samples);
  return sound;
}

// FREQUENCY, MAGNITUDE and PHASE

function get_magnitude_fs(frequency_sample: FrequencySample): number {
  return head(frequency_sample);
}

function get_phase_fs(frequency_sample: FrequencySample): number {
  return tail(frequency_sample);
}

/**
 * Returns the frequency of a given sample in a frequency-domain representation.
 * @param augmented_sample a sample in a frequency-domain representation
 * @returns frequency
 * @example
 * ```typescript
 * const f = sound_to_frequency(sine_sound(440, 1));
 * get_frequency(head(f));
 * ```
 */
export function get_frequency(augmented_sample: AugmentedSample): number {
  return head(augmented_sample);
}

/**
 * Returns the magnitude of a given sample in a frequency-domain representation.
 * @param augmented_sample a sample in a frequency-domain representation
 * @returns magnitude
 * @example
 * ```typescript
 * const f = sound_to_frequency(sine_sound(440, 1));
 * get_magnitude(head(f));
 * ```
 */
export function get_magnitude(augmented_sample: AugmentedSample): number {
  return get_magnitude_fs(tail(augmented_sample));
}

/**
 * Returns the phase of a given sample in a frequency-domain representation.
 * @param augmented_sample a sample in a frequency-domain representation
 * @returns phase
 * @example
 * ```typescript
 * const f = sound_to_frequency(sine_sound(440, 1));
 * get_phase(head(f));
 * ```
 */
export function get_phase(augmented_sample: AugmentedSample): number {
  return get_phase_fs(tail(augmented_sample));
}

/**
 * Returns a frequency sample with the given parameters.
 * @param frequency frequency of the constructed element
 * @param magnitude magnitude of the constructed element
 * @param phase phase of the constructed element
 * @returns a frequency sample
 * @example
 * ```typescript
 * const mute_sample = sample => make_augmented_sample(
 *     get_frequency(sample),
 *     0,
 *     get_phase(sample));
 * ```
 */
export function make_augmented_sample(frequency: number, magnitude: number, phase: number): AugmentedSample {
  return pair(frequency, pair(magnitude, phase));
}

// FILTER CREATION

/**
 * Makes a low pass filter with the given frequency threshold. Frequencies
 * below the threshold will pass through the filter. Other frequencies will be
 * removed.
 * 
 * The filter is a function that takes in a frequency-domain representation and
 * returns another frequency-domain representation.
 * @param frequency threshold frequency
 * @returns a low pass filter
 * @example
 * ```typescript
 * const s1 = simultaneously(list(
 *     sine_sound(400, 1),
 *     sine_sound(2000, 1)));
 * const f1 = sound_to_frequency(s1);
 * const f2 = low_pass_filter(1000)(f1);
 * const s2 = frequency_to_sound(f2);
 * play(s2);
 * ```
 */
export function low_pass_filter(frequency: number): Filter {
  return (freq_list: FrequencyList) => {
    const freq_domain: AugmentedSample[] = list_to_vector(freq_list);
    for (let i = 0; i < freq_domain.length; i++) {
      const sample_freq: number = get_frequency(freq_domain[i]);
      if (sample_freq > frequency && sample_freq < FS - frequency) {
        freq_domain[i] = make_augmented_sample(
          sample_freq,
          0,
          get_phase(freq_domain[i])
        );
      }
    }
    return vector_to_list(freq_domain);
  };
}

/**
 * Makes a high pass filter with the given frequency threshold. Frequencies
 * above the threshold will pass through the filter. Other frequencies will be
 * removed.
 * 
 * The filter is a function that takes in a frequency-domain representation and
 * returns another frequency-domain representation.
 * @param frequency threshold frequency
 * @returns a high pass filter
 * @example
 * ```typescript
 * const s1 = simultaneously(list(
 *     sine_sound(400, 1),
 *     sine_sound(2000, 1)));
 * const f1 = sound_to_frequency(s1);
 * const f2 = high_pass_filter(1000)(f1);
 * const s2 = frequency_to_sound(f2);
 * play(s2);
 * ```
 */
export function high_pass_filter(frequency: number): Filter {
  return (freq_list: FrequencyList) => {
    const freq_domain: AugmentedSample[] = list_to_vector(freq_list);
    for (let i = 0; i < freq_domain.length; i++) {
      const sample_freq: number = get_frequency(freq_domain[i]);
      if (sample_freq < frequency || sample_freq > FS - frequency) {
        freq_domain[i] = make_augmented_sample(
          sample_freq,
          0,
          get_phase(freq_domain[i])
        );
      }
    }
    return vector_to_list(freq_domain);
  };
}

/**
 * Makes a new filter that is the result of combining all filters in the given
 * list. Passing frequencies through the new filter produces the same result as
 * passing frequencies through `head(filters)`, then through
 * `head(tail(filters))`, and so on.
 * 
 * The filter is a function that takes in a frequency-domain representation and
 * returns another frequency-domain representation.
 * @param frequency threshold frequency
 * @returns a filter
 * @example
 * ```typescript
 * const band_filter = combine_filters(list(
 *     high_pass_filter(870),
 *     low_pass_filter(890)));
 * const f1 = sound_to_frequency(noise_sound(1));
 * const f2 = band_filter(f1);
 * const s2 = frequency_to_sound(f2);
 * play(s2); // compare with play(sine_sound(880, 1));
 * ```
 */
export function combine_filters(filters: List): Filter {
  const nullFilter = (x: any) => x;
  function combine(f1: Filter, f2: Filter) {
    return (frequencyDomain: FrequencyList) => f1(f2(frequencyDomain));
  }
  return accumulate(combine, nullFilter, filters);
}

// FILTER SOUND
/**
 * Transforms the given Sound by converting it to its frequency-domain
 * representation, applying the given frequency filter, converting back into a
 * Sound and truncating it so that its duration is the same as the original
 * Sound.
 * @param sound the Sound to transform
 * @param filter the frequency filter to apply
 * @returns the transformed Sound
 * @example
 * ```typescript
 * const s1 = simultaneously(list(
 *     sine_sound(400, 1),
 *     sine_sound(2000, 1)));
 * const s2 = filter_sound(s1, low_pass_filter(1000));
 * play(s2);
 * ```
 */
export function filter_sound(sound: Sound, filter: Filter): Sound {
  const original_duration = get_duration(sound);
  const original_size = Math.ceil(FS * original_duration);
  const frequency_list_before = sound_to_frequency(sound);
  const frequency_list_after = filter(frequency_list_before);
  const frequency_samples = list_to_frequency(frequency_list_after);

  for (let i = original_size; i < frequency_samples.length; i++) {
    frequency_samples[i] = pair(0, 0);
  }

  const final_list = frequency_to_list(frequency_samples);
  const final_sound = frequency_to_sound(final_list);
  set_tail(final_sound, original_duration);

  return final_sound;
}
