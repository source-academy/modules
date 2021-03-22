/* eslint-disable no-unused-vars */
export type VideoElement = HTMLVideoElement & { srcObject?: MediaStream };
export type CanvasElement = HTMLCanvasElement;
export type ErrorLogger = (
  error: string | string[],
  isSlangError?: boolean
) => void;
export type Video = {
  toReplString: () => string;
  init: (
    video: VideoElement,
    canvas: CanvasElement,
    errorLogger: ErrorLogger
  ) => void;
};
export type Pixel = number[];
export type Pixels = Pixel[][];
export type Filter = (src: Pixels, dest: Pixels) => void;
