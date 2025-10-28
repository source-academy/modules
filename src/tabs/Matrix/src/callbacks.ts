import type { CellCallback, Matrix } from '@sourceacademy/bundle-matrix/types';

/**
 * Returns the default row click callback for the given
 * matrix, which sets the row to the opposite of the current row value
 */
export function getDefaultRowCallback(matrix: Matrix) {
  return (row: number, rowValue: boolean) => {
    for (let i = 0; i < matrix.cols; i++) {
      matrix.values[row][i] = !rowValue;
    }
  };
}

/**
 * Returns the default column click callback for the given
 * matrix, which sets the column to the opposite of the
 * current column value
 */
export function getDefaultColCallback(matrix: Matrix) {
  return (col: number, colValue: boolean) => {
    for (let i = 0; i < matrix.cols; i++) {
      matrix.values[i][col] = !colValue;
    }
  };
}

/**
 * Returns the default cell click callback for the given
 * matrix, which sets the cell to the opposite of the current cell value
 */
export function getDefaultCellCallback(matrix: Matrix): CellCallback {
  return (row, col, oldValue) => {
    matrix.values[row][col] = !oldValue;
  };
}
