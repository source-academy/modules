export default require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
  var __typeError = msg => {
    throw TypeError(msg);
  };
  var __pow = Math.pow;
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __spreadValues = (a4, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a4, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a4, prop, b[prop]);
    }
    return a4;
  };
  var __spreadProps = (a4, b) => __defProps(a4, __getOwnPropDescs(b));
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
  var __runInitializers = (array, flags, self2, value) => {
    for (var i = 0, fns = array[flags >> 1], n5 = fns && fns.length; i < n5; i++) flags & 1 ? fns[i].call(self2) : value = fns[i].call(self2, value);
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
  var __yieldStar = value => {
    var obj = value[__knownSymbol("asyncIterator")], isAwait = false, method, it = {};
    if (obj == null) {
      obj = value[__knownSymbol("iterator")]();
      method = k => it[k] = x => obj[k](x);
    } else {
      obj = obj.call(value);
      method = k => it[k] = v => {
        if (isAwait) {
          isAwait = false;
          if (k === "throw") throw v;
          return v;
        }
        isAwait = true;
        return {
          done: false,
          value: new __await(new Promise(resolve => {
            var x = obj[k](v);
            if (!(x instanceof Object)) __typeError("Object expected");
            resolve(x);
          }), 1)
        };
      };
    }
    return (it[__knownSymbol("iterator")] = () => it, method("next"), ("throw" in obj) ? method("throw") : it.throw = x => {
      throw x;
    }, ("return" in obj) && method("return"), it);
  };
  var index_exports = {};
  __export(index_exports, {
    conductorToSound: () => conductorToSound,
    default: () => SoundModulePlugin
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
  function p(r3, o4, t5, n5 = true) {
    return "number" == typeof r3 && !Number.isNaN(r3) && (!(n5 && !Number.isInteger(r3)) && (!(void 0 !== o4 && r3 < o4) && !(void 0 !== t5 && r3 > t5)));
  }
  function l(o4, t5, n5, e6, i = true, u3) {
    if (!p(o4, n5, e6, i)) throw new u(o4, {
      min: n5,
      max: e6,
      integer: i
    }, t5, u3);
  }
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
  var soundSamplerCache = new WeakMap();
  function rememberSoundSampler(evaluator, sound, leftClosure, rightClosure) {
    if (!sound.sampleChannels) return;
    let byLeftClosure = soundSamplerCache.get(evaluator);
    if (!byLeftClosure) {
      byLeftClosure = new Map();
      soundSamplerCache.set(evaluator, byLeftClosure);
    }
    let byRightClosure = byLeftClosure.get(leftClosure.value);
    if (!byRightClosure) {
      byRightClosure = new Map();
      byLeftClosure.set(leftClosure.value, byRightClosure);
    }
    let byDuration = byRightClosure.get(rightClosure.value);
    if (!byDuration) {
      byDuration = new Map();
      byRightClosure.set(rightClosure.value, byDuration);
    }
    byDuration.set(sound.duration, sound.sampleChannels);
  }
  function restoreSoundSampler(evaluator, sound, leftClosure, rightClosure) {
    var _a2, _b, _c;
    const sampleChannels = (_c = (_b = (_a2 = soundSamplerCache.get(evaluator)) == null ? void 0 : _a2.get(leftClosure.value)) == null ? void 0 : _b.get(rightClosure.value)) == null ? void 0 : _c.get(sound.duration);
    return sampleChannels ? __spreadProps(__spreadValues({}, sound), {
      sampleChannels
    }) : sound;
  }
  var Accidental;
  (function (Accidental2) {
    Accidental2["SHARP"] = "#";
    Accidental2["FLAT"] = "b";
    Accidental2["NATURAL"] = "\u266E";
  })(Accidental || (Accidental = {}));
  function midi_note_to_frequency(note) {
    l(note, "midi_note_to_frequency");
    return 440 * Math.pow(2, (note - 69) / 12);
  }
  var SHARP = Accidental.SHARP;
  var FLAT = Accidental.FLAT;
  var NATURAL = Accidental.NATURAL;
  var globalThis_ = typeof globalThis === "object" && globalThis || typeof window === "object" && window || typeof self === "object" && self || typeof globalThis === "object" && globalThis || (function () {
    return this;
  })();
  var DOMException = typeof globalThis_.DOMException !== "undefined" ? globalThis_.DOMException : Error;
  var AbortError = class extends DOMException {
    constructor(message = "The operation was aborted") {
      super(message);
    }
  };
  function delay(ms, {signal} = {}) {
    return new Promise((resolve, reject) => {
      const abortError = () => {
        reject(new AbortError());
      };
      const abortHandler = () => {
        clearTimeout(timeoutId);
        abortError();
      };
      if (signal == null ? void 0 : signal.aborted) return abortError();
      const timeoutId = setTimeout(() => {
        signal == null ? void 0 : signal.removeEventListener("abort", abortHandler);
        resolve();
      }, ms);
      signal == null ? void 0 : signal.addEventListener("abort", abortHandler, {
        once: true
      });
    });
  }
  var FS = 44100;
  var fourier_expansion_level = 5;
  var recording_signal_ms = 100;
  var pre_recording_signal_pause_ms = 200;
  var globalVars = {
    micPermissionGranted: null,
    activePlayCount: 0,
    recordingInProgress: false
  };
  var playGeneration = 0;
  var recordingGeneration = 0;
  var soundIO;
  function setSoundIO(bridge) {
    soundIO = bridge;
  }
  function io() {
    if (!soundIO) {
      throw new e2("Sound I/O bridge is not initialised");
    }
    return soundIO;
  }
  function drainGenerator(generator) {
    return __async(this, null, function* () {
      let next = yield generator.next();
      while (!next.done) {
        next = yield generator.next();
      }
      return next.value;
    });
  }
  function linear_decay(decay_period) {
    return t5 => {
      if (decay_period <= 0 || t5 > decay_period || t5 < 0) {
        return 0;
      }
      return 1 - t5 / decay_period;
    };
  }
  function validateDuration(func_name, duration) {
    if (typeof duration !== "number") {
      throw new n(func_name, "duration", "number", duration);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new e2(`${func_name}: Sound duration must be a finite number greater than or equal to 0`);
    }
  }
  function validateWave(func_name, wave, lr) {
    if (typeof wave !== "function") {
      throw new n(func_name, lr === void 0 ? "wave" : `${lr} wave`, "a wave", wave);
    }
  }
  function validateAdsrParams(func_name, attack_ratio, decay_ratio, sustain_level, release_ratio) {
    const ratios = [["attack_ratio", attack_ratio], ["decay_ratio", decay_ratio], ["release_ratio", release_ratio]];
    for (const [name, ratio] of ratios) {
      if (typeof ratio !== "number" || !Number.isFinite(ratio)) {
        throw new n(func_name, name, "number", ratio);
      }
      if (ratio < 0 || ratio > 1) {
        throw new e2(`${func_name}: ${name} must be between 0 and 1, got ${ratio}`);
      }
    }
    if (typeof sustain_level !== "number" || !Number.isFinite(sustain_level)) {
      throw new n(func_name, "sustain_level", "number", sustain_level);
    }
    if (sustain_level < 0 || sustain_level > 1) {
      throw new e2(`${func_name}: sustain_level must be between 0 and 1, got ${sustain_level}`);
    }
    const total = attack_ratio + decay_ratio + release_ratio;
    if (total > 1) {
      throw new e2(`${func_name}: attack_ratio + decay_ratio + release_ratio must not exceed 1, got ${total}`);
    }
  }
  function syncWave(fn) {
    const wave = function (t5) {
      return __asyncGenerator(this, null, function* () {
        return fn(t5);
      });
    };
    return Object.assign(wave, {
      sync: fn
    });
  }
  function clipToDuration(wave, duration) {
    if (wave.sync) {
      const sync = wave.sync;
      return syncWave(t5 => t5 >= duration ? 0 : sync(t5));
    }
    return function (t5) {
      return __asyncGenerator(this, null, function* () {
        if (t5 >= duration) {
          return 0;
        }
        return yield* __yieldStar(wave(t5));
      });
    };
  }
  function make_stereo_sound(left_wave, right_wave, duration) {
    validateDuration("make_stereo_sound", duration);
    validateWave("make_stereo_sound", left_wave, "left");
    validateWave("make_stereo_sound", right_wave, "right");
    const leftWave = clipToDuration(left_wave, duration);
    const rightWave = left_wave === right_wave ? leftWave : clipToDuration(right_wave, duration);
    return {
      leftWave,
      rightWave,
      duration
    };
  }
  function make_sound(wave, duration) {
    validateDuration("make_sound", duration);
    validateWave("make_sound", wave);
    return make_stereo_sound(wave, wave, duration);
  }
  function get_left_wave(sound) {
    return sound.leftWave;
  }
  function get_wave(sound) {
    return get_left_wave(sound);
  }
  function get_right_wave(sound) {
    return sound.rightWave;
  }
  function get_duration(sound) {
    return sound.duration;
  }
  function is_sound(x) {
    return typeof x === "object" && x !== null && typeof x.leftWave === "function" && typeof x.rightWave === "function" && typeof x.duration === "number";
  }
  function sampleWave(wave, duration) {
    return __asyncGenerator(this, null, function* () {
      const length = Math.ceil(FS * duration);
      const channel = new Float32Array(length);
      let prev_value = 0;
      const sync = wave.sync;
      for (let i = 0; i < length; i += 1) {
        const temp = smoothSample(sync ? sync(i / FS) : yield* __yieldStar(wave(i / FS)), prev_value);
        channel[i] = temp;
        prev_value = temp;
      }
      return channel;
    });
  }
  function encodeWavDataUri(left, right, sampleRate) {
    const numChannels = 2;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = left.length * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    function writeString(offset2, value) {
      for (let i = 0; i < value.length; i += 1) {
        view.setUint8(offset2 + i, value.charCodeAt(i));
      }
    }
    function writeSample(offset2, value) {
      const clamped = Math.max(-1, Math.min(1, value));
      view.setInt16(offset2, clamped < 0 ? clamped * 32768 : clamped * 32767, true);
    }
    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);
    let offset = 44;
    for (let i = 0; i < left.length; i += 1) {
      writeSample(offset, left[i]);
      writeSample(offset + 2, right[i]);
      offset += blockAlign;
    }
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 32768;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return `data:audio/wav;base64,${btoa(binary)}`;
  }
  function smoothSample(sample, previousSample) {
    let temp = sample;
    if (temp > 1) {
      temp = 1;
    } else if (temp < -1) {
      temp = -1;
    }
    if (temp === 0 && Math.abs(temp - previousSample) > 0.01) {
      temp = previousSample * 0.999;
    }
    return temp;
  }
  function sampleSound(sound) {
    return __asyncGenerator(this, null, function* () {
      if (sound.sampleChannels) {
        return yield* __yieldStar(sound.sampleChannels(sound.duration));
      }
      const left = yield* __yieldStar(sampleWave(sound.leftWave, sound.duration));
      return {
        left,
        right: sound.rightWave === sound.leftWave ? left : yield* __yieldStar(sampleWave(sound.rightWave, sound.duration))
      };
    });
  }
  function interpolatedWave(samples, sampleRate) {
    return syncWave(t5 => {
      var _a2, _b;
      const index = t5 * sampleRate;
      const lowerIndex = Math.floor(index);
      const upperIndex = lowerIndex + 1;
      const ratio = index - lowerIndex;
      const upper = (_a2 = samples[upperIndex]) != null ? _a2 : 0;
      const lower = (_b = samples[lowerIndex]) != null ? _b : 0;
      return lower * (1 - ratio) + upper * ratio;
    });
  }
  function samplesToSound(left, right, sampleRate) {
    const duration = left.length / sampleRate;
    const leftWave = interpolatedWave(left, sampleRate);
    const rightWave = right === left ? leftWave : interpolatedWave(right, sampleRate);
    return make_stereo_sound(leftWave, rightWave, duration);
  }
  function play_recording_signal() {
    return drainGenerator(play(sine_sound(1200, recording_signal_ms / 1e3)));
  }
  function init_record() {
    return __async(this, null, function* () {
      const granted = yield io().requestMicPermission();
      globalVars.micPermissionGranted = granted;
      return granted ? "permission granted" : "permission denied";
    });
  }
  function assertMicPermission(func_name) {
    if (globalVars.micPermissionGranted === null) {
      throw new e2(`${func_name}: Call init_record(); to obtain permission to use microphone`);
    }
    if (globalVars.micPermissionGranted === false) {
      throw new e2(`${func_name}: Permission has been denied.
Re-start browser and call init_record();
to obtain permission to use microphone.`);
    }
  }
  function reserveRecording(func_name) {
    if (globalVars.activePlayCount > 0) {
      throw new e2(`${func_name}: Cannot record while another sound is playing!`);
    }
    if (globalVars.recordingInProgress) {
      throw new e2(`${func_name}: Cannot record while another recording is in progress!`);
    }
    assertMicPermission(func_name);
    globalVars.recordingInProgress = true;
    recordingGeneration += 1;
    return recordingGeneration;
  }
  function releaseRecording(generation) {
    if (recordingGeneration === generation) {
      globalVars.recordingInProgress = false;
    }
  }
  function record(buffer) {
    validateDuration("record", buffer);
    const generation = reserveRecording(record.name);
    const started = (() => __async(null, null, function* () {
      yield delay(pre_recording_signal_pause_ms + buffer * 1e3);
      yield play_recording_signal();
      yield delay(recording_signal_ms);
      yield io().startRecording();
    }))();
    let recordingDone;
    void started.catch(() => {
      if (!recordingDone) {
        releaseRecording(generation);
      }
    });
    return () => {
      if (!recordingDone) {
        recordingDone = started.then(() => io().stopRecording()).then(({left, right, sampleRate}) => samplesToSound(left, right, sampleRate)).finally(() => releaseRecording(generation));
        void play_recording_signal();
      }
      return () => recordingDone;
    };
  }
  function record_for(duration, buffer) {
    validateDuration("record_for", duration);
    validateDuration("record_for", buffer);
    const generation = reserveRecording(record_for.name);
    const recordingDone = (() => __async(null, null, function* () {
      try {
        yield delay(pre_recording_signal_pause_ms);
        yield play_recording_signal();
        yield delay(recording_signal_ms + buffer * 1e3);
        yield io().startRecording();
        yield delay(duration * 1e3);
        const {left, right, sampleRate} = yield io().stopRecording();
        void play_recording_signal();
        return samplesToSound(left, right, sampleRate);
      } finally {
        releaseRecording(generation);
      }
    }))();
    return () => recordingDone;
  }
  function play_wave(wave, duration) {
    return __asyncGenerator(this, null, function* () {
      validateDuration("play_wave", duration);
      validateWave("play_wave", wave);
      return yield* __yieldStar(play(make_sound(wave, duration)));
    });
  }
  function assertPlayableSound(func_name, sound) {
    if (!is_sound(sound)) {
      throw new n(func_name, "sound", "a Sound", sound);
    }
    if (sound.duration < 0) {
      throw new e2(`${func_name}: duration of sound is negative`);
    }
  }
  function play_waves(left_wave, right_wave, duration) {
    return __asyncGenerator(this, null, function* () {
      validateDuration("play_waves", duration);
      validateWave("play_waves", left_wave, "left");
      validateWave("play_waves", right_wave, "right");
      return yield* __yieldStar(play(make_stereo_sound(left_wave, right_wave, duration)));
    });
  }
  function play(sound) {
    return __asyncGenerator(this, null, function* () {
      assertPlayableSound(play.name, sound);
      if (sound.duration === 0) {
        return sound;
      }
      yield new __await(io().notifyConstructing());
      const {left: leftSamples, right: rightSamples} = yield* __yieldStar(sampleSound(sound));
      globalVars.activePlayCount += 1;
      const generation = playGeneration;
      void (() => __async(null, null, function* () {
        try {
          yield io().playSamples(leftSamples, rightSamples, FS);
        } finally {
          if (generation === playGeneration) {
            globalVars.activePlayCount = Math.max(0, globalVars.activePlayCount - 1);
          }
        }
      }))();
      return sound;
    });
  }
  function play_in_tab(sound) {
    return __asyncGenerator(this, null, function* () {
      assertPlayableSound(play_in_tab.name, sound);
      if (sound.duration === 0) {
        yield new __await(io().addZeroDurationPlayerToTab());
        return sound;
      }
      yield new __await(io().notifyConstructing());
      const {left: leftSamples, right: rightSamples} = yield* __yieldStar(sampleSound(sound));
      yield new __await(io().addPlayerToTab(encodeWavDataUri(leftSamples, rightSamples, FS)));
      return sound;
    });
  }
  function stop() {
    io().$stopPlayback();
    globalVars.activePlayCount = 0;
    playGeneration += 1;
  }
  function noise_wave() {
    return syncWave(() => Math.random() * 2 - 1);
  }
  function noise_sound(duration) {
    validateDuration("noise_sound", duration);
    return make_sound(noise_wave(), duration);
  }
  function silence_wave() {
    return syncWave(() => 0);
  }
  function silence_sound(duration) {
    validateDuration("silence_sound", duration);
    return make_sound(silence_wave(), duration);
  }
  function sine_wave(freq) {
    return syncWave(t5 => Math.sin(2 * Math.PI * t5 * freq));
  }
  function sine_sound(freq, duration) {
    validateDuration("sine_sound", duration);
    return make_sound(sine_wave(freq), duration);
  }
  function square_wave(freq) {
    function fourier_expansion_square(t5) {
      let answer = 0;
      for (let i = 1; i <= fourier_expansion_level; i += 1) {
        answer += Math.sin(2 * Math.PI * (2 * i - 1) * freq * t5) / (2 * i - 1);
      }
      return answer;
    }
    return syncWave(t5 => 4 / Math.PI * fourier_expansion_square(t5));
  }
  function square_sound(freq, duration) {
    validateDuration("square_sound", duration);
    return make_sound(square_wave(freq), duration);
  }
  function triangle_wave(freq) {
    function fourier_expansion_triangle(t5) {
      let answer = 0;
      for (let i = 0; i < fourier_expansion_level; i += 1) {
        answer += __pow(-1, i) * Math.sin((2 * i + 1) * t5 * freq * Math.PI * 2) / __pow(2 * i + 1, 2);
      }
      return answer;
    }
    return syncWave(t5 => 8 / Math.PI / Math.PI * fourier_expansion_triangle(t5));
  }
  function triangle_sound(freq, duration) {
    validateDuration("triangle_sound", duration);
    return make_sound(triangle_wave(freq), duration);
  }
  function sawtooth_wave(freq) {
    function fourier_expansion_sawtooth(t5) {
      let answer = 0;
      for (let i = 1; i <= fourier_expansion_level; i += 1) {
        answer += Math.sin(2 * Math.PI * i * freq * t5) / i;
      }
      return answer;
    }
    return syncWave(t5 => 1 / 2 - 1 / Math.PI * fourier_expansion_sawtooth(t5));
  }
  function sawtooth_sound(freq, duration) {
    validateDuration("sawtooth_sound", duration);
    return make_sound(sawtooth_wave(freq), duration);
  }
  function consecutiveWave(sounds, channel) {
    const waves = sounds.map(channel);
    if (waves.every(w => w.sync)) {
      const syncs = waves.map(w => w.sync);
      return syncWave(t5 => {
        let remaining = t5;
        for (let i = 0; i < sounds.length; i += 1) {
          if (remaining < sounds[i].duration) {
            return syncs[i](remaining);
          }
          remaining -= sounds[i].duration;
        }
        return 0;
      });
    }
    return function (t5) {
      return __asyncGenerator(this, null, function* () {
        let remaining = t5;
        for (let i = 0; i < sounds.length; i += 1) {
          if (remaining < sounds[i].duration) {
            return yield* __yieldStar(waves[i](remaining));
          }
          remaining -= sounds[i].duration;
        }
        return 0;
      });
    };
  }
  function consecutively(sounds) {
    if (sounds.length === 0) {
      return silence_sound(0);
    }
    const total_duration = sounds.reduce((acc, s7) => acc + s7.duration, 0);
    const leftWave = consecutiveWave(sounds, s7 => s7.leftWave);
    const rightWave = sounds.every(s7 => s7.leftWave === s7.rightWave) ? leftWave : consecutiveWave(sounds, s7 => s7.rightWave);
    return make_stereo_sound(leftWave, rightWave, total_duration);
  }
  function simultaneousWave(sounds, channel) {
    const count = sounds.length;
    const waves = sounds.map(channel);
    if (waves.every(w => w.sync)) {
      const syncs = waves.map(w => w.sync);
      return syncWave(t5 => {
        let sum = 0;
        for (let i = 0; i < sounds.length; i += 1) {
          if (t5 <= sounds[i].duration) {
            sum += syncs[i](t5);
          }
        }
        return sum / count;
      });
    }
    return function (t5) {
      return __asyncGenerator(this, null, function* () {
        let sum = 0;
        for (let i = 0; i < sounds.length; i += 1) {
          if (t5 <= sounds[i].duration) {
            sum += yield* __yieldStar(waves[i](t5));
          }
        }
        return sum / count;
      });
    };
  }
  function simultaneously(sounds) {
    if (sounds.length === 0) {
      return silence_sound(0);
    }
    const max_duration = Math.max(...sounds.map(s7 => s7.duration));
    const leftWave = simultaneousWave(sounds, s7 => s7.leftWave);
    const rightWave = sounds.every(s7 => s7.leftWave === s7.rightWave) ? leftWave : simultaneousWave(sounds, s7 => s7.rightWave);
    return make_stereo_sound(leftWave, rightWave, max_duration);
  }
  function adsrWave(wave, duration, attack_time, decay_time, sustain_level, release_time) {
    function envelopeAt(x) {
      if (x < attack_time) {
        return x / attack_time;
      }
      if (x < attack_time + decay_time) {
        return (1 - sustain_level) * linear_decay(decay_time)(x - attack_time) + sustain_level;
      }
      if (x < duration - release_time) {
        return sustain_level;
      }
      return sustain_level * linear_decay(release_time)(x - (duration - release_time));
    }
    if (wave.sync) {
      const sync = wave.sync;
      return syncWave(x => envelopeAt(x) * sync(x));
    }
    return function (x) {
      return __asyncGenerator(this, null, function* () {
        return envelopeAt(x) * (yield* __yieldStar(wave(x)));
      });
    };
  }
  function adsrTransformer(attack_ratio, decay_ratio, sustain_level, release_ratio) {
    return sound => {
      const {duration} = sound;
      const attack_time = duration * attack_ratio;
      const decay_time = duration * decay_ratio;
      const release_time = duration * release_ratio;
      const leftWave = adsrWave(sound.leftWave, duration, attack_time, decay_time, sustain_level, release_time);
      const rightWave = sound.leftWave === sound.rightWave ? leftWave : adsrWave(sound.rightWave, duration, attack_time, decay_time, sustain_level, release_time);
      return make_stereo_sound(leftWave, rightWave, duration);
    };
  }
  function adsr(attack_ratio, decay_ratio, sustain_level, release_ratio) {
    validateAdsrParams("adsr", attack_ratio, decay_ratio, sustain_level, release_ratio);
    return adsrTransformer(attack_ratio, decay_ratio, sustain_level, release_ratio);
  }
  function stacking_adsr(waveform, base_frequency, duration, envelopes) {
    const harmonics = envelopes.map((envelope, i) => envelope(waveform(base_frequency * (i + 1), duration)));
    return simultaneously(harmonics);
  }
  function phaseModWave(modulatorWave, freq, amount) {
    if (modulatorWave.sync) {
      const sync = modulatorWave.sync;
      return syncWave(t5 => Math.sin(2 * Math.PI * t5 * freq + amount * sync(t5)));
    }
    return function (t5) {
      return __asyncGenerator(this, null, function* () {
        return Math.sin(2 * Math.PI * t5 * freq + amount * (yield* __yieldStar(modulatorWave(t5))));
      });
    };
  }
  function phase_mod(freq, duration, amount) {
    return modulator => {
      const leftWave = phaseModWave(modulator.leftWave, freq, amount);
      const rightWave = modulator.leftWave === modulator.rightWave ? leftWave : phaseModWave(modulator.rightWave, freq, amount);
      return make_stereo_sound(leftWave, rightWave, duration);
    };
  }
  function gainWave(wave, gain) {
    if (wave.sync) {
      const sync = wave.sync;
      return syncWave(t5 => gain * sync(t5));
    }
    return function (t5) {
      return __asyncGenerator(this, null, function* () {
        return gain * (yield* __yieldStar(wave(t5)));
      });
    };
  }
  function make_stereo_sound_with_sampler(left_wave, right_wave, duration, sampleChannels) {
    return __spreadProps(__spreadValues({}, make_stereo_sound(left_wave, right_wave, duration)), {
      sampleChannels
    });
  }
  function squash(sound) {
    const {leftWave, rightWave, duration} = sound;
    let averaged;
    if (leftWave === rightWave) {
      averaged = leftWave;
    } else if (leftWave.sync && rightWave.sync) {
      const leftSync = leftWave.sync;
      const rightSync = rightWave.sync;
      averaged = syncWave(t5 => 0.5 * (leftSync(t5) + rightSync(t5)));
    } else {
      averaged = function (t5) {
        return __asyncGenerator(this, null, function* () {
          return 0.5 * ((yield* __yieldStar(leftWave(t5))) + (yield* __yieldStar(rightWave(t5))));
        });
      };
    }
    return make_sound(averaged, duration);
  }
  function pan(amount) {
    const clamped = Math.max(-1, Math.min(1, amount));
    return sound => {
      const {leftWave: wave, duration} = squash(sound);
      return make_stereo_sound_with_sampler(gainWave(wave, (1 - clamped) / 2), gainWave(wave, (1 + clamped) / 2), duration, duration2 => samplePannedChannels(wave, duration2, clamped));
    };
  }
  function samplePannedChannels(wave, duration, amount) {
    return __asyncGenerator(this, null, function* () {
      const length = Math.ceil(FS * duration);
      const left = new Float32Array(length);
      const right = new Float32Array(length);
      const leftGain = (1 - amount) / 2;
      const rightGain = (1 + amount) / 2;
      let prevLeft = 0;
      let prevRight = 0;
      const sync = wave.sync;
      for (let i = 0; i < length; i += 1) {
        const t5 = i / FS;
        const sample = sync ? sync(t5) : yield* __yieldStar(wave(t5));
        const leftSample = smoothSample(leftGain * sample, prevLeft);
        const rightSample = smoothSample(rightGain * sample, prevRight);
        left[i] = leftSample;
        right[i] = rightSample;
        prevLeft = leftSample;
        prevRight = rightSample;
      }
      return {
        left,
        right
      };
    });
  }
  function panModAmountWave(modulator) {
    const {leftWave, rightWave} = modulator;
    if (leftWave === rightWave) {
      if (leftWave.sync) {
        const sync = leftWave.sync;
        return syncWave(t5 => {
          const output = sync(t5);
          return Math.max(-1, Math.min(1, output + output));
        });
      }
      return function (t5) {
        return __asyncGenerator(this, null, function* () {
          const output = yield* __yieldStar(leftWave(t5));
          return Math.max(-1, Math.min(1, output + output));
        });
      };
    }
    if (leftWave.sync && rightWave.sync) {
      const leftSync = leftWave.sync;
      const rightSync = rightWave.sync;
      return syncWave(t5 => Math.max(-1, Math.min(1, leftSync(t5) + rightSync(t5))));
    }
    return function (t5) {
      return __asyncGenerator(this, null, function* () {
        const output = (yield* __yieldStar(leftWave(t5))) + (yield* __yieldStar(rightWave(t5)));
        return Math.max(-1, Math.min(1, output));
      });
    };
  }
  function pan_mod(modulator) {
    const amountWave = panModAmountWave(modulator);
    return sound => {
      const {leftWave: wave, duration} = squash(sound);
      if (amountWave.sync && wave.sync) {
        const amountSync = amountWave.sync;
        const sync = wave.sync;
        return make_stereo_sound_with_sampler(syncWave(t5 => (1 - amountSync(t5)) / 2 * sync(t5)), syncWave(t5 => (1 + amountSync(t5)) / 2 * sync(t5)), duration, duration2 => samplePanModChannels(wave, amountWave, duration2));
      }
      return make_stereo_sound_with_sampler(function (t5) {
        return __asyncGenerator(this, null, function* () {
          return (1 - (yield* __yieldStar(amountWave(t5)))) / 2 * (yield* __yieldStar(wave(t5)));
        });
      }, function (t5) {
        return __asyncGenerator(this, null, function* () {
          return (1 + (yield* __yieldStar(amountWave(t5)))) / 2 * (yield* __yieldStar(wave(t5)));
        });
      }, duration, duration2 => samplePanModChannels(wave, amountWave, duration2));
    };
  }
  function samplePanModChannels(wave, amountWave, duration) {
    return __asyncGenerator(this, null, function* () {
      const length = Math.ceil(FS * duration);
      const left = new Float32Array(length);
      const right = new Float32Array(length);
      let prevLeft = 0;
      let prevRight = 0;
      const amountSync = amountWave.sync;
      const waveSync = wave.sync;
      for (let i = 0; i < length; i += 1) {
        const t5 = i / FS;
        const amount = amountSync ? amountSync(t5) : yield* __yieldStar(amountWave(t5));
        const sample = waveSync ? waveSync(t5) : yield* __yieldStar(wave(t5));
        const leftSample = smoothSample((1 - amount) / 2 * sample, prevLeft);
        const rightSample = smoothSample((1 + amount) / 2 * sample, prevRight);
        left[i] = leftSample;
        right[i] = rightSample;
        prevLeft = leftSample;
        prevRight = rightSample;
      }
      return {
        left,
        right
      };
    });
  }
  function bell(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, [adsrTransformer(0, 0.6, 0, 0.05), adsrTransformer(0, 0.6618, 0, 0.05), adsrTransformer(0, 0.7618, 0, 0.05), adsrTransformer(0, 0.9071, 0, 0.05)]);
  }
  function cello(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, [adsrTransformer(0.05, 0, 1, 0.1), adsrTransformer(0.05, 0, 1, 0.15), adsrTransformer(0, 0, 0.2, 0.15)]);
  }
  function piano(note, duration) {
    return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration, [adsrTransformer(0, 0.515, 0, 0.05), adsrTransformer(0, 0.32, 0, 0.05), adsrTransformer(0, 0.2, 0, 0.05)]);
  }
  function trombone(note, duration) {
    return stacking_adsr(square_sound, midi_note_to_frequency(note), duration, [adsrTransformer(0.2, 0, 1, 0.1), adsrTransformer(0.3236, 0.6, 0, 0.1)]);
  }
  function violin(note, duration) {
    return stacking_adsr(sawtooth_sound, midi_note_to_frequency(note), duration, [adsrTransformer(0.35, 0, 1, 0.15), adsrTransformer(0.35, 0, 1, 0.15), adsrTransformer(0.45, 0, 1, 0.15), adsrTransformer(0.45, 0, 1, 0.15)]);
  }
  var SOUND_CHANNEL_ID = "sourceacademy-sound-channel";
  var SOUND_TAB_NAME = "Sound";
  var waveDecodeCache = new WeakMap();
  var closureEncodeCache = new WeakMap();
  function closureToWave(evaluator, closure) {
    var _a2;
    let decoded = waveDecodeCache.get(evaluator);
    if (!decoded) {
      decoded = new Map();
      waveDecodeCache.set(evaluator, decoded);
    }
    const cachedWave = decoded.get(closure.value);
    if (cachedWave) return cachedWave;
    const wave = function (t5) {
      return __asyncGenerator(this, null, function* () {
        const result = yield* __yieldStar(evaluator.closure_call_unchecked(closure, [{
          type: E.NUMBER,
          value: t5
        }]));
        if (result.type !== E.NUMBER) {
          throw new e2(`Expected a wave to return a number, got ${E[result.type]}`);
        }
        return result.value;
      });
    };
    const syncCall = (_a2 = evaluator.closure_call_sync) == null ? void 0 : _a2.bind(evaluator);
    let probe;
    try {
      probe = syncCall == null ? void 0 : syncCall(closure, [{
        type: E.NUMBER,
        value: 0
      }]);
    } catch (e6) {
      probe = void 0;
    }
    if (probe !== void 0) {
      if (probe.type !== E.NUMBER) {
        throw new e2(`Expected a wave to return a number, got ${E[probe.type]}`);
      }
      const probedSample = [0, probe.value];
      Object.assign(wave, {
        sync: t5 => {
          if (t5 === probedSample[0]) return probedSample[1];
          const result = syncCall(closure, [{
            type: E.NUMBER,
            value: t5
          }]);
          if (result === void 0) {
            throw new e2("Expected a wave to consistently return a number");
          }
          if (result.type !== E.NUMBER) {
            throw new e2(`Expected a wave to return a number, got ${E[result.type]}`);
          }
          return result.value;
        }
      });
    }
    decoded.set(closure.value, wave);
    return wave;
  }
  function waveToConductorClosure(evaluator, wave) {
    let encoded = closureEncodeCache.get(evaluator);
    if (!encoded) {
      encoded = new WeakMap();
      closureEncodeCache.set(evaluator, encoded);
    }
    const cachedClosure = encoded.get(wave);
    if (cachedClosure) return cachedClosure;
    function conductorWave(t5) {
      return __asyncGenerator(this, null, function* () {
        return {
          type: E.NUMBER,
          value: yield* __yieldStar(wave(t5.value))
        };
      });
    }
    if (wave.sync) {
      const sync = wave.sync;
      Object.assign(conductorWave, {
        sync: t5 => ({
          type: E.NUMBER,
          value: sync(t5.value)
        })
      });
    }
    const closurePromise = evaluator.closure_make({
      returnType: E.NUMBER,
      args: [E.NUMBER]
    }, conductorWave);
    encoded.set(wave, closurePromise);
    return closurePromise;
  }
  function soundToConductor(evaluator, sound) {
    return __async(this, null, function* () {
      const leftClosure = yield waveToConductorClosure(evaluator, sound.leftWave);
      const rightClosure = sound.rightWave === sound.leftWave ? leftClosure : yield waveToConductorClosure(evaluator, sound.rightWave);
      rememberSoundSampler(evaluator, sound, leftClosure, rightClosure);
      const wavesPair = yield evaluator.pair_make(leftClosure, rightClosure);
      return evaluator.pair_make(wavesPair, {
        type: E.NUMBER,
        value: sound.duration
      });
    });
  }
  function isPairLike(value) {
    return value.type === E.PAIR || value.type === E.ARRAY;
  }
  function readListElements(evaluator, value) {
    return __async(this, null, function* () {
      if (value.type === E.ARRAY) {
        const length = yield evaluator.array_length(value);
        const elements2 = [];
        for (let i = 0; i < length; i += 1) {
          elements2.push(yield evaluator.array_get(value, i));
        }
        return elements2;
      }
      const elements = [];
      let current = value;
      while (current.type === E.PAIR) {
        elements.push(yield evaluator.pair_head(current));
        current = yield evaluator.pair_tail(current);
      }
      return elements;
    });
  }
  function conductorToSound(evaluator, value) {
    return __async(this, null, function* () {
      const invalidMessage = "Expected a Sound (a pair of (pair of left/right waves) and duration)";
      if (!value || !isPairLike(value)) {
        throw new e2(invalidMessage);
      }
      const wavesTv = yield evaluator.pair_head(value);
      const durationTv = yield evaluator.pair_tail(value);
      if (!isPairLike(wavesTv) || durationTv.type !== E.NUMBER) {
        throw new e2(invalidMessage);
      }
      const leftTv = yield evaluator.pair_head(wavesTv);
      const rightTv = yield evaluator.pair_tail(wavesTv);
      if (leftTv.type !== E.CLOSURE || rightTv.type !== E.CLOSURE) {
        throw new e2(invalidMessage);
      }
      const leftWave = closureToWave(evaluator, leftTv);
      const rightWave = leftTv.value === rightTv.value ? leftWave : closureToWave(evaluator, rightTv);
      return restoreSoundSampler(evaluator, {
        leftWave,
        rightWave,
        duration: durationTv.value
      }, leftTv, rightTv);
    });
  }
  function conductorListToSounds(evaluator, value) {
    return __async(this, null, function* () {
      const elements = yield readListElements(evaluator, value);
      const sounds = [];
      for (const element of elements) {
        sounds.push(yield conductorToSound(evaluator, element));
      }
      return sounds;
    });
  }
  function transformerToConductor(evaluator, transformer) {
    return __async(this, null, function* () {
      return evaluator.closure_make({
        returnType: E.PAIR,
        args: [E.PAIR]
      }, function (soundTv) {
        return __asyncGenerator(this, null, function* () {
          const sound = yield new __await(conductorToSound(evaluator, soundTv));
          return soundToConductor(evaluator, transformer(sound));
        });
      });
    });
  }
  function soundPromiseToConductor(evaluator, promise) {
    return __async(this, null, function* () {
      return evaluator.closure_make({
        returnType: E.PAIR,
        args: []
      }, function () {
        return __asyncGenerator(this, null, function* () {
          return soundToConductor(evaluator, yield new __await(promise()));
        });
      });
    });
  }
  var _violin_dec, _trombone_dec, _piano_dec, _cello_dec, _bell_dec, _pan_mod_dec, _pan_dec, _squash_dec, _phase_mod_dec, _stacking_adsr_dec, _adsr_dec, _simultaneously_dec, _consecutively_dec, _sawtooth_sound_dec, _sawtooth_wave_dec, _triangle_sound_dec, _triangle_wave_dec, _square_sound_dec, _square_wave_dec, _sine_sound_dec, _sine_wave_dec, _silence_sound_dec, _silence_wave_dec, _noise_sound_dec, _noise_wave_dec, _stop_dec, _play_in_tab_dec, _play_dec, _play_waves_dec, _play_wave_dec, _record_for_dec, _record_dec, _init_record_dec, _is_sound_dec, _get_duration_dec, _get_right_wave_dec, _get_left_wave_dec, _get_wave_dec, _make_stereo_sound_dec, _make_sound_dec, _a, _init;
  var SoundModulePlugin = class extends (_a = o3, _make_sound_dec = [n4([E.CLOSURE, E.NUMBER], E.PAIR)], _make_stereo_sound_dec = [n4([E.CLOSURE, E.CLOSURE, E.NUMBER], E.PAIR)], _get_wave_dec = [n4([E.PAIR], E.CLOSURE)], _get_left_wave_dec = [n4([E.PAIR], E.CLOSURE)], _get_right_wave_dec = [n4([E.PAIR], E.CLOSURE)], _get_duration_dec = [n4([E.PAIR], E.NUMBER)], _is_sound_dec = [n4([E.ANY], E.BOOLEAN)], _init_record_dec = [n4([], E.CONST_STRING)], _record_dec = [n4([E.NUMBER], E.CLOSURE)], _record_for_dec = [n4([E.NUMBER, E.NUMBER], E.CLOSURE)], _play_wave_dec = [n4([E.CLOSURE, E.NUMBER], E.PAIR)], _play_waves_dec = [n4([E.CLOSURE, E.CLOSURE, E.NUMBER], E.PAIR)], _play_dec = [n4([E.PAIR], E.PAIR)], _play_in_tab_dec = [n4([E.PAIR], E.PAIR)], _stop_dec = [n4([], E.VOID)], _noise_wave_dec = [n4([], E.CLOSURE)], _noise_sound_dec = [n4([E.NUMBER], E.PAIR)], _silence_wave_dec = [n4([], E.CLOSURE)], _silence_sound_dec = [n4([E.NUMBER], E.PAIR)], _sine_wave_dec = [n4([E.NUMBER], E.CLOSURE)], _sine_sound_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _square_wave_dec = [n4([E.NUMBER], E.CLOSURE)], _square_sound_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _triangle_wave_dec = [n4([E.NUMBER], E.CLOSURE)], _triangle_sound_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _sawtooth_wave_dec = [n4([E.NUMBER], E.CLOSURE)], _sawtooth_sound_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _consecutively_dec = [n4([E.LIST], E.PAIR)], _simultaneously_dec = [n4([E.LIST], E.PAIR)], _adsr_dec = [n4([E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER], E.CLOSURE)], _stacking_adsr_dec = [n4([E.CLOSURE, E.NUMBER, E.NUMBER, E.LIST], E.PAIR)], _phase_mod_dec = [n4([E.NUMBER, E.NUMBER, E.NUMBER], E.CLOSURE)], _squash_dec = [n4([E.PAIR], E.PAIR)], _pan_dec = [n4([E.NUMBER], E.CLOSURE)], _pan_mod_dec = [n4([E.PAIR], E.CLOSURE)], _bell_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _cello_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _piano_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _trombone_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _violin_dec = [n4([E.NUMBER, E.NUMBER], E.PAIR)], _a) {
    constructor(conduit, [soundChannel], evaluator, tabLoader) {
      if (!soundChannel) {
        throw new Error("Sound channel is required but was not provided.");
      }
      super(conduit, [soundChannel], evaluator);
      __runInitializers(_init, 5, this);
      this.id = "sound";
      this.exportedNames = ["adsr", "bell", "cello", "consecutively", "get_duration", "get_left_wave", "get_right_wave", "get_wave", "init_record", "is_sound", "make_sound", "make_stereo_sound", "noise_sound", "noise_wave", "pan", "pan_mod", "phase_mod", "piano", "play", "play_in_tab", "play_wave", "play_waves", "record", "record_for", "sawtooth_sound", "sawtooth_wave", "silence_sound", "silence_wave", "simultaneously", "sine_sound", "sine_wave", "square_sound", "square_wave", "squash", "stacking_adsr", "stop", "triangle_sound", "triangle_wave", "trombone", "violin"];
      this.__tabLoader = void 0;
      this.__tabLoaded = false;
      this.__tabLoader = tabLoader;
      setSoundIO(s4(soundChannel, {}));
    }
    __ensureTabLoaded() {
      if (this.__tabLoaded || this.__tabLoader === void 0) return;
      const tabName = this.__tabLoader.tabs.find(tab => tab === SOUND_TAB_NAME);
      if (tabName === void 0) {
        throw new Error("Sound tab is required but was not provided.");
      }
      this.__tabLoader.loadTab(tabName);
      this.__tabLoaded = true;
    }
    make_sound(wave, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, make_sound(closureToWave(this.evaluator, wave), duration.value));
      });
    }
    make_stereo_sound(left_wave, right_wave, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, make_stereo_sound(closureToWave(this.evaluator, left_wave), closureToWave(this.evaluator, right_wave), duration.value));
      });
    }
    get_wave(sound) {
      return __asyncGenerator(this, null, function* () {
        const internal = yield new __await(conductorToSound(this.evaluator, sound));
        return waveToConductorClosure(this.evaluator, get_wave(internal));
      });
    }
    get_left_wave(sound) {
      return __asyncGenerator(this, null, function* () {
        const internal = yield new __await(conductorToSound(this.evaluator, sound));
        return waveToConductorClosure(this.evaluator, get_left_wave(internal));
      });
    }
    get_right_wave(sound) {
      return __asyncGenerator(this, null, function* () {
        const internal = yield new __await(conductorToSound(this.evaluator, sound));
        return waveToConductorClosure(this.evaluator, get_right_wave(internal));
      });
    }
    get_duration(sound) {
      return __asyncGenerator(this, null, function* () {
        const internal = yield new __await(conductorToSound(this.evaluator, sound));
        return {
          type: E.NUMBER,
          value: get_duration(internal)
        };
      });
    }
    is_sound(value) {
      return __asyncGenerator(this, null, function* () {
        if (!value || !isPairLike(value)) {
          return {
            type: E.BOOLEAN,
            value: false
          };
        }
        try {
          const internal = yield new __await(conductorToSound(this.evaluator, value));
          return {
            type: E.BOOLEAN,
            value: is_sound(internal)
          };
        } catch (e6) {
          return {
            type: E.BOOLEAN,
            value: false
          };
        }
      });
    }
    init_record() {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        return {
          type: E.CONST_STRING,
          value: yield new __await(init_record())
        };
      });
    }
    record(buffer) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        const evaluator = this.evaluator;
        const stopFn = record(buffer.value);
        return evaluator.closure_make({
          returnType: E.CLOSURE,
          args: []
        }, function () {
          return __asyncGenerator(this, null, function* () {
            const soundPromise = stopFn();
            return soundPromiseToConductor(evaluator, soundPromise);
          });
        });
      });
    }
    record_for(duration, buffer) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        const soundPromise = record_for(duration.value, buffer.value);
        return soundPromiseToConductor(this.evaluator, soundPromise);
      });
    }
    play_wave(wave, duration) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        const result = yield* __yieldStar(play_wave(closureToWave(this.evaluator, wave), duration.value));
        return soundToConductor(this.evaluator, result);
      });
    }
    play_waves(left_wave, right_wave, duration) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        const result = yield* __yieldStar(play_waves(closureToWave(this.evaluator, left_wave), closureToWave(this.evaluator, right_wave), duration.value));
        return soundToConductor(this.evaluator, result);
      });
    }
    play(sound) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        const internal = yield new __await(conductorToSound(this.evaluator, sound));
        const result = yield* __yieldStar(play(internal));
        return soundToConductor(this.evaluator, result);
      });
    }
    play_in_tab(sound) {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        const internal = yield new __await(conductorToSound(this.evaluator, sound));
        const result = yield* __yieldStar(play_in_tab(internal));
        return soundToConductor(this.evaluator, result);
      });
    }
    stop() {
      return __asyncGenerator(this, null, function* () {
        this.__ensureTabLoaded();
        stop();
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    noise_wave() {
      return __asyncGenerator(this, null, function* () {
        return waveToConductorClosure(this.evaluator, noise_wave());
      });
    }
    noise_sound(duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, noise_sound(duration.value));
      });
    }
    silence_wave() {
      return __asyncGenerator(this, null, function* () {
        return waveToConductorClosure(this.evaluator, silence_wave());
      });
    }
    silence_sound(duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, silence_sound(duration.value));
      });
    }
    sine_wave(freq) {
      return __asyncGenerator(this, null, function* () {
        return waveToConductorClosure(this.evaluator, sine_wave(freq.value));
      });
    }
    sine_sound(freq, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, sine_sound(freq.value, duration.value));
      });
    }
    square_wave(freq) {
      return __asyncGenerator(this, null, function* () {
        return waveToConductorClosure(this.evaluator, square_wave(freq.value));
      });
    }
    square_sound(freq, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, square_sound(freq.value, duration.value));
      });
    }
    triangle_wave(freq) {
      return __asyncGenerator(this, null, function* () {
        return waveToConductorClosure(this.evaluator, triangle_wave(freq.value));
      });
    }
    triangle_sound(freq, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, triangle_sound(freq.value, duration.value));
      });
    }
    sawtooth_wave(freq) {
      return __asyncGenerator(this, null, function* () {
        return waveToConductorClosure(this.evaluator, sawtooth_wave(freq.value));
      });
    }
    sawtooth_sound(freq, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, sawtooth_sound(freq.value, duration.value));
      });
    }
    consecutively(sounds) {
      return __asyncGenerator(this, null, function* () {
        const internalSounds = yield new __await(conductorListToSounds(this.evaluator, sounds));
        return soundToConductor(this.evaluator, consecutively(internalSounds));
      });
    }
    simultaneously(sounds) {
      return __asyncGenerator(this, null, function* () {
        const internalSounds = yield new __await(conductorListToSounds(this.evaluator, sounds));
        return soundToConductor(this.evaluator, simultaneously(internalSounds));
      });
    }
    adsr(attack_ratio, decay_ratio, sustain_level, release_ratio) {
      return __asyncGenerator(this, null, function* () {
        const transformer = adsr(attack_ratio.value, decay_ratio.value, sustain_level.value, release_ratio.value);
        return transformerToConductor(this.evaluator, transformer);
      });
    }
    stacking_adsr(waveform, base_frequency, duration, envelopes) {
      return __asyncGenerator(this, null, function* () {
        const evaluator = this.evaluator;
        const envelopeElements = yield new __await(readListElements(evaluator, envelopes));
        const envelopeClosures = [];
        for (const envelope of envelopeElements) {
          if (envelope.type !== E.CLOSURE) {
            throw new n("stacking_adsr", "envelopes", "a list of functions", envelope.value);
          }
          envelopeClosures.push(envelope);
        }
        const harmonics = [];
        for (let i = 0; i < envelopeClosures.length; i += 1) {
          const harmonicTv = yield* __yieldStar(evaluator.closure_call_unchecked(waveform, [{
            type: E.NUMBER,
            value: base_frequency.value * (i + 1)
          }, {
            type: E.NUMBER,
            value: duration.value
          }]));
          const harmonic = yield new __await(conductorToSound(evaluator, harmonicTv));
          const harmonicSoundTv = yield new __await(soundToConductor(evaluator, harmonic));
          const shapedTv = yield* __yieldStar(evaluator.closure_call_unchecked(envelopeClosures[i], [harmonicSoundTv]));
          harmonics.push(yield new __await(conductorToSound(evaluator, shapedTv)));
        }
        return soundToConductor(evaluator, simultaneously(harmonics));
      });
    }
    phase_mod(freq, duration, amount) {
      return __asyncGenerator(this, null, function* () {
        const transformer = phase_mod(freq.value, duration.value, amount.value);
        return transformerToConductor(this.evaluator, transformer);
      });
    }
    squash(sound) {
      return __asyncGenerator(this, null, function* () {
        const internal = yield new __await(conductorToSound(this.evaluator, sound));
        return soundToConductor(this.evaluator, squash(internal));
      });
    }
    pan(amount) {
      return __asyncGenerator(this, null, function* () {
        return transformerToConductor(this.evaluator, pan(amount.value));
      });
    }
    pan_mod(modulator) {
      return __asyncGenerator(this, null, function* () {
        const internal = yield new __await(conductorToSound(this.evaluator, modulator));
        return transformerToConductor(this.evaluator, pan_mod(internal));
      });
    }
    bell(note, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, bell(note.value, duration.value));
      });
    }
    cello(note, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, cello(note.value, duration.value));
      });
    }
    piano(note, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, piano(note.value, duration.value));
      });
    }
    trombone(note, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, trombone(note.value, duration.value));
      });
    }
    violin(note, duration) {
      return __asyncGenerator(this, null, function* () {
        return soundToConductor(this.evaluator, violin(note.value, duration.value));
      });
    }
  };
  _init = __decoratorStart(_a);
  __decorateElement(_init, 1, "make_sound", _make_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "make_stereo_sound", _make_stereo_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "get_wave", _get_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "get_left_wave", _get_left_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "get_right_wave", _get_right_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "get_duration", _get_duration_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "is_sound", _is_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "init_record", _init_record_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "record", _record_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "record_for", _record_for_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "play_wave", _play_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "play_waves", _play_waves_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "play", _play_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "play_in_tab", _play_in_tab_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "stop", _stop_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "noise_wave", _noise_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "noise_sound", _noise_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "silence_wave", _silence_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "silence_sound", _silence_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "sine_wave", _sine_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "sine_sound", _sine_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "square_wave", _square_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "square_sound", _square_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "triangle_wave", _triangle_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "triangle_sound", _triangle_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "sawtooth_wave", _sawtooth_wave_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "sawtooth_sound", _sawtooth_sound_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "consecutively", _consecutively_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "simultaneously", _simultaneously_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "adsr", _adsr_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "stacking_adsr", _stacking_adsr_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "phase_mod", _phase_mod_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "squash", _squash_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "pan", _pan_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "pan_mod", _pan_mod_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "bell", _bell_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "cello", _cello_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "piano", _piano_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "trombone", _trombone_dec, SoundModulePlugin);
  __decorateElement(_init, 1, "violin", _violin_dec, SoundModulePlugin);
  __decoratorMetadata(_init, SoundModulePlugin);
  SoundModulePlugin.channelAttach = [SOUND_CHANNEL_ID];
  return __toCommonJS(index_exports);
};