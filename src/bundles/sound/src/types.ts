import type { ReplResult } from '@sourceacademy/modules-lib/types';
import type { Pair } from 'js-slang/dist/stdlib/list';

/**
 * A wave is a function that takes in a number `t` and returns
 * a number representing the amplitude at time `t`.\
 * The amplitude should fall within the range of [-1, 1].
 */
export type Wave = (t: number) => number;

/**
 * A Sound is a pair(wave, duration) where duration is the length of the sound in seconds.
 * The constructor make_sound and accessors get_wave and get_duration are provided.
 */
export type Sound = Pair<Wave, number>;

/**
 * A nullary function that returns a Sound.
 * @function
 */
export interface SoundPromise extends ReplResult {
  (): Sound;
}

export type SoundProducer = (...t: any) => Sound;
export type SoundTransformer = (s: Sound) => Sound;

export interface AudioPlayed extends ReplResult {
  dataUri: string;
};

export interface SoundModuleState {
  audioPlayed: AudioPlayed[];
};
