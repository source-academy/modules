import __Params from '../../typings/__Params';
import { mat4, vec3 } from 'gl-matrix';
import { CurveObject, curveFunction, renderFunction, curveTransformer } from './types';

/**
 * <Brief description of the module>
 * @author <Author Name>
 * @author <Author Name>
 */

// =============================================================================
// Module's Private Functions
// =============================================================================

class Point{
  x: number
  y: number
  z: number
  color: number[]

  constructor(x: number, y: number, z: number, r: number, g: number, b: number) {
    this.x = x
    this.y = y
    this.z = z
    this.color = [r, g, b, 1]
  }
  getColor(): number[]{
    return this.color
  }
  getX(): number{
    return this.x
  }
  getY(): number{
    return this.y
  }
  getZ(): number{
    return this.z
  }
}

var cubeRotation = 0 //Used for testing
function generateCurve(scaleMode: string, drawMode: string, numPoints: number, func: Function, space: string, isFullView: boolean): void {
  const viewport_size: number = 600
  const frame = open_pixmap('frame', viewport_size, viewport_size, true); // TODO: replace this
  var curvePosArray: number[] = []
  var curveColorArray: number[] = []
  var drawCubeArray: number[] = []
  var transMat = mat4.create()
  var projMat = mat4.create()
  var curveObject:CurveObject = {
    drawCube:[],
    color: [],
    curvePos: []
  }
  // initialize the min/max to extreme values
  var min_x = Infinity
  var max_x = -Infinity
  var min_y = Infinity
  var max_y = -Infinity
  var min_z = Infinity
  var max_z = -Infinity

  function evaluator(num: number, func: Function): void {
    curveObject = {
      drawCube:[],
      color: [],
      curvePos: []
    }
    curvePosArray = []
    curveColorArray = []
    for (var i = 0; i <= num; i += 1) {
      var point = func(i / num)
      if (
        !(point instanceof Point)
      ) {
        throw 'Expected a point, encountered ' + point
      }
      var x = point.getX() * 2 - 1
      var y = point.getY() * 2 - 1
      var z = point.getZ() * 2 - 1
      space == '2D' ? curvePosArray.push(x, y) : curvePosArray.push(x, y, z)
      var color_r = point.getColor()[0]
      var color_g = point.getColor()[1]
      var color_b = point.getColor()[2]
      var color_a = point.getColor()[3]
      curveColorArray.push(color_r, color_g, color_b, color_a)
      min_x = Math.min(min_x, x)
      max_x = Math.max(max_x, x)
      min_y = Math.min(min_y, y)
      max_y = Math.max(max_y, y)
      min_z = Math.min(min_z, z)
      max_z = Math.max(max_z, z)
    }
  }
  evaluator(numPoints, func)

  // padding for 2d draw connected full-view
  if (isFullView) {
    var horiz_padding = 0.05 * (max_x - min_x)
    min_x -= horiz_padding
    max_x += horiz_padding
    var vert_padding = 0.05 * (max_y - min_y)
    min_y -= vert_padding
    max_y += vert_padding
    var depth_padding = 0.05 * (max_z - min_z)
    min_z -= depth_padding
    max_z += depth_padding
  }

  // box generation
  if (space == '3D') {
    drawCubeArray.push(
      -1, 1, 1, -1, -1, 1,
      -1, -1, -1, -1, 1, -1,
      1, 1, -1, 1, -1, -1,
      -1, -1, -1, 1, -1, -1,
      1, -1, 1, -1, -1, 1,
      1, -1, 1, 1, 1, 1,
      -1, 1, 1, -1, 1, -1,
      1, 1, -1, 1, 1, 1
    )
  } else {
    min_z = max_z = 0
  }

  if (scaleMode == 'fit') {
    var center = [(min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2]
    var scale = Math.max(max_x - min_x, max_y - min_y, max_z - min_z)
    scale = scale === 0 ? 1 : scale;
    if (space == '3D') {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 3 == 0) {
          curvePosArray[i] -= center[0]
          curvePosArray[i] /= scale/2
        } else if (i % 3 == 1) {
          curvePosArray[i] -= center[1]
          curvePosArray[i] /= scale/2
        } else {
          curvePosArray[i] -= center[2]
          curvePosArray[i] /= scale/2
        }
      }
    } else {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 2 == 0) {
          curvePosArray[i] -= center[0]
          curvePosArray[i] /= scale/2
        } else {
          curvePosArray[i] -= center[1]
          curvePosArray[i] /= scale/2
        }
      }
    }
  } else if (scaleMode == 'stretch') {
    var center = [(min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2]
    var x_scale = max_x === min_x ? 1 : (max_x - min_x)
    var y_scale = max_y === min_y ? 1 : (max_y - min_y)
    var z_scale = max_z === min_z ? 1 : (max_z - min_z)
    if (space == '3D') {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 3 == 0) {
          curvePosArray[i] -= center[0]
          curvePosArray[i] /= x_scale/2
        } else if (i % 3 == 1) {
          curvePosArray[i] -= center[1]
          curvePosArray[i] /= y_scale/2
        } else {
          curvePosArray[i] -= center[2]
          curvePosArray[i] /= z_scale/2
        }
      }
    } else {
      for (var i = 0; i < curvePosArray.length; i++) {
        if (i % 2 == 0) {
          curvePosArray[i] -= center[0]
          curvePosArray[i] /= x_scale/2
        } else {
          curvePosArray[i] -= center[1]
          curvePosArray[i] /= y_scale/2
        }
      }
    }
  }

  if (space == '3D') {
    var scale = Math.sqrt(1 / 3.1)
    mat4.scale(transMat, transMat, vec3.fromValues(scale, scale, scale))
    curveObject.drawCube = drawCubeArray
    mat4.translate(transMat, transMat, [0, 0, -5])
    mat4.rotate(transMat, transMat, -(Math.PI / 2), [1, 0, 0])  // axis to rotate around X
    mat4.rotate(transMat, transMat, -0.5, [0, 0, 1])            // axis to rotate around Z
    cubeRotation += 0.1 * Math.PI

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0;
    const zFar = 50.0;
    mat4.perspective(projMat, fieldOfView, aspect, zNear, zFar);
  }

  clear_viewport() // TODO: replace
  gl.uniformMatrix4fv(u_projectionMatrix, false, projMat) 
  gl.uniformMatrix4fv(u_transformMatrix, false, transMat)
  curveObject.curvePos = curvePosArray
  curveObject.color = curveColorArray
  curveObject.drawCube = drawCubeArray
  drawCurve(drawMode, curveObject, space)
  copy_viewport(gl.canvas, frame)
  return new ShapeDrawn(frame) // TODO: I suppose we will directly drawCurve next time into the canvas? from what I see now, nothing uses the return statement
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
function draw_connected(num: number): renderFunction {
  return function(func: (x: number) => Point) { 
	  generateCurve('none', 'lines', num, func, '2D', false)
  }
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
function draw_connected_full_view(num: number): renderFunction {
  return function(func: curveFunction) {
    return generateCurve('stretch', 'lines', num, func, '2D', true)
  }
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
function draw_connected_full_view_proportional(num: number): renderFunction {
  return function(func: curveFunction) {
    return generateCurve('fit', 'lines', num, func, '2D', true)
  }
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
function draw_points_on(num: number): renderFunction {
  return function(func: curveFunction) {
	  generateCurve('none', 'points', num, func, '2D', false)
  }
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
function draw_points_full_view_proportional(num: number): renderFunction {
  return function(func: curveFunction) {
    return generateCurve('fit', 'points', num, func, '2D', true)
  }
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
function draw_3D_connected(num: number): renderFunction {
  return function(func: curveFunction) {
    return generateCurve('none', 'lines', num, func, '3D', false)
    //requestAnimationFrame(generateCurve)
  }
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
function draw_3D_connected_full_view(num: number): renderFunction {
  return function(func: curveFunction) {
    return generateCurve('stretch', 'lines', num, func, '3D', false)
  }
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
function draw_3D_connected_full_view_proportional(num: number): renderFunction {
  return function(func: curveFunction) {
    return generateCurve('fit', 'lines', num, func, '3D', false)
  }
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
function draw_3D_points_on(num: number): renderFunction {
  return function(func: curveFunction) {
    return generateCurve('none', 'points', num, func, '3D', false)
  }
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
function draw_3D_points_full_view_proportional(num: number): renderFunction {
  return function(func: curveFunction) {
    return generateCurve('fit', 'points', num, func, '3D', false)
  }
}

/**
 * makes a Point with given x and y coordinates
 * @param {Number} x - x-coordinate of new point
 * @param {Number} y - y-coordinate of new point
 * @returns {Point} with x and y as coordinates
 */
function make_point(x: number, y: number): Point {
  return new Point(x, y, 0, 0, 0, 0)
}

/**
 * makes a 3D Point with given x, y and z coordinates
 * @param {Number} x - x-coordinate of new point
 * @param {Number} y - y-coordinate of new point
 * @param {Number} z - z-coordinate of new point
 * @returns {Point} with x, y and z as coordinates
 */
function make_3D_point(x: number, y: number, z: number): Point {
  return new Point(x, y, z, 0, 0, 0)
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
  return new Point(x, y, 0, r/255, g/255, b/255)
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
  return new Point(x, y, z, r/255, g/255, b/255)
}

/**
 * retrieves the x-coordinate of a given Point
 * @param {Point} p - given point
 * @returns {Number} x-coordinate of the Point
 */
function x_of(pt: Point): number {
  return pt.getX();
}

/**
 * retrieves the y-coordinate of a given Point
 * @param {Point} p - given point
 * @returns {Number} y-coordinate of the Point
 */
function y_of(pt: Point): number {
  return pt.getY();
}

/**
 * retrieves the z-coordinate of a given Point
 * @param {Point} p - given point
 * @returns {Number} z-coordinate of the Point
 */
function z_of(pt: Point): number {
  return pt.getZ();
}

/**
 * retrieves the red component of a given Point
 * @param {Point} p - given point
 * @returns {Number} Red component of the Point
 */
function r_of(pt: Point): number {
  return pt.getColor()[0] * 255;
}

/**
 * retrieves the green component of a given Point
 * @param {Point} p - given point
 * @returns {Number} Green component of the Point
 */
function g_of(pt: Point): number {
  return pt.getColor()[1] * 255;
}

/**
 * retrieves the blue component of a given Point
 * @param {Point} p - given point
 * @returns {Number} Blue component of the Point
 */
function b_of(pt: Point): number {
  return pt.getColor()[2] * 255;
}



// Curve-Transform = (Curve --> Curve)

// SOME CURVE-TRANSFORMS

function invert(curve: curveFunction): curveFunction {
  return (t: number) => curve(1 - t)
}

// CONSTRUCTORS OF CURVE-TRANSFORMS

// TRANSLATE is of type (JS-Num, JS-Num --> Curve-Transform)

function translate_curve(x0: number, y0: number, z0: number): curveTransformer {
  return function(curve: curveFunction) {
    var transformation = (c: curveFunction) => (function(t: number) {
      x0 = x0 == undefined ? 0 : x0
      y0 = y0 == undefined ? 0 : y0
      z0 = z0 == undefined ? 0 : z0
      var ct: Point = c(t)
      return make_3D_color_point(x0 + x_of(ct), y0 + y_of(ct), z0 + z_of(ct), r_of(ct), g_of(ct), b_of(ct))
    })
    return transformation(curve)
  }
}

// ROTATE-AROUND-ORIGIN is of type (JS-Num --> Curve-Transform)

function rotate_around_origin(theta1: number, theta2: number, theta3: number): curveTransformer {
  if (theta3 == undefined && theta1 != undefined && theta2 != undefined) {
    // 2 args
    throw new Error('Expected 1 or 3 arguments, but received 2')
  } else if (theta1 != undefined && theta2 == undefined && theta3 == undefined) {
    // 1 args
    var cth = Math.cos(theta1)
    var sth = Math.sin(theta1)
    return function(curve: curveFunction) {
      var transformation = (c: curveFunction) => (function(t: number) {
        var ct = c(t)
        var x = x_of(ct)
        var y = y_of(ct)
        var z = z_of(ct)
        return make_3D_color_point(cth * x - sth * y, sth * x + cth * y, z, r_of(ct), g_of(ct), b_of(ct))
      })
      return transformation(curve)
    }
  } else {
    var cthx = Math.cos(theta1)
    var sthx = Math.sin(theta1)
    var cthy = Math.cos(theta2)
    var sthy = Math.sin(theta2)
    var cthz = Math.cos(theta3)
    var sthz = Math.sin(theta3)
    return function(curve: curveFunction) {
      var transformation = (c: curveFunction) => (function(t: number) {
        var ct = c(t)
        var coord = [x_of(ct), y_of(ct), z_of(ct)]
        var mat = [
          [cthz * cthy, cthz * sthy * sthx - sthz * cthx, cthz * sthy * cthx + sthz * sthx],
          [sthz * cthy, sthz * sthy * sthx + cthz * cthx, sthz * sthy * cthx - cthz * sthx],
          [-sthy, cthy * sthx, cthy * cthx]]
        var xf = 0, yf = 0, zf = 0;
        for (var i = 0; i < 3; i++) {
          xf += mat[0][i] * coord[i]
          yf += mat[1][i] * coord[i]
          zf += mat[2][i] * coord[i]
        }
        return make_3D_color_point(xf, yf, zf, r_of(ct), g_of(ct), b_of(ct))
      })
      return transformation(curve)
    }
  }
}

function scale_curve(a1: number, b1: number, c1: number): curveTransformer {
  return function(curve) {
    var transformation = (c: curveFunction) => (function(t: number) {
      var ct = c(t)
      a1 = a1 == undefined ? 1 : a1
      b1 = b1 == undefined ? 1 : b1
      c1 = c1 == undefined ? 1 : c1
      return make_3D_color_point(a1 * x_of(ct), b1 * y_of(ct), c1 * z_of(ct), r_of(ct), g_of(ct), b_of(ct))
    })
    return transformation(curve)
  }
}

function scale_proportional(s: number): curveTransformer {
  return scale_curve(s, s, s)
}

// PUT-IN-STANDARD-POSITION is a Curve-Transform.
// A curve is in "standard position" if it starts at (0,0) ends at (1,0).
// A curve is PUT-IN-STANDARD-POSITION by rigidly translating it so its
// start point is at the origin, then rotating it about the origin to put
// its endpoint on the x axis, then scaling it to put the endpoint at (1,0).
// Behavior is unspecified on closed curves (with start-point = end-point).

function put_in_standard_position(curve: curveFunction): curveFunction {
  var start_point = curve(0)
  var curve_started_at_origin = translate_curve(-x_of(start_point), -y_of(start_point), 0)(curve)
  var new_end_point = curve_started_at_origin(1)
  var theta = Math.atan2(y_of(new_end_point), x_of(new_end_point))
  var curve_ended_at_x_axis = rotate_around_origin(0, 0, -theta)(curve_started_at_origin)
  var end_point_on_x_axis = x_of(curve_ended_at_x_axis(1))
  return scale_proportional(1 / end_point_on_x_axis)(curve_ended_at_x_axis)
}

// Binary-transform = (Curve,Curve --> Curve)

// CONNECT-RIGIDLY makes a curve consisting of curve1 followed by curve2.

function connect_rigidly(curve1: curveFunction, curve2: curveFunction): curveFunction {
  return t => t < 1 / 2 ? curve1(2 * t) : curve2(2 * t - 1)
}

// CONNECT-ENDS makes a curve consisting of curve1 followed by
// a copy of curve2 starting at the end of curve1

function connect_ends(curve1: curveFunction, curve2: curveFunction): curveFunction {
  var start_point_of_curve2 = curve2(0)
  var end_point_of_curve1 = curve1(1)
  return connect_rigidly(
    curve1,
    translate_curve(
      x_of(end_point_of_curve1) - x_of(start_point_of_curve2),
      y_of(end_point_of_curve1) - y_of(start_point_of_curve2),
      z_of(end_point_of_curve1) - z_of(start_point_of_curve2)
    )(curve2)
  )
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
    invert
  };
}
