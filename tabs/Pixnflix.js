export default require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __spreadValues = (a2, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a2, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a2, prop, b[prop]);
    }
    return a2;
  };
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
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
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = value => {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var step = x => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var index_exports = {};
  __export(index_exports, {
    PIX_N_FLIX_TAB_ID: () => PIX_N_FLIX_TAB_ID,
    default: () => PixNFlixTabPlugin
  });
  var import_core = __require("@blueprintjs/core");
  var DEFAULT_WIDTH = 400;
  var DEFAULT_HEIGHT = 300;
  var DEFAULT_FPS = 10;
  var DEFAULT_VOLUME = 0.5;
  var MAX_HEIGHT = 1024;
  var MIN_HEIGHT = 1;
  var MAX_WIDTH = 1024;
  var MIN_WIDTH = 1;
  var MAX_FPS = 60;
  var MIN_FPS = 1;
  var PIX_N_FLIX_CONTROL_CHANNEL_ID = "sourceacademy-pix-n-flix-control-channel";
  var PIX_N_FLIX_FRAME_CHANNEL_ID = "sourceacademy-pix-n-flix-frame-channel";
  var PIX_N_FLIX_WEB_ID = "pix-n-flix-web";
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  var t = class {
    constructor(s4, t2, r2) {
      __publicField(this, "type", R.CALL);
      __publicField(this, "data");
      this.data = {
        fn: s4,
        args: t2,
        invokeId: r2
      };
    }
  };
  var r = class {
    constructor(s4, t2) {
      __publicField(this, "type", R.RETURN_ERR);
      __publicField(this, "data");
      this.data = {
        invokeId: s4,
        err: t2
      };
    }
  };
  var a = class {
    constructor(s4, t2) {
      __publicField(this, "type", R.RETURN);
      __publicField(this, "data");
      this.data = {
        invokeId: s4,
        res: t2
      };
    }
  };
  function s(s4, o2) {
    const c = [];
    let a2 = 0;
    return (s4.subscribe(n3 => __async(null, null, function* () {
      var _a, _b, _c, _d;
      switch (n3.type) {
        case R.CALL:
          {
            const {fn: r2, args: c2, invokeId: a3} = n3.data;
            try {
              const t2 = yield o2[r2](...c2);
              a3 > 0 && s4.send(new a(a3, t2));
            } catch (e2) {
              a3 > 0 && s4.send(new r(a3, e2));
            }
            break;
          }
        case R.RETURN:
          {
            const {invokeId: e2, res: t2} = n3.data;
            ((_b = (_a = c[e2]) == null ? void 0 : _a[0]) == null ? void 0 : _b.call(_a, t2), delete c[e2]);
            break;
          }
        case R.RETURN_ERR:
          {
            const {invokeId: e2, err: t2} = n3.data;
            ((_d = (_c = c[e2]) == null ? void 0 : _c[1]) == null ? void 0 : _d.call(_c, t2), delete c[e2]);
            break;
          }
      }
    })), new Proxy({}, {
      get(e2, t2, r2) {
        const o3 = Reflect.get(e2, t2, r2);
        if (o3) return o3;
        const i = "string" == typeof t2 && "$" === t2.charAt(0) ? (...e3) => {
          s4.send(new t(t2, e3, 0));
        } : (...e3) => {
          const r3 = ++a2;
          return (s4.send(new t(t2, e3, r3)), new Promise((e4, t3) => {
            c[r3] = [e4, t3];
          }));
        };
        return (Reflect.set(e2, t2, i, r2), i);
      }
    }));
  }
  function n(n3) {}
  var _;
  !(function (_2) {
    (_2.UNKNOWN = "__unknown", _2.INTERNAL = "__internal", _2.EVALUATOR = "__evaluator", _2.EVALUATOR_SYNTAX = "__evaluator_syntax", _2.EVALUATOR_TYPE = "__evaluator_type", _2.EVALUATOR_RUNTIME = "__evaluator_runtime");
  })(_ || (_ = {}));
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  var import_react = __require("react");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var PIX_N_FLIX_TAB_ID = "pix_n_flix";
  var PixNFlixTabPlugin = class {
    constructor(_conduit, [controlChannel, frameChannel], tabService) {
      this.id = PIX_N_FLIX_WEB_ID;
      this.__listeners = new Set();
      this.__video = null;
      this.__image = null;
      this.__canvas = null;
      this.__canvasContext = null;
      this.__captureCanvas = document.createElement("canvas");
      this.__captureContext = this.__captureCanvas.getContext("2d");
      this.__state = {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        fps: DEFAULT_FPS,
        volume: DEFAULT_VOLUME,
        hasAudio: false,
        mode: 0
      };
      this.__keepAspectRatio = true;
      this.__intrinsicWidth = DEFAULT_WIDTH;
      this.__intrinsicHeight = DEFAULT_HEIGHT;
      this.__displayWidth = DEFAULT_WIDTH;
      this.__displayHeight = DEFAULT_HEIGHT;
      this.__loopCount = -1;
      this.__loopsPlayed = 0;
      this.__usingCamera = true;
      this.__prevTimestamp = null;
      this.__totalElapsedMs = 0;
      this.__videoIsPlaying = false;
      this.__destroyed = false;
      this.__tick = timestamp => {
        this.__requestId = window.requestAnimationFrame(this.__tick);
        if (this.__prevTimestamp === null) this.__prevTimestamp = timestamp;
        const elapsed = timestamp - this.__prevTimestamp;
        if (elapsed < 1e3 / this.__state.fps || !this.__videoIsPlaying || this.__pendingFrame) return;
        this.__prevTimestamp = timestamp;
        this.__totalElapsedMs += elapsed;
        this.__captureAndSendFrame().catch(() => {});
      };
      this.__handleVideoEnded = () => {
        var _a;
        this.__loopsPlayed += 1;
        if (this.__loopCount >= 0 && this.__loopsPlayed > this.__loopCount) {
          this.__loopsPlayed = 0;
          this.__pause();
        } else {
          void ((_a = this.__video) == null ? void 0 : _a.play());
        }
      };
      if (!controlChannel || !frameChannel) {
        throw new Error("Pix n Flix control/frame channels are required but were not provided.");
      }
      this.__tabService = tabService;
      this.__frameChannel = frameChannel;
      s(controlChannel, this);
      this.__frameChannel.subscribe(message => {
        if (message.kind === "filtered-frame" && this.__pendingFrame) {
          this.__pendingFrame.resolve(message.buffer);
          this.__pendingFrame = void 0;
        }
      });
      const subscribe = listener => this.__subscribe(listener);
      const getState = () => this.__state;
      const plugin = this;
      function PixNFlixView() {
        const state = (0, import_react.useSyncExternalStore)(subscribe, getState);
        const videoRef = (0, import_react.useRef)(null);
        const imageRef = (0, import_react.useRef)(null);
        const canvasRef = (0, import_react.useRef)(null);
        (0, import_react.useEffect)(() => {
          plugin.__attachElements(videoRef.current, imageRef.current, canvasRef.current);
          return () => plugin.__detachElements();
        }, []);
        return (0, import_react.createElement)(PixNFlixView_, {
          plugin,
          state,
          videoRef,
          imageRef,
          canvasRef
        });
      }
      const tab = {
        id: PIX_N_FLIX_TAB_ID,
        iconName: "mobile-video",
        body: (0, import_react.createElement)(PixNFlixView),
        label: "PixNFlix Live Feed",
        disabled: false
      };
      this.__tabService.registerTab(tab);
      this.__tabService.showTab(PIX_N_FLIX_TAB_ID);
    }
    destroy() {
      this.__destroyed = true;
      this.__stopCapture();
      this.__releaseCamera();
    }
    __subscribe(listener) {
      this.__listeners.add(listener);
      return () => this.__listeners.delete(listener);
    }
    __emit() {
      this.__listeners.forEach(listener => listener());
    }
    __setState(patch) {
      this.__state = __spreadValues(__spreadValues({}, this.__state), patch);
      this.__emit();
    }
    __attachElements(video, image, canvas) {
      var _a;
      this.__video = video;
      this.__image = image;
      this.__canvas = canvas;
      this.__canvasContext = (_a = canvas == null ? void 0 : canvas.getContext("2d")) != null ? _a : null;
      if (this.__pendingInputSource) {
        const pending = this.__pendingInputSource;
        this.__pendingInputSource = void 0;
        pending();
      } else {
        this.__requestCamera();
      }
      this.__startCapture();
    }
    __detachElements() {
      this.__stopCapture();
      this.__releaseCamera();
      this.__video = null;
      this.__image = null;
      this.__canvas = null;
      this.__canvasContext = null;
    }
    __requestCamera() {
      var _a;
      if (!this.__video || !((_a = navigator.mediaDevices) == null ? void 0 : _a.getUserMedia)) return;
      if (this.__video.srcObject) return;
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        if (!this.__video) return;
        this.__video.srcObject = stream;
        this.__video.onloadedmetadata = () => this.__setAspectRatioDimensions(this.__video.videoWidth, this.__video.videoHeight);
        this.__videoIsPlaying = true;
      }).catch(error => console.warn("pix_n_flix: getUserMedia failed:", error));
    }
    __releaseCamera() {
      var _a;
      const stream = (_a = this.__video) == null ? void 0 : _a.srcObject;
      stream == null ? void 0 : stream.getTracks().forEach(track => track.stop());
      if (this.__video) this.__video.srcObject = null;
    }
    __setAspectRatioDimensions(w, h2) {
      this.__intrinsicWidth = w;
      this.__intrinsicHeight = h2;
      const scale = Math.min(this.__state.width / w, this.__state.height / h2);
      this.__displayWidth = scale * w;
      this.__displayHeight = scale * h2;
    }
    __startCapture() {
      if (this.__requestId !== void 0) return;
      this.__requestId = window.requestAnimationFrame(this.__tick);
    }
    __stopCapture() {
      var _a;
      if (this.__requestId === void 0) return;
      window.cancelAnimationFrame(this.__requestId);
      this.__requestId = void 0;
      this.__prevTimestamp = null;
      (_a = this.__pendingFrame) == null ? void 0 : _a.reject(new Error("pix_n_flix: capture stopped"));
      this.__pendingFrame = void 0;
    }
    __captureAndSendFrame() {
      return __async(this, null, function* () {
        const source = this.__state.mode === 3 ? this.__image : this.__video;
        if (!source) return;
        const {width, height} = this.__state;
        const ctx = this.__captureContext;
        if (this.__captureCanvas.width !== width) this.__captureCanvas.width = width;
        if (this.__captureCanvas.height !== height) this.__captureCanvas.height = height;
        ctx.save();
        if (this.__usingCamera) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        if (this.__keepAspectRatio) {
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.fill();
          ctx.drawImage(source, 0, 0, this.__intrinsicWidth, this.__intrinsicHeight, (width - this.__displayWidth) / 2, (height - this.__displayHeight) / 2, this.__displayWidth, this.__displayHeight);
        } else {
          ctx.drawImage(source, 0, 0, width, height);
        }
        ctx.restore();
        const captured = ctx.getImageData(0, 0, width, height);
        const capturedBuffer = captured.data.buffer;
        const resultBuffer = yield new Promise((resolve, reject) => {
          this.__pendingFrame = {
            resolve,
            reject
          };
          this.__frameChannel.send({
            kind: "captured-frame",
            buffer: capturedBuffer,
            width,
            height
          }, [capturedBuffer]);
        });
        if (this.__destroyed || !this.__canvasContext) return;
        const resultData = new ImageData(new Uint8ClampedArray(resultBuffer), width, height);
        this.__canvasContext.putImageData(resultData, 0, 0);
      });
    }
    __pause() {
      this.__videoIsPlaying = false;
      this.__setState({
        mode: 1
      });
    }
    __resume() {
      this.__videoIsPlaying = true;
      this.__setState({
        mode: 0
      });
    }
    updateDimensions(width, height) {
      return __async(this, null, function* () {
        if (this.__video) {
          this.__video.width = width;
          this.__video.height = height;
        }
        if (this.__image) {
          this.__image.width = width;
          this.__image.height = height;
        }
        if (this.__canvas) {
          this.__canvas.width = width;
          this.__canvas.height = height;
        }
        this.__setState({
          width,
          height
        });
      });
    }
    $updateFPS(fps) {
      this.__setState({
        fps
      });
    }
    $updateVolume(volume) {
      if (this.__video) this.__video.volume = volume;
      this.__setState({
        volume: volume * 100
      });
    }
    useLocalFile() {
      return __async(this, null, function* () {
        this.__releaseCamera();
        this.__usingCamera = false;
        this.__videoIsPlaying = false;
        this.__setState({
          mode: 2
        });
      });
    }
    useImageUrl(url) {
      return __async(this, null, function* () {
        this.__usingCamera = false;
        if (!this.__image) {
          this.__pendingInputSource = () => void this.useImageUrl(url);
          return;
        }
        this.__releaseCamera();
        this.__image.crossOrigin = "anonymous";
        this.__image.onload = () => {
          this.__setAspectRatioDimensions(this.__image.naturalWidth, this.__image.naturalHeight);
          this.__videoIsPlaying = true;
        };
        this.__image.onerror = () => console.warn("pix_n_flix: failed to load image URL:", url);
        this.__image.src = url;
        this.__setState({
          mode: 3
        });
      });
    }
    useVideoUrl(url) {
      return __async(this, null, function* () {
        this.__usingCamera = false;
        if (!this.__video) {
          this.__pendingInputSource = () => void this.useVideoUrl(url);
          return;
        }
        this.__releaseCamera();
        this.__video.crossOrigin = "anonymous";
        this.__video.onended = this.__handleVideoEnded;
        this.__video.onloadedmetadata = () => this.__setAspectRatioDimensions(this.__video.videoWidth, this.__video.videoHeight);
        this.__video.src = url;
        this.__setState({
          mode: 0,
          hasAudio: true
        });
        this.__videoIsPlaying = true;
        void this.__video.play();
      });
    }
    $keepAspectRatio(keep) {
      this.__keepAspectRatio = keep;
    }
    $setLoopCount(n3) {
      this.__loopCount = n3;
    }
    $pauseAt(pauseTimeMs) {
      setTimeout(() => this.__pause(), pauseTimeMs);
    }
    getVideoTime() {
      return __async(this, null, function* () {
        return this.__totalElapsedMs;
      });
    }
    $stopStreaming() {
      this.__stopCapture();
      this.__releaseCamera();
    }
    __handlePlay() {
      this.__resume();
    }
    __handleStill() {
      this.__pause();
    }
    __handleFileDrop(file) {
      if (this.__state.mode !== 2) return;
      if (file.type.match("video.*") && this.__video) {
        this.__video.src = URL.createObjectURL(file);
        this.__video.onended = this.__handleVideoEnded;
        this.__setState({
          mode: 0,
          hasAudio: true
        });
        this.__videoIsPlaying = true;
        void this.__video.play();
      } else if (file.type.match("image.*") && this.__image) {
        this.__image.src = URL.createObjectURL(file);
        this.__setState({
          mode: 3
        });
        this.__videoIsPlaying = true;
      }
    }
  };
  PixNFlixTabPlugin.channelAttach = [PIX_N_FLIX_CONTROL_CHANNEL_ID, PIX_N_FLIX_FRAME_CHANNEL_ID];
  n(PixNFlixTabPlugin);
  function PixNFlixView_({plugin, state, videoRef, imageRef, canvasRef}) {
    const {mode, width, height, fps, volume, hasAudio} = state;
    const displayOptions = mode === 1 || mode === 0;
    const videoIsActive = mode === 0;
    const isAccepting = mode === 2;
    const handleDrop = e2 => {
      e2.preventDefault();
      const file = e2.dataTransfer.files[0];
      if (file) plugin.__handleFileDrop(file);
    };
    const handleDragOver = e2 => e2.preventDefault();
    const handleFileUpload = e2 => {
      var _a;
      e2.preventDefault();
      const file = (_a = e2.target.files) == null ? void 0 : _a[0];
      if (file) plugin.__handleFileDrop(file);
    };
    const handleVolumeChange = e2 => {
      e2.preventDefault();
      plugin.$updateVolume(parseFloat(e2.target.value));
    };
    return (0, import_jsx_runtime.jsxs)("div", {
      className: "sa-video",
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      children: [(0, import_jsx_runtime.jsxs)("div", {
        className: "sa-video-header",
        children: [(0, import_jsx_runtime.jsx)("div", {
          className: "sa-video-header-element",
          style: {
            display: displayOptions ? "inherit" : "none"
          },
          children: (0, import_jsx_runtime.jsxs)(import_core.ButtonGroup, {
            children: [(0, import_jsx_runtime.jsx)(import_core.Button, {
              className: "sa-live-video-button",
              icon: "video",
              active: videoIsActive,
              onClick: () => plugin.__handlePlay(),
              text: "Play Video"
            }), (0, import_jsx_runtime.jsx)(import_core.Button, {
              className: "sa-still-image-button",
              icon: "camera",
              active: !videoIsActive,
              onClick: () => plugin.__handleStill(),
              text: "Pause Video"
            })]
          })
        }), (0, import_jsx_runtime.jsx)(import_core.Divider, {}), (0, import_jsx_runtime.jsxs)("div", {
          className: "sa-video-header-element",
          style: {
            display: displayOptions ? "inherit" : "none"
          },
          children: [(0, import_jsx_runtime.jsx)("div", {
            className: "sa-video-header-numeric-input",
            children: (0, import_jsx_runtime.jsx)(import_core.NumericInput, {
              disabled: true,
              leftIcon: "horizontal-distribution",
              style: {
                width: 70
              },
              value: width,
              minorStepSize: 1,
              stepSize: 10,
              majorStepSize: 100,
              max: MAX_WIDTH,
              min: MIN_WIDTH
            })
          }), (0, import_jsx_runtime.jsx)("div", {
            className: "sa-video-header-numeric-input",
            children: (0, import_jsx_runtime.jsx)(import_core.NumericInput, {
              disabled: true,
              leftIcon: "vertical-distribution",
              style: {
                width: 70
              },
              value: height,
              minorStepSize: 1,
              stepSize: 10,
              majorStepSize: 100,
              max: MAX_HEIGHT,
              min: MIN_HEIGHT
            })
          }), (0, import_jsx_runtime.jsx)("div", {
            className: "sa-video-header-numeric-input",
            children: (0, import_jsx_runtime.jsx)(import_core.NumericInput, {
              leftIcon: "stopwatch",
              style: {
                width: 60
              },
              value: fps,
              onValueChange: value => plugin.$updateFPS(value),
              minorStepSize: null,
              stepSize: 1,
              majorStepSize: null,
              max: MAX_FPS,
              min: MIN_FPS
            })
          })]
        })]
      }), (0, import_jsx_runtime.jsxs)("div", {
        className: "sa-video-element",
        children: [(0, import_jsx_runtime.jsx)("img", {
          ref: imageRef,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          style: {
            display: "none"
          }
        }), (0, import_jsx_runtime.jsx)("video", {
          ref: videoRef,
          autoPlay: true,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          style: {
            display: "none"
          }
        }), (0, import_jsx_runtime.jsx)("canvas", {
          ref: canvasRef,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          style: {
            display: !isAccepting ? "initial" : "none"
          }
        }), (0, import_jsx_runtime.jsx)("br", {}), (0, import_jsx_runtime.jsxs)("div", {
          style: {
            display: isAccepting ? "inherit" : "none"
          },
          children: [(0, import_jsx_runtime.jsx)("div", {
            style: {
              fontSize: 40
            },
            children: "Drag file here"
          }), (0, import_jsx_runtime.jsx)("br", {}), (0, import_jsx_runtime.jsx)("input", {
            type: "file",
            onChange: handleFileUpload
          })]
        }), (0, import_jsx_runtime.jsx)("br", {}), (0, import_jsx_runtime.jsxs)("div", {
          style: {
            display: hasAudio && !isAccepting ? "inherit" : "none"
          },
          children: ["Volume:", (0, import_jsx_runtime.jsx)("input", {
            type: "range",
            onChange: handleVolumeChange,
            min: 0,
            max: 1,
            value: volume / 100,
            step: 0.01
          })]
        }), (0, import_jsx_runtime.jsx)("p", {
          style: {
            display: displayOptions ? "inherit" : "none",
            fontFamily: "arial"
          },
          children: "Note: Is video lagging? Switch to 'still image' or adjust FPS rate!"
        })]
      })]
    });
  }
  return __toCommonJS(index_exports);
};