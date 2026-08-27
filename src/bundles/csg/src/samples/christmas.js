// Source §2
// Christmas tree

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
