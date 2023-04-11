/* [Imports] */
import { context } from 'js-slang/moduleHelpers';
import { Core } from './core.js';
import { CsgModuleState } from './utilities.js';

/* [Main] */
let moduleState = new CsgModuleState();

context.moduleContexts.csg.state = moduleState;
// We initialise Core for the first time over on the bundles' end here
Core.initialize(moduleState);

/* [Exports] */
export {
  black,
  blue,
  bounding_box,
  cone,
  crimson,
  cube,
  cyan,
  cylinder,
  geodesic_sphere,
  gray,
  green,
  group,
  intersect,
  is_shape,
  is_group,
  lime,
  navy,
  orange,
  pink,
  prism,
  purple,
  pyramid,
  render,
  render_axes,
  render_grid,
  render_grid_axes,
  rgb,
  rose,
  rotate,
  rounded_cube,
  rounded_cylinder,
  scale,
  shape_center,
  shape_to_stl,
  silver,
  sphere,
  star,
  subtract,
  teal,
  torus,
  translate,
  union,
  white,
  yellow,
} from './functions';
