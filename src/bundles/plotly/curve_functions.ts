import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import { type Curve, CurvePlot, Point } from './plotly';

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
export function make_point(x: number, y: number, z: number): Point {
  return new Point(x, y, 0, {r: 0, g:0, b:0 });
}


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
  return pt.color.r * 255;
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
  return pt.color.g * 255;
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
  return pt.color.b * 255;
}
export function generatePlot(
  type: string,
  numPoints: number,
  config: Data,
  layout: Partial<Layout>,
  is_colored: boolean,
  func: Curve,
): CurvePlot {
  let x_s: number[] = [];
  let y_s: number[] = [];
  let z_s: number[] = [];
  let color_s: string[] = [];
  for (let i = 0; i <= numPoints; i += 1) {
    const point = func(i / numPoints);
    x_s.push(x_of(point));
    y_s.push(y_of(point));
    z_s.push(z_of(point));
    color_s.push(`rgb(${r_of(point)},${g_of(point)},${b_of(point)})`);
  }
  const plotlyData: Data = {
    x: x_s,
    y: y_s,
    z: z_s,
    marker: {
      size: 2,
      color: color_s,
    },
  };
  return new CurvePlot(
    draw_new_curve,
    {
      ...plotlyData,
      ...config,
      type,
    } as Data,
    layout,
  );
}

function draw_new_curve(divId: string, data: Data, layout: Partial<Layout>) {
  Plotly.newPlot(divId, [data], layout);
}

export function translate(
  x0: number,
  y0: number,
  z0: number,
) {
  return (curve: Curve) => {
    const transformation = (cf: Curve) => (t: number) => {
      const a = x0 === undefined ? 0 : x0;
      const b = y0 === undefined ? 0 : y0;
      const c = z0 === undefined ? 0 : z0;
      const ct: Point = cf(t);
      return make_point(
        a + x_of(ct),
        b + y_of(ct),
        c + z_of(ct),
      );
    };
    return transformation(curve);
  };
}


export function rotate_around_origin(
  theta1: number,
  theta2: number,
  theta3: number,
) {
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
        return make_point(
          cth * x - sth * y,
          sth * x + cth * y,
          z,
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
        return make_point(xf, yf, zf);
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
export function scale(a: number, b: number, c: number) {
  return (curve) => {
    const transformation = (cf: Curve) => (t: number) => {
      const ct = cf(t);
      const a1 = a === undefined ? 1 : a;
      const b1 = b === undefined ? 1 : b;
      const c1 = c === undefined ? 1 : c;
      return make_point(
        a1 * x_of(ct),
        b1 * y_of(ct),
        c1 * z_of(ct),
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
export function scale_proportional(s: number) {
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
  return make_point(Math.cos(2 * Math.PI * t), Math.sin(2 * Math.PI * t), 0);
}

/**
 * This function is a curve: a function from a fraction t to a point. The
 * x-coordinate at fraction t is t, and the y-coordinate is 0.
 *
 * @param t fraction between 0 and 1
 * @returns Point on the line at t
 */
export function unit_line(t: number): Point {
  return make_point(t, 0, 0);
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
  return (a: number): Point => make_point(a, t, 0);
}
