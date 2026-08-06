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
  var __spreadValues = (a3, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a3, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a3, prop, b[prop]);
    }
    return a3;
  };
  var __spreadProps = (a3, b) => __defProps(a3, __getOwnPropDescs(b));
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
        } catch (e5) {
          reject(e5);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e5) {
          reject(e5);
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
        })).catch(e5 => resume("throw", e5, yes, no));
      } catch (e5) {
        no(e5);
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
    default: () => RuneModulePlugin
  });
  var _;
  !(function (_2) {
    (_2.UNKNOWN = "__unknown", _2.INTERNAL = "__internal", _2.EVALUATOR = "__evaluator", _2.EVALUATOR_SYNTAX = "__evaluator_syntax", _2.EVALUATOR_TYPE = "__evaluator_type", _2.EVALUATOR_RUNTIME = "__evaluator_runtime");
  })(_ || (_ = {}));
  var o = class extends Error {
    constructor(r2) {
      super(r2);
      __publicField(this, "name", "ConductorError");
      __publicField(this, "errorType", _.UNKNOWN);
    }
  };
  var s = class extends o {
    constructor(r2) {
      super(r2);
      __publicField(this, "name", "ConductorInternalError");
      __publicField(this, "errorType", _.INTERNAL);
    }
  };
  var s2 = class extends o {
    constructor(r2, o4, s5, e5) {
      super(`${void 0 !== o4 ? `${e5 ? e5 + ":" : ""}${o4}${void 0 !== s5 ? ":" + s5 : ""}: ` : ""}${r2}`);
      __publicField(this, "name", "EvaluatorError");
      __publicField(this, "errorType", _.EVALUATOR);
      __publicField(this, "rawMessage");
      __publicField(this, "line");
      __publicField(this, "column");
      __publicField(this, "fileName");
      (this.rawMessage = r2, this.line = o4, this.column = s5, this.fileName = e5);
    }
  };
  function e(r2) {
    const t4 = (function (r3) {
      var _a;
      if ("string" == typeof r3) return JSON.stringify(r3);
      if ("number" == typeof r3 || "boolean" == typeof r3) return String(r3);
      if (null === r3) return "null";
      if (void 0 === r3) return "undefined";
      if ("bigint" == typeof r3) return `${r3}n`;
      if ("symbol" == typeof r3) return r3.toString();
      if ("function" == typeof r3) return r3.name ? `function ${r3.name}` : "anonymous function";
      try {
        return (_a = JSON.stringify(r3)) != null ? _a : Object.prototype.toString.call(r3);
      } catch (e5) {
        try {
          return String(r3);
        } catch (e6) {
          return Object.prototype.toString.call(r3);
        }
      }
    })(r2);
    return t4.length > 100 ? `${t4.slice(0, 100)}...` : t4;
  }
  var n = class extends s2 {
    constructor(r2, t4, n3, o4, u3, a3, i) {
      super(`${r2}: Expected ${n3}${t4 ? ` for ${t4}` : ""}, got ${e(o4)}.`, u3, a3, i);
      __publicField(this, "name", "EvaluatorParameterTypeError");
      __publicField(this, "errorType", _.EVALUATOR_TYPE);
      __publicField(this, "funcName");
      __publicField(this, "paramName");
      __publicField(this, "expected");
      __publicField(this, "actual");
      (this.funcName = r2, this.paramName = t4, this.expected = n3, this.actual = o4);
    }
  };
  var u = class extends n {
    constructor(r2, t4, e5, n3, o4, u3, a3) {
      super(e5, n3, (function (r3) {
        if ("string" == typeof r3) return r3;
        const {min: t5, max: e6, integer: n4 = true} = r3, o5 = n4 ? "integer" : "number";
        return void 0 !== t5 && void 0 !== e6 ? `${o5} \u2208 [${t5}, ${e6}]` : void 0 !== t5 ? `${o5} \u2265 ${t5}` : void 0 !== e6 ? `${o5} \u2264 ${e6}` : o5;
      })(t4), r2, o4, u3, a3);
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
  function p(r2, o4, t4, n3 = true) {
    return "number" == typeof r2 && !Number.isNaN(r2) && (!(n3 && !Number.isInteger(r2)) && (!(void 0 !== o4 && r2 < o4) && !(void 0 !== t4 && r2 > t4)));
  }
  function l(o4, t4, n3, e5, i = true, u3) {
    if (!p(o4, n3, e5, i)) throw new u(o4, {
      min: n3,
      max: e5,
      integer: i
    }, t4, u3);
  }
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  var o3 = class {
    constructor(t4, o4, s5) {
      __publicField(this, "exports", []);
      __publicField(this, "exportedNames", []);
      __publicField(this, "evaluator");
      this.evaluator = s5;
    }
    initialise() {
      return __async(this, null, function* () {
        for (const o4 of this.exportedNames) {
          const s5 = this[o4];
          if (!s5.signature || "function" != typeof s5 || "string" != typeof o4) throw new s(`'${String(o4)}' is not an exportable method`);
          const r2 = s5.bind(this);
          (r2.signature = s5.signature, s5.sync && (r2.sync = s5.sync.bind(this)));
          const i = yield this.evaluator.closure_make(s5.signature, r2);
          this.exports.push({
            symbol: o4,
            value: i,
            signature: s5.signature
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
  var a2;
  !(function (a3) {
    (a3[a3.HELLO = 0] = "HELLO", a3[a3.ABORT = 1] = "ABORT", a3[a3.ENTRY = 2] = "ENTRY");
  })(a2 || (a2 = {}));
  var N;
  !(function (N2) {
    (N2[N2.ONLINE = 0] = "ONLINE", N2[N2.EVAL_READY = 1] = "EVAL_READY", N2[N2.RUNNING = 2] = "RUNNING", N2[N2.WAITING = 3] = "WAITING", N2[N2.BREAKPOINT = 4] = "BREAKPOINT", N2[N2.STOPPED = 5] = "STOPPED", N2[N2.ERROR = 6] = "ERROR");
  })(N || (N = {}));
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
  function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function clamp(value, bound1, bound2) {
    if (bound2 == null) return Math.min(value, bound1);
    return Math.min(Math.max(value, bound1), bound2);
  }
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var RANDOM = Math.random;
  function round(a3) {
    if (a3 >= 0) return Math.round(a3);
    return a3 % 0.5 === 0 ? Math.floor(a3) : Math.round(a3);
  }
  var degree = Math.PI / 180;
  var radian = 180 / Math.PI;
  var mat4_exports = {};
  __export(mat4_exports, {
    add: () => add,
    adjoint: () => adjoint,
    clone: () => clone,
    copy: () => copy,
    create: () => create,
    decompose: () => decompose,
    determinant: () => determinant,
    equals: () => equals,
    exactEquals: () => exactEquals,
    frob: () => frob,
    fromQuat: () => fromQuat,
    fromQuat2: () => fromQuat2,
    fromRotation: () => fromRotation,
    fromRotationTranslation: () => fromRotationTranslation,
    fromRotationTranslationScale: () => fromRotationTranslationScale,
    fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
    fromScaling: () => fromScaling,
    fromTranslation: () => fromTranslation,
    fromValues: () => fromValues,
    fromXRotation: () => fromXRotation,
    fromYRotation: () => fromYRotation,
    fromZRotation: () => fromZRotation,
    frustum: () => frustum,
    getRotation: () => getRotation,
    getScaling: () => getScaling,
    getTranslation: () => getTranslation,
    identity: () => identity,
    invert: () => invert,
    lookAt: () => lookAt,
    mul: () => mul,
    multiply: () => multiply,
    multiplyScalar: () => multiplyScalar,
    multiplyScalarAndAdd: () => multiplyScalarAndAdd,
    ortho: () => ortho,
    orthoNO: () => orthoNO,
    orthoZO: () => orthoZO,
    perspective: () => perspective,
    perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
    perspectiveNO: () => perspectiveNO,
    perspectiveZO: () => perspectiveZO,
    rotate: () => rotate,
    rotateX: () => rotateX,
    rotateY: () => rotateY,
    rotateZ: () => rotateZ,
    scale: () => scale,
    set: () => set,
    str: () => str,
    sub: () => sub,
    subtract: () => subtract,
    targetTo: () => targetTo,
    translate: () => translate,
    transpose: () => transpose
  });
  function create() {
    var out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  function clone(a3) {
    var out = new ARRAY_TYPE(16);
    out[0] = a3[0];
    out[1] = a3[1];
    out[2] = a3[2];
    out[3] = a3[3];
    out[4] = a3[4];
    out[5] = a3[5];
    out[6] = a3[6];
    out[7] = a3[7];
    out[8] = a3[8];
    out[9] = a3[9];
    out[10] = a3[10];
    out[11] = a3[11];
    out[12] = a3[12];
    out[13] = a3[13];
    out[14] = a3[14];
    out[15] = a3[15];
    return out;
  }
  function copy(out, a3) {
    out[0] = a3[0];
    out[1] = a3[1];
    out[2] = a3[2];
    out[3] = a3[3];
    out[4] = a3[4];
    out[5] = a3[5];
    out[6] = a3[6];
    out[7] = a3[7];
    out[8] = a3[8];
    out[9] = a3[9];
    out[10] = a3[10];
    out[11] = a3[11];
    out[12] = a3[12];
    out[13] = a3[13];
    out[14] = a3[14];
    out[15] = a3[15];
    return out;
  }
  function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function transpose(out, a3) {
    if (out === a3) {
      var a01 = a3[1], a02 = a3[2], a03 = a3[3];
      var a12 = a3[6], a13 = a3[7];
      var a23 = a3[11];
      out[1] = a3[4];
      out[2] = a3[8];
      out[3] = a3[12];
      out[4] = a01;
      out[6] = a3[9];
      out[7] = a3[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a3[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a3[0];
      out[1] = a3[4];
      out[2] = a3[8];
      out[3] = a3[12];
      out[4] = a3[1];
      out[5] = a3[5];
      out[6] = a3[9];
      out[7] = a3[13];
      out[8] = a3[2];
      out[9] = a3[6];
      out[10] = a3[10];
      out[11] = a3[14];
      out[12] = a3[3];
      out[13] = a3[7];
      out[14] = a3[11];
      out[15] = a3[15];
    }
    return out;
  }
  function invert(out, a3) {
    var a00 = a3[0], a01 = a3[1], a02 = a3[2], a03 = a3[3];
    var a10 = a3[4], a11 = a3[5], a12 = a3[6], a13 = a3[7];
    var a20 = a3[8], a21 = a3[9], a22 = a3[10], a23 = a3[11];
    var a30 = a3[12], a31 = a3[13], a32 = a3[14], a33 = a3[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function adjoint(out, a3) {
    var a00 = a3[0], a01 = a3[1], a02 = a3[2], a03 = a3[3];
    var a10 = a3[4], a11 = a3[5], a12 = a3[6], a13 = a3[7];
    var a20 = a3[8], a21 = a3[9], a22 = a3[10], a23 = a3[11];
    var a30 = a3[12], a31 = a3[13], a32 = a3[14], a33 = a3[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    out[0] = a11 * b11 - a12 * b10 + a13 * b09;
    out[1] = a02 * b10 - a01 * b11 - a03 * b09;
    out[2] = a31 * b05 - a32 * b04 + a33 * b03;
    out[3] = a22 * b04 - a21 * b05 - a23 * b03;
    out[4] = a12 * b08 - a10 * b11 - a13 * b07;
    out[5] = a00 * b11 - a02 * b08 + a03 * b07;
    out[6] = a32 * b02 - a30 * b05 - a33 * b01;
    out[7] = a20 * b05 - a22 * b02 + a23 * b01;
    out[8] = a10 * b10 - a11 * b08 + a13 * b06;
    out[9] = a01 * b08 - a00 * b10 - a03 * b06;
    out[10] = a30 * b04 - a31 * b02 + a33 * b00;
    out[11] = a21 * b02 - a20 * b04 - a23 * b00;
    out[12] = a11 * b07 - a10 * b09 - a12 * b06;
    out[13] = a00 * b09 - a01 * b07 + a02 * b06;
    out[14] = a31 * b01 - a30 * b03 - a32 * b00;
    out[15] = a20 * b03 - a21 * b01 + a22 * b00;
    return out;
  }
  function determinant(a3) {
    var a00 = a3[0], a01 = a3[1], a02 = a3[2], a03 = a3[3];
    var a10 = a3[4], a11 = a3[5], a12 = a3[6], a13 = a3[7];
    var a20 = a3[8], a21 = a3[9], a22 = a3[10], a23 = a3[11];
    var a30 = a3[12], a31 = a3[13], a32 = a3[14], a33 = a3[15];
    var b0 = a00 * a11 - a01 * a10;
    var b1 = a00 * a12 - a02 * a10;
    var b2 = a01 * a12 - a02 * a11;
    var b3 = a20 * a31 - a21 * a30;
    var b4 = a20 * a32 - a22 * a30;
    var b5 = a21 * a32 - a22 * a31;
    var b6 = a00 * b5 - a01 * b4 + a02 * b3;
    var b7 = a10 * b5 - a11 * b4 + a12 * b3;
    var b8 = a20 * b2 - a21 * b1 + a22 * b0;
    var b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  function multiply(out, a3, b) {
    var a00 = a3[0], a01 = a3[1], a02 = a3[2], a03 = a3[3];
    var a10 = a3[4], a11 = a3[5], a12 = a3[6], a13 = a3[7];
    var a20 = a3[8], a21 = a3[9], a22 = a3[10], a23 = a3[11];
    var a30 = a3[12], a31 = a3[13], a32 = a3[14], a33 = a3[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a3, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a3 === out) {
      out[12] = a3[0] * x + a3[4] * y + a3[8] * z + a3[12];
      out[13] = a3[1] * x + a3[5] * y + a3[9] * z + a3[13];
      out[14] = a3[2] * x + a3[6] * y + a3[10] * z + a3[14];
      out[15] = a3[3] * x + a3[7] * y + a3[11] * z + a3[15];
    } else {
      a00 = a3[0];
      a01 = a3[1];
      a02 = a3[2];
      a03 = a3[3];
      a10 = a3[4];
      a11 = a3[5];
      a12 = a3[6];
      a13 = a3[7];
      a20 = a3[8];
      a21 = a3[9];
      a22 = a3[10];
      a23 = a3[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a3[12];
      out[13] = a01 * x + a11 * y + a21 * z + a3[13];
      out[14] = a02 * x + a12 * y + a22 * z + a3[14];
      out[15] = a03 * x + a13 * y + a23 * z + a3[15];
    }
    return out;
  }
  function scale(out, a3, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a3[0] * x;
    out[1] = a3[1] * x;
    out[2] = a3[2] * x;
    out[3] = a3[3] * x;
    out[4] = a3[4] * y;
    out[5] = a3[5] * y;
    out[6] = a3[6] * y;
    out[7] = a3[7] * y;
    out[8] = a3[8] * z;
    out[9] = a3[9] * z;
    out[10] = a3[10] * z;
    out[11] = a3[11] * z;
    out[12] = a3[12];
    out[13] = a3[13];
    out[14] = a3[14];
    out[15] = a3[15];
    return out;
  }
  function rotate(out, a3, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len2 = Math.sqrt(x * x + y * y + z * z);
    var s5, c2, t4;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s5 = Math.sin(rad);
    c2 = Math.cos(rad);
    t4 = 1 - c2;
    a00 = a3[0];
    a01 = a3[1];
    a02 = a3[2];
    a03 = a3[3];
    a10 = a3[4];
    a11 = a3[5];
    a12 = a3[6];
    a13 = a3[7];
    a20 = a3[8];
    a21 = a3[9];
    a22 = a3[10];
    a23 = a3[11];
    b00 = x * x * t4 + c2;
    b01 = y * x * t4 + z * s5;
    b02 = z * x * t4 - y * s5;
    b10 = x * y * t4 - z * s5;
    b11 = y * y * t4 + c2;
    b12 = z * y * t4 + x * s5;
    b20 = x * z * t4 + y * s5;
    b21 = y * z * t4 - x * s5;
    b22 = z * z * t4 + c2;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a3 !== out) {
      out[12] = a3[12];
      out[13] = a3[13];
      out[14] = a3[14];
      out[15] = a3[15];
    }
    return out;
  }
  function rotateX(out, a3, rad) {
    var s5 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a10 = a3[4];
    var a11 = a3[5];
    var a12 = a3[6];
    var a13 = a3[7];
    var a20 = a3[8];
    var a21 = a3[9];
    var a22 = a3[10];
    var a23 = a3[11];
    if (a3 !== out) {
      out[0] = a3[0];
      out[1] = a3[1];
      out[2] = a3[2];
      out[3] = a3[3];
      out[12] = a3[12];
      out[13] = a3[13];
      out[14] = a3[14];
      out[15] = a3[15];
    }
    out[4] = a10 * c2 + a20 * s5;
    out[5] = a11 * c2 + a21 * s5;
    out[6] = a12 * c2 + a22 * s5;
    out[7] = a13 * c2 + a23 * s5;
    out[8] = a20 * c2 - a10 * s5;
    out[9] = a21 * c2 - a11 * s5;
    out[10] = a22 * c2 - a12 * s5;
    out[11] = a23 * c2 - a13 * s5;
    return out;
  }
  function rotateY(out, a3, rad) {
    var s5 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a00 = a3[0];
    var a01 = a3[1];
    var a02 = a3[2];
    var a03 = a3[3];
    var a20 = a3[8];
    var a21 = a3[9];
    var a22 = a3[10];
    var a23 = a3[11];
    if (a3 !== out) {
      out[4] = a3[4];
      out[5] = a3[5];
      out[6] = a3[6];
      out[7] = a3[7];
      out[12] = a3[12];
      out[13] = a3[13];
      out[14] = a3[14];
      out[15] = a3[15];
    }
    out[0] = a00 * c2 - a20 * s5;
    out[1] = a01 * c2 - a21 * s5;
    out[2] = a02 * c2 - a22 * s5;
    out[3] = a03 * c2 - a23 * s5;
    out[8] = a00 * s5 + a20 * c2;
    out[9] = a01 * s5 + a21 * c2;
    out[10] = a02 * s5 + a22 * c2;
    out[11] = a03 * s5 + a23 * c2;
    return out;
  }
  function rotateZ(out, a3, rad) {
    var s5 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a00 = a3[0];
    var a01 = a3[1];
    var a02 = a3[2];
    var a03 = a3[3];
    var a10 = a3[4];
    var a11 = a3[5];
    var a12 = a3[6];
    var a13 = a3[7];
    if (a3 !== out) {
      out[8] = a3[8];
      out[9] = a3[9];
      out[10] = a3[10];
      out[11] = a3[11];
      out[12] = a3[12];
      out[13] = a3[13];
      out[14] = a3[14];
      out[15] = a3[15];
    }
    out[0] = a00 * c2 + a10 * s5;
    out[1] = a01 * c2 + a11 * s5;
    out[2] = a02 * c2 + a12 * s5;
    out[3] = a03 * c2 + a13 * s5;
    out[4] = a10 * c2 - a00 * s5;
    out[5] = a11 * c2 - a01 * s5;
    out[6] = a12 * c2 - a02 * s5;
    out[7] = a13 * c2 - a03 * s5;
    return out;
  }
  function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotation(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len2 = Math.sqrt(x * x + y * y + z * z);
    var s5, c2, t4;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s5 = Math.sin(rad);
    c2 = Math.cos(rad);
    t4 = 1 - c2;
    out[0] = x * x * t4 + c2;
    out[1] = y * x * t4 + z * s5;
    out[2] = z * x * t4 - y * s5;
    out[3] = 0;
    out[4] = x * y * t4 - z * s5;
    out[5] = y * y * t4 + c2;
    out[6] = z * y * t4 + x * s5;
    out[7] = 0;
    out[8] = x * z * t4 + y * s5;
    out[9] = y * z * t4 - x * s5;
    out[10] = z * z * t4 + c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s5 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c2;
    out[6] = s5;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s5;
    out[10] = c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s5 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = 0;
    out[2] = -s5;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s5;
    out[9] = 0;
    out[10] = c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromZRotation(out, rad) {
    var s5 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = s5;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s5;
    out[5] = c2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotationTranslation(out, q, v) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromQuat2(out, a3) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a3[0], by = -a3[1], bz = -a3[2], bw = a3[3], ax = a3[4], ay = a3[5], az = a3[6], aw = a3[7];
    var magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    fromRotationTranslation(out, a3, translation);
    return out;
  }
  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  function decompose(out_r, out_t, out_s, mat) {
    out_t[0] = mat[12];
    out_t[1] = mat[13];
    out_t[2] = mat[14];
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    var is1 = 1 / out_s[0];
    var is2 = 1 / out_s[1];
    var is3 = 1 / out_s[2];
    var sm11 = m11 * is1;
    var sm12 = m12 * is2;
    var sm13 = m13 * is3;
    var sm21 = m21 * is1;
    var sm22 = m22 * is2;
    var sm23 = m23 * is3;
    var sm31 = m31 * is1;
    var sm32 = m32 * is2;
    var sm33 = m33 * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out_r[3] = 0.25 * S;
      out_r[0] = (sm23 - sm32) / S;
      out_r[1] = (sm31 - sm13) / S;
      out_r[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out_r[3] = (sm23 - sm32) / S;
      out_r[0] = 0.25 * S;
      out_r[1] = (sm12 + sm21) / S;
      out_r[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out_r[3] = (sm31 - sm13) / S;
      out_r[0] = (sm12 + sm21) / S;
      out_r[1] = 0.25 * S;
      out_r[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out_r[3] = (sm12 - sm21) / S;
      out_r[0] = (sm31 + sm13) / S;
      out_r[1] = (sm23 + sm32) / S;
      out_r[2] = 0.25 * S;
    }
    return out_r;
  }
  function fromRotationTranslationScale(out, q, v, s5) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s5[0];
    var sy = s5[1];
    var sz = s5[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromRotationTranslationScaleOrigin(out, q, v, s5, o4) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s5[0];
    var sy = s5[1];
    var sz = s5[2];
    var ox = o4[0];
    var oy = o4[1];
    var oz = o4[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  function perspectiveNO(out, fovy, aspect, near, far) {
    var f2 = 1 / Math.tan(fovy / 2);
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      var nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  var perspective = perspectiveNO;
  function perspectiveZO(out, fovy, aspect, near, far) {
    var f2 = 1 / Math.tan(fovy / 2);
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      var nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    var xScale = 2 / (leftTan + rightTan);
    var yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  function orthoNO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  var ortho = orthoNO;
  function orthoZO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len2;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len2 = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len2;
    z1 *= len2;
    z2 *= len2;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len2 = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len2) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len2 = 1 / len2;
      x0 *= len2;
      x1 *= len2;
      x2 *= len2;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len2 = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len2) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len2 = 1 / len2;
      y0 *= len2;
      y1 *= len2;
      y2 *= len2;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  function targetTo(out, eye, target, up) {
    var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    var len2 = z0 * z0 + z1 * z1 + z2 * z2;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
      z0 *= len2;
      z1 *= len2;
      z2 *= len2;
    }
    var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len2 = x0 * x0 + x1 * x1 + x2 * x2;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
      x0 *= len2;
      x1 *= len2;
      x2 *= len2;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  function str(a3) {
    return "mat4(" + a3[0] + ", " + a3[1] + ", " + a3[2] + ", " + a3[3] + ", " + a3[4] + ", " + a3[5] + ", " + a3[6] + ", " + a3[7] + ", " + a3[8] + ", " + a3[9] + ", " + a3[10] + ", " + a3[11] + ", " + a3[12] + ", " + a3[13] + ", " + a3[14] + ", " + a3[15] + ")";
  }
  function frob(a3) {
    return Math.sqrt(a3[0] * a3[0] + a3[1] * a3[1] + a3[2] * a3[2] + a3[3] * a3[3] + a3[4] * a3[4] + a3[5] * a3[5] + a3[6] * a3[6] + a3[7] * a3[7] + a3[8] * a3[8] + a3[9] * a3[9] + a3[10] * a3[10] + a3[11] * a3[11] + a3[12] * a3[12] + a3[13] * a3[13] + a3[14] * a3[14] + a3[15] * a3[15]);
  }
  function add(out, a3, b) {
    out[0] = a3[0] + b[0];
    out[1] = a3[1] + b[1];
    out[2] = a3[2] + b[2];
    out[3] = a3[3] + b[3];
    out[4] = a3[4] + b[4];
    out[5] = a3[5] + b[5];
    out[6] = a3[6] + b[6];
    out[7] = a3[7] + b[7];
    out[8] = a3[8] + b[8];
    out[9] = a3[9] + b[9];
    out[10] = a3[10] + b[10];
    out[11] = a3[11] + b[11];
    out[12] = a3[12] + b[12];
    out[13] = a3[13] + b[13];
    out[14] = a3[14] + b[14];
    out[15] = a3[15] + b[15];
    return out;
  }
  function subtract(out, a3, b) {
    out[0] = a3[0] - b[0];
    out[1] = a3[1] - b[1];
    out[2] = a3[2] - b[2];
    out[3] = a3[3] - b[3];
    out[4] = a3[4] - b[4];
    out[5] = a3[5] - b[5];
    out[6] = a3[6] - b[6];
    out[7] = a3[7] - b[7];
    out[8] = a3[8] - b[8];
    out[9] = a3[9] - b[9];
    out[10] = a3[10] - b[10];
    out[11] = a3[11] - b[11];
    out[12] = a3[12] - b[12];
    out[13] = a3[13] - b[13];
    out[14] = a3[14] - b[14];
    out[15] = a3[15] - b[15];
    return out;
  }
  function multiplyScalar(out, a3, b) {
    out[0] = a3[0] * b;
    out[1] = a3[1] * b;
    out[2] = a3[2] * b;
    out[3] = a3[3] * b;
    out[4] = a3[4] * b;
    out[5] = a3[5] * b;
    out[6] = a3[6] * b;
    out[7] = a3[7] * b;
    out[8] = a3[8] * b;
    out[9] = a3[9] * b;
    out[10] = a3[10] * b;
    out[11] = a3[11] * b;
    out[12] = a3[12] * b;
    out[13] = a3[13] * b;
    out[14] = a3[14] * b;
    out[15] = a3[15] * b;
    return out;
  }
  function multiplyScalarAndAdd(out, a3, b, scale4) {
    out[0] = a3[0] + b[0] * scale4;
    out[1] = a3[1] + b[1] * scale4;
    out[2] = a3[2] + b[2] * scale4;
    out[3] = a3[3] + b[3] * scale4;
    out[4] = a3[4] + b[4] * scale4;
    out[5] = a3[5] + b[5] * scale4;
    out[6] = a3[6] + b[6] * scale4;
    out[7] = a3[7] + b[7] * scale4;
    out[8] = a3[8] + b[8] * scale4;
    out[9] = a3[9] + b[9] * scale4;
    out[10] = a3[10] + b[10] * scale4;
    out[11] = a3[11] + b[11] * scale4;
    out[12] = a3[12] + b[12] * scale4;
    out[13] = a3[13] + b[13] * scale4;
    out[14] = a3[14] + b[14] * scale4;
    out[15] = a3[15] + b[15] * scale4;
    return out;
  }
  function exactEquals(a3, b) {
    return a3[0] === b[0] && a3[1] === b[1] && a3[2] === b[2] && a3[3] === b[3] && a3[4] === b[4] && a3[5] === b[5] && a3[6] === b[6] && a3[7] === b[7] && a3[8] === b[8] && a3[9] === b[9] && a3[10] === b[10] && a3[11] === b[11] && a3[12] === b[12] && a3[13] === b[13] && a3[14] === b[14] && a3[15] === b[15];
  }
  function equals(a3, b) {
    var a0 = a3[0], a1 = a3[1], a22 = a3[2], a32 = a3[3];
    var a4 = a3[4], a5 = a3[5], a6 = a3[6], a7 = a3[7];
    var a8 = a3[8], a9 = a3[9], a10 = a3[10], a11 = a3[11];
    var a12 = a3[12], a13 = a3[13], a14 = a3[14], a15 = a3[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a22 - b2) <= EPSILON * Math.max(1, Math.abs(a22), Math.abs(b2)) && Math.abs(a32 - b3) <= EPSILON * Math.max(1, Math.abs(a32), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  var mul = multiply;
  var sub = subtract;
  var vec3_exports = {};
  __export(vec3_exports, {
    add: () => add2,
    angle: () => angle,
    bezier: () => bezier,
    ceil: () => ceil,
    clone: () => clone2,
    copy: () => copy2,
    create: () => create2,
    cross: () => cross,
    dist: () => dist,
    distance: () => distance,
    div: () => div,
    divide: () => divide,
    dot: () => dot,
    equals: () => equals2,
    exactEquals: () => exactEquals2,
    floor: () => floor,
    forEach: () => forEach,
    fromValues: () => fromValues2,
    hermite: () => hermite,
    inverse: () => inverse,
    len: () => len,
    length: () => length,
    lerp: () => lerp,
    max: () => max,
    min: () => min,
    mul: () => mul2,
    multiply: () => multiply2,
    negate: () => negate,
    normalize: () => normalize,
    random: () => random,
    rotateX: () => rotateX2,
    rotateY: () => rotateY2,
    rotateZ: () => rotateZ2,
    round: () => round2,
    scale: () => scale2,
    scaleAndAdd: () => scaleAndAdd,
    set: () => set2,
    slerp: () => slerp,
    sqrDist: () => sqrDist,
    sqrLen: () => sqrLen,
    squaredDistance: () => squaredDistance,
    squaredLength: () => squaredLength,
    str: () => str2,
    sub: () => sub2,
    subtract: () => subtract2,
    transformMat3: () => transformMat3,
    transformMat4: () => transformMat4,
    transformQuat: () => transformQuat,
    zero: () => zero
  });
  function create2() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function clone2(a3) {
    var out = new ARRAY_TYPE(3);
    out[0] = a3[0];
    out[1] = a3[1];
    out[2] = a3[2];
    return out;
  }
  function length(a3) {
    var x = a3[0];
    var y = a3[1];
    var z = a3[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  function fromValues2(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function copy2(out, a3) {
    out[0] = a3[0];
    out[1] = a3[1];
    out[2] = a3[2];
    return out;
  }
  function set2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add2(out, a3, b) {
    out[0] = a3[0] + b[0];
    out[1] = a3[1] + b[1];
    out[2] = a3[2] + b[2];
    return out;
  }
  function subtract2(out, a3, b) {
    out[0] = a3[0] - b[0];
    out[1] = a3[1] - b[1];
    out[2] = a3[2] - b[2];
    return out;
  }
  function multiply2(out, a3, b) {
    out[0] = a3[0] * b[0];
    out[1] = a3[1] * b[1];
    out[2] = a3[2] * b[2];
    return out;
  }
  function divide(out, a3, b) {
    out[0] = a3[0] / b[0];
    out[1] = a3[1] / b[1];
    out[2] = a3[2] / b[2];
    return out;
  }
  function ceil(out, a3) {
    out[0] = Math.ceil(a3[0]);
    out[1] = Math.ceil(a3[1]);
    out[2] = Math.ceil(a3[2]);
    return out;
  }
  function floor(out, a3) {
    out[0] = Math.floor(a3[0]);
    out[1] = Math.floor(a3[1]);
    out[2] = Math.floor(a3[2]);
    return out;
  }
  function min(out, a3, b) {
    out[0] = Math.min(a3[0], b[0]);
    out[1] = Math.min(a3[1], b[1]);
    out[2] = Math.min(a3[2], b[2]);
    return out;
  }
  function max(out, a3, b) {
    out[0] = Math.max(a3[0], b[0]);
    out[1] = Math.max(a3[1], b[1]);
    out[2] = Math.max(a3[2], b[2]);
    return out;
  }
  function round2(out, a3) {
    out[0] = round(a3[0]);
    out[1] = round(a3[1]);
    out[2] = round(a3[2]);
    return out;
  }
  function scale2(out, a3, b) {
    out[0] = a3[0] * b;
    out[1] = a3[1] * b;
    out[2] = a3[2] * b;
    return out;
  }
  function scaleAndAdd(out, a3, b, scale4) {
    out[0] = a3[0] + b[0] * scale4;
    out[1] = a3[1] + b[1] * scale4;
    out[2] = a3[2] + b[2] * scale4;
    return out;
  }
  function distance(a3, b) {
    var x = b[0] - a3[0];
    var y = b[1] - a3[1];
    var z = b[2] - a3[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  function squaredDistance(a3, b) {
    var x = b[0] - a3[0];
    var y = b[1] - a3[1];
    var z = b[2] - a3[2];
    return x * x + y * y + z * z;
  }
  function squaredLength(a3) {
    var x = a3[0];
    var y = a3[1];
    var z = a3[2];
    return x * x + y * y + z * z;
  }
  function negate(out, a3) {
    out[0] = -a3[0];
    out[1] = -a3[1];
    out[2] = -a3[2];
    return out;
  }
  function inverse(out, a3) {
    out[0] = 1 / a3[0];
    out[1] = 1 / a3[1];
    out[2] = 1 / a3[2];
    return out;
  }
  function normalize(out, a3) {
    var x = a3[0];
    var y = a3[1];
    var z = a3[2];
    var len2 = x * x + y * y + z * z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = a3[0] * len2;
    out[1] = a3[1] * len2;
    out[2] = a3[2] * len2;
    return out;
  }
  function dot(a3, b) {
    return a3[0] * b[0] + a3[1] * b[1] + a3[2] * b[2];
  }
  function cross(out, a3, b) {
    var ax = a3[0], ay = a3[1], az = a3[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp(out, a3, b, t4) {
    var ax = a3[0];
    var ay = a3[1];
    var az = a3[2];
    out[0] = ax + t4 * (b[0] - ax);
    out[1] = ay + t4 * (b[1] - ay);
    out[2] = az + t4 * (b[2] - az);
    return out;
  }
  function slerp(out, a3, b, t4) {
    var angle2 = Math.acos(Math.min(Math.max(dot(a3, b), -1), 1));
    var sinTotal = Math.sin(angle2);
    var ratioA = Math.sin((1 - t4) * angle2) / sinTotal;
    var ratioB = Math.sin(t4 * angle2) / sinTotal;
    out[0] = ratioA * a3[0] + ratioB * b[0];
    out[1] = ratioA * a3[1] + ratioB * b[1];
    out[2] = ratioA * a3[2] + ratioB * b[2];
    return out;
  }
  function hermite(out, a3, b, c2, d2, t4) {
    var factorTimes2 = t4 * t4;
    var factor1 = factorTimes2 * (2 * t4 - 3) + 1;
    var factor2 = factorTimes2 * (t4 - 2) + t4;
    var factor3 = factorTimes2 * (t4 - 1);
    var factor4 = factorTimes2 * (3 - 2 * t4);
    out[0] = a3[0] * factor1 + b[0] * factor2 + c2[0] * factor3 + d2[0] * factor4;
    out[1] = a3[1] * factor1 + b[1] * factor2 + c2[1] * factor3 + d2[1] * factor4;
    out[2] = a3[2] * factor1 + b[2] * factor2 + c2[2] * factor3 + d2[2] * factor4;
    return out;
  }
  function bezier(out, a3, b, c2, d2, t4) {
    var inverseFactor = 1 - t4;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t4 * t4;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t4 * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t4;
    out[0] = a3[0] * factor1 + b[0] * factor2 + c2[0] * factor3 + d2[0] * factor4;
    out[1] = a3[1] * factor1 + b[1] * factor2 + c2[1] * factor3 + d2[1] * factor4;
    out[2] = a3[2] * factor1 + b[2] * factor2 + c2[2] * factor3 + d2[2] * factor4;
    return out;
  }
  function random(out, scale4) {
    scale4 = scale4 === void 0 ? 1 : scale4;
    var r2 = RANDOM() * 2 * Math.PI;
    var z = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z * z) * scale4;
    out[0] = Math.cos(r2) * zScale;
    out[1] = Math.sin(r2) * zScale;
    out[2] = z * scale4;
    return out;
  }
  function transformMat4(out, a3, m2) {
    var x = a3[0], y = a3[1], z = a3[2];
    var w = m2[3] * x + m2[7] * y + m2[11] * z + m2[15];
    w = w || 1;
    out[0] = (m2[0] * x + m2[4] * y + m2[8] * z + m2[12]) / w;
    out[1] = (m2[1] * x + m2[5] * y + m2[9] * z + m2[13]) / w;
    out[2] = (m2[2] * x + m2[6] * y + m2[10] * z + m2[14]) / w;
    return out;
  }
  function transformMat3(out, a3, m2) {
    var x = a3[0], y = a3[1], z = a3[2];
    out[0] = x * m2[0] + y * m2[3] + z * m2[6];
    out[1] = x * m2[1] + y * m2[4] + z * m2[7];
    out[2] = x * m2[2] + y * m2[5] + z * m2[8];
    return out;
  }
  function transformQuat(out, a3, q) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var vx = a3[0], vy = a3[1], vz = a3[2];
    var tx = qy * vz - qz * vy;
    var ty = qz * vx - qx * vz;
    var tz = qx * vy - qy * vx;
    tx = tx + tx;
    ty = ty + ty;
    tz = tz + tz;
    out[0] = vx + qw * tx + qy * tz - qz * ty;
    out[1] = vy + qw * ty + qz * tx - qx * tz;
    out[2] = vz + qw * tz + qx * ty - qy * tx;
    return out;
  }
  function rotateX2(out, a3, b, rad) {
    var p2 = [], r2 = [];
    p2[0] = a3[0] - b[0];
    p2[1] = a3[1] - b[1];
    p2[2] = a3[2] - b[2];
    r2[0] = p2[0];
    r2[1] = p2[1] * Math.cos(rad) - p2[2] * Math.sin(rad);
    r2[2] = p2[1] * Math.sin(rad) + p2[2] * Math.cos(rad);
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function rotateY2(out, a3, b, rad) {
    var p2 = [], r2 = [];
    p2[0] = a3[0] - b[0];
    p2[1] = a3[1] - b[1];
    p2[2] = a3[2] - b[2];
    r2[0] = p2[2] * Math.sin(rad) + p2[0] * Math.cos(rad);
    r2[1] = p2[1];
    r2[2] = p2[2] * Math.cos(rad) - p2[0] * Math.sin(rad);
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function rotateZ2(out, a3, b, rad) {
    var p2 = [], r2 = [];
    p2[0] = a3[0] - b[0];
    p2[1] = a3[1] - b[1];
    p2[2] = a3[2] - b[2];
    r2[0] = p2[0] * Math.cos(rad) - p2[1] * Math.sin(rad);
    r2[1] = p2[0] * Math.sin(rad) + p2[1] * Math.cos(rad);
    r2[2] = p2[2];
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function angle(a3, b) {
    var ax = a3[0], ay = a3[1], az = a3[2], bx = b[0], by = b[1], bz = b[2], mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz)), cosine = mag && dot(a3, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  function str2(a3) {
    return "vec3(" + a3[0] + ", " + a3[1] + ", " + a3[2] + ")";
  }
  function exactEquals2(a3, b) {
    return a3[0] === b[0] && a3[1] === b[1] && a3[2] === b[2];
  }
  function equals2(a3, b) {
    var a0 = a3[0], a1 = a3[1], a22 = a3[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a22 - b2) <= EPSILON * Math.max(1, Math.abs(a22), Math.abs(b2));
  }
  var sub2 = subtract2;
  var mul2 = multiply2;
  var div = divide;
  var dist = distance;
  var sqrDist = squaredDistance;
  var len = length;
  var sqrLen = squaredLength;
  var forEach = (function () {
    var vec = create2();
    return function (a3, stride, offset, count, fn, arg) {
      var i, l2;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset, a3.length);
      } else {
        l2 = a3.length;
      }
      for (i = offset; i < l2; i += stride) {
        vec[0] = a3[i];
        vec[1] = a3[i + 1];
        vec[2] = a3[i + 2];
        fn(vec, vec, arg);
        a3[i] = vec[0];
        a3[i + 1] = vec[1];
        a3[i + 2] = vec[2];
      }
      return a3;
    };
  })();
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
      throw new e2("WebGLShader not available.");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      const compilationLog = gl.getShaderInfoLog(shader);
      throw new e2(`Shader compilation failed: ${compilationLog}`);
    }
    return shader;
  }
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      throw new e2("Unable to initialize the shader program.");
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
  }
  function getWebGlFromCanvas(canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new e2("Unable to initialize WebGL.");
    }
    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return gl;
  }
  function initFramebufferObject(gl) {
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
      throw new e2("Failed to create frame buffer object");
    }
    const texture = gl.createTexture();
    if (!texture) {
      throw new e2("Failed to create texture object");
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    const depthBuffer = gl.createRenderbuffer();
    if (!depthBuffer) {
      throw new e2("Failed to create renderbuffer object");
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
    const e5 = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e5) {
      throw new e2(`Frame buffer object is incomplete:${e5.toString()}`);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    return {
      framebuffer,
      texture
    };
  }
  var normalVertexShader = `
attribute vec4 aVertexPosition;
uniform vec4 uVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uCameraMatrix;

varying lowp vec4 vColor;
varying highp vec2 vTexturePosition;
varying lowp float colorFactor;
void main(void) {
  gl_Position = uProjectionMatrix * uCameraMatrix * uModelViewMatrix * aVertexPosition;
  vColor = uVertexColor;

  // texture position is in [0,1], vertex position is in [-1,1]
  vTexturePosition.x = (aVertexPosition.x + 1.0) / 2.0;
  vTexturePosition.y = 1.0 - (aVertexPosition.y + 1.0) / 2.0;

  colorFactor = gl_Position.z;
}
`;
  var normalFragmentShader = `
precision mediump float;
uniform bool uRenderWithTexture;
uniform bool uRenderWithDepthColor;
uniform sampler2D uTexture;
varying lowp float colorFactor;
uniform vec4 uColorFilter;


varying lowp vec4 vColor;
varying highp vec2 vTexturePosition;
void main(void) {
  if (uRenderWithTexture){
    gl_FragColor = texture2D(uTexture, vTexturePosition);
  } else {
    gl_FragColor = vColor;
  }
  if (uRenderWithDepthColor){
    gl_FragColor += (colorFactor + 0.5) * (1.0 - gl_FragColor);
    gl_FragColor.a = 1.0;
  }
  gl_FragColor = uColorFilter * gl_FragColor + 1.0 - uColorFilter;
  gl_FragColor.a = 1.0;
}
`;
  var _Rune = class _Rune {
    constructor(vertices, colors, transformMatrix, subRunes, texture, hollusionDistance) {
      this.vertices = vertices;
      this.colors = colors;
      this.transformMatrix = transformMatrix;
      this.subRunes = subRunes;
      this.texture = texture;
      this.hollusionDistance = hollusionDistance;
      this.copy = () => new _Rune(this.vertices, this.colors, mat4_exports.clone(this.transformMatrix), this.subRunes, this.texture, this.hollusionDistance);
      this.flatten = () => {
        const runeList = [];
        const runeTodoList = [this.copy()];
        while (runeTodoList.length !== 0) {
          const runeToExpand = runeTodoList.pop();
          runeToExpand.subRunes.forEach(subRune => {
            const subRuneCopy = subRune.copy();
            mat4_exports.multiply(subRuneCopy.transformMatrix, runeToExpand.transformMatrix, subRuneCopy.transformMatrix);
            subRuneCopy.hollusionDistance = runeToExpand.hollusionDistance;
            if (runeToExpand.colors !== null) {
              subRuneCopy.colors = runeToExpand.colors;
            }
            runeTodoList.push(subRuneCopy);
          });
          runeToExpand.subRunes = [];
          if (runeToExpand.vertices.length > 0) {
            runeList.push(runeToExpand);
          }
        }
        return runeList;
      };
      this.toReplString = () => "<Rune>";
    }
  };
  _Rune.of = (params = {}) => {
    const paramGetter = (name, defaultValue) => {
      var _a;
      return (_a = params[name]) != null ? _a : defaultValue();
    };
    return new _Rune(paramGetter("vertices", () => new Float32Array()), paramGetter("colors", () => null), paramGetter("transformMatrix", mat4_exports.create), paramGetter("subRunes", () => []), paramGetter("texture", () => null), paramGetter("hollusionDistance", () => 0.1));
  };
  var Rune = _Rune;
  function drawRunesToFrameBuffer(gl, runes, cameraMatrix, colorFilter, framebuffer = null, depthSwitch = false) {
    return __async(this, null, function* () {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      const shaderProgram = initShaderProgram(gl, normalVertexShader, normalFragmentShader);
      gl.useProgram(shaderProgram);
      if (gl === null) {
        throw new e2("Rendering Context not initialized for drawRune.");
      }
      const vertexPositionPointer = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      const vertexColorPointer = gl.getUniformLocation(shaderProgram, "uVertexColor");
      const vertexColorFilterPt = gl.getUniformLocation(shaderProgram, "uColorFilter");
      const projectionMatrixPointer = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
      const cameraMatrixPointer = gl.getUniformLocation(shaderProgram, "uCameraMatrix");
      const modelViewMatrixPointer = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
      const textureSwitchPointer = gl.getUniformLocation(shaderProgram, "uRenderWithTexture");
      const depthSwitchPointer = gl.getUniformLocation(shaderProgram, "uRenderWithDepthColor");
      const texturePointer = gl.getUniformLocation(shaderProgram, "uTexture");
      gl.uniform1i(depthSwitchPointer, depthSwitch ? 1 : 0);
      const orthoCam = mat4_exports.create();
      mat4_exports.ortho(orthoCam, -1, 1, -1, 1, -0.5, 1.5);
      gl.uniformMatrix4fv(projectionMatrixPointer, false, orthoCam);
      gl.uniformMatrix4fv(cameraMatrixPointer, false, cameraMatrix);
      gl.uniform4fv(vertexColorFilterPt, colorFilter);
      const loadTexture = rune => __async(null, null, function* () {
        if (rune.texture === null) return null;
        const imageSource = rune.texture;
        let image;
        if (typeof imageSource !== "string") {
          image = imageSource;
        } else {
          image = yield new Promise((resolve, reject) => {
            const image2 = Object.assign(new Image(), {
              crossOrigin: "anonymous",
              src: imageSource
            });
            image2.onload = () => {
              rune.texture = image2;
              resolve(image2);
            };
            image2.onabort = reject;
            image2.onerror = reject;
          });
        }
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        function isPowerOf2(value) {
          return (value & value - 1) === 0;
        }
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        return texture;
      });
      for (const rune of runes) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rune.vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPositionPointer);
        if (rune.texture === null) {
          gl.uniform4fv(vertexColorPointer, rune.colors || new Float32Array([0, 0, 0, 1]));
          gl.uniform1i(textureSwitchPointer, 0);
        } else {
          const texture = yield loadTexture(rune);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.uniform1i(texturePointer, 0);
          gl.uniform1i(textureSwitchPointer, 1);
        }
        gl.uniformMatrix4fv(modelViewMatrixPointer, false, rune.transformMatrix);
        const vertexCount = rune.vertices.length / 4;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
      }
    });
  }
  var DrawnRune = class {
    constructor(rune, isHollusion) {
      this.rune = rune;
      this.isHollusion = isHollusion;
      this.toReplString = () => "<Rune>";
    }
  };
  DrawnRune.normalVertexShader = `
  attribute vec4 aVertexPosition;
  uniform vec4 uVertexColor;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uCameraMatrix;

  varying lowp vec4 vColor;
  varying highp vec2 vTexturePosition;
  varying lowp float colorFactor;
  void main(void) {
    gl_Position = uProjectionMatrix * uCameraMatrix * uModelViewMatrix * aVertexPosition;
    vColor = uVertexColor;

    // texture position is in [0,1], vertex position is in [-1,1]
    vTexturePosition.x = (aVertexPosition.x + 1.0) / 2.0;
    vTexturePosition.y = 1.0 - (aVertexPosition.y + 1.0) / 2.0;

    colorFactor = gl_Position.z;
  }
  `;
  DrawnRune.normalFragmentShader = `
  precision mediump float;
  uniform bool uRenderWithTexture;
  uniform bool uRenderWithDepthColor;
  uniform sampler2D uTexture;
  varying lowp float colorFactor;
  uniform vec4 uColorFilter;


  varying lowp vec4 vColor;
  varying highp vec2 vTexturePosition;
  void main(void) {
    if (uRenderWithTexture){
      gl_FragColor = texture2D(uTexture, vTexturePosition);
    } else {
      gl_FragColor = vColor;
    }
    if (uRenderWithDepthColor){
      gl_FragColor += (colorFactor + 0.5) * (1.0 - gl_FragColor);
      gl_FragColor.a = 1.0;
    }
    gl_FragColor = uColorFilter * gl_FragColor + 1.0 - uColorFilter;
    gl_FragColor.a = 1.0;
  }
  `;
  function throwIfNotRune(func_name, rune, param_name) {
    if (!(rune instanceof Rune)) {
      throw new n(func_name, param_name, "Rune", rune);
    }
  }
  function getSquare() {
    const vertexList = [];
    const colorList = [];
    vertexList.push(-1, 1, 0, 1);
    vertexList.push(-1, -1, 0, 1);
    vertexList.push(1, -1, 0, 1);
    vertexList.push(1, -1, 0, 1);
    vertexList.push(-1, 1, 0, 1);
    vertexList.push(1, 1, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getBlank() {
    return Rune.of();
  }
  function getRcross() {
    const vertexList = [];
    const colorList = [];
    vertexList.push(-0.5, 0.5, 0, 1);
    vertexList.push(-0.5, -0.5, 0, 1);
    vertexList.push(0.5, -0.5, 0, 1);
    vertexList.push(-1, 1, 0, 1);
    vertexList.push(-0.5, 0.5, 0, 1);
    vertexList.push(1, 1, 0, 1);
    vertexList.push(-0.5, 0.5, 0, 1);
    vertexList.push(1, 1, 0, 1);
    vertexList.push(0.5, 0.5, 0, 1);
    vertexList.push(1, 1, 0, 1);
    vertexList.push(0.5, 0.5, 0, 1);
    vertexList.push(1, -1, 0, 1);
    vertexList.push(0.5, 0.5, 0, 1);
    vertexList.push(1, -1, 0, 1);
    vertexList.push(0.5, -0.5, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getSail() {
    const vertexList = [];
    const colorList = [];
    vertexList.push(0.5, -1, 0, 1);
    vertexList.push(0, -1, 0, 1);
    vertexList.push(0, 1, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getTriangle() {
    const vertexList = [];
    const colorList = [];
    vertexList.push(1, -1, 0, 1);
    vertexList.push(0, -1, 0, 1);
    vertexList.push(0, 1, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getCorner() {
    const vertexList = [];
    const colorList = [];
    vertexList.push(1, 0, 0, 1);
    vertexList.push(1, 1, 0, 1);
    vertexList.push(0, 1, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getNova() {
    const vertexList = [];
    const colorList = [];
    vertexList.push(0, 1, 0, 1);
    vertexList.push(-0.5, 0, 0, 1);
    vertexList.push(0, 0.5, 0, 1);
    vertexList.push(-0.5, 0, 0, 1);
    vertexList.push(0, 0.5, 0, 1);
    vertexList.push(1, 0, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getCircle() {
    const vertexList = [];
    const colorList = [];
    const circleDiv = 60;
    for (let i = 0; i < circleDiv; i += 1) {
      const angle1 = 2 * Math.PI / circleDiv * i;
      const angle2 = 2 * Math.PI / circleDiv * (i + 1);
      vertexList.push(Math.cos(angle1), Math.sin(angle1), 0, 1);
      vertexList.push(Math.cos(angle2), Math.sin(angle2), 0, 1);
      vertexList.push(0, 0, 0, 1);
    }
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getHeart() {
    const vertexList = [];
    const colorList = [];
    const root2 = Math.sqrt(2);
    const r2 = 4 / (2 + 3 * root2);
    const scaleX = 1 / (r2 * (1 + root2 / 2));
    const numPoints = 100;
    const rightCenterX = r2 / root2;
    const rightCenterY = 1 - r2;
    for (let i = 0; i < numPoints; i += 1) {
      const angle1 = Math.PI * (-1 / 4 + i / numPoints);
      const angle2 = Math.PI * (-1 / 4 + (i + 1) / numPoints);
      vertexList.push((Math.cos(angle1) * r2 + rightCenterX) * scaleX, Math.sin(angle1) * r2 + rightCenterY, 0, 1);
      vertexList.push((Math.cos(angle2) * r2 + rightCenterX) * scaleX, Math.sin(angle2) * r2 + rightCenterY, 0, 1);
      vertexList.push(0, -1, 0, 1);
    }
    const leftCenterX = -r2 / root2;
    const leftCenterY = 1 - r2;
    for (let i = 0; i <= numPoints; i += 1) {
      const angle1 = Math.PI * (1 / 4 + i / numPoints);
      const angle2 = Math.PI * (1 / 4 + (i + 1) / numPoints);
      vertexList.push((Math.cos(angle1) * r2 + leftCenterX) * scaleX, Math.sin(angle1) * r2 + leftCenterY, 0, 1);
      vertexList.push((Math.cos(angle2) * r2 + leftCenterX) * scaleX, Math.sin(angle2) * r2 + leftCenterY, 0, 1);
      vertexList.push(0, -1, 0, 1);
    }
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getPentagram() {
    const vertexList = [];
    const colorList = [];
    const v1 = Math.sin(Math.PI / 10);
    const v2 = Math.cos(Math.PI / 10);
    const w1 = Math.sin(3 * Math.PI / 10);
    const w2 = Math.cos(3 * Math.PI / 10);
    const vertices = [];
    vertices.push([v2, v1, 0, 1]);
    vertices.push([w2, -w1, 0, 1]);
    vertices.push([-w2, -w1, 0, 1]);
    vertices.push([-v2, v1, 0, 1]);
    vertices.push([0, 1, 0, 1]);
    for (let i = 0; i < 5; i += 1) {
      vertexList.push(0, 0, 0, 1);
      vertexList.push(...vertices[i]);
      vertexList.push(...vertices[(i + 2) % 5]);
    }
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function getRibbon() {
    const vertexList = [];
    const colorList = [];
    const thetaMax = 30;
    const thickness = -1 / thetaMax;
    const unit = 0.1;
    const vertices = [];
    for (let i = 0; i < thetaMax; i += unit) {
      vertices.push([i / thetaMax * Math.cos(i), i / thetaMax * Math.sin(i), 0, 1]);
      vertices.push([Math.abs(Math.cos(i) * thickness) + i / thetaMax * Math.cos(i), Math.abs(Math.sin(i) * thickness) + i / thetaMax * Math.sin(i), 0, 1]);
    }
    for (let i = 0; i < vertices.length - 2; i += 1) {
      vertexList.push(...vertices[i]);
      vertexList.push(...vertices[i + 1]);
      vertexList.push(...vertices[i + 2]);
    }
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  }
  function hexToColor(hex) {
    if (typeof hex !== "string") {
      throw new n(hexToColor.name, void 0, "string", hex);
    }
    const groups = (/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/iu).exec(hex);
    if (!groups) {
      throw new e2(`${hexToColor.name}: Invalid color hex string: ${hex}`);
    }
    return [parseInt(groups[1], 16) / 255, parseInt(groups[2], 16) / 255, parseInt(groups[3], 16) / 255, 1];
  }
  function hueToRgb(hue) {
    const h = (hue % 1 + 1) % 1;
    const i = Math.floor(h * 6);
    const f2 = h * 6 - i;
    const q = 1 - f2;
    switch (i) {
      case 0:
        return [255, Math.floor(f2 * 255), 0];
      case 1:
        return [Math.floor(q * 255), 255, 0];
      case 2:
        return [0, 255, Math.floor(f2 * 255)];
      case 3:
        return [0, Math.floor(q * 255), 255];
      case 4:
        return [Math.floor(f2 * 255), 0, 255];
      default:
        return [255, 0, Math.floor(q * 255)];
    }
  }
  function addColorFromHex(rune, hex) {
    throwIfNotRune(addColorFromHex.name, rune);
    return Rune.of({
      subRunes: [rune],
      colors: new Float32Array(hexToColor(hex))
    });
  }
  function throwIfNotFraction(val, param_name, func_name) {
    l(val, func_name, 0, 1, false, param_name);
  }
  var _RuneFunctions = class _RuneFunctions {
    static from_url(imageUrl) {
      const rune = getSquare();
      rune.texture = imageUrl;
      return rune;
    }
    static scale_independent(ratio_x, ratio_y, rune) {
      throwIfNotRune(_RuneFunctions.scale_independent.name, rune);
      l(ratio_x, _RuneFunctions.scale_independent.name, void 0, void 0, false, "ratio_x");
      l(ratio_y, _RuneFunctions.scale_independent.name, void 0, void 0, false, "ratio_y");
      const scaleVec = vec3_exports.fromValues(ratio_x, ratio_y, 1);
      const scaleMat = mat4_exports.create();
      mat4_exports.scale(scaleMat, scaleMat, scaleVec);
      const wrapperMat = mat4_exports.create();
      mat4_exports.multiply(wrapperMat, scaleMat, wrapperMat);
      return Rune.of({
        subRunes: [rune],
        transformMatrix: wrapperMat
      });
    }
    static scale(ratio, rune) {
      throwIfNotRune(_RuneFunctions.scale.name, rune);
      return _RuneFunctions.scale_independent(ratio, ratio, rune);
    }
    static translate(x, y, rune) {
      throwIfNotRune(_RuneFunctions.translate.name, rune);
      const translateVec = vec3_exports.fromValues(x, -y, 0);
      const translateMat = mat4_exports.create();
      mat4_exports.translate(translateMat, translateMat, translateVec);
      const wrapperMat = mat4_exports.create();
      mat4_exports.multiply(wrapperMat, translateMat, wrapperMat);
      return Rune.of({
        subRunes: [rune],
        transformMatrix: wrapperMat
      });
    }
    static rotate(rad, rune) {
      throwIfNotRune(_RuneFunctions.rotate.name, rune);
      const rotateMat = mat4_exports.create();
      mat4_exports.rotateZ(rotateMat, rotateMat, rad);
      const wrapperMat = mat4_exports.create();
      mat4_exports.multiply(wrapperMat, rotateMat, wrapperMat);
      return Rune.of({
        subRunes: [rune],
        transformMatrix: wrapperMat
      });
    }
    static stack_frac(frac, rune1, rune2) {
      throwIfNotRune(_RuneFunctions.stack_frac.name, rune1, "rune1");
      throwIfNotRune(_RuneFunctions.stack_frac.name, rune2, "rune2");
      throwIfNotFraction(frac, "frac", _RuneFunctions.stack_frac.name);
      const upper = _RuneFunctions.translate(0, -(1 - frac), _RuneFunctions.scale_independent(1, frac, rune1));
      const lower = _RuneFunctions.translate(0, frac, _RuneFunctions.scale_independent(1, 1 - frac, rune2));
      return Rune.of({
        subRunes: [upper, lower]
      });
    }
    static stack(rune1, rune2) {
      throwIfNotRune(_RuneFunctions.stack.name, rune1, "rune1");
      throwIfNotRune(_RuneFunctions.stack.name, rune2, "rune2");
      return _RuneFunctions.stack_frac(0.5, rune1, rune2);
    }
    static stackn(n3, rune) {
      throwIfNotRune(_RuneFunctions.stackn.name, rune);
      l(n3, _RuneFunctions.stackn.name);
      if (n3 <= 1) {
        return rune;
      }
      return _RuneFunctions.stack_frac(1 / n3, rune, _RuneFunctions.stackn(n3 - 1, rune));
    }
    static quarter_turn_right(rune) {
      throwIfNotRune(_RuneFunctions.quarter_turn_right.name, rune);
      return _RuneFunctions.rotate(-Math.PI / 2, rune);
    }
    static quarter_turn_left(rune) {
      throwIfNotRune(_RuneFunctions.quarter_turn_left.name, rune);
      return _RuneFunctions.rotate(Math.PI / 2, rune);
    }
    static turn_upside_down(rune) {
      throwIfNotRune(_RuneFunctions.turn_upside_down.name, rune);
      return _RuneFunctions.rotate(Math.PI, rune);
    }
    static beside_frac(frac, rune1, rune2) {
      throwIfNotRune(_RuneFunctions.beside_frac.name, rune1, "rune1");
      throwIfNotRune(_RuneFunctions.beside_frac.name, rune2, "rune2");
      throwIfNotFraction(frac, "frac", _RuneFunctions.beside_frac.name);
      const left = _RuneFunctions.translate(-(1 - frac), 0, _RuneFunctions.scale_independent(frac, 1, rune1));
      const right = _RuneFunctions.translate(frac, 0, _RuneFunctions.scale_independent(1 - frac, 1, rune2));
      return Rune.of({
        subRunes: [left, right]
      });
    }
    static beside(rune1, rune2) {
      throwIfNotRune(_RuneFunctions.beside.name, rune1, "rune1");
      throwIfNotRune(_RuneFunctions.beside.name, rune2, "rune2");
      return _RuneFunctions.beside_frac(0.5, rune1, rune2);
    }
    static flip_vert(rune) {
      throwIfNotRune(_RuneFunctions.flip_vert.name, rune);
      return _RuneFunctions.scale_independent(1, -1, rune);
    }
    static flip_horiz(rune) {
      throwIfNotRune(_RuneFunctions.flip_horiz.name, rune);
      return _RuneFunctions.scale_independent(-1, 1, rune);
    }
    static make_cross(rune) {
      throwIfNotRune(_RuneFunctions.make_cross.name, rune);
      return _RuneFunctions.stack(_RuneFunctions.beside(_RuneFunctions.quarter_turn_right(rune), _RuneFunctions.rotate(Math.PI, rune)), _RuneFunctions.beside(rune, _RuneFunctions.rotate(Math.PI / 2, rune)));
    }
    static overlay_frac(frac, rune1, rune2) {
      throwIfNotRune(_RuneFunctions.overlay_frac.name, rune1, "rune1");
      throwIfNotRune(_RuneFunctions.overlay_frac.name, rune2, "rune2");
      throwIfNotFraction(frac, "frac", _RuneFunctions.overlay_frac.name);
      const minFrac = 1e-6;
      const maxFrac = 1 - minFrac;
      const useFrac = clamp(frac, minFrac, maxFrac);
      const frontMat = mat4_exports.create();
      mat4_exports.scale(frontMat, frontMat, vec3_exports.fromValues(1, 1, useFrac));
      const front = Rune.of({
        subRunes: [rune1],
        transformMatrix: frontMat
      });
      const backMat = mat4_exports.create();
      mat4_exports.translate(backMat, backMat, vec3_exports.fromValues(0, 0, -useFrac));
      mat4_exports.scale(backMat, backMat, vec3_exports.fromValues(1, 1, 1 - useFrac));
      const back = Rune.of({
        subRunes: [rune2],
        transformMatrix: backMat
      });
      return Rune.of({
        subRunes: [front, back]
      });
    }
    static overlay(rune1, rune2) {
      throwIfNotRune(_RuneFunctions.overlay.name, rune1, "rune1");
      throwIfNotRune(_RuneFunctions.overlay.name, rune2, "rune2");
      return _RuneFunctions.overlay_frac(0.5, rune1, rune2);
    }
    static color(rune, r2, g, b) {
      throwIfNotRune(_RuneFunctions.color.name, rune);
      throwIfNotFraction(r2, "r", _RuneFunctions.color.name);
      throwIfNotFraction(g, "g", _RuneFunctions.color.name);
      throwIfNotFraction(b, "b", _RuneFunctions.color.name);
      const colorVector = [r2, g, b, 1];
      return Rune.of({
        colors: new Float32Array(colorVector),
        subRunes: [rune]
      });
    }
  };
  _RuneFunctions.square = getSquare();
  _RuneFunctions.blank = getBlank();
  _RuneFunctions.rcross = getRcross();
  _RuneFunctions.sail = getSail();
  _RuneFunctions.triangle = getTriangle();
  _RuneFunctions.corner = getCorner();
  _RuneFunctions.nova = getNova();
  _RuneFunctions.circle = getCircle();
  _RuneFunctions.heart = getHeart();
  _RuneFunctions.pentagram = getPentagram();
  _RuneFunctions.ribbon = getRibbon();
  var RuneFunctions = _RuneFunctions;
  var _RuneColours = class _RuneColours {
    static black(rune) {
      throwIfNotRune(_RuneColours.black.name, rune);
      return addColorFromHex(rune, "#000000");
    }
    static blue(rune) {
      throwIfNotRune(_RuneColours.blue.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.blue);
    }
    static brown(rune) {
      throwIfNotRune(_RuneColours.brown.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.brown);
    }
    static green(rune) {
      throwIfNotRune(_RuneColours.green.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.green);
    }
    static indigo(rune) {
      throwIfNotRune(_RuneColours.indigo.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.indigo);
    }
    static red(rune) {
      throwIfNotRune(_RuneColours.red.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.red);
    }
    static pink(rune) {
      throwIfNotRune(_RuneColours.pink.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.pink);
    }
    static orange(rune) {
      throwIfNotRune(_RuneColours.orange.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.orange);
    }
    static purple(rune) {
      throwIfNotRune(_RuneColours.purple.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.purple);
    }
    static white(rune) {
      throwIfNotRune(_RuneColours.white.name, rune);
      return addColorFromHex(rune, "#FFFFFF");
    }
    static yellow(rune) {
      throwIfNotRune(_RuneColours.yellow.name, rune);
      return addColorFromHex(rune, _RuneColours.colours.yellow);
    }
    static random_color(rune) {
      throwIfNotRune(_RuneColours.random_color.name, rune);
      const colorVal = sample(Object.values(_RuneColours.colours));
      const randomColor = hexToColor(colorVal);
      return Rune.of({
        colors: new Float32Array(randomColor),
        subRunes: [rune]
      });
    }
    static colour_with_hue(rune, hue) {
      throwIfNotRune(_RuneColours.colour_with_hue.name, rune);
      l(hue, _RuneColours.colour_with_hue.name, 0, void 0, false, "hue");
      const [r2, g, b] = hueToRgb(hue);
      return Rune.of({
        subRunes: [rune],
        colors: new Float32Array([r2 / 255, g / 255, b / 255, 1])
      });
    }
  };
  _RuneColours.colours = {
    blue: "#2196F3",
    brown: "#795548",
    green: "#4CAF50",
    indigo: "#3F51B5",
    orange: "#FF9800",
    pink: "#E91E63",
    purple: "#AA00FF",
    red: "#F44336",
    yellow: "#FFEB3B"
  };
  var RuneColours = _RuneColours;
  var _DrawnAnaglyphRune = class _DrawnAnaglyphRune extends DrawnRune {
    constructor(rune) {
      super(rune, false);
      this.draw = canvas => __async(this, null, function* () {
        const gl = getWebGlFromCanvas(canvas);
        const runes = white(overlay_frac(0.999999999, blank, scale3(2.2, square))).flatten().concat(this.rune.flatten());
        const halfEyeDistance = 0.03;
        const leftCameraMatrix = mat4_exports.create();
        mat4_exports.lookAt(leftCameraMatrix, vec3_exports.fromValues(-halfEyeDistance, 0, 0), vec3_exports.fromValues(0, 0, -0.4), vec3_exports.fromValues(0, 1, 0));
        const rightCameraMatrix = mat4_exports.create();
        mat4_exports.lookAt(rightCameraMatrix, vec3_exports.fromValues(halfEyeDistance, 0, 0), vec3_exports.fromValues(0, 0, -0.4), vec3_exports.fromValues(0, 1, 0));
        const leftBuffer = initFramebufferObject(gl);
        const rightBuffer = initFramebufferObject(gl);
        yield drawRunesToFrameBuffer(gl, runes, leftCameraMatrix, new Float32Array([1, 0, 0, 1]), leftBuffer.framebuffer, true);
        yield drawRunesToFrameBuffer(gl, runes, rightCameraMatrix, new Float32Array([0, 1, 1, 1]), rightBuffer.framebuffer, true);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        const shaderProgram = initShaderProgram(gl, _DrawnAnaglyphRune.anaglyphVertexShader, _DrawnAnaglyphRune.anaglyphFragmentShader);
        gl.useProgram(shaderProgram);
        const reduPt = gl.getUniformLocation(shaderProgram, "u_sampler_red");
        const cyanuPt = gl.getUniformLocation(shaderProgram, "u_sampler_cyan");
        const vertexPositionPointer = gl.getAttribLocation(shaderProgram, "a_position");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, leftBuffer.texture);
        gl.uniform1i(cyanuPt, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, rightBuffer.texture);
        gl.uniform1i(reduPt, 1);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPositionPointer);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      });
    }
  };
  _DrawnAnaglyphRune.anaglyphVertexShader = `
    precision mediump float;
    attribute vec4 a_position;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_Position = a_position;
        // texture position is in [0,1], vertex position is in [-1,1]
        v_texturePosition.x = (a_position.x + 1.0) / 2.0;
        v_texturePosition.y = (a_position.y + 1.0) / 2.0;
    }
    `;
  _DrawnAnaglyphRune.anaglyphFragmentShader = `
    precision mediump float;
    uniform sampler2D u_sampler_red;
    uniform sampler2D u_sampler_cyan;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(u_sampler_red, v_texturePosition)
                + texture2D(u_sampler_cyan, v_texturePosition) - 1.0;
        gl_FragColor.a = 1.0;
    }
    `;
  var DrawnAnaglyphRune = _DrawnAnaglyphRune;
  var _DrawnHollusionRune = class _DrawnHollusionRune extends DrawnRune {
    constructor(rune, magnitude) {
      super(rune, true);
      this.draw = canvas => __async(this, null, function* () {
        const gl = getWebGlFromCanvas(canvas);
        const runes = white(overlay_frac(0.999999999, blank, scale3(2.2, square))).flatten().concat(this.rune.flatten());
        const xshiftMax = runes[0].hollusionDistance;
        const period = 2e3;
        const frameCount = 50;
        const frameBuffer = [];
        const renderFrame = framePos => __async(this, null, function* () {
          const fb = initFramebufferObject(gl);
          const cameraMatrix = mat4_exports.create();
          let xshift = framePos * (period / frameCount) % period;
          if (xshift > period / 2) {
            xshift = period - xshift;
          }
          xshift = xshiftMax * (2 * (2 * xshift / period) - 1);
          mat4_exports.lookAt(cameraMatrix, vec3_exports.fromValues(xshift, 0, 0), vec3_exports.fromValues(0, 0, -0.4), vec3_exports.fromValues(0, 1, 0));
          yield drawRunesToFrameBuffer(gl, runes, cameraMatrix, new Float32Array([1, 1, 1, 1]), fb.framebuffer, true);
          return fb;
        });
        for (let i = 0; i < frameCount; i += 1) {
          frameBuffer.push(yield renderFrame(i));
        }
        const copyShaderProgram = initShaderProgram(gl, _DrawnHollusionRune.copyVertexShader, _DrawnHollusionRune.copyFragmentShader);
        gl.useProgram(copyShaderProgram);
        const texturePt = gl.getUniformLocation(copyShaderProgram, "uTexture");
        const vertexPositionPointer = gl.getAttribLocation(copyShaderProgram, "a_position");
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPositionPointer);
        let lastTime = 0;
        function render(timeInMs) {
          if (timeInMs - lastTime < period / frameCount) return;
          lastTime = timeInMs;
          const framePos = Math.floor(timeInMs / (period / frameCount)) % frameCount;
          const fbObject = frameBuffer[framePos];
          gl.clearColor(1, 1, 1, 1);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, fbObject.texture);
          gl.uniform1i(texturePt, 0);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        return render;
      });
      this.rune.hollusionDistance = magnitude;
    }
  };
  _DrawnHollusionRune.copyVertexShader = `
    precision mediump float;
    attribute vec4 a_position;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_Position = a_position;
        // texture position is in [0,1], vertex position is in [-1,1]
        v_texturePosition.x = (a_position.x + 1.0) / 2.0;
        v_texturePosition.y = (a_position.y + 1.0) / 2.0;
    }
    `;
  _DrawnHollusionRune.copyFragmentShader = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(uTexture, v_texturePosition);
    }
    `;
  var DrawnHollusionRune = _DrawnHollusionRune;
  var beside = RuneFunctions.beside;
  var beside_frac = RuneFunctions.beside_frac;
  var black = RuneColours.black;
  var blank = RuneFunctions.blank;
  var blue = RuneColours.blue;
  var brown = RuneColours.brown;
  var circle = RuneFunctions.circle;
  var color = RuneFunctions.color;
  var colour_with_hue = RuneColours.colour_with_hue;
  var corner = RuneFunctions.corner;
  var flip_horiz = RuneFunctions.flip_horiz;
  var flip_vert = RuneFunctions.flip_vert;
  var from_url = RuneFunctions.from_url;
  var green = RuneColours.green;
  var heart = RuneFunctions.heart;
  var indigo = RuneColours.indigo;
  var make_cross = RuneFunctions.make_cross;
  var nova = RuneFunctions.nova;
  var orange = RuneColours.orange;
  var overlay = RuneFunctions.overlay;
  var overlay_frac = RuneFunctions.overlay_frac;
  var pentagram = RuneFunctions.pentagram;
  var pink = RuneColours.pink;
  var purple = RuneColours.purple;
  var quarter_turn_left = RuneFunctions.quarter_turn_left;
  var quarter_turn_right = RuneFunctions.quarter_turn_right;
  var random_color = RuneColours.random_color;
  var rcross = RuneFunctions.rcross;
  var red = RuneColours.red;
  var ribbon = RuneFunctions.ribbon;
  var rotate2 = RuneFunctions.rotate;
  var sail = RuneFunctions.sail;
  var scale3 = RuneFunctions.scale;
  var scale_independent = RuneFunctions.scale_independent;
  var stack = RuneFunctions.stack;
  var stack_frac = RuneFunctions.stack_frac;
  var stackn = RuneFunctions.stackn;
  var square = RuneFunctions.square;
  var translate2 = RuneFunctions.translate;
  var triangle = RuneFunctions.triangle;
  var turn_upside_down = RuneFunctions.turn_upside_down;
  var yellow = RuneColours.yellow;
  var white = RuneColours.white;
  var RUNE_CHANNEL_ID = "sourceacademy-rune-channel";
  var RUNE_TAB_NAME = "Rune";
  function serializeTexture(texture) {
    if (texture === null) return null;
    if (typeof texture === "string") return texture;
    return texture.src;
  }
  function serializeRune(rune) {
    return {
      vertices: Array.from(rune.vertices),
      colors: rune.colors === null ? null : Array.from(rune.colors),
      transformMatrix: Array.from(rune.transformMatrix),
      subRunes: rune.subRunes.map(serializeRune),
      textureUrl: serializeTexture(rune.texture),
      hollusionDistance: rune.hollusionDistance
    };
  }
  var _RuneModulePlugin = class _RuneModulePlugin extends o3 {
    constructor(conduit, [runeChannel], evaluator, tabLoader) {
      if (!runeChannel) {
        throw new e2("Rune channel is required but was not provided.");
      }
      super(conduit, [runeChannel], evaluator);
      this.id = "rune";
      this.exportedNames = ["anaglyph", "animate_anaglyph", "animate_rune", "beside", "beside_frac", "black", "blue", "brown", "color", "colour_with_hue", "flip_horiz", "flip_vert", "from_url", "green", "hollusion", "hollusion_magnitude", "indigo", "make_cross", "orange", "overlay", "overlay_frac", "pink", "purple", "quarter_turn_left", "quarter_turn_right", "random_color", "red", "rotate", "scale", "scale_independent", "show", "stack", "stack_frac", "stackn", "translate", "turn_upside_down", "white", "yellow"];
      this.__displayed = [];
      this.__initialised = false;
      this.__tabLoaded = false;
      this.__tabRequested = false;
      this.__runeChannel = runeChannel;
      this.__tabLoader = tabLoader;
      this.__runeChannel.subscribe(message => {
        if (message.type === "request") {
          this.__tabRequested = true;
          this.__displayed.forEach(displayedMessage => this.__runeChannel.send(displayedMessage));
        }
      });
    }
    initialise() {
      return __async(this, null, function* () {
        if (this.__initialised) return;
        this.__initialised = true;
        yield __superGet(_RuneModulePlugin.prototype, this, "initialise").call(this);
        for (const name in RuneFunctions) {
          const value = RuneFunctions[name];
          if (!(value instanceof Rune)) {
            continue;
          }
          this[name] = value;
          this.exports.push({
            symbol: name,
            value: yield this.__makeRune(value)
          });
        }
      });
    }
    __loadRuneTab() {
      if (this.__tabLoaded || this.__tabLoader === void 0) return;
      const tabName = this.__tabLoader.tabs.find(tab => tab === RUNE_TAB_NAME);
      if (tabName === void 0) return;
      this.__tabLoader.loadTab(tabName);
      this.__tabLoaded = true;
    }
    __display(message) {
      return __async(this, null, function* () {
        this.__displayed.push(message);
        this.__loadRuneTab();
        if (this.__tabRequested) {
          this.__runeChannel.send(message);
        }
      });
    }
    __getRune(rune, funcName) {
      return __async(this, null, function* () {
        const value = yield this.evaluator.opaque_get(rune);
        throwIfNotRune(funcName, value);
        return value;
      });
    }
    __makeRune(rune) {
      return __async(this, null, function* () {
        return yield this.evaluator.opaque_make(rune, true);
      });
    }
    __callUnaryRune(arg, funcName, operation) {
      return __async(this, null, function* () {
        return this.__makeRune(operation(yield this.__getRune(arg, funcName)));
      });
    }
    __sendRuneRender(rune, message) {
      return __async(this, null, function* () {
        yield this.__display(__spreadProps(__spreadValues({}, message), {
          rune: serializeRune(rune)
        }));
      });
    }
    __evaluateAnimationFrames(duration, fps, func, funcName) {
      return __asyncGenerator(this, null, function* () {
        const frameCount = Math.max(1, Math.ceil(duration * fps) + 1);
        const frames = [];
        for (let frame = 0; frame < frameCount; frame += 1) {
          const timestamp = Math.min(frame / fps, duration);
          const result = yield* __yieldStar(this.evaluator.closure_call_unchecked(func, [{
            type: E.NUMBER,
            value: timestamp
          }]));
          frames.push(serializeRune(yield new __await(this.__getRune(result, funcName))));
        }
        return frames;
      });
    }
    show(rune) {
      return __asyncGenerator(this, null, function* () {
        const value = yield new __await(this.__getRune(rune, "show"));
        yield new __await(this.__sendRuneRender(value, {
          type: "render",
          mode: "normal"
        }));
        return rune;
      });
    }
    anaglyph(rune) {
      return __asyncGenerator(this, null, function* () {
        const value = yield new __await(this.__getRune(rune, "anaglyph"));
        yield new __await(this.__sendRuneRender(value, {
          type: "render",
          mode: "anaglyph"
        }));
        return rune;
      });
    }
    hollusion_magnitude(rune, magnitude) {
      return __asyncGenerator(this, null, function* () {
        const value = yield new __await(this.__getRune(rune, "hollusion_magnitude"));
        yield new __await(this.__sendRuneRender(value, {
          type: "render",
          mode: "hollusion",
          magnitude: magnitude.value
        }));
        return rune;
      });
    }
    hollusion(rune) {
      return __asyncGenerator(this, null, function* () {
        const value = yield new __await(this.__getRune(rune, "hollusion"));
        yield new __await(this.__sendRuneRender(value, {
          type: "render",
          mode: "hollusion",
          magnitude: 0.1
        }));
        return rune;
      });
    }
    animate_rune(duration, fps, func) {
      return __asyncGenerator(this, null, function* () {
        const frames = yield* __yieldStar(this.__evaluateAnimationFrames(duration.value, fps.value, func, "animate_rune"));
        const message = {
          type: "animation",
          mode: "normal",
          duration: duration.value,
          fps: fps.value,
          frames
        };
        yield new __await(this.__display(message));
        return yield new __await(this.evaluator.opaque_make({
          message,
          toReplString: () => "<AnimatedRune>"
        }, true));
      });
    }
    animate_anaglyph(duration, fps, func) {
      return __asyncGenerator(this, null, function* () {
        const frames = yield* __yieldStar(this.__evaluateAnimationFrames(duration.value, fps.value, func, "animate_anaglyph"));
        const message = {
          type: "animation",
          mode: "anaglyph",
          duration: duration.value,
          fps: fps.value,
          frames
        };
        yield new __await(this.__display(message));
        return yield new __await(this.evaluator.opaque_make({
          message,
          toReplString: () => "<AnimatedRune>"
        }, true));
      });
    }
    from_url(imageUrl) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(from_url(imageUrl.value)));
      });
    }
    scale_independent(ratioX, ratioY, rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(scale_independent(ratioX.value, ratioY.value, yield new __await(this.__getRune(rune, scale_independent.name)))));
      });
    }
    scale(ratio, rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(scale3(ratio.value, yield new __await(this.__getRune(rune, scale3.name)))));
      });
    }
    translate(x, y, rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(translate2(x.value, y.value, yield new __await(this.__getRune(rune, translate2.name)))));
      });
    }
    rotate(rad, rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(rotate2(rad.value, yield new __await(this.__getRune(rune, rotate2.name)))));
      });
    }
    stack_frac(frac, rune1, rune2) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(stack_frac(frac.value, yield new __await(this.__getRune(rune1, stack_frac.name)), yield new __await(this.__getRune(rune2, stack_frac.name)))));
      });
    }
    stack(rune1, rune2) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(stack(yield new __await(this.__getRune(rune1, stack.name)), yield new __await(this.__getRune(rune2, stack.name)))));
      });
    }
    stackn(n3, rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(stackn(n3.value, yield new __await(this.__getRune(rune, stackn.name)))));
      });
    }
    quarter_turn_right(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, quarter_turn_right.name, quarter_turn_right));
      });
    }
    quarter_turn_left(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, quarter_turn_left.name, quarter_turn_left));
      });
    }
    turn_upside_down(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, turn_upside_down.name, turn_upside_down));
      });
    }
    beside_frac(frac, rune1, rune2) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(beside_frac(frac.value, yield new __await(this.__getRune(rune1, beside_frac.name)), yield new __await(this.__getRune(rune2, beside_frac.name)))));
      });
    }
    beside(rune1, rune2) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(beside(yield new __await(this.__getRune(rune1, beside.name)), yield new __await(this.__getRune(rune2, beside.name)))));
      });
    }
    flip_vert(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, flip_vert.name, flip_vert));
      });
    }
    flip_horiz(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, flip_horiz.name, flip_horiz));
      });
    }
    make_cross(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, make_cross.name, make_cross));
      });
    }
    overlay_frac(frac, rune1, rune2) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(overlay_frac(frac.value, yield new __await(this.__getRune(rune1, overlay_frac.name)), yield new __await(this.__getRune(rune2, overlay_frac.name)))));
      });
    }
    overlay(rune1, rune2) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(overlay(yield new __await(this.__getRune(rune1, overlay.name)), yield new __await(this.__getRune(rune2, overlay.name)))));
      });
    }
    color(rune, r2, g, b) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(color(yield new __await(this.__getRune(rune, color.name)), r2.value, g.value, b.value)));
      });
    }
    colour_with_hue(rune, hue) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__makeRune(colour_with_hue(yield new __await(this.__getRune(rune, colour_with_hue.name)), hue.value)));
      });
    }
    black(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, black.name, black));
      });
    }
    blue(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, blue.name, blue));
      });
    }
    brown(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, brown.name, brown));
      });
    }
    green(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, green.name, green));
      });
    }
    indigo(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, indigo.name, indigo));
      });
    }
    red(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, red.name, red));
      });
    }
    pink(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, pink.name, pink));
      });
    }
    orange(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, orange.name, orange));
      });
    }
    purple(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, purple.name, purple));
      });
    }
    white(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, white.name, white));
      });
    }
    yellow(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, yellow.name, yellow));
      });
    }
    random_color(rune) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.__callUnaryRune(rune, random_color.name, random_color));
      });
    }
  };
  _RuneModulePlugin.channelAttach = [RUNE_CHANNEL_ID];
  var RuneModulePlugin = _RuneModulePlugin;
  attachModuleMethod(RuneModulePlugin, "anaglyph", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "animate_anaglyph", [E.NUMBER, E.NUMBER, E.CLOSURE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "animate_rune", [E.NUMBER, E.NUMBER, E.CLOSURE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "beside", [E.OPAQUE, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "beside_frac", [E.NUMBER, E.OPAQUE, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "black", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "blue", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "brown", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "color", [E.OPAQUE, E.NUMBER, E.NUMBER, E.NUMBER], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "colour_with_hue", [E.OPAQUE, E.NUMBER], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "flip_horiz", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "flip_vert", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "from_url", [E.CONST_STRING], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "green", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "hollusion", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "hollusion_magnitude", [E.OPAQUE, E.NUMBER], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "indigo", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "make_cross", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "orange", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "overlay", [E.OPAQUE, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "overlay_frac", [E.NUMBER, E.OPAQUE, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "pink", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "purple", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "quarter_turn_left", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "quarter_turn_right", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "random_color", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "red", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "rotate", [E.NUMBER, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "scale", [E.NUMBER, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "scale_independent", [E.NUMBER, E.NUMBER, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "show", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "stack", [E.OPAQUE, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "stack_frac", [E.NUMBER, E.OPAQUE, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "stackn", [E.NUMBER, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "translate", [E.NUMBER, E.NUMBER, E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "turn_upside_down", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "white", [E.OPAQUE], E.OPAQUE);
  attachModuleMethod(RuneModulePlugin, "yellow", [E.OPAQUE], E.OPAQUE);
  return __toCommonJS(index_exports);
};