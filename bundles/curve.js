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
  function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.hypot(x, y, z);
    var s, c, t;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;
    if (len < EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
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
  function perspectiveNO(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2), nf;
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
  var vsS = "\nattribute vec4 aFragColor;\nattribute vec4 aVertexPosition;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying lowp vec4 aColor;\n\nvoid main() {\n  gl_PointSize = 2.0;\n  aColor = aFragColor;\n  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n}";
  var fsS = "\nvarying lowp vec4 aColor;\nprecision mediump float;\nvoid main() {\n  gl_FragColor = aColor;\n}";
  function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) {
      throw new Error("WebGLShader not available.");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
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
  var Point = (function () {
    function Point(x, y, z, color) {
      var _this = this;
      this.x = x;
      this.y = y;
      this.z = z;
      this.color = color;
      this.toReplString = function () {
        return ("(").concat(_this.x, ", ").concat(_this.y, ", ").concat(_this.z, ", Color: ").concat(_this.color, ")");
      };
    }
    return Point;
  })();
  var CurveDrawn = (function () {
    function CurveDrawn(drawMode, numPoints, space, drawCubeArray, curvePosArray, curveColorArray) {
      var _this = this;
      this.drawMode = drawMode;
      this.numPoints = numPoints;
      this.space = space;
      this.drawCubeArray = drawCubeArray;
      this.curvePosArray = curvePosArray;
      this.curveColorArray = curveColorArray;
      this.toReplString = function () {
        return "<CurveDrawn>";
      };
      this.is3D = function () {
        return _this.space === "3D";
      };
      this.init = function (canvas) {
        _this.renderingContext = canvas.getContext("webgl");
        if (!_this.renderingContext) {
          throw new Error("Rendering context cannot be null.");
        }
        var cubeBuffer = _this.renderingContext.createBuffer();
        _this.renderingContext.bindBuffer(_this.renderingContext.ARRAY_BUFFER, cubeBuffer);
        _this.renderingContext.bufferData(_this.renderingContext.ARRAY_BUFFER, new Float32Array(_this.drawCubeArray), _this.renderingContext.STATIC_DRAW);
        var curveBuffer = _this.renderingContext.createBuffer();
        _this.renderingContext.bindBuffer(_this.renderingContext.ARRAY_BUFFER, curveBuffer);
        _this.renderingContext.bufferData(_this.renderingContext.ARRAY_BUFFER, new Float32Array(_this.curvePosArray), _this.renderingContext.STATIC_DRAW);
        var curveColorBuffer = _this.renderingContext.createBuffer();
        _this.renderingContext.bindBuffer(_this.renderingContext.ARRAY_BUFFER, curveColorBuffer);
        _this.renderingContext.bufferData(_this.renderingContext.ARRAY_BUFFER, new Float32Array(_this.curveColorArray), _this.renderingContext.STATIC_DRAW);
        var shaderProgram = initShaderProgram(_this.renderingContext, vsS, fsS);
        _this.programs = {
          program: shaderProgram,
          attribLocations: {
            vertexPosition: _this.renderingContext.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: _this.renderingContext.getAttribLocation(shaderProgram, "aFragColor")
          },
          uniformLocations: {
            projectionMatrix: _this.renderingContext.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: _this.renderingContext.getUniformLocation(shaderProgram, "uModelViewMatrix")
          }
        };
        _this.buffersInfo = {
          cubeBuffer: cubeBuffer,
          curveBuffer: curveBuffer,
          curveColorBuffer: curveColorBuffer
        };
      };
      this.redraw = function (angle) {
        if (!_this.renderingContext) {
          return;
        }
        var gl = _this.renderingContext;
        var itemSize = _this.space === "3D" ? 3 : 2;
        gl.clearColor(1, 1, 1, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var transMat = create$4();
        var projMat = create$4();
        if (_this.space === "3D") {
          var padding = Math.sqrt(1 / 3.1);
          scale$1(transMat, transMat, fromValues(padding, padding, padding));
          translate$1(transMat, transMat, [0, 0, -5]);
          rotate(transMat, transMat, -(Math.PI / 2), [1, 0, 0]);
          rotate(transMat, transMat, angle, [0, 0, 1]);
          var fieldOfView = 45 * Math.PI / 180;
          var aspect = gl.canvas.width / gl.canvas.height;
          var zNear = 0.01;
          var zFar = 50;
          perspective(projMat, fieldOfView, aspect, zNear, zFar);
        }
        gl.useProgram(_this.programs.program);
        gl.uniformMatrix4fv(_this.programs.uniformLocations.projectionMatrix, false, projMat);
        gl.uniformMatrix4fv(_this.programs.uniformLocations.modelViewMatrix, false, transMat);
        gl.enableVertexAttribArray(_this.programs.attribLocations.vertexPosition);
        gl.enableVertexAttribArray(_this.programs.attribLocations.vertexColor);
        if (_this.space === "3D") {
          gl.bindBuffer(gl.ARRAY_BUFFER, _this.buffersInfo.cubeBuffer);
          gl.vertexAttribPointer(_this.programs.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
          var colors_1 = [];
          for (var i = 0; i < 16; i += 1) {
            colors_1.push(0.6, 0.6, 0.6, 1);
          }
          var colorBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors_1), gl.STATIC_DRAW);
          gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.LINE_STRIP, 0, 16);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.buffersInfo.curveBuffer);
        gl.vertexAttribPointer(_this.programs.attribLocations.vertexPosition, itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.buffersInfo.curveColorBuffer);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
        if (_this.drawMode === "lines") {
          gl.drawArrays(gl.LINE_STRIP, 0, _this.numPoints + 1);
        } else {
          gl.drawArrays(gl.POINTS, 0, _this.numPoints + 1);
        }
      };
      this.renderingContext = null;
      this.programs = null;
      this.buffersInfo = null;
    }
    return CurveDrawn;
  })();
  function generateCurve(scaleMode, drawMode, numPoints, func, space, isFullView) {
    var curvePosArray = [];
    var curveColorArray = [];
    var drawCubeArray = [];
    var min_x = Infinity;
    var max_x = -Infinity;
    var min_y = Infinity;
    var max_y = -Infinity;
    var min_z = Infinity;
    var max_z = -Infinity;
    for (var i = 0; i <= numPoints; i += 1) {
      var point = func(i / numPoints);
      var x = point.x * 2 - 1;
      var y = point.y * 2 - 1;
      var z = point.z * 2 - 1;
      if (space === "2D") {
        curvePosArray.push(x, y);
      } else {
        curvePosArray.push(x, y, z);
      }
      var color_r = point.color[0];
      var color_g = point.color[1];
      var color_b = point.color[2];
      var color_a = point.color[3];
      curveColorArray.push(color_r, color_g, color_b, color_a);
      min_x = Math.min(min_x, x);
      max_x = Math.max(max_x, x);
      min_y = Math.min(min_y, y);
      max_y = Math.max(max_y, y);
      min_z = Math.min(min_z, z);
      max_z = Math.max(max_z, z);
    }
    if (isFullView) {
      var horiz_padding = 0.05 * (max_x - min_x);
      min_x -= horiz_padding;
      max_x += horiz_padding;
      var vert_padding = 0.05 * (max_y - min_y);
      min_y -= vert_padding;
      max_y += vert_padding;
      var depth_padding = 0.05 * (max_z - min_z);
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
      var center = [(min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2];
      var scale = Math.max(max_x - min_x, max_y - min_y, max_z - min_z);
      scale = scale === 0 ? 1 : scale;
      if (space === "3D") {
        for (var i = 0; i < curvePosArray.length; i += 1) {
          if (i % 3 === 0) {
            curvePosArray[i] -= center[0];
            curvePosArray[i] /= scale / 2;
          } else if (i % 3 === 1) {
            curvePosArray[i] -= center[1];
            curvePosArray[i] /= scale / 2;
          } else {
            curvePosArray[i] -= center[2];
            curvePosArray[i] /= scale / 2;
          }
        }
      } else {
        for (var i = 0; i < curvePosArray.length; i += 1) {
          if (i % 2 === 0) {
            curvePosArray[i] -= center[0];
            curvePosArray[i] /= scale / 2;
          } else {
            curvePosArray[i] -= center[1];
            curvePosArray[i] /= scale / 2;
          }
        }
      }
    } else if (scaleMode === "stretch") {
      var center = [(min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2];
      var x_scale = max_x === min_x ? 1 : max_x - min_x;
      var y_scale = max_y === min_y ? 1 : max_y - min_y;
      var z_scale = max_z === min_z ? 1 : max_z - min_z;
      if (space === "3D") {
        for (var i = 0; i < curvePosArray.length; i += 1) {
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
        for (var i = 0; i < curvePosArray.length; i += 1) {
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
  }
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
  var AnimatedCurve = (function (_super) {
    __extends(AnimatedCurve, _super);
    function AnimatedCurve(duration, fps, func, drawer, is3D) {
      var _this = _super.call(this, duration, fps) || this;
      _this.func = func;
      _this.drawer = drawer;
      _this.is3D = is3D;
      _this.toReplString = function () {
        return "<AnimatedCurve>";
      };
      _this.angle = 0;
      return _this;
    }
    AnimatedCurve.prototype.getFrame = function (timestamp) {
      var _this = this;
      var curve = this.func(timestamp);
      curve.shouldNotAppend = true;
      var curveDrawn = this.drawer(curve);
      return {
        draw: function (canvas) {
          curveDrawn.init(canvas);
          curveDrawn.redraw(_this.angle);
        }
      };
    };
    return AnimatedCurve;
  })(glAnimation);
  var drawnCurves = [];
  moduleHelpers.context.moduleContexts.curve.state = {
    drawnCurves: drawnCurves
  };
  function createDrawFunction(scaleMode, drawMode, space, isFullView) {
    return function (numPoints) {
      var func = function func(curve) {
        var curveDrawn = generateCurve(scaleMode, drawMode, numPoints, curve, space, isFullView);
        if (!curve.shouldNotAppend) {
          drawnCurves.push(curveDrawn);
        }
        return curveDrawn;
      };
      func.is3D = space === "3D";
      return func;
    };
  }
  var draw_connected = createDrawFunction("none", "lines", "2D", false);
  var draw_connected_full_view = createDrawFunction("stretch", "lines", "2D", true);
  var draw_connected_full_view_proportional = createDrawFunction("fit", "lines", "2D", true);
  var draw_points = createDrawFunction("none", "points", "2D", false);
  var draw_points_full_view = createDrawFunction("stretch", "points", "2D", true);
  var draw_points_full_view_proportional = createDrawFunction("fit", "points", "2D", true);
  var draw_3D_connected = createDrawFunction("none", "lines", "3D", false);
  var draw_3D_connected_full_view = createDrawFunction("stretch", "lines", "3D", false);
  var draw_3D_connected_full_view_proportional = createDrawFunction("fit", "lines", "3D", false);
  var draw_3D_points = createDrawFunction("none", "points", "3D", false);
  var draw_3D_points_full_view = createDrawFunction("stretch", "points", "3D", false);
  var draw_3D_points_full_view_proportional = createDrawFunction("fit", "points", "3D", false);
  function make_point(x, y) {
    return new Point(x, y, 0, [0, 0, 0, 1]);
  }
  function make_3D_point(x, y, z) {
    return new Point(x, y, z, [0, 0, 0, 1]);
  }
  function make_color_point(x, y, r, g, b) {
    return new Point(x, y, 0, [r / 255, g / 255, b / 255, 1]);
  }
  function make_3D_color_point(x, y, z, r, g, b) {
    return new Point(x, y, z, [r / 255, g / 255, b / 255, 1]);
  }
  function x_of(pt) {
    return pt.x;
  }
  function y_of(pt) {
    return pt.y;
  }
  function z_of(pt) {
    return pt.z;
  }
  function r_of(pt) {
    return pt.color[0] * 255;
  }
  function g_of(pt) {
    return pt.color[1] * 255;
  }
  function b_of(pt) {
    return pt.color[2] * 255;
  }
  function invert(curve) {
    return function (t) {
      return curve(1 - t);
    };
  }
  function translate(x0, y0, z0) {
    return function (curve) {
      var transformation = function transformation(cf) {
        return function (t) {
          var a = x0 === undefined ? 0 : x0;
          var b = y0 === undefined ? 0 : y0;
          var c = z0 === undefined ? 0 : z0;
          var ct = cf(t);
          return make_3D_color_point(a + x_of(ct), b + y_of(ct), c + z_of(ct), r_of(ct), g_of(ct), b_of(ct));
        };
      };
      return transformation(curve);
    };
  }
  function rotate_around_origin(theta1, theta2, theta3) {
    if (theta3 === undefined && theta1 !== undefined && theta2 !== undefined) {
      throw new Error("Expected 1 or 3 arguments, but received 2");
    } else if (theta1 !== undefined && theta2 === undefined && theta3 === undefined) {
      var cth_1 = Math.cos(theta1);
      var sth_1 = Math.sin(theta1);
      return function (curve) {
        var transformation = function transformation(c) {
          return function (t) {
            var ct = c(t);
            var x = x_of(ct);
            var y = y_of(ct);
            var z = z_of(ct);
            return make_3D_color_point(cth_1 * x - sth_1 * y, sth_1 * x + cth_1 * y, z, r_of(ct), g_of(ct), b_of(ct));
          };
        };
        return transformation(curve);
      };
    } else {
      var cthx_1 = Math.cos(theta1);
      var sthx_1 = Math.sin(theta1);
      var cthy_1 = Math.cos(theta2);
      var sthy_1 = Math.sin(theta2);
      var cthz_1 = Math.cos(theta3);
      var sthz_1 = Math.sin(theta3);
      return function (curve) {
        var transformation = function transformation(c) {
          return function (t) {
            var ct = c(t);
            var coord = [x_of(ct), y_of(ct), z_of(ct)];
            var mat = [[cthz_1 * cthy_1, cthz_1 * sthy_1 * sthx_1 - sthz_1 * cthx_1, cthz_1 * sthy_1 * cthx_1 + sthz_1 * sthx_1], [sthz_1 * cthy_1, sthz_1 * sthy_1 * sthx_1 + cthz_1 * cthx_1, sthz_1 * sthy_1 * cthx_1 - cthz_1 * sthx_1], [-sthy_1, cthy_1 * sthx_1, cthy_1 * cthx_1]];
            var xf = 0;
            var yf = 0;
            var zf = 0;
            for (var i = 0; i < 3; i += 1) {
              xf += mat[0][i] * coord[i];
              yf += mat[1][i] * coord[i];
              zf += mat[2][i] * coord[i];
            }
            return make_3D_color_point(xf, yf, zf, r_of(ct), g_of(ct), b_of(ct));
          };
        };
        return transformation(curve);
      };
    }
  }
  function scale(a, b, c) {
    return function (curve) {
      var transformation = function transformation(cf) {
        return function (t) {
          var ct = cf(t);
          var a1 = a === undefined ? 1 : a;
          var b1 = b === undefined ? 1 : b;
          var c1 = c === undefined ? 1 : c;
          return make_3D_color_point(a1 * x_of(ct), b1 * y_of(ct), c1 * z_of(ct), r_of(ct), g_of(ct), b_of(ct));
        };
      };
      return transformation(curve);
    };
  }
  function scale_proportional(s) {
    return scale(s, s, s);
  }
  function put_in_standard_position(curve) {
    var start_point = curve(0);
    var curve_started_at_origin = translate(-x_of(start_point), -y_of(start_point), 0)(curve);
    var new_end_point = curve_started_at_origin(1);
    var theta = Math.atan2(y_of(new_end_point), x_of(new_end_point));
    var curve_ended_at_x_axis = rotate_around_origin(0, 0, -theta)(curve_started_at_origin);
    var end_point_on_x_axis = x_of(curve_ended_at_x_axis(1));
    return scale_proportional(1 / end_point_on_x_axis)(curve_ended_at_x_axis);
  }
  function connect_rigidly(curve1, curve2) {
    return function (t) {
      return t < 1 / 2 ? curve1(2 * t) : curve2(2 * t - 1);
    };
  }
  function connect_ends(curve1, curve2) {
    var startPointOfCurve2 = curve2(0);
    var endPointOfCurve1 = curve1(1);
    return connect_rigidly(curve1, translate(x_of(endPointOfCurve1) - x_of(startPointOfCurve2), y_of(endPointOfCurve1) - y_of(startPointOfCurve2), z_of(endPointOfCurve1) - z_of(startPointOfCurve2))(curve2));
  }
  function unit_circle(t) {
    return make_point(Math.cos(2 * Math.PI * t), Math.sin(2 * Math.PI * t));
  }
  function unit_line(t) {
    return make_point(t, 0);
  }
  function unit_line_at(t) {
    return function (a) {
      return make_point(a, t);
    };
  }
  function arc(t) {
    return make_point(Math.sin(Math.PI * t), Math.cos(Math.PI * t));
  }
  function animate_curve(duration, fps, drawer, func) {
    if (drawer.is3D) {
      throw new Error("animate_curve cannot be used with 3D draw function!");
    }
    var anim = new AnimatedCurve(duration, fps, func, drawer, false);
    drawnCurves.push(anim);
    return anim;
  }
  function animate_3D_curve(duration, fps, drawer, func) {
    if (!drawer.is3D) {
      throw new Error("animate_3D_curve cannot be used with 2D draw function!");
    }
    var anim = new AnimatedCurve(duration, fps, func, drawer, true);
    drawnCurves.push(anim);
    return anim;
  }
  exports.animate_3D_curve = animate_3D_curve;
  exports.animate_curve = animate_curve;
  exports.arc = arc;
  exports.b_of = b_of;
  exports.connect_ends = connect_ends;
  exports.connect_rigidly = connect_rigidly;
  exports.draw_3D_connected = draw_3D_connected;
  exports.draw_3D_connected_full_view = draw_3D_connected_full_view;
  exports.draw_3D_connected_full_view_proportional = draw_3D_connected_full_view_proportional;
  exports.draw_3D_points = draw_3D_points;
  exports.draw_3D_points_full_view = draw_3D_points_full_view;
  exports.draw_3D_points_full_view_proportional = draw_3D_points_full_view_proportional;
  exports.draw_connected = draw_connected;
  exports.draw_connected_full_view = draw_connected_full_view;
  exports.draw_connected_full_view_proportional = draw_connected_full_view_proportional;
  exports.draw_points = draw_points;
  exports.draw_points_full_view = draw_points_full_view;
  exports.draw_points_full_view_proportional = draw_points_full_view_proportional;
  exports.g_of = g_of;
  exports.invert = invert;
  exports.make_3D_color_point = make_3D_color_point;
  exports.make_3D_point = make_3D_point;
  exports.make_color_point = make_color_point;
  exports.make_point = make_point;
  exports.put_in_standard_position = put_in_standard_position;
  exports.r_of = r_of;
  exports.rotate_around_origin = rotate_around_origin;
  exports.scale = scale;
  exports.scale_proportional = scale_proportional;
  exports.translate = translate;
  exports.unit_circle = unit_circle;
  exports.unit_line = unit_line;
  exports.unit_line_at = unit_line_at;
  exports.x_of = x_of;
  exports.y_of = y_of;
  exports.z_of = z_of;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
})
