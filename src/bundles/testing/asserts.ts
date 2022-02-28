import { is_pair, head, tail, is_list, is_null, member, length } from './list';

/**
 * Asserts the equality (===) of the two parameters.
 * @param expected The expected value.
 * @param received The given value.
 * @returns
 */
export function assert_equals(expected: any, received: any) {
  if (expected !== received) {
    throw new Error(`Expected \`${expected}\`, got \`${received}\`!`);
  }
}

/**
 * Asserts the inequality (!==) of the two parameters.
 * @param expected The expected value.
 * @param received The given value.
 * @returns
 */
export function assert_not_equals(expected: any, received: any) {
  if (expected === received) {
    throw new Error(`Expected not equal \`${expected}\`!`);
  }
}

/**
 * Asserts the inequality (!==) of the two parameters.
 * @param expected The expected value.
 * @param received The given value.
 * @returns
 */
export function assert_approx_equals(expected: number, received: number) {
  if (Math.abs(expected - received) > 0.001) {
    throw new Error(`Expected \`${expected}\` to approx. \`${received}\`!`);
  }
}

/**
 * Asserts that `expected` > `received`.
 * @param expected
 * @param received
 */
export function assert_greater(expected: number, received: number) {
  if (expected <= received) {
    throw new Error(`Expected \`${expected}\` > \`${received}\`!`);
  }
}

/**
 * Asserts that `expected` >= `received`.
 * @param expected
 * @param received
 */
export function assert_greater_equals(expected: number, received: number) {
  if (expected < received) {
    throw new Error(`Expected \`${expected}\` >= \`${received}\`!`);
  }
}

/**
 * Asserts that `expected` < `received`.
 * @param expected
 * @param received
 */
export function assert_lesser(expected: number, received: number) {
  if (expected >= received) {
    throw new Error(`Expected \`${expected}\` < \`${received}\`!`);
  }
}

/**
 * Asserts that `expected` <= `received`.
 * @param expected
 * @param received
 */
export function assert_lesser_equals(expected: number, received: number) {
  if (expected > received) {
    throw new Error(`Expected \`${expected}\` <= \`${received}\`!`);
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

  if (is_null(xs)) {
    fail();
  } else if (is_list(xs)) {
    if (is_null(member(toContain, xs))) {
      fail();
    }
  } else if (is_pair(xs)) {
    if (head(xs) === toContain || tail(xs) === toContain) {
      return;
    }

    // check the head, if it fails, checks the tail, if that fails, fail.
    try {
      assert_contains(head(xs), toContain);
      return;
    } catch (_) {
      try {
        assert_contains(tail(xs), toContain);
        return;
      } catch (__) {
        fail();
      }
    }
  } else {
    throw new Error(`First argument must be a list or a pair, got \`${xs}\`.`);
  }
}

/**
 * Asserts that the given list has length `len`.
 * @param list The list to assert.
 * @param len The expected length of the list.
 */
export function assert_length(list: any, len: number) {
  assert_equals(length(list), len);
}
