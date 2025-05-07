/**
 * Collection of unit-testing tools for Source.
 * @author Jia Xiaodong
 */

import {
  assert_equals,
  assert_not_equals,
  assert_contains,
  assert_greater,
  assert_greater_equals,
  assert_length,
} from './asserts';
import { it, describe } from './functions';
import { mock_fn } from './mocks';
/**
 * Increment a number by a value of 1.
 * @param x the number to be incremented
 * @returns the incremented value of the number
 */
function sample_function(x: number) {
  return x + 1;
}

export default {
  sample_function,
  it,
  describe,
  assert_equals,
  assert_not_equals,
  assert_contains,
  assert_greater,
  assert_greater_equals,
  assert_length,
  mock_fn,
};
