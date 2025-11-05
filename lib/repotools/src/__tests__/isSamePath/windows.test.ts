import { describe, expect, test, vi } from 'vitest';
import { isSamePath } from '../../utils.js';

type TestCase = [lhs: string, rhs: string, expected: boolean];

vi.mock(import('path'), async importOriginal => {
  const { default: { win32 } } = await importOriginal();
  return {
    default: win32
  };
});

describe('Test isSamePath with Windows pathlib', () => {
  const runTests = (testCases: TestCase[]) => test.each(testCases)('%#', (lhs, rhs, expected) => {
    expect(isSamePath(lhs, rhs)).toEqual(expected);
  });

  runTests([
    ['C:\\', 'C:\\dir1\\..', true],
    ['C:\\', 'C:\\dir1', false],
  ]);

});
