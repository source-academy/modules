/**
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
 * // Example
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
 * @module csg
 * @author Joel Leow
 * @author Liu Muchen
 * @author Ng Yin Joe
 * @author Yu Chenbo
 */



/* [Imports] */
import { primitives } from '@jscad/modeling';
import { colorize as colorSolid } from '@jscad/modeling/src/colors';
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
import { serialize } from '@jscad/stl-serializer';
import {
  head,
  list,
  tail,
  type List,
} from 'js-slang/dist/stdlib/list';
import save from 'save-file';
import { Core } from './core.js';
import type { Solid } from './jscad/types.js';
import {
  Group,
  Shape,
  hexToColor,
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
 * @category Color
 */
export const black: string = '#000000';

/**
 * A hex color code for dark blue (#0000AA).
 *
 * @category Color
 */
export const navy: string = '#0000AA';

/**
 * A hex color code for green (#00AA00).
 *
 * @category Color
 */
export const green: string = '#00AA00';

/**
 * A hex color code for dark cyan (#00AAAA).
 *
 * @category Color
 */
export const teal: string = '#00AAAA';

/**
 * A hex color code for dark red (#AA0000).
 *
 * @category Color
 */
export const crimson: string = '#AA0000';

/**
 * A hex color code for purple (#AA00AA).
 *
 * @category Color
 */
export const purple: string = '#AA00AA';

/**
 * A hex color code for orange (#FFAA00).
 *
 * @category Color
 */
export const orange: string = '#FFAA00';

/**
 * A hex color code for light gray (#AAAAAA).
 *
 * @category Color
 */
export const silver: string = '#AAAAAA';

/**
 * A hex color code for dark gray (#555555).
 *
 * @category Color
 */
export const gray: string = '#555555';

/**
 * A hex color code for blue (#5555FF).
 *
 * @category Color
 */
export const blue: string = '#5555FF';

/**
 * A hex color code for light green (#55FF55).
 *
 * @category Color
 */
export const lime: string = '#55FF55';

/**
 * A hex color code for cyan (#55FFFF).
 *
 * @category Color
 */
export const cyan: string = '#55FFFF';

/**
 * A hex color code for light red (#FF5555).
 *
 * @category Color
 */
export const rose: string = '#FF5555';

/**
 * A hex color code for pink (#FF55FF).
 *
 * @category Color
 */
export const pink: string = '#FF55FF';

/**
 * A hex color code for yellow (#FFFF55).
 *
 * @category Color
 */
export const yellow: string = '#FFFF55';

/**
 * A hex color code for white (#FFFFFF).
 *
 * @category Color
 */
export const white: string = '#FFFFFF';

// [Functions - Primitives]

/**
 * Returns a cube Shape in the specified color.
 *
 * Side length: 1
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Side length: 1
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Height: 1
 * Radius: 0.5
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Height: 1
 * Radius: 0.5
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Radius: 0.5
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Radius: 0.5
 * Center: Floating at (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Height: 1
 * Side length: 1
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Height: 1
 * Radius: 0.5
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Height: 1
 * Side length: 1
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Height: 1
 * Center: (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * Inner radius: 0.15 (ring is 0.3 thick)
 * Total radius: 0.5 (from the hole to "outside")
 * Center: Floating at (0.5, 0.5, 0.5)
 *
 * @param hex hex color code
 *
 * @category Primitive
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
 * @category Operation
 */
export function union(first: Shape, second: Shape): Shape {
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
 * @category Operation
 */
export function subtract(target: Shape, subtractedShape: Shape): Shape {
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
 * @category Operation
 */
export function intersect(first: Shape, second: Shape): Shape {
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
 * @category Transformation
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
 * @category Transformation
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
 * For example, a factor of 1 results in the original Shape, while a factor of
 * -1 results in a reflection of the Shape. A factor of 0.5 results in a smaller
 * Shape, while a factor of 2 results in a larger Shape. Factors cannot be 0.
 *
 * @param operable Shape or Group
 * @param xFactor x scaling factor
 * @param yFactor y scaling factor
 * @param zFactor z scaling factor
 * @returns scaled Shape
 *
 * @category Transformation
 */
export function scale(
  operable: Operable,
  xFactor: number,
  yFactor: number,
  zFactor: number,
): Operable {
  if (xFactor === 0 || yFactor === 0 || zFactor === 0) {
    throw new Error('Scaling factor cannot be 0');
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
 * @category Utility
 */
export function group(operables: List): Group {
  return new Group(listToArray(operables));
}

/**
 * Ungroups the specified Group, returning the list of Shapes and/or nested
 * Groups contained within.
 *
 * @param g Group to ungroup
 * @returns ungrouped list of Shapes and/or Groups
 *
 * @category Utility
 */
export function ungroup(g: Group): List {
  if (!is_group(g)) {
    throw new Error('Only Groups can be ungrouped');
  }

  return arrayToList(g.children);
}

/**
 * Checks if the given parameter is a Shape.
 *
 * @param parameter parameter to check
 * @returns whether parameter is a Shape
 *
 * @category Utility
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
 * @category Utility
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
 * // Example
 * const getter_function = bounding_box(sphere(silver));
 * display(getter_function("y", "max")); // Displays 1, the maximum y coordinate
 * ```
 *
 * @param shape Shape to measure
 * @returns bounding box getter function
 *
 * @category Utility
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
  };
}

/**
 * Returns a hex color code representing the specified RGB values.
 *
 * @param redComponent red component of the color
 * @param greenComponent green component of the color
 * @param blueComponent blue component of the color
 * @returns hex color code
 *
 * @category Utility
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
    throw new Error('RGB components must be between 0 and 255 (inclusive)');
  }

  return `#${redComponent.toString(16)}${greenComponent.toString(16)}
    ${blueComponent.toString(16)}`;
}

/**
 * Exports the specified Shape as an STL file, downloaded to your device.
 *
 * The file can be used for purposes such as 3D printing.
 *
 * @param shape Shape to export
 */
export async function download_shape_stl(shape: Shape): Promise<void> {
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
 * @category Render
 */
export function render(operable: Operable): RenderGroup {
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
 * @category Render
 */
export function render_grid(operable: Operable): RenderGroup {
  operable.store();

  return Core.getRenderGroupManager()
    .nextRenderGroup(true);
}

/**
 * Renders the specified Operable, along with z, y, and z axes.
 *
 * @param operable Shape or Group to render
 *
 * @category Render
 */
export function render_axes(operable: Operable): RenderGroup {
  operable.store();

  return Core.getRenderGroupManager()
    .nextRenderGroup(undefined, true);
}

/**
 * Renders the specified Operable, along with both a grid and axes.
 *
 * @param operable Shape or Group to render
 *
 * @category Render
 */
export function render_grid_axes(operable: Operable): RenderGroup {
  operable.store();

  return Core.getRenderGroupManager()
    .nextRenderGroup(true, true);
}
