// Source §4
// Showcase of all 11 primitive Shapes provided by default

let primitives = [
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
    torus
];

function translate_x(entity, factor) {
    return translate(entity, factor, 0, 0);
}

function translate_y(entity, factor) {
    return translate(entity, 0, factor, 0);
}

let l = build_list(
    i => translate_y(
        translate_x(
            primitives[i](silver),
            ((i % 4) - 2) * 2
        ),
        (math_floor(i / 4) - 2) * 2
    ),
    11
);

render_grid(group(l));
