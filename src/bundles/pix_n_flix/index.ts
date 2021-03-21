/**
 * Bundle for Source Academy PixNFlix module
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */

// Global Variables
const _WIDTH: number = 400;
const _HEIGHT: number = 300;

let _video: Video;
let _canvas: Canvas;
let _context: CanvasRenderingContext2D;
let _errorLogger: ErrorLogger;

const _pixels: Pixels = [];
const _temp: Pixels = [];
let _filter: Filter = copy_image;

let _isPlaying: boolean = false;

const _FPS: number = 10;
let _requestId: number;
let _startTime: number;

// Types
type Video = HTMLVideoElement & { srcObject?: MediaStream };
type Canvas = HTMLCanvasElement;
type ErrorLogger = (error: string | string[], isSlangError?: boolean) => void;
type VideoFunction = (
  video: Video,
  canvas: Canvas,
  errorLogger: ErrorLogger
) => void;
type Pixel = number[];
type Pixels = Pixel[][];
type Filter = (src: Pixels, dest: Pixels) => void;

// =============================================================================
// Module's Exposed Functions
// =============================================================================

/**
 * Initialize the PixNFlix live feed with default globals
 */
function init(): VideoFunction {
  return (video, canvas, errorLogger) => {
    _video = video;
    _canvas = canvas;
    _errorLogger = errorLogger;
    const context = _canvas.getContext('2d');
    if (context == null) throw new Error('Canvas context should not be null.');
    _context = context;

    setupData();
    loadMedia();
  };
}

/**
 * Returns the current height of the output video display in
 * pixels, i.e. the number of pixels in vertical direction
 * @returns height of output display (in pixels)
 */
function video_height(): number {
  return _HEIGHT;
}

/**
 * Returns the current width of the output video display in
 * pixels, i.e. the number of pixels in horizontal direction
 * @returns width of output display (in pixels)
 */
function video_width(): number {
  return _WIDTH;
}

/**
 * The default filter that just copies the input 2D
 * grid to output
 * @param src - 2D input src of pixels
 * @param dest - 2D output src of pixels
 */
function copy_image(src: Pixels, dest: Pixels): void {
  for (let i = 0; i < _HEIGHT; i++) {
    for (let j = 0; j < _WIDTH; j++) {
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
function install_filter(filter: Filter): void {
  _filter = filter;
}

export default function () {
  return {
    init,
    install_filter,
    copy_image,
    video_height,
    video_width,
  };
}

// =============================================================================
// Module's Private Functions
// =============================================================================

function setupData(): void {
  for (let i = 0; i < _WIDTH; i++) {
    _pixels[i] = [];
    _temp[i] = [];
  }
}

function loadMedia(): void {
  if (!navigator.mediaDevices.getUserMedia) {
    const errMsg = 'The browser you are using does not support getUserMedia';
    // eslint-disable-next-line no-console
    console.error(errMsg);
    _errorLogger(errMsg, false);
  }

  // If video is already part of bundle state
  if (_video.srcObject != null) return;

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      _video.srcObject = stream;
    })
    .catch((error) => {
      const errorMessage = `${error.name}: ${error.message}`;
      // eslint-disable-next-line no-console
      console.error(errorMessage);
      _errorLogger(errorMessage, false);
    });

  startVideo();
}

function startVideo(): void {
  if (_isPlaying) return;
  _isPlaying = true;
  _requestId = window.requestAnimationFrame(draw);
}

function draw(timestamp: number): void {
  _requestId = window.requestAnimationFrame(draw);

  if (_startTime == null) _startTime = timestamp;

  const elapsed = timestamp - _startTime;
  if (elapsed > 1000 / _FPS) {
    drawFrame();
    _startTime = timestamp;
  }
}

function drawFrame(): void {
  _context.drawImage(_video, 0, 0, _WIDTH, _HEIGHT);
  const pixelObj = _context.getImageData(0, 0, _WIDTH, _HEIGHT);
  readFromBuffer(pixelObj.data, _pixels);

  // Runtime checks to guard against crashes
  try {
    _filter(_pixels, _temp);
    writeToBuffer(pixelObj.data, _temp);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(e));
    const errMsg = `There is an error with filter function, filter will be reset to default. ${e.name}: ${e.message}`;
    // eslint-disable-next-line no-console
    console.error(errMsg);

    if (!e.name) {
      _errorLogger(
        'There is an error with filter function (error shown below). Filter will be reset back to the default. If you are facing an infinite loop error, you can consider increasing the timeout period (clock icon) at the top / reducing the video dimensions.'
      );

      _errorLogger([e], true);
    } else {
      _errorLogger(errMsg, false);
    }

    _filter = copy_image;
    _filter(_pixels, _temp);
  }

  _context.putImageData(pixelObj, 0, 0);
}

function readFromBuffer(pixelData: Uint8ClampedArray, src: Pixels) {
  for (let i = 0; i < _HEIGHT; i++) {
    for (let j = 0; j < _WIDTH; j++) {
      const p = i * _WIDTH * 4 + j * 4;
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

function writeToBuffer(buffer: Uint8ClampedArray, data: Pixels) {
  let ok: boolean = true;

  for (let i = 0; i < _HEIGHT; i++) {
    for (let j = 0; j < _WIDTH; j++) {
      const p = i * _WIDTH * 4 + j * 4;
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
    _errorLogger(warningMessage, false);
  }
}

function isPixelFilled(pixel: Pixel): boolean {
  let ok = true;
  for (let i = 0; i < 4; i++) {
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
