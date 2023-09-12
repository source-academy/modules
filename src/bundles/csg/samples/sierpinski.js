// Source §1
// Prof Martin's Sierpinski fractals

import { union, translate, scale, render, pyramid, sphere, cube }
from 'csg';

function repeat(n, trans, s) {
    return n === 0
           ? s
           : repeat(n - 1, trans, trans(s));
}

// sierpinski returns a shape transformer
// following Sierpinski's 3D fractal scheme
// v: vertical displacement of original shape
//.   for lower level shapes
// h: horizontal displacement of original shape
//.   for lower level shapes
function sierpinski(v, h) {
    return o => {
        const t1 = translate(o,  h,  h, -v);
        const t2 = translate(o, -h,  h, -v);
        const t3 = translate(o,  h, -h, -v);
        const t4 = translate(o, -h, -h, -v);
        const c = union(o,
                        union(union(t1, t2),
                              union(t3, t4)));
        const c_scaled = scale(c, 0.5, 0.5, 0.5);
        return c_scaled;
    };
}

render(repeat(5,
              sierpinski(1, 0.5),
              pyramid('#edd4c8')));

// spheres are computationally expensive
// only try repeat 2
/*
render(repeat(2,
              sierpinski(0.75, 0.75),
              sphere('#edd4c8')));
*/

/*
render(repeat(6,
              sierpinski(1, 1),
              cube('#edd4c8')));
*/
