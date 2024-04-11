// Source §1
// Simple curves that trigger the various types of canvases curve uses

draw_connected_full_view(20)(unit_circle);

draw_3D_connected(100)(t => make_3D_point(t, t * t, t));

animate_curve(3, 30, draw_connected_full_view_proportional(100), s => t => make_point(t - s, t * s));

animate_3D_curve(3, 40, draw_3D_connected_full_view_proportional(100), s => t => make_3D_point(t - s, t - t * s, t * s));
