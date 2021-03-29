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
  deinit: () => void;
  startVideo: () => void;
  snapPicture: () => void;
  updateFPS: (fps: number) => void;
  updateDimensions: (width: number, height: number) => void;
};
export type Pixel = number[];
export type Pixels = Pixel[][];
export type Filter = (src: Pixels, dest: Pixels) => void;

export const DEFAULT_WIDTH: number = 400;
export const DEFAULT_HEIGHT: number = 300;
export const DEFAULT_FPS: number = 10;
