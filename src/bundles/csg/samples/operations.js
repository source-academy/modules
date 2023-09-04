// Source §3
// Classic boolean operations demo

function scale_all(entity, factor) {
    return scale(entity, factor, factor, factor);
}

function rotate_x(entity, factor) {
    return rotate(entity, factor, 0, 0);
}

function rotate_y(entity, factor) {
    return rotate(entity, 0, factor, 0);
}

function _get_shape_middle(shape, axis) {
    let get = bounding_box(shape);
    let start = get(axis, 'min');
    let end = get(axis, 'max');
    let length = end - start;
    return start + (length / 2);
}

function _centre_at(shape, x, y, z) {
    function calculate_offset(axis, centre_coord) {
        return -_get_shape_middle(shape, axis) + centre_coord;
    }

    return translate(
        shape,
        calculate_offset('x', x),
        calculate_offset('y', y),
        calculate_offset('z', z)
    );
}

function centre(shape) {
    return _centre_at(shape, 0.5, 0.5, 0.5);
}

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
