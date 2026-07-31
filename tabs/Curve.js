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
    get: (a4, b) => (typeof require !== "undefined" ? require : a4)[b]
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
  var index_exports = {};
  __export(index_exports, {
    CurveTab: () => CurveTab,
    default: () => CurveTabPlugin
  });
  var import_icons = __require("@blueprintjs/icons");
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
    constructor(r3, o3, s7, e6) {
      super(`${void 0 !== o3 ? `${e6 ? e6 + ":" : ""}${o3}${void 0 !== s7 ? ":" + s7 : ""}: ` : ""}${r3}`);
      __publicField(this, "name", "EvaluatorError");
      __publicField(this, "errorType", _.EVALUATOR);
      __publicField(this, "rawMessage");
      __publicField(this, "line");
      __publicField(this, "column");
      __publicField(this, "fileName");
      (this.rawMessage = r3, this.line = o3, this.column = s7, this.fileName = e6);
    }
  };
  var e = class extends s {
    constructor() {
      super(...arguments);
      __publicField(this, "name", "EvaluatorRuntimeError");
      __publicField(this, "errorType", _.EVALUATOR_RUNTIME);
    }
  };
  var E;
  !(function (E2) {
    (E2[E2.VOID = 0] = "VOID", E2[E2.BOOLEAN = 1] = "BOOLEAN", E2[E2.NUMBER = 2] = "NUMBER", E2[E2.CONST_STRING = 3] = "CONST_STRING", E2[E2.EMPTY_LIST = 4] = "EMPTY_LIST", E2[E2.PAIR = 5] = "PAIR", E2[E2.ARRAY = 6] = "ARRAY", E2[E2.CLOSURE = 7] = "CLOSURE", E2[E2.OPAQUE = 8] = "OPAQUE", E2[E2.LIST = 9] = "LIST", E2[E2.ANY = 10] = "ANY", E2[E2.INTEGER = 11] = "INTEGER");
  })(E || (E = {}));
  var a2;
  !(function (a4) {
    (a4[a4.HELLO = 0] = "HELLO", a4[a4.ABORT = 1] = "ABORT", a4[a4.ENTRY = 2] = "ENTRY");
  })(a2 || (a2 = {}));
  var O;
  !(function (O2) {
    (O2[O2.PROTOCOL_VERSION = 0] = "PROTOCOL_VERSION", O2[O2.PROTOCOL_MIN_VERSION = 0] = "PROTOCOL_MIN_VERSION", O2[O2.SETUP_MESSAGES_BUFFER_SIZE = 10] = "SETUP_MESSAGES_BUFFER_SIZE");
  })(O || (O = {}));
  var N;
  !(function (N2) {
    (N2[N2.ONLINE = 0] = "ONLINE", N2[N2.EVAL_READY = 1] = "EVAL_READY", N2[N2.RUNNING = 2] = "RUNNING", N2[N2.WAITING = 3] = "WAITING", N2[N2.BREAKPOINT = 4] = "BREAKPOINT", N2[N2.STOPPED = 5] = "STOPPED", N2[N2.ERROR = 6] = "ERROR");
  })(N || (N = {}));
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var RANDOM = Math.random;
  function round(a4) {
    if (a4 >= 0) return Math.round(a4);
    return a4 % 0.5 === 0 ? Math.floor(a4) : Math.round(a4);
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
  function clone(a4) {
    var out = new ARRAY_TYPE(16);
    out[0] = a4[0];
    out[1] = a4[1];
    out[2] = a4[2];
    out[3] = a4[3];
    out[4] = a4[4];
    out[5] = a4[5];
    out[6] = a4[6];
    out[7] = a4[7];
    out[8] = a4[8];
    out[9] = a4[9];
    out[10] = a4[10];
    out[11] = a4[11];
    out[12] = a4[12];
    out[13] = a4[13];
    out[14] = a4[14];
    out[15] = a4[15];
    return out;
  }
  function copy(out, a4) {
    out[0] = a4[0];
    out[1] = a4[1];
    out[2] = a4[2];
    out[3] = a4[3];
    out[4] = a4[4];
    out[5] = a4[5];
    out[6] = a4[6];
    out[7] = a4[7];
    out[8] = a4[8];
    out[9] = a4[9];
    out[10] = a4[10];
    out[11] = a4[11];
    out[12] = a4[12];
    out[13] = a4[13];
    out[14] = a4[14];
    out[15] = a4[15];
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
  function transpose(out, a4) {
    if (out === a4) {
      var a01 = a4[1], a02 = a4[2], a03 = a4[3];
      var a12 = a4[6], a13 = a4[7];
      var a23 = a4[11];
      out[1] = a4[4];
      out[2] = a4[8];
      out[3] = a4[12];
      out[4] = a01;
      out[6] = a4[9];
      out[7] = a4[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a4[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a4[0];
      out[1] = a4[4];
      out[2] = a4[8];
      out[3] = a4[12];
      out[4] = a4[1];
      out[5] = a4[5];
      out[6] = a4[9];
      out[7] = a4[13];
      out[8] = a4[2];
      out[9] = a4[6];
      out[10] = a4[10];
      out[11] = a4[14];
      out[12] = a4[3];
      out[13] = a4[7];
      out[14] = a4[11];
      out[15] = a4[15];
    }
    return out;
  }
  function invert(out, a4) {
    var a00 = a4[0], a01 = a4[1], a02 = a4[2], a03 = a4[3];
    var a10 = a4[4], a11 = a4[5], a12 = a4[6], a13 = a4[7];
    var a20 = a4[8], a21 = a4[9], a22 = a4[10], a23 = a4[11];
    var a30 = a4[12], a31 = a4[13], a32 = a4[14], a33 = a4[15];
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
  function adjoint(out, a4) {
    var a00 = a4[0], a01 = a4[1], a02 = a4[2], a03 = a4[3];
    var a10 = a4[4], a11 = a4[5], a12 = a4[6], a13 = a4[7];
    var a20 = a4[8], a21 = a4[9], a22 = a4[10], a23 = a4[11];
    var a30 = a4[12], a31 = a4[13], a32 = a4[14], a33 = a4[15];
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
  function determinant(a4) {
    var a00 = a4[0], a01 = a4[1], a02 = a4[2], a03 = a4[3];
    var a10 = a4[4], a11 = a4[5], a12 = a4[6], a13 = a4[7];
    var a20 = a4[8], a21 = a4[9], a22 = a4[10], a23 = a4[11];
    var a30 = a4[12], a31 = a4[13], a32 = a4[14], a33 = a4[15];
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
  function multiply(out, a4, b) {
    var a00 = a4[0], a01 = a4[1], a02 = a4[2], a03 = a4[3];
    var a10 = a4[4], a11 = a4[5], a12 = a4[6], a13 = a4[7];
    var a20 = a4[8], a21 = a4[9], a22 = a4[10], a23 = a4[11];
    var a30 = a4[12], a31 = a4[13], a32 = a4[14], a33 = a4[15];
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
  function translate(out, a4, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a4 === out) {
      out[12] = a4[0] * x + a4[4] * y + a4[8] * z + a4[12];
      out[13] = a4[1] * x + a4[5] * y + a4[9] * z + a4[13];
      out[14] = a4[2] * x + a4[6] * y + a4[10] * z + a4[14];
      out[15] = a4[3] * x + a4[7] * y + a4[11] * z + a4[15];
    } else {
      a00 = a4[0];
      a01 = a4[1];
      a02 = a4[2];
      a03 = a4[3];
      a10 = a4[4];
      a11 = a4[5];
      a12 = a4[6];
      a13 = a4[7];
      a20 = a4[8];
      a21 = a4[9];
      a22 = a4[10];
      a23 = a4[11];
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
      out[12] = a00 * x + a10 * y + a20 * z + a4[12];
      out[13] = a01 * x + a11 * y + a21 * z + a4[13];
      out[14] = a02 * x + a12 * y + a22 * z + a4[14];
      out[15] = a03 * x + a13 * y + a23 * z + a4[15];
    }
    return out;
  }
  function scale(out, a4, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a4[0] * x;
    out[1] = a4[1] * x;
    out[2] = a4[2] * x;
    out[3] = a4[3] * x;
    out[4] = a4[4] * y;
    out[5] = a4[5] * y;
    out[6] = a4[6] * y;
    out[7] = a4[7] * y;
    out[8] = a4[8] * z;
    out[9] = a4[9] * z;
    out[10] = a4[10] * z;
    out[11] = a4[11] * z;
    out[12] = a4[12];
    out[13] = a4[13];
    out[14] = a4[14];
    out[15] = a4[15];
    return out;
  }
  function rotate(out, a4, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len2 = Math.sqrt(x * x + y * y + z * z);
    var s7, c2, t5;
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
    s7 = Math.sin(rad);
    c2 = Math.cos(rad);
    t5 = 1 - c2;
    a00 = a4[0];
    a01 = a4[1];
    a02 = a4[2];
    a03 = a4[3];
    a10 = a4[4];
    a11 = a4[5];
    a12 = a4[6];
    a13 = a4[7];
    a20 = a4[8];
    a21 = a4[9];
    a22 = a4[10];
    a23 = a4[11];
    b00 = x * x * t5 + c2;
    b01 = y * x * t5 + z * s7;
    b02 = z * x * t5 - y * s7;
    b10 = x * y * t5 - z * s7;
    b11 = y * y * t5 + c2;
    b12 = z * y * t5 + x * s7;
    b20 = x * z * t5 + y * s7;
    b21 = y * z * t5 - x * s7;
    b22 = z * z * t5 + c2;
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
    if (a4 !== out) {
      out[12] = a4[12];
      out[13] = a4[13];
      out[14] = a4[14];
      out[15] = a4[15];
    }
    return out;
  }
  function rotateX(out, a4, rad) {
    var s7 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a10 = a4[4];
    var a11 = a4[5];
    var a12 = a4[6];
    var a13 = a4[7];
    var a20 = a4[8];
    var a21 = a4[9];
    var a22 = a4[10];
    var a23 = a4[11];
    if (a4 !== out) {
      out[0] = a4[0];
      out[1] = a4[1];
      out[2] = a4[2];
      out[3] = a4[3];
      out[12] = a4[12];
      out[13] = a4[13];
      out[14] = a4[14];
      out[15] = a4[15];
    }
    out[4] = a10 * c2 + a20 * s7;
    out[5] = a11 * c2 + a21 * s7;
    out[6] = a12 * c2 + a22 * s7;
    out[7] = a13 * c2 + a23 * s7;
    out[8] = a20 * c2 - a10 * s7;
    out[9] = a21 * c2 - a11 * s7;
    out[10] = a22 * c2 - a12 * s7;
    out[11] = a23 * c2 - a13 * s7;
    return out;
  }
  function rotateY(out, a4, rad) {
    var s7 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a00 = a4[0];
    var a01 = a4[1];
    var a02 = a4[2];
    var a03 = a4[3];
    var a20 = a4[8];
    var a21 = a4[9];
    var a22 = a4[10];
    var a23 = a4[11];
    if (a4 !== out) {
      out[4] = a4[4];
      out[5] = a4[5];
      out[6] = a4[6];
      out[7] = a4[7];
      out[12] = a4[12];
      out[13] = a4[13];
      out[14] = a4[14];
      out[15] = a4[15];
    }
    out[0] = a00 * c2 - a20 * s7;
    out[1] = a01 * c2 - a21 * s7;
    out[2] = a02 * c2 - a22 * s7;
    out[3] = a03 * c2 - a23 * s7;
    out[8] = a00 * s7 + a20 * c2;
    out[9] = a01 * s7 + a21 * c2;
    out[10] = a02 * s7 + a22 * c2;
    out[11] = a03 * s7 + a23 * c2;
    return out;
  }
  function rotateZ(out, a4, rad) {
    var s7 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a00 = a4[0];
    var a01 = a4[1];
    var a02 = a4[2];
    var a03 = a4[3];
    var a10 = a4[4];
    var a11 = a4[5];
    var a12 = a4[6];
    var a13 = a4[7];
    if (a4 !== out) {
      out[8] = a4[8];
      out[9] = a4[9];
      out[10] = a4[10];
      out[11] = a4[11];
      out[12] = a4[12];
      out[13] = a4[13];
      out[14] = a4[14];
      out[15] = a4[15];
    }
    out[0] = a00 * c2 + a10 * s7;
    out[1] = a01 * c2 + a11 * s7;
    out[2] = a02 * c2 + a12 * s7;
    out[3] = a03 * c2 + a13 * s7;
    out[4] = a10 * c2 - a00 * s7;
    out[5] = a11 * c2 - a01 * s7;
    out[6] = a12 * c2 - a02 * s7;
    out[7] = a13 * c2 - a03 * s7;
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
    var s7, c2, t5;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s7 = Math.sin(rad);
    c2 = Math.cos(rad);
    t5 = 1 - c2;
    out[0] = x * x * t5 + c2;
    out[1] = y * x * t5 + z * s7;
    out[2] = z * x * t5 - y * s7;
    out[3] = 0;
    out[4] = x * y * t5 - z * s7;
    out[5] = y * y * t5 + c2;
    out[6] = z * y * t5 + x * s7;
    out[7] = 0;
    out[8] = x * z * t5 + y * s7;
    out[9] = y * z * t5 - x * s7;
    out[10] = z * z * t5 + c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s7 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c2;
    out[6] = s7;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s7;
    out[10] = c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s7 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = 0;
    out[2] = -s7;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s7;
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
    var s7 = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = s7;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s7;
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
  function fromQuat2(out, a4) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a4[0], by = -a4[1], bz = -a4[2], bw = a4[3], ax = a4[4], ay = a4[5], az = a4[6], aw = a4[7];
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
    fromRotationTranslation(out, a4, translation);
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
  function fromRotationTranslationScale(out, q, v, s7) {
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
    var sx = s7[0];
    var sy = s7[1];
    var sz = s7[2];
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
  function fromRotationTranslationScaleOrigin(out, q, v, s7, o3) {
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
    var sx = s7[0];
    var sy = s7[1];
    var sz = s7[2];
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
  function str(a4) {
    return "mat4(" + a4[0] + ", " + a4[1] + ", " + a4[2] + ", " + a4[3] + ", " + a4[4] + ", " + a4[5] + ", " + a4[6] + ", " + a4[7] + ", " + a4[8] + ", " + a4[9] + ", " + a4[10] + ", " + a4[11] + ", " + a4[12] + ", " + a4[13] + ", " + a4[14] + ", " + a4[15] + ")";
  }
  function frob(a4) {
    return Math.sqrt(a4[0] * a4[0] + a4[1] * a4[1] + a4[2] * a4[2] + a4[3] * a4[3] + a4[4] * a4[4] + a4[5] * a4[5] + a4[6] * a4[6] + a4[7] * a4[7] + a4[8] * a4[8] + a4[9] * a4[9] + a4[10] * a4[10] + a4[11] * a4[11] + a4[12] * a4[12] + a4[13] * a4[13] + a4[14] * a4[14] + a4[15] * a4[15]);
  }
  function add(out, a4, b) {
    out[0] = a4[0] + b[0];
    out[1] = a4[1] + b[1];
    out[2] = a4[2] + b[2];
    out[3] = a4[3] + b[3];
    out[4] = a4[4] + b[4];
    out[5] = a4[5] + b[5];
    out[6] = a4[6] + b[6];
    out[7] = a4[7] + b[7];
    out[8] = a4[8] + b[8];
    out[9] = a4[9] + b[9];
    out[10] = a4[10] + b[10];
    out[11] = a4[11] + b[11];
    out[12] = a4[12] + b[12];
    out[13] = a4[13] + b[13];
    out[14] = a4[14] + b[14];
    out[15] = a4[15] + b[15];
    return out;
  }
  function subtract(out, a4, b) {
    out[0] = a4[0] - b[0];
    out[1] = a4[1] - b[1];
    out[2] = a4[2] - b[2];
    out[3] = a4[3] - b[3];
    out[4] = a4[4] - b[4];
    out[5] = a4[5] - b[5];
    out[6] = a4[6] - b[6];
    out[7] = a4[7] - b[7];
    out[8] = a4[8] - b[8];
    out[9] = a4[9] - b[9];
    out[10] = a4[10] - b[10];
    out[11] = a4[11] - b[11];
    out[12] = a4[12] - b[12];
    out[13] = a4[13] - b[13];
    out[14] = a4[14] - b[14];
    out[15] = a4[15] - b[15];
    return out;
  }
  function multiplyScalar(out, a4, b) {
    out[0] = a4[0] * b;
    out[1] = a4[1] * b;
    out[2] = a4[2] * b;
    out[3] = a4[3] * b;
    out[4] = a4[4] * b;
    out[5] = a4[5] * b;
    out[6] = a4[6] * b;
    out[7] = a4[7] * b;
    out[8] = a4[8] * b;
    out[9] = a4[9] * b;
    out[10] = a4[10] * b;
    out[11] = a4[11] * b;
    out[12] = a4[12] * b;
    out[13] = a4[13] * b;
    out[14] = a4[14] * b;
    out[15] = a4[15] * b;
    return out;
  }
  function multiplyScalarAndAdd(out, a4, b, scale3) {
    out[0] = a4[0] + b[0] * scale3;
    out[1] = a4[1] + b[1] * scale3;
    out[2] = a4[2] + b[2] * scale3;
    out[3] = a4[3] + b[3] * scale3;
    out[4] = a4[4] + b[4] * scale3;
    out[5] = a4[5] + b[5] * scale3;
    out[6] = a4[6] + b[6] * scale3;
    out[7] = a4[7] + b[7] * scale3;
    out[8] = a4[8] + b[8] * scale3;
    out[9] = a4[9] + b[9] * scale3;
    out[10] = a4[10] + b[10] * scale3;
    out[11] = a4[11] + b[11] * scale3;
    out[12] = a4[12] + b[12] * scale3;
    out[13] = a4[13] + b[13] * scale3;
    out[14] = a4[14] + b[14] * scale3;
    out[15] = a4[15] + b[15] * scale3;
    return out;
  }
  function exactEquals(a4, b) {
    return a4[0] === b[0] && a4[1] === b[1] && a4[2] === b[2] && a4[3] === b[3] && a4[4] === b[4] && a4[5] === b[5] && a4[6] === b[6] && a4[7] === b[7] && a4[8] === b[8] && a4[9] === b[9] && a4[10] === b[10] && a4[11] === b[11] && a4[12] === b[12] && a4[13] === b[13] && a4[14] === b[14] && a4[15] === b[15];
  }
  function equals(a4, b) {
    var a0 = a4[0], a1 = a4[1], a22 = a4[2], a32 = a4[3];
    var a42 = a4[4], a5 = a4[5], a6 = a4[6], a7 = a4[7];
    var a8 = a4[8], a9 = a4[9], a10 = a4[10], a11 = a4[11];
    var a12 = a4[12], a13 = a4[13], a14 = a4[14], a15 = a4[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a22 - b2) <= EPSILON * Math.max(1, Math.abs(a22), Math.abs(b2)) && Math.abs(a32 - b3) <= EPSILON * Math.max(1, Math.abs(a32), Math.abs(b3)) && Math.abs(a42 - b4) <= EPSILON * Math.max(1, Math.abs(a42), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
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
  function clone2(a4) {
    var out = new ARRAY_TYPE(3);
    out[0] = a4[0];
    out[1] = a4[1];
    out[2] = a4[2];
    return out;
  }
  function length(a4) {
    var x = a4[0];
    var y = a4[1];
    var z = a4[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  function fromValues2(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function copy2(out, a4) {
    out[0] = a4[0];
    out[1] = a4[1];
    out[2] = a4[2];
    return out;
  }
  function set2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add2(out, a4, b) {
    out[0] = a4[0] + b[0];
    out[1] = a4[1] + b[1];
    out[2] = a4[2] + b[2];
    return out;
  }
  function subtract2(out, a4, b) {
    out[0] = a4[0] - b[0];
    out[1] = a4[1] - b[1];
    out[2] = a4[2] - b[2];
    return out;
  }
  function multiply2(out, a4, b) {
    out[0] = a4[0] * b[0];
    out[1] = a4[1] * b[1];
    out[2] = a4[2] * b[2];
    return out;
  }
  function divide(out, a4, b) {
    out[0] = a4[0] / b[0];
    out[1] = a4[1] / b[1];
    out[2] = a4[2] / b[2];
    return out;
  }
  function ceil(out, a4) {
    out[0] = Math.ceil(a4[0]);
    out[1] = Math.ceil(a4[1]);
    out[2] = Math.ceil(a4[2]);
    return out;
  }
  function floor(out, a4) {
    out[0] = Math.floor(a4[0]);
    out[1] = Math.floor(a4[1]);
    out[2] = Math.floor(a4[2]);
    return out;
  }
  function min(out, a4, b) {
    out[0] = Math.min(a4[0], b[0]);
    out[1] = Math.min(a4[1], b[1]);
    out[2] = Math.min(a4[2], b[2]);
    return out;
  }
  function max(out, a4, b) {
    out[0] = Math.max(a4[0], b[0]);
    out[1] = Math.max(a4[1], b[1]);
    out[2] = Math.max(a4[2], b[2]);
    return out;
  }
  function round2(out, a4) {
    out[0] = round(a4[0]);
    out[1] = round(a4[1]);
    out[2] = round(a4[2]);
    return out;
  }
  function scale2(out, a4, b) {
    out[0] = a4[0] * b;
    out[1] = a4[1] * b;
    out[2] = a4[2] * b;
    return out;
  }
  function scaleAndAdd(out, a4, b, scale3) {
    out[0] = a4[0] + b[0] * scale3;
    out[1] = a4[1] + b[1] * scale3;
    out[2] = a4[2] + b[2] * scale3;
    return out;
  }
  function distance(a4, b) {
    var x = b[0] - a4[0];
    var y = b[1] - a4[1];
    var z = b[2] - a4[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  function squaredDistance(a4, b) {
    var x = b[0] - a4[0];
    var y = b[1] - a4[1];
    var z = b[2] - a4[2];
    return x * x + y * y + z * z;
  }
  function squaredLength(a4) {
    var x = a4[0];
    var y = a4[1];
    var z = a4[2];
    return x * x + y * y + z * z;
  }
  function negate(out, a4) {
    out[0] = -a4[0];
    out[1] = -a4[1];
    out[2] = -a4[2];
    return out;
  }
  function inverse(out, a4) {
    out[0] = 1 / a4[0];
    out[1] = 1 / a4[1];
    out[2] = 1 / a4[2];
    return out;
  }
  function normalize(out, a4) {
    var x = a4[0];
    var y = a4[1];
    var z = a4[2];
    var len2 = x * x + y * y + z * z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = a4[0] * len2;
    out[1] = a4[1] * len2;
    out[2] = a4[2] * len2;
    return out;
  }
  function dot(a4, b) {
    return a4[0] * b[0] + a4[1] * b[1] + a4[2] * b[2];
  }
  function cross(out, a4, b) {
    var ax = a4[0], ay = a4[1], az = a4[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp(out, a4, b, t5) {
    var ax = a4[0];
    var ay = a4[1];
    var az = a4[2];
    out[0] = ax + t5 * (b[0] - ax);
    out[1] = ay + t5 * (b[1] - ay);
    out[2] = az + t5 * (b[2] - az);
    return out;
  }
  function slerp(out, a4, b, t5) {
    var angle2 = Math.acos(Math.min(Math.max(dot(a4, b), -1), 1));
    var sinTotal = Math.sin(angle2);
    var ratioA = Math.sin((1 - t5) * angle2) / sinTotal;
    var ratioB = Math.sin(t5 * angle2) / sinTotal;
    out[0] = ratioA * a4[0] + ratioB * b[0];
    out[1] = ratioA * a4[1] + ratioB * b[1];
    out[2] = ratioA * a4[2] + ratioB * b[2];
    return out;
  }
  function hermite(out, a4, b, c2, d2, t5) {
    var factorTimes2 = t5 * t5;
    var factor1 = factorTimes2 * (2 * t5 - 3) + 1;
    var factor2 = factorTimes2 * (t5 - 2) + t5;
    var factor3 = factorTimes2 * (t5 - 1);
    var factor4 = factorTimes2 * (3 - 2 * t5);
    out[0] = a4[0] * factor1 + b[0] * factor2 + c2[0] * factor3 + d2[0] * factor4;
    out[1] = a4[1] * factor1 + b[1] * factor2 + c2[1] * factor3 + d2[1] * factor4;
    out[2] = a4[2] * factor1 + b[2] * factor2 + c2[2] * factor3 + d2[2] * factor4;
    return out;
  }
  function bezier(out, a4, b, c2, d2, t5) {
    var inverseFactor = 1 - t5;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t5 * t5;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t5 * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t5;
    out[0] = a4[0] * factor1 + b[0] * factor2 + c2[0] * factor3 + d2[0] * factor4;
    out[1] = a4[1] * factor1 + b[1] * factor2 + c2[1] * factor3 + d2[1] * factor4;
    out[2] = a4[2] * factor1 + b[2] * factor2 + c2[2] * factor3 + d2[2] * factor4;
    return out;
  }
  function random(out, scale3) {
    scale3 = scale3 === void 0 ? 1 : scale3;
    var r3 = RANDOM() * 2 * Math.PI;
    var z = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z * z) * scale3;
    out[0] = Math.cos(r3) * zScale;
    out[1] = Math.sin(r3) * zScale;
    out[2] = z * scale3;
    return out;
  }
  function transformMat4(out, a4, m2) {
    var x = a4[0], y = a4[1], z = a4[2];
    var w = m2[3] * x + m2[7] * y + m2[11] * z + m2[15];
    w = w || 1;
    out[0] = (m2[0] * x + m2[4] * y + m2[8] * z + m2[12]) / w;
    out[1] = (m2[1] * x + m2[5] * y + m2[9] * z + m2[13]) / w;
    out[2] = (m2[2] * x + m2[6] * y + m2[10] * z + m2[14]) / w;
    return out;
  }
  function transformMat3(out, a4, m2) {
    var x = a4[0], y = a4[1], z = a4[2];
    out[0] = x * m2[0] + y * m2[3] + z * m2[6];
    out[1] = x * m2[1] + y * m2[4] + z * m2[7];
    out[2] = x * m2[2] + y * m2[5] + z * m2[8];
    return out;
  }
  function transformQuat(out, a4, q) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var vx = a4[0], vy = a4[1], vz = a4[2];
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
  function rotateX2(out, a4, b, rad) {
    var p2 = [], r3 = [];
    p2[0] = a4[0] - b[0];
    p2[1] = a4[1] - b[1];
    p2[2] = a4[2] - b[2];
    r3[0] = p2[0];
    r3[1] = p2[1] * Math.cos(rad) - p2[2] * Math.sin(rad);
    r3[2] = p2[1] * Math.sin(rad) + p2[2] * Math.cos(rad);
    out[0] = r3[0] + b[0];
    out[1] = r3[1] + b[1];
    out[2] = r3[2] + b[2];
    return out;
  }
  function rotateY2(out, a4, b, rad) {
    var p2 = [], r3 = [];
    p2[0] = a4[0] - b[0];
    p2[1] = a4[1] - b[1];
    p2[2] = a4[2] - b[2];
    r3[0] = p2[2] * Math.sin(rad) + p2[0] * Math.cos(rad);
    r3[1] = p2[1];
    r3[2] = p2[2] * Math.cos(rad) - p2[0] * Math.sin(rad);
    out[0] = r3[0] + b[0];
    out[1] = r3[1] + b[1];
    out[2] = r3[2] + b[2];
    return out;
  }
  function rotateZ2(out, a4, b, rad) {
    var p2 = [], r3 = [];
    p2[0] = a4[0] - b[0];
    p2[1] = a4[1] - b[1];
    p2[2] = a4[2] - b[2];
    r3[0] = p2[0] * Math.cos(rad) - p2[1] * Math.sin(rad);
    r3[1] = p2[0] * Math.sin(rad) + p2[1] * Math.cos(rad);
    r3[2] = p2[2];
    out[0] = r3[0] + b[0];
    out[1] = r3[1] + b[1];
    out[2] = r3[2] + b[2];
    return out;
  }
  function angle(a4, b) {
    var ax = a4[0], ay = a4[1], az = a4[2], bx = b[0], by = b[1], bz = b[2], mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz)), cosine = mag && dot(a4, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  function str2(a4) {
    return "vec3(" + a4[0] + ", " + a4[1] + ", " + a4[2] + ")";
  }
  function exactEquals2(a4, b) {
    return a4[0] === b[0] && a4[1] === b[1] && a4[2] === b[2];
  }
  function equals2(a4, b) {
    var a0 = a4[0], a1 = a4[1], a22 = a4[2];
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
    return function (a4, stride, offset, count, fn, arg) {
      var i, l2;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset, a4.length);
      } else {
        l2 = a4.length;
      }
      for (i = offset; i < l2; i += stride) {
        vec[0] = a4[i];
        vec[1] = a4[i + 1];
        vec[2] = a4[i + 2];
        fn(vec, vec, arg);
        a4[i] = vec[0];
        a4[i + 1] = vec[1];
        a4[i + 2] = vec[2];
      }
      return a4;
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
      throw new e("WebGLShader not available.");
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
      throw new e("Unable to initialize the shader program.");
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
  }
  var CurveDrawn = class {
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
          throw new e("Rendering context cannot be null.");
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
  CurveDrawn.fromSerializable = serialized => {
    const {drawMode, numPoints, space, drawCubeArray, curvePosArray, curveColorArray} = serialized;
    return new CurveDrawn(drawMode, numPoints, space, drawCubeArray, curvePosArray, curveColorArray);
  };
  var CURVE_CHANNEL_ID = "sourceacademy-curve-channel";
  var CURVE_WEB_ID = "curve-web";
  var CURVE_TAB_ID = "curve";
  var R;
  !(function (R2) {
    (R2[R2.CALL = 0] = "CALL", R2[R2.RETURN = 1] = "RETURN", R2[R2.RETURN_ERR = 2] = "RETURN_ERR");
  })(R || (R = {}));
  function n2(n4) {}
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
  var __rest = function (s7, e6) {
    var t5 = {};
    for (var p2 in s7) if (Object.prototype.hasOwnProperty.call(s7, p2) && e6.indexOf(p2) < 0) t5[p2] = s7[p2];
    if (s7 != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s7); i < p2.length; i++) {
      if (e6.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s7, p2[i])) t5[p2[i]] = s7[p2[i]];
    }
    return t5;
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
  var __rest2 = function (s7, e6) {
    var t5 = {};
    for (var p2 in s7) if (Object.prototype.hasOwnProperty.call(s7, p2) && e6.indexOf(p2) < 0) t5[p2] = s7[p2];
    if (s7 != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s7); i < p2.length; i++) {
      if (e6.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s7, p2[i])) t5[p2[i]] = s7[p2[i]];
    }
    return t5;
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
  function clamp(value, bound1, bound2) {
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
                    const clampedStep = clamp(newStep, 1, props.elements.length);
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
  var import_react8 = __require("react");
  var import_core9 = __require("@blueprintjs/core");
  var import_jsx_runtime8 = __require("react/jsx-runtime");
  var import_core8 = __require("@blueprintjs/core");
  var import_react5 = __require("react");
  var __rest3 = function (s7, e6) {
    var t5 = {};
    for (var p2 in s7) if (Object.prototype.hasOwnProperty.call(s7, p2) && e6.indexOf(p2) < 0) t5[p2] = s7[p2];
    if (s7 != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s7); i < p2.length; i++) {
      if (e6.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s7, p2[i])) t5[p2[i]] = s7[p2[i]];
    }
    return t5;
  };
  function NumberSelector(_a) {
    var {value, maxValue, minValue, onValueChanged, onCancel, onEdit, onConfirm, customInputAttributes} = _a, props = __rest3(_a, ["value", "maxValue", "minValue", "onValueChanged", "onCancel", "onEdit", "onConfirm", "customInputAttributes"]);
    const [text, setText] = (0, import_react5.useState)(null);
    const maxTextLength = maxValue === 0 ? 1 : Math.floor(Math.log10(maxValue)) + 2;
    return (0, import_jsx_runtime8.jsx)(import_core8.EditableText, Object.assign({}, props, {
      alwaysRenderInput: true,
      customInputAttributes: customInputAttributes === void 0 ? {
        max: maxValue,
        min: minValue
      } : Object.assign(Object.assign({}, customInputAttributes), {
        max: maxValue,
        min: minValue
      }),
      type: "number",
      value: text !== null && text !== void 0 ? text : value.toString(),
      isEditing: text !== null,
      onChange: textValue => {
        if (textValue.length === maxTextLength) return;
        if (text !== null) {
          setText(textValue);
          return;
        }
        const newValue = parseFloat(textValue);
        if (!Number.isNaN(newValue) && onValueChanged) {
          onValueChanged(clamp(newValue, minValue, maxValue));
        }
      },
      onEdit: editValue => {
        setText(value.toString());
        if (onEdit) onEdit(editValue);
      },
      onCancel: value2 => {
        setText(null);
        if (onCancel) onCancel(value2);
      },
      onConfirm: textValue => {
        const newValue = parseFloat(textValue);
        if (!Number.isNaN(newValue) && onValueChanged) {
          onValueChanged(clamp(newValue, minValue, maxValue));
        }
        if (onConfirm) onConfirm(textValue);
        setText(null);
      }
    }));
  }
  var import_rttcErrors = __require("js-slang/dist/errors/rttcErrors");
  var import_base = __require("js-slang/dist/errors/base");
  var import_rttc = __require("js-slang/dist/utils/rttc");
  var import_operators = __require("js-slang/dist/utils/operators");
  function degreesToRadians(degrees) {
    return degrees / 360 * (2 * Math.PI);
  }
  var import_react6 = __require("react");
  var import_jsx_runtime9 = __require("react/jsx-runtime");
  function Canvas3DCurve({curve}) {
    const canvasRef = (0, import_react6.useRef)(null);
    const {isPlaying: isRotating, start, stop, changeTimestamp: setDisplayAngle, timestamp: displayAngle, setCanvas, errored} = useAnimation({
      animationDuration: 7200,
      autoLoop: true,
      callback({timestamp: angle2}) {
        const angleInRadians = degreesToRadians(angle2 / 20);
        curve.redraw(angleInRadians);
      }
    });
    (0, import_react6.useEffect)(() => {
      if (canvasRef.current) {
        curve.init(canvasRef.current);
        setCanvas(canvasRef.current);
      }
    }, [curve, canvasRef.current]);
    return (0, import_jsx_runtime9.jsxs)("div", {
      style: {
        width: "100%"
      },
      children: [(0, import_jsx_runtime9.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: (0, import_jsx_runtime9.jsxs)("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: BP_TAB_BUTTON_MARGIN,
            width: "100%",
            maxWidth: CANVAS_MAX_WIDTH,
            paddingTop: BP_TEXT_MARGIN,
            paddingBottom: BP_TEXT_MARGIN
          },
          children: [(0, import_jsx_runtime9.jsx)(PlayButton, {
            title: "PlayButton",
            isPlaying: isRotating,
            disabled: !!errored,
            onClick: () => {
              if (isRotating) stop(); else start();
            }
          }), (0, import_jsx_runtime9.jsx)(import_core9.Slider, {
            value: displayAngle / 20,
            min: 0,
            max: 360,
            disabled: !!errored,
            labelRenderer: false,
            onChange: newValue => {
              stop();
              setDisplayAngle(newValue * 20);
            }
          }), (0, import_jsx_runtime9.jsx)(import_core9.Tooltip, {
            content: "Angle in Degrees",
            children: (0, import_jsx_runtime9.jsx)(NumberSelector, {
              value: Math.round(displayAngle / 20),
              minValue: 0,
              maxValue: 360,
              customInputAttributes: {
                style: {
                  height: "100%",
                  width: "5ch"
                }
              },
              onValueChanged: value => setDisplayAngle(value * 20)
            })
          })]
        })
      }), (0, import_jsx_runtime9.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: errored ? (0, import_jsx_runtime9.jsx)(AnimationError, {
          error: errored
        }) : (0, import_jsx_runtime9.jsx)(WebGLCanvas_default, {
          ref: canvasRef
        })
      })]
    });
  }
  var import_core10 = __require("@blueprintjs/core");
  var import_react7 = __require("react");
  var import_jsx_runtime10 = __require("react/jsx-runtime");
  function Curve3DAnimationCanvas({animation}) {
    const [displayAngle, setDisplayAngle] = (0, import_react7.useState)(animation.angle);
    const [isAutoLooping, setIsAutoLooping] = (0, import_react7.useState)(true);
    const [wasPlaying, setWasPlaying] = (0, import_react7.useState)(null);
    const frameDuration = 1e3 / animation.fps;
    const animationDuration = Math.round(animation.duration * 1e3);
    const {changeTimestamp, drawFrame, start, stop, reset, timestamp, errored, isPlaying, setCanvas} = useAnimation({
      frameDuration,
      animationDuration,
      autoLoop: isAutoLooping,
      callback({timestamp: timestamp2, canvas}) {
        const frame = animation.getFrame(timestamp2 / 1e3);
        frame.draw(canvas);
      }
    });
    return (0, import_jsx_runtime10.jsxs)("div", {
      style: {
        width: "100%"
      },
      children: [(0, import_jsx_runtime10.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: (0, import_jsx_runtime10.jsxs)("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: BP_TAB_BUTTON_MARGIN,
            width: "100%",
            maxWidth: CANVAS_MAX_WIDTH,
            paddingTop: BP_TEXT_MARGIN,
            paddingBottom: BP_TEXT_MARGIN
          },
          children: [(0, import_jsx_runtime10.jsx)(PlayButton, {
            title: "PlayButton",
            isPlaying,
            disabled: Boolean(errored),
            onClick: () => {
              if (isPlaying) stop(); else {
                if (timestamp >= animationDuration) reset();
                start();
              }
            }
          }), (0, import_jsx_runtime10.jsx)(import_core10.Tooltip, {
            content: "Reset",
            placement: "top",
            children: (0, import_jsx_runtime10.jsx)(ButtonComponent, {
              disabled: Boolean(errored),
              onClick: reset,
              children: (0, import_jsx_runtime10.jsx)(import_core10.Icon, {
                icon: "reset"
              })
            })
          }), (0, import_jsx_runtime10.jsxs)("div", {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: BP_TEXT_MARGIN,
              width: "100%"
            },
            children: [(0, import_jsx_runtime10.jsx)(import_core10.Slider, {
              value: timestamp,
              min: 0,
              max: animationDuration,
              stepSize: 1,
              labelRenderer: false,
              disabled: Boolean(errored),
              onChange: newValue => {
                changeTimestamp(newValue);
                if (wasPlaying === null) {
                  setWasPlaying(isPlaying);
                }
                stop();
              },
              onRelease: () => {
                if (wasPlaying) start();
                setWasPlaying(null);
              }
            }), (0, import_jsx_runtime10.jsx)(import_core10.Tooltip, {
              content: "Display Angle",
              placement: "top",
              children: (0, import_jsx_runtime10.jsx)(import_core10.Slider, {
                value: displayAngle,
                min: 0,
                max: 2 * Math.PI,
                stepSize: 0.01,
                labelRenderer: false,
                disabled: Boolean(errored),
                onChange: value => {
                  setDisplayAngle(value);
                  if (!isPlaying) drawFrame();
                  animation.angle = value;
                }
              })
            })]
          }), (0, import_jsx_runtime10.jsx)(AutoLoopSwitch, {
            isAutoLooping,
            disabled: Boolean(errored),
            onChange: () => setIsAutoLooping(prev => !prev)
          })]
        })
      }), (0, import_jsx_runtime10.jsx)("div", {
        style: {
          display: "flex",
          justifyContent: "center"
        },
        children: errored ? (0, import_jsx_runtime10.jsx)(AnimationError, {
          error: errored
        }) : (0, import_jsx_runtime10.jsx)(WebGLCanvas_default, {
          style: {
            flexGrow: 1
          },
          ref: canvas => {
            if (canvas) {
              setCanvas(canvas);
            }
          }
        })
      })]
    });
  }
  var import_jsx_runtime11 = __require("react/jsx-runtime");
  function deserializeCurveDrawn(serialized) {
    return new CurveDrawn(serialized.drawMode, serialized.numPoints, serialized.space, serialized.drawCubeArray, serialized.curvePosArray, serialized.curveColorArray);
  }
  var SerializedCurveAnimation = class extends glAnimation {
    constructor(message) {
      super(message.duration, message.fps);
      this.message = message;
      this.angle = 0;
      this.is3D = message.is3D;
    }
    getFrame(timestamp) {
      if (this.message.frames.length === 0) {
        return {
          draw: () => void 0
        };
      }
      const frame = Math.min(Math.floor(timestamp * this.message.fps), this.message.frames.length - 1);
      const curve = deserializeCurveDrawn(this.message.frames[frame]);
      return {
        draw: canvas => {
          curve.init(canvas);
          curve.redraw(this.angle);
        }
      };
    }
  };
  function RenderedCurve({message}) {
    const curve = (0, import_react8.useMemo)(() => deserializeCurveDrawn(message.curve), [message]);
    if (curve.is3D) {
      return (0, import_jsx_runtime11.jsx)(Canvas3DCurve, {
        curve
      });
    }
    return (0, import_jsx_runtime11.jsx)(WebGLCanvas_default, {
      ref: canvas => {
        if (canvas) {
          curve.init(canvas);
          curve.redraw(0);
        }
      }
    });
  }
  function RenderedAnimation({message}) {
    const animation = (0, import_react8.useMemo)(() => new SerializedCurveAnimation(message), [message]);
    return message.is3D ? (0, import_jsx_runtime11.jsx)(Curve3DAnimationCanvas, {
      animation
    }) : (0, import_jsx_runtime11.jsx)(AnimationCanvas, {
      animation
    });
  }
  function CurveTab({messages}) {
    const canvases = messages.map((message, index) => {
      const key = index.toString();
      if (message.type === "animation") {
        return (0, import_jsx_runtime11.jsx)(RenderedAnimation, {
          message
        }, key);
      }
      return (0, import_jsx_runtime11.jsx)(RenderedCurve, {
        message
      }, key);
    });
    return (0, import_jsx_runtime11.jsx)(MultiItemDisplay, {
      elements: canvases
    });
  }
  var CurveTabPlugin = class {
    constructor(_conduit, [curveChannel], tabService) {
      this.id = CURVE_WEB_ID;
      this.__listeners = new Set();
      this.__messages = [];
      this.__handleMessage = message => {
        if (message.type === "request") return;
        this.__messages = [...this.__messages, message];
        this.__emit();
        this.__tabService.showTab(CURVE_TAB_ID);
      };
      if (!curveChannel) {
        throw new Error("Curve channel is required but was not provided.");
      }
      this.__curveChannel = curveChannel;
      this.__tabService = tabService;
      const subscribe = listener => this.subscribe(listener);
      const getMessages = () => this.getMessages();
      function CurvePluginTab() {
        const messages = (0, import_react8.useSyncExternalStore)(subscribe, getMessages);
        return (0, import_react8.createElement)(CurveTab, {
          messages
        });
      }
      const tab = {
        id: CURVE_TAB_ID,
        iconName: import_icons.IconNames.MEDIA,
        body: (0, import_react8.createElement)(CurvePluginTab),
        label: "Curves Tab",
        disabled: false
      };
      this.__tabService.registerTab(tab);
      this.__curveChannel.subscribe(this.__handleMessage);
      this.__curveChannel.send({
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
      this.__curveChannel.unsubscribe(this.__handleMessage);
    }
    __emit() {
      this.__listeners.forEach(listener => listener());
    }
  };
  CurveTabPlugin.channelAttach = [CURVE_CHANNEL_ID];
  n2(CurveTabPlugin);
  return __toCommonJS(index_exports);
};