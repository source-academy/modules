/**
 * A single sentence summarising the module (this sentence is displayed larger).
 *
 * Sentences describing the module. More sentences about the module.
 *
 * @module module_name
 * @author Author Name
 * @author Author Name
 */

import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';

/*
  A bundle is a Conductor plugin: a class that extends BaseModulePlugin. Every method of the class
  that is decorated with `moduleMethod` is exported to the user's program, which can call it by its
  name. The decorator says the types of the parameters and of the result, and the values that the
  method receives and returns are `TypedValue`s, which an evaluator of any language can produce.

  `exportedNames` lists the exported methods, and `id` must be the name of the module.
 */
export default class ModuleNamePlugin extends BaseModulePlugin {
  id = 'module_name';
  override exportedNames = ['sample_function'] as const;
  static override channelAttach = [];

  constructor(conduit: IConduit, channels: IChannel<any>[], evaluator: IInterfacableEvaluator) {
    super(conduit, channels, evaluator);
  }

  /**
   * Sample function. Increments a number by 1.
   *
   * @param x The number to be incremented.
   * @returns The incremented value of the number.
   */
  @moduleMethod([DataType.NUMBER], DataType.NUMBER)
  async* sample_function(x: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    return { type: DataType.NUMBER, value: x.value + 1 };
  }
}
