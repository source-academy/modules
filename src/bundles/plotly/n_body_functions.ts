var MINMASS = 1e2
var MAXMASS = 1e10
var G = 1e-11 // Gravitational Constant
var ETA = 10 // Softening constant

var DISTANCE_MULTIPLE = 2

var INTERACTION_METHOD = 'BN' // BN or BRUTE, type of tree search to use
var MAXDEPTH = 50 // BN tree max depth ( one less than actual, example with maxdepth = 2, the levels are [0 1 2] )
var BN_THETA = 0.5

class Body {
  pos: number[] = []
  mass: number = 0
}

class BoundingBox {
  bottomLeft: number[] = []
  topRight: number[] = []

  constructor(x1: number, x2: number, y1: number, y2: number) {
    this.bottomLeft = [x1, y1]
    this.topRight = [x2, y2]
  }

  public contains_point(pt: number[]) {
    if (
      pt[0] >= this.bottomLeft[0] &&
      pt[0] < this.topRight[0] &&
      pt[1] >= this.bottomLeft[1] &&
      pt[1] < this.topRight[1]
    ) {
      return true
    }
    return false
  }
}

// Datasets to test the simulation
// visual better

class QuadTreeNode {
  body: any[] //
  center_of_mass: number[]
  total_mass_in_center: number
  children: [null, null, null, null]
  bounding_box: BoundingBox

  constructor(
    body,
    center_of_mass,
    total_mass_in_center,
    children,
    bounding_box,
  ) {
    this.body = body
    this.center_of_mass = center_of_mass
    this.total_mass_in_center = total_mass_in_center
    this.children = children
    this.bounding_box = bounding_box
  }
}

class QuadTree {
  root: QuadTreeNode

  constructor() {
    this.root = new QuadTreeNode(
      [],
      [],
      0,
      [null, null, null, null],
      new BoundingBox(0, 0, 100, 100),
    )
  }

  public build_tree = (bodies: Body[]) => {
    for (var i = 0; i < bodies.length; i++) {
      if (this.root.bounding_box.contains_point(bodies[i].pos)) {
        this.insert_body(this.root, bodies[i])
      }
    }
  }

  public insert_body(node: QuadTreeNode, body: Body, depth: number = 0) {
    if (node.body.length > 0) {
        if(depth > MAXDEPTH) {
            node.body.push(body);
        } else {

        }
    } else {
      node.body.push(body)
      node.center_of_mass = body.pos
      node.total_mass_in_center = body.mass
    }
  }
}
