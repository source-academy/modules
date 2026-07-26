import { get_duration, get_wave, is_sound } from '@sourceacademy/bundle-sound/functions';
import type { Sound } from '@sourceacademy/bundle-sound/types';
import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import type { Data, Layout } from 'plotly.js-dist';
import { generatePlot } from './curve_functions';
import { CurvePlot } from './plotly';
import type { PlotlyRenderMessage } from './protocol';

export function new_plot_json(data: any): void {
  // TODO: draw with data
  return data;
}

/**
 * @param evaluator The evaluator which will be used
 * @param data The data which plotly will use
 */
export async function* draw_new_plot(evaluator: IDataHandler, data: TypedValue<DataType.LIST>): AsyncGenerator<void, Data, unknown> {
  const plotlyData: Data = {};
  await add_fields_to_data(evaluator, plotlyData, data);
  return plotlyData;
}

async function serialisePlotlyData(
  evaluator: IDataHandler,
  data: TypedValue<DataType>,
  map: Map<TypedValue<DataType.ARRAY | DataType.PAIR>['value'], unknown> = new Map()
): Promise<unknown> {
  switch (data.type) {
    case DataType.NUMBER:
    case DataType.INTEGER:
    case DataType.CONST_STRING:
    case DataType.BOOLEAN:
    case DataType.EMPTY_LIST:
      return data.value;
    case DataType.ARRAY: {
      if (map.has(data.value)) {
        return map.get(data.value);
      }
      const array: unknown[] = Array.from({ length: await evaluator.array_length(data) }, () => undefined);
      map.set(data.value, array);
      await Promise.all(array.map(async (_, i) => {
        const element = await evaluator.array_get(data, i);
        array[i] = await serialisePlotlyData(evaluator, element, map);
      }));
      return array;
    }
    case DataType.PAIR: {
      if (map.has(data.value)) {
        return map.get(data.value);
      }
      const pair: [unknown, unknown] = [undefined, undefined];
      map.set(data.value, pair);
      const head = await evaluator.pair_head(data);
      const tail = await evaluator.pair_tail(data);
      pair[0] = await serialisePlotlyData(evaluator, head, map);
      pair[1] = await serialisePlotlyData(evaluator, tail, map);
      return pair;
    }
    case DataType.OPAQUE:
      return await evaluator.opaque_get(data);
    case DataType.VOID:
    case DataType.CLOSURE:
    default:
      throw new EvaluatorRuntimeError(`${serialisePlotlyData.name}: Cannot serialize data of type ${data.type}`);
  }
}

/**
 * @param convertedData Stores the Javascript object which is used by plotly.js
 * @param data The list of pairs data used by source
 * @hidden
 */
export async function add_fields_to_data(handler: IDataHandler, convertedData: Data, data: TypedValue<DataType.LIST>): Promise<void> {
  let currentData: TypedValue<DataType> = data;
  while (currentData.type === DataType.PAIR || currentData.type === DataType.ARRAY) {
    const entry = currentData.type === DataType.ARRAY ? await handler.array_get(currentData, 0) : await handler.pair_head(currentData);
    if (entry.type !== DataType.PAIR && !(entry.type === DataType.ARRAY && await handler.array_length(entry) === 2)) {
      throw new EvaluatorRuntimeError(`${add_fields_to_data.name}: Expected list of pairs, got type ${entry.type} with value ${String(entry.value)}`);
    }

    const field = entry.type === DataType.ARRAY ? await handler.array_get(entry, 0) : await handler.pair_head(entry);

    if (field.type !== DataType.CONST_STRING) {
      throw new EvaluatorRuntimeError(`${add_fields_to_data.name}: Expected head of pair to be string, got type ${field.type} with value ${String(field.value)}`);
    }

    const value = entry.type === DataType.ARRAY ? await handler.array_get(entry, 1) : await handler.pair_tail(entry);
    (convertedData as any)[field.value] = await serialisePlotlyData(handler, value);
    currentData = currentData.type === DataType.ARRAY ? await handler.array_get(currentData, 1) : await handler.pair_tail(currentData);
  }
  if (currentData.type !== DataType.EMPTY_LIST) {
    throw new EvaluatorRuntimeError(`${add_fields_to_data.name}: Expected list of pairs, got type ${currentData.type} with value ${String(currentData.value)}`);
  }

}

async function createPlotFunction(
  evaluator: IDataHandler,
  display: (data: Omit<PlotlyRenderMessage, 'type'>) => Promise<void>,
  type: string,
  config: Data,
  layout: Partial<Layout>,
  is_colored: boolean = false
): Promise<PlotFunction> {
  return async function* (num) {

    // eslint-disable-next-line func-style
    const func = async function* (curveFunction: TypedValue<DataType.CLOSURE>) {
      const plotDrawn = yield* generatePlot(
        evaluator,
        type,
        num,
        config,
        layout,
        is_colored,
        curveFunction
      );
      await display(plotDrawn.toSerialized());
      return await evaluator.opaque_make(plotDrawn);
    };

    return await evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      func
    );
  };
}

type PlotFunctionGenerator = (evaluator: IDataHandler, display: (data: Omit<PlotlyRenderMessage, 'type'>) => Promise<void>) => Promise<PlotFunction>;
type PlotFunction = (numPoints: number) => AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown>;

export const draw_connected_2d: PlotFunctionGenerator = (evaluator: IDataHandler, display: (data: Omit<PlotlyRenderMessage, 'type'>) => Promise<void>) => createPlotFunction(
  evaluator,
  display,
  'scattergl',
  {
    mode: 'lines'
  },
  {
    xaxis: { visible: true },
    yaxis: {
      visible: true,
      scaleanchor: 'x'
    }
  },
  true
);

export const draw_connected_3d: PlotFunctionGenerator = (evaluator: IDataHandler, display: (data: Omit<PlotlyRenderMessage, 'type'>) => Promise<void>) => createPlotFunction(
  evaluator,
  display,
  'scatter3d',
  { mode: 'lines' },
  {},
  true
);

export const draw_points_2d: PlotFunctionGenerator = (evaluator: IDataHandler, display: (data: Omit<PlotlyRenderMessage, 'type'>) => Promise<void>) => createPlotFunction(
  evaluator,
  display,
  'scatter',
  { mode: 'markers' },
  {
    xaxis: { visible: true },
    yaxis: {
      visible: true,
      scaleanchor: 'x'
    }
  },
  true
);

export const draw_points_3d: PlotFunctionGenerator = (evaluator: IDataHandler, display: (data: Omit<PlotlyRenderMessage, 'type'>) => Promise<void>) => createPlotFunction(
  evaluator,
  display,
  'scatter3d',
  { mode: 'markers' },
  {}
);

export async function draw_sound_2d(sound: Sound, display: (data: Omit<PlotlyRenderMessage, 'type'>) => Promise<void>): Promise<void> {
  const FS: number = 44100; // Output sample rate
  if (!is_sound(sound)) {
    throw new EvaluatorRuntimeError(`${draw_sound_2d.name}: argument is not a sound`);
    // If a sound is already displayed, terminate execution.
  } else if (get_duration(sound) < 0) {
    throw new EvaluatorRuntimeError(`${draw_sound_2d.name}: duration of sound is negative`);
  } else {
    // Instantiate audio context if it has not been instantiated.
    // Create mono buffer
    const channel: number[] = [];
    const time_stamps: number[] = [];
    const len = Math.ceil(FS * get_duration(sound));

    const wave = get_wave(sound);
    for (let i = 0; i < len; i += 1) {
      time_stamps[i] = i / FS;
      const generator = wave(i / FS);
      let next = await generator.next();
      while (!next.done) {
        next = await generator.next();
      }
      channel[i] = next.value;
    }

    const x_s: number[] = [];
    const y_s: number[] = [];

    for (let i = 0; i < channel.length; i += 1) {
      x_s.push(time_stamps[i]);
      y_s.push(channel[i]);
    }

    const plotlyData: Data = {
      x: x_s,
      y: y_s,
      type: 'scattergl',
      mode: 'lines',
      line: { width: 0.5 }
    };
    const plot = new CurvePlot(
      plotlyData,
      {
        xaxis: {
          type: 'linear',
          title: {
            text: 'Time'
          },
          anchor: 'y',
          position: 0,
          rangeslider: { visible: true }
        },
        yaxis: {
          type: 'linear',
          visible: false
        },
        bargap: 0.2,
        barmode: 'stack'
      }
    );
    await display(plot.toSerialized());
  }
}
