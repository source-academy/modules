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
import { colorize as _colorize } from '@jscad/modeling/src/colors';
import {
  type BoundingBox,
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
} from '@jscad/modeling/src/operations/transforms';
import { serialize } from '@jscad/stl-serializer';
import save from 'save-file';
import { SILVER } from './constants.js';
import { Core } from './core.js';
import type { Color, Coordinates, Solid } from './jscad/types.js';
import { hexToColor, type Entity, Shape, Group, type RenderGroup } from './utilities';
import { type List } from './types';


/**
 * Colour the shape using the specified hex colour code.
 *
 * @param {Shape} shape - The Shape to be coloured and returned
 * @param {string} hex - The colour code to use
 * @returns {Shape} The colorized shape
 */
function colorize(shape: Shape, hex: string) {
  let color: Color = hexToColor(hex);
  let coloredSolid: Solid = _colorize(color, shape.solid);
  return new Shape(coloredSolid);
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
  let centerCoords: Coordinates = [
    bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 2,
    bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2,
    bounds[0][2] + (bounds[1][2] - bounds[0][2]) / 2,
  ];
  return (axis: String): number => {
    let i: number = axis === 'x' ? 0 : axis === 'y' ? 1 : axis === 'z' ? 2 : -1;
    if (i === -1) {
      throw Error("shape_center's returned function expects a proper axis.");
    } else {
      return centerCoords[i];
    }
  };
}

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

/* [Exports] */

// [Variables - Primitive shapes]
/**
 * Primitive Shape of a cube.
 *
 * @category Primitive
 */
const primitiveCube: Shape = shapeSetOrigin(
  new Shape(primitives.cube({ size: 1 })),
);

/**
 * Returns a Shape of a cube of a set colour or the default colour when
 * colour information is omitted.
 *
 * @param {string} hex A hex colour code
 */
export function cube(hex: string): Shape {
  const shape: Shape = primitiveCube;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a sphere.
 *
 * @category Primitive
 */
const primitiveSphere: Shape = shapeSetOrigin(
  new Shape(primitives.sphere({ radius: 0.5 })),
);

/**
 * Returns a Shape of a sphere of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function sphere(hex: string): Shape {
  const shape: Shape = primitiveSphere;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a cylinder.
 *
 * @category Primitive
 */
const primitiveCylinder: Shape = shapeSetOrigin(
  new Shape(
    primitives.cylinder({
      radius: 0.5,
      height: 1,
    }),
  ),
);

/**
 * Returns a Shape of a cylinder of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function cylinder(hex: string): Shape {
  const shape: Shape = primitiveCylinder;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a prism.
 *
 * @category Primitive
 */
const primitivePrism: Shape = shapeSetOrigin(
  new Shape(extrudeLinear({ height: 1 }, primitives.triangle())),
);

/**
 * Returns a Shape of a prism of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function prism(hex: string): Shape {
  const shape: Shape = primitivePrism;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of an extruded star.
 *
 * @category Primitive
 */
const primitiveStar: Shape = shapeSetOrigin(
  new Shape(extrudeLinear({ height: 1 }, primitives.star({ outerRadius: 0.5 }))),
);

/**
 * Returns a Shape of an extruded star of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function star(hex: string): Shape {
  const shape: Shape = primitiveStar;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a square pyramid.
 *
 * @category Primitive
 */
const primitivePyramid: Shape = shapeSetOrigin(
  new Shape(
    primitives.cylinderElliptic({
      height: 1,
      startRadius: [0.5, 0.5],
      endRadius: [Number.MIN_VALUE, Number.MIN_VALUE],
      segments: 4,
    }),
  ),
);

/**
 * Returns a Shape of a square pyramid of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function pyramid(hex: string): Shape {
  const shape: Shape = primitivePyramid;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a cone.
 *
 * @category Primitive
 */
const primitiveCone: Shape = shapeSetOrigin(
  new Shape(
    primitives.cylinderElliptic({
      height: 1,
      startRadius: [0.5, 0.5],
      endRadius: [Number.MIN_VALUE, Number.MIN_VALUE],
    }),
  ),
);

/**
 * Returns a Shape of a cone of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function cone(hex: string): Shape {
  const shape: Shape = primitiveCone;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a torus.
 *
 * @category Primitive
 */
const primitiveTorus: Shape = shapeSetOrigin(
  new Shape(
    primitives.torus({
      innerRadius: 0.125,
      outerRadius: 0.375,
    }),
  ),
);

/**
 * Returns a Shape of a torus of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function torus(hex: string): Shape {
  const shape: Shape = primitiveTorus;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a rounded cube.
 *
 * @category Primitive
 */
const primitiveRoundedCube: Shape = shapeSetOrigin(
  new Shape(primitives.roundedCuboid({ size: [1, 1, 1] })),
);

/**
 * Returns a Shape of a rounded cube of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function rounded_cube(hex: string): Shape {
  const shape: Shape = primitiveRoundedCube;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a rounded cylinder.
 *
 * @category Primitive
 */
const primitiveRoundedCylinder: Shape = shapeSetOrigin(
  new Shape(
    primitives.roundedCylinder({
      height: 1,
      radius: 0.5,
    }),
  ),
);

/**
 * Returns a Shape of a rounded cylinder of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function rounded_cylinder(hex: string): Shape {
  const shape: Shape = primitiveRoundedCylinder;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}

/**
 * Primitive Shape of a geodesic sphere.
 *
 * @category Primitive
 */
const primitiveGeodesicSphere: Shape = shapeSetOrigin(
  new Shape(primitives.geodesicSphere({ radius: 0.5 })),
);

/**
 * Returns a Shape of a geodesic sphere of a set colour.
 *
 * @param {string} hex A hex colour code
 */
export function geodesic_sphere(hex: string): Shape {
  const shape: Shape = primitiveGeodesicSphere;
  return new Shape(_colorize(hexToColor(hex), shape.solid));
}
// [Variables - Colours]

/**
 * A hex colour code for black (#000000).
 *
 * @category Colour
 */
export const black: string = '#000000';

/**
 * A hex colour code for dark blue (#0000AA).
 *
 * @category Colour
 */
export const navy: string = '#0000AA';

/**
 * A hex colour code for green (#00AA00).
 *
 * @category Colour
 */
export const green: string = '#00AA00';

/**
 * A hex colour code for dark cyan (#00AAAA).
 *
 * @category Colour
 */
export const teal: string = '#00AAAA';

/**
 * A hex colour code for dark red (#AA0000).
 *
 * @category Colour
 */
export const crimson: string = '#AA0000';

/**
 * A hex colour code for purple (#AA00AA).
 *
 * @category Colour
 */
export const purple: string = '#AA00AA';

/**
 * A hex colour code for orange (#FFAA00).
 *
 * @category Colour
 */
export const orange: string = '#FFAA00';

/**
 * A hex colour code for light grey (#AAAAAA). This is the default colour used
 * when storing a Shape.
 *
 * @category Colour
 */
export const silver: string = SILVER;

/**
 * A hex colour code for dark grey (#555555).
 *
 * @category Colour
 */
export const gray: string = '#555555';

/**
 * A hex colour code for blue (#5555FF).
 *
 * @category Colour
 */
export const blue: string = '#5555FF';

/**
 * A hex colour code for light green (#55FF55).
 *
 * @category Colour
 */
export const lime: string = '#55FF55';

/**
 * A hex colour code for cyan (#55FFFF).
 *
 * @category Colour
 */
export const cyan: string = '#55FFFF';

/**
 * A hex colour code for light red (#FF5555).
 *
 * @category Colour
 */
export const rose: string = '#FF5555';

/**
 * A hex colour code for pink (#FF55FF).
 *
 * @category Colour
 */
export const pink: string = '#FF55FF';

/**
 * A hex colour code for yellow (#FFFF55).
 *
 * @category Colour
 */
export const yellow: string = '#FFFF55';

/**
 * A hex colour code for white (#FFFFFF).
 *
 * @category Colour
 */
export const white: string = '#FFFFFF';

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
 * Scales the shape in the x, y and z direction with the specified factor.
 * Factors must be non-zero.
 * For example, scaling the shape by 1 in x, y and z directions results in
 * the original shape.
 * Scaling the shape by -1 in x direction and 1 in y and z directions results
 * in the reflection
 *
 * @param {Entity} entity - The Group or Shape to be scaled
 * @param {number} x - Scaling in the x direction
 * @param {number} y - Scaling in the y direction
 * @param {number} z - Scaling in the z direction
 * @returns {Shape} Resulting Shape
 */
export function scale(
  entity: Entity,
  x: number,
  y: number,
  z: number,
): Entity {
  if (x === 0 || y === 0 || z === 0) {
    throw new Error(
      'factors must be non-zero',
    );
  }
  return entity.scale([x, y, z]);
}

/**
 * Translate / Move the shape by the provided x, y and z units from negative
 * infinity to infinity.
 *
 * @param {Entity} entity - The Group or Shape to be translated
 * @param {number} x - The number to shift the shape in the x direction
 * @param {number} y - The number to shift the shape in the y direction
 * @param {number} z - The number to shift the shape in the z direction
 * @returns {Shape} The translated shape
 */
export function translate(
  entity: Entity,
  x: number,
  y: number,
  z: number,
): Entity {
  return entity.translate([x, y, z]);
}

/**
 * Rotate the shape by the provided angles in the x, y and z direction.
 * Angles provided are in the form of radians (i.e. 2π represent 360
 * degrees). Note that the order of rotation is from the x direction first,
 * followed by the y and z directions.
 *
 * @param {Entity} entity - The Group or Shape to be rotated
 * @param {number} x - Angle of rotation in the x direction
 * @param {number} y - Angle of rotation in the y direction
 * @param {number} z - Angle of rotation in the z direction
 * @returns {Shape} The rotated shape
 */
export function rotate(
  entity: Entity,
  x: number,
  y: number,
  z: number,
): Entity {
  return entity.rotate([x, y, z]);
}

/**
 * Returns a lambda function that contains the coordinates of the bounding box.
 * Provided with the axis 'x', 'y' or 'z' and value 'min' for minimum and 'max'
 * for maximum, it returns the coordinates of the bounding box.
 *
 * For example,
 * ````
 * const a = bounding_box(sphere);
 * a('x', 'min'); // Returns the minimum x coordinate of the bounding box
 * ````
 *
 * @param {Shape} shape - The scale to be measured
 * @returns {(String, String) => number} A lambda function providing the
 * shape's bounding box coordinates
 */

export function bounding_box(
  shape: Shape,
): (axis: String, min: String) => number {
  let bounds: BoundingBox = measureBoundingBox(shape.clone().solid);
  return (axis: String, min: String): number => {
    let i: number = axis === 'x' ? 0 : axis === 'y' ? 1 : axis === 'z' ? 2 : -1;
    let j: number = min === 'min' ? 0 : min === 'max' ? 1 : -1;
    if (i === -1 || j === -1) {
      throw Error(
        'bounding_box returned function expects a proper axis and min String.',
      );
    } else {
      return bounds[j][i];
    }
  };
}

/**
 * Returns a hex colour code representing the colour specified by the given RGB values.
 * @param {number} redComponent Red component of the colour
 * @param {number} greenComponent Green component of the colour
 * @param {number} blueComponent Blue component of the colour
 * @returns {string} The hex colour code
 */
export function rgb(
  redComponent: number,
  greenComponent: number,
  blueComponent: number,
): string {
  if (redComponent < 0 || redComponent > 255
      || greenComponent < 0 || greenComponent > 255
      || blueComponent < 0 || blueComponent > 255) {
    throw new Error(
      'invalid argument value: expects [0, 255]',
    );
  }
  return `#${redComponent.toString(16)
  }${greenComponent.toString(16)
  }${blueComponent.toString(16)}`;
}

/**
 * Checks if the specified entity is a Shape.
 *
 * @param {unknown} entity - The entity to check
 * @returns {boolean} Whether the entity is a Shape
 */
export function is_shape(entity: unknown): boolean {
  return entity instanceof Shape;
}

/**
 * Checks if the specified entity is a Group.
 *
 * @param {unknown} entity - The entity to check
 * @returns {boolean} Whether the entity is a Group
 */
export function is_group(entity: unknown): boolean {
  return entity instanceof Group;
}

/**
 * Initializes a group of shapes, which is represented
 * as a hierarchical tree structure, with groups as
 * internal nodes and shapes as leaf nodes.
 * @param {List} children - The Groups and/or Shapes
 * to be placed inside this new Group
 * @returns {Group} The newly created Group
 */
export function group(children: List): Group {
  return new Group(children);
}

/**
 * Renders a Group of Shapes, along with a grid and axes.
 *
 * @param {Group} groupToRender The Group to be rendered
 */
export function render_grid_axes(groupToRender: Group): RenderGroup {
  groupToRender.store();
  // Render group is returned for REPL text only; do not document
  return Core.getRenderGroupManager()
    .nextRenderGroup(true, true);
}

/**
 * Renders a Group of Shapes, along with a grid.
 *
 * @param {Group} groupToRender The Group to be rendered
 */
export function render_grid(groupToRender: Group): RenderGroup {
  groupToRender.store();
  return Core.getRenderGroupManager()
    .nextRenderGroup(true);
}

/**
 * Renders a Group of Shapes, along with X, Y and Z axes.
 *
 * @param {Group} groupToRender The Group to be rendered
 */
export function render_axes(groupToRender: Group): RenderGroup {
  groupToRender.store();
  return Core.getRenderGroupManager()
    .nextRenderGroup(undefined, true);
}

/**
 * Renders a Group of Shapes.
 *
 * @param {Group} groupToRender The Group to be rendered
 */
export function render(groupToRender: Group): RenderGroup {
  groupToRender.store();
  return Core.getRenderGroupManager()
    .nextRenderGroup();
}

/**
 * Converts a shape to an downloadable STL file, which can be used for 3D printing.
 */
export async function shape_to_stl(shape: Shape): Promise<void> {
  await save(
    new Blob(serialize({ binary: true }, shape.solid)),
    'Source Academy CSG' + '.stl',
  );
}
