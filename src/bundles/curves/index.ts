/* eslint-disable @typescript-eslint/naming-convention */
import {
  CurveFunction,
  RenderFunction,
  CurveTransformer,
  Point,
} from './types';
import generateCurve from './curves_webgl';

/**
 * Bundle for Source Academy Curves module
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

// =============================================================================
// Module's Exposed Functions
//
// This file only includes the implementation and documentation of exposed
// functions of the module. For private functions dealing with the browser's
// graphics library context, see './curves_webgl.ts'.
// =============================================================================

/**
 * returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at <CODE>num</CODE> sample points and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system displays it
 * graphically, in a window, instead of textually. The parts between (0,0) and
 * (1,1) of the resulting Drawing are shown in the window.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_connected(num: number): RenderFunction {
  return (func) => generateCurve('none', 'lines', num, func, '2D', false);
}

/**
 * returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at <CODE>num</CODE> sample points and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system displays it
 * graphically, in a window, instead of textually. The Drawing is stretched or
 * shrunk to show the full curve and maximize its width and height, with some
 * padding.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_connected_full_view(num: number): RenderFunction {
  return (func) => generateCurve('stretch', 'lines', num, func, '2D', true);
}

/**
 * returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at <CODE>num</CODE> sample points and connecting each pair with a line.
 * When a program evaluates to a Drawing, the Source system displays it
 * graphically, in a window, instead of textually. The Drawing is scaled
 * proportionally to show the full curve and maximize its size, with some
 * padding.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_connected_full_view_proportional(num: number): RenderFunction {
  return (func) => generateCurve('fit', 'lines', num, func, '2D', true);
}

/**
 * returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at <CODE>num</CODE> sample points. The Drawing consists of isolated
 * points, and does not connect them. When a program evaluates to a Drawing,
 * the Source system displays it graphically, in a window, instead of textually.
 * The parts between (0,0) and (1,1) of the resulting Drawing are shown in the
 * window.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_points_on(num: number): RenderFunction {
  return (func) => generateCurve('none', 'points', num, func, '2D', false);
}

/**
 * returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at <CODE>num</CODE> sample points. The Drawing consists of isolated
 * points, and does not connect them. When a program evaluates to a Drawing, the
 * Source system displays it graphically, in a window, instead of textually. The
 * Drawing is scaled proportionally with its size maximized to fit entirely
 * inside the window, with some padding.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_points_full_view_proportional(num: number): RenderFunction {
  return (func) => generateCurve('fit', 'points', num, func, '2D', true);
}

/**
 * returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at <CODE>num</CODE> sample points and connecting each pair with
 * a line. When a program evaluates to a Drawing, the Source system displays it
 * graphically, in a window, instead of textually. The parts between (0,0,0) and
 * (1,1,1) of the resulting Drawing are shown within the unit cube.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_3D_connected(num: number): RenderFunction {
  return (func) => generateCurve('none', 'lines', num, func, '3D', false);
}

/**
 * returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at <CODE>num</CODE> sample points and connecting each pair with
 * a line. When a program evaluates to a Drawing, the Source system displays it
 * graphically, in a window, instead of textually. The Drawing is stretched or
 * shrunk to show the full curve and maximize its width and height within the
 * cube.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_3D_connected_full_view(num: number): RenderFunction {
  return (func) => generateCurve('stretch', 'lines', num, func, '3D', false);
}

/**
 * returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at <CODE>num</CODE> sample points and connecting each pair with
 * a line. When a program evaluates to a Drawing, the Source system displays it
 * graphically, in a window, instead of textually. The Drawing is scaled
 * proportionally with its size maximized to fit entirely inside the cube.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_3D_connected_full_view_proportional(num: number): RenderFunction {
  return (func) => generateCurve('fit', 'lines', num, func, '3D', false);
}

/**
 * returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at <CODE>num</CODE> sample points. The Drawing consists of
 * isolated points, and does not connect them. When a program evaluates to a
 * Drawing, the Source system displays it graphically, in a window, instead of
 * textually. The parts between (0,0,0) and (1,1,1) of the resulting Drawing are
 * shown within the unit cube.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_3D_points_on(num: number): RenderFunction {
  return (func) => generateCurve('none', 'points', num, func, '3D', false);
}

/**
 * returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at <CODE>num</CODE> sample points. The Drawing consists of
 * isolated points, and does not connect them. When a program evaluates to a
 * Drawing, the Source system displays it graphically, in a window, instead of
 * textually. The Drawing is scaled proportionally with its size maximized to
 * fit entirely inside the cube.
 *
 * @param num - determines the number of points to be
 * sampled. Including 0 and 1,
 * there are <CODE>num + 1</CODE> evenly spaced sample points.
 * @return function of type Curve → Drawing
 */
function draw_3D_points_full_view_proportional(num: number): RenderFunction {
  return (func) => generateCurve('fit', 'points', num, func, '3D', false);
}

/**
 * makes a Point with given x and y coordinates.
 *
 * @param x - x-coordinate of new point
 * @param y - y-coordinate of new point
 * @returns with x and y as coordinates
 */
function make_point(x: number, y: number): Point {
  return { x, y, z: 0, color: [0, 0, 0, 1] };
}

/**
 * makes a 3D Point with given x, y and z coordinates.
 *
 * @param x - x-coordinate of new point
 * @param y - y-coordinate of new point
 * @param z - z-coordinate of new point
 * @returns with x, y and z as coordinates
 */
function make_3D_point(x: number, y: number, z: number): Point {
  return { x, y, z, color: [0, 0, 0, 1] };
}

/**
 * makes a color Point with given x and y coordinates, and RGB values ranging
 * from 0 to 255. Any input lower than 0 for RGB will be rounded up to 0, and
 * any input higher than 255 will be rounded down to 255.
 *
 * @param x - x-coordinate of new point
 * @param y - y-coordinate of new point
 * @param r - red component of new point
 * @param g - green component of new point
 * @param b - blue component of new point
 * @returns with x and y as coordinates, and r, g and b as RGB values
 */
function make_color_point(
  x: number,
  y: number,
  r: number,
  g: number,
  b: number
): Point {
  return { x, y, z: 0, color: [r / 255, g / 255, b / 255, 1] };
}

/**
 * makes a 3D color Point with given x, y and z coordinates, and RGB values
 * ranging from 0 to 255. Any input lower than 0 for RGB will be rounded up to
 * 0, and any input higher than 255 will be rounded down to 255.
 *
 * @param x - x-coordinate of new point
 * @param y - y-coordinate of new point
 * @param z - z-coordinate of new point
 * @param r - red component of new point
 * @param g - green component of new point
 * @param b - blue component of new point
 * @returns with x, y and z as coordinates, and r, g and b as RGB values
 */
function make_3D_color_point(
  x: number,
  y: number,
  z: number,
  r: number,
  g: number,
  b: number
): Point {
  return { x, y, z, color: [r / 255, g / 255, b / 255, 1] };
}

/**
 * retrieves the x-coordinate of a given Point.
 *
 * @param p - given point
 * @returns x-coordinate of the Point
 */
function x_of(pt: Point): number {
  return pt.x;
}

/**
 * retrieves the y-coordinate of a given Point.
 *
 * @param p - given point
 * @returns y-coordinate of the Point
 */
function y_of(pt: Point): number {
  return pt.y;
}

/**
 * retrieves the z-coordinate of a given Point.
 *
 * @param p - given point
 * @returns z-coordinate of the Point
 */
function z_of(pt: Point): number {
  return pt.z;
}

/**
 * retrieves the red component of a given Point.
 *
 * @param p - given point
 * @returns Red component of the Point
 */
function r_of(pt: Point): number {
  return pt.color[0] * 255;
}

/**
 * retrieves the green component of a given Point.
 *
 * @param p - given point
 * @returns Green component of the Point
 */
function g_of(pt: Point): number {
  return pt.color[1] * 255;
}

/**
 * retrieves the blue component of a given Point.
 *
 * @param p - given point
 * @returns Blue component of the Point
 */
function b_of(pt: Point): number {
  return pt.color[2] * 255;
}

/**
 * this function is a Curve transformation: a function from a Curve to a Curve.
 * The points of the result Curve are the same points as the points of the
 * original Curve, but in reverse: The result Curve applied to 0 is the original
 * Curve applied to 1 and vice versa.
 *
 * @param original - original Curve
 * @returns result Curve
 */
function invert(curve: CurveFunction): CurveFunction {
  return (t: number) => curve(1 - t);
}

/**
 * this function returns a Curve transformation: It takes an x-value x0, a
 * y-value y0 and a z-value z0, each with default value of 0, as arguments and
 * returns a Curve transformation that takes a Curve as argument and returns a
 * new Curve, by translating the original by x0 in x-direction, y0 in
 * y-direction and z0 in z-direction.
 *
 * @param x0 - (Optional) x-value
 * @param y0 - (Optional) y-value
 * @param z0 - (Optional) z-value
 * @returns Curve transformation
 */
function translate(x0: number, y0: number, z0: number): CurveTransformer {
  return (curve: CurveFunction) => {
    const transformation = (cf: CurveFunction) => (t: number) => {
      const a = x0 === undefined ? 0 : x0;
      const b = y0 === undefined ? 0 : y0;
      const c = z0 === undefined ? 0 : z0;
      const ct: Point = cf(t);
      return make_3D_color_point(
        a + x_of(ct),
        b + y_of(ct),
        c + z_of(ct),
        r_of(ct),
        g_of(ct),
        b_of(ct)
      );
    };
    return transformation(curve);
  };
}

/**
 * this function takes either 1 or 3 angles, a, b and c in radians as parameter
 * and returns a Curve transformation: a function that takes a Curve as argument
 * and returns a new Curve, which is the original Curve rotated by the given
 * angle around the z-axis (1 parameter) in counter-clockwise direction, or the
 * original Curve rotated extrinsically with Euler angles (a, b, c) about x, y,
 * and z axes (3 parameters).
 *
 * @param a - given angle
 * @param b - (Optional) given angle
 * @param c - (Optional) given angle
 * @returns function that takes a Curve and returns a Curve
 */
function rotate_around_origin(
  theta1: number,
  theta2: number,
  theta3: number
): CurveTransformer {
  if (theta3 === undefined && theta1 !== undefined && theta2 !== undefined) {
    // 2 args
    throw new Error('Expected 1 or 3 arguments, but received 2');
  } else if (
    theta1 !== undefined &&
    theta2 === undefined &&
    theta3 === undefined
  ) {
    // 1 args
    const cth = Math.cos(theta1);
    const sth = Math.sin(theta1);
    return (curve: CurveFunction) => {
      const transformation = (c: CurveFunction) => (t: number) => {
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
    return (curve: CurveFunction) => {
      const transformation = (c: CurveFunction) => (t: number) => {
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
        for (let i = 0; i < 3; i += 1) {
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
 * this function takes scaling factors <CODE>a</CODE>, <CODE>b</CODE> and
 * <CODE>c</CODE>, each with default value of 1, as arguments and returns a
 * Curve transformation that scales a given Curve by <CODE>a</CODE> in
 * x-direction, <CODE>b</CODE> in y-direction and <CODE>c</CODE> in z-direction.
 *
 * @param a - (Optional) scaling factor in x-direction
 * @param b - (Optional) scaling factor in y-direction
 * @param c - (Optional) scaling factor in z-direction
 * @returns function that takes a Curve and returns a Curve
 */
function scale(a: number, b: number, c: number): CurveTransformer {
  return (curve) => {
    const transformation = (cf: CurveFunction) => (t: number) => {
      const ct = cf(t);
      const a1 = a === undefined ? 1 : a;
      const b1 = b === undefined ? 1 : b;
      const c1 = c === undefined ? 1 : c;
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
 * this function takes a scaling factor s argument and returns a Curve
 * transformation that scales a given Curve by s in x, y and z direction.
 *
 * @param s - scaling factor
 * @returns function that takes a Curve and returns a Curve
 */
function scale_proportional(s: number): CurveTransformer {
  return scale(s, s, s);
}

/**
 * this function is a Curve transformation: It takes a Curve as argument and
 * returns a new Curve, as follows. A Curve is in <EM>standard position</EM> if
 * it starts at (0,0) ends at (1,0). This function puts the given Curve in
 * standard position by rigidly translating it so its start Point is at the
 * origin (0,0), then rotating it about the origin to put its endpoint on the
 * x axis, then scaling it to put the endpoint at (1,0). Behavior is unspecified
 * on closed Curves where start-point equal end-point.
 *
 * @param curve - given Curve
 * @returns result Curve
 */
function put_in_standard_position(curve: CurveFunction): CurveFunction {
  const start_point = curve(0);
  const curve_started_at_origin = translate(
    -x_of(start_point),
    -y_of(start_point),
    0
  )(curve);
  const new_end_point = curve_started_at_origin(1);
  const theta = Math.atan2(y_of(new_end_point), x_of(new_end_point));
  const curve_ended_at_x_axis = rotate_around_origin(
    0,
    0,
    -theta
  )(curve_started_at_origin);
  const end_point_on_x_axis = x_of(curve_ended_at_x_axis(1));
  return scale_proportional(1 / end_point_on_x_axis)(curve_ended_at_x_axis);
}

/**
 * this function is a binary Curve operator: It takes two Curves as arguments
 * and returns a new Curve. The two Curves are combined by using the full first
 * Curve for the first portion of the result and by using the full second Curve
 * for the second portion of the result. The second Curve is not changed, and
 * therefore there might be a big jump in the middle of the result Curve.
 *
 * @param curve1 - first Curve
 * @param curve2 - second Curve
 * @returns result Curve
 */
function connect_rigidly(
  curve1: CurveFunction,
  curve2: CurveFunction
): CurveFunction {
  return (t) => (t < 1 / 2 ? curve1(2 * t) : curve2(2 * t - 1));
}

/**
 * this function is a binary Curve operator: It takes two Curves as arguments
 * and returns a new Curve. The two Curves are combined by using the full first
 * Curve for the first portion of the result and by using the full second Curve
 * for the second portion of the result. The second Curve is translated such
 * that its point at fraction 0 is the same as the Point of the first Curve at
 * fraction 1.
 *
 * @param curve1 - first Curve
 * @param curve2 - second Curve
 * @returns result Curve
 */
function connect_ends(
  curve1: CurveFunction,
  curve2: CurveFunction
): CurveFunction {
  const start_point_of_curve2 = curve2(0);
  const end_point_of_curve1 = curve1(1);
  return connect_rigidly(
    curve1,
    translate(
      x_of(end_point_of_curve1) - x_of(start_point_of_curve2),
      y_of(end_point_of_curve1) - y_of(start_point_of_curve2),
      z_of(end_point_of_curve1) - z_of(start_point_of_curve2)
    )(curve2)
  );
}

// SOME CURVES

/**
 * this function is a curve: a function from a fraction t to a point.
 * The points lie on the unit circle. They start at Point (1,0)
 * when t is 0. When t is 0.25, they reach Point (0,1), when t is 0.5,
 * they reach Point (-1, 0), etc.
 *
 * @param t - fraction between 0 and 1
 * @returns Point in the circle at t
 */
function unit_circle(t: number): Point {
  return make_point(Math.cos(2 * Math.PI * t), Math.sin(2 * Math.PI * t));
}

/**
 * this function is a curve: a function from a fraction t to a point.
 * The x-coordinate at franction t is t, and the y-coordinate is 0.
 *
 * @param t - fraction between 0 and 1
 * @returns Point in the line at t
 */
function unit_line(t: number): Point {
  return make_point(t, 0);
}

/**
 * this function is a Curve generator: it takes a number and
 * returns a horizontal curve. The number is a y-coordinate,
 * and the Curve generates only points with the given y-coordinate.
 *
 * @param t - fraction between 0 and 1
 * @returns horizontal Curve
 */
function unit_line_at(t: number): CurveFunction {
  return (a: number): Point => make_point(a, t);
}

// made available for Mission 6
/**
 * this function is a curve: a function from a fraction t to a point.
 * The points lie on the right half of the unit circle. They start at
 * Point (0,1) when t is 0. When t is 0.5, they reach Point (1,0),
 * when t is 1, they reach Point (0, -1).
 *
 * @param t - fraction between 0 and 1
 * @returns Point in the arc at t
 */
function arc(t: number): Point {
  return make_point(Math.sin(Math.PI * t), Math.cos(Math.PI * t));
}

export default function curves() {
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
    unit_line,
    unit_line_at,
    unit_circle,
    connect_rigidly,
    connect_ends,
    put_in_standard_position,
    translate,
    scale_proportional,
    scale,
    rotate_around_origin,
    arc,
    invert,
  };
}
