/**
 * This is the official documentation for the repeat module.
 * @module repeat
 */

import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
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
export async function* twice(evaluator: IDataHandler, func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
  return yield* repeat(evaluator, func, { type: DataType.NUMBER, value: 2 });
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
export async function* thrice(evaluator: IDataHandler, func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
  return yield* repeat(evaluator, func, { type: DataType.NUMBER, value: 3 });
}
