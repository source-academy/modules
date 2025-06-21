import { describe, test, expect } from 'vitest';
import { compareSeverity, findSeverity, type Severity } from '../utils.js';

describe('test findSeverity', () => {
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

describe('test compareSeverity', () => {
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
