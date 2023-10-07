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
