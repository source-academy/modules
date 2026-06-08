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

  @moduleMethod([DataType.CLOSURE, DataType.NUMBER], DataType.CLOSURE)
  async* repeat(func: TypedValue<DataType.CLOSURE>, n: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
    return yield* repeat_func(this.evaluator, func, n);
  }

  @moduleMethod([DataType.CLOSURE], DataType.CLOSURE)
  async* twice(func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
    return yield* twice_func(this.evaluator, func);
  }
  @moduleMethod([DataType.CLOSURE], DataType.CLOSURE)
  async* thrice(func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
    return yield* thrice_func(this.evaluator, func);
  }
}
