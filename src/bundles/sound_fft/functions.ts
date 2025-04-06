import FFT from 'fft.js';
import {
  pair,
  head,
  tail,
  accumulate,
  list_to_vector,
  vector_to_list,
  type List
} from 'js-slang/dist/stdlib/list';
import type {
  TimeSamples,
  FrequencySample,
  FrequencySamples,
  FrequencyList,
  Filter
} from './types';
import type { Sound } from '../sound/types';
import {
  make_sound,
  get_wave,
  get_duration
} from './sound_functions';

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

export function sound_to_frequency(sound: Sound): FrequencyList {
  const time_samples: TimeSamples = sound_to_time_samples(sound);
  const frequency_samples: FrequencySamples = time_to_frequency(time_samples);
  const frequency_list: FrequencyList = vector_to_list(frequency_samples);
  return frequency_list;
}

export function frequency_to_sound(frequency_list: FrequencyList): Sound {
  const frequency_samples: FrequencySamples = list_to_vector(frequency_list);
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
  return (frequencyDomain) => {
    const length = frequencyDomain.length;
    const ratio = frequency / FS;
    const threshold = length * ratio;

    const filteredDomain: FrequencySamples = new Array<FrequencySample>(length);

    for (let i = 0; i < length; i++) {
      if (i < threshold) {
        filteredDomain[i] = frequencyDomain[i];
      } else {
        filteredDomain[i] = pair(0, tail(frequencyDomain[i]));
      }
    }
    return filteredDomain;
  };
}

export function high_pass_filter(frequency: number): Filter {
  return (frequencyDomain) => {
    const length = frequencyDomain.length;
    const ratio = frequency / FS;
    const threshold = length * ratio;

    const filteredDomain: FrequencySamples = new Array<FrequencySample>(length);

    for (let i = 0; i < length; i++) {
      if (i > threshold) {
        filteredDomain[i] = frequencyDomain[i];
      } else {
        filteredDomain[i] = pair(0, tail(frequencyDomain[i]));
      }
    }
    return filteredDomain;
  };
}

export function combine_filters(filters: List): Filter {
  const nullFilter = (x: any) => x;
  function combine(f1: Filter, f2: Filter) {
    return (frequencyDomain: FrequencySamples) => f1(f2(frequencyDomain));
  }
  return accumulate(combine, nullFilter, filters);
}
