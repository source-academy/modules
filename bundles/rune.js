(function () {
    'use strict';

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

    function translate$1(out, a, v) {
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
     * Rotates a matrix by the given angle around the Z axis
     *
     * @param {mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */

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
        // If the source and destination differ, copy the unchanged last row
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      } // Perform axis-specific matrix multiplication


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

    function getEmptyRune(){return {toReplString:function(){return "<RUNE>"},drawMethod:"",vertices:new Float32Array,colors:null,transformMatrix:create$1(),subRunes:[],texture:null,hollusionDistance:0.1}}function isRune(rune){return rune!==undefined&&rune.toReplString instanceof Function&&rune.toReplString()==="<RUNE>"&&rune.drawMethod===""}function throwIfNotRune(name){var runes=[];for(var _i=1;_i<arguments.length;_i++){runes[_i-1]=arguments[_i];}runes.forEach(function(rune){if(!isRune(rune)){throw Error(name+" expects a rune as argument.")}});}function copyRune(rune){var newRune=getEmptyRune();newRune.vertices=rune.vertices;newRune.colors=rune.colors;newRune.transformMatrix=clone(rune.transformMatrix);newRune.subRunes=rune.subRunes;newRune.texture=rune.texture;newRune.hollusionDistance=rune.hollusionDistance;return newRune}var getSquare=function getSquare(){var vertexList=[];var colorList=[];vertexList.push(-1,1,0,1);vertexList.push(-1,-1,0,1);vertexList.push(1,-1,0,1);vertexList.push(1,-1,0,1);vertexList.push(-1,1,0,1);vertexList.push(1,1,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getBlank=function getBlank(){return getEmptyRune()};var getRcross=function getRcross(){var vertexList=[];var colorList=[];vertexList.push(-0.5,0.5,0,1);vertexList.push(-0.5,-0.5,0,1);vertexList.push(0.5,-0.5,0,1);vertexList.push(-1,1,0,1);vertexList.push(-0.5,0.5,0,1);vertexList.push(1,1,0,1);vertexList.push(-0.5,0.5,0,1);vertexList.push(1,1,0,1);vertexList.push(0.5,0.5,0,1);vertexList.push(1,1,0,1);vertexList.push(0.5,0.5,0,1);vertexList.push(1,-1,0,1);vertexList.push(0.5,0.5,0,1);vertexList.push(1,-1,0,1);vertexList.push(0.5,-0.5,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getSail=function getSail(){var vertexList=[];var colorList=[];vertexList.push(0.5,-1,0,1);vertexList.push(0,-1,0,1);vertexList.push(0,1,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getTriangle=function getTriangle(){var vertexList=[];var colorList=[];vertexList.push(1,-1,0,1);vertexList.push(0,-1,0,1);vertexList.push(0,1,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getCorner=function getCorner(){var vertexList=[];var colorList=[];vertexList.push(1,0,0,1);vertexList.push(1,1,0,1);vertexList.push(0,1,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getNova=function getNova(){var vertexList=[];var colorList=[];vertexList.push(0,1,0,1);vertexList.push(-0.5,0,0,1);vertexList.push(0,0.5,0,1);vertexList.push(-0.5,0,0,1);vertexList.push(0,0.5,0,1);vertexList.push(1,0,0,1);colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getCircle=function getCircle(){var vertexList=[];var colorList=[];var circleDiv=60;for(var i=0;i<circleDiv;i+=1){var angle1=2*Math.PI/circleDiv*i;var angle2=2*Math.PI/circleDiv*(i+1);vertexList.push(Math.cos(angle1),Math.sin(angle1),0,1);vertexList.push(Math.cos(angle2),Math.sin(angle2),0,1);vertexList.push(0,0,0,1);}colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getHeart=function getHeart(){var vertexList=[];var colorList=[];var root2=Math.sqrt(2);var r=4/(2+3*root2);var scaleX=1/(r*(1+root2/2));var numPoints=10;var rightCenterX=r/root2;var rightCenterY=1-r;for(var i=0;i<numPoints;i+=1){var angle1=Math.PI*(-1/4+i/numPoints);var angle2=Math.PI*(-1/4+(i+1)/numPoints);vertexList.push((Math.cos(angle1)*r+rightCenterX)*scaleX,Math.sin(angle1)*r+rightCenterY,0,1);vertexList.push((Math.cos(angle2)*r+rightCenterX)*scaleX,Math.sin(angle2)*r+rightCenterY,0,1);vertexList.push(0,-1,0,1);}var leftCenterX=-r/root2;var leftCenterY=1-r;for(var i=0;i<=numPoints;i+=1){var angle1=Math.PI*(1/4+i/numPoints);var angle2=Math.PI*(1/4+(i+1)/numPoints);vertexList.push((Math.cos(angle1)*r+leftCenterX)*scaleX,Math.sin(angle1)*r+leftCenterY,0,1);vertexList.push((Math.cos(angle2)*r+leftCenterX)*scaleX,Math.sin(angle2)*r+leftCenterY,0,1);vertexList.push(0,-1,0,1);}colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getPentagram=function getPentagram(){var vertexList=[];var colorList=[];var v1=Math.sin(Math.PI/10);var v2=Math.cos(Math.PI/10);var w1=Math.sin(3*Math.PI/10);var w2=Math.cos(3*Math.PI/10);var vertices=[];vertices.push([v2,v1,0,1]);vertices.push([w2,-w1,0,1]);vertices.push([-w2,-w1,0,1]);vertices.push([-v2,v1,0,1]);vertices.push([0,1,0,1]);for(var i=0;i<5;i+=1){vertexList.push(0,0,0,1);vertexList.push.apply(vertexList,vertices[i]);vertexList.push.apply(vertexList,vertices[(i+2)%5]);}colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var getRibbon=function getRibbon(){var vertexList=[];var colorList=[];var thetaMax=30;var thickness=-1/thetaMax;var unit=0.1;var vertices=[];for(var i=0;i<thetaMax;i+=unit){vertices.push([i/thetaMax*Math.cos(i),i/thetaMax*Math.sin(i),0,1]);vertices.push([Math.abs(Math.cos(i)*thickness)+i/thetaMax*Math.cos(i),Math.abs(Math.sin(i)*thickness)+i/thetaMax*Math.sin(i),0,1]);}for(var i=0;i<vertices.length-2;i+=1){vertexList.push.apply(vertexList,vertices[i]);vertexList.push.apply(vertexList,vertices[i+1]);vertexList.push.apply(vertexList,vertices[i+2]);}colorList.push(0,0,0,1);var rune=getEmptyRune();rune.vertices=new Float32Array(vertexList);rune.colors=new Float32Array(colorList);return rune};var colorPalette=["#F44336","#E91E63","#AA00FF","#3F51B5","#2196F3","#4CAF50","#FFEB3B","#FF9800","#795548"];function hexToColor(hex){var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);if(result===null||result.length<4){return [0,0,0]}return [parseInt(result[1],16)/255,parseInt(result[2],16)/255,parseInt(result[3],16)/255,1]}function addColorFromHex(rune,hex){throwIfNotRune("addColorFromHex",rune);var wrapper=getEmptyRune();wrapper.subRunes.push(rune);wrapper.colors=new Float32Array(hexToColor(hex));return wrapper}

    var drawnRunes=[];var square=getSquare();var blank=getBlank();var rcross=getRcross();var sail=getSail();var triangle=getTriangle();var corner=getCorner();var nova=getNova();var circle=getCircle();var heart=getHeart();var pentagram=getPentagram();var ribbon=getRibbon();function from_url(imageUrl){var rune=getSquare();rune.texture=new Image;rune.texture.crossOrigin="anonymous";rune.texture.src=imageUrl;return rune}function scale_independent(ratio_x,ratio_y,rune){throwIfNotRune("scale_independent",rune);var scaleVec=fromValues(ratio_x,ratio_y,1);var scaleMat=create$1();scale$1(scaleMat,scaleMat,scaleVec);var wrapper=getEmptyRune();wrapper.subRunes.push(rune);multiply(wrapper.transformMatrix,scaleMat,wrapper.transformMatrix);return wrapper}function scale(ratio,rune){throwIfNotRune("scale",rune);return scale_independent(ratio,ratio,rune)}function translate(x,y,rune){throwIfNotRune("translate",rune);var translateVec=fromValues(x,-y,0);var translateMat=create$1();translate$1(translateMat,translateMat,translateVec);var wrapper=getEmptyRune();wrapper.subRunes.push(rune);multiply(wrapper.transformMatrix,translateMat,wrapper.transformMatrix);return wrapper}function rotate(rad,rune){throwIfNotRune("rotate",rune);var rotateMat=create$1();rotateZ(rotateMat,rotateMat,rad);var wrapper=getEmptyRune();wrapper.subRunes.push(rune);multiply(wrapper.transformMatrix,rotateMat,wrapper.transformMatrix);return wrapper}function stack_frac(frac,rune1,rune2){throwIfNotRune("stack_frac",rune1);throwIfNotRune("stack_frac",rune2);if(!(frac>=0&&frac<=1)){throw Error("stack_frac can only take fraction in [0,1].")}var upper=translate(0,-(1-frac),scale_independent(1,frac,rune1));var lower=translate(0,frac,scale_independent(1,1-frac,rune2));var combined=getEmptyRune();combined.subRunes.push(upper,lower);return combined}function stack(rune1,rune2){throwIfNotRune("stack",rune2);throwIfNotRune("stack",rune1);return stack_frac(1/2,rune1,rune2)}function stackn(n,rune){throwIfNotRune("stackn",rune);if(n===1){return rune}return stack_frac(1/n,rune,stackn(n-1,rune))}function quarter_turn_right(rune){throwIfNotRune("quarter_turn_right",rune);return rotate(-Math.PI/2,rune)}function quarter_turn_left(rune){throwIfNotRune("quarter_turn_left",rune);return rotate(Math.PI/2,rune)}function turn_upside_down(rune){throwIfNotRune("turn_upside_down",rune);return rotate(Math.PI,rune)}function beside_frac(frac,rune1,rune2){throwIfNotRune("beside_frac",rune1);throwIfNotRune("beside_frac",rune2);if(!(frac>=0&&frac<=1)){throw Error("beside_frac can only take fraction in [0,1].")}var left=translate(-(1-frac),0,scale_independent(frac,1,rune1));var right=translate(frac,0,scale_independent(1-frac,1,rune2));var combined=getEmptyRune();combined.subRunes.push(left,right);return combined}function beside(rune1,rune2){throwIfNotRune("beside",rune1);throwIfNotRune("beside",rune2);return beside_frac(1/2,rune1,rune2)}function flip_vert(rune){throwIfNotRune("flip_vert",rune);return scale_independent(1,-1,rune)}function flip_horiz(rune){throwIfNotRune("flip_horiz",rune);return scale_independent(-1,1,rune)}function make_cross(rune){throwIfNotRune("make_cross",rune);return stack(beside(quarter_turn_right(rune),rotate(Math.PI,rune)),beside(rune,rotate(Math.PI/2,rune)))}function repeat_pattern(n,pattern,initial){if(n===0){return initial}return pattern(repeat_pattern(n-1,pattern,initial))}function overlay_frac(frac,rune1,rune2){throwIfNotRune("overlay_frac",rune1);throwIfNotRune("overlay_frac",rune2);if(!(frac>=0&&frac<=1)){throw Error("overlay_frac can only take fraction in [0,1].")}var useFrac=frac;var minFrac=0.000001;var maxFrac=1-minFrac;if(useFrac<minFrac){useFrac=minFrac;}if(useFrac>maxFrac){useFrac=maxFrac;}var front=getEmptyRune();front.subRunes.push(rune1);var frontMat=front.transformMatrix;scale$1(frontMat,frontMat,fromValues(1,1,useFrac));var back=getEmptyRune();back.subRunes.push(rune2);var backMat=back.transformMatrix;translate$1(backMat,backMat,fromValues(0,0,-useFrac));scale$1(backMat,backMat,fromValues(1,1,1-useFrac));var combined=getEmptyRune();combined.subRunes=[front,back];return combined}function overlay(rune1,rune2){throwIfNotRune("overlay",rune1);throwIfNotRune("overlay",rune2);return overlay_frac(0.5,rune1,rune2)}function color(rune,r,g,b){throwIfNotRune("color",rune);var wrapper=getEmptyRune();wrapper.subRunes.push(rune);var colorVector=[r,g,b,1];wrapper.colors=new Float32Array(colorVector);return wrapper}function random_color(rune){throwIfNotRune("random_color",rune);var wrapper=getEmptyRune();wrapper.subRunes.push(rune);var randomColor=hexToColor(colorPalette[Math.floor(Math.random()*colorPalette.length)]);wrapper.colors=new Float32Array(randomColor);return wrapper}function red(rune){throwIfNotRune("red",rune);return addColorFromHex(rune,"#F44336")}function pink(rune){throwIfNotRune("pink",rune);return addColorFromHex(rune,"#E91E63")}function purple(rune){throwIfNotRune("purple",rune);return addColorFromHex(rune,"#AA00FF")}function indigo(rune){throwIfNotRune("indigo",rune);return addColorFromHex(rune,"#3F51B5")}function blue(rune){throwIfNotRune("blue",rune);return addColorFromHex(rune,"#2196F3")}function green(rune){throwIfNotRune("green",rune);return addColorFromHex(rune,"#4CAF50")}function yellow(rune){throwIfNotRune("yellow",rune);return addColorFromHex(rune,"#FFEB3B")}function orange(rune){throwIfNotRune("orange",rune);return addColorFromHex(rune,"#FF9800")}function brown(rune){throwIfNotRune("brown",rune);return addColorFromHex(rune,"#795548")}function black(rune){throwIfNotRune("black",rune);return addColorFromHex(rune,"#000000")}function white(rune){throwIfNotRune("white",rune);return addColorFromHex(rune,"#FFFFFF")}function show(rune){throwIfNotRune("show",rune);var normalRune=copyRune(rune);normalRune.drawMethod="normal";normalRune.toReplString=function(){return "<RENDERING>"};drawnRunes.push(normalRune);return normalRune}function anaglyph(rune){throwIfNotRune("anaglyph",rune);var analyphRune=copyRune(rune);analyphRune.drawMethod="anaglyph";analyphRune.toReplString=function(){return "<RENDERING>"};drawnRunes.push(analyphRune);return analyphRune}function hollusion_magnitude(rune,magnitude){if(magnitude===void 0){magnitude=0.1;}throwIfNotRune("hollusion_magnitude",rune);var hollusionRune=copyRune(rune);hollusionRune.drawMethod="hollusion";hollusionRune.hollusionDistance=magnitude;hollusionRune.toReplString=function(){return "<RENDERING>"};drawnRunes.push(hollusionRune);return hollusionRune}function hollusion(rune){throwIfNotRune("hollusion",rune);return hollusion_magnitude(rune,0.1)}

    function runes(params,context){var moduleContext=context.get("rune");if(moduleContext==null){moduleContext={tabs:[],state:{drawnRunes:drawnRunes}};context.set("rune",moduleContext);}else if(moduleContext.state==null){moduleContext.state={drawnRunes:drawnRunes};}else {moduleContext.state.drawnRunes=drawnRunes;}return {square:square,blank:blank,rcross:rcross,sail:sail,triangle:triangle,corner:corner,nova:nova,circle:circle,heart:heart,pentagram:pentagram,ribbon:ribbon,from_url:from_url,scale_independent:scale_independent,scale:scale,translate:translate,rotate:rotate,stack_frac:stack_frac,stack:stack,stackn:stackn,quarter_turn_left:quarter_turn_left,quarter_turn_right:quarter_turn_right,turn_upside_down:turn_upside_down,beside_frac:beside_frac,beside:beside,flip_vert:flip_vert,flip_horiz:flip_horiz,make_cross:make_cross,repeat_pattern:repeat_pattern,overlay_frac:overlay_frac,overlay:overlay,color:color,random_color:random_color,red:red,pink:pink,purple:purple,indigo:indigo,blue:blue,green:green,yellow:yellow,orange:orange,brown:brown,black:black,white:white,show:show,anaglyph:anaglyph,hollusion_magnitude:hollusion_magnitude,hollusion:hollusion}}

    return runes;

}());
