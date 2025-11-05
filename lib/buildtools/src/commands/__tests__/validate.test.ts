import fs from 'fs/promises';
import pathlib from 'path';
import * as manifest from '@sourceacademy/modules-repotools/manifest';
import { describe, test, vi } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import { getValidateCommand } from '../list.js';
import { getCommandRunner } from './testingUtils.js';

const mockedConsoleLog = vi.spyOn(console, 'log');
vi.spyOn(console, 'error');

describe('Test validate command', () => {
  const mockedResolveSingleBundle = vi.spyOn(manifest, 'resolveSingleBundle');

  const runCommand = getCommandRunner(getValidateCommand);

  test('Running command in a directory that does have a bundle', async ({ expect }) => {
    await expect(runCommand(`${testMocksDir}/bundles/test0`)).commandSuccess();

    expect(console.log).toHaveBeenCalledTimes(1);
    const [[data]] = mockedConsoleLog.mock.calls;
    const sanitized = (data as string).split('\n').join('');

    const match = /^.+:(\{.+\})$/gm.exec(sanitized);
    expect(match).not.toBeNull();

    const parsed = JSON.parse(match![1]);
    expect(parsed).toMatchObject({
      directory: pathlib.join(testMocksDir, 'bundles', 'test0'),
      manifest: {
        tabs: ['tab0']
      },
      name: 'test0'
    });
  });

  test('Running command in a directory with no bundle', async ({ expect }) => {
    mockedResolveSingleBundle.mockResolvedValueOnce(undefined);
    const path = `${testMocksDir}/bundles/test0`;
    await expect(runCommand(path)).commandExit();
    expect(console.error).toHaveBeenCalledExactlyOnceWith(`No bundle found at ${path}!`);
  });

  test('Bundle verification failure for a single bundle', async ({ expect }) => {
    vi.spyOn(fs, 'readFile').mockResolvedValueOnce(`{
      "tabs": [],
      "extraProperty": ""
    }`);

    await expect(runCommand(pathlib.join(testMocksDir, 'bundles', 'test0'))).commandExit();
  });
});
