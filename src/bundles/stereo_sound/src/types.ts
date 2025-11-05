import type { Pair } from 'js-slang/dist/stdlib/list';

export type Wave = (t: number) => number;
export type Sound = Pair<Pair<Wave, Wave>, number>;
export type SoundProducer = (...t: any) => Sound;
export type SoundTransformer = (s: Sound) => Sound;

export type AudioPlayed = {
  toReplString: () => string;
  dataUri: string;
};

export type StereoSoundModuleState = {
  audioPlayed: AudioPlayed[];
};
