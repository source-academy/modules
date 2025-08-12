/**
 * Collection of unit-testing tools for Source.
 * @module unittest
 * @author Jia Xiaodong
 */

export {
  assert_equals,
  assert_not_equals,
  assert_contains,
  assert_greater,
  assert_greater_equals,
  assert_length,
} from './asserts';
export { it, test, describe } from './functions';
export { mock_fn } from './mocks';

/**
 * Increment a number by a value of 1.
 * @param x the number to be incremented
 * @returns the incremented value of the number
 */
export function sample_function(x: number) {
  return x + 1;
}
