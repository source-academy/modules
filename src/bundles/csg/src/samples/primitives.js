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
