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
    roundedCube,
    roundedCylinder,
    geodesicSphere,

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
    scale_x,
    scale_y,
    scale_z,
    shape_center,
    shape_set_center,
    area,
    volume,
    flip_x,
    flip_y,
    flip_z,
    translate,
    translate_x,
    translate_y,
    translate_z,
    beside_x,
    beside_y,
    beside_z,
    bounding_box,
    rotate,
    rotate_x,
    rotate_y,
    rotate_z,
    is_shape,
    clone,
    store,
    store_as_color,
    store_as_rgb,
    render_grid_axis,
    render_grid,
    render_axis,
    render
} from 'csg';
```

```js
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
