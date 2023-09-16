import { ReplResult } from '../../typings/type_helpers'
import { Data, Layout } from 'plotly.js-dist'

/**
 * TODO: figure out a nice demo of using the vector calculus
 * 
 * 1. Lagrange points for Sun, Earth and Moon
 * 2. 3 Body orbits
 * 3. A good case of introducing plotly
 * 4. Points to Shape
 * 5. Documentation 
 * 6. Visualize the quad trees
 * 
 * QuadTree visualization complete.
 *
 * 1. Beam deflection in the field
 * 2. show effect of the fiedl on a body
 * 3. Show how lightning strikes work
 * 4. Visualization of fluid dynamics (boat floating on the water against the wind)
 * 5. Baseballs rotating in the air show the directions of the winds patterns
 *
 */

export class ConePlot implements ReplResult {
  plotlyDrawFn: any
  data: Data | Data[]
  layout: Partial<Layout>
  constructor(plotlyDrawFn: any, data: Data | Data[], layout: Partial<Layout>) {
    this.plotlyDrawFn = plotlyDrawFn
    this.data = data
    this.layout = layout
  }
  public toReplString = () => '<ConePlot>'

  public draw = (divId: string) => {
    this.plotlyDrawFn(divId, this.data, this.layout)
  }
}

export type ParameterizedVector = (t: number) => Vector
export type FunctionalVector = (v: Vector) => Vector
export type FunctionMapping = (t: number) => number
export class Vector implements ReplResult {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
  ) {}

  public toReplString = () => `(${this.x}, ${this.y}, ${this.z})`
}

export function add(v1: Vector, v2: Vector): Vector {
  return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
}

export function subtract(v1: Vector, v2: Vector): Vector {
  return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
}

export function divide(v1: Vector, k: number) {
  return new Vector(v1.x/k, v1.y/k, v1.z/k);
}

export function cross_product(v1: Vector, v2: Vector): Vector {
  return new Vector(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x,
  )
}

export function n_order_stencil(
  n: number,
  h: number,
): (f: FunctionalVector) => (x: Vector) => Vector {
  return function (f: FunctionalVector): (x: Vector) => Vector {
    return function (v: Vector): Vector {
      const { x, y, z } = v
      const dv = new Vector(0, 0, 0)
      for (let dim in v) {
        const sum = [-n, -(n - 2), -(n - 4), -(n - 6)].reduce((acc, j) => {
          const c_j = j % 4 === 0 ? 1 : -1
          const v_j = new Vector(v.x, v.y, v.z)
          v_j[dim] += j * h
          return acc + c_j * f(v_j)[dim]
        }, 0)
        dv[dim] = sum / h ** n
      }
      return dv
    }
  }
}
