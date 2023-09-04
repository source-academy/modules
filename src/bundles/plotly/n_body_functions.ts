var MINMASS = 1e2
var MAXMASS = 1e10
var G = 1e-11 // Gravitational Constant
var ETA = 10 // Softening constant

var DISTANCE_MULTIPLE = 2

var INTERACTION_METHOD = 'BN' // BN or BRUTE, type of tree search to use
var MAXDEPTH = 50 // BN tree max depth ( one less than actual, example with maxdepth = 2, the levels are [0 1 2] )
var BN_THETA = 0.5

export class Body {
  pos: number[] = []
  mass: number = 0
  velocity: number[] = []
  acceleration: number[] = []

  constructor(
    pos: number[],
    mass: number,
    velocity: number[],
    acceleration: number[],
  ) {
    this.pos = pos
    this.mass = mass
    this.velocity = velocity
    this.acceleration = acceleration
  }

  resultOfForce(force: { fx: number; fy: number }) {
    this.acceleration[0] += force.fx / this.mass
    this.acceleration[1] += force.fy / this.mass
  }

  updateBodyState(dt: number) {
    this.updatePos(dt)
    this.updateVelocity(dt)
  }

  updatePos(dt: number) {
    this.pos[0] = this.pos[0] + this.velocity[0] * dt
    this.pos[1] = this.pos[1] + this.velocity[1] * dt
  }

  updateVelocity(dt: number) {
    this.velocity[0] = this.velocity[0] + this.acceleration[0] * dt
    this.velocity[1] = this.velocity[1] + this.acceleration[1] * dt
  }

  isEqual(other: Body) {
    return (
      this.pos.toString() == other.pos.toString() && this.mass == other.mass
    )
  }
}

class BoundingBox {
  bottomLeft: number[] = []
  topRight: number[] = []

  constructor(x1: number, y1: number, x2: number, y2: number) {
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

  public draw(ctx) {
    const x = this.bottomLeft[0]
    const y = this.bottomLeft[1]
    const size = this.topRight[0] - this.bottomLeft[0]
    ctx.rect(x, y, size, size)
  }
}

// Datasets to test the simulation
// visual better

class QuadTreeNode {
  body: any[] //
  center_of_mass: number[]
  total_mass_in_center: number
  children: QuadTreeNode[]
  bounding_box: BoundingBox
  is_leaf: boolean

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
    this.is_leaf = true
  }

  public static getEmptyNode(): QuadTreeNode {
    return new QuadTreeNode(
      [],
      [0, 0],
      0,
      [null, null, null, null],
      new BoundingBox(0, 0, 100, 100),
    )
  }

  public insert_body(body: Body, depth: number = 0) {
    this.updateCentreOfMass(body)

    if (this.body.length == 0 && this.is_leaf) {
      this.body.push(body)
    } else {
      if (depth > MAXDEPTH) {
        this.body.push(body)
      } else {
        var bodies: Body[]
        if (this.is_leaf) {
          bodies = [...this.body, body]
        } else {
          bodies = [body]
        }

        for (var i = 0; i < bodies.length; i++) {
          for (var childNo = 0; childNo < 4; childNo++) {
            if (this.children[childNo] == null) {
              this.children[childNo] = QuadTreeNode.getEmptyNode()
              this.children[childNo].bounding_box = this.getBoundingBox(
                childNo,
                this.bounding_box,
              )
            }

            if (
              this.children[childNo].bounding_box.contains_point(bodies[i].pos)
            ) {
              this.children[childNo].insert_body(bodies[i], depth + 1)
            }
          }
        }

        this.body = []
        this.is_leaf = false
      }
    }
  }

  updateCentreOfMass(body: Body) {
    const coMx = this.center_of_mass[0] ?? 0
    const coMy = this.center_of_mass[1] ?? 0

    const newTotalMass = this.total_mass_in_center + body.mass
    const newCoMx =
      (coMx * this.total_mass_in_center + body.pos[0] * body.mass) /
      newTotalMass
    const newCoMy =
      (coMy * this.total_mass_in_center + body.pos[1] * body.mass) /
      newTotalMass

    this.center_of_mass = [newCoMx, newCoMy]
    this.total_mass_in_center = newTotalMass
  }
  public getBoundingBox(
    childNumber: number,
    parentBox: BoundingBox,
  ): BoundingBox {
    const middle: number[] = [
      (parentBox.bottomLeft[0] + parentBox.topRight[0]) / 2,
      (parentBox.bottomLeft[1] + parentBox.topRight[1]) / 2,
    ]
    let x1, x2, y1, y2
    switch (childNumber) {
      case 0:
        x1 = parentBox.bottomLeft[0]
        x2 = middle[0]
        y1 = parentBox.bottomLeft[1]
        y2 = middle[1]
        break
      case 1:
        x1 = middle[0]
        y1 = parentBox.bottomLeft[1]
        x2 = parentBox.topRight[0]
        y2 = middle[1]
        break
      case 2:
        x1 = middle[0]
        y1 = middle[1]
        x2 = parentBox.topRight[0]
        y2 = parentBox.topRight[1]
        break
      case 3:
        x1 = parentBox.bottomLeft[0]
        y1 = middle[1]
        x2 = middle[0]
        y2 = parentBox.topRight[1]
        break
    }

    return new BoundingBox(x1, y1, x2, y2)
  }

  _calcForceOnBody(other: Body, eps = 3) {
    let x1 = other.pos[0]
    let y1 = other.pos[1]
    let m1 = other.mass

    let x2 = this.center_of_mass[0]
    let y2 = this.center_of_mass[1]
    let m2 = this.total_mass_in_center

    const rx = x2 - x1
    const ry = y2 - y1
    const r3 = Math.pow(Math.sqrt(rx * rx + ry * ry) + eps, 3)

    let fx = (m1 * m2 * rx) / r3
    let fy = (m1 * m2 * ry) / r3
    return { fx, fy }
  }

  public netForceOnBody(body: Body, theta = 0.5) {
    // force on the body
    let force = { fx: 0, fy: 0 }

    if (this.is_leaf) {
      for (var i = 0; i < this.body.length; i++) {
        if (!body.isEqual(this.body[i])) {
          let addedForce = this._calcForceOnBody(body)
          force.fx += addedForce.fx
          force.fy += addedForce.fy
        }
      }
    } else {
      const s = Math.abs(
        this.bounding_box.bottomLeft[0] - this.bounding_box.topRight[0],
      )
      const d = Math.sqrt(
        (this.center_of_mass[0] - body.pos[0]) *
          (this.center_of_mass[0] - body.pos[0]) +
          (this.center_of_mass[1] - body.pos[1]) *
            (this.center_of_mass[1] - body.pos[1]),
      )

      if (s / d < theta) {
        return this._calcForceOnBody(body)
      }

      for (let i = 0; i < 4; i++) {
        if (this.children[i] != null) {
          const forceActed = this.children[i].netForceOnBody(body)
          force.fx += forceActed.fx
          force.fy += forceActed.fy
        }
      }
    }

    return force
  }

  public draw(ctx) {
    for (var i = 0; i < this.body.length; i++) {
      ctx.beginPath()
      ctx.arc(
        this.body[i].pos[0],
        this.body[i].pos[1],
        10,
        0,
        2 * Math.PI,
        false,
      )
      ctx.fillStyle = 'blue'
      ctx.fill()
    }

    if (this.is_leaf) {
      this.bounding_box.draw(ctx)
    }

    for (var i = 0; i < 4; i++) {
      if (this.children[i] != null) {
        this.children[i].draw(ctx)
      }
    }
  }
}

export class QuadTree {
  root: QuadTreeNode
  size: number
  bodies: Body[]

  constructor(size) {
    this.size = size
    this.root = new QuadTreeNode(
      [],
      [],
      0,
      [null, null, null, null],
      new BoundingBox(-size, -size, size, size),
    )
    this.bodies = []
  }

  public build_tree = (bodies: Body[]) => {
    this.clear_tree()
    this.bodies = bodies
    for (var i = 0; i < this.bodies.length; i++) {
      if (this.root.bounding_box.contains_point(this.bodies[i].pos)) {
        this.root.insert_body(this.bodies[i])
      }
    }
  }

  public simulateForces = () => {
    this.bodies.forEach((body) => {
      // how much force the entire tree applies to the body
      const totalForceOnBody = this.root.netForceOnBody(body)
      console.log(body)
      console.log(totalForceOnBody);
      body.resultOfForce(totalForceOnBody)
    })
  }

  public draw(ctx) {
    ctx.strokeRect(0, 0, this.size, this.size)
    this.root.draw(ctx)
  }

  clear_tree() {
    this.root = new QuadTreeNode(
      [],
      [],
      0,
      [null, null, null, null],
      new BoundingBox(-this.size, -this.size, this.size, this.size),
    )
    this.bodies = []
  }
}
