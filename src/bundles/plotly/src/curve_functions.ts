import type { Curve } from '@sourceacademy/bundle-curve/curves_webgl';
import { b_of, g_of, r_of, x_of, y_of, z_of } from '@sourceacademy/bundle-curve/functions';
import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import { CurvePlot } from './plotly';

export function generatePlot(
  type: string,
  numPoints: number,
  config: Data,
  layout: Partial<Layout>,
  is_colored: boolean,
  func: Curve
): CurvePlot {
  const x_s: number[] = [];
  const y_s: number[] = [];
  const z_s: number[] = [];
  const color_s: string[] = [];
  for (let i = 0; i <= numPoints; i += 1) {
    const point = func(i / numPoints);
    x_s.push(x_of(point));
    y_s.push(y_of(point));
    z_s.push(z_of(point));
    color_s.push(`rgb(${r_of(point)},${g_of(point)},${b_of(point)})`);
  }

  const plotlyData: Data = {
    x: x_s,
    y: y_s,
    z: z_s,
    marker: {
      size: 2,
      color: color_s
    },
    line: {
      color: color_s
    }
  };
  return new CurvePlot(
    draw_new_curve,
    {
      ...plotlyData,
      ...config,
      type
    } as Data,
    layout
  );
}

function draw_new_curve(divId: string, data: Data, layout: Partial<Layout>) {
  Plotly.react(divId, [data], layout);
}
