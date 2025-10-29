/**
 * Module for displaying and working with interactive matrices.
 *
 * Use `create_matrix()` to create a matrix of a given size, then use `display_matrix()` to
 * view it in the tab.
 *
 * A matrix has some default behaviour that you can override with the functions provided
 * in this bundle. For example, a cell is toggled from off to on and from on to off when
 * it is clicked.
 *
 * You can override this behaviour by setting the cell click callback using `on_cell_click`:
 * ```js
 * const matrix = create_matrix(1, 1, 'matrix 1');
 *
 * const callback = (y, x, old) => {
 *   if (y % 2 === 0) {
 *     // only sets changes the value if the cell is on an even row
 *     set_cell_value(y, x, !old);
 *   }
 * };
 *
 * on_cell_click(matrix, callback);
 * ```
 *
 * @module matrix
 * @author Lee Yi
 */

export * from './display';
export * from './functions';
export type { CellCallback as MatrixCallback } from './types';
