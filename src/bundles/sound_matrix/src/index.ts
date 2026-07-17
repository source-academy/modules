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

export default class SoundMatrixModulePlugin extends BaseModulePlugin {
  id = 'sound_matrix';
  override exportedNames = ['get_matrix', 'clear_matrix', 'set_timeout', 'clear_all_timeout'] as const;
  static override channelAttach = [SOUND_MATRIX_CHANNEL_ID];

  private readonly __io: SoundMatrixTabRpc;
  private readonly __timeoutIds = new Set<ReturnType<typeof setTimeout>>();

  constructor(conduit: IConduit, [channel]: IChannel<any>[], evaluator: IInterfacableEvaluator) {
    super(conduit, [channel], evaluator);
    if (!channel) {
      throw new Error('Sound matrix channel is required but was not provided.');
    }
    // The tab is the web plugin holding the actual grid state and canvas: it does the actual DOM
    // work (only available on the browser main thread, not inside this runner's Worker) and
    // replies over the same channel via Conductor's RPC helper.
    this.__io = makeRpc<Record<string, never>, SoundMatrixTabRpc>(channel, {});
  }

  @moduleMethod([], DataType.LIST)
  async* get_matrix(): AsyncGenerator<void, TypedValue<DataType.LIST>, undefined> {
    const matrix = await this.__io.getMatrix();
    return matrixToConductorList(this.evaluator, matrix);
  }

  @moduleMethod([], DataType.VOID)
  async* clear_matrix(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
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
  async* clear_all_timeout(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    for (const timeoutId of this.__timeoutIds) {
      clearTimeout(timeoutId);
    }
    this.__timeoutIds.clear();
    return { type: DataType.VOID, value: undefined };
  }
}
