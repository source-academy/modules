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

    var Core=function(){function Core(){}Core.initialize=function(csgModuleState){Core.moduleState=csgModuleState;};Core.getRenderGroupManager=function(){var moduleState=Core.moduleState;return moduleState.renderGroupManager};Core.moduleState=null;return Core}();

    /**
     * Flatten the given list of arguments into a single flat array.
     * The arguments can be composed of multiple depths of objects and arrays.
     * @param {Array} arr - list of arguments
     * @returns {Array} a flat list of arguments
     * @alias module:modeling/utils.flatten
     */
    const flatten = (arr) => arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);

    var flatten_1 = flatten;

    /**
     * Performs a shallow clone of the given geometry.
     * @param {geom2} geometry - the geometry to clone
     * @returns {geom2} new geometry
     * @alias module:modeling/geometries/geom2.clone
     */
    const clone$c = (geometry) => Object.assign({}, geometry);

    var clone_1$b = clone$c;

    /**
     * Adds the two matrices (A+B).
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} a - first operand
     * @param {mat4} b - second operand
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.add
     */
    const add$2 = (out, a, b) => {
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
      return out
    };

    var add_1$2 = add$2;

    /**
     * Represents a 4x4 matrix which is column-major (when typed out it looks row-major).
     * See fromValues().
     * @typedef {Array} mat4
     */

    /**
     * Creates a new identity matrix.
     *
     * @returns {mat4} a new matrix
     * @alias module:modeling/maths/mat4.create
     */
    const create$e = () => [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

    var create_1$e = create$e;

    /**
     * Creates a clone of the given matrix.
     *
     * @param {mat4} matrix - matrix to clone
     * @returns {mat4} a new matrix
     * @alias module:modeling/maths/mat4.clone
     */
    const clone$b = (matrix) => {
      const out = create_1$e();
      out[0] = matrix[0];
      out[1] = matrix[1];
      out[2] = matrix[2];
      out[3] = matrix[3];
      out[4] = matrix[4];
      out[5] = matrix[5];
      out[6] = matrix[6];
      out[7] = matrix[7];
      out[8] = matrix[8];
      out[9] = matrix[9];
      out[10] = matrix[10];
      out[11] = matrix[11];
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
      return out
    };

    var clone_1$a = clone$b;

    /**
     * Creates a copy of the given matrix.
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} matrix - matrix to copy
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.copy
     */
    const copy$6 = (out, matrix) => {
      out[0] = matrix[0];
      out[1] = matrix[1];
      out[2] = matrix[2];
      out[3] = matrix[3];
      out[4] = matrix[4];
      out[5] = matrix[5];
      out[6] = matrix[6];
      out[7] = matrix[7];
      out[8] = matrix[8];
      out[9] = matrix[9];
      out[10] = matrix[10];
      out[11] = matrix[11];
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
      return out
    };

    var copy_1$6 = copy$6;

    /**
     * Creates a invert copy of the given matrix.
     * @author Julian Lloyd
     * code from https://github.com/jlmakes/rematrix/blob/master/src/index.js
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} matrix - matrix to invert
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.invert
     */
    const invert$3 = (out, matrix) => {
      const a00 = matrix[0];
      const a01 = matrix[1];
      const a02 = matrix[2];
      const a03 = matrix[3];
      const a10 = matrix[4];
      const a11 = matrix[5];
      const a12 = matrix[6];
      const a13 = matrix[7];
      const a20 = matrix[8];
      const a21 = matrix[9];
      const a22 = matrix[10];
      const a23 = matrix[11];
      const a30 = matrix[12];
      const a31 = matrix[13];
      const a32 = matrix[14];
      const a33 = matrix[15];

      const b00 = a00 * a11 - a01 * a10;
      const b01 = a00 * a12 - a02 * a10;
      const b02 = a00 * a13 - a03 * a10;
      const b03 = a01 * a12 - a02 * a11;
      const b04 = a01 * a13 - a03 * a11;
      const b05 = a02 * a13 - a03 * a12;
      const b06 = a20 * a31 - a21 * a30;
      const b07 = a20 * a32 - a22 * a30;
      const b08 = a20 * a33 - a23 * a30;
      const b09 = a21 * a32 - a22 * a31;
      const b10 = a21 * a33 - a23 * a31;
      const b11 = a22 * a33 - a23 * a32;

      // Calculate the determinant
      let det =
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

      if (!det) {
        return null
      }
      det = 1.0 / det;

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

      return out
    };

    var invert_1$3 = invert$3;

    /**
     * Returns whether or not the matrices have exactly the same elements in the same position.
     *
     * @param {mat4} a - first matrix
     * @param {mat4} b - second matrix
     * @returns {Boolean} true if the matrices are equal
     * @alias module:modeling/maths/mat4.equals
     */
    const equals$9 = (a, b) => (
      a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] &&
      a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] &&
      a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
      a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15]
    );

    var equals_1$7 = equals$9;

    /**
     * Set a matrix to the identity transform.
     *
     * @param {mat4} out - receiving matrix
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.identity
     */
    const identity$1 = (out) => {
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
      return out
    };

    var identity_1$1 = identity$1;

    const EPSILON$1 = 0.000001;

    var constants$1 = {
      EPSILON: EPSILON$1
    };

    const { EPSILON } = constants$1;

    /**
     * Creates a matrix from a given angle around a given axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.rotate(dest, dest, rad, axis)
     *
     * @param {mat4} out - receiving matrix
     * @param {Number} rad - angle to rotate the matrix by
     * @param {vec3} axis - axis of which to rotate around
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.fromRotation
     * @example
     * let matrix = fromRotation(create(), Math.PI / 2, [0, 0, 3])
     */
    const fromRotation$1 = (out, rad, axis) => {
      let [x, y, z] = axis;
      let len = Math.hypot(x, y, z);

      if (Math.abs(len) < EPSILON) {
        // axis is 0,0,0 or almost
        return identity_1$1(out)
      }

      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;

      const s = Math.sin(rad);
      const c = Math.cos(rad);
      const t = 1 - c;

      // Perform rotation-specific matrix multiplication
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
      return out
    };

    var fromRotation_1$1 = fromRotation$1;

    /**
     * Creates a matrix from a vector scaling.
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.scale(dest, dest, vec)
     *
     * @param {mat4} out - receiving matrix
     * @param {vec3} vector - X, Y, Z factors by which to scale
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.fromScaling
     * @example
     * let matrix = fromScaling([1, 2, 0.5])
     */
    const fromScaling$1 = (out, vector) => {
      out[0] = vector[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = vector[1];
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = vector[2];
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out
    };

    var fromScaling_1$1 = fromScaling$1;

    /**
     * Creates a matrix from the given Tait–Bryan angles.
     *
     * Tait-Bryan Euler angle convention using active, intrinsic rotations around the axes in the order z-y-x.
     * @see https://en.wikipedia.org/wiki/Euler_angles
     *
     * @param {mat4} out - receiving matrix
     * @param {Number} yaw - Z rotation in radians
     * @param {Number} pitch - Y rotation in radians
     * @param {Number} roll - X rotation in radians
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.fromTaitBryanRotation
     * @example
     * let matrix = fromTaitBryanRotation(create(), Math.PI / 2, 0, Math.PI)
     */
    const fromTaitBryanRotation = (out, yaw, pitch, roll) => {
      // precompute sines and cosines of Euler angles
      const sy = Math.sin(yaw);
      const cy = Math.cos(yaw);
      const sp = Math.sin(pitch);
      const cp = Math.cos(pitch);
      const sr = Math.sin(roll);
      const cr = Math.cos(roll);

      // create and populate rotation matrix
      // left-hand-rule rotation
      // const els = [
      //  cp*cy, sr*sp*cy - cr*sy, sr*sy + cr*sp*cy, 0,
      //  cp*sy, cr*cy + sr*sp*sy, cr*sp*sy - sr*cy, 0,
      //  -sp, sr*cp, cr*cp, 0,
      //  0, 0, 0, 1
      // ]
      // right-hand-rule rotation
      out[0] = cp * cy;
      out[1] = cp * sy;
      out[2] = -sp;
      out[3] = 0;
      out[4] = sr * sp * cy - cr * sy;
      out[5] = cr * cy + sr * sp * sy;
      out[6] = sr * cp;
      out[7] = 0;
      out[8] = sr * sy + cr * sp * cy;
      out[9] = cr * sp * sy - sr * cy;
      out[10] = cr * cp;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out
    };

    var fromTaitBryanRotation_1 = fromTaitBryanRotation;

    /**
     * Creates a matrix from a vector translation.
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.translate(dest, dest, vec)
     *
     * @param {mat4} out - receiving matrix
     * @param {vec3} vector - offset (vector) of translation
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.fromTranslation
     * @example
     * let matrix = fromTranslation(create(), [1, 2, 3])
     */
    const fromTranslation$1 = (out, vector) => {
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
      out[12] = vector[0];
      out[13] = vector[1];
      out[14] = vector[2];
      out[15] = 1;
      return out
    };

    var fromTranslation_1$1 = fromTranslation$1;

    /**
     * Create a matrix with the given values.
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m03 Component in column 0, row 3 position (index 3)
     * @param {Number} m10 Component in column 1, row 0 position (index 4)
     * @param {Number} m11 Component in column 1, row 1 position (index 5)
     * @param {Number} m12 Component in column 1, row 2 position (index 6)
     * @param {Number} m13 Component in column 1, row 3 position (index 7)
     * @param {Number} m20 Component in column 2, row 0 position (index 8)
     * @param {Number} m21 Component in column 2, row 1 position (index 9)
     * @param {Number} m22 Component in column 2, row 2 position (index 10)
     * @param {Number} m23 Component in column 2, row 3 position (index 11)
     * @param {Number} m30 Component in column 3, row 0 position (index 12)
     * @param {Number} m31 Component in column 3, row 1 position (index 13)
     * @param {Number} m32 Component in column 3, row 2 position (index 14)
     * @param {Number} m33 Component in column 3, row 3 position (index 15)
     * @returns {mat4} a new matrix
     * @alias module:modeling/maths/mat4.fromValues
     * @example
     * let matrix = fromValues(
     *   1, 0, 0, 1,
     *   0, 1, 0, 0,
     *   0, 0, 1, 0,
     *   0, 0, 0, 1
     * )
     */
    const fromValues$4 = (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) => {
      const out = create_1$e();
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
      return out
    };

    var fromValues_1$4 = fromValues$4;

    /**
     * Calculates the absolute coordinates of the give vector.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector of reference
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.abs
     */
    const abs$1 = (out, vector) => {
      out[0] = Math.abs(vector[0]);
      out[1] = Math.abs(vector[1]);
      out[2] = Math.abs(vector[2]);
      return out
    };

    var abs_1$1 = abs$1;

    /**
     * Adds the coordinates of two vectors (A+B).
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.add
     */
    const add$1 = (out, a, b) => {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      return out
    };

    var add_1$1 = add$1;

    /**
     * Calculates the dot product of two vectors.
     *
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {Number} dot product
     * @alias module:modeling/maths/vec3.dot
     */
    const dot$2 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

    var dot_1$2 = dot$2;

    /**
     * Calculate the angle between two vectors.
     *
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {Number} angle (radians)
     * @alias module:modeling/maths/vec3.angle
     */
    const angle$1 = (a, b) => {
      const ax = a[0];
      const ay = a[1];
      const az = a[2];
      const bx = b[0];
      const by = b[1];
      const bz = b[2];
      const mag1 = Math.hypot(ax, ay, az);
      const mag2 = Math.hypot(bx, by, bz);
      const mag = mag1 * mag2;
      const cosine = mag && dot_1$2(a, b) / mag;
      return Math.acos(Math.min(Math.max(cosine, -1), 1))
    };

    var angle_1 = angle$1;

    /**
     * Represents a three dimensional vector.
     * See fromValues().
     * @typedef {Array} vec3
     */

    /**
     * Creates a new vector initialized to [0,0,0].
     *
     * @returns {vec3} a new vector
     * @alias module:modeling/maths/vec3.create
     */
    const create$d = () => [0, 0, 0];

    var create_1$d = create$d;

    /**
     * Create a clone of the given vector.
     *
     * @param {vec3} vector - vector to clone
     * @returns {vec3} a new vector
     * @alias module:modeling/maths/vec3.clone
     */
    const clone$a = (vector) => {
      const out = create_1$d();
      out[0] = vector[0];
      out[1] = vector[1];
      out[2] = vector[2];
      return out
    };

    var clone_1$9 = clone$a;

    /**
     * Create a copy of the given vector.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to copy
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.copy
     */
    const copy$5 = (out, vector) => {
      out[0] = vector[0];
      out[1] = vector[1];
      out[2] = vector[2];
      return out
    };

    var copy_1$5 = copy$5;

    /**
     * Computes the cross product of the given vectors (AxB).
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.cross
     */
    const cross$1 = (out, a, b) => {
      const ax = a[0];
      const ay = a[1];
      const az = a[2];
      const bx = b[0];
      const by = b[1];
      const bz = b[2];

      out[0] = ay * bz - az * by;
      out[1] = az * bx - ax * bz;
      out[2] = ax * by - ay * bx;
      return out
    };

    var cross_1$1 = cross$1;

    /**
     * Calculates the Euclidian distance between the given vectors.
     *
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {Number} distance
     * @alias module:modeling/maths/vec3.distance
     */
    const distance$1 = (a, b) => {
      const x = b[0] - a[0];
      const y = b[1] - a[1];
      const z = b[2] - a[2];
      return Math.hypot(x, y, z)
    };

    var distance_1$1 = distance$1;

    /**
     * Divides the coordinates of two vectors (A/B).
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} a - dividend vector
     * @param {vec3} b - divisor vector
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.divide
     */
    const divide$1 = (out, a, b) => {
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      out[2] = a[2] / b[2];
      return out
    };

    var divide_1$1 = divide$1;

    /**
     * Compare the given vectors for equality.
     *
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {Boolean} true if a and b are equal
     * @alias module:modeling/maths/vec3.equals
     */
    const equals$8 = (a, b) => (a[0] === b[0]) && (a[1] === b[1]) && (a[2] === b[2]);

    var equals_1$6 = equals$8;

    /**
     * Creates a vector from a single scalar value.
     * All components of the resulting vector have the given value.
     *
     * @param {vec3} out - receiving vector
     * @param {Number} scalar
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.fromScalar
     */
    const fromScalar$2 = (out, scalar) => {
      out[0] = scalar;
      out[1] = scalar;
      out[2] = scalar;
      return out
    };

    var fromScalar_1$2 = fromScalar$2;

    /**
     * Creates a new vector initialized with the given values.
     *
     * @param {Number} x - X component
     * @param {Number} y - Y component
     * @param {Number} z - Z component
     * @returns {vec3} a new vector
     * @alias module:modeling/maths/vec3.fromValues
     */
    const fromValues$3 = (x, y, z) => {
      const out = create_1$d();
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out
    };

    var fromValues_1$3 = fromValues$3;

    /**
     * Create a new vector by extending a 2D vector with a Z value.
     *
     * @param {vec3} out - receiving vector
     * @param {Array} vector - 2D vector of values
     * @param {Number} [z=0] - Z value
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.fromVec2
     */
    const fromVector2 = (out, vector, z = 0) => {
      out[0] = vector[0];
      out[1] = vector[1];
      out[2] = z;
      return out
    };

    var fromVec2 = fromVector2;

    /**
     * Calculates the length of a vector.
     *
     * @param {vec3} vector - vector to calculate length of
     * @returns {Number} length
     * @alias module:modeling/maths/vec3.length
     */
    const length$1 = (vector) => {
      const x = vector[0];
      const y = vector[1];
      const z = vector[2];
      return Math.hypot(x, y, z)
    };

    var length_1$1 = length$1;

    /**
     * Performs a linear interpolation between two vectors.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @param {Number} t - interpolant (0.0 to 1.0) applied between the two inputs
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.lerp
     */
    const lerp$1 = (out, a, b, t) => {
      out[0] = a[0] + t * (b[0] - a[0]);
      out[1] = a[1] + t * (b[1] - a[1]);
      out[2] = a[2] + t * (b[2] - a[2]);
      return out
    };

    var lerp_1$1 = lerp$1;

    /**
     * Returns the maximum coordinates of the given vectors.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.max
     */
    const max$1 = (out, a, b) => {
      out[0] = Math.max(a[0], b[0]);
      out[1] = Math.max(a[1], b[1]);
      out[2] = Math.max(a[2], b[2]);
      return out
    };

    var max_1$1 = max$1;

    /**
     * Returns the minimum coordinates of the given vectors.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.min
     */
    const min$1 = (out, a, b) => {
      out[0] = Math.min(a[0], b[0]);
      out[1] = Math.min(a[1], b[1]);
      out[2] = Math.min(a[2], b[2]);
      return out
    };

    var min_1$1 = min$1;

    /**
     * Multiply the coordinates of the given vectors (A*B).
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.multiply
     */
    const multiply$3 = (out, a, b) => {
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      out[2] = a[2] * b[2];
      return out
    };

    var multiply_1$3 = multiply$3;

    /**
     * Negates the coordinates of the given vector.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to negate
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.negate
     */
    const negate$1 = (out, vector) => {
      out[0] = -vector[0];
      out[1] = -vector[1];
      out[2] = -vector[2];
      return out
    };

    var negate_1$1 = negate$1;

    /**
     * Normalize the given vector.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to normalize
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.normalize
     */
    const normalize$1 = (out, vector) => {
      const x = vector[0];
      const y = vector[1];
      const z = vector[2];
      let len = x * x + y * y + z * z;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
      }
      out[0] = x * len;
      out[1] = y * len;
      out[2] = z * len;
      return out
    };

    var normalize_1$1 = normalize$1;

    /**
     * Create a new vector that is orthogonal to the given vector.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector of reference
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.orthogonal
     */
    const orthogonal = (out, vector) => {
      const bV = abs_1$1(create_1$d(), vector);
      const b0 = 0 + ((bV[0] < bV[1]) && (bV[0] < bV[2]));
      const b1 = 0 + ((bV[1] <= bV[0]) && (bV[1] < bV[2]));
      const b2 = 0 + ((bV[2] <= bV[0]) && (bV[2] <= bV[1]));

      return cross_1$1(out, vector, [b0, b1, b2])
    };

    var orthogonal_1 = orthogonal;

    /**
     * Rotate the given vector around the given origin, X axis only.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to rotate
     * @param {vec3} origin - origin of the rotation
     * @param {Number} radians - angle of rotation
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.rotateX
     */
    const rotateX$3 = (out, vector, origin, radians) => {
      const p = [];
      const r = [];

      // translate point to the origin
      p[0] = vector[0] - origin[0];
      p[1] = vector[1] - origin[1];
      p[2] = vector[2] - origin[2];

      // perform rotation
      r[0] = p[0];
      r[1] = p[1] * Math.cos(radians) - p[2] * Math.sin(radians);
      r[2] = p[1] * Math.sin(radians) + p[2] * Math.cos(radians);

      // translate to correct position
      out[0] = r[0] + origin[0];
      out[1] = r[1] + origin[1];
      out[2] = r[2] + origin[2];

      return out
    };

    var rotateX_1$2 = rotateX$3;

    /**
     * Rotate the given vector around the given origin, Y axis only.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to rotate
     * @param {vec3} origin - origin of the rotation
     * @param {Number} radians - angle of rotation
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.rotateY
     */
    const rotateY$3 = (out, vector, origin, radians) => {
      const p = [];
      const r = [];

      // translate point to the origin
      p[0] = vector[0] - origin[0];
      p[1] = vector[1] - origin[1];
      p[2] = vector[2] - origin[2];

      // perform rotation
      r[0] = p[2] * Math.sin(radians) + p[0] * Math.cos(radians);
      r[1] = p[1];
      r[2] = p[2] * Math.cos(radians) - p[0] * Math.sin(radians);

      // translate to correct position
      out[0] = r[0] + origin[0];
      out[1] = r[1] + origin[1];
      out[2] = r[2] + origin[2];

      return out
    };

    var rotateY_1$2 = rotateY$3;

    /**
     * Rotate the given vector around the given origin, Z axis only.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to rotate
     * @param {vec3} origin - origin of the rotation
     * @param {Number} radians - angle of rotation in radians
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.rotateZ
     */
    const rotateZ$3 = (out, vector, origin, radians) => {
      const p = [];
      const r = [];
      // Translate point to the origin
      p[0] = vector[0] - origin[0];
      p[1] = vector[1] - origin[1];

      // perform rotation
      r[0] = (p[0] * Math.cos(radians)) - (p[1] * Math.sin(radians));
      r[1] = (p[0] * Math.sin(radians)) + (p[1] * Math.cos(radians));

      // translate to correct position
      out[0] = r[0] + origin[0];
      out[1] = r[1] + origin[1];
      out[2] = vector[2];

      return out
    };

    var rotateZ_1$2 = rotateZ$3;

    /**
     * Scales the coordinates of the given vector by a scalar number.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to scale
     * @param {Number} amount - amount to scale the vector by
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.scale
     */
    const scale$5 = (out, vector, amount) => {
      out[0] = vector[0] * amount;
      out[1] = vector[1] * amount;
      out[2] = vector[2] * amount;
      return out
    };

    var scale_1$4 = scale$5;

    /**
     * Snaps the coordinates of the given vector to the given epsilon.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to snap
     * @param {Number} epsilon - epsilon of precision, less than 0
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.snap
     */
    const snap$2 = (out, vector, epsilon) => {
      out[0] = Math.round(vector[0] / epsilon) * epsilon + 0;
      out[1] = Math.round(vector[1] / epsilon) * epsilon + 0;
      out[2] = Math.round(vector[2] / epsilon) * epsilon + 0;
      return out
    };

    var snap_1$2 = snap$2;

    /**
     * Calculates the squared distance between two vectors.
     *
     * @param {vec3} a - first operand
     * @param {vec3} b - second operand
     * @returns {Number} squared distance
     * @alias module:modeling/maths/vec3.squaredDistance
     */
    const squaredDistance$1 = (a, b) => {
      const x = b[0] - a[0];
      const y = b[1] - a[1];
      const z = b[2] - a[2];
      return x * x + y * y + z * z
    };

    var squaredDistance_1$1 = squaredDistance$1;

    /**
     * Calculates the squared length of the given vector.
     *
     * @param {vec3} vector - vector to calculate squared length of
     * @returns {Number} squared length
     * @alias module:modeling/maths/vec3.squaredLength
     */
    const squaredLength$1 = (vector) => {
      const x = vector[0];
      const y = vector[1];
      const z = vector[2];
      return x * x + y * y + z * z
    };

    var squaredLength_1$1 = squaredLength$1;

    /**
     * Subtracts the coordinates of two vectors (A-B).
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} a - minuend vector
     * @param {vec3} b - subtrahend vector
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.subtract
     */
    const subtract$6 = (out, a, b) => {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      return out
    };

    var subtract_1$3 = subtract$6;

    /**
     * Convert the given vector to a representative string.
     * @param {vec3} vec - vector of reference
     * @returns {String} string representation
     * @alias module:modeling/maths/vec3.toString
     */
    const toString$a = (vec) => `[${vec[0].toFixed(7)}, ${vec[1].toFixed(7)}, ${vec[2].toFixed(7)}]`;

    var toString_1$a = toString$a;

    /**
     * Transforms the given vector using the given matrix.
     *
     * @param {vec3} out - receiving vector
     * @param {vec3} vector - vector to transform
     * @param {mat4} matrix - transform matrix
     * @returns {vec3} out
     * @alias module:modeling/maths/vec3.transform
     */
    const transform$b = (out, vector, matrix) => {
      const x = vector[0];
      const y = vector[1];
      const z = vector[2];
      let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
      w = w || 1.0;
      out[0] = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w;
      out[1] = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w;
      out[2] = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w;
      return out
    };

    var transform_1$b = transform$b;

    /**
     * Represents a three dimensional vector.
     * @see {@link vec3} for data structure information.
     * @module modeling/maths/vec3
     */
    var vec3$1 = {
      abs: abs_1$1,
      add: add_1$1,
      angle: angle_1,
      clone: clone_1$9,
      copy: copy_1$5,
      create: create_1$d,
      cross: cross_1$1,
      distance: distance_1$1,
      divide: divide_1$1,
      dot: dot_1$2,
      equals: equals_1$6,
      fromScalar: fromScalar_1$2,
      fromValues: fromValues_1$3,
      fromVec2: fromVec2,
      length: length_1$1,
      lerp: lerp_1$1,
      max: max_1$1,
      min: min_1$1,
      multiply: multiply_1$3,
      negate: negate_1$1,
      normalize: normalize_1$1,
      orthogonal: orthogonal_1,
      rotateX: rotateX_1$2,
      rotateY: rotateY_1$2,
      rotateZ: rotateZ_1$2,
      scale: scale_1$4,
      snap: snap_1$2,
      squaredDistance: squaredDistance_1$1,
      squaredLength: squaredLength_1$1,
      subtract: subtract_1$3,
      toString: toString_1$a,
      transform: transform_1$b
    };

    /**
     * Create a matrix that rotates the given source to the given target vector.
     *
     * Each vector must be a directional vector with a length greater than zero.
     * @see https://gist.github.com/kevinmoran/b45980723e53edeb8a5a43c49f134724
     * @param {mat4} out - receiving matrix
     * @param {vec3} source - source vector
     * @param {vec3} target - target vector
     * @returns {mat4} a new matrix
     * @alias module:modeling/maths/mat4.fromVectorRotation
     * @example
     * let matrix = fromVectorRotation(mat4.create(), [1, 2, 2], [-3, 3, 12])
     */
    const fromVectorRotation = (out, source, target) => {
      const sourceNormal = vec3$1.normalize(vec3$1.create(), source);
      const targetNormal = vec3$1.normalize(vec3$1.create(), target);

      const axis = vec3$1.cross(vec3$1.create(), targetNormal, sourceNormal);
      const cosA = vec3$1.dot(targetNormal, sourceNormal);
      if (cosA === -1.0) return fromRotation_1$1(out, Math.PI, vec3$1.orthogonal(axis, sourceNormal))

      const k = 1 / (1 + cosA);
      out[0] = (axis[0] * axis[0] * k) + cosA;
      out[1] = (axis[1] * axis[0] * k) - axis[2];
      out[2] = (axis[2] * axis[0] * k) + axis[1];
      out[3] = 0;

      out[4] = (axis[0] * axis[1] * k) + axis[2];
      out[5] = (axis[1] * axis[1] * k) + cosA;
      out[6] = (axis[2] * axis[1] * k) - axis[0];
      out[7] = 0;

      out[8] = (axis[0] * axis[2] * k) - axis[1];
      out[9] = (axis[1] * axis[2] * k) + axis[0];
      out[10] = (axis[2] * axis[2] * k) + cosA;
      out[11] = 0;

      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out
    };

    var fromVectorRotation_1 = fromVectorRotation;

    /**
     * Creates a matrix from the given angle around the X axis.
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.rotateX(dest, dest, radians)
     *
     * @param {mat4} out - receiving matrix
     * @param {Number} radians - angle to rotate the matrix by
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.fromXRotation
     * @example
     * let matrix = fromXRotation(create(), Math.PI / 2)
     */
    const fromXRotation$1 = (out, radians) => {
      const s = Math.sin(radians);
      const c = Math.cos(radians);

      // Perform axis-specific matrix multiplication
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
      return out
    };

    var fromXRotation_1$1 = fromXRotation$1;

    /**
     * Creates a matrix from the given angle around the Y axis.
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.rotateY(dest, dest, radians)
     *
     * @param {mat4} out - receiving matrix
     * @param {Number} radians - angle to rotate the matrix by
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.fromYRotation
     * @example
     * let matrix = fromYRotation(create(), Math.PI / 2)
     */
    const fromYRotation$1 = (out, radians) => {
      const s = Math.sin(radians);
      const c = Math.cos(radians);

      // Perform axis-specific matrix multiplication
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
      return out
    };

    var fromYRotation_1$1 = fromYRotation$1;

    /**
     * Creates a matrix from the given angle around the Z axis.
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.rotateZ(dest, dest, radians)
     *
     * @param {mat4} out - receiving matrix
     * @param {Number} radians - angle to rotate the matrix by
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.fromZRotation
     * @example
     * let matrix = fromZRotation(create(), Math.PI / 2)
     */
    const fromZRotation$1 = (out, radians) => {
      const s = Math.sin(radians);
      const c = Math.cos(radians);

      // Perform axis-specific matrix multiplication
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
      return out
    };

    var fromZRotation_1$1 = fromZRotation$1;

    /**
     * Determine whether the given matrix is the identity transform.
     * This is equivalent to (but much faster than):
     *
     *     mat4.equals(mat4.create(), matrix)
     *
     * @param {mat4} matrix - the matrix
     * @returns {Boolean} true if matrix is the identity transform
     * @alias module:modeling/maths/mat4.isIdentity
     * @example
     * if (mat4.isIdentity(mymatrix)) ...
     */
    const isIdentity = (matrix) => (
      matrix[0] === 1 && matrix[1] === 0 && matrix[2] === 0 && matrix[3] === 0 &&
      matrix[4] === 0 && matrix[5] === 1 && matrix[6] === 0 && matrix[7] === 0 &&
      matrix[8] === 0 && matrix[9] === 0 && matrix[10] === 1 && matrix[11] === 0 &&
      matrix[12] === 0 && matrix[13] === 0 && matrix[14] === 0 && matrix[15] === 1
    );

    var isIdentity_1 = isIdentity;

    /**
     * Determine whether the given matrix is only translate and/or scale.
     * This code returns true for PI rotation as it can be interpreted as scale.
     *
     * @param {mat4} matrix - the matrix
     * @returns {Boolean} true if matrix is for translate and/or scale
     * @alias module:modeling/maths/mat4.isOnlyTransformScale
     */
    const isOnlyTransformScale = (matrix) => (

      // TODO check if it is worth the effort to add recognition of 90 deg rotations

      isZero(matrix[1]) && isZero(matrix[2]) && isZero(matrix[3]) &&
      isZero(matrix[4]) && isZero(matrix[6]) && isZero(matrix[7]) &&
      isZero(matrix[8]) && isZero(matrix[9]) && isZero(matrix[11]) &&
      matrix[15] === 1
    );

    const isZero = (num) => Math.abs(num) < Number.EPSILON;

    var isOnlyTransformScale_1 = isOnlyTransformScale;

    /**
     * Determine whether the given matrix is a mirroring transformation.
     *
     * @param {mat4} matrix - matrix of reference
     * @returns {Boolean} true if matrix is a mirroring transformation
     * @alias module:modeling/maths/mat4.isMirroring
     */
    const isMirroring = (matrix) => {
      const u = fromValues_1$3(matrix[0], matrix[4], matrix[8]);
      const v = fromValues_1$3(matrix[1], matrix[5], matrix[9]);
      const w = fromValues_1$3(matrix[2], matrix[6], matrix[10]);

      // for a true orthogonal, non-mirrored base, u.cross(v) == w
      // If they have an opposite direction then we are mirroring
      const mirrorvalue = dot_1$2(cross_1$1(u, u, v), w);
      const ismirror = (mirrorvalue < 0);
      return ismirror
    };

    var isMirroring_1 = isMirroring;

    /**
     * Create a matrix for mirroring about the given plane.
     *
     * @param {mat4} out - receiving matrix
     * @param {vec4} plane - plane of which to mirror the matrix
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.mirrorByPlane
     */
    const mirrorByPlane = (out, plane) => {
      const [nx, ny, nz, w] = plane;

      out[0] = (1.0 - 2.0 * nx * nx);
      out[1] = (-2.0 * ny * nx);
      out[2] = (-2.0 * nz * nx);
      out[3] = 0;
      out[4] = (-2.0 * nx * ny);
      out[5] = (1.0 - 2.0 * ny * ny);
      out[6] = (-2.0 * nz * ny);
      out[7] = 0;
      out[8] = (-2.0 * nx * nz);
      out[9] = (-2.0 * ny * nz);
      out[10] = (1.0 - 2.0 * nz * nz);
      out[11] = 0;
      out[12] = (2.0 * nx * w);
      out[13] = (2.0 * ny * w);
      out[14] = (2.0 * nz * w);
      out[15] = 1;

      return out
    };

    var mirrorByPlane_1 = mirrorByPlane;

    /**
     * Multiplies the two matrices.
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} a - first operand
     * @param {mat4} b - second operand
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.multiply
     */
    const multiply$2 = (out, a, b) => {
      const a00 = a[0];
      const a01 = a[1];
      const a02 = a[2];
      const a03 = a[3];
      const a10 = a[4];
      const a11 = a[5];
      const a12 = a[6];
      const a13 = a[7];
      const a20 = a[8];
      const a21 = a[9];
      const a22 = a[10];
      const a23 = a[11];
      const a30 = a[12];
      const a31 = a[13];
      const a32 = a[14];
      const a33 = a[15];

      // Cache only the current line of the second matrix
      let b0 = b[0];
      let b1 = b[1];
      let b2 = b[2];
      let b3 = b[3];
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
      return out
    };

    var multiply_1$2 = multiply$2;

    /**
     * Rotates a matrix by the given angle about the given axis.
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} matrix - matrix to rotate
     * @param {Number} radians - angle to rotate the matrix by
     * @param {vec3} axis - axis to rotate around
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.rotate
     */
    const rotate$5 = (out, matrix, radians, axis) => {
      let [x, y, z] = axis;
      let len = Math.hypot(x, y, z);

      if (Math.abs(len) < 0.000001) {
        // axis is 0,0,0 or almost
        return copy_1$6(out, matrix)
      }

      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;

      const s = Math.sin(radians);
      const c = Math.cos(radians);
      const t = 1 - c;

      const a00 = matrix[0];
      const a01 = matrix[1];
      const a02 = matrix[2];
      const a03 = matrix[3];
      const a10 = matrix[4];
      const a11 = matrix[5];
      const a12 = matrix[6];
      const a13 = matrix[7];
      const a20 = matrix[8];
      const a21 = matrix[9];
      const a22 = matrix[10];
      const a23 = matrix[11];

      // Construct the elements of the rotation matrix
      const b00 = x * x * t + c;
      const b01 = y * x * t + z * s;
      const b02 = z * x * t - y * s;
      const b10 = x * y * t - z * s;
      const b11 = y * y * t + c;
      const b12 = z * y * t + x * s;
      const b20 = x * z * t + y * s;
      const b21 = y * z * t - x * s;
      const b22 = z * z * t + c;

      // Perform rotation-specific matrix multiplication
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

      if (matrix !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = matrix[12];
        out[13] = matrix[13];
        out[14] = matrix[14];
        out[15] = matrix[15];
      }
      return out
    };

    var rotate_1$3 = rotate$5;

    /**
     * Rotates a matrix by the given angle around the X axis.
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} matrix - matrix to rotate
     * @param {Number} radians - angle to rotate the matrix by
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.rotateX
     */
    const rotateX$2 = (out, matrix, radians) => {
      const s = Math.sin(radians);
      const c = Math.cos(radians);
      const a10 = matrix[4];
      const a11 = matrix[5];
      const a12 = matrix[6];
      const a13 = matrix[7];
      const a20 = matrix[8];
      const a21 = matrix[9];
      const a22 = matrix[10];
      const a23 = matrix[11];

      if (matrix !== out) { // If the source and destination differ, copy the unchanged rows
        out[0] = matrix[0];
        out[1] = matrix[1];
        out[2] = matrix[2];
        out[3] = matrix[3];
        out[12] = matrix[12];
        out[13] = matrix[13];
        out[14] = matrix[14];
        out[15] = matrix[15];
      }

      // Perform axis-specific matrix multiplication
      out[4] = a10 * c + a20 * s;
      out[5] = a11 * c + a21 * s;
      out[6] = a12 * c + a22 * s;
      out[7] = a13 * c + a23 * s;
      out[8] = a20 * c - a10 * s;
      out[9] = a21 * c - a11 * s;
      out[10] = a22 * c - a12 * s;
      out[11] = a23 * c - a13 * s;
      return out
    };

    var rotateX_1$1 = rotateX$2;

    /**
     * Rotates a matrix by the given angle around the Y axis.
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} matrix - matrix to rotate
     * @param {Number} radians - angle to rotate the matrix by
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.rotateY
     */
    const rotateY$2 = (out, matrix, radians) => {
      const s = Math.sin(radians);
      const c = Math.cos(radians);
      const a00 = matrix[0];
      const a01 = matrix[1];
      const a02 = matrix[2];
      const a03 = matrix[3];
      const a20 = matrix[8];
      const a21 = matrix[9];
      const a22 = matrix[10];
      const a23 = matrix[11];

      if (matrix !== out) { // If the source and destination differ, copy the unchanged rows
        out[4] = matrix[4];
        out[5] = matrix[5];
        out[6] = matrix[6];
        out[7] = matrix[7];
        out[12] = matrix[12];
        out[13] = matrix[13];
        out[14] = matrix[14];
        out[15] = matrix[15];
      }

      // Perform axis-specific matrix multiplication
      out[0] = a00 * c - a20 * s;
      out[1] = a01 * c - a21 * s;
      out[2] = a02 * c - a22 * s;
      out[3] = a03 * c - a23 * s;
      out[8] = a00 * s + a20 * c;
      out[9] = a01 * s + a21 * c;
      out[10] = a02 * s + a22 * c;
      out[11] = a03 * s + a23 * c;
      return out
    };

    var rotateY_1$1 = rotateY$2;

    /**
     * Rotates a matrix by the given angle around the Z axis.
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} matrix - matrix to rotate
     * @param {Number} radians - angle to rotate the matrix by
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.rotateZ
     */
    const rotateZ$2 = (out, matrix, radians) => {
      const s = Math.sin(radians);
      const c = Math.cos(radians);
      const a00 = matrix[0];
      const a01 = matrix[1];
      const a02 = matrix[2];
      const a03 = matrix[3];
      const a10 = matrix[4];
      const a11 = matrix[5];
      const a12 = matrix[6];
      const a13 = matrix[7];

      if (matrix !== out) { // If the source and destination differ, copy the unchanged last row
        out[8] = matrix[8];
        out[9] = matrix[9];
        out[10] = matrix[10];
        out[11] = matrix[11];
        out[12] = matrix[12];
        out[13] = matrix[13];
        out[14] = matrix[14];
        out[15] = matrix[15];
      }

      // Perform axis-specific matrix multiplication
      out[0] = a00 * c + a10 * s;
      out[1] = a01 * c + a11 * s;
      out[2] = a02 * c + a12 * s;
      out[3] = a03 * c + a13 * s;
      out[4] = a10 * c - a00 * s;
      out[5] = a11 * c - a01 * s;
      out[6] = a12 * c - a02 * s;
      out[7] = a13 * c - a03 * s;
      return out
    };

    var rotateZ_1$1 = rotateZ$2;

    /**
     * Scales the matrix by the given dimensions.
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} matrix - matrix to scale
     * @param {vec3} dimensions - dimensions to scale the matrix by
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.scale
     */
    const scale$4 = (out, matrix, dimensions) => {
      const x = dimensions[0];
      const y = dimensions[1];
      const z = dimensions[2];

      out[0] = matrix[0] * x;
      out[1] = matrix[1] * x;
      out[2] = matrix[2] * x;
      out[3] = matrix[3] * x;
      out[4] = matrix[4] * y;
      out[5] = matrix[5] * y;
      out[6] = matrix[6] * y;
      out[7] = matrix[7] * y;
      out[8] = matrix[8] * z;
      out[9] = matrix[9] * z;
      out[10] = matrix[10] * z;
      out[11] = matrix[11] * z;
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
      return out
    };

    var scale_1$3 = scale$4;

    /**
     * Subtracts matrix b from matrix a. (A-B)
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} a - first operand
     * @param {mat4} b - second operand
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.subtract
     */
    const subtract$5 = (out, a, b) => {
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
      return out
    };

    var subtract_1$2 = subtract$5;

    /**
     * Return a string representing the given matrix.
     *
     * @param {mat4} mat - matrix of reference
     * @returns {String} string representation
     * @alias module:modeling/maths/mat4.toString
     */
    const toString$9 = (mat) => mat.map((n) => n.toFixed(7)).toString();

    var toString_1$9 = toString$9;

    /**
     * Translate the matrix by the given offset vector.
     *
     * @param {mat4} out - receiving matrix
     * @param {mat4} matrix - matrix to translate
     * @param {vec3} offsets - offset vector to translate by
     * @returns {mat4} out
     * @alias module:modeling/maths/mat4.translate
     */
    const translate$6 = (out, matrix, offsets) => {
      const x = offsets[0];
      const y = offsets[1];
      const z = offsets[2];
      let a00;
      let a01;
      let a02;
      let a03;
      let a10;
      let a11;
      let a12;
      let a13;
      let a20;
      let a21;
      let a22;
      let a23;

      if (matrix === out) {
      // 0-11 assignments are unnecessary
        out[12] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
        out[13] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
        out[14] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
        out[15] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
      } else {
        a00 = matrix[0]; a01 = matrix[1]; a02 = matrix[2]; a03 = matrix[3];
        a10 = matrix[4]; a11 = matrix[5]; a12 = matrix[6]; a13 = matrix[7];
        a20 = matrix[8]; a21 = matrix[9]; a22 = matrix[10]; a23 = matrix[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + matrix[12];
        out[13] = a01 * x + a11 * y + a21 * z + matrix[13];
        out[14] = a02 * x + a12 * y + a22 * z + matrix[14];
        out[15] = a03 * x + a13 * y + a23 * z + matrix[15];
      }

      return out
    };

    var translate_1$2 = translate$6;

    /**
     * Represents a 4x4 matrix which is column-major (when typed out it looks row-major).
     * @see {@link mat4} for data structure information.
     * @module modeling/maths/mat4
     */
    var mat4 = {
      add: add_1$2,
      clone: clone_1$a,
      copy: copy_1$6,
      create: create_1$e,
      invert: invert_1$3,
      equals: equals_1$7,
      fromRotation: fromRotation_1$1,
      fromScaling: fromScaling_1$1,
      fromTaitBryanRotation: fromTaitBryanRotation_1,
      fromTranslation: fromTranslation_1$1,
      fromValues: fromValues_1$4,
      fromVectorRotation: fromVectorRotation_1,
      fromXRotation: fromXRotation_1$1,
      fromYRotation: fromYRotation_1$1,
      fromZRotation: fromZRotation_1$1,
      identity: identity_1$1,
      isIdentity: isIdentity_1,
      isOnlyTransformScale: isOnlyTransformScale_1,
      isMirroring: isMirroring_1,
      mirrorByPlane: mirrorByPlane_1,
      multiply: multiply_1$2,
      rotate: rotate_1$3,
      rotateX: rotateX_1$1,
      rotateY: rotateY_1$1,
      rotateZ: rotateZ_1$1,
      scale: scale_1$3,
      subtract: subtract_1$2,
      toString: toString_1$9,
      translate: translate_1$2
    };

    /**
     * Represents a 2D geometry consisting of a list of sides.
     * @typedef {Object} geom2
     * @property {Array} sides - list of sides, each side containing two points
     * @property {mat4} transforms - transforms to apply to the sides, see transform()
     */

    /**
     * Create a new 2D geometry composed of unordered sides (two connected points).
     * @param {Array} [sides] - list of sides where each side is an array of two points
     * @returns {geom2} a new geometry
     * @alias module:modeling/geometries/geom2.create
     */
    const create$c = (sides) => {
      if (sides === undefined) {
        sides = []; // empty contents
      }
      return {
        sides: sides,
        transforms: mat4.create()
      }
    };

    var create_1$c = create$c;

    /**
     * Calculates the absolute coordinates of the given vector.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - vector of reference
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.abs
     */
    const abs = (out, vector) => {
      out[0] = Math.abs(vector[0]);
      out[1] = Math.abs(vector[1]);
      return out
    };

    var abs_1 = abs;

    /**
     * Adds the coordinates of two vectors (A+B).
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.add
     */
    const add = (out, a, b) => {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      return out
    };

    var add_1 = add;

    /**
     * Calculate the angle of the given vector.
     *
     * @param {vec2} vector - vector of reference
     * @returns {Number} angle in radians
     * @alias module:modeling/maths/vec2.angleRadians
     */
    const angleRadians = (vector) => Math.atan2(vector[1], vector[0]); // y=sin, x=cos

    var angleRadians_1 = angleRadians;

    var angle = angleRadians_1;

    /**
     * Calculate the angle of the given vector.
     *
     * @param {vec2} vector - vector of reference
     * @returns {Number} angle in degrees
     * @alias module:modeling/maths/vec2.angleDegrees
     */
    const angleDegrees = (vector) => angleRadians_1(vector) * 57.29577951308232;

    var angleDegrees_1 = angleDegrees;

    /**
     * Represents a two dimensional vector.
     * See fromValues().
     * @typedef {Array} vec2
     */

    /**
     * Creates a new vector, initialized to [0,0].
     *
     * @returns {vec2} a new vector
     * @alias module:modeling/maths/vec2.create
     */
    const create$b = () => [0, 0];

    var create_1$b = create$b;

    /**
     * Create a clone of the given vector.
     *
     * @param {vec2} vector - vector to clone
     * @returns {vec2} a new vector
     * @alias module:modeling/maths/vec2.clone
     */
    const clone$9 = (vector) => {
      const out = create_1$b();
      out[0] = vector[0];
      out[1] = vector[1];
      return out
    };

    var clone_1$8 = clone$9;

    /**
     * Create a copy of the given vector.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - source vector
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.copy
     */
    const copy$4 = (out, vector) => {
      out[0] = vector[0];
      out[1] = vector[1];
      return out
    };

    var copy_1$4 = copy$4;

    /**
     * Computes the cross product (3D) of two vectors.
     *
     * @param {vec3} out - receiving vector (3D)
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {vec3} out
     * @alias module:modeling/maths/vec2.cross
     */
    const cross = (out, a, b) => {
      out[0] = 0;
      out[1] = 0;
      out[2] = a[0] * b[1] - a[1] * b[0];
      return out
    };

    var cross_1 = cross;

    /**
     * Calculates the distance between two vectors.
     *
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {Number} distance
     * @alias module:modeling/maths/vec2.distance
     */
    const distance = (a, b) => {
      const x = b[0] - a[0];
      const y = b[1] - a[1];
      return Math.hypot(x, y)
    };

    var distance_1 = distance;

    /**
     * Divides the coordinates of two vectors (A/B).
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.divide
     */
    const divide = (out, a, b) => {
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      return out
    };

    var divide_1 = divide;

    /**
     * Calculates the dot product of two vectors.
     *
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {Number} dot product
     * @alias module:modeling/maths/vec2.dot
     */
    const dot$1 = (a, b) => a[0] * b[0] + a[1] * b[1];

    var dot_1$1 = dot$1;

    /**
     * Compare the given vectors for equality.
     *
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {Boolean} true if a and b are equal
     * @alias module:modeling/maths/vec2.equals
     */
    const equals$7 = (a, b) => (a[0] === b[0]) && (a[1] === b[1]);

    var equals_1$5 = equals$7;

    /**
     * Create a new vector in the direction of the given angle.
     *
     * @param {vec2} out - receiving vector
     * @param {Number} radians - angle in radians
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.fromAngleRadians
     */
    const fromAngleRadians = (out, radians) => {
      out[0] = Math.cos(radians);
      out[1] = Math.sin(radians);
      return out
    };

    var fromAngleRadians_1 = fromAngleRadians;

    /**
     * Create a new vector in the direction of the given angle.
     *
     * @param {vec2} out - receiving vector
     * @param {Number} degrees - angle in degrees
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.fromAngleDegrees
     */
    const fromAngleDegrees = (out, degrees) => fromAngleRadians_1(out, Math.PI * degrees / 180);

    var fromAngleDegrees_1 = fromAngleDegrees;

    /**
     * Create a vector from a single scalar value.
     *
     * @param {vec2} out - receiving vector
     * @param {Number} scalar - the scalar value
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.fromScalar
     */
    const fromScalar$1 = (out, scalar) => {
      out[0] = scalar;
      out[1] = scalar;
      return out
    };

    var fromScalar_1$1 = fromScalar$1;

    /**
     * Creates a new vector initialized with the given values.
     *
     * @param {Number} x - X coordinate
     * @param {Number} y - Y coordinate
     * @returns {vec2} a new vector
     * @alias module:modeling/maths/vec2.fromValues
     */
    const fromValues$2 = (x, y) => {
      const out = create_1$b();
      out[0] = x;
      out[1] = y;
      return out
    };

    var fromValues_1$2 = fromValues$2;

    /**
     * Calculates the length of the given vector.
     *
     * @param {vec2} vector - vector of reference
     * @returns {Number} length
     * @alias module:modeling/maths/vec2.length
     */
    const length = (vector) => Math.hypot(vector[0], vector[1]);

    var length_1 = length;

    /**
     * Performs a linear interpolation between two vectors.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @param {Number} t - interpolation amount between the two vectors
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.lerp
     */
    const lerp = (out, a, b, t) => {
      const ax = a[0];
      const ay = a[1];
      out[0] = ax + t * (b[0] - ax);
      out[1] = ay + t * (b[1] - ay);
      return out
    };

    var lerp_1 = lerp;

    /**
     * Returns the maximum coordinates of two vectors.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.max
     */
    const max = (out, a, b) => {
      out[0] = Math.max(a[0], b[0]);
      out[1] = Math.max(a[1], b[1]);
      return out
    };

    var max_1 = max;

    /**
     * Returns the minimum coordinates of two vectors.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.min
     */
    const min = (out, a, b) => {
      out[0] = Math.min(a[0], b[0]);
      out[1] = Math.min(a[1], b[1]);
      return out
    };

    var min_1 = min;

    /**
     * Multiplies the coordinates of two vectors (A*B).
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.multiply
     */
    const multiply$1 = (out, a, b) => {
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      return out
    };

    var multiply_1$1 = multiply$1;

    /**
     * Negates the coordinates of the given vector.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - vector to negate
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.negate
     */
    const negate = (out, vector) => {
      out[0] = -vector[0];
      out[1] = -vector[1];
      return out
    };

    var negate_1 = negate;

    /**
     * Rotates the given vector by the given angle.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - vector to rotate
     * @param {vec2} origin - origin of the rotation
     * @param {Number} radians - angle of rotation (radians)
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.rotate
     */
    const rotate$4 = (out, vector, origin, radians) => {
      const x = vector[0] - origin[0];
      const y = vector[1] - origin[1];
      const c = Math.cos(radians);
      const s = Math.sin(radians);

      out[0] = x * c - y * s + origin[0];
      out[1] = x * s + y * c + origin[1];

      return out
    };

    var rotate_1$2 = rotate$4;

    /**
     * Calculates the normal of the given vector.
     * The normal value is the given vector rotated 90 degrees.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - given value
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.normal
     */
    const normal = (out, vector) => rotate_1$2(out, vector, create_1$b(), (Math.PI / 2));

    var normal_1 = normal;

    /**
     * Normalize the given vector.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - vector to normalize
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.normalize
     */
    const normalize = (out, vector) => {
      const x = vector[0];
      const y = vector[1];
      let len = x * x + y * y;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
      }
      out[0] = x * len;
      out[1] = y * len;
      return out
    };

    // old this.dividedBy(this.length())

    var normalize_1 = normalize;

    /**
     * Scales the coordinates of the given vector.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - vector to scale
     * @param {Number} amount - amount to scale
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.scale
     */
    const scale$3 = (out, vector, amount) => {
      out[0] = vector[0] * amount;
      out[1] = vector[1] * amount;
      return out
    };

    var scale_1$2 = scale$3;

    /**
     * Snaps the coordinates of the given vector to the given epsilon.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - vector to snap
     * @param {Number} epsilon - epsilon of precision, less than 0
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.snap
     */
    const snap$1 = (out, vector, epsilon) => {
      out[0] = Math.round(vector[0] / epsilon) * epsilon + 0;
      out[1] = Math.round(vector[1] / epsilon) * epsilon + 0;
      return out
    };

    var snap_1$1 = snap$1;

    /**
     * Calculates the squared distance between the given vectors.
     *
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {Number} squared distance
     * @alias module:modeling/maths/vec2.squaredDistance
     */
    const squaredDistance = (a, b) => {
      const x = b[0] - a[0];
      const y = b[1] - a[1];
      return x * x + y * y
    };

    var squaredDistance_1 = squaredDistance;

    /**
     * Calculates the squared length of the given vector.
     *
     * @param {vec2} vector - vector of reference
     * @returns {Number} squared length
     * @alias module:modeling/maths/vec2.squaredLength
     */
    const squaredLength = (vector) => {
      const x = vector[0];
      const y = vector[1];
      return x * x + y * y
    };

    var squaredLength_1 = squaredLength;

    /**
     * Subtracts the coordinates of two vectors (A-B).
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} a - first operand
     * @param {vec2} b - second operand
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.subtract
     */
    const subtract$4 = (out, a, b) => {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      return out
    };

    var subtract_1$1 = subtract$4;

    /**
     * Convert the given vector to a representative string.
     *
     * @param {vec2} vector - vector of reference
     * @returns {String} string representation
     * @alias module:modeling/maths/vec2.toString
     */
    const toString$8 = (vector) => `[${vector[0].toFixed(7)}, ${vector[1].toFixed(7)}]`;

    var toString_1$8 = toString$8;

    /**
     * Transforms the given vector using the given matrix.
     *
     * @param {vec2} out - receiving vector
     * @param {vec2} vector - vector to transform
     * @param {mat4} matrix - matrix to transform with
     * @returns {vec2} out
     * @alias module:modeling/maths/vec2.transform
     */
    const transform$a = (out, vector, matrix) => {
      const x = vector[0];
      const y = vector[1];
      out[0] = matrix[0] * x + matrix[4] * y + matrix[12];
      out[1] = matrix[1] * x + matrix[5] * y + matrix[13];
      return out
    };

    var transform_1$a = transform$a;

    /**
     * Represents a two dimensional vector.
     * @module modeling/maths/vec2
     */
    var vec2 = {
      abs: abs_1,
      add: add_1,
      angle: angle,
      angleDegrees: angleDegrees_1,
      angleRadians: angleRadians_1,
      clone: clone_1$8,
      copy: copy_1$4,
      create: create_1$b,
      cross: cross_1,
      distance: distance_1,
      divide: divide_1,
      dot: dot_1$1,
      equals: equals_1$5,
      fromAngleDegrees: fromAngleDegrees_1,
      fromAngleRadians: fromAngleRadians_1,
      fromScalar: fromScalar_1$1,
      fromValues: fromValues_1$2,
      length: length_1,
      lerp: lerp_1,
      max: max_1,
      min: min_1,
      multiply: multiply_1$1,
      negate: negate_1,
      normal: normal_1,
      normalize: normalize_1,
      rotate: rotate_1$2,
      scale: scale_1$2,
      snap: snap_1$1,
      squaredDistance: squaredDistance_1,
      squaredLength: squaredLength_1,
      subtract: subtract_1$1,
      toString: toString_1$8,
      transform: transform_1$a
    };

    /**
     * Create a new 2D geometry from the given points.
     * The direction (rotation) of the points is not relevant,
     * as the points can define a convex or a concave polygon.
     * The geometry must not self intersect, i.e. the sides cannot cross.
     * @param {Array} points - list of points in 2D space
     * @returns {geom2} a new geometry
     * @alias module:modeling/geometries/geom2.fromPoints
     */
    const fromPoints$7 = (points) => {
      if (!Array.isArray(points)) {
        throw new Error('the given points must be an array')
      }
      let length = points.length;
      if (length < 3) {
        throw new Error('the given points must define a closed geometry with three or more points')
      }
      // adjust length if the given points are closed by the same point
      if (vec2.equals(points[0], points[length - 1])) --length;

      const sides = [];
      let prevpoint = points[length - 1];
      for (let i = 0; i < length; i++) {
        const point = points[i];
        sides.push([vec2.clone(prevpoint), vec2.clone(point)]);
        prevpoint = point;
      }
      return create_1$c(sides)
    };

    var fromPoints_1$7 = fromPoints$7;

    /**
     * Create a new 2D geometry from the given compact binary data.
     * @param {Array} data - compact binary data
     * @returns {geom2} a new geometry
     * @alias module:modeling/geometries/geom2.fromCompactBinary
     */
    const fromCompactBinary$2 = (data) => {
      if (data[0] !== 0) throw new Error('invalid compact binary data')

      const created = create_1$c();

      created.transforms = mat4.clone(data.slice(1, 17));

      for (let i = 21; i < data.length; i += 4) {
        const point0 = vec2.fromValues(data[i + 0], data[i + 1]);
        const point1 = vec2.fromValues(data[i + 2], data[i + 3]);
        created.sides.push([point0, point1]);
      }
      // transfer known properties, i.e. color
      if (data[17] >= 0) {
        created.color = [data[17], data[18], data[19], data[20]];
      }
      // TODO: how about custom properties or fields ?
      return created
    };

    var fromCompactBinary_1$2 = fromCompactBinary$2;

    /**
     * Determine if the given object is a 2D geometry.
     * @param {Object} object - the object to interrogate
     * @returns {Boolean} true, if the object matches a geom2 based object
     * @alias module:modeling/geometries/geom2.isA
     */
    const isA$4 = (object) => {
      if (object && typeof object === 'object') {
        if ('sides' in object && 'transforms' in object) {
          if (Array.isArray(object.sides) && 'length' in object.transforms) {
            return true
          }
        }
      }
      return false
    };

    var isA_1$4 = isA$4;

    /*
     * Apply the transforms of the given geometry.
     * NOTE: This function must be called BEFORE exposing any data. See toSides().
     * @param {geom2} geometry - the geometry to transform
     * @returns {geom2} the given geometry
     *
     * @example
     * geometry = applyTransforms(geometry)
     */
    const applyTransforms$2 = (geometry) => {
      if (mat4.isIdentity(geometry.transforms)) return geometry

      // apply transforms to each side
      geometry.sides = geometry.sides.map((side) => {
        const p0 = vec2.transform(vec2.create(), side[0], geometry.transforms);
        const p1 = vec2.transform(vec2.create(), side[1], geometry.transforms);
        return [p0, p1]
      });
      geometry.transforms = mat4.create();
      return geometry
    };

    var applyTransforms_1$2 = applyTransforms$2;

    /**
     * Produces an array of sides from the given geometry.
     * The returned array should not be modified as the data is shared with the geometry.
     * NOTE: The sides returned do NOT define an order. Use toOutlines() for ordered points.
     * @param {geom2} geometry - the geometry
     * @returns {Array} an array of sides
     * @alias module:modeling/geometries/geom2.toSides
     *
     * @example
     * let sharedsides = toSides(geometry)
     */
    const toSides = (geometry) => applyTransforms_1$2(geometry).sides;

    var toSides_1 = toSides;

    /**
     * Reverses the given geometry so that the sides are flipped in the opposite order.
     * This swaps the left (interior) and right (exterior) edges.
     * @param {geom2} geometry - the geometry to reverse
     * @returns {geom2} the new reversed geometry
     * @alias module:modeling/geometries/geom2.reverse
     *
     * @example
     * let newgeometry = reverse(geometry)
     */
    const reverse$4 = (geometry) => {
      const oldsides = toSides_1(geometry);

      const newsides = oldsides.map((side) => [side[1], side[0]]);
      newsides.reverse(); // is this required?
      return create_1$c(newsides)
    };

    var reverse_1$4 = reverse$4;

    /*
     * Create a list of edges which SHARE vertices.
     * This allows the edges to be traversed in order.
     */
    const toEdges$1 = (sides) => {
      const vertices = {};
      const getUniqueVertex = (vertex) => {
        const key = vertex.toString();
        if (!vertices[key]) {
          vertices[key] = vertex;
        }
        return vertices[key]
      };

      return sides.map((side) => side.map(getUniqueVertex))
    };

    /**
     * Create the outline(s) of the given geometry.
     * @param  {geom2} geometry
     * @returns {Array} an array of outlines, where each outline is an array of ordered points
     * @alias module:modeling/geometries/geom2.toOutlines
     *
     * @example
     * let geometry = subtract(rectangle({size: [5, 5]}), rectangle({size: [3, 3]}))
     * let outlines = toOutlines(geometry) // returns two outlines
     */
    const toOutlines$1 = (geometry) => {
      const vertexMap = new Map();
      const edges = toEdges$1(toSides_1(geometry));
      edges.forEach((edge) => {
        if (!(vertexMap.has(edge[0]))) {
          vertexMap.set(edge[0], []);
        }
        const sideslist = vertexMap.get(edge[0]);
        sideslist.push(edge);
      });

      const outlines = [];
      while (true) {
        let startside;
        for (const [vertex, edges] of vertexMap) {
          startside = edges.shift();
          if (!startside) {
            vertexMap.delete(vertex);
            continue
          }
          break
        }
        if (startside === undefined) break // all starting sides have been visited

        const connectedVertexPoints = [];
        const startvertex = startside[0];
        const v0 = vec2.create();
        while (true) {
          connectedVertexPoints.push(startside[0]);
          const nextvertex = startside[1];
          if (nextvertex === startvertex) break // the outline has been closed
          const nextpossiblesides = vertexMap.get(nextvertex);
          if (!nextpossiblesides) {
            throw new Error('the given geometry is not closed. verify proper construction')
          }
          let nextsideindex = -1;
          if (nextpossiblesides.length === 1) {
            nextsideindex = 0;
          } else {
            // more than one side starting at the same vertex
            let bestangle;
            const startangle = vec2.angleDegrees(vec2.subtract(v0, startside[1], startside[0]));
            for (let sideindex = 0; sideindex < nextpossiblesides.length; sideindex++) {
              const nextpossibleside = nextpossiblesides[sideindex];
              const nextangle = vec2.angleDegrees(vec2.subtract(v0, nextpossibleside[1], nextpossibleside[0]));
              let angledif = nextangle - startangle;
              if (angledif < -180) angledif += 360;
              if (angledif >= 180) angledif -= 360;
              if ((nextsideindex < 0) || (angledif > bestangle)) {
                nextsideindex = sideindex;
                bestangle = angledif;
              }
            }
          }
          const nextside = nextpossiblesides[nextsideindex];
          nextpossiblesides.splice(nextsideindex, 1); // remove side from list
          if (nextpossiblesides.length === 0) {
            vertexMap.delete(nextvertex);
          }
          startside = nextside;
        } // inner loop

        // due to the logic of fromPoints()
        // move the first point to the last
        if (connectedVertexPoints.length > 0) {
          connectedVertexPoints.push(connectedVertexPoints.shift());
        }
        outlines.push(connectedVertexPoints);
      } // outer loop
      vertexMap.clear();
      return outlines
    };

    var toOutlines_1 = toOutlines$1;

    /**
     * Produces an array of points from the given geometry.
     * The returned array should not be modified as the points are shared with the geometry.
     * NOTE: The points returned do NOT define an order. Use toOutlines() for ordered points.
     * @param {geom2} geometry - the geometry
     * @returns {Array} an array of points
     * @alias module:modeling/geometries/geom2.toPoints
     *
     * @example
     * let sharedpoints = toPoints(geometry)
     */
    const toPoints$3 = (geometry) => {
      const sides = toSides_1(geometry);
      const points = sides.map((side) => side[0]);
      // due to the logic of fromPoints()
      // move the first point to the last
      if (points.length > 0) {
        points.push(points.shift());
      }
      return points
    };

    var toPoints_1$3 = toPoints$3;

    /**
     * Create a string representing the contents of the given geometry.
     * @param {geom2} geometry - the geometry
     * @returns {String} a representative string
     * @alias module:modeling/geometries/geom2.toString
     *
     * @example
     * console.out(toString(geometry))
     */
    const toString$7 = (geometry) => {
      const sides = toSides_1(geometry);
      let result = 'geom2 (' + sides.length + ' sides):\n[\n';
      sides.forEach((side) => {
        result += '  [' + vec2.toString(side[0]) + ', ' + vec2.toString(side[1]) + ']\n';
      });
      result += ']\n';
      return result
    };

    var toString_1$7 = toString$7;

    /**
     * Produces a compact binary representation from the given geometry.
     * @param {geom2} geometry - the geometry
     * @returns {TypedArray} compact binary representation
     * @alias module:modeling/geometries/geom2.toCompactBinary
     */
    const toCompactBinary$2 = (geometry) => {
      const sides = geometry.sides;
      const transforms = geometry.transforms;
      let color = [-1, -1, -1, -1];
      if (geometry.color) color = geometry.color;

      // FIXME why Float32Array?
      const compacted = new Float32Array(1 + 16 + 4 + (sides.length * 4)); // type + transforms + color + sides data

      compacted[0] = 0; // type code: 0 => geom2, 1 => geom3 , 2 => path2

      compacted[1] = transforms[0];
      compacted[2] = transforms[1];
      compacted[3] = transforms[2];
      compacted[4] = transforms[3];
      compacted[5] = transforms[4];
      compacted[6] = transforms[5];
      compacted[7] = transforms[6];
      compacted[8] = transforms[7];
      compacted[9] = transforms[8];
      compacted[10] = transforms[9];
      compacted[11] = transforms[10];
      compacted[12] = transforms[11];
      compacted[13] = transforms[12];
      compacted[14] = transforms[13];
      compacted[15] = transforms[14];
      compacted[16] = transforms[15];

      compacted[17] = color[0];
      compacted[18] = color[1];
      compacted[19] = color[2];
      compacted[20] = color[3];

      for (let i = 0; i < sides.length; i++) {
        const ci = i * 4 + 21;
        const point0 = sides[i][0];
        const point1 = sides[i][1];
        compacted[ci + 0] = point0[0];
        compacted[ci + 1] = point0[1];
        compacted[ci + 2] = point1[0];
        compacted[ci + 3] = point1[1];
      }
      // TODO: how about custom properties or fields ?
      return compacted
    };

    var toCompactBinary_1$2 = toCompactBinary$2;

    /**
     * Transform the given geometry using the given matrix.
     * This is a lazy transform of the sides, as this function only adjusts the transforms.
     * The transforms are applied when accessing the sides via toSides().
     * @param {mat4} matrix - the matrix to transform with
     * @param {geom2} geometry - the geometry to transform
     * @returns {geom2} a new geometry
     * @alias module:modeling/geometries/geom2.transform
     *
     * @example
     * let newgeometry = transform(fromZRotation(degToRad(90)), geometry)
     */
    const transform$9 = (matrix, geometry) => {
      const transforms = mat4.multiply(mat4.create(), matrix, geometry.transforms);
      return Object.assign({}, geometry, { transforms })
    };

    var transform_1$9 = transform$9;

    /**
     * Determine if the given object is a valid geom2.
     * Checks for closedness, self-edges, and valid data points.
     *
     * **If the geometry is not valid, an exception will be thrown with details of the geometry error.**
     *
     * @param {Object} object - the object to interrogate
     * @throws {Error} error if the geometry is not valid
     * @alias module:modeling/geometries/geom2.validate
     */
    const validate$3 = (object) => {
      if (!isA_1$4(object)) {
        throw new Error('invalid geom2 structure')
      }

      // check for closedness
      toOutlines_1(object);

      // check for self-edges
      object.sides.forEach((side) => {
        if (vec2.equals(side[0], side[1])) {
          throw new Error(`geom2 self-edge ${side[0]}`)
        }
      });

      // check transforms
      if (!object.transforms.every(Number.isFinite)) {
        throw new Error(`geom2 invalid transforms ${object.transforms}`)
      }
    };

    var validate_1$3 = validate$3;

    /**
     * Represents a 2D geometry consisting of a list of sides.
     * @see {@link geom2} for data structure information.
     * @module modeling/geometries/geom2
     *
     * @example
     * colorize([0.5,0,1,1], square()) // purple square
     *
     * @example
     * {
     *   "sides": [[[-1,1],[-1,-1]],[[-1,-1],[1,-1]],[[1,-1],[1,1]],[[1,1],[-1,1]]],
     *   "transforms": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
     *   "color": [0.5,0,1,1]
     * }
     */
    var geom2$2 = {
      clone: clone_1$b,
      create: create_1$c,
      fromPoints: fromPoints_1$7,
      fromCompactBinary: fromCompactBinary_1$2,
      isA: isA_1$4,
      reverse: reverse_1$4,
      toOutlines: toOutlines_1,
      toPoints: toPoints_1$3,
      toSides: toSides_1,
      toString: toString_1$7,
      toCompactBinary: toCompactBinary_1$2,
      transform: transform_1$9,
      validate: validate_1$3
    };

    /**
     * Performs a shallow clone of the given geometry.
     * @param {geom3} geometry - the geometry to clone
     * @returns {geom3} a new geometry
     * @alias module:modeling/geometries/geom3.clone
     */
    const clone$8 = (geometry) => Object.assign({}, geometry);

    var clone_1$7 = clone$8;

    /**
     * Represents a 3D geometry consisting of a list of polygons.
     * @typedef {Object} geom3
     * @property {Array} polygons - list of polygons, each polygon containing three or more points
     * @property {mat4} transforms - transforms to apply to the polygons, see transform()
     */

    /**
     * Create a new 3D geometry composed of the given polygons.
     * @param {Array} [polygons] - list of polygons, or undefined
     * @returns {geom3} a new geometry
     * @alias module:modeling/geometries/geom3.create
     */
    const create$a = (polygons) => {
      if (polygons === undefined) {
        polygons = []; // empty contents
      }
      return {
        polygons: polygons,
        transforms: mat4.create()
      }
    };

    var create_1$a = create$a;

    /**
     * Represents a convex 3D polygon. The vertices used to initialize a polygon must
     * be coplanar and form a convex shape. The vertices do not have to be `vec3`
     * instances but they must behave similarly.
     * @typedef {Object} poly3
     * @property {Array} vertices - list of ordered vertices (3D)
     */

    /**
     * Creates a new 3D polygon with initial values.
     *
     * @param {Array} [vertices] - a list of vertices (3D)
     * @returns {poly3} a new polygon
     * @alias module:modeling/geometries/poly3.create
     */
    const create$9 = (vertices) => {
      if (vertices === undefined || vertices.length < 3) {
        vertices = []; // empty contents
      }
      return { vertices: vertices }
    };

    var create_1$9 = create$9;

    /**
     * Create a deep clone of the given polygon
     *
     * @param {poly3} [out] - receiving polygon
     * @param {poly3} polygon - polygon to clone
     * @returns {poly3} a new polygon
     * @alias module:modeling/geometries/poly3.clone
     */
    const clone$7 = (...params) => {
      let out;
      let poly3;
      if (params.length === 1) {
        out = create_1$9();
        poly3 = params[0];
      } else {
        out = params[0];
        poly3 = params[1];
      }
      // deep clone of vertices
      out.vertices = poly3.vertices.map((vec) => vec3$1.clone(vec));
      return out
    };

    var clone_1$6 = clone$7;

    /**
     * Create a polygon from the given points.
     *
     * @param {Array} points - list of points (3D)
     * @returns {poly3} a new polygon
     * @alias module:modeling/geometries/poly3.fromPoints
     *
     * @example
     * const points = [
     *   [0,  0, 0],
     *   [0, 10, 0],
     *   [0, 10, 10]
     * ]
     * const polygon = fromPoints(points)
     */
    const fromPoints$6 = (points) => {
      const vertices = points.map((point) => vec3$1.clone(point));
      return create_1$9(vertices)
    };

    var fromPoints_1$6 = fromPoints$6;

    /**
     * Create a polygon from the given vertices and plane.
     * NOTE: No checks are performed on the parameters.
     * @param {Array} vertices - list of vertices (3D)
     * @param {plane} plane - plane of the polygon
     * @returns {poly3} a new polygon
     * @alias module:modeling/geometries/poly3.fromPointsAndPlane
     */
    const fromPointsAndPlane = (vertices, plane) => {
      const poly = create_1$9(vertices);
      poly.plane = plane; // retain the plane for later use
      return poly
    };

    var fromPointsAndPlane_1 = fromPointsAndPlane;

    /**
     * Represents a four dimensional vector.
     * See fromValues().
     * @typedef {Array} vec4
     */

    /**
     * Creates a new vector initialized to [0,0,0,0].
     *
     * @returns {vec4} a new vector
     * @alias module:modeling/maths/vec4.create
     */
    const create$8 = () => [0, 0, 0, 0];

    var create_1$8 = create$8;

    /**
     * Create a clone of the given vector.
     *
     * @param {vec4} vector - source vector
     * @returns {vec4} a new vector
     * @alias module:modeling/maths/vec4.clone
     */
    const clone$6 = (vector) => {
      const out = create_1$8();
      out[0] = vector[0];
      out[1] = vector[1];
      out[2] = vector[2];
      out[3] = vector[3];
      return out
    };

    var clone_1$5 = clone$6;

    /**
     * Create a copy of the given vector.
     *
     * @param {vec4} out - receiving vector
     * @param {vec4} vector - source vector
     * @returns {vec4} out
     * @alias module:modeling/maths/vec4.copy
     */
    const copy$3 = (out, vector) => {
      out[0] = vector[0];
      out[1] = vector[1];
      out[2] = vector[2];
      out[3] = vector[3];
      return out
    };

    var copy_1$3 = copy$3;

    /**
     * Compare the given vectors for equality.
     *
     * @param {vec4} a - first vector
     * @param {vec4} b - second vector
     * @return {Boolean} true if vectors are equal
     * @alias module:modeling/maths/vec4.equals
     */
    const equals$6 = (a, b) => ((a[0] === b[0]) && (a[1] === b[1]) && (a[2] === b[2]) && (a[3] === b[3]));

    var equals_1$4 = equals$6;

    /**
     * Flip the given plane.
     *
     * @param {plane} out - receiving plane
     * @param {plane} plane - plane to flip
     * @return {plane} out
     * @alias module:modeling/maths/plane.flip
     */
    const flip$1 = (out, plane) => {
      out[0] = -plane[0];
      out[1] = -plane[1];
      out[2] = -plane[2];
      out[3] = -plane[3];
      return out
    };

    var flip_1$1 = flip$1;

    /**
     * Represents a plane in 3D coordinate space as determined by a normal (perpendicular to the plane)
     * and distance from 0,0,0.
     *
     * The contents of the array are a normal [0,1,2] and a distance [3].
     * @see https://en.wikipedia.org/wiki/Hesse_normal_form
     * @typedef {Array} plane
     */

    /**
     * Create a new plane from the given normal and point values.
     *
     * @param {plane} out - receiving plane
     * @param {vec3} normal - directional vector
     * @param {vec3} point - origin of plane
     * @returns {plane} out
     * @alias module:modeling/maths/plane.fromNormalAndPoint
     */
    const fromNormalAndPoint = (out, normal, point) => {
      const u = vec3$1.normalize(vec3$1.create(), normal);
      const w = vec3$1.dot(point, u);

      out[0] = u[0];
      out[1] = u[1];
      out[2] = u[2];
      out[3] = w;
      return out
    };

    var fromNormalAndPoint_1 = fromNormalAndPoint;

    /**
     * Creates a new vector with the given values.
     *
     * @param {Number} x - X component
     * @param {Number} y - Y component
     * @param {Number} z - Z component
     * @param {Number} w - W component
     * @returns {vec4} a new vector
     * @alias module:modeling/maths/vec4.fromValues
     */
    const fromValues$1 = (x, y, z, w) => {
      const out = create_1$8();
      out[0] = x;
      out[1] = y;
      out[2] = z;
      out[3] = w;
      return out
    };

    var fromValues_1$1 = fromValues$1;

    /**
     * Create a plane from the given points.
     *
     * @param {plane} out - receiving plane
     * @param {Array} vertices - points on the plane
     * @returns {plane} out
     * @alias module:modeling/maths/plane.fromPoints
     */
    const fromPoints$5 = (out, ...vertices) => {
      const len = vertices.length;

      // Calculate normal vector for a single vertex
      // Inline to avoid allocations
      const ba = vec3$1.create();
      const ca = vec3$1.create();
      const vertexNormal = (index) => {
        const a = vertices[index];
        const b = vertices[(index + 1) % len];
        const c = vertices[(index + 2) % len];
        vec3$1.subtract(ba, b, a); // ba = b - a
        vec3$1.subtract(ca, c, a); // ca = c - a
        vec3$1.cross(ba, ba, ca); // ba = ba x ca
        vec3$1.normalize(ba, ba);
        return ba
      };

      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      if (len === 3) {
        // optimization for triangles, which are always coplanar
        vec3$1.copy(out, vertexNormal(0));
      } else {
        // sum of vertex normals
        vertices.forEach((v, i) => {
          vec3$1.add(out, out, vertexNormal(i));
        });
        // renormalize normal vector
        vec3$1.normalize(out, out);
      }
      out[3] = vec3$1.dot(out, vertices[0]);
      return out
    };

    var fromPoints_1$5 = fromPoints$5;

    /**
     * The resolution of space, currently one hundred nanometers.
     * This should be 1 / EPS.
     * @alias module:modeling/maths.spatialResolution
     * @default
     */
    const spatialResolution = 1e5;

    /**
     * Epsilon used during determination of near zero distances.
     * This should be 1 / spacialResolution.
     * @default
     * @alias module:modeling/maths.EPS
     */
    const EPS$i = 1e-5;

    var constants = {
      EPS: EPS$i,
      spatialResolution
    };

    const { EPS: EPS$h } = constants;



    /**
     * Create a new plane from the given points like fromPoints,
     * but allow the vectors to be on one point or one line.
     * In such a case, a random plane through the given points is constructed.
     *
     * @param {plane} out - receiving plane
     * @param {vec3} a - 3D point
     * @param {vec3} b - 3D point
     * @param {vec3} c - 3D point
     * @returns {plane} out
     * @alias module:modeling/maths/plane.fromPointsRandom
     */
    const fromPointsRandom = (out, a, b, c) => {
      let ba = vec3$1.subtract(vec3$1.create(), b, a);
      let ca = vec3$1.subtract(vec3$1.create(), c, a);
      if (vec3$1.length(ba) < EPS$h) {
        ba = vec3$1.orthogonal(ba, ca);
      }
      if (vec3$1.length(ca) < EPS$h) {
        ca = vec3$1.orthogonal(ca, ba);
      }
      let normal = vec3$1.cross(vec3$1.create(), ba, ca);
      if (vec3$1.length(normal) < EPS$h) {
        // this would mean that ba == ca.negated()
        ca = vec3$1.orthogonal(ca, ba);
        normal = vec3$1.cross(normal, ba, ca);
      }
      normal = vec3$1.normalize(normal, normal);
      const w = vec3$1.dot(normal, a);

      out[0] = normal[0];
      out[1] = normal[1];
      out[2] = normal[2];
      out[3] = w;
      return out
    };

    var fromPointsRandom_1 = fromPointsRandom;

    /**
     * Project the given point on to the given plane.
     *
     * @param {plane} plane - plane of reference
     * @param {vec3} point - point of reference
     * @return {vec3} projected point on plane
     * @alias module:modeling/maths/plane.projectionOfPoint
     */
    const projectionOfPoint = (plane, point) => {
      const a = point[0] * plane[0] + point[1] * plane[1] + point[2] * plane[2] - plane[3];
      const x = point[0] - a * plane[0];
      const y = point[1] - a * plane[1];
      const z = point[2] - a * plane[2];
      return vec3$1.fromValues(x, y, z)
    };

    var projectionOfPoint_1 = projectionOfPoint;

    /**
     * Calculate the distance to the given point.
     *
     * @param {plane} plane - plane of reference
     * @param {vec3} point - point of reference
     * @return {Number} signed distance to point
     * @alias module:modeling/maths/plane.signedDistanceToPoint
     */
    const signedDistanceToPoint = (plane, point) => vec3$1.dot(plane, point) - plane[3];

    var signedDistanceToPoint_1 = signedDistanceToPoint;

    /**
     * Convert the given vector to a representative string.
     *
     * @param {vec4} vec - vector to convert
     * @returns {String} representative string
     * @alias module:modeling/maths/vec4.toString
     */
    const toString$6 = (vec) => `(${vec[0].toFixed(9)}, ${vec[1].toFixed(9)}, ${vec[2].toFixed(9)}, ${vec[3].toFixed(9)})`;

    var toString_1$6 = toString$6;

    /**
     * Transform the given plane using the given matrix
     *
     * @param {plane} out - receiving plane
     * @param {plane} plane - plane to transform
     * @param {mat4} matrix - matrix to transform with
     * @return {plane} out
     * @alias module:modeling/maths/plane.transform
     */
    const transform$8 = (out, plane, matrix) => {
      const ismirror = mat4.isMirroring(matrix);
      // get two vectors in the plane:
      const r = vec3$1.orthogonal(vec3$1.create(), plane);
      const u = vec3$1.cross(r, plane, r);
      const v = vec3$1.cross(vec3$1.create(), plane, u);
      // get 3 points in the plane:
      let point1 = vec3$1.fromScalar(vec3$1.create(), plane[3]);
      vec3$1.multiply(point1, point1, plane);
      let point2 = vec3$1.add(vec3$1.create(), point1, u);
      let point3 = vec3$1.add(vec3$1.create(), point1, v);
      // transform the points:
      point1 = vec3$1.transform(point1, point1, matrix);
      point2 = vec3$1.transform(point2, point2, matrix);
      point3 = vec3$1.transform(point3, point3, matrix);
      // and create a new plane from the transformed points:
      fromPoints_1$5(out, point1, point2, point3);
      if (ismirror) {
        // the transform is mirroring so flip the plane
        flip_1$1(out, out);
      }
      return out
    };

    var transform_1$8 = transform$8;

    /**
     * Represents a plane in 3D coordinate space as determined by a normal (perpendicular to the plane)
     * and distance from 0,0,0.
     * @see {@link plane} for data structure information.
     * @module modeling/maths/plane
     */
    var plane$1 = {
      /**
       * @see [vec4.clone()]{@link module:modeling/maths/vec4.clone}
       * @function clone
       */
      clone: clone_1$5,
      /**
       * @see [vec4.copy()]{@link module:modeling/maths/vec4.copy}
       * @function copy
       */
      copy: copy_1$3,
      /**
       * @see [vec4.create()]{@link module:modeling/maths/vec4.create}
       * @function create
       */
      create: create_1$8,
      /**
       * @see [vec4.equals()]{@link module:modeling/maths/vec4.equals}
       * @function equals
       */
      equals: equals_1$4,
      flip: flip_1$1,
      fromNormalAndPoint: fromNormalAndPoint_1,
      /**
       * @see [vec4.fromValues()]{@link module:modeling/maths/vec4.fromValues}
       * @function fromValues
       */
      fromValues: fromValues_1$1,
      fromPoints: fromPoints_1$5,
      fromPointsRandom: fromPointsRandom_1,
      projectionOfPoint: projectionOfPoint_1,
      signedDistanceToPoint: signedDistanceToPoint_1,
      /**
       * @see [vec4.toString()]{@link module:modeling/maths/vec4.toString}
       * @function toString
       */
      toString: toString_1$6,
      transform: transform_1$8
    };

    /**
     * Invert the give polygon to face the opposite direction.
     *
     * @param {poly3} polygon - the polygon to invert
     * @returns {poly3} a new poly3
     * @alias module:modeling/geometries/poly3.invert
     */
    const invert$2 = (polygon) => {
      const vertices = polygon.vertices.slice().reverse();
      const inverted = create_1$9(vertices);
      if (polygon.plane) {
        // Flip existing plane to save recompute
        inverted.plane = plane$1.flip(plane$1.create(), polygon.plane);
      }
      return inverted
    };

    var invert_1$2 = invert$2;

    /**
     * Determine if the given object is a polygon.
     * @param {Object} object - the object to interrogate
     * @returns {Boolean} true if the object matches a poly3
     * @alias module:modeling/geometries/poly3.isA
     */
    const isA$3 = (object) => {
      if (object && typeof object === 'object') {
        if ('vertices' in object) {
          if (Array.isArray(object.vertices)) {
            return true
          }
        }
      }
      return false
    };

    var isA_1$3 = isA$3;

    /**
     * Check whether the given polygon is convex.
     * @param {poly3} polygon - the polygon to interrogate
     * @returns {Boolean} true if convex
     * @alias module:modeling/geometries/poly3.isConvex
     */
    const isConvex = (polygon) => areVerticesConvex(polygon.vertices);

    const areVerticesConvex = (vertices) => {
      const numvertices = vertices.length;
      if (numvertices > 2) {
        // note: plane ~= normal point
        const normal = plane$1.fromPoints(plane$1.create(), ...vertices);
        let prevprevpos = vertices[numvertices - 2];
        let prevpos = vertices[numvertices - 1];
        for (let i = 0; i < numvertices; i++) {
          const pos = vertices[i];
          if (!isConvexPoint(prevprevpos, prevpos, pos, normal)) {
            return false
          }
          prevprevpos = prevpos;
          prevpos = pos;
        }
      }
      return true
    };

    // calculate whether three points form a convex corner
    //  prevpoint, point, nextpoint: the 3 coordinates (Vector3D instances)
    //  normal: the normal vector of the plane
    const isConvexPoint = (prevpoint, point, nextpoint, normal) => {
      const crossproduct = vec3$1.cross(
        vec3$1.create(),
        vec3$1.subtract(vec3$1.create(), point, prevpoint),
        vec3$1.subtract(vec3$1.create(), nextpoint, point)
      );
      const crossdotnormal = vec3$1.dot(crossproduct, normal);
      return crossdotnormal >= 0
    };

    var isConvex_1 = isConvex;

    const plane = (polygon) => {
      if (!polygon.plane) {
        polygon.plane = plane$1.fromPoints(plane$1.create(), ...polygon.vertices);
      }
      return polygon.plane
    };

    var plane_1 = plane;

    /**
     * Measure the area of the given polygon.
     * @see 2000 softSurfer http://geomalgorithms.com
     * @param {poly3} polygon - the polygon to measure
     * @return {Number} area of the polygon
     * @alias module:modeling/geometries/poly3.measureArea
     */
    const measureArea$2 = (polygon) => {
      const n = polygon.vertices.length;
      if (n < 3) {
        return 0 // degenerate polygon
      }
      const vertices = polygon.vertices;

      // calculate a normal vector
      const normal = plane_1(polygon);

      // determine direction of projection
      const ax = Math.abs(normal[0]);
      const ay = Math.abs(normal[1]);
      const az = Math.abs(normal[2]);

      if (ax + ay + az === 0) {
        // normal does not exist
        return 0
      }

      let coord = 3; // ignore Z coordinates
      if ((ax > ay) && (ax > az)) {
        coord = 1; // ignore X coordinates
      } else
      if (ay > az) {
        coord = 2; // ignore Y coordinates
      }

      let area = 0;
      let h = 0;
      let i = 1;
      let j = 2;
      switch (coord) {
        case 1: // ignore X coordinates
          // compute area of 2D projection
          for (i = 1; i < n; i++) {
            h = i - 1;
            j = (i + 1) % n;
            area += (vertices[i][1] * (vertices[j][2] - vertices[h][2]));
          }
          area += (vertices[0][1] * (vertices[1][2] - vertices[n - 1][2]));
          // scale to get area
          area /= (2 * normal[0]);
          break

        case 2: // ignore Y coordinates
          // compute area of 2D projection
          for (i = 1; i < n; i++) {
            h = i - 1;
            j = (i + 1) % n;
            area += (vertices[i][2] * (vertices[j][0] - vertices[h][0]));
          }
          area += (vertices[0][2] * (vertices[1][0] - vertices[n - 1][0]));
          // scale to get area
          area /= (2 * normal[1]);
          break

        case 3: // ignore Z coordinates
        default:
          // compute area of 2D projection
          for (i = 1; i < n; i++) {
            h = i - 1;
            j = (i + 1) % n;
            area += (vertices[i][0] * (vertices[j][1] - vertices[h][1]));
          }
          area += (vertices[0][0] * (vertices[1][1] - vertices[n - 1][1]));
          // scale to get area
          area /= (2 * normal[2]);
          break
      }
      return area
    };

    var measureArea_1$2 = measureArea$2;

    /**
     * @param {poly3} polygon - the polygon to measure
     * @returns {Array} an array of two vectors (3D);  minimum and maximum coordinates
     * @alias module:modeling/geometries/poly3.measureBoundingBox
     */
    const measureBoundingBox$1 = (polygon) => {
      const vertices = polygon.vertices;
      const numvertices = vertices.length;
      const min = numvertices === 0 ? vec3$1.create() : vec3$1.clone(vertices[0]);
      const max = vec3$1.clone(min);
      for (let i = 1; i < numvertices; i++) {
        vec3$1.min(min, min, vertices[i]);
        vec3$1.max(max, max, vertices[i]);
      }
      return [min, max]
    };

    var measureBoundingBox_1$1 = measureBoundingBox$1;

    /**
     * Measure the bounding sphere of the given polygon.
     * @param {poly3} polygon - the polygon to measure
     * @returns {Array} the computed bounding sphere; center point (3D) and radius
     * @alias module:modeling/geometries/poly3.measureBoundingSphere
     */
    const measureBoundingSphere$1 = (polygon) => {
      const box = measureBoundingBox_1$1(polygon);
      const center = box[0];
      vec3$1.add(center, box[0], box[1]);
      vec3$1.scale(center, center, 0.5);
      const radius = vec3$1.distance(center, box[1]);
      return [center, radius]
    };

    var measureBoundingSphere_1$1 = measureBoundingSphere$1;

    /**
     * Measure the signed volume of the given polygon, which must be convex.
     * The volume is that formed by the tetrahedron connected to the axis [0,0,0],
     * and will be positive or negative based on the rotation of the vertices.
     * @see http://chenlab.ece.cornell.edu/Publication/Cha/icip01_Cha.pdf
     * @param {poly3} polygon - the polygon to measure
     * @return {Number} volume of the polygon
     * @alias module:modeling/geometries/poly3.measureSignedVolume
     */
    const measureSignedVolume = (polygon) => {
      let signedVolume = 0;
      const vertices = polygon.vertices;
      // calculate based on triangular polygons
      const cross = vec3$1.create();
      for (let i = 0; i < vertices.length - 2; i++) {
        vec3$1.cross(cross, vertices[i + 1], vertices[i + 2]);
        signedVolume += vec3$1.dot(vertices[0], cross);
      }
      signedVolume /= 6;
      return signedVolume
    };

    var measureSignedVolume_1 = measureSignedVolume;

    /**
     * Return the given polygon as a list of points.
     * NOTE: The returned array should not be modified as the points are shared with the geometry.
     * @param {poly3} polygon - the polygon
     * @return {Array} list of points (3D)
     * @alias module:modeling/geometries/poly3.toPoints
     */
    const toPoints$2 = (polygon) => polygon.vertices;

    var toPoints_1$2 = toPoints$2;

    /**
     * @param {poly3} polygon - the polygon to measure
     * @return {String} the string representation
     * @alias module:modeling/geometries/poly3.toString
     */
    const toString$5 = (polygon) => {
      let result = 'poly3: vertices: [';
      polygon.vertices.forEach((vertex) => {
        result += `${vec3$1.toString(vertex)}, `;
      });
      result += ']';
      return result
    };

    var toString_1$5 = toString$5;

    /**
     * Transform the given polygon using the given matrix.
     * @param {mat4} matrix - the matrix to transform with
     * @param {poly3} polygon - the polygon to transform
     * @returns {poly3} a new polygon
     * @alias module:modeling/geometries/poly3.transform
     */
    const transform$7 = (matrix, polygon) => {
      const vertices = polygon.vertices.map((vertex) => vec3$1.transform(vec3$1.create(), vertex, matrix));
      if (mat4.isMirroring(matrix)) {
        // reverse the order to preserve the orientation
        vertices.reverse();
      }
      return create_1$9(vertices)
    };

    var transform_1$7 = transform$7;

    /**
     * Determine if the given object is a valid polygon.
     * Checks for valid data structure, convex polygons, and duplicate points.
     *
     * **If the geometry is not valid, an exception will be thrown with details of the geometry error.**
     *
     * @param {Object} object - the object to interrogate
     * @throws {Error} error if the geometry is not valid
     * @alias module:modeling/geometries/poly3.validate
     */
    const validate$2 = (object) => {
      if (!isA_1$3(object)) {
        throw new Error('invalid poly3 structure')
      }

      // check for empty polygon
      if (object.vertices.length < 3) {
        throw new Error(`poly3 not enough vertices ${object.vertices.length}`)
      }
      // check area
      if (measureArea_1$2(object) <= 0) {
        throw new Error('poly3 area must be greater than zero')
      }

      // check for duplicate points
      for (let i = 0; i < object.vertices.length; i++) {
        if (vec3$1.equals(object.vertices[i], object.vertices[(i + 1) % object.vertices.length])) {
          throw new Error(`poly3 duplicate vertex ${object.vertices[i]}`)
        }
      }

      // check convexity
      if (!isConvex_1(object)) {
        throw new Error('poly3 must be convex')
      }

      // check for infinity, nan
      object.vertices.forEach((vertex) => {
        if (!vertex.every(Number.isFinite)) {
          throw new Error(`poly3 invalid vertex ${vertex}`)
        }
      });
    };

    var validate_1$2 = validate$2;

    /**
     * Represents a convex 3D polygon consisting of a list of ordered vertices.
     * @see {@link poly3} for data structure information.
     * @module modeling/geometries/poly3
     *
     * @example
     * poly3.create([[0,0,0], [4,0,0], [4,3,12]])
     *
     * @example
     * {"vertices": [[0,0,0], [4,0,0], [4,3,12]]}
     */
    var poly3 = {
      clone: clone_1$6,
      create: create_1$9,
      fromPoints: fromPoints_1$6,
      fromPointsAndPlane: fromPointsAndPlane_1,
      invert: invert_1$2,
      isA: isA_1$3,
      isConvex: isConvex_1,
      measureArea: measureArea_1$2,
      measureBoundingBox: measureBoundingBox_1$1,
      measureBoundingSphere: measureBoundingSphere_1$1,
      measureSignedVolume: measureSignedVolume_1,
      plane: plane_1,
      toPoints: toPoints_1$2,
      toString: toString_1$5,
      transform: transform_1$7,
      validate: validate_1$2
    };

    /**
     * Construct a new 3D geometry from a list of points.
     * The list of points should contain sub-arrays, each defining a single polygon of points.
     * In addition, the points should follow the right-hand rule for rotation in order to
     * define an external facing polygon.
     * @param {Array} listofpoints - list of lists, where each list is a set of points to construct a polygon
     * @returns {geom3} a new geometry
     * @alias module:modeling/geometries/geom3.fromPoints
     */
    const fromPoints$4 = (listofpoints) => {
      if (!Array.isArray(listofpoints)) {
        throw new Error('the given points must be an array')
      }

      const polygons = listofpoints.map((points, index) => {
        // TODO catch the error, and rethrow with index
        const polygon = poly3.fromPoints(points);
        return polygon
      });
      const result = create_1$a(polygons);
      return result
    };

    var fromPoints_1$4 = fromPoints$4;

    /**
     * Construct a new 3D geometry from the given compact binary data.
     * @param {TypedArray} data - compact binary data
     * @returns {geom3} a new geometry
     * @alias module:modeling/geometries/geom3.fromCompactBinary
     */
    const fromCompactBinary$1 = (data) => {
      if (data[0] !== 1) throw new Error('invalid compact binary data')

      const created = create_1$a();

      created.transforms = mat4.clone(data.slice(1, 17));

      const numberOfVertices = data[21];
      let ci = 22;
      let vi = data.length - (numberOfVertices * 3);
      while (vi < data.length) {
        const verticesPerPolygon = data[ci];
        ci++;

        const vertices = [];
        for (let i = 0; i < verticesPerPolygon; i++) {
          vertices.push(vec3$1.fromValues(data[vi], data[vi + 1], data[vi + 2]));
          vi += 3;
        }
        created.polygons.push(poly3.create(vertices));
      }

      // transfer known properties, i.e. color
      if (data[17] >= 0) {
        created.color = [data[17], data[18], data[19], data[20]];
      }
      // TODO: how about custom properties or fields ?
      return created
    };

    var fromCompactBinary_1$1 = fromCompactBinary$1;

    /*
     * Apply the transforms of the given geometry.
     * NOTE: This function must be called BEFORE exposing any data. See toPolygons.
     * @param {geom3} geometry - the geometry to transform
     * @returns {geom3} the given geometry
     * @example
     * geometry = applyTransforms(geometry)
     */
    const applyTransforms$1 = (geometry) => {
      if (mat4.isIdentity(geometry.transforms)) return geometry

      // apply transforms to each polygon
      // const isMirror = mat4.isMirroring(geometry.transforms)
      // TBD if (isMirror) newvertices.reverse()
      geometry.polygons = geometry.polygons.map((polygon) => poly3.transform(geometry.transforms, polygon));
      geometry.transforms = mat4.create();
      return geometry
    };

    var applyTransforms_1$1 = applyTransforms$1;

    /**
     * Produces an array of polygons from the given geometry, after applying transforms.
     * The returned array should not be modified as the polygons are shared with the geometry.
     * @param {geom3} geometry - the geometry
     * @returns {Array} an array of polygons
     * @alias module:modeling/geometries/geom3.toPolygons
     *
     * @example
     * let sharedpolygons = toPolygons(geometry)
     */
    const toPolygons$1 = (geometry) => applyTransforms_1$1(geometry).polygons;

    var toPolygons_1$1 = toPolygons$1;

    /**
     * Invert the given geometry, transposing solid and empty space.
     * @param {geom3} geometry - the geometry to invert
     * @return {geom3} a new geometry
     * @alias module:modeling/geometries/geom3.invert
     */
    const invert$1 = (geometry) => {
      const polygons = toPolygons_1$1(geometry);
      const newpolygons = polygons.map((polygon) => poly3.invert(polygon));
      return create_1$a(newpolygons)
    };

    var invert_1$1 = invert$1;

    /**
     * Determine if the given object is a 3D geometry.
     * @param {Object} object - the object to interrogate
     * @returns {Boolean} true if the object matches a geom3
     * @alias module:modeling/geometries/geom3.isA
     */
    const isA$2 = (object) => {
      if (object && typeof object === 'object') {
        if ('polygons' in object && 'transforms' in object) {
          if (Array.isArray(object.polygons) && 'length' in object.transforms) {
            return true
          }
        }
      }
      return false
    };

    var isA_1$2 = isA$2;

    /**
     * Return the given geometry as a list of points, after applying transforms.
     * The returned array should not be modified as the points are shared with the geometry.
     * @param {geom3} geometry - the geometry
     * @return {Array} list of points, where each sub-array represents a polygon
     * @alias module:modeling/geometries/geom3.toPoints
     */
    const toPoints$1 = (geometry) => {
      const polygons = toPolygons_1$1(geometry);
      const listofpoints = polygons.map((polygon) => poly3.toPoints(polygon));
      return listofpoints
    };

    var toPoints_1$1 = toPoints$1;

    /**
     * Create a string representing the contents of the given geometry.
     * @param {geom3} geometry - the geometry
     * @returns {String} a representative string
     * @alias module:modeling/geometries/geom3.toString
     *
     * @example
     * console.out(toString(geometry))
     */
    const toString$4 = (geometry) => {
      const polygons = toPolygons_1$1(geometry);
      let result = 'geom3 (' + polygons.length + ' polygons):\n';
      polygons.forEach((polygon) => {
        result += '  ' + poly3.toString(polygon) + '\n';
      });
      return result
    };

    var toString_1$4 = toString$4;

    /**
     * Return the given geometry in compact binary representation.
     * @param {geom3} geometry - the geometry
     * @return {TypedArray} compact binary representation
     * @alias module:modeling/geometries/geom3.toCompactBinary
     */
    const toCompactBinary$1 = (geometry) => {
      const polygons = geometry.polygons;
      const transforms = geometry.transforms;

      const numberOfPolygons = polygons.length;
      const numberOfVertices = polygons.reduce((count, polygon) => count + polygon.vertices.length, 0);
      let color = [-1, -1, -1, -1];
      if (geometry.color) color = geometry.color;

      // FIXME why Float32Array?
      const compacted = new Float32Array(1 + 16 + 4 + 1 + numberOfPolygons + (numberOfVertices * 3));
      // type + transforms + color + numberOfPolygons + numberOfVerticesPerPolygon[] + vertices data[]

      compacted[0] = 1; // type code: 0 => geom2, 1 => geom3 , 2 => path2

      compacted[1] = transforms[0];
      compacted[2] = transforms[1];
      compacted[3] = transforms[2];
      compacted[4] = transforms[3];
      compacted[5] = transforms[4];
      compacted[6] = transforms[5];
      compacted[7] = transforms[6];
      compacted[8] = transforms[7];
      compacted[9] = transforms[8];
      compacted[10] = transforms[9];
      compacted[11] = transforms[10];
      compacted[12] = transforms[11];
      compacted[13] = transforms[12];
      compacted[14] = transforms[13];
      compacted[15] = transforms[14];
      compacted[16] = transforms[15];

      compacted[17] = color[0];
      compacted[18] = color[1];
      compacted[19] = color[2];
      compacted[20] = color[3];

      compacted[21] = numberOfVertices;

      let ci = 22;
      let vi = ci + numberOfPolygons;
      polygons.forEach((polygon) => {
        const points = poly3.toPoints(polygon);
        // record the number of vertices per polygon
        compacted[ci] = points.length;
        ci++;
        // convert the vertices
        for (let i = 0; i < points.length; i++) {
          const point = points[i];
          compacted[vi + 0] = point[0];
          compacted[vi + 1] = point[1];
          compacted[vi + 2] = point[2];
          vi += 3;
        }
      });
      // TODO: how about custom properties or fields ?
      return compacted
    };

    var toCompactBinary_1$1 = toCompactBinary$1;

    /**
     * Transform the given geometry using the given matrix.
     * This is a lazy transform of the polygons, as this function only adjusts the transforms.
     * See applyTransforms() for the actual application of the transforms to the polygons.
     * @param {mat4} matrix - the matrix to transform with
     * @param {geom3} geometry - the geometry to transform
     * @returns {geom3} a new geometry
     * @alias module:modeling/geometries/geom3.transform
     *
     * @example
     * let newgeometry = transform(fromXRotation(degToRad(90)), geometry)
     */
    const transform$6 = (matrix, geometry) => {
      const transforms = mat4.multiply(mat4.create(), matrix, geometry.transforms);
      return Object.assign({}, geometry, { transforms })
    };

    var transform_1$6 = transform$6;

    /**
     * Determine if the given object is a valid 3D geometry.
     * Checks for valid data structure, convex polygon faces, and manifold edges.
     *
     * **If the geometry is not valid, an exception will be thrown with details of the geometry error.**
     *
     * @param {Object} object - the object to interrogate
     * @throws {Error} error if the geometry is not valid
     * @alias module:modeling/geometries/geom3.validate
     */
    const validate$1 = (object) => {
      if (!isA_1$2(object)) {
        throw new Error('invalid geom3 structure')
      }

      // check polygons
      object.polygons.forEach(poly3.validate);
      validateManifold(object);

      // check transforms
      if (!object.transforms.every(Number.isFinite)) {
        throw new Error(`geom3 invalid transforms ${object.transforms}`)
      }

      // TODO: check for self-intersecting
    };

    /*
     * Check manifold edge condition: Every edge is in exactly 2 faces
     */
    const validateManifold = (object) => {
      // count of each edge
      const edgeCount = new Map();
      object.polygons.forEach(({ vertices }) => {
        vertices.forEach((v, i) => {
          const v1 = `${v}`;
          const v2 = `${vertices[(i + 1) % vertices.length]}`;
          // sort for undirected edge
          const edge = `${v1}/${v2}`;
          const count = edgeCount.has(edge) ? edgeCount.get(edge) : 0;
          edgeCount.set(edge, count + 1);
        });
      });

      // check that edges are always matched
      const nonManifold = [];
      edgeCount.forEach((count, edge) => {
        const complementEdge = edge.split('/').reverse().join('/');
        const complementCount = edgeCount.get(complementEdge);
        if (count !== complementCount) {
          nonManifold.push(edge.replace('/', ' -> '));
        }
      });
      if (nonManifold.length > 0) {
        throw new Error(`non-manifold edges ${nonManifold.length}\n${nonManifold.join('\n')}`)
      }
    };

    var validate_1$1 = validate$1;

    /**
     * Represents a 3D geometry consisting of a list of polygons.
     * @see {@link geom3} for data structure information.
     * @module modeling/geometries/geom3
     *
     * @example
     * colorize([0,0.5,1,0.6], cube()) // transparent ice cube
     *
     * @example
     * {
     *   "polygons": [
     *     {"vertices": [[-1,-1,-1], [-1,-1,1], [-1,1,1], [-1,1,-1]]},
     *     {"vertices": [[1,-1,-1], [1,1,-1], [1,1,1], [1,-1,1]]},
     *     {"vertices": [[-1,-1,-1], [1,-1,-1], [1,-1,1], [-1,-1,1]]},
     *     {"vertices": [[-1,1,-1], [-1,1,1], [1,1,1], [1,1,-1]]},
     *     {"vertices": [[-1,-1,-1], [-1,1,-1], [1,1,-1], [1,-1,-1]]},
     *     {"vertices": [[-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]]}
     *   ],
     *   "transforms": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
     *   "color": [0,0.5,1,0.6]
     * }
     */
    var geom3$2 = {
      clone: clone_1$7,
      create: create_1$a,
      fromPoints: fromPoints_1$4,
      fromCompactBinary: fromCompactBinary_1$1,
      invert: invert_1$1,
      isA: isA_1$2,
      toPoints: toPoints_1$1,
      toPolygons: toPolygons_1$1,
      toString: toString_1$4,
      toCompactBinary: toCompactBinary_1$1,
      transform: transform_1$6,
      validate: validate_1$1
    };
    var geom3_1 = geom3$2.clone;

    /**
     * Performs a shallow clone of the give geometry.
     * @param {path2} geometry - the geometry to clone
     * @returns {path2} a new path
     * @alias module:modeling/geometries/path2.clone
     */
    const clone$5 = (geometry) => Object.assign({}, geometry);

    var clone_1$4 = clone$5;

    const { EPS: EPS$g } = constants;





    /**
     * Close the given geometry.
     * @param {path2} geometry - the path to close
     * @returns {path2} a new path
     * @alias module:modeling/geometries/path2.close
     */
    const close = (geometry) => {
      if (geometry.isClosed) return geometry

      const cloned = clone_1$4(geometry);
      cloned.isClosed = true;

      if (cloned.points.length > 1) {
        // make sure the paths are formed properly
        const points = cloned.points;
        const p0 = points[0];
        let pn = points[points.length - 1];
        while (vec2.distance(p0, pn) < (EPS$g * EPS$g)) {
          points.pop();
          if (points.length === 1) break
          pn = points[points.length - 1];
        }
      }
      return cloned
    };

    var close_1 = close;

    /**
     * Represents a 2D geometry consisting of a list of ordered points.
     * @typedef {Object} path2
     * @property {Array} points - list of ordered points
     * @property {Boolean} isClosed - true if the path is closed where start and end points are the same
     * @property {mat4} transforms - transforms to apply to the points, see transform()
     */

    /**
     * Create an empty, open path.
     * @returns {path2} a new path
     * @alias module:modeling/geometries/path2.create
     *
     * @example
     * let newpath = create()
     */
    const create$7 = (points) => {
      if (points === undefined) {
        points = [];
      }
      return {
        points: points,
        isClosed: false,
        transforms: mat4.create()
      }
    };

    var create_1$7 = create$7;

    const { EPS: EPS$f } = constants;






    /**
     * Create a new path from the given points.
     * The points must be provided an array of points,
     * where each point is an array of two numbers.
     * @param {Object} options - options for construction
     * @param {Boolean} [options.closed=false] - if the path should be open or closed
     * @param {Array} points - array of points (2D) from which to create the path
     * @returns {path2} a new path
     * @alias module:modeling/geometries/path2.fromPoints
     *
     * @example:
     * my newpath = fromPoints({closed: true}, [[10, 10], [-10, 10]])
     */
    const fromPoints$3 = (options, points) => {
      const defaults = { closed: false };
      let { closed } = Object.assign({}, defaults, options);

      let created = create_1$7();
      created.points = points.map((point) => vec2.clone(point));

      // check if first and last points are equal
      if (created.points.length > 1) {
        const p0 = created.points[0];
        const pn = created.points[created.points.length - 1];
        if (vec2.distance(p0, pn) < (EPS$f * EPS$f)) {
          // and close automatically
          closed = true;
        }
      }
      if (closed === true) created = close_1(created);

      return created
    };

    var fromPoints_1$3 = fromPoints$3;

    /*
     * Apply the transforms of the given geometry.
     * NOTE: This function must be called BEFORE exposing any data. See toPoints.
     * @param {path} geometry - the geometry to transform
     * @returns {path} the given geometry
     * @example
     * geometry = applyTransforms(geometry)
     */
    const applyTransforms = (geometry) => {
      if (mat4.isIdentity(geometry.transforms)) return geometry

      geometry.points = geometry.points.map((point) => vec2.transform(vec2.create(), point, geometry.transforms));
      geometry.transforms = mat4.create();
      return geometry
    };

    var applyTransforms_1 = applyTransforms;

    /**
     * Produces an array of points from the given geometry.
     * The returned array should not be modified as the data is shared with the geometry.
     * @param {path2} geometry - the geometry
     * @returns {Array} an array of points
     * @alias module:modeling/geometries/path2.toPoints
     *
     * @example
     * let sharedpoints = toPoints(geometry)
     */
    const toPoints = (geometry) => applyTransforms_1(geometry).points;

    var toPoints_1 = toPoints;

    /**
     * Append a series of points to the given geometry that represent an arc.
     * This implementation follows the SVG specifications.
     * @see http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
     * @param {Object} options - options for construction
     * @param {vec2} options.endpoint - end point of arc (REQUIRED)
     * @param {vec2} [options.radius=[0,0]] - radius of arc (X and Y)
     * @param {Number} [options.xaxisrotation=0] - rotation (RADIANS) of the X axis of the arc with respect to the X axis of the coordinate system
     * @param {Boolean} [options.clockwise=false] - draw an arc clockwise with respect to the center point
     * @param {Boolean} [options.large=false] - draw an arc longer than PI radians
     * @param {Number} [options.segments=16] - number of segments per full rotation
     * @param {path2} geometry - the path of which to append the arc
     * @returns {path2} a new path with the appended points
     * @alias module:modeling/geometries/path2.appendArc
     *
     * @example
     * let p1 = path2.fromPoints({}, [[27.5,-22.96875]]);
     * p1 = path2.appendPoints([[27.5,-3.28125]], p1);
     * p1 = path2.appendArc({endpoint: [12.5, -22.96875], radius: [15, -19.6875]}, p1);
     */
    const appendArc = (options, geometry) => {
      const defaults = {
        radius: [0, 0], // X and Y radius
        xaxisrotation: 0,
        clockwise: false,
        large: false,
        segments: 16
      };
      let { endpoint, radius, xaxisrotation, clockwise, large, segments } = Object.assign({}, defaults, options);

      // validate the given options
      if (!Array.isArray(endpoint)) throw new Error('endpoint must be an array of X and Y values')
      if (endpoint.length < 2) throw new Error('endpoint must contain X and Y values')
      endpoint = vec2.clone(endpoint);

      if (!Array.isArray(radius)) throw new Error('radius must be an array of X and Y values')
      if (radius.length < 2) throw new Error('radius must contain X and Y values')

      if (segments < 4) throw new Error('segments must be four or more')

      const decimals = 100000;

      // validate the given geometry
      if (geometry.isClosed) {
        throw new Error('the given path cannot be closed')
      }

      const points = toPoints_1(geometry);
      if (points.length < 1) {
        throw new Error('the given path must contain one or more points (as the starting point for the arc)')
      }

      let xradius = radius[0];
      let yradius = radius[1];
      const startpoint = points[points.length - 1];

      // round to precision in order to have determinate calculations
      xradius = Math.round(xradius * decimals) / decimals;
      yradius = Math.round(yradius * decimals) / decimals;
      endpoint = vec2.fromValues(Math.round(endpoint[0] * decimals) / decimals, Math.round(endpoint[1] * decimals) / decimals);

      const sweepFlag = !clockwise;
      let newpoints = [];
      if ((xradius === 0) || (yradius === 0)) {
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes:
        // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop
        newpoints.push(endpoint);
      } else {
        xradius = Math.abs(xradius);
        yradius = Math.abs(yradius);

        // see http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes :
        const phi = xaxisrotation;
        const cosphi = Math.cos(phi);
        const sinphi = Math.sin(phi);
        const minushalfdistance = vec2.subtract(vec2.create(), startpoint, endpoint);
        vec2.scale(minushalfdistance, minushalfdistance, 0.5);
        // F.6.5.1:
        // round to precision in order to have determinate calculations
        const x = Math.round((cosphi * minushalfdistance[0] + sinphi * minushalfdistance[1]) * decimals) / decimals;
        const y = Math.round((-sinphi * minushalfdistance[0] + cosphi * minushalfdistance[1]) * decimals) / decimals;
        const startTranslated = vec2.fromValues(x, y);
        // F.6.6.2:
        const biglambda = (startTranslated[0] * startTranslated[0]) / (xradius * xradius) + (startTranslated[1] * startTranslated[1]) / (yradius * yradius);
        if (biglambda > 1.0) {
          // F.6.6.3:
          const sqrtbiglambda = Math.sqrt(biglambda);
          xradius *= sqrtbiglambda;
          yradius *= sqrtbiglambda;
          // round to precision in order to have determinate calculations
          xradius = Math.round(xradius * decimals) / decimals;
          yradius = Math.round(yradius * decimals) / decimals;
        }
        // F.6.5.2:
        let multiplier1 = Math.sqrt((xradius * xradius * yradius * yradius - xradius * xradius * startTranslated[1] * startTranslated[1] - yradius * yradius * startTranslated[0] * startTranslated[0]) / (xradius * xradius * startTranslated[1] * startTranslated[1] + yradius * yradius * startTranslated[0] * startTranslated[0]));
        if (sweepFlag === large) multiplier1 = -multiplier1;
        const centerTranslated = vec2.fromValues(xradius * startTranslated[1] / yradius, -yradius * startTranslated[0] / xradius);
        vec2.scale(centerTranslated, centerTranslated, multiplier1);
        // F.6.5.3:
        let center = vec2.fromValues(cosphi * centerTranslated[0] - sinphi * centerTranslated[1], sinphi * centerTranslated[0] + cosphi * centerTranslated[1]);
        center = vec2.add(center, center, vec2.scale(vec2.create(), vec2.add(vec2.create(), startpoint, endpoint), 0.5));

        // F.6.5.5:
        const vector1 = vec2.fromValues((startTranslated[0] - centerTranslated[0]) / xradius, (startTranslated[1] - centerTranslated[1]) / yradius);
        const vector2 = vec2.fromValues((-startTranslated[0] - centerTranslated[0]) / xradius, (-startTranslated[1] - centerTranslated[1]) / yradius);
        const theta1 = vec2.angleRadians(vector1);
        const theta2 = vec2.angleRadians(vector2);
        let deltatheta = theta2 - theta1;
        deltatheta = deltatheta % (2 * Math.PI);
        if ((!sweepFlag) && (deltatheta > 0)) {
          deltatheta -= 2 * Math.PI;
        } else if ((sweepFlag) && (deltatheta < 0)) {
          deltatheta += 2 * Math.PI;
        }

        // Ok, we have the center point and angle range (from theta1, deltatheta radians) so we can create the ellipse
        let numsteps = Math.ceil(Math.abs(deltatheta) / (2 * Math.PI) * segments) + 1;
        if (numsteps < 1) numsteps = 1;
        for (let step = 1; step < numsteps; step++) {
          const theta = theta1 + step / numsteps * deltatheta;
          const costheta = Math.cos(theta);
          const sintheta = Math.sin(theta);
          // F.6.3.1:
          const point = vec2.fromValues(cosphi * xradius * costheta - sinphi * yradius * sintheta, sinphi * xradius * costheta + cosphi * yradius * sintheta);
          vec2.add(point, point, center);
          newpoints.push(point);
        }
        // ensure end point is precisely what user gave as parameter
        if (numsteps) newpoints.push(options.endpoint);
      }
      newpoints = points.concat(newpoints);
      const result = fromPoints_1$3({}, newpoints);
      return result
    };

    var appendArc_1 = appendArc;

    /**
     * Append the given list of points to the end of the given geometry.
     * @param {Array} points - the points (2D) to append to the given path
     * @param {path2} geometry - the given path
     * @returns {path2} a new path with the appended points
     * @alias module:modeling/geometries/path2.appendPoints
     * @example
     * let newpath = appendPoints([[3, 4], [4, 5]], oldpath)
     */
    const appendPoints = (points, geometry) => {
      if (geometry.isClosed) {
        throw new Error('cannot append points to a closed path')
      }

      let newpoints = toPoints_1(geometry);
      newpoints = newpoints.concat(points);

      return fromPoints_1$3({}, newpoints)
    };

    var appendPoints_1 = appendPoints;

    const vec3 = vec2;




    /**
     * Append a series of points to the given geometry that represent a Bezier curve.
     * The Bézier curve starts at the last point in the given geometry, and ends at the last control point.
     * The other control points are intermediate control points to transition the curve from start to end points.
     * The first control point may be null to ensure a smooth transition occurs. In this case,
     * the second to last point of the given geometry is mirrored into the control points of the Bezier curve.
     * In other words, the trailing gradient of the geometry matches the new gradient of the curve.
     * @param {Object} options - options for construction
     * @param {Array} options.controlPoints - list of control points (2D) for the bezier curve
     * @param {Number} [options.segment=16] - number of segments per 360 rotation
     * @param {path2} geometry - the path of which to appended points
     * @returns {path2} a new path with the appended points
     * @alias module:modeling/geometries/path2.appendBezier
     *
     * @example
     * let p5 = path2.create({}, [[10,-20]])
     * p5 = path2.appendBezier({controlPoints: [[10,-10],[25,-10],[25,-20]]}, p5);
     * p5 = path2.appendBezier({controlPoints: [null, [25,-30],[40,-30],[40,-20]]}, p5)
     */
    const appendBezier = (options, geometry) => {
      const defaults = {
        segments: 16
      };
      let { controlPoints, segments } = Object.assign({}, defaults, options);

      // validate the given options
      if (!Array.isArray(controlPoints)) throw new Error('controlPoints must be an array of one or more points')
      if (controlPoints.length < 1) throw new Error('controlPoints must be an array of one or more points')

      if (segments < 4) throw new Error('segments must be four or more')

      // validate the given geometry
      if (geometry.isClosed) {
        throw new Error('the given geometry cannot be closed')
      }

      const points = toPoints_1(geometry);
      if (points.length < 1) {
        throw new Error('the given path must contain one or more points (as the starting point for the bezier curve)')
      }

      // make a copy of the control points
      controlPoints = controlPoints.slice();

      // special handling of null control point (only first is allowed)
      const firstControlPoint = controlPoints[0];
      if (firstControlPoint === null) {
        if (controlPoints.length < 2) {
          throw new Error('a null control point must be passed with one more control points')
        }
        // special handling of a previous bezier curve
        let lastBezierControlPoint = points[points.length - 2];
        if ('lastBezierControlPoint' in geometry) {
          lastBezierControlPoint = geometry.lastBezierControlPoint;
        }
        if (!Array.isArray(lastBezierControlPoint)) {
          throw new Error('the given path must contain TWO or more points if given a null control point')
        }
        // replace the first control point with the mirror of the last bezier control point
        const controlpoint = vec2.scale(vec2.create(), points[points.length - 1], 2);
        vec2.subtract(controlpoint, controlpoint, lastBezierControlPoint);

        controlPoints[0] = controlpoint;
      }

      // add a control point for the previous end point
      controlPoints.unshift(points[points.length - 1]);

      const bezierOrder = controlPoints.length - 1;
      const factorials = [];
      let fact = 1;
      for (let i = 0; i <= bezierOrder; ++i) {
        if (i > 0) fact *= i;
        factorials.push(fact);
      }

      const binomials = [];
      for (let i = 0; i <= bezierOrder; ++i) {
        const binomial = factorials[bezierOrder] / (factorials[i] * factorials[bezierOrder - i]);
        binomials.push(binomial);
      }

      const v0 = vec2.create();
      const v1 = vec2.create();
      const v3 = vec3.create();
      const getPointForT = (t) => {
        let tk = 1; // = pow(t,k)
        let oneMinusTNMinusK = Math.pow(1 - t, bezierOrder); // = pow( 1-t, bezierOrder - k)
        const invOneMinusT = (t !== 1) ? (1 / (1 - t)) : 1;
        const point = vec2.create(); // 0, 0, 0
        for (let k = 0; k <= bezierOrder; ++k) {
          if (k === bezierOrder) oneMinusTNMinusK = 1;
          const bernsteinCoefficient = binomials[k] * tk * oneMinusTNMinusK;
          const derivativePoint = vec2.scale(v0, controlPoints[k], bernsteinCoefficient);
          vec2.add(point, point, derivativePoint);
          tk *= t;
          oneMinusTNMinusK *= invOneMinusT;
        }
        return point
      };

      const newpoints = [];
      const newpointsT = [];
      const numsteps = bezierOrder + 1;
      for (let i = 0; i < numsteps; ++i) {
        const t = i / (numsteps - 1);
        const point = getPointForT(t);
        newpoints.push(point);
        newpointsT.push(t);
      }

      // subdivide each segment until the angle at each vertex becomes small enough:
      let subdivideBase = 1;
      const maxangle = Math.PI * 2 / segments;
      const maxsinangle = Math.sin(maxangle);
      while (subdivideBase < newpoints.length - 1) {
        const dir1 = vec2.subtract(v0, newpoints[subdivideBase], newpoints[subdivideBase - 1]);
        vec2.normalize(dir1, dir1);
        const dir2 = vec2.subtract(v1, newpoints[subdivideBase + 1], newpoints[subdivideBase]);
        vec2.normalize(dir2, dir2);
        const sinangle = vec2.cross(v3, dir1, dir2); // the sine of the angle
        if (Math.abs(sinangle[2]) > maxsinangle) {
          // angle is too big, we need to subdivide
          const t0 = newpointsT[subdivideBase - 1];
          const t1 = newpointsT[subdivideBase + 1];
          const newt0 = t0 + (t1 - t0) * 1 / 3;
          const newt1 = t0 + (t1 - t0) * 2 / 3;
          const point0 = getPointForT(newt0);
          const point1 = getPointForT(newt1);
          // remove the point at subdivideBase and replace with 2 new points:
          newpoints.splice(subdivideBase, 1, point0, point1);
          newpointsT.splice(subdivideBase, 1, newt0, newt1);
          // re - evaluate the angles, starting at the previous junction since it has changed:
          subdivideBase--;
          if (subdivideBase < 1) subdivideBase = 1;
        } else {
          ++subdivideBase;
        }
      }

      // append to the new points to the given path
      // but skip the first new point because it is identical to the last point in the given path
      newpoints.shift();
      const result = appendPoints_1(newpoints, geometry);
      result.lastBezierControlPoint = controlPoints[controlPoints.length - 2];
      return result
    };

    var appendBezier_1 = appendBezier;

    const { equals: equals$5 } = vec2;
    /**
     * Concatenate the given paths.
     * If both contain the same point at the junction, merge it into one.
     * A concatenation of zero paths is an empty, open path.
     * A concatenation of one closed path to a series of open paths produces a closed path.
     * A concatenation of a path to a closed path is an error.
     * @param {...path2} paths - the paths to concatenate
     * @returns {path2} a new path
     * @alias module:modeling/geometries/path2.concat
     *
     * @example
     * let newpath = concat(fromPoints({}, [[1, 2]]), fromPoints({}, [[3, 4]]))
     */
    const concat = (...paths) => {
      // Only the last path can be closed, producing a closed path.
      let isClosed = false;
      for (const path of paths) {
        if (isClosed) {
          throw new Error('Cannot concatenate to a closed path')
        }
        isClosed = path.isClosed;
      }
      let newpoints = [];
      paths.forEach((path) => {
        const tmp = toPoints_1(path);
        if (newpoints.length > 0 && tmp.length > 0 && equals$5(tmp[0], newpoints[newpoints.length - 1])) tmp.shift();
        newpoints = newpoints.concat(tmp);
      });
      return fromPoints_1$3({ closed: isClosed }, newpoints)
    };

    var concat_1 = concat;

    /**
     * Calls a function for each point in the path.
     * @param {Object} options - options
     * @param {Function} thunk - the function to call
     * @param {path2} path - the path to traverse
     * @alias module:modeling/geometries/path2.eachPoint
     *
     * @example
     * eachPoint({}, accumulate, path)
     */
    const eachPoint = (options, thunk, path) => {
      toPoints_1(path).forEach(thunk);
    };

    var eachPoint_1 = eachPoint;

    /**
      * Determine if the given paths are equal.
      * For closed paths, this includes equality under point order rotation.
      * @param {path2} a - the first path to compare
      * @param {path2} b - the second path to compare
      * @returns {Boolean}
      * @alias module:modeling/geometries/path2.equals
      */
    const equals$4 = (a, b) => {
      if (a.isClosed !== b.isClosed) {
        return false
      }
      if (a.points.length !== b.points.length) {
        return false
      }

      const apoints = toPoints_1(a);
      const bpoints = toPoints_1(b);

      // closed paths might be equal under graph rotation
      // so try comparison by rotating across all points
      const length = apoints.length;
      let offset = 0;
      do {
        let unequal = false;
        for (let i = 0; i < length; i++) {
          if (!vec2.equals(apoints[i], bpoints[(i + offset) % length])) {
            unequal = true;
            break
          }
        }
        if (unequal === false) {
          return true
        }
        // unequal open paths should only be compared once, never rotated
        if (!a.isClosed) {
          return false
        }
      } while (++offset < length)
      return false
    };

    var equals_1$3 = equals$4;

    /**
     * Create a new path from the given compact binary data.
     * @param {TypedArray} data - compact binary data
     * @returns {path2} a new path
     * @alias module:modeling/geometries/path2.fromCompactBinary
     */
    const fromCompactBinary = (data) => {
      if (data[0] !== 2) throw new Error('invalid compact binary data')

      const created = create_1$7();

      created.transforms = mat4.clone(data.slice(1, 17));

      created.isClosed = !!data[17];

      for (let i = 22; i < data.length; i += 2) {
        const point = vec2.fromValues(data[i], data[i + 1]);
        created.points.push(point);
      }
      // transfer known properties, i.e. color
      if (data[18] >= 0) {
        created.color = [data[18], data[19], data[20], data[21]];
      }
      // TODO: how about custom properties or fields ?
      return created
    };

    var fromCompactBinary_1 = fromCompactBinary;

    /**
     * Determine if the given object is a path2 geometry.
     * @param {Object} object - the object to interrogate
     * @returns {Boolean} true if the object matches a path2
     * @alias module:modeling/geometries/path2.isA
     */
    const isA$1 = (object) => {
      if (object && typeof object === 'object') {
        // see create for the required attributes and types
        if ('points' in object && 'transforms' in object && 'isClosed' in object) {
          // NOTE: transforms should be a TypedArray, which has a read-only length
          if (Array.isArray(object.points) && 'length' in object.transforms) {
            return true
          }
        }
      }
      return false
    };

    var isA_1$1 = isA$1;

    /**
     * Reverses the path so that the points are in the opposite order.
     * This swaps the left (interior) and right (exterior) edges.
     * @param {path2} geometry - the path to reverse
     * @returns {path2} a new path
     * @alias module:modeling/geometries/path2.reverse
     *
     * @example
     * let newpath = reverse(mypath)
     */
    const reverse$3 = (geometry) => {
      // NOTE: this only updates the order of the points
      const cloned = clone_1$4(geometry);
      cloned.points = geometry.points.slice().reverse();
      return cloned
    };

    var reverse_1$3 = reverse$3;

    /**
     * Create a string representing the contents of the given path.
     * @param {path2} geometry - the path
     * @returns {String} a representative string
     * @alias module:modeling/geometries/path2.toString
     *
     * @example
     * console.out(toString(path))
     */
    const toString$3 = (geometry) => {
      const points = toPoints_1(geometry);
      let result = 'path (' + points.length + ' points, ' + geometry.isClosed + '):\n[\n';
      points.forEach((point) => {
        result += '  ' + vec2.toString(point) + ',\n';
      });
      result += ']\n';
      return result
    };

    var toString_1$3 = toString$3;

    /**
     * Produce a compact binary representation from the given path.
     * @param {path2} geometry - the path geometry
     * @returns {TypedArray} compact binary representation
     * @alias module:modeling/geometries/path2.toCompactBinary
     */
    const toCompactBinary = (geometry) => {
      const points = geometry.points;
      const transforms = geometry.transforms;
      let color = [-1, -1, -1, -1];
      if (geometry.color) color = geometry.color;

      // FIXME why Float32Array?
      const compacted = new Float32Array(1 + 16 + 1 + 4 + (points.length * 2)); // type + transforms + isClosed + color + points data

      compacted[0] = 2; // type code: 0 => geom2, 1 => geom3 , 2 => path2

      compacted[1] = transforms[0];
      compacted[2] = transforms[1];
      compacted[3] = transforms[2];
      compacted[4] = transforms[3];
      compacted[5] = transforms[4];
      compacted[6] = transforms[5];
      compacted[7] = transforms[6];
      compacted[8] = transforms[7];
      compacted[9] = transforms[8];
      compacted[10] = transforms[9];
      compacted[11] = transforms[10];
      compacted[12] = transforms[11];
      compacted[13] = transforms[12];
      compacted[14] = transforms[13];
      compacted[15] = transforms[14];
      compacted[16] = transforms[15];

      compacted[17] = geometry.isClosed ? 1 : 0;

      compacted[18] = color[0];
      compacted[19] = color[1];
      compacted[20] = color[2];
      compacted[21] = color[3];

      for (let j = 0; j < points.length; j++) {
        const ci = j * 2 + 22;
        const point = points[j];
        compacted[ci] = point[0];
        compacted[ci + 1] = point[1];
      }
      // TODO: how about custom properties or fields ?
      return compacted
    };

    var toCompactBinary_1 = toCompactBinary;

    /**
     * Transform the given geometry using the given matrix.
     * This is a lazy transform of the points, as this function only adjusts the transforms.
     * The transforms are applied when accessing the points via toPoints().
     * @param {mat4} matrix - the matrix to transform with
     * @param {path2} geometry - the geometry to transform
     * @returns {path2} a new path
     * @alias module:modeling/geometries/path2.transform
     *
     * @example
     * let newpath = transform(fromZRotation(Math.PI / 4), path)
     */
    const transform$5 = (matrix, geometry) => {
      const transforms = mat4.multiply(mat4.create(), matrix, geometry.transforms);
      return Object.assign({}, geometry, { transforms })
    };

    var transform_1$5 = transform$5;

    /**
     * Determine if the given object is a valid path2.
     * Checks for valid data points, and duplicate points.
     *
     * **If the geometry is not valid, an exception will be thrown with details of the geometry error.**
     *
     * @param {Object} object - the object to interrogate
     * @throws {Error} error if the geometry is not valid
     * @alias module:modeling/geometries/path2.validate
     */
    const validate = (object) => {
      if (!isA_1$1(object)) {
        throw new Error('invalid path2 structure')
      }

      // check for duplicate points
      if (object.points.length > 1) {
        for (let i = 0; i < object.points.length; i++) {
          if (vec2.equals(object.points[i], object.points[(i + 1) % object.points.length])) {
            throw new Error(`path2 duplicate points ${object.points[i]}`)
          }
        }
      }

      // check for infinity, nan
      object.points.forEach((point) => {
        if (!point.every(Number.isFinite)) {
          throw new Error(`path2 invalid point ${point}`)
        }
      });

      // check transforms
      if (!object.transforms.every(Number.isFinite)) {
        throw new Error(`path2 invalid transforms ${object.transforms}`)
      }
    };

    var validate_1 = validate;

    /**
     * Represents a 2D geometry consisting of a list of ordered points.
     * @see {@link path2} for data structure information.
     * @module modeling/geometries/path2
     *
     * @example
     * colorize([0,0,0,1], path2.fromPoints({ closed: true }, [[0,0], [4,0], [4,3]]))
     *
     * @example
     * {
     *   "points": [[0,0], [4,0], [4,3]],
     *   "isClosed": true,
     *   "transforms": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
     *   "color": [0,0,0,1]
     * }
     */
    var path2$2 = {
      appendArc: appendArc_1,
      appendBezier: appendBezier_1,
      appendPoints: appendPoints_1,
      clone: clone_1$4,
      close: close_1,
      concat: concat_1,
      create: create_1$7,
      eachPoint: eachPoint_1,
      equals: equals_1$3,
      fromPoints: fromPoints_1$3,
      fromCompactBinary: fromCompactBinary_1,
      isA: isA_1$1,
      reverse: reverse_1$3,
      toPoints: toPoints_1,
      toString: toString_1$3,
      toCompactBinary: toCompactBinary_1,
      transform: transform_1$5,
      validate: validate_1
    };

    const colorGeom2 = (color, object) => {
      const newgeom2 = geom2$2.clone(object);
      newgeom2.color = color;
      return newgeom2
    };

    const colorGeom3 = (color, object) => {
      const newgeom3 = geom3$2.clone(object);
      newgeom3.color = color;
      return newgeom3
    };

    const colorPath2 = (color, object) => {
      const newpath2 = path2$2.clone(object);
      newpath2.color = color;
      return newpath2
    };

    const colorPoly3 = (color, object) => {
      const newpoly = poly3.clone(object);
      newpoly.color = color;
      return newpoly
    };

    /**
     * Assign the given color to the given objects.
     * @param {Array} color - RGBA color values, where each value is between 0 and 1.0
     * @param {Object|Array} objects - the objects of which to apply the given color
     * @return {Object|Array} new object, or list of new objects with an additional attribute 'color'
     * @alias module:modeling/colors.colorize
     *
     * @example
     * let redSphere = colorize([1,0,0], sphere()) // red
     * let greenCircle = colorize([0,1,0,0.8], circle()) // green transparent
     * let blueArc = colorize([0,0,1], arc()) // blue
     * let wildcylinder = colorize(colorNameToRgb('fuchsia'), cylinder()) // CSS color
     */
    const colorize = (color, ...objects) => {
      if (!Array.isArray(color)) throw new Error('color must be an array')
      if (color.length < 3) throw new Error('color must contain R, G and B values')
      if (color.length === 3) color = [color[0], color[1], color[2], 1.0]; // add alpha

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      const results = objects.map((object) => {
        if (geom2$2.isA(object)) return colorGeom2(color, object)
        if (geom3$2.isA(object)) return colorGeom3(color, object)
        if (path2$2.isA(object)) return colorPath2(color, object)
        if (poly3.isA(object)) return colorPoly3(color, object)

        object.color = color;
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    var colorize_1 = colorize;

    /**
     * @alias module:modeling/colors.cssColors
     * @see CSS color table from http://www.w3.org/TR/css3-color/
     * @enum {Array}
     * @example
     * let newshape = colorize(cssColors.red, oldshape)
     */
    const cssColors = {
      // basic color keywords
      black: [0 / 255, 0 / 255, 0 / 255],
      silver: [192 / 255, 192 / 255, 192 / 255],
      gray: [128 / 255, 128 / 255, 128 / 255],
      white: [255 / 255, 255 / 255, 255 / 255],
      maroon: [128 / 255, 0 / 255, 0 / 255],
      red: [255 / 255, 0 / 255, 0 / 255],
      purple: [128 / 255, 0 / 255, 128 / 255],
      fuchsia: [255 / 255, 0 / 255, 255 / 255],
      green: [0 / 255, 128 / 255, 0 / 255],
      lime: [0 / 255, 255 / 255, 0 / 255],
      olive: [128 / 255, 128 / 255, 0 / 255],
      yellow: [255 / 255, 255 / 255, 0 / 255],
      navy: [0 / 255, 0 / 255, 128 / 255],
      blue: [0 / 255, 0 / 255, 255 / 255],
      teal: [0 / 255, 128 / 255, 128 / 255],
      aqua: [0 / 255, 255 / 255, 255 / 255],
      // extended color keywords
      aliceblue: [240 / 255, 248 / 255, 255 / 255],
      antiquewhite: [250 / 255, 235 / 255, 215 / 255],
      // 'aqua': [ 0 / 255, 255 / 255, 255 / 255 ],
      aquamarine: [127 / 255, 255 / 255, 212 / 255],
      azure: [240 / 255, 255 / 255, 255 / 255],
      beige: [245 / 255, 245 / 255, 220 / 255],
      bisque: [255 / 255, 228 / 255, 196 / 255],
      // 'black': [ 0 / 255, 0 / 255, 0 / 255 ],
      blanchedalmond: [255 / 255, 235 / 255, 205 / 255],
      // 'blue': [ 0 / 255, 0 / 255, 255 / 255 ],
      blueviolet: [138 / 255, 43 / 255, 226 / 255],
      brown: [165 / 255, 42 / 255, 42 / 255],
      burlywood: [222 / 255, 184 / 255, 135 / 255],
      cadetblue: [95 / 255, 158 / 255, 160 / 255],
      chartreuse: [127 / 255, 255 / 255, 0 / 255],
      chocolate: [210 / 255, 105 / 255, 30 / 255],
      coral: [255 / 255, 127 / 255, 80 / 255],
      cornflowerblue: [100 / 255, 149 / 255, 237 / 255],
      cornsilk: [255 / 255, 248 / 255, 220 / 255],
      crimson: [220 / 255, 20 / 255, 60 / 255],
      cyan: [0 / 255, 255 / 255, 255 / 255],
      darkblue: [0 / 255, 0 / 255, 139 / 255],
      darkcyan: [0 / 255, 139 / 255, 139 / 255],
      darkgoldenrod: [184 / 255, 134 / 255, 11 / 255],
      darkgray: [169 / 255, 169 / 255, 169 / 255],
      darkgreen: [0 / 255, 100 / 255, 0 / 255],
      darkgrey: [169 / 255, 169 / 255, 169 / 255],
      darkkhaki: [189 / 255, 183 / 255, 107 / 255],
      darkmagenta: [139 / 255, 0 / 255, 139 / 255],
      darkolivegreen: [85 / 255, 107 / 255, 47 / 255],
      darkorange: [255 / 255, 140 / 255, 0 / 255],
      darkorchid: [153 / 255, 50 / 255, 204 / 255],
      darkred: [139 / 255, 0 / 255, 0 / 255],
      darksalmon: [233 / 255, 150 / 255, 122 / 255],
      darkseagreen: [143 / 255, 188 / 255, 143 / 255],
      darkslateblue: [72 / 255, 61 / 255, 139 / 255],
      darkslategray: [47 / 255, 79 / 255, 79 / 255],
      darkslategrey: [47 / 255, 79 / 255, 79 / 255],
      darkturquoise: [0 / 255, 206 / 255, 209 / 255],
      darkviolet: [148 / 255, 0 / 255, 211 / 255],
      deeppink: [255 / 255, 20 / 255, 147 / 255],
      deepskyblue: [0 / 255, 191 / 255, 255 / 255],
      dimgray: [105 / 255, 105 / 255, 105 / 255],
      dimgrey: [105 / 255, 105 / 255, 105 / 255],
      dodgerblue: [30 / 255, 144 / 255, 255 / 255],
      firebrick: [178 / 255, 34 / 255, 34 / 255],
      floralwhite: [255 / 255, 250 / 255, 240 / 255],
      forestgreen: [34 / 255, 139 / 255, 34 / 255],
      // 'fuchsia': [ 255 / 255, 0 / 255, 255 / 255 ],
      gainsboro: [220 / 255, 220 / 255, 220 / 255],
      ghostwhite: [248 / 255, 248 / 255, 255 / 255],
      gold: [255 / 255, 215 / 255, 0 / 255],
      goldenrod: [218 / 255, 165 / 255, 32 / 255],
      // 'gray': [ 128 / 255, 128 / 255, 128 / 255 ],
      // 'green': [ 0 / 255, 128 / 255, 0 / 255 ],
      greenyellow: [173 / 255, 255 / 255, 47 / 255],
      grey: [128 / 255, 128 / 255, 128 / 255],
      honeydew: [240 / 255, 255 / 255, 240 / 255],
      hotpink: [255 / 255, 105 / 255, 180 / 255],
      indianred: [205 / 255, 92 / 255, 92 / 255],
      indigo: [75 / 255, 0 / 255, 130 / 255],
      ivory: [255 / 255, 255 / 255, 240 / 255],
      khaki: [240 / 255, 230 / 255, 140 / 255],
      lavender: [230 / 255, 230 / 255, 250 / 255],
      lavenderblush: [255 / 255, 240 / 255, 245 / 255],
      lawngreen: [124 / 255, 252 / 255, 0 / 255],
      lemonchiffon: [255 / 255, 250 / 255, 205 / 255],
      lightblue: [173 / 255, 216 / 255, 230 / 255],
      lightcoral: [240 / 255, 128 / 255, 128 / 255],
      lightcyan: [224 / 255, 255 / 255, 255 / 255],
      lightgoldenrodyellow: [250 / 255, 250 / 255, 210 / 255],
      lightgray: [211 / 255, 211 / 255, 211 / 255],
      lightgreen: [144 / 255, 238 / 255, 144 / 255],
      lightgrey: [211 / 255, 211 / 255, 211 / 255],
      lightpink: [255 / 255, 182 / 255, 193 / 255],
      lightsalmon: [255 / 255, 160 / 255, 122 / 255],
      lightseagreen: [32 / 255, 178 / 255, 170 / 255],
      lightskyblue: [135 / 255, 206 / 255, 250 / 255],
      lightslategray: [119 / 255, 136 / 255, 153 / 255],
      lightslategrey: [119 / 255, 136 / 255, 153 / 255],
      lightsteelblue: [176 / 255, 196 / 255, 222 / 255],
      lightyellow: [255 / 255, 255 / 255, 224 / 255],
      // 'lime': [ 0 / 255, 255 / 255, 0 / 255 ],
      limegreen: [50 / 255, 205 / 255, 50 / 255],
      linen: [250 / 255, 240 / 255, 230 / 255],
      magenta: [255 / 255, 0 / 255, 255 / 255],
      // 'maroon': [ 128 / 255, 0 / 255, 0 / 255 ],
      mediumaquamarine: [102 / 255, 205 / 255, 170 / 255],
      mediumblue: [0 / 255, 0 / 255, 205 / 255],
      mediumorchid: [186 / 255, 85 / 255, 211 / 255],
      mediumpurple: [147 / 255, 112 / 255, 219 / 255],
      mediumseagreen: [60 / 255, 179 / 255, 113 / 255],
      mediumslateblue: [123 / 255, 104 / 255, 238 / 255],
      mediumspringgreen: [0 / 255, 250 / 255, 154 / 255],
      mediumturquoise: [72 / 255, 209 / 255, 204 / 255],
      mediumvioletred: [199 / 255, 21 / 255, 133 / 255],
      midnightblue: [25 / 255, 25 / 255, 112 / 255],
      mintcream: [245 / 255, 255 / 255, 250 / 255],
      mistyrose: [255 / 255, 228 / 255, 225 / 255],
      moccasin: [255 / 255, 228 / 255, 181 / 255],
      navajowhite: [255 / 255, 222 / 255, 173 / 255],
      // 'navy': [ 0 / 255, 0 / 255, 128 / 255 ],
      oldlace: [253 / 255, 245 / 255, 230 / 255],
      // 'olive': [ 128 / 255, 128 / 255, 0 / 255 ],
      olivedrab: [107 / 255, 142 / 255, 35 / 255],
      orange: [255 / 255, 165 / 255, 0 / 255],
      orangered: [255 / 255, 69 / 255, 0 / 255],
      orchid: [218 / 255, 112 / 255, 214 / 255],
      palegoldenrod: [238 / 255, 232 / 255, 170 / 255],
      palegreen: [152 / 255, 251 / 255, 152 / 255],
      paleturquoise: [175 / 255, 238 / 255, 238 / 255],
      palevioletred: [219 / 255, 112 / 255, 147 / 255],
      papayawhip: [255 / 255, 239 / 255, 213 / 255],
      peachpuff: [255 / 255, 218 / 255, 185 / 255],
      peru: [205 / 255, 133 / 255, 63 / 255],
      pink: [255 / 255, 192 / 255, 203 / 255],
      plum: [221 / 255, 160 / 255, 221 / 255],
      powderblue: [176 / 255, 224 / 255, 230 / 255],
      // 'purple': [ 128 / 255, 0 / 255, 128 / 255 ],
      // 'red': [ 255 / 255, 0 / 255, 0 / 255 ],
      rosybrown: [188 / 255, 143 / 255, 143 / 255],
      royalblue: [65 / 255, 105 / 255, 225 / 255],
      saddlebrown: [139 / 255, 69 / 255, 19 / 255],
      salmon: [250 / 255, 128 / 255, 114 / 255],
      sandybrown: [244 / 255, 164 / 255, 96 / 255],
      seagreen: [46 / 255, 139 / 255, 87 / 255],
      seashell: [255 / 255, 245 / 255, 238 / 255],
      sienna: [160 / 255, 82 / 255, 45 / 255],
      // 'silver': [ 192 / 255, 192 / 255, 192 / 255 ],
      skyblue: [135 / 255, 206 / 255, 235 / 255],
      slateblue: [106 / 255, 90 / 255, 205 / 255],
      slategray: [112 / 255, 128 / 255, 144 / 255],
      slategrey: [112 / 255, 128 / 255, 144 / 255],
      snow: [255 / 255, 250 / 255, 250 / 255],
      springgreen: [0 / 255, 255 / 255, 127 / 255],
      steelblue: [70 / 255, 130 / 255, 180 / 255],
      tan: [210 / 255, 180 / 255, 140 / 255],
      // 'teal': [ 0 / 255, 128 / 255, 128 / 255 ],
      thistle: [216 / 255, 191 / 255, 216 / 255],
      tomato: [255 / 255, 99 / 255, 71 / 255],
      turquoise: [64 / 255, 224 / 255, 208 / 255],
      violet: [238 / 255, 130 / 255, 238 / 255],
      wheat: [245 / 255, 222 / 255, 179 / 255],
      // 'white': [ 255 / 255, 255 / 255, 255 / 255 ],
      whitesmoke: [245 / 255, 245 / 255, 245 / 255],
      // 'yellow': [ 255 / 255, 255 / 255, 0 / 255 ],
      yellowgreen: [154 / 255, 205 / 255, 50 / 255]
    };

    var cssColors_1 = cssColors;

    /**
     * Converts a CSS color name to RGB color.
     *
     * @param {String} s - the CSS color name
     * @return {Array} the RGB color, or undefined if not found
     * @alias module:modeling/colors.colorNameToRgb
     * @example
     * let mysphere = colorize(colorNameToRgb('lightblue'), sphere())
     */
    const colorNameToRgb = (s) => cssColors_1[s.toLowerCase()];

    var colorNameToRgb_1 = colorNameToRgb;

    /**
     * Converts CSS color notations (string of hex values) to RGB values.
     *
     * @see https://www.w3.org/TR/css-color-3/
     * @param {String} notation - color notation
     * @return {Array} RGB color values
     * @alias module:modeling/colors.hexToRgb
     *
     * @example
     * let mysphere = colorize(hexToRgb('#000080'), sphere()) // navy blue
     */
    const hexToRgb = (notation) => {
      notation = notation.replace('#', '');
      if (notation.length < 6) throw new Error('the given notation must contain 3 or more hex values')

      const r = parseInt(notation.substring(0, 2), 16) / 255;
      const g = parseInt(notation.substring(2, 4), 16) / 255;
      const b = parseInt(notation.substring(4, 6), 16) / 255;
      if (notation.length >= 8) {
        const a = parseInt(notation.substring(6, 8), 16) / 255;
        return [r, g, b, a]
      }
      return [r, g, b]
    };

    var hexToRgb_1 = hexToRgb;

    /**
     * Convert hue values to a color component (ie one of r, g, b)
     * @param  {Number} p
     * @param  {Number} q
     * @param  {Number} t
     * @return {Number} color component
     * @alias module:modeling/colors.hueToColorComponent
     */
    const hueToColorComponent = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    };

    var hueToColorComponent_1 = hueToColorComponent;

    /**
     * Converts HSL color values to RGB color values.
     *
     * @see http://en.wikipedia.org/wiki/HSL_color_space
     * @param {...Number|Array} values - HSL or HSLA color values
     * @return {Array} RGB or RGBA color values
     * @alias module:modeling/colors.hslToRgb
     *
     * @example
     * let mysphere = colorize(hslToRgb([0.9166666666666666, 1, 0.5]), sphere())
     */
    const hslToRgb = (...values) => {
      values = flatten_1(values);
      if (values.length < 3) throw new Error('values must contain H, S and L values')

      const h = values[0];
      const s = values[1];
      const l = values[2];

      let r = l; // default is achromatic
      let g = l;
      let b = l;

      if (s !== 0) {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToColorComponent_1(p, q, h + 1 / 3);
        g = hueToColorComponent_1(p, q, h);
        b = hueToColorComponent_1(p, q, h - 1 / 3);
      }

      if (values.length > 3) {
        // add alpha value if provided
        const a = values[3];
        return [r, g, b, a]
      }
      return [r, g, b]
    };

    var hslToRgb_1 = hslToRgb;

    /**
     * Converts HSV color values to RGB color values.
     *
     * @see http://en.wikipedia.org/wiki/HSV_color_space.
     * @param {...Number|Array} values - HSV or HSVA color values
     * @return {Array} RGB or RGBA color values
     * @alias module:modeling/colors.hsvToRgb
     *
     * @example
     * let mysphere = colorize(hsvToRgb([0.9166666666666666, 1, 1]), sphere())
     */
    const hsvToRgb = (...values) => {
      values = flatten_1(values);
      if (values.length < 3) throw new Error('values must contain H, S and V values')

      const h = values[0];
      const s = values[1];
      const v = values[2];

      let r = 0;
      let g = 0;
      let b = 0;

      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break
        case 1:
          r = q;
          g = v;
          b = p;
          break
        case 2:
          r = p;
          g = v;
          b = t;
          break
        case 3:
          r = p;
          g = q;
          b = v;
          break
        case 4:
          r = t;
          g = p;
          b = v;
          break
        case 5:
          r = v;
          g = p;
          b = q;
          break
      }

      if (values.length > 3) {
        // add alpha value if provided
        const a = values[3];
        return [r, g, b, a]
      }
      return [r, g, b]
    };

    var hsvToRgb_1 = hsvToRgb;

    /**
     * Convert the given RGB color values to CSS color notation (string)
     * @see https://www.w3.org/TR/css-color-3/
     * @param {...Number|Array} values - RGB or RGBA color values
     * @return {String} CSS color notation
     * @alias module:modeling/colors.rgbToHex
     */
    const rgbToHex = (...values) => {
      values = flatten_1(values);
      if (values.length < 3) throw new Error('values must contain R, G and B values')

      const r = values[0] * 255;
      const g = values[1] * 255;
      const b = values[2] * 255;

      let s = `#${Number(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).substring(1, 7)}`;

      if (values.length > 3) {
        // convert alpha to opacity
        s = s + Number(values[3] * 255).toString(16);
      }
      return s
    };

    var rgbToHex_1 = rgbToHex;

    /**
     * Converts an RGB color value to HSL.
     *
     * @see http://en.wikipedia.org/wiki/HSL_color_space.
     * @see http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
     * @param {...Number|Array} values - RGB or RGBA color values
     * @return {Array} HSL or HSLA color values
     * @alias module:modeling/colors.rgbToHsl
     */
    const rgbToHsl = (...values) => {
      values = flatten_1(values);
      if (values.length < 3) throw new Error('values must contain R, G and B values')

      const r = values[0];
      const g = values[1];
      const b = values[2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h;
      let s;
      const l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break
          case g:
            h = (b - r) / d + 2;
            break
          case b:
            h = (r - g) / d + 4;
            break
        }
        h /= 6;
      }

      if (values.length > 3) {
        // add alpha value if provided
        const a = values[3];
        return [h, s, l, a]
      }
      return [h, s, l]
    };

    var rgbToHsl_1 = rgbToHsl;

    /**
     * Converts an RGB color value to HSV.
     *
     * @see http://en.wikipedia.org/wiki/HSV_color_space.
     * @param {...Number|Array} values - RGB or RGBA color values
     * @return {Array} HSV or HSVA color values
     * @alias module:modeling/colors.rgbToHsv
     */
    const rgbToHsv = (...values) => {
      values = flatten_1(values);
      if (values.length < 3) throw new Error('values must contain R, G and B values')

      const r = values[0];
      const g = values[1];
      const b = values[2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h;
      const v = max;

      const d = max - min;
      const s = max === 0 ? 0 : d / max;

      if (max === min) {
        h = 0; // achromatic
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break
          case g:
            h = (b - r) / d + 2;
            break
          case b:
            h = (r - g) / d + 4;
            break
        }
        h /= 6;
      }

      if (values.length > 3) {
        // add alpha if provided
        const a = values[3];
        return [h, s, v, a]
      }
      return [h, s, v]
    };

    var rgbToHsv_1 = rgbToHsv;

    /**
     * All shapes (primitives or the results of operations) can be assigned a color (RGBA).
     * In all cases, the function returns the results, and never changes the original shapes.
     * @module modeling/colors
     * @example
     * const { colorize, hexToRgb } = require('@jscad/modeling').colors
     */
    var colors = {
      colorize: colorize_1,
      colorNameToRgb: colorNameToRgb_1,
      cssColors: cssColors_1,
      hexToRgb: hexToRgb_1,
      hslToRgb: hslToRgb_1,
      hsvToRgb: hsvToRgb_1,
      hueToColorComponent: hueToColorComponent_1,
      rgbToHex: rgbToHex_1,
      rgbToHsl: rgbToHsl_1,
      rgbToHsv: rgbToHsv_1
    };
    var colors_1 = colors.colorize;

    /**
     * Represents a bezier easing function.
     * @typedef {Object} bezier
     * @property {Array} points - The control points for the bezier curve. The first and last point will also be the start and end of the curve
     * @property {string} pointType - A reference to the type and dimensionality of the points that the curve was created from
     * @property {number} dimensions - The dimensionality of the bezier
     * @property {Array} permutations - A pre-calculation of the bezier algorithm's co-efficients
     * @property {Array} tangentPermutations - A pre-calculation of the bezier algorithm's tangent co-efficients
     *
     */

    /**
     * Creates an object representing a bezier easing curve.
     * Curves can have both an arbitrary number of control points, and an arbitrary number of dimensions.
     *
     * @example
     * const b = bezier.create([0,10]) // a linear progression from 0 to 10
     * const b = bezier.create([0, 0, 10, 10]) // a symmetrical cubic easing curve that starts slowly and ends slowly from 0 to 10
     * const b = bezier.create([0,0,0], [0,5,10], [10,0,-5], [10,10,10]]) // a cubic 3 dimensional easing curve that can generate position arrays for modelling
     * // Usage
     * let position = bezier.valueAt(t,b) // where 0 < t < 1
     * let tangent = bezier.tangentAt(t,b) // where 0 < t < 1
     *
     * @param {Array} points An array with at least 2 elements of either all numbers, or all arrays of numbers that are the same size.
     * @returns {bezier} a new bezier data object
     * @alias module:modeling/curves/bezier.create
     */
    const create$6 = (points) => {
      if (!Array.isArray(points)) throw new Error('Bezier points must be a valid array/')
      if (points.length < 2) throw new Error('Bezier points must contain at least 2 values.')
      const pointType = getPointType(points);

      return {
        points: points,
        pointType: pointType,
        dimensions: pointType === 'float_single' ? 0 : points[0].length,
        permutations: getPermutations(points.length - 1),
        tangentPermutations: getPermutations(points.length - 2)
      }
    };

    const getPointType = function (points) {
      let firstPointType = null;
      points.forEach((point) => {
        let pType = '';
        if (Number.isFinite(point)) {
          pType = 'float_single';
        } else if (Array.isArray(point)) {
          point.forEach((val) => {
            if (!Number.isFinite(val)) throw new Error('Bezier point values must all be numbers.')
          });
          pType = 'float_' + point.length;
        } else throw new Error('Bezier points must all be numbers or arrays of number.')
        if (firstPointType == null) {
          firstPointType = pType;
        } else {
          if (firstPointType !== pType) {
            throw new Error('Bezier points must be either all numbers or all arrays of numbers of the same size.')
          }
        }
      });
      return firstPointType
    };

    const getPermutations = function (c) {
      const permutations = [];
      for (let i = 0; i <= c; i++) {
        permutations.push(factorial(c) / (factorial(i) * factorial(c - i)));
      }
      return permutations
    };

    const factorial = function (b) {
      let out = 1;
      for (let i = 2; i <= b; i++) {
        out *= i;
      }
      return out
    };

    var create_1$6 = create$6;

    /**
     * Calculates the value at a specific position along a bezier easing curve.
     * For multidimensional curves, the tangent is the slope of each dimension at that point.
     * See the example called extrudeAlongPath.js to see this in use.
     * Math and explanation comes from {@link https://www.freecodecamp.org/news/nerding-out-with-bezier-curves-6e3c0bc48e2f/}
     *
     * @example
     * const b = bezier.create([0,0,0], [0,5,10], [10,0,-5], [10,10,10]]) // a cubic 3 dimensional easing curve that can generate position arrays for modelling
     * let position = bezier.valueAt(t,b) // where 0 < t < 1
     *
     * @param {number} t : the position of which to calculate the value; 0 < t < 1
     * @param {Object} bezier : a bezier curve created with bezier.create().
     * @returns {array | number} the value at the requested position.
     * @alias module:modeling/curves/bezier.valueAt
     */
    const valueAt = (t, bezier) => {
      if (t < 0 || t > 1) {
        throw new Error('Bezier valueAt() input must be between 0 and 1')
      }
      if (bezier.pointType === 'float_single') {
        return bezierFunction(bezier, bezier.points, t)
      } else {
        const result = [];
        for (let i = 0; i < bezier.dimensions; i++) {
          const singleDimensionPoints = [];
          for (let j = 0; j < bezier.points.length; j++) {
            singleDimensionPoints.push(bezier.points[j][i]);
          }
          result.push(bezierFunction(bezier, singleDimensionPoints, t));
        }
        return result
      }
    };

    const bezierFunction = function (bezier, p, t) {
      const n = p.length - 1;
      let result = 0;
      for (let i = 0; i <= n; i++) {
        result += bezier.permutations[i] * Math.pow(1 - t, n - i) * Math.pow(t, i) * p[i];
      }
      return result
    };

    var valueAt_1 = valueAt;

    /**
     * Calculates the tangent at a specific position along a bezier easing curve.
     * For multidimensional curves, the tangent is the slope of each dimension at that point.
     * See the example called extrudeAlongPath.js
     *
     * @example
     * const b = bezier.create([[0,0,0], [0,5,10], [10,0,-5], [10,10,10]]) // a cubic 3 dimensional easing curve that can generate position arrays for modelling
     * let tangent = bezier.tangentAt(t, b)
     *
     * @param {number} t : the position of which to calculate the bezier's tangent value; 0 < t < 1
     * @param {Object} bezier : an array with at least 2 elements of either all numbers, or all arrays of numbers that are the same size.
     * @return {array | number} the tangent at the requested position.
     * @alias module:modeling/curves/bezier.tangentAt
     */
    const tangentAt = (t, bezier) => {
      if (t < 0 || t > 1) {
        throw new Error('Bezier tangentAt() input must be between 0 and 1')
      }
      if (bezier.pointType === 'float_single') {
        return bezierTangent(bezier, bezier.points, t)
      } else {
        const result = [];
        for (let i = 0; i < bezier.dimensions; i++) {
          const singleDimensionPoints = [];
          for (let j = 0; j < bezier.points.length; j++) {
            singleDimensionPoints.push(bezier.points[j][i]);
          }
          result.push(bezierTangent(bezier, singleDimensionPoints, t));
        }
        return result
      }
    };

    const bezierTangent = function (bezier, p, t) {
      // from https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/bezier-der.html
      const n = p.length - 1;
      let result = 0;
      for (let i = 0; i < n; i++) {
        const q = n * (p[i + 1] - p[i]);
        result += bezier.tangentPermutations[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i) * q;
      }
      return result
    };

    var tangentAt_1 = tangentAt;

    /**
     * Represents a bezier easing function.
     * @see {@link bezier} for data structure information.
     * @module modeling/curves/bezier
     */
    var bezier = {
      create: create_1$6,
      valueAt: valueAt_1,
      tangentAt: tangentAt_1
    };

    /**
     * Curves are n-dimensional mathematical constructs that define a path from point 0 to point 1.
     * @module modeling/curves
     * @example
     * const { bezier } = require('@jscad/modeling').curves

     */
    var curves = {
      bezier: bezier
    };

    /**
     * Calculate the area under the given points.
     * @param {Array} points - list of 2D points
     * @return {Number} area under the given points
     * @alias module:modeling/maths/utils.area
     */
    const area$7 = (points) => {
      let area = 0;
      for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i][0] * points[j][1];
        area -= points[j][0] * points[i][1];
      }
      return (area / 2.0)
    };

    var area_1 = area$7;

    /**
     * Measure the area under the given polygon.
     *
     * @param {poly2} polygon - the polygon to measure
     * @return {Number} the area of the polygon
     * @alias module:modeling/geometries/poly2.measureArea
     */


    const measureArea$1 = (polygon) => area_1(polygon.vertices);

    var measureArea_1$1 = measureArea$1;

    /**
     * Represents a convex 2D polygon consisting of a list of ordered vertices.
     * @typedef {Object} poly2
     * @property {Array} vertices - list of ordered vertices (2D)
     */

    /**
     * Creates a new polygon with initial values.
     *
     * @param {Array} [vertices] - list of vertices (2D)
     * @returns {poly2} a new polygon
     * @alias module:modeling/geometries/poly2.create
     *
     * @example
     * let polygon = create()
     */
    const create$5 = (vertices) => {
      if (vertices === undefined || vertices.length < 3) {
        vertices = []; // empty contents
      }
      return { vertices: vertices }
    };

    var create_1$5 = create$5;

    /**
     * Flip the give polygon, rotating the opposite direction.
     *
     * @param {poly2} polygon - the polygon to flip
     * @returns {poly2} a new polygon
     * @alias module:modeling/geometries/poly2.flip
     */
    const flip = (polygon) => {
      const vertices = polygon.vertices.slice().reverse();
      return create_1$5(vertices)
    };

    var flip_1 = flip;

    /**
     * Determine if the given points are inside the given polygon.
     *
     * @param {Array} points - a list of points, where each point is an array with X and Y values
     * @param {poly2} polygon - a 2D polygon
     * @return {Integer} 1 if all points are inside, 0 if some or none are inside
     * @alias module:modeling/geometries/poly2.arePointsInside
     */
    const arePointsInside$1 = (points, polygon) => {
      if (points.length === 0) return 0 // nothing to check

      const vertices = polygon.vertices;
      if (vertices.length < 3) return 0 // nothing can be inside an empty polygon

      if (measureArea_1$1(polygon) < 0) {
        polygon = flip_1(polygon); // CCW is required
      }

      const sum = points.reduce((acc, point) => acc + isPointInside(point, vertices), 0);
      return sum === points.length ? 1 : 0
    };

    /*
     * Determine if the given point is inside the polygon.
     *
     * @see http://erich.realtimerendering.com/ptinpoly/ (Crossings Test)
     * @param {Array} point - an array with X and Y values
     * @param {Array} polygon - a list of points, where each point is an array with X and Y values
     * @return {Integer} 1 if the point is inside, 0 if outside
     */
    const isPointInside = (point, polygon) => {
      const numverts = polygon.length;

      const tx = point[0];
      const ty = point[1];

      let vtx0 = polygon[numverts - 1];
      let vtx1 = polygon[0];

      let yflag0 = (vtx0[1] > ty);

      let insideFlag = 0;

      let i = 0;
      for (let j = (numverts + 1); --j;) {
        /*
         * check if Y endpoints straddle (are on opposite sides) of point's Y
         * if so, +X ray could intersect this edge.
         */
        const yflag1 = (vtx1[1] > ty);
        if (yflag0 !== yflag1) {
          /*
           * check if X endpoints are on same side of the point's X
           * if so, it's easy to test if edge hits or misses.
           */
          const xflag0 = (vtx0[0] > tx);
          const xflag1 = (vtx1[0] > tx);
          if (xflag0 && xflag1) {
            /* if edge's X values are both right of the point, then the point must be inside */
            insideFlag = !insideFlag;
          } else {
            /*
             * if X endpoints straddle the point, then
             * the compute intersection of polygon edge with +X ray
             * if intersection >= point's X then the +X ray hits it.
             */
            if ((vtx1[0] - (vtx1[1] - ty) * (vtx0[0] - vtx1[0]) / (vtx0[1] - vtx1[1])) >= tx) {
              insideFlag = !insideFlag;
            }
          }
        }
        /* move to next pair of vertices, retaining info as possible */
        yflag0 = yflag1;
        vtx0 = vtx1;
        vtx1 = polygon[++i];
      }
      return insideFlag
    };

    var arePointsInside_1 = arePointsInside$1;

    /**
     * Represents a 2D polygon consisting of a list of ordered vertices.
     * @see {@link poly2} for data structure information.
     * @module modeling/geometries/poly2
     *
     * @example
     * poly2.create([[0,0], [4,0], [4,3]])
     *
     * @example
     * {"vertices": [[0,0], [4,0], [4,3]]}
     */
    var poly2 = {
      arePointsInside: arePointsInside_1,
      create: create_1$5,
      flip: flip_1,
      measureArea: measureArea_1$1
    };

    /**
     * Geometries are objects that represent the contents of primitives or the results of operations.
     * Note: Geometries are considered immutable, so never change the contents directly.
     *
     * @see {@link geom2} - 2D geometry consisting of sides
     * @see {@link geom3} - 3D geometry consisting of polygons
     * @see {@link path2} - 2D geometry consisting of ordered points
     * @see {@link poly2} - 2D polygon consisting of ordered vertices
     * @see {@link poly3} - 3D polygon consisting of ordered vertices
     *
     * @module modeling/geometries
     * @example
     * const { geom2, geom3, path2, poly2, poly3 } = require('@jscad/modeling').geometries
     */
    var geometries = {
      geom2: geom2$2,
      geom3: geom3$2,
      path2: path2$2,
      poly2: poly2,
      poly3: poly3
    };

    /**
     * Represents a unbounded line in 2D space, positioned at a point of origin.
     * A line is parametrized by a normal vector (perpendicular to the line, rotated 90 degrees counter clockwise) and
     * distance from the origin.
     *
     * Equation: A Point (P) is on Line (L) if dot(L.normal, P) == L.distance
     *
     * The contents of the array are a normal [0,1] and a distance [2].
     * @typedef {Array} line2
     */

    /**
     * Create a line, positioned at 0,0, and running along the X axis.
     *
     * @returns {line2} a new unbounded line
     * @alias module:modeling/maths/line2.create
     */
    const create$4 = () => [0, 1, 0]; // normal and distance

    var create_1$4 = create$4;

    /**
     * Create a clone of the given line.
     *
     * @param {line2} line - line to clone
     * @returns {line2} a new unbounded line
     * @alias module:modeling/maths/line2.clone
     */
    const clone$4 = (line) => {
      const out = create_1$4();
      out[0] = line[0];
      out[1] = line[1];
      out[2] = line[2];
      return out
    };

    var clone_1$3 = clone$4;

    /**
     * Return the direction of the given line.
     *
     * @param {line2} line - line of reference
     * @return {vec2} a vector in the direction of the line
     * @alias module:modeling/maths/line2.direction
     */
    const direction$1 = (line) => {
      const vector = vec2.normal(vec2.create(), line);
      vec2.negate(vector, vector);
      return vector
    };

    var direction_1$1 = direction$1;

    /**
     * Return the origin of the given line.
     *
     * @param {line2} line - line of reference
     * @return {vec2} the origin of the line
     * @alias module:modeling/maths/line2.origin
     */
    const origin$1 = (line) => vec2.scale(vec2.create(), line, line[2]);

    var origin_1$1 = origin$1;

    /**
     * Determine the closest point on the given line to the given point.
     *
     * @param {line2} line - line of reference
     * @param {vec2} point - point of reference
     * @returns {vec2} closest point
     * @alias module:modeling/maths/line2.closestPoint
     */
    const closestPoint$1 = (line, point) => {
      // linear function of AB
      const a = origin_1$1(line);
      const b = direction_1$1(line);
      const m1 = (b[1] - a[1]) / (b[0] - a[0]);
      const t1 = a[1] - m1 * a[0];
      // linear function of PC
      const m2 = -1 / m1; // perpendicular
      const t2 = point[1] - m2 * point[0];
      // c.x * m1 + t1 === c.x * m2 + t2
      const x = (t2 - t1) / (m1 - m2);
      const y = m1 * x + t1;

      const closest = vec2.fromValues(x, y);
      return closest
    };

    var closestPoint_1$1 = closestPoint$1;

    /**
     * Copy the given line to the receiving line.
     *
     * @param {line2} out - receiving line
     * @param {line2} line - line to copy
     * @returns {line2} out
     * @alias module:modeling/maths/line2.copy
     */
    const copy$2 = (out, line) => {
      out[0] = line[0];
      out[1] = line[1];
      out[2] = line[2];
      return out
    };

    var copy_1$2 = copy$2;

    /**
     * Calculate the distance (positive) between the given point and line.
     *
     * @param {line2} line - line of reference
     * @param {vec2} point - point of reference
     * @return {Number} distance between line and point
     * @alias module:modeling/maths/line2.distanceToPoint
     */
    const distanceToPoint$1 = (line, point) => {
      let distance = vec2.dot(point, line);
      distance = Math.abs(distance - line[2]);
      return distance
    };

    var distanceToPoint_1$1 = distanceToPoint$1;

    /**
     * Compare the given lines for equality.
     *
     * @param {line2} line1 - first line to compare
     * @param {line2} line2 - second line to compare
     * @return {Boolean} true if lines are equal
     * @alias module:modeling/maths/line2.equals
     */
    const equals$3 = (line1, line2) => (line1[0] === line2[0]) && (line1[1] === line2[1] && (line1[2] === line2[2]));

    var equals_1$2 = equals$3;

    /**
     * Create a new line that passes through the given points.
     *
     * @param {line2} out - receiving line
     * @param {vec2} point1 - start point of the line
     * @param {vec2} point2 - end point of the line
     * @returns {line2} a new unbounded line
     * @alias module:modeling/maths/line2.fromPoints
     */
    const fromPoints$2 = (out, point1, point2) => {
      const vector = vec2.subtract(vec2.create(), point2, point1); // directional vector

      vec2.normal(vector, vector);
      vec2.normalize(vector, vector); // normalized

      const distance = vec2.dot(point1, vector);

      out[0] = vector[0];
      out[1] = vector[1];
      out[2] = distance;
      return out
    };

    var fromPoints_1$2 = fromPoints$2;

    /**
     * Creates a new line initialized with the given values.
     *
     * @param {Number} x - X coordinate of the unit normal
     * @param {Number} y - Y coordinate of the unit normal
     * @param {Number} d - distance of the line from [0,0]
     * @returns {line2} a new unbounded line
     * @alias module:modeling/maths/line2.fromValues
     */
    const fromValues = (x, y, d) => {
      const out = create_1$4();
      out[0] = x;
      out[1] = y;
      out[2] = d;
      return out
    };

    var fromValues_1 = fromValues;

    // Normals are directional vectors with component values from 0 to 1.0, requiring specialized comparison
    // This EPS is derived from a series of tests to determine the optimal precision for comparing coplanar polygons,
    // as provided by the sphere primitive at high segmentation
    // This EPS is for 64 bit Number values
    const NEPS$4 = 1e-13;

    /**
     * Compare two normals (unit vectors) for near equality.
     * @param {vec3} a - normal a
     * @param {vec3} b - normal b
     * @returns {Boolean} true if a and b are nearly equal
     * @alias module:modeling/maths/utils.aboutEqualNormals
     */
    const aboutEqualNormals$2 = (a, b) => (Math.abs(a[0] - b[0]) <= NEPS$4 && Math.abs(a[1] - b[1]) <= NEPS$4 && Math.abs(a[2] - b[2]) <= NEPS$4);

    var aboutEqualNormals_1 = aboutEqualNormals$2;

    /**
     * Get the X coordinate of a point with a certain Y coordinate, interpolated between two points.
     * Interpolation is robust even if the points have the same Y coordinate
     * @param {vec2} point1
     * @param {vec2} point2
     * @param {Number} y
     * @return {Array} X and Y of interpolated point
     * @alias module:modeling/maths/utils.interpolateBetween2DPointsForY
     */
    const interpolateBetween2DPointsForY = (point1, point2, y) => {
      let f1 = y - point1[1];
      let f2 = point2[1] - point1[1];
      if (f2 < 0) {
        f1 = -f1;
        f2 = -f2;
      }
      let t;
      if (f1 <= 0) {
        t = 0.0;
      } else if (f1 >= f2) {
        t = 1.0;
      } else if (f2 < 1e-10) { // FIXME Should this be EPS?
        t = 0.5;
      } else {
        t = f1 / f2;
      }
      const result = point1[0] + t * (point2[0] - point1[0]);
      return result
    };

    var interpolateBetween2DPointsForY_1 = interpolateBetween2DPointsForY;

    /**
     * Calculate the intersect point of the two line segments (p1-p2 and p3-p4), end points included.
     * Note: If the line segments do NOT intersect then undefined is returned.
     * @see http://paulbourke.net/geometry/pointlineplane/
     * @param {vec2} p1 - first point of first line segment
     * @param {vec2} p2 - second point of first line segment
     * @param {vec2} p3 - first point of second line segment
     * @param {vec2} p4 - second point of second line segment
     * @returns {vec2} intersection point of the two line segments, or undefined
     * @alias module:modeling/maths/utils.intersect
     */
    const intersect$4 = (p1, p2, p3, p4) => {
      // Check if none of the lines are of length 0
      if ((p1[0] === p2[0] && p1[1] === p2[1]) || (p3[0] === p4[0] && p3[1] === p4[1])) {
        return undefined
      }

      const denominator = ((p4[1] - p3[1]) * (p2[0] - p1[0]) - (p4[0] - p3[0]) * (p2[1] - p1[1]));

      // Lines are parallel
      if (Math.abs(denominator) < Number.MIN_VALUE) {
        return undefined
      }

      const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / denominator;
      const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / denominator;

      // is the intersection along the segments
      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return undefined
      }

      // Return the x and y coordinates of the intersection
      const x = p1[0] + ua * (p2[0] - p1[0]);
      const y = p1[1] + ua * (p2[1] - p1[1]);

      return [x, y]
    };

    var intersect_1$1 = intersect$4;

    const solve2Linear$2 = (a, b, c, d, u, v) => {
      const det = a * d - b * c;
      const invdet = 1.0 / det;
      let x = u * d - b * v;
      let y = -u * c + a * v;
      x *= invdet;
      y *= invdet;
      return [x, y]
    };

    var solve2Linear_1 = solve2Linear$2;

    /**
     * Utility functions for maths.
     * @module modeling/maths/utils
     * @example
     * const { area, solve2Linear } = require('@jscad/maths').utils
     */
    var utils$1 = {
      aboutEqualNormals: aboutEqualNormals_1,
      area: area_1,
      interpolateBetween2DPointsForY: interpolateBetween2DPointsForY_1,
      intersect: intersect_1$1,
      solve2Linear: solve2Linear_1
    };

    const { solve2Linear: solve2Linear$1 } = utils$1;

    /**
     * Return the point of intersection between the given lines.
     *
     * NOTES:
     * The point will have Infinity values if the lines are parallel.
     * The point will have NaN values if the lines are the same.
     *
     * @param {line2} line1 - line of reference
     * @param {line2} line2 - line of reference
     * @return {vec2} the point of intersection
     * @alias module:modeling/maths/line2.intersectPointOfLines
     */
    const intersectToLine = (line1, line2) => {
      const point = solve2Linear$1(line1[0], line1[1], line2[0], line2[1], line1[2], line2[2]);
      return vec2.clone(point)
    };

    var intersectPointOfLines = intersectToLine;

    /**
     * Create a new line in the opposite direction as the given.
     *
     * @param {line2} out - receiving line
     * @param {line2} line - line to reverse
     * @returns {line2} out
     * @alias module:modeling/maths/line2.reverse
     */
    const reverse$2 = (out, line) => {
      const normal = vec2.negate(vec2.create(), line);
      const distance = -line[2];
      return copy_1$2(out, fromValues_1(normal[0], normal[1], distance))
    };

    var reverse_1$2 = reverse$2;

    /**
     * Return a string representing the given line.
     *
     * @param {line2} line - line of reference
     * @returns {String} string representation
     * @alias module:modeling/maths/line2.toString
     */
    const toString$2 = (line) => `line2: (${line[0].toFixed(7)}, ${line[1].toFixed(7)}, ${line[2].toFixed(7)})`;

    var toString_1$2 = toString$2;

    /**
     * Transforms the given line using the given matrix.
     *
     * @param {line2} out - receiving line
     * @param {line2} line - line to transform
     * @param {mat4} matrix - matrix to transform with
     * @returns {line2} out
     * @alias module:modeling/maths/line2.transform
     */
    const transform$4 = (out, line, matrix) => {
      const org = origin_1$1(line);
      const dir = direction_1$1(line);

      vec2.transform(org, org, matrix);
      vec2.transform(dir, dir, matrix);

      return fromPoints_1$2(out, org, dir)
    };

    var transform_1$4 = transform$4;

    /**
     * Determine the X coordinate of the given line at the Y coordinate.
     *
     * The X coordinate will be Infinity if the line is parallel to the X axis.
     *
     * @param {line2} line - line of reference
     * @param {Number} y - Y coordinate on the line
     * @return {Number} the X coordinate on the line
     * @alias module:modeling/maths/line2.xAtY
     */
    const xAtY = (line, y) => {
      let x = (line[2] - (line[1] * y)) / line[0];
      if (Number.isNaN(x)) {
        const org = origin_1$1(line);
        x = org[0];
      }
      return x
    };

    var xAtY_1 = xAtY;

    /**
     * Represents a unbounded line in 2D space, positioned at a point of origin.
     * @see {@link line2} for data structure information.
     * @module modeling/maths/line2
     */
    var line2 = {
      clone: clone_1$3,
      closestPoint: closestPoint_1$1,
      copy: copy_1$2,
      create: create_1$4,
      direction: direction_1$1,
      distanceToPoint: distanceToPoint_1$1,
      equals: equals_1$2,
      fromPoints: fromPoints_1$2,
      fromValues: fromValues_1,
      intersectPointOfLines: intersectPointOfLines,
      origin: origin_1$1,
      reverse: reverse_1$2,
      toString: toString_1$2,
      transform: transform_1$4,
      xAtY: xAtY_1
    };

    /**
     * Represents a unbounded line in 3D space, positioned at a point of origin.
     * A line is parametrized by a point of origin and a directional vector.
     *
     * The array contents are two 3D vectors; origin [0,0,0] and directional vector [0,0,1].
     * @see https://en.wikipedia.org/wiki/Hesse_normal_form
     * @typedef {Array} line3
     */

    /**
     * Create a line, positioned at 0,0,0 and lying on the X axis.
     *
     * @returns {line3} a new unbounded line
     * @alias module:modeling/maths/line3.create
     */
    const create$3 = () => [
      vec3$1.fromValues(0, 0, 0), // origin
      vec3$1.fromValues(0, 0, 1) // direction
    ];

    var create_1$3 = create$3;

    /**
     * Create a clone of the given line.
     *
     * @param {line3} line - line to clone
     * @returns {line3} a new unbounded line
     * @alias module:modeling/maths/line3.clone
     */
    const clone$3 = (line) => {
      const out = create_1$3();
      vec3$1.copy(out[0], line[0]);
      vec3$1.copy(out[1], line[1]);
      return out
    };

    var clone_1$2 = clone$3;

    /**
     * Determine the closest point on the given line to the given point.
     *
     * @param {line3} line - line of reference
     * @param {vec3} point - point of reference
     * @returns {vec3} a point
     * @alias module:modeling/maths/line3.closestPoint
     */
    const closestPoint = (line, point) => {
      const lpoint = line[0];
      const ldirection = line[1];

      const a = vec3$1.dot(vec3$1.subtract(vec3$1.create(), point, lpoint), ldirection);
      const b = vec3$1.dot(ldirection, ldirection);
      const t = a / b;

      const closestpoint = vec3$1.scale(vec3$1.create(), ldirection, t);
      vec3$1.add(closestpoint, closestpoint, lpoint);
      return closestpoint
    };

    var closestPoint_1 = closestPoint;

    /**
     * Copy the given line into the receiving line.
     *
     * @param {line3} out - receiving line
     * @param {line3} line - line to copy
     * @returns {line3} out
     * @alias module:modeling/maths/line3.copy
     */
    const copy$1 = (out, line) => {
      vec3$1.copy(out[0], line[0]);
      vec3$1.copy(out[1], line[1]);
      return out
    };

    var copy_1$1 = copy$1;

    /**
     * Return the direction of the given line.
     *
     * @param {line3} line - line for reference
     * @return {vec3} the relative vector in the direction of the line
     * @alias module:modeling/maths/line3.direction
     */
    const direction = (line) => line[1];

    var direction_1 = direction;

    /**
     * Calculate the distance (positive) between the given point and line.
     *
     * @param {line3} line - line of reference
     * @param {vec3} point - point of reference
     * @return {Number} distance between line and point
     * @alias module:modeling/maths/line3.distanceToPoint
     */
    const distanceToPoint = (line, point) => {
      const closest = closestPoint_1(line, point);
      const distancevector = vec3$1.subtract(vec3$1.create(), point, closest);
      return vec3$1.length(distancevector)
    };

    var distanceToPoint_1 = distanceToPoint;

    /**
     * Compare the given lines for equality.
     *
     * @param {line3} line1 - first line to compare
     * @param {line3} line2 - second line to compare
     * @return {Boolean} true if lines are equal
     * @alias module:modeling/maths/line3.equals
     */
    const equals$2 = (line1, line2) => {
      // compare directions (unit vectors)
      if (!vec3$1.equals(line1[1], line2[1])) return false

      // compare points
      if (!vec3$1.equals(line1[0], line2[0])) return false

      // why would lines with the same slope (direction) and different points be equal?
      // let distance = distanceToPoint(line1, line2[0])
      // if (distance > EPS) return false

      return true
    };

    var equals_1$1 = equals$2;

    /**
     * Create a line from the given point (origin) and direction.
     *
     * The point can be any random point on the line.
     * The direction must be a vector with positive or negative distance from the point.
     *
     * See the logic of fromPoints() for appropriate values.
     *
     * @param {line3} out - receiving line
     * @param {vec3} point - start point of the line segment
     * @param {vec3} direction - direction of the line segment
     * @returns {line3} out
     * @alias module:modeling/maths/line3.fromPointAndDirection
     */
    const fromPointAndDirection = (out, point, direction) => {
      const unit = vec3$1.normalize(vec3$1.create(), direction);

      vec3$1.copy(out[0], point);
      vec3$1.copy(out[1], unit);
      return out
    };

    var fromPointAndDirection_1 = fromPointAndDirection;

    const { solve2Linear } = utils$1;

    const { EPS: EPS$e } = constants;



    /**
     * Create a line the intersection of the given planes.
     *
     * @param {line3} out - receiving line
     * @param {plane} plane1 - first plane of reference
     * @param {plane} plane2 - second plane of reference
     * @returns {line3} out
     * @alias module:modeling/maths/line3.fromPlanes
     */
    const fromPlanes = (out, plane1, plane2) => {
      let direction = vec3$1.cross(vec3$1.create(), plane1, plane2);
      let length = vec3$1.length(direction);
      if (length < EPS$e) {
        throw new Error('parallel planes do not intersect')
      }
      length = (1.0 / length);
      direction = vec3$1.scale(direction, direction, length);

      const absx = Math.abs(direction[0]);
      const absy = Math.abs(direction[1]);
      const absz = Math.abs(direction[2]);
      let origin;
      let r;
      if ((absx >= absy) && (absx >= absz)) {
        // find a point p for which x is zero
        r = solve2Linear(plane1[1], plane1[2], plane2[1], plane2[2], plane1[3], plane2[3]);
        origin = vec3$1.fromValues(0, r[0], r[1]);
      } else if ((absy >= absx) && (absy >= absz)) {
        // find a point p for which y is zero
        r = solve2Linear(plane1[0], plane1[2], plane2[0], plane2[2], plane1[3], plane2[3]);
        origin = vec3$1.fromValues(r[0], 0, r[1]);
      } else {
        // find a point p for which z is zero
        r = solve2Linear(plane1[0], plane1[1], plane2[0], plane2[1], plane1[3], plane2[3]);
        origin = vec3$1.fromValues(r[0], r[1], 0);
      }
      return fromPointAndDirection_1(out, origin, direction)
    };

    var fromPlanes_1 = fromPlanes;

    /**
     * Create a line that passes through the given points.
     *
     * @param {line3} out - receiving line
     * @param {vec3} point1 - start point of the line segment
     * @param {vec3} point2 - end point of the line segment
     * @returns {line3} out
     * @alias module:modeling/maths/line3.fromPoints
     */
    const fromPoints$1 = (out, point1, point2) => {
      const direction = vec3$1.subtract(vec3$1.create(), point2, point1);
      return fromPointAndDirection_1(out, point1, direction)
    };

    var fromPoints_1$1 = fromPoints$1;

    /**
     * Determine the closest point on the given plane to the given line.
     *
     * NOTES:
     * The point of intersection will be invalid if the line is parallel to the plane, e.g. NaN.
     *
     * @param {line3} line - line of reference
     * @param {plane} plane - plane of reference
     * @returns {vec3} a point on the line
     * @alias module:modeling/maths/line3.intersectPointOfLineAndPlane
     */
    const intersectToPlane = (line, plane) => {
      // plane: plane.normal * p = plane.w
      const pnormal = plane;
      const pw = plane[3];

      const lpoint = line[0];
      const ldirection = line[1];

      // point: p = line.point + labda * line.direction
      const labda = (pw - vec3$1.dot(pnormal, lpoint)) / vec3$1.dot(pnormal, ldirection);

      const point = vec3$1.add(vec3$1.create(), lpoint, vec3$1.scale(vec3$1.create(), ldirection, labda));
      return point
    };

    var intersectPointOfLineAndPlane = intersectToPlane;

    /**
     * Return the origin of the given line.
     *
     * @param {line3} line - line of reference
     * @return {vec3} the origin of the line
     * @alias module:modeling/maths/line3.origin
     */
    const origin = (line) => line[0];

    var origin_1 = origin;

    /**
     * Create a line in the opposite direction as the given.
     *
     * @param {line3} out - receiving line
     * @param {line3} line - line to reverse
     * @returns {line3} out
     * @alias module:modeling/maths/line3.reverse
     */
    const reverse$1 = (out, line) => {
      const point = vec3$1.clone(line[0]);
      const direction = vec3$1.negate(vec3$1.create(), line[1]);
      return fromPointAndDirection_1(out, point, direction)
    };

    var reverse_1$1 = reverse$1;

    /**
     * Return a string representing the given line.
     *
     * @param {line3} line - line of reference
     * @returns {String} string representation
     * @alias module:modeling/maths/line3.toString
     */
    const toString$1 = (line) => {
      const point = line[0];
      const direction = line[1];
      return `line3: point: (${point[0].toFixed(7)}, ${point[1].toFixed(7)}, ${point[2].toFixed(7)}) direction: (${direction[0].toFixed(7)}, ${direction[1].toFixed(7)}, ${direction[2].toFixed(7)})`
    };

    var toString_1$1 = toString$1;

    /**
     * Transforms the given line using the given matrix.
     *
     * @param {line3} out - line to update
     * @param {line3} line - line to transform
     * @param {mat4} matrix - matrix to transform with
     * @returns {line3} a new unbounded line
     * @alias module:modeling/maths/line3.transform
     */
    const transform$3 = (out, line, matrix) => {
      const point = line[0];
      const direction = line[1];
      const pointPlusDirection = vec3$1.add(vec3$1.create(), point, direction);

      const newpoint = vec3$1.transform(vec3$1.create(), point, matrix);
      const newPointPlusDirection = vec3$1.transform(pointPlusDirection, pointPlusDirection, matrix);
      const newdirection = vec3$1.subtract(newPointPlusDirection, newPointPlusDirection, newpoint);

      return fromPointAndDirection_1(out, newpoint, newdirection)
    };

    var transform_1$3 = transform$3;

    /**
     * Represents a unbounded line in 3D space, positioned at a point of origin.
     * @see {@link line3} for data structure information.
     * @module modeling/maths/line3
     */
    var line3 = {
      clone: clone_1$2,
      closestPoint: closestPoint_1,
      copy: copy_1$1,
      create: create_1$3,
      direction: direction_1,
      distanceToPoint: distanceToPoint_1,
      equals: equals_1$1,
      fromPlanes: fromPlanes_1,
      fromPointAndDirection: fromPointAndDirection_1,
      fromPoints: fromPoints_1$1,
      intersectPointOfLineAndPlane: intersectPointOfLineAndPlane,
      origin: origin_1,
      reverse: reverse_1$1,
      toString: toString_1$1,
      transform: transform_1$3
    };

    /**
     * Calculates the dot product of the given vectors.
     *
     * @param {vec4} a - first vector
     * @param {vec4} b - second vector
     * @returns {Number} dot product
     * @alias module:modeling/maths/vec4.dot
     */
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

    var dot_1 = dot;

    /**
     * Create a new vector from the given scalar value.
     *
     * @param {vec4} out - receiving vector
     * @param  {Number} scalar
     * @returns {vec4} out
     * @alias module:modeling/maths/vec4.fromScalar
     */
    const fromScalar = (out, scalar) => {
      out[0] = scalar;
      out[1] = scalar;
      out[2] = scalar;
      out[3] = scalar;
      return out
    };

    var fromScalar_1 = fromScalar;

    /**
     * Transform the given vector using the given matrix.
     *
     * @param {vec4} out - receiving vector
     * @param {vec4} vector - vector to transform
     * @param {mat4} matrix - matrix to transform with
     * @returns {vec4} out
     * @alias module:modeling/maths/vec4.transform
     */
    const transform$2 = (out, vector, matrix) => {
      const [x, y, z, w] = vector;

      out[0] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w;
      out[1] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w;
      out[2] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w;
      out[3] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w;
      return out
    };

    var transform_1$2 = transform$2;

    /**
     * Represents a four dimensional vector.
     * @see {@link vec4} for data structure information.
     * @module modeling/maths/vec4
     */
    var vec4 = {
      clone: clone_1$5,
      copy: copy_1$3,
      create: create_1$8,
      dot: dot_1,
      equals: equals_1$4,
      fromScalar: fromScalar_1,
      fromValues: fromValues_1$1,
      toString: toString_1$6,
      transform: transform_1$2
    };

    /**
     * Maths are computational units for fundamental Euclidean geometry. All maths operate upon array data structures.
     * Note: Maths data structures are considered immutable, so never change the contents directly.
     * @see Most computations are based upon the glMatrix library (glmatrix.net)
     * @module modeling/maths
     * @example
     * const { constants, line2, mat4, vec2, vec3 } = require('@jscad/modeling').maths

     */
    var maths = {
      constants: constants,
      line2: line2,
      line3: line3,
      mat4: mat4,
      plane: plane$1,
      utils: utils$1,
      vec2: vec2,
      vec3: vec3$1,
      vec4: vec4
    };

    const cache$2 = new WeakMap();

    /*
     * Measure the area of the given geometry.
     * NOTE: paths are infinitely narrow and do not have an area
     *
     * @param {path2} geometry - geometry to measure
     * @returns {Number} area of the geometry
     */
    const measureAreaOfPath2 = () => 0;

    /*
     * Measure the area of the given geometry.
     * For a counter clockwise rotating geometry (about Z) the area is positive, otherwise negative.
     *
     * @see http://paulbourke.net/geometry/polygonmesh/
     * @param {geom2} geometry - 2D geometry to measure
     * @returns {Number} area of the geometry
     */
    const measureAreaOfGeom2 = (geometry) => {
      let area = cache$2.get(geometry);
      if (area) return area

      const sides = geom2$2.toSides(geometry);
      area = sides.reduce((area, side) => area + (side[0][0] * side[1][1] - side[0][1] * side[1][0]), 0);
      area *= 0.5;

      cache$2.set(geometry, area);

      return area
    };

    /*
     * Measure the area of the given geometry.
     *
     * @param {geom3} geometry - 3D geometry to measure
     * @returns {Number} area of the geometry
     */
    const measureAreaOfGeom3 = (geometry) => {
      let area = cache$2.get(geometry);
      if (area) return area

      const polygons = geom3$2.toPolygons(geometry);
      area = polygons.reduce((area, polygon) => area + poly3.measureArea(polygon), 0);

      cache$2.set(geometry, area);

      return area
    };

    /**
     * Measure the area of the given geometries.
     * @param {...Objects} geometries - the geometries to measure
     * @return {Number|Array} the area, or a list of areas for each geometry
     * @alias module:modeling/measurements.measureArea
     *
     * @example
     * let area = measureArea(sphere())
     */
    const measureArea = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      const results = geometries.map((geometry) => {
        if (path2$2.isA(geometry)) return measureAreaOfPath2()
        if (geom2$2.isA(geometry)) return measureAreaOfGeom2(geometry)
        if (geom3$2.isA(geometry)) return measureAreaOfGeom3(geometry)
        return 0
      });
      return results.length === 1 ? results[0] : results
    };

    var measureArea_1 = measureArea;

    /**
     * Measure the total (aggregate) area for the given geometries.
     * Note: This measurement will not account for overlapping geometry
     * @param {...Object} geometries - the geometries to measure.
     * @return {Number} the total surface area for the group of geometry.
     * @alias module:modeling/measurements.measureAggregateArea
     *
     * @example
     * let totalArea = measureAggregateArea(sphere(),cube())
     */
    const measureAggregateArea = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('measureAggregateArea: no geometries supplied')
      const areas = measureArea_1(geometries);
      if (geometries.length === 1) {
        return areas
      }
      const result = 0;
      return areas.reduce((result, area) => result + area, result)
    };

    var measureAggregateArea_1 = measureAggregateArea;

    const cache$1 = new WeakMap();

    /*
     * Measure the min and max bounds of the given (path2) geometry.
     * @return {Array[]} the min and max bounds for the geometry
     */
    const measureBoundingBoxOfPath2 = (geometry) => {
      let boundingBox = cache$1.get(geometry);
      if (boundingBox) return boundingBox

      const points = path2$2.toPoints(geometry);

      let minpoint;
      if (points.length === 0) {
        minpoint = vec2.create();
      } else {
        minpoint = vec2.clone(points[0]);
      }
      let maxpoint = vec2.clone(minpoint);

      points.forEach((point) => {
        vec2.min(minpoint, minpoint, point);
        vec2.max(maxpoint, maxpoint, point);
      });
      minpoint = [minpoint[0], minpoint[1], 0];
      maxpoint = [maxpoint[0], maxpoint[1], 0];

      boundingBox = [minpoint, maxpoint];

      cache$1.set(geometry, boundingBox);

      return boundingBox
    };

    /*
     * Measure the min and max bounds of the given (geom2) geometry.
     * @return {Array[]} the min and max bounds for the geometry
     */
    const measureBoundingBoxOfGeom2 = (geometry) => {
      let boundingBox = cache$1.get(geometry);
      if (boundingBox) return boundingBox

      const points = geom2$2.toPoints(geometry);

      let minpoint;
      if (points.length === 0) {
        minpoint = vec2.create();
      } else {
        minpoint = vec2.clone(points[0]);
      }
      let maxpoint = vec2.clone(minpoint);

      points.forEach((point) => {
        vec2.min(minpoint, minpoint, point);
        vec2.max(maxpoint, maxpoint, point);
      });

      minpoint = [minpoint[0], minpoint[1], 0];
      maxpoint = [maxpoint[0], maxpoint[1], 0];

      boundingBox = [minpoint, maxpoint];

      cache$1.set(geometry, boundingBox);

      return boundingBox
    };

    /*
     * Measure the min and max bounds of the given (geom3) geometry.
     * @return {Array[]} the min and max bounds for the geometry
     */
    const measureBoundingBoxOfGeom3 = (geometry) => {
      let boundingBox = cache$1.get(geometry);
      if (boundingBox) return boundingBox

      const polygons = geom3$2.toPolygons(geometry);

      let minpoint = vec3$1.create();
      if (polygons.length > 0) {
        const points = poly3.toPoints(polygons[0]);
        vec3$1.copy(minpoint, points[0]);
      }
      let maxpoint = vec3$1.clone(minpoint);

      polygons.forEach((polygon) => {
        poly3.toPoints(polygon).forEach((point) => {
          vec3$1.min(minpoint, minpoint, point);
          vec3$1.max(maxpoint, maxpoint, point);
        });
      });

      minpoint = [minpoint[0], minpoint[1], minpoint[2]];
      maxpoint = [maxpoint[0], maxpoint[1], maxpoint[2]];

      boundingBox = [minpoint, maxpoint];

      cache$1.set(geometry, boundingBox);

      return boundingBox
    };

    /**
     * Measure the min and max bounds of the given geometries.
     * @param {...Object} geometries - the geometries to measure
     * @return {Array} the min and max bounds, or a list of bounds for each geometry
     * @alias module:modeling/measurements.measureBoundingBox
     *
     * @example
     * let bounds = measureBoundingBox(sphere())
     */
    const measureBoundingBox = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      const results = geometries.map((geometry) => {
        if (path2$2.isA(geometry)) return measureBoundingBoxOfPath2(geometry)
        if (geom2$2.isA(geometry)) return measureBoundingBoxOfGeom2(geometry)
        if (geom3$2.isA(geometry)) return measureBoundingBoxOfGeom3(geometry)
        return [[0, 0, 0], [0, 0, 0]]
      });
      return results.length === 1 ? results[0] : results
    };

    var measureBoundingBox_1 = measureBoundingBox;

    /**
     * Measure the aggregated minimum and maximum bounds for the given geometries.
     * @param {...Object} geometries - the geometries to measure
     * @return {Array} the min and max bounds for the group of geometry, i.e. [[x,y,z],[X,Y,Z]]
     * @alias module:modeling/measurements.measureAggregateBoundingBox
     *
     * @example
     * let bounds = measureAggregateBoundingBox(sphere(),cube())
     */
    const measureAggregateBoundingBox = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('measureAggregateBoundingBox: no geometries supplied')
      const bounds = measureBoundingBox_1(geometries);
      if (geometries.length === 1) {
        return bounds
      }
      const result = [[Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE], [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE]];
      return bounds.reduce((result, item) => {
        result = [min_1$1(result[0], result[0], item[0]), max_1$1(result[1], result[1], item[1])];
        return result
      }, result)
    };

    var measureAggregateBoundingBox_1 = measureAggregateBoundingBox;

    const { EPS: EPS$d } = constants;

    const calculateEpsilonFromBounds = (bounds, dimensions) => {
      let total = 0;
      for (let i = 0; i < dimensions; i++) {
        total += bounds[1][i] - bounds[0][i];
      }
      return EPS$d * total / dimensions
    };

    var calculateEpsilonFromBounds_1 = calculateEpsilonFromBounds;

    const { geom2: geom2$1, geom3: geom3$1, path2: path2$1 } = geometries;

    /**
     * Measure the aggregated Epsilon for the given geometries.
     * @param {...Object} geometries - the geometries to measure
     * @return {Number} the aggregated Epsilon for the whole group of geometries
     * @alias module:modeling/measurements.measureAggregateEpsilon
     *
     * @example
     * let groupEpsilon = measureAggregateEpsilon(sphere(),cube())
     */
    const measureAggregateEpsilon = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('measureAggregateEpsilon: no geometries supplied')
      const bounds = measureAggregateBoundingBox_1(geometries);

      let dimensions = 0;
      dimensions = geometries.reduce((dimensions, geometry) => {
        if (path2$1.isA(geometry) || geom2$1.isA(geometry)) return Math.max(dimensions, 2)
        if (geom3$1.isA(geometry)) return Math.max(dimensions, 3)
        return 0
      }, dimensions);
      return calculateEpsilonFromBounds_1(bounds, dimensions)
    };

    var measureAggregateEpsilon_1 = measureAggregateEpsilon;

    const cache = new WeakMap();

    /*
     * Measure the volume of the given geometry.
     * NOTE: paths are infinitely narrow and do not have an volume
     *
     * @param {Path2} geometry - geometry to measure
     * @returns {Number} volume of the geometry
     */
    const measureVolumeOfPath2 = () => 0;

    /*
     * Measure the volume of the given geometry.
     * NOTE: 2D geometry are infinitely thin and do not have an volume
     *
     * @param {Geom2} geometry - 2D geometry to measure
     * @returns {Number} volume of the geometry
     */
    const measureVolumeOfGeom2 = () => 0;

    /*
     * Measure the volume of the given geometry.
     *
     * @param {Geom3} geometry - 3D geometry to measure
     * @returns {Number} volume of the geometry
     */
    const measureVolumeOfGeom3 = (geometry) => {
      let volume = cache.get(geometry);
      if (volume) return volume

      const polygons = geom3$2.toPolygons(geometry);
      volume = polygons.reduce((volume, polygon) => volume + poly3.measureSignedVolume(polygon), 0);

      cache.set(geometry, volume);

      return volume
    };

    /**
     * Measure the volume of the given geometries.
     * @param {...Object} geometries - the geometries to measure
     * @return {Number|Array} the volume, or a list of volumes for each geometry
     * @alias module:modeling/measurements.measureVolume
     *
     * @example
     * let volume = measureVolume(sphere())
     */
    const measureVolume = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      const results = geometries.map((geometry) => {
        if (path2$2.isA(geometry)) return measureVolumeOfPath2()
        if (geom2$2.isA(geometry)) return measureVolumeOfGeom2()
        if (geom3$2.isA(geometry)) return measureVolumeOfGeom3(geometry)
        return 0
      });
      return results.length === 1 ? results[0] : results
    };

    var measureVolume_1 = measureVolume;

    /**
     * Measure the total (aggregate) volume for the given geometries.
     * Note: This measurement will not account for overlapping geometry
     * @param {...Object} geometries - the geometries to measure.
     * @return {Number} the volume for the group of geometry.
     * @alias module:modeling/measurements.measureAggregateVolume
     *
     * @example
     * let totalVolume = measureAggregateVolume(sphere(),cube())
     */
    const measureAggregateVolume = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('measureAggregateVolume: no geometries supplied')
      const volumes = measureVolume_1(geometries);
      if (geometries.length === 1) {
        return volumes
      }
      const result = 0;
      return volumes.reduce((result, volume) => result + volume, result)
    };

    var measureAggregateVolume_1 = measureAggregateVolume;

    const cacheOfBoundingSpheres = new WeakMap();

    /*
     * Measure the bounding sphere of the given (path2) geometry.
     * @return {[[x, y, z], radius]} the bounding sphere for the geometry
     */
    const measureBoundingSphereOfPath2 = (geometry) => {
      let boundingSphere = cacheOfBoundingSpheres.get(geometry);
      if (boundingSphere !== undefined) return boundingSphere

      const centroid = vec3$1.create();
      let radius = 0;

      const points = path2$2.toPoints(geometry);

      if (points.length > 0) {
        // calculate the centroid of the geometry
        let numPoints = 0;
        const temp = vec3$1.create();
        points.forEach((point) => {
          vec3$1.add(centroid, centroid, vec3$1.fromVec2(temp, point, 0));
          numPoints++;
        });
        vec3$1.scale(centroid, centroid, 1 / numPoints);

        // find the farthest point from the centroid
        points.forEach((point) => {
          radius = Math.max(radius, vec2.squaredDistance(centroid, point));
        });
        radius = Math.sqrt(radius);
      }

      boundingSphere = [centroid, radius];
      cacheOfBoundingSpheres.set(geometry, boundingSphere);

      return boundingSphere
    };

    /*
     * Measure the bounding sphere of the given (geom2) geometry.
     * @return {[[x, y, z], radius]} the bounding sphere for the geometry
     */
    const measureBoundingSphereOfGeom2 = (geometry) => {
      let boundingSphere = cacheOfBoundingSpheres.get(geometry);
      if (boundingSphere !== undefined) return boundingSphere

      const centroid = vec3$1.create();
      let radius = 0;

      const sides = geom2$2.toSides(geometry);

      if (sides.length > 0) {
        // calculate the centroid of the geometry
        let numPoints = 0;
        const temp = vec3$1.create();
        sides.forEach((side) => {
          vec3$1.add(centroid, centroid, vec3$1.fromVec2(temp, side[0], 0));
          numPoints++;
        });
        vec3$1.scale(centroid, centroid, 1 / numPoints);

        // find the farthest point from the centroid
        sides.forEach((side) => {
          radius = Math.max(radius, vec2.squaredDistance(centroid, side[0]));
        });
        radius = Math.sqrt(radius);
      }

      boundingSphere = [centroid, radius];
      cacheOfBoundingSpheres.set(geometry, boundingSphere);

      return boundingSphere
    };

    /*
     * Measure the bounding sphere of the given (geom3) geometry.
     * @return {[[x, y, z], radius]} the bounding sphere for the geometry
     */
    const measureBoundingSphereOfGeom3 = (geometry) => {
      let boundingSphere = cacheOfBoundingSpheres.get(geometry);
      if (boundingSphere !== undefined) return boundingSphere

      const centroid = vec3$1.create();
      let radius = 0;

      const polygons = geom3$2.toPolygons(geometry);

      if (polygons.length > 0) {
        // calculate the centroid of the geometry
        let numPoints = 0;
        polygons.forEach((polygon) => {
          poly3.toPoints(polygon).forEach((point) => {
            vec3$1.add(centroid, centroid, point);
            numPoints++;
          });
        });
        vec3$1.scale(centroid, centroid, 1 / numPoints);

        // find the farthest point from the centroid
        polygons.forEach((polygon) => {
          poly3.toPoints(polygon).forEach((point) => {
            radius = Math.max(radius, vec3$1.squaredDistance(centroid, point));
          });
        });
        radius = Math.sqrt(radius);
      }

      boundingSphere = [centroid, radius];
      cacheOfBoundingSpheres.set(geometry, boundingSphere);

      return boundingSphere
    };

    /**
     * Measure the (approximate) bounding sphere of the given geometries.
     * @see https://en.wikipedia.org/wiki/Bounding_sphere
     * @param {...Object} geometries - the geometries to measure
     * @return {Array} the bounding sphere for each geometry, i.e. [centroid, radius]
     * @alias module:modeling/measurements.measureBoundingSphere
     *
     * @example
     * let bounds = measureBoundingSphere(cube())
     */
    const measureBoundingSphere = (...geometries) => {
      geometries = flatten_1(geometries);

      const results = geometries.map((geometry) => {
        if (path2$2.isA(geometry)) return measureBoundingSphereOfPath2(geometry)
        if (geom2$2.isA(geometry)) return measureBoundingSphereOfGeom2(geometry)
        if (geom3$2.isA(geometry)) return measureBoundingSphereOfGeom3(geometry)
        return [[0, 0, 0], 0]
      });
      return results.length === 1 ? results[0] : results
    };

    var measureBoundingSphere_1 = measureBoundingSphere;

    /**
     * Measure the center of the given geometries.
     * @param {...Object} geometries - the geometries to measure
     * @return {Array} the center point for each geometry, i.e. [X, Y, Z]
     * @alias module:modeling/measurements.measureCenter
     *
     * @example
     * let center = measureCenter(sphere())
     */
    const measureCenter = (...geometries) => {
      geometries = flatten_1(geometries);

      const results = geometries.map((geometry) => {
        const bounds = measureBoundingBox_1(geometry);
        return [
          (bounds[0][0] + ((bounds[1][0] - bounds[0][0]) / 2)),
          (bounds[0][1] + ((bounds[1][1] - bounds[0][1]) / 2)),
          (bounds[0][2] + ((bounds[1][2] - bounds[0][2]) / 2))
        ]
      });
      return results.length === 1 ? results[0] : results
    };

    var measureCenter_1 = measureCenter;

    const cacheOfCenterOfMass = new WeakMap();

    /*
     * Measure the center of mass for the given geometry.
     *
     * @see http://paulbourke.net/geometry/polygonmesh/
     * @return {Array} the center of mass for the geometry
     */
    const measureCenterOfMassGeom2 = (geometry) => {
      let centerOfMass = cacheOfCenterOfMass.get(geometry);
      if (centerOfMass !== undefined) return centerOfMass

      const sides = geom2$2.toSides(geometry);

      let area = 0;
      let x = 0;
      let y = 0;
      if (sides.length > 0) {
        for (let i = 0; i < sides.length; i++) {
          const p1 = sides[i][0];
          const p2 = sides[i][1];

          const a = p1[0] * p2[1] - p1[1] * p2[0];
          area += a;
          x += (p1[0] + p2[0]) * a;
          y += (p1[1] + p2[1]) * a;
        }
        area /= 2;

        const f = 1 / (area * 6);
        x *= f;
        y *= f;
      }

      centerOfMass = vec3$1.fromValues(x, y, 0);

      cacheOfCenterOfMass.set(geometry, centerOfMass);
      return centerOfMass
    };

    /*
     * Measure the center of mass for the given geometry.
     * @return {Array} the center of mass for the geometry
     */
    const measureCenterOfMassGeom3 = (geometry) => {
      let centerOfMass = cacheOfCenterOfMass.get(geometry);
      if (centerOfMass !== undefined) return centerOfMass

      centerOfMass = vec3$1.create(); // 0, 0, 0

      const polygons = geom3$2.toPolygons(geometry);
      if (polygons.length === 0) return centerOfMass

      let totalVolume = 0;
      const vector = vec3$1.create(); // for speed
      polygons.forEach((polygon) => {
        // calculate volume and center of each tetrahedron
        const vertices = polygon.vertices;
        for (let i = 0; i < vertices.length - 2; i++) {
          vec3$1.cross(vector, vertices[i + 1], vertices[i + 2]);
          const volume = vec3$1.dot(vertices[0], vector) / 6;

          totalVolume += volume;

          vec3$1.add(vector, vertices[0], vertices[i + 1]);
          vec3$1.add(vector, vector, vertices[i + 2]);
          const weightedCenter = vec3$1.scale(vector, vector, 1 / 4 * volume);

          vec3$1.add(centerOfMass, centerOfMass, weightedCenter);
        }
      });
      vec3$1.scale(centerOfMass, centerOfMass, 1 / totalVolume);

      cacheOfCenterOfMass.set(geometry, centerOfMass);
      return centerOfMass
    };

    /**
     * Measure the center of mass for the given geometries.
     * @param {...Object} geometries - the geometries to measure
     * @return {Array} the center of mass for each geometry, i.e. [X, Y, Z]
     * @alias module:modeling/measurements.measureCenterOfMass
     *
     * @example
     * let center = measureCenterOfMass(sphere())
     */
    const measureCenterOfMass = (...geometries) => {
      geometries = flatten_1(geometries);

      const results = geometries.map((geometry) => {
        // NOTE: center of mass for geometry path2 is not possible
        if (geom2$2.isA(geometry)) return measureCenterOfMassGeom2(geometry)
        if (geom3$2.isA(geometry)) return measureCenterOfMassGeom3(geometry)
        return [0, 0, 0]
      });
      return results.length === 1 ? results[0] : results
    };

    var measureCenterOfMass_1 = measureCenterOfMass;

    /**
     * Measure the dimensions of the given geometries.
     * @param {...Object} geometries - the geometries to measure
     * @return {Array} the dimensions for each geometry, i.e. [width, depth, height]
     * @alias module:modeling/measurements.measureDimensions
     *
     * @example
     * let dimensions = measureDimensions(sphere())
     */
    const measureDimensions = (...geometries) => {
      geometries = flatten_1(geometries);

      const results = geometries.map((geometry) => {
        const boundingBox = measureBoundingBox_1(geometry);
        return [
          boundingBox[1][0] - boundingBox[0][0],
          boundingBox[1][1] - boundingBox[0][1],
          boundingBox[1][2] - boundingBox[0][2]
        ]
      });
      return results.length === 1 ? results[0] : results
    };

    var measureDimensions_1 = measureDimensions;

    const { geom2, geom3, path2 } = geometries;




    /*
     * Measure the epsilon of the given (path2) geometry.
     * @return {Number} the epsilon (precision) of the geometry
     */
    const measureEpsilonOfPath2 = (geometry) => calculateEpsilonFromBounds_1(measureBoundingBox_1(geometry), 2);

    /*
     * Measure the epsilon of the given (geom2) geometry.
     * @return {Number} the epsilon (precision) of the geometry
     */
    const measureEpsilonOfGeom2 = (geometry) => calculateEpsilonFromBounds_1(measureBoundingBox_1(geometry), 2);

    /*
     * Measure the epsilon of the given (geom3) geometry.
     * @return {Float} the epsilon (precision) of the geometry
     */
    const measureEpsilonOfGeom3 = (geometry) => calculateEpsilonFromBounds_1(measureBoundingBox_1(geometry), 3);

    /**
     * Measure the epsilon of the given geometries.
     * Epsilon values are used in various functions to determine minimum distances between points, planes, etc.
     * @param {...Object} geometries - the geometries to measure
     * @return {Number|Array} the epsilon, or a list of epsilons for each geometry
     * @alias module:modeling/measurements.measureEpsilon
     *
     * @example
     * let epsilon = measureEpsilon(sphere())
     */
    const measureEpsilon = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      const results = geometries.map((geometry) => {
        if (path2.isA(geometry)) return measureEpsilonOfPath2(geometry)
        if (geom2.isA(geometry)) return measureEpsilonOfGeom2(geometry)
        if (geom3.isA(geometry)) return measureEpsilonOfGeom3(geometry)
        return 0
      });
      return results.length === 1 ? results[0] : results
    };

    var measureEpsilon_1 = measureEpsilon;

    /**
     * All shapes (primitives or the results of operations) can be measured, e.g. calculate volume, etc.
     * @module modeling/measurements
     * @example
     * const { measureArea, measureBoundingBox, measureVolume } = require('@jscad/modeling').measurements
     */
    var measurements = {
      measureAggregateArea: measureAggregateArea_1,
      measureAggregateBoundingBox: measureAggregateBoundingBox_1,
      measureAggregateEpsilon: measureAggregateEpsilon_1,
      measureAggregateVolume: measureAggregateVolume_1,
      measureArea: measureArea_1,
      measureBoundingBox: measureBoundingBox_1,
      measureBoundingSphere: measureBoundingSphere_1,
      measureCenter: measureCenter_1,
      measureCenterOfMass: measureCenterOfMass_1,
      measureDimensions: measureDimensions_1,
      measureEpsilon: measureEpsilon_1,
      measureVolume: measureVolume_1
    };
    var measurements_5 = measurements.measureArea;
    var measurements_6 = measurements.measureBoundingBox;
    var measurements_12 = measurements.measureVolume;

    // verify that the array has the given dimension, and contains Number values
    const isNumberArray$c = (array, dimension) => {
      if (Array.isArray(array) && array.length >= dimension) {
        return array.every((n) => Number.isFinite(n))
      }
      return false
    };

    // verify that the value is a Number greater than the constant
    const isGT$d = (value, constant) => (Number.isFinite(value) && value > constant);

    // verify that the value is a Number greater than or equal to the constant
    const isGTE$a = (value, constant) => (Number.isFinite(value) && value >= constant);

    var commonChecks = {
      isNumberArray: isNumberArray$c,
      isGT: isGT$d,
      isGTE: isGTE$a
    };

    const { EPS: EPS$c } = constants;





    const { isGT: isGT$c, isGTE: isGTE$9, isNumberArray: isNumberArray$b } = commonChecks;

    /**
     * Construct an arc in two dimensional space where all points are at the same distance from the center.
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0]] - center of arc
     * @param {Number} [options.radius=1] - radius of arc
     * @param {Number} [options.startAngle=0] - starting angle of the arc, in radians
     * @param {Number} [options.endAngle=Math.PI*2] - ending angle of the arc, in radians
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @param {Boolean} [options.makeTangent=false] - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent
     * @returns {path2} new 2D path
     * @alias module:modeling/primitives.arc
     */
    const arc = (options) => {
      const defaults = {
        center: [0, 0],
        radius: 1,
        startAngle: 0,
        endAngle: (Math.PI * 2),
        makeTangent: false,
        segments: 32
      };
      let { center, radius, startAngle, endAngle, makeTangent, segments } = Object.assign({}, defaults, options);

      if (!isNumberArray$b(center, 2)) throw new Error('center must be an array of X and Y values')
      if (!isGT$c(radius, 0)) throw new Error('radius must be greater than zero')
      if (!isGTE$9(startAngle, 0)) throw new Error('startAngle must be positive')
      if (!isGTE$9(endAngle, 0)) throw new Error('endAngle must be positive')
      if (!isGTE$9(segments, 4)) throw new Error('segments must be four or more')

      startAngle = startAngle % (Math.PI * 2);
      endAngle = endAngle % (Math.PI * 2);

      let rotation = (Math.PI * 2);
      if (startAngle < endAngle) {
        rotation = endAngle - startAngle;
      }
      if (startAngle > endAngle) {
        rotation = endAngle + ((Math.PI * 2) - startAngle);
      }

      const minangle = Math.acos(((radius * radius) + (radius * radius) - (EPS$c * EPS$c)) / (2 * radius * radius));

      const centerv = vec2.clone(center);
      let point;
      const pointArray = [];
      if (rotation < minangle) {
        // there is no rotation, just a single point
        point = vec2.fromAngleRadians(vec2.create(), startAngle);
        vec2.scale(point, point, radius);
        vec2.add(point, point, centerv);
        pointArray.push(point);
      } else {
        // note: add one additional step to acheive full rotation
        const numsteps = Math.max(1, Math.floor(segments * (rotation / (Math.PI * 2)))) + 1;
        let edgestepsize = numsteps * 0.5 / rotation; // step size for half a degree
        if (edgestepsize > 0.25) edgestepsize = 0.25;

        const totalsteps = makeTangent ? (numsteps + 2) : numsteps;
        for (let i = 0; i <= totalsteps; i++) {
          let step = i;
          if (makeTangent) {
            step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize;
            if (step < 0) step = 0;
            if (step > numsteps) step = numsteps;
          }
          const angle = startAngle + (step * (rotation / numsteps));
          point = vec2.fromAngleRadians(vec2.create(), angle);
          vec2.scale(point, point, radius);
          vec2.add(point, point, centerv);
          pointArray.push(point);
        }
      }
      return path2$2.fromPoints({ closed: false }, pointArray)
    };

    var arc_1 = arc;

    const NEPS$3 = 1e-13;

    /*
     * Returns zero if n is within epsilon of zero, otherwise return n
     */
    const rezero = (n) => Math.abs(n) < NEPS$3 ? 0 : n;

    /**
     * Return Math.sin but accurate for 90 degree rotations.
     * Fixes rounding errors when sin should be 0.
     *
     * @param {Number} radians - angle in radians
     * @returns {Number} sine of the given angle
     * @alias module:modeling/utils.sin
     * @example
     * sin(Math.PI) == 0
     * sin(2 * Math.PI) == 0
     */
    const sin$4 = (radians) => rezero(Math.sin(radians));

    /**
     * Return Math.cos but accurate for 90 degree rotations.
     * Fixes rounding errors when cos should be 0.
     *
     * @param {Number} radians - angle in radians
     * @returns {Number} cosine of the given angle
     * @alias module:modeling/utils.cos
     * @example
     * cos(0.5 * Math.PI) == 0
     * cos(1.5 * Math.PI) == 0
     */
    const cos$4 = (radians) => rezero(Math.cos(radians));

    var trigonometry = { sin: sin$4, cos: cos$4 };

    const { EPS: EPS$b } = constants;





    const { sin: sin$3, cos: cos$3 } = trigonometry;

    const { isGTE: isGTE$8, isNumberArray: isNumberArray$a } = commonChecks;

    /**
     * Construct an axis-aligned ellipse in two dimensional space.
     * @see https://en.wikipedia.org/wiki/Ellipse
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0]] - center of ellipse
     * @param {Array} [options.radius=[1,1]] - radius of ellipse, along X and Y
     * @param {Number} [options.startAngle=0] - start angle of ellipse, in radians
     * @param {Number} [options.endAngle=(Math.PI * 2)] - end angle of ellipse, in radians
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @returns {geom2} new 2D geometry
     * @alias module:modeling/primitives.ellipse
     * @example
     * let myshape = ellipse({radius: [5,10]})
     */
    const ellipse = (options) => {
      const defaults = {
        center: [0, 0],
        radius: [1, 1],
        startAngle: 0,
        endAngle: (Math.PI * 2),
        segments: 32
      };
      let { center, radius, startAngle, endAngle, segments } = Object.assign({}, defaults, options);

      if (!isNumberArray$a(center, 2)) throw new Error('center must be an array of X and Y values')
      if (!isNumberArray$a(radius, 2)) throw new Error('radius must be an array of X and Y values')
      if (!radius.every((n) => n > 0)) throw new Error('radius values must be greater than zero')
      if (!isGTE$8(startAngle, 0)) throw new Error('startAngle must be positive')
      if (!isGTE$8(endAngle, 0)) throw new Error('endAngle must be positive')
      if (!isGTE$8(segments, 3)) throw new Error('segments must be three or more')

      startAngle = startAngle % (Math.PI * 2);
      endAngle = endAngle % (Math.PI * 2);

      let rotation = (Math.PI * 2);
      if (startAngle < endAngle) {
        rotation = endAngle - startAngle;
      }
      if (startAngle > endAngle) {
        rotation = endAngle + ((Math.PI * 2) - startAngle);
      }

      const minradius = Math.min(radius[0], radius[1]);
      const minangle = Math.acos(((minradius * minradius) + (minradius * minradius) - (EPS$b * EPS$b)) /
                                (2 * minradius * minradius));
      if (rotation < minangle) throw new Error('startAngle and endAngle do not define a significant rotation')

      segments = Math.floor(segments * (rotation / (Math.PI * 2)));

      const centerv = vec2.clone(center);
      const step = rotation / segments; // radians per segment

      const points = [];
      segments = (rotation < Math.PI * 2) ? segments + 1 : segments;
      for (let i = 0; i < segments; i++) {
        const angle = (step * i) + startAngle;
        const point = vec2.fromValues(radius[0] * cos$3(angle), radius[1] * sin$3(angle));
        vec2.add(point, centerv, point);
        points.push(point);
      }
      if (rotation < Math.PI * 2) points.push(centerv);
      return geom2$2.fromPoints(points)
    };

    var ellipse_1 = ellipse;

    const { isGT: isGT$b } = commonChecks;

    /**
     * Construct a circle in two dimensional space where all points are at the same distance from the center.
     * @see [ellipse]{@link module:modeling/primitives.ellipse} for more options
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0]] - center of circle
     * @param {Number} [options.radius=1] - radius of circle
     * @param {Number} [options.startAngle=0] - start angle of circle, in radians
     * @param {Number} [options.endAngle=(Math.PI * 2)] - end angle of circle, in radians
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @returns {geom2} new 2D geometry
     * @alias module:modeling/primitives.circle
     * @example
     * let myshape = circle({radius: 10})
     */
    const circle = (options) => {
      const defaults = {
        center: [0, 0],
        radius: 1,
        startAngle: 0,
        endAngle: (Math.PI * 2),
        segments: 32
      };
      let { center, radius, startAngle, endAngle, segments } = Object.assign({}, defaults, options);

      if (!isGT$b(radius, 0)) throw new Error('radius must be greater than zero')

      radius = [radius, radius];

      return ellipse_1({ center, radius, startAngle, endAngle, segments })
    };

    var circle_1 = circle;

    const { isNumberArray: isNumberArray$9 } = commonChecks;

    /**
     * Construct an axis-aligned solid cuboid in three dimensional space.
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0,0]] - center of cuboid
     * @param {Array} [options.size=[2,2,2]] - dimensions of cuboid; width, depth, height
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.cuboid
     *
     * @example
     * let myshape = cuboid(size: [5, 10, 5]})
     */
    const cuboid = (options) => {
      const defaults = {
        center: [0, 0, 0],
        size: [2, 2, 2]
      };
      const { center, size } = Object.assign({}, defaults, options);

      if (!isNumberArray$9(center, 3)) throw new Error('center must be an array of X, Y and Z values')
      if (!isNumberArray$9(size, 3)) throw new Error('size must be an array of width, depth and height values')
      if (!size.every((n) => n > 0)) throw new Error('size values must be greater than zero')

      const result = geom3$2.create(
        // adjust a basic shape to size
        [
          [[0, 4, 6, 2], [-1, 0, 0]],
          [[1, 3, 7, 5], [+1, 0, 0]],
          [[0, 1, 5, 4], [0, -1, 0]],
          [[2, 6, 7, 3], [0, +1, 0]],
          [[0, 2, 3, 1], [0, 0, -1]],
          [[4, 5, 7, 6], [0, 0, +1]]
        ].map((info) => {
          const points = info[0].map((i) => {
            const pos = [
              center[0] + (size[0] / 2) * (2 * !!(i & 1) - 1),
              center[1] + (size[1] / 2) * (2 * !!(i & 2) - 1),
              center[2] + (size[2] / 2) * (2 * !!(i & 4) - 1)
            ];
            return pos
          });
          return poly3.fromPoints(points)
        })
      );
      return result
    };

    var cuboid_1 = cuboid;

    const { isGT: isGT$a } = commonChecks;

    /**
     * Construct an axis-aligned solid cube in three dimensional space with six square faces.
     * @see [cuboid]{@link module:modeling/primitives.cuboid} for more options
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0,0]] - center of cube
     * @param {Number} [options.size=2] - dimension of cube
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.cube
     * @example
     * let myshape = cube({size: 10})
     */
    const cube$1 = (options) => {
      const defaults = {
        center: [0, 0, 0],
        size: 2
      };
      let { center, size } = Object.assign({}, defaults, options);

      if (!isGT$a(size, 0)) throw new Error('size must be greater than zero')

      size = [size, size, size];

      return cuboid_1({ center, size })
    };

    var cube_1 = cube$1;

    const { EPS: EPS$a } = constants;






    const { sin: sin$2, cos: cos$2 } = trigonometry;

    const { isGT: isGT$9, isGTE: isGTE$7, isNumberArray: isNumberArray$8 } = commonChecks;

    /**
     * Construct a Z axis-aligned elliptic cylinder in three dimensional space.
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0,0]] - center of cylinder
     * @param {Number} [options.height=2] - height of cylinder
     * @param {Array} [options.startRadius=[1,1]] - radius of rounded start, must be two dimensional array
     * @param {Number} [options.startAngle=0] - start angle of cylinder, in radians
     * @param {Array} [options.endRadius=[1,1]] - radius of rounded end, must be two dimensional array
     * @param {Number} [options.endAngle=(Math.PI * 2)] - end angle of cylinder, in radians
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @returns {geom3} new geometry
     * @alias module:modeling/primitives.cylinderElliptic
     *
     * @example
     * let myshape = cylinderElliptic({height: 2, startRadius: [10,5], endRadius: [8,3]})
     */
    const cylinderElliptic = (options) => {
      const defaults = {
        center: [0, 0, 0],
        height: 2,
        startRadius: [1, 1],
        startAngle: 0,
        endRadius: [1, 1],
        endAngle: (Math.PI * 2),
        segments: 32
      };
      let { center, height, startRadius, startAngle, endRadius, endAngle, segments } = Object.assign({}, defaults, options);

      if (!isNumberArray$8(center, 3)) throw new Error('center must be an array of X, Y and Z values')
      if (!isGT$9(height, 0)) throw new Error('height must be greater then zero')
      if (!isNumberArray$8(startRadius, 2)) throw new Error('startRadius must be an array of X and Y values')
      if (!startRadius.every((n) => n >= 0)) throw new Error('startRadius values must be positive')
      if (!isNumberArray$8(endRadius, 2)) throw new Error('endRadius must be an array of X and Y values')
      if (!endRadius.every((n) => n >= 0)) throw new Error('endRadius values must be positive')
      if (endRadius.every((n) => n === 0) && startRadius.every((n) => n === 0)) throw new Error('at least one radius must be positive')
      if (!isGTE$7(startAngle, 0)) throw new Error('startAngle must be positive')
      if (!isGTE$7(endAngle, 0)) throw new Error('endAngle must be positive')
      if (!isGTE$7(segments, 4)) throw new Error('segments must be four or more')

      startAngle = startAngle % (Math.PI * 2);
      endAngle = endAngle % (Math.PI * 2);

      let rotation = (Math.PI * 2);
      if (startAngle < endAngle) {
        rotation = endAngle - startAngle;
      }
      if (startAngle > endAngle) {
        rotation = endAngle + ((Math.PI * 2) - startAngle);
      }

      const minradius = Math.min(startRadius[0], startRadius[1], endRadius[0], endRadius[1]);
      const minangle = Math.acos(((minradius * minradius) + (minradius * minradius) - (EPS$a * EPS$a)) /
                                (2 * minradius * minradius));
      if (rotation < minangle) throw new Error('startAngle and endAngle do not define a significant rotation')

      const slices = Math.floor(segments * (rotation / (Math.PI * 2)));

      const start = vec3$1.fromValues(0, 0, -(height / 2));
      const end = vec3$1.fromValues(0, 0, height / 2);
      const ray = vec3$1.subtract(vec3$1.create(), end, start);

      const axisX = vec3$1.fromValues(1, 0, 0);
      const axisY = vec3$1.fromValues(0, 1, 0);

      const v1 = vec3$1.create();
      const v2 = vec3$1.create();
      const v3 = vec3$1.create();
      const point = (stack, slice, radius) => {
        const angle = slice * rotation + startAngle;
        vec3$1.scale(v1, axisX, radius[0] * cos$2(angle));
        vec3$1.scale(v2, axisY, radius[1] * sin$2(angle));
        vec3$1.add(v1, v1, v2);

        vec3$1.scale(v3, ray, stack);
        vec3$1.add(v3, v3, start);
        return vec3$1.add(vec3$1.create(), v1, v3)
      };

      // adjust the points to center
      const fromPoints = (...points) => {
        const newpoints = points.map((point) => vec3$1.add(vec3$1.create(), point, center));
        return poly3.fromPoints(newpoints)
      };

      const polygons = [];
      for (let i = 0; i < slices; i++) {
        const t0 = i / slices;
        const t1 = (i + 1) / slices;

        if (endRadius[0] === startRadius[0] && endRadius[1] === startRadius[1]) {
          polygons.push(fromPoints(start, point(0, t1, endRadius), point(0, t0, endRadius)));
          polygons.push(fromPoints(point(0, t1, endRadius), point(1, t1, endRadius), point(1, t0, endRadius), point(0, t0, endRadius)));
          polygons.push(fromPoints(end, point(1, t0, endRadius), point(1, t1, endRadius)));
        } else {
          if (startRadius[0] > 0 && startRadius[1] > 0) {
            polygons.push(fromPoints(start, point(0, t1, startRadius), point(0, t0, startRadius)));
          }
          if (startRadius[0] > 0 || startRadius[1] > 0) {
            polygons.push(fromPoints(point(0, t0, startRadius), point(0, t1, startRadius), point(1, t0, endRadius)));
          }
          if (endRadius[0] > 0 && endRadius[1] > 0) {
            polygons.push(fromPoints(end, point(1, t0, endRadius), point(1, t1, endRadius)));
          }
          if (endRadius[0] > 0 || endRadius[1] > 0) {
            polygons.push(fromPoints(point(1, t0, endRadius), point(0, t1, startRadius), point(1, t1, endRadius)));
          }
        }
      }
      if (rotation < (Math.PI * 2)) {
        polygons.push(fromPoints(start, point(0, 0, startRadius), end));
        polygons.push(fromPoints(point(0, 0, startRadius), point(1, 0, endRadius), end));
        polygons.push(fromPoints(start, end, point(0, 1, startRadius)));
        polygons.push(fromPoints(point(0, 1, startRadius), end, point(1, 1, endRadius)));
      }
      const result = geom3$2.create(polygons);
      return result
    };

    var cylinderElliptic_1 = cylinderElliptic;

    const { isGT: isGT$8 } = commonChecks;

    /**
     * Construct a Z axis-aligned cylinder in three dimensional space.
     * @see [cylinderElliptic]{@link module:modeling/primitives.cylinderElliptic} for more options
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0,0]] - center of cylinder
     * @param {Number} [options.height=2] - height of cylinder
     * @param {Number} [options.radius=1] - radius of cylinder (at both start and end)
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @returns {geom3} new geometry
     * @alias module:modeling/primitives.cylinder
     *
     * @example
     * let myshape = cylinder({height: 2, radius: 10})
     */
    const cylinder$1 = (options) => {
      const defaults = {
        center: [0, 0, 0],
        height: 2,
        radius: 1,
        segments: 32
      };
      const { center, height, radius, segments } = Object.assign({}, defaults, options);

      if (!isGT$8(radius, 0)) throw new Error('radius must be greater than zero')

      const newoptions = {
        center,
        height,
        startRadius: [radius, radius],
        endRadius: [radius, radius],
        segments
      };

      return cylinderElliptic_1(newoptions)
    };

    var cylinder_1 = cylinder$1;

    const { sin: sin$1, cos: cos$1 } = trigonometry;

    const { isGTE: isGTE$6, isNumberArray: isNumberArray$7 } = commonChecks;

    /**
     * Construct an axis-aligned ellipsoid in three dimensional space.
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0,0]] - center of ellipsoid
     * @param {Array} [options.radius=[1,1,1]] - radius of ellipsoid, along X, Y and Z
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @param {Array} [options.axes] -  an array with three vectors for the x, y and z base vectors
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.ellipsoid
     *
     * @example
     * let myshape = ellipsoid({radius: [5, 10, 20]})
    */
    const ellipsoid = (options) => {
      const defaults = {
        center: [0, 0, 0],
        radius: [1, 1, 1],
        segments: 32,
        axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]
      };
      const { center, radius, segments, axes } = Object.assign({}, defaults, options);

      if (!isNumberArray$7(center, 3)) throw new Error('center must be an array of X, Y and Z values')
      if (!isNumberArray$7(radius, 3)) throw new Error('radius must be an array of X, Y and Z values')
      if (!radius.every((n) => n > 0)) throw new Error('radius values must be greater than zero')
      if (!isGTE$6(segments, 4)) throw new Error('segments must be four or more')

      const xvector = vec3$1.scale(vec3$1.create(), vec3$1.normalize(vec3$1.create(), axes[0]), radius[0]);
      const yvector = vec3$1.scale(vec3$1.create(), vec3$1.normalize(vec3$1.create(), axes[1]), radius[1]);
      const zvector = vec3$1.scale(vec3$1.create(), vec3$1.normalize(vec3$1.create(), axes[2]), radius[2]);

      const qsegments = Math.round(segments / 4);
      let prevcylinderpoint;
      const polygons = [];
      const p1 = vec3$1.create();
      const p2 = vec3$1.create();
      for (let slice1 = 0; slice1 <= segments; slice1++) {
        const angle = 2 * Math.PI * slice1 / segments;
        const cylinderpoint = vec3$1.add(vec3$1.create(), vec3$1.scale(p1, xvector, cos$1(angle)), vec3$1.scale(p2, yvector, sin$1(angle)));
        if (slice1 > 0) {
          let prevcospitch, prevsinpitch;
          for (let slice2 = 0; slice2 <= qsegments; slice2++) {
            const pitch = 0.5 * Math.PI * slice2 / qsegments;
            const cospitch = cos$1(pitch);
            const sinpitch = sin$1(pitch);
            if (slice2 > 0) {
              let points = [];
              let point;
              point = vec3$1.subtract(vec3$1.create(), vec3$1.scale(p1, prevcylinderpoint, prevcospitch), vec3$1.scale(p2, zvector, prevsinpitch));
              points.push(vec3$1.add(point, point, center));
              point = vec3$1.subtract(vec3$1.create(), vec3$1.scale(p1, cylinderpoint, prevcospitch), vec3$1.scale(p2, zvector, prevsinpitch));
              points.push(vec3$1.add(point, point, center));
              if (slice2 < qsegments) {
                point = vec3$1.subtract(vec3$1.create(), vec3$1.scale(p1, cylinderpoint, cospitch), vec3$1.scale(p2, zvector, sinpitch));
                points.push(vec3$1.add(point, point, center));
              }
              point = vec3$1.subtract(vec3$1.create(), vec3$1.scale(p1, prevcylinderpoint, cospitch), vec3$1.scale(p2, zvector, sinpitch));
              points.push(vec3$1.add(point, point, center));

              polygons.push(poly3.fromPoints(points));

              points = [];
              point = vec3$1.add(vec3$1.create(), vec3$1.scale(p1, prevcylinderpoint, prevcospitch), vec3$1.scale(p2, zvector, prevsinpitch));
              points.push(vec3$1.add(vec3$1.create(), center, point));
              point = vec3$1.add(point, vec3$1.scale(p1, cylinderpoint, prevcospitch), vec3$1.scale(p2, zvector, prevsinpitch));
              points.push(vec3$1.add(vec3$1.create(), center, point));
              if (slice2 < qsegments) {
                point = vec3$1.add(point, vec3$1.scale(p1, cylinderpoint, cospitch), vec3$1.scale(p2, zvector, sinpitch));
                points.push(vec3$1.add(vec3$1.create(), center, point));
              }
              point = vec3$1.add(point, vec3$1.scale(p1, prevcylinderpoint, cospitch), vec3$1.scale(p2, zvector, sinpitch));
              points.push(vec3$1.add(vec3$1.create(), center, point));
              points.reverse();

              polygons.push(poly3.fromPoints(points));
            }
            prevcospitch = cospitch;
            prevsinpitch = sinpitch;
          }
        }
        prevcylinderpoint = cylinderpoint;
      }
      return geom3$2.create(polygons)
    };

    var ellipsoid_1 = ellipsoid;

    const { isNumberArray: isNumberArray$6 } = commonChecks;

    /**
     * Construct a polyhedron in three dimensional space from the given set of 3D points and faces.
     * The faces can define outward or inward facing polygons (orientation).
     * However, each face must define a counter clockwise rotation of points which follows the right hand rule.
     * @param {Object} options - options for construction
     * @param {Array} options.points - list of points in 3D space
     * @param {Array} options.faces - list of faces, where each face is a set of indexes into the points
     * @param {Array} [options.colors=undefined] - list of RGBA colors to apply to each face
     * @param {String} [options.orientation='outward'] - orientation of faces
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.polyhedron
     *
     * @example
     * let mypoints = [ [10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10] ]
     * let myfaces = [ [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [1, 0, 3], [2, 1, 3] ]
     * let myshape = polyhedron({points: mypoint, faces: myfaces, orientation: 'inward'})
     */
    const polyhedron = (options) => {
      const defaults = {
        points: [],
        faces: [],
        colors: undefined,
        orientation: 'outward'
      };
      const { points, faces, colors, orientation } = Object.assign({}, defaults, options);

      if (!(Array.isArray(points) && Array.isArray(faces))) {
        throw new Error('points and faces must be arrays')
      }
      if (points.length < 3) {
        throw new Error('three or more points are required')
      }
      if (faces.length < 1) {
        throw new Error('one or more faces are required')
      }
      if (colors) {
        if (!Array.isArray(colors)) {
          throw new Error('colors must be an array')
        }
        if (colors.length !== faces.length) {
          throw new Error('faces and colors must have the same length')
        }
      }
      points.forEach((point, i) => {
        if (!isNumberArray$6(point, 3)) throw new Error(`point ${i} must be an array of X, Y, Z values`)
      });
      faces.forEach((face, i) => {
        if (face.length < 3) throw new Error(`face ${i} must contain 3 or more indexes`)
        if (!isNumberArray$6(face, face.length)) throw new Error(`face ${i} must be an array of numbers`)
      });

      // invert the faces if orientation is inwards, as all internals expect outwarding facing polygons
      if (orientation !== 'outward') {
        faces.forEach((face) => face.reverse());
      }

      const polygons = faces.map((face, findex) => {
        const polygon = poly3.fromPoints(face.map((pindex) => points[pindex]));
        if (colors && colors[findex]) polygon.color = colors[findex];
        return polygon
      });

      return geom3$2.create(polygons)
    };

    var polyhedron_1 = polyhedron;

    const { isGT: isGT$7, isGTE: isGTE$5 } = commonChecks;

    /**
     * Construct a geodesic sphere based on icosahedron symmetry.
     * @param {Object} [options] - options for construction
     * @param {Number} [options.radius=1] - target radius of sphere
     * @param {Number} [options.frequency=6] - subdivision frequency per face, multiples of 6
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.geodesicSphere
     *
     * @example
     * let myshape = geodesicSphere({radius: 15, frequency: 18})
     */
    const geodesicSphere = (options) => {
      const defaults = {
        radius: 1,
        frequency: 6
      };
      let { radius, frequency } = Object.assign({}, defaults, options);

      if (!isGT$7(radius, 0)) throw new Error('radius must be greater than zero')
      if (!isGTE$5(frequency, 6)) throw new Error('frequency must be six or more')

      // adjust the frequency to base 6
      frequency = Math.floor(frequency / 6);

      const ci = [ // hard-coded data of icosahedron (20 faces, all triangles)
        [0.850651, 0.000000, -0.525731],
        [0.850651, -0.000000, 0.525731],
        [-0.850651, -0.000000, 0.525731],
        [-0.850651, 0.000000, -0.525731],
        [0.000000, -0.525731, 0.850651],
        [0.000000, 0.525731, 0.850651],
        [0.000000, 0.525731, -0.850651],
        [0.000000, -0.525731, -0.850651],
        [-0.525731, -0.850651, -0.000000],
        [0.525731, -0.850651, -0.000000],
        [0.525731, 0.850651, 0.000000],
        [-0.525731, 0.850651, 0.000000]];

      const ti = [[0, 9, 1], [1, 10, 0], [6, 7, 0], [10, 6, 0], [7, 9, 0], [5, 1, 4], [4, 1, 9], [5, 10, 1], [2, 8, 3], [3, 11, 2], [2, 5, 4],
        [4, 8, 2], [2, 11, 5], [3, 7, 6], [6, 11, 3], [8, 7, 3], [9, 8, 4], [11, 10, 5], [10, 11, 6], [8, 9, 7]];

      const geodesicSubDivide = (p, frequency, offset) => {
        const p1 = p[0];
        const p2 = p[1];
        const p3 = p[2];
        let n = offset;
        const c = [];
        const f = [];

        //           p3
        //           /\
        //          /__\     frequency = 3
        //      i  /\  /\
        //        /__\/__\       total triangles = 9 (frequency*frequency)
        //       /\  /\  /\
        //     0/__\/__\/__\
        //    p1 0   j      p2

        for (let i = 0; i < frequency; i++) {
          for (let j = 0; j < frequency - i; j++) {
            const t0 = i / frequency;
            const t1 = (i + 1) / frequency;
            const s0 = j / (frequency - i);
            const s1 = (j + 1) / (frequency - i);
            const s2 = frequency - i - 1 ? j / (frequency - i - 1) : 1;
            const q = [];

            q[0] = mix3(mix3(p1, p2, s0), p3, t0);
            q[1] = mix3(mix3(p1, p2, s1), p3, t0);
            q[2] = mix3(mix3(p1, p2, s2), p3, t1);

            // -- normalize
            for (let k = 0; k < 3; k++) {
              const r = Math.hypot(q[k][0], q[k][1], q[k][2]);
              for (let l = 0; l < 3; l++) {
                q[k][l] /= r;
              }
            }
            c.push(q[0], q[1], q[2]);
            f.push([n, n + 1, n + 2]); n += 3;

            if (j < frequency - i - 1) {
              const s3 = frequency - i - 1 ? (j + 1) / (frequency - i - 1) : 1;
              q[0] = mix3(mix3(p1, p2, s1), p3, t0);
              q[1] = mix3(mix3(p1, p2, s3), p3, t1);
              q[2] = mix3(mix3(p1, p2, s2), p3, t1);

              // -- normalize
              for (let k = 0; k < 3; k++) {
                const r = Math.hypot(q[k][0], q[k][1], q[k][2]);
                for (let l = 0; l < 3; l++) {
                  q[k][l] /= r;
                }
              }
              c.push(q[0], q[1], q[2]);
              f.push([n, n + 1, n + 2]); n += 3;
            }
          }
        }
        return { points: c, triangles: f, offset: n }
      };

      const mix3 = (a, b, f) => {
        const _f = 1 - f;
        const c = [];
        for (let i = 0; i < 3; i++) {
          c[i] = a[i] * _f + b[i] * f;
        }
        return c
      };

      let points = [];
      let faces = [];
      let offset = 0;

      for (let i = 0; i < ti.length; i++) {
        const g = geodesicSubDivide([ci[ti[i][0]], ci[ti[i][1]], ci[ti[i][2]]], frequency, offset);
        points = points.concat(g.points);
        faces = faces.concat(g.triangles);
        offset = g.offset;
      }

      let geometry = polyhedron_1({ points: points, faces: faces, orientation: 'inward' });
      if (radius !== 1) geometry = geom3$2.transform(mat4.fromScaling(mat4.create(), [radius, radius, radius]), geometry);
      return geometry
    };

    var geodesicSphere_1 = geodesicSphere;

    /**
     * Construct a new line in two dimensional space from the given points.
     * The points must be provided as an array, where each element is a 2D point.
     * @param {Array} points - array of points from which to create the path
     * @returns {path2} new 2D path
     * @alias module:modeling/primitives.line
     *
     * @example
     * let myshape = line([[10, 10], [-10, 10]])
     */
    const line = (points) => {
      if (!Array.isArray(points)) throw new Error('points must be an array')

      return path2$2.fromPoints({}, points)
    };

    var line_1 = line;

    /**
     * Construct a polygon in two dimensional space from a list of points, or a list of points and paths.
     * NOTE: The ordering of points is VERY IMPORTANT.
     * @param {Object} options - options for construction
     * @param {Array} options.points - points of the polygon : either flat or nested array of 2D points
     * @param {Array} [options.paths] - paths of the polygon : either flat or nested array of point indexes
     * @returns {geom2} new 2D geometry
     * @alias module:modeling/primitives.polygon
     *
     * @example
     * let roof = [[10,11], [0,11], [5,20]]
     * let wall = [[0,0], [10,0], [10,10], [0,10]]
     *
     * let poly = polygon({ points: roof })
     * or
     * let poly = polygon({ points: [roof, wall] })
     * or
     * let poly = polygon({ points: roof, paths: [0, 1, 2] })
     * or
     * let poly = polygon({ points: [roof, wall], paths: [[0, 1, 2], [3, 4, 5, 6]] })
     */
    const polygon = (options) => {
      const defaults = {
        points: [],
        paths: []
      };
      const { points, paths } = Object.assign({}, defaults, options);

      if (!(Array.isArray(points) && Array.isArray(paths))) throw new Error('points and paths must be arrays')

      let listofpolys = points;
      if (Array.isArray(points[0])) {
        if (!Array.isArray(points[0][0])) {
          // points is an array of something... convert to list
          listofpolys = [points];
        }
      }

      listofpolys.forEach((list, i) => {
        if (!Array.isArray(list)) throw new Error('list of points ' + i + ' must be an array')
        if (list.length < 3) throw new Error('list of points ' + i + ' must contain three or more points')
        list.forEach((point, j) => {
          if (!Array.isArray(point)) throw new Error('list of points ' + i + ', point ' + j + ' must be an array')
          if (point.length < 2) throw new Error('list of points ' + i + ', point ' + j + ' must contain by X and Y values')
        });
      });

      let listofpaths = paths;
      if (paths.length === 0) {
        // create a list of paths based on the points
        let count = 0;
        listofpaths = listofpolys.map((list) => list.map((point) => count++));
      }

      // flatten the listofpoints for indexed access
      const allpoints = [];
      listofpolys.forEach((list) => list.forEach((point) => allpoints.push(point)));

      let sides = [];
      listofpaths.forEach((path) => {
        const setofpoints = path.map((index) => allpoints[index]);
        const geometry = geom2$2.fromPoints(setofpoints);
        sides = sides.concat(geom2$2.toSides(geometry));
      });
      return geom2$2.create(sides)
    };

    var polygon_1 = polygon;

    const { isNumberArray: isNumberArray$5 } = commonChecks;

    /**
     * Construct an axis-aligned rectangle in two dimensional space with four sides at right angles.
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0]] - center of rectangle
     * @param {Array} [options.size=[2,2]] - dimension of rectangle, width and length
     * @returns {geom2} new 2D geometry
     * @alias module:modeling/primitives.rectangle
     *
     * @example
     * let myshape = rectangle({size: [10, 20]})
     */
    const rectangle = (options) => {
      const defaults = {
        center: [0, 0],
        size: [2, 2]
      };
      const { center, size } = Object.assign({}, defaults, options);

      if (!isNumberArray$5(center, 2)) throw new Error('center must be an array of X and Y values')
      if (!isNumberArray$5(size, 2)) throw new Error('size must be an array of X and Y values')
      if (!size.every((n) => n > 0)) throw new Error('size values must be greater than zero')

      const point = [size[0] / 2, size[1] / 2];
      const pswap = [point[0], -point[1]];

      const points = [
        vec2.subtract(vec2.create(), center, point),
        vec2.add(vec2.create(), center, pswap),
        vec2.add(vec2.create(), center, point),
        vec2.subtract(vec2.create(), center, pswap)
      ];
      return geom2$2.fromPoints(points)
    };

    var rectangle_1 = rectangle;

    const { EPS: EPS$9 } = constants;







    const { isGT: isGT$6, isGTE: isGTE$4, isNumberArray: isNumberArray$4 } = commonChecks;

    const createCorners = (center, size, radius, segments, slice, positive) => {
      const pitch = (Math.PI / 2) * slice / segments;
      const cospitch = Math.cos(pitch);
      const sinpitch = Math.sin(pitch);

      const layersegments = segments - slice;
      let layerradius = radius * cospitch;
      let layeroffset = size[2] - (radius - (radius * sinpitch));
      if (!positive) layeroffset = (radius - (radius * sinpitch)) - size[2];

      layerradius = layerradius > EPS$9 ? layerradius : 0;

      const corner0 = vec3$1.add(vec3$1.create(), center, [size[0] - radius, size[1] - radius, layeroffset]);
      const corner1 = vec3$1.add(vec3$1.create(), center, [radius - size[0], size[1] - radius, layeroffset]);
      const corner2 = vec3$1.add(vec3$1.create(), center, [radius - size[0], radius - size[1], layeroffset]);
      const corner3 = vec3$1.add(vec3$1.create(), center, [size[0] - radius, radius - size[1], layeroffset]);
      const corner0Points = [];
      const corner1Points = [];
      const corner2Points = [];
      const corner3Points = [];
      for (let i = 0; i <= layersegments; i++) {
        const radians = layersegments > 0 ? Math.PI / 2 * i / layersegments : 0;
        const point2d = vec2.fromAngleRadians(vec2.create(), radians);
        vec2.scale(point2d, point2d, layerradius);
        const point3d = vec3$1.fromVec2(vec3$1.create(), point2d);
        corner0Points.push(vec3$1.add(vec3$1.create(), corner0, point3d));
        vec3$1.rotateZ(point3d, point3d, [0, 0, 0], Math.PI / 2);
        corner1Points.push(vec3$1.add(vec3$1.create(), corner1, point3d));
        vec3$1.rotateZ(point3d, point3d, [0, 0, 0], Math.PI / 2);
        corner2Points.push(vec3$1.add(vec3$1.create(), corner2, point3d));
        vec3$1.rotateZ(point3d, point3d, [0, 0, 0], Math.PI / 2);
        corner3Points.push(vec3$1.add(vec3$1.create(), corner3, point3d));
      }
      if (!positive) {
        corner0Points.reverse();
        corner1Points.reverse();
        corner2Points.reverse();
        corner3Points.reverse();
        return [corner3Points, corner2Points, corner1Points, corner0Points]
      }
      return [corner0Points, corner1Points, corner2Points, corner3Points]
    };

    const stitchCorners = (previousCorners, currentCorners) => {
      const polygons = [];
      for (let i = 0; i < previousCorners.length; i++) {
        const previous = previousCorners[i];
        const current = currentCorners[i];
        for (let j = 0; j < (previous.length - 1); j++) {
          polygons.push(poly3.fromPoints([previous[j], previous[j + 1], current[j]]));

          if (j < (current.length - 1)) {
            polygons.push(poly3.fromPoints([current[j], previous[j + 1], current[j + 1]]));
          }
        }
      }
      return polygons
    };

    const stitchWalls = (previousCorners, currentCorners) => {
      const polygons = [];
      for (let i = 0; i < previousCorners.length; i++) {
        let previous = previousCorners[i];
        let current = currentCorners[i];
        const p0 = previous[previous.length - 1];
        const c0 = current[current.length - 1];

        const j = (i + 1) % previousCorners.length;
        previous = previousCorners[j];
        current = currentCorners[j];
        const p1 = previous[0];
        const c1 = current[0];

        polygons.push(poly3.fromPoints([p0, p1, c1, c0]));
      }
      return polygons
    };

    const stitchSides = (bottomCorners, topCorners) => {
      // make a copy and reverse the bottom corners
      bottomCorners = [bottomCorners[3], bottomCorners[2], bottomCorners[1], bottomCorners[0]];
      bottomCorners = bottomCorners.map((corner) => corner.slice().reverse());

      const bottomPoints = [];
      bottomCorners.forEach((corner) => {
        corner.forEach((point) => bottomPoints.push(point));
      });

      const topPoints = [];
      topCorners.forEach((corner) => {
        corner.forEach((point) => topPoints.push(point));
      });

      const polygons = [];
      for (let i = 0; i < topPoints.length; i++) {
        const j = (i + 1) % topPoints.length;
        polygons.push(poly3.fromPoints([bottomPoints[i], bottomPoints[j], topPoints[j], topPoints[i]]));
      }
      return polygons
    };

    /**
     * Construct an axis-aligned solid cuboid in three dimensional space with rounded corners.
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0,0]] - center of rounded cube
     * @param {Array} [options.size=[2,2,2]] - dimension of rounded cube; width, depth, height
     * @param {Number} [options.roundRadius=0.2] - radius of rounded edges
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.roundedCuboid
     *
     * @example
     * let mycube = roundedCuboid({size: [10, 20, 10], roundRadius: 2, segments: 16})
     */
    const roundedCuboid = (options) => {
      const defaults = {
        center: [0, 0, 0],
        size: [2, 2, 2],
        roundRadius: 0.2,
        segments: 32
      };
      let { center, size, roundRadius, segments } = Object.assign({}, defaults, options);

      if (!isNumberArray$4(center, 3)) throw new Error('center must be an array of X, Y and Z values')
      if (!isNumberArray$4(size, 3)) throw new Error('size must be an array of X, Y and Z values')
      if (!size.every((n) => n > 0)) throw new Error('size values must be greater than zero')
      if (!isGT$6(roundRadius, 0)) throw new Error('roundRadius must be greater than zero')
      if (!isGTE$4(segments, 4)) throw new Error('segments must be four or more')

      size = size.map((v) => v / 2); // convert to radius

      if (roundRadius > (size[0] - EPS$9) ||
          roundRadius > (size[1] - EPS$9) ||
          roundRadius > (size[2] - EPS$9)) throw new Error('roundRadius must be smaller then the radius of all dimensions')

      segments = Math.floor(segments / 4);

      let prevCornersPos = null;
      let prevCornersNeg = null;
      let polygons = [];
      for (let slice = 0; slice <= segments; slice++) {
        const cornersPos = createCorners(center, size, roundRadius, segments, slice, true);
        const cornersNeg = createCorners(center, size, roundRadius, segments, slice, false);

        if (slice === 0) {
          polygons = polygons.concat(stitchSides(cornersNeg, cornersPos));
        }

        if (prevCornersPos) {
          polygons = polygons.concat(stitchCorners(prevCornersPos, cornersPos),
            stitchWalls(prevCornersPos, cornersPos));
        }
        if (prevCornersNeg) {
          polygons = polygons.concat(stitchCorners(prevCornersNeg, cornersNeg),
            stitchWalls(prevCornersNeg, cornersNeg));
        }

        if (slice === segments) {
          // add the top
          let points = cornersPos.map((corner) => corner[0]);
          polygons.push(poly3.fromPoints(points));
          // add the bottom
          points = cornersNeg.map((corner) => corner[0]);
          polygons.push(poly3.fromPoints(points));
        }

        prevCornersPos = cornersPos;
        prevCornersNeg = cornersNeg;
      }

      return geom3$2.create(polygons)
    };

    var roundedCuboid_1 = roundedCuboid;

    const { EPS: EPS$8 } = constants;






    const { sin, cos } = trigonometry;

    const { isGT: isGT$5, isGTE: isGTE$3, isNumberArray: isNumberArray$3 } = commonChecks;

    /**
     * Construct a Z axis-aligned solid cylinder in three dimensional space with rounded ends.
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0,0]] - center of cylinder
     * @param {Number} [options.height=2] - height of cylinder
     * @param {Number} [options.radius=1] - radius of cylinder
     * @param {Number} [options.roundRadius=0.2] - radius of rounded edges
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.roundedCylinder
     *
     * @example
     * let myshape = roundedCylinder({ height: 10, radius: 2, roundRadius: 0.5 })
     */
    const roundedCylinder = (options) => {
      const defaults = {
        center: [0, 0, 0],
        height: 2,
        radius: 1,
        roundRadius: 0.2,
        segments: 32
      };
      const { center, height, radius, roundRadius, segments } = Object.assign({}, defaults, options);

      if (!isNumberArray$3(center, 3)) throw new Error('center must be an array of X, Y and Z values')
      if (!isGT$5(height, 0)) throw new Error('height must be greater then zero')
      if (!isGT$5(radius, 0)) throw new Error('radius must be greater then zero')
      if (!isGT$5(roundRadius, 0)) throw new Error('roundRadius must be greater then zero')
      if (roundRadius > (radius - EPS$8)) throw new Error('roundRadius must be smaller then the radius')
      if (!isGTE$3(segments, 4)) throw new Error('segments must be four or more')

      const start = [0, 0, -(height / 2)];
      const end = [0, 0, height / 2];
      const direction = vec3$1.subtract(vec3$1.create(), end, start);
      const length = vec3$1.length(direction);

      if ((2 * roundRadius) > (length - EPS$8)) throw new Error('height must be larger than twice roundRadius')

      let defaultnormal;
      if (Math.abs(direction[0]) > Math.abs(direction[1])) {
        defaultnormal = vec3$1.fromValues(0, 1, 0);
      } else {
        defaultnormal = vec3$1.fromValues(1, 0, 0);
      }

      const zvector = vec3$1.scale(vec3$1.create(), vec3$1.normalize(vec3$1.create(), direction), roundRadius);
      const xvector = vec3$1.scale(vec3$1.create(), vec3$1.normalize(vec3$1.create(), vec3$1.cross(vec3$1.create(), zvector, defaultnormal)), radius);
      const yvector = vec3$1.scale(vec3$1.create(), vec3$1.normalize(vec3$1.create(), vec3$1.cross(vec3$1.create(), xvector, zvector)), radius);

      vec3$1.add(start, start, zvector);
      vec3$1.subtract(end, end, zvector);

      const qsegments = Math.floor(0.25 * segments);

      const fromPoints = (points) => {
        // adjust the points to center
        const newpoints = points.map((point) => vec3$1.add(point, point, center));
        return poly3.fromPoints(newpoints)
      };

      const polygons = [];
      const v1 = vec3$1.create();
      const v2 = vec3$1.create();
      let prevcylinderpoint;
      for (let slice1 = 0; slice1 <= segments; slice1++) {
        const angle = 2 * Math.PI * slice1 / segments;
        const cylinderpoint = vec3$1.add(vec3$1.create(), vec3$1.scale(v1, xvector, cos(angle)), vec3$1.scale(v2, yvector, sin(angle)));
        if (slice1 > 0) {
          // cylinder wall
          let points = [];
          points.push(vec3$1.add(vec3$1.create(), start, cylinderpoint));
          points.push(vec3$1.add(vec3$1.create(), start, prevcylinderpoint));
          points.push(vec3$1.add(vec3$1.create(), end, prevcylinderpoint));
          points.push(vec3$1.add(vec3$1.create(), end, cylinderpoint));
          polygons.push(fromPoints(points));

          let prevcospitch, prevsinpitch;
          for (let slice2 = 0; slice2 <= qsegments; slice2++) {
            const pitch = 0.5 * Math.PI * slice2 / qsegments;
            const cospitch = cos(pitch);
            const sinpitch = sin(pitch);
            if (slice2 > 0) {
              // cylinder rounding, start
              points = [];
              let point;
              point = vec3$1.add(vec3$1.create(), start, vec3$1.subtract(v1, vec3$1.scale(v1, prevcylinderpoint, prevcospitch), vec3$1.scale(v2, zvector, prevsinpitch)));
              points.push(point);
              point = vec3$1.add(vec3$1.create(), start, vec3$1.subtract(v1, vec3$1.scale(v1, cylinderpoint, prevcospitch), vec3$1.scale(v2, zvector, prevsinpitch)));
              points.push(point);
              if (slice2 < qsegments) {
                point = vec3$1.add(vec3$1.create(), start, vec3$1.subtract(v1, vec3$1.scale(v1, cylinderpoint, cospitch), vec3$1.scale(v2, zvector, sinpitch)));
                points.push(point);
              }
              point = vec3$1.add(vec3$1.create(), start, vec3$1.subtract(v1, vec3$1.scale(v1, prevcylinderpoint, cospitch), vec3$1.scale(v2, zvector, sinpitch)));
              points.push(point);

              polygons.push(fromPoints(points));

              // cylinder rounding, end
              points = [];
              point = vec3$1.add(vec3$1.create(), vec3$1.scale(v1, prevcylinderpoint, prevcospitch), vec3$1.scale(v2, zvector, prevsinpitch));
              vec3$1.add(point, point, end);
              points.push(point);
              point = vec3$1.add(vec3$1.create(), vec3$1.scale(v1, cylinderpoint, prevcospitch), vec3$1.scale(v2, zvector, prevsinpitch));
              vec3$1.add(point, point, end);
              points.push(point);
              if (slice2 < qsegments) {
                point = vec3$1.add(vec3$1.create(), vec3$1.scale(v1, cylinderpoint, cospitch), vec3$1.scale(v2, zvector, sinpitch));
                vec3$1.add(point, point, end);
                points.push(point);
              }
              point = vec3$1.add(vec3$1.create(), vec3$1.scale(v1, prevcylinderpoint, cospitch), vec3$1.scale(v2, zvector, sinpitch));
              vec3$1.add(point, point, end);
              points.push(point);
              points.reverse();

              polygons.push(fromPoints(points));
            }
            prevcospitch = cospitch;
            prevsinpitch = sinpitch;
          }
        }
        prevcylinderpoint = cylinderpoint;
      }
      const result = geom3$2.create(polygons);
      return result
    };

    var roundedCylinder_1 = roundedCylinder;

    const { EPS: EPS$7 } = constants;





    const { isGT: isGT$4, isGTE: isGTE$2, isNumberArray: isNumberArray$2 } = commonChecks;

    /**
     * Construct an axis-aligned rectangle in two dimensional space with rounded corners.
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0]] - center of rounded rectangle
     * @param {Array} [options.size=[2,2]] - dimension of rounded rectangle; width and length
     * @param {Number} [options.roundRadius=0.2] - round radius of corners
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @returns {geom2} new 2D geometry
     * @alias module:modeling/primitives.roundedRectangle
     *
     * @example
     * let myshape = roundedRectangle({size: [10, 20], roundRadius: 2})
     */
    const roundedRectangle = (options) => {
      const defaults = {
        center: [0, 0],
        size: [2, 2],
        roundRadius: 0.2,
        segments: 32
      };
      let { center, size, roundRadius, segments } = Object.assign({}, defaults, options);

      if (!isNumberArray$2(center, 2)) throw new Error('center must be an array of X and Y values')
      if (!isNumberArray$2(size, 2)) throw new Error('size must be an array of X and Y values')
      if (!size.every((n) => n > 0)) throw new Error('size values must be greater than zero')
      if (!isGT$4(roundRadius, 0)) throw new Error('roundRadius must be greater than zero')
      if (!isGTE$2(segments, 4)) throw new Error('segments must be four or more')

      size = size.map((v) => v / 2); // convert to radius

      if (roundRadius > (size[0] - EPS$7) ||
          roundRadius > (size[1] - EPS$7)) throw new Error('roundRadius must be smaller then the radius of all dimensions')

      const cornersegments = Math.floor(segments / 4);

      // create sets of points that define the corners
      const corner0 = vec2.add(vec2.create(), center, [size[0] - roundRadius, size[1] - roundRadius]);
      const corner1 = vec2.add(vec2.create(), center, [roundRadius - size[0], size[1] - roundRadius]);
      const corner2 = vec2.add(vec2.create(), center, [roundRadius - size[0], roundRadius - size[1]]);
      const corner3 = vec2.add(vec2.create(), center, [size[0] - roundRadius, roundRadius - size[1]]);
      const corner0Points = [];
      const corner1Points = [];
      const corner2Points = [];
      const corner3Points = [];
      for (let i = 0; i <= cornersegments; i++) {
        const radians = Math.PI / 2 * i / cornersegments;
        const point = vec2.fromAngleRadians(vec2.create(), radians);
        vec2.scale(point, point, roundRadius);
        corner0Points.push(vec2.add(vec2.create(), corner0, point));
        vec2.rotate(point, point, vec2.create(), Math.PI / 2);
        corner1Points.push(vec2.add(vec2.create(), corner1, point));
        vec2.rotate(point, point, vec2.create(), Math.PI / 2);
        corner2Points.push(vec2.add(vec2.create(), corner2, point));
        vec2.rotate(point, point, vec2.create(), Math.PI / 2);
        corner3Points.push(vec2.add(vec2.create(), corner3, point));
      }

      return geom2$2.fromPoints(corner0Points.concat(corner1Points, corner2Points, corner3Points))
    };

    var roundedRectangle_1 = roundedRectangle;

    const { isGT: isGT$3 } = commonChecks;

    /**
     * Construct a sphere in three dimensional space where all points are at the same distance from the center.
     * @see [ellipsoid]{@link module:modeling/primitives.ellipsoid} for more options
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0,0]] - center of sphere
     * @param {Number} [options.radius=1] - radius of sphere
     * @param {Number} [options.segments=32] - number of segments to create per full rotation
     * @param {Array} [options.axes] -  an array with three vectors for the x, y and z base vectors
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.sphere
     *
     * @example
     * let myshape = sphere({radius: 5})
     */
    const sphere$1 = (options) => {
      const defaults = {
        center: [0, 0, 0],
        radius: 1,
        segments: 32,
        axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]
      };
      let { center, radius, segments, axes } = Object.assign({}, defaults, options);

      if (!isGT$3(radius, 0)) throw new Error('radius must be greater than zero')

      radius = [radius, radius, radius];

      return ellipsoid_1({ center, radius, segments, axes })
    };

    var sphere_1 = sphere$1;

    const { isGT: isGT$2 } = commonChecks;

    /**
     * Construct an axis-aligned square in two dimensional space with four equal sides at right angles.
     * @see [rectangle]{@link module:modeling/primitives.rectangle} for more options
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0]] - center of square
     * @param {Number} [options.size=2] - dimension of square
     * @returns {geom2} new 2D geometry
     * @alias module:modeling/primitives.square
     *
     * @example
     * let myshape = square({size: 10})
     */
    const square = (options) => {
      const defaults = {
        center: [0, 0],
        size: 2
      };
      let { center, size } = Object.assign({}, defaults, options);

      if (!isGT$2(size, 0)) throw new Error('size must be greater than zero')

      size = [size, size];

      return rectangle_1({ center, size })
    };

    var square_1 = square;

    const { isGT: isGT$1, isGTE: isGTE$1, isNumberArray: isNumberArray$1 } = commonChecks;

    // @see http://www.jdawiseman.com/papers/easymath/surds_star_inner_radius.html
    const getRadiusRatio = (vertices, density) => {
      if (vertices > 0 && density > 1 && density < vertices / 2) {
        return Math.cos(Math.PI * density / vertices) / Math.cos(Math.PI * (density - 1) / vertices)
      }
      return 0
    };

    const getPoints = (vertices, radius, startAngle, center) => {
      const a = (Math.PI * 2) / vertices;

      const points = [];
      for (let i = 0; i < vertices; i++) {
        const point = vec2.fromAngleRadians(vec2.create(), a * i + startAngle);
        vec2.scale(point, point, radius);
        vec2.add(point, center, point);
        points.push(point);
      }
      return points
    };

    /**
     * Construct a star in two dimensional space.
     * @see https://en.wikipedia.org/wiki/Star_polygon
     * @param {Object} [options] - options for construction
     * @param {Array} [options.center=[0,0]] - center of star
     * @param {Number} [options.vertices=5] - number of vertices (P) on the star
     * @param {Number} [options.density=2] - density (Q) of star
     * @param {Number} [options.outerRadius=1] - outer radius of vertices
     * @param {Number} [options.innerRadius=0] - inner radius of vertices, or zero to calculate
     * @param {Number} [options.startAngle=0] - starting angle for first vertice, in radians
     * @returns {geom2} new 2D geometry
     * @alias module:modeling/primitives.star
     *
     * @example
     * let star1 = star({vertices: 8, outerRadius: 10}) // star with 8/2 density
     * let star2 = star({vertices: 12, outerRadius: 40, innerRadius: 20}) // star with given radius
     */
    const star$1 = (options) => {
      const defaults = {
        center: [0, 0],
        vertices: 5,
        outerRadius: 1,
        innerRadius: 0,
        density: 2,
        startAngle: 0
      };
      let { center, vertices, outerRadius, innerRadius, density, startAngle } = Object.assign({}, defaults, options);

      if (!isNumberArray$1(center, 2)) throw new Error('center must be an array of X and Y values')
      if (!isGTE$1(vertices, 2)) throw new Error('vertices must be two or more')
      if (!isGT$1(outerRadius, 0)) throw new Error('outerRadius must be greater than zero')
      if (!isGTE$1(innerRadius, 0)) throw new Error('innerRadius must be greater than zero')
      if (!isGTE$1(startAngle, 0)) throw new Error('startAngle must be greater than zero')

      // force integers
      vertices = Math.floor(vertices);
      density = Math.floor(density);

      startAngle = startAngle % (Math.PI * 2);

      if (innerRadius === 0) {
        if (!isGTE$1(density, 2)) throw new Error('density must be two or more')
        innerRadius = outerRadius * getRadiusRatio(vertices, density);
      }

      const centerv = vec2.clone(center);

      const outerPoints = getPoints(vertices, outerRadius, startAngle, centerv);
      const innerPoints = getPoints(vertices, innerRadius, startAngle + Math.PI / vertices, centerv);

      const allPoints = [];
      for (let i = 0; i < vertices; i++) {
        allPoints.push(outerPoints[i]);
        allPoints.push(innerPoints[i]);
      }

      return geom2$2.fromPoints(allPoints)
    };

    var star_1 = star$1;

    /**
     * Mirror the given objects using the given options.
     * @param {Object} options - options for mirror
     * @param {Array} [options.origin=[0,0,0]] - the origin of the plane
     * @param {Array} [options.normal=[0,0,1]] - the normal vector of the plane
     * @param {...Object} objects - the objects to mirror
     * @return {Object|Array} the mirrored object, or a list of mirrored objects
     * @alias module:modeling/transforms.mirror
     *
     * @example
     * let myshape = mirror({normal: [0,0,10]}, cube({center: [0,0,15], radius: [20, 25, 5]}))
     */
    const mirror = (options, ...objects) => {
      const defaults = {
        origin: [0, 0, 0],
        normal: [0, 0, 1] // Z axis
      };
      const { origin, normal } = Object.assign({}, defaults, options);

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      const planeOfMirror = plane$1.fromNormalAndPoint(plane$1.create(), normal, origin);
      // verify the plane, i.e. check that the given normal was valid
      if (Number.isNaN(planeOfMirror[0])) {
        throw new Error('the given origin and normal do not define a proper plane')
      }

      const matrix = mat4.mirrorByPlane(mat4.create(), planeOfMirror);

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return path2$2.transform(matrix, object)
        if (geom2$2.isA(object)) return geom2$2.transform(matrix, object)
        if (geom3$2.isA(object)) return geom3$2.transform(matrix, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    /**
     * Mirror the given objects about the X axis.
     * @param {...Object} objects - the objects to mirror
     * @return {Object|Array} the mirrored object, or a list of mirrored objects
     * @alias module:modeling/transforms.mirrorX
     */
    const mirrorX$1 = (...objects) => mirror({ normal: [1, 0, 0] }, objects);

    /**
     * Mirror the given objects about the Y axis.
     * @param {...Object} objects - the geometries to mirror
     * @return {Object|Array} the mirrored object, or a list of mirrored objects
     * @alias module:modeling/transforms.mirrorY
     */
    const mirrorY = (...objects) => mirror({ normal: [0, 1, 0] }, objects);

    /**
     * Mirror the given objects about the Z axis.
     * @param {...Object} objects - the geometries to mirror
     * @return {Object|Array} the mirrored object, or a list of mirrored objects
     * @alias module:modeling/transforms.mirrorZ
     */
    const mirrorZ = (...objects) => mirror({ normal: [0, 0, 1] }, objects);

    var mirror_1 = {
      mirror,
      mirrorX: mirrorX$1,
      mirrorY,
      mirrorZ
    };

    /**
     * Calculate the plane of the given slice.
     * NOTE: The slice (and all points) are assumed to be planar from the beginning.
     * @param {slice} slice - the slice
     * @returns {plane} the plane of the slice
     * @alias module:modeling/extrusions/slice.calculatePlane
     *
     * @example
     * let myplane = calculatePlane(slice)
     */
    const calculatePlane = (slice) => {
      const edges = slice.edges;
      if (edges.length < 3) throw new Error('slices must have 3 or more edges to calculate a plane')

      // find the midpoint of the slice, which will lie on the plane by definition
      const midpoint = edges.reduce((point, edge) => vec3$1.add(vec3$1.create(), point, edge[0]), vec3$1.create());
      vec3$1.scale(midpoint, midpoint, 1 / edges.length);

      // find the farthest edge from the midpoint, which will be on an outside edge
      let farthestEdge;
      let distance = 0;
      edges.forEach((edge) => {
        // Make sure that the farthest edge is not a self-edge
        if (!vec3$1.equals(edge[0], edge[1])) {
          const d = vec3$1.squaredDistance(midpoint, edge[0]);
          if (d > distance) {
            farthestEdge = edge;
            distance = d;
          }
        }
      });
      // find the before edge
      const beforeEdge = edges.find((edge) => vec3$1.equals(edge[1], farthestEdge[0]));

      return plane$1.fromPoints(plane$1.create(), beforeEdge[0], farthestEdge[0], farthestEdge[1])
    };

    var calculatePlane_1 = calculatePlane;

    /**
     * Represents a 3D geometry consisting of a list of edges.
     * @typedef {Object} slice
     * @property {Array} edges - list of edges, each edge containing two points (3D)
     */

    /**
     * Creates a new empty slice.
     *
     * @returns {slice} a new slice
     * @alias module:modeling/extrusions/slice.create
     */
    const create$2 = (edges) => {
      if (!edges) {
        edges = [];
      }
      return { edges }
    };

    var create_1$2 = create$2;

    /**
     * Create a deep clone of the given slice.
     *
     * @param {slice} [out] - receiving slice
     * @param {slice} slice - slice to clone
     * @returns {slice} a new slice
     * @alias module:modeling/extrusions/slice.clone
     */
    const clone$2 = (...params) => {
      let out;
      let slice;
      if (params.length === 1) {
        out = create_1$2();
        slice = params[0];
      } else {
        out = params[0];
        slice = params[1];
      }
      // deep clone of edges
      out.edges = slice.edges.map((edge) => [vec3$1.clone(edge[0]), vec3$1.clone(edge[1])]);
      return out
    };

    var clone_1$1 = clone$2;

    /**
     * Determine if the given slices have the same edges.
     * @param {slice} a - the first slice to compare
     * @param {slice} b - the second slice to compare
     * @returns {Boolean} true if the slices are equal
     * @alias module:modeling/extrusions/slice.equals
     */
    const equals$1 = (a, b) => {
      const aedges = a.edges;
      const bedges = b.edges;

      if (aedges.length !== bedges.length) {
        return false
      }

      const isEqual = aedges.reduce((acc, aedge, i) => {
        const bedge = bedges[i];
        const d = vec3$1.squaredDistance(aedge[0], bedge[0]);
        return acc && (d < Number.EPSILON)
      }, true);

      return isEqual
    };

    var equals_1 = equals$1;

    /**
     * Create a slice from the given points.
     *
     * @param {Array} points - list of points, where each point is either 2D or 3D
     * @returns {slice} a new slice
     * @alias module:modeling/extrusions/slice.fromPoints
     *
     * @example
     * const points = [
     *   [0,  0],
     *   [0, 10],
     *   [0, 10]
     * ]
     * const slice = fromPoints(points)
     */
    const fromPoints = (points) => {
      if (!Array.isArray(points)) throw new Error('the given points must be an array')
      if (points.length < 3) throw new Error('the given points must contain THREE or more points')

      // create a list of edges from the points
      const edges = [];
      let prevpoint = points[points.length - 1];
      points.forEach((point) => {
        if (point.length === 2) edges.push([vec3$1.fromVec2(vec3$1.create(), prevpoint), vec3$1.fromVec2(vec3$1.create(), point)]);
        if (point.length === 3) edges.push([prevpoint, point]);
        prevpoint = point;
      });
      return create_1$2(edges)
    };

    var fromPoints_1 = fromPoints;

    /**
     * Create a slice from the given sides (see geom2).
     *
     * @param {Array} sides - list of sides from geom2
     * @returns {slice} a new slice
     * @alias module:modeling/extrusions/slice.fromSides
     *
     * @example
     * const myshape = circle({radius: 10})
     * const slice = fromSides(geom2.toSides(myshape))
     */
    const fromSides = (sides) => {
      if (!Array.isArray(sides)) throw new Error('the given sides must be an array')

      // create a list of edges from the sides
      const edges = [];
      sides.forEach((side) => {
        edges.push([vec3$1.fromVec2(vec3$1.create(), side[0]), vec3$1.fromVec2(vec3$1.create(), side[1])]);
      });
      return create_1$2(edges)
    };

    var fromSides_1 = fromSides;

    /**
     * Determine if the given object is a slice.
     * @param {slice} object - the object to interrogate
     * @returns {Boolean} true if the object matches a slice
     * @alias module:modeling/extrusions/slice.isA
     */
    const isA = (object) => {
      if (object && typeof object === 'object') {
        if ('edges' in object) {
          if (Array.isArray(object.edges)) {
            return true
          }
        }
      }
      return false
    };

    var isA_1 = isA;

    /**
     * Reverse the edges of the given slice.
     *
     * @param {slice} [out] - receiving slice
     * @param {slice} slice - slice to reverse
     * @returns {slice} reverse of the slice
     * @alias module:modeling/extrusions/slice.reverse
     */
    const reverse = (...params) => {
      let out;
      let slice;
      if (params.length === 1) {
        out = create_1$2();
        slice = params[0];
      } else {
        out = params[0];
        slice = params[1];
      }
      // reverse the edges
      out.edges = slice.edges.map((edge) => [edge[1], edge[0]]);
      return out
    };

    var reverse_1 = reverse;

    /**
     * Produces an array of edges from the given slice.
     * The returned array should not be modified as the data is shared with the slice.
     * @param {slice} slice - the slice
     * @returns {Array} an array of edges, each edge contains an array of two points (3D)
     * @alias module:modeling/extrusions/slice.toEdges
     *
     * @example
     * let sharededges = toEdges(slice)
     */
    const toEdges = (slice) => slice.edges;

    var toEdges_1 = toEdges;

    // Simon Tatham's linked list merge sort algorithm
    // https://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
    const sortLinked$1 = (list, fn) => {
      let i, p, q, e, numMerges;
      let inSize = 1;

      do {
        p = list;
        list = null;
        let tail = null;
        numMerges = 0;

        while (p) {
          numMerges++;
          q = p;
          let pSize = 0;
          for (i = 0; i < inSize; i++) {
            pSize++;
            q = q.nextZ;
            if (!q) break
          }

          let qSize = inSize;

          while (pSize > 0 || (qSize > 0 && q)) {
            if (pSize !== 0 && (qSize === 0 || !q || fn(p) <= fn(q))) {
              e = p;
              p = p.nextZ;
              pSize--;
            } else {
              e = q;
              q = q.nextZ;
              qSize--;
            }

            if (tail) tail.nextZ = e;
            else list = e;

            e.prevZ = tail;
            tail = e;
          }

          p = q;
        }

        tail.nextZ = null;
        inSize *= 2;
      } while (numMerges > 1)

      return list
    };

    var linkedListSort = sortLinked$1;

    class Node$2 {
      constructor (i, x, y) {
        // vertex index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertex nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
      }
    }

    /*
     * create a node and optionally link it with previous one (in a circular doubly linked list)
     */
    const insertNode$1 = (i, x, y, last) => {
      const p = new Node$2(i, x, y);

      if (!last) {
        p.prev = p;
        p.next = p;
      } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
      }

      return p
    };

    /*
     * remove a node and join prev with next nodes
     */
    const removeNode$2 = (p) => {
      p.next.prev = p.prev;
      p.prev.next = p.next;

      if (p.prevZ) p.prevZ.nextZ = p.nextZ;
      if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    };

    var linkedList = { Node: Node$2, insertNode: insertNode$1, removeNode: removeNode$2, sortLinked: linkedListSort };

    /*
     * check if a point lies within a convex triangle
     */
    const pointInTriangle$2 = (ax, ay, bx, by, cx, cy, px, py) => (
      (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
          (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
          (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0
    );

    /*
     * signed area of a triangle
     */
    const area$6 = (p, q, r) => (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    var triangle$1 = { area: area$6, pointInTriangle: pointInTriangle$2 };

    const { Node: Node$1, insertNode, removeNode: removeNode$1 } = linkedList;
    const { area: area$5 } = triangle$1;

    /*
     * create a circular doubly linked list from polygon points in the specified winding order
     */
    const linkedPolygon$2 = (data, start, end, dim, clockwise) => {
      let last;

      if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (let i = start; i < end; i += dim) {
          last = insertNode(i, data[i], data[i + 1], last);
        }
      } else {
        for (let i = end - dim; i >= start; i -= dim) {
          last = insertNode(i, data[i], data[i + 1], last);
        }
      }

      if (last && equals(last, last.next)) {
        removeNode$1(last);
        last = last.next;
      }

      return last
    };

    /*
     * eliminate colinear or duplicate points
     */
    const filterPoints$2 = (start, end) => {
      if (!start) return start
      if (!end) end = start;

      let p = start;
      let again;
      do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area$5(p.prev, p, p.next) === 0)) {
          removeNode$1(p);
          p = end = p.prev;
          if (p === p.next) break
          again = true;
        } else {
          p = p.next;
        }
      } while (again || p !== end)

      return end
    };

    /*
     * go through all polygon nodes and cure small local self-intersections
     */
    const cureLocalIntersections$1 = (start, triangles, dim) => {
      let p = start;
      do {
        const a = p.prev;
        const b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside$1(a, b) && locallyInside$1(b, a)) {
          triangles.push(a.i / dim);
          triangles.push(p.i / dim);
          triangles.push(b.i / dim);

          // remove two nodes involved
          removeNode$1(p);
          removeNode$1(p.next);

          p = start = b;
        }

        p = p.next;
      } while (p !== start)

      return filterPoints$2(p)
    };

    /*
     * check if a polygon diagonal intersects any polygon segments
     */
    const intersectsPolygon = (a, b) => {
      let p = a;
      do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
            intersects(p, p.next, a, b)) return true
        p = p.next;
      } while (p !== a)

      return false
    };

    /*
     * check if a polygon diagonal is locally inside the polygon
     */
    const locallyInside$1 = (a, b) => area$5(a.prev, a, a.next) < 0
      ? area$5(a, b, a.next) >= 0 && area$5(a, a.prev, b) >= 0
      : area$5(a, b, a.prev) < 0 || area$5(a, a.next, b) < 0;

    /*
     * check if the middle point of a polygon diagonal is inside the polygon
     */
    const middleInside = (a, b) => {
      let p = a;
      let inside = false;
      const px = (a.x + b.x) / 2;
      const py = (a.y + b.y) / 2;
      do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
            (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)) { inside = !inside; }
        p = p.next;
      } while (p !== a)

      return inside
    };

    /*
     * link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two
     * if one belongs to the outer ring and another to a hole, it merges it into a single ring
     */
    const splitPolygon$3 = (a, b) => {
      const a2 = new Node$1(a.i, a.x, a.y);
      const b2 = new Node$1(b.i, b.x, b.y);
      const an = a.next;
      const bp = b.prev;

      a.next = b;
      b.prev = a;

      a2.next = an;
      an.prev = a2;

      b2.next = a2;
      a2.prev = b2;

      bp.next = b2;
      b2.prev = bp;

      return b2
    };

    /*
     * check if a diagonal between two polygon nodes is valid (lies in polygon interior)
     */
    const isValidDiagonal$1 = (a, b) => a.next.i !== b.i &&
        a.prev.i !== b.i &&
        !intersectsPolygon(a, b) && // doesn't intersect other edges
        (
          locallyInside$1(a, b) && locallyInside$1(b, a) && middleInside(a, b) && // locally visible
            (area$5(a.prev, a, b.prev) || area$5(a, b.prev, b)) || // does not create opposite-facing sectors
            equals(a, b) && area$5(a.prev, a, a.next) > 0 && area$5(b.prev, b, b.next) > 0
        );

    /*
     * check if two segments intersect
     */
    const intersects = (p1, q1, p2, q2) => {
      const o1 = Math.sign(area$5(p1, q1, p2));
      const o2 = Math.sign(area$5(p1, q1, q2));
      const o3 = Math.sign(area$5(p2, q2, p1));
      const o4 = Math.sign(area$5(p2, q2, q1));

      if (o1 !== o2 && o3 !== o4) return true // general case

      if (o1 === 0 && onSegment(p1, p2, q1)) return true // p1, q1 and p2 are colinear and p2 lies on p1q1
      if (o2 === 0 && onSegment(p1, q2, q1)) return true // p1, q1 and q2 are colinear and q2 lies on p1q1
      if (o3 === 0 && onSegment(p2, p1, q2)) return true // p2, q2 and p1 are colinear and p1 lies on p2q2
      if (o4 === 0 && onSegment(p2, q1, q2)) return true // p2, q2 and q1 are colinear and q1 lies on p2q2

      return false
    };

    /*
     * for colinear points p, q, r, check if point q lies on segment pr
     */
    const onSegment = (p, q, r) => q.x <= Math.max(p.x, r.x) &&
        q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) &&
        q.y >= Math.min(p.y, r.y);

    const signedArea = (data, start, end, dim) => {
      let sum = 0;
      for (let i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
      }

      return sum
    };

    /*
     * check if two points are equal
     */
    const equals = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

    var linkedPolygon_1 = { cureLocalIntersections: cureLocalIntersections$1, filterPoints: filterPoints$2, isValidDiagonal: isValidDiagonal$1, linkedPolygon: linkedPolygon$2, locallyInside: locallyInside$1, splitPolygon: splitPolygon$3 };

    const { filterPoints: filterPoints$1, linkedPolygon: linkedPolygon$1, locallyInside, splitPolygon: splitPolygon$2 } = linkedPolygon_1;
    const { area: area$4, pointInTriangle: pointInTriangle$1 } = triangle$1;

    /*
     * link every hole into the outer loop, producing a single-ring polygon without holes
     *
     * Original source from https://github.com/mapbox/earcut
     * Copyright (c) 2016 Mapbox
     */
    const eliminateHoles = (data, holeIndices, outerNode, dim) => {
      const queue = [];

      for (let i = 0, len = holeIndices.length; i < len; i++) {
        const start = holeIndices[i] * dim;
        const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        const list = linkedPolygon$1(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
      }

      queue.sort((a, b) => a.x - b.x); // compare X

      // process holes from left to right
      for (let i = 0; i < queue.length; i++) {
        outerNode = eliminateHole(queue[i], outerNode);
        outerNode = filterPoints$1(outerNode, outerNode.next);
      }

      return outerNode
    };

    /*
     * find a bridge between vertices that connects hole with an outer ring and link it
     */
    const eliminateHole = (hole, outerNode) => {
      const bridge = findHoleBridge(hole, outerNode);
      if (!bridge) {
        return outerNode
      }

      const bridgeReverse = splitPolygon$2(bridge, hole);

      // filter colinear points around the cuts
      const filteredBridge = filterPoints$1(bridge, bridge.next);
      filterPoints$1(bridgeReverse, bridgeReverse.next);

      // Check if input node was removed by the filtering
      return outerNode === bridge ? filteredBridge : outerNode
    };

    /*
     * David Eberly's algorithm for finding a bridge between hole and outer polygon
     */
    const findHoleBridge = (hole, outerNode) => {
      let p = outerNode;
      const hx = hole.x;
      const hy = hole.y;
      let qx = -Infinity;
      let m;

      // find a segment intersected by a ray from the hole's leftmost point to the left
      // segment's endpoint with lesser x will be potential connection point
      do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
          const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
          if (x <= hx && x > qx) {
            qx = x;
            if (x === hx) {
              if (hy === p.y) return p
              if (hy === p.next.y) return p.next
            }

            m = p.x < p.next.x ? p : p.next;
          }
        }

        p = p.next;
      } while (p !== outerNode)

      if (!m) return null

      if (hx === qx) return m // hole touches outer segment; pick leftmost endpoint

      // look for points inside the triangle of hole point, segment intersection and endpoint
      // if there are no points found, we have a valid connection
      // otherwise choose the point of the minimum angle with the ray as connection point

      const stop = m;
      const mx = m.x;
      const my = m.y;
      let tanMin = Infinity;

      p = m;

      do {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
            pointInTriangle$1(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
          const tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

          if (locallyInside(p, hole) && (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
            m = p;
            tanMin = tan;
          }
        }

        p = p.next;
      } while (p !== stop)

      return m
    };

    /*
     * whether sector in vertex m contains sector in vertex p in the same coordinates
     */
    const sectorContainsSector = (m, p) => area$4(m.prev, m, p.prev) < 0 && area$4(p.next, m, m.next) < 0;

    /*
     * find the leftmost node of a polygon ring
     */
    const getLeftmost = (start) => {
      let p = start;
      let leftmost = start;
      do {
        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
        p = p.next;
      } while (p !== start)

      return leftmost
    };

    var eliminateHoles_1 = eliminateHoles;

    const { removeNode, sortLinked } = linkedList;
    const { cureLocalIntersections, filterPoints, isValidDiagonal, linkedPolygon, splitPolygon: splitPolygon$1 } = linkedPolygon_1;
    const { area: area$3, pointInTriangle } = triangle$1;

    /*
     * An implementation of the earcut polygon triangulation algorithm.
     *
     * Original source from https://github.com/mapbox/earcut
     * Copyright (c) 2016 Mapbox
     *
     * @param {data} A flat array of vertex coordinates.
     * @param {holeIndices} An array of hole indices if any.
     * @param {dim} The number of coordinates per vertex in the input array.
     */
    const triangulate = (data, holeIndices, dim = 2) => {
      const hasHoles = holeIndices && holeIndices.length;
      const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
      let outerNode = linkedPolygon(data, 0, outerLen, dim, true);
      const triangles = [];

      if (!outerNode || outerNode.next === outerNode.prev) return triangles

      let minX, minY, maxX, maxY, invSize;

      if (hasHoles) outerNode = eliminateHoles_1(data, holeIndices, outerNode, dim);

      // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
      if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (let i = dim; i < outerLen; i += dim) {
          const x = data[i];
          const y = data[i + 1];
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
      }

      earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

      return triangles
    };

    /*
     * main ear slicing loop which triangulates a polygon (given as a linked list)
     */
    const earcutLinked = (ear, triangles, dim, minX, minY, invSize, pass) => {
      if (!ear) return

      // interlink polygon nodes in z-order
      if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

      let stop = ear;
      let prev;
      let next;

      // iterate through ears, slicing them one by one
      while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
          // cut off the triangle
          triangles.push(prev.i / dim);
          triangles.push(ear.i / dim);
          triangles.push(next.i / dim);

          removeNode(ear);

          // skipping the next vertex leads to less sliver triangles
          ear = next.next;
          stop = next.next;

          continue
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
          // try filtering points and slicing again
          if (!pass) {
            earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
          } else if (pass === 1) {
            ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
            earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
          } else if (pass === 2) {
            splitEarcut(ear, triangles, dim, minX, minY, invSize);
          }

          break
        }
      }
    };

    /*
     * check whether a polygon node forms a valid ear with adjacent nodes
     */
    const isEar = (ear) => {
      const a = ear.prev;
      const b = ear;
      const c = ear.next;

      if (area$3(a, b, c) >= 0) return false // reflex, can't be an ear

      // now make sure we don't have other points inside the potential ear
      let p = ear.next.next;

      while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area$3(p.prev, p, p.next) >= 0) {
          return false
        }
        p = p.next;
      }

      return true
    };

    const isEarHashed = (ear, minX, minY, invSize) => {
      const a = ear.prev;
      const b = ear;
      const c = ear.next;

      if (area$3(a, b, c) >= 0) return false // reflex, can't be an ear

      // triangle bbox; min & max are calculated like this for speed
      const minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x);
      const minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y);
      const maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x);
      const maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

      // z-order range for the current triangle bbox
      const minZ = zOrder(minTX, minTY, minX, minY, invSize);
      const maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

      let p = ear.prevZ;
      let n = ear.nextZ;

      // look for points inside the triangle in both directions
      while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
          pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
          area$3(p.prev, p, p.next) >= 0) return false
        p = p.prevZ;

        if (n !== ear.prev && n !== ear.next &&
          pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
          area$3(n.prev, n, n.next) >= 0) return false
        n = n.nextZ;
      }

      // look for remaining points in decreasing z-order
      while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
          pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
          area$3(p.prev, p, p.next) >= 0) return false
        p = p.prevZ;
      }

      // look for remaining points in increasing z-order
      while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
          pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
          area$3(n.prev, n, n.next) >= 0) return false
        n = n.nextZ;
      }

      return true
    };

    /*
     * try splitting polygon into two and triangulate them independently
     */
    const splitEarcut = (start, triangles, dim, minX, minY, invSize) => {
      // look for a valid diagonal that divides the polygon into two
      let a = start;
      do {
        let b = a.next.next;
        while (b !== a.prev) {
          if (a.i !== b.i && isValidDiagonal(a, b)) {
            // split the polygon in two by the diagonal
            let c = splitPolygon$1(a, b);

            // filter colinear points around the cuts
            a = filterPoints(a, a.next);
            c = filterPoints(c, c.next);

            // run earcut on each half
            earcutLinked(a, triangles, dim, minX, minY, invSize);
            earcutLinked(c, triangles, dim, minX, minY, invSize);
            return
          }

          b = b.next;
        }

        a = a.next;
      } while (a !== start)
    };

    /*
     * interlink polygon nodes in z-order
     */
    const indexCurve = (start, minX, minY, invSize) => {
      let p = start;
      do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
      } while (p !== start)

      p.prevZ.nextZ = null;
      p.prevZ = null;

      sortLinked(p, (p) => p.z);
    };

    /*
     * z-order of a point given coords and inverse of the longer side of data bbox
     */
    const zOrder = (x, y, minX, minY, invSize) => {
      // coords are transformed into non-negative 15-bit integer range
      x = 32767 * (x - minX) * invSize;
      y = 32767 * (y - minY) * invSize;

      x = (x | (x << 8)) & 0x00FF00FF;
      x = (x | (x << 4)) & 0x0F0F0F0F;
      x = (x | (x << 2)) & 0x33333333;
      x = (x | (x << 1)) & 0x55555555;

      y = (y | (y << 8)) & 0x00FF00FF;
      y = (y | (y << 4)) & 0x0F0F0F0F;
      y = (y | (y << 2)) & 0x33333333;
      y = (y | (y << 1)) & 0x55555555;

      return x | (y << 1)
    };

    var earcut = triangulate;

    const { area: area$2 } = utils$1;
    const { toOutlines } = geom2$2;
    const { arePointsInside } = poly2;

    /*
     * Constructs a polygon hierarchy of solids and holes.
     * The hierarchy is represented as a forest of trees. All trees shall be depth at most 2.
     * If a solid exists inside the hole of another solid, it will be split out as its own root.
     *
     * @param {geom2} geometry
     * @returns {Array} an array of polygons with associated holes
     * @alias module:modeling/geometries/geom2.toTree
     *
     * @example
     * const geometry = subtract(rectangle({size: [5, 5]}), rectangle({size: [3, 3]}))
     * console.log(assignHoles(geometry))
     * [{
     *   "solid": [[-2.5,-2.5],[2.5,-2.5],[2.5,2.5],[-2.5,2.5]],
     *   "holes": [[[-1.5,1.5],[1.5,1.5],[1.5,-1.5],[-1.5,-1.5]]]
     * }]
     */
    const assignHoles = (geometry) => {
      const outlines = toOutlines(geometry);
      const solids = []; // solid indices
      const holes = []; // hole indices
      outlines.forEach((outline, i) => {
        const a = area$2(outline);
        if (a < 0) {
          holes.push(i);
        } else if (a > 0) {
          solids.push(i);
        }
      });

      // for each hole, determine what solids it is inside of
      const children = []; // child holes of solid[i]
      const parents = []; // parent solids of hole[i]
      solids.forEach((s, i) => {
        const solid = outlines[s];
        children[i] = [];
        holes.forEach((h, j) => {
          const hole = outlines[h];
          // check if a point of hole j is inside solid i
          if (arePointsInside([hole[0]], { vertices: solid })) {
            children[i].push(h);
            if (!parents[j]) parents[j] = [];
            parents[j].push(i);
          }
        });
      });

      // check if holes have multiple parents and choose one with fewest children
      holes.forEach((h, j) => {
        // ensure at least one parent exists
        if (parents[j] && parents[j].length > 1) {
          // the solid directly containing this hole
          const directParent = minIndex(parents[j], (p) => children[p].length);
          parents[j].forEach((p, i) => {
            if (i !== directParent) {
              // Remove hole from skip level parents
              children[p] = children[p].filter((c) => c !== h);
            }
          });
        }
      });

      // map indices back to points
      return children.map((holes, i) => ({
        solid: outlines[solids[i]],
        holes: holes.map((h) => outlines[h])
      }))
    };

    /*
     * Find the item in the list with smallest score(item).
     * If the list is empty, return undefined.
     */
    const minIndex = (list, score) => {
      let bestIndex;
      let best;
      list.forEach((item, index) => {
        const value = score(item);
        if (best === undefined || value < best) {
          bestIndex = index;
          best = value;
        }
      });
      return bestIndex
    };

    var assignHoles_1 = assignHoles;

    /*
     * Constructs a polygon hierarchy which associates holes with their outer solids.
     * This class maps a 3D polygon onto a 2D space using an orthonormal basis.
     * It tracks the mapping so that points can be reversed back to 3D losslessly.
     */
    class PolygonHierarchy {
      constructor (slice) {
        this.plane = calculatePlane_1(slice);

        // create an orthonormal basis
        // choose an arbitrary right hand vector, making sure it is somewhat orthogonal to the plane normal
        const rightvector = vec3$1.orthogonal(vec3$1.create(), this.plane);
        const perp = vec3$1.cross(vec3$1.create(), this.plane, rightvector);
        this.v = vec3$1.normalize(perp, perp);
        this.u = vec3$1.cross(vec3$1.create(), this.v, this.plane);

        // map from 2D to original 3D points
        this.basisMap = new Map();

        // project slice onto 2D plane
        const projected = slice.edges.map((e) => e.map((v) => this.to2D(v)));

        // compute polygon hierarchies, assign holes to solids
        const geometry = geom2$2.create(projected);
        this.roots = assignHoles_1(geometry);
      }

      /*
       * project a 3D point onto the 2D plane
       */
      to2D (vector3) {
        const vector2 = vec2.fromValues(vec3$1.dot(vector3, this.u), vec3$1.dot(vector3, this.v));
        this.basisMap.set(vector2, vector3);
        return vector2
      }

      /*
       * un-project a 2D point back into 3D
       */
      to3D (vector2) {
        // use a map to get the original 3D, no floating point error
        const original = this.basisMap.get(vector2);
        if (original) {
          return original
        } else {
          console.log('Warning: point not in original slice');
          const v1 = vec3$1.scale(vec3$1.create(), this.u, vector2[0]);
          const v2 = vec3$1.scale(vec3$1.create(), this.v, vector2[1]);

          const planeOrigin = vec3$1.scale(vec3$1.create(), plane$1, plane$1[3]);
          const v3 = vec3$1.add(v1, v1, planeOrigin);
          return vec3$1.add(v2, v2, v3)
        }
      }
    }

    var polygonHierarchy = PolygonHierarchy;

    /**
     * Return a list of polygons which are enclosed by the slice.
     * @param {slice} slice - the slice
     * @return {Array} a list of polygons (3D)
     * @alias module:modeling/extrusions/slice.toPolygons
     */
    const toPolygons = (slice) => {
      const hierarchy = new polygonHierarchy(slice);

      const polygons = [];
      hierarchy.roots.forEach(({ solid, holes }) => {
        // hole indices
        let index = solid.length;
        const holesIndex = [];
        holes.forEach((hole, i) => {
          holesIndex.push(index);
          index += hole.length;
        });

        // compute earcut triangulation for each solid
        const vertices = [solid, ...holes].flat();
        const data = vertices.flat();
        // Get original 3D vertex by index
        const getVertex = (i) => hierarchy.to3D(vertices[i]);
        const indices = earcut(data, holesIndex);
        for (let i = 0; i < indices.length; i += 3) {
          // Map back to original vertices
          const tri = indices.slice(i, i + 3).map(getVertex);
          polygons.push(poly3.fromPointsAndPlane(tri, hierarchy.plane));
        }
      });

      return polygons
    };

    var toPolygons_1 = toPolygons;

    const edgesToString = (edges) =>
      edges.reduce((result, edge) => (
        result += `[${vec3$1.toString(edge[0])}, ${vec3$1.toString(edge[1])}], `
      ), '');

    /**
     * @param {slice} slice - the slice
     * @return {String} the string representation
     * @alias module:modeling/extrusions/slice.toString
     */
    const toString = (slice) => `[${edgesToString(slice.edges)}]`;

    var toString_1 = toString;

    /**
     * Transform the given slice using the given matrix.
     * @param {mat4} matrix - transform matrix
     * @param {slice} slice - slice to transform
     * @returns {slice} the transformed slice
     * @alias module:modeling/extrusions/slice.transform
     *
     * @example
     * let matrix = mat4.fromTranslation([1, 2, 3])
     * let newslice = transform(matrix, oldslice)
     */
    const transform$1 = (matrix, slice) => {
      const edges = slice.edges.map((edge) => [vec3$1.transform(vec3$1.create(), edge[0], matrix), vec3$1.transform(vec3$1.create(), edge[1], matrix)]);
      return create_1$2(edges)
    };

    var transform_1$1 = transform$1;

    /**
     * @module modeling/extrusions/slice
     */
    var slice = {
      calculatePlane: calculatePlane_1,
      clone: clone_1$1,
      create: create_1$2,
      equals: equals_1,
      fromPoints: fromPoints_1,
      fromSides: fromSides_1,
      isA: isA_1,
      reverse: reverse_1,
      toEdges: toEdges_1,
      toPolygons: toPolygons_1,
      toString: toString_1,
      transform: transform_1$1
    };

    /*
     * Mend gaps in a 2D slice to make it a closed polygon
     */
    const repairSlice = (slice) => {
      if (!slice.edges) return slice
      const vertexMap = {}; // string key to vertex map
      const edgeCount = {}; // count of (in - out) edges
      slice.edges.forEach((edge) => {
        const inKey = edge[0].toString();
        const outKey = edge[1].toString();
        vertexMap[inKey] = edge[0];
        vertexMap[outKey] = edge[1];
        edgeCount[inKey] = (edgeCount[inKey] || 0) + 1; // in
        edgeCount[outKey] = (edgeCount[outKey] || 0) - 1; // out
      });
      // find vertices which are missing in or out edges
      const missingIn = Object.keys(edgeCount).filter((e) => edgeCount[e] < 0);
      const missingOut = Object.keys(edgeCount).filter((e) => edgeCount[e] > 0);
      // pairwise distance of bad vertices
      missingIn.forEach((key1) => {
        const v1 = vertexMap[key1];
        // find the closest vertex that is missing an out edge
        let bestDistance = Infinity;
        let bestReplacement;
        missingOut.forEach((key2) => {
          const v2 = vertexMap[key2];
          const distance = Math.hypot(v1[0] - v2[0], v1[1] - v2[1]);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestReplacement = v2;
          }
        });
        console.warn(`repairSlice: repairing vertex gap ${v1} to ${bestReplacement} distance ${bestDistance}`);
        // merge broken vertices
        slice.edges.forEach((edge) => {
          if (edge[0].toString() === key1) edge[0] = bestReplacement;
          if (edge[1].toString() === key1) edge[1] = bestReplacement;
        });
      });
      // Remove self-edges
      slice.edges = slice.edges.filter((e) => !vec3$1.equals(e[0], e[1]));
      return slice
    };

    var repairSlice_1 = repairSlice;

    const { EPS: EPS$6 } = constants;






    // https://en.wikipedia.org/wiki/Greatest_common_divisor#Using_Euclid's_algorithm
    const gcd = (a, b) => {
      if (a === b) { return a }
      if (a < b) { return gcd(b, a) }
      if (b === 1) { return 1 }
      if (b === 0) { return a }
      return gcd(b, a % b)
    };

    const lcm = (a, b) => (a * b) / gcd(a, b);

    // Return a set of edges that encloses the same area by splitting
    // the given edges to have newlength total edges.
    const repartitionEdges = (newlength, edges) => {
      // NOTE: This implementation splits each edge evenly.
      const multiple = newlength / edges.length;
      if (multiple === 1) {
        return edges
      }

      const divisor = vec3$1.fromValues(multiple, multiple, multiple);

      const newEdges = [];
      edges.forEach((edge) => {
        const increment = vec3$1.subtract(vec3$1.create(), edge[1], edge[0]);
        vec3$1.divide(increment, increment, divisor);

        // repartition the edge
        let prev = edge[0];
        for (let i = 1; i <= multiple; ++i) {
          const next = vec3$1.add(vec3$1.create(), prev, increment);
          newEdges.push([prev, next]);
          prev = next;
        }
      });
      return newEdges
    };

    const EPSAREA = (EPS$6 * EPS$6 / 2) * Math.sin(Math.PI / 3);

    /*
     * Extrude (build) walls between the given slices.
     * Each wall consists of two triangles, which may be invalid if slices are overlapping.
     */
    const extrudeWalls = (slice0, slice1) => {
      let edges0 = slice.toEdges(slice0);
      let edges1 = slice.toEdges(slice1);

      if (edges0.length !== edges1.length) {
        // different shapes, so adjust one or both to the same number of edges
        const newlength = lcm(edges0.length, edges1.length);
        if (newlength !== edges0.length) edges0 = repartitionEdges(newlength, edges0);
        if (newlength !== edges1.length) edges1 = repartitionEdges(newlength, edges1);
      }

      const walls = [];
      edges0.forEach((edge0, i) => {
        const edge1 = edges1[i];

        const poly0 = poly3.fromPoints([edge0[0], edge0[1], edge1[1]]);
        const poly0area = poly3.measureArea(poly0);
        if (Number.isFinite(poly0area) && poly0area > EPSAREA) walls.push(poly0);

        const poly1 = poly3.fromPoints([edge0[0], edge1[1], edge1[0]]);
        const poly1area = poly3.measureArea(poly1);
        if (Number.isFinite(poly1area) && poly1area > EPSAREA) walls.push(poly1);
      });
      return walls
    };

    var extrudeWalls_1 = extrudeWalls;

    const defaultCallback = (progress, index, base) => {
      let baseSlice = null;
      if (geom2$2.isA(base)) baseSlice = slice.fromSides(geom2$2.toSides(base));
      if (poly3.isA(base)) baseSlice = slice.fromPoints(poly3.toPoints(base));

      return progress === 0 || progress === 1 ? slice.transform(mat4.fromTranslation(mat4.create(), [0, 0, progress]), baseSlice) : null
    };

    /**
     * Extrude a solid from the slices as returned by the callback function.
     * @see slice
     *
     * @param {Object} options - options for extrude
     * @param {Integer} [options.numberOfSlices=2] the number of slices to be generated by the callback
     * @param {Boolean} [options.capStart=true] the solid should have a cap at the start
     * @param {Boolean} [options.capEnd=true] the solid should have a cap at the end
     * @param {Boolean} [options.close=false] the solid should have a closing section between start and end
     * @param {Boolean} [options.repair=true] - repair gaps in the geometry
     * @param {Function} [options.callback] the callback function that generates each slice
     * @param {Object} base - the base object which is used to create slices (see the example for callback information)
     * @return {geom3} the extruded shape
     * @alias module:modeling/extrusions.extrudeFromSlices
     *
     * @example
     * // Parameters:
     * //   progress : the percent complete [0..1]
     * //   index : the index of the current slice [0..numberOfSlices - 1]
     * //   base : the base object as given
     * // Return Value:
     * //   slice or null (to skip)
     * const callback = (progress, index, base) => {
     *   ...
     *   return slice
     * }
     */
    const extrudeFromSlices = (options, base) => {
      const defaults = {
        numberOfSlices: 2,
        capStart: true,
        capEnd: true,
        close: false,
        repair: true,
        callback: defaultCallback
      };
      const { numberOfSlices, capStart, capEnd, close, repair, callback: generate } = Object.assign({ }, defaults, options);

      if (numberOfSlices < 2) throw new Error('numberOfSlices must be 2 or more')

      // Repair gaps in the base slice
      if (repair) {
        repairSlice_1(base);
      }

      const sMax = numberOfSlices - 1;

      let startSlice = null;
      let endSlice = null;
      let prevSlice = null;
      let polygons = [];
      for (let s = 0; s < numberOfSlices; s++) {
        // invoke the callback function to get the next slice
        // NOTE: callback can return null to skip the slice
        const currentSlice = generate(s / sMax, s, base);

        if (currentSlice) {
          if (!slice.isA(currentSlice)) throw new Error('the callback function must return slice objects')

          const edges = slice.toEdges(currentSlice);
          if (edges.length === 0) throw new Error('the callback function must return slices with one or more edges')

          if (prevSlice) {
            polygons = polygons.concat(extrudeWalls_1(prevSlice, currentSlice));
          }

          // save start and end slices for caps if necessary
          if (s === 0) startSlice = currentSlice;
          if (s === (numberOfSlices - 1)) endSlice = currentSlice;

          prevSlice = currentSlice;
        }
      }

      if (capEnd) {
        // create a cap at the end
        const endPolygons = slice.toPolygons(endSlice);
        polygons = polygons.concat(endPolygons);
      }
      if (capStart) {
        // create a cap at the start
        const startPolygons = slice.toPolygons(startSlice).map(poly3.invert);
        polygons = polygons.concat(startPolygons);
      }
      if (!capStart && !capEnd) {
        // create walls between end and start slices
        if (close && !slice.equals(endSlice, startSlice)) {
          polygons = polygons.concat(extrudeWalls_1(endSlice, startSlice));
        }
      }
      return geom3$2.create(polygons)
    };

    var extrudeFromSlices_1 = extrudeFromSlices;

    const { mirrorX } = mirror_1;







    /**
     * Rotate extrude the given geometry using the given options.
     *
     * @param {Object} options - options for extrusion
     * @param {Number} [options.angle=PI*2] - angle of the extrusion (RADIANS)
     * @param {Number} [options.startAngle=0] - start angle of the extrusion (RADIANS)
     * @param {String} [options.overflow='cap'] - what to do with points outside of bounds (+ / - x) :
     * defaults to capping those points to 0 (only supported behaviour for now)
     * @param {Number} [options.segments=12] - number of segments of the extrusion
     * @param {geom2} geometry - the geometry to extrude
     * @returns {geom3} the extruded geometry
     * @alias module:modeling/extrusions.extrudeRotate
     *
     * @example
     * const myshape = extrudeRotate({segments: 8, angle: Math.PI}, circle({size: 3, center: [4, 0]}))
     */
    const extrudeRotate = (options, geometry) => {
      const defaults = {
        segments: 12,
        startAngle: 0,
        angle: (Math.PI * 2),
        overflow: 'cap'
      };
      let { segments, startAngle, angle, overflow } = Object.assign({}, defaults, options);

      if (segments < 3) throw new Error('segments must be greater then 3')

      startAngle = Math.abs(startAngle) > (Math.PI * 2) ? startAngle % (Math.PI * 2) : startAngle;
      angle = Math.abs(angle) > (Math.PI * 2) ? angle % (Math.PI * 2) : angle;

      let endAngle = startAngle + angle;
      endAngle = Math.abs(endAngle) > (Math.PI * 2) ? endAngle % (Math.PI * 2) : endAngle;

      if (endAngle < startAngle) {
        const x = startAngle;
        startAngle = endAngle;
        endAngle = x;
      }
      let totalRotation = endAngle - startAngle;
      if (totalRotation <= 0.0) totalRotation = (Math.PI * 2);

      if (Math.abs(totalRotation) < (Math.PI * 2)) {
        // adjust the segments to achieve the total rotation requested
        const anglePerSegment = (Math.PI * 2) / segments;
        segments = Math.floor(Math.abs(totalRotation) / anglePerSegment);
        if (Math.abs(totalRotation) > (segments * anglePerSegment)) segments++;
      }

      // console.log('startAngle: '+startAngle)
      // console.log('endAngle: '+endAngle)
      // console.log(totalRotation)
      // console.log(segments)

      // convert geometry to an array of sides, easier to deal with
      let shapeSides = geom2$2.toSides(geometry);
      if (shapeSides.length === 0) throw new Error('the given geometry cannot be empty')

      // determine if the rotate extrude can be computed in the first place
      // ie all the points have to be either x > 0 or x < 0

      // generic solution to always have a valid solid, even if points go beyond x/ -x
      // 1. split points up between all those on the 'left' side of the axis (x<0) & those on the 'righ' (x>0)
      // 2. for each set of points do the extrusion operation IN OPOSITE DIRECTIONS
      // 3. union the two resulting solids

      // 1. alt : OR : just cap of points at the axis ?

      const pointsWithNegativeX = shapeSides.filter((s) => (s[0][0] < 0));
      const pointsWithPositiveX = shapeSides.filter((s) => (s[0][0] >= 0));
      const arePointsWithNegAndPosX = pointsWithNegativeX.length > 0 && pointsWithPositiveX.length > 0;

      // FIXME actually there are cases where setting X=0 will change the basic shape
      // - Alternative #1 : don't allow shapes with both negative and positive X values
      // - Alternative #2 : remove one half of the shape (costly)
      if (arePointsWithNegAndPosX && overflow === 'cap') {
        if (pointsWithNegativeX.length > pointsWithPositiveX.length) {
          shapeSides = shapeSides.map((side) => {
            let point0 = side[0];
            let point1 = side[1];
            point0 = [Math.min(point0[0], 0), point0[1]];
            point1 = [Math.min(point1[0], 0), point1[1]];
            return [point0, point1]
          });
          // recreate the geometry from the (-) capped points
          geometry = geom2$2.reverse(geom2$2.create(shapeSides));
          geometry = mirrorX(geometry);
        } else if (pointsWithPositiveX.length >= pointsWithNegativeX.length) {
          shapeSides = shapeSides.map((side) => {
            let point0 = side[0];
            let point1 = side[1];
            point0 = [Math.max(point0[0], 0), point0[1]];
            point1 = [Math.max(point1[0], 0), point1[1]];
            return [point0, point1]
          });
          // recreate the geometry from the (+) capped points
          geometry = geom2$2.create(shapeSides);
        }
      }

      const rotationPerSlice = totalRotation / segments;
      const isCapped = Math.abs(totalRotation) < (Math.PI * 2);
      const baseSlice = slice.fromSides(geom2$2.toSides(geometry));
      slice.reverse(baseSlice, baseSlice);

      const matrix = mat4.create();
      const createSlice = (progress, index, base) => {
        const Zrotation = rotationPerSlice * index + startAngle;
        mat4.multiply(matrix, mat4.fromZRotation(matrix, Zrotation), mat4.fromXRotation(mat4.create(), Math.PI / 2));

        return slice.transform(matrix, base)
      };

      options = {
        numberOfSlices: segments + 1,
        capStart: isCapped,
        capEnd: isCapped,
        close: !isCapped,
        callback: createSlice
      };
      return extrudeFromSlices_1(options, baseSlice)
    };

    var extrudeRotate_1 = extrudeRotate;

    /**
     * Rotate the given objects using the given options.
     * @param {Array} angles - angle (RADIANS) of rotations about X, Y, and Z axis
     * @param {...Object} objects - the objects to rotate
     * @return {Object|Array} the rotated object, or a list of rotated objects
     * @alias module:modeling/transforms.rotate
     *
     * @example
     * const newsphere = rotate([Math.PI / 4, 0, 0], sphere())
     */
    const rotate$3 = (angles, ...objects) => {
      if (!Array.isArray(angles)) throw new Error('angles must be an array')

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      // adjust the angles if necessary
      angles = angles.slice(); // don't modify the original
      while (angles.length < 3) angles.push(0);

      const yaw = angles[2];
      const pitch = angles[1];
      const roll = angles[0];

      const matrix = mat4.fromTaitBryanRotation(mat4.create(), yaw, pitch, roll);

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return path2$2.transform(matrix, object)
        if (geom2$2.isA(object)) return geom2$2.transform(matrix, object)
        if (geom3$2.isA(object)) return geom3$2.transform(matrix, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    /**
     * Rotate the given objects about the X axis, using the given options.
     * @param {Number} angle - angle (RADIANS) of rotations about X
     * @param {...Object} objects - the objects to rotate
     * @return {Object|Array} the rotated object, or a list of rotated objects
     * @alias module:modeling/transforms.rotateX
     */
    const rotateX$1 = (angle, ...objects) => rotate$3([angle, 0, 0], objects);

    /**
     * Rotate the given objects about the Y axis, using the given options.
     * @param {Number} angle - angle (RADIANS) of rotations about Y
     * @param {...Object} objects - the objects to rotate
     * @return {Object|Array} the rotated object, or a list of rotated objects
     * @alias module:modeling/transforms.rotateY
     */
    const rotateY$1 = (angle, ...objects) => rotate$3([0, angle, 0], objects);

    /**
     * Rotate the given objects about the Z axis, using the given options.
     * @param {Number} angle - angle (RADIANS) of rotations about Z
     * @param {...Object} objects - the objects to rotate
     * @return {Object|Array} the rotated object, or a list of rotated objects
     * @alias module:modeling/transforms.rotateZ
     */
    const rotateZ$1 = (angle, ...objects) => rotate$3([0, 0, angle], objects);

    var rotate_1$1 = {
      rotate: rotate$3,
      rotateX: rotateX$1,
      rotateY: rotateY$1,
      rotateZ: rotateZ$1
    };

    /**
     * Translate the given objects using the given options.
     * @param {Array} offset - offset (vector) of which to translate the objects
     * @param {...Object} objects - the objects to translate
     * @return {Object|Array} the translated object, or a list of translated objects
     * @alias module:modeling/transforms.translate
     *
     * @example
     * const newsphere = translate([5, 0, 10], sphere())
     */
    const translate$5 = (offset, ...objects) => {
      if (!Array.isArray(offset)) throw new Error('offset must be an array')

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      // adjust the offset if necessary
      offset = offset.slice(); // don't modify the original
      while (offset.length < 3) offset.push(0);

      const matrix = mat4.fromTranslation(mat4.create(), offset);

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return path2$2.transform(matrix, object)
        if (geom2$2.isA(object)) return geom2$2.transform(matrix, object)
        if (geom3$2.isA(object)) return geom3$2.transform(matrix, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    /**
     * Translate the given objects along the X axis using the given options.
     * @param {Number} offset - X offset of which to translate the objects
     * @param {...Object} objects - the objects to translate
     * @return {Object|Array} the translated object, or a list of translated objects
     * @alias module:modeling/transforms.translateX
     */
    const translateX = (offset, ...objects) => translate$5([offset, 0, 0], objects);

    /**
     * Translate the given objects along the Y axis using the given options.
     * @param {Number} offset - Y offset of which to translate the geometries
     * @param {...Object} objects - the objects to translate
     * @return {Object|Array} the translated object, or a list of translated objects
     * @alias module:modeling/transforms.translateY
     */
    const translateY = (offset, ...objects) => translate$5([0, offset, 0], objects);

    /**
     * Translate the given objects along the Z axis using the given options.
     * @param {Number} offset - Z offset of which to translate the geometries
     * @param {...Object} objects - the objects to translate
     * @return {Object|Array} the translated object, or a list of translated objects
     * @alias module:modeling/transforms.translateZ
     */
    const translateZ = (offset, ...objects) => translate$5([0, 0, offset], objects);

    var translate_1$1 = {
      translate: translate$5,
      translateX,
      translateY,
      translateZ
    };

    const { rotate: rotate$2 } = rotate_1$1;
    const { translate: translate$4 } = translate_1$1;



    const { isGT, isGTE } = commonChecks;

    /**
     * Construct a torus by revolving a small circle (inner) about the circumference of a large (outer) circle.
     * @param {Object} [options] - options for construction
     * @param {Number} [options.innerRadius=1] - radius of small (inner) circle
     * @param {Number} [options.outerRadius=4] - radius of large (outer) circle
     * @param {Integer} [options.innerSegments=32] - number of segments to create per rotation
     * @param {Integer} [options.outerSegments=32] - number of segments to create per rotation
     * @param {Integer} [options.innerRotation=0] - rotation of small (inner) circle in radians
     * @param {Number} [options.outerRotation=(PI * 2)] - rotation (outer) of the torus (RADIANS)
     * @param {Number} [options.startAngle=0] - start angle of the torus (RADIANS)
     * @returns {geom3} new 3D geometry
     * @alias module:modeling/primitives.torus
     *
     * @example
     * let myshape = torus({ innerRadius: 10, outerRadius: 100 })
     */
    const torus$1 = (options) => {
      const defaults = {
        innerRadius: 1,
        innerSegments: 32,
        outerRadius: 4,
        outerSegments: 32,
        innerRotation: 0,
        startAngle: 0,
        outerRotation: Math.PI * 2
      };
      const { innerRadius, innerSegments, outerRadius, outerSegments, innerRotation, startAngle, outerRotation } = Object.assign({}, defaults, options);

      if (!isGT(innerRadius, 0)) throw new Error('innerRadius must be greater than zero')
      if (!isGTE(innerSegments, 3)) throw new Error('innerSegments must be three or more')
      if (!isGT(outerRadius, 0)) throw new Error('outerRadius must be greater than zero')
      if (!isGTE(outerSegments, 3)) throw new Error('outerSegments must be three or more')
      if (!isGTE(startAngle, 0)) throw new Error('startAngle must be positive')
      if (!isGT(outerRotation, 0)) throw new Error('outerRotation must be greater than zero')

      if (innerRadius >= outerRadius) throw new Error('inner circle is two large to rotate about the outer circle')

      let innerCircle = circle_1({ radius: innerRadius, segments: innerSegments });

      if (innerRotation !== 0) {
        innerCircle = rotate$2([0, 0, innerRotation], innerCircle);
      }

      innerCircle = translate$4([outerRadius, 0], innerCircle);

      const extrudeOptions = {
        startAngle: startAngle,
        angle: outerRotation,
        segments: outerSegments
      };
      return extrudeRotate_1(extrudeOptions, innerCircle)
    };

    var torus_1 = torus$1;

    const { isNumberArray } = commonChecks;

    const NEPS$2 = 1e-13;

    // returns angle C
    const solveAngleFromSSS = (a, b, c) => Math.acos(((a * a) + (b * b) - (c * c)) / (2 * a * b));

    // returns side c
    const solveSideFromSAS = (a, C, b) => {
      if (C > NEPS$2) {
        return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C))
      }

      // Explained in https://www.nayuki.io/page/numerically-stable-law-of-cosines
      return Math.sqrt((a - b) * (a - b) + a * b * C * C * (1 - C * C / 12))
    };

    // AAA is when three angles of a triangle, but no sides
    const solveAAA = (angles) => {
      const eps = Math.abs(angles[0] + angles[1] + angles[2] - Math.PI);
      if (eps > NEPS$2) throw new Error('AAA triangles require angles that sum to PI')

      const A = angles[0];
      const B = angles[1];
      const C = Math.PI - A - B;

      // Note: This is not 100% proper but...
      // default the side c length to 1
      // solve the other lengths
      const c = 1;
      const a = (c / Math.sin(C)) * Math.sin(A);
      const b = (c / Math.sin(C)) * Math.sin(B);
      return createTriangle(A, B, C, a, b, c)
    };

    // AAS is when two angles and one side are known, and the side is not between the angles
    const solveAAS = (values) => {
      const A = values[0];
      const B = values[1];
      const C = Math.PI + NEPS$2 - A - B;

      if (C < NEPS$2) throw new Error('AAS triangles require angles that sum to PI')

      const a = values[2];
      const b = (a / Math.sin(A)) * Math.sin(B);
      const c = (a / Math.sin(A)) * Math.sin(C);
      return createTriangle(A, B, C, a, b, c)
    };

    // ASA is when two angles and the side between the angles are known
    const solveASA = (values) => {
      const A = values[0];
      const B = values[2];
      const C = Math.PI + NEPS$2 - A - B;

      if (C < NEPS$2) throw new Error('ASA triangles require angles that sum to PI')

      const c = values[1];
      const a = (c / Math.sin(C)) * Math.sin(A);
      const b = (c / Math.sin(C)) * Math.sin(B);
      return createTriangle(A, B, C, a, b, c)
    };

    // SAS is when two sides and the angle between them are known
    const solveSAS = (values) => {
      const c = values[0];
      const B = values[1];
      const a = values[2];

      const b = solveSideFromSAS(c, B, a);

      const A = solveAngleFromSSS(b, c, a); // solve for A
      const C = Math.PI - A - B;
      return createTriangle(A, B, C, a, b, c)
    };

    // SSA is when two sides and an angle that is not the angle between the sides are known
    const solveSSA = (values) => {
      const c = values[0];
      const a = values[1];
      const C = values[2];

      const A = Math.asin(a * Math.sin(C) / c);
      const B = Math.PI - A - C;

      const b = (c / Math.sin(C)) * Math.sin(B);
      return createTriangle(A, B, C, a, b, c)
    };

    // SSS is when we know three sides of the triangle
    const solveSSS = (lengths) => {
      const a = lengths[1];
      const b = lengths[2];
      const c = lengths[0];
      if (((a + b) <= c) || ((b + c) <= a) || ((c + a) <= b)) {
        throw new Error('SSS triangle is incorrect, as the longest side is longer than the sum of the other sides')
      }

      const A = solveAngleFromSSS(b, c, a); // solve for A
      const B = solveAngleFromSSS(c, a, b); // solve for B
      const C = Math.PI - A - B;
      return createTriangle(A, B, C, a, b, c)
    };

    const createTriangle = (A, B, C, a, b, c) => {
      const p0 = vec2.fromValues(0, 0); // everything starts from 0, 0
      const p1 = vec2.fromValues(c, 0);
      const p2 = vec2.fromValues(a, 0);
      vec2.add(p2, vec2.rotate(p2, p2, [0, 0], Math.PI - B), p1);
      return geom2$2.fromPoints([p0, p1, p2])
    };

    /**
     * Construct a triangle in two dimensional space from the given options.
     * The triangle is always constructed CCW from the origin, [0, 0, 0].
     * @see https://www.mathsisfun.com/algebra/trig-solving-triangles.html
     * @param {Object} [options] - options for construction
     * @param {String} [options.type='SSS'] - type of triangle to construct; A ~ angle, S ~ side
     * @param {Array} [options.values=[1,1,1]] - angle (radians) of corners or length of sides
     * @returns {geom2} new 2D geometry
     * @alias module:modeling/primitives.triangle
     *
     * @example
     * let myshape = triangle({type: 'AAS', values: [degToRad(62), degToRad(35), 7]})
     */
    const triangle = (options) => {
      const defaults = {
        type: 'SSS',
        values: [1, 1, 1]
      };
      let { type, values } = Object.assign({}, defaults, options);

      if (typeof (type) !== 'string') throw new Error('triangle type must be a string')
      type = type.toUpperCase();
      if (!((type[0] === 'A' || type[0] === 'S') &&
            (type[1] === 'A' || type[1] === 'S') &&
            (type[2] === 'A' || type[2] === 'S'))) throw new Error('triangle type must contain three letters; A or S')

      if (!isNumberArray(values, 3)) throw new Error('triangle values must contain three values')
      if (!values.every((n) => n > 0)) throw new Error('triangle values must be greater than zero')

      switch (type) {
        case 'AAA':
          return solveAAA(values)
        case 'AAS':
          return solveAAS(values)
        case 'ASA':
          return solveASA(values)
        case 'SAS':
          return solveSAS(values)
        case 'SSA':
          return solveSSA(values)
        case 'SSS':
          return solveSSS(values)
        default:
          throw new Error('invalid triangle type, try again')
      }
    };

    var triangle_1 = triangle;

    /**
     * Primitives provide the building blocks for complex parts.
     * Each primitive is a geometrical object that can be described mathematically, and therefore precise.
     * Primitives can be logically combined, transformed, extruded, etc.
     * @module modeling/primitives
     * @example
     * const { cube, ellipse, star } = require('@jscad/modeling').primitives
     */
    var primitives = {
      arc: arc_1,
      circle: circle_1,
      cube: cube_1,
      cuboid: cuboid_1,
      cylinder: cylinder_1,
      cylinderElliptic: cylinderElliptic_1,
      ellipse: ellipse_1,
      ellipsoid: ellipsoid_1,
      geodesicSphere: geodesicSphere_1,
      line: line_1,
      polygon: polygon_1,
      polyhedron: polyhedron_1,
      rectangle: rectangle_1,
      roundedCuboid: roundedCuboid_1,
      roundedCylinder: roundedCylinder_1,
      roundedRectangle: roundedRectangle_1,
      sphere: sphere_1,
      square: square_1,
      star: star_1,
      torus: torus_1,
      triangle: triangle_1
    };

    // -- data source from from http://paulbourke.net/dataformats/hershey/
    // -- reduced to save some bytes...
    // { [ascii code]: [width, x, y, ...] } - undefined value as path separator
    var simplex = {
      height: 14,
      32: [16],
      33: [10, 5, 21, 5, 7, undefined, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
      34: [16, 4, 21, 4, 14, undefined, 12, 21, 12, 14],
      35: [21, 11, 25, 4, -7, undefined, 17, 25, 10, -7, undefined, 4, 12, 18, 12, undefined, 3, 6, 17, 6],
      36: [20, 8, 25, 8, -4, undefined, 12, 25, 12, -4, undefined, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3],
      37: [24, 21, 21, 3, 0, undefined, 8, 21, 10, 19, 10, 17, 9, 15, 7, 14, 5, 14, 3, 16, 3, 18, 4, 20, 6, 21, 8, 21, 10, 20, 13, 19, 16, 19, 19, 20, 21, 21, undefined, 17, 7, 15, 6, 14, 4, 14, 2, 16, 0, 18, 0, 20, 1, 21, 3, 21, 5, 19, 7, 17, 7],
      38: [26, 23, 12, 23, 13, 22, 14, 21, 14, 20, 13, 19, 11, 17, 6, 15, 3, 13, 1, 11, 0, 7, 0, 5, 1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9, 12, 13, 13, 14, 14, 16, 14, 18, 13, 20, 11, 21, 9, 20, 8, 18, 8, 16, 9, 13, 11, 10, 16, 3, 18, 1, 20, 0, 22, 0, 23, 1, 23, 2],
      39: [10, 5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15],
      40: [14, 11, 25, 9, 23, 7, 20, 5, 16, 4, 11, 4, 7, 5, 2, 7, -2, 9, -5, 11, -7],
      41: [14, 3, 25, 5, 23, 7, 20, 9, 16, 10, 11, 10, 7, 9, 2, 7, -2, 5, -5, 3, -7],
      42: [16, 8, 21, 8, 9, undefined, 3, 18, 13, 12, undefined, 13, 18, 3, 12],
      43: [26, 13, 18, 13, 0, undefined, 4, 9, 22, 9],
      44: [10, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4],
      45: [26, 4, 9, 22, 9],
      46: [10, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
      47: [22, 20, 25, 2, -7],
      48: [20, 9, 21, 6, 20, 4, 17, 3, 12, 3, 9, 4, 4, 6, 1, 9, 0, 11, 0, 14, 1, 16, 4, 17, 9, 17, 12, 16, 17, 14, 20, 11, 21, 9, 21],
      49: [20, 6, 17, 8, 18, 11, 21, 11, 0],
      50: [20, 4, 16, 4, 17, 5, 19, 6, 20, 8, 21, 12, 21, 14, 20, 15, 19, 16, 17, 16, 15, 15, 13, 13, 10, 3, 0, 17, 0],
      51: [20, 5, 21, 16, 21, 10, 13, 13, 13, 15, 12, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4],
      52: [20, 13, 21, 3, 7, 18, 7, undefined, 13, 21, 13, 0],
      53: [20, 15, 21, 5, 21, 4, 12, 5, 13, 8, 14, 11, 14, 14, 13, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4],
      54: [20, 16, 18, 15, 20, 12, 21, 10, 21, 7, 20, 5, 17, 4, 12, 4, 7, 5, 3, 7, 1, 10, 0, 11, 0, 14, 1, 16, 3, 17, 6, 17, 7, 16, 10, 14, 12, 11, 13, 10, 13, 7, 12, 5, 10, 4, 7],
      55: [20, 17, 21, 7, 0, undefined, 3, 21, 17, 21],
      56: [20, 8, 21, 5, 20, 4, 18, 4, 16, 5, 14, 7, 13, 11, 12, 14, 11, 16, 9, 17, 7, 17, 4, 16, 2, 15, 1, 12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6, 11, 9, 12, 13, 13, 15, 14, 16, 16, 16, 18, 15, 20, 12, 21, 8, 21],
      57: [20, 16, 14, 15, 11, 13, 9, 10, 8, 9, 8, 6, 9, 4, 11, 3, 14, 3, 15, 4, 18, 6, 20, 9, 21, 10, 21, 13, 20, 15, 18, 16, 14, 16, 9, 15, 4, 13, 1, 10, 0, 8, 0, 5, 1, 4, 3],
      58: [10, 5, 14, 4, 13, 5, 12, 6, 13, 5, 14, undefined, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
      59: [10, 5, 14, 4, 13, 5, 12, 6, 13, 5, 14, undefined, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4],
      60: [24, 20, 18, 4, 9, 20, 0],
      61: [26, 4, 12, 22, 12, undefined, 4, 6, 22, 6],
      62: [24, 4, 18, 20, 9, 4, 0],
      63: [18, 3, 16, 3, 17, 4, 19, 5, 20, 7, 21, 11, 21, 13, 20, 14, 19, 15, 17, 15, 15, 14, 13, 13, 12, 9, 10, 9, 7, undefined, 9, 2, 8, 1, 9, 0, 10, 1, 9, 2],
      64: [27, 18, 13, 17, 15, 15, 16, 12, 16, 10, 15, 9, 14, 8, 11, 8, 8, 9, 6, 11, 5, 14, 5, 16, 6, 17, 8, undefined, 12, 16, 10, 14, 9, 11, 9, 8, 10, 6, 11, 5, undefined, 18, 16, 17, 8, 17, 6, 19, 5, 21, 5, 23, 7, 24, 10, 24, 12, 23, 15, 22, 17, 20, 19, 18, 20, 15, 21, 12, 21, 9, 20, 7, 19, 5, 17, 4, 15, 3, 12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1, 12, 0, 15, 0, 18, 1, 20, 2, 21, 3, undefined, 19, 16, 18, 8, 18, 6, 19, 5],
      65: [18, 9, 21, 1, 0, undefined, 9, 21, 17, 0, undefined, 4, 7, 14, 7],
      66: [21, 4, 21, 4, 0, undefined, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, undefined, 4, 11, 13, 11, 16, 10, 17, 9, 18, 7, 18, 4, 17, 2, 16, 1, 13, 0, 4, 0],
      67: [21, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5],
      68: [21, 4, 21, 4, 0, undefined, 4, 21, 11, 21, 14, 20, 16, 18, 17, 16, 18, 13, 18, 8, 17, 5, 16, 3, 14, 1, 11, 0, 4, 0],
      69: [19, 4, 21, 4, 0, undefined, 4, 21, 17, 21, undefined, 4, 11, 12, 11, undefined, 4, 0, 17, 0],
      70: [18, 4, 21, 4, 0, undefined, 4, 21, 17, 21, undefined, 4, 11, 12, 11],
      71: [21, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 18, 8, undefined, 13, 8, 18, 8],
      72: [22, 4, 21, 4, 0, undefined, 18, 21, 18, 0, undefined, 4, 11, 18, 11],
      73: [8, 4, 21, 4, 0],
      74: [16, 12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7],
      75: [21, 4, 21, 4, 0, undefined, 18, 21, 4, 7, undefined, 9, 12, 18, 0],
      76: [17, 4, 21, 4, 0, undefined, 4, 0, 16, 0],
      77: [24, 4, 21, 4, 0, undefined, 4, 21, 12, 0, undefined, 20, 21, 12, 0, undefined, 20, 21, 20, 0],
      78: [22, 4, 21, 4, 0, undefined, 4, 21, 18, 0, undefined, 18, 21, 18, 0],
      79: [22, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21],
      80: [21, 4, 21, 4, 0, undefined, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 14, 17, 12, 16, 11, 13, 10, 4, 10],
      81: [22, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, undefined, 12, 4, 18, -2],
      82: [21, 4, 21, 4, 0, undefined, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, 4, 11, undefined, 11, 11, 18, 0],
      83: [20, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3],
      84: [16, 8, 21, 8, 0, undefined, 1, 21, 15, 21],
      85: [22, 4, 21, 4, 6, 5, 3, 7, 1, 10, 0, 12, 0, 15, 1, 17, 3, 18, 6, 18, 21],
      86: [18, 1, 21, 9, 0, undefined, 17, 21, 9, 0],
      87: [24, 2, 21, 7, 0, undefined, 12, 21, 7, 0, undefined, 12, 21, 17, 0, undefined, 22, 21, 17, 0],
      88: [20, 3, 21, 17, 0, undefined, 17, 21, 3, 0],
      89: [18, 1, 21, 9, 11, 9, 0, undefined, 17, 21, 9, 11],
      90: [20, 17, 21, 3, 0, undefined, 3, 21, 17, 21, undefined, 3, 0, 17, 0],
      91: [14, 4, 25, 4, -7, undefined, 5, 25, 5, -7, undefined, 4, 25, 11, 25, undefined, 4, -7, 11, -7],
      92: [14, 0, 21, 14, -3],
      93: [14, 9, 25, 9, -7, undefined, 10, 25, 10, -7, undefined, 3, 25, 10, 25, undefined, 3, -7, 10, -7],
      94: [16, 6, 15, 8, 18, 10, 15, undefined, 3, 12, 8, 17, 13, 12, undefined, 8, 17, 8, 0],
      95: [16, 0, -2, 16, -2],
      96: [10, 6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17],
      97: [19, 15, 14, 15, 0, undefined, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
      98: [19, 4, 21, 4, 0, undefined, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3],
      99: [18, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
      100: [19, 15, 21, 15, 0, undefined, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
      101: [18, 3, 8, 15, 8, 15, 10, 14, 12, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
      102: [12, 10, 21, 8, 21, 6, 20, 5, 17, 5, 0, undefined, 2, 14, 9, 14],
      103: [19, 15, 14, 15, -2, 14, -5, 13, -6, 11, -7, 8, -7, 6, -6, undefined, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
      104: [19, 4, 21, 4, 0, undefined, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0],
      105: [8, 3, 21, 4, 20, 5, 21, 4, 22, 3, 21, undefined, 4, 14, 4, 0],
      106: [10, 5, 21, 6, 20, 7, 21, 6, 22, 5, 21, undefined, 6, 14, 6, -3, 5, -6, 3, -7, 1, -7],
      107: [17, 4, 21, 4, 0, undefined, 14, 14, 4, 4, undefined, 8, 8, 15, 0],
      108: [8, 4, 21, 4, 0],
      109: [30, 4, 14, 4, 0, undefined, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, undefined, 15, 10, 18, 13, 20, 14, 23, 14, 25, 13, 26, 10, 26, 0],
      110: [19, 4, 14, 4, 0, undefined, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0],
      111: [19, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, 16, 6, 16, 8, 15, 11, 13, 13, 11, 14, 8, 14],
      112: [19, 4, 14, 4, -7, undefined, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3],
      113: [19, 15, 14, 15, -7, undefined, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
      114: [13, 4, 14, 4, 0, undefined, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14],
      115: [17, 14, 11, 13, 13, 10, 14, 7, 14, 4, 13, 3, 11, 4, 9, 6, 8, 11, 7, 13, 6, 14, 4, 14, 3, 13, 1, 10, 0, 7, 0, 4, 1, 3, 3],
      116: [12, 5, 21, 5, 4, 6, 1, 8, 0, 10, 0, undefined, 2, 14, 9, 14],
      117: [19, 4, 14, 4, 4, 5, 1, 7, 0, 10, 0, 12, 1, 15, 4, undefined, 15, 14, 15, 0],
      118: [16, 2, 14, 8, 0, undefined, 14, 14, 8, 0],
      119: [22, 3, 14, 7, 0, undefined, 11, 14, 7, 0, undefined, 11, 14, 15, 0, undefined, 19, 14, 15, 0],
      120: [17, 3, 14, 14, 0, undefined, 14, 14, 3, 0],
      121: [16, 2, 14, 8, 0, undefined, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7],
      122: [17, 14, 14, 3, 0, undefined, 3, 14, 14, 14, undefined, 3, 0, 14, 0],
      123: [14, 9, 25, 7, 24, 6, 23, 5, 21, 5, 19, 6, 17, 7, 16, 8, 14, 8, 12, 6, 10, undefined, 7, 24, 6, 22, 6, 20, 7, 18, 8, 17, 9, 15, 9, 13, 8, 11, 4, 9, 8, 7, 9, 5, 9, 3, 8, 1, 7, 0, 6, -2, 6, -4, 7, -6, undefined, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5, -1, 5, -3, 6, -5, 7, -6, 9, -7],
      124: [8, 4, 25, 4, -7],
      125: [14, 5, 25, 7, 24, 8, 23, 9, 21, 9, 19, 8, 17, 7, 16, 6, 14, 6, 12, 8, 10, undefined, 7, 24, 8, 22, 8, 20, 7, 18, 6, 17, 5, 15, 5, 13, 6, 11, 10, 9, 6, 7, 5, 5, 5, 3, 6, 1, 7, 0, 8, -2, 8, -4, 7, -6, undefined, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9, -1, 9, -3, 8, -5, 7, -6, 5, -7],
      126: [24, 3, 6, 3, 8, 4, 11, 6, 12, 8, 12, 10, 11, 14, 8, 16, 7, 18, 7, 20, 8, 21, 10, undefined, 3, 8, 4, 10, 6, 11, 8, 11, 10, 10, 14, 7, 16, 6, 18, 6, 20, 7, 21, 10, 21, 12]
    };

    const defaultsVectorParams = {
      xOffset: 0,
      yOffset: 0,
      input: '?',
      align: 'left',
      font: simplex,
      height: 14, // == old vector_xxx simplex font height
      lineSpacing: 2.142857142857143, // == 30/14 == old vector_xxx ratio
      letterSpacing: 1,
      extrudeOffset: 0
    };

    // vectorsXXX parameters handler
    const vectorParams = (options, input) => {
      if (!input && typeof options === 'string') {
        options = { input: options };
      }
      options = options || {};
      const params = Object.assign({}, defaultsVectorParams, options);
      params.input = input || params.input;
      return params
    };

    var vectorParams_1 = vectorParams;

    /**
     * Represents a character as a list of segments
     * @typedef {Object} VectorCharObject
     * @property {Float} width - character width
     * @property {Float} height - character height (uppercase)
     * @property {Array} segments - character segments [[[x, y], ...], ...]
     */

    /** Construct a {@link VectorCharObject} from a ascii character whose code is between 31 and 127,
    * if the character is not supported it is replaced by a question mark.
    * @param {Object|String} [options] - options for construction or ascii character
    * @param {Float} [options.xOffset=0] - x offset
    * @param {Float} [options.yOffset=0] - y offset
    * @param {Float} [options.height=21] - font size (uppercase height)
    * @param {Float} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character
    * @param {String} [options.input='?'] - ascii character (ignored/overwrited if provided as seconds parameter)
    * @param {String} [char='?'] - ascii character
    * @returns {VectorCharObject}
    * @alias module:modeling/text.vectorChar
    *
    * @example
    * let vectorCharObject = vectorChar()
    * or
    * let vectorCharObject = vectorChar('A')
    * or
    * let vectorCharObject = vectorChar({ xOffset: 57 }, 'C')
    * or
    * let vectorCharObject = vectorChar({ xOffset: 78, input: '!' })
    */
    const vectorChar = (options, char) => {
      const {
        xOffset, yOffset, input, font, height, extrudeOffset
      } = vectorParams_1(options, char);
      let code = input.charCodeAt(0);
      if (!code || !font[code]) {
        code = 63; // 63 => ?
      }
      const glyph = [].concat(font[code]);
      const ratio = (height - extrudeOffset) / font.height;
      const extrudeYOffset = (extrudeOffset / 2);
      const width = glyph.shift() * ratio;
      const segments = [];
      let polyline = [];
      for (let i = 0, il = glyph.length; i < il; i += 2) {
        const gx = ratio * glyph[i] + xOffset;
        const gy = ratio * glyph[i + 1] + yOffset + extrudeYOffset;
        if (glyph[i] !== undefined) {
          polyline.push([gx, gy]);
          continue
        }
        segments.push(polyline);
        polyline = [];
        i--;
      }
      if (polyline.length) {
        segments.push(polyline);
      }
      return { width, height, segments }
    };

    var vectorChar_1 = vectorChar;

    // translate text line
    const translateLine = (options, line) => {
      const { x, y } = Object.assign({ x: 0, y: 0 }, options || {});
      const segments = line.segments;
      let segment = null;
      let point = null;
      for (let i = 0, il = segments.length; i < il; i++) {
        segment = segments[i];
        for (let j = 0, jl = segment.length; j < jl; j++) {
          point = segment[j];
          segment[j] = [point[0] + x, point[1] + y];
        }
      }
      return line
    };

    /**
     * Construct an array of character segments from a ascii string whose characters code is between 31 and 127,
     * if one character is not supported it is replaced by a question mark.
     * @param {Object|String} [options] - options for construction or ascii string
     * @param {Float} [options.xOffset=0] - x offset
     * @param {Float} [options.yOffset=0] - y offset
     * @param {Float} [options.height=21] - font size (uppercase height)
     * @param {Float} [options.lineSpacing=1.4] - line spacing expressed as a percentage of font size
     * @param {Float} [options.letterSpacing=1] - extra letter spacing expressed as a percentage of font size
     * @param {String} [options.align='left'] - multi-line text alignment: left, center, right
     * @param {Float} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character
     * @param {String} [options.input='?'] - ascii string (ignored/overwrited if provided as seconds parameter)
     * @param {String} [text='?'] - ascii string
     * @returns {Array} characters segments [[[x, y], ...], ...]
     * @alias module:modeling/text.vectorText
     *
     * @example
     * let textSegments = vectorText()
     * or
     * let textSegments = vectorText('OpenJSCAD')
     * or
     * let textSegments = vectorText({ yOffset: -50 }, 'OpenJSCAD')
     * or
     * let textSegments = vectorText({ yOffset: -80, input: 'OpenJSCAD' })
     */
    const vectorText = (options, text) => {
      const {
        xOffset, yOffset, input, font, height, align, extrudeOffset, lineSpacing, letterSpacing
      } = vectorParams_1(options, text);
      let [x, y] = [xOffset, yOffset];
      let i, il, char, vect, width, diff;
      let line = { width: 0, segments: [] };
      const lines = [];
      let output = [];
      let maxWidth = 0;
      const lineStart = x;
      const pushLine = () => {
        lines.push(line);
        maxWidth = Math.max(maxWidth, line.width);
        line = { width: 0, segments: [] };
      };
      for (i = 0, il = input.length; i < il; i++) {
        char = input[i];
        vect = vectorChar_1({ xOffset: x, yOffset: y, font, height, extrudeOffset }, char);
        if (char === '\n') {
          x = lineStart;
          y -= vect.height * lineSpacing;
          pushLine();
          continue
        }
        width = vect.width * letterSpacing;
        line.width += width;
        x += width;
        if (char !== ' ') {
          line.segments = line.segments.concat(vect.segments);
        }
      }
      if (line.segments.length) {
        pushLine();
      }
      for (i = 0, il = lines.length; i < il; i++) {
        line = lines[i];
        if (maxWidth > line.width) {
          diff = maxWidth - line.width;
          if (align === 'right') {
            line = translateLine({ x: diff }, line);
          } else if (align === 'center') {
            line = translateLine({ x: diff / 2 }, line);
          }
        }
        output = output.concat(line.segments);
      }
      return output
    };

    var vectorText_1 = vectorText;

    /**
     * Texts provide sets of segments for each character or text strings.
     * The segments can be used to create outlines for both 2D and 3D geometry.
     * Note: Only ASCII characters are supported.
     * @module modeling/text
     * @example
     * const { vectorChar, vectorText } = require('@jscad/modeling').text
     */
    var text = {
      vectorChar: vectorChar_1,
      vectorText: vectorText_1
    };

    // list of supported geometries




    /**
     * @param {Array} shapes - list of shapes to compare
     * @returns {Boolean} true if the given shapes are of the same type
     * @alias module:modeling/utils.areAllShapesTheSameType
     */
    const areAllShapesTheSameType = (shapes) => {
      let previousType;
      for (const shape of shapes) {
        let currentType = 0;
        if (geom2$2.isA(shape)) currentType = 1;
        if (geom3$2.isA(shape)) currentType = 2;
        if (path2$2.isA(shape)) currentType = 3;

        if (previousType && currentType !== previousType) return false
        previousType = currentType;
      }
      return true
    };

    var areAllShapesTheSameType_1 = areAllShapesTheSameType;

    /**
     * Convert the given angle (degrees) to radians.
     * @param {Number} degrees - angle in degrees
     * @returns {Number} angle in radians
     * @alias module:modeling/utils.degToRad
     */
    const degToRad = (degrees) => degrees * 0.017453292519943295;

    var degToRad_1 = degToRad;

    /**
     * @alias module:modeling/utils.fnNumberSort
     */
    const fnNumberSort$1 = (a, b) => a - b;

    var fnNumberSort_1 = fnNumberSort$1;

    /**
     * Insert the given element into the give array using the compareFunction.
     * @alias module:modeling/utils.insertSorted
     */
    const insertSorted$1 = (array, element, comparefunc) => {
      let leftbound = 0;
      let rightbound = array.length;
      while (rightbound > leftbound) {
        const testindex = Math.floor((leftbound + rightbound) / 2);
        const testelement = array[testindex];
        const compareresult = comparefunc(element, testelement);
        if (compareresult > 0) { // element > testelement
          leftbound = testindex + 1;
        } else {
          rightbound = testindex;
        }
      }
      array.splice(leftbound, 0, element);
    };

    var insertSorted_1 = insertSorted$1;

    /**
     * Calculate the number of segments from the given radius based on minimum length or angle.
     * @param {Number} radius - radius of the requested shape
     * @param {Number} minimumLength - minimum length of segments; 0 > length
     * @param {Number} minimumAngle - minimum angle (radians) between segments; 0 > angle < Math.PI * 2
     * @returns {Number} number of segments to complete the radius
     * @alias module:modeling/utils.radiusToSegments
     */
    const radiusToSegments = (radius, minimumLength, minimumAngle) => {
      const ss = minimumLength > 0 ? radius * 2 * Math.PI / minimumLength : 0;
      const as = minimumAngle > 0 ? Math.PI * 2 / minimumAngle : 0;
      // minimum segments is four(4) for round primitives
      return Math.ceil(Math.max(ss, as, 4))
    };

    var radiusToSegments_1 = radiusToSegments;

    /**
     * Convert the given angle (radians) to degrees.
     * @param {Number} radians - angle in radians
     * @returns {Number} angle in degrees
     * @alias module:modeling/utils.radToDeg
     */
    const radToDeg = (radians) => radians * 57.29577951308232;

    var radToDeg_1 = radToDeg;

    /**
     * Utility functions of various sorts.
     * @module modeling/utils
     * @example
     * const { flatten, insertSorted } = require('@jscad/modeling').utils
     */
    var utils = {
      areAllShapesTheSameType: areAllShapesTheSameType_1,
      cos: trigonometry.cos,
      degToRad: degToRad_1,
      flatten: flatten_1,
      fnNumberSort: fnNumberSort_1,
      insertSorted: insertSorted_1,
      radiusToSegments: radiusToSegments_1,
      radToDeg: radToDeg_1,
      sin: trigonometry.sin
    };

    const fromFakePolygon = (epsilon, polygon) => {
      // this can happen based on union, seems to be residuals -
      // return null and handle in caller
      if (polygon.vertices.length < 4) {
        return null
      }
      const vert1Indices = [];
      const points3D = polygon.vertices.filter((vertex, i) => {
        if (vertex[2] > 0) {
          vert1Indices.push(i);
          return true
        }
        return false
      });

      if (points3D.length !== 2) {
        throw new Error('Assertion failed: fromFakePolygon: not enough points found') // TBD remove later
      }

      const points2D = points3D.map((v3) => {
        const x = Math.round(v3[0] / epsilon) * epsilon + 0; // no more -0
        const y = Math.round(v3[1] / epsilon) * epsilon + 0; // no more -0
        return vec2.fromValues(x, y)
      });

      if (vec2.equals(points2D[0], points2D[1])) return null

      const d = vert1Indices[1] - vert1Indices[0];
      if (d === 1 || d === 3) {
        if (d === 1) {
          points2D.reverse();
        }
      } else {
        throw new Error('Assertion failed: fromFakePolygon: unknown index ordering')
      }
      return points2D
    };

    /*
     * Convert the given polygons to a list of sides.
     * The polygons must have only z coordinates +1 and -1, as constructed by to3DWalls().
     */
    const fromFakePolygons = (epsilon, polygons) => {
      const sides = polygons.map((polygon) => fromFakePolygon(epsilon, polygon)).filter((polygon) => (polygon !== null));
      return geom2$2.create(sides)
    };

    var fromFakePolygons_1 = fromFakePolygons;

    /*
     * Create a polygon (wall) from the given Z values and side.
     */
    const to3DWall = (z0, z1, side) => {
      const points = [
        vec3$1.fromVec2(vec3$1.create(), side[0], z0),
        vec3$1.fromVec2(vec3$1.create(), side[1], z0),
        vec3$1.fromVec2(vec3$1.create(), side[1], z1),
        vec3$1.fromVec2(vec3$1.create(), side[0], z1)
      ];
      return poly3.fromPoints(points)
    };

    /*
     * Create a 3D geometry with walls, as constructed from the given options and geometry.
     *
     * @param {Object} options - options with Z offsets
     * @param {geom2} geometry - geometry used as base of walls
     * @return {geom3} the new geometry
     */
    const to3DWalls = (options, geometry) => {
      const sides = geom2$2.toSides(geometry);

      const polygons = sides.map((side) => to3DWall(options.z0, options.z1, side));

      const result = geom3$2.create(polygons);
      return result
    };

    var to3DWalls_1 = to3DWalls;

    /*
     * Class OrthoNormalBasis
     * Reprojects points on a 3D plane onto a 2D plane
     * or from a 2D plane back onto the 3D plane
     * @param  {plane} plane
     * @param  {vec3} rightvector
     */
    const OrthoNormalBasis = function (plane, rightvector) {
      if (arguments.length < 2) {
        // choose an arbitrary right hand vector, making sure it is somewhat orthogonal to the plane normal:
        rightvector = vec3$1.orthogonal(vec3$1.create(), plane);
      }
      this.v = vec3$1.normalize(vec3$1.create(), vec3$1.cross(vec3$1.create(), plane, rightvector));
      this.u = vec3$1.cross(vec3$1.create(), this.v, plane);
      this.plane = plane;
      this.planeorigin = vec3$1.scale(vec3$1.create(), plane, plane[3]);
    };

    // Get an orthonormal basis for the standard XYZ planes.
    // Parameters: the names of two 3D axes. The 2d x axis will map to the first given 3D axis, the 2d y
    // axis will map to the second.
    // Prepend the axis with a "-" to invert the direction of this axis.
    // For example: OrthoNormalBasis.GetCartesian("-Y","Z")
    //   will return an orthonormal basis where the 2d X axis maps to the 3D inverted Y axis, and
    //   the 2d Y axis maps to the 3D Z axis.
    OrthoNormalBasis.GetCartesian = function (xaxisid, yaxisid) {
      const axisid = xaxisid + '/' + yaxisid;
      let planenormal, rightvector;
      if (axisid === 'X/Y') {
        planenormal = [0, 0, 1];
        rightvector = [1, 0, 0];
      } else if (axisid === 'Y/-X') {
        planenormal = [0, 0, 1];
        rightvector = [0, 1, 0];
      } else if (axisid === '-X/-Y') {
        planenormal = [0, 0, 1];
        rightvector = [-1, 0, 0];
      } else if (axisid === '-Y/X') {
        planenormal = [0, 0, 1];
        rightvector = [0, -1, 0];
      } else if (axisid === '-X/Y') {
        planenormal = [0, 0, -1];
        rightvector = [-1, 0, 0];
      } else if (axisid === '-Y/-X') {
        planenormal = [0, 0, -1];
        rightvector = [0, -1, 0];
      } else if (axisid === 'X/-Y') {
        planenormal = [0, 0, -1];
        rightvector = [1, 0, 0];
      } else if (axisid === 'Y/X') {
        planenormal = [0, 0, -1];
        rightvector = [0, 1, 0];
      } else if (axisid === 'X/Z') {
        planenormal = [0, -1, 0];
        rightvector = [1, 0, 0];
      } else if (axisid === 'Z/-X') {
        planenormal = [0, -1, 0];
        rightvector = [0, 0, 1];
      } else if (axisid === '-X/-Z') {
        planenormal = [0, -1, 0];
        rightvector = [-1, 0, 0];
      } else if (axisid === '-Z/X') {
        planenormal = [0, -1, 0];
        rightvector = [0, 0, -1];
      } else if (axisid === '-X/Z') {
        planenormal = [0, 1, 0];
        rightvector = [-1, 0, 0];
      } else if (axisid === '-Z/-X') {
        planenormal = [0, 1, 0];
        rightvector = [0, 0, -1];
      } else if (axisid === 'X/-Z') {
        planenormal = [0, 1, 0];
        rightvector = [1, 0, 0];
      } else if (axisid === 'Z/X') {
        planenormal = [0, 1, 0];
        rightvector = [0, 0, 1];
      } else if (axisid === 'Y/Z') {
        planenormal = [1, 0, 0];
        rightvector = [0, 1, 0];
      } else if (axisid === 'Z/-Y') {
        planenormal = [1, 0, 0];
        rightvector = [0, 0, 1];
      } else if (axisid === '-Y/-Z') {
        planenormal = [1, 0, 0];
        rightvector = [0, -1, 0];
      } else if (axisid === '-Z/Y') {
        planenormal = [1, 0, 0];
        rightvector = [0, 0, -1];
      } else if (axisid === '-Y/Z') {
        planenormal = [-1, 0, 0];
        rightvector = [0, -1, 0];
      } else if (axisid === '-Z/-Y') {
        planenormal = [-1, 0, 0];
        rightvector = [0, 0, -1];
      } else if (axisid === 'Y/-Z') {
        planenormal = [-1, 0, 0];
        rightvector = [0, 1, 0];
      } else if (axisid === 'Z/Y') {
        planenormal = [-1, 0, 0];
        rightvector = [0, 0, 1];
      } else {
        throw new Error('OrthoNormalBasis.GetCartesian: invalid combination of axis identifiers. Should pass two string arguments from [X,Y,Z,-X,-Y,-Z], being two different axes.')
      }
      return new OrthoNormalBasis(new Plane(new Vector3D(planenormal), 0), new Vector3D(rightvector))
    };

    /*
    // test code for OrthoNormalBasis.GetCartesian()
    OrthoNormalBasis.GetCartesian_Test=function() {
      let axisnames=["X","Y","Z","-X","-Y","-Z"];
      let axisvectors=[[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]];
      for(let axis1=0; axis1 < 3; axis1++) {
        for(let axis1inverted=0; axis1inverted < 2; axis1inverted++) {
          let axis1name=axisnames[axis1+3*axis1inverted];
          let axis1vector=axisvectors[axis1+3*axis1inverted];
          for(let axis2=0; axis2 < 3; axis2++) {
            if(axis2 != axis1) {
              for(let axis2inverted=0; axis2inverted < 2; axis2inverted++) {
                let axis2name=axisnames[axis2+3*axis2inverted];
                let axis2vector=axisvectors[axis2+3*axis2inverted];
                let orthobasis=OrthoNormalBasis.GetCartesian(axis1name, axis2name);
                let test1=orthobasis.to3D(new Vector2D([1,0]));
                let test2=orthobasis.to3D(new Vector2D([0,1]));
                let expected1=new Vector3D(axis1vector);
                let expected2=new Vector3D(axis2vector);
                let d1=test1.distanceTo(expected1);
                let d2=test2.distanceTo(expected2);
                if( (d1 > 0.01) || (d2 > 0.01) ) {
                  throw new Error("Wrong!");
      }}}}}}
      throw new Error("OK");
    };
    */

    // The z=0 plane, with the 3D x and y vectors mapped to the 2D x and y vector
    OrthoNormalBasis.Z0Plane = function () {
      const plane = new Plane(new Vector3D([0, 0, 1]), 0);
      return new OrthoNormalBasis(plane, new Vector3D([1, 0, 0]))
    };

    OrthoNormalBasis.prototype = {

      getProjectionMatrix: function () {
        return mat4.fromValues(
          this.u[0], this.v[0], this.plane[0], 0,
          this.u[1], this.v[1], this.plane[1], 0,
          this.u[2], this.v[2], this.plane[2], 0,
          0, 0, -this.plane[3], 1
        )
      },

      getInverseProjectionMatrix: function () {
        const p = vec3$1.scale(vec3$1.create(), this.plane, this.plane[3]);
        return mat4.fromValues(
          this.u[0], this.u[1], this.u[2], 0,
          this.v[0], this.v[1], this.v[2], 0,
          this.plane[0], this.plane[1], this.plane[2], 0,
          p[0], p[1], p[2], 1
        )
      },

      to2D: function (point) {
        return vec2.fromValues(vec3$1.dot(point, this.u), vec3$1.dot(point, this.v))
      },

      to3D: function (point) {
        const v1 = vec3$1.scale(vec3$1.create(), this.u, point[0]);
        const v2 = vec3$1.scale(vec3$1.create(), this.v, point[1]);

        const v3 = vec3$1.add(v1, v1, this.planeorigin);
        const v4 = vec3$1.add(v2, v2, v3);
        return v4
      },

      line3Dto2D: function (line3d) {
        const a = line3d.point;
        const b = line3d.direction.plus(a);
        const a2d = this.to2D(a);
        const b2d = this.to2D(b);
        return Line2D.fromPoints(a2d, b2d)
      },

      line2Dto3D: function (line2d) {
        const a = line2d.origin();
        const b = line2d.direction().plus(a);
        const a3d = this.to3D(a);
        const b3d = this.to3D(b);
        return Line3D.fromPoints(a3d, b3d)
      },

      transform: function (matrix4x4) {
        // todo: this may not work properly in case of mirroring
        const newplane = this.plane.transform(matrix4x4);
        const rightpointTransformed = this.u.transform(matrix4x4);
        const originTransformed = new Vector3D(0, 0, 0).transform(matrix4x4);
        const newrighthandvector = rightpointTransformed.minus(originTransformed);
        const newbasis = new OrthoNormalBasis(newplane, newrighthandvector);
        return newbasis
      }
    };

    var OrthoNormalBasis_1 = OrthoNormalBasis;

    const { EPS: EPS$5 } = constants;






    const { insertSorted, fnNumberSort } = utils;



    /*
     * Retesselation for a set of COPLANAR polygons.
     * @param {poly3[]} sourcepolygons - list of polygons
     * @returns {poly3[]} new set of polygons
     */
    const reTesselateCoplanarPolygons = (sourcepolygons) => {
      if (sourcepolygons.length < 2) return sourcepolygons

      const destpolygons = [];
      const numpolygons = sourcepolygons.length;
      const plane = poly3.plane(sourcepolygons[0]);
      const orthobasis = new OrthoNormalBasis_1(plane);
      const polygonvertices2d = []; // array of array of Vector2D
      const polygontopvertexindexes = []; // array of indexes of topmost vertex per polygon
      const topy2polygonindexes = {};
      const ycoordinatetopolygonindexes = {};

      const ycoordinatebins = {};

      // convert all polygon vertices to 2D
      // Make a list of all encountered y coordinates
      // And build a map of all polygons that have a vertex at a certain y coordinate:
      const ycoordinateBinningFactor = 1.0 / EPS$5 * 10;
      for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
        const poly3d = sourcepolygons[polygonindex];
        let vertices2d = [];
        let numvertices = poly3d.vertices.length;
        let minindex = -1;
        if (numvertices > 0) {
          let miny;
          let maxy;
          for (let i = 0; i < numvertices; i++) {
            let pos2d = orthobasis.to2D(poly3d.vertices[i]);
            // perform binning of y coordinates: If we have multiple vertices very
            // close to each other, give them the same y coordinate:
            const ycoordinatebin = Math.floor(pos2d[1] * ycoordinateBinningFactor);
            let newy;
            if (ycoordinatebin in ycoordinatebins) {
              newy = ycoordinatebins[ycoordinatebin];
            } else if (ycoordinatebin + 1 in ycoordinatebins) {
              newy = ycoordinatebins[ycoordinatebin + 1];
            } else if (ycoordinatebin - 1 in ycoordinatebins) {
              newy = ycoordinatebins[ycoordinatebin - 1];
            } else {
              newy = pos2d[1];
              ycoordinatebins[ycoordinatebin] = pos2d[1];
            }
            pos2d = vec2.fromValues(pos2d[0], newy);
            vertices2d.push(pos2d);
            const y = pos2d[1];
            if ((i === 0) || (y < miny)) {
              miny = y;
              minindex = i;
            }
            if ((i === 0) || (y > maxy)) {
              maxy = y;
            }
            if (!(y in ycoordinatetopolygonindexes)) {
              ycoordinatetopolygonindexes[y] = {};
            }
            ycoordinatetopolygonindexes[y][polygonindex] = true;
          }
          if (miny >= maxy) {
            // degenerate polygon, all vertices have same y coordinate. Just ignore it from now:
            vertices2d = [];
            numvertices = 0;
            minindex = -1;
          } else {
            if (!(miny in topy2polygonindexes)) {
              topy2polygonindexes[miny] = [];
            }
            topy2polygonindexes[miny].push(polygonindex);
          }
        } // if(numvertices > 0)
        // reverse the vertex order:
        vertices2d.reverse();
        minindex = numvertices - minindex - 1;
        polygonvertices2d.push(vertices2d);
        polygontopvertexindexes.push(minindex);
      }
      const ycoordinates = [];
      for (const ycoordinate in ycoordinatetopolygonindexes) ycoordinates.push(ycoordinate);
      ycoordinates.sort(fnNumberSort);

      // Now we will iterate over all y coordinates, from lowest to highest y coordinate
      // activepolygons: source polygons that are 'active', i.e. intersect with our y coordinate
      //   Is sorted so the polygons are in left to right order
      // Each element in activepolygons has these properties:
      //        polygonindex: the index of the source polygon (i.e. an index into the sourcepolygons
      //                      and polygonvertices2d arrays)
      //        leftvertexindex: the index of the vertex at the left side of the polygon (lowest x)
      //                         that is at or just above the current y coordinate
      //        rightvertexindex: dito at right hand side of polygon
      //        topleft, bottomleft: coordinates of the left side of the polygon crossing the current y coordinate
      //        topright, bottomright: coordinates of the right hand side of the polygon crossing the current y coordinate
      let activepolygons = [];
      let prevoutpolygonrow = [];
      for (let yindex = 0; yindex < ycoordinates.length; yindex++) {
        const newoutpolygonrow = [];
        const ycoordinateasstring = ycoordinates[yindex];
        const ycoordinate = Number(ycoordinateasstring);

        // update activepolygons for this y coordinate:
        // - Remove any polygons that end at this y coordinate
        // - update leftvertexindex and rightvertexindex (which point to the current vertex index
        //   at the the left and right side of the polygon
        // Iterate over all polygons that have a corner at this y coordinate:
        const polygonindexeswithcorner = ycoordinatetopolygonindexes[ycoordinateasstring];
        for (let activepolygonindex = 0; activepolygonindex < activepolygons.length; ++activepolygonindex) {
          const activepolygon = activepolygons[activepolygonindex];
          const polygonindex = activepolygon.polygonindex;
          if (polygonindexeswithcorner[polygonindex]) {
            // this active polygon has a corner at this y coordinate:
            const vertices2d = polygonvertices2d[polygonindex];
            const numvertices = vertices2d.length;
            let newleftvertexindex = activepolygon.leftvertexindex;
            let newrightvertexindex = activepolygon.rightvertexindex;
            // See if we need to increase leftvertexindex or decrease rightvertexindex:
            while (true) {
              let nextleftvertexindex = newleftvertexindex + 1;
              if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
              if (vertices2d[nextleftvertexindex][1] !== ycoordinate) break
              newleftvertexindex = nextleftvertexindex;
            }
            let nextrightvertexindex = newrightvertexindex - 1;
            if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1;
            if (vertices2d[nextrightvertexindex][1] === ycoordinate) {
              newrightvertexindex = nextrightvertexindex;
            }
            if ((newleftvertexindex !== activepolygon.leftvertexindex) && (newleftvertexindex === newrightvertexindex)) {
              // We have increased leftvertexindex or decreased rightvertexindex, and now they point to the same vertex
              // This means that this is the bottom point of the polygon. We'll remove it:
              activepolygons.splice(activepolygonindex, 1);
              --activepolygonindex;
            } else {
              activepolygon.leftvertexindex = newleftvertexindex;
              activepolygon.rightvertexindex = newrightvertexindex;
              activepolygon.topleft = vertices2d[newleftvertexindex];
              activepolygon.topright = vertices2d[newrightvertexindex];
              let nextleftvertexindex = newleftvertexindex + 1;
              if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
              activepolygon.bottomleft = vertices2d[nextleftvertexindex];
              let nextrightvertexindex = newrightvertexindex - 1;
              if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1;
              activepolygon.bottomright = vertices2d[nextrightvertexindex];
            }
          } // if polygon has corner here
        } // for activepolygonindex
        let nextycoordinate;
        if (yindex >= ycoordinates.length - 1) {
          // last row, all polygons must be finished here:
          activepolygons = [];
          nextycoordinate = null;
        } else { // yindex < ycoordinates.length-1
          nextycoordinate = Number(ycoordinates[yindex + 1]);
          const middleycoordinate = 0.5 * (ycoordinate + nextycoordinate);
          // update activepolygons by adding any polygons that start here:
          const startingpolygonindexes = topy2polygonindexes[ycoordinateasstring];
          for (const polygonindexKey in startingpolygonindexes) {
            const polygonindex = startingpolygonindexes[polygonindexKey];
            const vertices2d = polygonvertices2d[polygonindex];
            const numvertices = vertices2d.length;
            const topvertexindex = polygontopvertexindexes[polygonindex];
            // the top of the polygon may be a horizontal line. In that case topvertexindex can point to any point on this line.
            // Find the left and right topmost vertices which have the current y coordinate:
            let topleftvertexindex = topvertexindex;
            while (true) {
              let i = topleftvertexindex + 1;
              if (i >= numvertices) i = 0;
              if (vertices2d[i][1] !== ycoordinate) break
              if (i === topvertexindex) break // should not happen, but just to prevent endless loops
              topleftvertexindex = i;
            }
            let toprightvertexindex = topvertexindex;
            while (true) {
              let i = toprightvertexindex - 1;
              if (i < 0) i = numvertices - 1;
              if (vertices2d[i][1] !== ycoordinate) break
              if (i === topleftvertexindex) break // should not happen, but just to prevent endless loops
              toprightvertexindex = i;
            }
            let nextleftvertexindex = topleftvertexindex + 1;
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
            let nextrightvertexindex = toprightvertexindex - 1;
            if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1;
            const newactivepolygon = {
              polygonindex: polygonindex,
              leftvertexindex: topleftvertexindex,
              rightvertexindex: toprightvertexindex,
              topleft: vertices2d[topleftvertexindex],
              topright: vertices2d[toprightvertexindex],
              bottomleft: vertices2d[nextleftvertexindex],
              bottomright: vertices2d[nextrightvertexindex]
            };
            insertSorted(activepolygons, newactivepolygon, (el1, el2) => {
              const x1 = interpolateBetween2DPointsForY_1(el1.topleft, el1.bottomleft, middleycoordinate);
              const x2 = interpolateBetween2DPointsForY_1(el2.topleft, el2.bottomleft, middleycoordinate);
              if (x1 > x2) return 1
              if (x1 < x2) return -1
              return 0
            });
          } // for(let polygonindex in startingpolygonindexes)
        } //  yindex < ycoordinates.length-1
        // if( (yindex === ycoordinates.length-1) || (nextycoordinate - ycoordinate > EPS) )
        // FIXME : what ???

        // Now activepolygons is up to date
        // Build the output polygons for the next row in newoutpolygonrow:
        for (const activepolygonKey in activepolygons) {
          const activepolygon = activepolygons[activepolygonKey];

          let x = interpolateBetween2DPointsForY_1(activepolygon.topleft, activepolygon.bottomleft, ycoordinate);
          const topleft = vec2.fromValues(x, ycoordinate);
          x = interpolateBetween2DPointsForY_1(activepolygon.topright, activepolygon.bottomright, ycoordinate);
          const topright = vec2.fromValues(x, ycoordinate);
          x = interpolateBetween2DPointsForY_1(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate);
          const bottomleft = vec2.fromValues(x, nextycoordinate);
          x = interpolateBetween2DPointsForY_1(activepolygon.topright, activepolygon.bottomright, nextycoordinate);
          const bottomright = vec2.fromValues(x, nextycoordinate);
          const outpolygon = {
            topleft: topleft,
            topright: topright,
            bottomleft: bottomleft,
            bottomright: bottomright,
            leftline: line2.fromPoints(line2.create(), topleft, bottomleft),
            rightline: line2.fromPoints(line2.create(), bottomright, topright)
          };
          if (newoutpolygonrow.length > 0) {
            const prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1];
            const d1 = vec2.distance(outpolygon.topleft, prevoutpolygon.topright);
            const d2 = vec2.distance(outpolygon.bottomleft, prevoutpolygon.bottomright);
            if ((d1 < EPS$5) && (d2 < EPS$5)) {
              // we can join this polygon with the one to the left:
              outpolygon.topleft = prevoutpolygon.topleft;
              outpolygon.leftline = prevoutpolygon.leftline;
              outpolygon.bottomleft = prevoutpolygon.bottomleft;
              newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1);
            }
          }
          newoutpolygonrow.push(outpolygon);
        } // for(activepolygon in activepolygons)
        if (yindex > 0) {
          // try to match the new polygons against the previous row:
          const prevcontinuedindexes = {};
          const matchedindexes = {};
          for (let i = 0; i < newoutpolygonrow.length; i++) {
            const thispolygon = newoutpolygonrow[i];
            for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
              if (!matchedindexes[ii]) { // not already processed?
                // We have a match if the sidelines are equal or if the top coordinates
                // are on the sidelines of the previous polygon
                const prevpolygon = prevoutpolygonrow[ii];
                if (vec2.distance(prevpolygon.bottomleft, thispolygon.topleft) < EPS$5) {
                  if (vec2.distance(prevpolygon.bottomright, thispolygon.topright) < EPS$5) {
                    // Yes, the top of this polygon matches the bottom of the previous:
                    matchedindexes[ii] = true;
                    // Now check if the joined polygon would remain convex:
                    const v1 = line2.direction(thispolygon.leftline);
                    const v2 = line2.direction(prevpolygon.leftline);
                    const d1 = v1[0] - v2[0];

                    const v3 = line2.direction(thispolygon.rightline);
                    const v4 = line2.direction(prevpolygon.rightline);
                    const d2 = v3[0] - v4[0];

                    const leftlinecontinues = Math.abs(d1) < EPS$5;
                    const rightlinecontinues = Math.abs(d2) < EPS$5;
                    const leftlineisconvex = leftlinecontinues || (d1 >= 0);
                    const rightlineisconvex = rightlinecontinues || (d2 >= 0);
                    if (leftlineisconvex && rightlineisconvex) {
                      // yes, both sides have convex corners:
                      // This polygon will continue the previous polygon
                      thispolygon.outpolygon = prevpolygon.outpolygon;
                      thispolygon.leftlinecontinues = leftlinecontinues;
                      thispolygon.rightlinecontinues = rightlinecontinues;
                      prevcontinuedindexes[ii] = true;
                    }
                    break
                  }
                }
              } // if(!prevcontinuedindexes[ii])
            } // for ii
          } // for i
          for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
            if (!prevcontinuedindexes[ii]) {
              // polygon ends here
              // Finish the polygon with the last point(s):
              const prevpolygon = prevoutpolygonrow[ii];
              prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright);
              if (vec2.distance(prevpolygon.bottomright, prevpolygon.bottomleft) > EPS$5) {
                // polygon ends with a horizontal line:
                prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft);
              }
              // reverse the left half so we get a counterclockwise circle:
              prevpolygon.outpolygon.leftpoints.reverse();
              const points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints);
              const vertices3d = points2d.map((point2d) => orthobasis.to3D(point2d));
              const polygon = poly3.fromPointsAndPlane(vertices3d, plane); // TODO support shared

              // if we let empty polygon out, next retesselate will crash
              if (polygon.vertices.length) destpolygons.push(polygon);
            }
          }
        } // if(yindex > 0)
        for (let i = 0; i < newoutpolygonrow.length; i++) {
          const thispolygon = newoutpolygonrow[i];
          if (!thispolygon.outpolygon) {
            // polygon starts here:
            thispolygon.outpolygon = {
              leftpoints: [],
              rightpoints: []
            };
            thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
            if (vec2.distance(thispolygon.topleft, thispolygon.topright) > EPS$5) {
              // we have a horizontal line at the top:
              thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
            }
          } else {
            // continuation of a previous row
            if (!thispolygon.leftlinecontinues) {
              thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
            }
            if (!thispolygon.rightlinecontinues) {
              thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
            }
          }
        }
        prevoutpolygonrow = newoutpolygonrow;
      } // for yindex
      return destpolygons
    };

    var reTesselateCoplanarPolygons_1 = reTesselateCoplanarPolygons;

    // Normals are directional vectors with component values from 0 to 1.0, requiring specialized comparison
    // This EPS is derived from a series of tests to determine the optimal precision for comparing coplanar polygons,
    // as provided by the sphere primitive at high segmentation
    // This EPS is for 64 bit Number values
    const NEPS$1 = 1e-13;

    // Compare two normals (unit vectors) for equality.
    const aboutEqualNormals$1 = (a, b) => (Math.abs(a[0] - b[0]) <= NEPS$1 && Math.abs(a[1] - b[1]) <= NEPS$1 && Math.abs(a[2] - b[2]) <= NEPS$1);

    const coplanar$1 = (plane1, plane2) => {
      // expect the same distance from the origin, within tolerance
      if (Math.abs(plane1[3] - plane2[3]) < 0.00000015) {
        return aboutEqualNormals$1(plane1, plane2)
      }
      return false
    };

    /*
      After boolean operations all coplanar polygon fragments are joined by a retesselating
      operation. geom3.reTesselate(geom).
      Retesselation is done through a linear sweep over the polygon surface.
      The sweep line passes over the y coordinates of all vertices in the polygon.
      Polygons are split at each sweep line, and the fragments are joined horizontally and vertically into larger polygons
      (making sure that we will end up with convex polygons).
    */
    const retessellate = (geometry) => {
      if (geometry.isRetesselated) {
        return geometry
      }

      const polygons = geom3$2.toPolygons(geometry);
      const polygonsPerPlane = []; // elements: [plane, [poly3...]]
      polygons.forEach((polygon) => {
        const mapping = polygonsPerPlane.find((element) => coplanar$1(element[0], poly3.plane(polygon)));
        if (mapping) {
          const polygons = mapping[1];
          polygons.push(polygon);
        } else {
          polygonsPerPlane.push([poly3.plane(polygon), [polygon]]);
        }
      });

      let destpolygons = [];
      polygonsPerPlane.forEach((mapping) => {
        const sourcepolygons = mapping[1];
        const retesselayedpolygons = reTesselateCoplanarPolygons_1(sourcepolygons);
        destpolygons = destpolygons.concat(retesselayedpolygons);
      });

      const result = geom3$2.create(destpolygons);
      result.isRetesselated = true;

      return result
    };

    var retessellate_1 = retessellate;

    const { EPS: EPS$4 } = constants;



    /*
     * Determine if the given geometries overlap by comparing min and max bounds.
     * NOTE: This is used in union for performance gains.
     * @param {geom3} geometry1 - geometry for comparison
     * @param {geom3} geometry2 - geometry for comparison
     * @returns {boolean} true if the geometries overlap
     */
    const mayOverlap = (geometry1, geometry2) => {
      // FIXME accessing the data structure of the geometry should not be allowed
      if ((geometry1.polygons.length === 0) || (geometry2.polygons.length === 0)) {
        return false
      }

      const bounds1 = measureBoundingBox_1(geometry1);
      const min1 = bounds1[0];
      const max1 = bounds1[1];

      const bounds2 = measureBoundingBox_1(geometry2);
      const min2 = bounds2[0];
      const max2 = bounds2[1];

      if ((min2[0] - max1[0]) > EPS$4) return false
      if ((min1[0] - max2[0]) > EPS$4) return false
      if ((min2[1] - max1[1]) > EPS$4) return false
      if ((min1[1] - max2[1]) > EPS$4) return false
      if ((min2[2] - max1[2]) > EPS$4) return false
      if ((min1[2] - max2[2]) > EPS$4) return false
      return true
    };

    var mayOverlap_1 = mayOverlap;

    // # class Node
    // Holds a node in a BSP tree.
    // A BSP tree is built from a collection of polygons by picking a polygon to split along.
    // Polygons are not stored directly in the tree, but in PolygonTreeNodes, stored in this.polygontreenodes.
    // Those PolygonTreeNodes are children of the owning Tree.polygonTree.
    // This is not a leafy BSP tree since there is no distinction between internal and leaf nodes.
    class Node {
      constructor (parent) {
        this.plane = null;
        this.front = null;
        this.back = null;
        this.polygontreenodes = [];
        this.parent = parent;
      }

      // Convert solid space to empty space and empty space to solid space.
      invert () {
        const queue = [this];
        let node;
        for (let i = 0; i < queue.length; i++) {
          node = queue[i];
          if (node.plane) node.plane = plane$1.flip(plane$1.create(), node.plane);
          if (node.front) queue.push(node.front);
          if (node.back) queue.push(node.back);
          const temp = node.front;
          node.front = node.back;
          node.back = temp;
        }
      }

      // clip polygontreenodes to our plane
      // calls remove() for all clipped PolygonTreeNodes
      clipPolygons (polygontreenodes, alsoRemovecoplanarFront) {
        let current = { node: this, polygontreenodes: polygontreenodes };
        let node;
        const stack = [];

        do {
          node = current.node;
          polygontreenodes = current.polygontreenodes;

          if (node.plane) {
            const plane = node.plane;

            const backnodes = [];
            const frontnodes = [];
            const coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes;
            const numpolygontreenodes = polygontreenodes.length;
            for (let i = 0; i < numpolygontreenodes; i++) {
              const treenode = polygontreenodes[i];
              if (!treenode.isRemoved()) {
                // split this polygon tree node using the plane
                // NOTE: children are added to the tree if there are spanning polygons
                treenode.splitByPlane(plane, coplanarfrontnodes, backnodes, frontnodes, backnodes);
              }
            }

            if (node.front && (frontnodes.length > 0)) {
              // add front node for further splitting
              stack.push({ node: node.front, polygontreenodes: frontnodes });
            }
            const numbacknodes = backnodes.length;
            if (node.back && (numbacknodes > 0)) {
              // add back node for further splitting
              stack.push({ node: node.back, polygontreenodes: backnodes });
            } else {
              // remove all back nodes from processing
              for (let i = 0; i < numbacknodes; i++) {
                backnodes[i].remove();
              }
            }
          }
          current = stack.pop();
        } while (current !== undefined)
      }

      // Remove all polygons in this BSP tree that are inside the other BSP tree
      // `tree`.
      clipTo (tree, alsoRemovecoplanarFront) {
        let node = this;
        const stack = [];
        do {
          if (node.polygontreenodes.length > 0) {
            tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront);
          }
          if (node.front) stack.push(node.front);
          if (node.back) stack.push(node.back);
          node = stack.pop();
        } while (node !== undefined)
      }

      addPolygonTreeNodes (newpolygontreenodes) {
        let current = { node: this, polygontreenodes: newpolygontreenodes };
        const stack = [];
        do {
          const node = current.node;
          const polygontreenodes = current.polygontreenodes;

          if (polygontreenodes.length === 0) {
            current = stack.pop();
            continue
          }
          if (!node.plane) {
            let index = 0; // default
            index = Math.floor(polygontreenodes.length / 2);
            // index = polygontreenodes.length >> 1
            // index = Math.floor(Math.random()*polygontreenodes.length)
            const bestpoly = polygontreenodes[index].getPolygon();
            node.plane = poly3.plane(bestpoly);
          }
          const frontnodes = [];
          const backnodes = [];
          const n = polygontreenodes.length;
          for (let i = 0; i < n; ++i) {
            polygontreenodes[i].splitByPlane(node.plane, node.polygontreenodes, backnodes, frontnodes, backnodes);
          }

          if (frontnodes.length > 0) {
            if (!node.front) node.front = new Node(node);

            // unable to split by any of the current nodes
            const stopCondition = n === frontnodes.length && backnodes.length === 0;
            if (stopCondition) node.front.polygontreenodes = frontnodes;
            else stack.push({ node: node.front, polygontreenodes: frontnodes });
          }
          if (backnodes.length > 0) {
            if (!node.back) node.back = new Node(node);

            // unable to split by any of the current nodes
            const stopCondition = n === backnodes.length && frontnodes.length === 0;

            if (stopCondition) node.back.polygontreenodes = backnodes;
            else stack.push({ node: node.back, polygontreenodes: backnodes });
          }

          current = stack.pop();
        } while (current !== undefined)
      }
    }

    var Node_1 = Node;

    const splitLineSegmentByPlane = (plane, p1, p2) => {
      const direction = vec3$1.subtract(vec3$1.create(), p2, p1);
      let lambda = (plane[3] - vec3$1.dot(plane, p1)) / vec3$1.dot(plane, direction);
      if (Number.isNaN(lambda)) lambda = 0;
      if (lambda > 1) lambda = 1;
      if (lambda < 0) lambda = 0;

      vec3$1.scale(direction, direction, lambda);
      vec3$1.add(direction, p1, direction);
      return direction
    };

    var splitLineSegmentByPlane_1 = splitLineSegmentByPlane;

    const { EPS: EPS$3 } = constants;








    // Returns object:
    // .type:
    //   0: coplanar-front
    //   1: coplanar-back
    //   2: front
    //   3: back
    //   4: spanning
    // In case the polygon is spanning, returns:
    // .front: a Polygon3 of the front part
    // .back: a Polygon3 of the back part
    const splitPolygonByPlane = (splane, polygon) => {
      const result = {
        type: null,
        front: null,
        back: null
      };
      // cache in local lets (speedup):
      const vertices = polygon.vertices;
      const numvertices = vertices.length;
      const pplane = poly3.plane(polygon);
      if (plane$1.equals(pplane, splane)) {
        result.type = 0;
      } else {
        let hasfront = false;
        let hasback = false;
        const vertexIsBack = [];
        const MINEPS = -EPS$3;
        for (let i = 0; i < numvertices; i++) {
          const t = vec3$1.dot(splane, vertices[i]) - splane[3];
          const isback = (t < MINEPS);
          vertexIsBack.push(isback);
          if (t > EPS$3) hasfront = true;
          if (t < MINEPS) hasback = true;
        }
        if ((!hasfront) && (!hasback)) {
          // all points coplanar
          const t = vec3$1.dot(splane, pplane);
          result.type = (t >= 0) ? 0 : 1;
        } else if (!hasback) {
          result.type = 2;
        } else if (!hasfront) {
          result.type = 3;
        } else {
          // spanning
          result.type = 4;
          const frontvertices = [];
          const backvertices = [];
          let isback = vertexIsBack[0];
          for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
            const vertex = vertices[vertexindex];
            let nextvertexindex = vertexindex + 1;
            if (nextvertexindex >= numvertices) nextvertexindex = 0;
            const nextisback = vertexIsBack[nextvertexindex];
            if (isback === nextisback) {
              // line segment is on one side of the plane:
              if (isback) {
                backvertices.push(vertex);
              } else {
                frontvertices.push(vertex);
              }
            } else {
              // line segment intersects plane:
              const nextpoint = vertices[nextvertexindex];
              const intersectionpoint = splitLineSegmentByPlane_1(splane, vertex, nextpoint);
              if (isback) {
                backvertices.push(vertex);
                backvertices.push(intersectionpoint);
                frontvertices.push(intersectionpoint);
              } else {
                frontvertices.push(vertex);
                frontvertices.push(intersectionpoint);
                backvertices.push(intersectionpoint);
              }
            }
            isback = nextisback;
          } // for vertexindex
          // remove duplicate vertices:
          const EPS_SQUARED = EPS$3 * EPS$3;
          if (backvertices.length >= 3) {
            let prevvertex = backvertices[backvertices.length - 1];
            for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {
              const vertex = backvertices[vertexindex];
              if (vec3$1.squaredDistance(vertex, prevvertex) < EPS_SQUARED) {
                backvertices.splice(vertexindex, 1);
                vertexindex--;
              }
              prevvertex = vertex;
            }
          }
          if (frontvertices.length >= 3) {
            let prevvertex = frontvertices[frontvertices.length - 1];
            for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {
              const vertex = frontvertices[vertexindex];
              if (vec3$1.squaredDistance(vertex, prevvertex) < EPS_SQUARED) {
                frontvertices.splice(vertexindex, 1);
                vertexindex--;
              }
              prevvertex = vertex;
            }
          }
          if (frontvertices.length >= 3) {
            result.front = poly3.fromPointsAndPlane(frontvertices, pplane);
          }
          if (backvertices.length >= 3) {
            result.back = poly3.fromPointsAndPlane(backvertices, pplane);
          }
        }
      }
      return result
    };

    var splitPolygonByPlane_1 = splitPolygonByPlane;

    const { EPS: EPS$2 } = constants;







    // # class PolygonTreeNode
    // This class manages hierarchical splits of polygons.
    // At the top is a root node which does not hold a polygon, only child PolygonTreeNodes.
    // Below that are zero or more 'top' nodes; each holds a polygon.
    // The polygons can be in different planes.
    // splitByPlane() splits a node by a plane. If the plane intersects the polygon, two new child nodes
    // are created holding the splitted polygon.
    // getPolygons() retrieves the polygons from the tree. If for PolygonTreeNode the polygon is split but
    // the two split parts (child nodes) are still intact, then the unsplit polygon is returned.
    // This ensures that we can safely split a polygon into many fragments. If the fragments are untouched,
    // getPolygons() will return the original unsplit polygon instead of the fragments.
    // remove() removes a polygon from the tree. Once a polygon is removed, the parent polygons are invalidated
    // since they are no longer intact.
    class PolygonTreeNode {
      // constructor creates the root node
      constructor (parent, polygon) {
        this.parent = parent;
        this.children = [];
        this.polygon = polygon;
        this.removed = false;  // state of branch or leaf
      }

      // fill the tree with polygons. Should be called on the root node only; child nodes must
      // always be a derivate (split) of the parent node.
      addPolygons (polygons) {
        // new polygons can only be added to root node; children can only be splitted polygons
        if (!this.isRootNode()) {
          throw new Error('Assertion failed')
        }
        const _this = this;
        polygons.forEach((polygon) => {
          _this.addChild(polygon);
        });
      }

      // remove a node
      // - the siblings become toplevel nodes
      // - the parent is removed recursively
      remove () {
        if (!this.removed) {
          this.removed = true;
          this.polygon = null;

          // remove ourselves from the parent's children list:
          const parentschildren = this.parent.children;
          const i = parentschildren.indexOf(this);
          if (i < 0) throw new Error('Assertion failed')
          parentschildren.splice(i, 1);

          // invalidate the parent's polygon, and of all parents above it:
          this.parent.recursivelyInvalidatePolygon();
        }
      }

      isRemoved () {
        return this.removed
      }

      isRootNode () {
        return !this.parent
      }

      // invert all polygons in the tree. Call on the root node
      invert () {
        if (!this.isRootNode()) throw new Error('Assertion failed') // can only call this on the root node
        this.invertSub();
      }

      getPolygon () {
        if (!this.polygon) throw new Error('Assertion failed') // doesn't have a polygon, which means that it has been broken down
        return this.polygon
      }

      getPolygons (result) {
        let children = [this];
        const queue = [children];
        let i, j, l, node;
        for (i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length
          children = queue[i];
          for (j = 0, l = children.length; j < l; j++) { // ok to cache length
            node = children[j];
            if (node.polygon) {
              // the polygon hasn't been broken yet. We can ignore the children and return our polygon:
              result.push(node.polygon);
            } else {
              // our polygon has been split up and broken, so gather all subpolygons from the children
              if (node.children.length > 0) queue.push(node.children);
            }
          }
        }
      }

      // split the node by a plane; add the resulting nodes to the frontnodes and backnodes array
      // If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays
      // If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,
      //  and added to both arrays.
      splitByPlane (plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
        if (this.children.length) {
          const queue = [this.children];
          let i;
          let j;
          let l;
          let node;
          let nodes;
          for (i = 0; i < queue.length; i++) { // queue.length can increase, do not cache
            nodes = queue[i];
            for (j = 0, l = nodes.length; j < l; j++) { // ok to cache length
              node = nodes[j];
              if (node.children.length > 0) {
                queue.push(node.children);
              } else {
                // no children. Split the polygon:
                node._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
              }
            }
          }
        } else {
          this._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
        }
      }

      // only to be called for nodes with no children
      _splitByPlane (splane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
        const polygon = this.polygon;
        if (polygon) {
          const bound = poly3.measureBoundingSphere(polygon);
          const sphereradius = bound[1] + EPS$2; // ensure radius is LARGER then polygon
          const spherecenter = bound[0];
          const d = vec3$1.dot(splane, spherecenter) - splane[3];
          if (d > sphereradius) {
            frontnodes.push(this);
          } else if (d < -sphereradius) {
            backnodes.push(this);
          } else {
            const splitresult = splitPolygonByPlane_1(splane, polygon);
            switch (splitresult.type) {
              case 0:
                // coplanar front:
                coplanarfrontnodes.push(this);
                break

              case 1:
                // coplanar back:
                coplanarbacknodes.push(this);
                break

              case 2:
                // front:
                frontnodes.push(this);
                break

              case 3:
                // back:
                backnodes.push(this);
                break

              case 4:
                // spanning:
                if (splitresult.front) {
                  const frontnode = this.addChild(splitresult.front);
                  frontnodes.push(frontnode);
                }
                if (splitresult.back) {
                  const backnode = this.addChild(splitresult.back);
                  backnodes.push(backnode);
                }
                break
            }
          }
        }
      }

      // PRIVATE methods from here:
      // add child to a node
      // this should be called whenever the polygon is split
      // a child should be created for every fragment of the split polygon
      // returns the newly created child
      addChild (polygon) {
        const newchild = new PolygonTreeNode(this, polygon);
        this.children.push(newchild);
        return newchild
      }

      invertSub () {
        let children = [this];
        const queue = [children];
        let i, j, l, node;
        for (i = 0; i < queue.length; i++) {
          children = queue[i];
          for (j = 0, l = children.length; j < l; j++) {
            node = children[j];
            if (node.polygon) {
              node.polygon = poly3.invert(node.polygon);
            }
            if (node.children.length > 0) queue.push(node.children);
          }
        }
      }

      // private method
      // remove the polygon from the node, and all parent nodes above it
      // called to invalidate parents of removed nodes
      recursivelyInvalidatePolygon () {
        this.polygon = null;
        if (this.parent) {
          this.parent.recursivelyInvalidatePolygon();
        }
      }

      clear () {
        let children = [this];
        const queue = [children];
        for (let i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length
          children = queue[i];
          const l = children.length;
          for (let j = 0; j < l; j++) {
            const node = children[j];
            if (node.polygon) {
              node.polygon = null;
            }
            if (node.parent) {
              node.parent = null;
            }
            if (node.children.length > 0) queue.push(node.children);
            node.children = [];
          }
        }
      }

      toString () {
        let result = '';
        let children = [this];
        const queue = [children];
        let i, j, l, node;
        for (i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length
          children = queue[i];
          const prefix = ' '.repeat(i);
          for (j = 0, l = children.length; j < l; j++) { // ok to cache length
            node = children[j];
            result += `${prefix}PolygonTreeNode (${node.isRootNode()}): ${node.children.length}`;
            if (node.polygon) {
              result += `\n ${prefix}polygon: ${node.polygon.vertices}\n`;
            } else {
              result += '\n';
            }
            if (node.children.length > 0) queue.push(node.children);
          }
        }
        return result
      }
    }

    var PolygonTreeNode_1 = PolygonTreeNode;

    // # class Tree
    // This is the root of a BSP tree.
    // This separate class for the root of the tree in order to hold the PolygonTreeNode root.
    // The actual tree is kept in this.rootnode
    class Tree$3 {
      constructor (polygons) {
        this.polygonTree = new PolygonTreeNode_1();
        this.rootnode = new Node_1(null);
        if (polygons) this.addPolygons(polygons);
      }

      invert () {
        this.polygonTree.invert();
        this.rootnode.invert();
      }

      // Remove all polygons in this BSP tree that are inside the other BSP tree
      // `tree`.
      clipTo (tree, alsoRemovecoplanarFront = false) {
        this.rootnode.clipTo(tree, alsoRemovecoplanarFront);
      }

      allPolygons () {
        const result = [];
        this.polygonTree.getPolygons(result);
        return result
      }

      addPolygons (polygons) {
        const polygontreenodes = new Array(polygons.length);
        for (let i = 0; i < polygons.length; i++) {
          polygontreenodes[i] = this.polygonTree.addChild(polygons[i]);
        }
        this.rootnode.addPolygonTreeNodes(polygontreenodes);
      }

      clear () {
        this.polygonTree.clear();
      }

      toString () {
        const result = 'Tree: ' + this.polygonTree.toString('');
        return result
      }
    }

    var Tree_1 = Tree$3;

    var trees = {
      Tree: Tree_1
    };

    const { Tree: Tree$2 } = trees;

    /*
     * Return a new 3D geometry representing the space in both the first geometry and
     * the second geometry. None of the given geometries are modified.
     * @param {geom3} geometry1 - a geometry
     * @param {geom3} geometry2 - a geometry
     * @returns {geom3} new 3D geometry
     */
    const intersectGeom3Sub = (geometry1, geometry2) => {
      if (!mayOverlap_1(geometry1, geometry2)) {
        return geom3$2.create() // empty geometry
      }

      const a = new Tree$2(geom3$2.toPolygons(geometry1));
      const b = new Tree$2(geom3$2.toPolygons(geometry2));

      a.invert();
      b.clipTo(a);
      b.invert();
      a.clipTo(b);
      b.clipTo(a);
      a.addPolygons(b.allPolygons());
      a.invert();

      const newpolygons = a.allPolygons();
      return geom3$2.create(newpolygons)
    };

    var intersectGeom3Sub_1 = intersectGeom3Sub;

    /*
     * Return a new 3D geometry representing space in both the first geometry and
     * in the subsequent geometries. None of the given geometries are modified.
     * @param {...geom3} geometries - list of 3D geometries
     * @returns {geom3} new 3D geometry
     */
    const intersect$3 = (...geometries) => {
      geometries = flatten_1(geometries);

      let newgeometry = geometries.shift();
      geometries.forEach((geometry) => {
        newgeometry = intersectGeom3Sub_1(newgeometry, geometry);
      });

      newgeometry = retessellate_1(newgeometry);
      return newgeometry
    };

    var intersectGeom3 = intersect$3;

    /*
     * Return a new 2D geometry representing space in both the first geometry and
     * in the subsequent geometries. None of the given geometries are modified.
     * @param {...geom2} geometries - list of 2D geometries
     * @returns {geom2} new 2D geometry
     */
    const intersect$2 = (...geometries) => {
      geometries = flatten_1(geometries);
      const newgeometries = geometries.map((geometry) => to3DWalls_1({ z0: -1, z1: 1 }, geometry));

      const newgeom3 = intersectGeom3(newgeometries);
      const epsilon = measureEpsilon_1(newgeom3);

      return fromFakePolygons_1(epsilon, geom3$2.toPolygons(newgeom3))
    };

    var intersectGeom2 = intersect$2;

    /**
     * Return a new geometry representing space in both the first geometry and
     * all subsequent geometries.
     * The given geometries should be of the same type, either geom2 or geom3.
     *
     * @param {...Object} geometries - list of geometries
     * @returns {geom2|geom3} a new geometry
     * @alias module:modeling/booleans.intersect
     *
     * @example
     * let myshape = intersect(cube({size: [5,5,5]}), cube({size: [5,5,5], center: [5,5,5]}))
     *
     * @example
     * +-------+
     * |       |
     * |   A   |
     * |    +--+----+   =   +--+
     * +----+--+    |       +--+
     *      |   B   |
     *      |       |
     *      +-------+
     */
    const intersect$1 = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      if (!areAllShapesTheSameType_1(geometries)) {
        throw new Error('only intersect of the types are supported')
      }

      const geometry = geometries[0];
      // if (path.isA(geometry)) return pathintersect(matrix, geometries)
      if (geom2$2.isA(geometry)) return intersectGeom2(geometries)
      if (geom3$2.isA(geometry)) return intersectGeom3(geometries)
      return geometry
    };

    var intersect_1 = intersect$1;

    // returns array numerically sorted and duplicates removed
    const sortNb = (array) => array.sort((a, b) => a - b).filter((item, pos, ary) => !pos || item !== ary[pos - 1]);

    const insertMapping = (map, point, index) => {
      const key = `${point}`;
      const mapping = map.get(key);
      if (mapping === undefined) {
        map.set(key, [index]);
      } else {
        mapping.push(index);
      }
    };

    const findMapping = (map, point) => {
      const key = `${point}`;
      return map.get(key)
    };

    const scissionGeom3 = (geometry) => {
      // construit table de correspondance entre polygones
      // build polygons lookup table
      const eps = measureEpsilon_1(geometry);
      const polygons = geom3$2.toPolygons(geometry);
      const pl = polygons.length;

      const indexesPerPoint = new Map();
      const temp = vec3$1.create();
      polygons.forEach((polygon, index) => {
        polygon.vertices.forEach((point) => {
          insertMapping(indexesPerPoint, vec3$1.snap(temp, point, eps), index);
        });
      });

      const indexesPerPolygon = polygons.map((polygon) => {
        let indexes = [];
        polygon.vertices.forEach((point) => {
          indexes = indexes.concat(findMapping(indexesPerPoint, vec3$1.snap(temp, point, eps)));
        });
        return { e: 1, d: sortNb(indexes) } // for each polygon, push the list of indexes
      });

      indexesPerPoint.clear();

      // regroupe les correspondances des polygones se touchant
      // boucle ne s'arrêtant que quand deux passages retournent le même nb de polygones
      // merge lookup data from linked polygons as long as possible
      let merges = 0;
      const ippl = indexesPerPolygon.length;
      for (let i = 0; i < ippl; i++) {
        const mapi = indexesPerPolygon[i];
        // merge mappings if necessary
        if (mapi.e > 0) {
          const indexes = new Array(pl);
          indexes[i] = true; // include ourself
          do {
            merges = 0;
            // loop through the known indexes
            indexes.forEach((e, j) => {
              const mapj = indexesPerPolygon[j];
              // merge this mapping if necessary
              if (mapj.e > 0) {
                mapj.e = -1; // merged
                for (let d = 0; d < mapj.d.length; d++) {
                  indexes[mapj.d[d]] = true;
                }
                merges++;
              }
            });
          } while (merges > 0)
          mapi.indexes = indexes;
        }
      }

      // construit le tableau des geometry à retourner
      // build array of geometry to return
      const newgeometries = [];
      for (let i = 0; i < ippl; i++) {
        if (indexesPerPolygon[i].indexes) {
          const newpolygons = [];
          indexesPerPolygon[i].indexes.forEach((e, p) => newpolygons.push(polygons[p]));
          newgeometries.push(geom3$2.create(newpolygons));
        }
      }

      return newgeometries
    };

    var scissionGeom3_1 = scissionGeom3;

    // const geom2 = require('../../geometries/geom2')


    // const scissionGeom2 = require('./scissionGeom2')


    /**
     * Scission (divide) the given geometry into the component pieces.
     *
     * @param {...Object} objects - list of geometries
     * @returns {Array} list of pieces from each geometry
     * @alias module:modeling/booleans.scission
     *
     * @example
     * let figure = require('./my.stl')
     * let pieces = scission(figure)
     *
     * @example
     * +-------+            +-------+
     * |       |            |       |
     * |   +---+            | A +---+
     * |   |    +---+   =   |   |    +---+
     * +---+    |   |       +---+    |   |
     *      +---+   |            +---+   |
     *      |       |            |    B  |
     *      +-------+            +-------+
     */
    const scission = (...objects) => {
      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      const results = objects.map((object) => {
        // if (path2.isA(object)) return path2.transform(matrix, object)
        // if (geom2.isA(object)) return geom2.transform(matrix, object)
        if (geom3$2.isA(object)) return scissionGeom3_1(object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    var scission_1 = scission;

    const { Tree: Tree$1 } = trees;

    /*
     * Return a new 3D geometry representing the space in the first geometry but not
     * in the second geometry. None of the given geometries are modified.
     * @param {geom3} geometry1 - a geometry
     * @param {geom3} geometry2 - a geometry
     * @returns {geom3} new 3D geometry
     */
    const subtractGeom3Sub = (geometry1, geometry2) => {
      if (!mayOverlap_1(geometry1, geometry2)) {
        return geom3$2.clone(geometry1)
      }

      const a = new Tree$1(geom3$2.toPolygons(geometry1));
      const b = new Tree$1(geom3$2.toPolygons(geometry2));

      a.invert();
      a.clipTo(b);
      b.clipTo(a, true);
      a.addPolygons(b.allPolygons());
      a.invert();

      const newpolygons = a.allPolygons();
      return geom3$2.create(newpolygons)
    };

    var subtractGeom3Sub_1 = subtractGeom3Sub;

    /*
     * Return a new 3D geometry representing space in this geometry but not in the given geometries.
     * Neither this geometry nor the given geometries are modified.
     * @param {...geom3} geometries - list of geometries
     * @returns {geom3} new 3D geometry
     */
    const subtract$3 = (...geometries) => {
      geometries = flatten_1(geometries);

      let newgeometry = geometries.shift();
      geometries.forEach((geometry) => {
        newgeometry = subtractGeom3Sub_1(newgeometry, geometry);
      });

      newgeometry = retessellate_1(newgeometry);
      return newgeometry
    };

    var subtractGeom3 = subtract$3;

    /*
     * Return a new 2D geometry representing space in the first geometry but
     * not in the subsequent geometries. None of the given geometries are modified.
     * @param {...geom2} geometries - list of geometries
     * @returns {geom2} new 2D geometry
     */
    const subtract$2 = (...geometries) => {
      geometries = flatten_1(geometries);
      const newgeometries = geometries.map((geometry) => to3DWalls_1({ z0: -1, z1: 1 }, geometry));

      const newgeom3 = subtractGeom3(newgeometries);
      const epsilon = measureEpsilon_1(newgeom3);

      return fromFakePolygons_1(epsilon, geom3$2.toPolygons(newgeom3))
    };

    var subtractGeom2 = subtract$2;

    /**
     * Return a new geometry representing space in the first geometry but
     * not in all subsequent geometries.
     * The given geometries should be of the same type, either geom2 or geom3.
     *
     * @param {...Object} geometries - list of geometries
     * @returns {geom2|geom3} a new geometry
     * @alias module:modeling/booleans.subtract
     *
     * @example
     * let myshape = subtract(cuboid({size: [5,5,5]}), cuboid({size: [5,5,5], center: [5,5,5]}))
     *
     * @example
     * +-------+            +-------+
     * |       |            |       |
     * |   A   |            |       |
     * |    +--+----+   =   |    +--+
     * +----+--+    |       +----+
     *      |   B   |
     *      |       |
     *      +-------+
     */
    const subtract$1 = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      if (!areAllShapesTheSameType_1(geometries)) {
        throw new Error('only subtract of the types are supported')
      }

      const geometry = geometries[0];
      // if (path.isA(geometry)) return pathsubtract(matrix, geometries)
      if (geom2$2.isA(geometry)) return subtractGeom2(geometries)
      if (geom3$2.isA(geometry)) return subtractGeom3(geometries)
      return geometry
    };

    var subtract_1 = subtract$1;

    const { Tree } = trees;

    /*
     * Return a new 3D geometry representing the space in the given geometries.
     * @param {geom3} geometry1 - geometry to union
     * @param {geom3} geometry2 - geometry to union
     * @returns {geom3} new 3D geometry
     */
    const unionSub = (geometry1, geometry2) => {
      if (!mayOverlap_1(geometry1, geometry2)) {
        return unionForNonIntersecting(geometry1, geometry2)
      }

      const a = new Tree(geom3$2.toPolygons(geometry1));
      const b = new Tree(geom3$2.toPolygons(geometry2));

      a.clipTo(b, false);
      // b.clipTo(a, true); // ERROR: doesn't work
      b.clipTo(a);
      b.invert();
      b.clipTo(a);
      b.invert();

      const newpolygons = a.allPolygons().concat(b.allPolygons());
      const result = geom3$2.create(newpolygons);
      return result
    };

    // Like union, but when we know that the two solids are not intersecting
    // Do not use if you are not completely sure that the solids do not intersect!
    const unionForNonIntersecting = (geometry1, geometry2) => {
      let newpolygons = geom3$2.toPolygons(geometry1);
      newpolygons = newpolygons.concat(geom3$2.toPolygons(geometry2));
      return geom3$2.create(newpolygons)
    };

    var unionGeom3Sub = unionSub;

    /*
     * Return a new 3D geometry representing the space in the given 3D geometries.
     * @param {...objects} geometries - list of geometries to union
     * @returns {geom3} new 3D geometry
     */
    const union$3 = (...geometries) => {
      geometries = flatten_1(geometries);

      // combine geometries in a way that forms a balanced binary tree pattern
      let i;
      for (i = 1; i < geometries.length; i += 2) {
        geometries.push(unionGeom3Sub(geometries[i - 1], geometries[i]));
      }
      let newgeometry = geometries[i - 1];
      newgeometry = retessellate_1(newgeometry);
      return newgeometry
    };

    var unionGeom3 = union$3;

    /*
     * Return a new 2D geometry representing the total space in the given 2D geometries.
     * @param {...geom2} geometries - list of 2D geometries to union
     * @returns {geom2} new 2D geometry
     */
    const union$2 = (...geometries) => {
      geometries = flatten_1(geometries);
      const newgeometries = geometries.map((geometry) => to3DWalls_1({ z0: -1, z1: 1 }, geometry));

      const newgeom3 = unionGeom3(newgeometries);
      const epsilon = measureEpsilon_1(newgeom3);

      return fromFakePolygons_1(epsilon, geom3$2.toPolygons(newgeom3))
    };

    var unionGeom2 = union$2;

    /**
     * Return a new geometry representing the total space in the given geometries.
     * The given geometries should be of the same type, either geom2 or geom3.
     *
     * @param {...Object} geometries - list of geometries
     * @returns {geom2|geom3} a new geometry
     * @alias module:modeling/booleans.union
     *
     * @example
     * let myshape = union(cube({size: [5,5,5]}), cube({size: [5,5,5], center: [5,5,5]}))
     *
     * @example
     * +-------+            +-------+
     * |       |            |       |
     * |   A   |            |       |
     * |    +--+----+   =   |       +----+
     * +----+--+    |       +----+       |
     *      |   B   |            |       |
     *      |       |            |       |
     *      +-------+            +-------+
     */
    const union$1 = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      if (!areAllShapesTheSameType_1(geometries)) {
        throw new Error('only unions of the same type are supported')
      }

      const geometry = geometries[0];
      // if (path.isA(geometry)) return pathunion(matrix, geometries)
      if (geom2$2.isA(geometry)) return unionGeom2(geometries)
      if (geom3$2.isA(geometry)) return unionGeom3(geometries)
      return geometry
    };

    var union_1 = union$1;

    /**
     * All shapes (primitives or the results of operations) can be passed to boolean functions
     * to perform logical operations, e.g. remove a hole from a board.
     * In all cases, the function returns the results, and never changes the original shapes.
     * @module modeling/booleans
     * @example
     * const { intersect, subtract, union } = require('@jscad/modeling').booleans
     */
    var booleans = {
      intersect: intersect_1,
      scission: scission_1,
      subtract: subtract_1,
      union: union_1
    };
    var booleans_1 = booleans.intersect;
    var booleans_3 = booleans.subtract;
    var booleans_4 = booleans.union;

    const { EPS: EPS$1 } = constants;






    /*
     * Create a set of offset points from the given points using the given options (if any).
     * @param {Object} options - options for offset
     * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
     * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round
     * @param {Integer} [options.segments=16] - number of segments when creating round corners
     * @param {Integer} [options.closed=false] - is the last point connected back to the first point?
     * @param {Array} points - array of 2D points
     * @returns {Array} new set of offset points, plus points for each rounded corner
     */
    const offsetFromPoints = (options, points) => {
      const defaults = {
        delta: 1,
        corners: 'edge',
        closed: false,
        segments: 16
      };
      let { delta, corners, closed, segments } = Object.assign({ }, defaults, options);

      if (Math.abs(delta) < EPS$1) return points

      let rotation = options.closed ? area_1(points) : 1.0; // + counter clockwise, - clockwise
      if (rotation === 0) rotation = 1.0;

      // use right hand normal?
      const orientation = ((rotation > 0) && (delta >= 0)) || ((rotation < 0) && (delta < 0));
      delta = Math.abs(delta); // sign is no longer required

      let previousSegment = null;
      let newPoints = [];
      const newCorners = [];
      const of = vec2.create();
      const n = points.length;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const p0 = points[i];
        const p1 = points[j];
        // calculate the unit normal
        orientation ? vec2.subtract(of, p0, p1) : vec2.subtract(of, p1, p0);
        vec2.normal(of, of);
        vec2.normalize(of, of);
        // calculate the offset vector
        vec2.scale(of, of, delta);
        // calculate the new points (edge)
        const n0 = vec2.add(vec2.create(), p0, of);
        const n1 = vec2.add(vec2.create(), p1, of);

        const currentSegment = [n0, n1];
        if (previousSegment != null) {
          if (closed || (!closed && j !== 0)) {
            // check for intersection of new line segments
            const ip = intersect_1$1(previousSegment[0], previousSegment[1], currentSegment[0], currentSegment[1]);
            if (ip) {
              // adjust the previous points
              newPoints.pop();
              // adjust current points
              currentSegment[0] = ip;
            } else {
              newCorners.push({ c: p0, s0: previousSegment, s1: currentSegment });
            }
          }
        }
        previousSegment = [n0, n1];

        if (j === 0 && !closed) continue

        newPoints.push(currentSegment[0]);
        newPoints.push(currentSegment[1]);
      }
      // complete the closure if required
      if (closed && previousSegment != null) {
        // check for intersection of closing line segments
        const n0 = newPoints[0];
        const n1 = newPoints[1];
        const ip = intersect_1$1(previousSegment[0], previousSegment[1], n0, n1);
        if (ip) {
          // adjust the previous points
          newPoints[0] = ip;
          newPoints.pop();
        } else {
          const p0 = points[0];
          const cursegment = [n0, n1];
          newCorners.push({ c: p0, s0: previousSegment, s1: cursegment });
        }
      }

      // generate corners if necessary

      if (corners === 'edge') {
        // map for fast point index lookup
        const pointIndex = new Map(); // {point: index}
        newPoints.forEach((point, index) => pointIndex.set(point, index));

        // create edge corners
        const line0 = line2.create();
        const line1 = line2.create();
        newCorners.forEach((corner) => {
          line2.fromPoints(line0, corner.s0[0], corner.s0[1]);
          line2.fromPoints(line1, corner.s1[0], corner.s1[1]);
          const ip = line2.intersectPointOfLines(line0, line1);
          if (Number.isFinite(ip[0]) && Number.isFinite(ip[1])) {
            const p0 = corner.s0[1];
            const i = pointIndex.get(p0);
            newPoints[i] = ip;
            newPoints[(i + 1) % newPoints.length] = undefined;
          } else {
            // paralell segments, drop one
            const p0 = corner.s1[0];
            const i = pointIndex.get(p0);
            newPoints[i] = undefined;
          }
        });
        newPoints = newPoints.filter((p) => p !== undefined);
      }

      if (corners === 'round') {
        // create rounded corners
        let cornersegments = Math.floor(segments / 4);
        const v0 = vec2.create();
        newCorners.forEach((corner) => {
          // calculate angle of rotation
          let rotation = vec2.angle(vec2.subtract(v0, corner.s1[0], corner.c));
          rotation -= vec2.angle(vec2.subtract(v0, corner.s0[1], corner.c));
          if (orientation && rotation < 0) {
            rotation = rotation + Math.PI;
            if (rotation < 0) rotation = rotation + Math.PI;
          }
          if ((!orientation) && rotation > 0) {
            rotation = rotation - Math.PI;
            if (rotation > 0) rotation = rotation - Math.PI;
          }

          if (rotation !== 0.0) {
            // generate the segments
            cornersegments = Math.floor(segments * (Math.abs(rotation) / (2 * Math.PI)));
            const step = rotation / cornersegments;
            const start = vec2.angle(vec2.subtract(v0, corner.s0[1], corner.c));
            const cornerpoints = [];
            for (let i = 1; i < cornersegments; i++) {
              const radians = start + (step * i);
              const point = vec2.fromAngleRadians(vec2.create(), radians);
              vec2.scale(point, point, delta);
              vec2.add(point, point, corner.c);
              cornerpoints.push(point);
            }
            if (cornerpoints.length > 0) {
              const p0 = corner.s0[1];
              let i = newPoints.findIndex((point) => vec2.equals(p0, point));
              i = (i + 1) % newPoints.length;
              newPoints.splice(i, 0, ...cornerpoints);
            }
          } else {
            // paralell segments, drop one
            const p0 = corner.s1[0];
            const i = newPoints.findIndex((point) => vec2.equals(p0, point));
            newPoints.splice(i, 1);
          }
        });
      }
      return newPoints
    };

    var offsetFromPoints_1 = offsetFromPoints;

    /*
     * Expand the given geometry (geom2) using the given options (if any).
     * @param {Object} options - options for expand
     * @param {Number} [options.delta=1] - delta (+/-) of expansion
     * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round
     * @param {Integer} [options.segments=16] - number of segments when creating round corners
     * @param {geom2} geometry - the geometry to expand
     * @returns {geom2} expanded geometry
     */
    const expandGeom2 = (options, geometry) => {
      const defaults = {
        delta: 1,
        corners: 'edge',
        segments: 16
      };
      const { delta, corners, segments } = Object.assign({ }, defaults, options);

      if (!(corners === 'edge' || corners === 'chamfer' || corners === 'round')) {
        throw new Error('corners must be "edge", "chamfer", or "round"')
      }

      // convert the geometry to outlines, and generate offsets from each
      const outlines = geom2$2.toOutlines(geometry);
      const newoutlines = outlines.map((outline) => {
        options = {
          delta,
          corners,
          closed: true,
          segments
        };
        return offsetFromPoints_1(options, outline)
      });

      // create a composite geometry from the new outlines
      const allsides = newoutlines.reduce((sides, newoutline) => sides.concat(geom2$2.toSides(geom2$2.fromPoints(newoutline))), []);
      return geom2$2.create(allsides)
    };

    var expandGeom2_1 = expandGeom2;

    // Extrude a polygon in the direction of the offsetvector.
    // Returns (geom3) a new geometry
    const extrudePolygon = (offsetvector, polygon1) => {
      const direction = vec3$1.dot(poly3.plane(polygon1), offsetvector);
      if (direction > 0) {
        polygon1 = poly3.invert(polygon1);
      }

      const newpolygons = [polygon1];

      const polygon2 = poly3.transform(mat4.fromTranslation(mat4.create(), offsetvector), polygon1);
      const numvertices = polygon1.vertices.length;
      for (let i = 0; i < numvertices; i++) {
        const sidefacepoints = [];
        const nexti = (i < (numvertices - 1)) ? i + 1 : 0;
        sidefacepoints.push(polygon1.vertices[i]);
        sidefacepoints.push(polygon2.vertices[i]);
        sidefacepoints.push(polygon2.vertices[nexti]);
        sidefacepoints.push(polygon1.vertices[nexti]);
        const sidefacepolygon = poly3.fromPoints(sidefacepoints);
        newpolygons.push(sidefacepolygon);
      }
      newpolygons.push(poly3.invert(polygon2));

      return geom3$2.create(newpolygons)
    };

    var extrudePolygon_1 = extrudePolygon;

    const { EPS } = constants;
















    /*
     * Collect all planes adjacent to each vertex
     */
    const mapPlaneToVertex = (map, vertex, plane) => {
      const key = vertex.toString();
      if (!map.has(key)) {
        const entry = [vertex, [plane]];
        map.set(key, entry);
      } else {
        const planes = map.get(key)[1];
        planes.push(plane);
      }
    };

    /*
     * Collect all planes adjacent to each edge.
     * Combine undirected edges, no need for duplicate cylinders.
     */
    const mapPlaneToEdge = (map, edge, plane) => {
      const key0 = edge[0].toString();
      const key1 = edge[1].toString();
      // Sort keys to make edges undirected
      const key = key0 < key1 ? `${key0},${key1}` : `${key1},${key0}`;
      if (!map.has(key)) {
        const entry = [edge, [plane]];
        map.set(key, entry);
      } else {
        const planes = map.get(key)[1];
        planes.push(plane);
      }
    };

    const addUniqueAngle = (map, angle) => {
      const i = map.findIndex((item) => item === angle);
      if (i < 0) {
        map.push(angle);
      }
    };

    /*
     * Create the expanded shell of the solid:
     * All faces are extruded to 2 times delta
     * Cylinders are constructed around every side
     * Spheres are placed on every vertex
     * the result is a true expansion of the solid
     * @param  {Number} delta
     * @param  {Integer} segments
     */
    const expandShell = (options, geometry) => {
      const defaults = {
        delta: 1,
        segments: 12
      };
      const { delta, segments } = Object.assign({ }, defaults, options);

      let result = geom3$2.create();
      const vertices2planes = new Map(); // {vertex: [vertex, [plane, ...]]}
      const edges2planes = new Map(); // {edge: [[vertex, vertex], [plane, ...]]}

      const v1 = vec3$1.create();
      const v2 = vec3$1.create();

      // loop through the polygons
      // - extruded the polygon, and add to the composite result
      // - add the plane to the unique vertice map
      // - add the plane to the unique edge map
      const polygons = geom3$2.toPolygons(geometry);
      polygons.forEach((polygon, index) => {
        const extrudevector = vec3$1.scale(vec3$1.create(), poly3.plane(polygon), 2 * delta);
        const translatedpolygon = poly3.transform(mat4.fromTranslation(mat4.create(), vec3$1.scale(vec3$1.create(), extrudevector, -0.5)), polygon);
        const extrudedface = extrudePolygon_1(extrudevector, translatedpolygon);
        result = unionGeom3Sub(result, extrudedface);

        const vertices = polygon.vertices;
        for (let i = 0; i < vertices.length; i++) {
          mapPlaneToVertex(vertices2planes, vertices[i], poly3.plane(polygon));
          const j = (i + 1) % vertices.length;
          const edge = [vertices[i], vertices[j]];
          mapPlaneToEdge(edges2planes, edge, poly3.plane(polygon));
        }
      });

      // now construct a cylinder on every side
      // The cylinder is always an approximation of a true cylinder, having polygons
      // around the sides. We will make sure though that the cylinder will have an edge at every
      // face that touches this side. This ensures that we will get a smooth fill even
      // if two edges are at, say, 10 degrees and the segments is low.
      edges2planes.forEach((item) => {
        const edge = item[0];
        const planes = item[1];
        const startpoint = edge[0];
        const endpoint = edge[1];

        // our x,y and z vectors:
        const zbase = vec3$1.subtract(vec3$1.create(), endpoint, startpoint);
        vec3$1.normalize(zbase, zbase);
        const xbase = planes[0];
        const ybase = vec3$1.cross(vec3$1.create(), xbase, zbase);

        // make a list of angles that the cylinder should traverse:
        let angles = [];

        // first of all equally spaced around the cylinder:
        for (let i = 0; i < segments; i++) {
          addUniqueAngle(angles, (i * Math.PI * 2 / segments));
        }

        // and also at every normal of all touching planes:
        for (let i = 0, iMax = planes.length; i < iMax; i++) {
          const planenormal = planes[i];
          const si = vec3$1.dot(ybase, planenormal);
          const co = vec3$1.dot(xbase, planenormal);
          let angle = Math.atan2(si, co);

          if (angle < 0) angle += Math.PI * 2;
          addUniqueAngle(angles, angle);
          angle = Math.atan2(-si, -co);
          if (angle < 0) angle += Math.PI * 2;
          addUniqueAngle(angles, angle);
        }

        // this will result in some duplicate angles but we will get rid of those later.
        angles = angles.sort(fnNumberSort_1);

        // Now construct the cylinder by traversing all angles:
        const numangles = angles.length;
        let prevp1;
        let prevp2;
        const startfacevertices = [];
        const endfacevertices = [];
        const polygons = [];
        for (let i = -1; i < numangles; i++) {
          const angle = angles[(i < 0) ? (i + numangles) : i];
          const si = Math.sin(angle);
          const co = Math.cos(angle);
          vec3$1.scale(v1, xbase, co * delta);
          vec3$1.scale(v2, ybase, si * delta);
          vec3$1.add(v1, v1, v2);
          const p1 = vec3$1.add(vec3$1.create(), startpoint, v1);
          const p2 = vec3$1.add(vec3$1.create(), endpoint, v1);
          let skip = false;
          if (i >= 0) {
            if (vec3$1.distance(p1, prevp1) < EPS) {
              skip = true;
            }
          }
          if (!skip) {
            if (i >= 0) {
              startfacevertices.push(p1);
              endfacevertices.push(p2);
              const points = [prevp2, p2, p1, prevp1];
              const polygon = poly3.fromPoints(points);
              polygons.push(polygon);
            }
            prevp1 = p1;
            prevp2 = p2;
          }
        }
        endfacevertices.reverse();
        polygons.push(poly3.fromPoints(startfacevertices));
        polygons.push(poly3.fromPoints(endfacevertices));

        const cylinder = geom3$2.create(polygons);
        result = unionGeom3Sub(result, cylinder);
      });

      // build spheres at each unique vertex
      // We will try to set the x and z axis to the normals of 2 planes
      // This will ensure that our sphere tesselation somewhat matches 2 planes
      vertices2planes.forEach((item) => {
        const vertex = item[0];
        const planes = item[1];
        // use the first normal to be the x axis of our sphere:
        const xaxis = planes[0];
        // and find a suitable z axis. We will use the normal which is most perpendicular to the x axis:
        let bestzaxis = null;
        let bestzaxisorthogonality = 0;
        for (let i = 1; i < planes.length; i++) {
          const normal = planes[i];
          const cross = vec3$1.cross(v1, xaxis, normal);
          const crosslength = vec3$1.length(cross);
          if (crosslength > 0.05) { // FIXME why 0.05?
            if (crosslength > bestzaxisorthogonality) {
              bestzaxisorthogonality = crosslength;
              bestzaxis = normal;
            }
          }
        }
        if (!bestzaxis) {
          bestzaxis = vec3$1.orthogonal(v1, xaxis);
        }
        const yaxis = vec3$1.cross(v1, xaxis, bestzaxis);
        vec3$1.normalize(yaxis, yaxis);
        const zaxis = vec3$1.cross(v2, yaxis, xaxis);
        const corner = sphere_1({
          center: [vertex[0], vertex[1], vertex[2]],
          radius: delta,
          segments: segments,
          axes: [xaxis, yaxis, zaxis]
        });
        result = unionGeom3Sub(result, corner);
      });
      return retessellate_1(result)
    };

    var expandShell_1 = expandShell;

    /*
     * Expand the given geometry (geom3) using the given options (if any).
     * @param {Object} options - options for expand
     * @param {Number} [options.delta=1] - delta (+/-) of expansion
     * @param {String} [options.corners='round'] - type corner to create during of expansion; round
     * @param {Integer} [options.segments=12] - number of segments when creating round corners
     * @param {geom3} geometry - the geometry to expand
     * @returns {geom3} expanded geometry
     */
    const expandGeom3 = (options, geometry) => {
      const defaults = {
        delta: 1,
        corners: 'round',
        segments: 12
      };
      const { delta, corners, segments } = Object.assign({ }, defaults, options);

      if (!(corners === 'round')) {
        throw new Error('corners must be "round" for 3D geometries')
      }

      const polygons = geom3$2.toPolygons(geometry);
      if (polygons.length === 0) throw new Error('the given geometry cannot be empty')

      options = { delta, corners, segments };
      const expanded = expandShell_1(options, geometry);
      return union_1(geometry, expanded)
    };

    var expandGeom3_1 = expandGeom3;

    const createGeometryFromClosedOffsets = (paths) => {
      let { external, internal } = paths;
      if (area_1(external) < 0) {
        external = external.reverse();
      } else {
        internal = internal.reverse();
      }
      // NOTE: creating path2 from the points ensures proper closure
      const externalPath = path2$2.fromPoints({ closed: true }, external);
      const internalPath = path2$2.fromPoints({ closed: true }, internal);
      const externalSides = geom2$2.toSides(geom2$2.fromPoints(path2$2.toPoints(externalPath)));
      const internalSides = geom2$2.toSides(geom2$2.fromPoints(path2$2.toPoints(internalPath)));
      externalSides.push(...internalSides);
      return geom2$2.create(externalSides)
    };

    const createGeometryFromExpandedOpenPath = (paths, segments, corners, delta) => {
      const { points, external, internal } = paths;
      const capSegments = Math.floor(segments / 2); // rotation is 180 degrees
      const e2iCap = [];
      const i2eCap = [];
      if (corners === 'round' && capSegments > 0) {
        // added round caps to the geometry
        const step = Math.PI / capSegments;
        const eCorner = points[points.length - 1];
        const e2iStart = vec2.angle(vec2.subtract(vec2.create(), external[external.length - 1], eCorner));
        const iCorner = points[0];
        const i2eStart = vec2.angle(vec2.subtract(vec2.create(), internal[0], iCorner));
        for (let i = 1; i < capSegments; i++) {
          let radians = e2iStart + (step * i);
          let point = vec2.fromAngleRadians(vec2.create(), radians);
          vec2.scale(point, point, delta);
          vec2.add(point, point, eCorner);
          e2iCap.push(point);

          radians = i2eStart + (step * i);
          point = vec2.fromAngleRadians(vec2.create(), radians);
          vec2.scale(point, point, delta);
          vec2.add(point, point, iCorner);
          i2eCap.push(point);
        }
      }
      const allPoints = [];
      allPoints.push(...external, ...e2iCap, ...internal.reverse(), ...i2eCap);
      return geom2$2.fromPoints(allPoints)
    };

    /*
     * Expand the given geometry (path2) using the given options (if any).
     * @param {Object} options - options for expand
     * @param {Number} [options.delta=1] - delta (+) of expansion
     * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round
     * @param {Integer} [options.segments=16] - number of segments when creating round corners
     * @param {path2} geometry - the geometry to expand
     * @returns {geom2} expanded geometry
     */
    const expandPath2 = (options, geometry) => {
      const defaults = {
        delta: 1,
        corners: 'edge',
        segments: 16
      };

      options = Object.assign({ }, defaults, options);
      const { delta, corners, segments } = options;

      if (delta <= 0) throw new Error('the given delta must be positive for paths')

      if (!(corners === 'edge' || corners === 'chamfer' || corners === 'round')) {
        throw new Error('corners must be "edge", "chamfer", or "round"')
      }

      const closed = geometry.isClosed;
      const points = path2$2.toPoints(geometry);
      if (points.length === 0) throw new Error('the given geometry cannot be empty')

      const paths = {
        points: points,
        external: offsetFromPoints_1({ delta, corners, segments, closed }, points),
        internal: offsetFromPoints_1({ delta: -delta, corners, segments, closed }, points)
      };

      if (geometry.isClosed) {
        return createGeometryFromClosedOffsets(paths)
      } else {
        return createGeometryFromExpandedOpenPath(paths, segments, corners, delta)
      }
    };

    var expandPath2_1 = expandPath2;

    /**
     * Expand the given geometry using the given options.
     * Both internal and external space is expanded for 2D and 3D shapes.
     *
     * Note: Contract is expand using a negative delta.
     * @param {Object} options - options for expand
     * @param {Number} [options.delta=1] - delta (+/-) of expansion
     * @param {String} [options.corners='edge'] - type of corner to create after expanding; edge, chamfer, round
     * @param {Integer} [options.segments=16] - number of segments when creating round corners
     * @param {...Objects} objects - the geometries to expand
     * @return {Object|Array} new geometry, or list of new geometries
     * @alias module:modeling/expansions.expand
     *
     * @example
     * let newarc = expand({delta: 5, corners: 'edge'}, arc({}))
     * let newsquare = expand({delta: 5, corners: 'chamfer'}, square({size: 30}))
     * let newsphere = expand({delta: 2, corners: 'round'}, cuboid({size: [20, 25, 5]}))
     */
    const expand = (options, ...objects) => {
      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return expandPath2_1(options, object)
        if (geom2$2.isA(object)) return expandGeom2_1(options, object)
        if (geom3$2.isA(object)) return expandGeom3_1(options, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    var expand_1 = expand;

    /*
     * Create a offset geometry from the given geom2 using the given options (if any).
     * @param {Object} options - options for offset
     * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
     * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round
     * @param {Integer} [options.segments=16] - number of segments when creating round corners
     * @param {geom2} geometry - geometry from which to create the offset
     * @returns {geom2} offset geometry, plus rounded corners
     */
    const offsetGeom2 = (options, geometry) => {
      const defaults = {
        delta: 1,
        corners: 'edge',
        segments: 0
      };
      const { delta, corners, segments } = Object.assign({ }, defaults, options);

      if (!(corners === 'edge' || corners === 'chamfer' || corners === 'round')) {
        throw new Error('corners must be "edge", "chamfer", or "round"')
      }

      // convert the geometry to outlines, and generate offsets from each
      const outlines = geom2$2.toOutlines(geometry);
      const newoutlines = outlines.map((outline) => {
        const level = outlines.reduce((acc, polygon) => acc + poly2.arePointsInside(outline, poly2.create(polygon)), 0);
        const outside = (level % 2) === 0;

        options = {
          delta: outside ? delta : -delta,
          corners,
          closed: true,
          segments
        };
        return offsetFromPoints_1(options, outline)
      });

      // create a composite geometry from the new outlines
      const allsides = newoutlines.reduce((sides, newoutline) => sides.concat(geom2$2.toSides(geom2$2.fromPoints(newoutline))), []);
      return geom2$2.create(allsides)
    };

    var offsetGeom2_1 = offsetGeom2;

    /*
     * Create a offset geometry from the given path using the given options (if any).
     * @param {Object} options - options for offset
     * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
     * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round
     * @param {Integer} [options.segments=16] - number of segments when creating round corners
     * @param {path2} geometry - geometry from which to create the offset
     * @returns {path2} offset geometry, plus rounded corners
     */
    const offsetPath2 = (options, geometry) => {
      const defaults = {
        delta: 1,
        corners: 'edge',
        closed: geometry.isClosed,
        segments: 16
      };
      const { delta, corners, closed, segments } = Object.assign({ }, defaults, options);

      if (!(corners === 'edge' || corners === 'chamfer' || corners === 'round')) {
        throw new Error('corners must be "edge", "chamfer", or "round"')
      }

      options = { delta, corners, closed, segments };
      const newpoints = offsetFromPoints_1(options, path2$2.toPoints(geometry));
      return path2$2.fromPoints({ closed: closed }, newpoints)
    };

    var offsetPath2_1 = offsetPath2;

    /**
     * Create offset geometry from the given geometry using the given options.
     * Offsets from internal and external space are created.
     * @param {Object} options - options for offset
     * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
     * @param {String} [options.corners='edge'] - type of corner to create after offseting; edge, chamfer, round
     * @param {Integer} [options.segments=16] - number of segments when creating round corners
     * @param {...Object} objects - the geometries to offset
     * @return {Object|Array} new geometry, or list of new geometries
     * @alias module:modeling/expansions.offset
     *
     * @example
     * let small = offset({ delta: -4, corners: 'chamfer' }, square({size: 40})) // contract
     */
    const offset = (options, ...objects) => {
      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return offsetPath2_1(options, object)
        if (geom2$2.isA(object)) return offsetGeom2_1(options, object)
        // if (geom3.isA(object)) return geom3.transform(matrix, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    var offset_1 = offset;

    /**
     * All shapes (primitives or the results of operations) can be expanded (or contracted.)
     * In all cases, the function returns the results, and never changes the original shapes.
     * @module modeling/expansions
     * @example
     * const { expand, offset } = require('@jscad/modeling').expansions
     */
    var expansions = {
      expand: expand_1,
      offset: offset_1
    };

    /*
     * Extrude the given geometry using the given options.
     *
     * @param {Object} [options] - options for extrude
     * @param {Array} [options.offset] - the direction of the extrusion as a 3D vector
     * @param {Number} [options.twistAngle] - the final rotation (RADIANS) about the origin
     * @param {Integer} [options.twistSteps] - the number of steps created to produce the twist (if any)
     * @param {Boolean} [options.repair] - repair gaps in the geometry
     * @param {geom2} geometry - the geometry to extrude
     * @returns {geom3} the extruded 3D geometry
    */
    const extrudeGeom2 = (options, geometry) => {
      const defaults = {
        offset: [0, 0, 1],
        twistAngle: 0,
        twistSteps: 12,
        repair: true
      };
      let { offset, twistAngle, twistSteps, repair } = Object.assign({ }, defaults, options);

      if (twistSteps < 1) throw new Error('twistSteps must be 1 or more')

      if (twistAngle === 0) {
        twistSteps = 1;
      }

      // convert to vector in order to perform transforms
      const offsetv = vec3$1.clone(offset);

      const baseSides = geom2$2.toSides(geometry);
      if (baseSides.length === 0) throw new Error('the given geometry cannot be empty')

      const baseSlice = slice.fromSides(baseSides);
      if (offsetv[2] < 0) slice.reverse(baseSlice, baseSlice);

      const matrix = mat4.create();
      const createTwist = (progress, index, base) => {
        const Zrotation = index / twistSteps * twistAngle;
        const Zoffset = vec3$1.scale(vec3$1.create(), offsetv, index / twistSteps);
        mat4.multiply(matrix, mat4.fromZRotation(matrix, Zrotation), mat4.fromTranslation(mat4.create(), Zoffset));

        return slice.transform(matrix, base)
      };

      options = {
        numberOfSlices: twistSteps + 1,
        capStart: true,
        capEnd: true,
        repair,
        callback: createTwist
      };
      return extrudeFromSlices_1(options, baseSlice)
    };

    var extrudeLinearGeom2 = extrudeGeom2;

    /*
     * Extrude the given geometry using the given options.
     *
     * @param {Object} [options] - options for extrude
     * @param {Array} [options.offset] - the direction of the extrusion as a 3D vector
     * @param {Number} [options.twistAngle] - the final rotation (RADIANS) about the origin
     * @param {Integer} [options.twistSteps] - the number of steps created to produce the twist (if any)
     * @param {path2} geometry - the geometry to extrude
     * @returns {geom3} the extruded 3D geometry
    */
    const extrudePath2 = (options, geometry) => {
      if (!geometry.isClosed) throw new Error('extruded path must be closed')
      // Convert path2 to geom2
      const points = path2$2.toPoints(geometry);
      const geometry2 = geom2$2.fromPoints(points);
      return extrudeLinearGeom2(options, geometry2)
    };

    var extrudeLinearPath2 = extrudePath2;

    /**
     * Extrude the given geometry in an upward linear direction using the given options.
     * Accepts path2 or geom2 objects as input. Paths must be closed.
     *
     * @param {Object} options - options for extrude
     * @param {Number} [options.height=1] the height of the extrusion
     * @param {Number} [options.twistAngle=0] the final rotation (RADIANS) about the origin of the shape (if any)
     * @param {Integer} [options.twistSteps=1] the resolution of the twist about the axis (if any)
     * @param {...Object} objects - the geometries to extrude
     * @return {Object|Array} the extruded geometry, or a list of extruded geometry
     * @alias module:modeling/extrusions.extrudeLinear
     *
     * @example
     * let myshape = extrudeLinear({height: 10}, rectangle({size: [20, 25]}))
     */
    const extrudeLinear = (options, ...objects) => {
      const defaults = {
        height: 1,
        twistAngle: 0,
        twistSteps: 1,
        repair: true
      };
      const { height, twistAngle, twistSteps, repair } = Object.assign({ }, defaults, options);

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      options = { offset: [0, 0, height], twistAngle, twistSteps, repair };

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return extrudeLinearPath2(options, object)
        if (geom2$2.isA(object)) return extrudeLinearGeom2(options, object)
        // if (geom3.isA(object)) return geom3.extrude(options, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    var extrudeLinear_1 = extrudeLinear;

    /*
     * Expand and extrude the given geometry (path2).
     * @See expand for addition options
     * @param {Object} options - options for extrusion, if any
     * @param {Number} [options.size=1] - size of the rectangle
     * @param {Number} [options.height=1] - height of the extrusion
     * @param {path2} geometry - the geometry to extrude
     * @return {geom3} the extruded geometry
     */
    const extrudeRectangularPath2 = (options, geometry) => {
      const defaults = {
        size: 1,
        height: 1
      };
      const { size, height } = Object.assign({ }, defaults, options);

      options.delta = size;
      options.offset = [0, 0, height];

      const points = path2$2.toPoints(geometry);
      if (points.length === 0) throw new Error('the given geometry cannot be empty')

      const newgeometry = expand_1(options, geometry);
      return extrudeLinearGeom2(options, newgeometry)
    };

    var extrudeRectangularPath2_1 = extrudeRectangularPath2;

    const { area: area$1 } = utils$1;








    /*
     * Expand and extrude the given geometry (geom2).
     * @see expand for additional options
     * @param {Object} options - options for extrusion, if any
     * @param {Number} [options.size=1] - size of the rectangle
     * @param {Number} [options.height=1] - height of the extrusion
     * @param {geom2} geometry - the geometry to extrude
     * @return {geom3} the extruded geometry
     */
    const extrudeRectangularGeom2 = (options, geometry) => {
      const defaults = {
        size: 1,
        height: 1
      };
      const { size, height } = Object.assign({ }, defaults, options);

      options.delta = size;
      options.offset = [0, 0, height];

      // convert the geometry to outlines
      const outlines = geom2$2.toOutlines(geometry);
      if (outlines.length === 0) throw new Error('the given geometry cannot be empty')

      // expand the outlines
      const newparts = outlines.map((outline) => {
        if (area$1(outline) < 0) outline.reverse(); // all outlines must wind counter clockwise
        return expand_1(options, path2$2.fromPoints({ closed: true }, outline))
      });

      // create a composite geometry
      const allsides = newparts.reduce((sides, part) => sides.concat(geom2$2.toSides(part)), []);
      const newgeometry = geom2$2.create(allsides);

      return extrudeLinearGeom2(options, newgeometry)
    };

    var extrudeRectangularGeom2_1 = extrudeRectangularGeom2;

    /**
     * Extrude the given geometry by following the outline(s) with a rectangle.
     * @See expand for addition options
     * @param {Object} options - options for extrusion, if any
     * @param {Number} [options.size=1] - size of the rectangle
     * @param {Number} [options.height=1] - height of the extrusion
     * @param {...Object} objects - the geometries to extrude
     * @return {Object|Array} the extruded object, or a list of extruded objects
     * @alias module:modeling/extrusions.extrudeRectangular
     *
     * @example
     * let mywalls = extrudeRectangular({size: 1, height: 3}, square({size: 20}))
     * let mywalls = extrudeRectangular({size: 1, height: 300, twistAngle: Math.PI}, square({size: 20}))
     */
    const extrudeRectangular = (options, ...objects) => {
      const defaults = {
        size: 1,
        height: 1
      };
      const { size, height } = Object.assign({}, defaults, options);

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      if (size <= 0) throw new Error('size must be positive')
      if (height <= 0) throw new Error('height must be positive')

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return extrudeRectangularPath2_1(options, object)
        if (geom2$2.isA(object)) return extrudeRectangularGeom2_1(options, object)
        // if (geom3.isA(object)) return geom3.transform(matrix, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    var extrudeRectangular_1 = extrudeRectangular;

    const projectGeom3 = (options, geometry) => {
      // create a plane from the options, and verify
      const projplane = plane$1.fromNormalAndPoint(plane$1.create(), options.axis, options.origin);
      if (Number.isNaN(projplane[0]) || Number.isNaN(projplane[1]) || Number.isNaN(projplane[2]) || Number.isNaN(projplane[3])) {
        throw new Error('project: invalid axis or origin')
      }

      const epsilon = measureEpsilon_1(geometry);
      const epsilonArea = (epsilon * epsilon * Math.sqrt(3) / 4);

      if (epsilon === 0) return geom2$2.create()

      // project the polygons to the plane
      const polygons = geom3$2.toPolygons(geometry);
      const projpolys = [];
      for (let i = 0; i < polygons.length; i++) {
        const newpoints = polygons[i].vertices.map((v) => plane$1.projectionOfPoint(projplane, v));
        const newpoly = poly3.create(newpoints);
        // only keep projections that have a measurable area
        if (poly3.measureArea(newpoly) < epsilonArea) continue
        // only keep projections that face the same direction as the plane
        const newplane = poly3.plane(newpoly);
        if (!aboutEqualNormals_1(projplane, newplane)) continue
        projpolys.push(newpoly);
      }
      // union the projected polygons to eliminate overlaying polygons
      let projection = geom3$2.create(projpolys);
      projection = unionGeom3(projection, projection);
      // rotate the projection to lay on X/Y axes if necessary
      if (!aboutEqualNormals_1(projplane, [0, 0, 1])) {
        const rotation = mat4.fromVectorRotation(mat4.create(), projplane, [0, 0, 1]);
        projection = geom3$2.transform(rotation, projection);
      }

      // convert the projection (polygons) into a series of 2D geometry
      const projections2D = geom3$2.toPolygons(projection).map((p) => geom2$2.fromPoints(poly3.toPoints(p)));
      // union the 2D geometries to obtain the outline of the projection
      projection = unionGeom2(projections2D);

      return projection
    };

    /**
     * Project the given 3D geometry on to the given plane.
     * @param {Object} options - options for project
     * @param {Array} [options.axis=[0,0,1]] the axis of the plane (default is Z axis)
     * @param {Array} [options.origin=[0,0,0]] the origin of the plane
     * @param {...Object} objects - the list of 3D geometry to project
     * @return {geom2|Array} the projected 2D geometry, or a list of 2D projected geometry
     * @alias module:modeling/extrusions.project
     *
     * @example
     * let myshape = project({}, sphere({radius: 20, segments: 5}))
     */
    const project = (options, ...objects) => {
      const defaults = {
        axis: [0, 0, 1], // Z axis
        origin: [0, 0, 0]
      };
      const { axis, origin } = Object.assign({ }, defaults, options);

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      options = { axis, origin };

      const results = objects.map((object) => {
        // if (path.isA(object)) return project(options, object)
        // if (geom2.isA(object)) return project(options, object)
        if (geom3$2.isA(object)) return projectGeom3(options, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    var project_1 = project;

    /**
     * All 2D shapes (primitives or the results of operations) can be extruded in various ways.
     * In all cases, the function returns the results, and never changes the original shapes.
     * @module modeling/extrusions
     * @example
     * const { extrudeLinear, extrudeRectangular, extrudeRotate } = require('@jscad/modeling').extrusions
     */
    var extrusions = {
      extrudeFromSlices: extrudeFromSlices_1,
      extrudeLinear: extrudeLinear_1,
      extrudeRectangular: extrudeRectangular_1,
      extrudeRotate: extrudeRotate_1,
      project: project_1,
      slice: slice
    };
    var extrusions_2 = extrusions.extrudeLinear;

    const angleBetweenPoints = (p0, p1) => Math.atan2((p1[1] - p0[1]), (p1[0] - p0[0]));

    const compareIndex = (index1, index2) => {
      if (index1.angle < index2.angle) {
        return -1
      } else if (index1.angle > index2.angle) {
        return 1
      } else {
        if (index1.distance < index2.distance) {
          return -1
        } else if (index1.distance > index2.distance) {
          return 1
        }
      }
      return 0
    };

    // Ported from https://github.com/bkiers/GrahamScan
    const compute = (points) => {
      if (points.length < 3) {
        return points
      }

      // Find the lowest point
      let min = 0;
      points.forEach((point, i) => {
        const minpoint = points[min];
        if (point[1] === minpoint[1]) {
          if (point[0] < minpoint[0]) {
            min = i;
          }
        } else if (point[1] < minpoint[1]) {
          min = i;
        }
      });

      // Calculate angles and distances from the lowest point
      const al = [];
      let angle = 0.0;
      let dist = 0.0;
      for (let i = 0; i < points.length; i++) {
        if (i === min) {
          continue
        }
        angle = angleBetweenPoints(points[min], points[i]);
        if (angle < 0) {
          angle += Math.PI;
        }
        dist = vec2.squaredDistance(points[min], points[i]);
        al.push({ index: i, angle: angle, distance: dist });
      }

      al.sort((a, b) => compareIndex(a, b));

      // Wind around the points CCW, removing interior points
      const stack = new Array(points.length + 1);
      let j = 2;
      for (let i = 0; i < points.length; i++) {
        if (i === min) {
          continue
        }
        stack[j] = al[j - 2].index;
        j++;
      }
      stack[0] = stack[points.length];
      stack[1] = min;

      // clockwise < 0, colinear = 0, counter clockwise > 0
      const ccw = (i1, i2, i3) => (points[i2][0] - points[i1][0]) * (points[i3][1] - points[i1][1]) - (points[i2][1] - points[i1][1]) * (points[i3][0] - points[i1][0]);

      let tmp;
      let M = 2;
      for (let i = 3; i <= points.length; i++) {
        while (ccw(stack[M - 1], stack[M], stack[i]) < Number.EPSILON) {
          M--;
        }
        M++;
        tmp = stack[i];
        stack[i] = stack[M];
        stack[M] = tmp;
      }

      // Return the indices to the points
      const indices = new Array(M);
      for (let i = 0; i < M; i++) {
        indices[i] = stack[i + 1];
      }
      return indices
    };

    /*
     * Create a convex hull of the given set of points,  where each point is an array of [x,y].
     * @param {Array} uniquepoints - list of UNIQUE points from which to create a hull
     * @returns {Array} a list of points that form the hull
     */
    const hullPoints2 = (uniquepoints) => {
      const indices = compute(uniquepoints);

      let hullpoints = [];
      if (Array.isArray(indices)) {
        hullpoints = indices.map((index) => uniquepoints[index]);
      }
      return hullpoints
    };

    var hullPoints2_1 = hullPoints2;

    /*
     * Create a convex hull of the given geometries (path2).
     * @param {...geometries} geometries - list of path2 geometries
     * @returns {path2} new geometry
     */
    const hullPath2 = (...geometries) => {
      geometries = flatten_1(geometries);

      // extract the unique points from the geometries
      const uniquepoints = [];
      const found = new Set();
      geometries.forEach((geometry) => {
        const points = path2$2.toPoints(geometry);
        points.forEach((point) => {
          const key = point.toString();
          if (!found.has(key)) {
            uniquepoints.push(point);
            found.add(key);
          }
        });
      });

      const hullpoints = hullPoints2_1(uniquepoints);

      // assemble a new geometry from the list of points
      return path2$2.fromPoints({ closed: true }, hullpoints)
    };

    var hullPath2_1 = hullPath2;

    /*
     * Create a convex hull of the given geom2 geometries.
     * @param {...geometries} geometries - list of geom2 geometries
     * @returns {geom2} new geometry
     */
    const hullGeom2 = (...geometries) => {
      geometries = flatten_1(geometries);

      // extract the unique points from the geometries
      const uniquepoints = [];
      const found = new Map();
      for (let g = 0; g < geometries.length; g++) {
        const sides = geom2$2.toSides(geometries[g]);
        for (let s = 0; s < sides.length; s++) {
          const side = sides[s];
          const point = side[0];
          const id = `${point[0]},${point[1]}`;
          if (found.has(id)) continue
          uniquepoints.push(point);
          found.set(id, true);
        }
      }
      found.clear();

      const hullpoints = hullPoints2_1(uniquepoints);

      // NOTE: more than three points are required to create a new geometry
      if (hullpoints.length < 3) return geom2$2.create()

      // assemble a new geometry from the list of points
      return geom2$2.fromPoints(hullpoints)
    };

    var hullGeom2_1 = hullGeom2;

    /*
     * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)
     * Copyright (c) 2015 Mauricio Poppe
     *
     * Adapted to JSCAD by Jeff Gay
     */

    const distanceSquared = (p, a, b) => {
      // == parallelogram solution
      //
      //            s
      //      __a________b__
      //       /   |    /
      //      /   h|   /
      //     /_____|__/
      //    p
      //
      //  s = b - a
      //  area = s * h
      //  |ap x s| = s * h
      //  h = |ap x s| / s
      //
      const ab = [];
      const ap = [];
      const cr = [];
      subtract_1$3(ab, b, a);
      subtract_1$3(ap, p, a);
      const area = squaredLength_1$1(cross_1$1(cr, ap, ab));
      const s = squaredLength_1$1(ab);
      if (s === 0) {
        throw Error('a and b are the same point')
      }
      return area / s
    };

    const pointLineDistance = (point, a, b) => Math.sqrt(distanceSquared(point, a, b));

    var pointLineDistance_1 = pointLineDistance;

    /*
     * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)
     * Copyright (c) 2015 Mauricio Poppe
     *
     * Adapted to JSCAD by Jeff Gay
     */

    const planeNormal = (out, point1, point2, point3) => {
      const tmp = [0, 0, 0];
      subtract_1$3(out, point1, point2);
      subtract_1$3(tmp, point2, point3);
      cross_1$1(out, out, tmp);
      return normalize_1$1(out, out)
    };

    var getPlaneNormal = planeNormal;

    /*
     * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)
     * Copyright (c) 2015 Mauricio Poppe
     *
     * Adapted to JSCAD by Jeff Gay
     */

    class VertexList {
      constructor () {
        this.head = null;
        this.tail = null;
      }

      clear () {
        this.head = this.tail = null;
      }

      /**
       * Inserts a `node` before `target`, it's assumed that
       * `target` belongs to this doubly linked list
       *
       * @param {*} target
       * @param {*} node
       */
      insertBefore (target, node) {
        node.prev = target.prev;
        node.next = target;
        if (!node.prev) {
          this.head = node;
        } else {
          node.prev.next = node;
        }
        target.prev = node;
      }

      /**
       * Inserts a `node` after `target`, it's assumed that
       * `target` belongs to this doubly linked list
       *
       * @param {Vertex} target
       * @param {Vertex} node
       */
      insertAfter (target, node) {
        node.prev = target;
        node.next = target.next;
        if (!node.next) {
          this.tail = node;
        } else {
          node.next.prev = node;
        }
        target.next = node;
      }

      /**
       * Appends a `node` to the end of this doubly linked list
       * Note: `node.next` will be unlinked from `node`
       * Note: if `node` is part of another linked list call `addAll` instead
       *
       * @param {*} node
       */
      add (node) {
        if (!this.head) {
          this.head = node;
        } else {
          this.tail.next = node;
        }
        node.prev = this.tail;
        // since node is the new end it doesn't have a next node
        node.next = null;
        this.tail = node;
      }

      /**
       * Appends a chain of nodes where `node` is the head,
       * the difference with `add` is that it correctly sets the position
       * of the node list `tail` property
       *
       * @param {*} node
       */
      addAll (node) {
        if (!this.head) {
          this.head = node;
        } else {
          this.tail.next = node;
        }
        node.prev = this.tail;

        // find the end of the list
        while (node.next) {
          node = node.next;
        }
        this.tail = node;
      }

      /**
       * Deletes a `node` from this linked list, it's assumed that `node` is a
       * member of this linked list
       *
       * @param {*} node
       */
      remove (node) {
        if (!node.prev) {
          this.head = node.next;
        } else {
          node.prev.next = node.next;
        }

        if (!node.next) {
          this.tail = node.prev;
        } else {
          node.next.prev = node.prev;
        }
      }

      /**
       * Removes a chain of nodes whose head is `a` and whose tail is `b`,
       * it's assumed that `a` and `b` belong to this list and also that `a`
       * comes before `b` in the linked list
       *
       * @param {*} a
       * @param {*} b
       */
      removeChain (a, b) {
        if (!a.prev) {
          this.head = b.next;
        } else {
          a.prev.next = b.next;
        }

        if (!b.next) {
          this.tail = a.prev;
        } else {
          b.next.prev = a.prev;
        }
      }

      first () {
        return this.head
      }

      isEmpty () {
        return !this.head
      }
    }

    var VertexList_1 = VertexList;

    /*
     * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)
     * Copyright (c) 2015 Mauricio Poppe
     *
     * Adapted to JSCAD by Jeff Gay
     */

    class Vertex {
      constructor (point, index) {
        this.point = point;
        // index in the input array
        this.index = index;
        // vertex is a double linked list node
        this.next = null;
        this.prev = null;
        // the face that is able to see this point
        this.face = null;
      }
    }

    var Vertex_1 = Vertex;

    /*
     * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)
     * Copyright (c) 2015 Mauricio Poppe
     *
     * Adapted to JSCAD by Jeff Gay
     */

    class HalfEdge {
      constructor (vertex, face) {
        this.vertex = vertex;
        this.face = face;
        this.next = null;
        this.prev = null;
        this.opposite = null;
      }

      head () {
        return this.vertex
      }

      tail () {
        return this.prev
          ? this.prev.vertex
          : null
      }

      length () {
        if (this.tail()) {
          return distance_1$1(
            this.tail().point,
            this.head().point
          )
        }
        return -1
      }

      lengthSquared () {
        if (this.tail()) {
          return squaredDistance_1$1(
            this.tail().point,
            this.head().point
          )
        }
        return -1
      }

      setOpposite (edge) {
        this.opposite = edge;
        edge.opposite = this;
      }
    }

    var HalfEdge_1 = HalfEdge;

    /*
     * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)
     * Copyright (c) 2015 Mauricio Poppe
     *
     * Adapted to JSCAD by Jeff Gay
     */



    const VISIBLE$1 = 0;
    const NON_CONVEX$1 = 1;
    const DELETED$1 = 2;

    class Face$1 {
      constructor () {
        this.normal = [];
        this.centroid = [];
        // signed distance from face to the origin
        this.offset = 0;
        // pointer to the a vertex in a double linked list this face can see
        this.outside = null;
        this.mark = VISIBLE$1;
        this.edge = null;
        this.nVertices = 0;
      }

      getEdge (i) {
        if (typeof i !== 'number') {
          throw Error('requires a number')
        }
        let it = this.edge;
        while (i > 0) {
          it = it.next;
          i -= 1;
        }
        while (i < 0) {
          it = it.prev;
          i += 1;
        }
        return it
      }

      computeNormal () {
        const e0 = this.edge;
        const e1 = e0.next;
        let e2 = e1.next;
        const v2 = subtract_1$3([], e1.head().point, e0.head().point);
        const t = [];
        const v1 = [];

        this.nVertices = 2;
        this.normal = [0, 0, 0];
        while (e2 !== e0) {
          copy_1$5(v1, v2);
          subtract_1$3(v2, e2.head().point, e0.head().point);
          add_1$1(this.normal, this.normal, cross_1$1(t, v1, v2));
          e2 = e2.next;
          this.nVertices += 1;
        }
        this.area = length_1$1(this.normal);
        // normalize the vector, since we've already calculated the area
        // it's cheaper to scale the vector using this quantity instead of
        // doing the same operation again
        this.normal = scale_1$4(this.normal, this.normal, 1 / this.area);
      }

      computeNormalMinArea (minArea) {
        this.computeNormal();
        if (this.area < minArea) {
          // compute the normal without the longest edge
          let maxEdge;
          let maxSquaredLength = 0;
          let edge = this.edge;

          // find the longest edge (in length) in the chain of edges
          do {
            const lengthSquared = edge.lengthSquared();
            if (lengthSquared > maxSquaredLength) {
              maxEdge = edge;
              maxSquaredLength = lengthSquared;
            }
            edge = edge.next;
          } while (edge !== this.edge)

          const p1 = maxEdge.tail().point;
          const p2 = maxEdge.head().point;
          const maxVector = subtract_1$3([], p2, p1);
          const maxLength = Math.sqrt(maxSquaredLength);
          // maxVector is normalized after this operation
          scale_1$4(maxVector, maxVector, 1 / maxLength);
          // compute the projection of maxVector over this face normal
          const maxProjection = dot_1$2(this.normal, maxVector);
          // subtract the quantity maxEdge adds on the normal
          scale_1$4(maxVector, maxVector, -maxProjection);
          add_1$1(this.normal, this.normal, maxVector);
          // renormalize `this.normal`
          normalize_1$1(this.normal, this.normal);
        }
      }

      computeCentroid () {
        this.centroid = [0, 0, 0];
        let edge = this.edge;
        do {
          add_1$1(this.centroid, this.centroid, edge.head().point);
          edge = edge.next;
        } while (edge !== this.edge)
        scale_1$4(this.centroid, this.centroid, 1 / this.nVertices);
      }

      computeNormalAndCentroid (minArea) {
        if (typeof minArea !== 'undefined') {
          this.computeNormalMinArea(minArea);
        } else {
          this.computeNormal();
        }
        this.computeCentroid();
        this.offset = dot_1$2(this.normal, this.centroid);
      }

      distanceToPlane (point) {
        return dot_1$2(this.normal, point) - this.offset
      }

      /**
       * @private
       *
       * Connects two edges assuming that prev.head().point === next.tail().point
       *
       * @param {HalfEdge} prev
       * @param {HalfEdge} next
       */
      connectHalfEdges (prev, next) {
        let discardedFace;
        if (prev.opposite.face === next.opposite.face) {
          // `prev` is remove a redundant edge
          const oppositeFace = next.opposite.face;
          let oppositeEdge;
          if (prev === this.edge) {
            this.edge = next;
          }
          if (oppositeFace.nVertices === 3) {
            // case:
            // remove the face on the right
            //
            //       /|\
            //      / | \ the face on the right
            //     /  |  \ --> opposite edge
            //    / a |   \
            //   *----*----*
            //  /     b  |  \
            //           ▾
            //      redundant edge
            //
            // Note: the opposite edge is actually in the face to the right
            // of the face to be destroyed
            oppositeEdge = next.opposite.prev.opposite;
            oppositeFace.mark = DELETED$1;
            discardedFace = oppositeFace;
          } else {
            // case:
            //          t
            //        *----
            //       /| <- right face's redundant edge
            //      / | opposite edge
            //     /  |  ▴   /
            //    / a |  |  /
            //   *----*----*
            //  /     b  |  \
            //           ▾
            //      redundant edge
            oppositeEdge = next.opposite.next;
            // make sure that the link `oppositeFace.edge` points correctly even
            // after the right face redundant edge is removed
            if (oppositeFace.edge === oppositeEdge.prev) {
              oppositeFace.edge = oppositeEdge;
            }

            //       /|   /
            //      / | t/opposite edge
            //     /  | / ▴  /
            //    / a |/  | /
            //   *----*----*
            //  /     b     \
            oppositeEdge.prev = oppositeEdge.prev.prev;
            oppositeEdge.prev.next = oppositeEdge;
          }
          //       /|
          //      / |
          //     /  |
          //    / a |
          //   *----*----*
          //  /     b  ▴  \
          //           |
          //     redundant edge
          next.prev = prev.prev;
          next.prev.next = next;

          //       / \  \
          //      /   \->\
          //     /     \<-\ opposite edge
          //    / a     \  \
          //   *----*----*
          //  /     b  ^  \
          next.setOpposite(oppositeEdge);

          oppositeFace.computeNormalAndCentroid();
        } else {
          // trivial case
          //        *
          //       /|\
          //      / | \
          //     /  |--> next
          //    / a |   \
          //   *----*----*
          //    \ b |   /
          //     \  |--> prev
          //      \ | /
          //       \|/
          //        *
          prev.next = next;
          next.prev = prev;
        }
        return discardedFace
      }

      mergeAdjacentFaces (adjacentEdge, discardedFaces) {
        const oppositeEdge = adjacentEdge.opposite;
        const oppositeFace = oppositeEdge.face;

        discardedFaces.push(oppositeFace);
        oppositeFace.mark = DELETED$1;

        // find the chain of edges whose opposite face is `oppositeFace`
        //
        //                ===>
        //      \         face         /
        //       * ---- * ---- * ---- *
        //      /     opposite face    \
        //                <===
        //
        let adjacentEdgePrev = adjacentEdge.prev;
        let adjacentEdgeNext = adjacentEdge.next;
        let oppositeEdgePrev = oppositeEdge.prev;
        let oppositeEdgeNext = oppositeEdge.next;

        // left edge
        while (adjacentEdgePrev.opposite.face === oppositeFace) {
          adjacentEdgePrev = adjacentEdgePrev.prev;
          oppositeEdgeNext = oppositeEdgeNext.next;
        }
        // right edge
        while (adjacentEdgeNext.opposite.face === oppositeFace) {
          adjacentEdgeNext = adjacentEdgeNext.next;
          oppositeEdgePrev = oppositeEdgePrev.prev;
        }
        // adjacentEdgePrev  \         face         / adjacentEdgeNext
        //                    * ---- * ---- * ---- *
        // oppositeEdgeNext  /     opposite face    \ oppositeEdgePrev

        // fix the face reference of all the opposite edges that are not part of
        // the edges whose opposite face is not `face` i.e. all the edges that
        // `face` and `oppositeFace` do not have in common
        let edge;
        for (edge = oppositeEdgeNext; edge !== oppositeEdgePrev.next; edge = edge.next) {
          edge.face = this;
        }

        // make sure that `face.edge` is not one of the edges to be destroyed
        // Note: it's important for it to be a `next` edge since `prev` edges
        // might be destroyed on `connectHalfEdges`
        this.edge = adjacentEdgeNext;

        // connect the extremes
        // Note: it might be possible that after connecting the edges a triangular
        // face might be redundant
        let discardedFace;
        discardedFace = this.connectHalfEdges(oppositeEdgePrev, adjacentEdgeNext);
        if (discardedFace) {
          discardedFaces.push(discardedFace);
        }
        discardedFace = this.connectHalfEdges(adjacentEdgePrev, oppositeEdgeNext);
        if (discardedFace) {
          discardedFaces.push(discardedFace);
        }

        this.computeNormalAndCentroid();
        // TODO: additional consistency checks
        return discardedFaces
      }

      collectIndices () {
        const indices = [];
        let edge = this.edge;
        do {
          indices.push(edge.head().index);
          edge = edge.next;
        } while (edge !== this.edge)
        return indices
      }

      static createTriangle (v0, v1, v2, minArea = 0) {
        const face = new Face$1();
        const e0 = new HalfEdge_1(v0, face);
        const e1 = new HalfEdge_1(v1, face);
        const e2 = new HalfEdge_1(v2, face);

        // join edges
        e0.next = e2.prev = e1;
        e1.next = e0.prev = e2;
        e2.next = e1.prev = e0;

        // main half edge reference
        face.edge = e0;
        face.computeNormalAndCentroid(minArea);
        return face
      }
    }

    var Face_1 = {
      VISIBLE: VISIBLE$1,
      NON_CONVEX: NON_CONVEX$1,
      DELETED: DELETED$1,
      Face: Face$1
    };

    const { Face, VISIBLE, NON_CONVEX, DELETED } = Face_1;

    /*
     * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)
     * Copyright (c) 2015 Mauricio Poppe
     *
     * Adapted to JSCAD by Jeff Gay
     */

    // merge types
    // non convex with respect to the large face
    const MERGE_NON_CONVEX_WRT_LARGER_FACE = 1;
    const MERGE_NON_CONVEX = 2;

    class QuickHull {
      constructor (points) {
        if (!Array.isArray(points)) {
          throw TypeError('input is not a valid array')
        }
        if (points.length < 4) {
          throw Error('cannot build a simplex out of <4 points')
        }

        this.tolerance = -1;

        // buffers
        this.nFaces = 0;
        this.nPoints = points.length;

        this.faces = [];
        this.newFaces = [];
        // helpers
        //
        // let `a`, `b` be `Face` instances
        // let `v` be points wrapped as instance of `Vertex`
        //
        //     [v, v, ..., v, v, v, ...]
        //      ^             ^
        //      |             |
        //  a.outside     b.outside
        //
        this.claimed = new VertexList_1();
        this.unclaimed = new VertexList_1();

        // vertices of the hull(internal representation of points)
        this.vertices = [];
        for (let i = 0; i < points.length; i += 1) {
          this.vertices.push(new Vertex_1(points[i], i));
        }
        this.discardedFaces = [];
        this.vertexPointIndices = [];
      }

      addVertexToFace (vertex, face) {
        vertex.face = face;
        if (!face.outside) {
          this.claimed.add(vertex);
        } else {
          this.claimed.insertBefore(face.outside, vertex);
        }
        face.outside = vertex;
      }

      /**
       * Removes `vertex` for the `claimed` list of vertices, it also makes sure
       * that the link from `face` to the first vertex it sees in `claimed` is
       * linked correctly after the removal
       *
       * @param {Vertex} vertex
       * @param {Face} face
       */
      removeVertexFromFace (vertex, face) {
        if (vertex === face.outside) {
          // fix face.outside link
          if (vertex.next && vertex.next.face === face) {
            // face has at least 2 outside vertices, move the `outside` reference
            face.outside = vertex.next;
          } else {
            // vertex was the only outside vertex that face had
            face.outside = null;
          }
        }
        this.claimed.remove(vertex);
      }

      /**
       * Removes all the visible vertices that `face` is able to see which are
       * stored in the `claimed` vertext list
       *
       * @param {Face} face
       * @return {Vertex|undefined} If face had visible vertices returns
       * `face.outside`, otherwise undefined
       */
      removeAllVerticesFromFace (face) {
        if (face.outside) {
          // pointer to the last vertex of this face
          // [..., outside, ..., end, outside, ...]
          //          |           |      |
          //          a           a      b
          let end = face.outside;
          while (end.next && end.next.face === face) {
            end = end.next;
          }
          this.claimed.removeChain(face.outside, end);
          //                            b
          //                       [ outside, ...]
          //                            |  removes this link
          //     [ outside, ..., end ] -┘
          //          |           |
          //          a           a
          end.next = null;
          return face.outside
        }
      }

      /**
       * Removes all the visible vertices that `face` is able to see, additionally
       * checking the following:
       *
       * If `absorbingFace` doesn't exist then all the removed vertices will be
       * added to the `unclaimed` vertex list
       *
       * If `absorbingFace` exists then this method will assign all the vertices of
       * `face` that can see `absorbingFace`, if a vertex cannot see `absorbingFace`
       * it's added to the `unclaimed` vertex list
       *
       * @param {Face} face
       * @param {Face} [absorbingFace]
       */
      deleteFaceVertices (face, absorbingFace) {
        const faceVertices = this.removeAllVerticesFromFace(face);
        if (faceVertices) {
          if (!absorbingFace) {
            // mark the vertices to be reassigned to some other face
            this.unclaimed.addAll(faceVertices);
          } else {
            // if there's an absorbing face try to assign as many vertices
            // as possible to it

            // the reference `vertex.next` might be destroyed on
            // `this.addVertexToFace` (see VertexList#add), nextVertex is a
            // reference to it
            let nextVertex;
            for (let vertex = faceVertices; vertex; vertex = nextVertex) {
              nextVertex = vertex.next;
              const distance = absorbingFace.distanceToPlane(vertex.point);

              // check if `vertex` is able to see `absorbingFace`
              if (distance > this.tolerance) {
                this.addVertexToFace(vertex, absorbingFace);
              } else {
                this.unclaimed.add(vertex);
              }
            }
          }
        }
      }

      /**
       * Reassigns as many vertices as possible from the unclaimed list to the new
       * faces
       *
       * @param {Faces[]} newFaces
       */
      resolveUnclaimedPoints (newFaces) {
        // cache next vertex so that if `vertex.next` is destroyed it's still
        // recoverable
        let vertexNext = this.unclaimed.first();
        for (let vertex = vertexNext; vertex; vertex = vertexNext) {
          vertexNext = vertex.next;
          let maxDistance = this.tolerance;
          let maxFace;
          for (let i = 0; i < newFaces.length; i += 1) {
            const face = newFaces[i];
            if (face.mark === VISIBLE) {
              const dist = face.distanceToPlane(vertex.point);
              if (dist > maxDistance) {
                maxDistance = dist;
                maxFace = face;
              }
              if (maxDistance > 1000 * this.tolerance) {
                break
              }
            }
          }

          if (maxFace) {
            this.addVertexToFace(vertex, maxFace);
          }
        }
      }

      /**
       * Computes the extremes of a tetrahedron which will be the initial hull
       *
       * @return {number[]} The min/max vertices in the x,y,z directions
       */
      computeExtremes () {
        const min = [];
        const max = [];

        // min vertex on the x,y,z directions
        const minVertices = [];
        // max vertex on the x,y,z directions
        const maxVertices = [];

        let i, j;

        // initially assume that the first vertex is the min/max
        for (i = 0; i < 3; i += 1) {
          minVertices[i] = maxVertices[i] = this.vertices[0];
        }
        // copy the coordinates of the first vertex to min/max
        for (i = 0; i < 3; i += 1) {
          min[i] = max[i] = this.vertices[0].point[i];
        }

        // compute the min/max vertex on all 6 directions
        for (i = 1; i < this.vertices.length; i += 1) {
          const vertex = this.vertices[i];
          const point = vertex.point;
          // update the min coordinates
          for (j = 0; j < 3; j += 1) {
            if (point[j] < min[j]) {
              min[j] = point[j];
              minVertices[j] = vertex;
            }
          }
          // update the max coordinates
          for (j = 0; j < 3; j += 1) {
            if (point[j] > max[j]) {
              max[j] = point[j];
              maxVertices[j] = vertex;
            }
          }
        }

        // compute epsilon
        this.tolerance = 3 * Number.EPSILON * (
          Math.max(Math.abs(min[0]), Math.abs(max[0])) +
          Math.max(Math.abs(min[1]), Math.abs(max[1])) +
          Math.max(Math.abs(min[2]), Math.abs(max[2]))
        );
        return [minVertices, maxVertices]
      }

      /**
       * Compues the initial tetrahedron assigning to its faces all the points that
       * are candidates to form part of the hull
       */
      createInitialSimplex () {
        const vertices = this.vertices;
        const [min, max] = this.computeExtremes();
        let v2, v3;
        let i, j;

        // Find the two vertices with the greatest 1d separation
        // (max.x - min.x)
        // (max.y - min.y)
        // (max.z - min.z)
        let maxDistance = 0;
        let indexMax = 0;
        for (i = 0; i < 3; i += 1) {
          const distance = max[i].point[i] - min[i].point[i];
          if (distance > maxDistance) {
            maxDistance = distance;
            indexMax = i;
          }
        }
        const v0 = min[indexMax];
        const v1 = max[indexMax];

        // the next vertex is the one farthest to the line formed by `v0` and `v1`
        maxDistance = 0;
        for (i = 0; i < this.vertices.length; i += 1) {
          const vertex = this.vertices[i];
          if (vertex !== v0 && vertex !== v1) {
            const distance = pointLineDistance_1(
              vertex.point, v0.point, v1.point
            );
            if (distance > maxDistance) {
              maxDistance = distance;
              v2 = vertex;
            }
          }
        }

        // the next vertes is the one farthest to the plane `v0`, `v1`, `v2`
        // normalize((v2 - v1) x (v0 - v1))
        const normal = getPlaneNormal([], v0.point, v1.point, v2.point);
        // distance from the origin to the plane
        const distPO = dot_1$2(v0.point, normal);
        maxDistance = -1;
        for (i = 0; i < this.vertices.length; i += 1) {
          const vertex = this.vertices[i];
          if (vertex !== v0 && vertex !== v1 && vertex !== v2) {
            const distance = Math.abs(dot_1$2(normal, vertex.point) - distPO);
            if (distance > maxDistance) {
              maxDistance = distance;
              v3 = vertex;
            }
          }
        }

        // initial simplex
        // Taken from http://everything2.com/title/How+to+paint+a+tetrahedron
        //
        //                              v2
        //                             ,|,
        //                           ,7``\'VA,
        //                         ,7`   |, `'VA,
        //                       ,7`     `\    `'VA,
        //                     ,7`        |,      `'VA,
        //                   ,7`          `\         `'VA,
        //                 ,7`             |,           `'VA,
        //               ,7`               `\       ,..ooOOTK` v3
        //             ,7`                  |,.ooOOT''`    AV
        //           ,7`            ,..ooOOT`\`           /7
        //         ,7`      ,..ooOOT''`      |,          AV
        //        ,T,..ooOOT''`              `\         /7
        //     v0 `'TTs.,                     |,       AV
        //            `'TTs.,                 `\      /7
        //                 `'TTs.,             |,    AV
        //                      `'TTs.,        `\   /7
        //                           `'TTs.,    |, AV
        //                                `'TTs.,\/7
        //                                     `'T`
        //                                       v1
        //
        const faces = [];
        if (dot_1$2(v3.point, normal) - distPO < 0) {
          // the face is not able to see the point so `planeNormal`
          // is pointing outside the tetrahedron
          faces.push(
            Face.createTriangle(v0, v1, v2),
            Face.createTriangle(v3, v1, v0),
            Face.createTriangle(v3, v2, v1),
            Face.createTriangle(v3, v0, v2)
          );

          // set the opposite edge
          for (i = 0; i < 3; i += 1) {
            const j = (i + 1) % 3;
            // join face[i] i > 0, with the first face
            faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(j));
            // join face[i] with face[i + 1], 1 <= i <= 3
            faces[i + 1].getEdge(1).setOpposite(faces[j + 1].getEdge(0));
          }
        } else {
          // the face is able to see the point so `planeNormal`
          // is pointing inside the tetrahedron
          faces.push(
            Face.createTriangle(v0, v2, v1),
            Face.createTriangle(v3, v0, v1),
            Face.createTriangle(v3, v1, v2),
            Face.createTriangle(v3, v2, v0)
          );

          // set the opposite edge
          for (i = 0; i < 3; i += 1) {
            const j = (i + 1) % 3;
            // join face[i] i > 0, with the first face
            faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge((3 - i) % 3));
            // join face[i] with face[i + 1]
            faces[i + 1].getEdge(0).setOpposite(faces[j + 1].getEdge(1));
          }
        }

        // the initial hull is the tetrahedron
        for (i = 0; i < 4; i += 1) {
          this.faces.push(faces[i]);
        }

        // initial assignment of vertices to the faces of the tetrahedron
        for (i = 0; i < vertices.length; i += 1) {
          const vertex = vertices[i];
          if (vertex !== v0 && vertex !== v1 && vertex !== v2 && vertex !== v3) {
            maxDistance = this.tolerance;
            let maxFace;
            for (j = 0; j < 4; j += 1) {
              const distance = faces[j].distanceToPlane(vertex.point);
              if (distance > maxDistance) {
                maxDistance = distance;
                maxFace = faces[j];
              }
            }

            if (maxFace) {
              this.addVertexToFace(vertex, maxFace);
            }
          }
        }
      }

      reindexFaceAndVertices () {
        // remove inactive faces
        const activeFaces = [];
        for (let i = 0; i < this.faces.length; i += 1) {
          const face = this.faces[i];
          if (face.mark === VISIBLE) {
            activeFaces.push(face);
          }
        }
        this.faces = activeFaces;
      }

      collectFaces (skipTriangulation) {
        const faceIndices = [];
        for (let i = 0; i < this.faces.length; i += 1) {
          if (this.faces[i].mark !== VISIBLE) {
            throw Error('attempt to include a destroyed face in the hull')
          }
          const indices = this.faces[i].collectIndices();
          if (skipTriangulation) {
            faceIndices.push(indices);
          } else {
            for (let j = 0; j < indices.length - 2; j += 1) {
              faceIndices.push(
                [indices[0], indices[j + 1], indices[j + 2]]
              );
            }
          }
        }
        return faceIndices
      }

      /**
       * Finds the next vertex to make faces with the current hull
       *
       * - let `face` be the first face existing in the `claimed` vertex list
       *  - if `face` doesn't exist then return since there're no vertices left
       *  - otherwise for each `vertex` that face sees find the one furthest away
       *  from `face`
       *
       * @return {Vertex|undefined} Returns undefined when there're no more
       * visible vertices
       */
      nextVertexToAdd () {
        if (!this.claimed.isEmpty()) {
          let eyeVertex, vertex;
          let maxDistance = 0;
          const eyeFace = this.claimed.first().face;
          for (vertex = eyeFace.outside; vertex && vertex.face === eyeFace; vertex = vertex.next) {
            const distance = eyeFace.distanceToPlane(vertex.point);
            if (distance > maxDistance) {
              maxDistance = distance;
              eyeVertex = vertex;
            }
          }
          return eyeVertex
        }
      }

      /**
       * Computes a chain of half edges in ccw order called the `horizon`, for an
       * edge to be part of the horizon it must join a face that can see
       * `eyePoint` and a face that cannot see `eyePoint`
       *
       * @param {number[]} eyePoint - The coordinates of a point
       * @param {HalfEdge} crossEdge - The edge used to jump to the current `face`
       * @param {Face} face - The current face being tested
       * @param {HalfEdge[]} horizon - The edges that form part of the horizon in
       * ccw order
       */
      computeHorizon (eyePoint, crossEdge, face, horizon) {
        // moves face's vertices to the `unclaimed` vertex list
        this.deleteFaceVertices(face);

        face.mark = DELETED;

        let edge;
        if (!crossEdge) {
          edge = crossEdge = face.getEdge(0);
        } else {
          // start from the next edge since `crossEdge` was already analyzed
          // (actually `crossEdge.opposite` was the face who called this method
          // recursively)
          edge = crossEdge.next;
        }

        // All the faces that are able to see `eyeVertex` are defined as follows
        //
        //       v    /
        //           / <== visible face
        //          /
        //         |
        //         | <== not visible face
        //
        //  dot(v, visible face normal) - visible face offset > this.tolerance
        //
        do {
          const oppositeEdge = edge.opposite;
          const oppositeFace = oppositeEdge.face;
          if (oppositeFace.mark === VISIBLE) {
            if (oppositeFace.distanceToPlane(eyePoint) > this.tolerance) {
              this.computeHorizon(eyePoint, oppositeEdge, oppositeFace, horizon);
            } else {
              horizon.push(edge);
            }
          }
          edge = edge.next;
        } while (edge !== crossEdge)
      }

      /**
       * Creates a face with the points `eyeVertex.point`, `horizonEdge.tail` and
       * `horizonEdge.tail` in ccw order
       *
       * @param {Vertex} eyeVertex
       * @param {HalfEdge} horizonEdge
       * @return {HalfEdge} The half edge whose vertex is the eyeVertex
       */
      addAdjoiningFace (eyeVertex, horizonEdge) {
        // all the half edges are created in ccw order thus the face is always
        // pointing outside the hull
        // edges:
        //
        //                  eyeVertex.point
        //                       / \
        //                      /   \
        //                  1  /     \  0
        //                    /       \
        //                   /         \
        //                  /           \
        //          horizon.tail --- horizon.head
        //                        2
        //
        const face = Face.createTriangle(
          eyeVertex,
          horizonEdge.tail(),
          horizonEdge.head()
        );
        this.faces.push(face);
        // join face.getEdge(-1) with the horizon's opposite edge
        // face.getEdge(-1) = face.getEdge(2)
        face.getEdge(-1).setOpposite(horizonEdge.opposite);
        return face.getEdge(0)
      }

      /**
       * Adds horizon.length faces to the hull, each face will be 'linked' with the
       * horizon opposite face and the face on the left/right
       *
       * @param {Vertex} eyeVertex
       * @param {HalfEdge[]} horizon - A chain of half edges in ccw order
       */
      addNewFaces (eyeVertex, horizon) {
        this.newFaces = [];
        let firstSideEdge, previousSideEdge;
        for (let i = 0; i < horizon.length; i += 1) {
          const horizonEdge = horizon[i];
          // returns the right side edge
          const sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);
          if (!firstSideEdge) {
            firstSideEdge = sideEdge;
          } else {
            // joins face.getEdge(1) with previousFace.getEdge(0)
            sideEdge.next.setOpposite(previousSideEdge);
          }
          this.newFaces.push(sideEdge.face);
          previousSideEdge = sideEdge;
        }
        firstSideEdge.next.setOpposite(previousSideEdge);
      }

      /**
       * Computes the distance from `edge` opposite face's centroid to
       * `edge.face`
       *
       * @param {HalfEdge} edge
       * @return {number}
       * - A positive number when the centroid of the opposite face is above the
       *   face i.e. when the faces are concave
       * - A negative number when the centroid of the opposite face is below the
       *   face i.e. when the faces are convex
       */
      oppositeFaceDistance (edge) {
        return edge.face.distanceToPlane(edge.opposite.face.centroid)
      }

      /**
       * Merges a face with none/any/all its neighbors according to the strategy
       * used
       *
       * if `mergeType` is MERGE_NON_CONVEX_WRT_LARGER_FACE then the merge will be
       * decided based on the face with the larger area, the centroid of the face
       * with the smaller area will be checked against the one with the larger area
       * to see if it's in the merge range [tolerance, -tolerance] i.e.
       *
       *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
       *
       * Note that the first check (with +tolerance) was done on `computeHorizon`
       *
       * If the above is not true then the check is done with respect to the smaller
       * face i.e.
       *
       *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
       *
       * If true then it means that two faces are non convex (concave), even if the
       * dot(...) - offset value is > 0 (that's the point of doing the merge in the
       * first place)
       *
       * If two faces are concave then the check must also be done on the other face
       * but this is done in another merge pass, for this to happen the face is
       * marked in a temporal NON_CONVEX state
       *
       * if `mergeType` is MERGE_NON_CONVEX then two faces will be merged only if
       * they pass the following conditions
       *
       *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
       *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
       *
       * @param {Face} face
       * @param {number} mergeType - Either MERGE_NON_CONVEX_WRT_LARGER_FACE or
       * MERGE_NON_CONVEX
       */
      doAdjacentMerge (face, mergeType) {
        let edge = face.edge;
        let convex = true;
        let it = 0;
        do {
          if (it >= face.nVertices) {
            throw Error('merge recursion limit exceeded')
          }
          const oppositeFace = edge.opposite.face;
          let merge = false;

          // Important notes about the algorithm to merge faces
          //
          // - Given a vertex `eyeVertex` that will be added to the hull
          //   all the faces that cannot see `eyeVertex` are defined as follows
          //
          //      dot(v, not visible face normal) - not visible offset < tolerance
          //
          // - Two faces can be merged when the centroid of one of these faces
          // projected to the normal of the other face minus the other face offset
          // is in the range [tolerance, -tolerance]
          // - Since `face` (given in the input for this method) has passed the
          // check above we only have to check the lower bound e.g.
          //
          //      dot(v, not visible face normal) - not visible offset > -tolerance
          //
          if (mergeType === MERGE_NON_CONVEX) {
            if (this.oppositeFaceDistance(edge) > -this.tolerance ||
                this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
              merge = true;
            }
          } else {
            if (face.area > oppositeFace.area) {
              if (this.oppositeFaceDistance(edge) > -this.tolerance) {
                merge = true;
              } else if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
                convex = false;
              }
            } else {
              if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
                merge = true;
              } else if (this.oppositeFaceDistance(edge) > -this.tolerance) {
                convex = false;
              }
            }
          }

          if (merge) {
            // when two faces are merged it might be possible that redundant faces
            // are destroyed, in that case move all the visible vertices from the
            // destroyed faces to the `unclaimed` vertex list
            const discardedFaces = face.mergeAdjacentFaces(edge, []);
            for (let i = 0; i < discardedFaces.length; i += 1) {
              this.deleteFaceVertices(discardedFaces[i], face);
            }
            return true
          }

          edge = edge.next;
          it += 1;
        } while (edge !== face.edge)
        if (!convex) {
          face.mark = NON_CONVEX;
        }
        return false
      }

      /**
       * Adds a vertex to the hull with the following algorithm
       *
       * - Compute the `horizon` which is a chain of half edges, for an edge to
       *   belong to this group it must be the edge connecting a face that can
       *   see `eyeVertex` and a face which cannot see `eyeVertex`
       * - All the faces that can see `eyeVertex` have its visible vertices removed
       *   from the claimed VertexList
       * - A new set of faces is created with each edge of the `horizon` and
       *   `eyeVertex`, each face is connected with the opposite horizon face and
       *   the face on the left/right
       * - The new faces are merged if possible with the opposite horizon face first
       *   and then the faces on the right/left
       * - The vertices removed from all the visible faces are assigned to the new
       *   faces if possible
       *
       * @param {Vertex} eyeVertex
       */
      addVertexToHull (eyeVertex) {
        const horizon = [];

        this.unclaimed.clear();

        // remove `eyeVertex` from `eyeVertex.face` so that it can't be added to the
        // `unclaimed` vertex list
        this.removeVertexFromFace(eyeVertex, eyeVertex.face);
        this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);
        this.addNewFaces(eyeVertex, horizon);

        // first merge pass
        // Do the merge with respect to the larger face
        for (let i = 0; i < this.newFaces.length; i += 1) {
          const face = this.newFaces[i];
          if (face.mark === VISIBLE) {
            while (this.doAdjacentMerge(face, MERGE_NON_CONVEX_WRT_LARGER_FACE)) {} // eslint-disable-line no-empty
          }
        }

        // second merge pass
        // Do the merge on non convex faces (a face is marked as non convex in the
        // first pass)
        for (let i = 0; i < this.newFaces.length; i += 1) {
          const face = this.newFaces[i];
          if (face.mark === NON_CONVEX) {
            face.mark = VISIBLE;
            while (this.doAdjacentMerge(face, MERGE_NON_CONVEX)) {} // eslint-disable-line no-empty
          }
        }

        // reassign `unclaimed` vertices to the new faces
        this.resolveUnclaimedPoints(this.newFaces);
      }

      build () {
        let eyeVertex;
        this.createInitialSimplex();
        while ((eyeVertex = this.nextVertexToAdd())) {
          this.addVertexToHull(eyeVertex);
        }
        this.reindexFaceAndVertices();
      }
    }

    var QuickHull_1 = QuickHull;

    /*
     * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)
     * Copyright (c) 2015 Mauricio Poppe
     *
     * Adapted to JSCAD by Jeff Gay
     */

    const runner = (points, options = {}) => {
      const instance = new QuickHull_1(points);
      instance.build();
      return instance.collectFaces(options.skipTriangulation)
    };

    var quickhull = runner;

    /*
     * Create a convex hull of the given geometries (geom3).
     * @param {...geometries} geometries - list of geom3 geometries
     * @returns {geom3} new geometry
     */
    const hullGeom3 = (...geometries) => {
      geometries = flatten_1(geometries);

      if (geometries.length === 1) return geometries[0]

      // extract the unique vertices from the geometries
      const uniquevertices = [];
      const found = new Map();
      for (let g = 0; g < geometries.length; ++g) {
        const polygons = geom3$2.toPolygons(geometries[g]);
        for (let p = 0; p < polygons.length; ++p) {
          const vertices = polygons[p].vertices;
          for (let v = 0; v < vertices.length; ++v) {
            const id = `${vertices[v]}`;
            if (found.has(id)) continue
            uniquevertices.push(vertices[v]);
            found.set(id, true);
          }
        }
      }
      found.clear();

      const faces = quickhull(uniquevertices, { skipTriangulation: true });

      const polygons = faces.map((face) => {
        const vertices = face.map((index) => uniquevertices[index]);
        return poly3.create(vertices)
      });

      return geom3$2.create(polygons)
    };

    var hullGeom3_1 = hullGeom3;

    /**
     * Create a convex hull of the given geometries.
     * The given geometries should be of the same type, either geom2 or geom3 or path2.
     * @param {...Objects} geometries - list of geometries from which to create a hull
     * @returns {geom2|geom3} new geometry
     * @alias module:modeling/hulls.hull
     *
     * @example
     * let myshape = hull(rectangle({center: [-5,-5]}), ellipse({center: [5,5]}))
     *
     * @example
     * +-------+           +-------+
     * |       |           |        \
     * |   A   |           |         \
     * |       |           |          \
     * +-------+           +           \
     *                  =   \           \
     *       +-------+       \           +
     *       |       |        \          |
     *       |   B   |         \         |
     *       |       |          \        |
     *       +-------+           +-------+
     */
    const hull = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      if (!areAllShapesTheSameType_1(geometries)) {
        throw new Error('only hulls of the same type are supported')
      }

      const geometry = geometries[0];
      if (path2$2.isA(geometry)) return hullPath2_1(geometries)
      if (geom2$2.isA(geometry)) return hullGeom2_1(geometries)
      if (geom3$2.isA(geometry)) return hullGeom3_1(geometries)

      // FIXME should this throw an error for unknown geometries?
      return geometry
    };

    var hull_1 = hull;

    /**
     * Create a chain of hulled geometries from the given geometries.
     * Essentially hull A+B, B+C, C+D, etc., then union the results.
     * The given geometries should be of the same type, either geom2 or geom3 or path2.
     *
     * @param {...Objects} geometries - list of geometries from which to create a hull
     * @returns {geom2|geom3} new geometry
     * @alias module:modeling/hulls.hullChain
     *
     * @example
     * let newshape = hullChain(rectangle({center: [-5,-5]}), circle({center: [0,0]}), rectangle({center: [5,5]}))
     *
     * @example
     * +-------+   +-------+     +-------+   +------+
     * |       |   |       |     |        \ /       |
     * |   A   |   |   C   |     |         |        |
     * |       |   |       |     |                  |
     * +-------+   +-------+     +                  +
     *                       =   \                 /
     *       +-------+            \               /
     *       |       |             \             /
     *       |   B   |              \           /
     *       |       |               \         /
     *       +-------+                +-------+
     */
    const hullChain = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length < 2) throw new Error('wrong number of arguments')

      const hulls = [];
      for (let i = 1; i < geometries.length; i++) {
        hulls.push(hull_1(geometries[i - 1], geometries[i]));
      }
      return union_1(hulls)
    };

    var hullChain_1 = hullChain;

    /**
     * All shapes (primitives or the results of operations) can be passed to hull functions
     * to determine the convex hull of all points.
     * In all cases, the function returns the results, and never changes the original shapes.
     * @module modeling/hulls
     * @example
     * const { hull, hullChain } = require('@jscad/modeling').hulls
     */
    var hulls = {
      hull: hull_1,
      hullChain: hullChain_1
    };

    const isValidPoly3 = (epsilon, polygon) => {
      const area = Math.abs(poly3.measureArea(polygon));
      return (Number.isFinite(area) && area > epsilon)
    };

    /*
     * Snap the given list of polygons to the epsilon.
     */
    const snapPolygons = (epsilon, polygons) => {
      let newpolygons = polygons.map((polygon) => {
        const snapvertices = polygon.vertices.map((vertice) => vec3$1.snap(vec3$1.create(), vertice, epsilon));
        // only retain unique vertices
        const newvertices = [];
        for (let i = 0; i < snapvertices.length; i++) {
          const j = (i + 1) % snapvertices.length;
          if (!vec3$1.equals(snapvertices[i], snapvertices[j])) newvertices.push(snapvertices[i]);
        }
        const newpolygon = poly3.create(newvertices);
        if (polygon.color) newpolygon.color = polygon.color;
        return newpolygon
      });
      // snap can produce polygons with zero (0) area, remove those
      const epsilonArea = (epsilon * epsilon * Math.sqrt(3) / 4);
      newpolygons = newpolygons.filter((polygon) => isValidPoly3(epsilonArea, polygon));
      return newpolygons
    };

    var snapPolygons_1 = snapPolygons;

    // create a set of edges from the given polygon, and link the edges as well
    const createEdges = (polygon) => {
      const points = poly3.toPoints(polygon);
      const edges = [];
      for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        const edge = {
          v1: points[i],
          v2: points[j]
        };
        edges.push(edge);
      }
      // link the edges together
      for (let i = 0; i < edges.length; i++) {
        const j = (i + 1) % points.length;
        edges[i].next = edges[j];
        edges[j].prev = edges[i];
      }
      return edges
    };

    const insertEdge = (edges, edge) => {
      const key = `${edge.v1}:${edge.v2}`;
      edges.set(key, edge);
    };

    const deleteEdge = (edges, edge) => {
      const key = `${edge.v1}:${edge.v2}`;
      edges.delete(key);
    };

    const findOppositeEdge = (edges, edge) => {
      const key = `${edge.v2}:${edge.v1}`; // NOTE: OPPOSITE OF INSERT KEY
      return edges.get(key)
    };

    // calculate the two adjoining angles between the opposing edges
    const calculateAnglesBetween = (current, opposite, normal) => {
      let v0 = current.prev.v1;
      let v1 = current.prev.v2;
      let v2 = opposite.next.v2;
      const angle1 = calculateAngle(v0, v1, v2, normal);

      v0 = opposite.prev.v1;
      v1 = opposite.prev.v2;
      v2 = current.next.v2;
      const angle2 = calculateAngle(v0, v1, v2, normal);

      return [angle1, angle2]
    };

    const calculateAngle = (prevpoint, point, nextpoint, normal) => {
      const d0 = vec3$1.subtract(vec3$1.create(), point, prevpoint);
      const d1 = vec3$1.subtract(vec3$1.create(), nextpoint, point);
      vec3$1.cross(d0, d0, d1);
      return vec3$1.dot(d0, normal)
    };

    // create a polygon starting from the given edge (if possible)
    const createPolygonAnd = (edge) => {
      let polygon;
      const points = [];
      while (edge.next) {
        const next = edge.next;

        points.push(edge.v1);

        edge.v1 = null;
        edge.v2 = null;
        edge.next = null;
        edge.prev = null;

        edge = next;
      }
      if (points.length > 0) polygon = poly3.fromPoints(points);
      return polygon
    };

    /*
     * Merge COPLANAR polygons that share common edges.
     * @param {poly3[]} sourcepolygons - list of polygons
     * @returns {poly3[]} new set of polygons
     */
    const mergeCoplanarPolygons = (epsilon, sourcepolygons) => {
      if (sourcepolygons.length < 2) return sourcepolygons

      const normal = sourcepolygons[0].plane;
      const polygons = sourcepolygons.slice();
      const edgeList = new Map();

      while (polygons.length > 0) { // NOTE: the length of polygons WILL change
        const polygon = polygons.shift();
        const edges = createEdges(polygon);
        for (let i = 0; i < edges.length; i++) {
          const current = edges[i];
          const opposite = findOppositeEdge(edgeList, current);
          if (opposite) {
            const angles = calculateAnglesBetween(current, opposite, normal);
            if (angles[0] >= 0 && angles[1] >= 0) {
              const edge1 = opposite.next;
              const edge2 = current.next;
              // adjust the edges, linking together opposing polygons
              current.prev.next = opposite.next;
              current.next.prev = opposite.prev;

              opposite.prev.next = current.next;
              opposite.next.prev = current.prev;

              // remove the opposing edges
              current.v1 = null;
              current.v2 = null;
              current.next = null;
              current.prev = null;

              deleteEdge(edgeList, opposite);

              opposite.v1 = null;
              opposite.v2 = null;
              opposite.next = null;
              opposite.prev = null;

              const mergeEdges = (list, e1, e2) => {
                const newedge = {
                  v1: e2.v1,
                  v2: e1.v2,
                  next: e1.next,
                  prev: e2.prev
                };
                // link in newedge
                e2.prev.next = newedge;
                e1.next.prev = newedge;
                // remove old edges
                deleteEdge(list, e1);
                e1.v1 = null;
                e1.v2 = null;
                e1.next = null;
                e1.prev = null;

                deleteEdge(list, e2);
                e2.v1 = null;
                e2.v2 = null;
                e2.next = null;
                e2.prev = null;
              };

              if (angles[0] === 0.0) {
                mergeEdges(edgeList, edge1, edge1.prev);
              }
              if (angles[1] === 0.0) {
                mergeEdges(edgeList, edge2, edge2.prev);
              }
            }
          } else {
            if (current.next) insertEdge(edgeList, current);
          }
        }
      }

      // build a set of polygons from the remaining edges
      const destpolygons = [];
      edgeList.forEach((edge) => {
        const polygon = createPolygonAnd(edge);
        if (polygon) destpolygons.push(polygon);
      });

      return destpolygons
    };

    // Normals are directional vectors with component values from 0 to 1.0, requiring specialized comparision
    // This EPS is derived from a serieas of tests to determine the optimal precision for comparing coplanar polygons,
    // as provided by the sphere primitive at high segmentation
    // This EPS is for 64 bit Number values
    const NEPS = 1e-13;

    // Compare two normals (unit vectors) for equality.
    const aboutEqualNormals = (a, b) => (Math.abs(a[0] - b[0]) <= NEPS && Math.abs(a[1] - b[1]) <= NEPS && Math.abs(a[2] - b[2]) <= NEPS);

    const coplanar = (plane1, plane2) => {
      // expect the same distance from the origin, within tolerance
      if (Math.abs(plane1[3] - plane2[3]) < 0.00000015) {
        return aboutEqualNormals(plane1, plane2)
      }
      return false
    };

    const mergePolygons = (epsilon, polygons) => {
      const polygonsPerPlane = []; // elements: [plane, [poly3...]]
      polygons.forEach((polygon) => {
        const mapping = polygonsPerPlane.find((element) => coplanar(element[0], poly3.plane(polygon)));
        if (mapping) {
          const polygons = mapping[1];
          polygons.push(polygon);
        } else {
          polygonsPerPlane.push([poly3.plane(polygon), [polygon]]);
        }
      });

      let destpolygons = [];
      polygonsPerPlane.forEach((mapping) => {
        const sourcepolygons = mapping[1];
        const retesselayedpolygons = mergeCoplanarPolygons(epsilon, sourcepolygons);
        destpolygons = destpolygons.concat(retesselayedpolygons);
      });
      return destpolygons
    };

    var mergePolygons_1 = mergePolygons;

    const getTag = (vertex) => `${vertex}`;

    const addSide = (sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) => {
      const starttag = getTag(vertex0);
      const endtag = getTag(vertex1);
      const newsidetag = `${starttag}/${endtag}`;
      const reversesidetag = `${endtag}/${starttag}`;
      if (sidemap.has(reversesidetag)) {
        // remove the opposing side from mappings
        deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex1, vertex0, null);
        return null
      }
      // add the side to the mappings
      const newsideobj = {
        vertex0: vertex0,
        vertex1: vertex1,
        polygonindex: polygonindex
      };
      if (!(sidemap.has(newsidetag))) {
        sidemap.set(newsidetag, [newsideobj]);
      } else {
        sidemap.get(newsidetag).push(newsideobj);
      }
      if (starttag in vertextag2sidestart) {
        vertextag2sidestart[starttag].push(newsidetag);
      } else {
        vertextag2sidestart[starttag] = [newsidetag];
      }
      if (endtag in vertextag2sideend) {
        vertextag2sideend[endtag].push(newsidetag);
      } else {
        vertextag2sideend[endtag] = [newsidetag];
      }
      return newsidetag
    };

    const deleteSide = (sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) => {
      const starttag = getTag(vertex0);
      const endtag = getTag(vertex1);
      const sidetag = `${starttag}/${endtag}`;
      let idx = -1;
      const sideobjs = sidemap.get(sidetag);
      for (let i = 0; i < sideobjs.length; i++) {
        const sideobj = sideobjs[i];
        let sidetag = getTag(sideobj.vertex0);
        if (sidetag !== starttag) continue
        sidetag = getTag(sideobj.vertex1);
        if (sidetag !== endtag) continue
        if (polygonindex !== null) {
          if (sideobj.polygonindex !== polygonindex) continue
        }
        idx = i;
        break
      }
      sideobjs.splice(idx, 1);
      if (sideobjs.length === 0) {
        sidemap.delete(sidetag);
      }

      // adjust start and end lists
      idx = vertextag2sidestart[starttag].indexOf(sidetag);
      vertextag2sidestart[starttag].splice(idx, 1);
      if (vertextag2sidestart[starttag].length === 0) {
        delete vertextag2sidestart[starttag];
      }

      idx = vertextag2sideend[endtag].indexOf(sidetag);
      vertextag2sideend[endtag].splice(idx, 1);
      if (vertextag2sideend[endtag].length === 0) {
        delete vertextag2sideend[endtag];
      }
    };

    /*
      Suppose we have two polygons ACDB and EDGF:

       A-----B
       |     |
       |     E--F
       |     |  |
       C-----D--G

      Note that vertex E forms a T-junction on the side BD. In this case some STL slicers will complain
      that the solid is not watertight. This is because the watertightness check is done by checking if
      each side DE is matched by another side ED.

      This function will return a new solid with ACDB replaced by ACDEB

      Note that this can create polygons that are slightly non-convex (due to rounding errors). Therefore the result should
      not be used for further CSG operations!

      Note this function is meant to be used to preprocess geometries when triangulation is required, i.e. AMF, STL, etc.
      Do not use the results in other operations.
    */

    /*
     * Insert missing vertices for T junctions, which creates polygons that can be triangulated.
     * @param {Array} polygons - the original polygons which may or may not have T junctions
     * @return original polygons (if no T junctions found) or new polygons with updated vertices
     */
    const insertTjunctions = (polygons) => {
      // STEP 1 : build a map of 'unmatched' sides from the polygons
      // i.e. side AB in one polygon does not have a matching side BA in another polygon
      const sidemap = new Map();
      for (let polygonindex = 0; polygonindex < polygons.length; polygonindex++) {
        const polygon = polygons[polygonindex];
        const numvertices = polygon.vertices.length;
        if (numvertices >= 3) {
          let vertex = polygon.vertices[0];
          let vertextag = getTag(vertex);
          for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
            let nextvertexindex = vertexindex + 1;
            if (nextvertexindex === numvertices) nextvertexindex = 0;

            const nextvertex = polygon.vertices[nextvertexindex];
            const nextvertextag = getTag(nextvertex);

            const sidetag = `${vertextag}/${nextvertextag}`;
            const reversesidetag = `${nextvertextag}/${vertextag}`;
            if (sidemap.has(reversesidetag)) {
              // this side matches the same side in another polygon. Remove from sidemap
              // FIXME is this check necessary? there should only be ONE(1) opposing side
              // FIXME assert ?
              const ar = sidemap.get(reversesidetag);
              ar.splice(-1, 1);
              if (ar.length === 0) {
                sidemap.delete(reversesidetag);
              }
            } else {
              const sideobj = {
                vertex0: vertex,
                vertex1: nextvertex,
                polygonindex: polygonindex
              };
              if (!(sidemap.has(sidetag))) {
                sidemap.set(sidetag, [sideobj]);
              } else {
                sidemap.get(sidetag).push(sideobj);
              }
            }
            vertex = nextvertex;
            vertextag = nextvertextag;
          }
        } else {
          console.warn('warning: invalid polygon found during insertTjunctions');
        }
      }

      if (sidemap.size > 0) {
        // console.log('insertTjunctions',sidemap.size)
        // STEP 2 : create a list of starting sides and ending sides
        const vertextag2sidestart = {};
        const vertextag2sideend = {};
        const sidestocheck = {};
        for (const [sidetag, sideobjs] of sidemap) {
          sidestocheck[sidetag] = true;
          sideobjs.forEach((sideobj) => {
            const starttag = getTag(sideobj.vertex0);
            const endtag = getTag(sideobj.vertex1);
            if (starttag in vertextag2sidestart) {
              vertextag2sidestart[starttag].push(sidetag);
            } else {
              vertextag2sidestart[starttag] = [sidetag];
            }
            if (endtag in vertextag2sideend) {
              vertextag2sideend[endtag].push(sidetag);
            } else {
              vertextag2sideend[endtag] = [sidetag];
            }
          });
        }

        // STEP 3 : if sidemap is not empty
        const newpolygons = polygons.slice(0); // make a copy in order to replace polygons inline
        while (true) {
          if (sidemap.size === 0) break

          for (const sidetag of sidemap.keys()) {
            sidestocheck[sidetag] = true;
          }

          let donesomething = false;
          while (true) {
            const sidetags = Object.keys(sidestocheck);
            if (sidetags.length === 0) break // sidestocheck is empty, we're done!
            const sidetagtocheck = sidetags[0];
            let donewithside = true;
            if (sidemap.has(sidetagtocheck)) {
              const sideobjs = sidemap.get(sidetagtocheck);
              const sideobj = sideobjs[0];
              for (let directionindex = 0; directionindex < 2; directionindex++) {
                const startvertex = (directionindex === 0) ? sideobj.vertex0 : sideobj.vertex1;
                const endvertex = (directionindex === 0) ? sideobj.vertex1 : sideobj.vertex0;
                const startvertextag = getTag(startvertex);
                const endvertextag = getTag(endvertex);
                let matchingsides = [];
                if (directionindex === 0) {
                  if (startvertextag in vertextag2sideend) {
                    matchingsides = vertextag2sideend[startvertextag];
                  }
                } else {
                  if (startvertextag in vertextag2sidestart) {
                    matchingsides = vertextag2sidestart[startvertextag];
                  }
                }
                for (let matchingsideindex = 0; matchingsideindex < matchingsides.length; matchingsideindex++) {
                  const matchingsidetag = matchingsides[matchingsideindex];
                  const matchingside = sidemap.get(matchingsidetag)[0];
                  const matchingsidestartvertex = (directionindex === 0) ? matchingside.vertex0 : matchingside.vertex1;
                  (directionindex === 0) ? matchingside.vertex1 : matchingside.vertex0;
                  const matchingsidestartvertextag = getTag(matchingsidestartvertex);
                  if (matchingsidestartvertextag === endvertextag) {
                    // matchingside cancels sidetagtocheck
                    deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, startvertex, endvertex, null);
                    deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, startvertex, null);
                    donewithside = false;
                    directionindex = 2; // skip reverse direction check
                    donesomething = true;
                    break
                  } else {
                    const startpos = startvertex;
                    const endpos = endvertex;
                    const checkpos = matchingsidestartvertex;
                    const direction = vec3$1.subtract(vec3$1.create(), checkpos, startpos);
                    // Now we need to check if endpos is on the line startpos-checkpos:
                    const t = vec3$1.dot(vec3$1.subtract(vec3$1.create(), endpos, startpos), direction) / vec3$1.dot(direction, direction);
                    if ((t > 0) && (t < 1)) {
                      const closestpoint = vec3$1.scale(vec3$1.create(), direction, t);
                      vec3$1.add(closestpoint, closestpoint, startpos);
                      const distancesquared = vec3$1.squaredDistance(closestpoint, endpos);
                      if (distancesquared < (constants.EPS * constants.EPS)) {
                        // Yes it's a t-junction! We need to split matchingside in two:
                        const polygonindex = matchingside.polygonindex;
                        const polygon = newpolygons[polygonindex];
                        // find the index of startvertextag in polygon:
                        const insertionvertextag = getTag(matchingside.vertex1);
                        let insertionvertextagindex = -1;
                        for (let i = 0; i < polygon.vertices.length; i++) {
                          if (getTag(polygon.vertices[i]) === insertionvertextag) {
                            insertionvertextagindex = i;
                            break
                          }
                        }
                        // split the side by inserting the vertex:
                        const newvertices = polygon.vertices.slice(0);
                        newvertices.splice(insertionvertextagindex, 0, endvertex);
                        const newpolygon = poly3.fromPoints(newvertices);

                        newpolygons[polygonindex] = newpolygon;

                        // remove the original sides from our maps
                        deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, matchingside.vertex1, polygonindex);
                        const newsidetag1 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, endvertex, polygonindex);
                        const newsidetag2 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, matchingside.vertex1, polygonindex);
                        if (newsidetag1 !== null) sidestocheck[newsidetag1] = true;
                        if (newsidetag2 !== null) sidestocheck[newsidetag2] = true;
                        donewithside = false;
                        directionindex = 2; // skip reverse direction check
                        donesomething = true;
                        break
                      } // if(distancesquared < 1e-10)
                    } // if( (t > 0) && (t < 1) )
                  } // if(endingstidestartvertextag === endvertextag)
                } // for matchingsideindex
              } // for directionindex
            } // if(sidetagtocheck in sidemap)
            if (donewithside) {
              delete sidestocheck[sidetagtocheck];
            }
          }
          if (!donesomething) break
        }
        polygons = newpolygons;
      }
      sidemap.clear();

      return polygons
    };

    var insertTjunctions_1 = insertTjunctions;

    const triangulatePolygon = (epsilon, polygon, triangles) => {
      const nv = polygon.vertices.length;
      if (nv > 3) {
        if (nv > 4) {
          // split the polygon using a midpoint
          const midpoint = [0, 0, 0];
          polygon.vertices.forEach((vertice) => vec3$1.add(midpoint, midpoint, vertice));
          vec3$1.snap(midpoint, vec3$1.divide(midpoint, midpoint, [nv, nv, nv]), epsilon);
          for (let i = 0; i < nv; i++) {
            const poly = poly3.fromPoints([midpoint, polygon.vertices[i], polygon.vertices[(i + 1) % nv]]);
            if (polygon.color) poly.color = polygon.color;
            triangles.push(poly);
          }
          return
        }
        // exactly 4 vertices, use simple triangulation
        const poly0 = poly3.fromPoints([polygon.vertices[0], polygon.vertices[1], polygon.vertices[2]]);
        const poly1 = poly3.fromPoints([polygon.vertices[0], polygon.vertices[2], polygon.vertices[3]]);
        if (polygon.color) {
          poly0.color = polygon.color;
          poly1.color = polygon.color;
        }
        triangles.push(poly0, poly1);
        return
      }
      // exactly 3 vertices, so return the original
      triangles.push(polygon);
    };

    /*
     * Convert the given polygons into a list of triangles (polygons with 3 vertices).
     * NOTE: this is possible because poly3 is CONVEX by definition
     */
    const triangulatePolygons = (epsilon, polygons) => {
      const triangles = [];
      polygons.forEach((polygon) => {
        triangulatePolygon(epsilon, polygon, triangles);
      });
      return triangles
    };

    var triangulatePolygons_1 = triangulatePolygons;

    /*
     * Add a unique edge to the given list of edges.
     * Each edge has a list of associated polygons.
     * Edges with two polygons are complete, while edges with one polygon are open, i.e hole or t-junction..
     */
    const addEdge = (edges, edge, polygon) => {
      const ei = edges.findIndex((element) => {
        if (element) {
          if (vec3$1.equals(element[0], edge[0]) && vec3$1.equals(element[1], edge[1])) return true
          if (vec3$1.equals(element[0], edge[1]) && vec3$1.equals(element[1], edge[0])) return true
        }
        return false
      });
      if (ei >= 0) {
        edge = edges[ei];
        edge.polygons.push(polygon);
      } else {
        edge.polygons = [polygon];
        edges.push(edge);
      }
    };

    /*
     * Remove the edge from the given list of edges.
     */
    const removeEdge = (edges, edge) => {
      const ei = edges.findIndex((element) => {
        if (element) {
          if (vec3$1.equals(element[0], edge[0]) && vec3$1.equals(element[1], edge[1])) return true
          if (vec3$1.equals(element[0], edge[1]) && vec3$1.equals(element[1], edge[0])) return true
        }
        return false
      });
      if (ei >= 0) {
        edges[ei].polygons = [];
        edges[ei] = null;
      }
    };

    /*
     * Add all edges of the polygon to the given list of edges.
     */
    const addPolygon$1 = (edges, polygon) => {
      const vertices = polygon.vertices;
      const nv = vertices.length;

      let edge = [vertices[nv - 1], vertices[0]];
      addEdge(edges, edge, polygon);

      for (let i = 0; i < (nv - 1); i++) {
        edge = [vertices[i], vertices[i + 1]];
        addEdge(edges, edge, polygon);
      }
    };

    /*
     * Remove all polygons associated with the old edge from the given list of edges.
     */
    const removePolygons$1 = (edges, oldedge) => {
      // console.log('removePolygons',oldedge)
      const polygons = oldedge.polygons;
      polygons.forEach((polygon) => {
        const vertices = polygon.vertices;
        const nv = vertices.length;

        let edge = [vertices[nv - 1], vertices[0]];
        removeEdge(edges, edge);

        for (let i = 0; i < (nv - 1); i++) {
          edge = [vertices[i], vertices[i + 1]];
          removeEdge(edges, edge);
        }
      });
    };

    /*
     * Split the polygon, ensuring one polygon includes the open edge.
     */
    const splitPolygon = (openedge, polygon, eps) => {
      // console.log('splitPolygon',openedge,polygon)
      const vertices = polygon.vertices;
      const i = vertices.findIndex((point) => almostEquals(eps, point, openedge[0]));
      const polygon1 = poly3.fromPoints([vertices[(i + 0) % 3], vertices[(i + 1) % 3], openedge[1]]);
      const polygon2 = poly3.fromPoints([openedge[1], vertices[(i + 1) % 3], vertices[(i + 2) % 3]]);
      if (polygon.color) {
        polygon1.color = polygon.color;
        polygon2.color = polygon.color;
      }
      // console.log('polygon1',polygon1)
      // console.log('polygon2',polygon2)
      return [polygon1, polygon2]
    };

    /*
     * TBD This should be part of vec3.
     */
    const almostEquals = (eps, v1, v2) => (Math.abs(v1[0] - v2[0]) <= eps && Math.abs(v1[1] - v2[1]) <= eps && Math.abs(v1[2] - v2[2]) <= eps);

    const enclosedEdge = (openedge, edge, eps) => {
      if (openedge.distance < edge.distance) {
        // only look for opposing edges
        if (vec3$1.equals(openedge[0], edge[1])) {
          // only opposing open edges enclosed by the edge
          const distanceE0O0 = vec3$1.squaredDistance(openedge[0], edge[0]);
          const distanceE0O1 = vec3$1.squaredDistance(openedge[1], edge[0]);
          const distanceE1O0 = vec3$1.squaredDistance(openedge[0], edge[1]);
          const distanceE1O1 = vec3$1.squaredDistance(openedge[1], edge[1]);
          if (distanceE0O0 <= edge.distance && distanceE0O1 < edge.distance && distanceE1O0 < edge.distance && distanceE1O1 < edge.distance) {
            // only look for paralell open edges
            const line3d = line3.fromPoints(edge[0], edge[1]);
            const closest0 = vec3$1.snap(vec3$1.create(), eps, line3.closestPoint(openedge[0], line3d));
            const closest1 = vec3$1.snap(vec3$1.create(), eps, line3.closestPoint(openedge[1], line3d));
            if (almostEquals(eps, closest0, openedge[0]) && almostEquals(eps, closest1, openedge[1])) {
              return true
            }
          }
        }
      }
      return false
    };

    /*
     * Split the edge if posssible from the list of open edges.
     * Return a list of new polygons, or null if not possible
     */
    const splitEdge$1 = (openedges, edge, eps) => {
      // console.log('splitEdge',edge)
      for (let i = 0; i < openedges.length; i++) {
        const openedge = openedges[i];
        if (openedge) {
          if (enclosedEdge(openedge, edge, eps)) {
            // spit the polygon associated with the edge
            const polygon = edge.polygons[0];
            const newpolygons = splitPolygon(openedge, polygon, eps);
            return newpolygons
          }
        }
      }
      return null
    };

    /*
     * Cull a list of open edges (see above) from the list of edges.
     */
    const cullOpenEdges$1 = (edges) => {
      const openedges = [];
      edges.forEach((edge) => {
        const polygons = edge.polygons;
        if (polygons.length === 1) {
          // console.log('open edge: ',edge[0],'<-->',edge[1])
          edge.distance = vec3$1.squaredDistance(edge[0], edge[1]);
          openedges.push(edge);
        }
      });
      // console.log('open edges:',openedges.length)
      // console.log('**********OPEN*********')
      // console.log(openedges)
      // console.log('**********OPEN*********')
      return openedges
    };

    /*
     * Convert the list of edges into a list of polygons.
     */
    const edgesToPolygons$1 = (edges) => {
      const polygons = [];
      edges.forEach((edge) => {
        if (edge && edge.polygons) {
          edge.polygons.forEach((polygon) => {
            if (polygon.visited) return
            polygon.visited = true;
            polygons.push(polygon);
          });
        }
      });
      return polygons
    };

    /*
     * Convert the given list of polygons to a list of edges.
     */
    const polygonsToEdges$1 = (polygons) => {
      const edges = [];
      polygons.forEach((polygon) => {
        addPolygon$1(edges, polygon);
      });
      return edges
    };

    var edges = { polygonsToEdges: polygonsToEdges$1, edgesToPolygons: edgesToPolygons$1, cullOpenEdges: cullOpenEdges$1, splitEdge: splitEdge$1, removePolygons: removePolygons$1, addPolygon: addPolygon$1 };

    const { polygonsToEdges, edgesToPolygons, cullOpenEdges, splitEdge, removePolygons, addPolygon } = edges;

    /*
     */
    const repairTjunctions = (epsilon, polygons) => {
      const edges = polygonsToEdges(polygons);
      let openedges = cullOpenEdges(edges);
      if (openedges.length === 0) return polygons

      // split open edges until no longer possible
      let splitting = true;
      while (splitting) {
        let splitcount = 0;
        for (let i = 0; i < openedges.length; i++) {
          const edge = openedges[i];
          if (edge && edge.polygons && edge.polygons.length === 1) {
            const newpolygons = splitEdge(openedges, edge, epsilon);
            if (newpolygons) {
              openedges[i] = null;
              addPolygon(openedges, newpolygons[0]);
              addPolygon(openedges, newpolygons[1]);

              // adjust the master list as well
              removePolygons(edges, edge);
              // add edges for each new polygon
              addPolygon(edges, newpolygons[0]);
              addPolygon(edges, newpolygons[1]);

              splitcount++;
              break // start again
            }
          }
        }
        splitting = (splitcount > 0);
      }
      openedges = openedges.filter((edge) => (edge && edge.polygons && edge.polygons.length === 1));
      if (openedges.length > 0) console.warn('Repair of all T-junctions failed:', openedges.length);

      // rebuild the list of polygons from the edges
      polygons = edgesToPolygons(edges);
      return polygons
    };

    var repairTjunctions_1 = repairTjunctions;

    /*
     */
    const generalizePath2 = (options, geometry) => geometry;

    /*
     */
    const generalizeGeom2 = (options, geometry) => geometry;

    /*
     */
    const generalizeGeom3 = (options, geometry) => {
      const defaults = {
        snap: false,
        simplify: false,
        triangulate: false,
        repair: false
      };
      const { snap, simplify, triangulate, repair } = Object.assign({}, defaults, options);

      const epsilon = measureEpsilon_1(geometry);
      let polygons = geom3$2.toPolygons(geometry);

      // snap the given geometry if requested
      if (snap) {
        polygons = snapPolygons_1(epsilon, polygons);
      }

      // simplify the polygons if requested
      if (simplify) {
        // TODO implement some mesh decimations
        polygons = mergePolygons_1(epsilon, polygons);
      }

      // triangulate the polygons if requested
      if (triangulate) {
        polygons = insertTjunctions_1(polygons);
        polygons = triangulatePolygons_1(epsilon, polygons);
      }

      // repair the polygons (possibly triangles) if requested
      if (repair) {
        // fix T junctions
        polygons = repairTjunctions_1(epsilon, polygons);
        // TODO fill holes
      }

      // FIXME replace with geom3.cloneShallow() when available
      const clone = Object.assign({}, geometry);
      clone.polygons = polygons;

      return clone
    };

    /**
     * Apply various modifications in proper order to produce a generalized geometry.
     * @param {Object} options - options for modifications
     * @param {Boolean} [options.snap=false] the geometries should be snapped to epsilons
     * @param {Boolean} [options.simplify=false] the geometries should be simplified
     * @param {Boolean} [options.triangulate=false] the geometries should be triangulated
     * @param {Boolean} [options.repair=false] the geometries should be repaired
     * @param {...Object} geometries - the geometries to generalize
     * @return {Object|Array} the modified geometry, or a list of modified geometries
     * @alias module:modeling/modifiers.generalize
     */
    const generalize = (options, ...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      const results = geometries.map((geometry) => {
        if (path2$2.isA(geometry)) return generalizePath2(options, geometry)
        if (geom2$2.isA(geometry)) return generalizeGeom2(options, geometry)
        if (geom3$2.isA(geometry)) return generalizeGeom3(options, geometry)
        throw new Error('invalid geometry')
      });
      return results.length === 1 ? results[0] : results
    };

    var generalize_1 = generalize;

    const snapPath2 = (geometry) => {
      const epsilon = measureEpsilon_1(geometry);
      const points = path2$2.toPoints(geometry);
      const newpoints = points.map((point) => vec2.snap(vec2.create(), point, epsilon));
      // snap can produce duplicate points, remove those
      return path2$2.create(newpoints)
    };

    const snapGeom2 = (geometry) => {
      const epsilon = measureEpsilon_1(geometry);
      const sides = geom2$2.toSides(geometry);
      let newsides = sides.map((side) => [vec2.snap(vec2.create(), side[0], epsilon), vec2.snap(vec2.create(), side[1], epsilon)]);
      // snap can produce sides with zero (0) length, remove those
      newsides = newsides.filter((side) => !vec2.equals(side[0], side[1]));
      return geom2$2.create(newsides)
    };

    const snapGeom3 = (geometry) => {
      const epsilon = measureEpsilon_1(geometry);
      const polygons = geom3$2.toPolygons(geometry);
      const newpolygons = snapPolygons_1(epsilon, polygons);
      return geom3$2.create(newpolygons)
    };

    /**
     * Snap the given geometries to the overall precision (epsilon) of the geometry.
     * @see measurements.measureEpsilon()
     * @param {...Object} geometries - the geometries to snap
     * @return {Object|Array} the snapped geometry, or a list of snapped geometries
     * @alias module:modeling/modifiers.snap
     */
    const snap = (...geometries) => {
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('wrong number of arguments')

      const results = geometries.map((geometry) => {
        if (path2$2.isA(geometry)) return snapPath2(geometry)
        if (geom2$2.isA(geometry)) return snapGeom2(geometry)
        if (geom3$2.isA(geometry)) return snapGeom3(geometry)
        return geometry
      });
      return results.length === 1 ? results[0] : results
    };

    var snap_1 = snap;

    /**
     * All shapes (primitives or the results of operations) can be modified to correct issues, etc.
     * In all cases, these functions returns the results, and never changes the original geometry.
     * @module modeling/modifiers
     * @example
     * const { snap } = require('@jscad/modeling').modifiers
     */
    var modifiers = {
      generalize: generalize_1,
      snap: snap_1
    };

    /**
     * Build an array of at minimum a specified length from an existing array and a padding value. IF the array is already larger than the target length, it will not be shortened.
     * @param {Array} anArray - the source array to copy into the result.
     * @param {*} padding - the value to add to the new array to reach the desired length.
     * @param {Number} targetLength - The desired length of the return array.
     * @returns {Array} an array of at least 'targetLength' length
     * @alias module:modeling/utils.padArrayToLength
     */
    const padArrayToLength = (anArray, padding, targetLength) => {
      anArray = anArray.slice();
      while (anArray.length < targetLength) {
        anArray.push(padding);
      }
      return anArray
    };

    var padArrayToLength_1 = padArrayToLength;

    const { translate: translate$3 } = translate_1$1;

    const validateOptions = (options) => {
      if (!Array.isArray(options.modes) || options.modes.length > 3) throw new Error('align(): modes must be an array of length <= 3')
      options.modes = padArrayToLength_1(options.modes, 'none', 3);
      if (options.modes.filter((mode) => ['center', 'max', 'min', 'none'].includes(mode)).length !== 3) throw new Error('align(): all modes must be one of "center", "max" or "min"')

      if (!Array.isArray(options.relativeTo) || options.relativeTo.length > 3) throw new Error('align(): relativeTo must be an array of length <= 3')
      options.relativeTo = padArrayToLength_1(options.relativeTo, 0, 3);
      if (options.relativeTo.filter((alignVal) => (Number.isFinite(alignVal) || alignVal == null)).length !== 3) throw new Error('align(): all relativeTo values must be a number, or null.')

      if (typeof options.grouped !== 'boolean') throw new Error('align(): grouped must be a boolean value.')

      return options
    };

    const populateRelativeToFromBounds = (relativeTo, modes, bounds) => {
      for (let i = 0; i < 3; i++) {
        if (relativeTo[i] == null) {
          if (modes[i] === 'center') {
            relativeTo[i] = (bounds[0][i] + bounds[1][i]) / 2;
          } else if (modes[i] === 'max') {
            relativeTo[i] = bounds[1][i];
          } else if (modes[i] === 'min') {
            relativeTo[i] = bounds[0][i];
          }
        }
      }
      return relativeTo
    };

    const alignGeometries = (geometry, modes, relativeTo) => {
      const bounds = measureAggregateBoundingBox_1(geometry);
      const translation = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        if (modes[i] === 'center') {
          translation[i] = relativeTo[i] - (bounds[0][i] + bounds[1][i]) / 2;
        } else if (modes[i] === 'max') {
          translation[i] = relativeTo[i] - bounds[1][i];
        } else if (modes[i] === 'min') {
          translation[i] = relativeTo[i] - bounds[0][i];
        }
      }

      return translate$3(translation, geometry)
    };

    /**
     * Align the boundaries of the given geometries using the given options.
     * @param {Object} options - options for aligning
     * @param {Array} [options.modes = ['center', 'center', 'min']] - the point on the geometries to align to for each axis. Valid options are "center", "max", "min", and "none".
     * @param {Array} [options.relativeTo = [0,0,0]] - The point one each axis on which to align the geometries upon.  If the value is null, then the corresponding value from the group's bounding box is used.
     * @param {Boolean} [options.grouped = false] - if true, transform all geometries by the same amount, maintaining the relative positions to each other.
     * @param {...Object} geometries - the geometries to align
     * @return {Object|Array} the aligned geometry, or a list of aligned geometries
     * @alias module:modeling/transforms.align
     *
     * @example
     * let alignedGeometries = align({modes: ['min', 'center', 'none'], relativeTo: [10, null, 10], grouped: true }, geometries)
     */
    const align = (options, ...geometries) => {
      const defaults = {
        modes: ['center', 'center', 'min'],
        relativeTo: [0, 0, 0],
        grouped: false
      };
      options = Object.assign({}, defaults, options);

      options = validateOptions(options);
      let { modes, relativeTo, grouped } = options;
      geometries = flatten_1(geometries);
      if (geometries.length === 0) throw new Error('align(): No geometries were provided to act upon')

      if (relativeTo.filter((val) => val == null).length) {
        const bounds = measureAggregateBoundingBox_1(geometries);
        relativeTo = populateRelativeToFromBounds(relativeTo, modes, bounds);
      }
      if (grouped) {
        geometries = alignGeometries(geometries, modes, relativeTo);
      } else {
        geometries = geometries.map((geometry) => alignGeometries(geometry, modes, relativeTo));
      }
      return geometries.length === 1 ? geometries[0] : geometries
    };

    var align_1 = align;

    const { translate: translate$2 } = translate_1$1;

    const centerGeometry = (options, object) => {
      const defaults = {
        axes: [true, true, true],
        relativeTo: [0, 0, 0]
      };
      const { axes, relativeTo } = Object.assign({}, defaults, options);

      const bounds = measureBoundingBox_1(object);
      const offset = [0, 0, 0];
      if (axes[0]) offset[0] = relativeTo[0] - (bounds[0][0] + ((bounds[1][0] - bounds[0][0]) / 2));
      if (axes[1]) offset[1] = relativeTo[1] - (bounds[0][1] + ((bounds[1][1] - bounds[0][1]) / 2));
      if (axes[2]) offset[2] = relativeTo[2] - (bounds[0][2] + ((bounds[1][2] - bounds[0][2]) / 2));
      return translate$2(offset, object)
    };

    /**
     * Center the given objects using the given options.
     * @param {Object} options - options for centering
     * @param {Array} [options.axes=[true,true,true]] - axis of which to center, true or false
     * @param {Array} [options.relativeTo=[0,0,0]] - relative point of which to center the objects
     * @param {...Object} objects - the objects to center
     * @return {Object|Array} the centered object, or a list of centered objects
     * @alias module:modeling/transforms.center
     *
     * @example
     * let myshape = center({axes: [true,false,false]}, sphere()) // center about the X axis
     */
    const center = (options, ...objects) => {
      const defaults = {
        axes: [true, true, true],
        relativeTo: [0, 0, 0]
      // TODO : Add addition 'methods' of centering; midpoint, centeriod
      };
      const { axes, relativeTo } = Object.assign({}, defaults, options);

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')
      if (relativeTo.length !== 3) throw new Error('relativeTo must be an array of length 3')

      options = { axes, relativeTo };

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return centerGeometry(options, object)
        if (geom2$2.isA(object)) return centerGeometry(options, object)
        if (geom3$2.isA(object)) return centerGeometry(options, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    /**
     * Center the given objects about the X axis.
     * @param {...Object} objects - the objects to center
     * @return {Object|Array} the centered object, or a list of centered objects
     * @alias module:modeling/transforms.centerX
     */
    const centerX = (...objects) => center({ axes: [true, false, false] }, objects);

    /**
     * Center the given objects about the Y axis.
     * @param {...Object} objects - the objects to center
     * @return {Object|Array} the centered object, or a list of centered objects
     * @alias module:modeling/transforms.centerY
     */
    const centerY = (...objects) => center({ axes: [false, true, false] }, objects);

    /**
     * Center the given objects about the Z axis.
     * @param {...Object} objects - the objects to center
     * @return {Object|Array} the centered object, or a list of centered objects
     * @alias module:modeling/transforms.centerZ
     */
    const centerZ = (...objects) => center({ axes: [false, false, true] }, objects);

    var center_1 = {
      center,
      centerX,
      centerY,
      centerZ
    };

    /**
     * Scale the given objects using the given options.
     * @param {Array} factors - X, Y, Z factors by which to scale the objects
     * @param {...Object} objects - the objects to scale
     * @return {Object|Array} the scaled object, or a list of scaled objects
     * @alias module:modeling/transforms.scale
     *
     * @example
     * let myshape = scale([5, 0, 10], sphere())
     */
    const scale$2 = (factors, ...objects) => {
      if (!Array.isArray(factors)) throw new Error('factors must be an array')

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      // adjust the factors if necessary
      factors = factors.slice(); // don't modify the original
      while (factors.length < 3) factors.push(1);

      if (factors[0] <= 0 || factors[1] <= 0 || factors[2] <= 0) throw new Error('factors must be positive')

      const matrix = mat4.fromScaling(mat4.create(), factors);

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return path2$2.transform(matrix, object)
        if (geom2$2.isA(object)) return geom2$2.transform(matrix, object)
        if (geom3$2.isA(object)) return geom3$2.transform(matrix, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    /**
     * Scale the given objects about the X axis using the given options.
     * @param {Number} factor - X factor by which to scale the objects
     * @param {...Object} objects - the objects to scale
     * @return {Object|Array} the scaled object, or a list of scaled objects
     * @alias module:modeling/transforms.scaleX
     */
    const scaleX = (factor, ...objects) => scale$2([factor, 1, 1], objects);

    /**
     * Scale the given objects about the Y axis using the given options.
     * @param {Number} factor - Y factor by which to scale the objects
     * @param {...Object} objects - the objects to scale
     * @return {Object|Array} the scaled object, or a list of scaled objects
     * @alias module:modeling/transforms.scaleY
     */
    const scaleY = (factor, ...objects) => scale$2([1, factor, 1], objects);

    /**
     * Scale the given objects about the Z axis using the given options.
     * @param {Number} factor - Z factor by which to scale the objects
     * @param {...Object} objects - the objects to scale
     * @return {Object|Array} the scaled object, or a list of scaled objects
     * @alias module:modeling/transforms.scaleZ
     */
    const scaleZ = (factor, ...objects) => scale$2([1, 1, factor], objects);

    var scale_1$1 = {
      scale: scale$2,
      scaleX,
      scaleY,
      scaleZ
    };

    /**
     * Transform the given objects using the given matrix.
     * @param {mat4} matrix - a transformation matrix
     * @param {...Object} objects - the objects to transform
     * @return {Object|Array} the transformed object, or a list of transformed objects
     * @alias module:modeling/transforms.transform
     *
     * @example
     * const newsphere = transform(mat4.rotateX(Math.PI/4), sphere())
     */
    const transform = (matrix, ...objects) => {
      // TODO how to check that the matrix is REAL?

      objects = flatten_1(objects);
      if (objects.length === 0) throw new Error('wrong number of arguments')

      const results = objects.map((object) => {
        if (path2$2.isA(object)) return path2$2.transform(matrix, object)
        if (geom2$2.isA(object)) return geom2$2.transform(matrix, object)
        if (geom3$2.isA(object)) return geom3$2.transform(matrix, object)
        return object
      });
      return results.length === 1 ? results[0] : results
    };

    var transform_1 = transform;

    /**
     * All shapes (primitives or the results of operations) can be transformed, such as scaled or rotated.
     * In all cases, the function returns the results, and never changes the original shapes.
     * @module modeling/transforms
     * @example
     * const { center, rotateX, translate } = require('@jscad/modeling').transforms
     */
    var transforms = {
      align: align_1,

      center: center_1.center,
      centerX: center_1.centerX,
      centerY: center_1.centerY,
      centerZ: center_1.centerZ,

      mirror: mirror_1.mirror,
      mirrorX: mirror_1.mirrorX,
      mirrorY: mirror_1.mirrorY,
      mirrorZ: mirror_1.mirrorZ,

      rotate: rotate_1$1.rotate,
      rotateX: rotate_1$1.rotateX,
      rotateY: rotate_1$1.rotateY,
      rotateZ: rotate_1$1.rotateZ,

      scale: scale_1$1.scale,
      scaleX: scale_1$1.scaleX,
      scaleY: scale_1$1.scaleY,
      scaleZ: scale_1$1.scaleZ,

      transform: transform_1,

      translate: translate_1$1.translate,
      translateX: translate_1$1.translateX,
      translateY: translate_1$1.translateY,
      translateZ: translate_1$1.translateZ
    };
    var transforms_1 = transforms.align;
    var transforms_2 = transforms.center;
    var transforms_6 = transforms.mirror;
    var transforms_10 = transforms.rotate;
    var transforms_14 = transforms.scale;
    var transforms_19 = transforms.translate;

    var src = {
      colors: colors,
      curves: curves,
      geometries: geometries,
      maths: maths,
      measurements: measurements,
      primitives: primitives,
      text: text,
      utils: utils,

      booleans: booleans,
      expansions: expansions,
      extrusions: extrusions,
      hulls: hulls,
      modifiers: modifiers,
      transforms: transforms
    };
    var src_6 = src.primitives;

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
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }

    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;

      _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;

        if (typeof Class !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }

        if (typeof _cache !== "undefined") {
          if (_cache.has(Class)) return _cache.get(Class);

          _cache.set(Class, Wrapper);
        }

        function Wrapper() {
          return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }

        Wrapper.prototype = Object.create(Class.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return _setPrototypeOf(Wrapper, Class);
      };

      return _wrapNativeSuper(Class);
    }

    function _wrapRegExp(re, groups) {
      _wrapRegExp = function (re, groups) {
        return new BabelRegExp(re, undefined, groups);
      };

      var _RegExp = _wrapNativeSuper(RegExp);

      var _super = RegExp.prototype;

      var _groups = new WeakMap();

      function BabelRegExp(re, flags, groups) {
        var _this = _RegExp.call(this, re, flags);

        _groups.set(_this, groups || _groups.get(re));

        return _this;
      }

      _inherits(BabelRegExp, _RegExp);

      BabelRegExp.prototype.exec = function (str) {
        var result = _super.exec.call(this, str);

        if (result) result.groups = buildGroups(result, this);
        return result;
      };

      BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
        if (typeof substitution === "string") {
          var groups = _groups.get(this);

          return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
            return "$" + groups[name];
          }));
        } else if (typeof substitution === "function") {
          var _this = this;

          return _super[Symbol.replace].call(this, str, function () {
            var args = [];
            args.push.apply(args, arguments);

            if (typeof args[args.length - 1] !== "object") {
              args.push(buildGroups(args, _this));
            }

            return substitution.apply(this, args);
          });
        } else {
          return _super[Symbol.replace].call(this, str, substitution);
        }
      };

      function buildGroups(result, re) {
        var g = _groups.get(re);

        return Object.keys(g).reduce(function (groups, name) {
          groups[name] = result[g[name]];
          return groups;
        }, Object.create(null));
      }

      return _wrapRegExp.apply(this, arguments);
    }

    var create_1$1 = create$1;

    /**
     * Creates a new identity mat4
     *
     * @returns {mat4} a new 4x4 matrix
     */
    function create$1() {
        var out = new Float32Array(16);
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

    var clone_1 = clone$1;

    /**
     * Creates a new mat4 initialized with values from an existing matrix
     *
     * @param {mat4} a matrix to clone
     * @returns {mat4} a new 4x4 matrix
     */
    function clone$1(a) {
        var out = new Float32Array(16);
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

    var copy_1 = copy;

    /**
     * Copy the values from one mat4 to another
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the source matrix
     * @returns {mat4} out
     */
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

    var identity_1 = identity;

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

    var transpose_1 = transpose;

    /**
     * Transpose the values of a mat4
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the source matrix
     * @returns {mat4} out
     */
    function transpose(out, a) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            var a01 = a[1], a02 = a[2], a03 = a[3],
                a12 = a[6], a13 = a[7],
                a23 = a[11];

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

    var invert_1 = invert;

    /**
     * Inverts a mat4
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the source matrix
     * @returns {mat4} out
     */
    function invert(out, a) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) { 
            return null; 
        }
        det = 1.0 / det;

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

    var adjoint_1 = adjoint;

    /**
     * Calculates the adjugate of a mat4
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the source matrix
     * @returns {mat4} out
     */
    function adjoint(out, a) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
        out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
        out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
        out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
        out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
        out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
        out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
        out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
        return out;
    }

    var determinant_1 = determinant;

    /**
     * Calculates the determinant of a mat4
     *
     * @param {mat4} a the source matrix
     * @returns {Number} determinant of a
     */
    function determinant(a) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    var multiply_1 = multiply;

    /**
     * Multiplies two mat4's
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the first operand
     * @param {mat4} b the second operand
     * @returns {mat4} out
     */
    function multiply(out, a, b) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        // Cache only the current line of the second matrix
        var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
        out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
        return out;
    }

    var translate_1 = translate$1;

    /**
     * Translate a mat4 by the given vector
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to translate
     * @param {vec3} v vector to translate by
     * @returns {mat4} out
     */
    function translate$1(out, a, v) {
        var x = v[0], y = v[1], z = v[2],
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23;

        if (a === out) {
            out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
            out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
            out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
            out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
        } else {
            a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
            a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
            a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

            out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
            out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
            out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

            out[12] = a00 * x + a10 * y + a20 * z + a[12];
            out[13] = a01 * x + a11 * y + a21 * z + a[13];
            out[14] = a02 * x + a12 * y + a22 * z + a[14];
            out[15] = a03 * x + a13 * y + a23 * z + a[15];
        }

        return out;
    }

    var scale_1 = scale$1;

    /**
     * Scales the mat4 by the dimensions in the given vec3
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to scale
     * @param {vec3} v the vec3 to scale the matrix by
     * @returns {mat4} out
     **/
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

    var rotate_1 = rotate$1;

    /**
     * Rotates a mat4 by the given angle
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {vec3} axis the axis to rotate around
     * @returns {mat4} out
     */
    function rotate$1(out, a, rad, axis) {
        var x = axis[0], y = axis[1], z = axis[2],
            len = Math.sqrt(x * x + y * y + z * z),
            s, c, t,
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23,
            b00, b01, b02,
            b10, b11, b12,
            b20, b21, b22;

        if (Math.abs(len) < 0.000001) { return null; }
        
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
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

        if (a !== out) { // If the source and destination differ, copy the unchanged last row
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }
        return out;
    }

    var rotateX_1 = rotateX;

    /**
     * Rotates a matrix by the given angle around the X axis
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function rotateX(out, a, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7],
            a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            out[0]  = a[0];
            out[1]  = a[1];
            out[2]  = a[2];
            out[3]  = a[3];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
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

    var rotateY_1 = rotateY;

    /**
     * Rotates a matrix by the given angle around the Y axis
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function rotateY(out, a, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            out[4]  = a[4];
            out[5]  = a[5];
            out[6]  = a[6];
            out[7]  = a[7];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
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

    var rotateZ_1 = rotateZ;

    /**
     * Rotates a matrix by the given angle around the Z axis
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function rotateZ(out, a, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];

        if (a !== out) { // If the source and destination differ, copy the unchanged last row
            out[8]  = a[8];
            out[9]  = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
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

    var fromRotation_1 = fromRotation;

    /**
     * Creates a matrix from a given angle around a given axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.rotate(dest, dest, rad, axis)
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @param {vec3} axis the axis to rotate around
     * @returns {mat4} out
     */
    function fromRotation(out, rad, axis) {
      var s, c, t;
      var x = axis[0];
      var y = axis[1];
      var z = axis[2];
      var len = Math.sqrt(x * x + y * y + z * z);

      if (Math.abs(len) < 0.000001) {
        return null
      }

      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;

      s = Math.sin(rad);
      c = Math.cos(rad);
      t = 1 - c;

      // Perform rotation-specific matrix multiplication
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
      return out
    }

    var fromRotationTranslation_1 = fromRotationTranslation;

    /**
     * Creates a matrix from a quaternion rotation and vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     var quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {quat4} q Rotation quaternion
     * @param {vec3} v Translation vector
     * @returns {mat4} out
     */
    function fromRotationTranslation(out, q, v) {
        // Quaternion math
        var x = q[0], y = q[1], z = q[2], w = q[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

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

    var fromScaling_1 = fromScaling;

    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.scale(dest, dest, vec)
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {vec3} v Scaling vector
     * @returns {mat4} out
     */
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
      return out
    }

    var fromTranslation_1 = fromTranslation;

    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.translate(dest, dest, vec)
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {vec3} v Translation vector
     * @returns {mat4} out
     */
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
      return out
    }

    var fromXRotation_1 = fromXRotation;

    /**
     * Creates a matrix from the given angle around the X axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.rotateX(dest, dest, rad)
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function fromXRotation(out, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
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
        return out
    }

    var fromYRotation_1 = fromYRotation;

    /**
     * Creates a matrix from the given angle around the Y axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.rotateY(dest, dest, rad)
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function fromYRotation(out, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
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
        return out
    }

    var fromZRotation_1 = fromZRotation;

    /**
     * Creates a matrix from the given angle around the Z axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest)
     *     mat4.rotateZ(dest, dest, rad)
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function fromZRotation(out, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
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
        return out
    }

    var fromQuat_1 = fromQuat;

    /**
     * Creates a matrix from a quaternion rotation.
     *
     * @param {mat4} out mat4 receiving operation result
     * @param {quat4} q Rotation quaternion
     * @returns {mat4} out
     */
    function fromQuat(out, q) {
        var x = q[0], y = q[1], z = q[2], w = q[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            yx = y * x2,
            yy = y * y2,
            zx = z * x2,
            zy = z * y2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

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

    var frustum_1 = frustum;

    /**
     * Generates a frustum matrix with the given bounds
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {Number} left Left bound of the frustum
     * @param {Number} right Right bound of the frustum
     * @param {Number} bottom Bottom bound of the frustum
     * @param {Number} top Top bound of the frustum
     * @param {Number} near Near bound of the frustum
     * @param {Number} far Far bound of the frustum
     * @returns {mat4} out
     */
    function frustum(out, left, right, bottom, top, near, far) {
        var rl = 1 / (right - left),
            tb = 1 / (top - bottom),
            nf = 1 / (near - far);
        out[0] = (near * 2) * rl;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = (near * 2) * tb;
        out[6] = 0;
        out[7] = 0;
        out[8] = (right + left) * rl;
        out[9] = (top + bottom) * tb;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (far * near * 2) * nf;
        out[15] = 0;
        return out;
    }

    var perspective_1 = perspective;

    /**
     * Generates a perspective projection matrix with the given bounds
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */
    function perspective(out, fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);
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
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;
        return out;
    }

    var perspectiveFromFieldOfView_1 = perspectiveFromFieldOfView;

    /**
     * Generates a perspective projection matrix with the given field of view.
     * This is primarily useful for generating projection matrices to be used
     * with the still experiemental WebVR API.
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */
    function perspectiveFromFieldOfView(out, fov, near, far) {
        var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
            downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
            leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
            rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
            xScale = 2.0 / (leftTan + rightTan),
            yScale = 2.0 / (upTan + downTan);

        out[0] = xScale;
        out[1] = 0.0;
        out[2] = 0.0;
        out[3] = 0.0;
        out[4] = 0.0;
        out[5] = yScale;
        out[6] = 0.0;
        out[7] = 0.0;
        out[8] = -((leftTan - rightTan) * xScale * 0.5);
        out[9] = ((upTan - downTan) * yScale * 0.5);
        out[10] = far / (near - far);
        out[11] = -1.0;
        out[12] = 0.0;
        out[13] = 0.0;
        out[14] = (far * near) / (near - far);
        out[15] = 0.0;
        return out;
    }

    var ortho_1 = ortho;

    /**
     * Generates a orthogonal projection matrix with the given bounds
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */
    function ortho(out, left, right, bottom, top, near, far) {
        var lr = 1 / (left - right),
            bt = 1 / (bottom - top),
            nf = 1 / (near - far);
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

    var lookAt_1 = lookAt;

    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis
     *
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {vec3} eye Position of the viewer
     * @param {vec3} center Point the viewer is looking at
     * @param {vec3} up vec3 pointing up
     * @returns {mat4} out
     */
    function lookAt(out, eye, center, up) {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2],
            centerx = center[0],
            centery = center[1],
            centerz = center[2];

        if (Math.abs(eyex - centerx) < 0.000001 &&
            Math.abs(eyey - centery) < 0.000001 &&
            Math.abs(eyez - centerz) < 0.000001) {
            return identity_1(out);
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
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

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
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

    var str_1 = str;

    /**
     * Returns a string representation of a mat4
     *
     * @param {mat4} mat matrix to represent as a string
     * @returns {String} string representation of the matrix
     */
    function str(a) {
        return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                        a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                        a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                        a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
    }

    var glMat4 = {
      create: create_1$1
      , clone: clone_1
      , copy: copy_1
      , identity: identity_1
      , transpose: transpose_1
      , invert: invert_1
      , adjoint: adjoint_1
      , determinant: determinant_1
      , multiply: multiply_1
      , translate: translate_1
      , scale: scale_1
      , rotate: rotate_1
      , rotateX: rotateX_1
      , rotateY: rotateY_1
      , rotateZ: rotateZ_1
      , fromRotation: fromRotation_1
      , fromRotationTranslation: fromRotationTranslation_1
      , fromScaling: fromScaling_1
      , fromTranslation: fromTranslation_1
      , fromXRotation: fromXRotation_1
      , fromYRotation: fromYRotation_1
      , fromZRotation: fromZRotation_1
      , fromQuat: fromQuat_1
      , frustum: frustum_1
      , perspective: perspective_1
      , perspectiveFromFieldOfView: perspectiveFromFieldOfView_1
      , ortho: ortho_1
      , lookAt: lookAt_1
      , str: str_1
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isTypedArray = function (x) {
      return (
        x instanceof Uint8Array ||
        x instanceof Uint16Array ||
        x instanceof Uint32Array ||
        x instanceof Int8Array ||
        x instanceof Int16Array ||
        x instanceof Int32Array ||
        x instanceof Float32Array ||
        x instanceof Float64Array ||
        x instanceof Uint8ClampedArray
      )
    };

    var extend = function (base, opts) {
      var keys = Object.keys(opts);
      for (var i = 0; i < keys.length; ++i) {
        base[keys[i]] = opts[keys[i]];
      }
      return base
    };

    // Error checking and parameter validation.
    //
    // Statements for the form `check.someProcedure(...)` get removed by
    // a browserify transform for optimized/minified bundles.
    //
    /* globals atob */
    var endl = '\n';

    // only used for extracting shader names.  if atob not present, then errors
    // will be slightly crappier
    function decodeB64 (str) {
      if (typeof atob !== 'undefined') {
        return atob(str)
      }
      return 'base64:' + str
    }

    function raise (message) {
      var error = new Error('(regl) ' + message);
      console.error(error);
      throw error
    }

    function check (pred, message) {
      if (!pred) {
        raise(message);
      }
    }

    function encolon (message) {
      if (message) {
        return ': ' + message
      }
      return ''
    }

    function checkParameter (param, possibilities, message) {
      if (!(param in possibilities)) {
        raise('unknown parameter (' + param + ')' + encolon(message) +
              '. possible values: ' + Object.keys(possibilities).join());
      }
    }

    function checkIsTypedArray (data, message) {
      if (!isTypedArray(data)) {
        raise(
          'invalid parameter type' + encolon(message) +
          '. must be a typed array');
      }
    }

    function standardTypeEh (value, type) {
      switch (type) {
        case 'number': return typeof value === 'number'
        case 'object': return typeof value === 'object'
        case 'string': return typeof value === 'string'
        case 'boolean': return typeof value === 'boolean'
        case 'function': return typeof value === 'function'
        case 'undefined': return typeof value === 'undefined'
        case 'symbol': return typeof value === 'symbol'
      }
    }

    function checkTypeOf (value, type, message) {
      if (!standardTypeEh(value, type)) {
        raise(
          'invalid parameter type' + encolon(message) +
          '. expected ' + type + ', got ' + (typeof value));
      }
    }

    function checkNonNegativeInt (value, message) {
      if (!((value >= 0) &&
            ((value | 0) === value))) {
        raise('invalid parameter type, (' + value + ')' + encolon(message) +
              '. must be a nonnegative integer');
      }
    }

    function checkOneOf (value, list, message) {
      if (list.indexOf(value) < 0) {
        raise('invalid value' + encolon(message) + '. must be one of: ' + list);
      }
    }

    var constructorKeys = [
      'gl',
      'canvas',
      'container',
      'attributes',
      'pixelRatio',
      'extensions',
      'optionalExtensions',
      'profile',
      'onDone'
    ];

    function checkConstructor (obj) {
      Object.keys(obj).forEach(function (key) {
        if (constructorKeys.indexOf(key) < 0) {
          raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
        }
      });
    }

    function leftPad (str, n) {
      str = str + '';
      while (str.length < n) {
        str = ' ' + str;
      }
      return str
    }

    function ShaderFile () {
      this.name = 'unknown';
      this.lines = [];
      this.index = {};
      this.hasErrors = false;
    }

    function ShaderLine (number, line) {
      this.number = number;
      this.line = line;
      this.errors = [];
    }

    function ShaderError (fileNumber, lineNumber, message) {
      this.file = fileNumber;
      this.line = lineNumber;
      this.message = message;
    }

    function guessCommand () {
      var error = new Error();
      var stack = (error.stack || error).toString();
      var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
      if (pat) {
        return pat[1]
      }
      var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
      if (pat2) {
        return pat2[1]
      }
      return 'unknown'
    }

    function guessCallSite () {
      var error = new Error();
      var stack = (error.stack || error).toString();
      var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
      if (pat) {
        return pat[1]
      }
      var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
      if (pat2) {
        return pat2[1]
      }
      return 'unknown'
    }

    function parseSource (source, command) {
      var lines = source.split('\n');
      var lineNumber = 1;
      var fileNumber = 0;
      var files = {
        unknown: new ShaderFile(),
        0: new ShaderFile()
      };
      files.unknown.name = files[0].name = command || guessCommand();
      files.unknown.lines.push(new ShaderLine(0, ''));
      for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var parts = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(line);
        if (parts) {
          switch (parts[1]) {
            case 'line':
              var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
              if (lineNumberInfo) {
                lineNumber = lineNumberInfo[1] | 0;
                if (lineNumberInfo[2]) {
                  fileNumber = lineNumberInfo[2] | 0;
                  if (!(fileNumber in files)) {
                    files[fileNumber] = new ShaderFile();
                  }
                }
              }
              break
            case 'define':
              var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
              if (nameInfo) {
                files[fileNumber].name = (nameInfo[1]
                  ? decodeB64(nameInfo[2])
                  : nameInfo[2]);
              }
              break
          }
        }
        files[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
      }
      Object.keys(files).forEach(function (fileNumber) {
        var file = files[fileNumber];
        file.lines.forEach(function (line) {
          file.index[line.number] = line;
        });
      });
      return files
    }

    function parseErrorLog (errLog) {
      var result = [];
      errLog.split('\n').forEach(function (errMsg) {
        if (errMsg.length < 5) {
          return
        }
        var parts = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(errMsg);
        if (parts) {
          result.push(new ShaderError(
            parts[1] | 0,
            parts[2] | 0,
            parts[3].trim()));
        } else if (errMsg.length > 0) {
          result.push(new ShaderError('unknown', 0, errMsg));
        }
      });
      return result
    }

    function annotateFiles (files, errors) {
      errors.forEach(function (error) {
        var file = files[error.file];
        if (file) {
          var line = file.index[error.line];
          if (line) {
            line.errors.push(error);
            file.hasErrors = true;
            return
          }
        }
        files.unknown.hasErrors = true;
        files.unknown.lines[0].errors.push(error);
      });
    }

    function checkShaderError (gl, shader, source, type, command) {
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var errLog = gl.getShaderInfoLog(shader);
        var typeName = type === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex';
        checkCommandType(source, 'string', typeName + ' shader source must be a string', command);
        var files = parseSource(source, command);
        var errors = parseErrorLog(errLog);
        annotateFiles(files, errors);

        Object.keys(files).forEach(function (fileNumber) {
          var file = files[fileNumber];
          if (!file.hasErrors) {
            return
          }

          var strings = [''];
          var styles = [''];

          function push (str, style) {
            strings.push(str);
            styles.push(style || '');
          }

          push('file number ' + fileNumber + ': ' + file.name + '\n', 'color:red;text-decoration:underline;font-weight:bold');

          file.lines.forEach(function (line) {
            if (line.errors.length > 0) {
              push(leftPad(line.number, 4) + '|  ', 'background-color:yellow; font-weight:bold');
              push(line.line + endl, 'color:red; background-color:yellow; font-weight:bold');

              // try to guess token
              var offset = 0;
              line.errors.forEach(function (error) {
                var message = error.message;
                var token = /^\s*'(.*)'\s*:\s*(.*)$/.exec(message);
                if (token) {
                  var tokenPat = token[1];
                  message = token[2];
                  switch (tokenPat) {
                    case 'assign':
                      tokenPat = '=';
                      break
                  }
                  offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
                } else {
                  offset = 0;
                }

                push(leftPad('| ', 6));
                push(leftPad('^^^', offset + 3) + endl, 'font-weight:bold');
                push(leftPad('| ', 6));
                push(message + endl, 'font-weight:bold');
              });
              push(leftPad('| ', 6) + endl);
            } else {
              push(leftPad(line.number, 4) + '|  ');
              push(line.line + endl, 'color:red');
            }
          });
          if (typeof document !== 'undefined' && !window.chrome) {
            styles[0] = strings.join('%c');
            console.log.apply(console, styles);
          } else {
            console.log(strings.join(''));
          }
        });

        check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name);
      }
    }

    function checkLinkError (gl, program, fragShader, vertShader, command) {
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var errLog = gl.getProgramInfoLog(program);
        var fragParse = parseSource(fragShader, command);
        var vertParse = parseSource(vertShader, command);

        var header = 'Error linking program with vertex shader, "' +
          vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';

        if (typeof document !== 'undefined') {
          console.log('%c' + header + endl + '%c' + errLog,
            'color:red;text-decoration:underline;font-weight:bold',
            'color:red');
        } else {
          console.log(header + endl + errLog);
        }
        check.raise(header);
      }
    }

    function saveCommandRef (object) {
      object._commandRef = guessCommand();
    }

    function saveDrawCommandInfo (opts, uniforms, attributes, stringStore) {
      saveCommandRef(opts);

      function id (str) {
        if (str) {
          return stringStore.id(str)
        }
        return 0
      }
      opts._fragId = id(opts.static.frag);
      opts._vertId = id(opts.static.vert);

      function addProps (dict, set) {
        Object.keys(set).forEach(function (u) {
          dict[stringStore.id(u)] = true;
        });
      }

      var uniformSet = opts._uniformSet = {};
      addProps(uniformSet, uniforms.static);
      addProps(uniformSet, uniforms.dynamic);

      var attributeSet = opts._attributeSet = {};
      addProps(attributeSet, attributes.static);
      addProps(attributeSet, attributes.dynamic);

      opts._hasCount = (
        'count' in opts.static ||
        'count' in opts.dynamic ||
        'elements' in opts.static ||
        'elements' in opts.dynamic);
    }

    function commandRaise (message, command) {
      var callSite = guessCallSite();
      raise(message +
        ' in command ' + (command || guessCommand()) +
        (callSite === 'unknown' ? '' : ' called from ' + callSite));
    }

    function checkCommand (pred, message, command) {
      if (!pred) {
        commandRaise(message, command || guessCommand());
      }
    }

    function checkParameterCommand (param, possibilities, message, command) {
      if (!(param in possibilities)) {
        commandRaise(
          'unknown parameter (' + param + ')' + encolon(message) +
          '. possible values: ' + Object.keys(possibilities).join(),
          command || guessCommand());
      }
    }

    function checkCommandType (value, type, message, command) {
      if (!standardTypeEh(value, type)) {
        commandRaise(
          'invalid parameter type' + encolon(message) +
          '. expected ' + type + ', got ' + (typeof value),
          command || guessCommand());
      }
    }

    function checkOptional (block) {
      block();
    }

    function checkFramebufferFormat (attachment, texFormats, rbFormats) {
      if (attachment.texture) {
        checkOneOf(
          attachment.texture._texture.internalformat,
          texFormats,
          'unsupported texture format for attachment');
      } else {
        checkOneOf(
          attachment.renderbuffer._renderbuffer.format,
          rbFormats,
          'unsupported renderbuffer format for attachment');
      }
    }

    var GL_CLAMP_TO_EDGE = 0x812F;

    var GL_NEAREST = 0x2600;
    var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
    var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
    var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
    var GL_LINEAR_MIPMAP_LINEAR = 0x2703;

    var GL_BYTE = 5120;
    var GL_UNSIGNED_BYTE = 5121;
    var GL_SHORT = 5122;
    var GL_UNSIGNED_SHORT = 5123;
    var GL_INT = 5124;
    var GL_UNSIGNED_INT = 5125;
    var GL_FLOAT = 5126;

    var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
    var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
    var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
    var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;

    var GL_HALF_FLOAT_OES = 0x8D61;

    var TYPE_SIZE = {};

    TYPE_SIZE[GL_BYTE] =
    TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;

    TYPE_SIZE[GL_SHORT] =
    TYPE_SIZE[GL_UNSIGNED_SHORT] =
    TYPE_SIZE[GL_HALF_FLOAT_OES] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;

    TYPE_SIZE[GL_INT] =
    TYPE_SIZE[GL_UNSIGNED_INT] =
    TYPE_SIZE[GL_FLOAT] =
    TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;

    function pixelSize (type, channels) {
      if (type === GL_UNSIGNED_SHORT_5_5_5_1 ||
          type === GL_UNSIGNED_SHORT_4_4_4_4 ||
          type === GL_UNSIGNED_SHORT_5_6_5) {
        return 2
      } else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
        return 4
      } else {
        return TYPE_SIZE[type] * channels
      }
    }

    function isPow2 (v) {
      return !(v & (v - 1)) && (!!v)
    }

    function checkTexture2D (info, mipData, limits) {
      var i;
      var w = mipData.width;
      var h = mipData.height;
      var c = mipData.channels;

      // Check texture shape
      check(w > 0 && w <= limits.maxTextureSize &&
            h > 0 && h <= limits.maxTextureSize,
      'invalid texture shape');

      // check wrap mode
      if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
        check(isPow2(w) && isPow2(h),
          'incompatible wrap mode for texture, both width and height must be power of 2');
      }

      if (mipData.mipmask === 1) {
        if (w !== 1 && h !== 1) {
          check(
            info.minFilter !== GL_NEAREST_MIPMAP_NEAREST &&
            info.minFilter !== GL_NEAREST_MIPMAP_LINEAR &&
            info.minFilter !== GL_LINEAR_MIPMAP_NEAREST &&
            info.minFilter !== GL_LINEAR_MIPMAP_LINEAR,
            'min filter requires mipmap');
        }
      } else {
        // texture must be power of 2
        check(isPow2(w) && isPow2(h),
          'texture must be a square power of 2 to support mipmapping');
        check(mipData.mipmask === (w << 1) - 1,
          'missing or incomplete mipmap data');
      }

      if (mipData.type === GL_FLOAT) {
        if (limits.extensions.indexOf('oes_texture_float_linear') < 0) {
          check(info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST,
            'filter not supported, must enable oes_texture_float_linear');
        }
        check(!info.genMipmaps,
          'mipmap generation not supported with float textures');
      }

      // check image complete
      var mipimages = mipData.images;
      for (i = 0; i < 16; ++i) {
        if (mipimages[i]) {
          var mw = w >> i;
          var mh = h >> i;
          check(mipData.mipmask & (1 << i), 'missing mipmap data');

          var img = mipimages[i];

          check(
            img.width === mw &&
            img.height === mh,
            'invalid shape for mip images');

          check(
            img.format === mipData.format &&
            img.internalformat === mipData.internalformat &&
            img.type === mipData.type,
            'incompatible type for mip image');

          if (img.compressed) ; else if (img.data) {
            // check(img.data.byteLength === mw * mh *
            // Math.max(pixelSize(img.type, c), img.unpackAlignment),
            var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
            check(img.data.byteLength === rowSize * mh,
              'invalid data for image, buffer size is inconsistent with image format');
          } else if (img.element) ; else if (img.copy) ;
        } else if (!info.genMipmaps) {
          check((mipData.mipmask & (1 << i)) === 0, 'extra mipmap data');
        }
      }

      if (mipData.compressed) {
        check(!info.genMipmaps,
          'mipmap generation for compressed images not supported');
      }
    }

    function checkTextureCube (texture, info, faces, limits) {
      var w = texture.width;
      var h = texture.height;
      var c = texture.channels;

      // Check texture shape
      check(
        w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
        'invalid texture shape');
      check(
        w === h,
        'cube map must be square');
      check(
        info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE,
        'wrap mode not supported by cube map');

      for (var i = 0; i < faces.length; ++i) {
        var face = faces[i];
        check(
          face.width === w && face.height === h,
          'inconsistent cube map face shape');

        if (info.genMipmaps) {
          check(!face.compressed,
            'can not generate mipmap for compressed textures');
          check(face.mipmask === 1,
            'can not specify mipmaps and generate mipmaps');
        }

        var mipmaps = face.images;
        for (var j = 0; j < 16; ++j) {
          var img = mipmaps[j];
          if (img) {
            var mw = w >> j;
            var mh = h >> j;
            check(face.mipmask & (1 << j), 'missing mipmap data');
            check(
              img.width === mw &&
              img.height === mh,
              'invalid shape for mip images');
            check(
              img.format === texture.format &&
              img.internalformat === texture.internalformat &&
              img.type === texture.type,
              'incompatible type for mip image');

            if (img.compressed) ; else if (img.data) {
              check(img.data.byteLength === mw * mh *
                Math.max(pixelSize(img.type, c), img.unpackAlignment),
              'invalid data for image, buffer size is inconsistent with image format');
            } else if (img.element) ; else if (img.copy) ;
          }
        }
      }
    }

    var check$1 = extend(check, {
      optional: checkOptional,
      raise: raise,
      commandRaise: commandRaise,
      command: checkCommand,
      parameter: checkParameter,
      commandParameter: checkParameterCommand,
      constructor: checkConstructor,
      type: checkTypeOf,
      commandType: checkCommandType,
      isTypedArray: checkIsTypedArray,
      nni: checkNonNegativeInt,
      oneOf: checkOneOf,
      shaderError: checkShaderError,
      linkError: checkLinkError,
      callSite: guessCallSite,
      saveCommandRef: saveCommandRef,
      saveDrawInfo: saveDrawCommandInfo,
      framebufferFormat: checkFramebufferFormat,
      guessCommand: guessCommand,
      texture2D: checkTexture2D,
      textureCube: checkTextureCube
    });

    var VARIABLE_COUNTER = 0;

    var DYN_FUNC = 0;
    var DYN_CONSTANT = 5;
    var DYN_ARRAY = 6;

    function DynamicVariable (type, data) {
      this.id = (VARIABLE_COUNTER++);
      this.type = type;
      this.data = data;
    }

    function escapeStr (str) {
      return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    }

    function splitParts (str) {
      if (str.length === 0) {
        return []
      }

      var firstChar = str.charAt(0);
      var lastChar = str.charAt(str.length - 1);

      if (str.length > 1 &&
          firstChar === lastChar &&
          (firstChar === '"' || firstChar === "'")) {
        return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"']
      }

      var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
      if (parts) {
        return (
          splitParts(str.substr(0, parts.index))
            .concat(splitParts(parts[1]))
            .concat(splitParts(str.substr(parts.index + parts[0].length)))
        )
      }

      var subparts = str.split('.');
      if (subparts.length === 1) {
        return ['"' + escapeStr(str) + '"']
      }

      var result = [];
      for (var i = 0; i < subparts.length; ++i) {
        result = result.concat(splitParts(subparts[i]));
      }
      return result
    }

    function toAccessorString (str) {
      return '[' + splitParts(str).join('][') + ']'
    }

    function defineDynamic (type, data) {
      return new DynamicVariable(type, toAccessorString(data + ''))
    }

    function isDynamic (x) {
      return (typeof x === 'function' && !x._reglType) || (x instanceof DynamicVariable)
    }

    function unbox (x, path) {
      if (typeof x === 'function') {
        return new DynamicVariable(DYN_FUNC, x)
      } else if (typeof x === 'number' || typeof x === 'boolean') {
        return new DynamicVariable(DYN_CONSTANT, x)
      } else if (Array.isArray(x)) {
        return new DynamicVariable(DYN_ARRAY, x.map(function (y, i) { return unbox(y, path + '[' + i + ']') }))
      } else if (x instanceof DynamicVariable) {
        return x
      }
      check$1(false, 'invalid option type in uniform ' + path);
    }

    var dynamic = {
      DynamicVariable: DynamicVariable,
      define: defineDynamic,
      isDynamic: isDynamic,
      unbox: unbox,
      accessor: toAccessorString
    };

    /* globals requestAnimationFrame, cancelAnimationFrame */
    var raf = {
      next: typeof requestAnimationFrame === 'function'
        ? function (cb) { return requestAnimationFrame(cb) }
        : function (cb) { return setTimeout(cb, 16) },
      cancel: typeof cancelAnimationFrame === 'function'
        ? function (raf) { return cancelAnimationFrame(raf) }
        : clearTimeout
    };

    /* globals performance */
    var clock = (typeof performance !== 'undefined' && performance.now)
        ? function () { return performance.now() }
        : function () { return +(new Date()) };

    function createStringStore () {
      var stringIds = { '': 0 };
      var stringValues = [''];
      return {
        id: function (str) {
          var result = stringIds[str];
          if (result) {
            return result
          }
          result = stringIds[str] = stringValues.length;
          stringValues.push(str);
          return result
        },

        str: function (id) {
          return stringValues[id]
        }
      }
    }

    // Context and canvas creation helper functions
    function createCanvas (element, onDone, pixelRatio) {
      var canvas = document.createElement('canvas');
      extend(canvas.style, {
        border: 0,
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      });
      element.appendChild(canvas);

      if (element === document.body) {
        canvas.style.position = 'absolute';
        extend(element.style, {
          margin: 0,
          padding: 0
        });
      }

      function resize () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        if (element !== document.body) {
          var bounds = canvas.getBoundingClientRect();
          w = bounds.right - bounds.left;
          h = bounds.bottom - bounds.top;
        }
        canvas.width = pixelRatio * w;
        canvas.height = pixelRatio * h;
      }

      var resizeObserver;
      if (element !== document.body && typeof ResizeObserver === 'function') {
        // ignore 'ResizeObserver' is not defined
        // eslint-disable-next-line
        resizeObserver = new ResizeObserver(function () {
          // setTimeout to avoid flicker
          setTimeout(resize);
        });
        resizeObserver.observe(element);
      } else {
        window.addEventListener('resize', resize, false);
      }

      function onDestroy () {
        if (resizeObserver) {
          resizeObserver.disconnect();
        } else {
          window.removeEventListener('resize', resize);
        }
        element.removeChild(canvas);
      }

      resize();

      return {
        canvas: canvas,
        onDestroy: onDestroy
      }
    }

    function createContext (canvas, contextAttributes) {
      function get (name) {
        try {
          return canvas.getContext(name, contextAttributes)
        } catch (e) {
          return null
        }
      }
      return (
        get('webgl') ||
        get('experimental-webgl') ||
        get('webgl-experimental')
      )
    }

    function isHTMLElement (obj) {
      return (
        typeof obj.nodeName === 'string' &&
        typeof obj.appendChild === 'function' &&
        typeof obj.getBoundingClientRect === 'function'
      )
    }

    function isWebGLContext (obj) {
      return (
        typeof obj.drawArrays === 'function' ||
        typeof obj.drawElements === 'function'
      )
    }

    function parseExtensions (input) {
      if (typeof input === 'string') {
        return input.split()
      }
      check$1(Array.isArray(input), 'invalid extension array');
      return input
    }

    function getElement (desc) {
      if (typeof desc === 'string') {
        check$1(typeof document !== 'undefined', 'not supported outside of DOM');
        return document.querySelector(desc)
      }
      return desc
    }

    function parseArgs (args_) {
      var args = args_ || {};
      var element, container, canvas, gl;
      var contextAttributes = {};
      var extensions = [];
      var optionalExtensions = [];
      var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
      var profile = false;
      var onDone = function (err) {
        if (err) {
          check$1.raise(err);
        }
      };
      var onDestroy = function () {};
      if (typeof args === 'string') {
        check$1(
          typeof document !== 'undefined',
          'selector queries only supported in DOM enviroments');
        element = document.querySelector(args);
        check$1(element, 'invalid query string for element');
      } else if (typeof args === 'object') {
        if (isHTMLElement(args)) {
          element = args;
        } else if (isWebGLContext(args)) {
          gl = args;
          canvas = gl.canvas;
        } else {
          check$1.constructor(args);
          if ('gl' in args) {
            gl = args.gl;
          } else if ('canvas' in args) {
            canvas = getElement(args.canvas);
          } else if ('container' in args) {
            container = getElement(args.container);
          }
          if ('attributes' in args) {
            contextAttributes = args.attributes;
            check$1.type(contextAttributes, 'object', 'invalid context attributes');
          }
          if ('extensions' in args) {
            extensions = parseExtensions(args.extensions);
          }
          if ('optionalExtensions' in args) {
            optionalExtensions = parseExtensions(args.optionalExtensions);
          }
          if ('onDone' in args) {
            check$1.type(
              args.onDone, 'function',
              'invalid or missing onDone callback');
            onDone = args.onDone;
          }
          if ('profile' in args) {
            profile = !!args.profile;
          }
          if ('pixelRatio' in args) {
            pixelRatio = +args.pixelRatio;
            check$1(pixelRatio > 0, 'invalid pixel ratio');
          }
        }
      } else {
        check$1.raise('invalid arguments to regl');
      }

      if (element) {
        if (element.nodeName.toLowerCase() === 'canvas') {
          canvas = element;
        } else {
          container = element;
        }
      }

      if (!gl) {
        if (!canvas) {
          check$1(
            typeof document !== 'undefined',
            'must manually specify webgl context outside of DOM environments');
          var result = createCanvas(container || document.body, onDone, pixelRatio);
          if (!result) {
            return null
          }
          canvas = result.canvas;
          onDestroy = result.onDestroy;
        }
        // workaround for chromium bug, premultiplied alpha value is platform dependent
        if (contextAttributes.premultipliedAlpha === undefined) contextAttributes.premultipliedAlpha = true;
        gl = createContext(canvas, contextAttributes);
      }

      if (!gl) {
        onDestroy();
        onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
        return null
      }

      return {
        gl: gl,
        canvas: canvas,
        container: container,
        extensions: extensions,
        optionalExtensions: optionalExtensions,
        pixelRatio: pixelRatio,
        profile: profile,
        onDone: onDone,
        onDestroy: onDestroy
      }
    }

    function createExtensionCache (gl, config) {
      var extensions = {};

      function tryLoadExtension (name_) {
        check$1.type(name_, 'string', 'extension name must be string');
        var name = name_.toLowerCase();
        var ext;
        try {
          ext = extensions[name] = gl.getExtension(name);
        } catch (e) {}
        return !!ext
      }

      for (var i = 0; i < config.extensions.length; ++i) {
        var name = config.extensions[i];
        if (!tryLoadExtension(name)) {
          config.onDestroy();
          config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
          return null
        }
      }

      config.optionalExtensions.forEach(tryLoadExtension);

      return {
        extensions: extensions,
        restore: function () {
          Object.keys(extensions).forEach(function (name) {
            if (extensions[name] && !tryLoadExtension(name)) {
              throw new Error('(regl): error restoring extension ' + name)
            }
          });
        }
      }
    }

    function loop (n, f) {
      var result = Array(n);
      for (var i = 0; i < n; ++i) {
        result[i] = f(i);
      }
      return result
    }

    var GL_BYTE$1 = 5120;
    var GL_UNSIGNED_BYTE$2 = 5121;
    var GL_SHORT$1 = 5122;
    var GL_UNSIGNED_SHORT$1 = 5123;
    var GL_INT$1 = 5124;
    var GL_UNSIGNED_INT$1 = 5125;
    var GL_FLOAT$2 = 5126;

    function nextPow16 (v) {
      for (var i = 16; i <= (1 << 28); i *= 16) {
        if (v <= i) {
          return i
        }
      }
      return 0
    }

    function log2 (v) {
      var r, shift;
      r = (v > 0xFFFF) << 4;
      v >>>= r;
      shift = (v > 0xFF) << 3;
      v >>>= shift; r |= shift;
      shift = (v > 0xF) << 2;
      v >>>= shift; r |= shift;
      shift = (v > 0x3) << 1;
      v >>>= shift; r |= shift;
      return r | (v >> 1)
    }

    function createPool () {
      var bufferPool = loop(8, function () {
        return []
      });

      function alloc (n) {
        var sz = nextPow16(n);
        var bin = bufferPool[log2(sz) >> 2];
        if (bin.length > 0) {
          return bin.pop()
        }
        return new ArrayBuffer(sz)
      }

      function free (buf) {
        bufferPool[log2(buf.byteLength) >> 2].push(buf);
      }

      function allocType (type, n) {
        var result = null;
        switch (type) {
          case GL_BYTE$1:
            result = new Int8Array(alloc(n), 0, n);
            break
          case GL_UNSIGNED_BYTE$2:
            result = new Uint8Array(alloc(n), 0, n);
            break
          case GL_SHORT$1:
            result = new Int16Array(alloc(2 * n), 0, n);
            break
          case GL_UNSIGNED_SHORT$1:
            result = new Uint16Array(alloc(2 * n), 0, n);
            break
          case GL_INT$1:
            result = new Int32Array(alloc(4 * n), 0, n);
            break
          case GL_UNSIGNED_INT$1:
            result = new Uint32Array(alloc(4 * n), 0, n);
            break
          case GL_FLOAT$2:
            result = new Float32Array(alloc(4 * n), 0, n);
            break
          default:
            return null
        }
        if (result.length !== n) {
          return result.subarray(0, n)
        }
        return result
      }

      function freeType (array) {
        free(array.buffer);
      }

      return {
        alloc: alloc,
        free: free,
        allocType: allocType,
        freeType: freeType
      }
    }

    var pool = createPool();

    // zero pool for initial zero data
    pool.zero = createPool();

    var GL_SUBPIXEL_BITS = 0x0D50;
    var GL_RED_BITS = 0x0D52;
    var GL_GREEN_BITS = 0x0D53;
    var GL_BLUE_BITS = 0x0D54;
    var GL_ALPHA_BITS = 0x0D55;
    var GL_DEPTH_BITS = 0x0D56;
    var GL_STENCIL_BITS = 0x0D57;

    var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
    var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;

    var GL_MAX_TEXTURE_SIZE = 0x0D33;
    var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
    var GL_MAX_VERTEX_ATTRIBS = 0x8869;
    var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
    var GL_MAX_VARYING_VECTORS = 0x8DFC;
    var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
    var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
    var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
    var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
    var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
    var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;

    var GL_VENDOR = 0x1F00;
    var GL_RENDERER = 0x1F01;
    var GL_VERSION = 0x1F02;
    var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;

    var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

    var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
    var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;

    var GL_TEXTURE_2D = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP = 0x8513;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
    var GL_TEXTURE0 = 0x84C0;
    var GL_RGBA = 0x1908;
    var GL_FLOAT$1 = 0x1406;
    var GL_UNSIGNED_BYTE$1 = 0x1401;
    var GL_FRAMEBUFFER = 0x8D40;
    var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
    var GL_COLOR_ATTACHMENT0 = 0x8CE0;
    var GL_COLOR_BUFFER_BIT$1 = 0x4000;

    var wrapLimits = function (gl, extensions) {
      var maxAnisotropic = 1;
      if (extensions.ext_texture_filter_anisotropic) {
        maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      }

      var maxDrawbuffers = 1;
      var maxColorAttachments = 1;
      if (extensions.webgl_draw_buffers) {
        maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
        maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
      }

      // detect if reading float textures is available (Safari doesn't support)
      var readFloat = !!extensions.oes_texture_float;
      if (readFloat) {
        var readFloatTexture = gl.createTexture();
        gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
        gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT$1, null);

        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
        gl.bindTexture(GL_TEXTURE_2D, null);

        if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) readFloat = false;

        else {
          gl.viewport(0, 0, 1, 1);
          gl.clearColor(1.0, 0.0, 0.0, 1.0);
          gl.clear(GL_COLOR_BUFFER_BIT$1);
          var pixels = pool.allocType(GL_FLOAT$1, 4);
          gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT$1, pixels);

          if (gl.getError()) readFloat = false;
          else {
            gl.deleteFramebuffer(fbo);
            gl.deleteTexture(readFloatTexture);

            readFloat = pixels[0] === 1.0;
          }

          pool.freeType(pixels);
        }
      }

      // detect non power of two cube textures support (IE doesn't support)
      var isIE = typeof navigator !== 'undefined' && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));

      var npotTextureCube = true;

      if (!isIE) {
        var cubeTexture = gl.createTexture();
        var data = pool.allocType(GL_UNSIGNED_BYTE$1, 36);
        gl.activeTexture(GL_TEXTURE0);
        gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
        gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE$1, data);
        pool.freeType(data);
        gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
        gl.deleteTexture(cubeTexture);
        npotTextureCube = !gl.getError();
      }

      return {
        // drawing buffer bit depth
        colorBits: [
          gl.getParameter(GL_RED_BITS),
          gl.getParameter(GL_GREEN_BITS),
          gl.getParameter(GL_BLUE_BITS),
          gl.getParameter(GL_ALPHA_BITS)
        ],
        depthBits: gl.getParameter(GL_DEPTH_BITS),
        stencilBits: gl.getParameter(GL_STENCIL_BITS),
        subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

        // supported extensions
        extensions: Object.keys(extensions).filter(function (ext) {
          return !!extensions[ext]
        }),

        // max aniso samples
        maxAnisotropic: maxAnisotropic,

        // max draw buffers
        maxDrawbuffers: maxDrawbuffers,
        maxColorAttachments: maxColorAttachments,

        // point and line size ranges
        pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
        lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
        maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
        maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
        maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
        maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
        maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
        maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
        maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
        maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
        maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
        maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

        // vendor info
        glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
        renderer: gl.getParameter(GL_RENDERER),
        vendor: gl.getParameter(GL_VENDOR),
        version: gl.getParameter(GL_VERSION),

        // quirks
        readFloat: readFloat,
        npotTextureCube: npotTextureCube
      }
    };

    function isNDArrayLike (obj) {
      return (
        !!obj &&
        typeof obj === 'object' &&
        Array.isArray(obj.shape) &&
        Array.isArray(obj.stride) &&
        typeof obj.offset === 'number' &&
        obj.shape.length === obj.stride.length &&
        (Array.isArray(obj.data) ||
          isTypedArray(obj.data)))
    }

    var values = function (obj) {
      return Object.keys(obj).map(function (key) { return obj[key] })
    };

    var flattenUtils = {
      shape: arrayShape$1,
      flatten: flattenArray
    };

    function flatten1D (array, nx, out) {
      for (var i = 0; i < nx; ++i) {
        out[i] = array[i];
      }
    }

    function flatten2D (array, nx, ny, out) {
      var ptr = 0;
      for (var i = 0; i < nx; ++i) {
        var row = array[i];
        for (var j = 0; j < ny; ++j) {
          out[ptr++] = row[j];
        }
      }
    }

    function flatten3D (array, nx, ny, nz, out, ptr_) {
      var ptr = ptr_;
      for (var i = 0; i < nx; ++i) {
        var row = array[i];
        for (var j = 0; j < ny; ++j) {
          var col = row[j];
          for (var k = 0; k < nz; ++k) {
            out[ptr++] = col[k];
          }
        }
      }
    }

    function flattenRec (array, shape, level, out, ptr) {
      var stride = 1;
      for (var i = level + 1; i < shape.length; ++i) {
        stride *= shape[i];
      }
      var n = shape[level];
      if (shape.length - level === 4) {
        var nx = shape[level + 1];
        var ny = shape[level + 2];
        var nz = shape[level + 3];
        for (i = 0; i < n; ++i) {
          flatten3D(array[i], nx, ny, nz, out, ptr);
          ptr += stride;
        }
      } else {
        for (i = 0; i < n; ++i) {
          flattenRec(array[i], shape, level + 1, out, ptr);
          ptr += stride;
        }
      }
    }

    function flattenArray (array, shape, type, out_) {
      var sz = 1;
      if (shape.length) {
        for (var i = 0; i < shape.length; ++i) {
          sz *= shape[i];
        }
      } else {
        sz = 0;
      }
      var out = out_ || pool.allocType(type, sz);
      switch (shape.length) {
        case 0:
          break
        case 1:
          flatten1D(array, shape[0], out);
          break
        case 2:
          flatten2D(array, shape[0], shape[1], out);
          break
        case 3:
          flatten3D(array, shape[0], shape[1], shape[2], out, 0);
          break
        default:
          flattenRec(array, shape, 0, out, 0);
      }
      return out
    }

    function arrayShape$1 (array_) {
      var shape = [];
      for (var array = array_; array.length; array = array[0]) {
        shape.push(array.length);
      }
      return shape
    }

    var arrayTypes =  {
    	"[object Int8Array]": 5120,
    	"[object Int16Array]": 5122,
    	"[object Int32Array]": 5124,
    	"[object Uint8Array]": 5121,
    	"[object Uint8ClampedArray]": 5121,
    	"[object Uint16Array]": 5123,
    	"[object Uint32Array]": 5125,
    	"[object Float32Array]": 5126,
    	"[object Float64Array]": 5121,
    	"[object ArrayBuffer]": 5121
    };

    var int8 = 5120;
    var int16 = 5122;
    var int32 = 5124;
    var uint8 = 5121;
    var uint16 = 5123;
    var uint32 = 5125;
    var float = 5126;
    var float32 = 5126;
    var glTypes = {
    	int8: int8,
    	int16: int16,
    	int32: int32,
    	uint8: uint8,
    	uint16: uint16,
    	uint32: uint32,
    	float: float,
    	float32: float32
    };

    var dynamic$1 = 35048;
    var stream = 35040;
    var usageTypes = {
    	dynamic: dynamic$1,
    	stream: stream,
    	"static": 35044
    };

    var arrayFlatten = flattenUtils.flatten;
    var arrayShape = flattenUtils.shape;

    var GL_STATIC_DRAW = 0x88E4;
    var GL_STREAM_DRAW = 0x88E0;

    var GL_UNSIGNED_BYTE$3 = 5121;
    var GL_FLOAT$3 = 5126;

    var DTYPES_SIZES = [];
    DTYPES_SIZES[5120] = 1; // int8
    DTYPES_SIZES[5122] = 2; // int16
    DTYPES_SIZES[5124] = 4; // int32
    DTYPES_SIZES[5121] = 1; // uint8
    DTYPES_SIZES[5123] = 2; // uint16
    DTYPES_SIZES[5125] = 4; // uint32
    DTYPES_SIZES[5126] = 4; // float32

    function typedArrayCode (data) {
      return arrayTypes[Object.prototype.toString.call(data)] | 0
    }

    function copyArray (out, inp) {
      for (var i = 0; i < inp.length; ++i) {
        out[i] = inp[i];
      }
    }

    function transpose (
      result, data, shapeX, shapeY, strideX, strideY, offset) {
      var ptr = 0;
      for (var i = 0; i < shapeX; ++i) {
        for (var j = 0; j < shapeY; ++j) {
          result[ptr++] = data[strideX * i + strideY * j + offset];
        }
      }
    }

    function wrapBufferState (gl, stats, config, destroyBuffer) {
      var bufferCount = 0;
      var bufferSet = {};

      function REGLBuffer (type) {
        this.id = bufferCount++;
        this.buffer = gl.createBuffer();
        this.type = type;
        this.usage = GL_STATIC_DRAW;
        this.byteLength = 0;
        this.dimension = 1;
        this.dtype = GL_UNSIGNED_BYTE$3;

        this.persistentData = null;

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      REGLBuffer.prototype.bind = function () {
        gl.bindBuffer(this.type, this.buffer);
      };

      REGLBuffer.prototype.destroy = function () {
        destroy(this);
      };

      var streamPool = [];

      function createStream (type, data) {
        var buffer = streamPool.pop();
        if (!buffer) {
          buffer = new REGLBuffer(type);
        }
        buffer.bind();
        initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
        return buffer
      }

      function destroyStream (stream$$1) {
        streamPool.push(stream$$1);
      }

      function initBufferFromTypedArray (buffer, data, usage) {
        buffer.byteLength = data.byteLength;
        gl.bufferData(buffer.type, data, usage);
      }

      function initBufferFromData (buffer, data, usage, dtype, dimension, persist) {
        var shape;
        buffer.usage = usage;
        if (Array.isArray(data)) {
          buffer.dtype = dtype || GL_FLOAT$3;
          if (data.length > 0) {
            var flatData;
            if (Array.isArray(data[0])) {
              shape = arrayShape(data);
              var dim = 1;
              for (var i = 1; i < shape.length; ++i) {
                dim *= shape[i];
              }
              buffer.dimension = dim;
              flatData = arrayFlatten(data, shape, buffer.dtype);
              initBufferFromTypedArray(buffer, flatData, usage);
              if (persist) {
                buffer.persistentData = flatData;
              } else {
                pool.freeType(flatData);
              }
            } else if (typeof data[0] === 'number') {
              buffer.dimension = dimension;
              var typedData = pool.allocType(buffer.dtype, data.length);
              copyArray(typedData, data);
              initBufferFromTypedArray(buffer, typedData, usage);
              if (persist) {
                buffer.persistentData = typedData;
              } else {
                pool.freeType(typedData);
              }
            } else if (isTypedArray(data[0])) {
              buffer.dimension = data[0].length;
              buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$3;
              flatData = arrayFlatten(
                data,
                [data.length, data[0].length],
                buffer.dtype);
              initBufferFromTypedArray(buffer, flatData, usage);
              if (persist) {
                buffer.persistentData = flatData;
              } else {
                pool.freeType(flatData);
              }
            } else {
              check$1.raise('invalid buffer data');
            }
          }
        } else if (isTypedArray(data)) {
          buffer.dtype = dtype || typedArrayCode(data);
          buffer.dimension = dimension;
          initBufferFromTypedArray(buffer, data, usage);
          if (persist) {
            buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
          }
        } else if (isNDArrayLike(data)) {
          shape = data.shape;
          var stride = data.stride;
          var offset = data.offset;

          var shapeX = 0;
          var shapeY = 0;
          var strideX = 0;
          var strideY = 0;
          if (shape.length === 1) {
            shapeX = shape[0];
            shapeY = 1;
            strideX = stride[0];
            strideY = 0;
          } else if (shape.length === 2) {
            shapeX = shape[0];
            shapeY = shape[1];
            strideX = stride[0];
            strideY = stride[1];
          } else {
            check$1.raise('invalid shape');
          }

          buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$3;
          buffer.dimension = shapeY;

          var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
          transpose(transposeData,
            data.data,
            shapeX, shapeY,
            strideX, strideY,
            offset);
          initBufferFromTypedArray(buffer, transposeData, usage);
          if (persist) {
            buffer.persistentData = transposeData;
          } else {
            pool.freeType(transposeData);
          }
        } else if (data instanceof ArrayBuffer) {
          buffer.dtype = GL_UNSIGNED_BYTE$3;
          buffer.dimension = dimension;
          initBufferFromTypedArray(buffer, data, usage);
          if (persist) {
            buffer.persistentData = new Uint8Array(new Uint8Array(data));
          }
        } else {
          check$1.raise('invalid buffer data');
        }
      }

      function destroy (buffer) {
        stats.bufferCount--;

        // remove attribute link
        destroyBuffer(buffer);

        var handle = buffer.buffer;
        check$1(handle, 'buffer must not be deleted already');
        gl.deleteBuffer(handle);
        buffer.buffer = null;
        delete bufferSet[buffer.id];
      }

      function createBuffer (options, type, deferInit, persistent) {
        stats.bufferCount++;

        var buffer = new REGLBuffer(type);
        bufferSet[buffer.id] = buffer;

        function reglBuffer (options) {
          var usage = GL_STATIC_DRAW;
          var data = null;
          var byteLength = 0;
          var dtype = 0;
          var dimension = 1;
          if (Array.isArray(options) ||
              isTypedArray(options) ||
              isNDArrayLike(options) ||
              options instanceof ArrayBuffer) {
            data = options;
          } else if (typeof options === 'number') {
            byteLength = options | 0;
          } else if (options) {
            check$1.type(
              options, 'object',
              'buffer arguments must be an object, a number or an array');

            if ('data' in options) {
              check$1(
                data === null ||
                Array.isArray(data) ||
                isTypedArray(data) ||
                isNDArrayLike(data),
                'invalid data for buffer');
              data = options.data;
            }

            if ('usage' in options) {
              check$1.parameter(options.usage, usageTypes, 'invalid buffer usage');
              usage = usageTypes[options.usage];
            }

            if ('type' in options) {
              check$1.parameter(options.type, glTypes, 'invalid buffer type');
              dtype = glTypes[options.type];
            }

            if ('dimension' in options) {
              check$1.type(options.dimension, 'number', 'invalid dimension');
              dimension = options.dimension | 0;
            }

            if ('length' in options) {
              check$1.nni(byteLength, 'buffer length must be a nonnegative integer');
              byteLength = options.length | 0;
            }
          }

          buffer.bind();
          if (!data) {
            // #475
            if (byteLength) gl.bufferData(buffer.type, byteLength, usage);
            buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
            buffer.usage = usage;
            buffer.dimension = dimension;
            buffer.byteLength = byteLength;
          } else {
            initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
          }

          if (config.profile) {
            buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
          }

          return reglBuffer
        }

        function setSubData (data, offset) {
          check$1(offset + data.byteLength <= buffer.byteLength,
            'invalid buffer subdata call, buffer is too small. ' + ' Can\'t write data of size ' + data.byteLength + ' starting from offset ' + offset + ' to a buffer of size ' + buffer.byteLength);

          gl.bufferSubData(buffer.type, offset, data);
        }

        function subdata (data, offset_) {
          var offset = (offset_ || 0) | 0;
          var shape;
          buffer.bind();
          if (isTypedArray(data) || data instanceof ArrayBuffer) {
            setSubData(data, offset);
          } else if (Array.isArray(data)) {
            if (data.length > 0) {
              if (typeof data[0] === 'number') {
                var converted = pool.allocType(buffer.dtype, data.length);
                copyArray(converted, data);
                setSubData(converted, offset);
                pool.freeType(converted);
              } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
                shape = arrayShape(data);
                var flatData = arrayFlatten(data, shape, buffer.dtype);
                setSubData(flatData, offset);
                pool.freeType(flatData);
              } else {
                check$1.raise('invalid buffer data');
              }
            }
          } else if (isNDArrayLike(data)) {
            shape = data.shape;
            var stride = data.stride;

            var shapeX = 0;
            var shapeY = 0;
            var strideX = 0;
            var strideY = 0;
            if (shape.length === 1) {
              shapeX = shape[0];
              shapeY = 1;
              strideX = stride[0];
              strideY = 0;
            } else if (shape.length === 2) {
              shapeX = shape[0];
              shapeY = shape[1];
              strideX = stride[0];
              strideY = stride[1];
            } else {
              check$1.raise('invalid shape');
            }
            var dtype = Array.isArray(data.data)
              ? buffer.dtype
              : typedArrayCode(data.data);

            var transposeData = pool.allocType(dtype, shapeX * shapeY);
            transpose(transposeData,
              data.data,
              shapeX, shapeY,
              strideX, strideY,
              data.offset);
            setSubData(transposeData, offset);
            pool.freeType(transposeData);
          } else {
            check$1.raise('invalid data for buffer subdata');
          }
          return reglBuffer
        }

        if (!deferInit) {
          reglBuffer(options);
        }

        reglBuffer._reglType = 'buffer';
        reglBuffer._buffer = buffer;
        reglBuffer.subdata = subdata;
        if (config.profile) {
          reglBuffer.stats = buffer.stats;
        }
        reglBuffer.destroy = function () { destroy(buffer); };

        return reglBuffer
      }

      function restoreBuffers () {
        values(bufferSet).forEach(function (buffer) {
          buffer.buffer = gl.createBuffer();
          gl.bindBuffer(buffer.type, buffer.buffer);
          gl.bufferData(
            buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
        });
      }

      if (config.profile) {
        stats.getTotalBufferSize = function () {
          var total = 0;
          // TODO: Right now, the streams are not part of the total count.
          Object.keys(bufferSet).forEach(function (key) {
            total += bufferSet[key].stats.size;
          });
          return total
        };
      }

      return {
        create: createBuffer,

        createStream: createStream,
        destroyStream: destroyStream,

        clear: function () {
          values(bufferSet).forEach(destroy);
          streamPool.forEach(destroy);
        },

        getBuffer: function (wrapper) {
          if (wrapper && wrapper._buffer instanceof REGLBuffer) {
            return wrapper._buffer
          }
          return null
        },

        restore: restoreBuffers,

        _initBuffer: initBufferFromData
      }
    }

    var points = 0;
    var point = 0;
    var lines = 1;
    var line = 1;
    var triangles = 4;
    var triangle = 4;
    var primTypes = {
    	points: points,
    	point: point,
    	lines: lines,
    	line: line,
    	triangles: triangles,
    	triangle: triangle,
    	"line loop": 2,
    	"line strip": 3,
    	"triangle strip": 5,
    	"triangle fan": 6
    };

    var GL_POINTS = 0;
    var GL_LINES = 1;
    var GL_TRIANGLES = 4;

    var GL_BYTE$2 = 5120;
    var GL_UNSIGNED_BYTE$4 = 5121;
    var GL_SHORT$2 = 5122;
    var GL_UNSIGNED_SHORT$2 = 5123;
    var GL_INT$2 = 5124;
    var GL_UNSIGNED_INT$2 = 5125;

    var GL_ELEMENT_ARRAY_BUFFER = 34963;

    var GL_STREAM_DRAW$1 = 0x88E0;
    var GL_STATIC_DRAW$1 = 0x88E4;

    function wrapElementsState (gl, extensions, bufferState, stats) {
      var elementSet = {};
      var elementCount = 0;

      var elementTypes = {
        'uint8': GL_UNSIGNED_BYTE$4,
        'uint16': GL_UNSIGNED_SHORT$2
      };

      if (extensions.oes_element_index_uint) {
        elementTypes.uint32 = GL_UNSIGNED_INT$2;
      }

      function REGLElementBuffer (buffer) {
        this.id = elementCount++;
        elementSet[this.id] = this;
        this.buffer = buffer;
        this.primType = GL_TRIANGLES;
        this.vertCount = 0;
        this.type = 0;
      }

      REGLElementBuffer.prototype.bind = function () {
        this.buffer.bind();
      };

      var bufferPool = [];

      function createElementStream (data) {
        var result = bufferPool.pop();
        if (!result) {
          result = new REGLElementBuffer(bufferState.create(
            null,
            GL_ELEMENT_ARRAY_BUFFER,
            true,
            false)._buffer);
        }
        initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
        return result
      }

      function destroyElementStream (elements) {
        bufferPool.push(elements);
      }

      function initElements (
        elements,
        data,
        usage,
        prim,
        count,
        byteLength,
        type) {
        elements.buffer.bind();
        var dtype;
        if (data) {
          var predictedType = type;
          if (!type && (
            !isTypedArray(data) ||
             (isNDArrayLike(data) && !isTypedArray(data.data)))) {
            predictedType = extensions.oes_element_index_uint
              ? GL_UNSIGNED_INT$2
              : GL_UNSIGNED_SHORT$2;
          }
          bufferState._initBuffer(
            elements.buffer,
            data,
            usage,
            predictedType,
            3);
        } else {
          gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
          elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$4;
          elements.buffer.usage = usage;
          elements.buffer.dimension = 3;
          elements.buffer.byteLength = byteLength;
        }

        dtype = type;
        if (!type) {
          switch (elements.buffer.dtype) {
            case GL_UNSIGNED_BYTE$4:
            case GL_BYTE$2:
              dtype = GL_UNSIGNED_BYTE$4;
              break

            case GL_UNSIGNED_SHORT$2:
            case GL_SHORT$2:
              dtype = GL_UNSIGNED_SHORT$2;
              break

            case GL_UNSIGNED_INT$2:
            case GL_INT$2:
              dtype = GL_UNSIGNED_INT$2;
              break

            default:
              check$1.raise('unsupported type for element array');
          }
          elements.buffer.dtype = dtype;
        }
        elements.type = dtype;

        // Check oes_element_index_uint extension
        check$1(
          dtype !== GL_UNSIGNED_INT$2 ||
          !!extensions.oes_element_index_uint,
          '32 bit element buffers not supported, enable oes_element_index_uint first');

        // try to guess default primitive type and arguments
        var vertCount = count;
        if (vertCount < 0) {
          vertCount = elements.buffer.byteLength;
          if (dtype === GL_UNSIGNED_SHORT$2) {
            vertCount >>= 1;
          } else if (dtype === GL_UNSIGNED_INT$2) {
            vertCount >>= 2;
          }
        }
        elements.vertCount = vertCount;

        // try to guess primitive type from cell dimension
        var primType = prim;
        if (prim < 0) {
          primType = GL_TRIANGLES;
          var dimension = elements.buffer.dimension;
          if (dimension === 1) primType = GL_POINTS;
          if (dimension === 2) primType = GL_LINES;
          if (dimension === 3) primType = GL_TRIANGLES;
        }
        elements.primType = primType;
      }

      function destroyElements (elements) {
        stats.elementsCount--;

        check$1(elements.buffer !== null, 'must not double destroy elements');
        delete elementSet[elements.id];
        elements.buffer.destroy();
        elements.buffer = null;
      }

      function createElements (options, persistent) {
        var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
        var elements = new REGLElementBuffer(buffer._buffer);
        stats.elementsCount++;

        function reglElements (options) {
          if (!options) {
            buffer();
            elements.primType = GL_TRIANGLES;
            elements.vertCount = 0;
            elements.type = GL_UNSIGNED_BYTE$4;
          } else if (typeof options === 'number') {
            buffer(options);
            elements.primType = GL_TRIANGLES;
            elements.vertCount = options | 0;
            elements.type = GL_UNSIGNED_BYTE$4;
          } else {
            var data = null;
            var usage = GL_STATIC_DRAW$1;
            var primType = -1;
            var vertCount = -1;
            var byteLength = 0;
            var dtype = 0;
            if (Array.isArray(options) ||
                isTypedArray(options) ||
                isNDArrayLike(options)) {
              data = options;
            } else {
              check$1.type(options, 'object', 'invalid arguments for elements');
              if ('data' in options) {
                data = options.data;
                check$1(
                  Array.isArray(data) ||
                    isTypedArray(data) ||
                    isNDArrayLike(data),
                  'invalid data for element buffer');
              }
              if ('usage' in options) {
                check$1.parameter(
                  options.usage,
                  usageTypes,
                  'invalid element buffer usage');
                usage = usageTypes[options.usage];
              }
              if ('primitive' in options) {
                check$1.parameter(
                  options.primitive,
                  primTypes,
                  'invalid element buffer primitive');
                primType = primTypes[options.primitive];
              }
              if ('count' in options) {
                check$1(
                  typeof options.count === 'number' && options.count >= 0,
                  'invalid vertex count for elements');
                vertCount = options.count | 0;
              }
              if ('type' in options) {
                check$1.parameter(
                  options.type,
                  elementTypes,
                  'invalid buffer type');
                dtype = elementTypes[options.type];
              }
              if ('length' in options) {
                byteLength = options.length | 0;
              } else {
                byteLength = vertCount;
                if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
                  byteLength *= 2;
                } else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
                  byteLength *= 4;
                }
              }
            }
            initElements(
              elements,
              data,
              usage,
              primType,
              vertCount,
              byteLength,
              dtype);
          }

          return reglElements
        }

        reglElements(options);

        reglElements._reglType = 'elements';
        reglElements._elements = elements;
        reglElements.subdata = function (data, offset) {
          buffer.subdata(data, offset);
          return reglElements
        };
        reglElements.destroy = function () {
          destroyElements(elements);
        };

        return reglElements
      }

      return {
        create: createElements,
        createStream: createElementStream,
        destroyStream: destroyElementStream,
        getElements: function (elements) {
          if (typeof elements === 'function' &&
              elements._elements instanceof REGLElementBuffer) {
            return elements._elements
          }
          return null
        },
        clear: function () {
          values(elementSet).forEach(destroyElements);
        }
      }
    }

    var FLOAT = new Float32Array(1);
    var INT = new Uint32Array(FLOAT.buffer);

    var GL_UNSIGNED_SHORT$4 = 5123;

    function convertToHalfFloat (array) {
      var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);

      for (var i = 0; i < array.length; ++i) {
        if (isNaN(array[i])) {
          ushorts[i] = 0xffff;
        } else if (array[i] === Infinity) {
          ushorts[i] = 0x7c00;
        } else if (array[i] === -Infinity) {
          ushorts[i] = 0xfc00;
        } else {
          FLOAT[0] = array[i];
          var x = INT[0];

          var sgn = (x >>> 31) << 15;
          var exp = ((x << 1) >>> 24) - 127;
          var frac = (x >> 13) & ((1 << 10) - 1);

          if (exp < -24) {
            // round non-representable denormals to 0
            ushorts[i] = sgn;
          } else if (exp < -14) {
            // handle denormals
            var s = -14 - exp;
            ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
          } else if (exp > 15) {
            // round overflow to +/- Infinity
            ushorts[i] = sgn + 0x7c00;
          } else {
            // otherwise convert directly
            ushorts[i] = sgn + ((exp + 15) << 10) + frac;
          }
        }
      }

      return ushorts
    }

    function isArrayLike (s) {
      return Array.isArray(s) || isTypedArray(s)
    }

    var isPow2$1 = function (v) {
      return !(v & (v - 1)) && (!!v)
    };

    var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;

    var GL_TEXTURE_2D$1 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP$1 = 0x8513;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;

    var GL_RGBA$1 = 0x1908;
    var GL_ALPHA = 0x1906;
    var GL_RGB = 0x1907;
    var GL_LUMINANCE = 0x1909;
    var GL_LUMINANCE_ALPHA = 0x190A;

    var GL_RGBA4 = 0x8056;
    var GL_RGB5_A1 = 0x8057;
    var GL_RGB565 = 0x8D62;

    var GL_UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
    var GL_UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
    var GL_UNSIGNED_SHORT_5_6_5$1 = 0x8363;
    var GL_UNSIGNED_INT_24_8_WEBGL$1 = 0x84FA;

    var GL_DEPTH_COMPONENT = 0x1902;
    var GL_DEPTH_STENCIL = 0x84F9;

    var GL_SRGB_EXT = 0x8C40;
    var GL_SRGB_ALPHA_EXT = 0x8C42;

    var GL_HALF_FLOAT_OES$1 = 0x8D61;

    var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
    var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
    var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
    var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

    var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
    var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
    var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;

    var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
    var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
    var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
    var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

    var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

    var GL_UNSIGNED_BYTE$5 = 0x1401;
    var GL_UNSIGNED_SHORT$3 = 0x1403;
    var GL_UNSIGNED_INT$3 = 0x1405;
    var GL_FLOAT$4 = 0x1406;

    var GL_TEXTURE_WRAP_S = 0x2802;
    var GL_TEXTURE_WRAP_T = 0x2803;

    var GL_REPEAT = 0x2901;
    var GL_CLAMP_TO_EDGE$1 = 0x812F;
    var GL_MIRRORED_REPEAT = 0x8370;

    var GL_TEXTURE_MAG_FILTER = 0x2800;
    var GL_TEXTURE_MIN_FILTER = 0x2801;

    var GL_NEAREST$1 = 0x2600;
    var GL_LINEAR = 0x2601;
    var GL_NEAREST_MIPMAP_NEAREST$1 = 0x2700;
    var GL_LINEAR_MIPMAP_NEAREST$1 = 0x2701;
    var GL_NEAREST_MIPMAP_LINEAR$1 = 0x2702;
    var GL_LINEAR_MIPMAP_LINEAR$1 = 0x2703;

    var GL_GENERATE_MIPMAP_HINT = 0x8192;
    var GL_DONT_CARE = 0x1100;
    var GL_FASTEST = 0x1101;
    var GL_NICEST = 0x1102;

    var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;

    var GL_UNPACK_ALIGNMENT = 0x0CF5;
    var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
    var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
    var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

    var GL_BROWSER_DEFAULT_WEBGL = 0x9244;

    var GL_TEXTURE0$1 = 0x84C0;

    var MIPMAP_FILTERS = [
      GL_NEAREST_MIPMAP_NEAREST$1,
      GL_NEAREST_MIPMAP_LINEAR$1,
      GL_LINEAR_MIPMAP_NEAREST$1,
      GL_LINEAR_MIPMAP_LINEAR$1
    ];

    var CHANNELS_FORMAT = [
      0,
      GL_LUMINANCE,
      GL_LUMINANCE_ALPHA,
      GL_RGB,
      GL_RGBA$1
    ];

    var FORMAT_CHANNELS = {};
    FORMAT_CHANNELS[GL_LUMINANCE] =
    FORMAT_CHANNELS[GL_ALPHA] =
    FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
    FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
    FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
    FORMAT_CHANNELS[GL_RGB] =
    FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
    FORMAT_CHANNELS[GL_RGBA$1] =
    FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;

    function objectName (str) {
      return '[object ' + str + ']'
    }

    var CANVAS_CLASS = objectName('HTMLCanvasElement');
    var OFFSCREENCANVAS_CLASS = objectName('OffscreenCanvas');
    var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
    var BITMAP_CLASS = objectName('ImageBitmap');
    var IMAGE_CLASS = objectName('HTMLImageElement');
    var VIDEO_CLASS = objectName('HTMLVideoElement');

    var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
      CANVAS_CLASS,
      OFFSCREENCANVAS_CLASS,
      CONTEXT2D_CLASS,
      BITMAP_CLASS,
      IMAGE_CLASS,
      VIDEO_CLASS
    ]);

    // for every texture type, store
    // the size in bytes.
    var TYPE_SIZES = [];
    TYPE_SIZES[GL_UNSIGNED_BYTE$5] = 1;
    TYPE_SIZES[GL_FLOAT$4] = 4;
    TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;

    TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
    TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;

    var FORMAT_SIZES_SPECIAL = [];
    FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
    FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
    FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
    FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;

    function isNumericArray (arr) {
      return (
        Array.isArray(arr) &&
        (arr.length === 0 ||
        typeof arr[0] === 'number'))
    }

    function isRectArray (arr) {
      if (!Array.isArray(arr)) {
        return false
      }
      var width = arr.length;
      if (width === 0 || !isArrayLike(arr[0])) {
        return false
      }
      return true
    }

    function classString (x) {
      return Object.prototype.toString.call(x)
    }

    function isCanvasElement (object) {
      return classString(object) === CANVAS_CLASS
    }

    function isOffscreenCanvas (object) {
      return classString(object) === OFFSCREENCANVAS_CLASS
    }

    function isContext2D (object) {
      return classString(object) === CONTEXT2D_CLASS
    }

    function isBitmap (object) {
      return classString(object) === BITMAP_CLASS
    }

    function isImageElement (object) {
      return classString(object) === IMAGE_CLASS
    }

    function isVideoElement (object) {
      return classString(object) === VIDEO_CLASS
    }

    function isPixelData (object) {
      if (!object) {
        return false
      }
      var className = classString(object);
      if (PIXEL_CLASSES.indexOf(className) >= 0) {
        return true
      }
      return (
        isNumericArray(object) ||
        isRectArray(object) ||
        isNDArrayLike(object))
    }

    function typedArrayCode$1 (data) {
      return arrayTypes[Object.prototype.toString.call(data)] | 0
    }

    function convertData (result, data) {
      var n = data.length;
      switch (result.type) {
        case GL_UNSIGNED_BYTE$5:
        case GL_UNSIGNED_SHORT$3:
        case GL_UNSIGNED_INT$3:
        case GL_FLOAT$4:
          var converted = pool.allocType(result.type, n);
          converted.set(data);
          result.data = converted;
          break

        case GL_HALF_FLOAT_OES$1:
          result.data = convertToHalfFloat(data);
          break

        default:
          check$1.raise('unsupported texture type, must specify a typed array');
      }
    }

    function preConvert (image, n) {
      return pool.allocType(
        image.type === GL_HALF_FLOAT_OES$1
          ? GL_FLOAT$4
          : image.type, n)
    }

    function postConvert (image, data) {
      if (image.type === GL_HALF_FLOAT_OES$1) {
        image.data = convertToHalfFloat(data);
        pool.freeType(data);
      } else {
        image.data = data;
      }
    }

    function transposeData (image, array, strideX, strideY, strideC, offset) {
      var w = image.width;
      var h = image.height;
      var c = image.channels;
      var n = w * h * c;
      var data = preConvert(image, n);

      var p = 0;
      for (var i = 0; i < h; ++i) {
        for (var j = 0; j < w; ++j) {
          for (var k = 0; k < c; ++k) {
            data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
          }
        }
      }

      postConvert(image, data);
    }

    function getTextureSize (format, type, width, height, isMipmap, isCube) {
      var s;
      if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
        // we have a special array for dealing with weird color formats such as RGB5A1
        s = FORMAT_SIZES_SPECIAL[format];
      } else {
        s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
      }

      if (isCube) {
        s *= 6;
      }

      if (isMipmap) {
        // compute the total size of all the mipmaps.
        var total = 0;

        var w = width;
        while (w >= 1) {
          // we can only use mipmaps on a square image,
          // so we can simply use the width and ignore the height:
          total += s * w * w;
          w /= 2;
        }
        return total
      } else {
        return s * width * height
      }
    }

    function createTextureSet (
      gl, extensions, limits, reglPoll, contextState, stats, config) {
      // -------------------------------------------------------
      // Initialize constants and parameter tables here
      // -------------------------------------------------------
      var mipmapHint = {
        "don't care": GL_DONT_CARE,
        'dont care': GL_DONT_CARE,
        'nice': GL_NICEST,
        'fast': GL_FASTEST
      };

      var wrapModes = {
        'repeat': GL_REPEAT,
        'clamp': GL_CLAMP_TO_EDGE$1,
        'mirror': GL_MIRRORED_REPEAT
      };

      var magFilters = {
        'nearest': GL_NEAREST$1,
        'linear': GL_LINEAR
      };

      var minFilters = extend({
        'mipmap': GL_LINEAR_MIPMAP_LINEAR$1,
        'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST$1,
        'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST$1,
        'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR$1,
        'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR$1
      }, magFilters);

      var colorSpace = {
        'none': 0,
        'browser': GL_BROWSER_DEFAULT_WEBGL
      };

      var textureTypes = {
        'uint8': GL_UNSIGNED_BYTE$5,
        'rgba4': GL_UNSIGNED_SHORT_4_4_4_4$1,
        'rgb565': GL_UNSIGNED_SHORT_5_6_5$1,
        'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1$1
      };

      var textureFormats = {
        'alpha': GL_ALPHA,
        'luminance': GL_LUMINANCE,
        'luminance alpha': GL_LUMINANCE_ALPHA,
        'rgb': GL_RGB,
        'rgba': GL_RGBA$1,
        'rgba4': GL_RGBA4,
        'rgb5 a1': GL_RGB5_A1,
        'rgb565': GL_RGB565
      };

      var compressedTextureFormats = {};

      if (extensions.ext_srgb) {
        textureFormats.srgb = GL_SRGB_EXT;
        textureFormats.srgba = GL_SRGB_ALPHA_EXT;
      }

      if (extensions.oes_texture_float) {
        textureTypes.float32 = textureTypes.float = GL_FLOAT$4;
      }

      if (extensions.oes_texture_half_float) {
        textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES$1;
      }

      if (extensions.webgl_depth_texture) {
        extend(textureFormats, {
          'depth': GL_DEPTH_COMPONENT,
          'depth stencil': GL_DEPTH_STENCIL
        });

        extend(textureTypes, {
          'uint16': GL_UNSIGNED_SHORT$3,
          'uint32': GL_UNSIGNED_INT$3,
          'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL$1
        });
      }

      if (extensions.webgl_compressed_texture_s3tc) {
        extend(compressedTextureFormats, {
          'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
          'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
          'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
          'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
        });
      }

      if (extensions.webgl_compressed_texture_atc) {
        extend(compressedTextureFormats, {
          'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
          'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
          'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
        });
      }

      if (extensions.webgl_compressed_texture_pvrtc) {
        extend(compressedTextureFormats, {
          'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
          'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
          'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
          'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
        });
      }

      if (extensions.webgl_compressed_texture_etc1) {
        compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
      }

      // Copy over all texture formats
      var supportedCompressedFormats = Array.prototype.slice.call(
        gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
      Object.keys(compressedTextureFormats).forEach(function (name) {
        var format = compressedTextureFormats[name];
        if (supportedCompressedFormats.indexOf(format) >= 0) {
          textureFormats[name] = format;
        }
      });

      var supportedFormats = Object.keys(textureFormats);
      limits.textureFormats = supportedFormats;

      // associate with every format string its
      // corresponding GL-value.
      var textureFormatsInvert = [];
      Object.keys(textureFormats).forEach(function (key) {
        var val = textureFormats[key];
        textureFormatsInvert[val] = key;
      });

      // associate with every type string its
      // corresponding GL-value.
      var textureTypesInvert = [];
      Object.keys(textureTypes).forEach(function (key) {
        var val = textureTypes[key];
        textureTypesInvert[val] = key;
      });

      var magFiltersInvert = [];
      Object.keys(magFilters).forEach(function (key) {
        var val = magFilters[key];
        magFiltersInvert[val] = key;
      });

      var minFiltersInvert = [];
      Object.keys(minFilters).forEach(function (key) {
        var val = minFilters[key];
        minFiltersInvert[val] = key;
      });

      var wrapModesInvert = [];
      Object.keys(wrapModes).forEach(function (key) {
        var val = wrapModes[key];
        wrapModesInvert[val] = key;
      });

      // colorFormats[] gives the format (channels) associated to an
      // internalformat
      var colorFormats = supportedFormats.reduce(function (color, key) {
        var glenum = textureFormats[key];
        if (glenum === GL_LUMINANCE ||
            glenum === GL_ALPHA ||
            glenum === GL_LUMINANCE ||
            glenum === GL_LUMINANCE_ALPHA ||
            glenum === GL_DEPTH_COMPONENT ||
            glenum === GL_DEPTH_STENCIL ||
            (extensions.ext_srgb &&
                    (glenum === GL_SRGB_EXT ||
                     glenum === GL_SRGB_ALPHA_EXT))) {
          color[glenum] = glenum;
        } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
          color[glenum] = GL_RGBA$1;
        } else {
          color[glenum] = GL_RGB;
        }
        return color
      }, {});

      function TexFlags () {
        // format info
        this.internalformat = GL_RGBA$1;
        this.format = GL_RGBA$1;
        this.type = GL_UNSIGNED_BYTE$5;
        this.compressed = false;

        // pixel storage
        this.premultiplyAlpha = false;
        this.flipY = false;
        this.unpackAlignment = 1;
        this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;

        // shape info
        this.width = 0;
        this.height = 0;
        this.channels = 0;
      }

      function copyFlags (result, other) {
        result.internalformat = other.internalformat;
        result.format = other.format;
        result.type = other.type;
        result.compressed = other.compressed;

        result.premultiplyAlpha = other.premultiplyAlpha;
        result.flipY = other.flipY;
        result.unpackAlignment = other.unpackAlignment;
        result.colorSpace = other.colorSpace;

        result.width = other.width;
        result.height = other.height;
        result.channels = other.channels;
      }

      function parseFlags (flags, options) {
        if (typeof options !== 'object' || !options) {
          return
        }

        if ('premultiplyAlpha' in options) {
          check$1.type(options.premultiplyAlpha, 'boolean',
            'invalid premultiplyAlpha');
          flags.premultiplyAlpha = options.premultiplyAlpha;
        }

        if ('flipY' in options) {
          check$1.type(options.flipY, 'boolean',
            'invalid texture flip');
          flags.flipY = options.flipY;
        }

        if ('alignment' in options) {
          check$1.oneOf(options.alignment, [1, 2, 4, 8],
            'invalid texture unpack alignment');
          flags.unpackAlignment = options.alignment;
        }

        if ('colorSpace' in options) {
          check$1.parameter(options.colorSpace, colorSpace,
            'invalid colorSpace');
          flags.colorSpace = colorSpace[options.colorSpace];
        }

        if ('type' in options) {
          var type = options.type;
          check$1(extensions.oes_texture_float ||
            !(type === 'float' || type === 'float32'),
          'you must enable the OES_texture_float extension in order to use floating point textures.');
          check$1(extensions.oes_texture_half_float ||
            !(type === 'half float' || type === 'float16'),
          'you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.');
          check$1(extensions.webgl_depth_texture ||
            !(type === 'uint16' || type === 'uint32' || type === 'depth stencil'),
          'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
          check$1.parameter(type, textureTypes,
            'invalid texture type');
          flags.type = textureTypes[type];
        }

        var w = flags.width;
        var h = flags.height;
        var c = flags.channels;
        var hasChannels = false;
        if ('shape' in options) {
          check$1(Array.isArray(options.shape) && options.shape.length >= 2,
            'shape must be an array');
          w = options.shape[0];
          h = options.shape[1];
          if (options.shape.length === 3) {
            c = options.shape[2];
            check$1(c > 0 && c <= 4, 'invalid number of channels');
            hasChannels = true;
          }
          check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
          check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
        } else {
          if ('radius' in options) {
            w = h = options.radius;
            check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid radius');
          }
          if ('width' in options) {
            w = options.width;
            check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
          }
          if ('height' in options) {
            h = options.height;
            check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
          }
          if ('channels' in options) {
            c = options.channels;
            check$1(c > 0 && c <= 4, 'invalid number of channels');
            hasChannels = true;
          }
        }
        flags.width = w | 0;
        flags.height = h | 0;
        flags.channels = c | 0;

        var hasFormat = false;
        if ('format' in options) {
          var formatStr = options.format;
          check$1(extensions.webgl_depth_texture ||
            !(formatStr === 'depth' || formatStr === 'depth stencil'),
          'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
          check$1.parameter(formatStr, textureFormats,
            'invalid texture format');
          var internalformat = flags.internalformat = textureFormats[formatStr];
          flags.format = colorFormats[internalformat];
          if (formatStr in textureTypes) {
            if (!('type' in options)) {
              flags.type = textureTypes[formatStr];
            }
          }
          if (formatStr in compressedTextureFormats) {
            flags.compressed = true;
          }
          hasFormat = true;
        }

        // Reconcile channels and format
        if (!hasChannels && hasFormat) {
          flags.channels = FORMAT_CHANNELS[flags.format];
        } else if (hasChannels && !hasFormat) {
          if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
            flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
          }
        } else if (hasFormat && hasChannels) {
          check$1(
            flags.channels === FORMAT_CHANNELS[flags.format],
            'number of channels inconsistent with specified format');
        }
      }

      function setFlags (flags) {
        gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
        gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
        gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
        gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
      }

      // -------------------------------------------------------
      // Tex image data
      // -------------------------------------------------------
      function TexImage () {
        TexFlags.call(this);

        this.xOffset = 0;
        this.yOffset = 0;

        // data
        this.data = null;
        this.needsFree = false;

        // html element
        this.element = null;

        // copyTexImage info
        this.needsCopy = false;
      }

      function parseImage (image, options) {
        var data = null;
        if (isPixelData(options)) {
          data = options;
        } else if (options) {
          check$1.type(options, 'object', 'invalid pixel data type');
          parseFlags(image, options);
          if ('x' in options) {
            image.xOffset = options.x | 0;
          }
          if ('y' in options) {
            image.yOffset = options.y | 0;
          }
          if (isPixelData(options.data)) {
            data = options.data;
          }
        }

        check$1(
          !image.compressed ||
          data instanceof Uint8Array,
          'compressed texture data must be stored in a uint8array');

        if (options.copy) {
          check$1(!data, 'can not specify copy and data field for the same texture');
          var viewW = contextState.viewportWidth;
          var viewH = contextState.viewportHeight;
          image.width = image.width || (viewW - image.xOffset);
          image.height = image.height || (viewH - image.yOffset);
          image.needsCopy = true;
          check$1(image.xOffset >= 0 && image.xOffset < viewW &&
                image.yOffset >= 0 && image.yOffset < viewH &&
                image.width > 0 && image.width <= viewW &&
                image.height > 0 && image.height <= viewH,
          'copy texture read out of bounds');
        } else if (!data) {
          image.width = image.width || 1;
          image.height = image.height || 1;
          image.channels = image.channels || 4;
        } else if (isTypedArray(data)) {
          image.channels = image.channels || 4;
          image.data = data;
          if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$5) {
            image.type = typedArrayCode$1(data);
          }
        } else if (isNumericArray(data)) {
          image.channels = image.channels || 4;
          convertData(image, data);
          image.alignment = 1;
          image.needsFree = true;
        } else if (isNDArrayLike(data)) {
          var array = data.data;
          if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$5) {
            image.type = typedArrayCode$1(array);
          }
          var shape = data.shape;
          var stride = data.stride;
          var shapeX, shapeY, shapeC, strideX, strideY, strideC;
          if (shape.length === 3) {
            shapeC = shape[2];
            strideC = stride[2];
          } else {
            check$1(shape.length === 2, 'invalid ndarray pixel data, must be 2 or 3D');
            shapeC = 1;
            strideC = 1;
          }
          shapeX = shape[0];
          shapeY = shape[1];
          strideX = stride[0];
          strideY = stride[1];
          image.alignment = 1;
          image.width = shapeX;
          image.height = shapeY;
          image.channels = shapeC;
          image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
          image.needsFree = true;
          transposeData(image, array, strideX, strideY, strideC, data.offset);
        } else if (isCanvasElement(data) || isOffscreenCanvas(data) || isContext2D(data)) {
          if (isCanvasElement(data) || isOffscreenCanvas(data)) {
            image.element = data;
          } else {
            image.element = data.canvas;
          }
          image.width = image.element.width;
          image.height = image.element.height;
          image.channels = 4;
        } else if (isBitmap(data)) {
          image.element = data;
          image.width = data.width;
          image.height = data.height;
          image.channels = 4;
        } else if (isImageElement(data)) {
          image.element = data;
          image.width = data.naturalWidth;
          image.height = data.naturalHeight;
          image.channels = 4;
        } else if (isVideoElement(data)) {
          image.element = data;
          image.width = data.videoWidth;
          image.height = data.videoHeight;
          image.channels = 4;
        } else if (isRectArray(data)) {
          var w = image.width || data[0].length;
          var h = image.height || data.length;
          var c = image.channels;
          if (isArrayLike(data[0][0])) {
            c = c || data[0][0].length;
          } else {
            c = c || 1;
          }
          var arrayShape = flattenUtils.shape(data);
          var n = 1;
          for (var dd = 0; dd < arrayShape.length; ++dd) {
            n *= arrayShape[dd];
          }
          var allocData = preConvert(image, n);
          flattenUtils.flatten(data, arrayShape, '', allocData);
          postConvert(image, allocData);
          image.alignment = 1;
          image.width = w;
          image.height = h;
          image.channels = c;
          image.format = image.internalformat = CHANNELS_FORMAT[c];
          image.needsFree = true;
        }

        if (image.type === GL_FLOAT$4) {
          check$1(limits.extensions.indexOf('oes_texture_float') >= 0,
            'oes_texture_float extension not enabled');
        } else if (image.type === GL_HALF_FLOAT_OES$1) {
          check$1(limits.extensions.indexOf('oes_texture_half_float') >= 0,
            'oes_texture_half_float extension not enabled');
        }

        // do compressed texture  validation here.
      }

      function setImage (info, target, miplevel) {
        var element = info.element;
        var data = info.data;
        var internalformat = info.internalformat;
        var format = info.format;
        var type = info.type;
        var width = info.width;
        var height = info.height;

        setFlags(info);

        if (element) {
          gl.texImage2D(target, miplevel, format, format, type, element);
        } else if (info.compressed) {
          gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
        } else if (info.needsCopy) {
          reglPoll();
          gl.copyTexImage2D(
            target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
        } else {
          gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data || null);
        }
      }

      function setSubImage (info, target, x, y, miplevel) {
        var element = info.element;
        var data = info.data;
        var internalformat = info.internalformat;
        var format = info.format;
        var type = info.type;
        var width = info.width;
        var height = info.height;

        setFlags(info);

        if (element) {
          gl.texSubImage2D(
            target, miplevel, x, y, format, type, element);
        } else if (info.compressed) {
          gl.compressedTexSubImage2D(
            target, miplevel, x, y, internalformat, width, height, data);
        } else if (info.needsCopy) {
          reglPoll();
          gl.copyTexSubImage2D(
            target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
        } else {
          gl.texSubImage2D(
            target, miplevel, x, y, width, height, format, type, data);
        }
      }

      // texImage pool
      var imagePool = [];

      function allocImage () {
        return imagePool.pop() || new TexImage()
      }

      function freeImage (image) {
        if (image.needsFree) {
          pool.freeType(image.data);
        }
        TexImage.call(image);
        imagePool.push(image);
      }

      // -------------------------------------------------------
      // Mip map
      // -------------------------------------------------------
      function MipMap () {
        TexFlags.call(this);

        this.genMipmaps = false;
        this.mipmapHint = GL_DONT_CARE;
        this.mipmask = 0;
        this.images = Array(16);
      }

      function parseMipMapFromShape (mipmap, width, height) {
        var img = mipmap.images[0] = allocImage();
        mipmap.mipmask = 1;
        img.width = mipmap.width = width;
        img.height = mipmap.height = height;
        img.channels = mipmap.channels = 4;
      }

      function parseMipMapFromObject (mipmap, options) {
        var imgData = null;
        if (isPixelData(options)) {
          imgData = mipmap.images[0] = allocImage();
          copyFlags(imgData, mipmap);
          parseImage(imgData, options);
          mipmap.mipmask = 1;
        } else {
          parseFlags(mipmap, options);
          if (Array.isArray(options.mipmap)) {
            var mipData = options.mipmap;
            for (var i = 0; i < mipData.length; ++i) {
              imgData = mipmap.images[i] = allocImage();
              copyFlags(imgData, mipmap);
              imgData.width >>= i;
              imgData.height >>= i;
              parseImage(imgData, mipData[i]);
              mipmap.mipmask |= (1 << i);
            }
          } else {
            imgData = mipmap.images[0] = allocImage();
            copyFlags(imgData, mipmap);
            parseImage(imgData, options);
            mipmap.mipmask = 1;
          }
        }
        copyFlags(mipmap, mipmap.images[0]);

        // For textures of the compressed format WEBGL_compressed_texture_s3tc
        // we must have that
        //
        // "When level equals zero width and height must be a multiple of 4.
        // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
        //
        // but we do not yet support having multiple mipmap levels for compressed textures,
        // so we only test for level zero.

        if (
          mipmap.compressed &&
          (
            mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
          )
        ) {
          check$1(mipmap.width % 4 === 0 && mipmap.height % 4 === 0,
            'for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4');
        }
      }

      function setMipMap (mipmap, target) {
        var images = mipmap.images;
        for (var i = 0; i < images.length; ++i) {
          if (!images[i]) {
            return
          }
          setImage(images[i], target, i);
        }
      }

      var mipPool = [];

      function allocMipMap () {
        var result = mipPool.pop() || new MipMap();
        TexFlags.call(result);
        result.mipmask = 0;
        for (var i = 0; i < 16; ++i) {
          result.images[i] = null;
        }
        return result
      }

      function freeMipMap (mipmap) {
        var images = mipmap.images;
        for (var i = 0; i < images.length; ++i) {
          if (images[i]) {
            freeImage(images[i]);
          }
          images[i] = null;
        }
        mipPool.push(mipmap);
      }

      // -------------------------------------------------------
      // Tex info
      // -------------------------------------------------------
      function TexInfo () {
        this.minFilter = GL_NEAREST$1;
        this.magFilter = GL_NEAREST$1;

        this.wrapS = GL_CLAMP_TO_EDGE$1;
        this.wrapT = GL_CLAMP_TO_EDGE$1;

        this.anisotropic = 1;

        this.genMipmaps = false;
        this.mipmapHint = GL_DONT_CARE;
      }

      function parseTexInfo (info, options) {
        if ('min' in options) {
          var minFilter = options.min;
          check$1.parameter(minFilter, minFilters);
          info.minFilter = minFilters[minFilter];
          if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !('faces' in options)) {
            info.genMipmaps = true;
          }
        }

        if ('mag' in options) {
          var magFilter = options.mag;
          check$1.parameter(magFilter, magFilters);
          info.magFilter = magFilters[magFilter];
        }

        var wrapS = info.wrapS;
        var wrapT = info.wrapT;
        if ('wrap' in options) {
          var wrap = options.wrap;
          if (typeof wrap === 'string') {
            check$1.parameter(wrap, wrapModes);
            wrapS = wrapT = wrapModes[wrap];
          } else if (Array.isArray(wrap)) {
            check$1.parameter(wrap[0], wrapModes);
            check$1.parameter(wrap[1], wrapModes);
            wrapS = wrapModes[wrap[0]];
            wrapT = wrapModes[wrap[1]];
          }
        } else {
          if ('wrapS' in options) {
            var optWrapS = options.wrapS;
            check$1.parameter(optWrapS, wrapModes);
            wrapS = wrapModes[optWrapS];
          }
          if ('wrapT' in options) {
            var optWrapT = options.wrapT;
            check$1.parameter(optWrapT, wrapModes);
            wrapT = wrapModes[optWrapT];
          }
        }
        info.wrapS = wrapS;
        info.wrapT = wrapT;

        if ('anisotropic' in options) {
          var anisotropic = options.anisotropic;
          check$1(typeof anisotropic === 'number' &&
             anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
          'aniso samples must be between 1 and ');
          info.anisotropic = options.anisotropic;
        }

        if ('mipmap' in options) {
          var hasMipMap = false;
          switch (typeof options.mipmap) {
            case 'string':
              check$1.parameter(options.mipmap, mipmapHint,
                'invalid mipmap hint');
              info.mipmapHint = mipmapHint[options.mipmap];
              info.genMipmaps = true;
              hasMipMap = true;
              break

            case 'boolean':
              hasMipMap = info.genMipmaps = options.mipmap;
              break

            case 'object':
              check$1(Array.isArray(options.mipmap), 'invalid mipmap type');
              info.genMipmaps = false;
              hasMipMap = true;
              break

            default:
              check$1.raise('invalid mipmap type');
          }
          if (hasMipMap && !('min' in options)) {
            info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
          }
        }
      }

      function setTexInfo (info, target) {
        gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
        gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
        gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
        gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
        if (extensions.ext_texture_filter_anisotropic) {
          gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
        }
        if (info.genMipmaps) {
          gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
          gl.generateMipmap(target);
        }
      }

      // -------------------------------------------------------
      // Full texture object
      // -------------------------------------------------------
      var textureCount = 0;
      var textureSet = {};
      var numTexUnits = limits.maxTextureUnits;
      var textureUnits = Array(numTexUnits).map(function () {
        return null
      });

      function REGLTexture (target) {
        TexFlags.call(this);
        this.mipmask = 0;
        this.internalformat = GL_RGBA$1;

        this.id = textureCount++;

        this.refCount = 1;

        this.target = target;
        this.texture = gl.createTexture();

        this.unit = -1;
        this.bindCount = 0;

        this.texInfo = new TexInfo();

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      function tempBind (texture) {
        gl.activeTexture(GL_TEXTURE0$1);
        gl.bindTexture(texture.target, texture.texture);
      }

      function tempRestore () {
        var prev = textureUnits[0];
        if (prev) {
          gl.bindTexture(prev.target, prev.texture);
        } else {
          gl.bindTexture(GL_TEXTURE_2D$1, null);
        }
      }

      function destroy (texture) {
        var handle = texture.texture;
        check$1(handle, 'must not double destroy texture');
        var unit = texture.unit;
        var target = texture.target;
        if (unit >= 0) {
          gl.activeTexture(GL_TEXTURE0$1 + unit);
          gl.bindTexture(target, null);
          textureUnits[unit] = null;
        }
        gl.deleteTexture(handle);
        texture.texture = null;
        texture.params = null;
        texture.pixels = null;
        texture.refCount = 0;
        delete textureSet[texture.id];
        stats.textureCount--;
      }

      extend(REGLTexture.prototype, {
        bind: function () {
          var texture = this;
          texture.bindCount += 1;
          var unit = texture.unit;
          if (unit < 0) {
            for (var i = 0; i < numTexUnits; ++i) {
              var other = textureUnits[i];
              if (other) {
                if (other.bindCount > 0) {
                  continue
                }
                other.unit = -1;
              }
              textureUnits[i] = texture;
              unit = i;
              break
            }
            if (unit >= numTexUnits) {
              check$1.raise('insufficient number of texture units');
            }
            if (config.profile && stats.maxTextureUnits < (unit + 1)) {
              stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
            }
            texture.unit = unit;
            gl.activeTexture(GL_TEXTURE0$1 + unit);
            gl.bindTexture(texture.target, texture.texture);
          }
          return unit
        },

        unbind: function () {
          this.bindCount -= 1;
        },

        decRef: function () {
          if (--this.refCount <= 0) {
            destroy(this);
          }
        }
      });

      function createTexture2D (a, b) {
        var texture = new REGLTexture(GL_TEXTURE_2D$1);
        textureSet[texture.id] = texture;
        stats.textureCount++;

        function reglTexture2D (a, b) {
          var texInfo = texture.texInfo;
          TexInfo.call(texInfo);
          var mipData = allocMipMap();

          if (typeof a === 'number') {
            if (typeof b === 'number') {
              parseMipMapFromShape(mipData, a | 0, b | 0);
            } else {
              parseMipMapFromShape(mipData, a | 0, a | 0);
            }
          } else if (a) {
            check$1.type(a, 'object', 'invalid arguments to regl.texture');
            parseTexInfo(texInfo, a);
            parseMipMapFromObject(mipData, a);
          } else {
            // empty textures get assigned a default shape of 1x1
            parseMipMapFromShape(mipData, 1, 1);
          }

          if (texInfo.genMipmaps) {
            mipData.mipmask = (mipData.width << 1) - 1;
          }
          texture.mipmask = mipData.mipmask;

          copyFlags(texture, mipData);

          check$1.texture2D(texInfo, mipData, limits);
          texture.internalformat = mipData.internalformat;

          reglTexture2D.width = mipData.width;
          reglTexture2D.height = mipData.height;

          tempBind(texture);
          setMipMap(mipData, GL_TEXTURE_2D$1);
          setTexInfo(texInfo, GL_TEXTURE_2D$1);
          tempRestore();

          freeMipMap(mipData);

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              mipData.width,
              mipData.height,
              texInfo.genMipmaps,
              false);
          }
          reglTexture2D.format = textureFormatsInvert[texture.internalformat];
          reglTexture2D.type = textureTypesInvert[texture.type];

          reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
          reglTexture2D.min = minFiltersInvert[texInfo.minFilter];

          reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
          reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];

          return reglTexture2D
        }

        function subimage (image, x_, y_, level_) {
          check$1(!!image, 'must specify image data');

          var x = x_ | 0;
          var y = y_ | 0;
          var level = level_ | 0;

          var imageData = allocImage();
          copyFlags(imageData, texture);
          imageData.width = 0;
          imageData.height = 0;
          parseImage(imageData, image);
          imageData.width = imageData.width || ((texture.width >> level) - x);
          imageData.height = imageData.height || ((texture.height >> level) - y);

          check$1(
            texture.type === imageData.type &&
            texture.format === imageData.format &&
            texture.internalformat === imageData.internalformat,
            'incompatible format for texture.subimage');
          check$1(
            x >= 0 && y >= 0 &&
            x + imageData.width <= texture.width &&
            y + imageData.height <= texture.height,
            'texture.subimage write out of bounds');
          check$1(
            texture.mipmask & (1 << level),
            'missing mipmap data');
          check$1(
            imageData.data || imageData.element || imageData.needsCopy,
            'missing image data');

          tempBind(texture);
          setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
          tempRestore();

          freeImage(imageData);

          return reglTexture2D
        }

        function resize (w_, h_) {
          var w = w_ | 0;
          var h = (h_ | 0) || w;
          if (w === texture.width && h === texture.height) {
            return reglTexture2D
          }

          reglTexture2D.width = texture.width = w;
          reglTexture2D.height = texture.height = h;

          tempBind(texture);

          for (var i = 0; texture.mipmask >> i; ++i) {
            var _w = w >> i;
            var _h = h >> i;
            if (!_w || !_h) break
            gl.texImage2D(
              GL_TEXTURE_2D$1,
              i,
              texture.format,
              _w,
              _h,
              0,
              texture.format,
              texture.type,
              null);
          }
          tempRestore();

          // also, recompute the texture size.
          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              w,
              h,
              false,
              false);
          }

          return reglTexture2D
        }

        reglTexture2D(a, b);

        reglTexture2D.subimage = subimage;
        reglTexture2D.resize = resize;
        reglTexture2D._reglType = 'texture2d';
        reglTexture2D._texture = texture;
        if (config.profile) {
          reglTexture2D.stats = texture.stats;
        }
        reglTexture2D.destroy = function () {
          texture.decRef();
        };

        return reglTexture2D
      }

      function createTextureCube (a0, a1, a2, a3, a4, a5) {
        var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
        textureSet[texture.id] = texture;
        stats.cubeCount++;

        var faces = new Array(6);

        function reglTextureCube (a0, a1, a2, a3, a4, a5) {
          var i;
          var texInfo = texture.texInfo;
          TexInfo.call(texInfo);
          for (i = 0; i < 6; ++i) {
            faces[i] = allocMipMap();
          }

          if (typeof a0 === 'number' || !a0) {
            var s = (a0 | 0) || 1;
            for (i = 0; i < 6; ++i) {
              parseMipMapFromShape(faces[i], s, s);
            }
          } else if (typeof a0 === 'object') {
            if (a1) {
              parseMipMapFromObject(faces[0], a0);
              parseMipMapFromObject(faces[1], a1);
              parseMipMapFromObject(faces[2], a2);
              parseMipMapFromObject(faces[3], a3);
              parseMipMapFromObject(faces[4], a4);
              parseMipMapFromObject(faces[5], a5);
            } else {
              parseTexInfo(texInfo, a0);
              parseFlags(texture, a0);
              if ('faces' in a0) {
                var faceInput = a0.faces;
                check$1(Array.isArray(faceInput) && faceInput.length === 6,
                  'cube faces must be a length 6 array');
                for (i = 0; i < 6; ++i) {
                  check$1(typeof faceInput[i] === 'object' && !!faceInput[i],
                    'invalid input for cube map face');
                  copyFlags(faces[i], texture);
                  parseMipMapFromObject(faces[i], faceInput[i]);
                }
              } else {
                for (i = 0; i < 6; ++i) {
                  parseMipMapFromObject(faces[i], a0);
                }
              }
            }
          } else {
            check$1.raise('invalid arguments to cube map');
          }

          copyFlags(texture, faces[0]);
          check$1.optional(function () {
            if (!limits.npotTextureCube) {
              check$1(isPow2$1(texture.width) && isPow2$1(texture.height), 'your browser does not support non power or two texture dimensions');
            }
          });

          if (texInfo.genMipmaps) {
            texture.mipmask = (faces[0].width << 1) - 1;
          } else {
            texture.mipmask = faces[0].mipmask;
          }

          check$1.textureCube(texture, texInfo, faces, limits);
          texture.internalformat = faces[0].internalformat;

          reglTextureCube.width = faces[0].width;
          reglTextureCube.height = faces[0].height;

          tempBind(texture);
          for (i = 0; i < 6; ++i) {
            setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
          }
          setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
          tempRestore();

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              reglTextureCube.width,
              reglTextureCube.height,
              texInfo.genMipmaps,
              true);
          }

          reglTextureCube.format = textureFormatsInvert[texture.internalformat];
          reglTextureCube.type = textureTypesInvert[texture.type];

          reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
          reglTextureCube.min = minFiltersInvert[texInfo.minFilter];

          reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
          reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];

          for (i = 0; i < 6; ++i) {
            freeMipMap(faces[i]);
          }

          return reglTextureCube
        }

        function subimage (face, image, x_, y_, level_) {
          check$1(!!image, 'must specify image data');
          check$1(typeof face === 'number' && face === (face | 0) &&
            face >= 0 && face < 6, 'invalid face');

          var x = x_ | 0;
          var y = y_ | 0;
          var level = level_ | 0;

          var imageData = allocImage();
          copyFlags(imageData, texture);
          imageData.width = 0;
          imageData.height = 0;
          parseImage(imageData, image);
          imageData.width = imageData.width || ((texture.width >> level) - x);
          imageData.height = imageData.height || ((texture.height >> level) - y);

          check$1(
            texture.type === imageData.type &&
            texture.format === imageData.format &&
            texture.internalformat === imageData.internalformat,
            'incompatible format for texture.subimage');
          check$1(
            x >= 0 && y >= 0 &&
            x + imageData.width <= texture.width &&
            y + imageData.height <= texture.height,
            'texture.subimage write out of bounds');
          check$1(
            texture.mipmask & (1 << level),
            'missing mipmap data');
          check$1(
            imageData.data || imageData.element || imageData.needsCopy,
            'missing image data');

          tempBind(texture);
          setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
          tempRestore();

          freeImage(imageData);

          return reglTextureCube
        }

        function resize (radius_) {
          var radius = radius_ | 0;
          if (radius === texture.width) {
            return
          }

          reglTextureCube.width = texture.width = radius;
          reglTextureCube.height = texture.height = radius;

          tempBind(texture);
          for (var i = 0; i < 6; ++i) {
            for (var j = 0; texture.mipmask >> j; ++j) {
              gl.texImage2D(
                GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i,
                j,
                texture.format,
                radius >> j,
                radius >> j,
                0,
                texture.format,
                texture.type,
                null);
            }
          }
          tempRestore();

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              reglTextureCube.width,
              reglTextureCube.height,
              false,
              true);
          }

          return reglTextureCube
        }

        reglTextureCube(a0, a1, a2, a3, a4, a5);

        reglTextureCube.subimage = subimage;
        reglTextureCube.resize = resize;
        reglTextureCube._reglType = 'textureCube';
        reglTextureCube._texture = texture;
        if (config.profile) {
          reglTextureCube.stats = texture.stats;
        }
        reglTextureCube.destroy = function () {
          texture.decRef();
        };

        return reglTextureCube
      }

      // Called when regl is destroyed
      function destroyTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          gl.activeTexture(GL_TEXTURE0$1 + i);
          gl.bindTexture(GL_TEXTURE_2D$1, null);
          textureUnits[i] = null;
        }
        values(textureSet).forEach(destroy);

        stats.cubeCount = 0;
        stats.textureCount = 0;
      }

      if (config.profile) {
        stats.getTotalTextureSize = function () {
          var total = 0;
          Object.keys(textureSet).forEach(function (key) {
            total += textureSet[key].stats.size;
          });
          return total
        };
      }

      function restoreTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          var tex = textureUnits[i];
          if (tex) {
            tex.bindCount = 0;
            tex.unit = -1;
            textureUnits[i] = null;
          }
        }

        values(textureSet).forEach(function (texture) {
          texture.texture = gl.createTexture();
          gl.bindTexture(texture.target, texture.texture);
          for (var i = 0; i < 32; ++i) {
            if ((texture.mipmask & (1 << i)) === 0) {
              continue
            }
            if (texture.target === GL_TEXTURE_2D$1) {
              gl.texImage2D(GL_TEXTURE_2D$1,
                i,
                texture.internalformat,
                texture.width >> i,
                texture.height >> i,
                0,
                texture.internalformat,
                texture.type,
                null);
            } else {
              for (var j = 0; j < 6; ++j) {
                gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j,
                  i,
                  texture.internalformat,
                  texture.width >> i,
                  texture.height >> i,
                  0,
                  texture.internalformat,
                  texture.type,
                  null);
              }
            }
          }
          setTexInfo(texture.texInfo, texture.target);
        });
      }

      function refreshTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          var tex = textureUnits[i];
          if (tex) {
            tex.bindCount = 0;
            tex.unit = -1;
            textureUnits[i] = null;
          }
          gl.activeTexture(GL_TEXTURE0$1 + i);
          gl.bindTexture(GL_TEXTURE_2D$1, null);
          gl.bindTexture(GL_TEXTURE_CUBE_MAP$1, null);
        }
      }

      return {
        create2D: createTexture2D,
        createCube: createTextureCube,
        clear: destroyTextures,
        getTexture: function (wrapper) {
          return null
        },
        restore: restoreTextures,
        refresh: refreshTextures
      }
    }

    var GL_RENDERBUFFER = 0x8D41;

    var GL_RGBA4$1 = 0x8056;
    var GL_RGB5_A1$1 = 0x8057;
    var GL_RGB565$1 = 0x8D62;
    var GL_DEPTH_COMPONENT16 = 0x81A5;
    var GL_STENCIL_INDEX8 = 0x8D48;
    var GL_DEPTH_STENCIL$1 = 0x84F9;

    var GL_SRGB8_ALPHA8_EXT = 0x8C43;

    var GL_RGBA32F_EXT = 0x8814;

    var GL_RGBA16F_EXT = 0x881A;
    var GL_RGB16F_EXT = 0x881B;

    var FORMAT_SIZES = [];

    FORMAT_SIZES[GL_RGBA4$1] = 2;
    FORMAT_SIZES[GL_RGB5_A1$1] = 2;
    FORMAT_SIZES[GL_RGB565$1] = 2;

    FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
    FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
    FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;

    FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
    FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
    FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
    FORMAT_SIZES[GL_RGB16F_EXT] = 6;

    function getRenderbufferSize (format, width, height) {
      return FORMAT_SIZES[format] * width * height
    }

    var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
      var formatTypes = {
        'rgba4': GL_RGBA4$1,
        'rgb565': GL_RGB565$1,
        'rgb5 a1': GL_RGB5_A1$1,
        'depth': GL_DEPTH_COMPONENT16,
        'stencil': GL_STENCIL_INDEX8,
        'depth stencil': GL_DEPTH_STENCIL$1
      };

      if (extensions.ext_srgb) {
        formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
      }

      if (extensions.ext_color_buffer_half_float) {
        formatTypes['rgba16f'] = GL_RGBA16F_EXT;
        formatTypes['rgb16f'] = GL_RGB16F_EXT;
      }

      if (extensions.webgl_color_buffer_float) {
        formatTypes['rgba32f'] = GL_RGBA32F_EXT;
      }

      var formatTypesInvert = [];
      Object.keys(formatTypes).forEach(function (key) {
        var val = formatTypes[key];
        formatTypesInvert[val] = key;
      });

      var renderbufferCount = 0;
      var renderbufferSet = {};

      function REGLRenderbuffer (renderbuffer) {
        this.id = renderbufferCount++;
        this.refCount = 1;

        this.renderbuffer = renderbuffer;

        this.format = GL_RGBA4$1;
        this.width = 0;
        this.height = 0;

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      REGLRenderbuffer.prototype.decRef = function () {
        if (--this.refCount <= 0) {
          destroy(this);
        }
      };

      function destroy (rb) {
        var handle = rb.renderbuffer;
        check$1(handle, 'must not double destroy renderbuffer');
        gl.bindRenderbuffer(GL_RENDERBUFFER, null);
        gl.deleteRenderbuffer(handle);
        rb.renderbuffer = null;
        rb.refCount = 0;
        delete renderbufferSet[rb.id];
        stats.renderbufferCount--;
      }

      function createRenderbuffer (a, b) {
        var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
        renderbufferSet[renderbuffer.id] = renderbuffer;
        stats.renderbufferCount++;

        function reglRenderbuffer (a, b) {
          var w = 0;
          var h = 0;
          var format = GL_RGBA4$1;

          if (typeof a === 'object' && a) {
            var options = a;
            if ('shape' in options) {
              var shape = options.shape;
              check$1(Array.isArray(shape) && shape.length >= 2,
                'invalid renderbuffer shape');
              w = shape[0] | 0;
              h = shape[1] | 0;
            } else {
              if ('radius' in options) {
                w = h = options.radius | 0;
              }
              if ('width' in options) {
                w = options.width | 0;
              }
              if ('height' in options) {
                h = options.height | 0;
              }
            }
            if ('format' in options) {
              check$1.parameter(options.format, formatTypes,
                'invalid renderbuffer format');
              format = formatTypes[options.format];
            }
          } else if (typeof a === 'number') {
            w = a | 0;
            if (typeof b === 'number') {
              h = b | 0;
            } else {
              h = w;
            }
          } else if (!a) {
            w = h = 1;
          } else {
            check$1.raise('invalid arguments to renderbuffer constructor');
          }

          // check shape
          check$1(
            w > 0 && h > 0 &&
            w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
            'invalid renderbuffer size');

          if (w === renderbuffer.width &&
              h === renderbuffer.height &&
              format === renderbuffer.format) {
            return
          }

          reglRenderbuffer.width = renderbuffer.width = w;
          reglRenderbuffer.height = renderbuffer.height = h;
          renderbuffer.format = format;

          gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);

          check$1(
            gl.getError() === 0,
            'invalid render buffer format');

          if (config.profile) {
            renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
          }
          reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];

          return reglRenderbuffer
        }

        function resize (w_, h_) {
          var w = w_ | 0;
          var h = (h_ | 0) || w;

          if (w === renderbuffer.width && h === renderbuffer.height) {
            return reglRenderbuffer
          }

          // check shape
          check$1(
            w > 0 && h > 0 &&
            w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
            'invalid renderbuffer size');

          reglRenderbuffer.width = renderbuffer.width = w;
          reglRenderbuffer.height = renderbuffer.height = h;

          gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);

          check$1(
            gl.getError() === 0,
            'invalid render buffer format');

          // also, recompute size.
          if (config.profile) {
            renderbuffer.stats.size = getRenderbufferSize(
              renderbuffer.format, renderbuffer.width, renderbuffer.height);
          }

          return reglRenderbuffer
        }

        reglRenderbuffer(a, b);

        reglRenderbuffer.resize = resize;
        reglRenderbuffer._reglType = 'renderbuffer';
        reglRenderbuffer._renderbuffer = renderbuffer;
        if (config.profile) {
          reglRenderbuffer.stats = renderbuffer.stats;
        }
        reglRenderbuffer.destroy = function () {
          renderbuffer.decRef();
        };

        return reglRenderbuffer
      }

      if (config.profile) {
        stats.getTotalRenderbufferSize = function () {
          var total = 0;
          Object.keys(renderbufferSet).forEach(function (key) {
            total += renderbufferSet[key].stats.size;
          });
          return total
        };
      }

      function restoreRenderbuffers () {
        values(renderbufferSet).forEach(function (rb) {
          rb.renderbuffer = gl.createRenderbuffer();
          gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
        });
        gl.bindRenderbuffer(GL_RENDERBUFFER, null);
      }

      return {
        create: createRenderbuffer,
        clear: function () {
          values(renderbufferSet).forEach(destroy);
        },
        restore: restoreRenderbuffers
      }
    };

    // We store these constants so that the minifier can inline them
    var GL_FRAMEBUFFER$1 = 0x8D40;
    var GL_RENDERBUFFER$1 = 0x8D41;

    var GL_TEXTURE_2D$2 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 0x8515;

    var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;
    var GL_DEPTH_ATTACHMENT = 0x8D00;
    var GL_STENCIL_ATTACHMENT = 0x8D20;
    var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

    var GL_FRAMEBUFFER_COMPLETE$1 = 0x8CD5;
    var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
    var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
    var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
    var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD;

    var GL_HALF_FLOAT_OES$2 = 0x8D61;
    var GL_UNSIGNED_BYTE$6 = 0x1401;
    var GL_FLOAT$5 = 0x1406;

    var GL_RGB$1 = 0x1907;
    var GL_RGBA$2 = 0x1908;

    var GL_DEPTH_COMPONENT$1 = 0x1902;

    var colorTextureFormatEnums = [
      GL_RGB$1,
      GL_RGBA$2
    ];

    // for every texture format, store
    // the number of channels
    var textureFormatChannels = [];
    textureFormatChannels[GL_RGBA$2] = 4;
    textureFormatChannels[GL_RGB$1] = 3;

    // for every texture type, store
    // the size in bytes.
    var textureTypeSizes = [];
    textureTypeSizes[GL_UNSIGNED_BYTE$6] = 1;
    textureTypeSizes[GL_FLOAT$5] = 4;
    textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;

    var GL_RGBA4$2 = 0x8056;
    var GL_RGB5_A1$2 = 0x8057;
    var GL_RGB565$2 = 0x8D62;
    var GL_DEPTH_COMPONENT16$1 = 0x81A5;
    var GL_STENCIL_INDEX8$1 = 0x8D48;
    var GL_DEPTH_STENCIL$2 = 0x84F9;

    var GL_SRGB8_ALPHA8_EXT$1 = 0x8C43;

    var GL_RGBA32F_EXT$1 = 0x8814;

    var GL_RGBA16F_EXT$1 = 0x881A;
    var GL_RGB16F_EXT$1 = 0x881B;

    var colorRenderbufferFormatEnums = [
      GL_RGBA4$2,
      GL_RGB5_A1$2,
      GL_RGB565$2,
      GL_SRGB8_ALPHA8_EXT$1,
      GL_RGBA16F_EXT$1,
      GL_RGB16F_EXT$1,
      GL_RGBA32F_EXT$1
    ];

    var statusCode = {};
    statusCode[GL_FRAMEBUFFER_COMPLETE$1] = 'complete';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment';
    statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported';

    function wrapFBOState (
      gl,
      extensions,
      limits,
      textureState,
      renderbufferState,
      stats) {
      var framebufferState = {
        cur: null,
        next: null,
        dirty: false,
        setFBO: null
      };

      var colorTextureFormats = ['rgba'];
      var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];

      if (extensions.ext_srgb) {
        colorRenderbufferFormats.push('srgba');
      }

      if (extensions.ext_color_buffer_half_float) {
        colorRenderbufferFormats.push('rgba16f', 'rgb16f');
      }

      if (extensions.webgl_color_buffer_float) {
        colorRenderbufferFormats.push('rgba32f');
      }

      var colorTypes = ['uint8'];
      if (extensions.oes_texture_half_float) {
        colorTypes.push('half float', 'float16');
      }
      if (extensions.oes_texture_float) {
        colorTypes.push('float', 'float32');
      }

      function FramebufferAttachment (target, texture, renderbuffer) {
        this.target = target;
        this.texture = texture;
        this.renderbuffer = renderbuffer;

        var w = 0;
        var h = 0;
        if (texture) {
          w = texture.width;
          h = texture.height;
        } else if (renderbuffer) {
          w = renderbuffer.width;
          h = renderbuffer.height;
        }
        this.width = w;
        this.height = h;
      }

      function decRef (attachment) {
        if (attachment) {
          if (attachment.texture) {
            attachment.texture._texture.decRef();
          }
          if (attachment.renderbuffer) {
            attachment.renderbuffer._renderbuffer.decRef();
          }
        }
      }

      function incRefAndCheckShape (attachment, width, height) {
        if (!attachment) {
          return
        }
        if (attachment.texture) {
          var texture = attachment.texture._texture;
          var tw = Math.max(1, texture.width);
          var th = Math.max(1, texture.height);
          check$1(tw === width && th === height,
            'inconsistent width/height for supplied texture');
          texture.refCount += 1;
        } else {
          var renderbuffer = attachment.renderbuffer._renderbuffer;
          check$1(
            renderbuffer.width === width && renderbuffer.height === height,
            'inconsistent width/height for renderbuffer');
          renderbuffer.refCount += 1;
        }
      }

      function attach (location, attachment) {
        if (attachment) {
          if (attachment.texture) {
            gl.framebufferTexture2D(
              GL_FRAMEBUFFER$1,
              location,
              attachment.target,
              attachment.texture._texture.texture,
              0);
          } else {
            gl.framebufferRenderbuffer(
              GL_FRAMEBUFFER$1,
              location,
              GL_RENDERBUFFER$1,
              attachment.renderbuffer._renderbuffer.renderbuffer);
          }
        }
      }

      function parseAttachment (attachment) {
        var target = GL_TEXTURE_2D$2;
        var texture = null;
        var renderbuffer = null;

        var data = attachment;
        if (typeof attachment === 'object') {
          data = attachment.data;
          if ('target' in attachment) {
            target = attachment.target | 0;
          }
        }

        check$1.type(data, 'function', 'invalid attachment data');

        var type = data._reglType;
        if (type === 'texture2d') {
          texture = data;
          check$1(target === GL_TEXTURE_2D$2);
        } else if (type === 'textureCube') {
          texture = data;
          check$1(
            target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 &&
            target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + 6,
            'invalid cube map target');
        } else if (type === 'renderbuffer') {
          renderbuffer = data;
          target = GL_RENDERBUFFER$1;
        } else {
          check$1.raise('invalid regl object for attachment');
        }

        return new FramebufferAttachment(target, texture, renderbuffer)
      }

      function allocAttachment (
        width,
        height,
        isTexture,
        format,
        type) {
        if (isTexture) {
          var texture = textureState.create2D({
            width: width,
            height: height,
            format: format,
            type: type
          });
          texture._texture.refCount = 0;
          return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null)
        } else {
          var rb = renderbufferState.create({
            width: width,
            height: height,
            format: format
          });
          rb._renderbuffer.refCount = 0;
          return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb)
        }
      }

      function unwrapAttachment (attachment) {
        return attachment && (attachment.texture || attachment.renderbuffer)
      }

      function resizeAttachment (attachment, w, h) {
        if (attachment) {
          if (attachment.texture) {
            attachment.texture.resize(w, h);
          } else if (attachment.renderbuffer) {
            attachment.renderbuffer.resize(w, h);
          }
          attachment.width = w;
          attachment.height = h;
        }
      }

      var framebufferCount = 0;
      var framebufferSet = {};

      function REGLFramebuffer () {
        this.id = framebufferCount++;
        framebufferSet[this.id] = this;

        this.framebuffer = gl.createFramebuffer();
        this.width = 0;
        this.height = 0;

        this.colorAttachments = [];
        this.depthAttachment = null;
        this.stencilAttachment = null;
        this.depthStencilAttachment = null;
      }

      function decFBORefs (framebuffer) {
        framebuffer.colorAttachments.forEach(decRef);
        decRef(framebuffer.depthAttachment);
        decRef(framebuffer.stencilAttachment);
        decRef(framebuffer.depthStencilAttachment);
      }

      function destroy (framebuffer) {
        var handle = framebuffer.framebuffer;
        check$1(handle, 'must not double destroy framebuffer');
        gl.deleteFramebuffer(handle);
        framebuffer.framebuffer = null;
        stats.framebufferCount--;
        delete framebufferSet[framebuffer.id];
      }

      function updateFramebuffer (framebuffer) {
        var i;

        gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
        var colorAttachments = framebuffer.colorAttachments;
        for (i = 0; i < colorAttachments.length; ++i) {
          attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
        }
        for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
          gl.framebufferTexture2D(
            GL_FRAMEBUFFER$1,
            GL_COLOR_ATTACHMENT0$1 + i,
            GL_TEXTURE_2D$2,
            null,
            0);
        }

        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_DEPTH_STENCIL_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_DEPTH_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_STENCIL_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);

        attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
        attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
        attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);

        // Check status code
        var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
        if (!gl.isContextLost() && status !== GL_FRAMEBUFFER_COMPLETE$1) {
          check$1.raise('framebuffer configuration not supported, status = ' +
            statusCode[status]);
        }

        gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
        framebufferState.cur = framebufferState.next;

        // FIXME: Clear error code here.  This is a work around for a bug in
        // headless-gl
        gl.getError();
      }

      function createFBO (a0, a1) {
        var framebuffer = new REGLFramebuffer();
        stats.framebufferCount++;

        function reglFramebuffer (a, b) {
          var i;

          check$1(framebufferState.next !== framebuffer,
            'can not update framebuffer which is currently in use');

          var width = 0;
          var height = 0;

          var needsDepth = true;
          var needsStencil = true;

          var colorBuffer = null;
          var colorTexture = true;
          var colorFormat = 'rgba';
          var colorType = 'uint8';
          var colorCount = 1;

          var depthBuffer = null;
          var stencilBuffer = null;
          var depthStencilBuffer = null;
          var depthStencilTexture = false;

          if (typeof a === 'number') {
            width = a | 0;
            height = (b | 0) || width;
          } else if (!a) {
            width = height = 1;
          } else {
            check$1.type(a, 'object', 'invalid arguments for framebuffer');
            var options = a;

            if ('shape' in options) {
              var shape = options.shape;
              check$1(Array.isArray(shape) && shape.length >= 2,
                'invalid shape for framebuffer');
              width = shape[0];
              height = shape[1];
            } else {
              if ('radius' in options) {
                width = height = options.radius;
              }
              if ('width' in options) {
                width = options.width;
              }
              if ('height' in options) {
                height = options.height;
              }
            }

            if ('color' in options ||
                'colors' in options) {
              colorBuffer =
                options.color ||
                options.colors;
              if (Array.isArray(colorBuffer)) {
                check$1(
                  colorBuffer.length === 1 || extensions.webgl_draw_buffers,
                  'multiple render targets not supported');
              }
            }

            if (!colorBuffer) {
              if ('colorCount' in options) {
                colorCount = options.colorCount | 0;
                check$1(colorCount > 0, 'invalid color buffer count');
              }

              if ('colorTexture' in options) {
                colorTexture = !!options.colorTexture;
                colorFormat = 'rgba4';
              }

              if ('colorType' in options) {
                colorType = options.colorType;
                if (!colorTexture) {
                  if (colorType === 'half float' || colorType === 'float16') {
                    check$1(extensions.ext_color_buffer_half_float,
                      'you must enable EXT_color_buffer_half_float to use 16-bit render buffers');
                    colorFormat = 'rgba16f';
                  } else if (colorType === 'float' || colorType === 'float32') {
                    check$1(extensions.webgl_color_buffer_float,
                      'you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers');
                    colorFormat = 'rgba32f';
                  }
                } else {
                  check$1(extensions.oes_texture_float ||
                    !(colorType === 'float' || colorType === 'float32'),
                  'you must enable OES_texture_float in order to use floating point framebuffer objects');
                  check$1(extensions.oes_texture_half_float ||
                    !(colorType === 'half float' || colorType === 'float16'),
                  'you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects');
                }
                check$1.oneOf(colorType, colorTypes, 'invalid color type');
              }

              if ('colorFormat' in options) {
                colorFormat = options.colorFormat;
                if (colorTextureFormats.indexOf(colorFormat) >= 0) {
                  colorTexture = true;
                } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
                  colorTexture = false;
                } else {
                  check$1.optional(function () {
                    if (colorTexture) {
                      check$1.oneOf(
                        options.colorFormat, colorTextureFormats,
                        'invalid color format for texture');
                    } else {
                      check$1.oneOf(
                        options.colorFormat, colorRenderbufferFormats,
                        'invalid color format for renderbuffer');
                    }
                  });
                }
              }
            }

            if ('depthTexture' in options || 'depthStencilTexture' in options) {
              depthStencilTexture = !!(options.depthTexture ||
                options.depthStencilTexture);
              check$1(!depthStencilTexture || extensions.webgl_depth_texture,
                'webgl_depth_texture extension not supported');
            }

            if ('depth' in options) {
              if (typeof options.depth === 'boolean') {
                needsDepth = options.depth;
              } else {
                depthBuffer = options.depth;
                needsStencil = false;
              }
            }

            if ('stencil' in options) {
              if (typeof options.stencil === 'boolean') {
                needsStencil = options.stencil;
              } else {
                stencilBuffer = options.stencil;
                needsDepth = false;
              }
            }

            if ('depthStencil' in options) {
              if (typeof options.depthStencil === 'boolean') {
                needsDepth = needsStencil = options.depthStencil;
              } else {
                depthStencilBuffer = options.depthStencil;
                needsDepth = false;
                needsStencil = false;
              }
            }
          }

          // parse attachments
          var colorAttachments = null;
          var depthAttachment = null;
          var stencilAttachment = null;
          var depthStencilAttachment = null;

          // Set up color attachments
          if (Array.isArray(colorBuffer)) {
            colorAttachments = colorBuffer.map(parseAttachment);
          } else if (colorBuffer) {
            colorAttachments = [parseAttachment(colorBuffer)];
          } else {
            colorAttachments = new Array(colorCount);
            for (i = 0; i < colorCount; ++i) {
              colorAttachments[i] = allocAttachment(
                width,
                height,
                colorTexture,
                colorFormat,
                colorType);
            }
          }

          check$1(extensions.webgl_draw_buffers || colorAttachments.length <= 1,
            'you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.');
          check$1(colorAttachments.length <= limits.maxColorAttachments,
            'too many color attachments, not supported');

          width = width || colorAttachments[0].width;
          height = height || colorAttachments[0].height;

          if (depthBuffer) {
            depthAttachment = parseAttachment(depthBuffer);
          } else if (needsDepth && !needsStencil) {
            depthAttachment = allocAttachment(
              width,
              height,
              depthStencilTexture,
              'depth',
              'uint32');
          }

          if (stencilBuffer) {
            stencilAttachment = parseAttachment(stencilBuffer);
          } else if (needsStencil && !needsDepth) {
            stencilAttachment = allocAttachment(
              width,
              height,
              false,
              'stencil',
              'uint8');
          }

          if (depthStencilBuffer) {
            depthStencilAttachment = parseAttachment(depthStencilBuffer);
          } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
            depthStencilAttachment = allocAttachment(
              width,
              height,
              depthStencilTexture,
              'depth stencil',
              'depth stencil');
          }

          check$1(
            (!!depthBuffer) + (!!stencilBuffer) + (!!depthStencilBuffer) <= 1,
            'invalid framebuffer configuration, can specify exactly one depth/stencil attachment');

          var commonColorAttachmentSize = null;

          for (i = 0; i < colorAttachments.length; ++i) {
            incRefAndCheckShape(colorAttachments[i], width, height);
            check$1(!colorAttachments[i] ||
              (colorAttachments[i].texture &&
                colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0) ||
              (colorAttachments[i].renderbuffer &&
                colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0),
            'framebuffer color attachment ' + i + ' is invalid');

            if (colorAttachments[i] && colorAttachments[i].texture) {
              var colorAttachmentSize =
                  textureFormatChannels[colorAttachments[i].texture._texture.format] *
                  textureTypeSizes[colorAttachments[i].texture._texture.type];

              if (commonColorAttachmentSize === null) {
                commonColorAttachmentSize = colorAttachmentSize;
              } else {
                // We need to make sure that all color attachments have the same number of bitplanes
                // (that is, the same numer of bits per pixel)
                // This is required by the GLES2.0 standard. See the beginning of Chapter 4 in that document.
                check$1(commonColorAttachmentSize === colorAttachmentSize,
                  'all color attachments much have the same number of bits per pixel.');
              }
            }
          }
          incRefAndCheckShape(depthAttachment, width, height);
          check$1(!depthAttachment ||
            (depthAttachment.texture &&
              depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1) ||
            (depthAttachment.renderbuffer &&
              depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1),
          'invalid depth attachment for framebuffer object');
          incRefAndCheckShape(stencilAttachment, width, height);
          check$1(!stencilAttachment ||
            (stencilAttachment.renderbuffer &&
              stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1),
          'invalid stencil attachment for framebuffer object');
          incRefAndCheckShape(depthStencilAttachment, width, height);
          check$1(!depthStencilAttachment ||
            (depthStencilAttachment.texture &&
              depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2) ||
            (depthStencilAttachment.renderbuffer &&
              depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2),
          'invalid depth-stencil attachment for framebuffer object');

          // decrement references
          decFBORefs(framebuffer);

          framebuffer.width = width;
          framebuffer.height = height;

          framebuffer.colorAttachments = colorAttachments;
          framebuffer.depthAttachment = depthAttachment;
          framebuffer.stencilAttachment = stencilAttachment;
          framebuffer.depthStencilAttachment = depthStencilAttachment;

          reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
          reglFramebuffer.depth = unwrapAttachment(depthAttachment);
          reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
          reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);

          reglFramebuffer.width = framebuffer.width;
          reglFramebuffer.height = framebuffer.height;

          updateFramebuffer(framebuffer);

          return reglFramebuffer
        }

        function resize (w_, h_) {
          check$1(framebufferState.next !== framebuffer,
            'can not resize a framebuffer which is currently in use');

          var w = Math.max(w_ | 0, 1);
          var h = Math.max((h_ | 0) || w, 1);
          if (w === framebuffer.width && h === framebuffer.height) {
            return reglFramebuffer
          }

          // resize all buffers
          var colorAttachments = framebuffer.colorAttachments;
          for (var i = 0; i < colorAttachments.length; ++i) {
            resizeAttachment(colorAttachments[i], w, h);
          }
          resizeAttachment(framebuffer.depthAttachment, w, h);
          resizeAttachment(framebuffer.stencilAttachment, w, h);
          resizeAttachment(framebuffer.depthStencilAttachment, w, h);

          framebuffer.width = reglFramebuffer.width = w;
          framebuffer.height = reglFramebuffer.height = h;

          updateFramebuffer(framebuffer);

          return reglFramebuffer
        }

        reglFramebuffer(a0, a1);

        return extend(reglFramebuffer, {
          resize: resize,
          _reglType: 'framebuffer',
          _framebuffer: framebuffer,
          destroy: function () {
            destroy(framebuffer);
            decFBORefs(framebuffer);
          },
          use: function (block) {
            framebufferState.setFBO({
              framebuffer: reglFramebuffer
            }, block);
          }
        })
      }

      function createCubeFBO (options) {
        var faces = Array(6);

        function reglFramebufferCube (a) {
          var i;

          check$1(faces.indexOf(framebufferState.next) < 0,
            'can not update framebuffer which is currently in use');

          var params = {
            color: null
          };

          var radius = 0;

          var colorBuffer = null;
          var colorFormat = 'rgba';
          var colorType = 'uint8';
          var colorCount = 1;

          if (typeof a === 'number') {
            radius = a | 0;
          } else if (!a) {
            radius = 1;
          } else {
            check$1.type(a, 'object', 'invalid arguments for framebuffer');
            var options = a;

            if ('shape' in options) {
              var shape = options.shape;
              check$1(
                Array.isArray(shape) && shape.length >= 2,
                'invalid shape for framebuffer');
              check$1(
                shape[0] === shape[1],
                'cube framebuffer must be square');
              radius = shape[0];
            } else {
              if ('radius' in options) {
                radius = options.radius | 0;
              }
              if ('width' in options) {
                radius = options.width | 0;
                if ('height' in options) {
                  check$1(options.height === radius, 'must be square');
                }
              } else if ('height' in options) {
                radius = options.height | 0;
              }
            }

            if ('color' in options ||
                'colors' in options) {
              colorBuffer =
                options.color ||
                options.colors;
              if (Array.isArray(colorBuffer)) {
                check$1(
                  colorBuffer.length === 1 || extensions.webgl_draw_buffers,
                  'multiple render targets not supported');
              }
            }

            if (!colorBuffer) {
              if ('colorCount' in options) {
                colorCount = options.colorCount | 0;
                check$1(colorCount > 0, 'invalid color buffer count');
              }

              if ('colorType' in options) {
                check$1.oneOf(
                  options.colorType, colorTypes,
                  'invalid color type');
                colorType = options.colorType;
              }

              if ('colorFormat' in options) {
                colorFormat = options.colorFormat;
                check$1.oneOf(
                  options.colorFormat, colorTextureFormats,
                  'invalid color format for texture');
              }
            }

            if ('depth' in options) {
              params.depth = options.depth;
            }

            if ('stencil' in options) {
              params.stencil = options.stencil;
            }

            if ('depthStencil' in options) {
              params.depthStencil = options.depthStencil;
            }
          }

          var colorCubes;
          if (colorBuffer) {
            if (Array.isArray(colorBuffer)) {
              colorCubes = [];
              for (i = 0; i < colorBuffer.length; ++i) {
                colorCubes[i] = colorBuffer[i];
              }
            } else {
              colorCubes = [ colorBuffer ];
            }
          } else {
            colorCubes = Array(colorCount);
            var cubeMapParams = {
              radius: radius,
              format: colorFormat,
              type: colorType
            };
            for (i = 0; i < colorCount; ++i) {
              colorCubes[i] = textureState.createCube(cubeMapParams);
            }
          }

          // Check color cubes
          params.color = Array(colorCubes.length);
          for (i = 0; i < colorCubes.length; ++i) {
            var cube = colorCubes[i];
            check$1(
              typeof cube === 'function' && cube._reglType === 'textureCube',
              'invalid cube map');
            radius = radius || cube.width;
            check$1(
              cube.width === radius && cube.height === radius,
              'invalid cube map shape');
            params.color[i] = {
              target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
              data: colorCubes[i]
            };
          }

          for (i = 0; i < 6; ++i) {
            for (var j = 0; j < colorCubes.length; ++j) {
              params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
            }
            // reuse depth-stencil attachments across all cube maps
            if (i > 0) {
              params.depth = faces[0].depth;
              params.stencil = faces[0].stencil;
              params.depthStencil = faces[0].depthStencil;
            }
            if (faces[i]) {
              (faces[i])(params);
            } else {
              faces[i] = createFBO(params);
            }
          }

          return extend(reglFramebufferCube, {
            width: radius,
            height: radius,
            color: colorCubes
          })
        }

        function resize (radius_) {
          var i;
          var radius = radius_ | 0;
          check$1(radius > 0 && radius <= limits.maxCubeMapSize,
            'invalid radius for cube fbo');

          if (radius === reglFramebufferCube.width) {
            return reglFramebufferCube
          }

          var colors = reglFramebufferCube.color;
          for (i = 0; i < colors.length; ++i) {
            colors[i].resize(radius);
          }

          for (i = 0; i < 6; ++i) {
            faces[i].resize(radius);
          }

          reglFramebufferCube.width = reglFramebufferCube.height = radius;

          return reglFramebufferCube
        }

        reglFramebufferCube(options);

        return extend(reglFramebufferCube, {
          faces: faces,
          resize: resize,
          _reglType: 'framebufferCube',
          destroy: function () {
            faces.forEach(function (f) {
              f.destroy();
            });
          }
        })
      }

      function restoreFramebuffers () {
        framebufferState.cur = null;
        framebufferState.next = null;
        framebufferState.dirty = true;
        values(framebufferSet).forEach(function (fb) {
          fb.framebuffer = gl.createFramebuffer();
          updateFramebuffer(fb);
        });
      }

      return extend(framebufferState, {
        getFramebuffer: function (object) {
          if (typeof object === 'function' && object._reglType === 'framebuffer') {
            var fbo = object._framebuffer;
            if (fbo instanceof REGLFramebuffer) {
              return fbo
            }
          }
          return null
        },
        create: createFBO,
        createCube: createCubeFBO,
        clear: function () {
          values(framebufferSet).forEach(destroy);
        },
        restore: restoreFramebuffers
      })
    }

    var GL_FLOAT$6 = 5126;
    var GL_ARRAY_BUFFER$1 = 34962;
    var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;

    var VAO_OPTIONS = [
      'attributes',
      'elements',
      'offset',
      'count',
      'primitive',
      'instances'
    ];

    function AttributeRecord () {
      this.state = 0;

      this.x = 0.0;
      this.y = 0.0;
      this.z = 0.0;
      this.w = 0.0;

      this.buffer = null;
      this.size = 0;
      this.normalized = false;
      this.type = GL_FLOAT$6;
      this.offset = 0;
      this.stride = 0;
      this.divisor = 0;
    }

    function wrapAttributeState (
      gl,
      extensions,
      limits,
      stats,
      bufferState,
      elementState,
      drawState) {
      var NUM_ATTRIBUTES = limits.maxAttributes;
      var attributeBindings = new Array(NUM_ATTRIBUTES);
      for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
        attributeBindings[i] = new AttributeRecord();
      }
      var vaoCount = 0;
      var vaoSet = {};

      var state = {
        Record: AttributeRecord,
        scope: {},
        state: attributeBindings,
        currentVAO: null,
        targetVAO: null,
        restore: extVAO() ? restoreVAO : function () {},
        createVAO: createVAO,
        getVAO: getVAO,
        destroyBuffer: destroyBuffer,
        setVAO: extVAO() ? setVAOEXT : setVAOEmulated,
        clear: extVAO() ? destroyVAOEXT : function () {}
      };

      function destroyBuffer (buffer) {
        for (var i = 0; i < attributeBindings.length; ++i) {
          var record = attributeBindings[i];
          if (record.buffer === buffer) {
            gl.disableVertexAttribArray(i);
            record.buffer = null;
          }
        }
      }

      function extVAO () {
        return extensions.oes_vertex_array_object
      }

      function extInstanced () {
        return extensions.angle_instanced_arrays
      }

      function getVAO (vao) {
        if (typeof vao === 'function' && vao._vao) {
          return vao._vao
        }
        return null
      }

      function setVAOEXT (vao) {
        if (vao === state.currentVAO) {
          return
        }
        var ext = extVAO();
        if (vao) {
          ext.bindVertexArrayOES(vao.vao);
        } else {
          ext.bindVertexArrayOES(null);
        }
        state.currentVAO = vao;
      }

      function setVAOEmulated (vao) {
        if (vao === state.currentVAO) {
          return
        }
        if (vao) {
          vao.bindAttrs();
        } else {
          var exti = extInstanced();
          for (var i = 0; i < attributeBindings.length; ++i) {
            var binding = attributeBindings[i];
            if (binding.buffer) {
              gl.enableVertexAttribArray(i);
              binding.buffer.bind();
              gl.vertexAttribPointer(i, binding.size, binding.type, binding.normalized, binding.stride, binding.offfset);
              if (exti && binding.divisor) {
                exti.vertexAttribDivisorANGLE(i, binding.divisor);
              }
            } else {
              gl.disableVertexAttribArray(i);
              gl.vertexAttrib4f(i, binding.x, binding.y, binding.z, binding.w);
            }
          }
          if (drawState.elements) {
            gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, drawState.elements.buffer.buffer);
          } else {
            gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
          }
        }
        state.currentVAO = vao;
      }

      function destroyVAOEXT () {
        values(vaoSet).forEach(function (vao) {
          vao.destroy();
        });
      }

      function REGLVAO () {
        this.id = ++vaoCount;
        this.attributes = [];
        this.elements = null;
        this.ownsElements = false;
        this.count = 0;
        this.offset = 0;
        this.instances = -1;
        this.primitive = 4;
        var extension = extVAO();
        if (extension) {
          this.vao = extension.createVertexArrayOES();
        } else {
          this.vao = null;
        }
        vaoSet[this.id] = this;
        this.buffers = [];
      }

      REGLVAO.prototype.bindAttrs = function () {
        var exti = extInstanced();
        var attributes = this.attributes;
        for (var i = 0; i < attributes.length; ++i) {
          var attr = attributes[i];
          if (attr.buffer) {
            gl.enableVertexAttribArray(i);
            gl.bindBuffer(GL_ARRAY_BUFFER$1, attr.buffer.buffer);
            gl.vertexAttribPointer(i, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);
            if (exti && attr.divisor) {
              exti.vertexAttribDivisorANGLE(i, attr.divisor);
            }
          } else {
            gl.disableVertexAttribArray(i);
            gl.vertexAttrib4f(i, attr.x, attr.y, attr.z, attr.w);
          }
        }
        for (var j = attributes.length; j < NUM_ATTRIBUTES; ++j) {
          gl.disableVertexAttribArray(j);
        }
        var elements = elementState.getElements(this.elements);
        if (elements) {
          gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, elements.buffer.buffer);
        } else {
          gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
        }
      };

      REGLVAO.prototype.refresh = function () {
        var ext = extVAO();
        if (ext) {
          ext.bindVertexArrayOES(this.vao);
          this.bindAttrs();
          state.currentVAO = null;
          ext.bindVertexArrayOES(null);
        }
      };

      REGLVAO.prototype.destroy = function () {
        if (this.vao) {
          var extension = extVAO();
          if (this === state.currentVAO) {
            state.currentVAO = null;
            extension.bindVertexArrayOES(null);
          }
          extension.deleteVertexArrayOES(this.vao);
          this.vao = null;
        }
        if (this.ownsElements) {
          this.elements.destroy();
          this.elements = null;
          this.ownsElements = false;
        }
        if (vaoSet[this.id]) {
          delete vaoSet[this.id];
          stats.vaoCount -= 1;
        }
      };

      function restoreVAO () {
        var ext = extVAO();
        if (ext) {
          values(vaoSet).forEach(function (vao) {
            vao.refresh();
          });
        }
      }

      function createVAO (_attr) {
        var vao = new REGLVAO();
        stats.vaoCount += 1;

        function updateVAO (options) {
          var attributes;
          if (Array.isArray(options)) {
            attributes = options;
            if (vao.elements && vao.ownsElements) {
              vao.elements.destroy();
            }
            vao.elements = null;
            vao.ownsElements = false;
            vao.offset = 0;
            vao.count = 0;
            vao.instances = -1;
            vao.primitive = 4;
          } else {
            check$1(typeof options === 'object', 'invalid arguments for create vao');
            check$1('attributes' in options, 'must specify attributes for vao');
            if (options.elements) {
              var elements = options.elements;
              if (vao.ownsElements) {
                if (typeof elements === 'function' && elements._reglType === 'elements') {
                  vao.elements.destroy();
                  vao.ownsElements = false;
                } else {
                  vao.elements(elements);
                  vao.ownsElements = false;
                }
              } else if (elementState.getElements(options.elements)) {
                vao.elements = options.elements;
                vao.ownsElements = false;
              } else {
                vao.elements = elementState.create(options.elements);
                vao.ownsElements = true;
              }
            } else {
              vao.elements = null;
              vao.ownsElements = false;
            }
            attributes = options.attributes;

            // set default vao
            vao.offset = 0;
            vao.count = -1;
            vao.instances = -1;
            vao.primitive = 4;

            // copy element properties
            if (vao.elements) {
              vao.count = vao.elements._elements.vertCount;
              vao.primitive = vao.elements._elements.primType;
            }

            if ('offset' in options) {
              vao.offset = options.offset | 0;
            }
            if ('count' in options) {
              vao.count = options.count | 0;
            }
            if ('instances' in options) {
              vao.instances = options.instances | 0;
            }
            if ('primitive' in options) {
              check$1(options.primitive in primTypes, 'bad primitive type: ' + options.primitive);
              vao.primitive = primTypes[options.primitive];
            }

            check$1.optional(() => {
              var keys = Object.keys(options);
              for (var i = 0; i < keys.length; ++i) {
                check$1(VAO_OPTIONS.indexOf(keys[i]) >= 0, 'invalid option for vao: "' + keys[i] + '" valid options are ' + VAO_OPTIONS);
              }
            });
            check$1(Array.isArray(attributes), 'attributes must be an array');
          }

          check$1(attributes.length < NUM_ATTRIBUTES, 'too many attributes');
          check$1(attributes.length > 0, 'must specify at least one attribute');

          var bufUpdated = {};
          var nattributes = vao.attributes;
          nattributes.length = attributes.length;
          for (var i = 0; i < attributes.length; ++i) {
            var spec = attributes[i];
            var rec = nattributes[i] = new AttributeRecord();
            var data = spec.data || spec;
            if (Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data)) {
              var buf;
              if (vao.buffers[i]) {
                buf = vao.buffers[i];
                if (isTypedArray(data) && buf._buffer.byteLength >= data.byteLength) {
                  buf.subdata(data);
                } else {
                  buf.destroy();
                  vao.buffers[i] = null;
                }
              }
              if (!vao.buffers[i]) {
                buf = vao.buffers[i] = bufferState.create(spec, GL_ARRAY_BUFFER$1, false, true);
              }
              rec.buffer = bufferState.getBuffer(buf);
              rec.size = rec.buffer.dimension | 0;
              rec.normalized = false;
              rec.type = rec.buffer.dtype;
              rec.offset = 0;
              rec.stride = 0;
              rec.divisor = 0;
              rec.state = 1;
              bufUpdated[i] = 1;
            } else if (bufferState.getBuffer(spec)) {
              rec.buffer = bufferState.getBuffer(spec);
              rec.size = rec.buffer.dimension | 0;
              rec.normalized = false;
              rec.type = rec.buffer.dtype;
              rec.offset = 0;
              rec.stride = 0;
              rec.divisor = 0;
              rec.state = 1;
            } else if (bufferState.getBuffer(spec.buffer)) {
              rec.buffer = bufferState.getBuffer(spec.buffer);
              rec.size = ((+spec.size) || rec.buffer.dimension) | 0;
              rec.normalized = !!spec.normalized || false;
              if ('type' in spec) {
                check$1.parameter(spec.type, glTypes, 'invalid buffer type');
                rec.type = glTypes[spec.type];
              } else {
                rec.type = rec.buffer.dtype;
              }
              rec.offset = (spec.offset || 0) | 0;
              rec.stride = (spec.stride || 0) | 0;
              rec.divisor = (spec.divisor || 0) | 0;
              rec.state = 1;

              check$1(rec.size >= 1 && rec.size <= 4, 'size must be between 1 and 4');
              check$1(rec.offset >= 0, 'invalid offset');
              check$1(rec.stride >= 0 && rec.stride <= 255, 'stride must be between 0 and 255');
              check$1(rec.divisor >= 0, 'divisor must be positive');
              check$1(!rec.divisor || !!extensions.angle_instanced_arrays, 'ANGLE_instanced_arrays must be enabled to use divisor');
            } else if ('x' in spec) {
              check$1(i > 0, 'first attribute must not be a constant');
              rec.x = +spec.x || 0;
              rec.y = +spec.y || 0;
              rec.z = +spec.z || 0;
              rec.w = +spec.w || 0;
              rec.state = 2;
            } else {
              check$1(false, 'invalid attribute spec for location ' + i);
            }
          }

          // retire unused buffers
          for (var j = 0; j < vao.buffers.length; ++j) {
            if (!bufUpdated[j] && vao.buffers[j]) {
              vao.buffers[j].destroy();
              vao.buffers[j] = null;
            }
          }

          vao.refresh();
          return updateVAO
        }

        updateVAO.destroy = function () {
          for (var j = 0; j < vao.buffers.length; ++j) {
            if (vao.buffers[j]) {
              vao.buffers[j].destroy();
            }
          }
          vao.buffers.length = 0;

          if (vao.ownsElements) {
            vao.elements.destroy();
            vao.elements = null;
            vao.ownsElements = false;
          }

          vao.destroy();
        };

        updateVAO._vao = vao;
        updateVAO._reglType = 'vao';

        return updateVAO(_attr)
      }

      return state
    }

    var GL_FRAGMENT_SHADER = 35632;
    var GL_VERTEX_SHADER = 35633;

    var GL_ACTIVE_UNIFORMS = 0x8B86;
    var GL_ACTIVE_ATTRIBUTES = 0x8B89;

    function wrapShaderState (gl, stringStore, stats, config) {
      // ===================================================
      // glsl compilation and linking
      // ===================================================
      var fragShaders = {};
      var vertShaders = {};

      function ActiveInfo (name, id, location, info) {
        this.name = name;
        this.id = id;
        this.location = location;
        this.info = info;
      }

      function insertActiveInfo (list, info) {
        for (var i = 0; i < list.length; ++i) {
          if (list[i].id === info.id) {
            list[i].location = info.location;
            return
          }
        }
        list.push(info);
      }

      function getShader (type, id, command) {
        var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
        var shader = cache[id];

        if (!shader) {
          var source = stringStore.str(id);
          shader = gl.createShader(type);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          check$1.shaderError(gl, shader, source, type, command);
          cache[id] = shader;
        }

        return shader
      }

      // ===================================================
      // program linking
      // ===================================================
      var programCache = {};
      var programList = [];

      var PROGRAM_COUNTER = 0;

      function REGLProgram (fragId, vertId) {
        this.id = PROGRAM_COUNTER++;
        this.fragId = fragId;
        this.vertId = vertId;
        this.program = null;
        this.uniforms = [];
        this.attributes = [];
        this.refCount = 1;

        if (config.profile) {
          this.stats = {
            uniformsCount: 0,
            attributesCount: 0
          };
        }
      }

      function linkProgram (desc, command, attributeLocations) {
        var i, info;

        // -------------------------------
        // compile & link
        // -------------------------------
        var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
        var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);

        var program = desc.program = gl.createProgram();
        gl.attachShader(program, fragShader);
        gl.attachShader(program, vertShader);
        if (attributeLocations) {
          for (i = 0; i < attributeLocations.length; ++i) {
            var binding = attributeLocations[i];
            gl.bindAttribLocation(program, binding[0], binding[1]);
          }
        }

        gl.linkProgram(program);
        check$1.linkError(
          gl,
          program,
          stringStore.str(desc.fragId),
          stringStore.str(desc.vertId),
          command);

        // -------------------------------
        // grab uniforms
        // -------------------------------
        var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
        if (config.profile) {
          desc.stats.uniformsCount = numUniforms;
        }
        var uniforms = desc.uniforms;
        for (i = 0; i < numUniforms; ++i) {
          info = gl.getActiveUniform(program, i);
          if (info) {
            if (info.size > 1) {
              for (var j = 0; j < info.size; ++j) {
                var name = info.name.replace('[0]', '[' + j + ']');
                insertActiveInfo(uniforms, new ActiveInfo(
                  name,
                  stringStore.id(name),
                  gl.getUniformLocation(program, name),
                  info));
              }
            }
            var uniName = info.name;
            if (info.size > 1) {
              uniName = uniName.replace('[0]', '');
            }
            insertActiveInfo(uniforms, new ActiveInfo(
              uniName,
              stringStore.id(uniName),
              gl.getUniformLocation(program, uniName),
              info));
          }
        }

        // -------------------------------
        // grab attributes
        // -------------------------------
        var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
        if (config.profile) {
          desc.stats.attributesCount = numAttributes;
        }

        var attributes = desc.attributes;
        for (i = 0; i < numAttributes; ++i) {
          info = gl.getActiveAttrib(program, i);
          if (info) {
            insertActiveInfo(attributes, new ActiveInfo(
              info.name,
              stringStore.id(info.name),
              gl.getAttribLocation(program, info.name),
              info));
          }
        }
      }

      if (config.profile) {
        stats.getMaxUniformsCount = function () {
          var m = 0;
          programList.forEach(function (desc) {
            if (desc.stats.uniformsCount > m) {
              m = desc.stats.uniformsCount;
            }
          });
          return m
        };

        stats.getMaxAttributesCount = function () {
          var m = 0;
          programList.forEach(function (desc) {
            if (desc.stats.attributesCount > m) {
              m = desc.stats.attributesCount;
            }
          });
          return m
        };
      }

      function restoreShaders () {
        fragShaders = {};
        vertShaders = {};
        for (var i = 0; i < programList.length; ++i) {
          linkProgram(programList[i], null, programList[i].attributes.map(function (info) {
            return [info.location, info.name]
          }));
        }
      }

      return {
        clear: function () {
          var deleteShader = gl.deleteShader.bind(gl);
          values(fragShaders).forEach(deleteShader);
          fragShaders = {};
          values(vertShaders).forEach(deleteShader);
          vertShaders = {};

          programList.forEach(function (desc) {
            gl.deleteProgram(desc.program);
          });
          programList.length = 0;
          programCache = {};

          stats.shaderCount = 0;
        },

        program: function (vertId, fragId, command, attribLocations) {
          check$1.command(vertId >= 0, 'missing vertex shader', command);
          check$1.command(fragId >= 0, 'missing fragment shader', command);

          var cache = programCache[fragId];
          if (!cache) {
            cache = programCache[fragId] = {};
          }
          var prevProgram = cache[vertId];
          if (prevProgram) {
            prevProgram.refCount++;
            if (!attribLocations) {
              return prevProgram
            }
          }
          var program = new REGLProgram(fragId, vertId);
          stats.shaderCount++;
          linkProgram(program, command, attribLocations);
          if (!prevProgram) {
            cache[vertId] = program;
          }
          programList.push(program);
          return extend(program, {
            destroy: function () {
              program.refCount--;
              if (program.refCount <= 0) {
                gl.deleteProgram(program.program);
                var idx = programList.indexOf(program);
                programList.splice(idx, 1);
                stats.shaderCount--;
              }
              // no program is linked to this vert anymore
              if (cache[program.vertId].refCount <= 0) {
                gl.deleteShader(vertShaders[program.vertId]);
                delete vertShaders[program.vertId];
                delete programCache[program.fragId][program.vertId];
              }
              // no program is linked to this frag anymore
              if (!Object.keys(programCache[program.fragId]).length) {
                gl.deleteShader(fragShaders[program.fragId]);
                delete fragShaders[program.fragId];
                delete programCache[program.fragId];
              }
            }
          })
        },

        restore: restoreShaders,

        shader: getShader,

        frag: -1,
        vert: -1
      }
    }

    var GL_RGBA$3 = 6408;
    var GL_UNSIGNED_BYTE$7 = 5121;
    var GL_PACK_ALIGNMENT = 0x0D05;
    var GL_FLOAT$7 = 0x1406; // 5126

    function wrapReadPixels (
      gl,
      framebufferState,
      reglPoll,
      context,
      glAttributes,
      extensions,
      limits) {
      function readPixelsImpl (input) {
        var type;
        if (framebufferState.next === null) {
          check$1(
            glAttributes.preserveDrawingBuffer,
            'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
          type = GL_UNSIGNED_BYTE$7;
        } else {
          check$1(
            framebufferState.next.colorAttachments[0].texture !== null,
            'You cannot read from a renderbuffer');
          type = framebufferState.next.colorAttachments[0].texture._texture.type;

          check$1.optional(function () {
            if (extensions.oes_texture_float) {
              check$1(
                type === GL_UNSIGNED_BYTE$7 || type === GL_FLOAT$7,
                'Reading from a framebuffer is only allowed for the types \'uint8\' and \'float\'');

              if (type === GL_FLOAT$7) {
                check$1(limits.readFloat, 'Reading \'float\' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float');
              }
            } else {
              check$1(
                type === GL_UNSIGNED_BYTE$7,
                'Reading from a framebuffer is only allowed for the type \'uint8\'');
            }
          });
        }

        var x = 0;
        var y = 0;
        var width = context.framebufferWidth;
        var height = context.framebufferHeight;
        var data = null;

        if (isTypedArray(input)) {
          data = input;
        } else if (input) {
          check$1.type(input, 'object', 'invalid arguments to regl.read()');
          x = input.x | 0;
          y = input.y | 0;
          check$1(
            x >= 0 && x < context.framebufferWidth,
            'invalid x offset for regl.read');
          check$1(
            y >= 0 && y < context.framebufferHeight,
            'invalid y offset for regl.read');
          width = (input.width || (context.framebufferWidth - x)) | 0;
          height = (input.height || (context.framebufferHeight - y)) | 0;
          data = input.data || null;
        }

        // sanity check input.data
        if (data) {
          if (type === GL_UNSIGNED_BYTE$7) {
            check$1(
              data instanceof Uint8Array,
              'buffer must be \'Uint8Array\' when reading from a framebuffer of type \'uint8\'');
          } else if (type === GL_FLOAT$7) {
            check$1(
              data instanceof Float32Array,
              'buffer must be \'Float32Array\' when reading from a framebuffer of type \'float\'');
          }
        }

        check$1(
          width > 0 && width + x <= context.framebufferWidth,
          'invalid width for read pixels');
        check$1(
          height > 0 && height + y <= context.framebufferHeight,
          'invalid height for read pixels');

        // Update WebGL state
        reglPoll();

        // Compute size
        var size = width * height * 4;

        // Allocate data
        if (!data) {
          if (type === GL_UNSIGNED_BYTE$7) {
            data = new Uint8Array(size);
          } else if (type === GL_FLOAT$7) {
            data = data || new Float32Array(size);
          }
        }

        // Type check
        check$1.isTypedArray(data, 'data buffer for regl.read() must be a typedarray');
        check$1(data.byteLength >= size, 'data buffer for regl.read() too small');

        // Run read pixels
        gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
        gl.readPixels(x, y, width, height, GL_RGBA$3,
          type,
          data);

        return data
      }

      function readPixelsFBO (options) {
        var result;
        framebufferState.setFBO({
          framebuffer: options.framebuffer
        }, function () {
          result = readPixelsImpl(options);
        });
        return result
      }

      function readPixels (options) {
        if (!options || !('framebuffer' in options)) {
          return readPixelsImpl(options)
        } else {
          return readPixelsFBO(options)
        }
      }

      return readPixels
    }

    function slice (x) {
      return Array.prototype.slice.call(x)
    }

    function join (x) {
      return slice(x).join('')
    }

    function createEnvironment () {
      // Unique variable id counter
      var varCounter = 0;

      // Linked values are passed from this scope into the generated code block
      // Calling link() passes a value into the generated scope and returns
      // the variable name which it is bound to
      var linkedNames = [];
      var linkedValues = [];
      function link (value) {
        for (var i = 0; i < linkedValues.length; ++i) {
          if (linkedValues[i] === value) {
            return linkedNames[i]
          }
        }

        var name = 'g' + (varCounter++);
        linkedNames.push(name);
        linkedValues.push(value);
        return name
      }

      // create a code block
      function block () {
        var code = [];
        function push () {
          code.push.apply(code, slice(arguments));
        }

        var vars = [];
        function def () {
          var name = 'v' + (varCounter++);
          vars.push(name);

          if (arguments.length > 0) {
            code.push(name, '=');
            code.push.apply(code, slice(arguments));
            code.push(';');
          }

          return name
        }

        return extend(push, {
          def: def,
          toString: function () {
            return join([
              (vars.length > 0 ? 'var ' + vars.join(',') + ';' : ''),
              join(code)
            ])
          }
        })
      }

      function scope () {
        var entry = block();
        var exit = block();

        var entryToString = entry.toString;
        var exitToString = exit.toString;

        function save (object, prop) {
          exit(object, prop, '=', entry.def(object, prop), ';');
        }

        return extend(function () {
          entry.apply(entry, slice(arguments));
        }, {
          def: entry.def,
          entry: entry,
          exit: exit,
          save: save,
          set: function (object, prop, value) {
            save(object, prop);
            entry(object, prop, '=', value, ';');
          },
          toString: function () {
            return entryToString() + exitToString()
          }
        })
      }

      function conditional () {
        var pred = join(arguments);
        var thenBlock = scope();
        var elseBlock = scope();

        var thenToString = thenBlock.toString;
        var elseToString = elseBlock.toString;

        return extend(thenBlock, {
          then: function () {
            thenBlock.apply(thenBlock, slice(arguments));
            return this
          },
          else: function () {
            elseBlock.apply(elseBlock, slice(arguments));
            return this
          },
          toString: function () {
            var elseClause = elseToString();
            if (elseClause) {
              elseClause = 'else{' + elseClause + '}';
            }
            return join([
              'if(', pred, '){',
              thenToString(),
              '}', elseClause
            ])
          }
        })
      }

      // procedure list
      var globalBlock = block();
      var procedures = {};
      function proc (name, count) {
        var args = [];
        function arg () {
          var name = 'a' + args.length;
          args.push(name);
          return name
        }

        count = count || 0;
        for (var i = 0; i < count; ++i) {
          arg();
        }

        var body = scope();
        var bodyToString = body.toString;

        var result = procedures[name] = extend(body, {
          arg: arg,
          toString: function () {
            return join([
              'function(', args.join(), '){',
              bodyToString(),
              '}'
            ])
          }
        });

        return result
      }

      function compile () {
        var code = ['"use strict";',
          globalBlock,
          'return {'];
        Object.keys(procedures).forEach(function (name) {
          code.push('"', name, '":', procedures[name].toString(), ',');
        });
        code.push('}');
        var src = join(code)
          .replace(/;/g, ';\n')
          .replace(/}/g, '}\n')
          .replace(/{/g, '{\n');
        var proc = Function.apply(null, linkedNames.concat(src));
        return proc.apply(null, linkedValues)
      }

      return {
        global: globalBlock,
        link: link,
        block: block,
        proc: proc,
        scope: scope,
        cond: conditional,
        compile: compile
      }
    }

    // "cute" names for vector components
    var CUTE_COMPONENTS = 'xyzw'.split('');

    var GL_UNSIGNED_BYTE$8 = 5121;

    var ATTRIB_STATE_POINTER = 1;
    var ATTRIB_STATE_CONSTANT = 2;

    var DYN_FUNC$1 = 0;
    var DYN_PROP$1 = 1;
    var DYN_CONTEXT$1 = 2;
    var DYN_STATE$1 = 3;
    var DYN_THUNK = 4;
    var DYN_CONSTANT$1 = 5;
    var DYN_ARRAY$1 = 6;

    var S_DITHER = 'dither';
    var S_BLEND_ENABLE = 'blend.enable';
    var S_BLEND_COLOR = 'blend.color';
    var S_BLEND_EQUATION = 'blend.equation';
    var S_BLEND_FUNC = 'blend.func';
    var S_DEPTH_ENABLE = 'depth.enable';
    var S_DEPTH_FUNC = 'depth.func';
    var S_DEPTH_RANGE = 'depth.range';
    var S_DEPTH_MASK = 'depth.mask';
    var S_COLOR_MASK = 'colorMask';
    var S_CULL_ENABLE = 'cull.enable';
    var S_CULL_FACE = 'cull.face';
    var S_FRONT_FACE = 'frontFace';
    var S_LINE_WIDTH = 'lineWidth';
    var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
    var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
    var S_SAMPLE_ALPHA = 'sample.alpha';
    var S_SAMPLE_ENABLE = 'sample.enable';
    var S_SAMPLE_COVERAGE = 'sample.coverage';
    var S_STENCIL_ENABLE = 'stencil.enable';
    var S_STENCIL_MASK = 'stencil.mask';
    var S_STENCIL_FUNC = 'stencil.func';
    var S_STENCIL_OPFRONT = 'stencil.opFront';
    var S_STENCIL_OPBACK = 'stencil.opBack';
    var S_SCISSOR_ENABLE = 'scissor.enable';
    var S_SCISSOR_BOX = 'scissor.box';
    var S_VIEWPORT = 'viewport';

    var S_PROFILE = 'profile';

    var S_FRAMEBUFFER = 'framebuffer';
    var S_VERT = 'vert';
    var S_FRAG = 'frag';
    var S_ELEMENTS = 'elements';
    var S_PRIMITIVE = 'primitive';
    var S_COUNT = 'count';
    var S_OFFSET = 'offset';
    var S_INSTANCES = 'instances';
    var S_VAO = 'vao';

    var SUFFIX_WIDTH = 'Width';
    var SUFFIX_HEIGHT = 'Height';

    var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
    var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
    var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
    var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
    var S_DRAWINGBUFFER = 'drawingBuffer';
    var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
    var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;

    var NESTED_OPTIONS = [
      S_BLEND_FUNC,
      S_BLEND_EQUATION,
      S_STENCIL_FUNC,
      S_STENCIL_OPFRONT,
      S_STENCIL_OPBACK,
      S_SAMPLE_COVERAGE,
      S_VIEWPORT,
      S_SCISSOR_BOX,
      S_POLYGON_OFFSET_OFFSET
    ];

    var GL_ARRAY_BUFFER$2 = 34962;
    var GL_ELEMENT_ARRAY_BUFFER$2 = 34963;

    var GL_FRAGMENT_SHADER$1 = 35632;
    var GL_VERTEX_SHADER$1 = 35633;

    var GL_TEXTURE_2D$3 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP$2 = 0x8513;

    var GL_CULL_FACE = 0x0B44;
    var GL_BLEND = 0x0BE2;
    var GL_DITHER = 0x0BD0;
    var GL_STENCIL_TEST = 0x0B90;
    var GL_DEPTH_TEST = 0x0B71;
    var GL_SCISSOR_TEST = 0x0C11;
    var GL_POLYGON_OFFSET_FILL = 0x8037;
    var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
    var GL_SAMPLE_COVERAGE = 0x80A0;

    var GL_FLOAT$8 = 5126;
    var GL_FLOAT_VEC2 = 35664;
    var GL_FLOAT_VEC3 = 35665;
    var GL_FLOAT_VEC4 = 35666;
    var GL_INT$3 = 5124;
    var GL_INT_VEC2 = 35667;
    var GL_INT_VEC3 = 35668;
    var GL_INT_VEC4 = 35669;
    var GL_BOOL = 35670;
    var GL_BOOL_VEC2 = 35671;
    var GL_BOOL_VEC3 = 35672;
    var GL_BOOL_VEC4 = 35673;
    var GL_FLOAT_MAT2 = 35674;
    var GL_FLOAT_MAT3 = 35675;
    var GL_FLOAT_MAT4 = 35676;
    var GL_SAMPLER_2D = 35678;
    var GL_SAMPLER_CUBE = 35680;

    var GL_TRIANGLES$1 = 4;

    var GL_FRONT = 1028;
    var GL_BACK = 1029;
    var GL_CW = 0x0900;
    var GL_CCW = 0x0901;
    var GL_MIN_EXT = 0x8007;
    var GL_MAX_EXT = 0x8008;
    var GL_ALWAYS = 519;
    var GL_KEEP = 7680;
    var GL_ZERO = 0;
    var GL_ONE = 1;
    var GL_FUNC_ADD = 0x8006;
    var GL_LESS = 513;

    var GL_FRAMEBUFFER$2 = 0x8D40;
    var GL_COLOR_ATTACHMENT0$2 = 0x8CE0;

    var blendFuncs = {
      '0': 0,
      '1': 1,
      'zero': 0,
      'one': 1,
      'src color': 768,
      'one minus src color': 769,
      'src alpha': 770,
      'one minus src alpha': 771,
      'dst color': 774,
      'one minus dst color': 775,
      'dst alpha': 772,
      'one minus dst alpha': 773,
      'constant color': 32769,
      'one minus constant color': 32770,
      'constant alpha': 32771,
      'one minus constant alpha': 32772,
      'src alpha saturate': 776
    };

    // There are invalid values for srcRGB and dstRGB. See:
    // https://www.khronos.org/registry/webgl/specs/1.0/#6.13
    // https://github.com/KhronosGroup/WebGL/blob/0d3201f5f7ec3c0060bc1f04077461541f1987b9/conformance-suites/1.0.3/conformance/misc/webgl-specific.html#L56
    var invalidBlendCombinations = [
      'constant color, constant alpha',
      'one minus constant color, constant alpha',
      'constant color, one minus constant alpha',
      'one minus constant color, one minus constant alpha',
      'constant alpha, constant color',
      'constant alpha, one minus constant color',
      'one minus constant alpha, constant color',
      'one minus constant alpha, one minus constant color'
    ];

    var compareFuncs = {
      'never': 512,
      'less': 513,
      '<': 513,
      'equal': 514,
      '=': 514,
      '==': 514,
      '===': 514,
      'lequal': 515,
      '<=': 515,
      'greater': 516,
      '>': 516,
      'notequal': 517,
      '!=': 517,
      '!==': 517,
      'gequal': 518,
      '>=': 518,
      'always': 519
    };

    var stencilOps = {
      '0': 0,
      'zero': 0,
      'keep': 7680,
      'replace': 7681,
      'increment': 7682,
      'decrement': 7683,
      'increment wrap': 34055,
      'decrement wrap': 34056,
      'invert': 5386
    };

    var shaderType = {
      'frag': GL_FRAGMENT_SHADER$1,
      'vert': GL_VERTEX_SHADER$1
    };

    var orientationType = {
      'cw': GL_CW,
      'ccw': GL_CCW
    };

    function isBufferArgs (x) {
      return Array.isArray(x) ||
        isTypedArray(x) ||
        isNDArrayLike(x)
    }

    // Make sure viewport is processed first
    function sortState (state) {
      return state.sort(function (a, b) {
        if (a === S_VIEWPORT) {
          return -1
        } else if (b === S_VIEWPORT) {
          return 1
        }
        return (a < b) ? -1 : 1
      })
    }

    function Declaration (thisDep, contextDep, propDep, append) {
      this.thisDep = thisDep;
      this.contextDep = contextDep;
      this.propDep = propDep;
      this.append = append;
    }

    function isStatic (decl) {
      return decl && !(decl.thisDep || decl.contextDep || decl.propDep)
    }

    function createStaticDecl (append) {
      return new Declaration(false, false, false, append)
    }

    function createDynamicDecl (dyn, append) {
      var type = dyn.type;
      if (type === DYN_FUNC$1) {
        var numArgs = dyn.data.length;
        return new Declaration(
          true,
          numArgs >= 1,
          numArgs >= 2,
          append)
      } else if (type === DYN_THUNK) {
        var data = dyn.data;
        return new Declaration(
          data.thisDep,
          data.contextDep,
          data.propDep,
          append)
      } else if (type === DYN_CONSTANT$1) {
        return new Declaration(
          false,
          false,
          false,
          append)
      } else if (type === DYN_ARRAY$1) {
        var thisDep = false;
        var contextDep = false;
        var propDep = false;
        for (var i = 0; i < dyn.data.length; ++i) {
          var subDyn = dyn.data[i];
          if (subDyn.type === DYN_PROP$1) {
            propDep = true;
          } else if (subDyn.type === DYN_CONTEXT$1) {
            contextDep = true;
          } else if (subDyn.type === DYN_STATE$1) {
            thisDep = true;
          } else if (subDyn.type === DYN_FUNC$1) {
            thisDep = true;
            var subArgs = subDyn.data;
            if (subArgs >= 1) {
              contextDep = true;
            }
            if (subArgs >= 2) {
              propDep = true;
            }
          } else if (subDyn.type === DYN_THUNK) {
            thisDep = thisDep || subDyn.data.thisDep;
            contextDep = contextDep || subDyn.data.contextDep;
            propDep = propDep || subDyn.data.propDep;
          }
        }
        return new Declaration(
          thisDep,
          contextDep,
          propDep,
          append)
      } else {
        return new Declaration(
          type === DYN_STATE$1,
          type === DYN_CONTEXT$1,
          type === DYN_PROP$1,
          append)
      }
    }

    var SCOPE_DECL = new Declaration(false, false, false, function () {});

    function reglCore (
      gl,
      stringStore,
      extensions,
      limits,
      bufferState,
      elementState,
      textureState,
      framebufferState,
      uniformState,
      attributeState,
      shaderState,
      drawState,
      contextState,
      timer,
      config) {
      var AttributeRecord = attributeState.Record;

      var blendEquations = {
        'add': 32774,
        'subtract': 32778,
        'reverse subtract': 32779
      };
      if (extensions.ext_blend_minmax) {
        blendEquations.min = GL_MIN_EXT;
        blendEquations.max = GL_MAX_EXT;
      }

      var extInstancing = extensions.angle_instanced_arrays;
      var extDrawBuffers = extensions.webgl_draw_buffers;
      var extVertexArrays = extensions.oes_vertex_array_object;

      // ===================================================
      // ===================================================
      // WEBGL STATE
      // ===================================================
      // ===================================================
      var currentState = {
        dirty: true,
        profile: config.profile
      };
      var nextState = {};
      var GL_STATE_NAMES = [];
      var GL_FLAGS = {};
      var GL_VARIABLES = {};

      function propName (name) {
        return name.replace('.', '_')
      }

      function stateFlag (sname, cap, init) {
        var name = propName(sname);
        GL_STATE_NAMES.push(sname);
        nextState[name] = currentState[name] = !!init;
        GL_FLAGS[name] = cap;
      }

      function stateVariable (sname, func, init) {
        var name = propName(sname);
        GL_STATE_NAMES.push(sname);
        if (Array.isArray(init)) {
          currentState[name] = init.slice();
          nextState[name] = init.slice();
        } else {
          currentState[name] = nextState[name] = init;
        }
        GL_VARIABLES[name] = func;
      }

      // Dithering
      stateFlag(S_DITHER, GL_DITHER);

      // Blending
      stateFlag(S_BLEND_ENABLE, GL_BLEND);
      stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
      stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate',
        [GL_FUNC_ADD, GL_FUNC_ADD]);
      stateVariable(S_BLEND_FUNC, 'blendFuncSeparate',
        [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);

      // Depth
      stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
      stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
      stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
      stateVariable(S_DEPTH_MASK, 'depthMask', true);

      // Color mask
      stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);

      // Face culling
      stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
      stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);

      // Front face orientation
      stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);

      // Line width
      stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);

      // Polygon offset
      stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
      stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);

      // Sample coverage
      stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
      stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
      stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);

      // Stencil
      stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
      stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
      stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
      stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate',
        [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
      stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate',
        [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);

      // Scissor
      stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
      stateVariable(S_SCISSOR_BOX, 'scissor',
        [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

      // Viewport
      stateVariable(S_VIEWPORT, S_VIEWPORT,
        [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

      // ===================================================
      // ===================================================
      // ENVIRONMENT
      // ===================================================
      // ===================================================
      var sharedState = {
        gl: gl,
        context: contextState,
        strings: stringStore,
        next: nextState,
        current: currentState,
        draw: drawState,
        elements: elementState,
        buffer: bufferState,
        shader: shaderState,
        attributes: attributeState.state,
        vao: attributeState,
        uniforms: uniformState,
        framebuffer: framebufferState,
        extensions: extensions,

        timer: timer,
        isBufferArgs: isBufferArgs
      };

      var sharedConstants = {
        primTypes: primTypes,
        compareFuncs: compareFuncs,
        blendFuncs: blendFuncs,
        blendEquations: blendEquations,
        stencilOps: stencilOps,
        glTypes: glTypes,
        orientationType: orientationType
      };

      check$1.optional(function () {
        sharedState.isArrayLike = isArrayLike;
      });

      if (extDrawBuffers) {
        sharedConstants.backBuffer = [GL_BACK];
        sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
          if (i === 0) {
            return [0]
          }
          return loop(i, function (j) {
            return GL_COLOR_ATTACHMENT0$2 + j
          })
        });
      }

      var drawCallCounter = 0;
      function createREGLEnvironment () {
        var env = createEnvironment();
        var link = env.link;
        var global = env.global;
        env.id = drawCallCounter++;

        env.batchId = '0';

        // link shared state
        var SHARED = link(sharedState);
        var shared = env.shared = {
          props: 'a0'
        };
        Object.keys(sharedState).forEach(function (prop) {
          shared[prop] = global.def(SHARED, '.', prop);
        });

        // Inject runtime assertion stuff for debug builds
        check$1.optional(function () {
          env.CHECK = link(check$1);
          env.commandStr = check$1.guessCommand();
          env.command = link(env.commandStr);
          env.assert = function (block, pred, message) {
            block(
              'if(!(', pred, '))',
              this.CHECK, '.commandRaise(', link(message), ',', this.command, ');');
          };

          sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
        });

        // Copy GL state variables over
        var nextVars = env.next = {};
        var currentVars = env.current = {};
        Object.keys(GL_VARIABLES).forEach(function (variable) {
          if (Array.isArray(currentState[variable])) {
            nextVars[variable] = global.def(shared.next, '.', variable);
            currentVars[variable] = global.def(shared.current, '.', variable);
          }
        });

        // Initialize shared constants
        var constants = env.constants = {};
        Object.keys(sharedConstants).forEach(function (name) {
          constants[name] = global.def(JSON.stringify(sharedConstants[name]));
        });

        // Helper function for calling a block
        env.invoke = function (block, x) {
          switch (x.type) {
            case DYN_FUNC$1:
              var argList = [
                'this',
                shared.context,
                shared.props,
                env.batchId
              ];
              return block.def(
                link(x.data), '.call(',
                argList.slice(0, Math.max(x.data.length + 1, 4)),
                ')')
            case DYN_PROP$1:
              return block.def(shared.props, x.data)
            case DYN_CONTEXT$1:
              return block.def(shared.context, x.data)
            case DYN_STATE$1:
              return block.def('this', x.data)
            case DYN_THUNK:
              x.data.append(env, block);
              return x.data.ref
            case DYN_CONSTANT$1:
              return x.data.toString()
            case DYN_ARRAY$1:
              return x.data.map(function (y) {
                return env.invoke(block, y)
              })
          }
        };

        env.attribCache = {};

        var scopeAttribs = {};
        env.scopeAttrib = function (name) {
          var id = stringStore.id(name);
          if (id in scopeAttribs) {
            return scopeAttribs[id]
          }
          var binding = attributeState.scope[id];
          if (!binding) {
            binding = attributeState.scope[id] = new AttributeRecord();
          }
          var result = scopeAttribs[id] = link(binding);
          return result
        };

        return env
      }

      // ===================================================
      // ===================================================
      // PARSING
      // ===================================================
      // ===================================================
      function parseProfile (options) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        var profileEnable;
        if (S_PROFILE in staticOptions) {
          var value = !!staticOptions[S_PROFILE];
          profileEnable = createStaticDecl(function (env, scope) {
            return value
          });
          profileEnable.enable = value;
        } else if (S_PROFILE in dynamicOptions) {
          var dyn = dynamicOptions[S_PROFILE];
          profileEnable = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        }

        return profileEnable
      }

      function parseFramebuffer (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        if (S_FRAMEBUFFER in staticOptions) {
          var framebuffer = staticOptions[S_FRAMEBUFFER];
          if (framebuffer) {
            framebuffer = framebufferState.getFramebuffer(framebuffer);
            check$1.command(framebuffer, 'invalid framebuffer object');
            return createStaticDecl(function (env, block) {
              var FRAMEBUFFER = env.link(framebuffer);
              var shared = env.shared;
              block.set(
                shared.framebuffer,
                '.next',
                FRAMEBUFFER);
              var CONTEXT = shared.context;
              block.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_WIDTH,
                FRAMEBUFFER + '.width');
              block.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_HEIGHT,
                FRAMEBUFFER + '.height');
              return FRAMEBUFFER
            })
          } else {
            return createStaticDecl(function (env, scope) {
              var shared = env.shared;
              scope.set(
                shared.framebuffer,
                '.next',
                'null');
              var CONTEXT = shared.context;
              scope.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_WIDTH,
                CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
              scope.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_HEIGHT,
                CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
              return 'null'
            })
          }
        } else if (S_FRAMEBUFFER in dynamicOptions) {
          var dyn = dynamicOptions[S_FRAMEBUFFER];
          return createDynamicDecl(dyn, function (env, scope) {
            var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
            var shared = env.shared;
            var FRAMEBUFFER_STATE = shared.framebuffer;
            var FRAMEBUFFER = scope.def(
              FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');

            check$1.optional(function () {
              env.assert(scope,
                '!' + FRAMEBUFFER_FUNC + '||' + FRAMEBUFFER,
                'invalid framebuffer object');
            });

            scope.set(
              FRAMEBUFFER_STATE,
              '.next',
              FRAMEBUFFER);
            var CONTEXT = shared.context;
            scope.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_WIDTH,
              FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
              CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
            scope.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_HEIGHT,
              FRAMEBUFFER +
              '?' + FRAMEBUFFER + '.height:' +
              CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
            return FRAMEBUFFER
          })
        } else {
          return null
        }
      }

      function parseViewportScissor (options, framebuffer, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        function parseBox (param) {
          if (param in staticOptions) {
            var box = staticOptions[param];
            check$1.commandType(box, 'object', 'invalid ' + param, env.commandStr);

            var isStatic = true;
            var x = box.x | 0;
            var y = box.y | 0;
            var w, h;
            if ('width' in box) {
              w = box.width | 0;
              check$1.command(w >= 0, 'invalid ' + param, env.commandStr);
            } else {
              isStatic = false;
            }
            if ('height' in box) {
              h = box.height | 0;
              check$1.command(h >= 0, 'invalid ' + param, env.commandStr);
            } else {
              isStatic = false;
            }

            return new Declaration(
              !isStatic && framebuffer && framebuffer.thisDep,
              !isStatic && framebuffer && framebuffer.contextDep,
              !isStatic && framebuffer && framebuffer.propDep,
              function (env, scope) {
                var CONTEXT = env.shared.context;
                var BOX_W = w;
                if (!('width' in box)) {
                  BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
                }
                var BOX_H = h;
                if (!('height' in box)) {
                  BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
                }
                return [x, y, BOX_W, BOX_H]
              })
          } else if (param in dynamicOptions) {
            var dynBox = dynamicOptions[param];
            var result = createDynamicDecl(dynBox, function (env, scope) {
              var BOX = env.invoke(scope, dynBox);

              check$1.optional(function () {
                env.assert(scope,
                  BOX + '&&typeof ' + BOX + '==="object"',
                  'invalid ' + param);
              });

              var CONTEXT = env.shared.context;
              var BOX_X = scope.def(BOX, '.x|0');
              var BOX_Y = scope.def(BOX, '.y|0');
              var BOX_W = scope.def(
                '"width" in ', BOX, '?', BOX, '.width|0:',
                '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
              var BOX_H = scope.def(
                '"height" in ', BOX, '?', BOX, '.height|0:',
                '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');

              check$1.optional(function () {
                env.assert(scope,
                  BOX_W + '>=0&&' +
                  BOX_H + '>=0',
                  'invalid ' + param);
              });

              return [BOX_X, BOX_Y, BOX_W, BOX_H]
            });
            if (framebuffer) {
              result.thisDep = result.thisDep || framebuffer.thisDep;
              result.contextDep = result.contextDep || framebuffer.contextDep;
              result.propDep = result.propDep || framebuffer.propDep;
            }
            return result
          } else if (framebuffer) {
            return new Declaration(
              framebuffer.thisDep,
              framebuffer.contextDep,
              framebuffer.propDep,
              function (env, scope) {
                var CONTEXT = env.shared.context;
                return [
                  0, 0,
                  scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
                  scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)]
              })
          } else {
            return null
          }
        }

        var viewport = parseBox(S_VIEWPORT);

        if (viewport) {
          var prevViewport = viewport;
          viewport = new Declaration(
            viewport.thisDep,
            viewport.contextDep,
            viewport.propDep,
            function (env, scope) {
              var VIEWPORT = prevViewport.append(env, scope);
              var CONTEXT = env.shared.context;
              scope.set(
                CONTEXT,
                '.' + S_VIEWPORT_WIDTH,
                VIEWPORT[2]);
              scope.set(
                CONTEXT,
                '.' + S_VIEWPORT_HEIGHT,
                VIEWPORT[3]);
              return VIEWPORT
            });
        }

        return {
          viewport: viewport,
          scissor_box: parseBox(S_SCISSOR_BOX)
        }
      }

      function parseAttribLocations (options, attributes) {
        var staticOptions = options.static;
        var staticProgram =
          typeof staticOptions[S_FRAG] === 'string' &&
          typeof staticOptions[S_VERT] === 'string';
        if (staticProgram) {
          if (Object.keys(attributes.dynamic).length > 0) {
            return null
          }
          var staticAttributes = attributes.static;
          var sAttributes = Object.keys(staticAttributes);
          if (sAttributes.length > 0 && typeof staticAttributes[sAttributes[0]] === 'number') {
            var bindings = [];
            for (var i = 0; i < sAttributes.length; ++i) {
              check$1(typeof staticAttributes[sAttributes[i]] === 'number', 'must specify all vertex attribute locations when using vaos');
              bindings.push([staticAttributes[sAttributes[i]] | 0, sAttributes[i]]);
            }
            return bindings
          }
        }
        return null
      }

      function parseProgram (options, env, attribLocations) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        function parseShader (name) {
          if (name in staticOptions) {
            var id = stringStore.id(staticOptions[name]);
            check$1.optional(function () {
              shaderState.shader(shaderType[name], id, check$1.guessCommand());
            });
            var result = createStaticDecl(function () {
              return id
            });
            result.id = id;
            return result
          } else if (name in dynamicOptions) {
            var dyn = dynamicOptions[name];
            return createDynamicDecl(dyn, function (env, scope) {
              var str = env.invoke(scope, dyn);
              var id = scope.def(env.shared.strings, '.id(', str, ')');
              check$1.optional(function () {
                scope(
                  env.shared.shader, '.shader(',
                  shaderType[name], ',',
                  id, ',',
                  env.command, ');');
              });
              return id
            })
          }
          return null
        }

        var frag = parseShader(S_FRAG);
        var vert = parseShader(S_VERT);

        var program = null;
        var progVar;
        if (isStatic(frag) && isStatic(vert)) {
          program = shaderState.program(vert.id, frag.id, null, attribLocations);
          progVar = createStaticDecl(function (env, scope) {
            return env.link(program)
          });
        } else {
          progVar = new Declaration(
            (frag && frag.thisDep) || (vert && vert.thisDep),
            (frag && frag.contextDep) || (vert && vert.contextDep),
            (frag && frag.propDep) || (vert && vert.propDep),
            function (env, scope) {
              var SHADER_STATE = env.shared.shader;
              var fragId;
              if (frag) {
                fragId = frag.append(env, scope);
              } else {
                fragId = scope.def(SHADER_STATE, '.', S_FRAG);
              }
              var vertId;
              if (vert) {
                vertId = vert.append(env, scope);
              } else {
                vertId = scope.def(SHADER_STATE, '.', S_VERT);
              }
              var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
              check$1.optional(function () {
                progDef += ',' + env.command;
              });
              return scope.def(progDef + ')')
            });
        }

        return {
          frag: frag,
          vert: vert,
          progVar: progVar,
          program: program
        }
      }

      function parseDraw (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        // TODO: should use VAO to get default values for offset properties
        // should move vao parse into here and out of the old stuff

        var staticDraw = {};
        var vaoActive = false;

        function parseVAO () {
          if (S_VAO in staticOptions) {
            var vao = staticOptions[S_VAO];
            if (vao !== null && attributeState.getVAO(vao) === null) {
              vao = attributeState.createVAO(vao);
            }

            vaoActive = true;
            staticDraw.vao = vao;

            return createStaticDecl(function (env) {
              var vaoRef = attributeState.getVAO(vao);
              if (vaoRef) {
                return env.link(vaoRef)
              } else {
                return 'null'
              }
            })
          } else if (S_VAO in dynamicOptions) {
            vaoActive = true;
            var dyn = dynamicOptions[S_VAO];
            return createDynamicDecl(dyn, function (env, scope) {
              var vaoRef = env.invoke(scope, dyn);
              return scope.def(env.shared.vao + '.getVAO(' + vaoRef + ')')
            })
          }
          return null
        }

        var vao = parseVAO();

        var elementsActive = false;

        function parseElements () {
          if (S_ELEMENTS in staticOptions) {
            var elements = staticOptions[S_ELEMENTS];
            staticDraw.elements = elements;
            if (isBufferArgs(elements)) {
              var e = staticDraw.elements = elementState.create(elements, true);
              elements = elementState.getElements(e);
              elementsActive = true;
            } else if (elements) {
              elements = elementState.getElements(elements);
              elementsActive = true;
              check$1.command(elements, 'invalid elements', env.commandStr);
            }

            var result = createStaticDecl(function (env, scope) {
              if (elements) {
                var result = env.link(elements);
                env.ELEMENTS = result;
                return result
              }
              env.ELEMENTS = null;
              return null
            });
            result.value = elements;
            return result
          } else if (S_ELEMENTS in dynamicOptions) {
            elementsActive = true;

            var dyn = dynamicOptions[S_ELEMENTS];
            return createDynamicDecl(dyn, function (env, scope) {
              var shared = env.shared;

              var IS_BUFFER_ARGS = shared.isBufferArgs;
              var ELEMENT_STATE = shared.elements;

              var elementDefn = env.invoke(scope, dyn);
              var elements = scope.def('null');
              var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');

              var ifte = env.cond(elementStream)
                .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
                .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');

              check$1.optional(function () {
                env.assert(ifte.else,
                  '!' + elementDefn + '||' + elements,
                  'invalid elements');
              });

              scope.entry(ifte);
              scope.exit(
                env.cond(elementStream)
                  .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));

              env.ELEMENTS = elements;

              return elements
            })
          } else if (vaoActive) {
            return new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao + '.currentVAO?' + env.shared.elements + '.getElements(' + env.shared.vao + '.currentVAO.elements):null')
              })
          }
          return null
        }

        var elements = parseElements();

        function parsePrimitive () {
          if (S_PRIMITIVE in staticOptions) {
            var primitive = staticOptions[S_PRIMITIVE];
            staticDraw.primitive = primitive;
            check$1.commandParameter(primitive, primTypes, 'invalid primitve', env.commandStr);
            return createStaticDecl(function (env, scope) {
              return primTypes[primitive]
            })
          } else if (S_PRIMITIVE in dynamicOptions) {
            var dynPrimitive = dynamicOptions[S_PRIMITIVE];
            return createDynamicDecl(dynPrimitive, function (env, scope) {
              var PRIM_TYPES = env.constants.primTypes;
              var prim = env.invoke(scope, dynPrimitive);
              check$1.optional(function () {
                env.assert(scope,
                  prim + ' in ' + PRIM_TYPES,
                  'invalid primitive, must be one of ' + Object.keys(primTypes));
              });
              return scope.def(PRIM_TYPES, '[', prim, ']')
            })
          } else if (elementsActive) {
            if (isStatic(elements)) {
              if (elements.value) {
                return createStaticDecl(function (env, scope) {
                  return scope.def(env.ELEMENTS, '.primType')
                })
              } else {
                return createStaticDecl(function () {
                  return GL_TRIANGLES$1
                })
              }
            } else {
              return new Declaration(
                elements.thisDep,
                elements.contextDep,
                elements.propDep,
                function (env, scope) {
                  var elements = env.ELEMENTS;
                  return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1)
                })
            }
          } else if (vaoActive) {
            return new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.primitive:' + GL_TRIANGLES$1)
              })
          }
          return null
        }

        function parseParam (param, isOffset) {
          if (param in staticOptions) {
            var value = staticOptions[param] | 0;
            if (isOffset) {
              staticDraw.offset = value;
            } else {
              staticDraw.instances = value;
            }
            check$1.command(!isOffset || value >= 0, 'invalid ' + param, env.commandStr);
            return createStaticDecl(function (env, scope) {
              if (isOffset) {
                env.OFFSET = value;
              }
              return value
            })
          } else if (param in dynamicOptions) {
            var dynValue = dynamicOptions[param];
            return createDynamicDecl(dynValue, function (env, scope) {
              var result = env.invoke(scope, dynValue);
              if (isOffset) {
                env.OFFSET = result;
                check$1.optional(function () {
                  env.assert(scope,
                    result + '>=0',
                    'invalid ' + param);
                });
              }
              return result
            })
          } else if (isOffset) {
            if (elementsActive) {
              return createStaticDecl(function (env, scope) {
                env.OFFSET = 0;
                return 0
              })
            } else if (vaoActive) {
              return new Declaration(
                vao.thisDep,
                vao.contextDep,
                vao.propDep,
                function (env, scope) {
                  return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.offset:0')
                })
            }
          } else if (vaoActive) {
            return new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.instances:-1')
              })
          }
          return null
        }

        var OFFSET = parseParam(S_OFFSET, true);

        function parseVertCount () {
          if (S_COUNT in staticOptions) {
            var count = staticOptions[S_COUNT] | 0;
            staticDraw.count = count;
            check$1.command(
              typeof count === 'number' && count >= 0, 'invalid vertex count', env.commandStr);
            return createStaticDecl(function () {
              return count
            })
          } else if (S_COUNT in dynamicOptions) {
            var dynCount = dynamicOptions[S_COUNT];
            return createDynamicDecl(dynCount, function (env, scope) {
              var result = env.invoke(scope, dynCount);
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + result + '==="number"&&' +
                  result + '>=0&&' +
                  result + '===(' + result + '|0)',
                  'invalid vertex count');
              });
              return result
            })
          } else if (elementsActive) {
            if (isStatic(elements)) {
              if (elements) {
                if (OFFSET) {
                  return new Declaration(
                    OFFSET.thisDep,
                    OFFSET.contextDep,
                    OFFSET.propDep,
                    function (env, scope) {
                      var result = scope.def(
                        env.ELEMENTS, '.vertCount-', env.OFFSET);

                      check$1.optional(function () {
                        env.assert(scope,
                          result + '>=0',
                          'invalid vertex offset/element buffer too small');
                      });

                      return result
                    })
                } else {
                  return createStaticDecl(function (env, scope) {
                    return scope.def(env.ELEMENTS, '.vertCount')
                  })
                }
              } else {
                var result = createStaticDecl(function () {
                  return -1
                });
                check$1.optional(function () {
                  result.MISSING = true;
                });
                return result
              }
            } else {
              var variable = new Declaration(
                elements.thisDep || OFFSET.thisDep,
                elements.contextDep || OFFSET.contextDep,
                elements.propDep || OFFSET.propDep,
                function (env, scope) {
                  var elements = env.ELEMENTS;
                  if (env.OFFSET) {
                    return scope.def(elements, '?', elements, '.vertCount-',
                      env.OFFSET, ':-1')
                  }
                  return scope.def(elements, '?', elements, '.vertCount:-1')
                });
              check$1.optional(function () {
                variable.DYNAMIC = true;
              });
              return variable
            }
          } else if (vaoActive) {
            var countVariable = new Declaration(
              vao.thisDep,
              vao.contextDep,
              vao.propDep,
              function (env, scope) {
                return scope.def(env.shared.vao, '.currentVAO?', env.shared.vao, '.currentVAO.count:-1')
              });
            return countVariable
          }
          return null
        }

        var primitive = parsePrimitive();
        var count = parseVertCount();
        var instances = parseParam(S_INSTANCES, false);

        return {
          elements: elements,
          primitive: primitive,
          count: count,
          instances: instances,
          offset: OFFSET,
          vao: vao,

          vaoActive: vaoActive,
          elementsActive: elementsActive,

          // static draw props
          static: staticDraw
        }
      }

      function parseGLState (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        var STATE = {};

        GL_STATE_NAMES.forEach(function (prop) {
          var param = propName(prop);

          function parseParam (parseStatic, parseDynamic) {
            if (prop in staticOptions) {
              var value = parseStatic(staticOptions[prop]);
              STATE[param] = createStaticDecl(function () {
                return value
              });
            } else if (prop in dynamicOptions) {
              var dyn = dynamicOptions[prop];
              STATE[param] = createDynamicDecl(dyn, function (env, scope) {
                return parseDynamic(env, scope, env.invoke(scope, dyn))
              });
            }
          }

          switch (prop) {
            case S_CULL_ENABLE:
            case S_BLEND_ENABLE:
            case S_DITHER:
            case S_STENCIL_ENABLE:
            case S_DEPTH_ENABLE:
            case S_SCISSOR_ENABLE:
            case S_POLYGON_OFFSET_ENABLE:
            case S_SAMPLE_ALPHA:
            case S_SAMPLE_ENABLE:
            case S_DEPTH_MASK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'boolean', prop, env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="boolean"',
                      'invalid flag ' + prop, env.commandStr);
                  });
                  return value
                })

            case S_DEPTH_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandParameter(value, compareFuncs, 'invalid ' + prop, env.commandStr);
                  return compareFuncs[value]
                },
                function (env, scope, value) {
                  var COMPARE_FUNCS = env.constants.compareFuncs;
                  check$1.optional(function () {
                    env.assert(scope,
                      value + ' in ' + COMPARE_FUNCS,
                      'invalid ' + prop + ', must be one of ' + Object.keys(compareFuncs));
                  });
                  return scope.def(COMPARE_FUNCS, '[', value, ']')
                })

            case S_DEPTH_RANGE:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) &&
                    value.length === 2 &&
                    typeof value[0] === 'number' &&
                    typeof value[1] === 'number' &&
                    value[0] <= value[1],
                    'depth range is 2d array',
                    env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===2&&' +
                      'typeof ' + value + '[0]==="number"&&' +
                      'typeof ' + value + '[1]==="number"&&' +
                      value + '[0]<=' + value + '[1]',
                      'depth range must be a 2d array');
                  });

                  var Z_NEAR = scope.def('+', value, '[0]');
                  var Z_FAR = scope.def('+', value, '[1]');
                  return [Z_NEAR, Z_FAR]
                })

            case S_BLEND_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', 'blend.func', env.commandStr);
                  var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
                  var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
                  var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
                  var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
                  check$1.commandParameter(srcRGB, blendFuncs, param + '.srcRGB', env.commandStr);
                  check$1.commandParameter(srcAlpha, blendFuncs, param + '.srcAlpha', env.commandStr);
                  check$1.commandParameter(dstRGB, blendFuncs, param + '.dstRGB', env.commandStr);
                  check$1.commandParameter(dstAlpha, blendFuncs, param + '.dstAlpha', env.commandStr);

                  check$1.command(
                    (invalidBlendCombinations.indexOf(srcRGB + ', ' + dstRGB) === -1),
                    'unallowed blending combination (srcRGB, dstRGB) = (' + srcRGB + ', ' + dstRGB + ')', env.commandStr);

                  return [
                    blendFuncs[srcRGB],
                    blendFuncs[dstRGB],
                    blendFuncs[srcAlpha],
                    blendFuncs[dstAlpha]
                  ]
                },
                function (env, scope, value) {
                  var BLEND_FUNCS = env.constants.blendFuncs;

                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid blend func, must be an object');
                  });

                  function read (prefix, suffix) {
                    var func = scope.def(
                      '"', prefix, suffix, '" in ', value,
                      '?', value, '.', prefix, suffix,
                      ':', value, '.', prefix);

                    check$1.optional(function () {
                      env.assert(scope,
                        func + ' in ' + BLEND_FUNCS,
                        'invalid ' + prop + '.' + prefix + suffix + ', must be one of ' + Object.keys(blendFuncs));
                    });

                    return func
                  }

                  var srcRGB = read('src', 'RGB');
                  var dstRGB = read('dst', 'RGB');

                  check$1.optional(function () {
                    var INVALID_BLEND_COMBINATIONS = env.constants.invalidBlendCombinations;

                    env.assert(scope,
                      INVALID_BLEND_COMBINATIONS +
                               '.indexOf(' + srcRGB + '+", "+' + dstRGB + ') === -1 ',
                      'unallowed blending combination for (srcRGB, dstRGB)'
                    );
                  });

                  var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
                  var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
                  var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
                  var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');

                  return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA]
                })

            case S_BLEND_EQUATION:
              return parseParam(
                function (value) {
                  if (typeof value === 'string') {
                    check$1.commandParameter(value, blendEquations, 'invalid ' + prop, env.commandStr);
                    return [
                      blendEquations[value],
                      blendEquations[value]
                    ]
                  } else if (typeof value === 'object') {
                    check$1.commandParameter(
                      value.rgb, blendEquations, prop + '.rgb', env.commandStr);
                    check$1.commandParameter(
                      value.alpha, blendEquations, prop + '.alpha', env.commandStr);
                    return [
                      blendEquations[value.rgb],
                      blendEquations[value.alpha]
                    ]
                  } else {
                    check$1.commandRaise('invalid blend.equation', env.commandStr);
                  }
                },
                function (env, scope, value) {
                  var BLEND_EQUATIONS = env.constants.blendEquations;

                  var RGB = scope.def();
                  var ALPHA = scope.def();

                  var ifte = env.cond('typeof ', value, '==="string"');

                  check$1.optional(function () {
                    function checkProp (block, name, value) {
                      env.assert(block,
                        value + ' in ' + BLEND_EQUATIONS,
                        'invalid ' + name + ', must be one of ' + Object.keys(blendEquations));
                    }
                    checkProp(ifte.then, prop, value);

                    env.assert(ifte.else,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                    checkProp(ifte.else, prop + '.rgb', value + '.rgb');
                    checkProp(ifte.else, prop + '.alpha', value + '.alpha');
                  });

                  ifte.then(
                    RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
                  ifte.else(
                    RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];',
                    ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');

                  scope(ifte);

                  return [RGB, ALPHA]
                })

            case S_BLEND_COLOR:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) &&
                    value.length === 4,
                    'blend.color must be a 4d array', env.commandStr);
                  return loop(4, function (i) {
                    return +value[i]
                  })
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===4',
                      'blend.color must be a 4d array');
                  });
                  return loop(4, function (i) {
                    return scope.def('+', value, '[', i, ']')
                  })
                })

            case S_STENCIL_MASK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'number', param, env.commandStr);
                  return value | 0
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="number"',
                      'invalid stencil.mask');
                  });
                  return scope.def(value, '|0')
                })

            case S_STENCIL_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var cmp = value.cmp || 'keep';
                  var ref = value.ref || 0;
                  var mask = 'mask' in value ? value.mask : -1;
                  check$1.commandParameter(cmp, compareFuncs, prop + '.cmp', env.commandStr);
                  check$1.commandType(ref, 'number', prop + '.ref', env.commandStr);
                  check$1.commandType(mask, 'number', prop + '.mask', env.commandStr);
                  return [
                    compareFuncs[cmp],
                    ref,
                    mask
                  ]
                },
                function (env, scope, value) {
                  var COMPARE_FUNCS = env.constants.compareFuncs;
                  check$1.optional(function () {
                    function assert () {
                      env.assert(scope,
                        Array.prototype.join.call(arguments, ''),
                        'invalid stencil.func');
                    }
                    assert(value + '&&typeof ', value, '==="object"');
                    assert('!("cmp" in ', value, ')||(',
                      value, '.cmp in ', COMPARE_FUNCS, ')');
                  });
                  var cmp = scope.def(
                    '"cmp" in ', value,
                    '?', COMPARE_FUNCS, '[', value, '.cmp]',
                    ':', GL_KEEP);
                  var ref = scope.def(value, '.ref|0');
                  var mask = scope.def(
                    '"mask" in ', value,
                    '?', value, '.mask|0:-1');
                  return [cmp, ref, mask]
                })

            case S_STENCIL_OPFRONT:
            case S_STENCIL_OPBACK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var fail = value.fail || 'keep';
                  var zfail = value.zfail || 'keep';
                  var zpass = value.zpass || 'keep';
                  check$1.commandParameter(fail, stencilOps, prop + '.fail', env.commandStr);
                  check$1.commandParameter(zfail, stencilOps, prop + '.zfail', env.commandStr);
                  check$1.commandParameter(zpass, stencilOps, prop + '.zpass', env.commandStr);
                  return [
                    prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                    stencilOps[fail],
                    stencilOps[zfail],
                    stencilOps[zpass]
                  ]
                },
                function (env, scope, value) {
                  var STENCIL_OPS = env.constants.stencilOps;

                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                  });

                  function read (name) {
                    check$1.optional(function () {
                      env.assert(scope,
                        '!("' + name + '" in ' + value + ')||' +
                        '(' + value + '.' + name + ' in ' + STENCIL_OPS + ')',
                        'invalid ' + prop + '.' + name + ', must be one of ' + Object.keys(stencilOps));
                    });

                    return scope.def(
                      '"', name, '" in ', value,
                      '?', STENCIL_OPS, '[', value, '.', name, ']:',
                      GL_KEEP)
                  }

                  return [
                    prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                    read('fail'),
                    read('zfail'),
                    read('zpass')
                  ]
                })

            case S_POLYGON_OFFSET_OFFSET:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var factor = value.factor | 0;
                  var units = value.units | 0;
                  check$1.commandType(factor, 'number', param + '.factor', env.commandStr);
                  check$1.commandType(units, 'number', param + '.units', env.commandStr);
                  return [factor, units]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                  });

                  var FACTOR = scope.def(value, '.factor|0');
                  var UNITS = scope.def(value, '.units|0');

                  return [FACTOR, UNITS]
                })

            case S_CULL_FACE:
              return parseParam(
                function (value) {
                  var face = 0;
                  if (value === 'front') {
                    face = GL_FRONT;
                  } else if (value === 'back') {
                    face = GL_BACK;
                  }
                  check$1.command(!!face, param, env.commandStr);
                  return face
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '==="front"||' +
                      value + '==="back"',
                      'invalid cull.face');
                  });
                  return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK)
                })

            case S_LINE_WIDTH:
              return parseParam(
                function (value) {
                  check$1.command(
                    typeof value === 'number' &&
                    value >= limits.lineWidthDims[0] &&
                    value <= limits.lineWidthDims[1],
                    'invalid line width, must be a positive number between ' +
                    limits.lineWidthDims[0] + ' and ' + limits.lineWidthDims[1], env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="number"&&' +
                      value + '>=' + limits.lineWidthDims[0] + '&&' +
                      value + '<=' + limits.lineWidthDims[1],
                      'invalid line width');
                  });

                  return value
                })

            case S_FRONT_FACE:
              return parseParam(
                function (value) {
                  check$1.commandParameter(value, orientationType, param, env.commandStr);
                  return orientationType[value]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '==="cw"||' +
                      value + '==="ccw"',
                      'invalid frontFace, must be one of cw,ccw');
                  });
                  return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW)
                })

            case S_COLOR_MASK:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) && value.length === 4,
                    'color.mask must be length 4 array', env.commandStr);
                  return value.map(function (v) { return !!v })
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===4',
                      'invalid color.mask');
                  });
                  return loop(4, function (i) {
                    return '!!' + value + '[' + i + ']'
                  })
                })

            case S_SAMPLE_COVERAGE:
              return parseParam(
                function (value) {
                  check$1.command(typeof value === 'object' && value, param, env.commandStr);
                  var sampleValue = 'value' in value ? value.value : 1;
                  var sampleInvert = !!value.invert;
                  check$1.command(
                    typeof sampleValue === 'number' &&
                    sampleValue >= 0 && sampleValue <= 1,
                    'sample.coverage.value must be a number between 0 and 1', env.commandStr);
                  return [sampleValue, sampleInvert]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid sample.coverage');
                  });
                  var VALUE = scope.def(
                    '"value" in ', value, '?+', value, '.value:1');
                  var INVERT = scope.def('!!', value, '.invert');
                  return [VALUE, INVERT]
                })
          }
        });

        return STATE
      }

      function parseUniforms (uniforms, env) {
        var staticUniforms = uniforms.static;
        var dynamicUniforms = uniforms.dynamic;

        var UNIFORMS = {};

        Object.keys(staticUniforms).forEach(function (name) {
          var value = staticUniforms[name];
          var result;
          if (typeof value === 'number' ||
              typeof value === 'boolean') {
            result = createStaticDecl(function () {
              return value
            });
          } else if (typeof value === 'function') {
            var reglType = value._reglType;
            if (reglType === 'texture2d' ||
                reglType === 'textureCube') {
              result = createStaticDecl(function (env) {
                return env.link(value)
              });
            } else if (reglType === 'framebuffer' ||
                       reglType === 'framebufferCube') {
              check$1.command(value.color.length > 0,
                'missing color attachment for framebuffer sent to uniform "' + name + '"', env.commandStr);
              result = createStaticDecl(function (env) {
                return env.link(value.color[0])
              });
            } else {
              check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
            }
          } else if (isArrayLike(value)) {
            result = createStaticDecl(function (env) {
              var ITEM = env.global.def('[',
                loop(value.length, function (i) {
                  check$1.command(
                    typeof value[i] === 'number' ||
                    typeof value[i] === 'boolean',
                    'invalid uniform ' + name, env.commandStr);
                  return value[i]
                }), ']');
              return ITEM
            });
          } else {
            check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
          }
          result.value = value;
          UNIFORMS[name] = result;
        });

        Object.keys(dynamicUniforms).forEach(function (key) {
          var dyn = dynamicUniforms[key];
          UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        });

        return UNIFORMS
      }

      function parseAttributes (attributes, env) {
        var staticAttributes = attributes.static;
        var dynamicAttributes = attributes.dynamic;

        var attributeDefs = {};

        Object.keys(staticAttributes).forEach(function (attribute) {
          var value = staticAttributes[attribute];
          var id = stringStore.id(attribute);

          var record = new AttributeRecord();
          if (isBufferArgs(value)) {
            record.state = ATTRIB_STATE_POINTER;
            record.buffer = bufferState.getBuffer(
              bufferState.create(value, GL_ARRAY_BUFFER$2, false, true));
            record.type = 0;
          } else {
            var buffer = bufferState.getBuffer(value);
            if (buffer) {
              record.state = ATTRIB_STATE_POINTER;
              record.buffer = buffer;
              record.type = 0;
            } else {
              check$1.command(typeof value === 'object' && value,
                'invalid data for attribute ' + attribute, env.commandStr);
              if ('constant' in value) {
                var constant = value.constant;
                record.buffer = 'null';
                record.state = ATTRIB_STATE_CONSTANT;
                if (typeof constant === 'number') {
                  record.x = constant;
                } else {
                  check$1.command(
                    isArrayLike(constant) &&
                    constant.length > 0 &&
                    constant.length <= 4,
                    'invalid constant for attribute ' + attribute, env.commandStr);
                  CUTE_COMPONENTS.forEach(function (c, i) {
                    if (i < constant.length) {
                      record[c] = constant[i];
                    }
                  });
                }
              } else {
                if (isBufferArgs(value.buffer)) {
                  buffer = bufferState.getBuffer(
                    bufferState.create(value.buffer, GL_ARRAY_BUFFER$2, false, true));
                } else {
                  buffer = bufferState.getBuffer(value.buffer);
                }
                check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);

                var offset = value.offset | 0;
                check$1.command(offset >= 0,
                  'invalid offset for attribute "' + attribute + '"', env.commandStr);

                var stride = value.stride | 0;
                check$1.command(stride >= 0 && stride < 256,
                  'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]', env.commandStr);

                var size = value.size | 0;
                check$1.command(!('size' in value) || (size > 0 && size <= 4),
                  'invalid size for attribute "' + attribute + '", must be 1,2,3,4', env.commandStr);

                var normalized = !!value.normalized;

                var type = 0;
                if ('type' in value) {
                  check$1.commandParameter(
                    value.type, glTypes,
                    'invalid type for attribute ' + attribute, env.commandStr);
                  type = glTypes[value.type];
                }

                var divisor = value.divisor | 0;
                check$1.optional(function () {
                  if ('divisor' in value) {
                    check$1.command(divisor === 0 || extInstancing,
                      'cannot specify divisor for attribute "' + attribute + '", instancing not supported', env.commandStr);
                    check$1.command(divisor >= 0,
                      'invalid divisor for attribute "' + attribute + '"', env.commandStr);
                  }

                  var command = env.commandStr;

                  var VALID_KEYS = [
                    'buffer',
                    'offset',
                    'divisor',
                    'normalized',
                    'type',
                    'size',
                    'stride'
                  ];

                  Object.keys(value).forEach(function (prop) {
                    check$1.command(
                      VALID_KEYS.indexOf(prop) >= 0,
                      'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ')',
                      command);
                  });
                });

                record.buffer = buffer;
                record.state = ATTRIB_STATE_POINTER;
                record.size = size;
                record.normalized = normalized;
                record.type = type || buffer.dtype;
                record.offset = offset;
                record.stride = stride;
                record.divisor = divisor;
              }
            }
          }

          attributeDefs[attribute] = createStaticDecl(function (env, scope) {
            var cache = env.attribCache;
            if (id in cache) {
              return cache[id]
            }
            var result = {
              isStream: false
            };
            Object.keys(record).forEach(function (key) {
              result[key] = record[key];
            });
            if (record.buffer) {
              result.buffer = env.link(record.buffer);
              result.type = result.type || (result.buffer + '.dtype');
            }
            cache[id] = result;
            return result
          });
        });

        Object.keys(dynamicAttributes).forEach(function (attribute) {
          var dyn = dynamicAttributes[attribute];

          function appendAttributeCode (env, block) {
            var VALUE = env.invoke(block, dyn);

            var shared = env.shared;
            var constants = env.constants;

            var IS_BUFFER_ARGS = shared.isBufferArgs;
            var BUFFER_STATE = shared.buffer;

            // Perform validation on attribute
            check$1.optional(function () {
              env.assert(block,
                VALUE + '&&(typeof ' + VALUE + '==="object"||typeof ' +
                VALUE + '==="function")&&(' +
                IS_BUFFER_ARGS + '(' + VALUE + ')||' +
                BUFFER_STATE + '.getBuffer(' + VALUE + ')||' +
                BUFFER_STATE + '.getBuffer(' + VALUE + '.buffer)||' +
                IS_BUFFER_ARGS + '(' + VALUE + '.buffer)||' +
                '("constant" in ' + VALUE +
                '&&(typeof ' + VALUE + '.constant==="number"||' +
                shared.isArrayLike + '(' + VALUE + '.constant))))',
                'invalid dynamic attribute "' + attribute + '"');
            });

            // allocate names for result
            var result = {
              isStream: block.def(false)
            };
            var defaultRecord = new AttributeRecord();
            defaultRecord.state = ATTRIB_STATE_POINTER;
            Object.keys(defaultRecord).forEach(function (key) {
              result[key] = block.def('' + defaultRecord[key]);
            });

            var BUFFER = result.buffer;
            var TYPE = result.type;
            block(
              'if(', IS_BUFFER_ARGS, '(', VALUE, ')){',
              result.isStream, '=true;',
              BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, ');',
              TYPE, '=', BUFFER, '.dtype;',
              '}else{',
              BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');',
              'if(', BUFFER, '){',
              TYPE, '=', BUFFER, '.dtype;',
              '}else if("constant" in ', VALUE, '){',
              result.state, '=', ATTRIB_STATE_CONSTANT, ';',
              'if(typeof ' + VALUE + '.constant === "number"){',
              result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;',
              CUTE_COMPONENTS.slice(1).map(function (n) {
                return result[n]
              }).join('='), '=0;',
              '}else{',
              CUTE_COMPONENTS.map(function (name, i) {
                return (
                  result[name] + '=' + VALUE + '.constant.length>' + i +
                  '?' + VALUE + '.constant[' + i + ']:0;'
                )
              }).join(''),
              '}}else{',
              'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){',
              BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, '.buffer);',
              '}else{',
              BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);',
              '}',
              TYPE, '="type" in ', VALUE, '?',
              constants.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;',
              result.normalized, '=!!', VALUE, '.normalized;');
            function emitReadRecord (name) {
              block(result[name], '=', VALUE, '.', name, '|0;');
            }
            emitReadRecord('size');
            emitReadRecord('offset');
            emitReadRecord('stride');
            emitReadRecord('divisor');

            block('}}');

            block.exit(
              'if(', result.isStream, '){',
              BUFFER_STATE, '.destroyStream(', BUFFER, ');',
              '}');

            return result
          }

          attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
        });

        return attributeDefs
      }

      function parseContext (context) {
        var staticContext = context.static;
        var dynamicContext = context.dynamic;
        var result = {};

        Object.keys(staticContext).forEach(function (name) {
          var value = staticContext[name];
          result[name] = createStaticDecl(function (env, scope) {
            if (typeof value === 'number' || typeof value === 'boolean') {
              return '' + value
            } else {
              return env.link(value)
            }
          });
        });

        Object.keys(dynamicContext).forEach(function (name) {
          var dyn = dynamicContext[name];
          result[name] = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        });

        return result
      }

      function parseArguments (options, attributes, uniforms, context, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        check$1.optional(function () {
          var KEY_NAMES = [
            S_FRAMEBUFFER,
            S_VERT,
            S_FRAG,
            S_ELEMENTS,
            S_PRIMITIVE,
            S_OFFSET,
            S_COUNT,
            S_INSTANCES,
            S_PROFILE,
            S_VAO
          ].concat(GL_STATE_NAMES);

          function checkKeys (dict) {
            Object.keys(dict).forEach(function (key) {
              check$1.command(
                KEY_NAMES.indexOf(key) >= 0,
                'unknown parameter "' + key + '"',
                env.commandStr);
            });
          }

          checkKeys(staticOptions);
          checkKeys(dynamicOptions);
        });

        var attribLocations = parseAttribLocations(options, attributes);

        var framebuffer = parseFramebuffer(options);
        var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
        var draw = parseDraw(options, env);
        var state = parseGLState(options, env);
        var shader = parseProgram(options, env, attribLocations);

        function copyBox (name) {
          var defn = viewportAndScissor[name];
          if (defn) {
            state[name] = defn;
          }
        }
        copyBox(S_VIEWPORT);
        copyBox(propName(S_SCISSOR_BOX));

        var dirty = Object.keys(state).length > 0;

        var result = {
          framebuffer: framebuffer,
          draw: draw,
          shader: shader,
          state: state,
          dirty: dirty,
          scopeVAO: null,
          drawVAO: null,
          useVAO: false,
          attributes: {}
        };

        result.profile = parseProfile(options);
        result.uniforms = parseUniforms(uniforms, env);
        result.drawVAO = result.scopeVAO = draw.vao;
        // special case: check if we can statically allocate a vertex array object for this program
        if (!result.drawVAO &&
          shader.program &&
          !attribLocations &&
          extensions.angle_instanced_arrays &&
          draw.static.elements) {
          var useVAO = true;
          var staticBindings = shader.program.attributes.map(function (attr) {
            var binding = attributes.static[attr];
            useVAO = useVAO && !!binding;
            return binding
          });
          if (useVAO && staticBindings.length > 0) {
            var vao = attributeState.getVAO(attributeState.createVAO({
              attributes: staticBindings,
              elements: draw.static.elements
            }));
            result.drawVAO = new Declaration(null, null, null, function (env, scope) {
              return env.link(vao)
            });
            result.useVAO = true;
          }
        }
        if (attribLocations) {
          result.useVAO = true;
        } else {
          result.attributes = parseAttributes(attributes, env);
        }
        result.context = parseContext(context);
        return result
      }

      // ===================================================
      // ===================================================
      // COMMON UPDATE FUNCTIONS
      // ===================================================
      // ===================================================
      function emitContext (env, scope, context) {
        var shared = env.shared;
        var CONTEXT = shared.context;

        var contextEnter = env.scope();

        Object.keys(context).forEach(function (name) {
          scope.save(CONTEXT, '.' + name);
          var defn = context[name];
          var value = defn.append(env, scope);
          if (Array.isArray(value)) {
            contextEnter(CONTEXT, '.', name, '=[', value.join(), '];');
          } else {
            contextEnter(CONTEXT, '.', name, '=', value, ';');
          }
        });

        scope(contextEnter);
      }

      // ===================================================
      // ===================================================
      // COMMON DRAWING FUNCTIONS
      // ===================================================
      // ===================================================
      function emitPollFramebuffer (env, scope, framebuffer, skipCheck) {
        var shared = env.shared;

        var GL = shared.gl;
        var FRAMEBUFFER_STATE = shared.framebuffer;
        var EXT_DRAW_BUFFERS;
        if (extDrawBuffers) {
          EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
        }

        var constants = env.constants;

        var DRAW_BUFFERS = constants.drawBuffer;
        var BACK_BUFFER = constants.backBuffer;

        var NEXT;
        if (framebuffer) {
          NEXT = framebuffer.append(env, scope);
        } else {
          NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
        }

        if (!skipCheck) {
          scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
        }
        scope(
          'if(', NEXT, '){',
          GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',', NEXT, '.framebuffer);');
        if (extDrawBuffers) {
          scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(',
            DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
        }
        scope('}else{',
          GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',null);');
        if (extDrawBuffers) {
          scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
        }
        scope(
          '}',
          FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
        if (!skipCheck) {
          scope('}');
        }
      }

      function emitPollState (env, scope, args) {
        var shared = env.shared;

        var GL = shared.gl;

        var CURRENT_VARS = env.current;
        var NEXT_VARS = env.next;
        var CURRENT_STATE = shared.current;
        var NEXT_STATE = shared.next;

        var block = env.cond(CURRENT_STATE, '.dirty');

        GL_STATE_NAMES.forEach(function (prop) {
          var param = propName(prop);
          if (param in args.state) {
            return
          }

          var NEXT, CURRENT;
          if (param in NEXT_VARS) {
            NEXT = NEXT_VARS[param];
            CURRENT = CURRENT_VARS[param];
            var parts = loop(currentState[param].length, function (i) {
              return block.def(NEXT, '[', i, ']')
            });
            block(env.cond(parts.map(function (p, i) {
              return p + '!==' + CURRENT + '[' + i + ']'
            }).join('||'))
              .then(
                GL, '.', GL_VARIABLES[param], '(', parts, ');',
                parts.map(function (p, i) {
                  return CURRENT + '[' + i + ']=' + p
                }).join(';'), ';'));
          } else {
            NEXT = block.def(NEXT_STATE, '.', param);
            var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
            block(ifte);
            if (param in GL_FLAGS) {
              ifte(
                env.cond(NEXT)
                  .then(GL, '.enable(', GL_FLAGS[param], ');')
                  .else(GL, '.disable(', GL_FLAGS[param], ');'),
                CURRENT_STATE, '.', param, '=', NEXT, ';');
            } else {
              ifte(
                GL, '.', GL_VARIABLES[param], '(', NEXT, ');',
                CURRENT_STATE, '.', param, '=', NEXT, ';');
            }
          }
        });
        if (Object.keys(args.state).length === 0) {
          block(CURRENT_STATE, '.dirty=false;');
        }
        scope(block);
      }

      function emitSetOptions (env, scope, options, filter) {
        var shared = env.shared;
        var CURRENT_VARS = env.current;
        var CURRENT_STATE = shared.current;
        var GL = shared.gl;
        sortState(Object.keys(options)).forEach(function (param) {
          var defn = options[param];
          if (filter && !filter(defn)) {
            return
          }
          var variable = defn.append(env, scope);
          if (GL_FLAGS[param]) {
            var flag = GL_FLAGS[param];
            if (isStatic(defn)) {
              if (variable) {
                scope(GL, '.enable(', flag, ');');
              } else {
                scope(GL, '.disable(', flag, ');');
              }
            } else {
              scope(env.cond(variable)
                .then(GL, '.enable(', flag, ');')
                .else(GL, '.disable(', flag, ');'));
            }
            scope(CURRENT_STATE, '.', param, '=', variable, ';');
          } else if (isArrayLike(variable)) {
            var CURRENT = CURRENT_VARS[param];
            scope(
              GL, '.', GL_VARIABLES[param], '(', variable, ');',
              variable.map(function (v, i) {
                return CURRENT + '[' + i + ']=' + v
              }).join(';'), ';');
          } else {
            scope(
              GL, '.', GL_VARIABLES[param], '(', variable, ');',
              CURRENT_STATE, '.', param, '=', variable, ';');
          }
        });
      }

      function injectExtensions (env, scope) {
        if (extInstancing) {
          env.instancing = scope.def(
            env.shared.extensions, '.angle_instanced_arrays');
        }
      }

      function emitProfile (env, scope, args, useScope, incrementCounter) {
        var shared = env.shared;
        var STATS = env.stats;
        var CURRENT_STATE = shared.current;
        var TIMER = shared.timer;
        var profileArg = args.profile;

        function perfCounter () {
          if (typeof performance === 'undefined') {
            return 'Date.now()'
          } else {
            return 'performance.now()'
          }
        }

        var CPU_START, QUERY_COUNTER;
        function emitProfileStart (block) {
          CPU_START = scope.def();
          block(CPU_START, '=', perfCounter(), ';');
          if (typeof incrementCounter === 'string') {
            block(STATS, '.count+=', incrementCounter, ';');
          } else {
            block(STATS, '.count++;');
          }
          if (timer) {
            if (useScope) {
              QUERY_COUNTER = scope.def();
              block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
            } else {
              block(TIMER, '.beginQuery(', STATS, ');');
            }
          }
        }

        function emitProfileEnd (block) {
          block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
          if (timer) {
            if (useScope) {
              block(TIMER, '.pushScopeStats(',
                QUERY_COUNTER, ',',
                TIMER, '.getNumPendingQueries(),',
                STATS, ');');
            } else {
              block(TIMER, '.endQuery();');
            }
          }
        }

        function scopeProfile (value) {
          var prev = scope.def(CURRENT_STATE, '.profile');
          scope(CURRENT_STATE, '.profile=', value, ';');
          scope.exit(CURRENT_STATE, '.profile=', prev, ';');
        }

        var USE_PROFILE;
        if (profileArg) {
          if (isStatic(profileArg)) {
            if (profileArg.enable) {
              emitProfileStart(scope);
              emitProfileEnd(scope.exit);
              scopeProfile('true');
            } else {
              scopeProfile('false');
            }
            return
          }
          USE_PROFILE = profileArg.append(env, scope);
          scopeProfile(USE_PROFILE);
        } else {
          USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
        }

        var start = env.block();
        emitProfileStart(start);
        scope('if(', USE_PROFILE, '){', start, '}');
        var end = env.block();
        emitProfileEnd(end);
        scope.exit('if(', USE_PROFILE, '){', end, '}');
      }

      function emitAttributes (env, scope, args, attributes, filter) {
        var shared = env.shared;

        function typeLength (x) {
          switch (x) {
            case GL_FLOAT_VEC2:
            case GL_INT_VEC2:
            case GL_BOOL_VEC2:
              return 2
            case GL_FLOAT_VEC3:
            case GL_INT_VEC3:
            case GL_BOOL_VEC3:
              return 3
            case GL_FLOAT_VEC4:
            case GL_INT_VEC4:
            case GL_BOOL_VEC4:
              return 4
            default:
              return 1
          }
        }

        function emitBindAttribute (ATTRIBUTE, size, record) {
          var GL = shared.gl;

          var LOCATION = scope.def(ATTRIBUTE, '.location');
          var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');

          var STATE = record.state;
          var BUFFER = record.buffer;
          var CONST_COMPONENTS = [
            record.x,
            record.y,
            record.z,
            record.w
          ];

          var COMMON_KEYS = [
            'buffer',
            'normalized',
            'offset',
            'stride'
          ];

          function emitBuffer () {
            scope(
              'if(!', BINDING, '.buffer){',
              GL, '.enableVertexAttribArray(', LOCATION, ');}');

            var TYPE = record.type;
            var SIZE;
            if (!record.size) {
              SIZE = size;
            } else {
              SIZE = scope.def(record.size, '||', size);
            }

            scope('if(',
              BINDING, '.type!==', TYPE, '||',
              BINDING, '.size!==', SIZE, '||',
              COMMON_KEYS.map(function (key) {
                return BINDING + '.' + key + '!==' + record[key]
              }).join('||'),
              '){',
              GL, '.bindBuffer(', GL_ARRAY_BUFFER$2, ',', BUFFER, '.buffer);',
              GL, '.vertexAttribPointer(', [
                LOCATION,
                SIZE,
                TYPE,
                record.normalized,
                record.stride,
                record.offset
              ], ');',
              BINDING, '.type=', TYPE, ';',
              BINDING, '.size=', SIZE, ';',
              COMMON_KEYS.map(function (key) {
                return BINDING + '.' + key + '=' + record[key] + ';'
              }).join(''),
              '}');

            if (extInstancing) {
              var DIVISOR = record.divisor;
              scope(
                'if(', BINDING, '.divisor!==', DIVISOR, '){',
                env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');',
                BINDING, '.divisor=', DIVISOR, ';}');
            }
          }

          function emitConstant () {
            scope(
              'if(', BINDING, '.buffer){',
              GL, '.disableVertexAttribArray(', LOCATION, ');',
              BINDING, '.buffer=null;',
              '}if(', CUTE_COMPONENTS.map(function (c, i) {
                return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i]
              }).join('||'), '){',
              GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');',
              CUTE_COMPONENTS.map(function (c, i) {
                return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';'
              }).join(''),
              '}');
          }

          if (STATE === ATTRIB_STATE_POINTER) {
            emitBuffer();
          } else if (STATE === ATTRIB_STATE_CONSTANT) {
            emitConstant();
          } else {
            scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
            emitBuffer();
            scope('}else{');
            emitConstant();
            scope('}');
          }
        }

        attributes.forEach(function (attribute) {
          var name = attribute.name;
          var arg = args.attributes[name];
          var record;
          if (arg) {
            if (!filter(arg)) {
              return
            }
            record = arg.append(env, scope);
          } else {
            if (!filter(SCOPE_DECL)) {
              return
            }
            var scopeAttrib = env.scopeAttrib(name);
            check$1.optional(function () {
              env.assert(scope,
                scopeAttrib + '.state',
                'missing attribute ' + name);
            });
            record = {};
            Object.keys(new AttributeRecord()).forEach(function (key) {
              record[key] = scope.def(scopeAttrib, '.', key);
            });
          }
          emitBindAttribute(
            env.link(attribute), typeLength(attribute.info.type), record);
        });
      }

      function emitUniforms (env, scope, args, uniforms, filter, isBatchInnerLoop) {
        var shared = env.shared;
        var GL = shared.gl;

        var definedArrUniforms = {};
        var infix;
        for (var i = 0; i < uniforms.length; ++i) {
          var uniform = uniforms[i];
          var name = uniform.name;
          var type = uniform.info.type;
          var size = uniform.info.size;
          var arg = args.uniforms[name];
          if (size > 1) {
            // either foo[n] or foos, avoid define both
            if (!arg) {
              continue
            }
            var arrUniformName = name.replace('[0]', '');
            if (definedArrUniforms[arrUniformName]) {
              continue
            }
            definedArrUniforms[arrUniformName] = 1;
          }
          var UNIFORM = env.link(uniform);
          var LOCATION = UNIFORM + '.location';

          var VALUE;
          if (arg) {
            if (!filter(arg)) {
              continue
            }
            if (isStatic(arg)) {
              var value = arg.value;
              check$1.command(
                value !== null && typeof value !== 'undefined',
                'missing uniform "' + name + '"', env.commandStr);
              if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
                check$1.command(
                  typeof value === 'function' &&
                  ((type === GL_SAMPLER_2D &&
                    (value._reglType === 'texture2d' ||
                    value._reglType === 'framebuffer')) ||
                  (type === GL_SAMPLER_CUBE &&
                    (value._reglType === 'textureCube' ||
                    value._reglType === 'framebufferCube'))),
                  'invalid texture for uniform ' + name, env.commandStr);
                var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
                scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
                scope.exit(TEX_VALUE, '.unbind();');
              } else if (
                type === GL_FLOAT_MAT2 ||
                type === GL_FLOAT_MAT3 ||
                type === GL_FLOAT_MAT4) {
                check$1.optional(function () {
                  check$1.command(isArrayLike(value),
                    'invalid matrix for uniform ' + name, env.commandStr);
                  check$1.command(
                    (type === GL_FLOAT_MAT2 && value.length === 4) ||
                    (type === GL_FLOAT_MAT3 && value.length === 9) ||
                    (type === GL_FLOAT_MAT4 && value.length === 16),
                    'invalid length for matrix uniform ' + name, env.commandStr);
                });
                var MAT_VALUE = env.global.def('new Float32Array([' +
                  Array.prototype.slice.call(value) + '])');
                var dim = 2;
                if (type === GL_FLOAT_MAT3) {
                  dim = 3;
                } else if (type === GL_FLOAT_MAT4) {
                  dim = 4;
                }
                scope(
                  GL, '.uniformMatrix', dim, 'fv(',
                  LOCATION, ',false,', MAT_VALUE, ');');
              } else {
                switch (type) {
                  case GL_FLOAT$8:
                    if (size === 1) {
                      check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                    } else {
                      check$1.command(
                        isArrayLike(value) && (value.length === size),
                        'uniform ' + name, env.commandStr);
                    }
                    infix = '1f';
                    break
                  case GL_FLOAT_VEC2:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
                      'uniform ' + name, env.commandStr);
                    infix = '2f';
                    break
                  case GL_FLOAT_VEC3:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
                      'uniform ' + name, env.commandStr);
                    infix = '3f';
                    break
                  case GL_FLOAT_VEC4:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
                      'uniform ' + name, env.commandStr);
                    infix = '4f';
                    break
                  case GL_BOOL:
                    if (size === 1) {
                      check$1.commandType(value, 'boolean', 'uniform ' + name, env.commandStr);
                    } else {
                      check$1.command(
                        isArrayLike(value) && (value.length === size),
                        'uniform ' + name, env.commandStr);
                    }
                    infix = '1i';
                    break
                  case GL_INT$3:
                    if (size === 1) {
                      check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                    } else {
                      check$1.command(
                        isArrayLike(value) && (value.length === size),
                        'uniform ' + name, env.commandStr);
                    }
                    infix = '1i';
                    break
                  case GL_BOOL_VEC2:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
                      'uniform ' + name, env.commandStr);
                    infix = '2i';
                    break
                  case GL_INT_VEC2:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
                      'uniform ' + name, env.commandStr);
                    infix = '2i';
                    break
                  case GL_BOOL_VEC3:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
                      'uniform ' + name, env.commandStr);
                    infix = '3i';
                    break
                  case GL_INT_VEC3:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
                      'uniform ' + name, env.commandStr);
                    infix = '3i';
                    break
                  case GL_BOOL_VEC4:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
                      'uniform ' + name, env.commandStr);
                    infix = '4i';
                    break
                  case GL_INT_VEC4:
                    check$1.command(
                      isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
                      'uniform ' + name, env.commandStr);
                    infix = '4i';
                    break
                }
                if (size > 1) {
                  infix += 'v';
                  value = env.global.def('[' +
                  Array.prototype.slice.call(value) + ']');
                } else {
                  value = isArrayLike(value) ? Array.prototype.slice.call(value) : value;
                }
                scope(GL, '.uniform', infix, '(', LOCATION, ',',
                  value,
                  ');');
              }
              continue
            } else {
              VALUE = arg.append(env, scope);
            }
          } else {
            if (!filter(SCOPE_DECL)) {
              continue
            }
            VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
          }

          if (type === GL_SAMPLER_2D) {
            check$1(!Array.isArray(VALUE), 'must specify a scalar prop for textures');
            scope(
              'if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){',
              VALUE, '=', VALUE, '.color[0];',
              '}');
          } else if (type === GL_SAMPLER_CUBE) {
            check$1(!Array.isArray(VALUE), 'must specify a scalar prop for cube maps');
            scope(
              'if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){',
              VALUE, '=', VALUE, '.color[0];',
              '}');
          }

          // perform type validation
          check$1.optional(function () {
            function emitCheck (pred, message) {
              env.assert(scope, pred,
                'bad data or missing for uniform "' + name + '".  ' + message);
            }

            function checkType (type, size) {
              if (size === 1) {
                check$1(!Array.isArray(VALUE), 'must not specify an array type for uniform');
              }
              emitCheck(
                'Array.isArray(' + VALUE + ') && typeof ' + VALUE + '[0]===" ' + type + '"' +
                ' || typeof ' + VALUE + '==="' + type + '"',
                'invalid type, expected ' + type);
            }

            function checkVector (n, type, size) {
              if (Array.isArray(VALUE)) {
                check$1(VALUE.length && VALUE.length % n === 0 && VALUE.length <= n * size, 'must have length of ' + (size === 1 ? '' : 'n * ') + n);
              } else {
                emitCheck(
                  shared.isArrayLike + '(' + VALUE + ')&&' + VALUE + '.length && ' + VALUE + '.length % ' + n + ' === 0' +
                  ' && ' + VALUE + '.length<=' + n * size,
                  'invalid vector, should have length of ' + (size === 1 ? '' : 'n * ') + n, env.commandStr);
              }
            }

            function checkTexture (target) {
              check$1(!Array.isArray(VALUE), 'must not specify a value type');
              emitCheck(
                'typeof ' + VALUE + '==="function"&&' +
                VALUE + '._reglType==="texture' +
                (target === GL_TEXTURE_2D$3 ? '2d' : 'Cube') + '"',
                'invalid texture type', env.commandStr);
            }

            switch (type) {
              case GL_INT$3:
                checkType('number', size);
                break
              case GL_INT_VEC2:
                checkVector(2, 'number', size);
                break
              case GL_INT_VEC3:
                checkVector(3, 'number', size);
                break
              case GL_INT_VEC4:
                checkVector(4, 'number', size);
                break
              case GL_FLOAT$8:
                checkType('number', size);
                break
              case GL_FLOAT_VEC2:
                checkVector(2, 'number', size);
                break
              case GL_FLOAT_VEC3:
                checkVector(3, 'number', size);
                break
              case GL_FLOAT_VEC4:
                checkVector(4, 'number', size);
                break
              case GL_BOOL:
                checkType('boolean', size);
                break
              case GL_BOOL_VEC2:
                checkVector(2, 'boolean', size);
                break
              case GL_BOOL_VEC3:
                checkVector(3, 'boolean', size);
                break
              case GL_BOOL_VEC4:
                checkVector(4, 'boolean', size);
                break
              case GL_FLOAT_MAT2:
                checkVector(4, 'number', size);
                break
              case GL_FLOAT_MAT3:
                checkVector(9, 'number', size);
                break
              case GL_FLOAT_MAT4:
                checkVector(16, 'number', size);
                break
              case GL_SAMPLER_2D:
                checkTexture(GL_TEXTURE_2D$3);
                break
              case GL_SAMPLER_CUBE:
                checkTexture(GL_TEXTURE_CUBE_MAP$2);
                break
            }
          });

          var unroll = 1;
          switch (type) {
            case GL_SAMPLER_2D:
            case GL_SAMPLER_CUBE:
              var TEX = scope.def(VALUE, '._texture');
              scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
              scope.exit(TEX, '.unbind();');
              continue

            case GL_INT$3:
            case GL_BOOL:
              infix = '1i';
              break

            case GL_INT_VEC2:
            case GL_BOOL_VEC2:
              infix = '2i';
              unroll = 2;
              break

            case GL_INT_VEC3:
            case GL_BOOL_VEC3:
              infix = '3i';
              unroll = 3;
              break

            case GL_INT_VEC4:
            case GL_BOOL_VEC4:
              infix = '4i';
              unroll = 4;
              break

            case GL_FLOAT$8:
              infix = '1f';
              break

            case GL_FLOAT_VEC2:
              infix = '2f';
              unroll = 2;
              break

            case GL_FLOAT_VEC3:
              infix = '3f';
              unroll = 3;
              break

            case GL_FLOAT_VEC4:
              infix = '4f';
              unroll = 4;
              break

            case GL_FLOAT_MAT2:
              infix = 'Matrix2fv';
              break

            case GL_FLOAT_MAT3:
              infix = 'Matrix3fv';
              break

            case GL_FLOAT_MAT4:
              infix = 'Matrix4fv';
              break
          }

          if (infix.indexOf('Matrix') === -1 && size > 1) {
            infix += 'v';
            unroll = 1;
          }

          if (infix.charAt(0) === 'M') {
            scope(GL, '.uniform', infix, '(', LOCATION, ',');
            var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
            var STORAGE = env.global.def('new Float32Array(', matSize, ')');
            if (Array.isArray(VALUE)) {
              scope(
                'false,(',
                loop(matSize, function (i) {
                  return STORAGE + '[' + i + ']=' + VALUE[i]
                }), ',', STORAGE, ')');
            } else {
              scope(
                'false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(',
                loop(matSize, function (i) {
                  return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']'
                }), ',', STORAGE, ')');
            }
            scope(');');
          } else if (unroll > 1) {
            var prev = [];
            var cur = [];
            for (var j = 0; j < unroll; ++j) {
              if (Array.isArray(VALUE)) {
                cur.push(VALUE[j]);
              } else {
                cur.push(scope.def(VALUE + '[' + j + ']'));
              }
              if (isBatchInnerLoop) {
                prev.push(scope.def());
              }
            }
            if (isBatchInnerLoop) {
              scope('if(!', env.batchId, '||', prev.map(function (p, i) {
                return p + '!==' + cur[i]
              }).join('||'), '){', prev.map(function (p, i) {
                return p + '=' + cur[i] + ';'
              }).join(''));
            }
            scope(GL, '.uniform', infix, '(', LOCATION, ',', cur.join(','), ');');
            if (isBatchInnerLoop) {
              scope('}');
            }
          } else {
            check$1(!Array.isArray(VALUE), 'uniform value must not be an array');
            if (isBatchInnerLoop) {
              var prevS = scope.def();
              scope('if(!', env.batchId, '||', prevS, '!==', VALUE, '){',
                prevS, '=', VALUE, ';');
            }
            scope(GL, '.uniform', infix, '(', LOCATION, ',', VALUE, ');');
            if (isBatchInnerLoop) {
              scope('}');
            }
          }
        }
      }

      function emitDraw (env, outer, inner, args) {
        var shared = env.shared;
        var GL = shared.gl;
        var DRAW_STATE = shared.draw;

        var drawOptions = args.draw;

        function emitElements () {
          var defn = drawOptions.elements;
          var ELEMENTS;
          var scope = outer;
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              scope = inner;
            }
            ELEMENTS = defn.append(env, scope);
            if (drawOptions.elementsActive) {
              scope(
                'if(' + ELEMENTS + ')' +
                GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);');
            }
          } else {
            ELEMENTS = scope.def();
            scope(
              ELEMENTS, '=', DRAW_STATE, '.', S_ELEMENTS, ';',
              'if(', ELEMENTS, '){',
              GL, '.bindBuffer(', GL_ELEMENT_ARRAY_BUFFER$2, ',', ELEMENTS, '.buffer.buffer);}',
              'else if(', shared.vao, '.currentVAO){',
              ELEMENTS, '=', env.shared.elements + '.getElements(' + shared.vao, '.currentVAO.elements);',
              (!extVertexArrays ? 'if(' + ELEMENTS + ')' + GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);' : ''),
              '}');
          }
          return ELEMENTS
        }

        function emitCount () {
          var defn = drawOptions.count;
          var COUNT;
          var scope = outer;
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              scope = inner;
            }
            COUNT = defn.append(env, scope);
            check$1.optional(function () {
              if (defn.MISSING) {
                env.assert(outer, 'false', 'missing vertex count');
              }
              if (defn.DYNAMIC) {
                env.assert(scope, COUNT + '>=0', 'missing vertex count');
              }
            });
          } else {
            COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
            check$1.optional(function () {
              env.assert(scope, COUNT + '>=0', 'missing vertex count');
            });
          }
          return COUNT
        }

        var ELEMENTS = emitElements();
        function emitValue (name) {
          var defn = drawOptions[name];
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              return defn.append(env, inner)
            } else {
              return defn.append(env, outer)
            }
          } else {
            return outer.def(DRAW_STATE, '.', name)
          }
        }

        var PRIMITIVE = emitValue(S_PRIMITIVE);
        var OFFSET = emitValue(S_OFFSET);

        var COUNT = emitCount();
        if (typeof COUNT === 'number') {
          if (COUNT === 0) {
            return
          }
        } else {
          inner('if(', COUNT, '){');
          inner.exit('}');
        }

        var INSTANCES, EXT_INSTANCING;
        if (extInstancing) {
          INSTANCES = emitValue(S_INSTANCES);
          EXT_INSTANCING = env.instancing;
        }

        var ELEMENT_TYPE = ELEMENTS + '.type';

        var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements) && !drawOptions.vaoActive;

        function emitInstancing () {
          function drawElements () {
            inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
              PRIMITIVE,
              COUNT,
              ELEMENT_TYPE,
              OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)',
              INSTANCES
            ], ');');
          }

          function drawArrays () {
            inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(',
              [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
          }

          if (ELEMENTS && ELEMENTS !== 'null') {
            if (!elementsStatic) {
              inner('if(', ELEMENTS, '){');
              drawElements();
              inner('}else{');
              drawArrays();
              inner('}');
            } else {
              drawElements();
            }
          } else {
            drawArrays();
          }
        }

        function emitRegular () {
          function drawElements () {
            inner(GL + '.drawElements(' + [
              PRIMITIVE,
              COUNT,
              ELEMENT_TYPE,
              OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)'
            ] + ');');
          }

          function drawArrays () {
            inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
          }

          if (ELEMENTS && ELEMENTS !== 'null') {
            if (!elementsStatic) {
              inner('if(', ELEMENTS, '){');
              drawElements();
              inner('}else{');
              drawArrays();
              inner('}');
            } else {
              drawElements();
            }
          } else {
            drawArrays();
          }
        }

        if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
          if (typeof INSTANCES === 'string') {
            inner('if(', INSTANCES, '>0){');
            emitInstancing();
            inner('}else if(', INSTANCES, '<0){');
            emitRegular();
            inner('}');
          } else {
            emitInstancing();
          }
        } else {
          emitRegular();
        }
      }

      function createBody (emitBody, parentEnv, args, program, count) {
        var env = createREGLEnvironment();
        var scope = env.proc('body', count);
        check$1.optional(function () {
          env.commandStr = parentEnv.commandStr;
          env.command = env.link(parentEnv.commandStr);
        });
        if (extInstancing) {
          env.instancing = scope.def(
            env.shared.extensions, '.angle_instanced_arrays');
        }
        emitBody(env, scope, args, program);
        return env.compile().body
      }

      // ===================================================
      // ===================================================
      // DRAW PROC
      // ===================================================
      // ===================================================
      function emitDrawBody (env, draw, args, program) {
        injectExtensions(env, draw);
        if (args.useVAO) {
          if (args.drawVAO) {
            draw(env.shared.vao, '.setVAO(', args.drawVAO.append(env, draw), ');');
          } else {
            draw(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
          }
        } else {
          draw(env.shared.vao, '.setVAO(null);');
          emitAttributes(env, draw, args, program.attributes, function () {
            return true
          });
        }
        emitUniforms(env, draw, args, program.uniforms, function () {
          return true
        }, false);
        emitDraw(env, draw, draw, args);
      }

      function emitDrawProc (env, args) {
        var draw = env.proc('draw', 1);

        injectExtensions(env, draw);

        emitContext(env, draw, args.context);
        emitPollFramebuffer(env, draw, args.framebuffer);

        emitPollState(env, draw, args);
        emitSetOptions(env, draw, args.state);

        emitProfile(env, draw, args, false, true);

        var program = args.shader.progVar.append(env, draw);
        draw(env.shared.gl, '.useProgram(', program, '.program);');

        if (args.shader.program) {
          emitDrawBody(env, draw, args, args.shader.program);
        } else {
          draw(env.shared.vao, '.setVAO(null);');
          var drawCache = env.global.def('{}');
          var PROG_ID = draw.def(program, '.id');
          var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
          draw(
            env.cond(CACHED_PROC)
              .then(CACHED_PROC, '.call(this,a0);')
              .else(
                CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=',
                env.link(function (program) {
                  return createBody(emitDrawBody, env, args, program, 1)
                }), '(', program, ');',
                CACHED_PROC, '.call(this,a0);'));
        }

        if (Object.keys(args.state).length > 0) {
          draw(env.shared.current, '.dirty=true;');
        }
        if (env.shared.vao) {
          draw(env.shared.vao, '.setVAO(null);');
        }
      }

      // ===================================================
      // ===================================================
      // BATCH PROC
      // ===================================================
      // ===================================================

      function emitBatchDynamicShaderBody (env, scope, args, program) {
        env.batchId = 'a1';

        injectExtensions(env, scope);

        function all () {
          return true
        }

        emitAttributes(env, scope, args, program.attributes, all);
        emitUniforms(env, scope, args, program.uniforms, all, false);
        emitDraw(env, scope, scope, args);
      }

      function emitBatchBody (env, scope, args, program) {
        injectExtensions(env, scope);

        var contextDynamic = args.contextDep;

        var BATCH_ID = scope.def();
        var PROP_LIST = 'a0';
        var NUM_PROPS = 'a1';
        var PROPS = scope.def();
        env.shared.props = PROPS;
        env.batchId = BATCH_ID;

        var outer = env.scope();
        var inner = env.scope();

        scope(
          outer.entry,
          'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){',
          PROPS, '=', PROP_LIST, '[', BATCH_ID, '];',
          inner,
          '}',
          outer.exit);

        function isInnerDefn (defn) {
          return ((defn.contextDep && contextDynamic) || defn.propDep)
        }

        function isOuterDefn (defn) {
          return !isInnerDefn(defn)
        }

        if (args.needsContext) {
          emitContext(env, inner, args.context);
        }
        if (args.needsFramebuffer) {
          emitPollFramebuffer(env, inner, args.framebuffer);
        }
        emitSetOptions(env, inner, args.state, isInnerDefn);

        if (args.profile && isInnerDefn(args.profile)) {
          emitProfile(env, inner, args, false, true);
        }

        if (!program) {
          var progCache = env.global.def('{}');
          var PROGRAM = args.shader.progVar.append(env, inner);
          var PROG_ID = inner.def(PROGRAM, '.id');
          var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
          inner(
            env.shared.gl, '.useProgram(', PROGRAM, '.program);',
            'if(!', CACHED_PROC, '){',
            CACHED_PROC, '=', progCache, '[', PROG_ID, ']=',
            env.link(function (program) {
              return createBody(
                emitBatchDynamicShaderBody, env, args, program, 2)
            }), '(', PROGRAM, ');}',
            CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
        } else {
          if (args.useVAO) {
            if (args.drawVAO) {
              if (isInnerDefn(args.drawVAO)) {
                // vao is a prop
                inner(env.shared.vao, '.setVAO(', args.drawVAO.append(env, inner), ');');
              } else {
                // vao is invariant
                outer(env.shared.vao, '.setVAO(', args.drawVAO.append(env, outer), ');');
              }
            } else {
              // scoped vao binding
              outer(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
            }
          } else {
            outer(env.shared.vao, '.setVAO(null);');
            emitAttributes(env, outer, args, program.attributes, isOuterDefn);
            emitAttributes(env, inner, args, program.attributes, isInnerDefn);
          }
          emitUniforms(env, outer, args, program.uniforms, isOuterDefn, false);
          emitUniforms(env, inner, args, program.uniforms, isInnerDefn, true);
          emitDraw(env, outer, inner, args);
        }
      }

      function emitBatchProc (env, args) {
        var batch = env.proc('batch', 2);
        env.batchId = '0';

        injectExtensions(env, batch);

        // Check if any context variables depend on props
        var contextDynamic = false;
        var needsContext = true;
        Object.keys(args.context).forEach(function (name) {
          contextDynamic = contextDynamic || args.context[name].propDep;
        });
        if (!contextDynamic) {
          emitContext(env, batch, args.context);
          needsContext = false;
        }

        // framebuffer state affects framebufferWidth/height context vars
        var framebuffer = args.framebuffer;
        var needsFramebuffer = false;
        if (framebuffer) {
          if (framebuffer.propDep) {
            contextDynamic = needsFramebuffer = true;
          } else if (framebuffer.contextDep && contextDynamic) {
            needsFramebuffer = true;
          }
          if (!needsFramebuffer) {
            emitPollFramebuffer(env, batch, framebuffer);
          }
        } else {
          emitPollFramebuffer(env, batch, null);
        }

        // viewport is weird because it can affect context vars
        if (args.state.viewport && args.state.viewport.propDep) {
          contextDynamic = true;
        }

        function isInnerDefn (defn) {
          return (defn.contextDep && contextDynamic) || defn.propDep
        }

        // set webgl options
        emitPollState(env, batch, args);
        emitSetOptions(env, batch, args.state, function (defn) {
          return !isInnerDefn(defn)
        });

        if (!args.profile || !isInnerDefn(args.profile)) {
          emitProfile(env, batch, args, false, 'a1');
        }

        // Save these values to args so that the batch body routine can use them
        args.contextDep = contextDynamic;
        args.needsContext = needsContext;
        args.needsFramebuffer = needsFramebuffer;

        // determine if shader is dynamic
        var progDefn = args.shader.progVar;
        if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
          emitBatchBody(
            env,
            batch,
            args,
            null);
        } else {
          var PROGRAM = progDefn.append(env, batch);
          batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
          if (args.shader.program) {
            emitBatchBody(
              env,
              batch,
              args,
              args.shader.program);
          } else {
            batch(env.shared.vao, '.setVAO(null);');
            var batchCache = env.global.def('{}');
            var PROG_ID = batch.def(PROGRAM, '.id');
            var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
            batch(
              env.cond(CACHED_PROC)
                .then(CACHED_PROC, '.call(this,a0,a1);')
                .else(
                  CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=',
                  env.link(function (program) {
                    return createBody(emitBatchBody, env, args, program, 2)
                  }), '(', PROGRAM, ');',
                  CACHED_PROC, '.call(this,a0,a1);'));
          }
        }

        if (Object.keys(args.state).length > 0) {
          batch(env.shared.current, '.dirty=true;');
        }

        if (env.shared.vao) {
          batch(env.shared.vao, '.setVAO(null);');
        }
      }

      // ===================================================
      // ===================================================
      // SCOPE COMMAND
      // ===================================================
      // ===================================================
      function emitScopeProc (env, args) {
        var scope = env.proc('scope', 3);
        env.batchId = 'a2';

        var shared = env.shared;
        var CURRENT_STATE = shared.current;

        emitContext(env, scope, args.context);

        if (args.framebuffer) {
          args.framebuffer.append(env, scope);
        }

        sortState(Object.keys(args.state)).forEach(function (name) {
          var defn = args.state[name];
          var value = defn.append(env, scope);
          if (isArrayLike(value)) {
            value.forEach(function (v, i) {
              scope.set(env.next[name], '[' + i + ']', v);
            });
          } else {
            scope.set(shared.next, '.' + name, value);
          }
        });

        emitProfile(env, scope, args, true, true)

        ;[S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
          function (opt) {
            var variable = args.draw[opt];
            if (!variable) {
              return
            }
            scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
          });

        Object.keys(args.uniforms).forEach(function (opt) {
          var value = args.uniforms[opt].append(env, scope);
          if (Array.isArray(value)) {
            value = '[' + value.join() + ']';
          }
          scope.set(
            shared.uniforms,
            '[' + stringStore.id(opt) + ']',
            value);
        });

        Object.keys(args.attributes).forEach(function (name) {
          var record = args.attributes[name].append(env, scope);
          var scopeAttrib = env.scopeAttrib(name);
          Object.keys(new AttributeRecord()).forEach(function (prop) {
            scope.set(scopeAttrib, '.' + prop, record[prop]);
          });
        });

        if (args.scopeVAO) {
          scope.set(shared.vao, '.targetVAO', args.scopeVAO.append(env, scope));
        }

        function saveShader (name) {
          var shader = args.shader[name];
          if (shader) {
            scope.set(shared.shader, '.' + name, shader.append(env, scope));
          }
        }
        saveShader(S_VERT);
        saveShader(S_FRAG);

        if (Object.keys(args.state).length > 0) {
          scope(CURRENT_STATE, '.dirty=true;');
          scope.exit(CURRENT_STATE, '.dirty=true;');
        }

        scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
      }

      function isDynamicObject (object) {
        if (typeof object !== 'object' || isArrayLike(object)) {
          return
        }
        var props = Object.keys(object);
        for (var i = 0; i < props.length; ++i) {
          if (dynamic.isDynamic(object[props[i]])) {
            return true
          }
        }
        return false
      }

      function splatObject (env, options, name) {
        var object = options.static[name];
        if (!object || !isDynamicObject(object)) {
          return
        }

        var globals = env.global;
        var keys = Object.keys(object);
        var thisDep = false;
        var contextDep = false;
        var propDep = false;
        var objectRef = env.global.def('{}');
        keys.forEach(function (key) {
          var value = object[key];
          if (dynamic.isDynamic(value)) {
            if (typeof value === 'function') {
              value = object[key] = dynamic.unbox(value);
            }
            var deps = createDynamicDecl(value, null);
            thisDep = thisDep || deps.thisDep;
            propDep = propDep || deps.propDep;
            contextDep = contextDep || deps.contextDep;
          } else {
            globals(objectRef, '.', key, '=');
            switch (typeof value) {
              case 'number':
                globals(value);
                break
              case 'string':
                globals('"', value, '"');
                break
              case 'object':
                if (Array.isArray(value)) {
                  globals('[', value.join(), ']');
                }
                break
              default:
                globals(env.link(value));
                break
            }
            globals(';');
          }
        });

        function appendBlock (env, block) {
          keys.forEach(function (key) {
            var value = object[key];
            if (!dynamic.isDynamic(value)) {
              return
            }
            var ref = env.invoke(block, value);
            block(objectRef, '.', key, '=', ref, ';');
          });
        }

        options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
          thisDep: thisDep,
          contextDep: contextDep,
          propDep: propDep,
          ref: objectRef,
          append: appendBlock
        });
        delete options.static[name];
      }

      // ===========================================================================
      // ===========================================================================
      // MAIN DRAW COMMAND
      // ===========================================================================
      // ===========================================================================
      function compileCommand (options, attributes, uniforms, context, stats) {
        var env = createREGLEnvironment();

        // link stats, so that we can easily access it in the program.
        env.stats = env.link(stats);

        // splat options and attributes to allow for dynamic nested properties
        Object.keys(attributes.static).forEach(function (key) {
          splatObject(env, attributes, key);
        });
        NESTED_OPTIONS.forEach(function (name) {
          splatObject(env, options, name);
        });

        var args = parseArguments(options, attributes, uniforms, context, env);

        emitDrawProc(env, args);
        emitScopeProc(env, args);
        emitBatchProc(env, args);

        return extend(env.compile(), {
          destroy: function () {
            args.shader.program.destroy();
          }
        })
      }

      // ===========================================================================
      // ===========================================================================
      // POLL / REFRESH
      // ===========================================================================
      // ===========================================================================
      return {
        next: nextState,
        current: currentState,
        procs: (function () {
          var env = createREGLEnvironment();
          var poll = env.proc('poll');
          var refresh = env.proc('refresh');
          var common = env.block();
          poll(common);
          refresh(common);

          var shared = env.shared;
          var GL = shared.gl;
          var NEXT_STATE = shared.next;
          var CURRENT_STATE = shared.current;

          common(CURRENT_STATE, '.dirty=false;');

          emitPollFramebuffer(env, poll);
          emitPollFramebuffer(env, refresh, null, true);

          // Refresh updates all attribute state changes
          var INSTANCING;
          if (extInstancing) {
            INSTANCING = env.link(extInstancing);
          }

          // update vertex array bindings
          if (extensions.oes_vertex_array_object) {
            refresh(env.link(extensions.oes_vertex_array_object), '.bindVertexArrayOES(null);');
          }
          for (var i = 0; i < limits.maxAttributes; ++i) {
            var BINDING = refresh.def(shared.attributes, '[', i, ']');
            var ifte = env.cond(BINDING, '.buffer');
            ifte.then(
              GL, '.enableVertexAttribArray(', i, ');',
              GL, '.bindBuffer(',
              GL_ARRAY_BUFFER$2, ',',
              BINDING, '.buffer.buffer);',
              GL, '.vertexAttribPointer(',
              i, ',',
              BINDING, '.size,',
              BINDING, '.type,',
              BINDING, '.normalized,',
              BINDING, '.stride,',
              BINDING, '.offset);'
            ).else(
              GL, '.disableVertexAttribArray(', i, ');',
              GL, '.vertexAttrib4f(',
              i, ',',
              BINDING, '.x,',
              BINDING, '.y,',
              BINDING, '.z,',
              BINDING, '.w);',
              BINDING, '.buffer=null;');
            refresh(ifte);
            if (extInstancing) {
              refresh(
                INSTANCING, '.vertexAttribDivisorANGLE(',
                i, ',',
                BINDING, '.divisor);');
            }
          }
          refresh(
            env.shared.vao, '.currentVAO=null;',
            env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');

          Object.keys(GL_FLAGS).forEach(function (flag) {
            var cap = GL_FLAGS[flag];
            var NEXT = common.def(NEXT_STATE, '.', flag);
            var block = env.block();
            block('if(', NEXT, '){',
              GL, '.enable(', cap, ')}else{',
              GL, '.disable(', cap, ')}',
              CURRENT_STATE, '.', flag, '=', NEXT, ';');
            refresh(block);
            poll(
              'if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){',
              block,
              '}');
          });

          Object.keys(GL_VARIABLES).forEach(function (name) {
            var func = GL_VARIABLES[name];
            var init = currentState[name];
            var NEXT, CURRENT;
            var block = env.block();
            block(GL, '.', func, '(');
            if (isArrayLike(init)) {
              var n = init.length;
              NEXT = env.global.def(NEXT_STATE, '.', name);
              CURRENT = env.global.def(CURRENT_STATE, '.', name);
              block(
                loop(n, function (i) {
                  return NEXT + '[' + i + ']'
                }), ');',
                loop(n, function (i) {
                  return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];'
                }).join(''));
              poll(
                'if(', loop(n, function (i) {
                  return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']'
                }).join('||'), '){',
                block,
                '}');
            } else {
              NEXT = common.def(NEXT_STATE, '.', name);
              CURRENT = common.def(CURRENT_STATE, '.', name);
              block(
                NEXT, ');',
                CURRENT_STATE, '.', name, '=', NEXT, ';');
              poll(
                'if(', NEXT, '!==', CURRENT, '){',
                block,
                '}');
            }
            refresh(block);
          });

          return env.compile()
        })(),
        compile: compileCommand
      }
    }

    function stats () {
      return {
        vaoCount: 0,
        bufferCount: 0,
        elementsCount: 0,
        framebufferCount: 0,
        shaderCount: 0,
        textureCount: 0,
        cubeCount: 0,
        renderbufferCount: 0,
        maxTextureUnits: 0
      }
    }

    var GL_QUERY_RESULT_EXT = 0x8866;
    var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
    var GL_TIME_ELAPSED_EXT = 0x88BF;

    var createTimer = function (gl, extensions) {
      if (!extensions.ext_disjoint_timer_query) {
        return null
      }

      // QUERY POOL BEGIN
      var queryPool = [];
      function allocQuery () {
        return queryPool.pop() || extensions.ext_disjoint_timer_query.createQueryEXT()
      }
      function freeQuery (query) {
        queryPool.push(query);
      }
      // QUERY POOL END

      var pendingQueries = [];
      function beginQuery (stats) {
        var query = allocQuery();
        extensions.ext_disjoint_timer_query.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
        pendingQueries.push(query);
        pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
      }

      function endQuery () {
        extensions.ext_disjoint_timer_query.endQueryEXT(GL_TIME_ELAPSED_EXT);
      }

      //
      // Pending stats pool.
      //
      function PendingStats () {
        this.startQueryIndex = -1;
        this.endQueryIndex = -1;
        this.sum = 0;
        this.stats = null;
      }
      var pendingStatsPool = [];
      function allocPendingStats () {
        return pendingStatsPool.pop() || new PendingStats()
      }
      function freePendingStats (pendingStats) {
        pendingStatsPool.push(pendingStats);
      }
      // Pending stats pool end

      var pendingStats = [];
      function pushScopeStats (start, end, stats) {
        var ps = allocPendingStats();
        ps.startQueryIndex = start;
        ps.endQueryIndex = end;
        ps.sum = 0;
        ps.stats = stats;
        pendingStats.push(ps);
      }

      // we should call this at the beginning of the frame,
      // in order to update gpuTime
      var timeSum = [];
      var queryPtr = [];
      function update () {
        var ptr, i;

        var n = pendingQueries.length;
        if (n === 0) {
          return
        }

        // Reserve space
        queryPtr.length = Math.max(queryPtr.length, n + 1);
        timeSum.length = Math.max(timeSum.length, n + 1);
        timeSum[0] = 0;
        queryPtr[0] = 0;

        // Update all pending timer queries
        var queryTime = 0;
        ptr = 0;
        for (i = 0; i < pendingQueries.length; ++i) {
          var query = pendingQueries[i];
          if (extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
            queryTime += extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
            freeQuery(query);
          } else {
            pendingQueries[ptr++] = query;
          }
          timeSum[i + 1] = queryTime;
          queryPtr[i + 1] = ptr;
        }
        pendingQueries.length = ptr;

        // Update all pending stat queries
        ptr = 0;
        for (i = 0; i < pendingStats.length; ++i) {
          var stats = pendingStats[i];
          var start = stats.startQueryIndex;
          var end = stats.endQueryIndex;
          stats.sum += timeSum[end] - timeSum[start];
          var startPtr = queryPtr[start];
          var endPtr = queryPtr[end];
          if (endPtr === startPtr) {
            stats.stats.gpuTime += stats.sum / 1e6;
            freePendingStats(stats);
          } else {
            stats.startQueryIndex = startPtr;
            stats.endQueryIndex = endPtr;
            pendingStats[ptr++] = stats;
          }
        }
        pendingStats.length = ptr;
      }

      return {
        beginQuery: beginQuery,
        endQuery: endQuery,
        pushScopeStats: pushScopeStats,
        update: update,
        getNumPendingQueries: function () {
          return pendingQueries.length
        },
        clear: function () {
          queryPool.push.apply(queryPool, pendingQueries);
          for (var i = 0; i < queryPool.length; i++) {
            extensions.ext_disjoint_timer_query.deleteQueryEXT(queryPool[i]);
          }
          pendingQueries.length = 0;
          queryPool.length = 0;
        },
        restore: function () {
          pendingQueries.length = 0;
          queryPool.length = 0;
        }
      }
    };

    var GL_COLOR_BUFFER_BIT = 16384;
    var GL_DEPTH_BUFFER_BIT = 256;
    var GL_STENCIL_BUFFER_BIT = 1024;

    var GL_ARRAY_BUFFER = 34962;

    var CONTEXT_LOST_EVENT = 'webglcontextlost';
    var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';

    var DYN_PROP = 1;
    var DYN_CONTEXT = 2;
    var DYN_STATE = 3;

    function find (haystack, needle) {
      for (var i = 0; i < haystack.length; ++i) {
        if (haystack[i] === needle) {
          return i
        }
      }
      return -1
    }

    function wrapREGL (args) {
      var config = parseArgs(args);
      if (!config) {
        return null
      }

      var gl = config.gl;
      var glAttributes = gl.getContextAttributes();
      var contextLost = gl.isContextLost();

      var extensionState = createExtensionCache(gl, config);
      if (!extensionState) {
        return null
      }

      var stringStore = createStringStore();
      var stats$$1 = stats();
      var extensions = extensionState.extensions;
      var timer = createTimer(gl, extensions);

      var START_TIME = clock();
      var WIDTH = gl.drawingBufferWidth;
      var HEIGHT = gl.drawingBufferHeight;

      var contextState = {
        tick: 0,
        time: 0,
        viewportWidth: WIDTH,
        viewportHeight: HEIGHT,
        framebufferWidth: WIDTH,
        framebufferHeight: HEIGHT,
        drawingBufferWidth: WIDTH,
        drawingBufferHeight: HEIGHT,
        pixelRatio: config.pixelRatio
      };
      var uniformState = {};
      var drawState = {
        elements: null,
        primitive: 4, // GL_TRIANGLES
        count: -1,
        offset: 0,
        instances: -1
      };

      var limits = wrapLimits(gl, extensions);
      var bufferState = wrapBufferState(
        gl,
        stats$$1,
        config,
        destroyBuffer);
      var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
      var attributeState = wrapAttributeState(
        gl,
        extensions,
        limits,
        stats$$1,
        bufferState,
        elementState,
        drawState);
      function destroyBuffer (buffer) {
        return attributeState.destroyBuffer(buffer)
      }
      var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
      var textureState = createTextureSet(
        gl,
        extensions,
        limits,
        function () { core.procs.poll(); },
        contextState,
        stats$$1,
        config);
      var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
      var framebufferState = wrapFBOState(
        gl,
        extensions,
        limits,
        textureState,
        renderbufferState,
        stats$$1);
      var core = reglCore(
        gl,
        stringStore,
        extensions,
        limits,
        bufferState,
        elementState,
        textureState,
        framebufferState,
        uniformState,
        attributeState,
        shaderState,
        drawState,
        contextState,
        timer,
        config);
      var readPixels = wrapReadPixels(
        gl,
        framebufferState,
        core.procs.poll,
        contextState,
        glAttributes, extensions, limits);

      var nextState = core.next;
      var canvas = gl.canvas;

      var rafCallbacks = [];
      var lossCallbacks = [];
      var restoreCallbacks = [];
      var destroyCallbacks = [config.onDestroy];

      var activeRAF = null;
      function handleRAF () {
        if (rafCallbacks.length === 0) {
          if (timer) {
            timer.update();
          }
          activeRAF = null;
          return
        }

        // schedule next animation frame
        activeRAF = raf.next(handleRAF);

        // poll for changes
        poll();

        // fire a callback for all pending rafs
        for (var i = rafCallbacks.length - 1; i >= 0; --i) {
          var cb = rafCallbacks[i];
          if (cb) {
            cb(contextState, null, 0);
          }
        }

        // flush all pending webgl calls
        gl.flush();

        // poll GPU timers *after* gl.flush so we don't delay command dispatch
        if (timer) {
          timer.update();
        }
      }

      function startRAF () {
        if (!activeRAF && rafCallbacks.length > 0) {
          activeRAF = raf.next(handleRAF);
        }
      }

      function stopRAF () {
        if (activeRAF) {
          raf.cancel(handleRAF);
          activeRAF = null;
        }
      }

      function handleContextLoss (event) {
        event.preventDefault();

        // set context lost flag
        contextLost = true;

        // pause request animation frame
        stopRAF();

        // lose context
        lossCallbacks.forEach(function (cb) {
          cb();
        });
      }

      function handleContextRestored (event) {
        // clear error code
        gl.getError();

        // clear context lost flag
        contextLost = false;

        // refresh state
        extensionState.restore();
        shaderState.restore();
        bufferState.restore();
        textureState.restore();
        renderbufferState.restore();
        framebufferState.restore();
        attributeState.restore();
        if (timer) {
          timer.restore();
        }

        // refresh state
        core.procs.refresh();

        // restart RAF
        startRAF();

        // restore context
        restoreCallbacks.forEach(function (cb) {
          cb();
        });
      }

      if (canvas) {
        canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
        canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
      }

      function destroy () {
        rafCallbacks.length = 0;
        stopRAF();

        if (canvas) {
          canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
          canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
        }

        shaderState.clear();
        framebufferState.clear();
        renderbufferState.clear();
        attributeState.clear();
        textureState.clear();
        elementState.clear();
        bufferState.clear();

        if (timer) {
          timer.clear();
        }

        destroyCallbacks.forEach(function (cb) {
          cb();
        });
      }

      function compileProcedure (options) {
        check$1(!!options, 'invalid args to regl({...})');
        check$1.type(options, 'object', 'invalid args to regl({...})');

        function flattenNestedOptions (options) {
          var result = extend({}, options);
          delete result.uniforms;
          delete result.attributes;
          delete result.context;
          delete result.vao;

          if ('stencil' in result && result.stencil.op) {
            result.stencil.opBack = result.stencil.opFront = result.stencil.op;
            delete result.stencil.op;
          }

          function merge (name) {
            if (name in result) {
              var child = result[name];
              delete result[name];
              Object.keys(child).forEach(function (prop) {
                result[name + '.' + prop] = child[prop];
              });
            }
          }
          merge('blend');
          merge('depth');
          merge('cull');
          merge('stencil');
          merge('polygonOffset');
          merge('scissor');
          merge('sample');

          if ('vao' in options) {
            result.vao = options.vao;
          }

          return result
        }

        function separateDynamic (object, useArrays) {
          var staticItems = {};
          var dynamicItems = {};
          Object.keys(object).forEach(function (option) {
            var value = object[option];
            if (dynamic.isDynamic(value)) {
              dynamicItems[option] = dynamic.unbox(value, option);
              return
            } else if (useArrays && Array.isArray(value)) {
              for (var i = 0; i < value.length; ++i) {
                if (dynamic.isDynamic(value[i])) {
                  dynamicItems[option] = dynamic.unbox(value, option);
                  return
                }
              }
            }
            staticItems[option] = value;
          });
          return {
            dynamic: dynamicItems,
            static: staticItems
          }
        }

        // Treat context variables separate from other dynamic variables
        var context = separateDynamic(options.context || {}, true);
        var uniforms = separateDynamic(options.uniforms || {}, true);
        var attributes = separateDynamic(options.attributes || {}, false);
        var opts = separateDynamic(flattenNestedOptions(options), false);

        var stats$$1 = {
          gpuTime: 0.0,
          cpuTime: 0.0,
          count: 0
        };

        var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);

        var draw = compiled.draw;
        var batch = compiled.batch;
        var scope = compiled.scope;

        // FIXME: we should modify code generation for batch commands so this
        // isn't necessary
        var EMPTY_ARRAY = [];
        function reserve (count) {
          while (EMPTY_ARRAY.length < count) {
            EMPTY_ARRAY.push(null);
          }
          return EMPTY_ARRAY
        }

        function REGLCommand (args, body) {
          var i;
          if (contextLost) {
            check$1.raise('context lost');
          }
          if (typeof args === 'function') {
            return scope.call(this, null, args, 0)
          } else if (typeof body === 'function') {
            if (typeof args === 'number') {
              for (i = 0; i < args; ++i) {
                scope.call(this, null, body, i);
              }
            } else if (Array.isArray(args)) {
              for (i = 0; i < args.length; ++i) {
                scope.call(this, args[i], body, i);
              }
            } else {
              return scope.call(this, args, body, 0)
            }
          } else if (typeof args === 'number') {
            if (args > 0) {
              return batch.call(this, reserve(args | 0), args | 0)
            }
          } else if (Array.isArray(args)) {
            if (args.length) {
              return batch.call(this, args, args.length)
            }
          } else {
            return draw.call(this, args)
          }
        }

        return extend(REGLCommand, {
          stats: stats$$1,
          destroy: function () {
            compiled.destroy();
          }
        })
      }

      var setFBO = framebufferState.setFBO = compileProcedure({
        framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
      });

      function clearImpl (_, options) {
        var clearFlags = 0;
        core.procs.poll();

        var c = options.color;
        if (c) {
          gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
          clearFlags |= GL_COLOR_BUFFER_BIT;
        }
        if ('depth' in options) {
          gl.clearDepth(+options.depth);
          clearFlags |= GL_DEPTH_BUFFER_BIT;
        }
        if ('stencil' in options) {
          gl.clearStencil(options.stencil | 0);
          clearFlags |= GL_STENCIL_BUFFER_BIT;
        }

        check$1(!!clearFlags, 'called regl.clear with no buffer specified');
        gl.clear(clearFlags);
      }

      function clear (options) {
        check$1(
          typeof options === 'object' && options,
          'regl.clear() takes an object as input');
        if ('framebuffer' in options) {
          if (options.framebuffer &&
              options.framebuffer_reglType === 'framebufferCube') {
            for (var i = 0; i < 6; ++i) {
              setFBO(extend({
                framebuffer: options.framebuffer.faces[i]
              }, options), clearImpl);
            }
          } else {
            setFBO(options, clearImpl);
          }
        } else {
          clearImpl(null, options);
        }
      }

      function frame (cb) {
        check$1.type(cb, 'function', 'regl.frame() callback must be a function');
        rafCallbacks.push(cb);

        function cancel () {
          // FIXME:  should we check something other than equals cb here?
          // what if a user calls frame twice with the same callback...
          //
          var i = find(rafCallbacks, cb);
          check$1(i >= 0, 'cannot cancel a frame twice');
          function pendingCancel () {
            var index = find(rafCallbacks, pendingCancel);
            rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
            rafCallbacks.length -= 1;
            if (rafCallbacks.length <= 0) {
              stopRAF();
            }
          }
          rafCallbacks[i] = pendingCancel;
        }

        startRAF();

        return {
          cancel: cancel
        }
      }

      // poll viewport
      function pollViewport () {
        var viewport = nextState.viewport;
        var scissorBox = nextState.scissor_box;
        viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
        contextState.viewportWidth =
          contextState.framebufferWidth =
          contextState.drawingBufferWidth =
          viewport[2] =
          scissorBox[2] = gl.drawingBufferWidth;
        contextState.viewportHeight =
          contextState.framebufferHeight =
          contextState.drawingBufferHeight =
          viewport[3] =
          scissorBox[3] = gl.drawingBufferHeight;
      }

      function poll () {
        contextState.tick += 1;
        contextState.time = now();
        pollViewport();
        core.procs.poll();
      }

      function refresh () {
        textureState.refresh();
        pollViewport();
        core.procs.refresh();
        if (timer) {
          timer.update();
        }
      }

      function now () {
        return (clock() - START_TIME) / 1000.0
      }

      refresh();

      function addListener (event, callback) {
        check$1.type(callback, 'function', 'listener callback must be a function');

        var callbacks;
        switch (event) {
          case 'frame':
            return frame(callback)
          case 'lost':
            callbacks = lossCallbacks;
            break
          case 'restore':
            callbacks = restoreCallbacks;
            break
          case 'destroy':
            callbacks = destroyCallbacks;
            break
          default:
            check$1.raise('invalid event, must be one of frame,lost,restore,destroy');
        }

        callbacks.push(callback);
        return {
          cancel: function () {
            for (var i = 0; i < callbacks.length; ++i) {
              if (callbacks[i] === callback) {
                callbacks[i] = callbacks[callbacks.length - 1];
                callbacks.pop();
                return
              }
            }
          }
        }
      }

      var regl = extend(compileProcedure, {
        // Clear current FBO
        clear: clear,

        // Short cuts for dynamic variables
        prop: dynamic.define.bind(null, DYN_PROP),
        context: dynamic.define.bind(null, DYN_CONTEXT),
        this: dynamic.define.bind(null, DYN_STATE),

        // executes an empty draw command
        draw: compileProcedure({}),

        // Resources
        buffer: function (options) {
          return bufferState.create(options, GL_ARRAY_BUFFER, false, false)
        },
        elements: function (options) {
          return elementState.create(options, false)
        },
        texture: textureState.create2D,
        cube: textureState.createCube,
        renderbuffer: renderbufferState.create,
        framebuffer: framebufferState.create,
        framebufferCube: framebufferState.createCube,
        vao: attributeState.createVAO,

        // Expose context attributes
        attributes: glAttributes,

        // Frame rendering
        frame: frame,
        on: addListener,

        // System limits
        limits: limits,
        hasExtension: function (name) {
          return limits.extensions.indexOf(name.toLowerCase()) >= 0
        },

        // Read pixels
        read: readPixels,

        // Destroy regl and all associated resources
        destroy: destroy,

        // Direct GL state manipulation
        _gl: gl,
        _refresh: refresh,

        poll: function () {
          poll();
          if (timer) {
            timer.update();
          }
        },

        // Current time
        now: now,

        // regl Statistics Information
        stats: stats$$1
      });

      config.onDone(null, regl);

      return regl
    }

    return wrapREGL;

    })));
    //# sourceMappingURL=regl.js.map
    });

    var create_1 = create;

    /**
     * Creates a new, empty vec3
     *
     * @returns {vec3} a new 3D vector
     */
    function create() {
        var out = new Float32Array(3);
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        return out
    }

    create_1();

    const cameraState = {
      view: glMat4.identity(new Float32Array(16)),
      projection: glMat4.identity(new Float32Array(16)),
      matrix: glMat4.identity(new Float32Array(16)), // not sure if needed
      near: 1, // 0.01,
      far: 18000,
      up: [0, 0, 1],
      // distance: 10.0, // not sure if needed
      eye: new Float32Array(3), // same as position
      position: [450, 550, 700],
      target: [0, 0, 0],
      fov: Math.PI / 4,
      aspect: 1,
      viewport: [0, 0, 0, 0],
      projectionType: 'perspective'
    };

    const cameraProps = {};
    Object.assign({}, cameraState, cameraProps);

    ({
      view: glMat4.identity(new Float32Array(16)),
      projection: glMat4.identity(new Float32Array(16)),
      matrix: glMat4.identity(new Float32Array(16)), // not sure if needed
      near: 1, // 0.01,
      far: 1300,
      up: [0, 0, 1],
      // distance: 10.0, // not sure if needed
      eye: new Float32Array(3), // same as position
      position: [150, 250, 200],
      target: [0, 0, 0],
      fov: Math.PI / 4,
      aspect: 1,
      viewport: [0, 0, 0, 0],
      zoom: 1,
      projectionType: 'orthographic'
    });

    // TODO: make it more data driven ?
    /*
    setFocus => modify the focusPoint input
    rotate => modify the angle input

    */
    /* cameras are assumed to have:
     projection
     view
     target (focal point)
     eye/position
     up
    */
    // TODO:  multiple data, sometimes redundant, needs simplification
    /*
    - camera state
    - camera props

    - controls state
    - controls props

    - other

    */

    const controlsProps = {
      limits: {
        minDistance: 0.01,
        maxDistance: 10000
      },
      drag: 0.27, // Decrease the momentum by 1% each iteration
      EPS: 0.000001,
      zoomToFit: {
        auto: true, // always tried to apply zoomTofit
        targets: 'all',
        tightness: 1.5 // how close should the fit be: the lower the tigher : 1 means very close, but fitting most of the time
      },
      // all these, not sure are needed in this shape
      userControl: {
        zoom: true,
        zoomSpeed: 1.0,
        rotate: true,
        rotateSpeed: 1.0,
        pan: true,
        panSpeed: 1.0
      },
      autoRotate: {
        enabled: false,
        speed: 1.0 // 30 seconds per round when fps is 60
      },
      autoAdjustPlanes: true // adjust near & far planes when zooming in &out
    };

    const controlsState = {
      // orbit controls state
      thetaDelta: 0,
      phiDelta: 0,
      scale: 1
    };

    Object.assign({}, controlsState, controlsProps);

    var Shape=function(){function Shape(solid){this.solid=solid;}Shape.prototype.clone=function(){return new Shape(geom3_1(this.solid))};Shape.prototype.toReplString=function(){return "<Shape>"};return Shape}();var RenderGroup=function(){function RenderGroup(canvasNumber){this.canvasNumber=canvasNumber;this.render=false;this.hasAxis=true;this.hasGrid=true;this.shapes=[];}RenderGroup.prototype.toReplString=function(){return "<Render #"+this.canvasNumber+">"};return RenderGroup}();var RenderGroupManager=function(){function RenderGroupManager(){this.canvasTracker=1;this.renderGroups=[];this.addRenderGroup();}RenderGroupManager.prototype.addRenderGroup=function(){this.renderGroups.push(new RenderGroup(this.canvasTracker++));};RenderGroupManager.prototype.getCurrentRenderGroup=function(){return this.renderGroups.at(-1)};RenderGroupManager.prototype.nextRenderGroup=function(currentAxis,currentGrid){if(currentAxis===void 0){currentAxis=true;}if(currentGrid===void 0){currentGrid=true;}var previousRenderGroup=this.getCurrentRenderGroup();previousRenderGroup.render=true;previousRenderGroup.hasAxis=currentAxis;previousRenderGroup.hasGrid=currentGrid;this.addRenderGroup();return previousRenderGroup};RenderGroupManager.prototype.storeShape=function(shape){this.getCurrentRenderGroup().shapes.push(shape);};RenderGroupManager.prototype.shouldRender=function(){return this.getGroupsToRender().length>0};RenderGroupManager.prototype.getGroupsToRender=function(){return this.renderGroups.filter(function(renderGroup){return renderGroup.render})};return RenderGroupManager}();var CsgModuleState=function(){function CsgModuleState(){this.renderGroupManager=new RenderGroupManager;}return CsgModuleState}();var MousePointer;(function(MousePointer){MousePointer[MousePointer["NONE"]=-1]="NONE";MousePointer[MousePointer["LEFT"]=0]="LEFT";MousePointer[MousePointer["RIGHT"]=2]="RIGHT";MousePointer[MousePointer["MIDDLE"]=1]="MIDDLE";MousePointer[MousePointer["OTHER"]=7050]="OTHER";})(MousePointer||(MousePointer={}));function getModuleContext(moduleContexts){var potentialModuleContext=moduleContexts.get("csg");return potentialModuleContext!==null&&potentialModuleContext!==void 0?potentialModuleContext:null}function hexToColor(hex){var _a;var regex=_wrapRegExp(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,{red:1,green:2,blue:3});var potentialGroups=(_a=hex.match(regex))===null||_a===void 0?void 0:_a.groups;if(potentialGroups===undefined)return [0,0,0];var groups=potentialGroups;return [parseInt(groups.red,16)/255,parseInt(groups.green,16)/255,parseInt(groups.blue,16)/255]}function clamp(value,lowest,highest){value=Math.max(value,lowest);value=Math.min(value,highest);return value}

    var cube=shapeSetOrigin(new Shape(src_6.cube({size:1})));var sphere=shapeSetOrigin(new Shape(src_6.sphere({radius:0.5})));var cylinder=shapeSetOrigin(new Shape(src_6.cylinder({radius:0.5,height:1})));var prism=shapeSetOrigin(new Shape(extrusions_2({height:1},src_6.triangle())));var star=shapeSetOrigin(new Shape(extrusions_2({height:1},src_6.star({outerRadius:0.5}))));var small=Math.pow(10,-30);var pyramid=shapeSetOrigin(new Shape(src_6.cylinderElliptic({height:1,startRadius:[0.5,0.5],endRadius:[small,small],segments:4})));var cone=shapeSetOrigin(new Shape(src_6.cylinderElliptic({height:1,startRadius:[0.5,0.5],endRadius:[small,small]})));var torus=shapeSetOrigin(new Shape(src_6.torus({innerRadius:0.125,outerRadius:0.375})));var rounded_cube=shapeSetOrigin(new Shape(src_6.roundedCuboid({size:[1,1,1]})));var rounded_cylinder=shapeSetOrigin(new Shape(src_6.roundedCylinder({height:1,radius:0.5})));var geodesic_sphere=shapeSetOrigin(new Shape(src_6.geodesicSphere({radius:0.5})));var black="#000000";var navy="#0000AA";var green="#00AA00";var teal="#00AAAA";var crimson="#AA0000";var purple="#AA00AA";var orange="#FFAA00";var silver="#AAAAAA";var gray="#555555";var blue="#5555FF";var lime="#55FF55";var cyan="#55FFFF";var rose="#FF5555";var pink="#FF55FF";var yellow="#FFFF55";var white="#FFFFFF";function union(a,b){var newSolid=booleans_4(a.solid,b.solid);return new Shape(newSolid)}function subtract(a,b){var newSolid=booleans_3(a.solid,b.solid);return new Shape(newSolid)}function intersect(a,b){var newSolid=booleans_1(a.solid,b.solid);return new Shape(newSolid)}function scale(shape,x,y,z){var newSolid=transforms_14([x,y,z],shape.solid);return new Shape(newSolid)}function scale_x(shape,x){return scale(shape,x,1,1)}function scale_y(shape,y){return scale(shape,1,y,1)}function scale_z(shape,z){return scale(shape,1,1,z)}function shape_center(shape){var bounds=measurements_6(shape.solid);var centerCoords=[bounds[0][0]+(bounds[1][0]-bounds[0][0])/2,bounds[0][1]+(bounds[1][1]-bounds[0][1])/2,bounds[0][2]+(bounds[1][2]-bounds[0][2])/2];return function(axis){var i=axis==="x"?0:axis==="y"?1:axis==="z"?2:-1;if(i===-1){throw Error("shape_center's returned function expects a proper axis.")}else {return centerCoords[i]}}}function shape_set_center(shape,x,y,z){var newSolid=transforms_2({relativeTo:[x,y,z]},shape.solid);return new Shape(newSolid)}function area(shape){return measurements_5(shape.solid)}function volume(shape){return measurements_12(shape.solid)}function shape_mirror(shape,x,y,z){var newSolid=transforms_6({normal:[x,y,z]},shape.solid);return new Shape(newSolid)}function flip_x(shape){return shape_mirror(shape,1,0,0)}function flip_y(shape){return shape_mirror(shape,0,1,0)}function flip_z(shape){return shape_mirror(shape,0,0,1)}function translate(shape,x,y,z){var newSolid=transforms_19([x,y,z],shape.solid);return new Shape(newSolid)}function translate_x(shape,x){return translate(shape,x,0,0)}function translate_y(shape,y){return translate(shape,0,y,0)}function translate_z(shape,z){return translate(shape,0,0,z)}function beside_x(a,b){var aBounds=measurements_6(a.solid);var newX=aBounds[1][0];var newY=aBounds[0][1]+(aBounds[1][1]-aBounds[0][1])/2;var newZ=aBounds[0][2]+(aBounds[1][2]-aBounds[0][2])/2;var newSolid=booleans_4(a.solid,transforms_1({modes:["min","center","center"],relativeTo:[newX,newY,newZ]},b.solid));return new Shape(newSolid)}function beside_y(a,b){var aBounds=measurements_6(a.solid);var newX=aBounds[0][0]+(aBounds[1][0]-aBounds[0][0])/2;var newY=aBounds[1][1];var newZ=aBounds[0][2]+(aBounds[1][2]-aBounds[0][2])/2;var newSolid=booleans_4(a.solid,transforms_1({modes:["center","min","center"],relativeTo:[newX,newY,newZ]},b.solid));return new Shape(newSolid)}function beside_z(a,b){var aBounds=measurements_6(a.solid);var newX=aBounds[0][0]+(aBounds[1][0]-aBounds[0][0])/2;var newY=aBounds[0][1]+(aBounds[1][1]-aBounds[0][1])/2;var newZ=aBounds[1][2];var newSolid=booleans_4(a.solid,transforms_1({modes:["center","center","min"],relativeTo:[newX,newY,newZ]},b.solid));return new Shape(newSolid)}function bounding_box(shape){var bounds=measurements_6(shape.solid);return function(axis,min){var i=axis==="x"?0:axis==="y"?1:axis==="z"?2:-1;var j=min==="min"?0:min==="max"?1:-1;if(i===-1||j===-1){throw Error("bounding_box returned function expects a proper axis and min String.")}else {return bounds[j][i]}}}function rotate(shape,x,y,z){var newSolid=transforms_10([x,y,z],shape.solid);return new Shape(newSolid)}function rotate_x(shape,x){return rotate(shape,x,0,0)}function rotate_y(shape,y){return rotate(shape,0,y,0)}function rotate_z(shape,z){return rotate(shape,0,0,z)}function shapeSetOrigin(shape){var newSolid=transforms_1({modes:["min","min","min"]},shape.solid);return new Shape(newSolid)}function is_shape(argument){return argument instanceof Shape}function clone(shape){return shape.clone()}function store(shape){Core.getRenderGroupManager().storeShape(shape.clone());}function store_as_color(shape,hex){var color=hexToColor(hex);var coloredSolid=colors_1(color,shape.solid);Core.getRenderGroupManager().storeShape(new Shape(coloredSolid));}function store_as_rgb(shape,redComponent,greenComponent,blueComponent){redComponent=clamp(redComponent,0,1);greenComponent=clamp(greenComponent,0,1);blueComponent=clamp(blueComponent,0,1);var coloredSolid=colors_1([redComponent,greenComponent,blueComponent],shape.solid);Core.getRenderGroupManager().storeShape(new Shape(coloredSolid));}function render_grid_axis(){return Core.getRenderGroupManager().nextRenderGroup()}function render_grid(){return Core.getRenderGroupManager().nextRenderGroup(false)}function render_axis(){return Core.getRenderGroupManager().nextRenderGroup(undefined,false)}function render(){return Core.getRenderGroupManager().nextRenderGroup(false,false)}

    var index = (function(moduleParams,moduleContexts){var potentialModuleContext=getModuleContext(moduleContexts);if(potentialModuleContext!==null){var moduleContext=potentialModuleContext;var moduleState=new CsgModuleState;moduleContext.state=moduleState;Core.initialize(moduleState);}return {cube:cube,sphere:sphere,cylinder:cylinder,prism:prism,star:star,pyramid:pyramid,cone:cone,torus:torus,rounded_cube:rounded_cube,rounded_cylinder:rounded_cylinder,geodesic_sphere:geodesic_sphere,black:black,navy:navy,green:green,teal:teal,crimson:crimson,purple:purple,orange:orange,silver:silver,gray:gray,blue:blue,lime:lime,cyan:cyan,rose:rose,pink:pink,yellow:yellow,white:white,union:union,subtract:subtract,intersect:intersect,scale:scale,scale_x:scale_x,scale_y:scale_y,scale_z:scale_z,shape_center:shape_center,shape_set_center:shape_set_center,area:area,volume:volume,flip_x:flip_x,flip_y:flip_y,flip_z:flip_z,translate:translate,translate_x:translate_x,translate_y:translate_y,translate_z:translate_z,beside_x:beside_x,beside_y:beside_y,beside_z:beside_z,bounding_box:bounding_box,rotate:rotate,rotate_x:rotate_x,rotate_y:rotate_y,rotate_z:rotate_z,is_shape:is_shape,clone:clone,store:store,store_as_color:store_as_color,store_as_rgb:store_as_rgb,render_grid_axis:render_grid_axis,render_grid:render_grid,render_axis:render_axis,render:render}});

    return index;

}());
