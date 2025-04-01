import {
  pair,
  tail,
  accumulate,
  type List
} from 'js-slang/dist/stdlib/list';
import type {
  // TimeSamples,
  FrequencySample,
  FrequencySamples,
  Filter
} from '../sound/types';

// TODO: Export FS from 'sound', then import it here.
// We cannot import yet since we didn't export it.
const FS: number = 44100;

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
