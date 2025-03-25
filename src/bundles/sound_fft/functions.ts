import FFT from 'fft.js';
import {
  pair
} from 'js-slang/dist/stdlib/list';
import {
} from '../sound/functions';
import type {
  TimeSamples,
  FrequencySample,
  FrequencySamples,
  Filter
} from './types';

// TODO: Export FS from 'sound', then import it here.
// We cannot import yet since we didn't export it.
const FS: number = 44100;

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
        filteredDomain[i] = pair(0, 0);
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
        filteredDomain[i] = pair(0, 0);
      }
    }
    return filteredDomain;
  };
}

export function combine_filters(...filters: Filter[]): Filter {
  return (frequencyDomain) => {
    let current: FrequencySamples = frequencyDomain;
    for (let i = filters.length - 1; i >= 0; i--) {
      current = filters[i](current);
    }
    return current;
  };
}
