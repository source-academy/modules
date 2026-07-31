export default require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
  var __typeError = msg => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __name = (target, value) => __defProp(target, "name", {
    value,
    configurable: true
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
  var __decoratorStart = base => {
    var _a2;
    return [, , , __create((_a2 = base == null ? void 0 : base[__knownSymbol("metadata")]) != null ? _a2 : null)];
  };
  var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
  var __expectFn = fn => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
  var __decoratorContext = (kind, name, done, metadata, fns) => ({
    kind: __decoratorStrings[kind],
    name,
    metadata,
    addInitializer: fn => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null))
  });
  var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
  var __runInitializers = (array, flags, self, value) => {
    for (var i = 0, fns = array[flags >> 1], n5 = fns && fns.length; i < n5; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
    return value;
  };
  var __decorateElement = (array, flags, name, decorators, target, extra) => {
    var fn, it, done, ctx, access, k = flags & 7, s7 = !!(flags & 8), p2 = !!(flags & 16);
    var j = k > 3 ? array.length + 1 : k ? s7 ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
    var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
    var desc = k && (!p2 && !s7 && (target = target.prototype), k < 5 && (k > 3 || !p2) && __getOwnPropDesc(k < 4 ? target : {
      get [name]() {
        return __privateGet(this, extra);
      },
      set [name](x) {
        return __privateSet(this, extra, x);
      }
    }, name));
    k ? p2 && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
    for (var i = decorators.length - 1; i >= 0; i--) {
      ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
      if (k) {
        (ctx.static = s7, ctx.private = p2, access = ctx.access = {
          has: p2 ? x => __privateIn(target, x) : x => (name in x)
        });
        if (k ^ 3) access.get = p2 ? x => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : x => x[name];
        if (k > 2) access.set = p2 ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
      }
      (it = (0, decorators[i])(k ? k < 4 ? p2 ? extra : desc[key] : k > 4 ? void 0 : {
        get: desc.get,
        set: desc.set
      } : target, ctx), done._ = 1);
      if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p2 ? extra = it : desc[key] = it : target = it); else if (typeof it !== "object" || it === null) __typeError("Object expected"); else (__expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn));
    }
    return (k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p2 ? k ^ 4 ? extra : desc : target);
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = value => {
        try {
          step(generator.next(value));
        } catch (e6) {
          reject(e6);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e6) {
          reject(e6);
        }
      };
      var step = x => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var __await = function (promise, isYieldStar) {
    this[0] = promise;
    this[1] = isYieldStar;
  };
  var __asyncGenerator = (__this, __arguments, generator) => {
    var resume = (k, v, yes, no) => {
      try {
        var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
        Promise.resolve(isAwait ? v[0] : v).then(y => isAwait ? resume(k === "return" ? k : "next", v[1] ? {
          done: y.done,
          value: y.value
        } : y, yes, no) : yes({
          value: y,
          done
        })).catch(e6 => resume("throw", e6, yes, no));
      } catch (e6) {
        no(e6);
      }
    }, method = (k, call, wait, clear) => it[k] = x => (call = new Promise((yes, no, run) => (run = () => resume(k, x, yes, no), q ? q.then(run) : run())), clear = () => q === wait && (q = 0), q = wait = call.then(clear, clear), call), q, it = {};
    return (generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it);
  };
  var index_exports = {};
  __export(index_exports, {
    default: () => PixNFlixModulePlugin
  });
  var _;
  !(function (_2) {
    (_2.UNKNOWN = "__unknown", _2.INTERNAL = "__internal", _2.EVALUATOR = "__evaluator", _2.EVALUATOR_SYNTAX = "__evaluator_syntax", _2.EVALUATOR_TYPE = "__evaluator_type", _2.EVALUATOR_RUNTIME = "__evaluator_runtime");
  })(_ || (_ = {}));
  var o = class extends Error {
    constructor(r3) {
      super(r3);
      __publicField(this, "name", "ConductorError");
      __publicField(this, "errorType", _.UNKNOWN);
    }
  };
  var s = class extends o {
    constructor(r3) {
      super(r3);
      __publicField(this, "name", "ConductorInternalError");
      __publicField(this, "errorType", _.INTERNAL);
    }
  };
  var s2 = class extends o {
    constructor(r3, o4, s7, e6) {
      super(`${void 0 !== o4 ? `${e6 ? e6 + ":" : ""}${o4}${void 0 !== s7 ? ":" + s7 : ""}: ` : ""}${r3}`);
      __publicField(this, "name", "EvaluatorError");
      __publicField(this, "errorType", _.EVALUATOR);
      __publicField(this, "rawMessage");
      __publicField(this, "line");
      __publicField(this, "column");
      __publicField(this, "fileName");
      (this.rawMessage = r3, this.line = o4, this.column = s7, this.fileName = e6);
    }
  };
  function e(r3) {
    const t5 = (function (r4) {
      var _a2;
      if ("string" == typeof r4) return JSON.stringify(r4);
      if ("number" == typeof r4 || "boolean" == typeof r4) return String(r4);
      if (null === r4) return "null";
      if (void 0 === r4) return "undefined";
      if ("bigint" == typeof r4) return `${r4}n`;
      if ("symbol" == typeof r4) return r4.toString();
      if ("function" == typeof r4) return r4.name ? `function ${r4.name}` : "anonymous function";
      try {
        return (_a2 = JSON.stringify(r4)) != null ? _a2 : Object.prototype.toString.call(r4);
      } catch (e6) {
        try {
          return String(r4);
        } catch (e7) {
          return Object.prototype.toString.call(r4);
        }
      }
    })(r3);
    return t5.length > 100 ? `${t5.slice(0, 100)}...` : t5;
  }
  var n = class extends s2 {
    constructor(r3, t5, n5, o4, u3, a4, i) {
      super(`${r3}: Expected ${n5}${t5 ? ` for ${t5}` : ""}, got ${e(o4)}.`, u3, a4, i);
      __publicField(this, "name", "EvaluatorParameterTypeError");
      __publicField(this, "errorType", _.EVALUATOR_TYPE);
      __publicField(this, "funcName");
      __publicField(this, "paramName");
      __publicField(this, "expected");
      __publicField(this, "actual");
      (this.funcName = r3, this.paramName = t5, this.expected = n5, this.actual = o4);
    }
  };
  var u = class extends n {
    constructor(r3, t5, e6, n5, o4, u3, a4) {
      super(e6, n5, (function (r4) {
        if ("string" == typeof r4) return r4;
        const {min: t6, max: e7, integer: n6 = true} = r4, o5 = n6 ? "integer" : "number";
        return void 0 !== t6 && void 0 !== e7 ? `${o5} \u2208 [${t6}, ${e7}]` : void 0 !== t6 ? `${o5} \u2265 ${t6}` : void 0 !== e7 ? `${o5} \u2264 ${e7}` : o5;
      })(t5), r3, o4, u3, a4);
      __publicField(this, "name", "EvaluatorNumberRangeError");
    }
  };
  var e2 = class extends s2 {
    constructor() {
      super(...arguments);
      __publicField(this, "name", "EvaluatorRuntimeError");
      __publicField(this, "errorType", _.EVALUATOR_RUNTIME);
    }
  };
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  var t3 = class {
    constructor(s7, t5, r3) {
      __publicField(this, "type", R.CALL);
      __publicField(this, "data");
      this.data = {
        fn: s7,
        args: t5,
        invokeId: r3
      };
    }
  };
  var r2 = class {
    constructor(s7, t5) {
      __publicField(this, "type", R.RETURN_ERR);
      __publicField(this, "data");
      this.data = {
        invokeId: s7,
        err: t5
      };
    }
  };
  var a2 = class {
    constructor(s7, t5) {
      __publicField(this, "type", R.RETURN);
      __publicField(this, "data");
      this.data = {
        invokeId: s7,
        res: t5
      };
    }
  };
  function s4(s7, o4) {
    const c2 = [];
    let a4 = 0;
    return (s7.subscribe(n5 => __async(null, null, function* () {
      var _a2, _b, _c, _d;
      switch (n5.type) {
        case R.CALL:
          {
            const {fn: r3, args: c3, invokeId: a5} = n5.data;
            try {
              const t5 = yield o4[r3](...c3);
              a5 > 0 && s7.send(new a2(a5, t5));
            } catch (e6) {
              a5 > 0 && s7.send(new r2(a5, e6));
            }
            break;
          }
        case R.RETURN:
          {
            const {invokeId: e6, res: t5} = n5.data;
            ((_b = (_a2 = c2[e6]) == null ? void 0 : _a2[0]) == null ? void 0 : _b.call(_a2, t5), delete c2[e6]);
            break;
          }
        case R.RETURN_ERR:
          {
            const {invokeId: e6, err: t5} = n5.data;
            ((_d = (_c = c2[e6]) == null ? void 0 : _c[1]) == null ? void 0 : _d.call(_c, t5), delete c2[e6]);
            break;
          }
      }
    })), new Proxy({}, {
      get(e6, t5, r3) {
        const o5 = Reflect.get(e6, t5, r3);
        if (o5) return o5;
        const i = "string" == typeof t5 && "$" === t5.charAt(0) ? (...e7) => {
          s7.send(new t3(t5, e7, 0));
        } : (...e7) => {
          const r4 = ++a4;
          return (s7.send(new t3(t5, e7, r4)), new Promise((e8, t6) => {
            c2[r4] = [e8, t6];
          }));
        };
        return (Reflect.set(e6, t5, i, r3), i);
      }
    }));
  }
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  function n4(n5, r3) {
    const t5 = {
      args: n5,
      returnType: r3
    };
    return function (n6, r4) {
      n6.signature = t5;
    };
  }
  var o3 = class {
    constructor(t5, o4, s7) {
      __publicField(this, "exports", []);
      __publicField(this, "exportedNames", []);
      __publicField(this, "evaluator");
      this.evaluator = s7;
    }
    initialise() {
      return __async(this, null, function* () {
        for (const o4 of this.exportedNames) {
          const s7 = this[o4];
          if (!s7.signature || "function" != typeof s7 || "string" != typeof o4) throw new s(`'${String(o4)}' is not an exportable method`);
          const r3 = s7.bind(this);
          (r3.signature = s7.signature, s7.sync && (r3.sync = s7.sync.bind(this)));
          const i = yield this.evaluator.closure_make(s7.signature, r3);
          this.exports.push({
            symbol: o4,
            value: i,
            signature: s7.signature
          });
        }
      });
    }
  };
  __publicField(o3, "channelAttach");
  var E;
  !(function (E2) {
    (E2[E2.VOID = 0] = "VOID", E2[E2.BOOLEAN = 1] = "BOOLEAN", E2[E2.NUMBER = 2] = "NUMBER", E2[E2.CONST_STRING = 3] = "CONST_STRING", E2[E2.EMPTY_LIST = 4] = "EMPTY_LIST", E2[E2.PAIR = 5] = "PAIR", E2[E2.ARRAY = 6] = "ARRAY", E2[E2.CLOSURE = 7] = "CLOSURE", E2[E2.OPAQUE = 8] = "OPAQUE", E2[E2.LIST = 9] = "LIST", E2[E2.ANY = 10] = "ANY", E2[E2.INTEGER = 11] = "INTEGER");
  })(E || (E = {}));
  var a3;
  !(function (a4) {
    (a4[a4.HELLO = 0] = "HELLO", a4[a4.ABORT = 1] = "ABORT", a4[a4.ENTRY = 2] = "ENTRY");
  })(a3 || (a3 = {}));
  var N;
  !(function (N2) {
    (N2[N2.ONLINE = 0] = "ONLINE", N2[N2.EVAL_READY = 1] = "EVAL_READY", N2[N2.RUNNING = 2] = "RUNNING", N2[N2.WAITING = 3] = "WAITING", N2[N2.BREAKPOINT = 4] = "BREAKPOINT", N2[N2.STOPPED = 5] = "STOPPED", N2[N2.ERROR = 6] = "ERROR");
  })(N || (N = {}));
  var DEFAULT_WIDTH = 400;
  var DEFAULT_HEIGHT = 300;
  var MAX_HEIGHT = 1024;
  var MIN_HEIGHT = 1;
  var MAX_WIDTH = 1024;
  var MIN_WIDTH = 1;
  var MAX_FPS = 60;
  var MIN_FPS = 1;
  function makeImageBuffer(width, height) {
    const view = new Uint8ClampedArray(width * height * 4);
    for (let i = 3; i < view.length; i += 4) {
      view[i] = 255;
    }
    return {
      view,
      width,
      height
    };
  }
  function assertInRange(value, min, max, funcName, paramName) {
    if (!Number.isInteger(value) || value < min || value > max) {
      throw new u(value, {
        min,
        max,
        integer: true
      }, funcName, paramName);
    }
  }
  function assertPixelCoordinates(buffer, x, y, p2, funcName) {
    assertInRange(x, 0, buffer.width - 1, funcName, "x");
    assertInRange(y, 0, buffer.height - 1, funcName, "y");
    assertInRange(p2, 0, 3, funcName, "p");
  }
  function readChannel(buffer, x, y, p2) {
    return buffer.view[(y * buffer.width + x) * 4 + p2];
  }
  function writeChannel(buffer, x, y, p2, value, funcName, paramName) {
    assertInRange(value, 0, 255, funcName, paramName);
    buffer.view[(y * buffer.width + x) * 4 + p2] = value;
  }
  function copyImageBuffer(src, dest) {
    if (src.width !== dest.width || src.height !== dest.height) {
      throw new n("copy_image", "dest", `an image of the same size as source (${src.width}x${src.height})`, `${dest.width}x${dest.height}`);
    }
    dest.view.set(src.view);
  }
  var PIX_N_FLIX_CONTROL_CHANNEL_ID = "sourceacademy-pix-n-flix-control-channel";
  var PIX_N_FLIX_FRAME_CHANNEL_ID = "sourceacademy-pix-n-flix-frame-channel";
  function callFilterClosure(evaluator, filter, src, dest) {
    return __async(this, null, function* () {
      var _a2;
      const syncCall = (_a2 = evaluator.closure_call_sync) == null ? void 0 : _a2.bind(evaluator);
      if ((syncCall == null ? void 0 : syncCall(filter, [src, dest])) !== void 0) return;
      const gen = evaluator.closure_call_unchecked(filter, [src, dest]);
      let step = yield gen.next();
      while (!step.done) step = yield gen.next();
    });
  }
  var PIXEL_REF_CELL = MAX_WIDTH * MAX_HEIGHT;
  function packPixelRef(imageId, x, y) {
    return imageId * PIXEL_REF_CELL + y * MAX_WIDTH + x;
  }
  function unpackPixelRef(packed) {
    const imageId = Math.floor(packed / PIXEL_REF_CELL);
    const rest = packed % PIXEL_REF_CELL;
    return {
      imageId,
      x: rest % MAX_WIDTH,
      y: Math.floor(rest / MAX_WIDTH)
    };
  }
  var _stop_dec, _set_loop_count_dec, _keep_aspect_ratio_dec, _get_video_time_dec, _use_video_url_dec, _use_image_url_dec, _use_local_file_dec, _set_volume_dec, _set_fps_dec, _set_dimensions_dec, _pause_at_dec, _compose_filter_dec, _reset_filter_dec, _install_filter_dec, _copy_image_dec, _image_height_dec, _image_width_dec, _set_rgba_dec, _alpha_of_dec, _blue_of_dec, _green_of_dec, _red_of_dec, _get_pixel_dec, _set_pixel_value_dec, _get_pixel_value_dec, _a, _init;
  var _PixNFlixModulePlugin = class _PixNFlixModulePlugin extends (_a = o3, _get_pixel_value_dec = [n4([E.OPAQUE, E.NUMBER, E.NUMBER, E.NUMBER], E.NUMBER)], _set_pixel_value_dec = [n4([E.OPAQUE, E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER], E.VOID)], _get_pixel_dec = [n4([E.OPAQUE, E.NUMBER, E.NUMBER], E.OPAQUE)], _red_of_dec = [n4([E.OPAQUE], E.NUMBER)], _green_of_dec = [n4([E.OPAQUE], E.NUMBER)], _blue_of_dec = [n4([E.OPAQUE], E.NUMBER)], _alpha_of_dec = [n4([E.OPAQUE], E.NUMBER)], _set_rgba_dec = [n4([E.OPAQUE, E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER], E.VOID)], _image_width_dec = [n4([], E.NUMBER)], _image_height_dec = [n4([], E.NUMBER)], _copy_image_dec = [n4([E.OPAQUE, E.OPAQUE], E.VOID)], _install_filter_dec = [n4([E.CLOSURE], E.VOID)], _reset_filter_dec = [n4([], E.VOID)], _compose_filter_dec = [n4([E.CLOSURE, E.CLOSURE], E.CLOSURE)], _pause_at_dec = [n4([E.NUMBER], E.VOID)], _set_dimensions_dec = [n4([E.NUMBER, E.NUMBER], E.VOID)], _set_fps_dec = [n4([E.NUMBER], E.VOID)], _set_volume_dec = [n4([E.NUMBER], E.VOID)], _use_local_file_dec = [n4([], E.VOID)], _use_image_url_dec = [n4([E.CONST_STRING], E.VOID)], _use_video_url_dec = [n4([E.CONST_STRING], E.VOID)], _get_video_time_dec = [n4([], E.NUMBER)], _keep_aspect_ratio_dec = [n4([E.BOOLEAN], E.VOID)], _set_loop_count_dec = [n4([E.NUMBER], E.VOID)], _stop_dec = [n4([], E.VOID)], _a) {
    constructor(conduit, [controlChannel, frameChannel], evaluator, tabLoader) {
      super(conduit, [controlChannel, frameChannel], evaluator);
      __runInitializers(_init, 5, this);
      this.id = "pix_n_flix";
      this.exportedNames = ["get_pixel_value", "set_pixel_value", "get_pixel", "red_of", "green_of", "blue_of", "alpha_of", "set_rgba", "image_height", "image_width", "copy_image", "install_filter", "reset_filter", "compose_filter", "pause_at", "set_dimensions", "set_fps", "set_volume", "use_local_file", "use_image_url", "use_video_url", "get_video_time", "keep_aspect_ratio", "set_loop_count", "stop"];
      this.__tabRpc = void 0;
      this.__frameChannel = void 0;
      this.__tabLoader = void 0;
      this.__tabLoaded = false;
      this.__buffers = new Map();
      this.__filter = void 0;
      this.__width = DEFAULT_WIDTH;
      this.__height = DEFAULT_HEIGHT;
      this.__streaming = false;
      if (!controlChannel || !frameChannel) {
        throw new Error("Pix n Flix control/frame channels are required but were not provided.");
      }
      this.__tabLoader = tabLoader;
      this.__tabRpc = s4(controlChannel, {});
      this.__frameChannel = frameChannel;
      this.__frameChannel.subscribe(message => {
        if (message.kind === "captured-frame") {
          this.__handleCapturedFrame(message).catch(e6 => {
            console.error("pix_n_flix: frame handling failed:", e6);
          });
        }
      });
    }
    __ensureTabLoaded() {
      if (this.__tabLoaded || this.__tabLoader === void 0) return;
      const tabName = this.__tabLoader.tabs[0];
      if (tabName === void 0) return;
      this.__tabLoader.loadTab(tabName);
      this.__tabLoaded = true;
    }
    __beginStreaming() {
      var _a2, _b;
      if (this.__streaming) return;
      this.__streaming = true;
      (_b = (_a2 = this.evaluator).beginPendingWork) == null ? void 0 : _b.call(_a2);
    }
    __endStreaming() {
      var _a2, _b;
      if (!this.__streaming) return;
      this.__streaming = false;
      (_b = (_a2 = this.evaluator).endPendingWork) == null ? void 0 : _b.call(_a2);
    }
    __reportFilterError(e6) {
      var _a2, _b;
      const detail = e6 instanceof Error ? `${e6.name}: ${e6.message}` : String(e6);
      (_b = (_a2 = this.evaluator.conductor) == null ? void 0 : _a2.sendError) == null ? void 0 : _b.call(_a2, new e2(`Your installed filter threw an error and has been reset to the default (copy) filter: ${detail}`));
    }
    __registerBuffer(buffer) {
      return this.evaluator.opaque_make(buffer).then(typed => {
        this.__buffers.set(typed.value, buffer);
        return typed;
      });
    }
    __unregisterBuffer(typed) {
      this.__buffers.delete(typed.value);
    }
    __getBuffer(handle, funcName) {
      return __async(this, null, function* () {
        const value = yield this.evaluator.opaque_get(handle);
        if (!value || typeof value !== "object" || !(("view" in value))) {
          throw new n(funcName, void 0, "an image", value);
        }
        return value;
      });
    }
    __resolvePixelRef(pixel, funcName) {
      const {imageId, x, y} = unpackPixelRef(pixel.value);
      const buffer = this.__buffers.get(imageId);
      if (!buffer) {
        throw new n(funcName, "pixel", "a pixel obtained via get_pixel", pixel.value);
      }
      return {
        buffer,
        x,
        y
      };
    }
    __handleCapturedFrame(message) {
      return __async(this, null, function* () {
        const srcBuffer = {
          view: new Uint8ClampedArray(message.buffer),
          width: message.width,
          height: message.height
        };
        const destBuffer = makeImageBuffer(message.width, message.height);
        let srcHandle;
        let destHandle;
        try {
          srcHandle = yield this.__registerBuffer(srcBuffer);
          destHandle = yield this.__registerBuffer(destBuffer);
          if (this.__filter === void 0) {
            copyImageBuffer(srcBuffer, destBuffer);
          } else {
            yield callFilterClosure(this.evaluator, this.__filter, srcHandle, destHandle);
          }
        } catch (e6) {
          console.error("pix_n_flix filter error, resetting to the default filter:", e6);
          this.__reportFilterError(e6);
          this.__filter = void 0;
          copyImageBuffer(srcBuffer, destBuffer);
        } finally {
          if (srcHandle) this.__unregisterBuffer(srcHandle);
          if (destHandle) this.__unregisterBuffer(destHandle);
        }
        const outBuffer = destBuffer.view.buffer;
        this.__frameChannel.send({
          kind: "filtered-frame",
          buffer: outBuffer
        }, [outBuffer]);
      });
    }
    get_pixel_value(source, x, y, p2) {
      return __asyncGenerator(this, null, function* () {
        const buffer = yield new __await(this.__getBuffer(source, "get_pixel_value"));
        assertPixelCoordinates(buffer, x.value, y.value, p2.value, "get_pixel_value");
        return {
          type: E.NUMBER,
          value: readChannel(buffer, x.value, y.value, p2.value)
        };
      });
    }
    set_pixel_value(dest, x, y, p2, v) {
      return __asyncGenerator(this, null, function* () {
        const buffer = yield new __await(this.__getBuffer(dest, "set_pixel_value"));
        assertPixelCoordinates(buffer, x.value, y.value, p2.value, "set_pixel_value");
        writeChannel(buffer, x.value, y.value, p2.value, v.value, "set_pixel_value", "v");
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    get_pixel(image, x, y) {
      return __asyncGenerator(this, null, function* () {
        const buffer = yield new __await(this.__getBuffer(image, "get_pixel"));
        assertPixelCoordinates(buffer, x.value, y.value, 0, "get_pixel");
        return {
          type: E.OPAQUE,
          value: packPixelRef(image.value, x.value, y.value)
        };
      });
    }
    red_of(pixel) {
      return __asyncGenerator(this, null, function* () {
        const {buffer, x, y} = this.__resolvePixelRef(pixel, "red_of");
        return {
          type: E.NUMBER,
          value: readChannel(buffer, x, y, 0)
        };
      });
    }
    green_of(pixel) {
      return __asyncGenerator(this, null, function* () {
        const {buffer, x, y} = this.__resolvePixelRef(pixel, "green_of");
        return {
          type: E.NUMBER,
          value: readChannel(buffer, x, y, 1)
        };
      });
    }
    blue_of(pixel) {
      return __asyncGenerator(this, null, function* () {
        const {buffer, x, y} = this.__resolvePixelRef(pixel, "blue_of");
        return {
          type: E.NUMBER,
          value: readChannel(buffer, x, y, 2)
        };
      });
    }
    alpha_of(pixel) {
      return __asyncGenerator(this, null, function* () {
        const {buffer, x, y} = this.__resolvePixelRef(pixel, "alpha_of");
        return {
          type: E.NUMBER,
          value: readChannel(buffer, x, y, 3)
        };
      });
    }
    set_rgba(pixel, r3, g, b, a4) {
      return __asyncGenerator(this, null, function* () {
        const {buffer, x, y} = this.__resolvePixelRef(pixel, "set_rgba");
        writeChannel(buffer, x, y, 0, r3.value, "set_rgba", "r");
        writeChannel(buffer, x, y, 1, g.value, "set_rgba", "g");
        writeChannel(buffer, x, y, 2, b.value, "set_rgba", "b");
        writeChannel(buffer, x, y, 3, a4.value, "set_rgba", "a");
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    image_width() {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.NUMBER,
          value: this.__width
        };
      });
    }
    image_height() {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.NUMBER,
          value: this.__height
        };
      });
    }
    copy_image(src, dest) {
      return __asyncGenerator(this, null, function* () {
        const srcBuffer = yield new __await(this.__getBuffer(src, "copy_image"));
        const destBuffer = yield new __await(this.__getBuffer(dest, "copy_image"));
        copyImageBuffer(srcBuffer, destBuffer);
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    install_filter(filter) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        this.__filter = filter;
        this.__beginStreaming();
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    reset_filter() {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        this.__filter = void 0;
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    compose_filter(filter1, filter2) {
      return __asyncGenerator(this, null, function* () {
        const evaluator = this.evaluator;
        const registerBuffer = this.__registerBuffer.bind(this);
        const unregisterBuffer = this.__unregisterBuffer.bind(this);
        const getBuffer = this.__getBuffer.bind(this);
        return evaluator.closure_make({
          returnType: E.VOID,
          args: [E.OPAQUE, E.OPAQUE]
        }, function (src, dest) {
          return __asyncGenerator(this, null, function* () {
            const srcBuffer = yield new __await(getBuffer(src, "compose_filter"));
            const tempBuffer = makeImageBuffer(srcBuffer.width, srcBuffer.height);
            const tempHandle = yield new __await(registerBuffer(tempBuffer));
            try {
              yield new __await(callFilterClosure(evaluator, filter1, src, tempHandle));
              yield new __await(callFilterClosure(evaluator, filter2, tempHandle, dest));
            } finally {
              unregisterBuffer(tempHandle);
            }
            return {
              type: E.VOID,
              value: void 0
            };
          });
        });
      });
    }
    pause_at(pause_time) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        if (pause_time.value < 0) {
          throw new e2("pause_at: pause_time must be non-negative.");
        }
        this.__tabRpc.$pauseAt(pause_time.value);
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    set_dimensions(width, height) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        assertInRange(width.value, MIN_WIDTH, MAX_WIDTH, "set_dimensions", "width");
        assertInRange(height.value, MIN_HEIGHT, MAX_HEIGHT, "set_dimensions", "height");
        this.__width = width.value;
        this.__height = height.value;
        yield new __await(this.__tabRpc.updateDimensions(width.value, height.value));
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    set_fps(fps) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        assertInRange(fps.value, MIN_FPS, MAX_FPS, "set_fps", "fps");
        this.__tabRpc.$updateFPS(fps.value);
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    set_volume(volume) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        const clamped = Math.max(0, Math.min(100, volume.value)) / 100;
        this.__tabRpc.$updateVolume(clamped);
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    use_local_file() {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        yield new __await(this.__tabRpc.useLocalFile());
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    use_image_url(url) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        yield new __await(this.__tabRpc.useImageUrl(url.value));
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    use_video_url(url) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        yield new __await(this.__tabRpc.useVideoUrl(url.value));
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    get_video_time() {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        const value = yield new __await(this.__tabRpc.getVideoTime());
        return {
          type: E.NUMBER,
          value
        };
      });
    }
    keep_aspect_ratio(keep) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        this.__tabRpc.$keepAspectRatio(keep.value);
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    set_loop_count(n5) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        if (n5.value !== Infinity && !Number.isInteger(n5.value)) {
          throw new n("set_loop_count", "n", "an integer, or Infinity to loop forever", n5.value);
        }
        this.__tabRpc.$setLoopCount(n5.value === Infinity ? -1 : n5.value);
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    stop() {
      return __asyncGenerator(this, null, function* () {
        this.__tabRpc.$stopStreaming();
        this.__endStreaming();
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
  };
  _init = __decoratorStart(_a);
  __decorateElement(_init, 1, "get_pixel_value", _get_pixel_value_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "set_pixel_value", _set_pixel_value_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "get_pixel", _get_pixel_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "red_of", _red_of_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "green_of", _green_of_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "blue_of", _blue_of_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "alpha_of", _alpha_of_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "set_rgba", _set_rgba_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "image_width", _image_width_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "image_height", _image_height_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "copy_image", _copy_image_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "install_filter", _install_filter_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "reset_filter", _reset_filter_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "compose_filter", _compose_filter_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "pause_at", _pause_at_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "set_dimensions", _set_dimensions_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "set_fps", _set_fps_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "set_volume", _set_volume_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "use_local_file", _use_local_file_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "use_image_url", _use_image_url_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "use_video_url", _use_video_url_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "get_video_time", _get_video_time_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "keep_aspect_ratio", _keep_aspect_ratio_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "set_loop_count", _set_loop_count_dec, _PixNFlixModulePlugin);
  __decorateElement(_init, 1, "stop", _stop_dec, _PixNFlixModulePlugin);
  __decoratorMetadata(_init, _PixNFlixModulePlugin);
  _PixNFlixModulePlugin.channelAttach = [PIX_N_FLIX_CONTROL_CHANNEL_ID, PIX_N_FLIX_FRAME_CHANNEL_ID];
  Object.assign(_PixNFlixModulePlugin.prototype.get_pixel_value, {
    sync(source, x, y, p2) {
      const buffer = this.__buffers.get(source.value);
      if (!buffer) return void 0;
      assertPixelCoordinates(buffer, x.value, y.value, p2.value, "get_pixel_value");
      return {
        type: E.NUMBER,
        value: readChannel(buffer, x.value, y.value, p2.value)
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.set_pixel_value, {
    sync(dest, x, y, p2, v) {
      const buffer = this.__buffers.get(dest.value);
      if (!buffer) return void 0;
      assertPixelCoordinates(buffer, x.value, y.value, p2.value, "set_pixel_value");
      writeChannel(buffer, x.value, y.value, p2.value, v.value, "set_pixel_value", "v");
      return {
        type: E.VOID,
        value: void 0
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.image_width, {
    sync() {
      return {
        type: E.NUMBER,
        value: this.__width
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.image_height, {
    sync() {
      return {
        type: E.NUMBER,
        value: this.__height
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.copy_image, {
    sync(src, dest) {
      const srcBuffer = this.__buffers.get(src.value);
      const destBuffer = this.__buffers.get(dest.value);
      if (!srcBuffer || !destBuffer) return void 0;
      copyImageBuffer(srcBuffer, destBuffer);
      return {
        type: E.VOID,
        value: void 0
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.get_pixel, {
    sync(image, x, y) {
      const buffer = this.__buffers.get(image.value);
      if (!buffer) return void 0;
      assertPixelCoordinates(buffer, x.value, y.value, 0, "get_pixel");
      return {
        type: E.OPAQUE,
        value: packPixelRef(image.value, x.value, y.value)
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.red_of, {
    sync(pixel) {
      const {imageId, x, y} = unpackPixelRef(pixel.value);
      const buffer = this.__buffers.get(imageId);
      if (!buffer) return void 0;
      return {
        type: E.NUMBER,
        value: readChannel(buffer, x, y, 0)
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.green_of, {
    sync(pixel) {
      const {imageId, x, y} = unpackPixelRef(pixel.value);
      const buffer = this.__buffers.get(imageId);
      if (!buffer) return void 0;
      return {
        type: E.NUMBER,
        value: readChannel(buffer, x, y, 1)
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.blue_of, {
    sync(pixel) {
      const {imageId, x, y} = unpackPixelRef(pixel.value);
      const buffer = this.__buffers.get(imageId);
      if (!buffer) return void 0;
      return {
        type: E.NUMBER,
        value: readChannel(buffer, x, y, 2)
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.alpha_of, {
    sync(pixel) {
      const {imageId, x, y} = unpackPixelRef(pixel.value);
      const buffer = this.__buffers.get(imageId);
      if (!buffer) return void 0;
      return {
        type: E.NUMBER,
        value: readChannel(buffer, x, y, 3)
      };
    }
  });
  Object.assign(_PixNFlixModulePlugin.prototype.set_rgba, {
    sync(pixel, r3, g, b, a4) {
      const {imageId, x, y} = unpackPixelRef(pixel.value);
      const buffer = this.__buffers.get(imageId);
      if (!buffer) return void 0;
      writeChannel(buffer, x, y, 0, r3.value, "set_rgba", "r");
      writeChannel(buffer, x, y, 1, g.value, "set_rgba", "g");
      writeChannel(buffer, x, y, 2, b.value, "set_rgba", "b");
      writeChannel(buffer, x, y, 3, a4.value, "set_rgba", "a");
      return {
        type: E.VOID,
        value: void 0
      };
    }
  });
  var PixNFlixModulePlugin = _PixNFlixModulePlugin;
  return __toCommonJS(index_exports);
};