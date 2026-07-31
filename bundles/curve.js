export default require => {
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
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a3, b) => (typeof require !== "undefined" ? require : a3)[b]
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
    default: () => CurveModulePlugin
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
  var vsS = `
attribute vec4 aFragColor;
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 aColor;

void main() {
  gl_PointSize = 2.0;
  aColor = aFragColor;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`;
  var fsS = `
varying lowp vec4 aColor;
precision mediump float;
void main() {
  gl_FragColor = aColor;
}`;
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
      throw new e2("WebGLShader not available.");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
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
  var Point = class {
    constructor(x, y, z, color) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.color = color;
      this.toReplString = () => `(${this.x}, ${this.y}, ${this.z}, Color: ${this.color})`;
    }
  };
  var _CurveDrawn = class _CurveDrawn {
    constructor(drawMode, numPoints, space, drawCubeArray, curvePosArray, curveColorArray) {
      this.drawMode = drawMode;
      this.numPoints = numPoints;
      this.space = space;
      this.drawCubeArray = drawCubeArray;
      this.curvePosArray = curvePosArray;
      this.curveColorArray = curveColorArray;
      this.toReplString = () => "<CurveDrawn>";
      this.init = canvas => {
        this.renderingContext = canvas.getContext("webgl");
        if (!this.renderingContext) {
          throw new e2("Rendering context cannot be null.");
        }
        const cubeBuffer = this.renderingContext.createBuffer();
        this.renderingContext.bindBuffer(this.renderingContext.ARRAY_BUFFER, cubeBuffer);
        this.renderingContext.bufferData(this.renderingContext.ARRAY_BUFFER, new Float32Array(this.drawCubeArray), this.renderingContext.STATIC_DRAW);
        const curveBuffer = this.renderingContext.createBuffer();
        this.renderingContext.bindBuffer(this.renderingContext.ARRAY_BUFFER, curveBuffer);
        this.renderingContext.bufferData(this.renderingContext.ARRAY_BUFFER, new Float32Array(this.curvePosArray), this.renderingContext.STATIC_DRAW);
        const curveColorBuffer = this.renderingContext.createBuffer();
        this.renderingContext.bindBuffer(this.renderingContext.ARRAY_BUFFER, curveColorBuffer);
        this.renderingContext.bufferData(this.renderingContext.ARRAY_BUFFER, new Float32Array(this.curveColorArray), this.renderingContext.STATIC_DRAW);
        const shaderProgram = initShaderProgram(this.renderingContext, vsS, fsS);
        this.programs = {
          program: shaderProgram,
          attribLocations: {
            vertexPosition: this.renderingContext.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: this.renderingContext.getAttribLocation(shaderProgram, "aFragColor")
          },
          uniformLocations: {
            projectionMatrix: this.renderingContext.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: this.renderingContext.getUniformLocation(shaderProgram, "uModelViewMatrix")
          }
        };
        this.buffersInfo = {
          cubeBuffer,
          curveBuffer,
          curveColorBuffer
        };
      };
      this.redraw = angle2 => {
        if (!this.renderingContext) {
          return;
        }
        const gl = this.renderingContext;
        const itemSize = this.space === "3D" ? 3 : 2;
        gl.clearColor(1, 1, 1, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const transMat = mat4_exports.create();
        const projMat = mat4_exports.create();
        if (this.space === "3D") {
          const padding = Math.sqrt(1 / 3.1);
          mat4_exports.scale(transMat, transMat, vec3_exports.fromValues(padding, padding, padding));
          mat4_exports.translate(transMat, transMat, [0, 0, -5]);
          mat4_exports.rotate(transMat, transMat, -(Math.PI / 2), [1, 0, 0]);
          mat4_exports.rotate(transMat, transMat, angle2, [0, 0, 1]);
          const fieldOfView = 45 * Math.PI / 180;
          const aspect = gl.canvas.width / gl.canvas.height;
          const zNear = 0.01;
          const zFar = 50;
          mat4_exports.perspective(projMat, fieldOfView, aspect, zNear, zFar);
        }
        gl.useProgram(this.programs.program);
        gl.uniformMatrix4fv(this.programs.uniformLocations.projectionMatrix, false, new Float32Array(projMat));
        gl.uniformMatrix4fv(this.programs.uniformLocations.modelViewMatrix, false, new Float32Array(transMat));
        gl.enableVertexAttribArray(this.programs.attribLocations.vertexPosition);
        gl.enableVertexAttribArray(this.programs.attribLocations.vertexColor);
        if (this.space === "3D") {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.buffersInfo.cubeBuffer);
          gl.vertexAttribPointer(this.programs.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
          const colors = [];
          for (let i = 0; i < 16; i += 1) {
            colors.push(0.6, 0.6, 0.6, 1);
          }
          const colorBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
          gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.LINE_STRIP, 0, 16);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffersInfo.curveBuffer);
        gl.vertexAttribPointer(this.programs.attribLocations.vertexPosition, itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffersInfo.curveColorBuffer);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
        if (this.drawMode === "lines") {
          gl.drawArrays(gl.LINE_STRIP, 0, this.numPoints + 1);
        } else {
          gl.drawArrays(gl.POINTS, 0, this.numPoints + 1);
        }
      };
      this.toSerializable = () => ({
        drawMode: this.drawMode,
        numPoints: this.numPoints,
        space: this.space,
        drawCubeArray: this.drawCubeArray,
        curvePosArray: this.curvePosArray,
        curveColorArray: this.curveColorArray
      });
      this.renderingContext = null;
      this.programs = null;
      this.buffersInfo = null;
    }
    get is3D() {
      return this.space === "3D";
    }
  };
  _CurveDrawn.fromSerializable = serialized => {
    const {drawMode, numPoints, space, drawCubeArray, curvePosArray, curveColorArray} = serialized;
    return new _CurveDrawn(drawMode, numPoints, space, drawCubeArray, curvePosArray, curveColorArray);
  };
  var CurveDrawn = _CurveDrawn;
  function generateCurve(evaluator, scaleMode, drawMode, numPoints, func, space, isFullView) {
    return __asyncGenerator(this, null, function* () {
      const curvePosArray = [];
      const curveColorArray = [];
      const drawCubeArray = [];
      let min_x = Infinity;
      let max_x = -Infinity;
      let min_y = Infinity;
      let max_y = -Infinity;
      let min_z = Infinity;
      let max_z = -Infinity;
      for (let i = 0; i <= numPoints; i += 1) {
        const point = yield new __await(evaluator.opaque_get(yield* __yieldStar(evaluator.closure_call(func, [{
          type: E.NUMBER,
          value: i / numPoints
        }], E.OPAQUE))));
        if (!(point instanceof Point)) {
          throw new e2(`Expected curve to return a point, got '${JSON.stringify(point)}' at t=${i / numPoints}`);
        }
        const x = point.x * 2 - 1;
        const y = point.y * 2 - 1;
        const z = point.z * 2 - 1;
        if (space === "2D") {
          curvePosArray.push(x, y);
        } else {
          curvePosArray.push(x, y, z);
        }
        const color_r = point.color[0];
        const color_g = point.color[1];
        const color_b = point.color[2];
        const color_a = point.color[3];
        curveColorArray.push(color_r, color_g, color_b, color_a);
        min_x = Math.min(min_x, x);
        max_x = Math.max(max_x, x);
        min_y = Math.min(min_y, y);
        max_y = Math.max(max_y, y);
        min_z = Math.min(min_z, z);
        max_z = Math.max(max_z, z);
      }
      if (isFullView) {
        const horiz_padding = 0.05 * (max_x - min_x);
        min_x -= horiz_padding;
        max_x += horiz_padding;
        const vert_padding = 0.05 * (max_y - min_y);
        min_y -= vert_padding;
        max_y += vert_padding;
        const depth_padding = 0.05 * (max_z - min_z);
        min_z -= depth_padding;
        max_z += depth_padding;
      }
      if (space === "3D") {
        drawCubeArray.push(-1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1);
        drawCubeArray.push(1, 1, -1, 1, -1, -1, -1, -1, -1, 1, -1, -1);
        drawCubeArray.push(1, -1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1);
        drawCubeArray.push(-1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1);
      } else {
        min_z = 0;
        max_z = 0;
      }
      if (scaleMode === "fit") {
        const center = [(min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2];
        let scale4 = Math.max(max_x - min_x, max_y - min_y, max_z - min_z);
        scale4 = scale4 === 0 ? 1 : scale4;
        if (space === "3D") {
          for (let i = 0; i < curvePosArray.length; i += 1) {
            if (i % 3 === 0) {
              curvePosArray[i] -= center[0];
              curvePosArray[i] /= scale4 / 2;
            } else if (i % 3 === 1) {
              curvePosArray[i] -= center[1];
              curvePosArray[i] /= scale4 / 2;
            } else {
              curvePosArray[i] -= center[2];
              curvePosArray[i] /= scale4 / 2;
            }
          }
        } else {
          for (let i = 0; i < curvePosArray.length; i += 1) {
            if (i % 2 === 0) {
              curvePosArray[i] -= center[0];
              curvePosArray[i] /= scale4 / 2;
            } else {
              curvePosArray[i] -= center[1];
              curvePosArray[i] /= scale4 / 2;
            }
          }
        }
      } else if (scaleMode === "stretch") {
        const center = [(min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2];
        const x_scale = max_x === min_x ? 1 : max_x - min_x;
        const y_scale = max_y === min_y ? 1 : max_y - min_y;
        const z_scale = max_z === min_z ? 1 : max_z - min_z;
        if (space === "3D") {
          for (let i = 0; i < curvePosArray.length; i += 1) {
            if (i % 3 === 0) {
              curvePosArray[i] -= center[0];
              curvePosArray[i] /= x_scale / 2;
            } else if (i % 3 === 1) {
              curvePosArray[i] -= center[1];
              curvePosArray[i] /= y_scale / 2;
            } else {
              curvePosArray[i] -= center[2];
              curvePosArray[i] /= z_scale / 2;
            }
          }
        } else {
          for (let i = 0; i < curvePosArray.length; i += 1) {
            if (i % 2 === 0) {
              curvePosArray[i] -= center[0];
              curvePosArray[i] /= x_scale / 2;
            } else {
              curvePosArray[i] -= center[1];
              curvePosArray[i] /= y_scale / 2;
            }
          }
        }
      }
      return new CurveDrawn(drawMode, numPoints, space, drawCubeArray, curvePosArray, curveColorArray);
    });
  }
  var glAnimationSymbol = Symbol.for("glAnimation");
  var glAnimation = class _glAnimation {
    constructor(duration, fps) {
      this.duration = duration;
      this.fps = fps;
    }
    get _anim_symbol() {
      return glAnimationSymbol;
    }
    static [Symbol.hasInstance](constructor) {
      if (typeof constructor !== "object" || constructor === null) return false;
      return ("_anim_symbol" in constructor) && constructor._anim_symbol === glAnimationSymbol;
    }
    static isAnimation(obj) {
      return obj instanceof _glAnimation;
    }
  };
  var _AnimatedCurve = class _AnimatedCurve extends glAnimation {
    constructor(duration, fps, frames, is3D) {
      super(duration, fps);
      this.frames = frames;
      this.is3D = is3D;
      this.toReplString = () => "<AnimatedCurve>";
      this.toSerializable = () => ({
        type: "animation",
        duration: this.duration,
        fps: this.fps,
        is3D: this.is3D,
        frames: this.frames.map(frame => frame.toSerializable())
      });
      this.angle = 0;
    }
    getFrame(timestamp) {
      const frameIndex = Math.floor(timestamp / this.duration * this.frames.length) % this.frames.length;
      const curveDrawn = this.frames[frameIndex];
      return {
        draw: canvas => {
          curveDrawn.init(canvas);
          curveDrawn.redraw(this.angle);
        }
      };
    }
  };
  _AnimatedCurve.fromSerializable = serialized => {
    const {duration, fps, is3D, frames} = serialized[0];
    return new _AnimatedCurve(duration, fps, frames.map(frame => CurveDrawn.fromSerializable(frame)), is3D);
  };
  var AnimatedCurve = _AnimatedCurve;
  function getRenderFunctionCreator(scaleMode, drawMode, space, isFullView, name) {
    function renderFuncCreator(evaluator, numPoints) {
      if (numPoints <= 0 || numPoints > 65535 || !Number.isInteger(numPoints)) {
        throw new e2(`${name}: The number of points must be a positive integer less than or equal to 65535. Got: ${numPoints}`);
      }
      function renderFunc(curve) {
        return __asyncGenerator(this, null, function* () {
          try {
            yield new __await(evaluator.closure_arity_assert(curve, 1));
          } catch (e5) {
            throw new e2("The provided curve is not a valid Curve function. A Curve function must take exactly one parameter (a number t between 0 and 1) and return a Point or 3D Point depending on whether it is a 2D or 3D curve.");
          }
          const curveDrawn = yield* __yieldStar(generateCurve(evaluator, scaleMode, drawMode, numPoints, curve, space, isFullView));
          return curveDrawn;
        });
      }
      renderFunc.is3D = space === "3D";
      renderFunc.toReplString = () => `<${space === "3D" ? "3D" : ""}RenderFunction(${numPoints})>`;
      return renderFunc;
    }
    Object.defineProperty(renderFuncCreator, "name", {
      value: name
    });
    renderFuncCreator.scaleMode = scaleMode;
    renderFuncCreator.drawMode = drawMode;
    renderFuncCreator.space = space;
    renderFuncCreator.isFullView = isFullView;
    return renderFuncCreator;
  }
  var RenderFunctionCreators = class {};
  RenderFunctionCreators.draw_connected = getRenderFunctionCreator("none", "lines", "2D", false, "draw_connected");
  RenderFunctionCreators.draw_connected_full_view = getRenderFunctionCreator("stretch", "lines", "2D", true, "draw_connected_full_view");
  RenderFunctionCreators.draw_connected_full_view_proportional = getRenderFunctionCreator("fit", "lines", "2D", true, "draw_connected_full_view_proportional");
  RenderFunctionCreators.draw_points = getRenderFunctionCreator("none", "points", "2D", false, "draw_points");
  RenderFunctionCreators.draw_points_full_view = getRenderFunctionCreator("stretch", "points", "2D", true, "draw_points_full_view");
  RenderFunctionCreators.draw_points_full_view_proportional = getRenderFunctionCreator("fit", "points", "2D", true, "draw_points_full_view_proportional");
  RenderFunctionCreators.draw_3D_connected = getRenderFunctionCreator("none", "lines", "3D", false, "draw_3D_connected");
  RenderFunctionCreators.draw_3D_connected_full_view = getRenderFunctionCreator("stretch", "lines", "3D", true, "draw_3D_connected_full_view");
  RenderFunctionCreators.draw_3D_connected_full_view_proportional = getRenderFunctionCreator("fit", "lines", "3D", true, "draw_3D_connected_full_view_proportional");
  RenderFunctionCreators.draw_3D_points = getRenderFunctionCreator("none", "points", "3D", false, "draw_3D_points");
  RenderFunctionCreators.draw_3D_points_full_view = getRenderFunctionCreator("stretch", "points", "3D", true, "draw_3D_points_full_view");
  RenderFunctionCreators.draw_3D_points_full_view_proportional = getRenderFunctionCreator("fit", "points", "3D", true, "draw_3D_points_full_view_proportional");
  var draw_connected = RenderFunctionCreators.draw_connected;
  var draw_connected_full_view = RenderFunctionCreators.draw_connected_full_view;
  var draw_connected_full_view_proportional = RenderFunctionCreators.draw_connected_full_view_proportional;
  var draw_points = RenderFunctionCreators.draw_points;
  var draw_points_full_view = RenderFunctionCreators.draw_points_full_view;
  var draw_points_full_view_proportional = RenderFunctionCreators.draw_points_full_view_proportional;
  var draw_3D_connected = RenderFunctionCreators.draw_3D_connected;
  var draw_3D_connected_full_view = RenderFunctionCreators.draw_3D_connected_full_view;
  var draw_3D_connected_full_view_proportional = RenderFunctionCreators.draw_3D_connected_full_view_proportional;
  var draw_3D_points = RenderFunctionCreators.draw_3D_points;
  var draw_3D_points_full_view = RenderFunctionCreators.draw_3D_points_full_view;
  var draw_3D_points_full_view_proportional = RenderFunctionCreators.draw_3D_points_full_view_proportional;
  function getFrameCount(duration, fps, functionName) {
    l(duration, functionName, Number.MIN_VALUE, Number.MAX_VALUE, false, "duration");
    l(fps, functionName, Number.MIN_VALUE, Number.MAX_VALUE, false, "fps");
    const frameCount = Math.floor(fps * duration);
    l(frameCount, functionName, 1, Number.MAX_SAFE_INTEGER, true, "frameCount");
    return frameCount;
  }
  var CurveAnimators = class _CurveAnimators {
    static animate_curve(evaluator, duration, fps, drawer, func) {
      return __asyncGenerator(this, null, function* () {
        if (drawer.is3D) {
          throw new e2(`${animate_curve.name} cannot be used with 3D draw function!`);
        }
        const frameCount = getFrameCount(duration, fps, _CurveAnimators.animate_curve.name);
        const frames = [];
        for (let i = 0; i < frameCount; i++) {
          const t4 = i / frameCount;
          frames.push(yield* __yieldStar(drawer(yield* __yieldStar(evaluator.closure_call(func, [{
            type: E.NUMBER,
            value: t4
          }], E.CLOSURE)))));
        }
        const anim = new AnimatedCurve(duration, fps, frames, false);
        return anim;
      });
    }
    static animate_3D_curve(evaluator, duration, fps, drawer, func) {
      return __asyncGenerator(this, null, function* () {
        if (!drawer.is3D) {
          throw new e2(`${animate_3D_curve.name} cannot be used with 2D draw function!`);
        }
        const frameCount = getFrameCount(duration, fps, _CurveAnimators.animate_3D_curve.name);
        const frames = [];
        for (let i = 0; i < frameCount; i++) {
          const t4 = i / frameCount;
          frames.push(yield* __yieldStar(drawer(yield* __yieldStar(evaluator.closure_call(func, [{
            type: E.NUMBER,
            value: t4
          }], E.CLOSURE)))));
        }
        const anim = new AnimatedCurve(duration, fps, frames, true);
        return anim;
      });
    }
  };
  var animate_curve = CurveAnimators.animate_curve;
  var animate_3D_curve = CurveAnimators.animate_3D_curve;
  var import_rttcErrors = __require("js-slang/dist/errors/rttcErrors");
  var import_base = __require("js-slang/dist/errors/base");
  var import_rttc = __require("js-slang/dist/utils/rttc");
  var import_operators = __require("js-slang/dist/utils/operators");
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
  function clamp(value, bound1, bound2) {
    if (bound2 == null) return Math.min(value, bound1);
    return Math.min(Math.max(value, bound1), bound2);
  }
  function throwIfNotPoint(obj, func_name, param_name) {
    if (!(obj instanceof Point)) {
      throw new n(func_name, param_name, "Point", obj);
    }
  }
  function defineCurveTransformer(evaluator, f2) {
    return __async(this, null, function* () {
      return yield evaluator.closure_make({
        args: [E.CLOSURE],
        returnType: E.CLOSURE
      }, function (curve) {
        return __asyncGenerator(this, null, function* () {
          return yield new __await(evaluator.closure_make({
            args: [E.NUMBER],
            returnType: E.OPAQUE
          }, function (t4) {
            return __asyncGenerator(this, null, function* () {
              const pointId = yield* __yieldStar(evaluator.closure_call(curve, [t4], E.OPAQUE));
              const point = yield new __await(evaluator.opaque_get(pointId));
              return yield new __await(evaluator.opaque_make(yield* __yieldStar(f2(point, t4.value))));
            });
          }));
        });
      });
    });
  }
  var _CurveFunctions = class _CurveFunctions {
    static make_point(x, y) {
      return new Point(x, y, 0, [0, 0, 0, 1]);
    }
    static make_3D_point(x, y, z) {
      return new Point(x, y, z, [0, 0, 0, 1]);
    }
    static make_color_point(x, y, r2, g, b) {
      r2 = clamp(r2, 0, 255);
      g = clamp(g, 0, 255);
      b = clamp(b, 0, 255);
      return new Point(x, y, 0, [r2 / 255, g / 255, b / 255, 1]);
    }
    static make_3D_color_point(x, y, z, r2, g, b) {
      r2 = clamp(r2, 0, 255);
      g = clamp(g, 0, 255);
      b = clamp(b, 0, 255);
      return new Point(x, y, z, [r2 / 255, g / 255, b / 255, 1]);
    }
    static connect_ends(evaluator, curve1, curve2) {
      return __asyncGenerator(this, null, function* () {
        const startPointOfCurve2Id = yield* __yieldStar(evaluator.closure_call(curve2, [{
          type: E.NUMBER,
          value: 0
        }], E.OPAQUE));
        const endPointOfCurve1Id = yield* __yieldStar(evaluator.closure_call(curve1, [{
          type: E.NUMBER,
          value: 1
        }], E.OPAQUE));
        const startPointOfCurve2 = yield new __await(evaluator.opaque_get(startPointOfCurve2Id));
        const endPointOfCurve1 = yield new __await(evaluator.opaque_get(endPointOfCurve1Id));
        return yield* __yieldStar(connect_rigidly(evaluator, curve1, yield* __yieldStar(evaluator.closure_call(yield* __yieldStar(translate2(evaluator, x_of(endPointOfCurve1) - x_of(startPointOfCurve2), y_of(endPointOfCurve1) - y_of(startPointOfCurve2), z_of(endPointOfCurve1) - z_of(startPointOfCurve2))), [curve2], E.CLOSURE))));
      });
    }
    static connect_rigidly(evaluator, curve1, curve2) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(evaluator.closure_make({
          args: [E.NUMBER],
          returnType: E.OPAQUE
        }, function (t4) {
          return __asyncGenerator(this, null, function* () {
            return t4.value < 1 / 2 ? yield* __yieldStar(evaluator.closure_call(curve1, [{
              type: E.NUMBER,
              value: 2 * t4.value
            }], E.OPAQUE)) : yield* __yieldStar(evaluator.closure_call(curve2, [{
              type: E.NUMBER,
              value: 2 * t4.value - 1
            }], E.OPAQUE));
          });
        }));
      });
    }
    static translate(evaluator, x0, y0, z0) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(evaluator.closure_make({
          args: [E.CLOSURE],
          returnType: E.CLOSURE
        }, function (curve) {
          return __asyncGenerator(this, null, function* () {
            return yield new __await(evaluator.closure_make({
              args: [E.NUMBER],
              returnType: E.OPAQUE
            }, function (t4) {
              return __asyncGenerator(this, null, function* () {
                const ctId = yield* __yieldStar(evaluator.closure_call(curve, [t4], E.OPAQUE));
                const ct = yield new __await(evaluator.opaque_get(ctId));
                throwIfNotPoint(ct, translate2.name);
                return yield new __await(evaluator.opaque_make(new Point(x0 + ct.x, y0 + ct.y, z0 + ct.z, [ct.color[0], ct.color[1], ct.color[2], 1])));
              });
            }));
          });
        }));
      });
    }
    static rainbow(evaluator, repeats, phase) {
      return __asyncGenerator(this, null, function* () {
        l(repeats, _CurveFunctions.rainbow.name, 0, void 0, false, "repeats");
        l(phase, _CurveFunctions.rainbow.name, void 0, void 0, false, "phase");
        return defineCurveTransformer(evaluator, function (pt, t4) {
          return __asyncGenerator(this, null, function* () {
            const [r2, g, b] = hueToRgb((t4 * repeats + phase) % 1);
            return make_3D_color_point(x_of(pt), y_of(pt), z_of(pt), r2, g, b);
          });
        });
      });
    }
    static invert(evaluator, original) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(evaluator.closure_make({
          args: [E.NUMBER],
          returnType: E.OPAQUE
        }, function (t4) {
          return __asyncGenerator(this, null, function* () {
            return yield* __yieldStar(evaluator.closure_call(original, [{
              type: E.NUMBER,
              value: 1 - t4.value
            }], E.OPAQUE));
          });
        }));
      });
    }
    static put_in_standard_position(evaluator, curve) {
      return __asyncGenerator(this, null, function* () {
        const start_point_id = yield* __yieldStar(evaluator.closure_call(curve, [{
          type: E.NUMBER,
          value: 0
        }], E.OPAQUE));
        const start_point = yield new __await(evaluator.opaque_get(start_point_id));
        const curve_started_at_origin = yield* __yieldStar(evaluator.closure_call(yield* __yieldStar(translate2(evaluator, -x_of(start_point), -y_of(start_point), 0)), [curve], E.CLOSURE));
        const new_end_point_id = yield* __yieldStar(evaluator.closure_call(curve_started_at_origin, [{
          type: E.NUMBER,
          value: 1
        }], E.OPAQUE));
        const new_end_point = yield new __await(evaluator.opaque_get(new_end_point_id));
        const theta = Math.atan2(y_of(new_end_point), x_of(new_end_point));
        const curve_ended_at_x_axis = yield* __yieldStar(evaluator.closure_call(yield* __yieldStar(rotate_around_origin_3D(evaluator, 0, 0, -theta)), [curve_started_at_origin], E.CLOSURE));
        const end_point_id = yield* __yieldStar(evaluator.closure_call(curve_ended_at_x_axis, [{
          type: E.NUMBER,
          value: 1
        }], E.OPAQUE));
        const end_point_on_x_axis = x_of(yield new __await(evaluator.opaque_get(end_point_id)));
        if (end_point_on_x_axis === 0 || !Number.isFinite(end_point_on_x_axis)) {
          throw new e2(`${_CurveFunctions.put_in_standard_position.name}: Cannot normalize a curve with a zero or non-finite endpoint distance.`);
        }
        return yield* __yieldStar(evaluator.closure_call(yield* __yieldStar(scale_proportional(evaluator, 1 / end_point_on_x_axis)), [curve_ended_at_x_axis], E.CLOSURE));
      });
    }
    static rotate_around_origin_3D(evaluator, a3, b, c2) {
      return __asyncGenerator(this, null, function* () {
        const cthx = Math.cos(a3);
        const sthx = Math.sin(a3);
        const cthy = Math.cos(b);
        const sthy = Math.sin(b);
        const cthz = Math.cos(c2);
        const sthz = Math.sin(c2);
        const mat = [[cthz * cthy, cthz * sthy * sthx - sthz * cthx, cthz * sthy * cthx + sthz * sthx], [sthz * cthy, sthz * sthy * sthx + cthz * cthx, sthz * sthy * cthx - cthz * sthx], [-sthy, cthy * sthx, cthy * cthx]];
        return defineCurveTransformer(evaluator, function (ct) {
          return __asyncGenerator(this, null, function* () {
            throwIfNotPoint(ct, rotate_around_origin_3D.name);
            const coord = [ct.x, ct.y, ct.z];
            let xf = 0;
            let yf = 0;
            let zf = 0;
            for (let i = 0; i < 3; i += 1) {
              xf += mat[0][i] * coord[i];
              yf += mat[1][i] * coord[i];
              zf += mat[2][i] * coord[i];
            }
            const newPoint = new Point(xf, yf, zf, [ct.color[0], ct.color[1], ct.color[2], 1]);
            return newPoint;
          });
        });
      });
    }
    static rotate_around_origin(evaluator, a3) {
      return __asyncGenerator(this, null, function* () {
        const cth = Math.cos(a3);
        const sth = Math.sin(a3);
        return defineCurveTransformer(evaluator, function (ct) {
          return __asyncGenerator(this, null, function* () {
            throwIfNotPoint(ct, rotate_around_origin.name);
            return new Point(cth * ct.x - sth * ct.y, sth * ct.x + cth * ct.y, ct.z, [ct.color[0], ct.color[1], ct.color[2], 1]);
          });
        });
      });
    }
    static scale(evaluator, x, y, z) {
      return __asyncGenerator(this, null, function* () {
        return defineCurveTransformer(evaluator, function (ct) {
          return __asyncGenerator(this, null, function* () {
            throwIfNotPoint(ct, scale3.name);
            return new Point(x * ct.x, y * ct.y, z * ct.z, [ct.color[0], ct.color[1], ct.color[2], 1]);
          });
        });
      });
    }
    static scale_proportional(evaluator, s5) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(scale3(evaluator, s5, s5, s5));
      });
    }
    static compose(evaluator, transformers) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(evaluator.closure_make({
          args: [E.CLOSURE],
          returnType: E.CLOSURE
        }, function (curve) {
          return __asyncGenerator(this, null, function* () {
            let transformedCurve = curve;
            for (const transformer of transformers) {
              transformedCurve = yield* __yieldStar(evaluator.closure_call(transformer, [transformedCurve], E.CLOSURE));
            }
            return transformedCurve;
          });
        }));
      });
    }
    static x_of(pt) {
      throwIfNotPoint(pt, x_of.name);
      return pt.x;
    }
    static y_of(pt) {
      throwIfNotPoint(pt, y_of.name);
      return pt.y;
    }
    static z_of(pt) {
      throwIfNotPoint(pt, z_of.name);
      return pt.z;
    }
    static r_of(pt) {
      throwIfNotPoint(pt, r_of.name);
      return Math.floor(pt.color[0] * 255);
    }
    static g_of(pt) {
      throwIfNotPoint(pt, g_of.name);
      return Math.floor(pt.color[1] * 255);
    }
    static b_of(pt) {
      throwIfNotPoint(pt, b_of.name);
      return Math.floor(pt.color[2] * 255);
    }
    static unit_line_at(evaluator, y) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(evaluator.closure_make({
          args: [E.NUMBER],
          returnType: E.OPAQUE
        }, function (t4) {
          return __asyncGenerator(this, null, function* () {
            return yield new __await(evaluator.opaque_make(make_point(t4.value, y.value)));
          });
        }));
      });
    }
  };
  _CurveFunctions.unit_circle = function (evaluator, t4) {
    return __asyncGenerator(this, null, function* () {
      return yield new __await(evaluator.opaque_make(make_point(Math.cos(2 * Math.PI * t4.value), Math.sin(2 * Math.PI * t4.value))));
    });
  };
  _CurveFunctions.unit_line = function (evaluator, t4) {
    return __asyncGenerator(this, null, function* () {
      return yield new __await(evaluator.opaque_make(make_point(t4.value, 0)));
    });
  };
  _CurveFunctions.arc = function (evaluator, t4) {
    return __asyncGenerator(this, null, function* () {
      return yield new __await(evaluator.opaque_make(make_point(Math.sin(Math.PI * t4.value), Math.cos(Math.PI * t4.value))));
    });
  };
  var CurveFunctions = _CurveFunctions;
  var make_point = CurveFunctions.make_point;
  var make_3D_point = CurveFunctions.make_3D_point;
  var make_color_point = CurveFunctions.make_color_point;
  var make_3D_color_point = CurveFunctions.make_3D_color_point;
  var x_of = CurveFunctions.x_of;
  var y_of = CurveFunctions.y_of;
  var z_of = CurveFunctions.z_of;
  var r_of = CurveFunctions.r_of;
  var g_of = CurveFunctions.g_of;
  var b_of = CurveFunctions.b_of;
  var invert2 = CurveFunctions.invert;
  var translate2 = CurveFunctions.translate;
  var rainbow = CurveFunctions.rainbow;
  var rotate_around_origin_3D = CurveFunctions.rotate_around_origin_3D;
  var rotate_around_origin = CurveFunctions.rotate_around_origin;
  var scale3 = CurveFunctions.scale;
  var scale_proportional = CurveFunctions.scale_proportional;
  var compose = CurveFunctions.compose;
  var put_in_standard_position = CurveFunctions.put_in_standard_position;
  var connect_rigidly = CurveFunctions.connect_rigidly;
  var connect_ends = CurveFunctions.connect_ends;
  var unit_circle = CurveFunctions.unit_circle;
  var unit_line = CurveFunctions.unit_line;
  var unit_line_at = CurveFunctions.unit_line_at;
  var arc = CurveFunctions.arc;
  var CURVE_CHANNEL_ID = "sourceacademy-curve-channel";
  var CurveModulePlugin = class extends o3 {
    constructor(conduit, [curveChannel], evaluator, tabLoader) {
      if (!curveChannel) {
        throw new e2("Curve channel is required but was not provided.");
      }
      super(conduit, [curveChannel], evaluator);
      this.id = "curve";
      this.exportedNames = ["arc", "b_of", "connect_ends", "connect_rigidly", "g_of", "invert", "make_3D_color_point", "make_3D_point", "make_color_point", "make_point", "put_in_standard_position", "rainbow", "r_of", "rotate_around_origin", "rotate_around_origin_3D", "scale", "scale_proportional", "translate", "unit_circle", "unit_line", "unit_line_at", "x_of", "y_of", "z_of", "animate_3D_curve", "animate_curve", "draw_3D_connected", "draw_3D_connected_full_view", "draw_3D_connected_full_view_proportional", "draw_3D_points", "draw_3D_points_full_view", "draw_3D_points_full_view_proportional", "draw_connected", "draw_connected_full_view", "draw_connected_full_view_proportional", "draw_points", "draw_points_full_view", "draw_points_full_view_proportional"];
      this.__displayed = [];
      this.__tabLoaded = false;
      this.__renderFunctions = new Map();
      this.__curveChannel = curveChannel;
      this.__tabLoader = tabLoader;
      this.__curveChannel.subscribe(message => {
        if (message.type === "request") {
          this.__displayed.forEach(displayedMessage => this.__curveChannel.send(displayedMessage));
          this.__displayed = [];
        }
      });
    }
    __loadCurveTab() {
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
        if (yield this.__loadCurveTab()) {
          this.__curveChannel.send(message);
        } else {
          this.__displayed.push(message);
        }
      });
    }
    __makeRenderClosure(renderFunction) {
      return __async(this, null, function* () {
        const pluginThis = this;
        const closure = yield this.evaluator.closure_make({
          args: [E.CLOSURE],
          returnType: E.OPAQUE
        }, function (curve) {
          return __asyncGenerator(this, null, function* () {
            const curveDrawn = yield* __yieldStar(renderFunction(curve));
            yield new __await(pluginThis.__display({
              type: "render",
              curve: curveDrawn.toSerializable()
            }));
            return yield new __await(pluginThis.evaluator.opaque_make(curveDrawn));
          });
        });
        this.__renderFunctions.set(closure.value, renderFunction);
        return closure;
      });
    }
    __getRenderFunction(drawer) {
      const renderFunction = this.__renderFunctions.get(drawer.value);
      if (renderFunction === void 0) {
        throw new e2("Expected a render function created by the curve module.");
      }
      return renderFunction;
    }
    make_point(x, y) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.evaluator.opaque_make(make_point(x.value, y.value)));
      });
    }
    make_3D_point(x, y, z) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.evaluator.opaque_make(make_3D_point(x.value, y.value, z.value)));
      });
    }
    make_color_point(x, y, r2, g, b) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.evaluator.opaque_make(make_color_point(x.value, y.value, r2.value, g.value, b.value)));
      });
    }
    make_3D_color_point(x, y, z, r2, g, b) {
      return __asyncGenerator(this, null, function* () {
        return yield new __await(this.evaluator.opaque_make(make_3D_color_point(x.value, y.value, z.value, r2.value, g.value, b.value)));
      });
    }
    connect_ends(curve1, curve2) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(connect_ends(this.evaluator, curve1, curve2));
      });
    }
    connect_rigidly(curve1, curve2) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(connect_rigidly(this.evaluator, curve1, curve2));
      });
    }
    translate(x0, y0, z0) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(translate2(this.evaluator, x0.value, y0.value, z0.value));
      });
    }
    rainbow(repeats, phase) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(rainbow(this.evaluator, repeats.value, phase.value));
      });
    }
    invert(curve) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(invert2(this.evaluator, curve));
      });
    }
    put_in_standard_position(curve) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(put_in_standard_position(this.evaluator, curve));
      });
    }
    rotate_around_origin_3D(a3, b, c2) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(rotate_around_origin_3D(this.evaluator, a3.value, b.value, c2.value));
      });
    }
    rotate_around_origin(a3) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(rotate_around_origin(this.evaluator, a3.value));
      });
    }
    scale(x, y, z) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(scale3(this.evaluator, x.value, y.value, z.value));
      });
    }
    scale_proportional(s5) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(scale_proportional(this.evaluator, s5.value));
      });
    }
    x_of(pt) {
      return __asyncGenerator(this, null, function* () {
        const point = yield new __await(this.evaluator.opaque_get(pt));
        return {
          type: E.NUMBER,
          value: x_of(point)
        };
      });
    }
    y_of(pt) {
      return __asyncGenerator(this, null, function* () {
        const point = yield new __await(this.evaluator.opaque_get(pt));
        return {
          type: E.NUMBER,
          value: y_of(point)
        };
      });
    }
    z_of(pt) {
      return __asyncGenerator(this, null, function* () {
        const point = yield new __await(this.evaluator.opaque_get(pt));
        return {
          type: E.NUMBER,
          value: z_of(point)
        };
      });
    }
    r_of(pt) {
      return __asyncGenerator(this, null, function* () {
        const point = yield new __await(this.evaluator.opaque_get(pt));
        return {
          type: E.NUMBER,
          value: r_of(point)
        };
      });
    }
    g_of(pt) {
      return __asyncGenerator(this, null, function* () {
        const point = yield new __await(this.evaluator.opaque_get(pt));
        return {
          type: E.NUMBER,
          value: g_of(point)
        };
      });
    }
    b_of(pt) {
      return __asyncGenerator(this, null, function* () {
        const point = yield new __await(this.evaluator.opaque_get(pt));
        return {
          type: E.NUMBER,
          value: b_of(point)
        };
      });
    }
    unit_circle(t4) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(unit_circle(this.evaluator, t4));
      });
    }
    unit_line(t4) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(unit_line(this.evaluator, t4));
      });
    }
    unit_line_at(y) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(unit_line_at(this.evaluator, y));
      });
    }
    arc(t4) {
      return __asyncGenerator(this, null, function* () {
        return yield* __yieldStar(arc(this.evaluator, t4));
      });
    }
    draw_connected(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_connected(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_connected_full_view(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_connected_full_view(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_connected_full_view_proportional(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_connected_full_view_proportional(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_points(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_points(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_points_full_view(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_points_full_view(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_points_full_view_proportional(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_points_full_view_proportional(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_3D_connected(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_3D_connected(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_3D_connected_full_view(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_3D_connected_full_view(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_3D_connected_full_view_proportional(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_3D_connected_full_view_proportional(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_3D_points(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_3D_points(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_3D_points_full_view(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_3D_points_full_view(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    draw_3D_points_full_view_proportional(numPoints) {
      return __asyncGenerator(this, null, function* () {
        const renderFunction = draw_3D_points_full_view_proportional(this.evaluator, numPoints.value);
        return yield new __await(this.__makeRenderClosure(renderFunction));
      });
    }
    animate_curve(duration, fps, drawer, func) {
      return __asyncGenerator(this, null, function* () {
        const curve = yield* __yieldStar(animate_curve(this.evaluator, duration.value, fps.value, this.__getRenderFunction(drawer), func));
        yield new __await(this.__display(curve.toSerializable()));
        return yield new __await(this.evaluator.opaque_make(curve));
      });
    }
    animate_3D_curve(duration, fps, drawer, func) {
      return __asyncGenerator(this, null, function* () {
        const curve = yield* __yieldStar(animate_3D_curve(this.evaluator, duration.value, fps.value, this.__getRenderFunction(drawer), func));
        yield new __await(this.__display(curve.toSerializable()));
        return yield new __await(this.evaluator.opaque_make(curve));
      });
    }
  };
  CurveModulePlugin.channelAttach = [CURVE_CHANNEL_ID];
  attachModuleMethod(CurveModulePlugin, "make_point", [E.NUMBER, E.NUMBER], E.OPAQUE);
  attachModuleMethod(CurveModulePlugin, "make_3D_point", [E.NUMBER, E.NUMBER, E.NUMBER], E.OPAQUE);
  attachModuleMethod(CurveModulePlugin, "make_color_point", [E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER], E.OPAQUE);
  attachModuleMethod(CurveModulePlugin, "make_3D_color_point", [E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER, E.NUMBER], E.OPAQUE);
  attachModuleMethod(CurveModulePlugin, "connect_ends", [E.CLOSURE, E.CLOSURE], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "connect_rigidly", [E.CLOSURE, E.CLOSURE], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "translate", [E.NUMBER, E.NUMBER, E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "rainbow", [E.NUMBER, E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "invert", [E.CLOSURE], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "put_in_standard_position", [E.CLOSURE], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "rotate_around_origin_3D", [E.NUMBER, E.NUMBER, E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "rotate_around_origin", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "scale", [E.NUMBER, E.NUMBER, E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "scale_proportional", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "x_of", [E.OPAQUE], E.NUMBER);
  attachModuleMethod(CurveModulePlugin, "y_of", [E.OPAQUE], E.NUMBER);
  attachModuleMethod(CurveModulePlugin, "z_of", [E.OPAQUE], E.NUMBER);
  attachModuleMethod(CurveModulePlugin, "r_of", [E.OPAQUE], E.NUMBER);
  attachModuleMethod(CurveModulePlugin, "g_of", [E.OPAQUE], E.NUMBER);
  attachModuleMethod(CurveModulePlugin, "b_of", [E.OPAQUE], E.NUMBER);
  attachModuleMethod(CurveModulePlugin, "unit_circle", [E.NUMBER], E.OPAQUE);
  attachModuleMethod(CurveModulePlugin, "unit_line", [E.NUMBER], E.OPAQUE);
  attachModuleMethod(CurveModulePlugin, "unit_line_at", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "arc", [E.NUMBER], E.OPAQUE);
  attachModuleMethod(CurveModulePlugin, "draw_connected", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_connected_full_view", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_connected_full_view_proportional", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_points", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_points_full_view", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_points_full_view_proportional", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_3D_connected", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_3D_connected_full_view", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_3D_connected_full_view_proportional", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_3D_points", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_3D_points_full_view", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "draw_3D_points_full_view_proportional", [E.NUMBER], E.CLOSURE);
  attachModuleMethod(CurveModulePlugin, "animate_curve", [E.NUMBER, E.NUMBER, E.CLOSURE, E.CLOSURE], E.OPAQUE);
  attachModuleMethod(CurveModulePlugin, "animate_3D_curve", [E.NUMBER, E.NUMBER, E.CLOSURE, E.CLOSURE], E.OPAQUE);
  return __toCommonJS(index_exports);
};