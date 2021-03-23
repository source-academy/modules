import { mat4, vec3 } from 'gl-matrix';
import {
  CurveObject,
  CurveFunction,
  RenderFunction,
  CurveTransformer,
  Point
} from './types';

/**
 * <Brief description of the module>
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

// =============================================================================
// Module's Private Functions
// =============================================================================

let cubeRotation = 0; // Used for testing
function generateCurve(
  scaleMode: string,
  drawMode: string,
  numPoints: number,
  func: Function,
  space: string,
  isFullView: boolean
): void {
  const viewport_size: number = 600;
  let curvePosArray: number[] = [];
  let curveColorArray: number[] = [];
  const drawCubeArray: number[] = [];
  const transMat = mat4.create();
  const projMat = mat4.create();
  let curveObject: CurveObject = {
    drawCube: [],
    color: [],
    curvePos: [],
  };
  // initialize the min/max to extreme values
  let min_x = Infinity;
  let max_x = -Infinity;
  let min_y = Infinity;
  let max_y = -Infinity;
  let min_z = Infinity;
  let max_z = -Infinity;

  function evaluator(num: number, cFunc: Function): void {
    curveObject = {
      drawCube: [],
      color: [],
      curvePos: [],
    };
    curvePosArray = [];
    curveColorArray = [];
    for (let i = 0; i <= num; i += 1) {
      const point = cFunc(i / num);
      if (!(point instanceof Point)) {
        throw new Error(`Expected a point, encountered ${point}`);
      }
      const x = point.getX() * 2 - 1;
      const y = point.getY() * 2 - 1;
      const z = point.getZ() * 2 - 1;
      space == '2D' ? curvePosArray.push(x, y) : curvePosArray.push(x, y, z);
      const color_r = point.getColor()[0];
      const color_g = point.getColor()[1];
      const color_b = point.getColor()[2];
      const color_a = point.getColor()[3];
      curveColorArray.push(color_r, color_g, color_b, color_a);
      min_x = Math.min(min_x, x);
      max_x = Math.max(max_x, x);
      min_y = Math.min(min_y, y);
      max_y = Math.max(max_y, y);
      min_z = Math.min(min_z, z);
      max_z = Math.max(max_z, z);
    }
  }
  evaluator(numPoints, func);

  // padding for 2d draw connected full-view
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

  // box generation
  if (space == '3D') {
    drawCubeArray.push(-1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1,
      1, 1, -1, 1, -1, -1, -1, -1, -1, 1, -1, -1,
      1, -1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
      -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1
    );
  } else {
    min_z = max_z = 0;
  }

  if (scaleMode == 'fit') {
    var center = [
      (min_x + max_x) / 2,
      (min_y + max_y) / 2,
      (min_z + max_z) / 2,
    ];
    var scale = Math.max(max_x - min_x, max_y - min_y, max_z - min_z);
    scale = scale === 0 ? 1 : scale;
    if (space == '3D') {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 3 == 0) {
          curvePosArray[i] -= center[0];
          curvePosArray[i] /= scale / 2;
        } else if (i % 3 == 1) {
          curvePosArray[i] -= center[1];
          curvePosArray[i] /= scale / 2;
        } else {
          curvePosArray[i] -= center[2];
          curvePosArray[i] /= scale / 2;
        }
      }
    } else {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 2 == 0) {
          curvePosArray[i] -= center[0];
          curvePosArray[i] /= scale / 2;
        } else {
          curvePosArray[i] -= center[1];
          curvePosArray[i] /= scale / 2;
        }
      }
    }
  } else if (scaleMode == 'stretch') {
    var center = [
      (min_x + max_x) / 2,
      (min_y + max_y) / 2,
      (min_z + max_z) / 2,
    ];
    const x_scale = max_x === min_x ? 1 : max_x - min_x;
    const y_scale = max_y === min_y ? 1 : max_y - min_y;
    const z_scale = max_z === min_z ? 1 : max_z - min_z;
    if (space == '3D') {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 3 == 0) {
          curvePosArray[i] -= center[0];
          curvePosArray[i] /= x_scale / 2;
        } else if (i % 3 == 1) {
          curvePosArray[i] -= center[1];
          curvePosArray[i] /= y_scale / 2;
        } else {
          curvePosArray[i] -= center[2];
          curvePosArray[i] /= z_scale / 2;
        }
      }
    } else {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 2 == 0) {
          curvePosArray[i] -= center[0];
          curvePosArray[i] /= x_scale / 2;
        } else {
          curvePosArray[i] -= center[1];
          curvePosArray[i] /= y_scale / 2;
        }
      }
    }
  }

  if (space == '3D') {
    var scale = Math.sqrt(1 / 3.1);
    mat4.scale(transMat, transMat, vec3.fromValues(scale, scale, scale));
    curveObject.drawCube = drawCubeArray;
    mat4.translate(transMat, transMat, [0, 0, -5]);
    mat4.rotate(transMat, transMat, -(Math.PI / 2), [1, 0, 0]); // axis to rotate around X
    mat4.rotate(transMat, transMat, -0.5, [0, 0, 1]); // axis to rotate around Z
    cubeRotation += 0.1 * Math.PI;

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0;
    const zFar = 50.0;
    mat4.perspective(projMat, fieldOfView, aspect, zNear, zFar);
  }

  clear_viewport(); // TODO: replace
  gl.uniformMatrix4fv(u_projectionMatrix, false, projMat);
  gl.uniformMatrix4fv(u_transformMatrix, false, transMat);
  curveObject.curvePos = curvePosArray;
  curveObject.color = curveColorArray;
  curveObject.drawCube = drawCubeArray;
  drawCurve(drawMode, curveObject, space);
  copy_viewport(gl.canvas, frame);
  return new ShapeDrawn(frame); // TODO: I suppose we will directly drawCurve next time into the canvas? from what I see now, nothing uses the return statement
}

// =============================================================================
// Module's Exposed Functions
// =============================================================================

/**
 * returns a function that turns a given Curve into a Drawing,
 * by sampling the Curve at <CODE>num</CODE> sample points
 * and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The parts between (0,0) and (1,1) of the resulting Drawing
 * are shown in the window.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_connected(num: number): RenderFunction {
  return function (func: (x: number) => Point) {
    generateCurve('none', 'lines', num, func, '2D', false);
  };
}

/**
 * returns a function that turns a given Curve into a Drawing,
 * by sampling the Curve at <CODE>num</CODE> sample points
 * and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The Drawing is stretched or shrunk
 * to show the full curve
 * and maximize its width and height, with some padding.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_connected_full_view(num: number): RenderFunction {
  return function (func: CurveFunction) {
    return generateCurve('stretch', 'lines', num, func, '2D', true);
  };
}

/**
 * returns a function that turns a given Curve into a Drawing,
 * by sampling the Curve at <CODE>num</CODE> sample points
 * and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The Drawing is scaled proportionally to show the full curve
 * and maximize its size, with some padding.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_connected_full_view_proportional(num: number): RenderFunction {
  return function (func: CurveFunction) {
    return generateCurve('fit', 'lines', num, func, '2D', true);
  };
}

/**
 * returns a function that turns a given Curve into a Drawing,
 * by sampling the Curve at <CODE>num</CODE> sample points.
 * The Drawing consists of isolated points, and does not connect them.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The parts between (0,0) and (1,1) of the resulting Drawing
 * are shown in the window.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_points_on(num: number): RenderFunction {
  return function (func: CurveFunction) {
    generateCurve('none', 'points', num, func, '2D', false);
  };
}

/**
 * returns a function that turns a given Curve into a Drawing,
 * by sampling the Curve at <CODE>num</CODE> sample points.
 * The Drawing consists of isolated points, and does not connect them.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The Drawing is scaled proportionally with its size maximized
 * to fit entirely inside the window, with some padding.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_points_full_view_proportional(num: number): RenderFunction {
  return function (func: CurveFunction) {
    return generateCurve('fit', 'points', num, func, '2D', true);
  };
}

/**
 * returns a function that turns a given 3D Curve into a Drawing,
 * by sampling the 3D Curve at <CODE>num</CODE> sample points
 * and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The parts between (0,0,0) and (1,1,1) of the resulting
 * Drawing are shown within the unit cube.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_3D_connected(num: number): RenderFunction {
  return function (func: CurveFunction) {
    return generateCurve('none', 'lines', num, func, '3D', false);
    // requestAnimationFrame(generateCurve)
  };
}

/**
 * returns a function that turns a given 3D Curve into a Drawing,
 * by sampling the 3D Curve at <CODE>num</CODE> sample points
 * and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The Drawing is stretched or shrunk
 * to show the full curve
 * and maximize its width and height within the cube.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_3D_connected_full_view(num: number): RenderFunction {
  return function (func: CurveFunction) {
    return generateCurve('stretch', 'lines', num, func, '3D', false);
  };
}

/**
 * returns a function that turns a given 3D Curve into a Drawing,
 * by sampling the 3D Curve at <CODE>num</CODE> sample points
 * and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The Drawing is scaled proportionally with its size maximized
 * to fit entirely inside the cube.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_3D_connected_full_view_proportional(num: number): RenderFunction {
  return function (func: CurveFunction) {
    return generateCurve('fit', 'lines', num, func, '3D', false);
  };
}

/**
 * returns a function that turns a given 3D Curve into a Drawing,
 * by sampling the 3D Curve at <CODE>num</CODE> sample points.
 * The Drawing consists of isolated points, and does not connect them.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The parts between (0,0,0) and (1,1,1) of the resulting
 * Drawing are shown within the unit cube.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_3D_points_on(num: number): RenderFunction {
  return function (func: CurveFunction) {
    return generateCurve('none', 'points', num, func, '3D', false);
  };
}

/**
 * returns a function that turns a given 3D Curve into a Drawing,
 * by sampling the 3D Curve at <CODE>num</CODE> sample points.
 * The Drawing consists of isolated points, and does not connect them.
 * When a program evaluates to a Drawing, the Source system
 * displays it graphically, in a window, instead of textually.
 * The Drawing is scaled proportionally with its size maximized
 * to fit entirely inside the cube.
 * @param {Number} num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return {function} function of type Curve → Drawing
 */
function draw_3D_points_full_view_proportional(num: number): RenderFunction {
  return function (func: CurveFunction) {
    return generateCurve('fit', 'points', num, func, '3D', false);
  };
}

/**
 * makes a Point with given x and y coordinates
 * @param {Number} x - x-coordinate of new point
 * @param {Number} y - y-coordinate of new point
 * @returns {Point} with x and y as coordinates
 */
function make_point(x: number, y: number): Point {
  return { x: x, y: y, z: 0, color: [0, 0, 0, 1] };
}

/**
 * makes a 3D Point with given x, y and z coordinates
 * @param {Number} x - x-coordinate of new point
 * @param {Number} y - y-coordinate of new point
 * @param {Number} z - z-coordinate of new point
 * @returns {Point} with x, y and z as coordinates
 */
function make_3D_point(x: number, y: number, z: number): Point {
  return { x: x, y: y, z: z, color: [0, 0, 0, 1] };
}

/**
 * makes a color Point with given x and y coordinates,
 * and RGB values ranging from 0 to 255.
 * Any input lower than 0 for RGB will be rounded up to 0,
 * and any input higher than 255 will be rounded down to 255.
 * @param {Number} x - x-coordinate of new point
 * @param {Number} y - y-coordinate of new point
 * @param {Number} r - red component of new point
 * @param {Number} g - green component of new point
 * @param {Number} b - blue component of new point
 * @returns {Point} with x and y as coordinates, and r, g and b as RGB values
 */
function make_color_point(x: number, y: number, r: number, g: number, b: number): Point {
  return { x: x, y: y, z: 0, color: [r / 255, g / 255, b / 255, 1] };
}

/**
 * makes a 3D color Point with given x, y and z coordinates,
 * and RGB values ranging from 0 to 255.
 * Any input lower than 0 for RGB will be rounded up to 0,
 * and any input higher than 255 will be rounded down to 255.
 * @param {Number} x - x-coordinate of new point
 * @param {Number} y - y-coordinate of new point
 * @param {Number} z - z-coordinate of new point
 * @param {Number} r - red component of new point
 * @param {Number} g - green component of new point
 * @param {Number} b - blue component of new point
 * @returns {Point} with x, y and z as coordinates, and r, g and b as RGB values
 */
function make_3D_color_point(x: number, y: number, z: number, r: number, g: number, b: number): Point {
  return { x: x, y: y, z: z, color: [r / 255, g / 255, b / 255, 1] };
}

/**
 * retrieves the x-coordinate of a given Point
 * @param {Point} p - given point
 * @returns {Number} x-coordinate of the Point
 */
function x_of(pt: Point): number {
  return pt.x;
}

/**
 * retrieves the y-coordinate of a given Point
 * @param {Point} p - given point
 * @returns {Number} y-coordinate of the Point
 */
function y_of(pt: Point): number {
  return pt.y;
}

/**
 * retrieves the z-coordinate of a given Point
 * @param {Point} p - given point
 * @returns {Number} z-coordinate of the Point
 */
function z_of(pt: Point): number {
  return pt.z;
}

/**
 * retrieves the red component of a given Point
 * @param {Point} p - given point
 * @returns {Number} Red component of the Point
 */
function r_of(pt: Point): number {
  return pt.color[0] * 255;
}

/**
 * retrieves the green component of a given Point
 * @param {Point} p - given point
 * @returns {Number} Green component of the Point
 */
function g_of(pt: Point): number {
  return pt.color[1] * 255;
}

/**
 * retrieves the blue component of a given Point
 * @param {Point} p - given point
 * @returns {Number} Blue component of the Point
 */
function b_of(pt: Point): number {
  return pt.color[2] * 255;
}

/**
 * this function is a Curve transformation: a function from a
 * Curve to a Curve. The points of the result Curve are
 * the same points as the points of the original Curve, but
 * in reverse: The result Curve applied to 0 is the original Curve
 * applied to 1 and vice versa.
 * 
 * @param {CurveFunction} original - original Curve
 * @returns {CurveFunction} result Curve
 */
function invert(curve: CurveFunction): CurveFunction {
  return (t: number) => curve(1 - t);
}

/**
 * this function returns a Curve transformation: 
 * It takes an x-value x0, a y-value y0 and a z-value z0, 
 * each with default value of 0, as arguments 
 * and returns a Curve transformation that
 * takes a Curve as argument and returns
 * a new Curve, by translating the original by x0 in x-direction, 
 * y0 in y-direction and z0 in z-direction.
 * 
 * @param {number} x0 - (Optional) x-value
 * @param {number} y0 - (Optional) y-value
 * @param {number} z0 - (Optional) z-value
 * @returns {CurveTransformer} Curve transformation
 */
function translate_curve(x0: number, y0: number, z0: number): CurveTransformer {
  return function (curve: CurveFunction) {
    const transformation = (c: CurveFunction) =>
      function (t: number) {
        x0 = x0 == undefined ? 0 : x0;
        y0 = y0 == undefined ? 0 : y0;
        z0 = z0 == undefined ? 0 : z0;
        const ct: Point = c(t);
        return make_3D_color_point(
          x0 + x_of(ct),
          y0 + y_of(ct),
          z0 + z_of(ct),
          r_of(ct),
          g_of(ct),
          b_of(ct)
        );
      };
    return transformation(curve);
  };
}

/**
 * this function 
 * takes either 1 or 3 angles, a, b and c in radians as parameter and 
 * returns a Curve transformation: 
 * a function that takes a Curve as argument and returns
 * a new Curve, which is the original Curve rotated by the given angle
 * around the z-axis (1 parameter) in counter-clockwise direction, or 
 * the original Curve rotated extrinsically with Euler angles (a, b, c) 
 * about x, y, and z axes (3 parameters).
 * @param {number} a - given angle
 * @param {number} b - (Optional) given angle
 * @param {number} c - (Optional) given angle
 * @returns {CurveTransformer} function that takes a Curve and returns a Curve
 */
function rotate_around_origin(
  theta1: number,
  theta2: number,
  theta3: number
): CurveTransformer {
  if (theta3 == undefined && theta1 != undefined && theta2 != undefined) {
    // 2 args
    throw new Error('Expected 1 or 3 arguments, but received 2');
  } else if (
    theta1 != undefined &&
    theta2 == undefined &&
    theta3 == undefined
  ) {
    // 1 args
    const cth = Math.cos(theta1);
    const sth = Math.sin(theta1);
    return function (curve: CurveFunction) {
      const transformation = (c: CurveFunction) =>
        function (t: number) {
          const ct = c(t);
          const x = x_of(ct);
          const y = y_of(ct);
          const z = z_of(ct);
          return make_3D_color_point(
            cth * x - sth * y,
            sth * x + cth * y,
            z,
            r_of(ct),
            g_of(ct),
            b_of(ct)
          );
        };
      return transformation(curve);
    };
  } else {
    const cthx = Math.cos(theta1);
    const sthx = Math.sin(theta1);
    const cthy = Math.cos(theta2);
    const sthy = Math.sin(theta2);
    const cthz = Math.cos(theta3);
    const sthz = Math.sin(theta3);
    return function (curve: CurveFunction) {
      const transformation = (c: CurveFunction) =>
        function (t: number) {
          const ct = c(t);
          const coord = [x_of(ct), y_of(ct), z_of(ct)];
          const mat = [
            [
              cthz * cthy,
              cthz * sthy * sthx - sthz * cthx,
              cthz * sthy * cthx + sthz * sthx,
            ],
            [
              sthz * cthy,
              sthz * sthy * sthx + cthz * cthx,
              sthz * sthy * cthx - cthz * sthx,
            ],
            [-sthy, cthy * sthx, cthy * cthx],
          ];
          let xf = 0;
          let yf = 0;
          let zf = 0;
          for (let i = 0; i < 3; i++) {
            xf += mat[0][i] * coord[i];
            yf += mat[1][i] * coord[i];
            zf += mat[2][i] * coord[i];
          }
          return make_3D_color_point(xf, yf, zf, r_of(ct), g_of(ct), b_of(ct));
        };
      return transformation(curve);
    };
  }
}

/**
 * this function takes scaling factors <CODE>a</CODE>, <CODE>b</CODE> 
 * and <CODE>c</CODE>, each with default value of 1, as arguments and 
 * returns a Curve transformation that 
 * scales a given Curve by <CODE>a</CODE> in x-direction, <CODE>b</CODE> 
 * in y-direction and <CODE>c</CODE> in z-direction.
 * 
 * @param {number} a - (Optional) scaling factor in x-direction
 * @param {number} b - (Optional) scaling factor in y-direction
 * @param {number} c - (Optional) scaling factor in z-direction
 * @returns {CurveTransformer} function that takes a Curve and returns a Curve
 */
function scale_curve(a1: number, b1: number, c1: number): CurveTransformer {
  return function (curve) {
    const transformation = (c: CurveFunction) =>
      function (t: number) {
        const ct = c(t);
        a1 = a1 == undefined ? 1 : a1;
        b1 = b1 == undefined ? 1 : b1;
        c1 = c1 == undefined ? 1 : c1;
        return make_3D_color_point(
          a1 * x_of(ct),
          b1 * y_of(ct),
          c1 * z_of(ct),
          r_of(ct),
          g_of(ct),
          b_of(ct)
        );
      };
    return transformation(curve);
  };
}

/**
 * this function takes a scaling factor s argument and returns a
 * Curve transformation that
 * scales a given Curve by s in x, y and z direction.
 * 
 * @param {number} s - scaling factor
 * @returns {CurveTransformer} function that takes a Curve and returns a Curve
 */
function scale_proportional(s: number): CurveTransformer {
  return scale_curve(s, s, s);
}

/**
 * this function is a Curve transformation: It
 * takes a Curve as argument and returns
 * a new Curve, as follows.
 * A Curve is in <EM>standard position</EM> if it starts at (0,0) ends at (1,0).
 * This function puts the given Curve in standard position by 
 * rigidly translating it so its
 * start Point is at the origin (0,0), then rotating it about the origin to put
 * its endpoint on the x axis, then scaling it to put the endpoint at (1,0).
 * Behavior is unspecified on closed Curves where start-point equal end-point.
 * 
 * @param {CurveFunction} curve - given Curve
 * @returns {CurveFunction} result Curve
 */
function put_in_standard_position(curve: CurveFunction): CurveFunction {
  const start_point = curve(0);
  const curve_started_at_origin = translate_curve(-x_of(start_point), -y_of(start_point), 0)(curve);
  const new_end_point = curve_started_at_origin(1);
  const theta = Math.atan2(y_of(new_end_point), x_of(new_end_point));
  const curve_ended_at_x_axis = rotate_around_origin(0, 0, -theta)(curve_started_at_origin);
  const end_point_on_x_axis = x_of(curve_ended_at_x_axis(1));
  return scale_proportional(1 / end_point_on_x_axis)(curve_ended_at_x_axis);
}

/**
 * this function is a binary Curve operator: It
 * takes two Curves as arguments and returns
 * a new Curve. The two Curves are combined
 * by using the full first Curve for the first portion
 * of the result and by using the full second Curve for the 
 * second portion of the result.
 * The second Curve is not changed, and therefore
 * there might be a big jump in the middle of the
 * result Curve.
 * @param {CurveFunction} curve1 - first Curve
 * @param {CurveFunction} curve2 - second Curve
 * @returns {CurveFunction} result Curve
 */
function connect_rigidly(
  curve1: CurveFunction,
  curve2: CurveFunction
): CurveFunction {
  return (t) => (t < 1 / 2 ? curve1(2 * t) : curve2(2 * t - 1));
}

/**
 * this function is a binary Curve operator: It
 * takes two Curves as arguments and returns
 * a new Curve. The two Curves are combined
 * by using the full first Curve for the first portion
 * of the result and by using the full second Curve for the second
 * portion of the result.
 * The second Curve is translated such that its point
 * at fraction 0 is the same as the Point of the first
 * Curve at fraction 1.
 * 
 * @param {CurveFunction} curve1 - first Curve
 * @param {CurveFunction} curve2 - second Curve
 * @returns {CurveFunction} result Curve
 */
function connect_ends(
  curve1: CurveFunction,
  curve2: CurveFunction
): CurveFunction {
  const start_point_of_curve2 = curve2(0);
  const end_point_of_curve1 = curve1(1);
  return connect_rigidly(
    curve1,
    translate_curve(
      x_of(end_point_of_curve1) - x_of(start_point_of_curve2),
      y_of(end_point_of_curve1) - y_of(start_point_of_curve2),
      z_of(end_point_of_curve1) - z_of(start_point_of_curve2)
    )(curve2)
  );
}

export default function curve() {
  return {
    make_point,
    make_3D_point,
    make_color_point,
    make_3D_color_point,
    draw_connected,
    draw_connected_full_view,
    draw_connected_full_view_proportional,
    draw_points_on,
    draw_points_full_view_proportional,
    draw_3D_connected,
    draw_3D_connected_full_view,
    draw_3D_connected_full_view_proportional,
    draw_3D_points_on,
    draw_3D_points_full_view_proportional,
    x_of,
    y_of,
    z_of,
    r_of,
    g_of,
    b_of,
    connect_rigidly,
    connect_ends,
    put_in_standard_position,
    translate_curve,
    scale_proportional,
    scale_curve,
    rotate_around_origin,
    invert,
  };
}
