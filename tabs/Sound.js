export default require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
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
    SOUND_TAB_ID: () => SOUND_TAB_ID,
    default: () => SoundTabPlugin
  });
  var SOUND_CHANNEL_ID = "sourceacademy-sound-channel";
  var SOUND_WEB_ID = "sound-web";
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
  var SOUND_TAB_ID = "sound";
  var STATUS_COLORS = {
    idle: "#8A9BA8",
    constructing: "#B08D00",
    playing: "#238551",
    recording: "#C23030"
  };
  var STATUS_TEXT = {
    idle: "Idle",
    constructing: "Constructing\u2026",
    playing: "Playing\u2026",
    recording: "Recording\u2026"
  };
  function SoundStatusView({status, micGranted}) {
    const statusText = STATUS_TEXT[status];
    return (0, import_jsx_runtime.jsxs)("div", {
      children: [(0, import_jsx_runtime.jsx)("p", {
        id: "sound-default-text",
        children: "The sound tab plays and records your sounds. Playback and microphone access happen here, on the page itself, since your browser only allows them on this page - not inside the sandboxed program evaluator."
      }), (0, import_jsx_runtime.jsxs)("p", {
        id: "sound-status",
        children: ["Status:", " ", (0, import_jsx_runtime.jsx)("span", {
          style: {
            fontWeight: 700,
            color: STATUS_COLORS[status],
            textTransform: "uppercase",
            letterSpacing: "0.02em"
          },
          children: statusText
        })]
      }), micGranted !== null && (0, import_jsx_runtime.jsxs)("p", {
        id: "sound-mic-permission",
        children: ["Microphone access:", " ", (0, import_jsx_runtime.jsx)("span", {
          style: {
            fontWeight: 700,
            color: micGranted ? "#238551" : "#C23030"
          },
          children: micGranted ? "granted" : "denied"
        })]
      })]
    });
  }
  var SoundTabPlugin = class {
    constructor(_conduit, [soundChannel], tabService) {
      this.id = SOUND_WEB_ID;
      this.__listeners = new Set();
      this.__activeSources = new Set();
      this.__recordedChunks = [];
      this.__status = "idle";
      this.__micGranted = null;
      this.__destroyed = false;
      this.__playbackQueue = Promise.resolve();
      this.__stopGeneration = 0;
      this.__constructingCount = 0;
      this.__pendingPlaybackCount = 0;
      if (!soundChannel) {
        throw new Error("Sound channel is required but was not provided.");
      }
      this.__tabService = tabService;
      s(soundChannel, this);
      const subscribe = listener => this.subscribe(listener);
      const getStatus = () => this.__status;
      const getMicGranted = () => this.__micGranted;
      function SoundPluginTab() {
        const status = (0, import_react.useSyncExternalStore)(subscribe, getStatus);
        const micGranted = (0, import_react.useSyncExternalStore)(subscribe, getMicGranted);
        return (0, import_react.createElement)(SoundStatusView, {
          status,
          micGranted
        });
      }
      const tab = {
        id: SOUND_TAB_ID,
        iconName: "music",
        body: (0, import_react.createElement)(SoundPluginTab),
        label: "Sounds",
        disabled: false
      };
      this.__tabService.registerTab(tab);
      this.__tabService.showTab(SOUND_TAB_ID);
    }
    subscribe(listener) {
      this.__listeners.add(listener);
      return () => this.__listeners.delete(listener);
    }
    getStatus() {
      return this.__status;
    }
    destroy() {
      var _a, _b;
      (_a = this.__mediaRecorder) == null ? void 0 : _a.stop();
      (_b = this.__mediaStream) == null ? void 0 : _b.getTracks().forEach(track => track.stop());
      this.__destroyed = true;
      this.__maybeFinalizeDestroy();
    }
    __maybeFinalizeDestroy() {
      var _a;
      if (this.__destroyed && this.__pendingPlaybackCount === 0) {
        void ((_a = this.__audioContext) == null ? void 0 : _a.close());
      }
    }
    requestMicPermission() {
      return __async(this, null, function* () {
        var _a;
        (_a = this.__mediaStream) == null ? void 0 : _a.getTracks().forEach(track => track.stop());
        this.__mediaStream = void 0;
        try {
          this.__mediaStream = yield navigator.mediaDevices.getUserMedia({
            audio: true
          });
          this.__micGranted = true;
        } catch (e2) {
          this.__micGranted = false;
        }
        this.__emit();
        return this.__micGranted;
      });
    }
    notifyConstructing() {
      return __async(this, null, function* () {
        this.__constructingCount++;
        this.__updatePlaybackStatus();
      });
    }
    playSamples(left, right, sampleRate) {
      this.__constructingCount = Math.max(0, this.__constructingCount - 1);
      this.__pendingPlaybackCount++;
      const generation = this.__stopGeneration;
      const myTurn = this.__playbackQueue.then(() => {
        if (generation !== this.__stopGeneration) {
          this.__pendingPlaybackCount = Math.max(0, this.__pendingPlaybackCount - 1);
          this.__maybeFinalizeDestroy();
          return;
        }
        return this.__playOne(left, right, sampleRate);
      });
      this.__playbackQueue = myTurn.catch(() => {});
      this.__updatePlaybackStatus();
      return myTurn;
    }
    __playOne(left, right, sampleRate) {
      return __async(this, null, function* () {
        const audioContext = this.__ensureAudioContext();
        const buffer = audioContext.createBuffer(2, left.length, sampleRate);
        buffer.copyToChannel(left, 0);
        buffer.copyToChannel(right, 1);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        this.__activeSources.add(source);
        this.__updatePlaybackStatus();
        yield new Promise(resolve => {
          source.onended = () => resolve();
          source.start();
        });
        this.__activeSources.delete(source);
        this.__updatePlaybackStatus();
        this.__pendingPlaybackCount = Math.max(0, this.__pendingPlaybackCount - 1);
        this.__maybeFinalizeDestroy();
      });
    }
    $stopPlayback() {
      this.__stopGeneration++;
      for (const source of this.__activeSources) {
        source.stop();
      }
      this.__activeSources.clear();
      this.__updatePlaybackStatus();
    }
    __updatePlaybackStatus() {
      if (this.__activeSources.size > 0) {
        this.__setStatus("playing");
      } else if (this.__constructingCount > 0) {
        this.__setStatus("constructing");
      } else {
        this.__setStatus("idle");
      }
    }
    startRecording() {
      return __async(this, null, function* () {
        if (!this.__mediaStream) {
          throw new Error("Microphone permission has not been granted.");
        }
        const mediaRecorder = new MediaRecorder(this.__mediaStream);
        this.__mediaRecorder = mediaRecorder;
        this.__recordedChunks = [];
        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.__recordedChunks.push(event.data);
          }
        };
        yield new Promise((resolve, reject) => {
          mediaRecorder.onstart = () => resolve();
          mediaRecorder.onerror = event => {
            var _a;
            return reject((_a = event.error) != null ? _a : new Error("MediaRecorder failed to start."));
          };
          mediaRecorder.start();
        });
        this.__setStatus("recording");
      });
    }
    stopRecording() {
      return __async(this, null, function* () {
        const mediaRecorder = this.__mediaRecorder;
        if (!mediaRecorder) {
          throw new Error("No recording in progress.");
        }
        const blob = yield new Promise(resolve => {
          mediaRecorder.onstop = () => resolve(new Blob(this.__recordedChunks));
          mediaRecorder.stop();
        });
        this.__mediaRecorder = void 0;
        this.__setStatus("idle");
        const audioContext = this.__ensureAudioContext();
        const audioBuffer = yield audioContext.decodeAudioData(yield blob.arrayBuffer());
        const left = audioBuffer.getChannelData(0);
        const right = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : left;
        return {
          left,
          right,
          sampleRate: audioBuffer.sampleRate
        };
      });
    }
    __ensureAudioContext() {
      if (!this.__audioContext) {
        this.__audioContext = new AudioContext();
      }
      return this.__audioContext;
    }
    __setStatus(status) {
      this.__status = status;
      this.__emit();
    }
    __emit() {
      this.__listeners.forEach(listener => listener());
    }
  };
  SoundTabPlugin.channelAttach = [SOUND_CHANNEL_ID];
  n(SoundTabPlugin);
  return __toCommonJS(index_exports);
};