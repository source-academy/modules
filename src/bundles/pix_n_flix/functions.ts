/* eslint-disable @typescript-eslint/no-shadow */
import {
  type CanvasElement,
  type VideoElement,
  type ErrorLogger,
  type StartPacket,
  type Pixel,
  type Pixels,
  type Filter,
  type Queue,
  type TabsPacket,
  type BundlePacket,
  InputFeed,
  type ImageElement,
} from './types';

import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_FPS,
  DEFAULT_VOLUME,
  MAX_HEIGHT,
  MIN_HEIGHT,
  MAX_WIDTH,
  MIN_WIDTH,
  MAX_FPS,
  MIN_FPS,
  DEFAULT_LOOP,
} from './constants';

// Global Variables
let WIDTH: number = DEFAULT_WIDTH;
let HEIGHT: number = DEFAULT_HEIGHT;
let FPS: number = DEFAULT_FPS;
let VOLUME: number = DEFAULT_VOLUME;
let LOOP_COUNT: number = DEFAULT_LOOP;

let imageElement: ImageElement;
let videoElement: VideoElement;
let canvasElement: CanvasElement;
let canvasRenderingContext: CanvasRenderingContext2D;
let errorLogger: ErrorLogger;
let tabsPackage: TabsPacket;

const pixels: Pixels = [];
const temporaryPixels: Pixels = [];
let filter: Filter = copy_image;

let toRunLateQueue: boolean = false;
let videoIsPlaying: boolean = false;

let requestId: number;
let prevTime: number | null = null;
let totalElapsedTime: number = 0;
let playCount: number = 0;

let inputFeed: InputFeed = InputFeed.Camera;
let url: string = '';

// Images dont aspect ratio correctly
let keepAspectRatio: boolean = true;
let intrinsicWidth: number = WIDTH;
let intrinsicHeight: number = HEIGHT;
let displayWidth: number = WIDTH;
let displayHeight: number = HEIGHT;

// =============================================================================
// Module's Private Functions
// =============================================================================

/** @hidden */
function setupData(): void {
  for (let i = 0; i < HEIGHT; i += 1) {
    pixels[i] = [];
    temporaryPixels[i] = [];
    for (let j = 0; j < WIDTH; j += 1) {
      pixels[i][j] = [0, 0, 0, 255];
      temporaryPixels[i][j] = [0, 0, 0, 255];
    }
  }
}

/** @hidden */
function isPixelFilled(pixel: Pixel): boolean {
  let ok = true;
  for (let i = 0; i < 4; i += 1) {
    if (pixel[i] >= 0 && pixel[i] <= 255) {
      continue;
    }
    ok = false;
    pixel[i] = 0;
  }
  return ok;
}

/** @hidden */
function writeToBuffer(buffer: Uint8ClampedArray, data: Pixels) {
  let ok: boolean = true;

  for (let i = 0; i < HEIGHT; i += 1) {
    for (let j = 0; j < WIDTH; j += 1) {
      const p = i * WIDTH * 4 + j * 4;
      if (isPixelFilled(data[i][j]) === false) {
        ok = false;
      }
      buffer[p] = data[i][j][0];
      buffer[p + 1] = data[i][j][1];
      buffer[p + 2] = data[i][j][2];
      buffer[p + 3] = data[i][j][3];
    }
  }

  if (!ok) {
    const warningMessage
      = 'You have invalid values for some pixels! Reseting them to default (0)';
    console.warn(warningMessage);
    errorLogger(warningMessage, false);
  }
}

/** @hidden */
function readFromBuffer(pixelData: Uint8ClampedArray, src: Pixels) {
  for (let i = 0; i < HEIGHT; i += 1) {
    for (let j = 0; j < WIDTH; j += 1) {
      const p = i * WIDTH * 4 + j * 4;
      src[i][j] = [
        pixelData[p],
        pixelData[p + 1],
        pixelData[p + 2],
        pixelData[p + 3],
      ];
    }
  }
}

/** @hidden */
function drawImage(source: VideoElement | ImageElement): void {
  if (keepAspectRatio) {
    canvasRenderingContext.rect(0, 0, WIDTH, HEIGHT);
    canvasRenderingContext.fill();
    canvasRenderingContext.drawImage(
      source,
      0,
      0,
      intrinsicWidth,
      intrinsicHeight,
      (WIDTH - displayWidth) / 2,
      (HEIGHT - displayHeight) / 2,
      displayWidth,
      displayHeight,
    );
  } else canvasRenderingContext.drawImage(source, 0, 0, WIDTH, HEIGHT);

  const pixelObj = canvasRenderingContext.getImageData(0, 0, WIDTH, HEIGHT);
  readFromBuffer(pixelObj.data, pixels);

  // Runtime checks to guard against crashes
  try {
    filter(pixels, temporaryPixels);
    writeToBuffer(pixelObj.data, temporaryPixels);
  } catch (e: any) {
    console.error(JSON.stringify(e));
    const errMsg = `There is an error with filter function, filter will be reset to default. ${e.name}: ${e.message}`;
    console.error(errMsg);

    if (!e.name) {
      errorLogger(
        'There is an error with filter function (error shown below). Filter will be reset back to the default. If you are facing an infinite loop error, you can consider increasing the timeout period (clock icon) at the top / reducing the frame dimensions.',
      );

      errorLogger([e], true);
    } else {
      errorLogger(errMsg, false);
    }

    filter = copy_image;
    filter(pixels, temporaryPixels);
  }

  canvasRenderingContext.putImageData(pixelObj, 0, 0);
}

/** @hidden */
function draw(timestamp: number): void {
  requestId = window.requestAnimationFrame(draw);

  if (prevTime === null) prevTime = timestamp;

  const elapsed = timestamp - prevTime;
  if (elapsed > 1000 / FPS && videoIsPlaying) {
    drawImage(videoElement);
    prevTime = timestamp;
    totalElapsedTime += elapsed;
    if (toRunLateQueue) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      lateQueue();
      toRunLateQueue = false;
    }
  }
}

/** @hidden */
function playVideoElement() {
  if (!videoIsPlaying) {
    videoElement
      .play()
      .then(() => {
        videoIsPlaying = true;
      })
      .catch((err) => {
        console.warn(err);
      });
  }
}

/** @hidden */
function pauseVideoElement() {
  if (videoIsPlaying) {
    videoElement.pause();
    videoIsPlaying = false;
  }
}

/** @hidden */
function startVideo(): void {
  if (videoIsPlaying) return;
  if (inputFeed === InputFeed.Camera) videoIsPlaying = true;
  else playVideoElement();
  requestId = window.requestAnimationFrame(draw);
}

/**
 * Stops the loop that is drawing on image.
 *
 * @hidden
 */
function stopVideo(): void {
  if (!videoIsPlaying) return;
  if (inputFeed === InputFeed.Camera) videoIsPlaying = false;
  else pauseVideoElement();
  window.cancelAnimationFrame(requestId);
  prevTime = null;
}

/** @hidden */
function setAspectRatioDimensions(w: number, h: number): void {
  intrinsicHeight = h;
  intrinsicWidth = w;
  const scale = Math.min(WIDTH / w, HEIGHT / h);
  displayWidth = scale * w;
  displayHeight = scale * h;
}

/** @hidden */
function loadMedia(): void {
  if (!navigator.mediaDevices.getUserMedia) {
    const errMsg = 'The browser you are using does not support getUserMedia';
    console.error(errMsg);
    errorLogger(errMsg, false);
  }

  // If video is already part of bundle state
  if (videoElement.srcObject) return;

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => setAspectRatioDimensions(
        videoElement.videoWidth,
        videoElement.videoHeight,
      );
      toRunLateQueue = true;
    })
    .catch((error) => {
      const errorMessage = `${error.name}: ${error.message}`;
      console.error(errorMessage);
      errorLogger(errorMessage, false);
    });

  startVideo();
}

/** @hidden */
function loadAlternative(): void {
  try {
    if (inputFeed === InputFeed.VideoURL) {
      videoElement.src = url;
      startVideo();
    } else if (inputFeed === InputFeed.ImageURL) {
      imageElement.src = url;
    }
  } catch (e: any) {
    console.error(JSON.stringify(e));
    const errMsg = `There is an error loading the URL. ${e.name}: ${e.message}`;
    console.error(errMsg);
    loadMedia();
    return;
  }
  toRunLateQueue = true;

  /** Setting Up videoElement */
  videoElement.crossOrigin = 'anonymous';
  videoElement.onended = () => {
    playCount++;
    if (playCount >= LOOP_COUNT) {
      playCount = 0;

      tabsPackage.onClickStill();
    } else {
      stopVideo();
      startVideo();
    }
  };
  videoElement.onloadedmetadata = () => {
    setAspectRatioDimensions(videoElement.videoWidth, videoElement.videoHeight);
  };

  /** Setting Up imageElement */
  imageElement.crossOrigin = 'anonymous';
  imageElement.onload = () => {
    setAspectRatioDimensions(
      imageElement.naturalWidth,
      imageElement.naturalHeight,
    );
    drawImage(imageElement);
  };
}

/**
 * Update the FPS
 *
 * @hidden
 */
function updateFPS(fps: number): void {
  if (fps < MIN_FPS || fps > MAX_FPS) return;
  FPS = fps;
}

/**
 * Update the image dimensions.
 *
 * @hidden
 */
function updateDimensions(w: number, h: number): void {
  // ignore if no change or bad inputs
  if (
    (w === WIDTH && h === HEIGHT)
    || w > MAX_WIDTH
    || w < MIN_WIDTH
    || h > MAX_HEIGHT
    || h < MIN_HEIGHT
  ) {
    return;
  }

  const status = videoIsPlaying;
  stopVideo();

  WIDTH = w;
  HEIGHT = h;

  imageElement.width = w;
  imageElement.height = h;
  videoElement.width = w;
  videoElement.height = h;
  canvasElement.width = w;
  canvasElement.height = h;

  setupData();

  if (!status) {
    setTimeout(() => stopVideo(), 50);
    return;
  }

  startVideo();
}

/**
 * Updates the volume of the local video
 *
 * @hidden
 */
function updateVolume(v: number): void {
  VOLUME = Math.max(0.0, Math.min(1.0, v));
  videoElement.volume = VOLUME;
}

// queue is run when init is called
let queue: Queue = () => {};

/**
 * Adds function to the queue
 *
 * @hidden
 */
function enqueue(funcToAdd: Queue): void {
  const funcToRunFirst: Queue = queue;
  queue = () => {
    funcToRunFirst();
    funcToAdd();
  };
}

// lateQueue is run after media has properly loaded
let lateQueue: Queue = () => {};

/**
 * Adds function to the lateQueue
 *
 * @hidden
 */
function lateEnqueue(funcToAdd: Queue): void {
  const funcToRunFirst: Queue = lateQueue;
  lateQueue = () => {
    funcToRunFirst();
    funcToAdd();
  };
}

/**
 * Used to initialise the video library.
 *
 * @returns a BundlePackage object containing Video's properties
 *     and other miscellaneous information relevant to tabs.
 * @hidden
 */
function init(
  image: ImageElement,
  video: VideoElement,
  canvas: CanvasElement,
  _errorLogger: ErrorLogger,
  _tabsPackage: TabsPacket,
): BundlePacket {
  imageElement = image;
  videoElement = video;
  canvasElement = canvas;
  errorLogger = _errorLogger;
  tabsPackage = _tabsPackage;
  const context = canvasElement.getContext('2d');
  if (!context) throw new Error('Canvas context should not be null.');
  canvasRenderingContext = context;
  setupData();
  if (inputFeed === InputFeed.Camera) {
    loadMedia();
  } else {
    loadAlternative();
  }
  queue();
  return {
    HEIGHT,
    WIDTH,
    FPS,
    VOLUME,
    inputFeed,
  };
}

/**
 * Destructor that does necessary cleanup.
 *
 * @hidden
 */
function deinit(): void {
  stopVideo();
  const stream = videoElement.srcObject;
  if (!stream) {
    return;
  }
  stream.getTracks()
    .forEach((track) => {
      track.stop();
    });
}

// =============================================================================
// Module's Exposed Functions
// =============================================================================

/**
 * Starts processing the image or video using the installed filter.
 */
export function start(): StartPacket {
  return {
    toReplString: () => '[Pix N Flix]',
    init,
    deinit,
    startVideo,
    stopVideo,
    updateFPS,
    updateVolume,
    updateDimensions,
  };
}

/**
 * Returns the red component of the given pixel.
 *
 * @param pixel The given pixel
 * @returns The red component as a number between 0 and 255
 */
export function red_of(pixel: Pixel): number {
  // returns the red value of pixel respectively
  return pixel[0];
}

/**
 * Returns the green component of the given pixel.
 *
 * @param pixel The given pixel
 * @returns The green component as a number between 0 and 255
 */
export function green_of(pixel: Pixel): number {
  // returns the green value of pixel respectively
  return pixel[1];
}

/**
 * Returns the blue component of the given pixel.
 *
 * @param pixel The given pixel
 * @returns The blue component as a number between 0 and 255
 */
export function blue_of(pixel: Pixel): number {
  // returns the blue value of pixel respectively
  return pixel[2];
}

/**
 * Returns the alpha component of the given pixel.
 *
 * @param pixel The given pixel
 * @returns The alpha component as a number between 0 and 255
 */
export function alpha_of(pixel: Pixel): number {
  // returns the alpha value of pixel respectively
  return pixel[3];
}

/**
 * Assigns the given red, green, blue and alpha component values to
 * the given pixel.
 *
 * @param pixel The given pixel
 * @param r The red component as a number between 0 and 255
 * @param g The green component as a number between 0 and 255
 * @param b The blue component as a number between 0 and 255
 * @param a The alpha component as a number between 0 and 255
 */
export function set_rgba(
  pixel: Pixel,
  r: number,
  g: number,
  b: number,
  a: number,
): void {
  // assigns the r,g,b values to this pixel
  pixel[0] = r;
  pixel[1] = g;
  pixel[2] = b;
  pixel[3] = a;
}

/**
 * Returns the current height of the displayed images in
 * pixels, i.e. the number of pixels in the vertical dimension.
 *
 * @returns The height of the displayed images (in pixels)
 */
export function image_height(): number {
  return HEIGHT;
}

/**
 * Returns the current width of the displayed images in
 * pixels, i.e. the number of pixels in the horizontal dimension.
 *
 * @returns The width of the displayed images (in pixels)
 */
export function image_width(): number {
  return WIDTH;
}

/**
 * The default filter that just copies the source image to the
 * destination image.
 *
 * @param src Source image
 * @param dest Destination image
 */
export function copy_image(src: Pixels, dest: Pixels): void {
  for (let i = 0; i < HEIGHT; i += 1) {
    for (let j = 0; j < WIDTH; j += 1) {
      dest[i][j] = src[i][j];
    }
  }
}

/**
 * Installs the given filter to be used to transform each source image from
 * the live camera or from a local/remote file to a destination image that
 * is then displayed on screen.
 *
 * A filter is a function that is applied to two
 * two-dimensional arrays of Pixels:
 * the source image and the destination image.
 *
 * @param filter The filter to be installed
 */
export function install_filter(_filter: Filter): void {
  filter = _filter;
}

/**
 * Resets the installed filter to the default filter.
 */
export function reset_filter(): void {
  install_filter(copy_image);
}

/**
 * Creates a black image.
 *
 * @hidden
 */
function new_image(): Pixels {
  const img: Pixels = [];
  for (let i = 0; i < HEIGHT; i += 1) {
    img[i] = [];
    for (let j = 0; j < WIDTH; j += 1) {
      img[i][j] = [0, 0, 0, 255];
    }
  }
  return img;
}

/**
 * Returns a new filter that is equivalent to applying
 * filter1 and then filter2.
 *
 * @param filter1 The first filter
 * @param filter2 The second filter
 * @returns The filter equivalent to applying filter1 and then filter2
 */
export function compose_filter(filter1: Filter, filter2: Filter): Filter {
  return (src, dest) => {
    const temp = new_image();
    filter1(src, temp);
    filter2(temp, dest);
  };
}

/**
 * Pauses the video at a set time after the video starts.
 *
 * @param pause_time Time in ms after the video starts.
 */
export function pause_at(pause_time: number): void {
  // prevent negative pause_time
  lateEnqueue(() => {
    setTimeout(
      tabsPackage.onClickStill,
      pause_time >= 0 ? pause_time : -pause_time,
    );
  });
}

/**
 * Sets the diemsions of the displayed images.
 * Note: Only accepts width and height values within the range of 1 to 500.
 *
 * @param width The width of the displayed images (default value: 300)
 * @param height The height of the displayed images (default value: 400)
 */
export function set_dimensions(width: number, height: number): void {
  enqueue(() => updateDimensions(width, height));
}

/**
 * Sets the framerate (i.e. frames per second (FPS)) of the video.
 * Note: Only accepts FPS values within the range of 2 to 30.
 *
 * @param fps FPS of video (default value: 10)
 */
export function set_fps(fps: number): void {
  enqueue(() => updateFPS(fps));
}

/**
 * Sets the audio volume of the local video file played.
 * Note: Only accepts volume value within the range of 0 to 100.
 *
 * @param volume Volume of video (Default value of 50)
 */
export function set_volume(volume: number): void {
  enqueue(() => updateVolume(Math.max(0, Math.min(100, volume) / 100.0)));
}

/**
 * Sets pix_n_flix to use video or image feed from a local file
 * instead of using the default live camera feed.
 */
export function use_local_file(): void {
  inputFeed = InputFeed.Local;
}

/**
 * Sets pix_n_flix to use the image from the given URL as the image feed
 * instead of using the default live camera feed.
 *
 * @param URL URL of the image
 */
export function use_image_url(URL: string): void {
  inputFeed = InputFeed.ImageURL;
  url = URL;
}

/**
 * Sets pix_n_flix to use the video from the given URL as the video feed
 * instead of using the default live camera feed.
 *
 * @param URL URL of the video
 */
export function use_video_url(URL: string): void {
  inputFeed = InputFeed.VideoURL;
  url = URL;
}

/**
 * Returns the elapsed time in milliseconds since the start of the video.
 *
 * @returns The elapsed time in milliseconds since the start of the video
 */
export function get_video_time(): number {
  return totalElapsedTime;
}

/**
 * Sets pix_n_flix to preserve the aspect ratio of the video or image
 *
 * @param keepAspectRatio to keep aspect ratio. (Default value of true)
 */
export function keep_aspect_ratio(_keepAspectRatio: boolean): void {
  keepAspectRatio = _keepAspectRatio;
}

/**
 * Sets the number of times the video is played.
 * If the number of times the video repeats is negative, the video will loop forever.
 *
 * @param n number of times the video repeats after the first iteration. If n < 1, n will be taken to be 1. (Default value of Infinity)
 */
export function set_loop_count(n: number): void {
  LOOP_COUNT = n;
}
