export default require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var Pixnflix_exports = {};
  __export(Pixnflix_exports, {
    default: () => Pixnflix_default
  });
  var import_core = __require("@blueprintjs/core");
  var import_icons = __require("@blueprintjs/icons");
  var import_react = __toESM(__require("react"), 1);
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
  var import_jsx_runtime = __require("react/jsx-runtime");
  var PixNFlix = class extends import_react.default.Component {
    constructor(props) {
      super(props);
      this.$video = null;
      this.$image = null;
      this.$canvas = null;
      this.setupVideoService = () => {
        if (this.$video && this.$canvas && this.isPixNFlix()) {
          const {debuggerContext} = this.props;
          this.pixNFlix = debuggerContext.result.value;
          const {HEIGHT, WIDTH, FPS, VOLUME, inputFeed} = this.pixNFlix.init(this.$image, this.$video, this.$canvas, this.printError, {
            onClickStill: this.onClickStill
          });
          let mode = 0;
          if (inputFeed === 3) {
            mode = 2;
          } else if (inputFeed === 1) {
            mode = 3;
          }
          this.setState({
            height: HEIGHT,
            width: WIDTH,
            FPS,
            volume: VOLUME,
            hasAudio: inputFeed === 2,
            mode
          });
        }
      };
      this.closeVideo = () => {
        if (this.isPixNFlix()) {
          this.pixNFlix.deinit();
        }
      };
      this.handleStartVideo = () => {
        if (this.isPixNFlix()) {
          this.pixNFlix.startVideo();
        }
      };
      this.handleStopVideo = () => {
        if (this.isPixNFlix()) {
          this.pixNFlix.stopVideo();
        }
      };
      this.onClickStill = () => {
        const {mode} = this.state;
        if (mode === 1) {
          this.handleStopVideo();
        } else if (mode === 0) {
          this.setState(() => ({
            mode: 1
          }), this.handleStopVideo);
        }
      };
      this.onClickVideo = () => {
        const {mode} = this.state;
        if (mode === 1) {
          this.setState(() => ({
            mode: 0
          }), this.handleStartVideo);
        }
      };
      this.handleWidthChange = width => {
        const {height} = this.state;
        this.handleUpdateDimensions(width, height);
      };
      this.handleHeightChange = height => {
        const {width} = this.state;
        this.handleUpdateDimensions(width, height);
      };
      this.handleFPSChange = fps => {
        if (fps >= MIN_FPS && fps <= MAX_FPS) {
          this.setState({
            FPS: fps
          });
          if (this.isPixNFlix()) {
            this.pixNFlix.updateFPS(fps);
          }
        }
      };
      this.handleUpdateDimensions = (w, h) => {
        if (w >= MIN_WIDTH && w <= MAX_WIDTH && h >= MIN_HEIGHT && h <= MAX_HEIGHT) {
          this.setState({
            width: w,
            height: h
          });
          if (this.isPixNFlix()) {
            this.pixNFlix.updateDimensions(w, h);
          }
        }
      };
      this.loadFileToVideo = file => {
        const {mode} = this.state;
        if (file.type.match("video.*")) {
          if (this.$video && mode === 2) {
            this.$video.src = URL.createObjectURL(file);
            this.setState({
              hasAudio: true,
              mode: 0
            });
            this.handleStartVideo();
          }
        } else if (file.type.match("image.*")) {
          if (this.$image && mode === 2) {
            this.$image.src = URL.createObjectURL(file);
            this.setState({
              mode: 3
            });
          }
        }
      };
      this.handleDrop = e => {
        e.preventDefault();
        this.loadFileToVideo(e.dataTransfer.files[0]);
      };
      this.handleDragOver = e => {
        e.preventDefault();
      };
      this.handleFileUpload = e => {
        e.preventDefault();
        if (e.target && e.target.files) {
          this.loadFileToVideo(e.target.files[0]);
        }
      };
      this.handleVolumeChange = e => {
        e.preventDefault();
        const volume = parseFloat(e.target.value);
        this.setState({
          volume
        });
        this.pixNFlix.updateVolume(volume);
      };
      this.printError = () => {};
      this.state = {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        FPS: DEFAULT_FPS,
        volume: DEFAULT_VOLUME,
        hasAudio: false,
        mode: 0
      };
      const {debuggerContext} = this.props;
      this.pixNFlix = debuggerContext.result.value;
    }
    componentDidMount() {
      if (this.isPixNFlix()) {
        this.setupVideoService();
        window.addEventListener("beforeunload", this.pixNFlix.deinit);
      }
    }
    componentWillUnmount() {
      if (this.isPixNFlix()) {
        this.closeVideo();
        window.removeEventListener("beforeunload", this.pixNFlix.deinit);
      }
    }
    isPixNFlix() {
      return this.pixNFlix && this.pixNFlix.toReplString && this.pixNFlix.toReplString() === "[Pix N Flix]";
    }
    render() {
      const {mode, width, height, FPS, volume, hasAudio} = this.state;
      const displayOptions = mode === 1 || mode === 0;
      const videoIsActive = mode === 0;
      const isAccepting = mode === 2;
      return (0, import_jsx_runtime.jsxs)("div", {
        className: "sa-video",
        onDragOver: this.handleDragOver,
        onDrop: this.handleDrop,
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
                icon: import_icons.IconNames.VIDEO,
                active: videoIsActive,
                onClick: this.onClickVideo,
                text: "Play Video"
              }), (0, import_jsx_runtime.jsx)(import_core.Button, {
                className: "sa-still-image-button",
                icon: import_icons.IconNames.CAMERA,
                active: !videoIsActive,
                onClick: this.onClickStill,
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
                leftIcon: import_icons.IconNames.HORIZONTAL_DISTRIBUTION,
                style: {
                  width: 70
                },
                value: width,
                onValueChange: this.handleWidthChange,
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
                leftIcon: import_icons.IconNames.VERTICAL_DISTRIBUTION,
                style: {
                  width: 70
                },
                value: height,
                onValueChange: this.handleHeightChange,
                minorStepSize: 1,
                stepSize: 10,
                majorStepSize: 100,
                max: MAX_HEIGHT,
                min: MIN_HEIGHT
              })
            }), (0, import_jsx_runtime.jsx)("div", {
              className: "sa-video-header-numeric-input",
              children: (0, import_jsx_runtime.jsx)(import_core.NumericInput, {
                leftIcon: import_icons.IconNames.STOPWATCH,
                style: {
                  width: 60
                },
                value: FPS,
                onValueChange: this.handleFPSChange,
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
            ref: r => {
              this.$image = r;
            },
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            style: {
              display: "none"
            }
          }), (0, import_jsx_runtime.jsx)("video", {
            ref: r => {
              this.$video = r;
            },
            autoPlay: true,
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            style: {
              display: "none"
            }
          }), (0, import_jsx_runtime.jsx)("canvas", {
            ref: r => {
              this.$canvas = r;
            },
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
              onChange: this.handleFileUpload
            })]
          }), (0, import_jsx_runtime.jsx)("br", {}), (0, import_jsx_runtime.jsxs)("div", {
            style: {
              display: hasAudio && !isAccepting ? "inherit" : "none"
            },
            children: ["Volume:", (0, import_jsx_runtime.jsx)("input", {
              type: "range",
              onChange: this.handleVolumeChange,
              min: 0,
              max: 1,
              value: volume,
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
  };
  var Pixnflix_default = {
    toSpawn: () => true,
    body: debuggerContext => (0, import_jsx_runtime.jsx)(PixNFlix, {
      debuggerContext
    }),
    label: "PixNFlix Live Feed",
    iconName: "mobile-video"
  };
  return __toCommonJS(Pixnflix_exports);
};