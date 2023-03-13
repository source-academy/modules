/**
 * The module `painter` provides functions for visualizing painters in SICP JS 2.2.4 plots using the plotly.js library.
 * @module plotly
 */

import { context } from 'js-slang/moduleHelpers'
import Plotly, { Data, Layout } from 'plotly.js-dist'
import { Frame, LinePlot } from './painter'

const drawnPainters: LinePlot[] = []
context.moduleContexts.painter.state = {
  drawnPainters,
}

let data: Data = {}
const x_s: (number | null)[] = []
const y_s: (number | null)[] = []

/**
 * Draw a line from v_start to v_end
 * @param v_start vector of the first point
 * @param v_end vector of the second point
 */
export function draw_line(v_start: number[], v_end: number[]) {
  console.log(x_s, y_s, v_start, v_end)
  x_s.push(v_start[0])
  x_s.push(v_end[0])
  y_s.push(v_start[1])
  y_s.push(v_end[1])
  x_s.push(null)
  y_s.push(null)
}

/**
 * Displays the lines created by the painter on the given frame
 * @param painter the painter function
 * @param frame the frame on which the painter works on
 */
export function display_painter(painter: (frame: Frame) => void, frame: Frame) {
  painter(frame)
  data = { x: x_s, y: y_s }
  drawnPainters.push(
    new LinePlot(draw_new_painter, { ...data, mode: 'lines' } as Data, {
      xaxis: { visible: true },
      yaxis: { visible: true, scaleanchor: 'x' },
    }),
  )
}

function draw_new_painter(divId: string, data: Data, layout: Partial<Layout>) {
  Plotly.newPlot(divId, [data], layout)
}
