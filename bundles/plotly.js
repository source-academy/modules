export default require => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __reflectGet = Reflect.get;
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
  var __spreadValues = (a4, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a4, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a4, prop, b[prop]);
    }
    return a4;
  };
  var __spreadProps = (a4, b) => __defProps(a4, __getOwnPropDescs(b));
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
  var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
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
    default: () => PlotlyModulePlugin
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
      var _a;
      if ("string" == typeof r4) return JSON.stringify(r4);
      if ("number" == typeof r4 || "boolean" == typeof r4) return String(r4);
      if (null === r4) return "null";
      if (void 0 === r4) return "undefined";
      if ("bigint" == typeof r4) return `${r4}n`;
      if ("symbol" == typeof r4) return r4.toString();
      if ("function" == typeof r4) return r4.name ? `function ${r4.name}` : "anonymous function";
      try {
        return (_a = JSON.stringify(r4)) != null ? _a : Object.prototype.toString.call(r4);
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
      var _a, _b, _c, _d;
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
            ((_b = (_a = c2[e6]) == null ? void 0 : _a[0]) == null ? void 0 : _b.call(_a, t5), delete c2[e6]);
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
    var _a, _b, _c;
    const sampleChannels = (_c = (_b = (_a = soundSamplerCache.get(evaluator)) === null || _a === void 0 ? void 0 : _a.get(leftClosure.value)) === null || _b === void 0 ? void 0 : _b.get(rightClosure.value)) === null || _c === void 0 ? void 0 : _c.get(sound.duration);
    return sampleChannels ? Object.assign(Object.assign({}, sound), {
      sampleChannels
    }) : sound;
  }
  var soundRecordCache = new WeakMap();
  function rememberSoundRecord(evaluator, pairId, record2) {
    let records = soundRecordCache.get(evaluator);
    if (!records) {
      records = new Map();
      soundRecordCache.set(evaluator, records);
    }
    records.set(pairId, record2);
  }
  function lookupSoundRecord(evaluator, pairId) {
    var _a;
    return (_a = soundRecordCache.get(evaluator)) === null || _a === void 0 ? void 0 : _a.get(pairId);
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
  var __awaiter = function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e6) {
          reject(e6);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e6) {
          reject(e6);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __await2 = function (v) {
    return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
  };
  var __asyncGenerator2 = function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return (i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () {
      return this;
    }, i);
    function awaitReturn(f2) {
      return function (v) {
        return Promise.resolve(v).then(f2, reject);
      };
    }
    function verb(n5, f2) {
      if (g[n5]) {
        i[n5] = function (v) {
          return new Promise(function (a4, b) {
            q.push([n5, v, a4, b]) > 1 || resume(n5, v);
          });
        };
        if (f2) i[n5] = f2(i[n5]);
      }
    }
    function resume(n5, v) {
      try {
        step(g[n5](v));
      } catch (e6) {
        settle(q[0][3], e6);
      }
    }
    function step(r3) {
      r3.value instanceof __await2 ? Promise.resolve(r3.value.v).then(fulfill, reject) : settle(q[0][2], r3);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f2, v) {
      if ((f2(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  };
  var __asyncValues = function (o4) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m2 = o4[Symbol.asyncIterator], i;
    return m2 ? m2.call(o4) : (o4 = typeof __values === "function" ? __values(o4) : o4[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
      return this;
    }, i);
    function verb(n5) {
      i[n5] = o4[n5] && (function (v) {
        return new Promise(function (resolve, reject) {
          (v = o4[n5](v), settle(resolve, reject, v.done, v.value));
        });
      });
    }
    function settle(resolve, reject, d2, v) {
      Promise.resolve(v).then(function (v2) {
        resolve({
          value: v2,
          done: d2
        });
      }, reject);
    }
  };
  var __asyncDelegator = function (o4) {
    var i, p2;
    return (i = {}, verb("next"), verb("throw", function (e6) {
      throw e6;
    }), verb("return"), i[Symbol.iterator] = function () {
      return this;
    }, i);
    function verb(n5, f2) {
      i[n5] = o4[n5] ? function (v) {
        return (p2 = !p2) ? {
          value: __await2(o4[n5](v)),
          done: false
        } : f2 ? f2(v) : v;
      } : f2;
    }
  };
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
    return __awaiter(this, void 0, void 0, function* () {
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
      return __asyncGenerator2(this, arguments, function* () {
        return yield __await2(fn(t5));
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
      return __asyncGenerator2(this, arguments, function* () {
        if (t5 >= duration) {
          return yield __await2(0);
        }
        return yield __await2(yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(wave(t5))))));
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
    return __asyncGenerator2(this, arguments, function* sampleWave_1() {
      const length = Math.ceil(FS * duration);
      const channel = new Float32Array(length);
      let prev_value = 0;
      const sync = wave.sync;
      for (let i = 0; i < length; i += 1) {
        const temp = smoothSample(sync ? sync(i / FS) : yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(wave(i / FS))))), prev_value);
        channel[i] = temp;
        prev_value = temp;
      }
      return yield __await2(channel);
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
    return __asyncGenerator2(this, arguments, function* sampleSound_1() {
      if (sound.sampleChannels) {
        return yield __await2(yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(sound.sampleChannels(sound.duration))))));
      }
      const left = yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(sampleWave(sound.leftWave, sound.duration)))));
      return yield __await2({
        left,
        right: sound.rightWave === sound.leftWave ? left : yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(sampleWave(sound.rightWave, sound.duration)))))
      });
    });
  }
  function interpolatedWave(samples, sampleRate) {
    return syncWave(t5 => {
      var _a, _b;
      const index = t5 * sampleRate;
      const lowerIndex = Math.floor(index);
      const upperIndex = lowerIndex + 1;
      const ratio = index - lowerIndex;
      const upper = (_a = samples[upperIndex]) !== null && _a !== void 0 ? _a : 0;
      const lower = (_b = samples[lowerIndex]) !== null && _b !== void 0 ? _b : 0;
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
    return __awaiter(this, void 0, void 0, function* () {
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
    const started = (() => __awaiter(this, void 0, void 0, function* () {
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
    const recordingDone = (() => __awaiter(this, void 0, void 0, function* () {
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
    return __asyncGenerator2(this, arguments, function* play_wave_1() {
      validateDuration("play_wave", duration);
      validateWave("play_wave", wave);
      return yield __await2(yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(play(make_sound(wave, duration)))))));
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
    return __asyncGenerator2(this, arguments, function* play_waves_1() {
      validateDuration("play_waves", duration);
      validateWave("play_waves", left_wave, "left");
      validateWave("play_waves", right_wave, "right");
      return yield __await2(yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(play(make_stereo_sound(left_wave, right_wave, duration)))))));
    });
  }
  function play(sound) {
    return __asyncGenerator2(this, arguments, function* play_1() {
      assertPlayableSound(play.name, sound);
      if (sound.duration === 0) {
        return yield __await2(sound);
      }
      yield __await2(io().notifyConstructing());
      const {left: leftSamples, right: rightSamples} = yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(sampleSound(sound)))));
      globalVars.activePlayCount += 1;
      const generation = playGeneration;
      void (() => __awaiter(this, void 0, void 0, function* () {
        try {
          yield io().playSamples(leftSamples, rightSamples, FS);
        } finally {
          if (generation === playGeneration) {
            globalVars.activePlayCount = Math.max(0, globalVars.activePlayCount - 1);
          }
        }
      }))();
      return yield __await2(sound);
    });
  }
  function play_in_tab(sound) {
    return __asyncGenerator2(this, arguments, function* play_in_tab_1() {
      assertPlayableSound(play_in_tab.name, sound);
      if (sound.duration === 0) {
        yield __await2(io().addZeroDurationPlayerToTab());
        return yield __await2(sound);
      }
      yield __await2(io().notifyConstructing());
      const {left: leftSamples, right: rightSamples} = yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(sampleSound(sound)))));
      yield __await2(io().addPlayerToTab(encodeWavDataUri(leftSamples, rightSamples, FS)));
      return yield __await2(sound);
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
        answer += Math.pow(-1, i) * Math.sin((2 * i + 1) * t5 * freq * Math.PI * 2) / Math.pow(2 * i + 1, 2);
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
      return __asyncGenerator2(this, arguments, function* () {
        let remaining = t5;
        for (let i = 0; i < sounds.length; i += 1) {
          if (remaining < sounds[i].duration) {
            return yield __await2(yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(waves[i](remaining))))));
          }
          remaining -= sounds[i].duration;
        }
        return yield __await2(0);
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
      return __asyncGenerator2(this, arguments, function* () {
        let sum = 0;
        for (let i = 0; i < sounds.length; i += 1) {
          if (t5 <= sounds[i].duration) {
            sum += yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(waves[i](t5)))));
          }
        }
        return yield __await2(sum / count);
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
      return __asyncGenerator2(this, arguments, function* () {
        return yield __await2(envelopeAt(x) * (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(wave(x)))))));
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
      return __asyncGenerator2(this, arguments, function* () {
        return yield __await2(Math.sin(2 * Math.PI * t5 * freq + amount * (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(modulatorWave(t5))))))));
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
      return __asyncGenerator2(this, arguments, function* () {
        return yield __await2(gain * (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(wave(t5)))))));
      });
    };
  }
  function make_stereo_sound_with_sampler(left_wave, right_wave, duration, sampleChannels) {
    return Object.assign(Object.assign({}, make_stereo_sound(left_wave, right_wave, duration)), {
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
        return __asyncGenerator2(this, arguments, function* () {
          return yield __await2(0.5 * ((yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(leftWave(t5)))))) + (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(rightWave(t5))))))));
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
    return __asyncGenerator2(this, arguments, function* samplePannedChannels_1() {
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
        const sample = sync ? sync(t5) : yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(wave(t5)))));
        const leftSample = smoothSample(leftGain * sample, prevLeft);
        const rightSample = smoothSample(rightGain * sample, prevRight);
        left[i] = leftSample;
        right[i] = rightSample;
        prevLeft = leftSample;
        prevRight = rightSample;
      }
      return yield __await2({
        left,
        right
      });
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
        return __asyncGenerator2(this, arguments, function* () {
          const output = yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(leftWave(t5)))));
          return yield __await2(Math.max(-1, Math.min(1, output + output)));
        });
      };
    }
    if (leftWave.sync && rightWave.sync) {
      const leftSync = leftWave.sync;
      const rightSync = rightWave.sync;
      return syncWave(t5 => Math.max(-1, Math.min(1, leftSync(t5) + rightSync(t5))));
    }
    return function (t5) {
      return __asyncGenerator2(this, arguments, function* () {
        const output = (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(leftWave(t5)))))) + (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(rightWave(t5))))));
        return yield __await2(Math.max(-1, Math.min(1, output)));
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
        return __asyncGenerator2(this, arguments, function* () {
          return yield __await2((1 - (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(amountWave(t5))))))) / 2 * (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(wave(t5)))))));
        });
      }, function (t5) {
        return __asyncGenerator2(this, arguments, function* () {
          return yield __await2((1 + (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(amountWave(t5))))))) / 2 * (yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(wave(t5)))))));
        });
      }, duration, duration2 => samplePanModChannels(wave, amountWave, duration2));
    };
  }
  function samplePanModChannels(wave, amountWave, duration) {
    return __asyncGenerator2(this, arguments, function* samplePanModChannels_1() {
      const length = Math.ceil(FS * duration);
      const left = new Float32Array(length);
      const right = new Float32Array(length);
      let prevLeft = 0;
      let prevRight = 0;
      const amountSync = amountWave.sync;
      const waveSync = wave.sync;
      for (let i = 0; i < length; i += 1) {
        const t5 = i / FS;
        const amount = amountSync ? amountSync(t5) : yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(amountWave(t5)))));
        const sample = waveSync ? waveSync(t5) : yield __await2(yield* __yieldStar(__asyncDelegator(__asyncValues(wave(t5)))));
        const leftSample = smoothSample((1 - amount) / 2 * sample, prevLeft);
        const rightSample = smoothSample((1 + amount) / 2 * sample, prevRight);
        left[i] = leftSample;
        right[i] = rightSample;
        prevLeft = leftSample;
        prevRight = rightSample;
      }
      return yield __await2({
        left,
        right
      });
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
  var __runInitializers = function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
  };
  var __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f2) {
      if (f2 !== void 0 && typeof f2 !== "function") throw new TypeError("Function expected");
      return f2;
    }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _2, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p2 in contextIn) context[p2] = p2 === "access" ? {} : contextIn[p2];
      for (var p2 in contextIn.access) context.access[p2] = contextIn.access[p2];
      context.addInitializer = function (f2) {
        if (done) throw new TypeError("Cannot add initializers after decoration has completed");
        extraInitializers.push(accept(f2 || null));
      };
      var result = (0, decorators[i])(kind === "accessor" ? {
        get: descriptor.get,
        set: descriptor.set
      } : descriptor[key], context);
      if (kind === "accessor") {
        if (result === void 0) continue;
        if (result === null || typeof result !== "object") throw new TypeError("Object expected");
        if (_2 = accept(result.get)) descriptor.get = _2;
        if (_2 = accept(result.set)) descriptor.set = _2;
        if (_2 = accept(result.init)) initializers.unshift(_2);
      } else if (_2 = accept(result)) {
        if (kind === "field") initializers.unshift(_2); else descriptor[key] = _2;
      }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
  };
  var __awaiter2 = function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e6) {
          reject(e6);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e6) {
          reject(e6);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __asyncValues2 = function (o4) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m2 = o4[Symbol.asyncIterator], i;
    return m2 ? m2.call(o4) : (o4 = typeof __values === "function" ? __values(o4) : o4[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
      return this;
    }, i);
    function verb(n5) {
      i[n5] = o4[n5] && (function (v) {
        return new Promise(function (resolve, reject) {
          (v = o4[n5](v), settle(resolve, reject, v.done, v.value));
        });
      });
    }
    function settle(resolve, reject, d2, v) {
      Promise.resolve(v).then(function (v2) {
        resolve({
          value: v2,
          done: d2
        });
      }, reject);
    }
  };
  var __await3 = function (v) {
    return this instanceof __await3 ? (this.v = v, this) : new __await3(v);
  };
  var __asyncDelegator2 = function (o4) {
    var i, p2;
    return (i = {}, verb("next"), verb("throw", function (e6) {
      throw e6;
    }), verb("return"), i[Symbol.iterator] = function () {
      return this;
    }, i);
    function verb(n5, f2) {
      i[n5] = o4[n5] ? function (v) {
        return (p2 = !p2) ? {
          value: __await3(o4[n5](v)),
          done: false
        } : f2 ? f2(v) : v;
      } : f2;
    }
  };
  var __asyncGenerator3 = function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return (i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () {
      return this;
    }, i);
    function awaitReturn(f2) {
      return function (v) {
        return Promise.resolve(v).then(f2, reject);
      };
    }
    function verb(n5, f2) {
      if (g[n5]) {
        i[n5] = function (v) {
          return new Promise(function (a4, b) {
            q.push([n5, v, a4, b]) > 1 || resume(n5, v);
          });
        };
        if (f2) i[n5] = f2(i[n5]);
      }
    }
    function resume(n5, v) {
      try {
        step(g[n5](v));
      } catch (e6) {
        settle(q[0][3], e6);
      }
    }
    function step(r3) {
      r3.value instanceof __await3 ? Promise.resolve(r3.value.v).then(fulfill, reject) : settle(q[0][2], r3);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f2, v) {
      if ((f2(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  };
  var waveDecodeCache = new WeakMap();
  var closureEncodeCache = new WeakMap();
  function closureToWave(evaluator, closure) {
    var _a;
    let decoded = waveDecodeCache.get(evaluator);
    if (!decoded) {
      decoded = new Map();
      waveDecodeCache.set(evaluator, decoded);
    }
    const cachedWave = decoded.get(closure.value);
    if (cachedWave) return cachedWave;
    const wave = function (t5) {
      return __asyncGenerator3(this, arguments, function* () {
        const result = yield __await3(yield* __yieldStar(__asyncDelegator2(__asyncValues2(evaluator.closure_call_unchecked(closure, [{
          type: E.NUMBER,
          value: t5
        }])))));
        if (result.type !== E.NUMBER) {
          throw new e2(`Expected a wave to return a number, got ${E[result.type]}`);
        }
        return yield __await3(result.value);
      });
    };
    const syncCall = (_a = evaluator.closure_call_sync) === null || _a === void 0 ? void 0 : _a.bind(evaluator);
    let probe;
    try {
      probe = syncCall === null || syncCall === void 0 ? void 0 : syncCall(closure, [{
        type: E.NUMBER,
        value: 0
      }]);
    } catch (_b) {
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
      return __asyncGenerator3(this, arguments, function* conductorWave_1() {
        return yield __await3({
          type: E.NUMBER,
          value: yield __await3(yield* __yieldStar(__asyncDelegator2(__asyncValues2(wave(t5.value)))))
        });
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
    return __awaiter2(this, void 0, void 0, function* () {
      const leftClosure = yield waveToConductorClosure(evaluator, sound.leftWave);
      const rightClosure = sound.rightWave === sound.leftWave ? leftClosure : yield waveToConductorClosure(evaluator, sound.rightWave);
      rememberSoundSampler(evaluator, sound, leftClosure, rightClosure);
      const wavesPair = yield evaluator.pair_make(leftClosure, rightClosure);
      const outer = yield evaluator.pair_make(wavesPair, {
        type: E.NUMBER,
        value: sound.duration
      });
      rememberSoundRecord(evaluator, outer.value, {
        leftClosure,
        rightClosure,
        duration: sound.duration
      });
      return outer;
    });
  }
  function isPairLike(value) {
    return value.type === E.PAIR || value.type === E.ARRAY;
  }
  function readListElements(evaluator, value) {
    return __awaiter2(this, void 0, void 0, function* () {
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
    return __awaiter2(this, void 0, void 0, function* () {
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
    return __awaiter2(this, void 0, void 0, function* () {
      const elements = yield readListElements(evaluator, value);
      const sounds = [];
      for (const element of elements) {
        sounds.push(yield conductorToSound(evaluator, element));
      }
      return sounds;
    });
  }
  function transformerToConductor(evaluator, transformer) {
    return __awaiter2(this, void 0, void 0, function* () {
      return evaluator.closure_make({
        returnType: E.PAIR,
        args: [E.PAIR]
      }, function (soundTv) {
        return __asyncGenerator3(this, arguments, function* () {
          const sound = yield __await3(conductorToSound(evaluator, soundTv));
          return yield __await3(soundToConductor(evaluator, transformer(sound)));
        });
      });
    });
  }
  function soundPromiseToConductor(evaluator, promise) {
    return __awaiter2(this, void 0, void 0, function* () {
      return evaluator.closure_make({
        returnType: E.PAIR,
        args: []
      }, function () {
        return __asyncGenerator3(this, arguments, function* () {
          return yield __await3(soundToConductor(evaluator, yield __await3(promise())));
        });
      });
    });
  }
  var SoundModulePlugin = (() => {
    var _a;
    let _classSuper = o3;
    let _instanceExtraInitializers = [];
    let _make_sound_decorators;
    let _make_stereo_sound_decorators;
    let _get_wave_decorators;
    let _get_left_wave_decorators;
    let _get_right_wave_decorators;
    let _get_duration_decorators;
    let _is_sound_decorators;
    let _init_record_decorators;
    let _record_decorators;
    let _record_for_decorators;
    let _play_wave_decorators;
    let _play_waves_decorators;
    let _play_decorators;
    let _play_in_tab_decorators;
    let _stop_decorators;
    let _noise_wave_decorators;
    let _noise_sound_decorators;
    let _silence_wave_decorators;
    let _silence_sound_decorators;
    let _sine_wave_decorators;
    let _sine_sound_decorators;
    let _square_wave_decorators;
    let _square_sound_decorators;
    let _triangle_wave_decorators;
    let _triangle_sound_decorators;
    let _sawtooth_wave_decorators;
    let _sawtooth_sound_decorators;
    let _consecutively_decorators;
    let _simultaneously_decorators;
    let _adsr_decorators;
    let _stacking_adsr_decorators;
    let _phase_mod_decorators;
    let _squash_decorators;
    let _pan_decorators;
    let _pan_mod_decorators;
    let _bell_decorators;
    let _cello_decorators;
    let _piano_decorators;
    let _trombone_decorators;
    let _violin_decorators;
    return (_a = class SoundModulePlugin extends _classSuper {
      constructor(conduit, [soundChannel], evaluator, tabLoader) {
        if (!soundChannel) {
          throw new Error("Sound channel is required but was not provided.");
        }
        super(conduit, [soundChannel], evaluator);
        this.id = (__runInitializers(this, _instanceExtraInitializers), "sound");
        this.exportedNames = ["adsr", "bell", "cello", "consecutively", "get_duration", "get_left_wave", "get_right_wave", "get_wave", "init_record", "is_sound", "make_sound", "make_stereo_sound", "noise_sound", "noise_wave", "pan", "pan_mod", "phase_mod", "piano", "play", "play_in_tab", "play_wave", "play_waves", "record", "record_for", "sawtooth_sound", "sawtooth_wave", "silence_sound", "silence_wave", "simultaneously", "sine_sound", "sine_wave", "square_sound", "square_wave", "squash", "stacking_adsr", "stop", "triangle_sound", "triangle_wave", "trombone", "violin"];
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
        return __asyncGenerator3(this, arguments, function* make_sound_1() {
          return yield __await3(soundToConductor(this.evaluator, make_sound(closureToWave(this.evaluator, wave), duration.value)));
        });
      }
      make_stereo_sound(left_wave, right_wave, duration) {
        return __asyncGenerator3(this, arguments, function* make_stereo_sound_1() {
          return yield __await3(soundToConductor(this.evaluator, make_stereo_sound(closureToWave(this.evaluator, left_wave), closureToWave(this.evaluator, right_wave), duration.value)));
        });
      }
      get_wave(sound) {
        return __asyncGenerator3(this, arguments, function* get_wave_1() {
          const internal = yield __await3(conductorToSound(this.evaluator, sound));
          return yield __await3(waveToConductorClosure(this.evaluator, get_wave(internal)));
        });
      }
      get_left_wave(sound) {
        return __asyncGenerator3(this, arguments, function* get_left_wave_1() {
          const internal = yield __await3(conductorToSound(this.evaluator, sound));
          return yield __await3(waveToConductorClosure(this.evaluator, get_left_wave(internal)));
        });
      }
      get_right_wave(sound) {
        return __asyncGenerator3(this, arguments, function* get_right_wave_1() {
          const internal = yield __await3(conductorToSound(this.evaluator, sound));
          return yield __await3(waveToConductorClosure(this.evaluator, get_right_wave(internal)));
        });
      }
      get_duration(sound) {
        return __asyncGenerator3(this, arguments, function* get_duration_1() {
          const internal = yield __await3(conductorToSound(this.evaluator, sound));
          return yield __await3({
            type: E.NUMBER,
            value: get_duration(internal)
          });
        });
      }
      is_sound(value) {
        return __asyncGenerator3(this, arguments, function* is_sound_1() {
          if (!value || !isPairLike(value)) {
            return yield __await3({
              type: E.BOOLEAN,
              value: false
            });
          }
          try {
            const internal = yield __await3(conductorToSound(this.evaluator, value));
            return yield __await3({
              type: E.BOOLEAN,
              value: is_sound(internal)
            });
          } catch (_b) {
            return yield __await3({
              type: E.BOOLEAN,
              value: false
            });
          }
        });
      }
      init_record() {
        return __asyncGenerator3(this, arguments, function* init_record_1() {
          this.__ensureTabLoaded();
          return yield __await3({
            type: E.CONST_STRING,
            value: yield __await3(init_record())
          });
        });
      }
      record(buffer) {
        return __asyncGenerator3(this, arguments, function* record_1() {
          this.__ensureTabLoaded();
          const evaluator = this.evaluator;
          const stopFn = record(buffer.value);
          return yield __await3(evaluator.closure_make({
            returnType: E.CLOSURE,
            args: []
          }, function () {
            return __asyncGenerator3(this, arguments, function* () {
              const soundPromise = stopFn();
              return yield __await3(soundPromiseToConductor(evaluator, soundPromise));
            });
          }));
        });
      }
      record_for(duration, buffer) {
        return __asyncGenerator3(this, arguments, function* record_for_1() {
          this.__ensureTabLoaded();
          const soundPromise = record_for(duration.value, buffer.value);
          return yield __await3(soundPromiseToConductor(this.evaluator, soundPromise));
        });
      }
      play_wave(wave, duration) {
        return __asyncGenerator3(this, arguments, function* play_wave_1() {
          this.__ensureTabLoaded();
          const result = yield __await3(yield* __yieldStar(__asyncDelegator2(__asyncValues2(play_wave(closureToWave(this.evaluator, wave), duration.value)))));
          return yield __await3(soundToConductor(this.evaluator, result));
        });
      }
      play_waves(left_wave, right_wave, duration) {
        return __asyncGenerator3(this, arguments, function* play_waves_1() {
          this.__ensureTabLoaded();
          const result = yield __await3(yield* __yieldStar(__asyncDelegator2(__asyncValues2(play_waves(closureToWave(this.evaluator, left_wave), closureToWave(this.evaluator, right_wave), duration.value)))));
          return yield __await3(soundToConductor(this.evaluator, result));
        });
      }
      play(sound) {
        return __asyncGenerator3(this, arguments, function* play_1() {
          this.__ensureTabLoaded();
          const internal = yield __await3(conductorToSound(this.evaluator, sound));
          const result = yield __await3(yield* __yieldStar(__asyncDelegator2(__asyncValues2(play(internal)))));
          return yield __await3(soundToConductor(this.evaluator, result));
        });
      }
      play_in_tab(sound) {
        return __asyncGenerator3(this, arguments, function* play_in_tab_1() {
          this.__ensureTabLoaded();
          const internal = yield __await3(conductorToSound(this.evaluator, sound));
          const result = yield __await3(yield* __yieldStar(__asyncDelegator2(__asyncValues2(play_in_tab(internal)))));
          return yield __await3(soundToConductor(this.evaluator, result));
        });
      }
      stop() {
        return __asyncGenerator3(this, arguments, function* stop_1() {
          this.__ensureTabLoaded();
          stop();
          return yield __await3({
            type: E.VOID,
            value: void 0
          });
        });
      }
      noise_wave() {
        return __asyncGenerator3(this, arguments, function* noise_wave_1() {
          return yield __await3(waveToConductorClosure(this.evaluator, noise_wave()));
        });
      }
      noise_sound(duration) {
        return __asyncGenerator3(this, arguments, function* noise_sound_1() {
          return yield __await3(soundToConductor(this.evaluator, noise_sound(duration.value)));
        });
      }
      silence_wave() {
        return __asyncGenerator3(this, arguments, function* silence_wave_1() {
          return yield __await3(waveToConductorClosure(this.evaluator, silence_wave()));
        });
      }
      silence_sound(duration) {
        return __asyncGenerator3(this, arguments, function* silence_sound_1() {
          return yield __await3(soundToConductor(this.evaluator, silence_sound(duration.value)));
        });
      }
      sine_wave(freq) {
        return __asyncGenerator3(this, arguments, function* sine_wave_1() {
          return yield __await3(waveToConductorClosure(this.evaluator, sine_wave(freq.value)));
        });
      }
      sine_sound(freq, duration) {
        return __asyncGenerator3(this, arguments, function* sine_sound_1() {
          return yield __await3(soundToConductor(this.evaluator, sine_sound(freq.value, duration.value)));
        });
      }
      square_wave(freq) {
        return __asyncGenerator3(this, arguments, function* square_wave_1() {
          return yield __await3(waveToConductorClosure(this.evaluator, square_wave(freq.value)));
        });
      }
      square_sound(freq, duration) {
        return __asyncGenerator3(this, arguments, function* square_sound_1() {
          return yield __await3(soundToConductor(this.evaluator, square_sound(freq.value, duration.value)));
        });
      }
      triangle_wave(freq) {
        return __asyncGenerator3(this, arguments, function* triangle_wave_1() {
          return yield __await3(waveToConductorClosure(this.evaluator, triangle_wave(freq.value)));
        });
      }
      triangle_sound(freq, duration) {
        return __asyncGenerator3(this, arguments, function* triangle_sound_1() {
          return yield __await3(soundToConductor(this.evaluator, triangle_sound(freq.value, duration.value)));
        });
      }
      sawtooth_wave(freq) {
        return __asyncGenerator3(this, arguments, function* sawtooth_wave_1() {
          return yield __await3(waveToConductorClosure(this.evaluator, sawtooth_wave(freq.value)));
        });
      }
      sawtooth_sound(freq, duration) {
        return __asyncGenerator3(this, arguments, function* sawtooth_sound_1() {
          return yield __await3(soundToConductor(this.evaluator, sawtooth_sound(freq.value, duration.value)));
        });
      }
      consecutively(sounds) {
        return __asyncGenerator3(this, arguments, function* consecutively_1() {
          const internalSounds = yield __await3(conductorListToSounds(this.evaluator, sounds));
          return yield __await3(soundToConductor(this.evaluator, consecutively(internalSounds)));
        });
      }
      simultaneously(sounds) {
        return __asyncGenerator3(this, arguments, function* simultaneously_1() {
          const internalSounds = yield __await3(conductorListToSounds(this.evaluator, sounds));
          return yield __await3(soundToConductor(this.evaluator, simultaneously(internalSounds)));
        });
      }
      adsr(attack_ratio, decay_ratio, sustain_level, release_ratio) {
        return __asyncGenerator3(this, arguments, function* adsr_1() {
          const transformer = adsr(attack_ratio.value, decay_ratio.value, sustain_level.value, release_ratio.value);
          return yield __await3(transformerToConductor(this.evaluator, transformer));
        });
      }
      stacking_adsr(waveform, base_frequency, duration, envelopes) {
        return __asyncGenerator3(this, arguments, function* stacking_adsr_1() {
          const evaluator = this.evaluator;
          const envelopeElements = yield __await3(readListElements(evaluator, envelopes));
          const envelopeClosures = [];
          for (const envelope of envelopeElements) {
            if (envelope.type !== E.CLOSURE) {
              throw new n("stacking_adsr", "envelopes", "a list of functions", envelope.value);
            }
            envelopeClosures.push(envelope);
          }
          const harmonics = [];
          for (let i = 0; i < envelopeClosures.length; i += 1) {
            const harmonicTv = yield __await3(yield* __yieldStar(__asyncDelegator2(__asyncValues2(evaluator.closure_call_unchecked(waveform, [{
              type: E.NUMBER,
              value: base_frequency.value * (i + 1)
            }, {
              type: E.NUMBER,
              value: duration.value
            }])))));
            const harmonic = yield __await3(conductorToSound(evaluator, harmonicTv));
            const harmonicSoundTv = yield __await3(soundToConductor(evaluator, harmonic));
            const shapedTv = yield __await3(yield* __yieldStar(__asyncDelegator2(__asyncValues2(evaluator.closure_call_unchecked(envelopeClosures[i], [harmonicSoundTv])))));
            harmonics.push(yield __await3(conductorToSound(evaluator, shapedTv)));
          }
          return yield __await3(soundToConductor(evaluator, simultaneously(harmonics)));
        });
      }
      phase_mod(freq, duration, amount) {
        return __asyncGenerator3(this, arguments, function* phase_mod_1() {
          const transformer = phase_mod(freq.value, duration.value, amount.value);
          return yield __await3(transformerToConductor(this.evaluator, transformer));
        });
      }
      squash(sound) {
        return __asyncGenerator3(this, arguments, function* squash_1() {
          const internal = yield __await3(conductorToSound(this.evaluator, sound));
          return yield __await3(soundToConductor(this.evaluator, squash(internal)));
        });
      }
      pan(amount) {
        return __asyncGenerator3(this, arguments, function* pan_1() {
          return yield __await3(transformerToConductor(this.evaluator, pan(amount.value)));
        });
      }
      pan_mod(modulator) {
        return __asyncGenerator3(this, arguments, function* pan_mod_1() {
          const internal = yield __await3(conductorToSound(this.evaluator, modulator));
          return yield __await3(transformerToConductor(this.evaluator, pan_mod(internal)));
        });
      }
      bell(note, duration) {
        return __asyncGenerator3(this, arguments, function* bell_1() {
          return yield __await3(soundToConductor(this.evaluator, bell(note.value, duration.value)));
        });
      }
      cello(note, duration) {
        return __asyncGenerator3(this, arguments, function* cello_1() {
          return yield __await3(soundToConductor(this.evaluator, cello(note.value, duration.value)));
        });
      }
      piano(note, duration) {
        return __asyncGenerator3(this, arguments, function* piano_1() {
          return yield __await3(soundToConductor(this.evaluator, piano(note.value, duration.value)));
        });
      }
      trombone(note, duration) {
        return __asyncGenerator3(this, arguments, function* trombone_1() {
          return yield __await3(soundToConductor(this.evaluator, trombone(note.value, duration.value)));
        });
      }
      violin(note, duration) {
        return __asyncGenerator3(this, arguments, function* violin_1() {
          return yield __await3(soundToConductor(this.evaluator, violin(note.value, duration.value)));
        });
      }
    }, (() => {
      var _b;
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
      _make_sound_decorators = [n4([E.CLOSURE, E.NUMBER], E.PAIR)];
      _make_stereo_sound_decorators = [n4([E.CLOSURE, E.CLOSURE, E.NUMBER], E.PAIR)];
      _get_wave_decorators = [n4([E.PAIR], E.CLOSURE)];
      _get_left_wave_decorators = [n4([E.PAIR], E.CLOSURE)];
      _get_right_wave_decorators = [n4([E.PAIR], E.CLOSURE)];
      _get_duration_decorators = [n4([E.PAIR], E.NUMBER)];
      _is_sound_decorators = [n4([E.ANY], E.BOOLEAN)];
      _init_record_decorators = [n4([], E.CONST_STRING)];
      _record_decorators = [n4([E.NUMBER], E.CLOSURE)];
      _record_for_decorators = [n4([E.NUMBER, E.NUMBER], E.CLOSURE)];
      _play_wave_decorators = [n4([E.CLOSURE, E.NUMBER], E.PAIR)];
      _play_waves_decorators = [n4([E.CLOSURE, E.CLOSURE, E.NUMBER], E.PAIR)];
      _play_decorators = [n4([E.PAIR], E.PAIR)];
      _play_in_tab_decorators = [n4([E.PAIR], E.PAIR)];
      _stop_decorators = [n4([], E.VOID)];
      _noise_wave_decorators = [n4([], E.CLOSURE)];
      _noise_sound_decorators = [n4([E.NUMBER], E.PAIR)];
      _silence_wave_decorators = [n4([], E.CLOSURE)];
      _silence_sound_decorators = [n4([E.NUMBER], E.PAIR)];
      _sine_wave_decorators = [n4([E.NUMBER], E.CLOSURE)];
      _sine_sound_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      _square_wave_decorators = [n4([E.NUMBER], E.CLOSURE)];
      _square_sound_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      _triangle_wave_decorators = [n4([E.NUMBER], E.CLOSURE)];
      _triangle_sound_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      _sawtooth_wave_decorators = [n4([E.NUMBER], E.CLOSURE)];
      _sawtooth_sound_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      _consecutively_decorators = [n4([E.LIST], E.PAIR)];
      _simultaneously_decorators = [n4([E.LIST], E.PAIR)];
      _adsr_decorators = [n4([E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER], E.CLOSURE)];
      _stacking_adsr_decorators = [n4([E.CLOSURE, E.NUMBER, E.NUMBER, E.LIST], E.PAIR)];
      _phase_mod_decorators = [n4([E.NUMBER, E.NUMBER, E.NUMBER], E.CLOSURE)];
      _squash_decorators = [n4([E.PAIR], E.PAIR)];
      _pan_decorators = [n4([E.NUMBER], E.CLOSURE)];
      _pan_mod_decorators = [n4([E.PAIR], E.CLOSURE)];
      _bell_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      _cello_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      _piano_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      _trombone_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      _violin_decorators = [n4([E.NUMBER, E.NUMBER], E.PAIR)];
      __esDecorate(_a, null, _make_sound_decorators, {
        kind: "method",
        name: "make_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("make_sound" in obj),
          get: obj => obj.make_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _make_stereo_sound_decorators, {
        kind: "method",
        name: "make_stereo_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("make_stereo_sound" in obj),
          get: obj => obj.make_stereo_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _get_wave_decorators, {
        kind: "method",
        name: "get_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("get_wave" in obj),
          get: obj => obj.get_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _get_left_wave_decorators, {
        kind: "method",
        name: "get_left_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("get_left_wave" in obj),
          get: obj => obj.get_left_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _get_right_wave_decorators, {
        kind: "method",
        name: "get_right_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("get_right_wave" in obj),
          get: obj => obj.get_right_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _get_duration_decorators, {
        kind: "method",
        name: "get_duration",
        static: false,
        private: false,
        access: {
          has: obj => ("get_duration" in obj),
          get: obj => obj.get_duration
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _is_sound_decorators, {
        kind: "method",
        name: "is_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("is_sound" in obj),
          get: obj => obj.is_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _init_record_decorators, {
        kind: "method",
        name: "init_record",
        static: false,
        private: false,
        access: {
          has: obj => ("init_record" in obj),
          get: obj => obj.init_record
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _record_decorators, {
        kind: "method",
        name: "record",
        static: false,
        private: false,
        access: {
          has: obj => ("record" in obj),
          get: obj => obj.record
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _record_for_decorators, {
        kind: "method",
        name: "record_for",
        static: false,
        private: false,
        access: {
          has: obj => ("record_for" in obj),
          get: obj => obj.record_for
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _play_wave_decorators, {
        kind: "method",
        name: "play_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("play_wave" in obj),
          get: obj => obj.play_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _play_waves_decorators, {
        kind: "method",
        name: "play_waves",
        static: false,
        private: false,
        access: {
          has: obj => ("play_waves" in obj),
          get: obj => obj.play_waves
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _play_decorators, {
        kind: "method",
        name: "play",
        static: false,
        private: false,
        access: {
          has: obj => ("play" in obj),
          get: obj => obj.play
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _play_in_tab_decorators, {
        kind: "method",
        name: "play_in_tab",
        static: false,
        private: false,
        access: {
          has: obj => ("play_in_tab" in obj),
          get: obj => obj.play_in_tab
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _stop_decorators, {
        kind: "method",
        name: "stop",
        static: false,
        private: false,
        access: {
          has: obj => ("stop" in obj),
          get: obj => obj.stop
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _noise_wave_decorators, {
        kind: "method",
        name: "noise_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("noise_wave" in obj),
          get: obj => obj.noise_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _noise_sound_decorators, {
        kind: "method",
        name: "noise_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("noise_sound" in obj),
          get: obj => obj.noise_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _silence_wave_decorators, {
        kind: "method",
        name: "silence_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("silence_wave" in obj),
          get: obj => obj.silence_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _silence_sound_decorators, {
        kind: "method",
        name: "silence_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("silence_sound" in obj),
          get: obj => obj.silence_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _sine_wave_decorators, {
        kind: "method",
        name: "sine_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("sine_wave" in obj),
          get: obj => obj.sine_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _sine_sound_decorators, {
        kind: "method",
        name: "sine_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("sine_sound" in obj),
          get: obj => obj.sine_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _square_wave_decorators, {
        kind: "method",
        name: "square_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("square_wave" in obj),
          get: obj => obj.square_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _square_sound_decorators, {
        kind: "method",
        name: "square_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("square_sound" in obj),
          get: obj => obj.square_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _triangle_wave_decorators, {
        kind: "method",
        name: "triangle_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("triangle_wave" in obj),
          get: obj => obj.triangle_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _triangle_sound_decorators, {
        kind: "method",
        name: "triangle_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("triangle_sound" in obj),
          get: obj => obj.triangle_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _sawtooth_wave_decorators, {
        kind: "method",
        name: "sawtooth_wave",
        static: false,
        private: false,
        access: {
          has: obj => ("sawtooth_wave" in obj),
          get: obj => obj.sawtooth_wave
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _sawtooth_sound_decorators, {
        kind: "method",
        name: "sawtooth_sound",
        static: false,
        private: false,
        access: {
          has: obj => ("sawtooth_sound" in obj),
          get: obj => obj.sawtooth_sound
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _consecutively_decorators, {
        kind: "method",
        name: "consecutively",
        static: false,
        private: false,
        access: {
          has: obj => ("consecutively" in obj),
          get: obj => obj.consecutively
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _simultaneously_decorators, {
        kind: "method",
        name: "simultaneously",
        static: false,
        private: false,
        access: {
          has: obj => ("simultaneously" in obj),
          get: obj => obj.simultaneously
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _adsr_decorators, {
        kind: "method",
        name: "adsr",
        static: false,
        private: false,
        access: {
          has: obj => ("adsr" in obj),
          get: obj => obj.adsr
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _stacking_adsr_decorators, {
        kind: "method",
        name: "stacking_adsr",
        static: false,
        private: false,
        access: {
          has: obj => ("stacking_adsr" in obj),
          get: obj => obj.stacking_adsr
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _phase_mod_decorators, {
        kind: "method",
        name: "phase_mod",
        static: false,
        private: false,
        access: {
          has: obj => ("phase_mod" in obj),
          get: obj => obj.phase_mod
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _squash_decorators, {
        kind: "method",
        name: "squash",
        static: false,
        private: false,
        access: {
          has: obj => ("squash" in obj),
          get: obj => obj.squash
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _pan_decorators, {
        kind: "method",
        name: "pan",
        static: false,
        private: false,
        access: {
          has: obj => ("pan" in obj),
          get: obj => obj.pan
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _pan_mod_decorators, {
        kind: "method",
        name: "pan_mod",
        static: false,
        private: false,
        access: {
          has: obj => ("pan_mod" in obj),
          get: obj => obj.pan_mod
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _bell_decorators, {
        kind: "method",
        name: "bell",
        static: false,
        private: false,
        access: {
          has: obj => ("bell" in obj),
          get: obj => obj.bell
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _cello_decorators, {
        kind: "method",
        name: "cello",
        static: false,
        private: false,
        access: {
          has: obj => ("cello" in obj),
          get: obj => obj.cello
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _piano_decorators, {
        kind: "method",
        name: "piano",
        static: false,
        private: false,
        access: {
          has: obj => ("piano" in obj),
          get: obj => obj.piano
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _trombone_decorators, {
        kind: "method",
        name: "trombone",
        static: false,
        private: false,
        access: {
          has: obj => ("trombone" in obj),
          get: obj => obj.trombone
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      __esDecorate(_a, null, _violin_decorators, {
        kind: "method",
        name: "violin",
        static: false,
        private: false,
        access: {
          has: obj => ("violin" in obj),
          get: obj => obj.violin
        },
        metadata: _metadata
      }, null, _instanceExtraInitializers);
      if (_metadata) Object.defineProperty(_a, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata
      });
    })(), _a.channelAttach = [SOUND_CHANNEL_ID], (() => {
      Object.assign(_a.prototype.get_wave, {
        sync(sound) {
          var _b;
          if (!isPairLike(sound)) return void 0;
          return (_b = lookupSoundRecord(this.evaluator, sound.value)) === null || _b === void 0 ? void 0 : _b.leftClosure;
        }
      });
      Object.assign(_a.prototype.get_left_wave, {
        sync(sound) {
          var _b;
          if (!isPairLike(sound)) return void 0;
          return (_b = lookupSoundRecord(this.evaluator, sound.value)) === null || _b === void 0 ? void 0 : _b.leftClosure;
        }
      });
      Object.assign(_a.prototype.get_right_wave, {
        sync(sound) {
          var _b;
          if (!isPairLike(sound)) return void 0;
          return (_b = lookupSoundRecord(this.evaluator, sound.value)) === null || _b === void 0 ? void 0 : _b.rightClosure;
        }
      });
      Object.assign(_a.prototype.get_duration, {
        sync(sound) {
          if (!isPairLike(sound)) return void 0;
          const record2 = lookupSoundRecord(this.evaluator, sound.value);
          return record2 ? {
            type: E.NUMBER,
            value: record2.duration
          } : void 0;
        }
      });
    })(), _a);
  })();
  function attachModuleMethod(clss, methodName, args, returnType) {
    const method = clss.prototype[methodName];
    if (method === void 0) {
      throw new Error(`Rune module method "${String(methodName)}" does not exist.`);
    }
    method.signature = {
      args,
      returnType
    };
  }
  var _CurvePlot = class _CurvePlot {
    constructor(data, layout) {
      this.data = data;
      this.layout = layout;
      this.toReplString = () => "<CurvePlot>";
      this.toSerialized = () => ({
        data: this.data,
        layout: this.layout
      });
    }
  };
  _CurvePlot.fromSerialized = serialized => {
    return new _CurvePlot(serialized.data, serialized.layout);
  };
  var CurvePlot = _CurvePlot;
  function isPoint(value) {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    const point = value;
    return typeof point.x === "number" && typeof point.y === "number" && typeof point.z === "number" && Array.isArray(point.color) && point.color.length === 4 && point.color.every(component => typeof component === "number");
  }
  function generatePlot(evaluator, type, numPoints, config, layout, is_colored, func) {
    return __asyncGenerator(this, null, function* () {
      const x_s = [];
      const y_s = [];
      const z_s = [];
      const color_s = [];
      for (let i = 0; i <= numPoints; i += 1) {
        const t5 = numPoints === 0 ? 0 : i / numPoints;
        const pointId = yield* __yieldStar(evaluator.closure_call(func, [{
          type: E.NUMBER,
          value: t5
        }], E.OPAQUE));
        const point = yield new __await(evaluator.opaque_get(pointId));
        if (!isPoint(point)) {
          throw new e2(`${generatePlot.name}: Curve must return a Point`);
        }
        x_s.push(point.x);
        y_s.push(point.y);
        z_s.push(point.z);
        if (is_colored) {
          color_s.push(`rgb(${Math.floor(point.color[0] * 255)},${Math.floor(point.color[1] * 255)},${Math.floor(point.color[2] * 255)})`);
        }
      }
      const plotlyData = __spreadValues({
        x: x_s,
        y: y_s,
        z: z_s,
        marker: __spreadValues({
          size: 2
        }, is_colored ? {
          color: color_s
        } : {})
      }, is_colored ? {
        line: {
          color: color_s
        }
      } : {});
      return new CurvePlot(__spreadProps(__spreadValues(__spreadValues({}, plotlyData), config), {
        type
      }), layout);
    });
  }
  function draw_new_plot(evaluator, data) {
    return __asyncGenerator(this, null, function* () {
      const plotlyData = {};
      yield new __await(add_fields_to_data(evaluator, plotlyData, data));
      return plotlyData;
    });
  }
  function serialisePlotlyData(_0, _1) {
    return __async(this, arguments, function* (evaluator, data, map = new Map()) {
      switch (data.type) {
        case E.NUMBER:
        case E.INTEGER:
        case E.CONST_STRING:
        case E.BOOLEAN:
        case E.EMPTY_LIST:
          return data.value;
        case E.ARRAY:
          {
            if (map.has(data.value)) {
              return map.get(data.value);
            }
            const array = Array.from({
              length: yield evaluator.array_length(data)
            }, () => void 0);
            map.set(data.value, array);
            yield Promise.all(array.map((_2, i) => __async(null, null, function* () {
              const element = yield evaluator.array_get(data, i);
              array[i] = yield serialisePlotlyData(evaluator, element, map);
            })));
            return array;
          }
        case E.PAIR:
          {
            if (map.has(data.value)) {
              return map.get(data.value);
            }
            const pair = [void 0, void 0];
            map.set(data.value, pair);
            const head = yield evaluator.pair_head(data);
            const tail = yield evaluator.pair_tail(data);
            pair[0] = yield serialisePlotlyData(evaluator, head, map);
            pair[1] = yield serialisePlotlyData(evaluator, tail, map);
            return pair;
          }
        case E.OPAQUE:
          return yield evaluator.opaque_get(data);
        case E.VOID:
        case E.CLOSURE:
        default:
          throw new e2(`${serialisePlotlyData.name}: Cannot serialize data of type ${data.type}`);
      }
    });
  }
  function add_fields_to_data(handler, convertedData, data) {
    return __async(this, null, function* () {
      let currentData = data;
      while (currentData.type === E.PAIR || currentData.type === E.ARRAY) {
        const entry = currentData.type === E.ARRAY ? yield handler.array_get(currentData, 0) : yield handler.pair_head(currentData);
        if (entry.type !== E.PAIR && !(entry.type === E.ARRAY && (yield handler.array_length(entry)) === 2)) {
          throw new e2(`${add_fields_to_data.name}: Expected list of pairs, got type ${entry.type} with value ${String(entry.value)}`);
        }
        const field = entry.type === E.ARRAY ? yield handler.array_get(entry, 0) : yield handler.pair_head(entry);
        if (field.type !== E.CONST_STRING) {
          throw new e2(`${add_fields_to_data.name}: Expected head of pair to be string, got type ${field.type} with value ${String(field.value)}`);
        }
        const value = entry.type === E.ARRAY ? yield handler.array_get(entry, 1) : yield handler.pair_tail(entry);
        convertedData[field.value] = yield serialisePlotlyData(handler, value);
        currentData = currentData.type === E.ARRAY ? yield handler.array_get(currentData, 1) : yield handler.pair_tail(currentData);
      }
      if (currentData.type !== E.EMPTY_LIST) {
        throw new e2(`${add_fields_to_data.name}: Expected list of pairs, got type ${currentData.type} with value ${String(currentData.value)}`);
      }
    });
  }
  function createPlotFunction(evaluator, display, type, config, layout, is_colored = false) {
    return __async(this, null, function* () {
      return function (num) {
        return __asyncGenerator(this, null, function* () {
          const func = function (curveFunction) {
            return __asyncGenerator(this, null, function* () {
              const plotDrawn = yield* __yieldStar(generatePlot(evaluator, type, num, config, layout, is_colored, curveFunction));
              yield new __await(display(plotDrawn.toSerialized()));
              return yield new __await(evaluator.opaque_make(plotDrawn));
            });
          };
          return yield new __await(evaluator.closure_make({
            args: [E.CLOSURE],
            returnType: E.OPAQUE
          }, func));
        });
      };
    });
  }
  var draw_connected_2d = (evaluator, display) => createPlotFunction(evaluator, display, "scattergl", {
    mode: "lines"
  }, {
    xaxis: {
      visible: true
    },
    yaxis: {
      visible: true,
      scaleanchor: "x"
    }
  }, true);
  var draw_connected_3d = (evaluator, display) => createPlotFunction(evaluator, display, "scatter3d", {
    mode: "lines"
  }, {}, true);
  var draw_points_2d = (evaluator, display) => createPlotFunction(evaluator, display, "scatter", {
    mode: "markers"
  }, {
    xaxis: {
      visible: true
    },
    yaxis: {
      visible: true,
      scaleanchor: "x"
    }
  }, true);
  var draw_points_3d = (evaluator, display) => createPlotFunction(evaluator, display, "scatter3d", {
    mode: "markers"
  }, {});
  function draw_sound_2d(sound, display) {
    return __async(this, null, function* () {
      const FS2 = 44100;
      if (!is_sound(sound)) {
        throw new e2(`${draw_sound_2d.name}: argument is not a sound`);
      } else if (get_duration(sound) < 0) {
        throw new e2(`${draw_sound_2d.name}: duration of sound is negative`);
      } else {
        const channel = [];
        const time_stamps = [];
        const len = Math.ceil(FS2 * get_duration(sound));
        const wave = get_wave(sound);
        for (let i = 0; i < len; i += 1) {
          time_stamps[i] = i / FS2;
          const generator = wave(i / FS2);
          let next = yield generator.next();
          while (!next.done) {
            next = yield generator.next();
          }
          channel[i] = next.value;
        }
        const x_s = [];
        const y_s = [];
        for (let i = 0; i < channel.length; i += 1) {
          x_s.push(time_stamps[i]);
          y_s.push(channel[i]);
        }
        const plotlyData = {
          x: x_s,
          y: y_s,
          type: "scattergl",
          mode: "lines",
          line: {
            width: 0.5
          }
        };
        const plot = new CurvePlot(plotlyData, {
          xaxis: {
            type: "linear",
            title: {
              text: "Time"
            },
            anchor: "y",
            position: 0,
            rangeslider: {
              visible: true
            }
          },
          yaxis: {
            type: "linear",
            visible: false
          },
          bargap: 0.2,
          barmode: "stack"
        });
        yield display(plot.toSerialized());
      }
    });
  }
  var PLOTLY_CHANNEL_ID = "sourceacademy-plotly-channel";
  var PLOTLY_RUNNER_ID = "plotly-runner";
  var _PlotlyModulePlugin = class _PlotlyModulePlugin extends o3 {
    constructor(conduit, [plotlyChannel], evaluator, tabLoader) {
      super(conduit, [plotlyChannel], evaluator);
      this.id = PLOTLY_RUNNER_ID;
      this.exportedNames = ["new_plot", "draw_connected_2d", "draw_connected_3d", "draw_points_2d", "draw_points_3d", "draw_sound_2d"];
      this.__displayed = [];
      this.__tabLoaded = false;
      if (!plotlyChannel) {
        throw new e2("Plotly channel is required but was not provided.");
      }
      this.__plotlyChannel = plotlyChannel;
      this.__tabLoader = tabLoader;
      this.__plotlyChannel.subscribe(message => {
        if (message.type === "request") {
          this.__displayed.forEach(displayedMessage => this.__plotlyChannel.send(displayedMessage));
          this.__displayed = [];
        }
      });
    }
    initialise() {
      return __async(this, null, function* () {
        this.draw_connected_2d_cache = yield draw_connected_2d(this.evaluator, this.__display.bind(this));
        this.draw_connected_3d_cache = yield draw_connected_3d(this.evaluator, this.__display.bind(this));
        this.draw_points_2d_cache = yield draw_points_2d(this.evaluator, this.__display.bind(this));
        this.draw_points_3d_cache = yield draw_points_3d(this.evaluator, this.__display.bind(this));
        yield __superGet(_PlotlyModulePlugin.prototype, this, "initialise").call(this);
      });
    }
    __loadPlotlyTab() {
      return __async(this, null, function* () {
        if (this.__tabLoaded || this.__tabLoader === void 0) return true;
        const tabName = this.__tabLoader.tabs[0];
        if (tabName === void 0) return true;
        yield this.__tabLoader.loadTab(tabName);
        this.__tabLoaded = true;
        return false;
      });
    }
    __display(message) {
      return __async(this, null, function* () {
        const renderMessage = __spreadValues({
          type: "render"
        }, message);
        if (yield this.__loadPlotlyTab()) {
          this.__plotlyChannel.send(renderMessage);
        } else {
          this.__displayed.push(renderMessage);
        }
      });
    }
    new_plot(data) {
      return __asyncGenerator(this, null, function* () {
        const plotlyData = yield* __yieldStar(draw_new_plot(this.evaluator, data));
        yield new __await(this.__display({
          data: plotlyData
        }));
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
    draw_connected_2d(num) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(this.draw_connected_2d_cache(num.value));
      });
    }
    draw_connected_3d(num) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(this.draw_connected_3d_cache(num.value));
      });
    }
    draw_points_2d(num) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(this.draw_points_2d_cache(num.value));
      });
    }
    draw_points_3d(num) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(this.draw_points_3d_cache(num.value));
      });
    }
    draw_sound_2d(sound) {
      return __asyncGenerator(this, null, function* () {
        const soundValue = yield new __await(conductorToSound(this.evaluator, sound));
        yield new __await(draw_sound_2d(soundValue, this.__display.bind(this)));
        return {
          type: E.VOID,
          value: void 0
        };
      });
    }
  };
  _PlotlyModulePlugin.channelAttach = [PLOTLY_CHANNEL_ID];
  var PlotlyModulePlugin = _PlotlyModulePlugin;
  attachModuleMethod(PlotlyModulePlugin, "new_plot", [E.LIST], E.VOID);
  attachModuleMethod(PlotlyModulePlugin, "draw_connected_2d", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(PlotlyModulePlugin, "draw_connected_3d", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(PlotlyModulePlugin, "draw_points_2d", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(PlotlyModulePlugin, "draw_points_3d", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(PlotlyModulePlugin, "draw_sound_2d", [E.PAIR], E.VOID);
  return __toCommonJS(index_exports);
};