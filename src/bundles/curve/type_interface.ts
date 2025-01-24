import { wrapClass, wrapClassAsType, wrapMethod } from '../../typings/type_map';

@wrapClass('Point')
export class Point {}

@wrapClass('AnimatedCurve')
export class AnimatedCurve{}

@wrapClassAsType('(u: number) => Point')
export class Curve {}

@wrapClassAsType('(t: number) => Curve')
export class CurveAnimation {}

export class TypeInterface {
  @wrapMethod('duration: number, fps: number, drawer: (func: Curve) => Curve, func: (func: Curve) => Curve', 'AnimatedCurve')
  animate_3D_curve() {}

  @wrapMethod('duration: number, fps: number, drawer: (func: Curve) => Curve, func: (func: Curve) => Curve', 'AnimatedCurve')
  animate_curve() {}

  @wrapMethod('t: number', 'number')
  arc() {}

  @wrapMethod('p: Point', 'number')
  b_of() {}

  @wrapMethod('curve1: Curve, curve2: Curve', 'Curve')
  connect_ends() {}

  @wrapMethod('curve1: Curve, curve2: Curve', 'Curve')
  connect_rigidly() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_3D_connected() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_3D_connected_full_view() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_3D_connected_full_view_proportional() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_3D_points() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_3D_points_full_view() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_3D_points_full_view_proportional() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_connected() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_connected_full_view() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_connected_full_view_proportional() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_points() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_points_full_view() {}

  @wrapMethod('numPoints: number', '(func: Curve) => Curve')
  draw_points_full_view_proportional() {}

  @wrapMethod('p: Point', 'number')
  g_of() {}

  @wrapMethod('curve: Curve', 'Curve')
  invert() {}

  @wrapMethod('x: number, y: number, z: number, r: number, g: number, b: number', 'Point')
  make_3D_color_point() {}

  @wrapMethod('x: number, y: number, z: number', 'Point')
  make_3D_point() {}

  @wrapMethod('x: number, y: number, r: number, g: number, b: number', 'Point')
  make_color_point() {}

  @wrapMethod('x: number, y: number', 'Point')
  make_point() {}

  @wrapMethod('curve: Curve', 'Curve')
  put_in_standard_position() {}

  @wrapMethod('p: Point', 'number')
  r_of() {}

  @wrapMethod('theta1: number, theta2: number, theta3: number', '(c: Curve) => Curve')
  rotate_around_origin() {}

  @wrapMethod('x: number, y: number', '(c: Curve) => Curve')
  scale() {}

  @wrapMethod('s: number', '(c: Curve) => Curve')
  scale_proportional() {}

  @wrapMethod('x0: number, y0: number, z0: number', '(c: Curve) => Curve')
  translate() {}

  @wrapMethod('t: number', 'Point')
  unit_circle() {}

  @wrapMethod('t: number', 'Point')
  unit_line() {}

  @wrapMethod('t: number', 'Curve')
  unit_line_at() {}

  @wrapMethod('p: Point', 'number')
  x_of() {}

  @wrapMethod('p: Point', 'number')
  y_of() {}

  @wrapMethod('p: Point', 'number')
  z_of() {}
}
