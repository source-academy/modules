/**
 * The module `plotly` provides functions for drawing plots using the plotly.js library.
 * @module plotly
 */

import { context } from 'js-slang/moduleHelpers';
import Plotly, { Data } from 'plotly.js-dist';
import { Data_Transformer, DrawnPlot, ListOfPairs } from './plotly';

const drawnPlots: (DrawnPlot)[] = [];
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
 * @param data The data in the form of list of pair which is used to generate the plot
 */
export function new_plot(data: ListOfPairs): void {
  drawnPlots.push(new DrawnPlot(draw_new_plot, data));
}


/**
 * Rotates the given 2d points in data about the point given with the given angle
 * @param data 2d array of data points to be rotated
 * @param angle the angle with which to rotate the points given in data
 * @param point the point about which the data is to be rotated
 * @returns the rotated data points
 */
export function rotate_around_point_2d(angle: number,  point: number[]): Data_Transformer {
  return (data) => {
    const transformation = (dt: number[][]) => {      
        const rotated_data = data.map((cur_data:number[]) => {
          if(cur_data.length == 2) {
            const nx = (cur_data[0]-point[0]) * Math.cos(angle) - (cur_data[1]-point[1]) * Math.sin(angle) + point[0];
            const ny = (cur_data[1] - point[1]) * Math.cos(angle) + (cur_data[0] - point[0]) * Math.sin(angle) + point[1];
            return [nx,ny]
          } else {
            throw new Error("Invalid input type, make sure to have 2d data points" + cur_data);
          }
        })
        return rotated_data;
     
      
    }
    return transformation(data);
  }
}


/**
 * Merge the 2d data points
 * @param points_1 
 * @param points_2 
 * @returns 
 */
export function combine_2d_points(points_1: number[][], points_2: number[][]) {
  return [...points_1, ...points_2];
}

/**
 * Reflect point p along line through points p0 and p1
 * @param point_1_in_line first point for reflection line
 * @param point_2_in_line second point for reflection line
 * @return reflected_data about the line
 */
export function reflect_along_line( point_1_in_line: number[], point_2_in_line: number[]): Data_Transformer { 
  return (data) => {
    const transformation = (dt: number[][]) => {
      const dx = point_1_in_line[0] - point_2_in_line[0];
      const dy = point_1_in_line[1] - point_2_in_line[1];
      const slope = dy/dx;
      const y_intercept = point_1_in_line[1] - slope * point_1_in_line[0];
      const reflected_data = data.map((cur_data: number[]) => {
        const nx = ((1 - slope**2) * cur_data[0] + 2 * slope * (cur_data[1] - y_intercept)) / (1 + slope**2);
        const ny = (2 * slope * cur_data[0] + (slope**2 - 1) * cur_data[1] + 2 * y_intercept) / (1 + slope**2);
        return [nx, ny];
      })
      return reflected_data;
    }
    return transformation(data);
  }
}

/**
 * Scale the values in the given data
 * @param data points to scale
 * @param value value by which to scale
 * @returns the scaled down value;
 */
export function scale_2d(x:number, y:number): Data_Transformer {
  return (data) => {
    const transformation = (dt: number[][]) => {
      return dt.map((cur_data) => {
        return [cur_data[0]*x, cur_data[1]*y];
      })
    }
    return transformation(data);
  }
}

export function translate(dx:number, dy:number): Data_Transformer {
  return (data) => {
    const transformation = (dt: number[][]) => {
      return dt.map((cur_data) => {
        return [cur_data[0]+dx, cur_data[1]+dy];
      })
    }
    return transformation(data);
  }
}

export function convert_list_to_array(data: any) {
  let array: any = [];
  let cur_data = data;
  let i = 0;
  while(cur_data && cur_data.length == 2) {
    i+=1;
    array.push(cur_data[0]);
    cur_data = cur_data[1];
  }
  return array;
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
