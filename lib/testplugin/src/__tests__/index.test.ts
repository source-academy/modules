import { DataType } from '@sourceacademy/conductor/types';
import { describe, expect } from 'vitest';
import {
  TestDataHandler,
  booleanValue,
  callClosure,
  closureFromFunction,
  emptyListValue,
  numberValue,
  runAsyncGenerator,
  stringValue
} from '../index';
import { test } from './fixtures';

describe(TestDataHandler, () => {
  test('stores closures as normal JS functions and calls them', async ({ handler }) => {
    const closure = await closureFromFunction(
      handler,
      {
        args: [DataType.NUMBER] as const,
        returnType: DataType.NUMBER
      },
      (x: unknown) => Number(x) + 1
    );

    expect(handler.closureMap.get(closure.value)).toEqual(expect.any(Function));
    await expect(handler.closure_arity(closure)).resolves.toEqual(1);
    await expect(handler.closure_is_vararg(closure)).resolves.toEqual(false);

    const result = await callClosure(handler, closure, [numberValue(41)], DataType.NUMBER);
    expect(result).toEqual(numberValue(42));
  });

  test('stores pairs as JS arrays in the pair map', async ({ handler }) => {
    const pair = await handler.pair_make(numberValue(1), stringValue('tail'));

    expect(handler.pairMap.get(pair.value)).toEqual([numberValue(1), stringValue('tail')]);
    await expect(handler.pair_head(pair)).resolves.toEqual(numberValue(1));

    await handler.pair_settail(pair, booleanValue(true));
    await expect(handler.pair_tail(pair)).resolves.toEqual(booleanValue(true));
    await expect(handler.pair_assert(pair, DataType.NUMBER, DataType.BOOLEAN)).resolves.toBeUndefined();
  });

  test('stores arrays as JS arrays in the array map and enforces element types', async ({ handler }) => {
    const array = await handler.array_make(DataType.NUMBER, 3, numberValue(0));

    expect(handler.arrayMap.get(array.value)).toEqual([
      numberValue(0),
      numberValue(0),
      numberValue(0)
    ]);

    await handler.array_set(array, 1, numberValue(7));
    await expect(handler.array_get(array, 1)).resolves.toEqual(numberValue(7));
    await expect(handler.array_length(array)).resolves.toEqual(3);
    await expect(handler.array_type(array)).resolves.toEqual(DataType.NUMBER);
    await expect(handler.array_assert(array, DataType.NUMBER, 3)).resolves.toBeUndefined();
    await expect(handler.array_set(array, 0, stringValue('wrong') as never)).rejects.toThrow(
      'Array element expected NUMBER, got CONST_STRING.'
    );
  });

  test('supports lists and accumulation using pair storage', async ({ handler }) => {
    const xs = await handler.list(numberValue(1), numberValue(2), numberValue(3));
    const add = await closureFromFunction(
      handler,
      {
        args: [DataType.NUMBER, DataType.NUMBER] as const,
        returnType: DataType.NUMBER
      },
      (x: unknown, y: unknown) => Number(x) + Number(y)
    );

    await expect(handler.is_list(xs)).resolves.toEqual(true);
    await expect(handler.is_list(emptyListValue())).resolves.toEqual(true);
    await expect(handler.list_to_vec(xs)).resolves.toEqual([
      numberValue(1),
      numberValue(2),
      numberValue(3)
    ]);
    await expect(handler.length(xs)).resolves.toEqual(3);

    const sum = await runAsyncGenerator(handler.accumulate(add, numberValue(0), xs, DataType.NUMBER));
    expect(sum).toEqual(numberValue(6));
  });

  test('stores and updates opaque values', async ({ handler }) => {
    const opaque = await handler.opaque_make({ value: 1 });

    await expect(handler.opaque_get(opaque)).resolves.toEqual({ value: 1 });
    await handler.opaque_update(opaque, { value: 2 });
    await expect(handler.opaque_get(opaque)).resolves.toEqual({ value: 2 });
  });

  test('expect initial array to point to the same initial data', async ({ handler }) => {
    const array = await handler.array_make(DataType.NUMBER, 3, numberValue(3));
    const objValue = await handler.array_get(array, 0);
    objValue.value = 4;
    expect(await handler.array_get(array, 2)).toEqual(numberValue(4));
  });
});
