/**
 * This is the official documentation for the repeat module.
 * @module repeat
 */

import { assertFunctionOfLength, assertNumberWithinRange } from '@sourceacademy/modules-lib/utilities';

/**
 * Represents a function that takes in 1 parameter and returns a
 * value of the same type
 */
type UnaryFunction<T> = (x: T) => T;

/**
 * Internal implementation of the repeat function that doesn't perform type checking
 * @hidden
 */
export function repeat_internal<T>(f: UnaryFunction<T>, n: number): UnaryFunction<T> {
  return n === 0 ? x => x : x => f(repeat_internal(f, n - 1)(x));
}

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
export function repeat(func: Function, n: number): Function {
  assertFunctionOfLength(func, 1, repeat.name);
  assertNumberWithinRange(n, repeat.name, 0);

  return repeat_internal(func, n);
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
export function twice(func: Function): Function {
  assertFunctionOfLength(func, 1, twice.name);
  return repeat_internal(func, 2);
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
export function thrice(func: Function): Function {
  assertFunctionOfLength(func, 1, thrice.name);
  return repeat_internal(func, 3);
}
