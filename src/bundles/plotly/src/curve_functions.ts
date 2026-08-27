import type { Color, Curve, Point } from '@sourceacademy/bundle-curve/curves_webgl';
import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import type { Data, Layout } from 'plotly.js-dist';
import { CurvePlot } from './plotly';

function isPoint(value: unknown): value is Point {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const point = value as Partial<Point>;
  return typeof point.x === 'number'
    && typeof point.y === 'number'
    && typeof point.z === 'number'
    && Array.isArray(point.color)
    && point.color.length === 4
    && point.color.every((component: Color[number]) => typeof component === 'number');
}

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
    const t = numPoints === 0 ? 0 : i / numPoints;
    const pointId = yield* evaluator.closure_call(func, [{ type: DataType.NUMBER, value: t }], DataType.OPAQUE);
    const point = await evaluator.opaque_get(pointId as TypedValue<DataType.OPAQUE>);
    if (!isPoint(point)) {
      throw new EvaluatorRuntimeError(`${generatePlot.name}: Curve must return a Point`);
    }
    x_s.push(point.x);
    y_s.push(point.y);
    z_s.push(point.z);
    if (is_colored) {
      color_s.push(`rgb(${Math.floor(point.color[0] * 255)},${Math.floor(point.color[1] * 255)},${Math.floor(point.color[2] * 255)})`);
    }
  }

  const plotlyData: Data = {
    x: x_s,
    y: y_s,
    z: z_s,
    marker: {
      size: 2,
      ...is_colored ? { color: color_s } : {}
    },
    ...is_colored ? { line: { color: color_s } } : {}
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
