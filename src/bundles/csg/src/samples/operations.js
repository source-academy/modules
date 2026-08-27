// Source §3
// Classic boolean operations demo

const Cube = centre(scale_all(cube(purple), 0.8));
const Sphere = centre(sphere(navy));

const A = centre(scale(cylinder(teal), 0.4, 0.4, 1));
const B = centre(translate(rotate_x(A, math_PI/2), 0, 0.75, 0.25));
const C = centre(translate(rotate_y(A, math_PI/2), -0.25, 0, 0.75));
let cylinder_union = union(A,B);
cylinder_union = union(cylinder_union,C);

let fancy_shape = intersect(Cube,Sphere);
fancy_shape = subtract(fancy_shape, cylinder_union);

render_grid(scale_all(fancy_shape,5));
// shape_to_stl(fancy_shape);
