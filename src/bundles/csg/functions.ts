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
    csgObjects: [primitives.cube()],
  };
}

export const cube: CSG = csg_cube();

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

export function show(csg: CSG): CSG {
  csg.csgObjects.forEach((obj) => {
    if (!geometries.geom3.isA(obj)) {
      throw Error(`show expects a rune as argument.`);
    }
  });
  return {
    toReplString: () => '<RENDERING CSG>',
    csgObjects: csg_clone(csg.csgObjects),
  };
}
