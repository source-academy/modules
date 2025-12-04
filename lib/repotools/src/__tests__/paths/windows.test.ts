import { describe, expect, test, vi } from 'vitest';
import { convertToPosixPath, isSamePath } from '../../utils.js';

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

describe('Test convertToPosixPath with Windows paths', () => {
  test('Converts Windows paths to posix paths', () => {
    const windowsPath = 'C:\\usr\\local\\bin';
    const expectedPosixPath = '/C/usr/local/bin';
    expect(convertToPosixPath(windowsPath)).toEqual(expectedPosixPath);
  });

  test('Already posix paths remain unchanged', () => {
    const posixPath = '/usr/local/bin';
    expect(posixPath).toEqual(convertToPosixPath(posixPath));
  });

  test('Ignores root slash', () => {
    expect(convertToPosixPath('/')).toEqual('/');
  });

  test('Converts Windows root paths correctly', () => {
    expect(convertToPosixPath('D:\\')).toEqual('/D');
  });
});
