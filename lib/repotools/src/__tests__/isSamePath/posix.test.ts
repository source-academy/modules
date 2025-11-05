import { describe, expect, test, vi } from 'vitest';
import { isSamePath } from '../../utils.js';

type TestCase = [lhs: string, rhs: string, expected: boolean];

vi.mock(import('path'), async importOriginal => {
  const { default: { posix } } = await importOriginal();
  return {
    default: posix
  };
});

describe('Test isSamePath with Windows paths', () => {
  const runTests = (testCases: TestCase[]) => test.each(testCases)('%#', (lhs, rhs, expected) => {
    expect(isSamePath(lhs, rhs)).toEqual(expected);
  });

  runTests([
    ['/', '/dir1//..', true],
    ['/', '/dir1', false],
  ]);
});
