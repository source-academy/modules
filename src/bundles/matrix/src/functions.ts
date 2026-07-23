/**
 * Support for CS1101S Mission 15, Sound mission - Tone Matrix. Ported to Conductor from the
 * original (js-slang-era) implementation - canvas rendering and click handling now live entirely
 * host-side (see the Matrix tab), since the runner Worker has no DOM access; this file only
 * holds the evaluator-free helpers used to bridge Conductor's data model.
 *
 * @module matrix
 * @author Samyukta Sounderraman
 */
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import { mEmptyList } from '@sourceacademy/conductor/util';

/**
 * Converts a row-major boolean grid into a Source list of lists. The tab draws `matrix[0]` at the
 * top of the canvas and `matrix[matrix.length - 1]` at the bottom (see the Matrix tab's
 * `rowToY`), but `get_matrix()` is documented (Quest Q5B) to return row 0 as the *bottom-most* row
 * - matching the original `soundToneMatrix.js`'s `result[i] = matrix_list[15 - i]` flip. Walk the
 * array bottom-up so the returned list's head is the bottom row.
 */
export async function matrixToConductorList(evaluator: IDataHandler, matrix: boolean[][]): Promise<TypedValue<DataType.LIST>> {
  return rowsToConductorList(evaluator, matrix, matrix.length - 1);
}

async function rowsToConductorList(evaluator: IDataHandler, matrix: boolean[][], index: number): Promise<TypedValue<DataType.LIST>> {
  if (index < 0) return mEmptyList();
  const rowList = await rowToConductorList(evaluator, matrix[index], 0);
  return evaluator.pair_make(rowList, await rowsToConductorList(evaluator, matrix, index - 1));
}

async function rowToConductorList(evaluator: IDataHandler, row: boolean[], index: number): Promise<TypedValue<DataType.LIST>> {
  if (index >= row.length) return mEmptyList();
  return evaluator.pair_make(
    { type: DataType.BOOLEAN, value: row[index] },
    await rowToConductorList(evaluator, row, index + 1)
  );
}

/**
 * Fully resolves a generator, discarding intermediate yields. Used for `set_timeout`'s callback,
 * which fires later via the Worker's own native timer - by the time it runs, there's no
 * CSE-machine-driven stepping loop to `yield*` into (unlike a module function called directly from
 * student code), so the closure call is drained to completion instead, matching how the original
 * (pre-Conductor) implementation also ran a `setTimeout` callback as a single, unstepped call.
 */
export async function drainGenerator<T>(generator: AsyncGenerator<void, T, undefined>): Promise<T> {
  let next = await generator.next();
  while (!next.done) {
    next = await generator.next();
  }
  return next.value;
}
