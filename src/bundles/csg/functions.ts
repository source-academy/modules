import { primitives, geometries } from '@jscad/modeling';
import { Shape } from './utilities';

// =============================================================================
// Primitives
// =============================================================================

/**
 * Primitive Shape of a cube.
 */
export const cube: Shape = new Shape(() => [primitives.cube({ size: 30 })]);

//NOTE Commented while narrowing down regl-renderer issues:
// "Error(s) occured when executing the module "CSG"."

/**
 * Primitive Shape of a sphere.
 */
// export const sphere: Shape = new Shape(() => [
//   primitives.sphere({ segments: 128 }),
// ]);

/**
 * Primitive Shape of a cylinder.
 */
// export const cylinder: Shape = new Shape(() => [
//   primitives.cylinder({ segments: 128 }),
// ]);

// =============================================================================
// Functions
// =============================================================================

/**
 * Returns a copy of the specified Shape.
 * Source programs that result in a Shape will have that Shape rendered in a
 * tab.
 * I.e., use `render(yourShape);` as the last statement in your program to render
 * the specified shape.
 *
 * @param {Shape} shape - The Shape to render.
 * @returns {Shape} A copy of the specified Shape for rendering.
 */
export function render(shape: Shape): Shape {
  //FIXME input validation
  // if (!is_csg(...csg.csgObjects)) {
  //   throw Error(`show expects a Shape as argument.`);
  // }

  //TODO actually copy the shape
  return shape;
}

//FIXME Commented while narrowing down regl-renderer issues:
// "Error(s) occured when executing the module "CSG"."

// function csg_clone(csg_array: CsgObject[]): CsgObject[] {
//   const csgCopy: CsgObject[] = [];
//   for (let i = 0; i < csg_array.length; i += 1) {
//     csgCopy[i] = geometries.geom3.clone(csg_array[i]);
//   }
//   return csgCopy;
// }

// export function is_csg(...csg_objects: CsgObject[]): boolean {
//   for (let i = 0; i < csg_objects.length; i += 1) {
//     if (!geometries.geom3.isA(csg_objects[i])) {
//       return false;
//     }
//   }
//   return true;
// }
