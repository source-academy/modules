import {
  CanvasElement,
  VideoElement,
  ErrorLogger,
  Video,
  Pixel,
  Pixels,
  Filter,
} from './types';

/**
 * Bundle for Source Academy PixNFlix module
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */

// Global Variables
const WIDTH: number = 400;
const HEIGHT: number = 300;

let videoElement: VideoElement;
let canvasElement: CanvasElement;
let canvasRenderingContext: CanvasRenderingContext2D;
let errorLogger: ErrorLogger;

const pixels: Pixels = [];
const temporaryPixels: Pixels = [];
// eslint-disable-next-line @typescript-eslint/no-use-before-define
let filter: Filter = copy_image;

let videoIsPlaying: boolean = false;

const FPS: number = 10;
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

// =============================================================================
// Module's Exposed Functions
// =============================================================================

/**
 * Initialize the PixNFlix live feed with default globals
 */
function init(): Video {
  return {
    toReplString: () => '[Pix N Flix]: Video { ... }',
    init: (video, canvas, _errorLogger) => {
      videoElement = video;
      canvasElement = canvas;
      errorLogger = _errorLogger;
      const context = canvasElement.getContext('2d');
      if (context == null)
        throw new Error('Canvas context should not be null.');
      canvasRenderingContext = context;

      setupData();
      loadMedia();
    },
  };
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

export default () => ({
  init,
  install_filter,
  copy_image,
  video_height,
  video_width,
});
