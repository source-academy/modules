/**
 * drawing *curves*, i.e. collections of *points*, on a canvas in a tools tab
 *
 * A *point* is defined by its coordinates (x, y and z), and the color assigned to
 * it (r, g, and b). A few constructors for points is given, for example
 * `make_color_point`. Selectors allow access to the coordinates and color
 * components, for example `x_of`.
 *
 * A *curve* is a
 * unary function which takes a number argument within the unit interval `[0,1]`
 * and returns a point. If `C` is a curve, then the starting point of the curve
 * is always `C(0)`, and the ending point is always `C(1)`.
 *
 * A *curve transformation* is a function that takes a curve as argument and
 * returns a curve. Examples of curve transformations are `scale` and `translate`.
 *
 * A *curve drawer* is function that takes a number argument and returns
 * a function that takes a curve as argument and visualises it in the output screen is
 * shown in the Source Academy in the tab with the "Curves Canvas" icon (image).
 * The following [example](https://share.sourceacademy.org/unitcircle) uses
 * the curve drawer `draw_connected_full_view` to display a curve called
 * `unit_circle`.
 * ```
 * import { make_point, draw_connected_full_view } from "curve";
 * function unit_circle(t) {
 *   return make_point(math_sin(2 * math_PI * t),
 *                     math_cos(2 * math_PI * t));
 * }
 * draw_connected_full_view(100)(unit_circle);
 * ```
 * draws a full circle in the display tab.
 *
 * @module curve
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

/* eslint-disable @typescript-eslint/naming-convention */
import { context } from 'js-slang/moduleHelpers';
import { type Curve, type CurveDrawn, generateCurve, Point } from './curves_webgl';
import {
  AnimatedCurve,
  type CurveAnimation,
  type CurveSpace,
  type CurveTransformer,
  type DrawMode,
  type RenderFunction,
  type ScaleMode,
} from './types';

const drawnCurves: (CurveDrawn | AnimatedCurve)[] = [];
context.moduleContexts.curve.state = {
  drawnCurves,
};

function createDrawFunction(
  scaleMode: ScaleMode,
  drawMode: DrawMode,
  space: CurveSpace,
  isFullView: boolean,
): (numPoints: number) => RenderFunction {
  return (numPoints: number) => {
    const func = (curve: Curve) => {
      const curveDrawn = generateCurve(
        scaleMode,
        drawMode,
        numPoints,
        curve,
        space,
        isFullView,
      );

      if (!curve.shouldNotAppend) {
        drawnCurves.push(curveDrawn);
      }

      return curveDrawn;
    };
    // Because the draw functions are actually functions
    // we need hacky workarounds like these to pass information around
    func.is3D = space === '3D';
    return func;
  };
}

// =============================================================================
// Module's Exposed Functions
//
// This file only includes the implementation and documentation of exposed
// functions of the module. For private functions dealing with the browser's
// graphics library context, see './curves_webgl.ts'.
// =============================================================================

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points and connecting each pair with a line.
 * The parts between (0,0) and (1,1) of the resulting Drawing are shown in the window.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_connected(100)(t => make_point(t, t));
 * ```
 */
export const draw_connected = createDrawFunction('none', 'lines', '2D', false);

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points and connecting each pair with a line. The Drawing is
 * translated and stretched/shrunk to show the full curve and maximize its width
 * and height, with some padding.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_connected_full_view(100)(t => make_point(t, t));
 * ```
 */
export const draw_connected_full_view = createDrawFunction(
  'stretch',
  'lines',
  '2D',
  true,
);

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points and connecting each pair with a line. The Drawing
 * is translated and scaled proportionally to show the full curve and maximize
 * its size, with some padding.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_connected_full_view_proportional(100)(t => make_point(t, t));
 * ```
 */
export const draw_connected_full_view_proportional = createDrawFunction(
  'fit',
  'lines',
  '2D',
  true,
);

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points. The Drawing consists of isolated
 * points, and does not connect them. The parts between (0,0) and (1,1) of the
 * resulting Drawing are shown in the window.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1,there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_points(100)(t => make_point(t, t));
 * ```
 */
export const draw_points = createDrawFunction('none', 'points', '2D', false);

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points. The Drawing consists of isolated
 * points, and does not connect them. The Drawing is translated and
 * stretched/shrunk to show the full curve and maximize its width and height,
 * with some padding.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_points_full_view(100)(t => make_point(t, t));
 * ```
 */
export const draw_points_full_view = createDrawFunction(
  'stretch',
  'points',
  '2D',
  true,
);

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points. The Drawing consists of isolated
 * points, and does not connect them. The Drawing is translated and scaled
 * proportionally with its size maximized to fit entirely inside the window,
 * with some padding.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_points_full_view_proportional(100)(t => make_point(t, t));
 * ```
 */
export const draw_points_full_view_proportional = createDrawFunction(
  'fit',
  'points',
  '2D',
  true,
);

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points and connecting each pair with
 * a line. The parts between (0,0,0) and (1,1,1) of the resulting Drawing are
 * shown within the unit cube.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_connected(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_connected = createDrawFunction(
  'none',
  'lines',
  '3D',
  false,
);

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points and connecting each pair with
 * a line. The Drawing is translated and stretched/shrunk to show the full
 * curve and maximize its width and height within the cube.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_connected_full_view(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_connected_full_view = createDrawFunction(
  'stretch',
  'lines',
  '3D',
  false,
);

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points and connecting each pair with
 * a line. The Drawing is translated and scaled proportionally with its size
 * maximized to fit entirely inside the cube.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_connected_full_view_proportional(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_connected_full_view_proportional = createDrawFunction(
  'fit',
  'lines',
  '3D',
  false,
);

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points. The Drawing consists of
 * isolated points, and does not connect them. The parts between (0,0,0)
 * and (1,1,1) of the resulting Drawing are shown within the unit cube.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_points(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_points = createDrawFunction('none', 'points', '3D', false);

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points. The Drawing consists of
 * isolated points, and does not connect them. The Drawing is translated and
 * stretched/shrunk to maximize its size to fit entirely inside the cube.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_points_full_view(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_points_full_view = createDrawFunction(
  'stretch',
  'points',
  '3D',
  false,
);

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points. The Drawing consists of
 * isolated points, and does not connect them. The Drawing is translated and
 * scaled proportionally with its size maximized to fit entirely inside the cube.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_points_full_view_proportional(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_points_full_view_proportional = createDrawFunction(
  'fit',
  'points',
  '3D',
  false,
);

/**
 * Makes a Point with given x and y coordinates.
 *
 * @param x x-coordinate of new point
 * @param y y-coordinate of new point
 * @returns with x and y as coordinates
 * @example
 * ```
 * const point = make_point(0.5, 0.5);
 * ```
 */
export function make_point(x: number, y: number): Point {
  return new Point(x, y, 0, [0, 0, 0, 1]);
}

/**
 * Makes a 3D Point with given x, y and z coordinates.
 *
 * @param x x-coordinate of new point
 * @param y y-coordinate of new point
 * @param z z-coordinate of new point
 * @returns with x, y and z as coordinates
 * @example
 * ```
 * const point = make_3D_point(0.5, 0.5, 0.5);
 * ```
 */
export function make_3D_point(x: number, y: number, z: number): Point {
  return new Point(x, y, z, [0, 0, 0, 1]);
}

/**
 * Makes a color Point with given x and y coordinates, and RGB values ranging
 * from 0 to 255. Any input lower than 0 for RGB will be rounded up to 0, and
 * any input higher than 255 will be rounded down to 255.
 *
 * @param x x-coordinate of new point
 * @param y y-coordinate of new point
 * @param r red component of new point
 * @param g green component of new point
 * @param b blue component of new point
 * @returns with x and y as coordinates, and r, g and b as RGB values
 * @example
 * ```
 * const redPoint = make_color_point(0.5, 0.5, 255, 0, 0);
 * ```
 */
export function make_color_point(
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
): Point {
  return new Point(x, y, 0, [r / 255, g / 255, b / 255, 1]);
}

/**
 * Makes a 3D color Point with given x, y and z coordinates, and RGB values
 * ranging from 0 to 255. Any input lower than 0 for RGB will be rounded up to
 * 0, and any input higher than 255 will be rounded down to 255.
 *
 * @param x x-coordinate of new point
 * @param y y-coordinate of new point
 * @param z z-coordinate of new point
 * @param r red component of new point
 * @param g green component of new point
 * @param b blue component of new point
 * @returns with x, y and z as coordinates, and r, g and b as RGB values
 * @example
 * ```
 * const redPoint = make_color_point(0.5, 0.5, 0.5, 255, 0, 0);
 * ```
 */
export function make_3D_color_point(
  x: number,
  y: number,
  z: number,
  r: number,
  g: number,
  b: number,
): Point {
  return new Point(x, y, z, [r / 255, g / 255, b / 255, 1]);
}

/**
 * Retrieves the x-coordinate of a given Point.
 *
 * @param p given point
 * @returns x-coordinate of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * x_of(point); // Returns 1
 * ```
 */
export function x_of(pt: Point): number {
  return pt.x;
}

/**
 * Retrieves the y-coordinate of a given Point.
 *
 * @param p given point
 * @returns y-coordinate of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * y_of(point); // Returns 2
 * ```
 */
export function y_of(pt: Point): number {
  return pt.y;
}

/**
 * Retrieves the z-coordinate of a given Point.
 *
 * @param p given point
 * @returns z-coordinate of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * z_of(point); // Returns 3
 * ```
 */
export function z_of(pt: Point): number {
  return pt.z;
}

/**
 * Retrieves the red component of a given Point.
 *
 * @param p given point
 * @returns Red component of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * r_of(point); // Returns 50
 * ```
 */
export function r_of(pt: Point): number {
  return pt.color[0] * 255;
}

/**
 * Retrieves the green component of a given Point.
 *
 * @param p given point
 * @returns Green component of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * g_of(point); // Returns 100
 * ```
 */
export function g_of(pt: Point): number {
  return pt.color[1] * 255;
}

/**
 * Retrieves the blue component of a given Point.
 *
 * @param p given point
 * @returns Blue component of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * b_of(point); // Returns 150
 * ```
 */
export function b_of(pt: Point): number {
  return pt.color[2] * 255;
}

/**
 * This function is a Curve transformation: a function from a Curve to a Curve.
 * The points of the result Curve are the same points as the points of the
 * original Curve, but in reverse: The result Curve applied to 0 is the original
 * Curve applied to 1 and vice versa.
 *
 * @param original original Curve
 * @returns result Curve
 */
export function invert(curve: Curve): Curve {
  return (t: number) => curve(1 - t);
}

/**
 * This function returns a Curve transformation: It takes an x-value x0, a
 * y-value y0 and a z-value z0, as arguments and
 * returns a Curve transformation that takes a Curve as argument and returns a
 * new Curve, by translating the original by x0 in x-direction, y0 in
 * y-direction and z0 in z-direction.
 *
 * @param x0 x-value
 * @param y0 y-value
 * @param z0 z-value
 * @returns Curve transformation
 */
export function translate(
  x0: number,
  y0: number,
  z0: number,
): CurveTransformer {
  return (curve: Curve) => {
    const transformation = (cf: Curve) => (t: number) => {
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
        b_of(ct),
      );
    };
    return transformation(curve);
  };
}

/**
 * This function takes 3 angles, a, b and c in radians as parameter
 * and returns a Curve transformation: a function that takes a Curve as argument
 * and returns a new Curve, which is the original Curve rotated
 * extrinsically with Euler angles (a, b, c) about x, y,
 * and z axes.
 *
 * @param a given angle
 * @param b given angle
 * @param c given angle
 * @returns function that takes a Curve and returns a Curve
 */
export function rotate_around_origin(
  theta1: number,
  theta2: number,
  theta3: number,
): CurveTransformer {
  if (theta3 === undefined && theta1 !== undefined && theta2 !== undefined) {
    // 2 args
    throw new Error('Expected 1 or 3 arguments, but received 2');
  } else if (
    theta1 !== undefined
    && theta2 === undefined
    && theta3 === undefined
  ) {
    // 1 args
    const cth = Math.cos(theta1);
    const sth = Math.sin(theta1);
    return (curve: Curve) => {
      const transformation = (c: Curve) => (t: number) => {
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
          b_of(ct),
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
    return (curve: Curve) => {
      const transformation = (c: Curve) => (t: number) => {
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
 * This function takes scaling factors `a`, `b` and
 * `c`, as arguments and returns a
 * Curve transformation that scales a given Curve by `a` in
 * x-direction, `b` in y-direction and `c` in z-direction.
 *
 * @param a scaling factor in x-direction
 * @param b scaling factor in y-direction
 * @param c scaling factor in z-direction
 * @returns function that takes a Curve and returns a Curve
 */
export function scale(a: number, b: number, c: number): CurveTransformer {
  return (curve) => {
    const transformation = (cf: Curve) => (t: number) => {
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
        b_of(ct),
      );
    };
    return transformation(curve);
  };
}

/**
 * This function takes a scaling factor s argument and returns a Curve
 * transformation that scales a given Curve by s in x, y and z direction.
 *
 * @param s scaling factor
 * @returns function that takes a Curve and returns a Curve
 */
export function scale_proportional(s: number): CurveTransformer {
  return scale(s, s, s);
}

/**
 * This function is a Curve transformation: It takes a Curve as argument and
 * returns a new Curve, as follows. A Curve is in standard position if it
 * starts at (0,0) ends at (1,0). This function puts the given Curve in
 * standard position by rigidly translating it so its start Point is at the
 * origin (0,0), then rotating it about the origin to put its endpoint on the
 * x axis, then scaling it to put the endpoint at (1,0). Behavior is unspecified
 * on closed Curves where start-point equal end-point.
 *
 * @param curve given Curve
 * @returns result Curve
 */
export function put_in_standard_position(curve: Curve): Curve {
  const start_point = curve(0);
  const curve_started_at_origin = translate(
    -x_of(start_point),
    -y_of(start_point),
    0,
  )(curve);
  const new_end_point = curve_started_at_origin(1);
  const theta = Math.atan2(y_of(new_end_point), x_of(new_end_point));
  const curve_ended_at_x_axis = rotate_around_origin(
    0,
    0,
    -theta,
  )(curve_started_at_origin);
  const end_point_on_x_axis = x_of(curve_ended_at_x_axis(1));
  return scale_proportional(1 / end_point_on_x_axis)(curve_ended_at_x_axis);
}

/**
 * This function is a binary Curve operator: It takes two Curves as arguments
 * and returns a new Curve. The two Curves are combined by using the full first
 * Curve for the first portion of the result and by using the full second Curve
 * for the second portion of the result. The second Curve is not changed, and
 * therefore there might be a big jump in the middle of the result Curve.
 *
 * @param curve1 first Curve
 * @param curve2 second Curve
 * @returns result Curve
 */
export function connect_rigidly(curve1: Curve, curve2: Curve): Curve {
  return (t) => (t < 1 / 2 ? curve1(2 * t) : curve2(2 * t - 1));
}

/**
 * This function is a binary Curve operator: It takes two Curves as arguments
 * and returns a new Curve. The two Curves are combined by using the full first
 * Curve for the first portion of the result and by using the full second Curve
 * for the second portion of the result. The second Curve is translated such
 * that its point at fraction 0 is the same as the Point of the first Curve at
 * fraction 1.
 *
 * @param curve1 first Curve
 * @param curve2 second Curve
 * @returns result Curve
 */
export function connect_ends(curve1: Curve, curve2: Curve): Curve {
  const startPointOfCurve2 = curve2(0);
  const endPointOfCurve1 = curve1(1);
  return connect_rigidly(
    curve1,
    translate(
      x_of(endPointOfCurve1) - x_of(startPointOfCurve2),
      y_of(endPointOfCurve1) - y_of(startPointOfCurve2),
      z_of(endPointOfCurve1) - z_of(startPointOfCurve2),
    )(curve2),
  );
}

/**
 * This function is a curve: a function from a fraction t to a point. The points
 * lie on the unit circle. They start at Point (1,0) when t is 0. When t is
 * 0.25, they reach Point (0,1), when t is 0.5, they reach Point (-1, 0), etc.
 *
 * @param t fraction between 0 and 1
 * @returns Point on the circle at t
 */
export function unit_circle(t: number): Point {
  return make_point(Math.cos(2 * Math.PI * t), Math.sin(2 * Math.PI * t));
}

/**
 * This function is a curve: a function from a fraction t to a point. The
 * x-coordinate at fraction t is t, and the y-coordinate is 0.
 *
 * @param t fraction between 0 and 1
 * @returns Point on the line at t
 */
export function unit_line(t: number): Point {
  return make_point(t, 0);
}

/**
 * This function is a Curve generator: it takes a number and returns a
 * horizontal curve. The number is a y-coordinate, and the Curve generates only
 * points with the given y-coordinate.
 *
 * @param t fraction between 0 and 1
 * @returns horizontal Curve
 */
export function unit_line_at(t: number): Curve {
  return (a: number): Point => make_point(a, t);
}

/**
 * This function is a curve: a function from a fraction t to a point. The points
 * lie on the right half of the unit circle. They start at Point (0,1) when t is
 * 0. When t is 0.5, they reach Point (1,0), when t is 1, they reach Point
 * (0, -1).
 *
 * @param t fraction between 0 and 1
 * @returns Point in the arc at t
 */
export function arc(t: number): Point {
  return make_point(Math.sin(Math.PI * t), Math.cos(Math.PI * t));
}

/**
 * Create a animation of curves using a curve generating function.
 * @param duration The duration of the animation in seconds
 * @param fps Framerate of the animation in frames per second
 * @param drawer Draw function to the generated curves with
 * @param func Curve generating function. Takes in a timestamp value and returns a curve
 * @return Curve Animation
 */
export function animate_curve(
  duration: number,
  fps: number,
  drawer: RenderFunction,
  func: CurveAnimation,
): AnimatedCurve {
  if (drawer.is3D) {
    throw new Error('animate_curve cannot be used with 3D draw function!');
  }

  const anim = new AnimatedCurve(duration, fps, func, drawer, false);
  drawnCurves.push(anim);
  return anim;
}

/**
 * Create a animation of curves using a curve generating function.
 * @param duration The duration of the animation in seconds
 * @param fps Framerate of the animation in frames per second
 * @param drawer Draw function to the generated curves with
 * @param func Curve generating function. Takes in a timestamp value and returns a curve
 * @return 3D Curve Animation
 */
export function animate_3D_curve(
  duration: number,
  fps: number,
  drawer: RenderFunction,
  func: CurveAnimation,
): AnimatedCurve {
  if (!drawer.is3D) {
    throw new Error('animate_3D_curve cannot be used with 2D draw function!');
  }

  const anim = new AnimatedCurve(duration, fps, func, drawer, true);
  drawnCurves.push(anim);
  return anim;
}
