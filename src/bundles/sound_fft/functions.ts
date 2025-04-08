import FFT from 'fft.js';
import {
  pair,
  head,
  tail,
  set_tail,
  accumulate,
  list_to_vector,
  vector_to_list,
  type List
} from 'js-slang/dist/stdlib/list';
import type { Sound } from '../sound/types';
import {
  make_sound,
  get_wave,
  get_duration
} from './sound_functions';
import type {
  TimeSamples,
  FrequencySample,
  FrequencySamples,
  FrequencyList,
  Filter
} from './types';

// TODO: Export FS from 'sound', then import it here.
// We cannot import yet since we didn't export it.
const FS: number = 44100;

// CONVERSION

export function time_to_frequency(time_samples: TimeSamples): FrequencySamples {
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

export function frequency_to_time(frequency_samples: FrequencySamples): TimeSamples {
  const n = frequency_samples.length;
  const fft = new FFT(n);

  const timeDomain = fft.createComplexArray();
  const flatDomain = fft.createComplexArray();

  for (let i = 0; i < n; i++) {
    const magnitude = get_magnitude(frequency_samples[i]);
    const phase = get_phase(frequency_samples[i]);
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
export function sound_to_time_samples(sound: Sound): TimeSamples {
  const baseSize = Math.ceil(FS * get_duration(sound));
  const sampleSize = next_power_of_2(baseSize);
  const wave = get_wave(sound);

  const sample = new Array(sampleSize);
  for (let i = 0; i < sampleSize; i += 1) {
    sample[i] = wave(i / FS);
  }

  return sample;
}

export function time_samples_to_sound(time_samples: TimeSamples): Sound {
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
  const augmented_samples: any[] = new Array(len);
  for (let i = 0; i < len; i++) {
    augmented_samples[i] = pair(pair(i * FS / len, (i+1) * FS / len), frequency_samples[i]);
  }
  const frequency_list: FrequencyList = vector_to_list(augmented_samples);
  return frequency_list;
}

function list_to_frequency(frequency_list: FrequencyList): FrequencySamples {
  const augmented_samples: any[] = list_to_vector(frequency_list);
  const frequency_samples: FrequencySamples = new Array(augmented_samples.length);
  for (let i = 0; i < augmented_samples.length; i++) {
    frequency_samples[i] = tail(augmented_samples[i]);
  }
  return frequency_samples;
}

export function sound_to_frequency(sound: Sound): FrequencyList {
  const time_samples: TimeSamples = sound_to_time_samples(sound);
  const frequency_samples: FrequencySamples = time_to_frequency(time_samples);
  const frequency_list: FrequencyList = frequency_to_list(frequency_samples);
  return frequency_list;
}

export function frequency_to_sound(frequency_list: FrequencyList): Sound {
  const frequency_samples: FrequencySamples = list_to_frequency(frequency_list);
  const time_samples: TimeSamples = frequency_to_time(frequency_samples);
  const sound: Sound = time_samples_to_sound(time_samples);
  return sound;
}

// MAGNITUDE and PHASE

export function get_magnitude(frequency_sample: FrequencySample): number {
  return head(frequency_sample);
}

export function get_phase(frequency_sample: FrequencySample): number {
  return tail(frequency_sample);
}

// FILTER CREATION

export function low_pass_filter(frequency: number): Filter {
  return (freqList: FrequencyList) => {
    const freqDomain = list_to_vector(freqList);
    for (let i = 0; i < freqDomain.length; i++) {
      if (head(head(freqDomain[i])) > frequency) {
        freqDomain[i] = pair(
          head(freqDomain[i]), // Frequency range
          pair(
            0, // Magnitude
            tail(tail(freqDomain[i])) // Phase
          )
        );
      }
    }
    return vector_to_list(freqDomain);
  };
}

export function high_pass_filter(frequency: number): Filter {
  return (freqList: FrequencyList) => {
    const freqDomain = list_to_vector(freqList);
    for (let i = 0; i < freqDomain.length; i++) {
      if (tail(head(freqDomain[i])) < frequency) {
        freqDomain[i] = pair(
          head(freqDomain[i]), // Frequency range
          pair(
            0, // Magnitude
            tail(tail(freqDomain[i])) // Phase
          )
        );
      }
    }
    return vector_to_list(freqDomain);
  };
}

export function combine_filters(filters: List): Filter {
  const nullFilter = (x: any) => x;
  function combine(f1: Filter, f2: Filter) {
    return (frequencyDomain: FrequencyList) => f1(f2(frequencyDomain));
  }
  return accumulate(combine, nullFilter, filters);
}

// FILTER SOUND
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
