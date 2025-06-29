import { head, is_list, is_null, is_pair, length, tail, type List, type Pair } from 'js-slang/dist/stdlib/list';

/**
 * Asserts that a predicate returns true.
 * @param pred An predicate function that returns true/false.
 * @returns
 */
export function assert(pred: () => boolean) {
  if (!pred()) {
    throw new Error('Assert failed!');
  }
}

/**
 * Asserts the equality (===) of two parameters.
 * @param expected The expected value.
 * @param received The given value.
 * @returns
 */
export function assert_equals(expected: any, received: any) {
  const fail = () => {
    throw new Error(`Expected \`${expected}\`, got \`${received}\`!`);
  };
  if (typeof expected !== typeof received) {
    fail();
  }
  // approx checking for floats
  if (typeof expected === 'number' && !Number.isInteger(expected)) {
    if (Math.abs(expected - received) > 0.001) {
      fail();
    } else {
      return;
    }
  }
  if (expected !== received) {
    fail();
  }
}

/**
 * Asserts that two parameters are not equal (!==).
 * @param expected The expected value.
 * @param received The given value.
 * @returns
 */
export function assert_not_equals(expected: any, received: any) {
  if (expected === received) {
    throw new Error(`Expected \`${expected}\` to not equal \`${received}\`!`);
  }
}

/**
 * Asserts that `xs` contains `toContain`.
 * @param xs The list to assert.
 * @param toContain The element that `xs` is expected to contain.
 */
export function assert_contains(xs: any, toContain: any) {
  const fail = () => {
    throw new Error(`Expected \`${xs}\` to contain \`${toContain}\`.`);
  };

  const member = (xs: List | Pair<any, any>, item: any) => {
    if (is_null(xs)) return false;

    if (is_list(xs)) {
      if (head(xs) === item) return true;
      return member(tail(xs), item);
    }

    if (is_pair(xs)) {
      return member(head(xs), item) || member(tail(xs), item);
    }

    throw new Error(`First argument to ${assert_contains.name} must be a list or a pair, got \`${xs}\`.`);
  };
  if (!member(xs, toContain)) fail();
}

/**
 * Asserts that the given list has length `len`.
 * @param list The list to assert.
 * @param len The expected length of the list.
 */
export function assert_length(list: any, len: number) {
  assert_equals(length(list), len);
}

/**
 * Asserts that the given item is greater than `expected`
 * @param item The number to check
 * @param expected The value to check against
 */
export function assert_greater(item: any, expected: number) {
  if (typeof item !== 'number' || typeof expected !== 'number') {
    throw new Error(`${assert_greater.name} should be called with numeric arguments!`);
  }

  if (item <= expected) {
    throw new Error(`Expected ${item} to be greater than ${expected}`);
  }
}

/**
 * Asserts that the given item is greater than or equal to `expected`
 * @param item The number to check
 * @param expected The value to check against
 */
export function assert_greater_equals(item: any, expected: number) {
  if (typeof item !== 'number' || typeof expected !== 'number') {
    throw new Error(`${assert_greater.name} should be called with numeric arguments!`);
  }

  if (item < expected) {
    throw new Error(`Expected ${item} to be greater than or equal to ${expected}`);
  }
}
