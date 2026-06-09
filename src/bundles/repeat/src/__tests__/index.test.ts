import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import {
  TestDataHandler,
  callClosure,
  closureFromFunction,
  numberValue,
  runAsyncGenerator
} from '@sourceacademy/modules-testplugin';
import { describe, expect, it } from 'vitest';
import { repeat, thrice, twice } from '../functions';

async function makePlusOne(handler: TestDataHandler) {
  return closureFromFunction(
    handler,
    {
      args: [DataType.NUMBER] as const,
      returnType: DataType.NUMBER
    },
    x => Number(x) + 1
  );
}

async function callNumberClosure(
  handler: TestDataHandler,
  closure: TypedValue<DataType.CLOSURE>,
  value: number
) {
  const result = await callClosure(
    handler,
    closure,
    [numberValue(value)],
    DataType.NUMBER
  );
  return result.value;
}

describe(repeat, () => {
  it('applies a closure n times', async () => {
    const handler = new TestDataHandler();
    const plusOne = await makePlusOne(handler);
    const repeated = await runAsyncGenerator(repeat(handler, plusOne, numberValue(5)));

    await expect(callNumberClosure(handler, repeated, 1)).resolves.toEqual(6);
  });

  it('applies a closure twice', async () => {
    const handler = new TestDataHandler();
    const plusOne = await makePlusOne(handler);
    const repeated = await runAsyncGenerator(twice(handler, plusOne));

    await expect(callNumberClosure(handler, repeated, 1)).resolves.toEqual(3);
  });

  it('applies a closure thrice', async () => {
    const handler = new TestDataHandler();
    const plusOne = await makePlusOne(handler);
    const repeated = await runAsyncGenerator(thrice(handler, plusOne));

    await expect(callNumberClosure(handler, repeated, 1)).resolves.toEqual(4);
  });
});
