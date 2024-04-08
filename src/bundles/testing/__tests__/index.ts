import * as asserts from '../asserts';
import * as testing from '../functions';
import { list } from '../list';

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

test('context is created correctly', () => {
  const mockTestFn = jest.fn();
  testing.describe('Testing 321', () => {
    testing.it('Testing 123', mockTestFn);
  });
  expect(testing.context.suiteResults.passed).toEqual(1);
  expect(mockTestFn).toHaveBeenCalled();
});

test('context fails correctly', () => {
  testing.describe('Testing 123', () => {
    testing.it('This test fails!', () => asserts.assert_equals(0, 1));
  });
  expect(testing.context.suiteResults.passed).toEqual(0);
  expect(testing.context.suiteResults.total).toEqual(1);
});

test('assert works', () => {
  expect(() => asserts.assert(() => true)).not.toThrow();
  expect(() => asserts.assert(() => false)).toThrow('Assert failed');
});

test('assert_equals works', () => {
  expect(() => asserts.assert_equals(1, 1)).not.toThrow();
  expect(() => asserts.assert_equals(0, 1)).toThrow('Expected');
  expect(() => asserts.assert_equals(1.00000000001, 1)).not.toThrow();
});

test('assert_contains works', () => {
  const list1 = list(1, 2, 3);
  expect(() => asserts.assert_contains(list1, 2)).not.toThrow();
  expect(() => asserts.assert_contains(list1, 10)).toThrow();
});
