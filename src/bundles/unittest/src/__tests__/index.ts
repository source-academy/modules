import { list, pair, set_head } from 'js-slang/dist/stdlib/list';
import { beforeEach, describe, expect, it, test, vi } from 'vitest';
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

test('assert', () => {
  expect(() => asserts.assert(() => true)).not.toThrow();
  expect(() => asserts.assert(() => false)).toThrow('Assert failed');
});

describe(asserts.assert_equals, () => {
  it('works for numerical values', () => {
    expect(() => asserts.assert_equals(1, 1)).not.toThrow();
    expect(() => asserts.assert_equals(0, 1)).toThrow();
    expect(() => asserts.assert_equals(1.00000000001, 1)).not.toThrow();
  });

  it('works for strings', () => {
    expect(() => asserts.assert_equals('str', 'str')).not.toThrow();
    expect(() => asserts.assert_equals('str', 'notstr')).toThrow();
  });

  describe('tests on lists', () => {
    test('matching lists', () => {
      const list0 = list(1, 2, 3);
      const list1 = list(1, 2, 3);
      expect(() => asserts.assert_equals(list0, list1)).not.toThrow();
    });

    test('lists of same length; mismatch elements', () => {
      const list0 = list(1, 2, 3);
      const list1 = list(1, 4, 3);
      expect(() => asserts.assert_equals(list0, list1)).toThrow();
    });

    test('lists of different length; same elements', () => {
      const list0 = list(1, 2, 3);
      const list1 = list(1, 2, 3, 4);
      expect(() => asserts.assert_equals(list0, list1)).toThrow();
    });

    test('empty lists', () => {
      expect(() => asserts.assert_equals(list(), list())).not.toThrow();
    });

    test('deep equality', () => {
      const list0 = list(1, pair(2, 3), 4);
      const list1 = list(1, pair(2, 3), 4);

      expect(() => asserts.assert_equals(list0, list1)).not.toThrow();
    });

    test.skip('circular lists', () => {
      const list0 = list(1, 2, 3);
      set_head(list0, list0);

      const list1 = list(1, 2, 3);
      set_head(list1, list1);

      expect(() => asserts.assert_equals(list0, list1)).not.toThrow();
    });
  });

  describe('tests on pairs', () => {
    test('matching pairs', () => {
      expect(() => asserts.assert_equals(pair(1, 2), pair(1, 2))).not.toThrow();
    });

    test('deep equality', () => {
      const lhs = pair(pair(1, 2), pair(3, pair(4, 5)));
      const rhs = pair(pair(1, 2), pair(3, pair(4, 6)));
      expect(() => asserts.assert_equals(lhs, rhs)).toThrow();
    });
  });
});

describe(asserts.assert_contains, () => {
  it('works on lists', () => {
    const list1 = list(1, 2, 3);
    expect(() => asserts.assert_contains(list1, 2)).not.toThrow();
    expect(() => asserts.assert_contains(list1, 10)).toThrow();
  });

  it('throws the correct error for empty lists', () => {
    expect(() => asserts.assert_contains(list(), 0)).toThrowError(`Expected \`null\` to contain \`0\`.`);
  });

  it('works for pairs', () => {
    const pair1 = pair(1, 2);
    expect(() => asserts.assert_contains(pair1, 1)).not.toThrow();
    expect(() => asserts.assert_contains(pair1, 2)).not.toThrow();
    expect(() => asserts.assert_contains(pair1, 3)).toThrow(`Expected \`[1, 2]\` to contain \`3\`.`);
  });

  it('works for nested pairs', () => {
    const pair1 = pair(pair(3, 1), pair(pair(4, 5), 2));
    expect(() => asserts.assert_contains(pair1, 1)).not.toThrow();
    expect(() => asserts.assert_contains(pair1, 2)).not.toThrow();
    expect(() => asserts.assert_contains(pair1, 7)).toThrow(`Expected \`[[3, 1], [[4, 5], 2]]\` to contain \`7\`.`);
  });

  it('throws when an invalid argument is passed', () => {
    expect(() => asserts.assert_contains(0, 0)).toThrowError(`First argument to assert_contains must be a list or a pair, got \`0\`.`);
  });
});

describe(asserts.assert_greater, () => {
  it('throws when the expected value isn\'t a number', () => {
    expect(() => asserts.assert_greater(0, 'string' as any)).toThrow('assert_greater: Expected value should be a number!');
  });

  it('throws when the received value isn\'t a number', () => {
    expect(() => asserts.assert_greater('string', 0)).toThrow('Expected string to be a number!');
  });

  it('throws when the received value is === to the expected', () => {
    expect(() => asserts.assert_greater(0, 0)).toThrow('Expected 0 to be greater than 0');
  });

  it('throws when the received value is < the expected', () => {
    expect(() => asserts.assert_greater(-1, 0)).toThrow('Expected -1 to be greater than 0');
  });

  it('works', () => {
    expect(() => asserts.assert_greater(1, 0)).not.toThrow();
  });
});

describe(asserts.assert_greater_equals, () => {
  it('throws when the expected value isn\'t a number', () => {
    expect(() => asserts.assert_greater_equals(0, 'string' as any)).toThrow('assert_greater_equals: Expected value should be a number!');
  });

  it('throws when the received value isn\'t a number', () => {
    expect(() => asserts.assert_greater_equals('string', 0)).toThrow('Expected string to be a number!');
  });

  it('doesn\'t throw when the received value is === to the expected', () => {
    expect(() => asserts.assert_greater_equals(0, 0)).not.toThrow();
  });

  it('throws when the received value is < the expected', () => {
    expect(() => asserts.assert_greater_equals(-1, 0)).toThrow('Expected -1 to be greater than or equal to 0');
  });

  it('doesn\'t throw when the received value is > expected', () => {
    expect(() => asserts.assert_greater_equals(1, 0)).not.toThrow();
  });
});

test('internal errors are not handled', () => {
  expect(() => {
    throw new UnitestBundleInternalError();
  }).toThrow();
});
