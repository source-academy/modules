/**
 * This is the official documentation for the repeat module.
 * @module repeat
 */

import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';

export async function* repeat(evaluator: IDataHandler, func: TypedValue<DataType.CLOSURE>, n: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
  async function* identity(x: any) {
    return x;
  }
  async function* composition(x: any) {
    const recursiveFunc = yield* repeat(evaluator, func, { type: DataType.NUMBER, value: n.value - 1 });
    return yield* evaluator.closure_call_unchecked(func, [
      yield* evaluator.closure_call_unchecked(
        recursiveFunc,
        [x]
      )]);
  }

  return await evaluator.closure_make(
    {
      name: 'function',
      args: [DataType.VOID] as const,
      returnType: DataType.VOID
    },
    n.value === 0 ? identity : composition
  );
}

export async function* twice(evaluator: IDataHandler, func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
  return yield* repeat(evaluator, func, { type: DataType.NUMBER, value: 2 });
}

export async function* thrice(evaluator: IDataHandler, func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
  return yield* repeat(evaluator, func, { type: DataType.NUMBER, value: 3 });
}
