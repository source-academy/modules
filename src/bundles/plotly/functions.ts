/**
 * The module `plotly` provides functions for drawing plots using the plotly.js library.
 * @module plotly
 */


import { context } from 'js-slang/moduleHelpers';
import Plotly, { Data } from 'plotly.js-dist';
import { DrawnPlot } from './plotly';

const drawnPlots: (DrawnPlot)[] = [];
context.moduleContexts.plotly.state = {
  drawnPlots,
};

/**
 * Adds a new plotly plot to the context which will be rendered in the Plotly Tabs
 * @param data The data in the form of list of pair which is used to generate the plot
 */

export function new_plot(data: any): void {
  drawnPlots.push(new DrawnPlot(draw_new_plot, data));
}


/**
 * 
 * @param data The data which plotly will use
 * @param divId The id of the div element on which the plot will be displayed
 */
function draw_new_plot(data: any, divId: string) {
  const plotlyData = convert_to_plotlyData(data);
  Plotly.newPlot(divId, [plotlyData]);
}


/**
 * 
 * @param data The list of pairs given by the user
 * @returns The converted data that can be used by the plotly.js function
 */
function convert_to_plotlyData(data: any): Data {
  let convertedData: Data = {};
  if (Array.isArray(data) && data.length == 2) {
    add_fields_to_data(convertedData, data);
  }
  return convertedData;
}

/**
 * 
 * @param convertedData Stores the Javascript object which is used by plotly.js
 * @param data The list of pairs data used by source
 */

function add_fields_to_data(convertedData: Data, data: any[]) {
  if (Array.isArray(data) && data.length == 2 && data[0].length == 2) {
    const field = data[0][0];
    const value = data[0][1];
    convertedData[field] = value;
    add_fields_to_data(convertedData, data[1]);
  } 
}

