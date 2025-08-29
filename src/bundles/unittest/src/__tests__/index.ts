import { list } from 'js-slang/dist/stdlib/list';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as asserts from '../asserts';
import * as testing from '../functions';
import { UnitestBundleInternalError } from '../types';

vi.spyOn(performance, 'now').mockReturnValue(0);

describe('Test \'it\' and \'describe\'', () => {
  beforeEach(() => {
    testing.suiteResults.splice(0);
  });

  test('it and describe correctly set and resets the value of current test and suite', () => {
    expect(testing.currentTest).toBeNull();
    expect(testing.currentSuite).toBeNull();
    testing.describe('suite', () => {
      expect(testing.currentSuite).not.toBeNull();
      expect(testing.currentTest).toBeNull();
      testing.it('test', () => {
        expect(testing.currentTest).toEqual('test');
      });
    });

    expect(testing.currentTest).toBeNull();
  });

  test('it() throws an error when called without describe', () => {
    expect(() => testing.it('desc', () => {})).toThrowError('it must be called from within a test suite!');
  });

  test('it() throws an error even if it is called after describe', () => {
    testing.describe('a test', () => {});
    expect(() => testing.it('desc', () => {})).toThrowError('it must be called from within a test suite!');
  });

  test('it() works fine from within a describe block', () => {
    expect(() => {
      testing.describe('desc', () => {
        testing.it('desc', () => {});
      });
    }).not.toThrow();
  });

  test('it() correctly assigns results to the correct suite', () => {
    testing.describe('block1', () => {
      testing.it('test1', () => {});
    });

    testing.describe('block2', () => {
      testing.it('test2', () => {});
    });

    expect(testing.suiteResults.length).toEqual(2);
    const [result1, result2] = testing.suiteResults;
    expect(result1).toMatchObject({
      name: 'block1',
      results: [{ name: 'test1', passed: true }],
      passed: true,
      passCount: 1,
      runtime: 0,
    });

    expect(result2).toMatchObject({
      name: 'block2',
      results: [{ name: 'test2', passed: true }],
      runtime: 0,
      passed: true,
      passCount: 1
    });
  });

  test('it() correctly assigns results to child suites', () => {
    testing.describe('block1', () => {
      testing.describe('block3', () => {
        testing.it('test3', () => {});
      });
      testing.it('test1', () => {});
    });

    testing.describe('block2', () => {
      testing.it('test2', () => {});
    });

    expect(testing.suiteResults.length).toEqual(2);
    const [result1, result2] = testing.suiteResults;
    // Verify Result 1 first
    expect(result1.results.length).toEqual(2);
    const [subResult1, subResult2] = result1.results;
    expect(subResult1).toMatchObject({
      name: 'block3',
      results: [{ name: 'test3', passed: true }],
      runtime: 0,
      passCount: 1,
      passed: true
    });

    expect(subResult2).toEqual({
      name: 'test1',
      passed: true
    });

    expect(result1.name).toEqual('block1');
    expect(result1.runtime).toEqual(0);

    // Verify result2 next
    expect(result2).toMatchObject({
      name: 'block2',
      results: [{ name: 'test2', passed: true }],
      runtime: 0,
      passCount: 1,
      passed: true,
    });
  });

  test('it() throws when called within another it block', () => {
    const f = () => testing.describe('suite', () => {
      testing.it('test0', () => {
        testing.it('test1', () => {});
      });
    });

    expect(f).toThrowError('it cannot be called from within another test!');
  });
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

test('internal errors are not handled', () => {
  expect(() => {
    throw new UnitestBundleInternalError();
  }).toThrow();
});
