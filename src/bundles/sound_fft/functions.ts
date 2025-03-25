import {
  pair
} from 'js-slang/dist/stdlib/list';
import {
  playFFT
} from '../sound/functions';
import type {
  Sound
} from '../sound/types';
import type {
  FrequencySample,
  FrequencySamples,
  Filter
} from './types';

// TODO: Export FS from 'sound', then import it here.
// We cannot import yet since we didn't export it.
// const FS: number = 44100;

// FILTER CREATION

// export function low_pass_filter(frequency: number): Filter {
//  return (frequencyDomain) => {
//    const length = frequencyDomain.length;
//    const ratio = frequency / FS;
//    const threshold = length * ratio;
//
//    const filteredDomain: FrequencySamples = new Array<FrequencySample>(length);
//
//    for (let i = 0; i < length; i++) {
//      if (i < threshold) {
//        filteredDomain[i] = frequencyDomain[i];
//      } else {
//        filteredDomain[i] = pair(0, 0);
//      }
//    }
//    return filteredDomain;
//  };
// }
//
// export function high_pass_filter(frequency: number): Filter {
//  return (frequencyDomain) => {
//    const length = frequencyDomain.length;
//    const ratio = frequency / FS;
//    const threshold = length * ratio;
//
//    const filteredDomain: FrequencySamples = new Array<FrequencySample>(length);
//
//    for (let i = 0; i < length; i++) {
//      if (i > threshold) {
//        filteredDomain[i] = frequencyDomain[i];
//      } else {
//        filteredDomain[i] = pair(0, 0);
//      }
//    }
//    return filteredDomain;
//  };
// }
//
// export function combine_filters(...filters: Filter[]): Filter {
//  return (frequencyDomain) => {
//    let current: FrequencySamples = frequencyDomain;
//    for (let i = filters.length - 1; i >= 0; i--) {
//      current = filters[i](current);
//    }
//    return current;
//  };
// }

// PLAY FUNCTIONS

/*
export function play_samples(time_samples: TimeSamples): TimeSamples {
  // idk how to implement this without redeclaring audio_context and all bunch of stuff
  // probably should move this to 'sound', along with the definition of TimeSamples as well
}
*/

export function play_filtered(sound: Sound, filter: Filter): Sound {
  // just use play_samples I guess
  // for now, lets use my old function
  return playFFT(sound, filter);
}
