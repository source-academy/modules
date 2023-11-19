import context from 'js-slang/context'
import Plotly, { type Data, type Layout } from 'plotly.js-dist'
import {
  ConePlot,
  divide,
  type FunctionalVector,
  type FunctionMapping,
  n_order_stencil,
  type ParameterizedVector,
  subtract,
  Vector,
} from './vector_calculus'
import { Body } from '../plotly/n_body_functions'

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

export function add(v1: Vector, v2: Vector): Vector {
  return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
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
    const h = 1e-7
    const dfdv: Vector = new Vector(0, 0, 0)
    for (let dim in v) {
      if (dim === 'toReplString') continue
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
      {
        ...data,
        type: 'cone',
        //@ts-ignore
        hoverinfo: 'x+y+z+u+v+w+name',
        colorscale: 'Blackbody',
        sizeref: 1.25,
      },
      {},
    ),
  )
}

export function display_field_curve(numPoints: number) {
  return (curve: (number) => Vector) => {
    const input_vectors: Vector[] = []
    for (let i = 0; i <= numPoints; i += 1) {
      const pos_vector = curve(i / numPoints)
      input_vectors.push(pos_vector)
    }
    return (func: FunctionalVector) => {
      let results: Vector[] = []
      input_vectors.forEach((input) => {
        results.push(func(input))
      })

      const x_s = input_vectors.map((input) => x_of(input))
      const y_s = input_vectors.map((input) => y_of(input))
      const z_s = input_vectors.map((input) => z_of(input))

      const u_s = results.map((res) => x_of(res))
      const v_s = results.map((res) => y_of(res))
      const w_s = results.map((res) => z_of(res))

      const data = { x: x_s, y: y_s, z: z_s, u: u_s, v: v_s, w: w_s }
      drawnVectors.push(
        new ConePlot(
          draw_new_cone_plot,
          {
            ...data,
            type: 'cone',
            //@ts-ignore
            hoverinfo: 'x+y+z+u+v+w+name',
            colorscale: 'Blackbody',
            sizeref: 1.25,
            vertexnormalepsilon: 1e-6,
          },
          {},
        ),
      )
    }
  }
}

export function display_field_surface(numPoints1: number) {
  return (numPoints2: number) => {
    return (surface: (number) => (number) => Vector) => {
      return (func: FunctionalVector) => {
        const input_vectors: Vector[] = []
        for (let i = 1; i < numPoints1; i += 1) {
          const curve = surface(i / numPoints1)
          for (let j = 0; j < numPoints2; j += 1) {
            const pos_vector = curve(j / numPoints2)
            input_vectors.push(pos_vector)
          }
        }
        console.log(input_vectors)
        let results: Vector[] = []
        input_vectors.forEach((input) => {
          results.push(func(input))
        })

        const x_s = input_vectors.map((input) => x_of(input))
        const y_s = input_vectors.map((input) => y_of(input))
        const z_s = input_vectors.map((input) => z_of(input))

        const u_s = results.map((res) => x_of(res))
        const v_s = results.map((res) => y_of(res))
        const w_s = results.map((res) => z_of(res))

        const data = { x: x_s, y: y_s, z: z_s, u: u_s, v: v_s, w: w_s }
        drawnVectors.push(
          new ConePlot(
            draw_new_cone_plot,
            {
              ...data,
              type: 'cone',
              //@ts-ignore
              hoverinfo: 'x+y+z+u+v+w+name',
              colorscale: 'Blackbody',
              sizeref: 20,
              vertexnormalepsilon: 1e-6,
            },
            {},
          ),
        )
      }
    }
  }
}



let animationId: number | null = null
function draw_new_simulation(func: FunctionalVector, body: Body) {
  return (divId: string, data: Data[], layout: Partial<Layout>) => {
    Plotly.newPlot(divId, data, layout)
    const fieldData = data[0]
    console.log(animationId)
    console.log(data)
    if (animationId != null) return

    function update() {
      const dt = 0.00016
      const forceActed: Vector = func(
        make_vector(body.pos[0], body.pos[1], body.pos[2]),
      )
      const acceleration = divide(forceActed, body.mass)
      const new_pos = body.pos.map((p, i) => p + body.velocity[i] * dt)

      const new_velocity = body.velocity.map(
        (vel, i) => vel + body.acceleration[i] * dt,
      )

      const new_body_accleration = [
        body.acceleration[0] + acceleration.x,
        body.acceleration[1] + acceleration.y,
        body.acceleration[2] + acceleration.z,
      ]
      body.pos = new_pos
      body.velocity = new_velocity
      body.acceleration = new_body_accleration

      console.log(divId)
      console.log(body.pos)
      Plotly.react(divId, [
        fieldData,
        {
          x: [body.pos[0]],
          y: [body.pos[1]],
          z: [body.pos[2]],
          type: 'scatter3d',
          mode: 'markers',
        },
      ])
      animationId = requestAnimationFrame(update)
    }
    animationId = requestAnimationFrame(update)
  }
}

function draw_new_cone_plot(
  divId: string,
  data: Data,
  layout: Partial<Layout>,
) {
  if (Array.isArray(data)) {
    Plotly.newPlot(divId, data, layout)
  } else {
    Plotly.newPlot(divId, [data], layout)
  }
}
