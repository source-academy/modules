import type { Curve } from '@sourceacademy/bundle-curve/curves_webgl';
import type { Data, Layout } from 'plotly.js-dist';
import { CurvePlot } from './plotly';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';

export async function* generatePlot(
  evaluator: IDataHandler,
  type: string,
  numPoints: number,
  config: Data,
  layout: Partial<Layout>,
  is_colored: boolean,
  func: Curve
): AsyncGenerator<void, CurvePlot, undefined> {
  const x_s: number[] = [];
  const y_s: number[] = [];
  const z_s: number[] = [];
  const color_s: string[] = [];
  for (let i = 0; i <= numPoints; i += 1) {
    const pointId = yield* evaluator.closure_call(func, [{ type: DataType.NUMBER, value: i / numPoints }], DataType.OPAQUE);
    const point = await evaluator.opaque_get(pointId as TypedValue<DataType.OPAQUE>);
    // TODO: throw if not point
    x_s.push(point.x);
    y_s.push(point.y);
    z_s.push(point.z);
    color_s.push(`rgb(${point.r},${point.g},${point.b})`);
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
    {
      ...plotlyData,
      ...config,
      type
    } as Data,
    layout
  );
}
