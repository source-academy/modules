import * as testing from '../functions';
import * as asserts from '../asserts';
import { pair, list } from '../list';

beforeAll(() => {
  testing.context.suiteResults = {
    name: '',
    results: [],
    total: 0,
    passed: 0,
  };
  testing.context.allResults.results = [];
  testing.context.runtime = 0;
});

test('Test context is created correctly', () => {
  const mockTestFn = jest.fn();
  testing.describe('Testing 321', () => {
    testing.it('Testing 123', mockTestFn);
  });
  expect(testing.context.suiteResults.passed).toEqual(1);
  expect(mockTestFn).toHaveBeenCalled();
});

test('Test context fails correctly', () => {
  testing.describe('Testing 123', () => {
    testing.it('This test fails!', () => asserts.assert_equals(0, 1));
  });
  expect(testing.context.suiteResults.passed).toEqual(0);
  expect(testing.context.suiteResults.total).toEqual(1);
});

test('assert_equals works', () => {
  expect(() => asserts.assert_equals(1, 1)).not.toThrow();
  expect(() => asserts.assert_equals(0, 1)).toThrow('Expected');
});

test('assert_not_equals works', () => {
  expect(() => asserts.assert_not_equals(0, 1)).not.toThrow();
  expect(() => asserts.assert_not_equals(1, 1)).toThrow('Expected not');
});

test('assert_greater works', () => {
  expect(() => asserts.assert_equals(1, 1)).not.toThrow();
  expect(() => asserts.assert_equals(1, 0)).toThrow('Expected');
});

test('assert_contains works', () => {
  const list1 = list(1, 2, 3);
  expect(() => asserts.assert_contains(list1, 2)).not.toThrow();
  expect(() => asserts.assert_contains(list1, 10)).toThrow();
});