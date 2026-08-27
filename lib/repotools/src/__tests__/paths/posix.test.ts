import { describe, expect, test, vi } from 'vitest';
import { convertToPosixPath, isSamePath } from '../../utils.js';

type TestCase = [lhs: string, rhs: string, expected: boolean];

vi.mock(import('path'), async importOriginal => {
  const { default: { posix } } = await importOriginal();
  return {
    default: posix
  };
});

describe('Test isSamePath with posix paths', () => {
  const runTests = (testCases: TestCase[]) => test.each(testCases)('%#', (lhs, rhs, expected) => {
    expect(isSamePath(lhs, rhs)).toEqual(expected);
  });

  runTests([
    ['/', '/dir1//..', true],
    ['/', '/dir1', false],
  ]);
});

describe('Test convertToPosixPath with posix paths', () => {
  test('Already posix paths remain unchanged', () => {
    const posixPath = '/usr/local/bin';
    expect(posixPath).toEqual(convertToPosixPath(posixPath));
  });
});
