import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import type { Data, Layout } from 'plotly.js-dist';
import { generatePlot } from './curve_functions';
import type { ListOfPairs } from './plotly';
import type { PlotlyRenderMessage } from './protocol';

export function new_plot(data: ListOfPairs): void {
}

/**
 * Adds a new plotly plot to the context which will be rendered in the Plotly Tabs
 * @example
 * ```
 * const z1 = [
 *   [8.83,8.89,8.81,8.87,8.9,8.87],
 *   [8.89,8.94,8.85,8.94,8.96,8.92],
 *   [8.84,8.9,8.82,8.92,8.93,8.91],
 *   [8.79,8.85,8.79,8.9,8.94,8.92],
 *   [8.79,8.88,8.81,8.9,8.95,8.92],
 *   [8.8,8.82,8.78,8.91,8.94,8.92],
 *   [8.75,8.78,8.77,8.91,8.95,8.92],
 *   [8.8,8.8,8.77,8.91,8.95,8.94],
 *   [8.74,8.81,8.76,8.93,8.98,8.99],
 *   [8.89,8.99,8.92,9.1,9.13,9.11],
 *   [8.97,8.97,8.91,9.09,9.11,9.11],
 *   [9.04,9.08,9.05,9.25,9.28,9.27],
 *   [9,9.01,9,9.2,9.23,9.2],
 *   [8.99,8.99,8.98,9.18,9.2,9.19],
 *   [8.93,8.97,8.97,9.18,9.2,9.18]
 * ];
 *
 * let z2 = [];
 * for (let i = 0; i < array_length(z1); i = i + 1) {
 *   let z2_row = [];
 *   for (let j = 0; j < array_length(z1[i]); j = j + 1) {
 *     z2_row.push(z1[i][j]+1);
 *   }
 *   z2.push(z2_row);
 * }
 * const data = [{ z: z1, type: 'surface' }, { z: z2 , type: 'surface' }];
 * new_plot_json(data); // creates a surface plot in Plotly Tab
 * ```
 * @param data The data as an array of json objects having some or all of the given fields
 */
export function new_plot_json(data: any): void {
  // TODO: draw with data
  return data;
}

/**
 * @param data The data which plotly will use
 * @param divId The id of the div element on which the plot will be displayed
 */
export async function* draw_new_plot(evaluator: IDataHandler, data: TypedValue<DataType.LIST>): AsyncGenerator<void, Data, unknown> {
  const plotlyData: Data = {};
  await add_fields_to_data(evaluator, plotlyData, data);
  return plotlyData;
}

async function serialisePlotlyData(evaluator: IDataHandler, data: TypedValue<DataType>, map: WeakMap<TypedValue<DataType>, unknown> = new WeakMap()): Promise<unknown> {
  console.log(`Serialising data of type ${data.type} with value ${data.value}`);
  switch (data.type) {
    case DataType.NUMBER:
    case DataType.CONST_STRING:
    case DataType.BOOLEAN:
    case DataType.EMPTY_LIST:
      return data.value;
    case DataType.ARRAY: {
      if (map.has(data)) {
        return map.get(data);
      }
      const array: unknown[] = Array.from({ length: await evaluator.array_length(data) }, () => undefined);
      console.log(JSON.stringify(array));
      map.set(data, array);
      await Promise.all(array.map(async (_, i) => {
        const element = await evaluator.array_get(data, i);
        array[i] = await serialisePlotlyData(evaluator, element, map);
      }));
      return array;
    }
    case DataType.PAIR: {
      if (map.has(data)) {
        return map.get(data);
      }
      const pair: [unknown, unknown] = [undefined, undefined];
      map.set(data, pair);
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
      throw new EvaluatorRuntimeError(`${add_fields_to_data.name}: Expected list of pairs, got ${entry}`);
    }

    const field = entry.type === DataType.ARRAY ? await handler.array_get(entry, 0) : await handler.pair_head(entry);

    if (field.type !== DataType.CONST_STRING) {
      throw new EvaluatorRuntimeError(`${add_fields_to_data.name}: Expected head of pair to be string, got ${field}`);
    }

    const value = entry.type === DataType.ARRAY ? await handler.array_get(entry, 1) : await handler.pair_tail(entry);
    // TODO: Restrict to only allow certain types of values (e.g. number, string, array, etc.)
    (convertedData as any)[field.value] = await serialisePlotlyData(handler, value);
    console.log(`Added field ${field.value} with value ${convertedData[field.value as keyof typeof convertedData]} to plotly data`);
    currentData = currentData.type === DataType.ARRAY ? await handler.array_get(currentData, 1) : await handler.pair_tail(currentData);
  };
  console.log(currentData, convertedData);
  if (currentData.type !== DataType.EMPTY_LIST) {
    throw new EvaluatorRuntimeError(`${add_fields_to_data.name}: Expected list of pairs, got ${currentData}`);
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

// /**
//  * Visualizes the sound on a 2d line graph
//  * @param sound the sound which is to be visualized on plotly
//  */
// export function draw_sound_2d(sound: Sound, display: (data: Omit<PlotlyRenderMessage, 'type'>) => Promise<void>): void {
//   const FS: number = 44100; // Output sample rate
//   if (!is_sound(sound)) {
//     throw new InvalidParameterTypeError('sound', sound, draw_sound_2d.name);
//     // If a sound is already displayed, terminate execution.
//   } else if (get_duration(sound) < 0) {
//     throw new EvaluatorRuntimeError(`${draw_sound_2d.name}: duration of sound is negative`);
//   } else {
//     // Instantiate audio context if it has not been instantiated.
//     // Create mono buffer
//     const channel: number[] = [];
//     const time_stamps: number[] = [];
//     const len = Math.ceil(FS * get_duration(sound));

//     const wave = get_wave(sound);
//     for (let i = 0; i < len; i += 1) {
//       time_stamps[i] = i / FS;
//       channel[i] = callWithoutMetadata(wave, i / FS);
//     }

//     const x_s: number[] = [];
//     const y_s: number[] = [];

//     for (let i = 0; i < channel.length; i += 1) {
//       x_s.push(time_stamps[i]);
//       y_s.push(channel[i]);
//     }

//     const plotlyData: Data = {
//       x: x_s,
//       y: y_s
//     };
//     const plot = new CurvePlot(
//       {
//         ...plotlyData,
//         type: 'scattergl',
//         mode: 'lines',
//         line: { width: 0.5 }
//       } as Data,
//       {
//         xaxis: {
//           type: 'linear',
//           title: {
//             text: 'Time'
//           },
//           anchor: 'y',
//           position: 0,
//           rangeslider: { visible: true }
//         },
//         yaxis: {
//           type: 'linear',
//           visible: false
//         },
//         bargap: 0.2,
//         barmode: 'stack'
//       }
//     );
//     display(plot.toSerialized());
//   }
// }
