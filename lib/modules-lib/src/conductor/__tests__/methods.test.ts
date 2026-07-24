/* @vitest browser: false */

import type { IModulePlugin } from '@sourceacademy/conductor/module';
import { DataType, type ExternCallable, type TypedValue } from '@sourceacademy/conductor/types';
import { expectTypeOf, test } from 'vitest';
import { attachModuleMethod } from '../methods';

class TestModulePlugin implements IModulePlugin {
  readonly id = 'test';
  readonly exports: IModulePlugin['exports'] = [];
  readonly evaluator = {} as IModulePlugin['evaluator'];
  readonly notCallable = DataType.NUMBER;

  initialise() { }

  async *numberToString(
    value: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, undefined> {
    await Promise.resolve();
    return { type: DataType.CONST_STRING, value: String(value.value) };
  }

  async *nothing(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    await Promise.resolve();
    return { type: DataType.VOID, value: undefined };
  }
}

test('accepts the data types of a module method', () => {
  const attachNumberToString = attachModuleMethod<TestModulePlugin, 'numberToString'>;
  const attachNothing = attachModuleMethod<TestModulePlugin, 'nothing'>;

  expectTypeOf(TestModulePlugin.prototype.numberToString)
    .toEqualTypeOf<ExternCallable<[DataType.NUMBER], DataType.CONST_STRING>>();
  expectTypeOf(attachNumberToString).toBeCallableWith(
    TestModulePlugin,
    'numberToString',
    [DataType.NUMBER],
    DataType.CONST_STRING
  );
  expectTypeOf(attachNothing).toBeCallableWith(
    TestModulePlugin,
    'nothing',
    [],
    DataType.VOID
  );
});

test('rejects names and data types that do not match a module method', () => {
  const attachNumberToString = attachModuleMethod<TestModulePlugin, 'numberToString'>;

  expectTypeOf(attachNumberToString).parameter(2).not.toEqualTypeOf<[DataType.CONST_STRING]>();
  expectTypeOf(attachNumberToString).parameter(3).not.toEqualTypeOf<DataType.NUMBER>();
  // @ts-expect-error: The method name does not exist on the module plugin.
  expectTypeOf(attachNumberToString).not.toBeCallableWith(
    TestModulePlugin,
    'notCallable',
    [DataType.NUMBER],
    DataType.CONST_STRING
  )

  // @ts-expect-error: The method signature is wrong
  expectTypeOf(attachNumberToString).not.toBeCallableWith(
    TestModulePlugin,
    'numberToString',
    [DataType.CONST_STRING],
    DataType.CONST_STRING
  );
});
