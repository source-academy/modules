import { Context } from 'js-slang';
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
} from './functions';
import { CurveModuleState } from './types';
import { drawnCurves } from './curves_webgl';

/**
 * Bundle for Source Academy Curves module
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

export default function curves(context: Context) {
  if (context == null) {
    // eslint-disable-next-line no-alert
    alert('Context is null on first evaluation for some reason');
  }

  if (context.modules != null) {
    let moduleContext = context.modules.get('curve');

    if (moduleContext == null) {
      // If module context is null, create the context
      moduleContext = {
        tabs: [],
        state: {
          drawnCurves,
        },
      };

      // Then update the context
      context.modules.set('curve', moduleContext);
    }

    if (moduleContext.state == null) {
      // If the module's state object is null, create it
      moduleContext.state = {
        drawnCurves,
      };
    } else {
      // Otherwise update the drawnCurves array
      (moduleContext.state as CurveModuleState).drawnCurves = drawnCurves;
    }
  }

  return {
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
  };
}
