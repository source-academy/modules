/**
 * Module for displaying and working with an interactive matrix.
 *
 * Use `create_matrix()` to create a matrix of a given size, then use `display_matrix()` to
 * view it in the tab.
 *
 * @module matrix
 * @author Lee Yi
 */

export * from './display';
export * from './functions';
export type { CellCallback as MatrixCallback } from './types';
