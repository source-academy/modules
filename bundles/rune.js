(function (moduleHelpers) {
  'use strict';
  var exports = {};
  (function () {
    const env = {};
    try {
      if (process) {
        process.env = Object.assign({}, process.env);
        Object.assign(process.env, env);
        return;
      }
    } catch (e) {}
    globalThis.process = {
      env: env
    };
  })();
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || ({
      __proto__: []
    }) instanceof Array && (function (d, b) {
      d.__proto__ = b;
    }) || (function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    });
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
  function create$5() {
    var out = new ARRAY_TYPE(9);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }
  function create$4() {
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
  function translate$1(out, a, v) {
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
  function scale$1(out, a, v) {
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
  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
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
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
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
  function create$3() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  function fromValues(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function normalize$2(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
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
  var len = length;
  (function () {
    var vec = create$3();
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
  function create$2() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }
    return out;
  }
  function normalize$1(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len = x * x + y * y + z * z + w * w;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
  }
  (function () {
    var vec = create$2();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 4;
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
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }
      return a;
    };
  })();
  function create$1() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    out[3] = 1;
    return out;
  }
  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  function slerp(out, a, b, t) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    var omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1.0 - cosom > EPSILON) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1.0 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  function fromMat3(out, m) {
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;
    if (fTrace > 0.0) {
      fRoot = Math.sqrt(fTrace + 1.0);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      var i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
  }
  var normalize = normalize$1;
  (function () {
    var tmpvec3 = create$3();
    var xUnitVec3 = fromValues(1, 0, 0);
    var yUnitVec3 = fromValues(0, 1, 0);
    return function (out, a, b) {
      var dot$1 = dot(a, b);
      if (dot$1 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
        normalize$2(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$1 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot$1;
        return normalize(out, out);
      }
    };
  })();
  (function () {
    var temp1 = create$1();
    var temp2 = create$1();
    return function (out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  })();
  (function () {
    var matr = create$5();
    return function (out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize(out, fromMat3(out, matr));
    };
  })();
  function create() {
    var out = new ARRAY_TYPE(2);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }
    return out;
  }
  (function () {
    var vec = create();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 2;
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
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
      }
      return a;
    };
  })();
  var glAnimation = (function () {
    function glAnimation(duration, fps) {
      this.duration = duration;
      this.fps = fps;
    }
    glAnimation.isAnimation = function (obj) {
      return obj.fps !== undefined;
    };
    return glAnimation;
  })();
  function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) {
      throw new Error("WebGLShader not available.");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var compilationLog = gl.getShaderInfoLog(shader);
      throw Error(("Shader compilation failed: ").concat(compilationLog));
    }
    return shader;
  }
  function initShaderProgram(gl, vsSource, fsSource) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    var shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      throw new Error("Unable to initialize the shader program.");
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
  }
  function getWebGlFromCanvas(canvas) {
    var gl = canvas.getContext("webgl");
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
    var framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
      throw Error("Failed to create frame buffer object");
    }
    var texture = gl.createTexture();
    if (!texture) {
      throw Error("Failed to create texture object");
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    var depthBuffer = gl.createRenderbuffer();
    if (!depthBuffer) {
      throw Error("Failed to create renderbuffer object");
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
      throw Error(("Frame buffer object is incomplete:").concat(e.toString()));
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    return {
      framebuffer: framebuffer,
      texture: texture
    };
  }
  var normalVertexShader = "\nattribute vec4 aVertexPosition;\nuniform vec4 uVertexColor;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat4 uCameraMatrix;\n\nvarying lowp vec4 vColor;\nvarying highp vec2 vTexturePosition;\nvarying lowp float colorFactor;\nvoid main(void) {\n  gl_Position = uProjectionMatrix * uCameraMatrix * uModelViewMatrix * aVertexPosition;\n  vColor = uVertexColor;\n\n  // texture position is in [0,1], vertex position is in [-1,1]\n  vTexturePosition.x = (aVertexPosition.x + 1.0) / 2.0;\n  vTexturePosition.y = 1.0 - (aVertexPosition.y + 1.0) / 2.0;\n\n  colorFactor = gl_Position.z;\n}\n";
  var normalFragmentShader = "\nprecision mediump float;\nuniform bool uRenderWithTexture;\nuniform bool uRenderWithDepthColor;\nuniform sampler2D uTexture;\nvarying lowp float colorFactor;\nuniform vec4 uColorFilter;\n\n\nvarying lowp vec4 vColor;\nvarying highp vec2 vTexturePosition;\nvoid main(void) {\n  if (uRenderWithTexture){\n    gl_FragColor = texture2D(uTexture, vTexturePosition);\n  } else {\n    gl_FragColor = vColor;\n  }\n  if (uRenderWithDepthColor){\n    gl_FragColor += (colorFactor + 0.5) * (1.0 - gl_FragColor);\n    gl_FragColor.a = 1.0;\n  }\n  gl_FragColor = uColorFilter * gl_FragColor + 1.0 - uColorFilter;\n  gl_FragColor.a = 1.0;\n}\n";
  var Rune = (function () {
    function Rune(vertices, colors, transformMatrix, subRunes, texture, hollusionDistance) {
      var _this = this;
      this.vertices = vertices;
      this.colors = colors;
      this.transformMatrix = transformMatrix;
      this.subRunes = subRunes;
      this.texture = texture;
      this.hollusionDistance = hollusionDistance;
      this.copy = function () {
        return new Rune(_this.vertices, _this.colors, clone(_this.transformMatrix), _this.subRunes, _this.texture, _this.hollusionDistance);
      };
      this.flatten = function () {
        var runeList = [];
        var runeTodoList = [_this.copy()];
        var _loop_1 = function _loop_1() {
          var runeToExpand = runeTodoList.pop();
          runeToExpand.subRunes.forEach(function (subRune) {
            var subRuneCopy = subRune.copy();
            multiply(subRuneCopy.transformMatrix, runeToExpand.transformMatrix, subRuneCopy.transformMatrix);
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
        };
        while (runeTodoList.length !== 0) {
          _loop_1();
        }
        return runeList;
      };
      this.toReplString = function () {
        return "<Rune>";
      };
    }
    Rune.of = function (params) {
      if (params === void 0) {
        params = {};
      }
      var paramGetter = function paramGetter(name, defaultValue) {
        return params[name] === undefined ? defaultValue() : params[name];
      };
      return new Rune(paramGetter("vertices", function () {
        return new Float32Array();
      }), paramGetter("colors", function () {
        return null;
      }), paramGetter("transformMatrix", create$4), paramGetter("subRunes", function () {
        return [];
      }), paramGetter("texture", function () {
        return null;
      }), paramGetter("hollusionDistance", function () {
        return 0.1;
      }));
    };
    return Rune;
  })();
  function drawRunesToFrameBuffer(gl, runes, cameraMatrix, colorFilter, framebuffer, depthSwitch) {
    if (framebuffer === void 0) {
      framebuffer = null;
    }
    if (depthSwitch === void 0) {
      depthSwitch = false;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    var shaderProgram = initShaderProgram(gl, normalVertexShader, normalFragmentShader);
    gl.useProgram(shaderProgram);
    if (gl === null) {
      throw Error("Rendering Context not initialized for drawRune.");
    }
    var vertexPositionPointer = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    var vertexColorPointer = gl.getUniformLocation(shaderProgram, "uVertexColor");
    var vertexColorFilterPt = gl.getUniformLocation(shaderProgram, "uColorFilter");
    var projectionMatrixPointer = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    var cameraMatrixPointer = gl.getUniformLocation(shaderProgram, "uCameraMatrix");
    var modelViewMatrixPointer = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    var textureSwitchPointer = gl.getUniformLocation(shaderProgram, "uRenderWithTexture");
    var depthSwitchPointer = gl.getUniformLocation(shaderProgram, "uRenderWithDepthColor");
    var texturePointer = gl.getUniformLocation(shaderProgram, "uTexture");
    gl.uniform1i(depthSwitchPointer, depthSwitch ? 1 : 0);
    var orthoCam = create$4();
    ortho(orthoCam, -1, 1, -1, 1, -0.5, 1.5);
    gl.uniformMatrix4fv(projectionMatrixPointer, false, orthoCam);
    gl.uniformMatrix4fv(cameraMatrixPointer, false, cameraMatrix);
    gl.uniform4fv(vertexColorFilterPt, colorFilter);
    var loadTexture = function loadTexture(image) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      function isPowerOf2(value) {
        return (value & value - 1) === 0;
      }
      var level = 0;
      var internalFormat = gl.RGBA;
      var width = 1;
      var height = 1;
      var border = 0;
      var srcFormat = gl.RGBA;
      var srcType = gl.UNSIGNED_BYTE;
      var pixel = new Uint8Array([0, 0, 255, 255]);
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
    runes.forEach(function (rune) {
      var positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, rune.vertices, gl.STATIC_DRAW);
      gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPositionPointer);
      if (rune.texture === null) {
        gl.uniform4fv(vertexColorPointer, rune.colors || new Float32Array([0, 0, 0, 1]));
        gl.uniform1i(textureSwitchPointer, 0);
      } else {
        var texture = loadTexture(rune.texture);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(texturePointer, 0);
        gl.uniform1i(textureSwitchPointer, 1);
      }
      gl.uniformMatrix4fv(modelViewMatrixPointer, false, rune.transformMatrix);
      var vertexCount = rune.vertices.length / 4;
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    });
  }
  var DrawnRune = (function () {
    function DrawnRune(rune, isHollusion) {
      this.rune = rune;
      this.isHollusion = isHollusion;
      this.toReplString = function () {
        return "<Rune>";
      };
    }
    DrawnRune.normalVertexShader = "\n  attribute vec4 aVertexPosition;\n  uniform vec4 uVertexColor;\n  uniform mat4 uModelViewMatrix;\n  uniform mat4 uProjectionMatrix;\n  uniform mat4 uCameraMatrix;\n\n  varying lowp vec4 vColor;\n  varying highp vec2 vTexturePosition;\n  varying lowp float colorFactor;\n  void main(void) {\n    gl_Position = uProjectionMatrix * uCameraMatrix * uModelViewMatrix * aVertexPosition;\n    vColor = uVertexColor;\n\n    // texture position is in [0,1], vertex position is in [-1,1]\n    vTexturePosition.x = (aVertexPosition.x + 1.0) / 2.0;\n    vTexturePosition.y = 1.0 - (aVertexPosition.y + 1.0) / 2.0;\n\n    colorFactor = gl_Position.z;\n  }\n  ";
    DrawnRune.normalFragmentShader = "\n  precision mediump float;\n  uniform bool uRenderWithTexture;\n  uniform bool uRenderWithDepthColor;\n  uniform sampler2D uTexture;\n  varying lowp float colorFactor;\n  uniform vec4 uColorFilter;\n\n\n  varying lowp vec4 vColor;\n  varying highp vec2 vTexturePosition;\n  void main(void) {\n    if (uRenderWithTexture){\n      gl_FragColor = texture2D(uTexture, vTexturePosition);\n    } else {\n      gl_FragColor = vColor;\n    }\n    if (uRenderWithDepthColor){\n      gl_FragColor += (colorFactor + 0.5) * (1.0 - gl_FragColor);\n      gl_FragColor.a = 1.0;\n    }\n    gl_FragColor = uColorFilter * gl_FragColor + 1.0 - uColorFilter;\n    gl_FragColor.a = 1.0;\n  }\n  ";
    return DrawnRune;
  })();
  var NormalRune = (function (_super) {
    __extends(NormalRune, _super);
    function NormalRune(rune) {
      var _this = _super.call(this, rune, false) || this;
      _this.draw = function (canvas) {
        var gl = getWebGlFromCanvas(canvas);
        var cameraMatrix = create$4();
        drawRunesToFrameBuffer(gl, _this.rune.flatten(), cameraMatrix, new Float32Array([1, 1, 1, 1]), null, true);
      };
      return _this;
    }
    return NormalRune;
  })(DrawnRune);
  var AnimatedRune = (function (_super) {
    __extends(AnimatedRune, _super);
    function AnimatedRune(duration, fps, func) {
      var _this = _super.call(this, duration, fps) || this;
      _this.func = func;
      _this.toReplString = function () {
        return "<AnimatedRune>";
      };
      return _this;
    }
    AnimatedRune.prototype.getFrame = function (num) {
      var rune = this.func(num);
      return {
        draw: rune.draw
      };
    };
    return AnimatedRune;
  })(glAnimation);
  function _wrapRegExp() {
    _wrapRegExp = function (re, groups) {
      return new BabelRegExp(re, void 0, groups);
    };
    var _super = RegExp.prototype, _groups = new WeakMap();
    function BabelRegExp(re, flags, groups) {
      var _this = new RegExp(re, flags);
      return (_groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype));
    }
    function buildGroups(result, re) {
      var g = _groups.get(re);
      return Object.keys(g).reduce(function (groups, name) {
        return (groups[name] = result[g[name]], groups);
      }, Object.create(null));
    }
    return (_inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
      var result = _super.exec.call(this, str);
      return (result && (result.groups = buildGroups(result, this)), result);
    }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
      if ("string" == typeof substitution) {
        var groups = _groups.get(this);
        return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
          return "$" + groups[name];
        }));
      }
      if ("function" == typeof substitution) {
        var _this = this;
        return _super[Symbol.replace].call(this, str, function () {
          var args = arguments;
          return ("object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args));
        });
      }
      return _super[Symbol.replace].call(this, str, substitution);
    }, _wrapRegExp.apply(this, arguments));
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function throwIfNotRune(name) {
    var runes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      runes[_i - 1] = arguments[_i];
    }
    runes.forEach(function (rune) {
      if (!(rune instanceof Rune)) {
        throw Error(("").concat(name, " expects a rune as argument."));
      }
    });
  }
  var getSquare = function getSquare() {
    var vertexList = [];
    var colorList = [];
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
  var getBlank = function getBlank() {
    return Rune.of();
  };
  var getRcross = function getRcross() {
    var vertexList = [];
    var colorList = [];
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
  var getSail = function getSail() {
    var vertexList = [];
    var colorList = [];
    vertexList.push(0.5, -1, 0, 1);
    vertexList.push(0, -1, 0, 1);
    vertexList.push(0, 1, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  };
  var getTriangle = function getTriangle() {
    var vertexList = [];
    var colorList = [];
    vertexList.push(1, -1, 0, 1);
    vertexList.push(0, -1, 0, 1);
    vertexList.push(0, 1, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  };
  var getCorner = function getCorner() {
    var vertexList = [];
    var colorList = [];
    vertexList.push(1, 0, 0, 1);
    vertexList.push(1, 1, 0, 1);
    vertexList.push(0, 1, 0, 1);
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  };
  var getNova = function getNova() {
    var vertexList = [];
    var colorList = [];
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
  var getCircle = function getCircle() {
    var vertexList = [];
    var colorList = [];
    var circleDiv = 60;
    for (var i = 0; i < circleDiv; i += 1) {
      var angle1 = 2 * Math.PI / circleDiv * i;
      var angle2 = 2 * Math.PI / circleDiv * (i + 1);
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
  var getHeart = function getHeart() {
    var vertexList = [];
    var colorList = [];
    var root2 = Math.sqrt(2);
    var r = 4 / (2 + 3 * root2);
    var scaleX = 1 / (r * (1 + root2 / 2));
    var numPoints = 10;
    var rightCenterX = r / root2;
    var rightCenterY = 1 - r;
    for (var i = 0; i < numPoints; i += 1) {
      var angle1 = Math.PI * (-1 / 4 + i / numPoints);
      var angle2 = Math.PI * (-1 / 4 + (i + 1) / numPoints);
      vertexList.push((Math.cos(angle1) * r + rightCenterX) * scaleX, Math.sin(angle1) * r + rightCenterY, 0, 1);
      vertexList.push((Math.cos(angle2) * r + rightCenterX) * scaleX, Math.sin(angle2) * r + rightCenterY, 0, 1);
      vertexList.push(0, -1, 0, 1);
    }
    var leftCenterX = -r / root2;
    var leftCenterY = 1 - r;
    for (var i = 0; i <= numPoints; i += 1) {
      var angle1 = Math.PI * (1 / 4 + i / numPoints);
      var angle2 = Math.PI * (1 / 4 + (i + 1) / numPoints);
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
  var getPentagram = function getPentagram() {
    var vertexList = [];
    var colorList = [];
    var v1 = Math.sin(Math.PI / 10);
    var v2 = Math.cos(Math.PI / 10);
    var w1 = Math.sin(3 * Math.PI / 10);
    var w2 = Math.cos(3 * Math.PI / 10);
    var vertices = [];
    vertices.push([v2, v1, 0, 1]);
    vertices.push([w2, -w1, 0, 1]);
    vertices.push([-w2, -w1, 0, 1]);
    vertices.push([-v2, v1, 0, 1]);
    vertices.push([0, 1, 0, 1]);
    for (var i = 0; i < 5; i += 1) {
      vertexList.push(0, 0, 0, 1);
      vertexList.push.apply(vertexList, vertices[i]);
      vertexList.push.apply(vertexList, vertices[(i + 2) % 5]);
    }
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  };
  var getRibbon = function getRibbon() {
    var vertexList = [];
    var colorList = [];
    var thetaMax = 30;
    var thickness = -1 / thetaMax;
    var unit = 0.1;
    var vertices = [];
    for (var i = 0; i < thetaMax; i += unit) {
      vertices.push([i / thetaMax * Math.cos(i), i / thetaMax * Math.sin(i), 0, 1]);
      vertices.push([Math.abs(Math.cos(i) * thickness) + i / thetaMax * Math.cos(i), Math.abs(Math.sin(i) * thickness) + i / thetaMax * Math.sin(i), 0, 1]);
    }
    for (var i = 0; i < vertices.length - 2; i += 1) {
      vertexList.push.apply(vertexList, vertices[i]);
      vertexList.push.apply(vertexList, vertices[i + 1]);
      vertexList.push.apply(vertexList, vertices[i + 2]);
    }
    colorList.push(0, 0, 0, 1);
    return Rune.of({
      vertices: new Float32Array(vertexList),
      colors: new Float32Array(colorList)
    });
  };
  var colorPalette = ["#F44336", "#E91E63", "#AA00FF", "#3F51B5", "#2196F3", "#4CAF50", "#FFEB3B", "#FF9800", "#795548"];
  function hexToColor(hex) {
    var result = _wrapRegExp(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i, {
      red: 1,
      green: 2,
      blue: 3
    }).exec(hex);
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
  moduleHelpers.context.moduleContexts.rune.state = {
    drawnRunes: drawnRunes
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
    var rune = getSquare();
    rune.texture = new Image();
    rune.texture.crossOrigin = "anonymous";
    rune.texture.src = imageUrl;
    return rune;
  }
  function scale_independent(ratio_x, ratio_y, rune) {
    throwIfNotRune("scale_independent", rune);
    var scaleVec = fromValues(ratio_x, ratio_y, 1);
    var scaleMat = create$4();
    scale$1(scaleMat, scaleMat, scaleVec);
    var wrapperMat = create$4();
    multiply(wrapperMat, scaleMat, wrapperMat);
    return Rune.of({
      subRunes: [rune],
      transformMatrix: wrapperMat
    });
  }
  function scale(ratio, rune) {
    throwIfNotRune("scale", rune);
    return scale_independent(ratio, ratio, rune);
  }
  function translate(x, y, rune) {
    throwIfNotRune("translate", rune);
    var translateVec = fromValues(x, -y, 0);
    var translateMat = create$4();
    translate$1(translateMat, translateMat, translateVec);
    var wrapperMat = create$4();
    multiply(wrapperMat, translateMat, wrapperMat);
    return Rune.of({
      subRunes: [rune],
      transformMatrix: wrapperMat
    });
  }
  function rotate(rad, rune) {
    throwIfNotRune("rotate", rune);
    var rotateMat = create$4();
    rotateZ(rotateMat, rotateMat, rad);
    var wrapperMat = create$4();
    multiply(wrapperMat, rotateMat, wrapperMat);
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
    var upper = translate(0, -(1 - frac), scale_independent(1, frac, rune1));
    var lower = translate(0, frac, scale_independent(1, 1 - frac, rune2));
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
    return rotate(-Math.PI / 2, rune);
  }
  function quarter_turn_left(rune) {
    throwIfNotRune("quarter_turn_left", rune);
    return rotate(Math.PI / 2, rune);
  }
  function turn_upside_down(rune) {
    throwIfNotRune("turn_upside_down", rune);
    return rotate(Math.PI, rune);
  }
  function beside_frac(frac, rune1, rune2) {
    throwIfNotRune("beside_frac", rune1, rune2);
    if (!(frac >= 0 && frac <= 1)) {
      throw Error("beside_frac can only take fraction in [0,1].");
    }
    var left = translate(-(1 - frac), 0, scale_independent(frac, 1, rune1));
    var right = translate(frac, 0, scale_independent(1 - frac, 1, rune2));
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
    return stack(beside(quarter_turn_right(rune), rotate(Math.PI, rune)), beside(rune, rotate(Math.PI / 2, rune)));
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
    var useFrac = frac;
    var minFrac = 0.000001;
    var maxFrac = 1 - minFrac;
    if (useFrac < minFrac) {
      useFrac = minFrac;
    }
    if (useFrac > maxFrac) {
      useFrac = maxFrac;
    }
    var frontMat = create$4();
    scale$1(frontMat, frontMat, fromValues(1, 1, useFrac));
    var front = Rune.of({
      subRunes: [rune1],
      transformMatrix: frontMat
    });
    var backMat = create$4();
    translate$1(backMat, backMat, fromValues(0, 0, -useFrac));
    scale$1(backMat, backMat, fromValues(1, 1, 1 - useFrac));
    var back = Rune.of({
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
    var colorVector = [r, g, b, 1];
    return Rune.of({
      colors: new Float32Array(colorVector),
      subRunes: [rune]
    });
  }
  function random_color(rune) {
    throwIfNotRune("random_color", rune);
    var randomColor = hexToColor(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
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
  var AnaglyphRune = (function (_super) {
    __extends(AnaglyphRune, _super);
    function AnaglyphRune(rune) {
      var _this = _super.call(this, rune, false) || this;
      _this.draw = function (canvas) {
        var gl = getWebGlFromCanvas(canvas);
        var runes = white(overlay_frac(0.999999999, blank, scale(2.2, square))).flatten().concat(_this.rune.flatten());
        var halfEyeDistance = 0.03;
        var leftCameraMatrix = create$4();
        lookAt(leftCameraMatrix, fromValues(-halfEyeDistance, 0, 0), fromValues(0, 0, -0.4), fromValues(0, 1, 0));
        var rightCameraMatrix = create$4();
        lookAt(rightCameraMatrix, fromValues(halfEyeDistance, 0, 0), fromValues(0, 0, -0.4), fromValues(0, 1, 0));
        var leftBuffer = initFramebufferObject(gl);
        var rightBuffer = initFramebufferObject(gl);
        drawRunesToFrameBuffer(gl, runes, leftCameraMatrix, new Float32Array([1, 0, 0, 1]), leftBuffer.framebuffer, true);
        drawRunesToFrameBuffer(gl, runes, rightCameraMatrix, new Float32Array([0, 1, 1, 1]), rightBuffer.framebuffer, true);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        var shaderProgram = initShaderProgram(gl, AnaglyphRune.anaglyphVertexShader, AnaglyphRune.anaglyphFragmentShader);
        gl.useProgram(shaderProgram);
        var reduPt = gl.getUniformLocation(shaderProgram, "u_sampler_red");
        var cyanuPt = gl.getUniformLocation(shaderProgram, "u_sampler_cyan");
        var vertexPositionPointer = gl.getAttribLocation(shaderProgram, "a_position");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, leftBuffer.texture);
        gl.uniform1i(cyanuPt, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, rightBuffer.texture);
        gl.uniform1i(reduPt, 1);
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPositionPointer);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
      return _this;
    }
    AnaglyphRune.anaglyphVertexShader = "\n    precision mediump float;\n    attribute vec4 a_position;\n    varying highp vec2 v_texturePosition;\n    void main() {\n        gl_Position = a_position;\n        // texture position is in [0,1], vertex position is in [-1,1]\n        v_texturePosition.x = (a_position.x + 1.0) / 2.0;\n        v_texturePosition.y = (a_position.y + 1.0) / 2.0;\n    }\n    ";
    AnaglyphRune.anaglyphFragmentShader = "\n    precision mediump float;\n    uniform sampler2D u_sampler_red;\n    uniform sampler2D u_sampler_cyan;\n    varying highp vec2 v_texturePosition;\n    void main() {\n        gl_FragColor = texture2D(u_sampler_red, v_texturePosition)\n                + texture2D(u_sampler_cyan, v_texturePosition) - 1.0;\n        gl_FragColor.a = 1.0;\n    }\n    ";
    return AnaglyphRune;
  })(DrawnRune);
  function anaglyph(rune) {
    throwIfNotRune("anaglyph", rune);
    drawnRunes.push(new AnaglyphRune(rune));
    return rune;
  }
  var HollusionRune = (function (_super) {
    __extends(HollusionRune, _super);
    function HollusionRune(rune, magnitude) {
      var _this = _super.call(this, rune, true) || this;
      _this.draw = function (canvas) {
        var gl = getWebGlFromCanvas(canvas);
        var runes = white(overlay_frac(0.999999999, blank, scale(2.2, square))).flatten().concat(_this.rune.flatten());
        var xshiftMax = runes[0].hollusionDistance;
        var period = 2000;
        var frameCount = 50;
        var frameBuffer = [];
        var renderFrame = function renderFrame(framePos) {
          var fb = initFramebufferObject(gl);
          var cameraMatrix = create$4();
          var xshift = framePos * (period / frameCount) % period;
          if (xshift > period / 2) {
            xshift = period - xshift;
          }
          xshift = xshiftMax * (2 * (2 * xshift / period) - 1);
          lookAt(cameraMatrix, fromValues(xshift, 0, 0), fromValues(0, 0, -0.4), fromValues(0, 1, 0));
          drawRunesToFrameBuffer(gl, runes, cameraMatrix, new Float32Array([1, 1, 1, 1]), fb.framebuffer, true);
          return fb;
        };
        for (var i = 0; i < frameCount; i += 1) {
          frameBuffer.push(renderFrame(i));
        }
        var copyShaderProgram = initShaderProgram(gl, HollusionRune.copyVertexShader, HollusionRune.copyFragmentShader);
        gl.useProgram(copyShaderProgram);
        var texturePt = gl.getUniformLocation(copyShaderProgram, "uTexture");
        var vertexPositionPointer = gl.getAttribLocation(copyShaderProgram, "a_position");
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPositionPointer);
        var lastTime = 0;
        function render(timeInMs) {
          if (timeInMs - lastTime < period / frameCount) return;
          lastTime = timeInMs;
          var framePos = Math.floor(timeInMs / (period / frameCount)) % frameCount;
          var fbObject = frameBuffer[framePos];
          gl.clearColor(1, 1, 1, 1);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, fbObject.texture);
          gl.uniform1i(texturePt, 0);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        return render;
      };
      _this.rune.hollusionDistance = magnitude;
      return _this;
    }
    HollusionRune.copyVertexShader = "\n    precision mediump float;\n    attribute vec4 a_position;\n    varying highp vec2 v_texturePosition;\n    void main() {\n        gl_Position = a_position;\n        // texture position is in [0,1], vertex position is in [-1,1]\n        v_texturePosition.x = (a_position.x + 1.0) / 2.0;\n        v_texturePosition.y = (a_position.y + 1.0) / 2.0;\n    }\n    ";
    HollusionRune.copyFragmentShader = "\n    precision mediump float;\n    uniform sampler2D uTexture;\n    varying highp vec2 v_texturePosition;\n    void main() {\n        gl_FragColor = texture2D(uTexture, v_texturePosition);\n    }\n    ";
    return HollusionRune;
  })(DrawnRune);
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
    var anim = new AnimatedRune(duration, fps, function (n) {
      var rune = func(n);
      throwIfNotRune("animate_rune", rune);
      return new NormalRune(rune);
    });
    drawnRunes.push(anim);
    return anim;
  }
  function animate_anaglyph(duration, fps, func) {
    var anim = new AnimatedRune(duration, fps, function (n) {
      var rune = func(n);
      throwIfNotRune("animate_anaglyph", rune);
      return new AnaglyphRune(rune);
    });
    drawnRunes.push(anim);
    return anim;
  }
  exports.anaglyph = anaglyph;
  exports.animate_anaglyph = animate_anaglyph;
  exports.animate_rune = animate_rune;
  exports.beside = beside;
  exports.beside_frac = beside_frac;
  exports.black = black;
  exports.blank = blank;
  exports.blue = blue;
  exports.brown = brown;
  exports.circle = circle;
  exports.color = color;
  exports.corner = corner;
  exports.flip_horiz = flip_horiz;
  exports.flip_vert = flip_vert;
  exports.from_url = from_url;
  exports.green = green;
  exports.heart = heart;
  exports.hollusion = hollusion;
  exports.hollusion_magnitude = hollusion_magnitude;
  exports.indigo = indigo;
  exports.make_cross = make_cross;
  exports.nova = nova;
  exports.orange = orange;
  exports.overlay = overlay;
  exports.overlay_frac = overlay_frac;
  exports.pentagram = pentagram;
  exports.pink = pink;
  exports.purple = purple;
  exports.quarter_turn_left = quarter_turn_left;
  exports.quarter_turn_right = quarter_turn_right;
  exports.random_color = random_color;
  exports.rcross = rcross;
  exports.red = red;
  exports.repeat_pattern = repeat_pattern;
  exports.ribbon = ribbon;
  exports.rotate = rotate;
  exports.sail = sail;
  exports.scale = scale;
  exports.scale_independent = scale_independent;
  exports.show = show;
  exports.square = square;
  exports.stack = stack;
  exports.stack_frac = stack_frac;
  exports.stackn = stackn;
  exports.translate = translate;
  exports.triangle = triangle;
  exports.turn_upside_down = turn_upside_down;
  exports.white = white;
  exports.yellow = yellow;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
