/**
 * The module `csg` provides functions for drawing Constructive Solid Geometry (CSG) called `Shape`.
 *
 * A *Shape* is defined by its polygons and vertices.
 *
 * @module csg
 * @author Liu Muchen
 * @author Joel Leow
 */

/* [Imports] */
import { primitives } from '@jscad/modeling';
import { colorize } from '@jscad/modeling/src/colors';
import {
  BoundingBox,
  measureArea,
  measureBoundingBox,
  measureVolume,
} from '@jscad/modeling/src/measurements';
import {
  intersect as _intersect,
  subtract as _subtract,
  union as _union,
} from '@jscad/modeling/src/operations/booleans';
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions';
import {
  align,
  center,
  mirror,
  rotate as _rotate,
  scale as _scale,
  translate as _translate,
} from '@jscad/modeling/src/operations/transforms';
import { hexToColor as hexStringToRgba } from '../rune/runes_ops.js';
import { getModuleState } from './core.js';
import { Color, CoordinatesXYZ, Solid } from './types';
import { clamp, hexToColor, Shape } from './utilities';

/* [Exports] */

// [Variables - Primitive shapes]

/**
 * Primitive Shape of a cube.
 *
 * @category Primitive
 */
export const cube: Shape = shapeSetOrigin(
  new Shape(primitives.cube({ size: 1 }))
);

/**
 * Primitive Shape of a sphere.
 *
 * @category Primitive
 */
export const sphere: Shape = shapeSetOrigin(
  new Shape(primitives.sphere({ radius: 0.5 }))
);

/**
 * Primitive Shape of a cylinder.
 *
 * @category Primitive
 */
export const cylinder: Shape = shapeSetOrigin(
  new Shape(primitives.cylinder({ radius: 0.5, height: 1 }))
);

/**
 * Primitive Shape of a prism.
 *
 * @category Primitive
 */
export const prism: Shape = shapeSetOrigin(
  new Shape(extrudeLinear({ height: 1 }, primitives.triangle()))
);

/**
 * Primitive Shape of an extruded star.
 *
 * @category Primitive
 */
export const star: Shape = shapeSetOrigin(
  new Shape(extrudeLinear({ height: 1 }, primitives.star({ outerRadius: 0.5 })))
);

//TODO
let small = 10 ** -30;

/**
 * Primitive Shape of a square pyramid.
 *
 * @category Primitive
 */
export const pyramid: Shape = shapeSetOrigin(
  new Shape(
    primitives.cylinderElliptic({
      height: 1,
      startRadius: [0.5, 0.5],
      endRadius: [small, small],
      segments: 4,
    })
  )
);

/**
 * Primitive Shape of a cone.
 *
 * @category Primitive
 */
export const cone: Shape = shapeSetOrigin(
  new Shape(
    primitives.cylinderElliptic({
      height: 1,
      startRadius: [0.5, 0.5],
      endRadius: [small, small],
    })
  )
);

/**
 * Primitive Shape of a torus.
 *
 * @category Primitive
 */
export const torus: Shape = shapeSetOrigin(
  new Shape(primitives.torus({ innerRadius: 0.125, outerRadius: 0.375 }))
);

/**
 * Primitive Shape of a rounded cube.
 *
 * @category Primitive
 */
export const roundedCube: Shape = shapeSetOrigin(
  new Shape(primitives.roundedCuboid({ size: [1, 1, 1] }))
);

/**
 * Primitive Shape of a rounded cylinder.
 *
 * @category Primitive
 */
export const roundedCylinder: Shape = shapeSetOrigin(
  new Shape(primitives.roundedCylinder({ height: 1, radius: 0.5 }))
);

/**
 * Primitive Shape of a geodesic sphere.
 *
 * @category Primitive
 */
export const geodesicSphere: Shape = shapeSetOrigin(
  new Shape(primitives.geodesicSphere({ radius: 0.5 }))
);

// [Variables - Colours]

/**
 * A Color representing black (#000000).
 *
 * @category Colour
 */
export const black: Color = hexToColor(0x000000);

/**
 * A Color representing dark blue (#0000AA).
 *
 * @category Colour
 */
export const navy: Color = hexToColor(0x0000aa);

/**
 * A Color representing green (#00AA00).
 *
 * @category Colour
 */
export const green: Color = hexToColor(0x00aa00);

/**
 * A Color representing dark cyan (#00AAAA).
 *
 * @category Colour
 */
export const teal: Color = hexToColor(0x00aaaa);

/**
 * A Color representing dark red (#AA0000).
 *
 * @category Colour
 */
export const crimson: Color = hexToColor(0xaa0000);

/**
 * A Color representing purple (#AA00AA).
 *
 * @category Colour
 */
export const purple: Color = hexToColor(0xaa00aa);

/**
 * A Color representing orange (#FFAA00).
 *
 * @category Colour
 */
export const orange: Color = hexToColor(0xffaa00);

/**
 * A Color representing light grey (#AAAAAA).
 *
 * @category Colour
 */
export const silver: Color = hexToColor(0xaaaaaa);

/**
 * A Color representing dark grey (#555555).
 *
 * @category Colour
 */
export const gray: Color = hexToColor(0x555555);

/**
 * A Color representing blue (#5555FF).
 *
 * @category Colour
 */
export const blue: Color = hexToColor(0x5555ff);

/**
 * A Color representing light green (#55FF55).
 *
 * @category Colour
 */
export const lime: Color = hexToColor(0x55ff55);

/**
 * A Color representing cyan (#55FFFF).
 *
 * @category Colour
 */
export const cyan: Color = hexToColor(0x55ffff);

/**
 * A Color representing light red (#FF5555).
 *
 * @category Colour
 */
export const rose: Color = hexToColor(0xff5555);

/**
 * A Color representing pink (#FF55FF).
 *
 * @category Colour
 */
export const pink: Color = hexToColor(0xff55ff);

/**
 * A Color representing yellow (#FFFF55).
 *
 * @category Colour
 */
export const yellow: Color = hexToColor(0xffff55);

/**
 * A Color representing white (#FFFFFF).
 *
 * @category Colour
 */
export const white: Color = hexToColor(0xffffff);

// [Functions]

/**
 * Union of the two provided shapes to produce a new shape.
 *
 * @param {Shape} a - The first shape
 * @param {Shape} b - The second shape
 * @returns {Shape} The resulting unioned shape
 */
export function union(a: Shape, b: Shape): Shape {
  let newSolid: Solid = _union(a.solid, b.solid);
  return new Shape(newSolid);
}

/**
 * Subtraction of the second shape from the first shape to produce a new shape.
 *
 * @param {Shape} a - The shape to be subtracted from
 * @param {Shape} b - The shape to remove from the first shape
 * @returns {Shape} The resulting subtracted shape
 */
export function subtract(a: Shape, b: Shape): Shape {
  let newSolid: Solid = _subtract(a.solid, b.solid);
  return new Shape(newSolid);
}

/**
 * Intersection of the two shape to produce a new shape.
 *
 * @param {Shape} a - The first shape
 * @param {Shape} b - The second shape
 * @returns {Shape} The resulting intersection shape
 */
export function intersect(a: Shape, b: Shape): Shape {
  let newSolid: Solid = _intersect(a.solid, b.solid);
  return new Shape(newSolid);
}

/**
 * Scales the shape in the x, y and z direction with the specified factor,
 * ranging from 0 to infinity.
 * For example scaling the shape by 1 in x, y and z direction results in
 * the original shape.
 *
 * @param {Shape} shape - The shape to be scaled
 * @param {number} x - Scaling in the x direction
 * @param {number} y - Scaling in the y direction
 * @param {number} z - Scaling in the z direction
 * @returns {Shape} Resulting Shape
 */
export function scale(shape: Shape, x: number, y: number, z: number): Shape {
  let newSolid: Solid = _scale([x, y, z], shape.solid);
  return new Shape(newSolid);
}

/**
 * Scales the shape in the x direction with the specified factor,
 * ranging from 0 to infinity.
 * For example scaling the shape by 1 in x direction results in the
 * original shape.
 *
 * @param {Shape} shape - The shape to be scaled
 * @param {number} x - Scaling in the x direction
 * @returns {Shape} Resulting Shape
 */
export function scale_x(shape: Shape, x: number): Shape {
  return scale(shape, x, 1, 1);
}

/**
 * Scales the shape in the y direction with the specified factor,
 * ranging from 0 to infinity.
 * For example scaling the shape by 1 in y direction results in the
 * original shape.
 *
 * @param {Shape} shape - The shape to be scaled
 * @param {number} y - Scaling in the y direction
 * @returns {Shape} Resulting Shape
 */
export function scale_y(shape: Shape, y: number): Shape {
  return scale(shape, 1, y, 1);
}

/**
 * Scales the shape in the z direction with the specified factor,
 * ranging from 0 to infinity.
 * For example scaling the shape by 1 in z direction results in the
 * original shape.
 *
 * @param {Shape} shape - The shape to be scaled
 * @param {number} z - Scaling in the z direction
 * @returns {Shape} Resulting Shape
 */
export function scale_z(shape: Shape, z: number): Shape {
  return scale(shape, 1, 1, z);
}

/**
 * Returns a lambda function that contains the center of the given shape in the
 * x, y and z direction. Providing 'x', 'y', 'z' as input would return x, y and
 * z coordinates of shape's center
 *
 * For example
 * ````
 * const a = shape_center(sphere);
 * a('x'); // Returns the x coordinate of the shape's center
 * ````
 *
 * @param {Shape} shape - The scale to be measured
 * @returns {(String) => number} A lambda function providing the shape's center
 * coordinates
 */
export function shape_center(shape: Shape): (axis: String) => number {
  let bounds: BoundingBox = measureBoundingBox(shape.solid);
  let centerCoords: CoordinatesXYZ = [
    bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 2,
    bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2,
    bounds[0][2] + (bounds[1][2] - bounds[0][2]) / 2,
  ];
  return (axis: String): number => {
    let i: number = axis === 'x' ? 0 : axis === 'y' ? 1 : axis === 'z' ? 2 : -1;
    if (i === -1) {
      throw Error(`shape_center's returned function expects a proper axis.`);
    } else {
      return centerCoords[i];
    }
  };
}

/**
 * Set the center of the shape with the provided x, y and z coordinates.
 *
 * @param {Shape} shape - The scale to have the center set
 * @param {nunber} x - The center with the x coordinate
 * @param {nunber} y - The center with the y coordinate
 * @param {nunber} z - The center with the z coordinate
 * @returns {Shape} The shape with the new center
 */
export function shape_set_center(
  shape: Shape,
  x: number,
  y: number,
  z: number
): Shape {
  let newSolid: Solid = center({ relativeTo: [x, y, z] }, shape.solid);
  return new Shape(newSolid);
}

/**
 * Measure the area of the provided shape.
 *
 * @param {Shape} shape - The shape to measure the area from
 * @returns {number} The area of the shape
 */
export function area(shape: Shape): number {
  return measureArea(shape.solid);
}

/**
 * Measure the volume of the provided shape.
 *
 * @param {Shape} shape - The shape to measure the volume from
 * @returns {number} The volume of the shape
 */
export function volume(shape: Shape): number {
  return measureVolume(shape.solid);
}

//TODO
/**
 * Mirror / Flip the provided shape by the plane with normal direction vector
 * given by the x, y and z components.
 *
 * @param {Shape} shape - The shape to mirror / flip
 * @param {number} x - The x coordinate of the direction vector
 * @param {number} y - The y coordinate of the direction vector
 * @param {number} z - The z coordinate of the direction vector
 * @returns {Shape} The mirrored / flipped shape
 */
function shape_mirror(shape: Shape, x: number, y: number, z: number) {
  let newSolid: Solid = mirror({ normal: [x, y, z] }, shape.solid);
  return new Shape(newSolid);
}

/**
 * Mirror / Flip the provided shape in the x direction.
 *
 * @param {Shape} shape - The shape to mirror / flip
 * @returns {Shape} The mirrored / flipped shape
 */
export function flip_x(shape: Shape): Shape {
  return shape_mirror(shape, 1, 0, 0);
}

/**
 * Mirror / Flip the provided shape in the y direction.
 *
 * @param {Shape} shape - The shape to mirror / flip
 * @returns {Shape} The mirrored / flipped shape
 */
export function flip_y(shape: Shape): Shape {
  return shape_mirror(shape, 0, 1, 0);
}

/**
 * Mirror / Flip the provided shape in the z direction.
 *
 * @param {Shape} shape - The shape to mirror / flip
 * @returns {Shape} The mirrored / flipped shape
 */
export function flip_z(shape: Shape): Shape {
  return shape_mirror(shape, 0, 0, 1);
}

/**
 * Translate / Move the shape by the provided x, y and z units from negative
 * infinity to infinity.
 *
 * @param {Shape} shape
 * @param {number} x - The number to shift the shape in the x direction
 * @param {number} y - The number to shift the shape in the y direction
 * @param {number} z - The number to shift the shape in the z direction
 * @returns {Shape} The translated shape
 */
export function translate(
  shape: Shape,
  x: number,
  y: number,
  z: number
): Shape {
  let newSolid: Solid = _translate([x, y, z], shape.solid);
  return new Shape(newSolid);
}

/**
 * Translate / Move the shape by the provided x units from negative infinity
 * to infinity.
 *
 * @param {Shape} shape
 * @param {number} x - The number to shift the shape in the x direction
 * @returns {Shape} The translated shape
 */
export function translate_x(shape: Shape, x: number): Shape {
  return translate(shape, x, 0, 0);
}

/**
 * Translate / Move the shape by the provided y units from negative infinity
 * to infinity.
 *
 * @param {Shape} shape
 * @param {number} y - The number to shift the shape in the y direction
 * @returns {Shape} The translated shape
 */
export function translate_y(shape: Shape, y: number): Shape {
  return translate(shape, 0, y, 0);
}

/**
 * Translate / Move the shape by the provided z units from negative infinity
 * to infinity.
 *
 * @param {Shape} shape
 * @param {number} z - The number to shift the shape in the z direction
 * @returns {Shape} The translated shape
 */
export function translate_z(shape: Shape, z: number): Shape {
  return translate(shape, 0, 0, z);
}

/**
 * Places the second shape `b` beside the first shape `a` in the positive x direction,
 * centering the `b`'s y and z on the `a`'s y and z center.
 *
 * @param {Shape} a - The shape to be placed beside with
 * @param {Shape} b - The shape placed beside
 * @returns {Shape} The final shape
 */
export function beside_x(a: Shape, b: Shape): Shape {
  let aBounds: BoundingBox = measureBoundingBox(a.solid);
  let newX: number = aBounds[1][0];
  let newY: number = aBounds[0][1] + (aBounds[1][1] - aBounds[0][1]) / 2;
  let newZ: number = aBounds[0][2] + (aBounds[1][2] - aBounds[0][2]) / 2;
  let newSolid: Solid = _union(
    a.solid, // @ts-ignore
    align(
      {
        modes: ['min', 'center', 'center'],
        relativeTo: [newX, newY, newZ],
      },
      b.solid
    )
  );
  return new Shape(newSolid);
}

/**
 * Places the second shape `b` beside the first shape `a` in the positive y direction,
 * centering the `b`'s x and z on the `a`'s x and z center.
 *
 * @param {Shape} a - The shape to be placed beside with
 * @param {Shape} b - The shape placed beside
 * @returns {Shape} The final shape
 */
export function beside_y(a: Shape, b: Shape): Shape {
  let aBounds: BoundingBox = measureBoundingBox(a.solid);
  let newX: number = aBounds[0][0] + (aBounds[1][0] - aBounds[0][0]) / 2;
  let newY: number = aBounds[1][1];
  let newZ: number = aBounds[0][2] + (aBounds[1][2] - aBounds[0][2]) / 2;
  let newSolid: Solid = _union(
    a.solid, // @ts-ignore
    align(
      {
        modes: ['center', 'min', 'center'],
        relativeTo: [newX, newY, newZ],
      },
      b.solid
    )
  );
  return new Shape(newSolid);
}

/**
 * Places the second shape `b` beside the first shape `a` in the positive z direction,
 * centering the `b`'s x and y on the `a`'s x and y center.
 *
 * @param {Shape} a - The shape to be placed beside with
 * @param {Shape} b - The shape placed beside
 * @returns {Shape} The final shape
 */
export function beside_z(a: Shape, b: Shape): Shape {
  let aBounds: BoundingBox = measureBoundingBox(a.solid);
  let newX: number = aBounds[0][0] + (aBounds[1][0] - aBounds[0][0]) / 2;
  let newY: number = aBounds[0][1] + (aBounds[1][1] - aBounds[0][1]) / 2;
  let newZ: number = aBounds[1][2];
  let newSolid: Solid = _union(
    a.solid, // @ts-ignore
    align(
      {
        modes: ['center', 'center', 'min'],
        relativeTo: [newX, newY, newZ],
      },
      b.solid
    )
  );
  return new Shape(newSolid);
}

/**
 * Returns a lambda function that contains the coordinates of the bounding box.
 * Provided with the axis 'x', 'y' or 'z' and value 'min' for minimum and 'max'
 * for maximum, it returns the coordinates of the bounding box.
 *
 * For example
 * ````
 * const a = bounding_box(sphere);
 * a('x', 'min'); // Returns the maximum x coordinate of the bounding box
 * ````
 *
 * @param {Shape} shape - The scale to be measured
 * @returns {(String, String) => number} A lambda function providing the
 * shape's bounding box coordinates
 */

export function bounding_box(
  shape: Shape
): (axis: String, min: String) => number {
  let bounds: BoundingBox = measureBoundingBox(shape.solid);
  return (axis: String, min: String): number => {
    let i: number = axis === 'x' ? 0 : axis === 'y' ? 1 : axis === 'z' ? 2 : -1;
    let j: number = min === 'min' ? 0 : min === 'max' ? 1 : -1;
    if (i === -1 || j === -1) {
      throw Error(
        `bounding_box returned function expects a proper axis and min String.`
      );
    } else {
      return bounds[j][i];
    }
  };
}

/**
 * Rotate the shape by the provided angles in the x, y and z direction.
 * Angles provided are in the form of radians (i.e. 2π represent 360
 * degrees)
 *
 * @param {Shape} shape - The shape to be rotated
 * @param {number} x - Angle of rotation in the x direction
 * @param {number} y - Angle of rotation in the y direction
 * @param {number} z - Angle of rotation in the z direction
 * @returns {Shape} The rotated shape
 */
export function rotate(shape: Shape, x: number, y: number, z: number): Shape {
  let newSolid: Solid = _rotate([x, y, z], shape.solid);
  return new Shape(newSolid);
}

/**
 * Rotate the shape by the provided angles in the x direction. Angles
 * provided are in the form of radians (i.e. 2π represent 360 degrees)
 *
 * @param {Shape} shape - The shape to be rotated
 * @param {number} x - Angle of rotation in the x direction
 * @returns {Shape} The rotated shape
 */
export function rotate_x(shape: Shape, x: number): Shape {
  return rotate(shape, x, 0, 0);
}

/**
 * Rotate the shape by the provided angles in the y direction. Angles
 * provided are in the form of radians (i.e. 2π represent 360 degrees)
 *
 * @param {Shape} shape - The shape to be rotated
 * @param {number} y - Angle of rotation in the y direction
 * @returns {Shape} The rotated shape
 */
export function rotate_y(shape: Shape, y: number): Shape {
  return rotate(shape, 0, y, 0);
}

/**
 * Rotate the shape by the provided angles in the z direction. Angles
 * provided are in the form of radians (i.e. 2π represent 360 degrees)
 *
 * @param {Shape} shape - The shape to be rotated
 * @param {number} z - Angle of rotation in the z direction
 * @returns {Shape} The rotated shape
 */
export function rotate_z(shape: Shape, z: number): Shape {
  return rotate(shape, 0, 0, z);
}

//TODO
/**
 * Center the provided shape with the middle base of the shape at (0, 0, 0).
 *
 * @param {Shape} shape - The shape to be centered
 * @returns {Shape} The shape that is centered
 */
function shapeSetOrigin(shape: Shape) {
  let newSolid: Solid = align({ modes: ['min', 'min', 'min'] }, shape.solid);
  return new Shape(newSolid);
}

/**
 * Checks if the specified argument is a Shape.
 *
 * @param {unknown} argument - The value to check.
 * @returns {boolean} Whether the argument is a Shape.
 */
export function is_shape(argument: unknown): boolean {
  return argument instanceof Shape;
}

/**
 * Creates a clone of the specified Shape.
 *
 * @param {Shape} shape - The Shape to be cloned.
 * @returns {Shape} The cloned Shape.
 */
export function clone(shape: Shape): Shape {
  return shape.clone();
}

/**
 * Stores a clone of the specified Shape for later rendering.
 *
 * @param {Shape} shape - The Shape to be stored.
 */
export function store(shape: Shape): void {
  //TODO does it automatically error when not passed the right argument type?
  getModuleState().renderGroupManager.storeShape(shape.clone());
}

/**
 * Colours a clone of the specified Shape using the specified Color, then stores
 * it for later rendering.
 *
 * @param {Shape} shape - The Shape to be coloured and stored.
 * @param {Color} color - The Color to use.
 */
export function store_as_color(shape: Shape, color: Color): void {
  try {
    let coloredSolid: Solid = colorize(color, shape.solid);
    getModuleState().renderGroupManager.storeShape(new Shape(coloredSolid));
  } catch {
    throw new Error('store_as_color() expects a Shape and a Color.');
  }
}

/**
 * Colours a clone of the specified Shape using the specified RGB values, then
 * stores it for later rendering.
 *
 * RGB values are clamped between 0 and 1.
 *
 * @param {Shape} shape - The Shape to be coloured and stored.
 * @param {number} redComponent - The colour's red component.
 * @param {number} greenComponent - The colour's green component.
 * @param {number} blueComponent - The colour's blue component.
 */
export function store_as_rgb(
  shape: Shape,
  redComponent: number,
  greenComponent: number,
  blueComponent: number
): void {
  redComponent = clamp(redComponent, 0, 1);
  greenComponent = clamp(greenComponent, 0, 1);
  blueComponent = clamp(blueComponent, 0, 1);

  let coloredSolid: Solid = colorize(
    [redComponent, greenComponent, blueComponent],
    shape.solid
  );
  getModuleState().renderGroupManager.storeShape(new Shape(coloredSolid));
}

/**
 * Colours a clone of the specified Shape using the specified hex colour code,
 * then stores it for later rendering.
 *
 * Colour codes must be of the form "#XXXXXX" or "XXXXXX", where each X
 * represents a hexadecimal number. Invalid colour codes default to black.
 *
 * @param {Shape} shape - The Shape to be coloured and stored.
 * @param {string} hex - The hexadecimal colour code.
 */
export function store_as_hex(shape: Shape, hex: string): void {
  let color: Color = hexStringToRgba(hex).slice(0, 3) as Color;
  let coloredSolid: Solid = colorize(color, shape.solid);
  getModuleState().renderGroupManager.storeShape(new Shape(coloredSolid));
}

/**
 * Renders using any Shapes stored thus far, along with a grid and axis. The
 * Shapes will then not be included in any subsequent renders.
 */
export function render_grid_axis(): void {
  getModuleState().renderGroupManager.nextRenderGroup();
  //TODO return current render group for repl text
}

/**
 * Renders using any Shapes stored thus far, along with a grid. The Shapes will
 * then not be included in any subsequent renders.
 */
export function render_grid(): void {
  getModuleState().renderGroupManager.nextRenderGroup(false);
}

/**
 * Renders using any Shapes stored thus far, along with an axis. The Shapes will
 * then not be included in any subsequent renders.
 */
export function render_axis(): void {
  getModuleState().renderGroupManager.nextRenderGroup(undefined, false);
}

/**
 * Renders using any Shapes stored thus far. The Shapes will then not be
 * included in any subsequent renders.
 */
export function render(): void {
  getModuleState().renderGroupManager.nextRenderGroup(false, false);
}
