/**
<<<<<<< HEAD
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
=======
 * The CSG module enables working with Constructive Solid Geometry in the Source
 * Academy. Users are able to program colored 3D models and interact with them
 * in a tab.
 *
 * The main objects in use are called Shapes. Users can create, operate on,
 * transform, and finally render these Shapes.
 *
 * There are also Groups, which contain Shapes, but can also contain other
 * nested Groups. Groups allow many Shapes to be transformed in tandem, as
 * opposed to having to call transform functions on each Shape individually.
 *
 * An object that is either a Shape or a Group is called an Operable. Operables
 * as a whole are stateless, which means that passing them into functions does
 * not modify the original Operable; instead, the newly created Operable is
 * returned. Therefore, it is safe to reuse existing Operables after passing
 * them into functions, as they remain immutable.
 *
 * When you are done modeling your Operables, pass them to one of the CSG
 * rendering functions to have them displayed in a tab.
 *
 * When rendering, you may optionally render with a grid and/or axes displayed,
 * depending on the rendering function used. The grid appears on the XY-plane
 * with white lines every 1 unit of distance, and slightly fainter lines every
 * 0.25 units of distance. The axes for x, y, and z are coloured red, green, and
 * blue respectively. The positive z direction is upwards from the flat plane
 * (right-handed coordinate system).
 *
 * ```js
 * // Sample usage
 * import {
 *     silver, crimson, cyan,
 *     cube, cone, sphere,
 *     intersect, union, scale, translate,
 *     render_grid_axes
 * } from "csg";
 *
 * const base = intersect(
 *     scale(cube(silver), 1, 1, 0.3),
 *     scale(cone(crimson), 1, 1, 3)
 * );
 * const snowglobe = union(
 *     translate(sphere(cyan), 0, 0, 0.22),
 *     base
 * );
 * render_grid_axes(snowglobe);
 * ```
 *
 * More samples can be found at: https://github.com/source-academy/modules/tree/master/src/bundles/csg/samples
 *
 * @module csg
 * @author Joel Leow
 * @author Liu Muchen
 * @author Ng Yin Joe
 * @author Yu Chenbo
 */



/* [Imports] */
import { primitives } from '@jscad/modeling';
import { colorize as colorSolid } from '@jscad/modeling/src/colors';
>>>>>>> origin/master
import {
  measureBoundingBox,
  type BoundingBox,
} from '@jscad/modeling/src/measurements';
import {
  intersect as _intersect,
  subtract as _subtract,
  union as _union,
} from '@jscad/modeling/src/operations/booleans';
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions';
<<<<<<< HEAD
import { align } from '@jscad/modeling/src/operations/transforms';
import { serialize } from '@jscad/stl-serializer';
import save from 'save-file';
import { SILVER } from './constants.js';
import { Core } from './core.js';
import type { Solid } from './jscad/types.js';
import { type List } from './types';
=======
import { serialize } from '@jscad/stl-serializer';
import {
  head,
  list,
  tail,
  type List,
  is_list,
} from 'js-slang/dist/stdlib/list';
import save from 'save-file';
import { Core } from './core.js';
import type { Solid } from './jscad/types.js';
>>>>>>> origin/master
import {
  Group,
  Shape,
  hexToColor,
<<<<<<< HEAD
  type Entity,
  type RenderGroup,
} from './utilities';

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
export function scale(entity: Entity, x: number, y: number, z: number): Entity {
  if (x <= 0 || y <= 0 || z <= 0) {
    throw new Error('factors must be non-zero');
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
  let bounds: BoundingBox = measureBoundingBox(shape.solid);
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
=======
  type Operable,
  type RenderGroup,
  centerPrimitive,
} from './utilities';
import { degreesToRadians } from '../../common/utilities.js';



/* [Main] */
/* NOTE
  These functions involving calls (not merely types) to js-slang make this file
  only usable in bundles. DO NOT import this file in tabs or the build will
  fail. Something about the node modules that building them involves causes
  esbuild to attempt but fail to include Node-specific APIs (eg fs, os, https)
  in the output that's meant for a browser environment (you can't use those in
  the browser since they are Node-only). This is why we keep these functions
  here instead of in utilities.ts.

  When a user passes in a List, we convert it to arrays here so that the rest of
  the underlying code is free to operate with arrays.
*/
export function listToArray(l: List): Operable[] {
  let operables: Operable[] = [];
  while (l !== null) {
    let operable: Operable = head(l);
    operables.push(operable);
    l = tail(l);
  }
  return operables;
}

export function arrayToList(array: Operable[]): List {
  return list(...array);
}



/* [Exports] */

// [Variables - Colors]

/**
 * A hex color code for black (#000000).
 *
 * @category Colors
 */
export const black: string = '#000000';

/**
 * A hex color code for dark blue (#0000AA).
 *
 * @category Colors
 */
export const navy: string = '#0000AA';

/**
 * A hex color code for green (#00AA00).
 *
 * @category Colors
 */
export const green: string = '#00AA00';

/**
 * A hex color code for dark cyan (#00AAAA).
 *
 * @category Colors
 */
export const teal: string = '#00AAAA';

/**
 * A hex color code for dark red (#AA0000).
 *
 * @category Colors
 */
export const crimson: string = '#AA0000';

/**
 * A hex color code for purple (#AA00AA).
 *
 * @category Colors
 */
export const purple: string = '#AA00AA';

/**
 * A hex color code for orange (#FFAA00).
 *
 * @category Colors
 */
export const orange: string = '#FFAA00';

/**
 * A hex color code for light gray (#AAAAAA).
 *
 * @category Colors
 */
export const silver: string = '#AAAAAA';

/**
 * A hex color code for dark gray (#555555).
 *
 * @category Colors
 */
export const gray: string = '#555555';

/**
 * A hex color code for blue (#5555FF).
 *
 * @category Colors
 */
export const blue: string = '#5555FF';

/**
 * A hex color code for light green (#55FF55).
 *
 * @category Colors
 */
export const lime: string = '#55FF55';

/**
 * A hex color code for cyan (#55FFFF).
 *
 * @category Colors
 */
export const cyan: string = '#55FFFF';

/**
 * A hex color code for light red (#FF5555).
 *
 * @category Colors
 */
export const rose: string = '#FF5555';

/**
 * A hex color code for pink (#FF55FF).
 *
 * @category Colors
 */
export const pink: string = '#FF55FF';

/**
 * A hex color code for yellow (#FFFF55).
 *
 * @category Colors
 */
export const yellow: string = '#FFFF55';

/**
 * A hex color code for white (#FFFFFF).
 *
 * @category Colors
 */
export const white: string = '#FFFFFF';

// [Functions - Primitives]

/**
 * Returns a cube Shape in the specified color.
 *
 * - Side length: 1
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function cube(hex: string): Shape {
  let solid: Solid = primitives.cube({ size: 1 });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

/**
 * Returns a rounded cube Shape in the specified color.
 *
 * - Side length: 1
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function rounded_cube(hex: string): Shape {
  let solid: Solid = primitives.roundedCuboid({ size: [1, 1, 1] });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

/**
 * Returns an upright cylinder Shape in the specified color.
 *
 * - Height: 1
 * - Radius: 0.5
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function cylinder(hex: string): Shape {
  let solid: Solid = primitives.cylinder({
    height: 1,
    radius: 0.5,
  });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

/**
 * Returns a rounded, upright cylinder Shape in the specified color.
 *
 * - Height: 1
 * - Radius: 0.5
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function rounded_cylinder(hex: string): Shape {
  let solid: Solid = primitives.roundedCylinder({
    height: 1,
    radius: 0.5,
  });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

/**
 * Returns a sphere Shape in the specified color.
 *
 * - Radius: 0.5
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function sphere(hex: string): Shape {
  let solid: Solid = primitives.sphere({ radius: 0.5 });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

/**
 * Returns a geodesic sphere Shape in the specified color.
 *
 * - Radius: 0.5
 * - Center: Floating at (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function geodesic_sphere(hex: string): Shape {
  let solid: Solid = primitives.geodesicSphere({ radius: 0.5 });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

/**
 * Returns a square pyramid Shape in the specified color.
 *
 * - Height: 1
 * - Base length: 1
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function pyramid(hex: string): Shape {
  let pythagorasSide: number = Math.sqrt(2); // sqrt(1^2 + 1^2)
  let radius = pythagorasSide / 2;
  let solid: Solid = primitives.cylinderElliptic({
    height: 1,
    // Base starting radius
    startRadius: [radius, radius],
    // Radius by the time the top is reached
    endRadius: [0, 0],
    segments: 4,
  });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  shape = rotate(shape, 0, 0, degreesToRadians(45)) as Shape;
  return centerPrimitive(shape);
}

/**
 * Returns a cone Shape in the specified color.
 *
 * - Height: 1
 * - Radius: 0.5
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function cone(hex: string): Shape {
  let solid: Solid = primitives.cylinderElliptic({
    height: 1,
    startRadius: [0.5, 0.5],
    endRadius: [0, 0],
  });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

/**
 * Returns an upright triangular prism Shape in the specified color.
 *
 * - Height: 1
 * - Side length: 1
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function prism(hex: string): Shape {
  let solid: Solid = extrudeLinear(
    { height: 1 },
    primitives.triangle(),
  );
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  shape = rotate(shape, 0, 0, degreesToRadians(-90)) as Shape;
  return centerPrimitive(shape);
}

/**
 * Returns an upright extruded star Shape in the specified color.
 *
 * - Height: 1
 * - Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function star(hex: string): Shape {
  let solid: Solid = extrudeLinear(
    { height: 1 },
    primitives.star({ outerRadius: 0.5 }),
  );
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

/**
 * Returns a torus (donut) Shape in the specified color.
 *
 * - Inner radius: 0.15 (ring is 0.3 thick)
 * - Total radius: 0.5 (from the centre of the hole to "outside")
 * - Center: Floating at (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitives
 */
export function torus(hex: string): Shape {
  let solid: Solid = primitives.torus({
    innerRadius: 0.15,
    outerRadius: 0.35,
  });
  let shape: Shape = new Shape(
    colorSolid(
      hexToColor(hex),
      solid,
    ),
  );
  return centerPrimitive(shape);
}

// [Functions - Operations]

/**
 * Returns the union of the two specified Shapes.
 *
 * @param first first Shape
 * @param second second Shape
 * @returns unioned Shape
 *
 * @category Operations
 */
export function union(first: Shape, second: Shape): Shape {
  if (!is_shape(first) || !is_shape(second)) {
    throw new Error('Failed to union, only Shapes can be operated on');
  }

  let solid: Solid = _union(first.solid, second.solid);
  return new Shape(solid);
}

/**
 * Subtracts the second Shape from the first Shape, returning the resultant
 * Shape.
 *
 * @param target target Shape to be subtracted from
 * @param subtractedShape Shape to remove from the first Shape
 * @returns subtracted Shape
 *
 * @category Operations
 */
export function subtract(target: Shape, subtractedShape: Shape): Shape {
  if (!is_shape(target) || !is_shape(subtractedShape)) {
    throw new Error('Failed to subtract, only Shapes can be operated on');
  }

  let solid: Solid = _subtract(target.solid, subtractedShape.solid);
  return new Shape(solid);
}

/**
 * Returns the intersection of the two specified Shapes.
 *
 * @param first first Shape
 * @param second second Shape
 * @returns intersected Shape
 *
 * @category Operations
 */
export function intersect(first: Shape, second: Shape): Shape {
  if (!is_shape(first) || !is_shape(second)) {
    throw new Error('Failed to intersect, only Shapes can be operated on');
  }

  let solid: Solid = _intersect(first.solid, second.solid);
  return new Shape(solid);
}

// [Functions - Transformations]

/**
 * Translates (moves) the specified Operable in the x, y, and z directions using
 * the specified offsets.
 *
 * @param operable Shape or Group
 * @param xOffset x offset
 * @param yOffset y offset
 * @param zOffset z offset
 * @returns translated Shape
 *
 * @category Transformations
 */
export function translate(
  operable: Operable,
  xOffset: number,
  yOffset: number,
  zOffset: number,
): Operable {
  return operable.translate([xOffset, yOffset, zOffset]);
}

/**
 * Sequentially rotates the specified Operable about the x, y, and z axes using
 * the specified angles, in radians (i.e. 2π represents 360°).
 *
 * The order of rotation is: x, y, then z axis. The order of rotation can affect
 * the result, so you may wish to make multiple separate calls to rotate() if
 * you require a specific order of rotation.
 *
 * @param operable Shape or Group
 * @param xAngle x angle in radians
 * @param yAngle y angle in radians
 * @param zAngle z angle in radians
 * @returns rotated Shape
 *
 * @category Transformations
 */
export function rotate(
  operable: Operable,
  xAngle: number,
  yAngle: number,
  zAngle: number,
): Operable {
  return operable.rotate([xAngle, yAngle, zAngle]);
}

/**
 * Scales the specified Operable in the x, y, and z directions using the
 * specified factors. Scaling is done about the origin (0, 0, 0).
 *
 * For example, a factor of 0.5 results in a smaller Shape, while a factor of 2
 * results in a larger Shape. A factor of 1 results in the original Shape.
 * Factors must be greater than 0.
 *
 * @param operable Shape or Group
 * @param xFactor x scaling factor
 * @param yFactor y scaling factor
 * @param zFactor z scaling factor
 * @returns scaled Shape
 *
 * @category Transformations
 */
export function scale(
  operable: Operable,
  xFactor: number,
  yFactor: number,
  zFactor: number,
): Operable {
  if (xFactor <= 0 || yFactor <= 0 || zFactor <= 0) {
    // JSCAD library does not allow factors <= 0
    throw new Error('Scaling factor must be greater than 0');
  }

  return operable.scale([xFactor, yFactor, zFactor]);
}

// [Functions - Utilities]

/**
 * Groups the specified list of Operables together. Groups can contain a mix of
 * Shapes and other nested Groups.
 *
 * Groups cannot be operated on, but can be transformed together. I.e. a call
 * like `intersect(group_a, group_b)` is not allowed, but a call like
 * `scale(group, 5, 5, 5)` is.
 *
 * @param operables list of Shapes and/or Groups
 * @returns new Group
 *
 * @category Utilities
 */
export function group(operables: List): Group {
  if (!is_list(operables)) {
    throw new Error('Only lists of Operables can be grouped');
  }

  return new Group(listToArray(operables));
}

/**
 * Ungroups the specified Group, returning the list of Shapes and/or nested
 * Groups contained within.
 *
 * @param g Group to ungroup
 * @returns ungrouped list of Shapes and/or Groups
 *
 * @category Utilities
 */
export function ungroup(g: Group): List {
  if (!is_group(g)) {
    throw new Error('Only Groups can be ungrouped');
  }

  return arrayToList(g.ungroup());
}

/**
 * Checks if the given parameter is a Shape.
 *
 * @param parameter parameter to check
 * @returns whether parameter is a Shape
 *
 * @category Utilities
 */
export function is_shape(parameter: unknown): boolean {
  return parameter instanceof Shape;
}

/**
 * Checks if the given parameter is a Group.
 *
 * @param parameter parameter to check
 * @returns whether parameter is a Group
 *
 * @category Utilities
 */
export function is_group(parameter: unknown): boolean {
  return parameter instanceof Group;
}

/**
 * Returns a function of type (string, string) → number, for getting the
 * specified Shape's bounding box coordinates.
 *
 * Its first parameter must be "x", "y", or "z", indicating the coordinate axis.
 *
 * Its second parameter must be "min" or "max", indicating the minimum or
 * maximum bounding box coordinate respectively.
 *
 * For example, if a sphere of radius 0.5 is centred at (0.5, 0.5, 0.5), its
 * minimum bounding coordinates will be (0, 0, 0), and its maximum bounding
 * coordinates will be (1, 1, 1).
 *
 * ```js
 * // Sample usage
 * const getter_function = bounding_box(sphere(silver));
 * display(getter_function("y", "max")); // Displays 1, the maximum y coordinate
 * ```
 *
 * @param shape Shape to measure
 * @returns bounding box getter function
 *
 * @category Utilities
 */
export function bounding_box(
  shape: Shape,
): (axis: string, minMax: string) => number {
  let bounds: BoundingBox = measureBoundingBox(shape.solid);

  return (axis: string, minMax: string): number => {
    let j: number;
    if (axis === 'x') j = 0;
    else if (axis === 'y') j = 1;
    else if (axis === 'z') j = 2;
    else {
      throw new Error(
        `Bounding box getter function expected "x", "y", or "z" as first parameter, but got ${axis}`,
      );
    }

    let i: number;
    if (minMax === 'min') i = 0;
    else if (minMax === 'max') i = 1;
    else {
      throw new Error(
        `Bounding box getter function expected "min" or "max" as second parameter, but got ${minMax}`,
      );
    }

    return bounds[i][j];
>>>>>>> origin/master
  };
}

/**
<<<<<<< HEAD
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
  if (
    redComponent < 0
    || redComponent > 255
    || greenComponent < 0
    || greenComponent > 255
    || blueComponent < 0
    || blueComponent > 255
  ) {
    throw new Error('invalid argument value: expects [0, 255]');
  }
  return `#${redComponent.toString(16)}${greenComponent.toString(
    16,
  )}${blueComponent.toString(16)}`;
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
=======
 * Returns a hex color code representing the specified RGB values.
 *
 * @param redValue red value of the color
 * @param greenValue green value of the color
 * @param blueValue blue value of the color
 * @returns hex color code
 *
 * @category Utilities
 */
export function rgb(
  redValue: number,
  greenValue: number,
  blueValue: number,
): string {
  if (
    redValue < 0
    || redValue > 255
    || greenValue < 0
    || greenValue > 255
    || blueValue < 0
    || blueValue > 255
  ) {
    throw new Error('RGB values must be between 0 and 255 (inclusive)');
  }

  return `#${redValue.toString(16)}${greenValue.toString(16)}
    ${blueValue.toString(16)}`;
}

/**
 * Exports the specified Shape as an STL file, downloaded to your device.
 *
 * The file can be used for purposes such as 3D printing.
 *
 * @param shape Shape to export
 *
 * @category Utilities
 */
export async function download_shape_stl(shape: Shape): Promise<void> {
  if (!is_shape(shape)) {
    throw new Error('Failed to export, only Shapes can be converted to STL');
  }

  await save(
    new Blob(serialize({ binary: true }, shape.solid)),
    'Source Academy CSG Shape.stl',
  );
}

// [Functions - Rendering]

/**
 * Renders the specified Operable.
 *
 * @param operable Shape or Group to render
 *
 * @category Rendering
 */
export function render(operable: Operable): RenderGroup {
  if (!(operable instanceof Shape || operable instanceof Group)) {
    throw new Error('Only Operables can be rendered');
  }

  operable.store();

  // Trigger a new render group for use with subsequent renders.
  // Render group is returned for REPL text only; do not document
  return Core.getRenderGroupManager()
    .nextRenderGroup();
}

/**
 * Renders the specified Operable, along with a grid.
 *
 * @param operable Shape or Group to render
 *
 * @category Rendering
 */
export function render_grid(operable: Operable): RenderGroup {
  if (!(operable instanceof Shape || operable instanceof Group)) {
    throw new Error('Only Operables can be rendered');
  }

  operable.store();

>>>>>>> origin/master
  return Core.getRenderGroupManager()
    .nextRenderGroup(true);
}

/**
<<<<<<< HEAD
 * Renders a Group of Shapes, along with X, Y and Z axes.
 *
 * @param {Group} groupToRender The Group to be rendered
 */
export function render_axes(groupToRender: Group): RenderGroup {
  groupToRender.store();
=======
 * Renders the specified Operable, along with z, y, and z axes.
 *
 * @param operable Shape or Group to render
 *
 * @category Rendering
 */
export function render_axes(operable: Operable): RenderGroup {
  if (!(operable instanceof Shape || operable instanceof Group)) {
    throw new Error('Only Operables can be rendered');
  }

  operable.store();

>>>>>>> origin/master
  return Core.getRenderGroupManager()
    .nextRenderGroup(undefined, true);
}

/**
<<<<<<< HEAD
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
=======
 * Renders the specified Operable, along with both a grid and axes.
 *
 * @param operable Shape or Group to render
 *
 * @category Rendering
 */
export function render_grid_axes(operable: Operable): RenderGroup {
  if (!(operable instanceof Shape || operable instanceof Group)) {
    throw new Error('Only Operables can be rendered');
  }

  operable.store();

  return Core.getRenderGroupManager()
    .nextRenderGroup(true, true);
>>>>>>> origin/master
}
