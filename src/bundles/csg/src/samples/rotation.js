// Source §3
// Showcase of all 11 primitive Shapes provided by default

let a = cube(green);
let b = cube(blue);

a = rotate_x(a, degrees_to_radians(30));
a = rotate_y(a, degrees_to_radians(30));
a = rotate_z(a, degrees_to_radians(30));

b = rotate_z(b, degrees_to_radians(30));
b = rotate_x(b, degrees_to_radians(30));
b = rotate_y(b, degrees_to_radians(30));

// b = translate_x(b, 2);

render_grid_axes(group(list(a, b)));
