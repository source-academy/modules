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
  // repeat's returned closure is registered with a placeholder VOID/VOID signature (it's generic
  // over any UnaryFunction<T>, so it genuinely can't declare a real one) - the same pattern a
  // cadet-authored closure crossing a language boundary uses (source-academy/modules#860).
  // closure_call_unchecked skips the declared-signature check, matching how repeat's own
  // composition() already calls func internally, and how a real caller of repeat's result
  // (the language runtime handing it back to cadet code, not another module's closure_call)
  // actually invokes it.
  const result = await callClosure(
    handler,
    closure,
    [numberValue(value)]
  );
  return (result as TypedValue<DataType.NUMBER>).value;
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

  it('returns the identity closure when n = 0', async () => {
    const handler = new TestDataHandler();
    const plusOne = await makePlusOne(handler);
    const repeated = await runAsyncGenerator(repeat(handler, plusOne, numberValue(0)));

    await expect(callNumberClosure(handler, repeated, 5)).resolves.toEqual(5);
  });

  it('throws an error when provided a negative or non-integer n', async () => {
    const handler = new TestDataHandler();
    const plusOne = await makePlusOne(handler);

    await expect(runAsyncGenerator(repeat(handler, plusOne, numberValue(-1))))
      .rejects.toThrow('repeat: Expected integer ≥ 0, got -1.');

    await expect(runAsyncGenerator(repeat(handler, plusOne, numberValue(1.5))))
      .rejects.toThrow('repeat: Expected integer ≥ 0, got 1.5.');
  });
});
