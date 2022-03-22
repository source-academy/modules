import { ModuleContext } from 'js-slang';
import { CurveModuleState } from './types';
import {
  make_point,
  make_3D_point,
  make_color_point,
  make_3D_color_point,
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
  curve_animation,
  drawnCurves,
  curve_3D_animation,
} from './functions';

/**
 * Bundle for Source Academy Curves module
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

export default function curves(
  params: any,
  context: Map<string, ModuleContext>
) {
  // Update the module's global context
  let moduleContext = context.get('curve');

  if (moduleContext == null) {
    moduleContext = {
      tabs: [],
      state: {
        drawnCurves,
      },
    };

    context.set('curve', moduleContext);
  } else if (moduleContext.state == null) {
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
    curve_animation,
    curve_3D_animation,
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
