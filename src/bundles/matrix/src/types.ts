import type { ReplResult } from '@sourceacademy/modules-lib/types';
import type { Pair } from 'js-slang/dist/stdlib/list';

/**
 * A function that is passed the row and column numbers of the cell that was clicked
 * on, its current value and if it was a right or left click.
 */
export type CellCallback = (row: number, col: number, currentValue: boolean, click: 'left' | 'right') => void;

/**
 * Representation of a 2D matrix of booleans with associated button labels
 * and click callbacks.
 */
export class Matrix implements ReplResult {
  constructor(
    public name: string | undefined,

    /**
     * Values of the matrix. Should be indexed as values[row][col].
     */
    public values: boolean[][],

    /**
     * Button labels for the matrix. Should be indexed as labels[row][col].
     */
    public labels: string[][],

    /**
     * Number of rows
     */
    public readonly rows: number,

    /**
     * Number of columns
     */
    public readonly cols: number,

    public buttons: Pair<string, () => void>[]
  ) {}

  public toReplString(): string {
    return `<Matrix (${this.rows}, ${this.cols})>`;
  }

  public onCellClick?: CellCallback;
  public onColClick?: (col: number, value: boolean) => void;
  public onRowClick?: (row: number, value: boolean) => void;
};

export interface MatrixModuleState {
  matrices: Matrix[];
};
