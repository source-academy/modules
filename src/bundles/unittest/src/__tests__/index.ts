import { list } from 'js-slang/dist/stdlib/list';
import { beforeEach, expect, test, vi } from 'vitest';
import * as asserts from '../asserts';
import * as testing from '../functions';

beforeEach(() => {
  testing.testContext.suiteResults = {
    name: '',
    results: [],
    total: 0,
    passed: 0,
  };
  testing.testContext.allResults.results = [];
  testing.testContext.runtime = 0;
  testing.testContext.called = false;
});

test('context is created correctly', () => {
  const mockTestFn = vi.fn();
  testing.describe('Testing 321', () => {
    testing.it('Testing 123', mockTestFn);
  });
  expect(testing.testContext.suiteResults.passed).toEqual(1);
  expect(mockTestFn).toHaveBeenCalled();
});

test('context fails correctly', () => {
  testing.describe('Testing 123', () => {
    testing.it('This test fails!', () => asserts.assert_equals(0, 1));
  });
  expect(testing.testContext.suiteResults.passed).toEqual(0);
  expect(testing.testContext.suiteResults.total).toEqual(1);
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
