/**
 * Test bundle for Source Academy modules repository
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 * @module repeat
 */

import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';

import { repeat as repeat_func, thrice as thrice_func, twice as twice_func } from './functions';

export default class RepeatModulePlugin extends BaseModulePlugin {
  id = 'repeat';
  exportedNames = ['repeat', 'twice', 'thrice'] as const;
  static channelAttach = [];
  constructor(conduit: IConduit, channels: IChannel<any>[], evaluator: IInterfacableEvaluator) {
    super(conduit, channels, evaluator);
  }
  /**
   * Returns a new function which when applied to an argument, has the same effect
   * as applying the specified function to the same argument n times.
   * @example
   * ```
   * const plusTen = repeat(x => x + 2, 5);
   * plusTen(0); // Returns 10
   * ```
   * @param func the function to be repeated
   * @param n the number of times to repeat the function
   * @returns the new function that has the same effect as func repeated n times
   */
  @moduleMethod([DataType.CLOSURE, DataType.NUMBER], DataType.CLOSURE)
  async* repeat(func: TypedValue<DataType.CLOSURE>, n: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
    return yield* repeat_func(this.evaluator, func, n);
  }

  /**
   * Returns a new function which when applied to an argument, has the same effect
   * as applying the specified function to the same argument 2 times.
   * @example
   * ```
   * const plusTwo = twice(x => x + 1);
   * plusTwo(2); // Returns 4
   * ```
   * @param func the function to be repeated
   * @returns the new function that has the same effect as `(x => func(func(x)))`
   */
  @moduleMethod([DataType.CLOSURE], DataType.CLOSURE)
  async* twice(func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
    return yield* twice_func(this.evaluator, func);
  }

  /**
   * Returns a new function which when applied to an argument, has the same effect
   * as applying the specified function to the same argument 3 times.
   * @example
   * ```
   * const plusNine = thrice(x => x + 3);
   * plusNine(0); // Returns 9
   * ```
   * @param func the function to be repeated
   * @returns the new function that has the same effect as `(x => func(func(func(x))))`
   */
  @moduleMethod([DataType.CLOSURE], DataType.CLOSURE)
  async* thrice(func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
    return yield* thrice_func(this.evaluator, func);
  }
}
