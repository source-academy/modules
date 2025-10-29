import type { ReplResult } from '@sourceacademy/modules-lib/types';
import type { Pair } from 'js-slang/dist/stdlib/list';

/**
 * A function that is passed the row and column numbers of the cell that was clicked
 * on, its current value and if it was a right or left click.
 */
export type CellCallback = (row: number, col: number, currentValue: boolean, click: 'left' | 'right') => void;

/**
 * Representation of a 2D matrix of values
 */
export interface Matrix extends ReplResult {
  name: string | undefined;

  /**
   * Values of the matrix. Should be indexed as values[row][col].
   */
  values: boolean[][];

  /**
   * Button labels for the matrix. Should be indexed as labels[row][col].
   */
  labels: string[][];

  /**
   * Number of rows
   */
  readonly rows: number;

  /**
   * Number of columns
   */
  readonly cols: number;

  toReplString: () => string;

  buttons: Pair<string, () => void>[];
  onCellClick?: CellCallback;
  onColClick?: (col: number, value: boolean) => void;
  onRowClick?: (row: number, value: boolean) => void;
};

export interface MatrixModuleState {
  matrices: Matrix[];
};
