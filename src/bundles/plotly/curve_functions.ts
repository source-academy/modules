import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import { type Curve, CurvePlot, type Point } from './plotly';

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
