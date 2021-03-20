/**
 * Init function
 * @returns a hello string
 */
function test(): string {
  enqueue(() => {
    console.log('init ran');
  });
  return 'Hello! -Authors of Pix N Flix';
}

/**
 * Stops video player
 */
function stopVideo() {
  enqueue(() => {
    console.log('Stop');
    window.cancelAnimationFrame(_VD.video);
  });
}

/*
 *
 * INTERNAL FUNCTIONS
 *
 */

// Frame Size
const _WIDTH = 400;
const _HEIGHT = 300;

// FPS
const _FPS = 10;

// Object that preserves the state we need
const _VD: any = {};

_VD.startTime = null;
_VD.requestID = null;
_VD.isPlaying = false;
// _VD.filter = copy_image;
_VD.pixels = [];
_VD.temp = [];

// // initializes our arrays which we use for drawing
// _VD.setupData = function () {
//   for (let i = 0; i < _WIDTH; i++) {
//     _VD.pixels[i] = [];
//     _VD.temp[i] = [];
//   }
// };

// constructor that sets up initial state
_VD.init = function ($video, $canvas, errLogger) {
  _VD.video = $video;
  _VD.canvas = $canvas;
  // _VD.context = _VD.canvas.getContext('2d');
  // _VD.errLogger = errLogger;

  // _VD.setupData();
  // _VD.loadMedia();
};

// adds new function to back of queue
// only accepts functions with no arguments
function enqueue(funcToAdd: Function) {
  const funcToRunFirst: any = queue;
  queue = ($video, $canvas, errLogger) => {
    funcToRunFirst($video, $canvas, errLogger);
    funcToAdd();
  };
}

let queue = ($video, $canvas, errLogger) =>
  _VD.init($video, $canvas, errLogger);

/**
 * Returns function for front end to intialise state and run functions
 * @param $video
 * @param $canvas
 * @param errLogger
 */
function init(): Function {
  return ($video, $canvas, errLogger) => queue($video, $canvas, errLogger);
}

export default function () {
  return {
    test,
    init,
    stopVideo,
  };
}
