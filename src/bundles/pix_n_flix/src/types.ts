
export type ErrorLogger = (
  error: string[] | string,
  isSlangError?: boolean
) => void;

export interface CameraInputMode {
  type: 'camera';
  stream: MediaStream | false | null;
  fps: number;
}

export interface VideoInputMode {
  type: 'video';
  url: string;
  volume: number;
  fps: number;
  loopCount: number;
}

export interface ImageInputMode {
  type: 'image';
  url: string;
}

/**
 * Mode waiting for the user to upload either an image or a video
 */
export interface LocalInputMode {
  type: 'local';
}

export type InputMode = CameraInputMode | ImageInputMode | LocalInputMode | VideoInputMode;

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

export interface PixNFlixState {
  init: (
    image: HTMLImageElement,
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
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

export type Pixel = [r: number, g: number, b: number, a: number];
export type Pixels = Pixel[][];

/**
 * A `void` returning function that takes the pixel data in `src`,
 * transforms it, and then writes the output to `dest`.
 */
export type Filter = (src: Pixels, dest: Pixels) => void;

export type Dimensions = [width: number, height: number];

export interface PixNFlixGlobalState {
  expectedDimensions: Dimensions;

  errorLogger?: ErrorLogger;
  filter: Filter;

  inputMode: InputMode;
  changeInputMode: (newMode: InputMode) => void;
}
