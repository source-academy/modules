/**
 * The module `plotly` provides functions for drawing plots using the plotly.js library.
 * @module plotly
 */

import context from 'js-slang/context';
import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import {
  type Curve,
  type CurvePlot,
  type CurvePlotFunction,
  DrawnPlot,
  type ListOfPairs,
} from './plotly';
import { generatePlot } from './curve_functions';

const drawnPlots: (DrawnPlot | CurvePlot)[] = [];
context.moduleContexts.plotly.state = {
  drawnPlots,
};

/**
 * Adds a new plotly plot to the context which will be rendered in the Plotly Tabs
 * @example
 * ```typescript
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
 *  ];
 *  new_plot(list(pair("z", z1), pair("type", "surface"))) // creates a surface plot in Plotly Tab
 * ```
 *
 *
 * @Types
 * ``` typescript
 * // The data format for input [{field_name}, value] from among the following fields
 *  data = {
 *    type: PlotType;
 *    x: Datum[] | Datum[][];
 *    y: Datum[] | Datum[][];
 *    z: Datum[] | Datum[][] | Datum[][][];
 *    mode:
 *       | 'lines'
 *       | 'markers'
 *       | 'text'
 *       | 'lines+markers'
 *       | 'text+markers'
 *       | 'text+lines'
 *       | 'text+lines+markers'
 *  }
 *
 *
 *  type Datum = string | number | Date | null;
 *  type PlotType =
 *  | 'bar'
 *  | 'barpolar'
 *  | 'box'
 *  | 'candlestick'
 *  | 'carpet'
 *  | 'choropleth'
 *  | 'choroplethmapbox'
 *  | 'cone'
 *  | 'contour'
 *  | 'contourcarpet'
 *  | 'densitymapbox'
 *  | 'funnel'
 *  | 'funnelarea'
 *  | 'heatmap'
 *  | 'heatmapgl'
 *  | 'histogram'
 *  | 'histogram2d'
 *  | 'histogram2dcontour'
 *  | 'image'
 *  | 'indicator'
 *  | 'isosurface'
 *  | 'mesh3d'
 *  | 'ohlc'
 *  | 'parcats'
 *  | 'parcoords'
 *  | 'pie'
 *  | 'pointcloud'
 *  | 'sankey'
 *  | 'scatter'
 *  | 'scatter3d'
 *  | 'scattercarpet'
 *  | 'scattergeo'
 *  | 'scattergl'
 *  | 'scattermapbox'
 *  | 'scatterpolar'
 *  | 'scatterpolargl'
 *  | 'scatterternary'
 *  | 'splom'
 *  | 'streamtube'
 *  | 'sunburst'
 *  | 'surface'
 *  | 'table'
 *  | 'treemap'
 *  | 'violin'
 *  | 'volume'
 *  | 'waterfall';
 *
 * ```
 * @param data The data in the form of list of pair, with the first term in the pair is
 *             the name of the field as a string and the second term is the value of the field
 *             among the fields mentioned above
 */
export function new_plot(data: ListOfPairs): void {
  drawnPlots.push(new DrawnPlot(draw_new_plot, data));
}


/**
 * Adds a new plotly plot to the context which will be rendered in the Plotly Tabs
 * @example
 * ```typescript
 *
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
 *  ];
 *
 * let z2 = [];
 * for (var i=0;i<z1.length;i++ ) {
 *   let z2_row = [];
 *     for(var j=0;j<z1[i].length;j++) {
 *       z2_row.push(z1[i][j]+1);
 *     }
 *     z2.push(z2_row);
 * }
 * const data = [{z: z1, type: 'surface'}, {z: z2 , type: 'surface'}];
 * new_plot_json(data) // creates a surface plot in Plotly Tab
 *
 *
 *
 * ```
 *
 *
 * @Types
 * ``` typescript
 * // The data format for input [{field_name}, value] from among the following fields
 *  data = {
 *    type: PlotType;
 *    x: Datum[] | Datum[][];
 *    y: Datum[] | Datum[][];
 *    z: Datum[] | Datum[][] | Datum[][][];
 *    mode:
 *       | 'lines'
 *       | 'markers'
 *       | 'text'
 *       | 'lines+markers'
 *       | 'text+markers'
 *       | 'text+lines'
 *       | 'text+lines+markers'
 *  }[]
 *
 *
 *  type Datum = string | number | Date | null;
 *  type PlotType =
 *  | 'bar'
 *  | 'barpolar'
 *  | 'box'
 *  | 'candlestick'
 *  | 'carpet'
 *  | 'choropleth'
 *  | 'choroplethmapbox'
 *  | 'cone'
 *  | 'contour'
 *  | 'contourcarpet'
 *  | 'densitymapbox'
 *  | 'funnel'
 *  | 'funnelarea'
 *  | 'heatmap'
 *  | 'heatmapgl'
 *  | 'histogram'
 *  | 'histogram2d'
 *  | 'histogram2dcontour'
 *  | 'image'
 *  | 'indicator'
 *  | 'isosurface'
 *  | 'mesh3d'
 *  | 'ohlc'
 *  | 'parcats'
 *  | 'parcoords'
 *  | 'pie'
 *  | 'pointcloud'
 *  | 'sankey'
 *  | 'scatter'
 *  | 'scatter3d'
 *  | 'scattercarpet'
 *  | 'scattergeo'
 *  | 'scattergl'
 *  | 'scattermapbox'
 *  | 'scatterpolar'
 *  | 'scatterpolargl'
 *  | 'scatterternary'
 *  | 'splom'
 *  | 'streamtube'
 *  | 'sunburst'
 *  | 'surface'
 *  | 'table'
 *  | 'treemap'
 *  | 'violin'
 *  | 'volume'
 *  | 'waterfall';
 *
 * ```
 * @param data The data as an array of json objects having some or all of the given fields
 */
export function new_plot_json(data: any): void {
  drawnPlots.push(new DrawnPlot(draw_new_plot_json, data));
}


/**
 * @param data The data which plotly will use
 * @param divId The id of the div element on which the plot will be displayed
 */
function draw_new_plot(data: ListOfPairs, divId: string) {
  const plotlyData = convert_to_plotly_data(data);
  Plotly.newPlot(divId, [plotlyData]);
}

/**
 *
 * @param data The data object in json to be used by plotly
 * @param divId The id of the div element on which the plot will be displayed
 */
function draw_new_plot_json(data: any, divId: string) {
  Plotly.newPlot(divId, data);
}

/**
 * @param data The list of pairs given by the user
 * @returns The converted data that can be used by the plotly.js function
 */
function convert_to_plotly_data(data: ListOfPairs): Data {
  let convertedData: Data = {};
  if (Array.isArray(data) && data.length === 2) {
    add_fields_to_data(convertedData, data);
  }
  return convertedData;
}

/**
 * @param convertedData Stores the Javascript object which is used by plotly.js
 * @param data The list of pairs data used by source
 */

function add_fields_to_data(convertedData: Data, data: ListOfPairs) {
  if (Array.isArray(data) && data.length === 2 && data[0].length === 2) {
    const field = data[0][0];
    const value = data[0][1];
    convertedData[field] = value;
    add_fields_to_data(convertedData, data[1]);
  }
}

function createPlotFunction(
  type: string,
  config: Data,
  layout: Partial<Layout>,
  is_colored: boolean = false,
): (numPoints: number) => CurvePlotFunction {
  return (numPoints: number) => {
    const func = (curveFunction: Curve) => {
      const plotDrawn = generatePlot(
        type,
        numPoints,
        config,
        layout,
        is_colored,
        curveFunction,
      );

      drawnPlots.push(plotDrawn);
      return plotDrawn;
    };

    return func;
  };
}

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points and connecting each pair with a line.
 * The parts between (0,0) and (1,1) of the resulting Drawing are shown in the window.
 *
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @return function of type Curve → Drawing
 * @example
 * ```
 * draw_connected(100)(t => make_point(t, t));
 * ```
 */
export const draw_connected_2d = createPlotFunction(
  'scatter',
  { mode: 'lines' },
  {
    xaxis: { visible: false },
    yaxis: {
      visible: false,
      scaleanchor: 'x',
    },
  },

);

export const draw_3D_points = createPlotFunction(
  'scatter3d',
  { mode: 'markers' },
  {

  },
  true,
);
