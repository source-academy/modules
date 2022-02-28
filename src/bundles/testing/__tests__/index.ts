import * as testing from '../functions';
import * as asserts from '../asserts';

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

test('Assert equal works', () => {
  expect(() => asserts.assert_equals(0, 1)).toThrow('Expected');
});
