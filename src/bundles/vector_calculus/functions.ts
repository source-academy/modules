import context  from 'js-slang/context'
import Plotly, { Data, Layout } from 'plotly.js-dist'
import {
  ConePlot,
  FunctionalVector,
  FunctionMapping,
  n_order_stencil,
  ParameterizedVector,
  subtract,
  Vector,
} from './vector_calculus'

const drawnVectors: ConePlot[] = []
context.moduleContexts.vector_calculus.state = {
  drawnVectors,
}

// Create PRs for modules


/**
 * Makes a vector with the given x, y and z coordinates.
 *
 * @param x x co-ordinate of the vector
 * @param y y co-ordinate of the vector
 * @param z z co-ordinate of the vector
 * @returns
 */
export function make_vector(x: number, y: number, z: number) {
  return new Vector(x, y, z)
}

export function make_parameterized_vector(
  x: FunctionMapping,
  y: FunctionMapping,
  z: FunctionMapping,
): ParameterizedVector {
  return (t: number) => new Vector(x(t), y(t), z(t))
}

export function x_of(v: Vector): number {
  return v.x
}

export function y_of(v: Vector): number {
  return v.y
}

export function z_of(v: Vector): number {
  return v.z
}

export function derivative(f: FunctionalVector): (x: Vector) => Vector {
  const d = n_order_stencil(2, 0.01)
  const df = d(f)
  const val = df(new Vector(1, 1, 1))
  console.log(val)
  return df
}

export function threepointStencilDerivative(
  f: FunctionalVector,
): (v: Vector) => Vector {
  return function (v: Vector): Vector {
    const h = 1e-9
    const dfdv: Vector = new Vector(0, 0, 0)
    for (let dim in v) {
      const xPlus = new Vector(v.x, v.y, v.z)
      const xMinus = new Vector(v.x, v.y, v.z)
      xPlus[dim] += h
      xMinus[dim] -= h
      dfdv[dim] = subtract(f(xPlus), f(xMinus))[dim] / (2 * h)
    }
    return dfdv
  }
}

export function stringify_vector(v: Vector) {
  return `(${v.x}, ${v.y}, ${v.z})`
}

export function display_field(f: FunctionalVector) {
  console.log(f)
  let inputs: Vector[] = []
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < 10; k++) {
        inputs.push(new Vector(i / 10, j / 10, k / 10))
      }
    }
  }
  let results: Vector[] = []
  inputs.forEach((input) => {
    results.push(f(input))
  })

  const x_s = inputs.map((input) => x_of(input))
  const y_s = inputs.map((input) => y_of(input))
  const z_s = inputs.map((input) => z_of(input))

  const u_s = results.map((res) => x_of(res))
  const v_s = results.map((res) => y_of(res))
  const w_s = results.map((res) => z_of(res))

  const data = { x: x_s, y: y_s, z: z_s, u: u_s, v: v_s, w: w_s }
  drawnVectors.push(
    new ConePlot(
      draw_new_cone_plot,
      { ...data, type: 'cone', hoverinfo: 'x+y+z+u+v+w+name' },
      {},
    ),
  )
}

function draw_new_cone_plot(
  divId: string,
  data: Data,
  layout: Partial<Layout>,
) {
  Plotly.newPlot(divId, [data], layout)
}
