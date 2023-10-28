export type VideoElement = HTMLVideoElement & { srcObject?: MediaStream };
export type ImageElement = HTMLImageElement;
export type CanvasElement = HTMLCanvasElement;
export type ErrorLogger = (
  error: string | string[],
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
export type StartPacket = {
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
};
export type Pixel = number[];
export type Pixels = Pixel[][];
export type Filter = (src: Pixels, dest: Pixels) => void;
