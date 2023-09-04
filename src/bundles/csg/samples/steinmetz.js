// Source §3
// Cylinder intersects - Steinmetz solid

function scale_all(entity, factor) {
    return scale(entity, factor, factor, factor);
}

function translate_y(entity, factor) {
    return translate(entity, 0, factor, 0);
}

function translate_z(entity, factor) {
    return translate(entity, 0, 0, factor);
}

function rotate_x(entity, factor) {
    return rotate(entity, factor, 0, 0);
}

function rotate_y(entity, factor) {
    return rotate(entity, 0, factor, 0);
}

const A_ = cylinder(blue);
const B_ = translate_y(rotate_x(cylinder(green), math_PI/2),1);
const C_ = translate_z(rotate_y(cylinder(yellow),math_PI/2),1);

let steinmetz_solid = intersect(A_, B_);
steinmetz_solid = intersect(steinmetz_solid, C_);
render_grid(scale_all(steinmetz_solid,5));
