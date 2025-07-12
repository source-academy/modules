import { describe, expect, test } from 'vitest';
import { Severity } from '../types.js';
import { compareSeverity, filterAsync, findSeverity } from '../utils.js';

describe('test findSeverity', () => {
  const cases: Severity[][] = [
    [Severity.SUCCESS, Severity.SUCCESS, Severity.SUCCESS],
    [Severity.WARN, Severity.SUCCESS, Severity.WARN],
    [Severity.WARN, Severity.WARN, Severity.WARN],
    [Severity.ERROR, Severity.ERROR, Severity.WARN],
    [Severity.ERROR, Severity.ERROR, Severity.SUCCESS]
  ];

  test.each(cases)('Expecting %s', (expected, ...args) => {
    expect(findSeverity(args, x => x)).toEqual(expected);
  });
});

describe('test compareSeverity', () => {
  const cases: [Severity, Severity, Severity][] = [
    [Severity.SUCCESS, Severity.SUCCESS, Severity.SUCCESS],
    [Severity.WARN, Severity.SUCCESS, Severity.WARN],
    [Severity.WARN, Severity.WARN, Severity.SUCCESS],
    [Severity.WARN, Severity.WARN, Severity.WARN],
    [Severity.ERROR, Severity.SUCCESS, Severity.ERROR],
    [Severity.ERROR, Severity.WARN, Severity.ERROR],
    [Severity.ERROR, Severity.ERROR, Severity.ERROR],
    [Severity.ERROR, Severity.ERROR, Severity.WARN],
    [Severity.ERROR, Severity.ERROR, Severity.SUCCESS],
  ];

  test.each(cases)('Expecting %s', (expected, lhs, rhs) => {
    expect(compareSeverity(lhs, rhs)).toEqual(expected);
  });
});

test('filterAsync', async () => {
  const objects = [1, 2, 3, 4, 5, 6];
  const results = await filterAsync(objects, each => Promise.resolve(each % 2 === 0));
  expect(results).toMatchObject([2, 4, 6]);
});
