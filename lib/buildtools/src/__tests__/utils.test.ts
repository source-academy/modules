import { describe, test, expect } from 'vitest';
import { findSeverity, type Severity } from '../utils';

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
