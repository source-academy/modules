// Source §1
// Prof Martin's Sierpinski triangle fractal

import { union, translate, scale,
group, render, pyramid, sphere, cube }
from 'csg';

const r = 0.75; // vertical stretch factor
const shape = scale(pyramid('#edd4c8'), 1, 1, r);

function repeat(n, trans, s) {
    return n === 0
            ? s
            : repeat(n - 1, trans, trans(s));
}

function sierpinski(o) {
    const t1 = translate(o,  0. , 0.5, -r);
    const t2 = translate(o,  0.5, 0  , -r);
    const t3 = translate(o, -0.5, 0  , -r);
    const t4 = translate(o,  0. ,-0.5, -r);
    const s = union(o,
                    union(union(t1, t2),
                            union(t3, t4)));
    const s_scaled = scale(s, 0.5, 0.5, 0.5);
    return s_scaled;
}

render(repeat(5, sierpinski, shape));
