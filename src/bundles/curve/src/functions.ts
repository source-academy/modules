import { clamp } from 'es-toolkit';
import { Point, type Curve } from './curves_webgl';
import { functionDeclaration } from './type_interface';
import type { CurveTransformer } from './types';

function throwIfNotPoint(obj: unknown, func_name: string): asserts obj is Point {
  if (!(obj instanceof Point)) {
    throw new Error(`${func_name} expects a point as argument`);
  }
}

class CurveFunctions {
  @functionDeclaration('x: number, y: number', 'Point')
  static make_point(x: number, y: number): Point {
    return new Point(x, y, 0, [0, 0, 0, 1]);
  }

  @functionDeclaration('x: number, y: number, z: number', 'Point')
  static make_3D_point(x: number, y: number, z: number): Point {
    return new Point(x, y, z, [0, 0, 0, 1]);
  }

  @functionDeclaration('x: number, y: number, r: number, g: number, b: number', 'Point')
  static make_color_point(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number
  ): Point {
    r = clamp(r, 0, 255);
    g = clamp(g, 0, 255);
    b = clamp(b, 0, 255);

    return new Point(x, y, 0, [r / 255, g / 255, b / 255, 1]);
  }

  @functionDeclaration('x: number, y: number, z: number, r: number, g: number, b: number', 'Point')
  static make_3D_color_point(
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number
  ): Point {
    r = clamp(r, 0, 255);
    g = clamp(g, 0, 255);
    b = clamp(b, 0, 255);

    return new Point(x, y, z, [r / 255, g / 255, b / 255, 1]);
  }

  @functionDeclaration('curve1: Curve, curve2: Curve', 'Curve')
  static connect_ends(curve1: Curve, curve2: Curve): Curve {
    const startPointOfCurve2 = curve2(0);
    const endPointOfCurve1 = curve1(1);
    return connect_rigidly(
      curve1,
      translate(
        x_of(endPointOfCurve1) - x_of(startPointOfCurve2),
        y_of(endPointOfCurve1) - y_of(startPointOfCurve2),
        z_of(endPointOfCurve1) - z_of(startPointOfCurve2)
      )(curve2)
    );
  }

  @functionDeclaration('curve1: Curve, curve2: Curve', 'Curve')
  static connect_rigidly(curve1: Curve, curve2: Curve): Curve {
    return (t) => (t < 1 / 2 ? curve1(2 * t) : curve2(2 * t - 1));
  }

  @functionDeclaration('x0: number, y0: number, z0: number', '(c: Curve) => Curve')
  static translate(x0: number, y0: number, z0: number): CurveTransformer {
    return curve => t => {
      const ct = curve(t);
      return new Point(
        x0 + ct.x,
        y0 + ct.y,
        z0 + ct.z,
        [ct.color[0], ct.color[1], ct.color[2], 1]
      );
    };
  }

  @functionDeclaration('curve: Curve', 'Curve')
  static invert: CurveTransformer = original => t => original(1 - t);

  @functionDeclaration('curve: Curve', 'Curve')
  static put_in_standard_position: CurveTransformer = curve => {
    const start_point = curve(0);
    const curve_started_at_origin = translate(
      -x_of(start_point),
      -y_of(start_point),
      0
    )(curve);
    const new_end_point = curve_started_at_origin(1);
    const theta = Math.atan2(y_of(new_end_point), x_of(new_end_point));
    const curve_ended_at_x_axis = rotate_around_origin_3D(
      0,
      0,
      -theta
    )(curve_started_at_origin);
    const end_point_on_x_axis = x_of(curve_ended_at_x_axis(1));
    return scale_proportional(1 / end_point_on_x_axis)(curve_ended_at_x_axis);
  };

  @functionDeclaration('a: number, b: number, c: number', '(c: Curve) => Curve')
  static rotate_around_origin_3D(a: number, b: number, c: number): CurveTransformer {
    const cthx = Math.cos(a);
    const sthx = Math.sin(a);
    const cthy = Math.cos(b);
    const sthy = Math.sin(b);
    const cthz = Math.cos(c);
    const sthz = Math.sin(c);

    return curve => t => {
      const ct = curve(t);
      const coord = [ct.x, ct.y, ct.z];
      const mat = [
        [
          cthz * cthy,
          cthz * sthy * sthx - sthz * cthx,
          cthz * sthy * cthx + sthz * sthx
        ],
        [
          sthz * cthy,
          sthz * sthy * sthx + cthz * cthx,
          sthz * sthy * cthx - cthz * sthx
        ],
        [-sthy, cthy * sthx, cthy * cthx]
      ];
      let xf = 0;
      let yf = 0;
      let zf = 0;
      for (let i = 0; i < 3; i += 1) {
        xf += mat[0][i] * coord[i];
        yf += mat[1][i] * coord[i];
        zf += mat[2][i] * coord[i];
      }
      return new Point(xf, yf, zf, [ct.color[0], ct.color[1], ct.color[2], 1]);
    };
  }

  @functionDeclaration('a: number', '(c: Curve) => Curve')
  static rotate_around_origin(a: number): CurveTransformer {
    // 1 args
    const cth = Math.cos(a);
    const sth = Math.sin(a);
    return curve => t => {
      const ct = curve(t);
      return new Point(
        cth * ct.x - sth * ct.y,
        sth * ct.x + cth * ct.y,
        ct.z,
        [ct.color[0], ct.color[1], ct.color[2], 1]
      );
    };
  }

  @functionDeclaration('x: number, y: number, z: number', '(c: Curve) => Curve')
  static scale(x: number, y: number, z: number): CurveTransformer {
    return curve => t => {
      const ct = curve(t);

      return new Point(
        x * ct.x,
        y * ct.y,
        z * ct.z,
        [ct.color[0], ct.color[1], ct.color[2], 1]
      );
    };
  }

  @functionDeclaration('s: number', '(c: Curve) => Curve')
  static scale_proportional(s: number): CurveTransformer {
    return scale(s, s, s);
  }

  @functionDeclaration('p: Point', 'number')
  static x_of(pt: Point): number {
    throwIfNotPoint(pt, x_of.name);
    return pt.x;
  }

  @functionDeclaration('p: Point', 'number')
  static y_of(pt: Point): number {
    throwIfNotPoint(pt, y_of.name);
    return pt.y;
  }

  @functionDeclaration('p: Point', 'number')
  static z_of(pt: Point): number {
    throwIfNotPoint(pt, z_of.name);
    return pt.z;
  }

  @functionDeclaration('p: Point', 'number')
  static r_of(pt: Point): number {
    throwIfNotPoint(pt, r_of.name);
    return Math.floor(pt.color[0] * 255);
  }

  @functionDeclaration('p: Point', 'number')
  static g_of(pt: Point): number {
    throwIfNotPoint(pt, g_of.name);
    return Math.floor(pt.color[1] * 255);
  }

  @functionDeclaration('p: Point', 'number')
  static b_of(pt: Point): number {
    throwIfNotPoint(pt, b_of.name);
    return Math.floor(pt.color[2] * 255);
  }

  @functionDeclaration('t: number', 'Point')
  static unit_circle: Curve = t => {
    return make_point(Math.cos(2 * Math.PI * t), Math.sin(2 * Math.PI * t));
  };

  @functionDeclaration('t: number', 'Point')
  static unit_line: Curve = t => make_point(t, 0);

  @functionDeclaration('t: number', 'Curve')
  static unit_line_at(y: number): Curve {
    return t => make_point(t, y);
  }

  @functionDeclaration('t: number', 'Point')
  static arc: Curve = t => {
    return make_point(Math.sin(Math.PI * t), Math.cos(Math.PI * t));
  };
}

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
export const make_point = CurveFunctions.make_point;

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
export const make_3D_point = CurveFunctions.make_3D_point;

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
export const make_color_point = CurveFunctions.make_color_point;

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
export const make_3D_color_point = CurveFunctions.make_3D_color_point;

/**
 * Retrieves the x-coordinate of a given Point.
 *
 * @param pt given point
 * @returns x-coordinate of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * x_of(point); // Returns 1
 * ```
 */
export const x_of = CurveFunctions.x_of;

/**
 * Retrieves the y-coordinate of a given Point.
 *
 * @param pt given point
 * @returns y-coordinate of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * y_of(point); // Returns 2
 * ```
 */
export const y_of = CurveFunctions.y_of;

/**
 * Retrieves the z-coordinate of a given Point.
 *
 * @param pt given point
 * @returns z-coordinate of the Point
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * z_of(point); // Returns 3
 * ```
 */
export const z_of = CurveFunctions.z_of;

/**
 * Retrieves the red component of a given Point.
 *
 * @param pt given point
 * @returns Red component of the Point as a value between [0,255]
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * r_of(point); // Returns 50
 * ```
 */
export const r_of = CurveFunctions.r_of;

/**
 * Retrieves the green component of a given Point.
 *
 * @param pt given point
 * @returns Green component of the Point as a value between [0,255]
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * g_of(point); // Returns 100
 * ```
 */
export const g_of = CurveFunctions.g_of;

/**
 * Retrieves the blue component of a given Point.
 *
 * @param pt given point
 * @returns Blue component of the Point as a value between [0,255]
 * @example
 * ```
 * const point = make_color_point(1, 2, 3, 50, 100, 150);
 * b_of(point); // Returns 150
 * ```
 */
export const b_of = CurveFunctions.b_of;

/**
 * This function is a Curve transformation: a function from a Curve to a Curve.
 * The points of the result Curve are the same points as the points of the
 * original Curve, but in reverse: The result Curve applied to 0 is the original
 * Curve applied to 1 and vice versa.
 *
 * @param original original Curve
 * @returns result Curve
 */
export const invert = CurveFunctions.invert;

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
export const translate = CurveFunctions.translate;

/**
 * This function takes 3 angles, a, b and c in radians as parameter
 * and returns a Curve transformation: a function that takes a 3D Curve as argument
 * and returns a new 3D Curve, which is the original Curve rotated
 * extrinsically with Euler angles (a, b, c) about x, y,
 * and z axes.
 * @param a given angle
 * @param b given angle
 * @param c given angle
 * @returns function that takes a Curve and returns a Curve
 */
export const rotate_around_origin_3D = CurveFunctions.rotate_around_origin_3D;

/**
 * This function an angle a in radians as parameter
 * and returns a Curve transformation: a function that takes a Curve as argument
 * and returns a new Curve, which is the original Curve rotated
 * extrinsically with Euler angle a about the z axis.
 *
 * @param a given angle
 * @returns function that takes a Curve and returns a Curve
 */
export const rotate_around_origin = CurveFunctions.rotate_around_origin;

/**
 * This function takes scaling factors `a`, `b` and
 * `c`, as arguments and returns a
 * Curve transformation that scales a given Curve by `a` in
 * x-direction, `b` in y-direction and `c` in z-direction.
 *
 * @param x scaling factor in x-direction
 * @param y scaling factor in y-direction
 * @param z scaling factor in z-direction
 * @returns function that takes a Curve and returns a Curve
 */
export const scale = CurveFunctions.scale;

/**
 * This function takes a scaling factor s argument and returns a Curve
 * transformation that scales a given Curve by s in x, y and z direction.
 *
 * @param s scaling factor
 * @returns function that takes a Curve and returns a Curve
 */
export const scale_proportional = CurveFunctions.scale_proportional;

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
export const put_in_standard_position = CurveFunctions.put_in_standard_position;

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
export const connect_rigidly = CurveFunctions.connect_rigidly;

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
export const connect_ends = CurveFunctions.connect_ends;

/**
 * This function is a curve: a function from a fraction t to a point. The points
 * lie on the unit circle. They start at Point (1,0) when t is 0. When t is
 * 0.25, they reach Point (0,1), when t is 0.5, they reach Point (-1, 0), etc.
 *
 * @param t fraction between 0 and 1
 * @returns Point on the circle at t
 */
export const unit_circle = CurveFunctions.unit_circle;

/**
 * This function is a curve: a function from a fraction t to a point. The
 * x-coordinate at fraction t is t, and the y-coordinate is 0.
 *
 * @param t fraction between 0 and 1
 * @returns Point on the line at t
 */
export const unit_line = CurveFunctions.unit_line;

/**
 * This function is a Curve generator: it takes a number and returns a
 * horizontal curve. The number is a y-coordinate, and the Curve generates only
 * points with the given y-coordinate.
 *
 * @param y fraction between 0 and 1
 * @returns horizontal Curve
 */
export const unit_line_at = CurveFunctions.unit_line_at;

/**
 * This function is a curve: a function from a fraction t to a point. The points
 * lie on the right half of the unit circle. They start at Point (0,1) when t is
 * 0. When t is 0.5, they reach Point (1,0), when t is 1, they reach Point
 * (0, -1).
 *
 * @param t fraction between 0 and 1
 * @returns Point in the arc at t
 */
export const arc = CurveFunctions.arc;
