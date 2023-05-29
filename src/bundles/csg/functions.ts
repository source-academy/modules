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
import { primitives } from "@jscad/modeling";
import {
  measureArea,
  measureBoundingBox,
  measureVolume,
  type BoundingBox,
} from "@jscad/modeling/src/measurements";
import {
  intersect as _intersect,
  subtract as _subtract,
  union as _union,
} from "@jscad/modeling/src/operations/booleans";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { align, center } from "@jscad/modeling/src/operations/transforms";
import { SILVER } from "./constants.js";
import { Core } from "./core.js";
import type { Coordinates, Solid } from "./jscad/types.js";
import { Group, Shape, type RenderGroup } from "./utilities";

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
  new Shape(
    primitives.cylinder({
      radius: 0.5,
      height: 1,
    })
  )
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
      endRadius: [Number.MIN_VALUE, Number.MIN_VALUE],
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
      endRadius: [Number.MIN_VALUE, Number.MIN_VALUE],
    })
  )
);

/**
 * Primitive Shape of a torus.
 *
 * @category Primitive
 */
export const torus: Shape = shapeSetOrigin(
  new Shape(
    primitives.torus({
      innerRadius: 0.125,
      outerRadius: 0.375,
    })
  )
);

/**
 * Primitive Shape of a rounded cube.
 *
 * @category Primitive
 */
export const rounded_cube: Shape = shapeSetOrigin(
  new Shape(primitives.roundedCuboid({ size: [1, 1, 1] }))
);

/**
 * Primitive Shape of a rounded cylinder.
 *
 * @category Primitive
 */
export const rounded_cylinder: Shape = shapeSetOrigin(
  new Shape(
    primitives.roundedCylinder({
      height: 1,
      radius: 0.5,
    })
  )
);

/**
 * Primitive Shape of a geodesic sphere.
 *
 * @category Primitive
 */
export const geodesic_sphere: Shape = shapeSetOrigin(
  new Shape(primitives.geodesicSphere({ radius: 0.5 }))
);

// [Variables - Colours]

/**
 * A hex colour code for black (#000000).
 *
 * @category Colour
 */
export const black: string = "#000000";

/**
 * A hex colour code for dark blue (#0000AA).
 *
 * @category Colour
 */
export const navy: string = "#0000AA";

/**
 * A hex colour code for green (#00AA00).
 *
 * @category Colour
 */
export const green: string = "#00AA00";

/**
 * A hex colour code for dark cyan (#00AAAA).
 *
 * @category Colour
 */
export const teal: string = "#00AAAA";

/**
 * A hex colour code for dark red (#AA0000).
 *
 * @category Colour
 */
export const crimson: string = "#AA0000";

/**
 * A hex colour code for purple (#AA00AA).
 *
 * @category Colour
 */
export const purple: string = "#AA00AA";

/**
 * A hex colour code for orange (#FFAA00).
 *
 * @category Colour
 */
export const orange: string = "#FFAA00";

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
export const gray: string = "#555555";

/**
 * A hex colour code for blue (#5555FF).
 *
 * @category Colour
 */
export const blue: string = "#5555FF";

/**
 * A hex colour code for light green (#55FF55).
 *
 * @category Colour
 */
export const lime: string = "#55FF55";

/**
 * A hex colour code for cyan (#55FFFF).
 *
 * @category Colour
 */
export const cyan: string = "#55FFFF";

/**
 * A hex colour code for light red (#FF5555).
 *
 * @category Colour
 */
export const rose: string = "#FF5555";

/**
 * A hex colour code for pink (#FF55FF).
 *
 * @category Colour
 */
export const pink: string = "#FF55FF";

/**
 * A hex colour code for yellow (#FFFF55).
 *
 * @category Colour
 */
export const yellow: string = "#FFFF55";

/**
 * A hex colour code for white (#FFFFFF).
 *
 * @category Colour
 */
export const white: string = "#FFFFFF";

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
export function scale(
  entity: Group | Shape,
  x: number,
  y: number,
  z: number
): Group | Shape {
  // let newSolid: Solid = _scale([x, y, z], shape.solid);
  return entity.scale([x, y, z]);
} //TODO : update

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
    let i: number = axis === "x" ? 0 : axis === "y" ? 1 : axis === "z" ? 2 : -1;
    if (i === -1) {
      throw Error("shape_center's returned function expects a proper axis.");
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
  entity: Group | Shape,
  x: number,
  y: number,
  z: number
): Group | Shape {
  // let newSolid: Solid = _translate([x, y, z], shape.solid);
  return entity.translate([x, y, z]);
}

/**
 * Rotate the shape by the provided angles in the x, y and z direction.
 * Angles provided are in the form of radians (i.e. 2π represent 360
 * degrees). Note that the order of rotation is from the x direction first,
 * followed by the y and z directions.
 *
 * @param {Shape} shape - The shape to be rotated
 * @param {number} x - Angle of rotation in the x direction
 * @param {number} y - Angle of rotation in the y direction
 * @param {number} z - Angle of rotation in the z direction
 * @returns {Shape} The rotated shape
 */
export function rotate(
  entity: Group | Shape,
  x: number,
  y: number,
  z: number
): Group | Shape {
  // let newSolid: Solid = _rotate([x, y, z], shape.solid);
  return entity.rotate([x, y, z]);
} //TODO : update

/**
 * Center the provided shape with the middle base of the shape at (0, 0, 0).
 *
 * @param {Shape} shape - The shape to be centered
 * @returns {Shape} The shape that is centered
 */
function shapeSetOrigin(shape: Shape) {
  let newSolid: Solid = align({ modes: ["min", "min", "min"] }, shape.solid);
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
 * Initializes a group of shapes, which is represented
 * as a hierarchical tree structure, with groups as
 * internal nodes and shapes as leaf nodes.
 * @param {(Group|Shape)[]} children - The Groups and/or Shapes
 * to be placed inside this new Group
 * @returns {Group} The newly created Group
 */
export function group(children: (Group | Shape)[]): Group {
  return new Group(children);
}

/**
 * Stores a clone of the specified Shape for later rendering. Its colour
 * defaults to the module's provided silver colour variable.
 *
 * @param {Shape} shape - The Shape to be stored.
 */
export function store(entity: Group | Shape): void {
  entity.store();
}

/**
 * Renders using any Shapes stored thus far, along with a grid and axis. The
 * Shapes will then not be included in any subsequent renders.
 */
export function render_grid_axis(): RenderGroup {
  // Render group is returned for REPL text only; do not document
  return Core.getRenderGroupManager().nextRenderGroup(true, true);
}

/**
 * Renders using any Shapes stored thus far, along with a grid. The Shapes will
 * then not be included in any subsequent renders.
 */
export function render_grid(): RenderGroup {
  return Core.getRenderGroupManager().nextRenderGroup(true);
}

/**
 * Renders using any Shapes stored thus far, along with an axis. The Shapes will
 * then not be included in any subsequent renders.
 */
export function render_axis(): RenderGroup {
  return Core.getRenderGroupManager().nextRenderGroup(undefined, true);
}

/**
 * Renders using any Shapes stored thus far. The Shapes will then not be
 * included in any subsequent renders.
 */
export function render(): RenderGroup {
  return Core.getRenderGroupManager().nextRenderGroup();
}
