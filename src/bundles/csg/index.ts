/* [Imports] */
import context from "js-slang/context";
import { Core } from "./core.js";
import { CsgModuleState } from "./utilities.js";

/* [Main] */
let moduleState = new CsgModuleState();

context.moduleContexts.csg.state = moduleState;
// We initialise Core for the first time over on the bundles' end here
Core.initialize(moduleState);

/* [Exports] */
export {
  area,
  black,
  blue,
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
  lime,
  navy,
  orange,
  pink,
  prism,
  purple,
  pyramid,
  render,
  render_axis,
  render_grid,
  render_grid_axis,
  rose,
  rotate,
  rotate_x,
  rotate_y,
  rotate_z,
  rounded_cube,
  rounded_cylinder,
  scale,
  scale_x,
  scale_y,
  scale_z,
  shape_center,
  shape_set_center,
  shape_to_stl,
  silver,
  sphere,
  star,
  store,
  subtract,
  teal,
  torus,
  transformAndStore,
  translate,
  translate_x,
  translate_y,
  translate_z,
  union,
  volume,
  white,
  yellow,
} from "./functions";
