import * as list from 'js-slang/dist/stdlib/list';
import { stringify } from 'js-slang/dist/utils/stringify';
import isEqualWith from 'lodash/isEqualWith';

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

function equalityComparer(expected: any, received: any): boolean | undefined {
  if (typeof expected === 'number') {
    // if either is a float, use approximate checking
    if (!Number.isInteger(expected) || !Number.isInteger(received)) {
      return Math.abs(expected - received) <= 0.001;
    }

    return expected === received;
  }

  if (list.is_list(expected)) {
    if (!list.is_list(received)) return false;

    let list0 = expected;
    let list1 = received;
    while (true) {
      if (list.is_null(list0) || list.is_null(list1)) {
        // We have reached the end of at least one of the lists
        if (list.is_null(list0) !== list.is_null(list1)) {
          // If we haven't reached the end of both, then the lists
          // must not be equal
          return false;
        }
        return true;
      }

      if (!isEqualWith(list.head(list0), list.head(list1), equalityComparer)) {
        return false;
      }

      list0 = list.tail(list0);
      list1 = list.tail(list1);
    }
  }

  if (list.is_pair(expected)) {
    if (!list.is_pair(received)) return false;

    if (!isEqualWith(list.head(expected), list.head(received), equalityComparer)) return false;
    if (!isEqualWith(list.tail(expected), list.tail(received), equalityComparer)) return false;
    return true;
  }

  // TODO: A comparison for streams/arrays?
  return undefined;
}

// TODO: Fix to prevent stack overflow with circular lists
/**
 * Asserts the equality (===) of two parameters.
 * @param expected The expected value.
 * @param received The given value.
 * @returns
 */
export function assert_equals(expected: any, received: any) {
  if (!isEqualWith(expected, received, equalityComparer)) {
    throw new Error(`Expected \`${expected}\`, got \`${received}\`!`);
  }
}

/**
 * Asserts that two parameters are not equal (!==).
 * @param expected The expected value.
 * @param received The given value.
 * @returns
 */
export function assert_not_equals(expected: any, received: any) {
  if (!isEqualWith(expected, received, equalityComparer)) {
    throw new Error(`Expected \`${expected}\` to not equal \`${received}\`!`);
  }
}

/**
 * Asserts that `xs` contains `toContain`.
 * @param xs The list or pair to assert.
 * @param toContain The element that `xs` is expected to contain.
 */
export function assert_contains(xs: any, toContain: any) {
  const fail = () => {
    throw new Error(`Expected \`${stringify(xs)}\` to contain \`${toContain}\`.`);
  };

  function member(xs: list.List | list.Pair<any, any>, item: any): boolean {
    if (list.is_null(xs)) return false;

    if (list.is_list(xs)) {
      if (isEqualWith(list.head(xs), item, equalityComparer)) return true;
      return member(list.tail(xs), item);
    }

    if (list.is_pair(xs)) {
      if (
        isEqualWith(list.head(xs), item, equalityComparer) ||
        isEqualWith(list.tail(xs), item, equalityComparer)
      ) return true;

      if (list.is_pair(list.head(xs)) && member(list.head(xs), item)) {
        return true;
      }

      return list.is_pair(list.tail(xs)) && member(list.tail(xs), item);
    }

    throw new Error(`First argument to ${assert_contains.name} must be a list or a pair, got \`${stringify(xs)}\`.`);
  }
  if (!member(xs, toContain)) fail();
}

/**
 * Asserts that the given list has length `len`.
 * @param xs The list to assert.
 * @param len The expected length of the list.
 */
export function assert_length(xs: any, len: number) {
  if (!list.is_list(xs)) throw new Error(`First argument to ${assert_length.name} must be a list.`);
  if (!Number.isInteger(len)) throw new Error(`Second argument to ${assert_length.name} must be an integer.`);

  assert_equals(list.length(xs), len);
}

/**
 * Asserts that the given item is greater than `expected`
 * @param item The number to check
 * @param expected The value to check against
 */
export function assert_greater(item: any, expected: number) {
  if (typeof expected !== 'number') {
    throw new Error(`${assert_greater.name}: Expected value should be a number!`);
  }

  if (typeof item !== 'number') {
    throw new Error(`Expected ${item} to be a number!`);
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
  if (typeof expected !== 'number') {
    throw new Error(`${assert_greater_equals.name}: Expected value should be a number!`);
  }

  if (typeof item !== 'number') {
    throw new Error(`Expected ${item} to be a number!`);
  }

  if (item < expected) {
    throw new Error(`Expected ${item} to be greater than or equal to ${expected}`);
  }
}
