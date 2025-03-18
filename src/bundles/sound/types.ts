import type { Pair } from 'js-slang/dist/stdlib/list';

export type Wave = (...t: any) => number;
export type Sound = Pair<Wave, number>;
export type SoundProducer = (...t: any) => Sound;
export type SoundTransformer = (s: Sound) => Sound;
export type ErrorLogger = (
  error: string[] | string,
  isSlangError?: boolean
) => void;
export type AudioPlayed = {
  toReplString: () => string;
  dataUri: string;
};

export type SoundModuleState = {
  audioPlayed: AudioPlayed[]
};

// FFT
export type ComplexNumber = Pair<number, number>;
export type FFTFilter = (frequencyDomain: Array<ComplexNumber>) => Array<ComplexNumber>;
