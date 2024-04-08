import { is_pair, head, tail, is_list, is_null, member, length } from './list';

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
