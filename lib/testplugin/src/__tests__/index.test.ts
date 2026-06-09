import { DataType } from '@sourceacademy/conductor/types';
import { describe, expect, it } from 'vitest';
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

describe(TestDataHandler, () => {
  it('stores closures as normal JS functions and calls them', async () => {
    const handler = new TestDataHandler();
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

  it('stores pairs as JS arrays in the pair map', async () => {
    const handler = new TestDataHandler();
    const pair = await handler.pair_make(numberValue(1), stringValue('tail'));

    expect(handler.pairMap.get(pair.value)).toEqual([numberValue(1), stringValue('tail')]);
    await expect(handler.pair_head(pair)).resolves.toEqual(numberValue(1));

    await handler.pair_settail(pair, booleanValue(true));
    await expect(handler.pair_tail(pair)).resolves.toEqual(booleanValue(true));
    await expect(handler.pair_assert(pair, DataType.NUMBER, DataType.BOOLEAN)).resolves.toBeUndefined();
  });

  it('stores arrays as JS arrays in the array map and enforces element types', async () => {
    const handler = new TestDataHandler();
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

  it('supports lists and accumulation using pair storage', async () => {
    const handler = new TestDataHandler();
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

  it('stores and updates opaque values', async () => {
    const handler = new TestDataHandler();
    const opaque = await handler.opaque_make({ value: 1 });

    await expect(handler.opaque_get(opaque)).resolves.toEqual({ value: 1 });
    await handler.opaque_update(opaque, { value: 2 });
    await expect(handler.opaque_get(opaque)).resolves.toEqual({ value: 2 });
  });
});
