/* [Import] */
import type { RGB, RGBA } from '@jscad/modeling/src/colors/types';
import type { Geom3 } from '@jscad/modeling/src/geometries/types';

/* [Main] */
/* NOTE
  Only the geometry-level types live here, because only they are needed on the
  runner side. The types describing the regl renderer (entities, cameras,
  controls, draw commands) live with the renderer itself, in the Csg tab, since
  none of that code can run in a worker.
*/

/* [Exports] */
export type Color = RGB;
export type AlphaColor = RGBA;

export type Numbers2 = [number, number];
export type Numbers3 = [number, number, number];

export type Vector = Numbers3;
export type Coordinates = Numbers3;
export type BoundingBox = [Coordinates, Coordinates];

export type Solid = Geom3;
