import context from 'js-slang/context';
import { throwIfNotMatrix } from './functions';
import type { Matrix } from './types';

const matrices: Matrix[] = [];
context.moduleContexts.matrix.state = {
  matrices,
};

/**
 * Display the given matrix in the tab. Note that multiple calls
 * of `display_matrix` with the same matrix will only spawn that matrix
 * once in the tab.\
 * For example:
 * ```ts
 *  const mat = create_matrix(10, 10);
 *  for (let i = 0; i < 5; i++) {
 *    display_matrix(mat); // Multiple for loop calls are ignored
 *  }
 *
 *  const mat2 = mat; // mat2 is just a reference
 *  display_matrix(mat2);
 * ```
 * will altogether only cause `mat` to be displayed once in the tab
 * @param matrix Matrix to display
 * @returns `true` if the matrix was successfully displayed, and
 * `false` if the matrix was already displayed
 */
export function display_matrix(matrix: Matrix): boolean {
  throwIfNotMatrix(matrix, display_matrix.name);

  if (!matrices.includes(matrix)) {
    matrices.push(matrix);
    return true;
  }
  return false;
}
