export const MATRIX_CHANNEL_ID = 'sourceacademy-matrix-channel';
export const MATRIX_WEB_ID = 'matrix-web';
export const MATRIX_TAB_NAME = 'Matrix';

/**
 * Host-side (browser main thread) operations the matrix module's runner-side plugin invokes
 * over {@link MATRIX_CHANNEL_ID} via Conductor's `makeRpc` helper. The 16x16 grid itself -
 * canvas rendering and click handling - only works on the browser main thread, not inside
 * Conductor's runner Worker, hence the round trip instead of touching the DOM directly from the
 * module. Clicking a square is purely visual (toggle + redraw) and never involves this channel at
 * all - it's handled entirely host-side, with no Worker round trip, matching the original
 * (pre-Conductor) implementation exactly.
 */
export interface MatrixTabRpc {
  /** Returns the current state of the 16x16 grid, row-major (row 0 first), each row 16 booleans. */
  getMatrix(): Promise<boolean[][]>;
  /** Resets every square to off and redraws the grid. */
  clearMatrix(): Promise<void>;
}
