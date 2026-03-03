import { InvalidCallbackError, InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { isFunctionOfLength } from '@sourceacademy/modules-lib/utilities';
import { is_pair, type List } from 'js-slang/dist/stdlib/list';
import clamp from 'lodash/clamp';
import { Matrix, type CellCallback } from './types';

export function throwIfNotMatrix(matrix: unknown, func_name: string, param_name?: string): asserts matrix is Matrix {
  if (!(matrix instanceof Matrix)) {
    throw new InvalidParameterTypeError('Matrix', matrix, func_name, param_name);
  }
}

/**
 * Ensure that user inputs are within the proper bounds
 */
function checkMatrixBounds(func_name: string, matrix: unknown, row: number, col: number): asserts matrix is Matrix {
  throwIfNotMatrix(matrix, func_name);

  if (row < 0 || row >= matrix.rows) {
    throw new Error(`${func_name}: Row index of ${row} out of bounds for matrix of size (${matrix.rows}, ${matrix.cols})`);
  }

  if (col < 0 || col >= matrix.cols) {
    throw new Error(`${func_name}: Column index of ${row} out of bounds for matrix of size (${matrix.rows}, ${matrix.cols}`);
  }
}

/**
 * Maximum number of rows supported
 */
export const MAX_ROWS: number = 256;

/**
 * Maximum number of columns supported
 */
export const MAX_COLS: number = 256;

/**
 * Creates a 2D matrix with the given number of rows and columns
 * @param rows Number of rows between 1 and {@link MAX_ROWS}
 * @param cols Number of columns between 1 and {@link MAX_COLS}
 * @returns Matrix
 */
export function create_matrix(rows: number, cols: number, name: string | undefined): Matrix {
  if (!Number.isInteger(rows)) throw new Error(`${create_matrix.name}: Expected an integer value for rows, got: ${rows}`);
  if (!Number.isInteger(cols)) throw new Error(`${create_matrix.name}: Expected an integer value for columns, got: ${cols}`);

  if (rows < 1 || cols < 1) throw new Error(`${create_matrix.name}: Cannot create a matrix with fewer than 1 row or column!`);
  if (rows > MAX_ROWS) throw new Error(`${create_matrix.name}: Cannot create a matrix with greater than ${MAX_ROWS} rows!`);
  if (cols > MAX_COLS) throw new Error(`${create_matrix.name}: Cannot create a matrix with greater than ${MAX_COLS} columns!`);

  if (name !== undefined && typeof name !== 'string') {
    throw new InvalidParameterTypeError('string or undefined', name, create_matrix.name, 'name');
  }

  const values: boolean[][] = new Array(rows);
  const labels: string[][] = new Array(rows);

  for (let i = 0; i < rows; i++) {
    values[i] = new Array(cols);
    labels[i] = new Array(cols);

    for (let j = 0; j < cols; j++) {
      values[i][j] = false;
      labels[i][j] = '';
    }
  }

  return new Matrix(
    name,
    values,
    labels,
    rows,
    cols,
    [],
  );
}

/**
 * Creates a copy of an existing matrix. The copy will not have the existing's registered buttons
 * or callbacks. Its name will be the name of the existing matrix with "Copy" appended if the
 * original had a name.
 *
 * @param matrix Matrix to copy
 * @returns A new matrix with the same values and labels as the first
 */
export function copy_matrix(matrix: Matrix): Matrix {
  throwIfNotMatrix(matrix, copy_matrix.name);

  const values = new Array(matrix.rows);
  const labels = new Array(matrix.cols);

  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.cols; j++) {
      values[i] = [...matrix.values[i]];
      labels[i] = [...matrix.labels[i]];
    }
  }

  return new Matrix(
    matrix.name !== undefined ? `${matrix.name} Copy` : undefined,
    values,
    labels,
    matrix.rows,
    matrix.cols,
    [],
  );
}

/**
 * Set all the values in the matrix to the given boolean value
 *
 * @param matrix Matrix to fill
 * @param value New value for all cells
 */
export function fill_matrix(matrix: Matrix, value: boolean): void {
  throwIfNotMatrix(matrix, fill_matrix.name);

  if (typeof value !== 'boolean') {
    throw new InvalidParameterTypeError('boolean', value, fill_matrix.name);
  }

  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.cols; j++) matrix.values[i][j] = value;
  }
}

/**
 * Set all the values in the matrix to `false`
 * @param matrix Matrix to clear
 */
export function clear_matrix(matrix: Matrix): void {
  fill_matrix(matrix, false);
}

/**
 * Get the value of the cell at the specified column and row indices
 * @param matrix Matrix to index
 * @param row Row index of cell
 * @param col Column index of cell
 * @returns Boolean value of cell
 */
export function get_cell_value(matrix: Matrix, row: number, col: number): boolean {
  checkMatrixBounds(get_cell_value.name, matrix, row, col);
  return matrix.values[row][col];
}

/**
 * Get the label of the cell at the specified column and row indices
 * @param matrix Matrix to index
 * @param row Row index of cell
 * @param col Column index of cell
 * @returns Boolean value of cell
 */
export function get_cell_label(matrix: Matrix, row: number, col: number): string {
  checkMatrixBounds(get_cell_label.name, matrix, row, col);
  return matrix.labels[row][col];
}

/**
 * Get the values in the matrix as a 2D boolean array
 * @param matrix Matrix to retrieve from
 * @returns 2D boolean array representing the values in the matrix
 */
// It is necessary to make a copy of the 2D array, otherwise changes to the array will change
// the values in the matrix
export function get_cell_values(matrix: Matrix): boolean[][] {
  throwIfNotMatrix(matrix, get_cell_values.name);
  return copy_matrix(matrix).values;
}

/**
 * Get the labels of the matrix as a 2D string array
 * @param matrix Matrix to retrieve from
 * @returns 2D string array representing the labels in the matrix
 */
// It is necessary to make a copy of the 2D array, otherwise changes to the array will change
// the values in the matrix
export function get_cell_labels(matrix: Matrix): string[][] {
  throwIfNotMatrix(matrix, get_cell_labels.name);
  return copy_matrix(matrix).labels;
}

/**
 * Retrieve the name of a matrix, or `undefined` if it doesn't have one.
 */
export function get_name(matrix: Matrix): string | undefined {
  throwIfNotMatrix(matrix, get_name.name);
  return matrix.name;
}

/**
 * Retrieve the number of cols in a matrix
 * @param matrix Matrix to check
 * @returns Number of cols in the matrix
 */
export function get_num_cols(matrix: Matrix) {
  throwIfNotMatrix(matrix, get_num_cols.name);
  return matrix.cols;
}

/**
 * Retrieve the number of rows in a matrix
 * @param matrix Matrix to check
 * @returns Number of rows in the matrix
 */
export function get_num_rows(matrix: Matrix) {
  throwIfNotMatrix(matrix, get_num_rows.name);
  return matrix.rows;
}

/**
 * By providing a list containing pairs of strings and functions, the matrix will render
 * each pair as a button with the given text. When the button is clicked its associated function
 * will be executed
 *
 * Calling `install_buttons` multiple times on the same matrix will only preserve the results
 * of the final call.
 * @param matrix Matrix to install buttons on
 * @param list List containing pairs of strings and functions
 * @example
 * ```
 * import { clear_matrix, install_buttons, randomize_matrix } from 'matrix';
 *
 * install_buttons(matrix, list(
 *   pair('Clear', () => clear_matrix(matrix)),
 *   pair('Randomize', () => randomize_matrix(matrix, 0.5))
 * ));
 * ```
 */
export function install_buttons(matrix: Matrix, list: List): void {
  throwIfNotMatrix(matrix, install_buttons.name);

  // Guard against circular lists
  const visited: List[] = [];

  const list_to_array = (lst: List) => {
    if (lst === null || visited.includes(lst)) return [];

    if (!is_pair(lst)) {
      throw new Error(`${install_buttons.name}: Expected a list containing only of pairs of strings and nullary functions`);
    }

    visited.push(lst);

    const [head, tail] = lst;
    // Check the types of the head
    if (typeof head[0] !== 'string' || !isFunctionOfLength(head[1], 0)) {
      throw new Error(`${install_buttons.name}: Expected a list containing only of pairs of strings and nullary functions`);
    }

    return [head, ...list_to_array(tail)];
  };

  matrix.buttons = list_to_array(list);
}

/**
 * Attach a callback that will be executed every time the user clicks on a cell. The callback is passed
 * the row index, column index, current value of the cell as well as the type of click.
 *
 * @param matrix Matrix to attach to
 * @param callback Callback to use
 */
export function on_cell_click(matrix: Matrix, callback: CellCallback): void {
  throwIfNotMatrix(matrix, on_cell_click.name);

  if (!isFunctionOfLength(callback, 4)) {
    throw new InvalidCallbackError(4, callback, on_cell_click.name, 'callback');
  }

  matrix.onCellClick = callback;
}

/**
 * Attach a callback that will be executed every time the user selects/deselects an entire column. The callback
 * is passed the index of the column and the current value of the column.
 *
 * A column is considered selected only if all of the cells in that column are selected.
 *
 * @param matrix Matrix to attach to
 * @param callback Callback to use
 */
export function on_col_click(matrix: Matrix, callback: (col: number, value: boolean) => void) {
  throwIfNotMatrix(matrix, on_col_click.name);

  if (!isFunctionOfLength(callback, 2)) {
    throw new InvalidCallbackError(2, callback, on_col_click.name, 'callback');
  }

  matrix.onColClick = callback;
}

/**
 * Attach a callback that will be executed every time the user selects/deselects an entire row. The callback
 * is passed the index of the row and the current value of the row.
 *
 * A row is considered selected only if all the cells in that row are selected.
 *
 * @param matrix Matrix to attach to
 * @param callback Callback to use
 */
export function on_row_click(matrix: Matrix, callback: (row: number, value: boolean) => void) {
  throwIfNotMatrix(matrix, on_row_click.name);

  if (!isFunctionOfLength(callback, 2)) {
    throw new InvalidCallbackError(2, callback, on_row_click.name, 'callback');
  }

  matrix.onRowClick = callback;
}

/**
 * Randomly fill a matrix with true and false values using the given probability
 * @param matrix Matrix to fill
 * @param probability Probability between 0 and 1 to use
 */
export function randomise_matrix(matrix: Matrix, probability: number): void {
  if (typeof probability !== 'number') {
    throw new Error(`${randomise_matrix.name}: Expected a number between 0 and 1 for probability, got ${probability}`);
  }

  probability = clamp(probability, 0, 1);

  // draw the randomised matrix
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.cols; j++) {
      matrix.values[i][j] = Math.random() > probability;
    }
  }
}

/**
 * {@inheritDoc randomise_matrix}
 */
export const randomize_matrix = Object.defineProperty(randomise_matrix, 'name', { value: 'randomize_matrix' });

/**
 * Set the value of the cell at the specified column and row indices
 * @param matrix Matrix to modify
 * @param row Row index of cell
 * @param col Column index of cell
 * @param value Value to set the cell to
 */
export function set_cell_value(matrix: Matrix, row: number, col: number, value: boolean): void {
  checkMatrixBounds(set_cell_value.name, matrix, row, col);
  if (typeof value !== 'boolean') {
    throw new InvalidParameterTypeError('boolean', value, set_cell_value.name, 'value');
  }

  matrix.values[row][col] = value;
}

/**
 * Set the label of the cell at the specified column and row indices
 * @param matrix Matrix to modify
 * @param row Row index of cell
 * @param col Column index of cell
 * @param label New label for the cell
 */
export function set_cell_label(matrix: Matrix, row: number, col: number, label: string): void {
  checkMatrixBounds(set_cell_label.name, matrix, row, col);
  if (typeof label !== 'string') {
    throw new InvalidParameterTypeError('string', label, set_cell_label.name, 'label');
  }

  matrix.labels[row][col] = label;
}

/**
 * Set the value of all cells in the matrix using the given 2D boolean array. If there are fewer provided values than the size
 * of the matrix, the extra cells' values will not be changed. Extraneous values are ignored.
 * @param matrix Matrix to modify
 * @param values Values to use
 */
export function set_cell_values(matrix: Matrix, values: boolean[][]): void {
  throwIfNotMatrix(matrix, set_cell_values.name);

  for (let i = 0; i < Math.min(matrix.rows, values.length); i++) {
    for (let j = 0; j < Math.min(matrix.cols, values[i].length); j++) {
      if (typeof values[i][j] !== 'boolean') {
        throw new InvalidParameterTypeError('2D boolean array', values, set_cell_values.name);
      }

      matrix.values[i][j] = values[i][j];
    }
  }
}

/**
 * Set the label of all cells in the matrix using the given 2D string array. If there are fewer provided values than the size
 * of the matrix, the extra cells' labels will not be changed. Extraneous values are ignored.
 * @param matrix Matrix to modify
 * @param labels Labels to use
 */
export function set_cell_labels(matrix: Matrix, labels: string[][]): void {
  throwIfNotMatrix(matrix, set_cell_labels.name);

  for (let i = 0; i < Math.min(matrix.rows, labels.length); i++) {
    for (let j = 0; j < Math.min(matrix.cols, labels[i].length); j++) {
      if (typeof labels[i][j] !== 'string') {
        throw new InvalidParameterTypeError('2D string array', labels, set_cell_labels.name);
      }

      matrix.labels[i][j] = labels[i][j];
    }
  }
}

/**
 * Sets the name of the provided matrix to the provided string value. If `undefined`
 * is provided, the name of the matrix is removed.
 */
export function set_matrix_name(matrix: Matrix, name: string | undefined): void {
  throwIfNotMatrix(matrix, set_matrix_name.name);
  if (name !== undefined && typeof name !== 'string') {
    throw new InvalidParameterTypeError('string or undefined', name, set_matrix_name.name, 'name');
  }

  matrix.name = name;
}
