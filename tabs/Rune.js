(function (React) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    (function() {
        const env = {};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * Common utilities
     * @module glMatrix
     */
    // Configuration Constants
    var EPSILON = 0.000001;
    var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
    if (!Math.hypot) Math.hypot = function () {
      var y = 0,
          i = arguments.length;

      while (i--) {
        y += arguments[i] * arguments[i];
      }

      return Math.sqrt(y);
    };

    /**
     * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
     * @module mat4
     */

    /**
     * Creates a new identity mat4
     *
     * @returns {mat4} a new 4x4 matrix
     */

    function create$1() {
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
    /**
     * Creates a new mat4 initialized with values from an existing matrix
     *
     * @param {ReadonlyMat4} a matrix to clone
     * @returns {mat4} a new 4x4 matrix
     */

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
    /**
     * Set a mat4 to the identity matrix
     *
     * @param {mat4} out the receiving matrix
     * @returns {mat4} out
     */

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
    /**
     * Multiplies two mat4s
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {mat4} out
     */

    function multiply(out, a, b) {
      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3];
      var a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7];
      var a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11];
      var a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15]; // Cache only the current line of the second matrix

      var b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3];
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
    /**
     * Translate a mat4 by the given vector
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to translate
     * @param {ReadonlyVec3} v vector to translate by
     * @returns {mat4} out
     */

    function translate(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];
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
    /**
     * Scales the mat4 by the dimensions in the given vec3 not using vectorization
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to scale
     * @param {ReadonlyVec3} v the vec3 to scale the matrix by
     * @returns {mat4} out
     **/

    function scale$1(out, a, v) {
      var x = v[0],
          y = v[1],
          z = v[2];
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
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {ReadonlyVec3} eye Position of the viewer
     * @param {ReadonlyVec3} center Point the viewer is looking at
     * @param {ReadonlyVec3} up vec3 pointing up
     * @returns {mat4} out
     */

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

    /**
     * 3 Dimensional Vector
     * @module vec3
     */

    /**
     * Creates a new, empty vec3
     *
     * @returns {vec3} a new 3D vector
     */

    function create() {
      var out = new ARRAY_TYPE(3);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

      return out;
    }
    /**
     * Creates a new vec3 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {vec3} a new 3D vector
     */

    function fromValues(x, y, z) {
      var out = new ARRAY_TYPE(3);
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out;
    }
    /**
     * Perform some operation over an array of vec3s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    (function () {
      var vec = create();
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

    function getEmptyRune(){return {toReplString:function(){return "<RUNE>"},drawMethod:"",vertices:new Float32Array,colors:null,transformMatrix:create$1(),subRunes:[],texture:null}}function isRune(rune){return rune!==undefined&&rune.toReplString instanceof Function&&rune.toReplString()==="<RUNE>"&&rune.drawMethod===""}function throwIfNotRune(name){var runes=[];for(var _i=1;_i<arguments.length;_i++){runes[_i-1]=arguments[_i];}runes.forEach(function(rune){if(!isRune(rune)){throw Error(name+" expects a rune as argument.")}});}function copyRune(rune){var newRune=getEmptyRune();newRune.vertices=rune.vertices;newRune.colors=rune.colors;newRune.transformMatrix=clone(rune.transformMatrix);newRune.subRunes=rune.subRunes;newRune.texture=rune.texture;return newRune}function flattenRune(rune){if(rune===undefined){return []}var runeList=[];var runeTodoList=[];runeTodoList.push(copyRune(rune));var _loop_1=function _loop_1(){var runeToExpand=runeTodoList.pop();runeToExpand.subRunes.forEach(function(subRune){var subRuneCopy=copyRune(subRune);multiply(subRuneCopy.transformMatrix,runeToExpand.transformMatrix,subRuneCopy.transformMatrix);if(runeToExpand.colors!==null){subRuneCopy.colors=runeToExpand.colors;}runeTodoList.push(subRuneCopy);});runeToExpand.subRunes=[];if(runeToExpand.vertices.length>0){runeList.push(runeToExpand);}};while(runeTodoList.length!==0){_loop_1();}return runeList}var getSquare=function getSquare(){var vertexList=[];var colorList=[];vertexList.push(-1,1,0,1);vertexList.push(-1,-1,0,1);vertexList.push(1,-1,0,1);vertexList.push(1,-1,0,1);vertexList.push(-1,1,0,1);vertexList.push(1,1,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getBlank=function getBlank(){return getEmptyRune()};var getRcross=function getRcross(){var vertexList=[];var colorList=[];vertexList.push(-0.5,0.5,0,1);vertexList.push(-0.5,-0.5,0,1);vertexList.push(0.5,-0.5,0,1);vertexList.push(-1,1,0,1);vertexList.push(-0.5,0.5,0,1);vertexList.push(1,1,0,1);vertexList.push(-0.5,0.5,0,1);vertexList.push(1,1,0,1);vertexList.push(0.5,0.5,0,1);vertexList.push(1,1,0,1);vertexList.push(0.5,0.5,0,1);vertexList.push(1,-1,0,1);vertexList.push(0.5,0.5,0,1);vertexList.push(1,-1,0,1);vertexList.push(0.5,-0.5,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getSail=function getSail(){var vertexList=[];var colorList=[];vertexList.push(0.5,-1,0,1);vertexList.push(0,-1,0,1);vertexList.push(0,1,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getCorner=function getCorner(){var vertexList=[];var colorList=[];vertexList.push(1,0,0,1);vertexList.push(1,1,0,1);vertexList.push(0,1,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getNova=function getNova(){var vertexList=[];var colorList=[];vertexList.push(0,1,0,1);vertexList.push(-0.5,0,0,1);vertexList.push(0,0.5,0,1);vertexList.push(-0.5,0,0,1);vertexList.push(0,0.5,0,1);vertexList.push(1,0,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getCircle=function getCircle(){var vertexList=[];var colorList=[];var circleDiv=60;for(var i=0;i<circleDiv;i+=1){var angle1=2*Math.PI/circleDiv*i;var angle2=2*Math.PI/circleDiv*(i+1);vertexList.push(Math.cos(angle1),Math.sin(angle1),0,1);vertexList.push(Math.cos(angle2),Math.sin(angle2),0,1);vertexList.push(0,0,0,1);}colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getHeart=function getHeart(){var vertexList=[];var colorList=[];var root2=Math.sqrt(2);var r=4/(2+3*root2);var scaleX=1/(r*(1+root2/2));var numPoints=10;var rightCenterX=r/root2;var rightCenterY=1-r;for(var i=0;i<numPoints;i+=1){var angle1=Math.PI*(-1/4+i/numPoints);var angle2=Math.PI*(-1/4+(i+1)/numPoints);vertexList.push((Math.cos(angle1)*r+rightCenterX)*scaleX,Math.sin(angle1)*r+rightCenterY,0,1);vertexList.push((Math.cos(angle2)*r+rightCenterX)*scaleX,Math.sin(angle2)*r+rightCenterY,0,1);vertexList.push(0,-1,0,1);}var leftCenterX=-r/root2;var leftCenterY=1-r;for(var i=0;i<=numPoints;i+=1){var angle1=Math.PI*(1/4+i/numPoints);var angle2=Math.PI*(1/4+(i+1)/numPoints);vertexList.push((Math.cos(angle1)*r+leftCenterX)*scaleX,Math.sin(angle1)*r+leftCenterY,0,1);vertexList.push((Math.cos(angle2)*r+leftCenterX)*scaleX,Math.sin(angle2)*r+leftCenterY,0,1);vertexList.push(0,-1,0,1);}colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getPentagram=function getPentagram(){var vertexList=[];var colorList=[];var v1=Math.sin(Math.PI/10);var v2=Math.cos(Math.PI/10);var w1=Math.sin(3*Math.PI/10);var w2=Math.cos(3*Math.PI/10);var vertices=[];vertices.push([v2,v1,0,1]);vertices.push([w2,-w1,0,1]);vertices.push([-w2,-w1,0,1]);vertices.push([-v2,v1,0,1]);vertices.push([0,1,0,1]);for(var i=0;i<5;i+=1){vertexList.push(0,0,0,1);vertexList.push.apply(vertexList,vertices[i]);vertexList.push.apply(vertexList,vertices[(i+2)%5]);}colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getRibbon=function getRibbon(){var vertexList=[];var colorList=[];var thetaMax=30;var thickness=-1/thetaMax;var unit=0.1;var vertices=[];for(var i=0;i<thetaMax;i+=unit){vertices.push([i/thetaMax*Math.cos(i),i/thetaMax*Math.sin(i),0,1]);vertices.push([Math.abs(Math.cos(i)*thickness)+i/thetaMax*Math.cos(i),Math.abs(Math.sin(i)*thickness)+i/thetaMax*Math.sin(i),0,1]);}for(var i=0;i<vertices.length-2;i+=1){vertexList.push.apply(vertexList,vertices[i]);vertexList.push.apply(vertexList,vertices[i+1]);vertexList.push.apply(vertexList,vertices[i+2]);}colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};function hexToColor(hex){var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);if(result===null||result.length<4){return [0,0,0]}return [parseInt(result[1],16)/255,parseInt(result[2],16)/255,parseInt(result[3],16)/255,1]}function addColorFromHex(rune,hex){throwIfNotRune("addColorFromHex",rune);var wrapper=getEmptyRune();wrapper.subRunes.push(rune);wrapper.colors=new Float32Array(hexToColor(hex));return wrapper}

    var square=getSquare();var blank=getBlank();getRcross();getSail();getCorner();getNova();getCircle();getHeart();getPentagram();getRibbon();function scale_independent(ratio_x,ratio_y,rune){throwIfNotRune("scale_independent",rune);var scaleVec=fromValues(ratio_x,ratio_y,1);var scaleMat=create$1();scale$1(scaleMat,scaleMat,scaleVec);var wrapper=getEmptyRune();wrapper.subRunes.push(rune);multiply(wrapper.transformMatrix,scaleMat,wrapper.transformMatrix);return wrapper}function scale(ratio,rune){throwIfNotRune("scale",rune);return scale_independent(ratio,ratio,rune)}function overlay_frac(frac,rune1,rune2){throwIfNotRune("overlay_frac",rune1);throwIfNotRune("overlay_frac",rune2);if(!(frac>0&&frac<1)){throw Error("overlay_frac can only take fraction in (0,1).")}var front=getEmptyRune();front.subRunes.push(rune1);var frontMat=front.transformMatrix;scale$1(frontMat,frontMat,fromValues(1,1,frac));var back=getEmptyRune();back.subRunes.push(rune2);var backMat=back.transformMatrix;translate(backMat,backMat,fromValues(0,0,frac));scale$1(backMat,backMat,fromValues(1,1,1-frac));var combined=getEmptyRune();combined.subRunes=[front,back];return combined}function white(rune){throwIfNotRune("white",rune);return addColorFromHex(rune,"#FFFFFF")}

    var normalVertexShader="\nattribute vec4 aVertexPosition;\nuniform vec4 uVertexColor;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying lowp vec4 vColor;\nvarying highp vec2 vTexturePosition;\nvarying lowp float colorFactor;\nvoid main(void) {\n  vec4 imagePosition = uModelViewMatrix * aVertexPosition;\n  gl_Position = uProjectionMatrix * imagePosition;\n  gl_Position.z = imagePosition.z; // hack for zbuffer when camera matrix is not perspective\n  vColor = uVertexColor;\n\n  // texture position is in [0,1], vertex position is in [-1,1]\n  vTexturePosition.x = (aVertexPosition.x + 1.0) / 2.0;\n  vTexturePosition.y = 1.0 - (aVertexPosition.y + 1.0) / 2.0;\n\n  colorFactor = imagePosition.z;\n}\n";var normalFragmentShader="\nprecision mediump float;\nuniform bool uRenderWithTexture;\nuniform bool uRenderWithDepthColor;\nuniform sampler2D uTexture;\nvarying lowp float colorFactor;\nuniform vec4 uColorFilter;\n\n\nvarying lowp vec4 vColor;\nvarying highp vec2 vTexturePosition;\nvoid main(void) {\n  if (uRenderWithTexture){\n    gl_FragColor = texture2D(uTexture, vTexturePosition);\n  } else {\n    gl_FragColor = vColor;\n  }\n  if (uRenderWithDepthColor){\n    gl_FragColor += colorFactor * (1.0 - gl_FragColor);\n    gl_FragColor.a = 1.0;\n  }\n  gl_FragColor = uColorFilter * gl_FragColor + 1.0 - uColorFilter;\n  gl_FragColor.a = 1.0;\n}\n";var anaglyphVertexShader="\nprecision mediump float;\nattribute vec4 a_position;\nvarying highp vec2 v_texturePosition;\nvoid main() {\n    gl_Position = a_position;\n    // texture position is in [0,1], vertex position is in [-1,1]\n    v_texturePosition.x = (a_position.x + 1.0) / 2.0;\n    v_texturePosition.y = (a_position.y + 1.0) / 2.0;\n}\n";var anaglyphFragmentShader="\nprecision mediump float;\nuniform sampler2D u_sampler_red;\nuniform sampler2D u_sampler_cyan;\nvarying highp vec2 v_texturePosition;\nvoid main() {\n    gl_FragColor = texture2D(u_sampler_red, v_texturePosition)\n            + texture2D(u_sampler_cyan, v_texturePosition) - 1.0;\n    gl_FragColor.a = 1.0;\n}\n";function loadShader(gl,type,source){var shader=gl.createShader(type);if(!shader){throw new Error("WebGLShader not available.")}gl.shaderSource(shader,source);gl.compileShader(shader);var compiled=gl.getShaderParameter(shader,gl.COMPILE_STATUS);if(!compiled){var compilationLog=gl.getShaderInfoLog(shader);throw Error("Shader compilation failed: "+compilationLog)}return shader}function initShaderProgram(gl,vsSource,fsSource){var vertexShader=loadShader(gl,gl.VERTEX_SHADER,vsSource);var fragmentShader=loadShader(gl,gl.FRAGMENT_SHADER,fsSource);var shaderProgram=gl.createProgram();if(!shaderProgram){throw new Error("Unable to initialize the shader program.")}gl.attachShader(shaderProgram,vertexShader);gl.attachShader(shaderProgram,fragmentShader);gl.linkProgram(shaderProgram);return shaderProgram}function getWebGlFromCanvas(canvas){var gl=canvas.getContext("webgl");if(!gl){throw Error("Unable to initialize WebGL.")}gl.clearColor(1,1,1,1);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);return gl}function loadTexture(gl,image){var texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);function isPowerOf2(value){return (value&value-1)===0}var level=0;var internalFormat=gl.RGBA;var width=1;var height=1;var border=0;var srcFormat=gl.RGBA;var srcType=gl.UNSIGNED_BYTE;var pixel=new Uint8Array([0,0,255,255]);gl.texImage2D(gl.TEXTURE_2D,level,internalFormat,width,height,border,srcFormat,srcType,pixel);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,level,internalFormat,srcFormat,srcType,image);if(isPowerOf2(image.width)&&isPowerOf2(image.height)){gl.generateMipmap(gl.TEXTURE_2D);}else {gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);}return texture}function drawRunesToFrameBuffer(gl,runes,cameraMatrix,colorFilter,framebuffer,depthSwitch){if(framebuffer===void 0){framebuffer=null;}if(depthSwitch===void 0){depthSwitch=false;}gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);var shaderProgram=initShaderProgram(gl,normalVertexShader,normalFragmentShader);gl.useProgram(shaderProgram);if(gl===null){throw Error("Rendering Context not initialized for drawRune.")}var vertexPositionPointer=gl.getAttribLocation(shaderProgram,"aVertexPosition");var vertexColorPointer=gl.getUniformLocation(shaderProgram,"uVertexColor");var vertexColorFilterPt=gl.getUniformLocation(shaderProgram,"uColorFilter");var projectionMatrixPointer=gl.getUniformLocation(shaderProgram,"uProjectionMatrix");var modelViewMatrixPointer=gl.getUniformLocation(shaderProgram,"uModelViewMatrix");var textureSwitchPointer=gl.getUniformLocation(shaderProgram,"uRenderWithTexture");var depthSwitchPointer=gl.getUniformLocation(shaderProgram,"uRenderWithDepthColor");var texturePointer=gl.getUniformLocation(shaderProgram,"uTexture");if(depthSwitch){gl.uniform1i(depthSwitchPointer,1);}else {gl.uniform1i(depthSwitchPointer,0);}gl.uniformMatrix4fv(projectionMatrixPointer,false,cameraMatrix);gl.uniform4fv(vertexColorFilterPt,colorFilter);runes.forEach(function(rune){var positionBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,rune.vertices,gl.STATIC_DRAW);gl.vertexAttribPointer(vertexPositionPointer,4,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(vertexPositionPointer);if(rune.texture===null){if(rune.colors!=null){gl.uniform4fv(vertexColorPointer,rune.colors);}else {gl.uniform4fv(vertexColorPointer,new Float32Array([0,0,0,1]));}gl.uniform1i(textureSwitchPointer,0);}else {var texture=loadTexture(gl,rune.texture);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.uniform1i(texturePointer,0);gl.uniform1i(textureSwitchPointer,1);}gl.uniformMatrix4fv(modelViewMatrixPointer,false,rune.transformMatrix);var vertexCount=rune.vertices.length/4;gl.drawArrays(gl.TRIANGLES,0,vertexCount);});}function initFramebufferObject(gl){var framebuffer=gl.createFramebuffer();if(!framebuffer){throw Error("Failed to create frame buffer object")}var texture=gl.createTexture();if(!texture){throw Error("Failed to create texture object")}gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.drawingBufferWidth,gl.drawingBufferHeight,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);var depthBuffer=gl.createRenderbuffer();if(!depthBuffer){throw Error("Failed to create renderbuffer object")}gl.bindRenderbuffer(gl.RENDERBUFFER,depthBuffer);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthBuffer);var e=gl.checkFramebufferStatus(gl.FRAMEBUFFER);if(gl.FRAMEBUFFER_COMPLETE!==e){throw Error("Frame buffer object is incomplete:"+e.toString())}gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.bindTexture(gl.TEXTURE_2D,null);gl.bindRenderbuffer(gl.RENDERBUFFER,null);return {framebuffer:framebuffer,texture:texture}}function drawRune(canvas,rune){var gl=getWebGlFromCanvas(canvas);var runes=flattenRune(rune);var cameraMatrix=create$1();drawRunesToFrameBuffer(gl,runes,cameraMatrix,new Float32Array([1,1,1,1]),null,true);}function drawAnaglyph(canvas,rune){var gl=getWebGlFromCanvas(canvas);var runes=flattenRune(rune);runes=flattenRune(white(overlay_frac(0.999999999,blank,scale(2.2,square)))).concat(runes);var halfEyeDistance=0.03;var leftCameraMatrix=create$1();lookAt(leftCameraMatrix,fromValues(-halfEyeDistance,0,0),fromValues(0,0,1),fromValues(0,1,0));var rightCameraMatrix=create$1();lookAt(rightCameraMatrix,fromValues(halfEyeDistance,0,0),fromValues(0,0,1),fromValues(0,1,0));var leftBuffer=initFramebufferObject(gl);var rightBuffer=initFramebufferObject(gl);drawRunesToFrameBuffer(gl,runes,leftCameraMatrix,new Float32Array([1,0,0,1]),leftBuffer.framebuffer,true);drawRunesToFrameBuffer(gl,runes,rightCameraMatrix,new Float32Array([0,1,1,1]),rightBuffer.framebuffer,true);gl.bindFramebuffer(gl.FRAMEBUFFER,null);var shaderProgram=initShaderProgram(gl,anaglyphVertexShader,anaglyphFragmentShader);gl.useProgram(shaderProgram);var reduPt=gl.getUniformLocation(shaderProgram,"u_sampler_red");var cyanuPt=gl.getUniformLocation(shaderProgram,"u_sampler_cyan");var vertexPositionPointer=gl.getAttribLocation(shaderProgram,"a_position");gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,leftBuffer.texture);gl.uniform1i(reduPt,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,rightBuffer.texture);gl.uniform1i(cyanuPt,1);var positionBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,square.vertices,gl.STATIC_DRAW);gl.vertexAttribPointer(vertexPositionPointer,4,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(vertexPositionPointer);gl.drawArrays(gl.TRIANGLES,0,6);}function drawHollusion(canvas,rune){var gl=getWebGlFromCanvas(canvas);var runes=flattenRune(rune);function render(timeInMs){gl.clearColor(1,1,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);var cameraMatrix=create$1();var xshiftMax=0.03;var period=2000;var xshift=timeInMs%period;if(xshift>period/2){xshift=period-xshift;}xshift=2*xshiftMax*(xshift/period);lookAt(cameraMatrix,fromValues(xshift,0,0),fromValues(0,0,1),fromValues(0,1,0));drawRunesToFrameBuffer(gl,runes,cameraMatrix,new Float32Array([1,1,1,1]),null,true);requestAnimationFrame(render);}requestAnimationFrame(render);}

    var WebGLCanvas=function(_super){__extends(WebGLCanvas,_super);function WebGLCanvas(props){var _this=_super.call(this,props)||this;_this.$canvas=null;_this.state={};return _this}WebGLCanvas.prototype.componentDidMount=function(){if(this.$canvas){var value=this.props.context.result.value;if(value.drawMethod==="anaglyph"){drawAnaglyph(this.$canvas,value);}else if(value.drawMethod==="hollusion"){drawHollusion(this.$canvas,value);}else if(value.drawMethod==="normal"){drawRune(this.$canvas,value);}else {throw Error("Unexpected Drawing Method "+value.drawMethod)}}};WebGLCanvas.prototype.render=function(){var _this=this;return React__default['default'].createElement("div",{style:{width:"100%",display:"flex",paddingLeft:"20px",paddingRight:"20px",flexDirection:"column",justifyContent:"center"}},React__default['default'].createElement("canvas",{ref:function(r){_this.$canvas=r;},width:512,height:512}))};return WebGLCanvas}(React__default['default'].Component);var index = {toSpawn:function(context){function isValidFunction(value){try{return value.toReplString()==="<RUNE>"&&value.drawMethod!==""}catch(e){return false}}return isValidFunction(context.result.value)},body:function(context){return React__default['default'].createElement(WebGLCanvas,{context:context})},label:"Runes Tab",iconName:"group-objects"};

    return index;

}(React));
