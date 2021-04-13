/* eslint-disable no-unused-vars */
export type Pair<H, T> = [H, T];
export type EmptyList = null;
export type NonEmptyList = Pair<any, any>;
export type List = EmptyList | NonEmptyList;
export type Wave = (...t: any) => number;
export type Sound = Pair<Wave, number>;
export type SoundProducer = (...t: any) => Sound;
export type UnaryComposition = (s: Sound) => Sound;
export type AudioElement = HTMLAudioElement;
export type ErrorLogger = (
  error: string | string[],
  isSlangError?: boolean
) => void;
export type Audio = {
  toReplString: () => string;
  init: (audio: HTMLAudioElement) => void;
  deinit: () => void;
  updateSrc: (src: string) => void;
};
