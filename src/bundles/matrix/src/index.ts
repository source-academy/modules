/**
 * Support for CS1101S Mission 15, Sound mission - Tone Matrix: a 16x16 grid the student clicks to
 * compose a pattern, then plays back themselves by reading `get_matrix()` and sequencing through
 * columns with py-slang's built-in `set_timeout()`, calling `sound` module functions for whichever
 * cells are lit. This module only owns the grid state itself (`get_matrix`/`clear_matrix`); scheduling
 * is not matrix-specific, so it is left to the language builtin rather than reimplemented here.
 * Clicking a square is purely visual (toggle + redraw) and never touches this module at all - see
 * the Matrix tab, which owns the grid state and canvas rendering (DOM access only works on
 * the browser main thread, not inside Conductor's runner Worker).
 *
 * @module matrix
 * @author Samyukta Sounderraman
 */
import { makeRpc, type IChannel, type IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';

import { matrixToConductorList } from './functions';
import { MATRIX_CHANNEL_ID, MATRIX_TAB_NAME, type MatrixTabRpc } from './protocol';

type MatrixTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

export default class MatrixModulePlugin extends BaseModulePlugin {
  id = 'matrix';
  override exportedNames = ['get_matrix', 'clear_matrix'] as const;
  static override channelAttach = [MATRIX_CHANNEL_ID];

  private readonly __io: MatrixTabRpc;
  private readonly __tabLoader: MatrixTabLoader | undefined;
  private __tabLoaded = false;

  constructor(
    conduit: IConduit,
    [channel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader?: MatrixTabLoader
  ) {
    if (!channel) {
      // An internal invariant check (Conductor's own registration guarantees this channel is
      // always provided), not a student-facing runtime error - the throw-runtime-error rule
      // doesn't yet recognise Conductor's own error types (RuntimeSourceError is a js-slang type),
      // so there's no error class available here that would actually satisfy it.
      // eslint-disable-next-line @sourceacademy/throw-runtime-error
      throw new Error('Matrix channel is required but was not provided.');
    }
    super(conduit, [channel], evaluator);
    this.__tabLoader = tabLoader;
    // The tab is the web plugin holding the actual grid state and canvas: it does the actual DOM
    // work (only available on the browser main thread, not inside this runner's Worker) and
    // replies over the same channel via Conductor's RPC helper.
    this.__io = makeRpc<Record<string, never>, MatrixTabRpc>(channel, {});
  }

  /**
   * Loads the host-side tab, lazily - only the first time a host-bridged function (get_matrix/
   * clear_matrix) is actually called, matching `sound`'s pattern. Without this, nothing ever tells
   * the host to construct the Matrix tab plugin, and __io's RPC calls hang forever waiting
   * for a reply from a tab that was never loaded.
   */
  private __ensureTabLoaded(): void {
    if (this.__tabLoaded || this.__tabLoader === undefined) return;
    if (!this.__tabLoader.tabs.includes(MATRIX_TAB_NAME)) return;

    this.__tabLoader.loadTab(MATRIX_TAB_NAME);
    this.__tabLoaded = true;
  }

  /**
   * Returns the current values of the tone matrix as a list of lists of boolean values, such
   * that `list_ref(list_ref(get_matrix(), my_row), my_column)` evaluates to `true` if the matrix
   * currently is ticked in row `my_row` and column `my_column`, and `false` otherwise. Rows are
   * counted starting with 0 from the bottom of the matrix, and columns starting with 0 from the
   * left.
   * @returns a list of 16 lists of 16 booleans
   * @function
   */
  // moduleMethod requires an async generator (it drives closure-taking methods via yield* for
  // CSE-machine stepping), but this one never touches a user closure, so it has nothing to yield.
  @moduleMethod([], DataType.LIST)
  async* get_matrix(): AsyncGenerator<void, TypedValue<DataType.LIST>, undefined> {
    this.__ensureTabLoaded();
    const matrix = await this.__io.getMatrix();
    return matrixToConductorList(this.evaluator, matrix);
  }

  /**
   * Resets the tone matrix, clearing every ticked square.
   * @function
   */
  @moduleMethod([], DataType.VOID)
  async* clear_matrix(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    await this.__io.clearMatrix();
    return { type: DataType.VOID, value: undefined };
  }
}
