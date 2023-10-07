// Source §1
// Snowglobe example used in the functions.ts summary at the top of the file

import {
    silver, crimson, cyan,
    cube, cone, sphere,
    intersect, union, scale, translate,
    render_grid_axes
} from "csg";

const base = intersect(
    scale(cube(silver), 1, 1, 0.3),
    scale(cone(crimson), 1, 1, 3)
);
const snowglobe = union(
    translate(sphere(cyan), 0, 0, 0.22),
    base
);
render_grid_axes(snowglobe);
