/**
 * Support for CS1101S Mission 15, Sound mission - Tone Matrix: a 16x16 grid the student clicks to
 * compose a pattern, then plays back themselves by reading `get_matrix()` and sequencing through
 * columns with `set_timeout()`, calling `sound` module functions for whichever cells are lit.
 * Clicking a square is purely visual (toggle + redraw) and never touches this module at all - see
 * the SoundMatrix tab, which owns the grid state and canvas rendering (DOM access only works on
 * the browser main thread, not inside Conductor's runner Worker).
 *
 * @module sound_matrix
 * @author Samyukta Sounderraman
 */
import { makeRpc, type IChannel, type IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';

import { drainGenerator, matrixToConductorList } from './functions';
import { SOUND_MATRIX_CHANNEL_ID, type SoundMatrixTabRpc } from './protocol';

type SoundMatrixTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

export default class SoundMatrixModulePlugin extends BaseModulePlugin {
  id = 'sound_matrix';
  override exportedNames = ['get_matrix', 'clear_matrix', 'set_timeout', 'clear_all_timeout'] as const;
  static override channelAttach = [SOUND_MATRIX_CHANNEL_ID];

  private readonly __io: SoundMatrixTabRpc;
  private readonly __timeoutIds = new Set<ReturnType<typeof setTimeout>>();
  private readonly __tabLoader: SoundMatrixTabLoader | undefined;
  private __tabLoaded = false;

  constructor(
    conduit: IConduit,
    [channel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader?: SoundMatrixTabLoader
  ) {
    super(conduit, [channel], evaluator);
    if (!channel) {
      // An internal invariant check (Conductor's own registration guarantees this channel is
      // always provided), not a student-facing runtime error - the throw-runtime-error rule
      // doesn't yet recognise Conductor's own error types (RuntimeSourceError is a js-slang type),
      // so there's no error class available here that would actually satisfy it.
      // eslint-disable-next-line @sourceacademy/throw-runtime-error
      throw new Error('Sound matrix channel is required but was not provided.');
    }
    this.__tabLoader = tabLoader;
    // The tab is the web plugin holding the actual grid state and canvas: it does the actual DOM
    // work (only available on the browser main thread, not inside this runner's Worker) and
    // replies over the same channel via Conductor's RPC helper.
    this.__io = makeRpc<Record<string, never>, SoundMatrixTabRpc>(channel, {});
  }

  /**
   * Loads the host-side tab, lazily - only the first time a host-bridged function (get_matrix/
   * clear_matrix) is actually called, matching `sound`'s pattern. Without this, nothing ever tells
   * the host to construct the SoundMatrix tab plugin, and __io's RPC calls hang forever waiting
   * for a reply from a tab that was never loaded.
   */
  private __ensureTabLoaded(): void {
    if (this.__tabLoaded || this.__tabLoader === undefined) return;

    const tabName = this.__tabLoader.tabs[0];
    if (tabName === undefined) return;

    this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
  }

  // moduleMethod requires an async generator (it drives closure-taking methods via yield* for
  // CSE-machine stepping), but this one never touches a user closure, so it has nothing to yield.
  @moduleMethod([], DataType.LIST)
  // eslint-disable-next-line require-yield
  async* get_matrix(): AsyncGenerator<void, TypedValue<DataType.LIST>, undefined> {
    this.__ensureTabLoaded();
    const matrix = await this.__io.getMatrix();
    return matrixToConductorList(this.evaluator, matrix);
  }

  @moduleMethod([], DataType.VOID)
  // eslint-disable-next-line require-yield
  async* clear_matrix(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    await this.__io.clearMatrix();
    return { type: DataType.VOID, value: undefined };
  }

  /**
   * Schedules `f` (a Source closure taking no arguments) to run after `t` milliseconds, using the
   * Worker's own native `setTimeout` - no host round trip for the timing itself, only for whatever
   * host-bridged calls (e.g. `sound`'s `play()`) the callback itself happens to make. By the time
   * the timer fires, there's no CSE-machine-driven stepping loop to `yield*` into (unlike a module
   * function called directly from student code mid-Run), so the closure call is fully drained -
   * matching how the original (pre-Conductor) implementation also just ran the callback directly.
   */
  @moduleMethod([DataType.CLOSURE, DataType.NUMBER], DataType.VOID)
  // eslint-disable-next-line require-yield -- scheduling the timer never yields; f's own body runs later, fully drained, not stepped
  async* set_timeout(
    f: TypedValue<DataType.CLOSURE>,
    t: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    const evaluator = this.evaluator;
    const timeoutId = setTimeout(() => {
      this.__timeoutIds.delete(timeoutId);
      void drainGenerator(evaluator.closure_call_unchecked(f, []));
    }, t.value);
    this.__timeoutIds.add(timeoutId);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([], DataType.VOID)
  // eslint-disable-next-line require-yield
  async* clear_all_timeout(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    for (const timeoutId of this.__timeoutIds) {
      clearTimeout(timeoutId);
    }
    this.__timeoutIds.clear();
    return { type: DataType.VOID, value: undefined };
  }
}
