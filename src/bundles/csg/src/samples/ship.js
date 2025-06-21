// Source §3
// Me: Can I have Source Academy ship
// Mum: No, we have Source Academy ship at home
// Source Academy ship at home:

/* [Utility Functions] */
function debug(shape) {
    let get = bounding_box(shape);
    let xStart = get('x', 'min');
    let xEnd = get('x', 'max');
    let yStart = get('y', 'min');
    let yEnd = get('y', 'max');
    let zStart = get('z', 'min');
    let zEnd = get('z', 'max');

    display("x: " + stringify(xStart) + " - " + stringify(xEnd));
    display("y: " + stringify(yStart) + " - " + stringify(yEnd));
    display("z: " + stringify(zStart) + " - " + stringify(zEnd));
}

/* [Extra Colours] */
let off_white = "#CCCCCC";
let darker_silver = "#777777";
let shining_cyan = "#88FFFF";



/* [Main] */

// [Main Body]
let main_body = rounded_cylinder(silver);
// Flatten downwards
main_body = centre(scale_z(main_body, 1 / 3));

// [Template: Prong & Inner Prong]
function make_prong_draft(colour) {
    let whole_prong = sphere(colour);
    // Cut off top half
    whole_prong = subtract(whole_prong, translate_z(cube(colour), 0.5));
    // Make a curved cut to remove the back portion
    whole_prong = subtract(whole_prong, translate(centre(scale(sphere(colour), 1, 5, 1)), -0.75, 0, -0.1));

    return whole_prong;
}
let prong = make_prong_draft(off_white);

// Make a thin, slightly angled straight cut near the front
prong = subtract(
    prong,
    translate_x(
        centre(rotate_y(
            centre(scale_x(
                cube(silver),
                0.04
            )),
            degrees_to_radians(5)
        )),
        0.35
    )
);

// Add a smaller, different colour copy of the prong draft inside
let inner_prong = make_prong_draft(silver);
inner_prong = scale_all(inner_prong, 0.85);
inner_prong = centre_using(inner_prong, prong);
inner_prong = translate_x(inner_prong, 0.03);
prong = union(prong, inner_prong);

let foot = cylinder(off_white);
// Rotate forward
foot = centre(rotate_y(foot, degrees_to_radians(90)));
// Flatten forward
foot = centre(scale_x(foot, 0.25));
// Cut off bottom half
foot = subtract(foot, translate_z(cube(silver), -0.5));
// Move down forward and below prong
foot = translate(foot, 0.08, 0, -0.5);
prong = union(prong, foot);

// Warp prong
prong = scale(prong, 1, 1 / 8, 1 / 3);
// Shift forward and up, sit balanced through x axis
prong = translate(prong, 0.5, -1 / 16, 0.35);

let ball = sphere(gray);
// Add blue lights to ball
let light = cylinder(shining_cyan);
light = centre(rotate_x(light, degrees_to_radians(90)));
light = centre(scale(light, 0.2, 1, 0.2));
ball = union(ball, light);
// Shrink down
ball = centre(scale_all(ball, 0.1));
// Add ball behind prong
ball = translate(ball, 0.15, -0.5, -0.03);
prong = union(prong, ball);

/* [Prongs] */
let left_prong = translate_y(prong, -0.05);
let right_prong = translate_y(prong, 1.05);

// render_grid_axes(group(list(main_body, left_prong, right_prong)));

//TODO
// Shield
let shield = torus(darker_silver);

shield = centre(shield);

shield = subtract(shield, centre(scale(sphere(darker_silver), 0.9, 0.9, 1)));

shield = centre(scale_all(shield, 1.2));
shield = centre(scale_z(shield, 1.3));
shield = subtract(shield, translate_x(centre(scale(cube(darker_silver), 2/3, 2/3, 1)), 0.5));

shield = translate_z(shield, 0.05);

// Small spot
let small_spot = rounded_cylinder(orange);

small_spot = rotate_y(small_spot, math_PI / 2 / -16);
small_spot = centre(small_spot);

small_spot = scale_all(small_spot, 1/6);
small_spot = centre(small_spot);

small_spot = translate(small_spot, -0.2, 0, 1/6 - 0.05);

// Big spot
//TODO bigger
let big_spot = rounded_cylinder(darker_silver);

big_spot = rotate_y(big_spot, math_PI / 2 / -16);
big_spot = centre(big_spot);

big_spot = scale_all(big_spot, 1/3);
big_spot = centre(big_spot);

big_spot = translate(big_spot, -0.2, 0, 1/6 - 0.15);

// Window
let window = rounded_cube(shining_cyan);

window = scale(window, 1, 1/2, 1/10);
window = centre(window);
window = subtract(window, translate_x(cube(shining_cyan), -0.5));
window = translate_z(window, -0.04);

// Orange ring
let orange_ring = sphere(orange);

orange_ring = scale(orange_ring, 1.02, 1.02, 0.05);
orange_ring = centre(orange_ring);

orange_ring = translate_z(orange_ring, 0.08);

// Ring 1
let ring_1 = sphere(white);

ring_1 = scale(ring_1, 1.02, 1.02, 0.05);
ring_1 = centre(ring_1);

ring_1 = translate_z(ring_1, 0.08 - 0.015);

// Ring 2
let ring_2 = translate_z(ring_1, -0.015);

// Ring 3
let ring_3 = translate_z(ring_2, -0.015);

//TODO add ring 4
//TODO tilt the whole main body slightly forward after union

// Done
render_grid_axes(group(list(
    main_body,
    left_prong,
    right_prong,
    shield,
    small_spot,
    big_spot,
    window,
    orange_ring,
    ring_1,
    ring_2,
    ring_3
)));
