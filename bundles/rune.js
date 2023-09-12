require => {
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
    throw new Error('Dynamic require of "' + x + '" is not supported');
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
  var rune_exports = {};
  __export(rune_exports, {
    anaglyph: () => anaglyph,
    animate_anaglyph: () => animate_anaglyph,
    animate_rune: () => animate_rune,
    beside: () => beside,
    beside_frac: () => beside_frac,
    black: () => black,
    blank: () => blank,
    blue: () => blue,
    brown: () => brown,
    circle: () => circle,
    color: () => color,
    corner: () => corner,
    flip_horiz: () => flip_horiz,
    flip_vert: () => flip_vert,
    from_url: () => from_url,
    green: () => green,
    heart: () => heart,
    hollusion: () => hollusion,
    hollusion_magnitude: () => hollusion_magnitude,
    indigo: () => indigo,
    make_cross: () => make_cross,
    nova: () => nova,
    orange: () => orange,
    overlay: () => overlay,
    overlay_frac: () => overlay_frac,
    pentagram: () => pentagram,
    pink: () => pink,
    purple: () => purple,
    quarter_turn_left: () => quarter_turn_left,
    quarter_turn_right: () => quarter_turn_right,
    random_color: () => random_color,
    rcross: () => rcross,
    red: () => red,
    repeat_pattern: () => repeat_pattern,
    ribbon: () => ribbon,
    rotate: () => rotate2,
    sail: () => sail,
    scale: () => scale3,
    scale_independent: () => scale_independent,
    show: () => show,
    square: () => square,
    stack: () => stack,
    stack_frac: () => stack_frac,
    stackn: () => stackn,
    translate: () => translate2,
    triangle: () => triangle,
    turn_upside_down: () => turn_upside_down,
    white: () => white,
    yellow: () => yellow
  });
  var import_context = __toESM(__require("js-slang/context"), 1);
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var RANDOM = Math.random;
  var degree = Math.PI / 180;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
  var mat4_exports = {};
  __export(mat4_exports, {
    add: () => add,
    adjoint: () => adjoint,
    clone: () => clone,
    copy: () => copy,
    create: () => create,
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
  function clone(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
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
  function transpose(out, a) {
    if (out === a) {
      var a01 = a[1], a02 = a[2], a03 = a[3];
      var a12 = a[6], a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
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
  function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
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
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
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
  function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
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
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len2 = Math.hypot(x, y, z);
    var s, c, t;
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
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
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
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
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
    var len2 = Math.hypot(x, y, z);
    var s, c, t;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromZRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
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
  function fromQuat2(out, a) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
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
    fromRotationTranslation(out, a, translation);
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
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
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
  function fromRotationTranslationScale(out, q, v, s) {
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
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
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
  function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
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
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
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
    var f = 1 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
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
    var f = 1 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
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
    len2 = 1 / Math.hypot(z0, z1, z2);
    z0 *= len2;
    z1 *= len2;
    z2 *= len2;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len2 = Math.hypot(x0, x1, x2);
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
    len2 = Math.hypot(y0, y1, y2);
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
  function str(a) {
    return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
  }
  function frob(a) {
    return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
  }
  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }
  function multiplyScalarAndAdd(out, a, b, scale4) {
    out[0] = a[0] + b[0] * scale4;
    out[1] = a[1] + b[1] * scale4;
    out[2] = a[2] + b[2] * scale4;
    out[3] = a[3] + b[3] * scale4;
    out[4] = a[4] + b[4] * scale4;
    out[5] = a[5] + b[5] * scale4;
    out[6] = a[6] + b[6] * scale4;
    out[7] = a[7] + b[7] * scale4;
    out[8] = a[8] + b[8] * scale4;
    out[9] = a[9] + b[9] * scale4;
    out[10] = a[10] + b[10] * scale4;
    out[11] = a[11] + b[11] * scale4;
    out[12] = a[12] + b[12] * scale4;
    out[13] = a[13] + b[13] * scale4;
    out[14] = a[14] + b[14] * scale4;
    out[15] = a[15] + b[15] * scale4;
    return out;
  }
  function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  function equals(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
    var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
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
    round: () => round,
    scale: () => scale2,
    scaleAndAdd: () => scaleAndAdd,
    set: () => set2,
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
  function clone2(a) {
    var out = new ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  function fromValues2(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function copy2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function set2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add2(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  function subtract2(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  function multiply2(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }
  function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }
  function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
  }
  function scale2(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  function scaleAndAdd(out, a, b, scale4) {
    out[0] = a[0] + b[0] * scale4;
    out[1] = a[1] + b[1] * scale4;
    out[2] = a[2] + b[2] * scale4;
    return out;
  }
  function distance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return Math.hypot(x, y, z);
  }
  function squaredDistance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  function squaredLength(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return x * x + y * y + z * z;
  }
  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  function inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len2 = x * x + y * y + z * z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = a[0] * len2;
    out[1] = a[1] * len2;
    out[2] = a[2] * len2;
    return out;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  function hermite(out, a, b, c, d, t) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  function bezier(out, a, b, c, d, t) {
    var inverseFactor = 1 - t;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t * t;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  function random(out, scale4) {
    scale4 = scale4 || 1;
    var r = RANDOM() * 2 * Math.PI;
    var z = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z * z) * scale4;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale4;
    return out;
  }
  function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  function transformMat3(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  function transformQuat(out, a, q) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var x = a[0], y = a[1], z = a[2];
    var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
    var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  function rotateX2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0];
    r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
    r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateY2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateZ2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
    r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
    r[2] = p[2];
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function angle(a, b) {
    var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  function str2(a) {
    return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
  }
  function exactEquals2(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  function equals2(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
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
    return function (a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }
      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }
      return a;
    };
  })();
  var glAnimation = class {
    constructor(duration, fps) {
      this.duration = duration;
      this.fps = fps;
    }
  };
  glAnimation.isAnimation = obj => obj.fps !== void 0;
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error("WebGLShader not available.");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      const compilationLog = gl.getShaderInfoLog(shader);
      throw Error(`Shader compilation failed: ${compilationLog}`);
    }
    return shader;
  }
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      throw new Error("Unable to initialize the shader program.");
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
  }
  function getWebGlFromCanvas(canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw Error("Unable to initialize WebGL.");
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
      throw Error("Failed to create frame buffer object");
    }
    const texture = gl.createTexture();
    if (!texture) {
      throw Error("Failed to create texture object");
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    const depthBuffer = gl.createRenderbuffer();
    if (!depthBuffer) {
      throw Error("Failed to create renderbuffer object");
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
    const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
      throw Error(`Frame buffer object is incomplete:${e.toString()}`);
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
  var _Rune = class {
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
  var Rune = _Rune;
  Rune.of = (params = {}) => {
    const paramGetter = (name, defaultValue) => params[name] === void 0 ? defaultValue() : params[name];
    return new _Rune(paramGetter("vertices", () => new Float32Array()), paramGetter("colors", () => null), paramGetter("transformMatrix", mat4_exports.create), paramGetter("subRunes", () => []), paramGetter("texture", () => null), paramGetter("hollusionDistance", () => 0.1));
  };
  function drawRunesToFrameBuffer(gl, runes, cameraMatrix, colorFilter, framebuffer = null, depthSwitch = false) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    const shaderProgram = initShaderProgram(gl, normalVertexShader, normalFragmentShader);
    gl.useProgram(shaderProgram);
    if (gl === null) {
      throw Error("Rendering Context not initialized for drawRune.");
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
    const loadTexture = image => {
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
    };
    runes.forEach(rune => {
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, rune.vertices, gl.STATIC_DRAW);
      gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPositionPointer);
      if (rune.texture === null) {
        gl.uniform4fv(vertexColorPointer, rune.colors || new Float32Array([0, 0, 0, 1]));
        gl.uniform1i(textureSwitchPointer, 0);
      } else {
        const texture = loadTexture(rune.texture);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(texturePointer, 0);
        gl.uniform1i(textureSwitchPointer, 1);
      }
      gl.uniformMatrix4fv(modelViewMatrixPointer, false, rune.transformMatrix);
      const vertexCount = rune.vertices.length / 4;
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
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
  var NormalRune = class extends DrawnRune {
    constructor(rune) {
      super(rune, false);
      this.draw = canvas => {
        const gl = getWebGlFromCanvas(canvas);
        const cameraMatrix = mat4_exports.create();
        drawRunesToFrameBuffer(gl, this.rune.flatten(), cameraMatrix, new Float32Array([1, 1, 1, 1]), null, true);
      };
    }
  };
  var AnimatedRune = class extends glAnimation {
    constructor(duration, fps, func) {
      super(duration, fps);
      this.func = func;
      this.toReplString = () => "<AnimatedRune>";
    }
    getFrame(num) {
      const rune = this.func(num);
      return {
        draw: rune.draw
      };
    }
  };
  function throwIfNotRune(name, ...runes) {
    runes.forEach(rune => {
      if (!(rune instanceof Rune)) {
        throw Error(`${name} expects a rune as argument.`);
      }
    });
  }
  var getSquare = () => {
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
  };
  var getBlank = () => Rune.of();
  var getRcross = () => {
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
  };
  var getSail = () => {
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
  };
  var getTriangle = () => {
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
  };
  var getCorner = () => {
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
  };
  var getNova = () => {
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
  };
  var getCircle = () => {
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
  };
  var getHeart = () => {
    const vertexList = [];
    const colorList = [];
    const root2 = Math.sqrt(2);
    const r = 4 / (2 + 3 * root2);
    const scaleX = 1 / (r * (1 + root2 / 2));
    const numPoints = 100;
    const rightCenterX = r / root2;
    const rightCenterY = 1 - r;
    for (let i = 0; i < numPoints; i += 1) {
      const angle1 = Math.PI * (-1 / 4 + i / numPoints);
      const angle2 = Math.PI * (-1 / 4 + (i + 1) / numPoints);
      vertexList.push((Math.cos(angle1) * r + rightCenterX) * scaleX, Math.sin(angle1) * r + rightCenterY, 0, 1);
      vertexList.push((Math.cos(angle2) * r + rightCenterX) * scaleX, Math.sin(angle2) * r + rightCenterY, 0, 1);
      vertexList.push(0, -1, 0, 1);
    }
    const leftCenterX = -r / root2;
    const leftCenterY = 1 - r;
    for (let i = 0; i <= numPoints; i += 1) {
      const angle1 = Math.PI * (1 / 4 + i / numPoints);
      const angle2 = Math.PI * (1 / 4 + (i + 1) / numPoints);
      vertexList.push((Math.cos(angle1) * r + leftCenterX) * scaleX, Math.sin(angle1) * r + leftCenterY, 0, 1);
      vertexList.push((Math.cos(angle2) * r + leftCenterX) * scaleX, Math.sin(angle2) * r + leftCenterY, 0, 1);
      vertexList.push(0, -1, 0, 1);
    }
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  };
  var getPentagram = () => {
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
  };
  var getRibbon = () => {
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
  };
  var colorPalette = ["#F44336", "#E91E63", "#AA00FF", "#3F51B5", "#2196F3", "#4CAF50", "#FFEB3B", "#FF9800", "#795548"];
  function hexToColor(hex) {
    const result = new RegExp("^#?(?<red>[a-f\\d]{2})(?<green>[a-f\\d]{2})(?<blue>[a-f\\d]{2})$", "iu").exec(hex);
    if (result === null || result.length < 4) {
      return [0, 0, 0];
    }
    return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255, 1];
  }
  function addColorFromHex(rune, hex) {
    throwIfNotRune("addColorFromHex", rune);
    return Rune.of({
      subRunes: [rune],
      colors: new Float32Array(hexToColor(hex))
    });
  }
  var drawnRunes = [];
  import_context.default.moduleContexts.rune.state = {
    drawnRunes
  };
  var square = getSquare();
  var blank = getBlank();
  var rcross = getRcross();
  var sail = getSail();
  var triangle = getTriangle();
  var corner = getCorner();
  var nova = getNova();
  var circle = getCircle();
  var heart = getHeart();
  var pentagram = getPentagram();
  var ribbon = getRibbon();
  function from_url(imageUrl) {
    const rune = getSquare();
    rune.texture = new Image();
    rune.texture.crossOrigin = "anonymous";
    rune.texture.src = imageUrl;
    return rune;
  }
  function scale_independent(ratio_x, ratio_y, rune) {
    throwIfNotRune("scale_independent", rune);
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
  function scale3(ratio, rune) {
    throwIfNotRune("scale", rune);
    return scale_independent(ratio, ratio, rune);
  }
  function translate2(x, y, rune) {
    throwIfNotRune("translate", rune);
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
  function rotate2(rad, rune) {
    throwIfNotRune("rotate", rune);
    const rotateMat = mat4_exports.create();
    mat4_exports.rotateZ(rotateMat, rotateMat, rad);
    const wrapperMat = mat4_exports.create();
    mat4_exports.multiply(wrapperMat, rotateMat, wrapperMat);
    return Rune.of({
      subRunes: [rune],
      transformMatrix: wrapperMat
    });
  }
  function stack_frac(frac, rune1, rune2) {
    throwIfNotRune("stack_frac", rune1);
    throwIfNotRune("stack_frac", rune2);
    if (!(frac >= 0 && frac <= 1)) {
      throw Error("stack_frac can only take fraction in [0,1].");
    }
    const upper = translate2(0, -(1 - frac), scale_independent(1, frac, rune1));
    const lower = translate2(0, frac, scale_independent(1, 1 - frac, rune2));
    return Rune.of({
      subRunes: [upper, lower]
    });
  }
  function stack(rune1, rune2) {
    throwIfNotRune("stack", rune1, rune2);
    return stack_frac(1 / 2, rune1, rune2);
  }
  function stackn(n, rune) {
    throwIfNotRune("stackn", rune);
    if (n === 1) {
      return rune;
    }
    return stack_frac(1 / n, rune, stackn(n - 1, rune));
  }
  function quarter_turn_right(rune) {
    throwIfNotRune("quarter_turn_right", rune);
    return rotate2(-Math.PI / 2, rune);
  }
  function quarter_turn_left(rune) {
    throwIfNotRune("quarter_turn_left", rune);
    return rotate2(Math.PI / 2, rune);
  }
  function turn_upside_down(rune) {
    throwIfNotRune("turn_upside_down", rune);
    return rotate2(Math.PI, rune);
  }
  function beside_frac(frac, rune1, rune2) {
    throwIfNotRune("beside_frac", rune1, rune2);
    if (!(frac >= 0 && frac <= 1)) {
      throw Error("beside_frac can only take fraction in [0,1].");
    }
    const left = translate2(-(1 - frac), 0, scale_independent(frac, 1, rune1));
    const right = translate2(frac, 0, scale_independent(1 - frac, 1, rune2));
    return Rune.of({
      subRunes: [left, right]
    });
  }
  function beside(rune1, rune2) {
    throwIfNotRune("beside", rune1, rune2);
    return beside_frac(1 / 2, rune1, rune2);
  }
  function flip_vert(rune) {
    throwIfNotRune("flip_vert", rune);
    return scale_independent(1, -1, rune);
  }
  function flip_horiz(rune) {
    throwIfNotRune("flip_horiz", rune);
    return scale_independent(-1, 1, rune);
  }
  function make_cross(rune) {
    throwIfNotRune("make_cross", rune);
    return stack(beside(quarter_turn_right(rune), rotate2(Math.PI, rune)), beside(rune, rotate2(Math.PI / 2, rune)));
  }
  function repeat_pattern(n, pattern, initial) {
    if (n === 0) {
      return initial;
    }
    return pattern(repeat_pattern(n - 1, pattern, initial));
  }
  function overlay_frac(frac, rune1, rune2) {
    throwIfNotRune("overlay_frac", rune1);
    throwIfNotRune("overlay_frac", rune2);
    if (!(frac >= 0 && frac <= 1)) {
      throw Error("overlay_frac can only take fraction in [0,1].");
    }
    let useFrac = frac;
    const minFrac = 1e-6;
    const maxFrac = 1 - minFrac;
    if (useFrac < minFrac) {
      useFrac = minFrac;
    }
    if (useFrac > maxFrac) {
      useFrac = maxFrac;
    }
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
  function overlay(rune1, rune2) {
    throwIfNotRune("overlay", rune1);
    throwIfNotRune("overlay", rune2);
    return overlay_frac(0.5, rune1, rune2);
  }
  function color(rune, r, g, b) {
    throwIfNotRune("color", rune);
    const colorVector = [r, g, b, 1];
    return Rune.of({
      colors: new Float32Array(colorVector),
      subRunes: [rune]
    });
  }
  function random_color(rune) {
    throwIfNotRune("random_color", rune);
    const randomColor = hexToColor(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
    return Rune.of({
      colors: new Float32Array(randomColor),
      subRunes: [rune]
    });
  }
  function red(rune) {
    throwIfNotRune("red", rune);
    return addColorFromHex(rune, "#F44336");
  }
  function pink(rune) {
    throwIfNotRune("pink", rune);
    return addColorFromHex(rune, "#E91E63");
  }
  function purple(rune) {
    throwIfNotRune("purple", rune);
    return addColorFromHex(rune, "#AA00FF");
  }
  function indigo(rune) {
    throwIfNotRune("indigo", rune);
    return addColorFromHex(rune, "#3F51B5");
  }
  function blue(rune) {
    throwIfNotRune("blue", rune);
    return addColorFromHex(rune, "#2196F3");
  }
  function green(rune) {
    throwIfNotRune("green", rune);
    return addColorFromHex(rune, "#4CAF50");
  }
  function yellow(rune) {
    throwIfNotRune("yellow", rune);
    return addColorFromHex(rune, "#FFEB3B");
  }
  function orange(rune) {
    throwIfNotRune("orange", rune);
    return addColorFromHex(rune, "#FF9800");
  }
  function brown(rune) {
    throwIfNotRune("brown", rune);
    return addColorFromHex(rune, "#795548");
  }
  function black(rune) {
    throwIfNotRune("black", rune);
    return addColorFromHex(rune, "#000000");
  }
  function white(rune) {
    throwIfNotRune("white", rune);
    return addColorFromHex(rune, "#FFFFFF");
  }
  function show(rune) {
    throwIfNotRune("show", rune);
    drawnRunes.push(new NormalRune(rune));
    return rune;
  }
  var _AnaglyphRune = class extends DrawnRune {
    constructor(rune) {
      super(rune, false);
      this.draw = canvas => {
        const gl = getWebGlFromCanvas(canvas);
        const runes = white(overlay_frac(0.999999999, blank, scale3(2.2, square))).flatten().concat(this.rune.flatten());
        const halfEyeDistance = 0.03;
        const leftCameraMatrix = mat4_exports.create();
        mat4_exports.lookAt(leftCameraMatrix, vec3_exports.fromValues(-halfEyeDistance, 0, 0), vec3_exports.fromValues(0, 0, -0.4), vec3_exports.fromValues(0, 1, 0));
        const rightCameraMatrix = mat4_exports.create();
        mat4_exports.lookAt(rightCameraMatrix, vec3_exports.fromValues(halfEyeDistance, 0, 0), vec3_exports.fromValues(0, 0, -0.4), vec3_exports.fromValues(0, 1, 0));
        const leftBuffer = initFramebufferObject(gl);
        const rightBuffer = initFramebufferObject(gl);
        drawRunesToFrameBuffer(gl, runes, leftCameraMatrix, new Float32Array([1, 0, 0, 1]), leftBuffer.framebuffer, true);
        drawRunesToFrameBuffer(gl, runes, rightCameraMatrix, new Float32Array([0, 1, 1, 1]), rightBuffer.framebuffer, true);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        const shaderProgram = initShaderProgram(gl, _AnaglyphRune.anaglyphVertexShader, _AnaglyphRune.anaglyphFragmentShader);
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
      };
    }
  };
  var AnaglyphRune = _AnaglyphRune;
  AnaglyphRune.anaglyphVertexShader = `
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
  AnaglyphRune.anaglyphFragmentShader = `
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
  function anaglyph(rune) {
    throwIfNotRune("anaglyph", rune);
    drawnRunes.push(new AnaglyphRune(rune));
    return rune;
  }
  var _HollusionRune = class extends DrawnRune {
    constructor(rune, magnitude) {
      super(rune, true);
      this.draw = canvas => {
        const gl = getWebGlFromCanvas(canvas);
        const runes = white(overlay_frac(0.999999999, blank, scale3(2.2, square))).flatten().concat(this.rune.flatten());
        const xshiftMax = runes[0].hollusionDistance;
        const period = 2e3;
        const frameCount = 50;
        const frameBuffer = [];
        const renderFrame = framePos => {
          const fb = initFramebufferObject(gl);
          const cameraMatrix = mat4_exports.create();
          let xshift = framePos * (period / frameCount) % period;
          if (xshift > period / 2) {
            xshift = period - xshift;
          }
          xshift = xshiftMax * (2 * (2 * xshift / period) - 1);
          mat4_exports.lookAt(cameraMatrix, vec3_exports.fromValues(xshift, 0, 0), vec3_exports.fromValues(0, 0, -0.4), vec3_exports.fromValues(0, 1, 0));
          drawRunesToFrameBuffer(gl, runes, cameraMatrix, new Float32Array([1, 1, 1, 1]), fb.framebuffer, true);
          return fb;
        };
        for (let i = 0; i < frameCount; i += 1) {
          frameBuffer.push(renderFrame(i));
        }
        const copyShaderProgram = initShaderProgram(gl, _HollusionRune.copyVertexShader, _HollusionRune.copyFragmentShader);
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
      };
      this.rune.hollusionDistance = magnitude;
    }
  };
  var HollusionRune = _HollusionRune;
  HollusionRune.copyVertexShader = `
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
  HollusionRune.copyFragmentShader = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(uTexture, v_texturePosition);
    }
    `;
  function hollusion_magnitude(rune, magnitude) {
    throwIfNotRune("hollusion_magnitude", rune);
    drawnRunes.push(new HollusionRune(rune, magnitude));
    return rune;
  }
  function hollusion(rune) {
    throwIfNotRune("hollusion", rune);
    return hollusion_magnitude(rune, 0.1);
  }
  function animate_rune(duration, fps, func) {
    const anim = new AnimatedRune(duration, fps, n => {
      const rune = func(n);
      throwIfNotRune("animate_rune", rune);
      return new NormalRune(rune);
    });
    drawnRunes.push(anim);
    return anim;
  }
  function animate_anaglyph(duration, fps, func) {
    const anim = new AnimatedRune(duration, fps, n => {
      const rune = func(n);
      throwIfNotRune("animate_anaglyph", rune);
      return new AnaglyphRune(rune);
    });
    drawnRunes.push(anim);
    return anim;
  }
  return __toCommonJS(rune_exports);
}