/*
  Support for CS1101S Mission 15
  Sound mission - Tone Matrix

  Author:
  v1 (2014/2015) Su Xuan - September 2014

  Modifier:
  v2 (2016/2017) Xiao Pu - September 2016 - fit source academy IDE
*/

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { List } from './types';
import { list_to_vector, vector_to_list } from './list';

export const ToneMatrix = {
  initialise_matrix,
  clear_matrix,
  randomise_matrix,
  bindMatrixButtons,
};

let $tone_matrix: HTMLCanvasElement; // canvas container for tone matrix

const color_white: string = '#ffffff'; // color of the highlighted square
const color_white_2: string = '#666666'; // color of the adjacent squares
const color_white_3: string = '#444444'; // color of the squares that are two units from the highlighted square
const color_on: string = '#cccccc';
const color_off: string = '#333333';

// the side length of the squares in the matrix
const square_side_length: number = 18;

// the distance between two adjacent squares in the matrix
const distance_between_squares: number = 6;

// margin of the canvas
const margin_length: number = 20;

// the duration for playing one grid is 0.5s
const grid_duration: number = 0.5;
// but the duration for playing one entire sound is 1 (which means there will be reverberations)
const sound_duration: number = 1;

let matrix: boolean[][];
let timeout_objects: number[] = []; // set_timeout_renamed return type

// given the x, y coordinates of a "click" event
// return the row and column numbers of the clicked square in an array
function x_y_to_row_column(x: number, y: number): number[] {
  const row = Math.floor(
    (y - margin_length) / (square_side_length + distance_between_squares),
  );
  const column = Math.floor(
    (x - margin_length) / (square_side_length + distance_between_squares),
  );
  return [row, column];
}

// given the row number of a square, return the leftmost coordinate
function row_to_y(row: number): number {
  return margin_length + row * (square_side_length + distance_between_squares);
}

// given the column number of a square, return the topmost coordinate
function column_to_x(column: number): number {
  return (
    margin_length + column * (square_side_length + distance_between_squares)
  );
}

// return a list representing a particular row
function get_row(row: number): List {
  return vector_to_list(matrix[row]);
}

// return a list representing a particular column
function get_column(column: number): List {
  const result = new Array(16);
  for (let i = 15; i >= 0; i--) {
    result[i] = matrix[i][column];
  }
  return vector_to_list(result);
}

function is_on(row: number, column: number): boolean | undefined {
  if (row < 0 || row > 15 || column < 0 || column > 15) {
    return undefined;
  }
  return matrix[row][column];
}

// set the color of a particular square
function set_color(row: number, column: number, color: string): void {
  if (row < 0 || row > 15 || column < 0 || column > 15) {
    return;
  }

  const ctx = $tone_matrix.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = color;

  ctx.fillRect(
    column_to_x(column),
    row_to_y(row),
    square_side_length,
    square_side_length,
  );
}

// highlight a given square
function highlight_color(row: number, column: number, color: string): void {
  set_color(row, column, color);
}

// given the square that we are supposed to highlight, color the neighboring squares
function set_adjacent_color_1(
  row: number,
  column: number,
  color: string,
): void {
  if (!is_on(row, column - 1)) {
    set_color(row, column - 1, color);
  }

  if (!is_on(row, column + 1)) {
    set_color(row, column + 1, color);
  }

  if (!is_on(row - 1, column)) {
    set_color(row - 1, column, color);
  }

  if (!is_on(row + 1, column)) {
    set_color(row + 1, column, color);
  }
}

// given the square that we are supposed to highlight, color the squares 2 units from it
function set_adjacent_color_2(
  row: number,
  column: number,
  color: string,
): void {
  if (!is_on(row, column - 2)) {
    set_color(row, column - 2, color);
  }

  if (!is_on(row + 1, column - 1)) {
    set_color(row + 1, column - 1, color);
  }

  if (!is_on(row + 2, column)) {
    set_color(row + 2, column, color);
  }

  if (!is_on(row + 1, column + 1)) {
    set_color(row + 1, column + 1, color);
  }

  if (!is_on(row, column + 2)) {
    set_color(row, column + 2, color);
  }

  if (!is_on(row - 1, column + 1)) {
    set_color(row - 1, column + 1, color);
  }

  if (!is_on(row - 2, column)) {
    set_color(row - 2, column, color);
  }

  if (!is_on(row - 1, column - 1)) {
    set_color(row - 1, column - 1, color);
  }
}

// redraw a matrix according to the current state of the matrix
function redraw_matrix(): void {
  for (let i = 15; i >= 0; i--) {
    for (let j = 15; j >= 0; j--) {
      if (matrix[i][j]) {
        set_color(i, j, color_on);
      } else {
        set_color(i, j, color_off);
      }
    }
  }
}

function initialise_matrix($container: HTMLElement): void {
  if (!$tone_matrix) {
    $tone_matrix = document.createElement('canvas');
    $tone_matrix.width = 420;
    $tone_matrix.height = 420;
    // the array representing the configuration of the matrix
    matrix = new Array(16);

    // the visualisation of the matrix itself
    const ctx = $tone_matrix.getContext('2d') as CanvasRenderingContext2D;

    // draw the initial matrix
    for (let i = 15; i >= 0; i--) {
      matrix[i] = new Array(16);
      for (let j = 15; j >= 0; j--) {
        set_color(i, j, color_off);
        matrix[i][j] = false;
      }
    }

    bind_events_to_rect($tone_matrix);
  }
  $tone_matrix.hidden = false;
  $container.appendChild($tone_matrix);
}

ToneMatrix.initialise_matrix = initialise_matrix;

// bind the click events to the matrix
function bind_events_to_rect(c) {
  c.addEventListener(
    'click',
    (event) => {
      // calculate the x, y coordinates of the click event
      const rect = c.getBoundingClientRect();
      const offset_top = rect.top + document.documentElement.scrollTop;
      const offset_left = rect.left + document.documentElement.scrollLeft;
      const x = event.pageX - offset_left;
      const y = event.pageY - offset_top;

      // obtain the row and column numbers of the square clicked
      const row_column = x_y_to_row_column(x, y);
      const row = row_column[0];
      const column = row_column[1];

      if (row < 0 || row > 15 || column < 0 || column > 15) {
        return;
      }

      if (matrix[row][column] === undefined || !matrix[row][column]) {
        matrix[row][column] = true;
        set_color(row, column, color_on);
      } else {
        matrix[row][column] = false;
        set_color(row, column, color_off);
      }
    },
    false,
  );
}

function random_animate(): void {
  for (let i = 5; i >= 0; i--) {
    const row = Math.floor(Math.random() * 16);
    const column = Math.floor(Math.random() * 16);
    if (!is_on(row, column)) {
      set_color(row, column, color_white_3);
    }
  }

  for (let j = 10; j >= 0; j--) {
    const row = Math.floor(Math.random() * 16);
    const column = Math.floor(Math.random() * 16);
    if (!is_on(row, column)) {
      set_color(row, column, color_off);
    }
  }
}

function animate_column(n: number): void {
  if (n < 0 || n > 15) {
    return;
  }

  const column = list_to_vector(get_column(n));

  for (let j = 0; j <= 15; j++) {
    if (column[j]) {
      // if a particular square is clicked, highlight itself
      // and the neighboring squares in the animation
      highlight_color(j, n, color_white);
      set_adjacent_color_1(j, n, color_white_2);
      set_adjacent_color_2(j, n, color_white_3);
    }
  }
}

function unanimate_column(n: number): void {
  if (n < 0 || n > 15) {
    return;
  }

  const column = list_to_vector(get_column(n));

  for (let j = 0; j <= 15; j++) {
    if (column[j]) {
      highlight_color(j, n, color_on);
      set_adjacent_color_1(j, n, color_off);
      set_adjacent_color_2(j, n, color_off);
    }
  }
}

// generate a randomised matrix
function randomise_matrix(): void {
  const ctx = $tone_matrix.getContext('2d');
  let on: boolean; // the square in the matrix is on or off

  clear_matrix();
  // draw the randomised matrix
  for (let i = 15; i >= 0; i--) {
    for (let j = 15; j >= 0; j--) {
      on = Math.random() > 0.9;
      if (on) {
        set_color(i, j, color_on);
        matrix[i][j] = true;
      } else {
        set_color(i, j, color_off);
        matrix[i][j] = false;
      }
    }
  }
}

ToneMatrix.randomise_matrix = randomise_matrix;

function bindMatrixButtons() {
  const clear = document.getElementById('clear-matrix');
  if (clear) {
    clear.addEventListener('click', () => {
      clear_matrix();
      const play = document.getElementById('play-matrix');
      if (play) {
        play.setAttribute('value', 'Play');
      }
    });
  }
}
ToneMatrix.bindMatrixButtons = bindMatrixButtons;

// ********** THE FOLLOWING FUNCTIONS ARE EXPOSED TO STUDENTS **********
// return the current state of the matrix, represented by a list of lists of bits
export function get_matrix(): List {
  if (!matrix) {
    throw new Error(
      'Please activate the tone matrix first by clicking on the tab!',
    );
  }
  const matrix_list = matrix.slice(0);
  const result: List[] = [];
  for (let i = 0; i <= 15; i++) {
    result[i] = vector_to_list(matrix_list[15 - i]);
  }

  return vector_to_list(result);
}

// reset the matrix to the initial state
export function clear_matrix() {
  matrix = new Array(16);
  const ctx = $tone_matrix.getContext('2d');

  // draw the initial matrix
  for (let i = 15; i >= 0; i--) {
    matrix[i] = new Array(16);
    for (let j = 15; j >= 0; j--) {
      set_color(i, j, color_off);
      matrix[i][j] = false;
    }
  }
}

ToneMatrix.clear_matrix = clear_matrix;

const set_time_out_renamed = window.setTimeout;

export function set_timeout(f, t) {
  if (typeof f === 'function' && typeof t === 'number') {
    const timeoutObj = set_time_out_renamed(f, t);
    timeout_objects.push(timeoutObj);
  } else {
    throw new Error(
      'set_timeout(f, t) expects a function and a number respectively.',
    );
  }
}

export function clear_all_timeout() {
  for (let i = timeout_objects.length - 1; i >= 0; i--) {
    clearTimeout(timeout_objects[i]);
  }

  timeout_objects = [];
}
