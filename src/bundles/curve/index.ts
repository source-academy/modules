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
export {
  animate_3D_curve,
  animate_curve,
  arc,
  b_of,
  connect_ends,
  connect_rigidly,
  draw_3D_connected,
  draw_3D_connected_full_view,
  draw_3D_connected_full_view_proportional,
  draw_3D_points,
  draw_3D_points_full_view,
  draw_3D_points_full_view_proportional,
  draw_connected,
  draw_connected_full_view,
  draw_connected_full_view_proportional,
  draw_points,
  draw_points_full_view,
  draw_points_full_view_proportional,
  g_of,
  invert,
  make_3D_color_point,
  make_3D_point,
  make_color_point,
  make_point,
  put_in_standard_position,
  r_of,
  rotate_around_origin,
  scale,
  scale_proportional,
  translate,
  unit_circle,
  unit_line,
  unit_line_at,
  x_of,
  y_of,
  z_of,
} from './functions';
