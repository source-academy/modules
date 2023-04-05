/**
 * A function that is passed the row and column numbers of the cell that changed
 * and its new value.
 */
export type CellCallback = (row: number, col: number, newValue: boolean) => void;

/**
 * Representation of a 2D matrix of boolean values
 */
export type Matrix = {
  values: boolean[][];
  labels: string[][];
  readonly rows: number;
  readonly cols: number;
  toReplString: () => string;

  buttons: [string, () => void][];
  onCellClick?: CellCallback;
  onColClick?: (col: number, value: boolean) => void,
  onRowClick?: (row: number, value: boolean) => void,
};

export type MatrixModuleState = {
  matrices: Matrix[];
  showCellLabels?: boolean;
  showColLabels?: boolean;
};
