import { it, describe } from './functions';
import {
  assert_equals,
  assert_not_equals,
  assert_contains,
  assert_approx_equals,
  assert_greater,
  assert_greater_equals,
  assert_length,
} from './asserts';
import { mock_fn } from './mocks';

/**
 * Collection of unit-testing tools for Source.
 * @author Jia Xiaodong
 */

/**
 * Increment a number by a value of 1.
 * @param x the number to be incremented
 * @returns the incremented value of the number
 */
function sample_function(x: number) {
  return x + 1;
}

// Un-comment the next line if your bundle requires the use of variables
// declared in cadet-frontend or js-slang.
export default () => ({
  sample_function,
  it,
  describe,
  assert_equals,
  assert_not_equals,
  assert_contains,
  assert_greater,
  assert_greater_equals,
  assert_approx_equals,
  assert_length,
  mock_fn,
});
