// Source §3
// Cylinder intersects - Steinmetz solid

const A_ = cylinder(blue);
const B_ = translate_y(rotate_x(cylinder(green), math_PI/2),1);
const C_ = translate_z(rotate_y(cylinder(yellow),math_PI/2),1);

let steinmetz_solid = intersect(A_, B_);
steinmetz_solid = intersect(steinmetz_solid, C_);
render_grid(scale_all(steinmetz_solid,5));
