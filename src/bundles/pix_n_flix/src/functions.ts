// @ts-nochec k
import { GeneralRuntimeError, InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { assertFunctionOfLength, assertNumberWithinRange, isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
import {
  DEFAULT_FPS,
  DEFAULT_HEIGHT,
  DEFAULT_LOOP,
  DEFAULT_VOLUME,
  DEFAULT_WIDTH,
  MAX_FPS,
  MAX_HEIGHT,
  MAX_WIDTH,
  MIN_FPS,
  MIN_HEIGHT,
  MIN_WIDTH
} from './constants';
import type {
  Dimensions,
  ErrorLogger,
  Filter,
  PixNFlixGlobalState,
  Pixel,
  Pixels,
  TabsPacket,
} from './types';

const state: PixNFlixGlobalState = {
  filter: copy_image,
  expectedDimensions: [DEFAULT_WIDTH, DEFAULT_HEIGHT],

  inputMode: { type: 'camera', stream: null, fps: DEFAULT_FPS },
  changeInputMode(mode) {
    this.inputMode = mode;
  }
};

let errorLogger: ErrorLogger;
let tabsPackage: TabsPacket;

const playCount: number = 0;

// Images dont aspect ratio correctly
let keepAspectRatio: boolean = true;
let intrinsicWidth: number = WIDTH;
let intrinsicHeight: number = HEIGHT;
let displayWidth: number = WIDTH;
let displayHeight: number = HEIGHT;

// =============================================================================
// Module's Private Functions
// =============================================================================

/**
 * Creates a black image with the given height and width
 *
 * @param height Height of image (in number of pixels)
 * @param width Width of image (in number of pixels)
 * @hidden
 */
export function new_image(height: number, width: number): Pixels {
  const img: Pixels = [];
  for (let i = 0; i < height; i += 1) {
    img[i] = [];
    for (let j = 0; j < width; j += 1) {
      img[i][j] = [0, 0, 0, 255];
    }
  }
  return img;
}

/**
 * Determines whether the r,g,b and a values for the pixel
 * are valid (i.e between 0 and 255). If that value is out of range,
 * then that value gets set to 0.
 * Exported for testing.
 * @hidden
 */
export function isPixelValid(pixel: Pixel): boolean {
  let ok = true;
  for (let i = 0; i < 4; i += 1) {
    const value = pixel[i];
    if (isNumberWithinRange(value, 0, 255)) {
      continue;
    }

    ok = false;
    pixel[i] = 0;
  }
  return ok;
}

/**
 * Write the provided pixel data to the buffer, performing error checking
 * and resetting invalid pixels.
 * Exported for testing.
 * @hidden
 */
export function writeToBuffer(buffer: Uint8ClampedArray, data: Pixels, [width, height]: Dimensions) {
  let ok = true;

  for (let i = 0; i < Math.min(height, data.length); i++) {
    const row = data[i];

    for (let j = 0; j < Math.min(width, row.length); j++) {
      const p = i * width * 4 + j * 4;
      if (!isPixelValid(row[j])) {
        ok = false;
      }
      buffer[p] = row[j][0];
      buffer[p + 1] = row[j][1];
      buffer[p + 2] = row[j][2];
      buffer[p + 3] = row[j][3];
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
function setAspectRatioDimensions(w: number, h: number): void {
  intrinsicHeight = h;
  intrinsicWidth = w;
  const scale = Math.min(WIDTH / w, HEIGHT / h);
  displayWidth = scale * w;
  displayHeight = scale * h;
}

/** @hidden */
export function getMediaStream() {
  if (!navigator.mediaDevices?.getUserMedia) {
    const errMsg = 'The browser you are using does not support getUserMedia';
    console.error(errMsg);
    errorLogger(errMsg, false);
  }

  // If video is already part of bundle state
  if (videoElement.srcObject) return;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => setAspectRatioDimensions(
        videoElement.videoWidth,
        videoElement.videoHeight
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

function throwIfNotPixel(obj: unknown, func_name: string, param_name?: string): asserts obj is Pixel {
  if (
    !Array.isArray(obj) ||
    obj.length !== 4 ||
    obj.some(each => typeof each !== 'number')
  ) {
    throw new InvalidParameterTypeError('pixel', obj, func_name, param_name);
  }
}

// =============================================================================
// Module's Exposed Functions
// =============================================================================

/**
 * Returns the red component of the given pixel.
 *
 * @param pixel The given pixel
 * @returns The red component as a number between 0 and 255
 */
export function red_of(pixel: Pixel): number {
  throwIfNotPixel(pixel, red_of.name);
  return pixel[0];
}

/**
 * Returns the green component of the given pixel.
 *
 * @param pixel The given pixel
 * @returns The green component as a number between 0 and 255
 */
export function green_of(pixel: Pixel): number {
  throwIfNotPixel(pixel, green_of.name);
  return pixel[1];
}

/**
 * Returns the blue component of the given pixel.
 *
 * @param pixel The given pixel
 * @returns The blue component as a number between 0 and 255
 */
export function blue_of(pixel: Pixel): number {
  throwIfNotPixel(pixel, blue_of.name);
  return pixel[2];
}

/**
 * Returns the alpha component of the given pixel.
 *
 * @param pixel The given pixel
 * @returns The alpha component as a number between 0 and 255
 */
export function alpha_of(pixel: Pixel): number {
  throwIfNotPixel(pixel, alpha_of.name);
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
  a: number
): void {
  throwIfNotPixel(pixel, set_rgba.name, 'pixel');
  assertNumberWithinRange(r, set_rgba.name, 0, 255, true, 'r');
  assertNumberWithinRange(g, set_rgba.name, 0, 255, true, 'g');
  assertNumberWithinRange(b, set_rgba.name, 0, 255, true, 'b');
  assertNumberWithinRange(a, set_rgba.name, 0, 255, true, 'a');

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
  return state.expectedDimensions[1];
}

/**
 * Returns the current width of the displayed images in
 * pixels, i.e. the number of pixels in the horizontal dimension.
 *
 * @returns The width of the displayed images (in pixels)
 */
export function image_width(): number {
  return state.expectedDimensions[0];
}

/**
 * The default filter that just copies the source image to the
 * destination image.
 *
 * @param src Source image
 * @param dest Destination image
 */
export function copy_image(src: Pixels, dest: Pixels) {
  for (let i = 0; i < src.length; i += 1) {
    const srcRow = src[i];

    for (let j = 0; j < src.length; j += 1) {
      dest[i][j] = srcRow[j];
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
export function install_filter(filter: Filter): void {
  assertFunctionOfLength(filter, 2, install_filter.name, 'filter');
  state.filter = filter;
}

/**
 * Resets the installed filter to the default filter.
 */
export function reset_filter(): void {
  install_filter(copy_image);
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
  assertFunctionOfLength(filter1, 2, compose_filter.name, 'filter', 'filter1');
  assertFunctionOfLength(filter2, 2, compose_filter.name, 'filter', 'filter2');

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
  assertNumberWithinRange(pause_time, pause_at.name, 0);

  lateEnqueue(() => {
    setTimeout(
      tabsPackage.onClickStill,
      pause_time
    );
  });
}

/**
 * Sets the dimensions of the displayed images.
 * Note: Only accepts width and height values within the range of 1 to 500.
 *
 * @param width The width of the displayed images (default value: 300)
 * @param height The height of the displayed images (default value: 400)
 */
export function set_dimensions(width: number, height: number): void {
  assertNumberWithinRange(width, set_dimensions.name, MIN_WIDTH, MAX_WIDTH, true, 'width');
  assertNumberWithinRange(height, set_dimensions.name, MIN_HEIGHT, MAX_HEIGHT, true, 'height');

  enqueue(() => updateDimensions(width, height));
}

/**
 * Sets the framerate (i.e. frames per second (FPS)) of the video.
 * Note: Only accepts FPS values within the range of 2 to 30.
 *
 * @param fps FPS of video (default value: 10)
 */
export function set_fps(fps: number): void {
  assertNumberWithinRange(fps, set_fps.name, MIN_FPS, MAX_FPS);
  if (state.inputMode.type === 'image' || state.inputMode.type === 'local') {
    // TODO: Throw error?
    return;
  }

  state.inputMode.fps = fps;
}

/**
 * Sets the audio volume of the local video file played.
 * Note: Only accepts volume value within the range of 0 to 100.
 *
 * @param volume Volume of video (Default value of 50)
 */
export function set_volume(volume: number): void {
  if (state.inputMode.type !== 'video') {
    throw new GeneralRuntimeError(`${set_volume.name}: Must be used with video mode!`);
  }

  assertNumberWithinRange(volume, set_volume.name);

  if (volume > 100) volume = 100;
  else if (volume < 0) volume = 0;

  state.inputMode.volume = volume / 100;
}

/**
 * Sets pix_n_flix to use video or image feed from a local file
 * instead of using the default live camera feed.
 */
export function use_local_file(): void {
  state.changeInputMode({ type: 'local' });
}

/**
 * Sets pix_n_flix to use the image from the given URL as the image feed
 * instead of using the default live camera feed.
 *
 * @param URL URL of the image
 */
export function use_image_from_url(URL: string): void {
  if (typeof URL !== 'string') {
    throw new InvalidParameterTypeError('string', URL, use_image_from_url.name);
  }

  state.changeInputMode({
    type: 'image',
    url: URL
  });
}

/**
 * Sets pix_n_flix to use the video from the given URL as the video feed
 * instead of using the default live camera feed.
 *
 * @param URL URL of the video
 */
export function use_video_from_ul(URL: string): void {
  if (typeof URL !== 'string') {
    throw new InvalidParameterTypeError('string', URL, use_video_from_ul.name);
  }

  state.changeInputMode({
    type: 'video',
    url: URL,
    fps: DEFAULT_FPS,
    loopCount: DEFAULT_LOOP,
    volume: DEFAULT_VOLUME
  });
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
 * @param _keepAspectRatio to keep aspect ratio. (Default value of true)
 */
export function keep_aspect_ratio(_keepAspectRatio: boolean): void {
  if (typeof _keepAspectRatio !== 'boolean') {
    throw new InvalidParameterTypeError('boolean', URL, keep_aspect_ratio.name);
  }

  keepAspectRatio = _keepAspectRatio;
}

/**
 * Sets the number of times the video is played.
 * If the number of times the video repeats is negative, the video will loop forever.
 *
 * @param n number of times the video repeats after the first iteration. If n < 1, n will be taken to be 1. (Default value of Infinity)
 */
export function set_loop_count(n: number): void {
  assertNumberWithinRange(n, set_loop_count.name);

  if (state.inputMode.type !== 'video') {
    throw new GeneralRuntimeError(`${set_loop_count.name} can only be used with video mode.`);
  }

  state.inputMode.loopCount = n;
}
