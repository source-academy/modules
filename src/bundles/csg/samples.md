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
    render,
    shape_to_stl
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


function translate_x(entity, factor) {
  return translate(entity, factor, 0, 0);
}

function translate_y(entity, factor) {
  return translate(entity, 0, factor, 0);
}

let lst = build_list(x => 
  translate_y(
    translate_x(sphere(colours[x]), x % 4 * 2), 
    math_floor(x / 4) * 2), 
  16);

render_grid(group(lst));
```

```js
// A spaghetti-code version of
// Me: Can I have Source Academy ship
// Mum: No, we have Source Academy ship at home
// Source Academy ship at home:
// Source 4

function scale_all(entity, factor) {
    return scale(entity, factor, factor, factor);
}

function scale_x(entity, factor) {
    return scale(entity, factor, 1, 1);
}

function scale_y(entity, factor) {
    return scale(entity, 1, factor, 1);
}

function scale_z(entity, factor) {
    return scale(entity, 1, 1, factor);
}

function translate_x(entity, factor) {
    return translate(entity, factor, 0, 0);
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

function rotate_z(entity, factor) {
    return rotate(entity, 0, 0, factor);
}

let off_white = "#CCCCCC";
let darker_silver = "#777777";
let shining_cyan = "#88FFFF";

// function store_scaled(shape, colour) {
//     let factor = 50;
//     shape = scale(shape, factor, factor, factor);
//     store_as_color(shape, colour);
// }

function centre(shape) {
    const bounds = bounding_box(shape);
    const offset_x = 0.5 -(bounds('x','min') + ((bounds('x','max') - bounds('x','min')) / 2));
    const offset_y = 0.5 -(bounds('y','min') + ((bounds('y','max') - bounds('y','min')) / 2));
    const offset_z = 0.5 -(bounds('z','min') + ((bounds('z','max') - bounds('z','min')) / 2));
    return translate(shape, offset_x, offset_y, offset_z);
}

function clone(shape) {
    return shape;
}

function centre_using(target, source) {
     const get = bounding_box(source);
     const bounds = bounding_box(target);
     const offset_x = get('x', 'min') + (get('x', 'max') - get('x', 'min')) / 2
        - (bounds('x','min') + ((bounds('x','max') - bounds('x','min')) / 2));
     const offset_y = get('y', 'min') + (get('y', 'max') - get('y', 'min')) / 2
        - (bounds('y','min') + ((bounds('y','max') - bounds('y','min')) / 2));
     const offset_z = get('z', 'min') + (get('z', 'max') - get('z', 'min')) / 2
        - (bounds('z','min') + ((bounds('z','max') - bounds('z','min')) / 2));
    return translate(target, offset_x, offset_y, offset_z);
}




// Main body
let main_body = scale(translate_z(rounded_cylinder(silver), 1), 1, 1, 1/3);

// display(bounding_box(main_body));

//(Prong base, inner prong base)
let prong = sphere(orange);

prong = subtract(prong, translate_z(cube(orange), 0.5));
prong = subtract(prong, translate_x(centre(scale(sphere(orange), 1, 2, 1)), -0.75));

prong = translate_z(prong, -0.5);

let inner_prong = clone(prong);
inner_prong = scale_all(inner_prong, 0.85);
inner_prong = centre_using(inner_prong, prong);

prong = subtract(
    prong,
    translate(
        centre(rotate_y(
            centre(scale(
                cube(orange),
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



let foot = cylinder(orange);
foot = centre(rotate_y(foot, math_PI / 2));
foot = centre(scale_x(foot, 0.25));
foot = subtract(foot, translate_z(cube(purple), -0.5));
foot = translate_z(foot, -1);
prong = union(prong, foot);





prong = scale_y(prong, 1/8);
prong = scale_z(prong, 1/3);
inner_prong = scale_y(inner_prong, 1/8);
inner_prong = scale_z(inner_prong, 1/3);

prong = translate(prong, 0.5, -1/16, 0.5);
inner_prong = translate(inner_prong, 0.55, -1/16, 0.5);

// Left prong, inner left prong
let left_prong = prong;
let inner_left_prong = inner_prong;

left_prong = translate_y(left_prong, -0.05);
inner_left_prong = translate_y(inner_left_prong, -0.05);

// // Right prong, inner right prong
let right_prong = prong;
let inner_right_prong = inner_prong;

right_prong = translate_y(right_prong, 1.05);
inner_right_prong = translate_y(inner_right_prong, 1.05);

// Shield
let shield = torus(orange);

shield = centre(shield);

// shield = translate_z(shield, 0.45);

shield = subtract(shield, centre(scale(sphere(orange), 0.9, 0.9, 1)));

shield = centre(scale_all(shield, 1.2));
shield = centre(scale_z(shield, 1.3));

let cubee = scale(cube(orange), 2/3, 2/3, 1);
shield = subtract(shield, translate_x(centre(scale(cube(orange), 2/3, 2/3, 1)), 0.5));

let ball = centre(scale_all(sphere(orange), 0.1));
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
let small_spot = rounded_cylinder(orange);

small_spot = rotate_y(small_spot, math_PI / 2 / -16);
small_spot = centre(small_spot);

small_spot = scale_all(small_spot, 1/6);
small_spot = centre(small_spot);

small_spot = translate(small_spot, -0.2, 0, 1/6 - 0.05);

// Big spot
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

// (Ring base)
let ring = sphere(off_white);

ring = scale(ring, 1.02, 1.02, 0.05);
ring = centre(ring);

// Orange ring
let orange_ring = sphere(orange);

orange_ring = scale(orange_ring, 1.02, 1.02, 0.05);
orange_ring = centre(orange_ring);

orange_ring = translate_z(orange_ring, 0.08);

// Ring 1
let ring_1 = sphere(off_white);

ring_1 = scale(ring_1, 1.02, 1.02, 0.05);
ring_1 = centre(ring_1);

ring_1 = translate_z(ring_1, 0.08 - 0.015);

// Ring 2
let ring_2 = translate_z(ring_1, -0.015);

// Ring 3
let ring_3 = translate_z(ring_2, -0.015);

// Done

render_grid_axes(scale_all(group(list(main_body, left_prong, inner_left_prong,
        right_prong, inner_right_prong, shield, small_spot, big_spot,
        window, orange_ring, ring_1, ring_2, ring_3)), 50));
```

```js
/* CLASSIC BOOLEAN OPERATIONS */

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
shape_to_stl(fancy_shape);
```

```js
/* CYLINDER INTERSECT */

const A_ = cylinder(blue);
const B_ = translate_y(rotate_x(cylinder(green), math_PI/2),1);
const C_ = translate_z(rotate_y(cylinder(yellow),math_PI/2),1);

let steinmetz_solid = intersect(A_, B_);
steinmetz_solid = intersect(steinmetz_solid, C_);
render_grid(scale_all(steinmetz_solid,5));
```

```js
/* CHRISTMAS TREE */

const branch = translate(scale(pyramid(green),1,1,0.25),-0.5,-0.5,0.3);
const trunk = scale(
                translate(cylinder("#8B4513"),-0.5,-0.5,0.1),
                0.3,0.3,0.3);
const starAbove = translate(
                    rotate(
                        scale(
                            translate(star("#FFD700"),-0.5,-0.5,0),
                            0.1,0.1,0.02),
                            0,math_PI/2,0),
                            0,0,1.5);
                 
                
const num_layers = 15;
function build_xmas_tree(n, tree) {
    return n === 0 
            ? tree
            : build_xmas_tree(n - 1, 
            group(list(tree, translate(
                            scale(branch, n/num_layers,n/num_layers,1), 
                            0,0, 1- n/num_layers)
                            )));
    
}

render_grid(group(list(starAbove,build_xmas_tree(num_layers,branch),trunk)));
```