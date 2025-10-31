import fs from 'fs/promises';
import { describe, expect, it, test, vi } from 'vitest';
import { isTestDirectory } from '../testing/index.js';
import * as loader from '../testing/loader.js';
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

describe(isTestDirectory, () => {
  const mockedFsGlob = vi.spyOn(fs, 'glob');
  const mockedLoader = vi.spyOn(loader, 'default').mockResolvedValue(null);

  function mockGlobTestsOnce(retValue: boolean) {
    mockedFsGlob.mockImplementationOnce(retValue ? async function* () {
      yield Promise.resolve('');
      // eslint-disable-next-line require-yield, @typescript-eslint/require-await
    } : async function* () {
      return;
    });
  }

  it('Returns true when there are files that match the glob', async () => {
    mockGlobTestsOnce(true);

    await expect(isTestDirectory('')).resolves.toEqual(true);
    expect(fs.glob).toHaveBeenCalledOnce();
  });

  it('Returns false when there are no files that match the glob', async () => {
    mockGlobTestsOnce(false);

    await expect(isTestDirectory('')).resolves.toEqual(false);
    expect(fs.glob).toHaveBeenCalledOnce();
  });

  it('Returns true if there is a vitest config', async () => {
    mockedLoader.mockResolvedValueOnce({} as any);

    await expect(isTestDirectory('')).resolves.toEqual(true);
    expect(fs.glob).not.toHaveBeenCalled();
  });
});
