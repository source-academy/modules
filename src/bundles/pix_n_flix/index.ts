import {
  CanvasElement,
  VideoElement,
  ErrorLogger,
  Video,
  Pixel,
  Pixels,
  Filter,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_FPS,
} from './types';

/**
 * Bundle for Source Academy PixNFlix module
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */

// Global Variables
let WIDTH: number = DEFAULT_WIDTH;
let HEIGHT: number = DEFAULT_HEIGHT;

let videoElement: VideoElement;
let canvasElement: CanvasElement;
let canvasRenderingContext: CanvasRenderingContext2D;
let errorLogger: ErrorLogger;

const pixels: Pixels = [];
const temporaryPixels: Pixels = [];
// eslint-disable-next-line @typescript-eslint/no-use-before-define
let filter: Filter = copy_image;

let videoIsPlaying: boolean = false;

let FPS: number = DEFAULT_FPS;
let requestId: number;
let startTime: number;

// =============================================================================
// Module's Private Functions
// =============================================================================

function setupData(): void {
  for (let i = 0; i < WIDTH; i += 1) {
    pixels[i] = [];
    temporaryPixels[i] = [];
  }
}

function isPixelFilled(pixel: Pixel): boolean {
  let ok = true;
  for (let i = 0; i < 4; i += 1) {
    if (pixel[i] >= 0 && pixel[i] <= 255) {
      // eslint-disable-next-line no-continue
      continue;
    }
    ok = false;
    // eslint-disable-next-line no-param-reassign
    pixel[i] = 0;
  }
  return ok;
}

function writeToBuffer(buffer: Uint8ClampedArray, data: Pixels) {
  let ok: boolean = true;

  for (let i = 0; i < HEIGHT; i += 1) {
    for (let j = 0; j < WIDTH; j += 1) {
      const p = i * WIDTH * 4 + j * 4;
      if (isPixelFilled(data[i][j]) === false) {
        ok = false;
      }
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      buffer[p] = data[i][j][0];
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      buffer[p + 1] = data[i][j][1];
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      buffer[p + 2] = data[i][j][2];
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      buffer[p + 3] = data[i][j][3];
    }
  }

  if (!ok) {
    const warningMessage =
      'You have invalid values for some pixels! Reseting them to default (0)';
    // eslint-disable-next-line no-console
    console.warn(warningMessage);
    errorLogger(warningMessage, false);
  }
}

function readFromBuffer(pixelData: Uint8ClampedArray, src: Pixels) {
  for (let i = 0; i < HEIGHT; i += 1) {
    for (let j = 0; j < WIDTH; j += 1) {
      const p = i * WIDTH * 4 + j * 4;
      // eslint-disable-next-line no-param-reassign
      src[i][j] = [
        pixelData[p],
        pixelData[p + 1],
        pixelData[p + 2],
        pixelData[p + 3],
      ];
    }
  }
}

function drawFrame(): void {
  canvasRenderingContext.drawImage(videoElement, 0, 0, WIDTH, HEIGHT);
  const pixelObj = canvasRenderingContext.getImageData(0, 0, WIDTH, HEIGHT);
  readFromBuffer(pixelObj.data, pixels);

  // Runtime checks to guard against crashes
  try {
    filter(pixels, temporaryPixels);
    writeToBuffer(pixelObj.data, temporaryPixels);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(e));
    const errMsg = `There is an error with filter function, filter will be reset to default. ${e.name}: ${e.message}`;
    // eslint-disable-next-line no-console
    console.error(errMsg);

    if (!e.name) {
      errorLogger(
        'There is an error with filter function (error shown below). Filter will be reset back to the default. If you are facing an infinite loop error, you can consider increasing the timeout period (clock icon) at the top / reducing the video dimensions.'
      );

      errorLogger([e], true);
    } else {
      errorLogger(errMsg, false);
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    filter = copy_image;
    filter(pixels, temporaryPixels);
  }

  canvasRenderingContext.putImageData(pixelObj, 0, 0);
}

function draw(timestamp: number): void {
  // eslint-disable-next-line no-unused-vars
  requestId = window.requestAnimationFrame(draw);

  if (startTime == null) startTime = timestamp;

  const elapsed = timestamp - startTime;
  if (elapsed > 1000 / FPS) {
    drawFrame();
    startTime = timestamp;
  }
}

function startVideo(): void {
  if (videoIsPlaying) return;
  videoIsPlaying = true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  requestId = window.requestAnimationFrame(draw);
}

// stops the loop that is drawing on frame
function stopVideo(): void {
  if (!videoIsPlaying) {
    return;
  }
  videoIsPlaying = false;
  window.cancelAnimationFrame(requestId);
}

function loadMedia(): void {
  if (!navigator.mediaDevices.getUserMedia) {
    const errMsg = 'The browser you are using does not support getUserMedia';
    // eslint-disable-next-line no-console
    console.error(errMsg);
    errorLogger(errMsg, false);
  }

  // If video is already part of bundle state
  if (videoElement.srcObject != null) return;

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
    })
    .catch((error) => {
      const errorMessage = `${error.name}: ${error.message}`;
      // eslint-disable-next-line no-console
      console.error(errorMessage);
      errorLogger(errorMessage, false);
    });

  startVideo();
}

// just draws once on frame and stops video
function snapPicture(): void {
  drawFrame();
  stopVideo();
}

// update fps
function updateFPS(fps: number): void {
  // prevent too big of an increase
  if (fps < 2 || fps > 30) {
    return;
  }

  const status = videoIsPlaying;
  stopVideo();

  FPS = fps;
  setupData();

  if (!status) {
    setTimeout(() => snapPicture(), 50);
    return;
  }

  startVideo();
}

// update the frame dimensions
function updateDimensions(w: number, h: number): void {
  if ((w === WIDTH && h === HEIGHT) || w > 500 || h > 500) {
    return;
  }

  const status = videoIsPlaying;
  stopVideo();

  WIDTH = w;
  HEIGHT = h;

  videoElement.width = w;
  videoElement.height = h;
  canvasElement.width = w;
  canvasElement.height = h;

  setupData();

  if (!status) {
    setTimeout(() => snapPicture(), 50);
    return;
  }

  startVideo();
}

let queue: Function = () => {};

// adds function to the queue
function enqueue(funcToAdd: Function) {
  const funcToRunFirst: Function = queue;
  queue = () => {
    funcToRunFirst();
    funcToAdd();
  };
}

// used to initialise the video library
function init(
  video: VideoElement,
  canvas: CanvasElement,
  _errorLogger: ErrorLogger
): void {
  videoElement = video;
  canvasElement = canvas;
  errorLogger = _errorLogger;
  const context = canvasElement.getContext('2d');
  if (context == null) throw new Error('Canvas context should not be null.');
  canvasRenderingContext = context;

  setupData();
  loadMedia();
  queue();
}

// destructor that does necessary cleanup
function deinit(): void {
  const stream = videoElement.srcObject;
  if (!stream) {
    return;
  }
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

// =============================================================================
// Module's Exposed Functions
// =============================================================================

/**
 * Initialize the PixNFlix live feed with default globals
 */
function start(): Video {
  return {
    toReplString: () => '[Pix N Flix]',
    init,
    deinit,
    startVideo,
    snapPicture,
    updateFPS,
    updateDimensions,
  };
}

/**
 * Returns the red component of a given Pixel <CODE>px</CODE>
 * @param px - given Pixel
 * @returns the red component as a number between 0 and 255
 */
function red_of(px: Pixel): number {
  // returns the red value of px respectively
  return px[0];
}

/**
 * Returns the green component of a given Pixel <CODE>px</CODE>
 * @param px - given Pixel
 * @returns the green component as a number between 0 and 255
 */
function green_of(px: Pixel): number {
  // returns the green value of px respectively
  return px[1];
}

/**
 * Returns the blue component of a given Pixel <CODE>px</CODE>
 * @param px - given Pixel
 * @returns the blue component as a number between 0 and 255
 */
function blue_of(px: Pixel): number {
  // returns the blue value of px respectively
  return px[2];
}

/**
 * Returns the alpha component of a given Pixel <CODE>px</CODE>
 * @param px - given Pixel
 * @returns the alpha component as a number between 0 and 255
 */
function alpha_of(px: Pixel): number {
  // returns the alpha value of px respectively
  return px[3];
}

/**
 * Assigns the red, green, blue and alpha components of a pixel
 * <CODE>px</CODE> to given values
 * @param px - given Pixel
 * @param r - the red component as a number between 0 and 255
 * @param g - the green component as a number between 0 and 255
 * @param b - the blue component as a number between 0 and 255
 * @param a - the alpha component as a number between 0 and 255
 */
function set_rgba(px: Pixel, r: number, g: number, b: number, a: number): void {
  // assigns the r,g,b values to this px
  // eslint-disable-next-line no-param-reassign
  px[0] = r;
  // eslint-disable-next-line no-param-reassign
  px[1] = g;
  // eslint-disable-next-line no-param-reassign
  px[2] = b;
  // eslint-disable-next-line no-param-reassign
  px[3] = a;
}

/**
 * Returns the current height of the output video display in
 * pixels, i.e. the number of pixels in vertical direction
 * @returns height of output display (in pixels)
 */
function video_height(): number {
  return HEIGHT;
}

/**
 * Returns the current width of the output video display in
 * pixels, i.e. the number of pixels in horizontal direction
 * @returns width of output display (in pixels)
 */
function video_width(): number {
  return WIDTH;
}

/**
 * The default filter that just copies the input 2D
 * grid to output
 * @param src - 2D input src of pixels
 * @param dest - 2D output src of pixels
 */
function copy_image(src: Pixels, dest: Pixels): void {
  for (let i = 0; i < HEIGHT; i += 1) {
    for (let j = 0; j < WIDTH; j += 1) {
      // eslint-disable-next-line no-param-reassign
      dest[i][j] = src[i][j];
    }
  }
}

/**
 * Installs a given filter to be used to transform
 * the images that the camera captures into images
 * displayed on the screen. A filter is a function
 * that is applied to two two-dimensional arrays
 * of Pixels: the source image and the destination
 * image.
 * @param filter - the filter to be installed
 */
function install_filter(_filter: Filter): void {
  filter = _filter;
}

/**
 * Resets any filter applied on the video
 */
function reset_filter(): void {
  install_filter(copy_image);
}

/**
 * Returns a new filter that is the result of applying both
 * filter1 and filter2 together
 * @param filter1 - the first filter
 * @param filter2 - the second filter
 * @returns Filter after applying filter1 and filter2
 */
function compose_filter(filter1: Filter, filter2: Filter): Filter {
  return (src, dest) => {
    filter1(src, dest);
    copy_image(dest, src);
    filter2(src, dest);
  };
}

/**
 * Takes a snapshot of image after a set delay
 * @param delayInMs - Delay before a snapshot is taken
 */
function snapshot(delayInMs: number): void {
  enqueue(() => setTimeout(stopVideo, delayInMs));
}

export default () => ({
  start,
  red_of,
  blue_of,
  green_of,
  alpha_of,
  set_rgba,
  video_height,
  video_width,
  copy_image,
  install_filter,
  reset_filter,
  compose_filter,
  snapshot,
});
