// Source §4
// Showcase of the 16 default colours as a grid of spheres

let colours = [
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
    white
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
            sphere(colours[i]),
            ((i % 4) - 2) * 2
        ),
        (math_floor(i / 4) - 2) * 2
    ),
    16
);

render_grid(group(l));
