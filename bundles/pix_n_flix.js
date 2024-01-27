require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      });
    }
    return to;
  };
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var pix_n_flix_exports = {};
  __export(pix_n_flix_exports, {
    alpha_of: () => alpha_of,
    blue_of: () => blue_of,
    compose_filter: () => compose_filter,
    copy_image: () => copy_image,
    get_video_time: () => get_video_time,
    green_of: () => green_of,
    image_height: () => image_height,
    image_width: () => image_width,
    install_filter: () => install_filter,
    keep_aspect_ratio: () => keep_aspect_ratio,
    pause_at: () => pause_at,
    red_of: () => red_of,
    reset_filter: () => reset_filter,
    set_dimensions: () => set_dimensions,
    set_fps: () => set_fps,
    set_loop_count: () => set_loop_count,
    set_rgba: () => set_rgba,
    set_volume: () => set_volume,
    start: () => start,
    use_image_url: () => use_image_url,
    use_local_file: () => use_local_file,
    use_video_url: () => use_video_url
  });
  var DEFAULT_WIDTH = 400;
  var DEFAULT_HEIGHT = 300;
  var DEFAULT_FPS = 10;
  var DEFAULT_VOLUME = 0.5;
  var DEFAULT_LOOP = Infinity;
  var MAX_HEIGHT = 1024;
  var MIN_HEIGHT = 1;
  var MAX_WIDTH = 1024;
  var MIN_WIDTH = 1;
  var MAX_FPS = 60;
  var MIN_FPS = 1;
  var WIDTH = DEFAULT_WIDTH;
  var HEIGHT = DEFAULT_HEIGHT;
  var FPS = DEFAULT_FPS;
  var VOLUME = DEFAULT_VOLUME;
  var LOOP_COUNT = DEFAULT_LOOP;
  var imageElement;
  var videoElement;
  var canvasElement;
  var canvasRenderingContext;
  var errorLogger;
  var tabsPackage;
  var pixels = [];
  var temporaryPixels = [];
  var filter = copy_image;
  var toRunLateQueue = false;
  var videoIsPlaying = false;
  var requestId;
  var prevTime = null;
  var totalElapsedTime = 0;
  var playCount = 0;
  var inputFeed = 0;
  var url = "";
  var keepAspectRatio = true;
  var intrinsicWidth = WIDTH;
  var intrinsicHeight = HEIGHT;
  var displayWidth = WIDTH;
  var displayHeight = HEIGHT;
  function setupData() {
    for (let i = 0; i < HEIGHT; i += 1) {
      pixels[i] = [];
      temporaryPixels[i] = [];
      for (let j = 0; j < WIDTH; j += 1) {
        pixels[i][j] = [0, 0, 0, 255];
        temporaryPixels[i][j] = [0, 0, 0, 255];
      }
    }
  }
  function isPixelFilled(pixel) {
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
  function writeToBuffer(buffer, data) {
    let ok = true;
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
      const warningMessage = "You have invalid values for some pixels! Reseting them to default (0)";
      console.warn(warningMessage);
      errorLogger(warningMessage, false);
    }
  }
  function readFromBuffer(pixelData, src) {
    for (let i = 0; i < HEIGHT; i += 1) {
      for (let j = 0; j < WIDTH; j += 1) {
        const p = i * WIDTH * 4 + j * 4;
        src[i][j] = [pixelData[p], pixelData[p + 1], pixelData[p + 2], pixelData[p + 3]];
      }
    }
  }
  function drawImage(source) {
    if (keepAspectRatio) {
      canvasRenderingContext.rect(0, 0, WIDTH, HEIGHT);
      canvasRenderingContext.fill();
      canvasRenderingContext.drawImage(source, 0, 0, intrinsicWidth, intrinsicHeight, (WIDTH - displayWidth) / 2, (HEIGHT - displayHeight) / 2, displayWidth, displayHeight);
    } else canvasRenderingContext.drawImage(source, 0, 0, WIDTH, HEIGHT);
    const pixelObj = canvasRenderingContext.getImageData(0, 0, WIDTH, HEIGHT);
    readFromBuffer(pixelObj.data, pixels);
    try {
      filter(pixels, temporaryPixels);
      writeToBuffer(pixelObj.data, temporaryPixels);
    } catch (e) {
      console.error(JSON.stringify(e));
      const errMsg = `There is an error with filter function, filter will be reset to default. ${e.name}: ${e.message}`;
      console.error(errMsg);
      if (!e.name) {
        errorLogger("There is an error with filter function (error shown below). Filter will be reset back to the default. If you are facing an infinite loop error, you can consider increasing the timeout period (clock icon) at the top / reducing the frame dimensions.");
        errorLogger([e], true);
      } else {
        errorLogger(errMsg, false);
      }
      filter = copy_image;
      filter(pixels, temporaryPixels);
    }
    canvasRenderingContext.putImageData(pixelObj, 0, 0);
  }
  function draw(timestamp) {
    requestId = window.requestAnimationFrame(draw);
    if (prevTime === null) prevTime = timestamp;
    const elapsed = timestamp - prevTime;
    if (elapsed > 1e3 / FPS && videoIsPlaying) {
      drawImage(videoElement);
      prevTime = timestamp;
      totalElapsedTime += elapsed;
      if (toRunLateQueue) {
        lateQueue();
        toRunLateQueue = false;
      }
    }
  }
  function playVideoElement() {
    if (!videoIsPlaying) {
      videoElement.play().then(() => {
        videoIsPlaying = true;
      }).catch(err => {
        console.warn(err);
      });
    }
  }
  function pauseVideoElement() {
    if (videoIsPlaying) {
      videoElement.pause();
      videoIsPlaying = false;
    }
  }
  function startVideo() {
    if (videoIsPlaying) return;
    if (inputFeed === 0) videoIsPlaying = true; else playVideoElement();
    requestId = window.requestAnimationFrame(draw);
  }
  function stopVideo() {
    if (!videoIsPlaying) return;
    if (inputFeed === 0) videoIsPlaying = false; else pauseVideoElement();
    window.cancelAnimationFrame(requestId);
    prevTime = null;
  }
  function setAspectRatioDimensions(w, h) {
    intrinsicHeight = h;
    intrinsicWidth = w;
    const scale = Math.min(WIDTH / w, HEIGHT / h);
    displayWidth = scale * w;
    displayHeight = scale * h;
  }
  function loadMedia() {
    if (!navigator.mediaDevices.getUserMedia) {
      const errMsg = "The browser you are using does not support getUserMedia";
      console.error(errMsg);
      errorLogger(errMsg, false);
    }
    if (videoElement.srcObject) return;
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => {
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => setAspectRatioDimensions(videoElement.videoWidth, videoElement.videoHeight);
      toRunLateQueue = true;
    }).catch(error => {
      const errorMessage = `${error.name}: ${error.message}`;
      console.error(errorMessage);
      errorLogger(errorMessage, false);
    });
    startVideo();
  }
  function loadAlternative() {
    try {
      if (inputFeed === 2) {
        videoElement.src = url;
        startVideo();
      } else if (inputFeed === 1) {
        imageElement.src = url;
      }
    } catch (e) {
      console.error(JSON.stringify(e));
      const errMsg = `There is an error loading the URL. ${e.name}: ${e.message}`;
      console.error(errMsg);
      loadMedia();
      return;
    }
    toRunLateQueue = true;
    videoElement.crossOrigin = "anonymous";
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
    imageElement.crossOrigin = "anonymous";
    imageElement.onload = () => {
      setAspectRatioDimensions(imageElement.naturalWidth, imageElement.naturalHeight);
      drawImage(imageElement);
    };
  }
  function updateFPS(fps) {
    if (fps < MIN_FPS || fps > MAX_FPS) return;
    FPS = fps;
  }
  function updateDimensions(w, h) {
    if (w === WIDTH && h === HEIGHT || w > MAX_WIDTH || w < MIN_WIDTH || h > MAX_HEIGHT || h < MIN_HEIGHT) {
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
  function updateVolume(v) {
    VOLUME = Math.max(0, Math.min(1, v));
    videoElement.volume = VOLUME;
  }
  var queue = () => {};
  function enqueue(funcToAdd) {
    const funcToRunFirst = queue;
    queue = () => {
      funcToRunFirst();
      funcToAdd();
    };
  }
  var lateQueue = () => {};
  function lateEnqueue(funcToAdd) {
    const funcToRunFirst = lateQueue;
    lateQueue = () => {
      funcToRunFirst();
      funcToAdd();
    };
  }
  function init(image, video, canvas, _errorLogger, _tabsPackage) {
    imageElement = image;
    videoElement = video;
    canvasElement = canvas;
    errorLogger = _errorLogger;
    tabsPackage = _tabsPackage;
    const context = canvasElement.getContext("2d");
    if (!context) throw new Error("Canvas context should not be null.");
    canvasRenderingContext = context;
    setupData();
    if (inputFeed === 0) {
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
      inputFeed
    };
  }
  function deinit() {
    stopVideo();
    const stream = videoElement.srcObject;
    if (!stream) {
      return;
    }
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  function start() {
    return {
      toReplString: () => "[Pix N Flix]",
      init,
      deinit,
      startVideo,
      stopVideo,
      updateFPS,
      updateVolume,
      updateDimensions
    };
  }
  function red_of(pixel) {
    return pixel[0];
  }
  function green_of(pixel) {
    return pixel[1];
  }
  function blue_of(pixel) {
    return pixel[2];
  }
  function alpha_of(pixel) {
    return pixel[3];
  }
  function set_rgba(pixel, r, g, b, a) {
    pixel[0] = r;
    pixel[1] = g;
    pixel[2] = b;
    pixel[3] = a;
  }
  function image_height() {
    return HEIGHT;
  }
  function image_width() {
    return WIDTH;
  }
  function copy_image(src, dest) {
    for (let i = 0; i < HEIGHT; i += 1) {
      for (let j = 0; j < WIDTH; j += 1) {
        dest[i][j] = src[i][j];
      }
    }
  }
  function install_filter(_filter) {
    filter = _filter;
  }
  function reset_filter() {
    install_filter(copy_image);
  }
  function new_image() {
    const img = [];
    for (let i = 0; i < HEIGHT; i += 1) {
      img[i] = [];
      for (let j = 0; j < WIDTH; j += 1) {
        img[i][j] = [0, 0, 0, 255];
      }
    }
    return img;
  }
  function compose_filter(filter1, filter2) {
    return (src, dest) => {
      const temp = new_image();
      filter1(src, temp);
      filter2(temp, dest);
    };
  }
  function pause_at(pause_time) {
    lateEnqueue(() => {
      setTimeout(tabsPackage.onClickStill, pause_time >= 0 ? pause_time : -pause_time);
    });
  }
  function set_dimensions(width, height) {
    enqueue(() => updateDimensions(width, height));
  }
  function set_fps(fps) {
    enqueue(() => updateFPS(fps));
  }
  function set_volume(volume) {
    enqueue(() => updateVolume(Math.max(0, Math.min(100, volume) / 100)));
  }
  function use_local_file() {
    inputFeed = 3;
  }
  function use_image_url(URL) {
    inputFeed = 1;
    url = URL;
  }
  function use_video_url(URL) {
    inputFeed = 2;
    url = URL;
  }
  function get_video_time() {
    return totalElapsedTime;
  }
  function keep_aspect_ratio(_keepAspectRatio) {
    keepAspectRatio = _keepAspectRatio;
  }
  function set_loop_count(n) {
    LOOP_COUNT = n;
  }
  return __toCommonJS(pix_n_flix_exports);
}