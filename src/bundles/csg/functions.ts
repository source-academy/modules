import { primitives, geometries } from '@jscad/modeling';
import { colorize, cssColors, hexToRgb } from '@jscad/modeling/src/colors';
import {
  intersect,
  subtract,
  union,
} from '@jscad/modeling/src/operations/booleans';
import { extrudeLinear } from '@jscad/modeling/src/operations/extrusions';
import { RGB } from '@jscad/modeling/src/colors/types';
import {
  center,
  mirror,
  rotate,
  scale,
  translate,
} from '@jscad/modeling/src/operations/transforms';
import {
  measureArea,
  measureVolume,
  measureCenter,
  measureBoundingBox,
  measureCenterOfMass,
} from '@jscad/modeling/src/measurements';
import { Shape, looseInstanceOf } from './utilities';

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

export function shapeScale(
  shape: Shape,
  x: number,
  y: number,
  z: number
): Shape {
  return new Shape(() => scale([x, y, z], shape.getObject()));
}

export function shapeScaleX(shape: Shape, x: number): Shape {
  return shapeScale(shape, x, 1, 1);
}

export function shapeScaleY(shape: Shape, y: number): Shape {
  return shapeScale(shape, 1, y, 1);
}

export function shapeScaleZ(shape: Shape, z: number): Shape {
  return shapeScale(shape, 1, 1, z);
}

export function shapeCenter(shape: Shape): number[] {
  return measureCenter(shape.getObject());
}

export function shapeSetCenter(
  shape: Shape,
  x: number,
  y: number,
  z: number
): Shape {
  return new Shape(() => center({ relativeTo: [x, y, z] }, shape.getObject()));
}

export function shapeArea(shape: Shape): number {
  return measureArea(shape.getObject());
}

export function shapeVolume(shape: Shape): number {
  return measureVolume(shape.getObject());
}

function shapeMirror(shape: Shape, x: number, y: number, z: number) {
  return new Shape(() => mirror({ normal: [x, y, z] }, shape.getObject()));
}

export function shapeFlipX(shape: Shape): Shape {
  return shapeMirror(shape, 1, 0, 0);
}

export function shapeFlipY(shape: Shape): Shape {
  return shapeMirror(shape, 0, 1, 0);
}

export function shapeFlipZ(shape: Shape): Shape {
  return shapeMirror(shape, 0, 0, 1);
}

export function shapeTranslate(
  shape: Shape,
  x: number,
  y: number,
  z: number
): Shape {
  return new Shape(() => translate([x, y, z], shape.getObject()));
}

export function shapeTranslateX(shape: Shape, x: number): Shape {
  return shapeTranslate(shape, x, 0, 0);
}

export function shapeTranslateY(shape: Shape, y: number): Shape {
  return shapeTranslate(shape, 0, y, 0);
}

export function shapeTranslateZ(shape: Shape, z: number): Shape {
  return shapeTranslate(shape, 0, 0, z);
}

export function shapeStack(a: Shape, b: Shape): Shape {
  const aBounds = measureBoundingBox(a.getObject());
  const bBounds = measureBoundingBox(b.getObject());
  const newX = aBounds[0][0] + (aBounds[1][0] - aBounds[0][0]) / 2;
  const newY = aBounds[0][1] + (aBounds[1][1] - aBounds[0][1]) / 2;
  const newZ =
    aBounds[1][2] + (bBounds[1][2] + (bBounds[1][2] - bBounds[0][2]) / 2);
  return shapeUnion(a, shapeSetCenter(b, newX, newY, newZ));
}

export function shapeRotate(
  shape: Shape,
  x: number,
  y: number,
  z: number
): Shape {
  return new Shape(() => rotate([x, y, z], shape.getObject()));
}

export function shapeRotateX(shape: Shape, x: number): Shape {
  return shapeRotate(shape, x, 0, 0);
}

export function shapeRotateY(shape: Shape, y: number): Shape {
  return shapeRotate(shape, 0, y, 0);
}

export function shapeRotateZ(shape: Shape, z: number): Shape {
  return shapeRotate(shape, 0, 0, z);
}

function shapeSetOrigin(shape: Shape) {
  const shapeDimen = measureCenterOfMass(shape.getObject());
  const shapeCent = shapeCenter(shape);
  return shapeSetCenter(
    shape,
    shapeCent[0] - shapeDimen[0],
    shapeCent[1] - shapeDimen[1],
    shapeCent[2] - shapeDimen[2]
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

function shapeClone(shape: Shape, axis: boolean, grid: boolean): Shape {
  return new Shape(
    () => geometries.geom3.clone(shape.getObject()),
    true,
    axis,
    grid
  );
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
  return shapeClone(shape, false, false);
}

export function renderAxis(shape: Shape): Shape {
  if (!isShape(shape)) {
    throw Error(`renderAxis expects a Shape as argument.`);
  }
  return shapeClone(shape, true, false);
}

export function renderGrid(shape: Shape): Shape {
  if (!isShape(shape)) {
    throw Error(`renderGrid expects a Shape as argument.`);
  }
  return shapeClone(shape, false, true);
}
export function renderAxisGrid(shape: Shape): Shape {
  if (!isShape(shape)) {
    throw Error(`renderAxisGrid expects a Shape as argument.`);
  }
  return shapeClone(shape, true, true);
}

// =============================================================================
// Primitives
// =============================================================================

/**
 * Primitive Shape of a cube.
 */
export const cube: Shape = shapeSetOrigin(
  new Shape(() => primitives.cube({ size: 1 }))
);

/**
 * Primitive Shape of a sphere.
 */
export const sphere: Shape = shapeSetOrigin(
  new Shape(() => primitives.sphere({ radius: 0.5, segments: 128 }))
);

/**
 * Primitive Shape of a cylinder.
 */
export const cylinder: Shape = shapeSetOrigin(
  new Shape(() =>
    primitives.cylinder({ radius: 0.5, height: 1, segments: 128 })
  )
);

/**
 * Primitive Shape of a triangular prism.
 */
export const triangularPrism: Shape = shapeSetOrigin(
  new Shape(() => extrudeLinear({ height: 1 }, primitives.triangle()))
);

/**
 * Primitive Shape of an extruded star.
 */
export const extrudedStar: Shape = shapeSetOrigin(
  new Shape(() =>
    extrudeLinear({ height: 1 }, primitives.star({ outerRadius: 0.5 }))
  )
);
