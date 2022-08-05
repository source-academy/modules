import { ModuleContexts, ModuleParams } from '../../typings/type_helpers.js';
import {
  animate_3D_curve,
  animate_curve,
  arc,
  b_of,
  connect_ends,
  connect_rigidly,
  drawnCurves,
  draw_3D_connected,
  draw_3D_connected_full_view,
  draw_3D_connected_full_view_proportional,
  draw_3D_points,
  draw_3D_points_full_view,
  draw_3D_points_full_view_proportional,
  draw_connected,
  draw_connected_full_view,
  draw_connected_full_view_proportional,
  draw_points,
  draw_points_full_view,
  draw_points_full_view_proportional,
  g_of,
  invert,
  make_3D_color_point,
  make_3D_point,
  make_color_point,
  make_point,
  put_in_standard_position,
  rotate_around_origin,
  r_of,
  scale,
  scale_proportional,
  translate,
  unit_circle,
  unit_line,
  unit_line_at,
  x_of,
  y_of,
  z_of,
} from './functions';
import { CurveModuleState } from './types';

/**
 * Bundle for Source Academy Curves module
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

export default function curves(
  moduleParams: ModuleParams,
  moduleContexts: ModuleContexts
) {
  // Update the module's global context
  let moduleContext = moduleContexts.get('curve');

  // Probably can edit this because modules can only be loaded once
  // Otherwise loading the module twice just overwrites the existing context
  // thing
  if (!moduleContext) {
    moduleContext = {
      tabs: [],
      state: {
        drawnCurves,
      },
    };

    moduleContexts.set('curve', moduleContext);
  } else if (!moduleContext.state) {
    moduleContext.state = {
      drawnCurves,
    };
  } else {
    (moduleContext.state as CurveModuleState).drawnCurves = drawnCurves;
  }

  return {
    make_point,
    make_3D_point,
    make_color_point,
    make_3D_color_point,
    animate_curve,
    animate_3D_curve,
    draw_connected,
    draw_connected_full_view,
    draw_connected_full_view_proportional,
    draw_points,
    draw_points_full_view,
    draw_points_full_view_proportional,
    draw_3D_connected,
    draw_3D_connected_full_view,
    draw_3D_connected_full_view_proportional,
    draw_3D_points,
    draw_3D_points_full_view,
    draw_3D_points_full_view_proportional,
    x_of,
    y_of,
    z_of,
    r_of,
    g_of,
    b_of,
    unit_line,
    unit_line_at,
    unit_circle,
    connect_rigidly,
    connect_ends,
    put_in_standard_position,
    translate,
    scale_proportional,
    scale,
    rotate_around_origin,
    arc,
    invert,
  };
}
