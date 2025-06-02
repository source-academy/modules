/* eslint-disable @typescript-eslint/no-unused-vars */
import createTypeMap from '@sourceacademy/modules-lib/type_map';

const typeMapCreator = createTypeMap();
const { classDeclaration, functionDeclaration, typeDeclaration } = typeMapCreator;

@classDeclaration('Point')
class Point {}

@classDeclaration('AnimatedCurve')
class AnimatedCurve{}

@typeDeclaration('(u: number) => Point')
class Curve {}

@typeDeclaration('(t: number) => Curve')
class CurveAnimation {}

class TypeInterface {
  @functionDeclaration('duration: number, fps: number, drawer: (func: Curve) => Curve, func: (func: Curve) => Curve', 'AnimatedCurve')
  animate_3D_curve() {}

  @functionDeclaration('duration: number, fps: number, drawer: (func: Curve) => Curve, func: (func: Curve) => Curve', 'AnimatedCurve')
  animate_curve() {}

  @functionDeclaration('t: number', 'number')
  arc() {}

  @functionDeclaration('p: Point', 'number')
  b_of() {}

  @functionDeclaration('curve1: Curve, curve2: Curve', 'Curve')
  connect_ends() {}

  @functionDeclaration('curve1: Curve, curve2: Curve', 'Curve')
  connect_rigidly() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_3D_connected() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_3D_connected_full_view() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_3D_connected_full_view_proportional() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_3D_points() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_3D_points_full_view() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_3D_points_full_view_proportional() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_connected() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_connected_full_view() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_connected_full_view_proportional() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_points() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_points_full_view() {}

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  draw_points_full_view_proportional() {}

  @functionDeclaration('p: Point', 'number')
  g_of() {}

  @functionDeclaration('curve: Curve', 'Curve')
  invert() {}

  @functionDeclaration('x: number, y: number, z: number, r: number, g: number, b: number', 'Point')
  make_3D_color_point() {}

  @functionDeclaration('x: number, y: number, z: number', 'Point')
  make_3D_point() {}

  @functionDeclaration('x: number, y: number, r: number, g: number, b: number', 'Point')
  make_color_point() {}

  @functionDeclaration('x: number, y: number', 'Point')
  make_point() {}

  @functionDeclaration('curve: Curve', 'Curve')
  put_in_standard_position() {}

  @functionDeclaration('p: Point', 'number')
  r_of() {}

  @functionDeclaration('theta1: number, theta2: number, theta3: number', '(c: Curve) => Curve')
  rotate_around_origin() {}

  @functionDeclaration('x: number, y: number', '(c: Curve) => Curve')
  scale() {}

  @functionDeclaration('s: number', '(c: Curve) => Curve')
  scale_proportional() {}

  @functionDeclaration('x0: number, y0: number, z0: number', '(c: Curve) => Curve')
  translate() {}

  @functionDeclaration('t: number', 'Point')
  unit_circle() {}

  @functionDeclaration('t: number', 'Point')
  unit_line() {}

  @functionDeclaration('t: number', 'Curve')
  unit_line_at() {}

  @functionDeclaration('p: Point', 'number')
  x_of() {}

  @functionDeclaration('p: Point', 'number')
  y_of() {}

  @functionDeclaration('p: Point', 'number')
  z_of() {}
}

/** @hidden */
export const type_map = typeMapCreator.type_map;
