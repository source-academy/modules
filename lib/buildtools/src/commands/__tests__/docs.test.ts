import fs from 'fs/promises';
import { resolve } from 'path';
import type { Command } from '@commander-js/extra-typings';
import { describe, expect, test, vi, type MockedFunction } from 'vitest';
import * as manifest from '../../build/manifest';
import { getBuildDocsCommand, getBuildJsonCommand } from '../build';

vi.spyOn(manifest, 'resolveSingleBundle');
vi.spyOn(manifest, 'resolveAllBundles');
vi.mock(import('../../utils'));

const testMocksDir = resolve(import.meta.dirname, '../../__test_mocks__');
const mockedResolveSingleBundle = manifest.resolveSingleBundle as MockedFunction<typeof manifest.resolveSingleBundle>;
const mockedResolveAllBundles = manifest.resolveAllBundles as MockedFunction<typeof manifest.resolveAllBundles>;

function getCommandRunner<T extends () => Command<any>>(getter: T) {
  return (...args: string[]) => {
    return getter().parseAsync(args, { from: 'user' });
  };
}

describe('Test JSON Command', () => {
  const runCommand = getCommandRunner(getBuildJsonCommand);

  test('Regular command execution', async () => {
    mockedResolveSingleBundle.mockResolvedValueOnce({
      name: 'test0',
      manifest: {
        tabs: ['tab0']
      },
      entryPoint: `${testMocksDir}/bundles/test0/index.ts`,
      directory: `${testMocksDir}/bundles/test0`,
    });

    await expect(runCommand('.')).resolves.not.toThrow();

    expect(fs.mkdir).toHaveBeenCalledWith('/build/jsons', { recursive: true });
  });
});

describe('Test Docs Command', () => {
  const runCommand = getCommandRunner(getBuildDocsCommand);

  test('Regular command execution', async () => {
    mockedResolveAllBundles.mockResolvedValueOnce({
      test0: {
        name: 'test0',
        manifest: {
          tabs: ['tab0']
        },
        entryPoint: `${testMocksDir}/bundles/test0/index.ts`,
        directory: `${testMocksDir}/bundles/test0`,
      }
    });

    await expect(runCommand()).resolves.not.toThrow();
    expect(fs.mkdir).toHaveBeenCalledWith('/build/jsons', { recursive: true });
  });
});
