import { primitives, geometries } from '@jscad/modeling';
import { colorize, cssColors, hexToRgb } from '@jscad/modeling/src/colors';
import {
  intersect,
  subtract,
  union,
} from '@jscad/modeling/src/operations/booleans';
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions';
import { RGB } from '@jscad/modeling/src/colors/types';
import { Shape, looseInstanceOf } from './utilities';

// =============================================================================
// Primitives
// =============================================================================

/**
 * Primitive Shape of a cube.
 */
export const cube: Shape = new Shape(() => primitives.cube());

/**
 * Primitive Shape of a sphere.
 */
export const sphere: Shape = new Shape(() =>
  primitives.sphere({ segments: 128 })
);

/**
 * Primitive Shape of a cylinder.
 */
export const cylinder: Shape = new Shape(() =>
  primitives.cylinder({ segments: 128 })
);

/**
 * Primitive Shape of a triangular prism.
 */
export const triangularPrism: Shape = new Shape(() =>
  extrudeLinear({ height: 1 }, primitives.triangle())
);

/**
 * Primitive Shape of an extruded star.
 */
export const extrudedStar: Shape = new Shape(() =>
  extrudeLinear({ height: 1 }, primitives.star())
);

// =============================================================================
// Colors
// =============================================================================

export const { black } = cssColors;
export const { navy } = cssColors;
export const { green } = cssColors;
export const { teal } = cssColors;
export const { purple } = cssColors;
export const { orange } = cssColors;
export const { silver } = cssColors;
export const { grey } = cssColors;
export const { blue } = cssColors;
export const { lime } = cssColors;
export const { cyan } = cssColors;
export const { pink } = cssColors;
export const { yellow } = cssColors;
export const { white } = cssColors;

// =============================================================================
// Functions
// =============================================================================

export function shapeUnion(a: Shape, b: Shape): Shape {
  return new Shape(() => union(a.getObject(), b.getObject()));
}

export function shapeSubtract(a: Shape, b: Shape): Shape {
  return new Shape(() => subtract(a.getObject(), b.getObject()));
}

export function shapeIntersect(a: Shape, b: Shape): Shape {
  return new Shape(() => intersect(a.getObject(), b.getObject()));
}

export function shapeColorize(shape: Shape, color: RGB): Shape {
  try {
    return new Shape(() => colorize(color, shape.getObject()));
  } catch {
    throw Error(`shapeColorize expects a shape color`);
  }
}

export function shapeColorizeRGB(
  shape: Shape,
  r: number,
  g: number,
  b: number
): Shape {
  if (r > 1.0 || r < 0) {
    throw Error(`shapeColorizeRGB expects red value to be between 0 and 1.0`);
  }
  if (g > 1.0 || g < 0) {
    throw Error(`shapeColorizeRGB expects green value to be between 0 and 1.0`);
  }
  if (b > 1.0 || b < 0) {
    throw Error(`shapeColorizeRGB expects blue value to be between 0 and 1.0`);
  }
  return new Shape(() => colorize([r, g, b], shape.getObject()));
}

export function shapeColorizeHex(shape: Shape, hex: string): Shape {
  if (hex.replace('#', '').length === 6) {
    return new Shape(() => colorize(hexToRgb(hex), shape.getObject()));
  }
  throw Error(
    `shapeColorizeHex expects a hex value of the form "#000000" or "000000"`
  );
}

export function isShape(shape: Shape): boolean {
  if (looseInstanceOf(shape, Shape)) {
    if (!geometries.geom3.isA(shape.getObject())) {
      return false;
    }
    return true;
  }
  return false;
}

function shapeClone(shape: Shape): Shape {
  return new Shape(() => geometries.geom3.clone(shape.getObject()), true);
}

/**
 * Returns a copy of the specified Shape that will get rendered in a tab,
 * if your Source program results in that Shape.
 * I.e., use this function as the last statement in your program to render the
 * specified shape.
 *
 * @param {Shape} shape - The Shape to render.
 * @returns {Shape} A copy of the specified Shape, marked for rendering.
 */
export function render(shape: Shape): Shape {
  if (!isShape(shape)) {
    throw Error(`render expects a Shape as argument.`);
  }
  return shapeClone(shape);
}
