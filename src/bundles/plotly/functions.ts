/**
 * This is the official documentation for the plotly module.
 * @module plotly
 */

import { context } from 'js-slang/moduleHelpers';
import Plotly, { Data } from 'plotly.js-dist';
import { BarPlot, DrawnPlot, ScatterPlot } from './plots';

const drawnPlots: (DrawnPlot)[] = [];
context.moduleContexts.plotly.state = {
  drawnPlots,
};

/**
 * Draws a Line Graph on the Plotly Tab
 * @example
 * ```typescript
 * drawLineGraph()
 * ```
 */

export function drawLineGraph(): void {
  drawnPlots.unshift(new BarPlot(demoLineGraphSetup));
}

/**
 * Draws a 3d Graph on the Plotly Tab
 * @example
 * ```typescript
 * drawLineGraph()
 * ```
 */
export function draw3dGraph(): void {
  drawnPlots.unshift(new ScatterPlot(demo3dScatterPlot));
}

function demoLineGraphSetup(): void {
  let trace1: Data = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: 'scatter',
  };

  let trace2: Data = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: 'scatter',
  };

  let data: Data[] = [trace1, trace2];
  Plotly.newPlot('myDiv', data);
}

function demo3dScatterPlot(): void {
  let z1 = [
    [8.83, 8.89, 8.81, 8.87, 8.9, 8.87],
    [8.89, 8.94, 8.85, 8.94, 8.96, 8.92],
    [8.84, 8.9, 8.82, 8.92, 8.93, 8.91],
    [8.79, 8.85, 8.79, 8.9, 8.94, 8.92],
    [8.79, 8.88, 8.81, 8.9, 8.95, 8.92],
    [8.8, 8.82, 8.78, 8.91, 8.94, 8.92],
    [8.75, 8.78, 8.77, 8.91, 8.95, 8.92],
    [8.8, 8.8, 8.77, 8.91, 8.95, 8.94],
    [8.74, 8.81, 8.76, 8.93, 8.98, 8.99],
    [8.89, 8.99, 8.92, 9.1, 9.13, 9.11],
    [8.97, 8.97, 8.91, 9.09, 9.11, 9.11],
    [9.04, 9.08, 9.05, 9.25, 9.28, 9.27],
    [9, 9.01, 9, 9.2, 9.23, 9.2],
    [8.99, 8.99, 8.98, 9.18, 9.2, 9.19],
    [8.93, 8.97, 8.97, 9.18, 9.2, 9.18],
  ];

  let z2: number[][] = [];
  for (let i = 0; i < z1.length; i++) {
    let z2_row: number[] = [];
    for (let j = 0; j < z1[i].length; j++) {
      z2_row.push(z1[i][j] + 1);
    }
    z2.push(z2_row);
  }

  let z3: number[][] = [];
  for (let i = 0; i < z1.length; i++) {
    let z3_row: number[] = [];
    for (let j = 0; j < z1[i].length; j++) {
      z3_row.push(z1[i][j] - 1);
    }
    z3.push(z3_row);
  }
  let data_z1: Data = {
    z: z1,
    type: 'surface',
  };
  let data_z2: Data = {
    z: z2,
    showscale: false,
    opacity: 0.9,
    type: 'surface',
  };
  let data_z3: Data = {
    z: z3,
    showscale: false,
    opacity: 0.9,
    type: 'surface',
  };

  Plotly.newPlot('myDiv', [data_z1, data_z2, data_z3]);
}
