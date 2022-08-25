export type Pair<H, T> = [H, T];
export type EmptyList = null;
export type NonEmptyList = Pair<any, any>;
export type List = EmptyList | NonEmptyList;
export type Wave = (...t: any) => number;
export type Sound = Pair<Pair<Wave, Wave>, number>;
export type SoundProducer = (...t: any) => Sound;
export type SoundTransformer = (s: Sound) => Sound;
export type ErrorLogger = (
  error: string | string[],
  isSlangError?: boolean
) => void;
export type AudioPlayed = {
  toReplString: () => string;
  dataUri: string;
};
