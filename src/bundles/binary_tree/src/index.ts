/**
 * The `binary_tree` Source Module provides functions for the interaction with binary trees, as covered the textbook
 * [Structure and Interpretation of Computer Programs, JavaScript Adaptation (SICP JS)](https://sourceacademy.org/sicpjs)
 * in [section 2.3.3 Example: Representing Sets](https://sourceacademy.org/sicpjs/2.3.3#h3).
 * Click on a function name in the index below to see how the function is defined and used.
 * @module binary_tree
 * @author Martin Henz
 * @author Joel Lee
 * @author Loh Xian Ze, Bryan
 */
import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';

import {
  entry as entry_func,
  is_empty_tree as is_empty_tree_func,
  is_tree as is_tree_func,
  left_branch as left_branch_func,
  make_empty_tree as make_empty_tree_func,
  make_tree as make_tree_func,
  right_branch as right_branch_func
} from './functions';

export default class BinaryTreeModulePlugin extends BaseModulePlugin {
  id = 'binary_tree';
  override exportedNames = [
    'entry',
    'is_empty_tree',
    'is_tree',
    'left_branch',
    'make_empty_tree',
    'make_tree',
    'right_branch'
  ] as const;
  static override channelAttach = [];

  @moduleMethod([], DataType.EMPTY_LIST)
  async* make_empty_tree(): AsyncGenerator<void, TypedValue<DataType.EMPTY_LIST>, unknown> {
    return make_empty_tree_func();
  }

  @moduleMethod([DataType.OPAQUE, DataType.LIST, DataType.LIST], DataType.PAIR)
  async* make_tree(
    value: TypedValue<DataType.OPAQUE>,
    left: TypedValue<DataType.LIST>,
    right: TypedValue<DataType.LIST>
  ): AsyncGenerator<void, TypedValue<DataType.PAIR>, unknown> {
    return await make_tree_func(this.evaluator, value, left, right);
  }

  // No declared arg type: is_tree is a predicate that must accept a value of any
  // Conductor DataType (not just lists/pairs) and answer false rather than throw.
  @moduleMethod([], DataType.BOOLEAN)
  async* is_tree(value?: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType.BOOLEAN>, unknown> {
    if (!value) throw new EvaluatorRuntimeError('is_tree expects 1 argument, received 0');
    return { type: DataType.BOOLEAN, value: await is_tree_func(this.evaluator, value) };
  }

  // Same reasoning as is_tree: must accept a value of any Conductor DataType.
  @moduleMethod([], DataType.BOOLEAN)
  async* is_empty_tree(value?: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType.BOOLEAN>, unknown> {
    if (!value) throw new EvaluatorRuntimeError('is_empty_tree expects 1 argument, received 0');
    return { type: DataType.BOOLEAN, value: is_empty_tree_func(value) };
  }

  @moduleMethod([DataType.LIST], DataType.OPAQUE)
  async* entry(t: TypedValue<DataType.LIST>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, unknown> {
    return await entry_func(this.evaluator, t);
  }

  @moduleMethod([DataType.LIST], DataType.LIST)
  async* left_branch(t: TypedValue<DataType.LIST>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await left_branch_func(this.evaluator, t);
  }

  @moduleMethod([DataType.LIST], DataType.LIST)
  async* right_branch(t: TypedValue<DataType.LIST>): AsyncGenerator<void, TypedValue<DataType.LIST>, unknown> {
    return await right_branch_func(this.evaluator, t);
  }
}
