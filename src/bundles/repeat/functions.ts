/**
 * Returns a new function which when applied to an argument, has the same effect
 * as applying the specified function to the same argument n times.
 * @example
 * ```typescript
 * const plusTen = repeat(x => x + 2, 5);
 * plusTen(0); // Returns 10
 * ```
 * @param func the function to be repeated
 * @param n the number of times to repeat the function
 * @return the new function that has the same effect as func repeated n times
 */
export function repeat(func: Function, n: number): Function {
  return n === 0 ? (x: any) => x : (x: any) => func(repeat(func, n - 1)(x));
}

/**
 * Returns a new function which when applied to an argument, has the same effect
 * as applying the specified function to the same argument 2 times.
 * @example
 * ```typescript
 * const plusTwo = twice(x => x + 1);
 * plusTwo(2); // Returns 4
 * ```
 * @param func the function to be repeated
 * @return the new function that has the same effect as `(x => func(func(x)))`
 */
export function twice(func: Function): Function {
  return repeat(func, 2);
}

/**
 * Returns a new function which when applied to an argument, has the same effect
 * as applying the specified function to the same argument 3 times.
 * @example
 * ```typescript
 * const plusNine = thrice(x => x + 3);
 * plusNine(0); // Returns 9
 * ```
 * @param func the function to be repeated
 * @return the new function that has the same effect as `(x => func(func(func(x))))`
 */
export function thrice(func: Function): Function {
  return repeat(func, 3);
}
