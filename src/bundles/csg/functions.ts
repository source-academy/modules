import { primitives, geometries } from '@jscad/modeling';
import { CSG, CsgObject } from './types';

// =============================================================================
// Basic CSG
// =============================================================================

/**
 * CSG with the shape of a cube
 */
function csg_cube(): CSG {
  return {
    toReplString: () => '<CSG>',
    csgObjects: [primitives.cube({ size: 30 })],
  };
}

export const cube: CSG = csg_cube();

/**
 * CSG with the shape of a sphere
 */
function csg_sphere(): CSG {
  return {
    toReplString: () => '<CSG>',
    csgObjects: [primitives.sphere({ segments: 128 })],
  };
}

export const sphere: CSG = csg_sphere();

/**
 * CSG with the shape of a cylinder
 */
function csg_cylinder(): CSG {
  return {
    toReplString: () => '<CSG>',
    csgObjects: [primitives.cylinder({ segments: 128 })],
  };
}

export const cylinder: CSG = csg_cylinder();

// =============================================================================
// CSG Functions
// =============================================================================
function csg_clone(csg_array: CsgObject[]): CsgObject[] {
  const csgCopy: CsgObject[] = [];
  for (let i = 0; i < csg_array.length; i += 1) {
    csgCopy[i] = geometries.geom3.clone(csg_array[i]);
  }
  return csgCopy;
}

export function is_csg(...csg_objects: CsgObject[]): boolean {
  for (let i = 0; i < csg_objects.length; i += 1) {
    if (!geometries.geom3.isA(csg_objects[i])) {
      return false;
    }
  }
  return true;
}

export function show(csg: CSG): CSG {
  if (!is_csg(...csg.csgObjects)) {
    throw Error(`show expects a rune as argument.`);
  }
  return {
    toReplString: () => '<RENDERING CSG>',
    csgObjects: csg_clone(csg.csgObjects),
  };
}
