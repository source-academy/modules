import context from 'js-slang/context';
import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import { type Frame, LinePlot } from './painter';

const drawnPainters: LinePlot[] = [];
context.moduleContexts.painter.state = {
  drawnPainters,
};

let data: Data = {};
const x_s: (number | null)[] = [];
const y_s: (number | null)[] = [];

/**
 * Draw a line from v_start to v_end
 * @param v_start vector of the first point
 * @param v_end vector of the second point
 * @example
 * ```
 * const v1 = pair(1,2);
 * const v2 = pair(2,3);
 * draw_line(v1, v2);
 * ```
 */
export function draw_line(v_start: number[], v_end: number[]) {
  console.log(x_s, y_s, v_start, v_end);
  x_s.push(v_start[0]);
  x_s.push(v_end[0]);
  y_s.push(v_start[1]);
  y_s.push(v_end[1]);
  x_s.push(null);
  y_s.push(null);
}

/**
 * Returns a function that turns a given Frame into a Drawing, given the
 * painter
 * @param painter the painter to transform the frame
 * @returns function of type Frame → Drawing
 *  * @example
 * ```
 * display_painter(flipped_outline_painter)(unit_frame);
 * ```
 */
export function display_painter(painter: (frame: Frame) => void) {
  return (frame: Frame) => {
    painter(frame);
    data = {
      x: x_s,
      y: y_s,
    };
    drawnPainters.push(
      new LinePlot(draw_new_painter, {
        ...data,
        mode: 'lines',
      } as Data, {
        xaxis: { visible: true },
        yaxis: {
          visible: true,
          scaleanchor: 'x',
        },
      }),
    );
  };
}

function draw_new_painter(divId: string, data: Data, layout: Partial<Layout>) {
  Plotly.newPlot(divId, [data], layout);
}
