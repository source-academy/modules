/**
 * This is the official documentation for the repeat module.
 * @module repeat
 */

import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';

/**
 * Represents a function that takes in 1 parameter and returns a
 * value of the same type
 */
type UnaryFunction<T> = (x: T) => T;

function callUnaryFunction<T>(f: UnaryFunction<T>, x: T): T {
  return f(x);
}

/**
 * Internal implementation of the repeat function that doesn't perform type checking.
 * Kept as a synchronous export for consumers (e.g. the rune bundle) that haven't
 * migrated to the Conductor closure API.
 * @hidden
 */
export function repeat_internal<T>(f: UnaryFunction<T>, n: number): UnaryFunction<T> {
  // Wrap the direct call in another function
  // so that the internal implementation is hidden
  const func: UnaryFunction<T> = x => callUnaryFunction(f, x);
  return n === 0 ? x => x : x => func(repeat_internal(func, n - 1)(x));
}

/**
 * Returns a new closure which when applied to an argument, has the same effect
 * as applying the specified closure to the same argument n times.
 */
export async function* repeat(evaluator: IDataHandler, func: TypedValue<DataType.CLOSURE>, n: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
  if (!Number.isInteger(n.value) || n.value < 0) {
    throw new EvaluatorRuntimeError(`repeat: Expected integer ≥ 0, got ${n.value}.`);
  }

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
      args: [DataType.ANY] as const,
      returnType: DataType.ANY
    },
    n.value === 0 ? identity : composition
  );
}

/**
 * Returns a new closure which when applied to an argument, has the same effect
 * as applying the specified closure to the same argument 2 times.
 */
export async function* twice(evaluator: IDataHandler, func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
  return yield* repeat(evaluator, func, { type: DataType.NUMBER, value: 2 });
}

/**
 * Returns a new closure which when applied to an argument, has the same effect
 * as applying the specified closure to the same argument 3 times.
 */
export async function* thrice(evaluator: IDataHandler, func: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown> {
  return yield* repeat(evaluator, func, { type: DataType.NUMBER, value: 3 });
}
