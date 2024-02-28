
import {
    // Color
    black,
    navy,
    green,
    teal,
    crimson,
    purple,
    orange,
    silver,
    gray,
    blue,
    lime,
    cyan,
    rose,
    pink,
    yellow,
    white,

    // Primitive
    cube,
    rounded_cube,
    cylinder,
    rounded_cylinder,
    sphere,
    geodesic_sphere,
    pyramid,
    cone,
    prism,
    star,
    torus,

    // Operation
    union,
    subtract,
    intersect,

    // Transformation
    translate,
    rotate,
    scale,

    // Utility
    group,
    ungroup,
    is_shape,
    is_group,
    bounding_box,
    rgb,
    download_shape_stl,

    // Render
    render,
    render_grid,
    render_axes,
    render_grid_axes
} from 'csg';

function translate_x(operable, factor) {
    return translate(operable, factor, 0, 0);
}

function translate_y(operable, factor) {
    return translate(operable, 0, factor, 0);
}

function translate_z(operable, factor) {
    return translate(operable, 0, 0, factor);
}

function rotate_x(operable, factor) {
    return rotate(operable, factor, 0, 0);
}

function rotate_y(operable, factor) {
    return rotate(operable, 0, factor, 0);
}

function rotate_z(operable, factor) {
    return rotate(operable, 0, 0, factor);
}

function scale_all(operable, factor) {
    return scale(operable, factor, factor, factor);
}

function scale_x(operable, factor) {
    return scale(operable, factor, 1, 1);
}

function scale_y(operable, factor) {
    return scale(operable, 1, factor, 1);
}

function scale_z(operable, factor) {
    return scale(operable, 1, 1, factor);
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

function centre_using(target, reference) {
    return _centre_at(
        target,
        _get_shape_middle(reference, 'x'),
        _get_shape_middle(reference, 'y'),
        _get_shape_middle(reference, 'z')
    );
}

function degrees_to_radians(degrees) {
    return (degrees / 360) * (2 * math_PI);
}
