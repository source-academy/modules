import { Geom3 } from '@jscad/modeling/src/geometries/types';

export type CsgObject = Geom3;

export type CSG = {
  toReplString: () => string;
  csgObjects: CsgObject[];
};
