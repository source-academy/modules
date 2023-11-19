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
import context from 'js-slang/context';
import { Core } from './core.js';
import { CsgModuleState } from './utilities.js';

/* [Main] */
let moduleState = new CsgModuleState();

context.moduleContexts.csg.state = moduleState;
// We initialise Core for the first time over on the bundles' end here
Core.initialize(moduleState);



/* [Exports] */
export {
  // Colors
  black,
  navy,
  green,
  teal,
  crimson,
  purple,
  orange,
  silver,
  gray,
  blue,
  lime,
  cyan,
  rose,
  pink,
  yellow,
  white,

  // Primitives
  cube,
  rounded_cube,
  cylinder,
  rounded_cylinder,
  sphere,
  geodesic_sphere,
  pyramid,
  cone,
  prism,
  star,
  torus,

  // Operations
  union,
  subtract,
  intersect,

  // Transformations
  translate,
  rotate,
  scale,

  // Utilities
  group,
  ungroup,
  is_shape,
  is_group,
  bounding_box,
  rgb,
  download_shape_stl,

  // Rendering
  render,
  render_grid,
  render_axes,
  render_grid_axes,
} from './functions';
