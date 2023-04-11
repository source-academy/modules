```js
import {
    cube,
    sphere,
    cylinder,
    prism,
    star,
    pyramid,
    cone,
    torus,
    rounded_cube,
    rounded_cylinder,
    geodesic_sphere,

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

    union,
    subtract,
    intersect,
    scale,
    translate,
    rotate,
    group,
    rgb,
    bounding_box,
    is_shape,
    is_group,
    render_grid_axes,
    render_grid,
    render_axes,
    render
} from 'csg';
```

```js
// Showcase of the 16 default colours as a grid of spheres
// Source 4

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
let index = 0;
for (let yOffset = 0; yOffset <= 6; yOffset = yOffset + 2) {
    for (let xOffset = 0; xOffset <= 6; xOffset = xOffset + 2) {
        store_as_color(
            translate_y(
                translate_x(sphere, xOffset),
                yOffset
            ),
            colours[index]
        );
        index = index + 1;
    }
}
render_grid();
```

```js
// A spaghetti-code version of
// Me: Can I have Source Academy ship
// Mum: No, we have Source Academy ship at home
// Source Academy ship at home:
// Source 4

function store_scaled(shape, colour) {
    let factor = 50;
    shape = scale(shape, factor, factor, factor);
    store_as_color(shape, colour);
}

function centre(shape) {
    return shape_set_center(shape, 0.5, 0.5, 0.5);
}

function scale_all(shape, factor) {
    return scale(shape, factor, factor, factor);
}

function centre_using(target, source) {
    let get = shape_center(source);
    return shape_set_center(
        target,
        get("x"),
        get("y"),
        get("z")
    );
}

// Main body
let main_body = rounded_cylinder;

main_body = scale_z(main_body, 1/3);
main_body = centre(main_body);

// (Prong base, inner prong base)
let prong = sphere;

prong = subtract(prong, translate_z(cube, 0.5));
prong = subtract(prong, translate_x(centre(scale(sphere, 1, 2, 1)), -0.75));
prong = translate_z(prong, -0.5);

let inner_prong = clone(prong);
inner_prong = scale_all(inner_prong, 0.85);
inner_prong = centre_using(inner_prong, prong);

prong = subtract(
    prong,
    translate(
        centre(rotate_y(
            centre(scale(
                cube,
                0.05,
                1,
                2
            )),
            math_PI / 2 / 16
        )),
        0.35,
        0,
        0
    )
);

let foot = cylinder;
foot = centre(rotate_y(foot, math_PI / 2));
foot = centre(scale_x(foot, 0.25));
foot = subtract(foot, translate_z(cube, -0.5));
foot = translate_z(foot, -1);
prong = union(prong, foot);

prong = scale_y(prong, 1/8);
prong = scale_z(prong, 1/3);
inner_prong = scale_y(inner_prong, 1/8);
inner_prong = scale_z(inner_prong, 1/3);

prong = translate(prong, 0.5, -1/16, 0.5);
inner_prong = translate(inner_prong, 0.55, -1/16, 0.5);

// Left prong, inner left prong
let left_prong = clone(prong);
let inner_left_prong = clone(inner_prong);

left_prong = translate_y(left_prong, -0.05);
inner_left_prong = translate_y(inner_left_prong, -0.05);

// Right prong, inner right prong
let right_prong = clone(prong);
let inner_right_prong = clone(inner_prong);

right_prong = translate_y(right_prong, 1.05);
inner_right_prong = translate_y(inner_right_prong, 1.05);

// Shield
let shield = torus;

shield = centre(shield);

shield = subtract(shield, centre(scale(sphere, 0.9, 0.9, 1)));

shield = centre(scale_all(shield, 1.2));
shield = centre(scale_z(shield, 1.3));
shield = subtract(shield, translate_x(centre(scale(cube, 2/3, 2/3, 1)), 0.5));

let ball = centre(scale_all(sphere, 0.1));
shield = union(
    shield,
    translate(
        ball,
        1/12,
        -0.55,
        -1/12
    )
);
shield = union(
    shield,
    translate(
        ball,
        1/12,
        0.55,
        -1/12
    )
);

shield = translate_z(shield, 0.05);

// Small spot
let small_spot = rounded_cylinder;

small_spot = rotate_y(small_spot, math_PI / 2 / -16);
small_spot = centre(small_spot);

small_spot = scale_all(small_spot, 1/6);
small_spot = centre(small_spot);

small_spot = translate(small_spot, -0.2, 0, 1/6 - 0.05);

// Big spot
let big_spot = rounded_cylinder;

big_spot = rotate_y(big_spot, math_PI / 2 / -16);
big_spot = centre(big_spot);

big_spot = scale_all(big_spot, 1/3);
big_spot = centre(big_spot);

big_spot = translate(big_spot, -0.2, 0, 1/6 - 0.15);

// Window
let window = rounded_cube;

window = scale(window, 1, 1/2, 1/10);
window = centre(window);
window = subtract(window, translate_x(cube, -0.5));
window = translate_z(window, -0.04);

// (Ring base)
let ring = sphere;

ring = scale(ring, 1.02, 1.02, 0.05);
ring = centre(ring);

// Orange ring
let orange_ring = clone(ring);

orange_ring = translate_z(orange_ring, 0.08);

// Ring 1
let ring_1 = clone(orange_ring);

ring_1 = translate_z(ring_1, -0.015);

// Ring 2
let ring_2 = clone(ring_1);

ring_2 = translate_z(ring_2, -0.015);

// Ring 3
let ring_3 = clone(ring_2);

ring_3 = translate_z(ring_3, -0.015);

// Done
let off_white = "#CCCCCC";
let darker_silver = "#777777";
let shining_cyan = "#88FFFF";

store_scaled(main_body, silver);
store_scaled(left_prong, off_white);
store_scaled(inner_left_prong, silver);
store_scaled(right_prong, off_white);
store_scaled(inner_right_prong, silver);
store_scaled(shield, darker_silver);
store_scaled(small_spot, orange);
store_scaled(big_spot, darker_silver);
store_scaled(window, shining_cyan);
store_scaled(orange_ring, orange);
store_scaled(ring_1, white);
store_scaled(ring_2, white);
store_scaled(ring_3, white);

render_grid_axis();
```
