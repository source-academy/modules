import type { ReplResult } from '@sourceacademy/modules-lib/types';

export type VideoElement = HTMLVideoElement & { srcObject?: MediaStream };
export type ImageElement = HTMLImageElement;
export type CanvasElement = HTMLCanvasElement;
export type ErrorLogger = (
  error: string[] | string,
  isSlangError?: boolean
) => void;
export type TabsPacket = {
  onClickStill: () => void;
};
export enum InputFeed {
  Camera,
  ImageURL,
  VideoURL,
  Local,
}

export type BundlePacket = {
  HEIGHT: number;
  WIDTH: number;
  FPS: number;
  VOLUME: number;
  inputFeed: InputFeed;
};
export type Queue = () => void;

export interface StartPacket extends ReplResult {
  toReplString: () => string;
  init: (
    image: ImageElement,
    video: VideoElement,
    canvas: CanvasElement,
    errorLogger: ErrorLogger,
    tabsPackage: TabsPacket
  ) => BundlePacket;
  deinit: () => void;
  startVideo: () => void;
  stopVideo: () => void;
  updateFPS: (fps: number) => void;
  updateVolume: (volume: number) => void;
  updateDimensions: (width: number, height: number) => void;
}

export interface PixNFlixModuleState {
  pixnflix: StartPacket | null;
}

export type Pixel = [r: number, g: number, b: number, a: number];
export type Pixels = Pixel[][];

/**
 * A `void` returning function that takes the pixel data in `src`,
 * transforms it, and then writes the output to `dest`.
 */
export type Filter = (src: Pixels, dest: Pixels) => void;
