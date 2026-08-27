import { describe, expect, test } from 'vitest';
import type { Severity } from '../types.js';
import { compareSeverity, filterAsync, findSeverity } from '../utils.js';

describe(findSeverity, () => {
  const cases: Severity[][] = [
    ['success', 'success', 'success'],
    ['warn', 'success', 'warn'],
    ['warn', 'warn', 'warn'],
    ['error', 'error', 'warn'],
    ['error', 'error', 'success']
  ];

  test.each(cases)('Expecting %s', (expected, ...args) => {
    expect(findSeverity(args, x => x)).toEqual(expected);
  });
});

describe(compareSeverity, () => {
  const cases: [Severity, Severity, Severity][] = [
    ['success', 'success', 'success'],
    ['warn', 'success', 'warn'],
    ['warn', 'warn', 'success'],
    ['warn', 'warn', 'warn'],
    ['error', 'success', 'error'],
    ['error', 'warn', 'error'],
    ['error', 'error', 'error'],
    ['error', 'error', 'warn'],
    ['error', 'error', 'success'],
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
