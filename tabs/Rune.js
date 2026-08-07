export default require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var index_exports = {};
  __export(index_exports, {
    RUNE_TAB_ID: () => RUNE_TAB_ID,
    RuneTab: () => RuneTab,
    default: () => RuneTabPlugin
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
    constructor(r3, o3, s6, e5) {
      super(`${void 0 !== o3 ? `${e5 ? e5 + ":" : ""}${o3}${void 0 !== s6 ? ":" + s6 : ""}: ` : ""}${r3}`);
      __publicField(this, "name", "EvaluatorError");
      __publicField(this, "errorType", _.EVALUATOR);
      __publicField(this, "rawMessage");
      __publicField(this, "line");
      __publicField(this, "column");
      __publicField(this, "fileName");
      (this.rawMessage = r3, this.line = o3, this.column = s6, this.fileName = e5);
    }
  };
  function e(r3) {
    const t4 = (function (r4) {
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
      } catch (e5) {
        try {
          return String(r4);
        } catch (e6) {
          return Object.prototype.toString.call(r4);
        }
      }
    })(r3);
    return t4.length > 100 ? `${t4.slice(0, 100)}...` : t4;
  }
  var n = class extends s {
    constructor(r3, t4, n4, o3, u3, a3, i) {
      super(`${r3}: Expected ${n4}${t4 ? ` for ${t4}` : ""}, got ${e(o3)}.`, u3, a3, i);
      __publicField(this, "name", "EvaluatorParameterTypeError");
      __publicField(this, "errorType", _.EVALUATOR_TYPE);
      __publicField(this, "funcName");
      __publicField(this, "paramName");
      __publicField(this, "expected");
      __publicField(this, "actual");
      (this.funcName = r3, this.paramName = t4, this.expected = n4, this.actual = o3);
    }
  };
  var u = class extends n {
    constructor(r3, t4, e5, n4, o3, u3, a3) {
      super(e5, n4, (function (r4) {
        if ("string" == typeof r4) return r4;
        const {min: t5, max: e6, integer: n5 = true} = r4, o4 = n5 ? "integer" : "number";
        return void 0 !== t5 && void 0 !== e6 ? `${o4} \u2208 [${t5}, ${e6}]` : void 0 !== t5 ? `${o4} \u2265 ${t5}` : void 0 !== e6 ? `${o4} \u2264 ${e6}` : o4;
      })(t4), r3, o3, u3, a3);
      __publicField(this, "name", "EvaluatorNumberRangeError");
    }
  };
  var e2 = class extends s {
    constructor() {
      super(...arguments);
      __publicField(this, "name", "EvaluatorRuntimeError");
      __publicField(this, "errorType", _.EVALUATOR_RUNTIME);
    }
  };
  function p(r3, o3, t4, n4 = true) {
    return "number" == typeof r3 && !Number.isNaN(r3) && (!(n4 && !Number.isInteger(r3)) && (!(void 0 !== o3 && r3 < o3) && !(void 0 !== t4 && r3 > t4)));
  }
  function l(o3, t4, n4, e5, i = true, u3) {
    if (!p(o3, n4, e5, i)) throw new u(o3, {
      min: n4,
      max: e5,
      integer: i
    }, t4, u3);
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
    var s6, c2, t4;
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
    s6 = Math.sin(rad);
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
    b01 = y * x * t4 + z * s6;
    b02 = z * x * t4 - y * s6;
    b10 = x * y * t4 - z * s6;
    b11 = y * y * t4 + c2;
    b12 = z * y * t4 + x * s6;
    b20 = x * z * t4 + y * s6;
    b21 = y * z * t4 - x * s6;
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
    var s6 = Math.sin(rad);
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
    out[4] = a10 * c2 + a20 * s6;
    out[5] = a11 * c2 + a21 * s6;
    out[6] = a12 * c2 + a22 * s6;
    out[7] = a13 * c2 + a23 * s6;
    out[8] = a20 * c2 - a10 * s6;
    out[9] = a21 * c2 - a11 * s6;
    out[10] = a22 * c2 - a12 * s6;
    out[11] = a23 * c2 - a13 * s6;
    return out;
  }
  function rotateY(out, a3, rad) {
    var s6 = Math.sin(rad);
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
    out[0] = a00 * c2 - a20 * s6;
    out[1] = a01 * c2 - a21 * s6;
    out[2] = a02 * c2 - a22 * s6;
    out[3] = a03 * c2 - a23 * s6;
    out[8] = a00 * s6 + a20 * c2;
    out[9] = a01 * s6 + a21 * c2;
    out[10] = a02 * s6 + a22 * c2;
    out[11] = a03 * s6 + a23 * c2;
    return out;
  }
  function rotateZ(out, a3, rad) {
    var s6 = Math.sin(rad);
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
    out[0] = a00 * c2 + a10 * s6;
    out[1] = a01 * c2 + a11 * s6;
    out[2] = a02 * c2 + a12 * s6;
    out[3] = a03 * c2 + a13 * s6;
    out[4] = a10 * c2 - a00 * s6;
    out[5] = a11 * c2 - a01 * s6;
    out[6] = a12 * c2 - a02 * s6;
    out[7] = a13 * c2 - a03 * s6;
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
    var s6, c2, t4;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s6 = Math.sin(rad);
    c2 = Math.cos(rad);
    t4 = 1 - c2;
    out[0] = x * x * t4 + c2;
    out[1] = y * x * t4 + z * s6;
    out[2] = z * x * t4 - y * s6;
    out[3] = 0;
    out[4] = x * y * t4 - z * s6;
    out[5] = y * y * t4 + c2;
    out[6] = z * y * t4 + x * s6;
    out[7] = 0;
    out[8] = x * z * t4 + y * s6;
    out[9] = y * z * t4 - x * s6;
    out[10] = z * z * t4 + c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s6 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c2;
    out[6] = s6;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s6;
    out[10] = c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s6 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = 0;
    out[2] = -s6;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s6;
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
    var s6 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = s6;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s6;
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
  function fromRotationTranslationScale(out, q, v, s6) {
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
    var sx = s6[0];
    var sy = s6[1];
    var sz = s6[2];
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
  function fromRotationTranslationScaleOrigin(out, q, v, s6, o3) {
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
    var sx = s6[0];
    var sy = s6[1];
    var sz = s6[2];
    var ox = o3[0];
    var oy = o3[1];
    var oz = o3[2];
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
    var r3 = RANDOM() * 2 * Math.PI;
    var z = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z * z) * scale4;
    out[0] = Math.cos(r3) * zScale;
    out[1] = Math.sin(r3) * zScale;
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
    var p2 = [], r3 = [];
    p2[0] = a3[0] - b[0];
    p2[1] = a3[1] - b[1];
    p2[2] = a3[2] - b[2];
    r3[0] = p2[0];
    r3[1] = p2[1] * Math.cos(rad) - p2[2] * Math.sin(rad);
    r3[2] = p2[1] * Math.sin(rad) + p2[2] * Math.cos(rad);
    out[0] = r3[0] + b[0];
    out[1] = r3[1] + b[1];
    out[2] = r3[2] + b[2];
    return out;
  }
  function rotateY2(out, a3, b, rad) {
    var p2 = [], r3 = [];
    p2[0] = a3[0] - b[0];
    p2[1] = a3[1] - b[1];
    p2[2] = a3[2] - b[2];
    r3[0] = p2[2] * Math.sin(rad) + p2[0] * Math.cos(rad);
    r3[1] = p2[1];
    r3[2] = p2[2] * Math.cos(rad) - p2[0] * Math.sin(rad);
    out[0] = r3[0] + b[0];
    out[1] = r3[1] + b[1];
    out[2] = r3[2] + b[2];
    return out;
  }
  function rotateZ2(out, a3, b, rad) {
    var p2 = [], r3 = [];
    p2[0] = a3[0] - b[0];
    p2[1] = a3[1] - b[1];
    p2[2] = a3[2] - b[2];
    r3[0] = p2[0] * Math.cos(rad) - p2[1] * Math.sin(rad);
    r3[1] = p2[0] * Math.sin(rad) + p2[1] * Math.cos(rad);
    r3[2] = p2[2];
    out[0] = r3[0] + b[0];
    out[1] = r3[1] + b[1];
    out[2] = r3[2] + b[2];
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
        } catch (e5) {
          reject(e5);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e5) {
          reject(e5);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
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
  var Rune = class _Rune {
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
  Rune.of = (params = {}) => {
    const paramGetter = (name, defaultValue) => {
      var _a;
      return (_a = params[name]) !== null && _a !== void 0 ? _a : defaultValue();
    };
    return new Rune(paramGetter("vertices", () => new Float32Array()), paramGetter("colors", () => null), paramGetter("transformMatrix", mat4_exports.create), paramGetter("subRunes", () => []), paramGetter("texture", () => null), paramGetter("hollusionDistance", () => 0.1));
  };
  function waitForImageToLoad(image) {
    if (image.complete) {
      return image.naturalWidth === 0 ? Promise.reject(new e2(`Rune: failed to load texture image at ${image.src}`)) : Promise.resolve(image);
    }
    return new Promise((resolve, reject) => {
      function cleanup() {
        image.removeEventListener("load", onLoad);
        image.removeEventListener("error", onError);
        image.removeEventListener("abort", onError);
      }
      function onLoad() {
        cleanup();
        resolve(image);
      }
      function onError() {
        cleanup();
        reject(new e2(`Rune: failed to load texture image at ${image.src}`));
      }
      image.addEventListener("load", onLoad);
      image.addEventListener("error", onError);
      image.addEventListener("abort", onError);
    });
  }
  function drawRunesToFrameBuffer(gl_1, runes_1, cameraMatrix_1, colorFilter_1) {
    return __awaiter(this, arguments, void 0, function* (gl, runes, cameraMatrix, colorFilter, framebuffer = null, depthSwitch = false) {
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
      const loadTexture = rune => __awaiter(this, void 0, void 0, function* () {
        if (rune.texture === null) return null;
        const imageSource = rune.texture;
        const image = typeof imageSource === "string" ? Object.assign(new Image(), {
          crossOrigin: "anonymous",
          src: imageSource
        }) : imageSource;
        yield waitForImageToLoad(image);
        rune.texture = image;
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
  var DrawnNormalRune = class extends DrawnRune {
    constructor(rune) {
      super(rune, false);
      this.draw = canvas => __awaiter(this, void 0, void 0, function* () {
        const gl = getWebGlFromCanvas(canvas);
        const cameraMatrix = mat4_exports.create();
        yield drawRunesToFrameBuffer(gl, this.rune.flatten(), cameraMatrix, new Float32Array([1, 1, 1, 1]), null, true);
      });
    }
  };
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
    const r3 = 4 / (2 + 3 * root2);
    const scaleX = 1 / (r3 * (1 + root2 / 2));
    const numPoints = 100;
    const rightCenterX = r3 / root2;
    const rightCenterY = 1 - r3;
    for (let i = 0; i < numPoints; i += 1) {
      const angle1 = Math.PI * (-1 / 4 + i / numPoints);
      const angle2 = Math.PI * (-1 / 4 + (i + 1) / numPoints);
      vertexList.push((Math.cos(angle1) * r3 + rightCenterX) * scaleX, Math.sin(angle1) * r3 + rightCenterY, 0, 1);
      vertexList.push((Math.cos(angle2) * r3 + rightCenterX) * scaleX, Math.sin(angle2) * r3 + rightCenterY, 0, 1);
      vertexList.push(0, -1, 0, 1);
    }
    const leftCenterX = -r3 / root2;
    const leftCenterY = 1 - r3;
    for (let i = 0; i <= numPoints; i += 1) {
      const angle1 = Math.PI * (1 / 4 + i / numPoints);
      const angle2 = Math.PI * (1 / 4 + (i + 1) / numPoints);
      vertexList.push((Math.cos(angle1) * r3 + leftCenterX) * scaleX, Math.sin(angle1) * r3 + leftCenterY, 0, 1);
      vertexList.push((Math.cos(angle2) * r3 + leftCenterX) * scaleX, Math.sin(angle2) * r3 + leftCenterY, 0, 1);
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
    const h2 = (hue % 1 + 1) % 1;
    const i = Math.floor(h2 * 6);
    const f2 = h2 * 6 - i;
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
        } catch (e5) {
          reject(e5);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e5) {
          reject(e5);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  function throwIfNotFraction(val, param_name, func_name) {
    l(val, func_name, 0, 1, false, param_name);
  }
  var RuneFunctions = class _RuneFunctions {
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
    static stackn(n4, rune) {
      throwIfNotRune(_RuneFunctions.stackn.name, rune);
      l(n4, _RuneFunctions.stackn.name);
      if (n4 <= 1) {
        return rune;
      }
      return _RuneFunctions.stack_frac(1 / n4, rune, _RuneFunctions.stackn(n4 - 1, rune));
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
    static color(rune, r3, g, b) {
      throwIfNotRune(_RuneFunctions.color.name, rune);
      throwIfNotFraction(r3, "r", _RuneFunctions.color.name);
      throwIfNotFraction(g, "g", _RuneFunctions.color.name);
      throwIfNotFraction(b, "b", _RuneFunctions.color.name);
      const colorVector = [r3, g, b, 1];
      return Rune.of({
        colors: new Float32Array(colorVector),
        subRunes: [rune]
      });
    }
  };
  RuneFunctions.square = getSquare();
  RuneFunctions.blank = getBlank();
  RuneFunctions.rcross = getRcross();
  RuneFunctions.sail = getSail();
  RuneFunctions.triangle = getTriangle();
  RuneFunctions.corner = getCorner();
  RuneFunctions.nova = getNova();
  RuneFunctions.circle = getCircle();
  RuneFunctions.heart = getHeart();
  RuneFunctions.pentagram = getPentagram();
  RuneFunctions.ribbon = getRibbon();
  var RuneColours = class _RuneColours {
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
      const [r3, g, b] = hueToRgb(hue);
      return Rune.of({
        subRunes: [rune],
        colors: new Float32Array([r3 / 255, g / 255, b / 255, 1])
      });
    }
  };
  RuneColours.colours = {
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
  var DrawnAnaglyphRune = class _DrawnAnaglyphRune extends DrawnRune {
    constructor(rune) {
      super(rune, false);
      this.draw = canvas => __awaiter2(this, void 0, void 0, function* () {
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
  DrawnAnaglyphRune.anaglyphVertexShader = `
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
  DrawnAnaglyphRune.anaglyphFragmentShader = `
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
  var DrawnHollusionRune = class _DrawnHollusionRune extends DrawnRune {
    constructor(rune, magnitude) {
      super(rune, true);
      this.draw = canvas => __awaiter2(this, void 0, void 0, function* () {
        const gl = getWebGlFromCanvas(canvas);
        const runes = white(overlay_frac(0.999999999, blank, scale3(2.2, square))).flatten().concat(this.rune.flatten());
        const xshiftMax = runes[0].hollusionDistance;
        const period = 2e3;
        const frameCount = 50;
        const frameBuffer = [];
        const renderFrame = framePos => __awaiter2(this, void 0, void 0, function* () {
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
  DrawnHollusionRune.copyVertexShader = `
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
  DrawnHollusionRune.copyFragmentShader = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(uTexture, v_texturePosition);
    }
    `;
  function isHollusionRune(rune) {
    return rune.isHollusion;
  }
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
  var RUNE_WEB_ID = "rune-web";
  function imageFromUrl(url) {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    return image;
  }
  function deserializeRune(serialized) {
    return Rune.of({
      vertices: new Float32Array(serialized.vertices),
      colors: serialized.colors === null ? null : new Float32Array(serialized.colors),
      transformMatrix: new Float32Array(serialized.transformMatrix),
      subRunes: serialized.subRunes.map(deserializeRune),
      texture: serialized.textureUrl === null ? null : imageFromUrl(serialized.textureUrl),
      hollusionDistance: serialized.hollusionDistance
    });
  }
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  function n2(n4) {}
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  var import_jsx_runtime6 = __require("react/jsx-runtime");
  var import_core6 = __require("@blueprintjs/core");
  var import_react3 = __require("react");
  var import_jsx_runtime = __require("react/jsx-runtime");
  var import_core = __require("@blueprintjs/core");
  function AnimationError({error}) {
    return (0, import_jsx_runtime.jsxs)("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      children: [(0, import_jsx_runtime.jsxs)("div", {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        },
        children: [(0, import_jsx_runtime.jsx)(import_core.Icon, {
          icon: "warning-sign",
          size: 90
        }), (0, import_jsx_runtime.jsxs)("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 20
          },
          children: [(0, import_jsx_runtime.jsx)("h3", {
            children: "An error occurred while running your animation!"
          }), (0, import_jsx_runtime.jsx)("p", {
            style: {
              justifySelf: "flex-end"
            },
            children: "Here's the details:"
          })]
        })]
      }), (0, import_jsx_runtime.jsx)("code", {
        style: {
          color: "red"
        },
        children: error.toString()
      })]
    });
  }
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var import_core2 = __require("@blueprintjs/core");
  var __rest = function (s6, e5) {
    var t4 = {};
    for (var p2 in s6) if (Object.prototype.hasOwnProperty.call(s6, p2) && e5.indexOf(p2) < 0) t4[p2] = s6[p2];
    if (s6 != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s6); i < p2.length; i++) {
      if (e5.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s6, p2[i])) t4[p2[i]] = s6[p2[i]];
    }
    return t4;
  };
  function AutoLoopSwitch(_a) {
    var {isAutoLooping} = _a, props = __rest(_a, ["isAutoLooping"]);
    return (0, import_jsx_runtime2.jsx)(import_core2.Switch, Object.assign({
      style: {
        marginBottom: "0px",
        whiteSpace: "nowrap"
      },
      label: "Auto Loop",
      checked: isAutoLooping
    }, props));
  }
  var import_jsx_runtime3 = __require("react/jsx-runtime");
  var import_core3 = __require("@blueprintjs/core");
  var defaultOptions = {
    className: "",
    fullWidth: false,
    iconOnRight: false,
    intent: import_core3.Intent.NONE,
    minimal: true
  };
  function ButtonComponent(props) {
    const buttonProps = Object.assign(Object.assign({}, defaultOptions), props);
    return props.disabled ? (0, import_jsx_runtime3.jsx)(import_core3.AnchorButton, Object.assign({}, buttonProps)) : (0, import_jsx_runtime3.jsx)(import_core3.Button, Object.assign({}, buttonProps));
  }
  var import_jsx_runtime4 = __require("react/jsx-runtime");
  var import_core4 = __require("@blueprintjs/core");
  var __rest2 = function (s6, e5) {
    var t4 = {};
    for (var p2 in s6) if (Object.prototype.hasOwnProperty.call(s6, p2) && e5.indexOf(p2) < 0) t4[p2] = s6[p2];
    if (s6 != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s6); i < p2.length; i++) {
      if (e5.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s6, p2[i])) t4[p2[i]] = s6[p2[i]];
    }
    return t4;
  };
  function PlayButton(_a) {
    var {playingText = "Pause", playingIcon = "pause", pausedText = "Play", pausedIcon = "play", isPlaying, tooltipProps, iconProps} = _a, props = __rest2(_a, ["playingText", "playingIcon", "pausedText", "pausedIcon", "isPlaying", "tooltipProps", "iconProps"]);
    return (0, import_jsx_runtime4.jsx)(import_core4.Tooltip, Object.assign({
      content: isPlaying ? playingText : pausedText
    }, tooltipProps, {
      children: (0, import_jsx_runtime4.jsx)(ButtonComponent, Object.assign({}, props, {
        children: (0, import_jsx_runtime4.jsx)(import_core4.Icon, Object.assign({
          icon: isPlaying ? playingIcon : pausedIcon
        }, iconProps))
      }))
    }));
  }
  var import_jsx_runtime5 = __require("react/jsx-runtime");
  var import_react = __require("react");
  var import_core5 = __require("@blueprintjs/core");
  var SA_TAB_ICON_SIZE = import_core5.IconSize.LARGE;
  var BP_TAB_BUTTON_MARGIN = "20px";
  var BP_TEXT_MARGIN = "10px";
  var CANVAS_MAX_WIDTH = "max(70vh, 30vw)";
  var defaultStyle = {
    width: "100%",
    maxWidth: CANVAS_MAX_WIDTH,
    aspectRatio: "1"
  };
  var WebGLCanvas = (0, import_react.forwardRef)((props, ref) => {
    const style = props.style !== void 0 ? Object.assign(Object.assign({}, defaultStyle), props.style) : defaultStyle;
    return (0, import_jsx_runtime5.jsx)("canvas", Object.assign({}, props, {
      style,
      ref,
      height: 512,
      width: 512
    }));
  });
  WebGLCanvas.displayName = "WebGLCanvas";
  var WebGLCanvas_default = WebGLCanvas;
  var import_react2 = __require("react");
  function useRerender() {
    const [, setRenderer] = (0, import_react2.useState)(true);
    return () => setRenderer(prev => !prev);
  }
  function useAnimation({animationDuration, autoLoop, autoStart, callback, frameDuration, startTimestamp = 0}) {
    const rerender = useRerender();
    const requestIdRef = (0, import_react2.useRef)(null);
    const elapsedRef = (0, import_react2.useRef)(startTimestamp);
    const canvasRef = (0, import_react2.useRef)(null);
    const lastFrameTimestamp = (0, import_react2.useRef)(null);
    const isPlayingRef = (0, import_react2.useRef)(false);
    const [errored, setErrored] = (0, import_react2.useState)(null);
    function setElapsed(newVal) {
      elapsedRef.current = newVal;
      rerender();
    }
    function setIsPlaying(newVal) {
      isPlayingRef.current = newVal;
      rerender();
    }
    function requestFrame() {
      if (requestIdRef.current === null) {
        requestIdRef.current = requestAnimationFrame(animCallback);
      }
    }
    function stop() {
      if (!isPlayingRef.current) return;
      setIsPlaying(false);
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
      lastFrameTimestamp.current = null;
    }
    function reset() {
      setElapsed(0);
      callbackWrapper(0);
      lastFrameTimestamp.current = null;
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
      if (isPlayingRef.current) {
        requestFrame();
      }
    }
    function start() {
      if (isPlayingRef.current) return;
      setIsPlaying(true);
      if (canvasRef.current) requestFrame();
    }
    function callbackWrapper(time) {
      if (canvasRef.current) {
        try {
          callback({
            timestamp: time,
            isPlaying: isPlayingRef.current,
            canvas: canvasRef.current,
            stop,
            start,
            reset
          });
        } catch (error) {
          setErrored(error);
          stop();
        }
      }
    }
    function animCallback(timeInMs) {
      requestIdRef.current = null;
      if (lastFrameTimestamp.current === null) {
        lastFrameTimestamp.current = timeInMs;
        requestFrame();
      } else {
        const diff = timeInMs - lastFrameTimestamp.current;
        const newElapsed = elapsedRef.current + diff;
        if (animationDuration === void 0 || newElapsed < animationDuration) {
          requestFrame();
          if (frameDuration === void 0 || diff >= frameDuration) {
            setElapsed(newElapsed);
            callbackWrapper(newElapsed);
            lastFrameTimestamp.current = timeInMs;
          }
          ;
        } else {
          setElapsed(animationDuration);
          callbackWrapper(animationDuration);
          finishCallbackRef.current();
          return;
        }
      }
    }
    const finishCallbackRef = (0, import_react2.useRef)(null);
    (0, import_react2.useEffect)(() => {
      finishCallbackRef.current = () => {
        if (autoLoop) {
          reset();
        } else {
          stop();
        }
      };
    }, [autoLoop]);
    (0, import_react2.useEffect)(() => {
      if (autoStart) start();
      return stop;
    }, []);
    return {
      start,
      stop,
      reset,
      changeTimestamp: newTime => {
        if (newTime < 0 || animationDuration !== void 0 && newTime > animationDuration) {
          throw new Error(`Invalid timestamp: ${newTime}`);
        }
        setElapsed(newTime);
        callbackWrapper(newTime);
      },
      drawFrame: timestamp => callbackWrapper(timestamp !== null && timestamp !== void 0 ? timestamp : elapsedRef.current),
      isPlaying: isPlayingRef.current,
      timestamp: elapsedRef.current,
      setCanvas: canvas => {
        if (canvasRef.current !== null && Object.is(canvasRef.current, canvas)) {
          return;
        }
        canvasRef.current = canvas;
        callbackWrapper(elapsedRef.current);
        if (isPlayingRef.current) {
          requestFrame();
        }
      },
      errored
    };
  }
  function AnimationCanvas(props) {
    const [isAutoLooping, setIsAutoLooping] = (0, import_react3.useState)(true);
    const [wasPlaying, setWasPlaying] = (0, import_react3.useState)(null);
    const [frameDuration, animationDuration] = (0, import_react3.useMemo)(() => [1e3 / props.animation.fps, Math.round(props.animation.duration * 1e3)], [props.animation]);
    const {stop, start, reset, changeTimestamp, isPlaying, errored, timestamp, setCanvas} = useAnimation({
      frameDuration,
      animationDuration,
      autoLoop: isAutoLooping,
      callback: ({timestamp: timestamp2, canvas}) => {
        const frame = props.animation.getFrame(timestamp2 / 1e3);
        frame.draw(canvas);
      }
    });
    const controlBar = (0, import_jsx_runtime6.jsxs)("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: BP_TAB_BUTTON_MARGIN,
        width: "100%",
        maxWidth: CANVAS_MAX_WIDTH,
        paddingTop: BP_TEXT_MARGIN,
        paddingBottom: BP_TEXT_MARGIN
      },
      children: [(0, import_jsx_runtime6.jsx)(PlayButton, {
        title: "PlayButton",
        isPlaying,
        onClick: () => {
          if (isPlaying) stop(); else {
            if (errored || timestamp >= animationDuration) reset();
            start();
          }
        }
      }), (0, import_jsx_runtime6.jsx)(import_core6.Tooltip, {
        content: "Reset",
        placement: "top",
        children: (0, import_jsx_runtime6.jsx)(ButtonComponent, {
          disabled: Boolean(errored),
          onClick: reset,
          children: (0, import_jsx_runtime6.jsx)(import_core6.Icon, {
            icon: "reset"
          })
        })
      }), (0, import_jsx_runtime6.jsx)(import_core6.Slider, {
        value: timestamp,
        min: 0,
        max: animationDuration,
        stepSize: 1,
        labelRenderer: false,
        disabled: Boolean(errored),
        onChange: newValue => {
          if (wasPlaying === null) {
            setWasPlaying(isPlaying);
          }
          changeTimestamp(newValue);
          stop();
        },
        onRelease: () => {
          if (wasPlaying) {
            start();
          }
          setWasPlaying(null);
        }
      }), (0, import_jsx_runtime6.jsx)(AutoLoopSwitch, {
        isAutoLooping,
        disabled: Boolean(errored),
        onChange: () => setIsAutoLooping(!isAutoLooping)
      })]
    });
    return (0, import_jsx_runtime6.jsxs)("div", {
      style: {
        width: "100%"
      },
      children: [(0, import_jsx_runtime6.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: controlBar
      }), (0, import_jsx_runtime6.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: errored ? (0, import_jsx_runtime6.jsx)(AnimationError, {
          error: errored
        }) : (0, import_jsx_runtime6.jsx)(WebGLCanvas_default, {
          style: {
            flexGrow: 1
          },
          ref: element => {
            if (element !== null) {
              setCanvas(element);
            }
          }
        })
      })]
    });
  }
  var import_jsx_runtime7 = __require("react/jsx-runtime");
  var import_core7 = __require("@blueprintjs/core");
  function clamp2(value, bound1, bound2) {
    if (bound2 == null) return Math.min(value, bound1);
    return Math.min(Math.max(value, bound1), bound2);
  }
  var import_react4 = __require("react");
  function MultiItemDisplay(props) {
    const [currentStep, setCurrentStep] = (0, import_react4.useState)(0);
    function changeStep(newIndex) {
      var _a;
      setCurrentStep(newIndex);
      (_a = props.onStepChange) === null || _a === void 0 ? void 0 : _a.call(props, newIndex, currentStep);
    }
    const [stepEditorValue, setStepEditorValue] = (0, import_react4.useState)("1");
    const [stepEditorFocused, setStepEditorFocused] = (0, import_react4.useState)(false);
    const resetStepEditor = () => setStepEditorValue((currentStep + 1).toString());
    const elementsDigitCount = Math.floor(Math.log10(Math.max(1, props.elements.length))) + 1;
    return (0, import_jsx_runtime7.jsxs)("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        height: "100vh"
      },
      children: [(0, import_jsx_runtime7.jsxs)("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          position: "relative",
          marginBottom: 10
        },
        children: [(0, import_jsx_runtime7.jsx)(import_core7.Button, {
          style: {
            position: "absolute",
            left: 0
          },
          tabIndex: 0,
          large: true,
          outlined: true,
          icon: "arrow-left",
          onClick: () => {
            changeStep(currentStep - 1);
            setStepEditorValue(currentStep.toString());
          },
          disabled: currentStep === 0,
          children: "Previous"
        }), (0, import_jsx_runtime7.jsx)("h3", {
          className: "bp6-text-large",
          children: (0, import_jsx_runtime7.jsxs)("div", {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around"
            },
            children: ["Call\xA0", (0, import_jsx_runtime7.jsx)("div", {
              style: {
                width: `${stepEditorFocused ? elementsDigitCount + 2 : elementsDigitCount}ch`
              },
              children: (0, import_jsx_runtime7.jsx)(import_core7.EditableText, {
                value: stepEditorValue,
                disabled: props.elements.length === 1,
                placeholder: void 0,
                selectAllOnFocus: true,
                customInputAttributes: {
                  tabIndex: 0
                },
                onChange: newValue => {
                  if (newValue && !(/^[0-9]+$/u).test(newValue)) return;
                  if (newValue.length > elementsDigitCount) return;
                  setStepEditorValue(newValue);
                },
                onConfirm: value => {
                  if (value) {
                    const newStep = parseInt(value);
                    const clampedStep = clamp2(newStep, 1, props.elements.length);
                    if (clampedStep - 1 !== currentStep) {
                      changeStep(clampedStep - 1);
                    }
                    setStepEditorFocused(false);
                    setStepEditorValue(clampedStep.toString());
                    return;
                  }
                  resetStepEditor();
                  setStepEditorFocused(false);
                },
                onCancel: () => {
                  resetStepEditor();
                  setStepEditorFocused(false);
                },
                onEdit: () => setStepEditorFocused(true)
              })
            }), stepEditorFocused && (0, import_jsx_runtime7.jsx)(import_jsx_runtime7.Fragment, {
              children: "\xA0"
            }), "/", props.elements.length]
          })
        }), (0, import_jsx_runtime7.jsx)(import_core7.Button, {
          style: {
            position: "absolute",
            right: 0
          },
          large: true,
          outlined: true,
          icon: "arrow-right",
          tabIndex: 0,
          onClick: () => {
            changeStep(currentStep + 1);
            setStepEditorValue((currentStep + 2).toString());
          },
          disabled: currentStep === props.elements.length - 1,
          children: "Next"
        })]
      }), (0, import_jsx_runtime7.jsx)("div", {
        style: {
          width: "100%",
          paddingLeft: "20px",
          paddingRight: "20px",
          display: "flex",
          alignContent: "center",
          justifyContent: "center"
        },
        children: props.elements[currentStep]
      })]
    });
  }
  var import_react6 = __require("react");
  var import_react5 = __toESM(__require("react"), 1);
  var import_jsx_runtime8 = __require("react/jsx-runtime");
  function HollusionCanvas({rune}) {
    const renderFuncRef = import_react5.default.useRef({
      type: "uninitialized"
    });
    const {setCanvas} = useAnimation({
      callback({timestamp, canvas}) {
        if (renderFuncRef.current.type === "ready") {
          return renderFuncRef.current.renderFunc(timestamp);
        }
        if (renderFuncRef.current.type === "uninitialized") {
          renderFuncRef.current = {
            type: "loading"
          };
          rune.draw(canvas).then(renderFunc => {
            renderFuncRef.current = {
              type: "ready",
              renderFunc
            };
            renderFuncRef.current.renderFunc(timestamp);
          });
        }
      },
      autoStart: true
    });
    return (0, import_jsx_runtime8.jsx)(WebGLCanvas_default, {
      ref: canvas => {
        if (canvas) {
          setCanvas(canvas);
        }
      }
    });
  }
  var import_jsx_runtime9 = __require("react/jsx-runtime");
  var SerializedRuneAnimation = class extends glAnimation {
    constructor(message) {
      super(message.duration, message.fps);
      this.message = message;
    }
    getFrame(timestamp) {
      if (this.message.frames.length === 0) {
        return {
          draw: new DrawnNormalRune(Rune.of()).draw
        };
      }
      const frame = Math.min(Math.floor(timestamp * this.message.fps), this.message.frames.length - 1);
      const rune = deserializeRune(this.message.frames[frame]);
      const drawnRune = this.message.mode === "anaglyph" ? new DrawnAnaglyphRune(rune) : new DrawnNormalRune(rune);
      return {
        draw: drawnRune.draw
      };
    }
  };
  function RenderedRune({message}) {
    const rune = (0, import_react6.useMemo)(() => deserializeRune(message.rune), [message]);
    const drawnRune = (0, import_react6.useMemo)(() => {
      var _a;
      if (message.mode === "anaglyph") return new DrawnAnaglyphRune(rune);
      if (message.mode === "hollusion") return new DrawnHollusionRune(rune, (_a = message.magnitude) != null ? _a : 0.1);
      return new DrawnNormalRune(rune);
    }, [message, rune]);
    if (isHollusionRune(drawnRune)) {
      return (0, import_jsx_runtime9.jsx)(HollusionCanvas, {
        rune: drawnRune
      });
    }
    return (0, import_jsx_runtime9.jsx)(WebGLCanvas_default, {
      ref: canvas => {
        if (canvas) {
          drawnRune.draw(canvas);
        }
      }
    });
  }
  function RenderedAnimation({message}) {
    const animation = (0, import_react6.useMemo)(() => new SerializedRuneAnimation(message), [message]);
    return (0, import_jsx_runtime9.jsx)(AnimationCanvas, {
      animation
    });
  }
  function RuneTab({messages}) {
    const runeCanvases = messages.map((message, index) => {
      const key = index.toString();
      if (message.type === "animation") {
        return (0, import_jsx_runtime9.jsx)(RenderedAnimation, {
          message
        }, key);
      }
      return (0, import_jsx_runtime9.jsx)(RenderedRune, {
        message
      }, key);
    });
    return (0, import_jsx_runtime9.jsx)(MultiItemDisplay, {
      elements: runeCanvases
    });
  }
  var RUNE_TAB_ID = "rune";
  var RuneTabPlugin = class {
    constructor(_conduit, [runeChannel], tabService) {
      this.id = RUNE_WEB_ID;
      this.__listeners = new Set();
      this.__messages = [];
      this.__handleMessage = message => {
        if (message.type === "request") return;
        this.__messages = [...this.__messages, message];
        this.__emit();
        this.__tabService.showTab(RUNE_TAB_ID);
      };
      if (!runeChannel) {
        throw new Error("Rune channel is required but was not provided.");
      }
      this.__runeChannel = runeChannel;
      this.__tabService = tabService;
      const subscribe = listener => this.subscribe(listener);
      const getMessages = () => this.getMessages();
      function RunePluginTab() {
        const messages = (0, import_react6.useSyncExternalStore)(subscribe, getMessages);
        return (0, import_react6.createElement)(RuneTab, {
          messages
        });
      }
      const tab = {
        id: RUNE_TAB_ID,
        iconName: "group-objects",
        body: (0, import_react6.createElement)(RunePluginTab),
        label: "Runes Tab",
        disabled: false
      };
      this.__tabService.registerTab(tab);
      this.__runeChannel.subscribe(this.__handleMessage);
      this.__runeChannel.send({
        type: "request"
      });
    }
    getMessages() {
      return this.__messages;
    }
    subscribe(listener) {
      this.__listeners.add(listener);
      return () => this.__listeners.delete(listener);
    }
    destroy() {
      this.__runeChannel.unsubscribe(this.__handleMessage);
    }
    __emit() {
      this.__listeners.forEach(listener => listener());
    }
  };
  RuneTabPlugin.channelAttach = [RUNE_CHANNEL_ID];
  n2(RuneTabPlugin);
  return __toCommonJS(index_exports);
};