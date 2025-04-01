import FFT from 'fft.js';
import {
  pair,
  head,
  tail,
  accumulate,
  type List
} from 'js-slang/dist/stdlib/list';
import type {
  TimeSamples,
  FrequencySample,
  FrequencySamples,
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
