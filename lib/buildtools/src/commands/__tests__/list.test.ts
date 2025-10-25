import fs from 'fs/promises';
import * as manifest from '@sourceacademy/modules-repotools/manifest';
import { describe, test, vi } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import { getListBundlesCommand, getListTabsCommand } from '../list.js';
import { getCommandRunner } from './testingUtils.js';

const mockedConsoleLog = vi.spyOn(console, 'log');
const mockedConsoleError = vi.spyOn(console, 'error');

describe('Test list command with bundles', () => {
  const mockedResolveAllBundles = vi.spyOn(manifest, 'resolveAllBundles');

  const runCommand = getCommandRunner(getListBundlesCommand);

  test('Running command with no arguments', async ({ expect }) => {
    await expect(runCommand()).commandSuccess();
    expect(console.log).toHaveBeenCalledTimes(1);
    const [[data]] = mockedConsoleLog.mock.calls;
    expect(data).toMatch(/^Detected 2 bundles in .+:\n1. test0\n2. test1$/);
  });

  test('Running command when bundles directory has no bundles', async ({ expect }) => {
    mockedResolveAllBundles.mockResolvedValueOnce({
      severity: 'success',
      bundles: {}
    });
    await expect(runCommand()).commandExit();

    expect(console.error).toHaveBeenCalledTimes(1);
    const [[data]] = mockedConsoleError.mock.calls;
    expect(data).toMatch(/^No bundles in .+$/);
  });

  test('Running command in a directory that doesn\'t have a bundle', ({ expect }) => {
    mockedResolveAllBundles.mockResolvedValueOnce({
      severity: 'success',
      bundles: {}
    });

    return expect(runCommand('somewhere')).commandExit();
  });

  test('Bundle verification failure for a single bundle, but when reading all bundles', async ({ expect }) => {
    const mockedReadFile = vi.spyOn(fs, 'readFile');

    mockedReadFile.mockResolvedValueOnce(`{
      "tabs": [],
      "extraProperty": ""
    }`);

    mockedReadFile.mockResolvedValueOnce(`{
      "version": "1.0.0"
    }`);

    await expect(runCommand()).commandExit();
  });
});

describe('Test list command with tabs', () => {
  const mockedResolveSingleTab = vi.spyOn(manifest, 'resolveSingleTab');
  const mockedResolveAllTabs = vi.spyOn(manifest, 'resolveAllTabs');

  const runCommand = getCommandRunner(getListTabsCommand);

  test('Running command with no arguments', async ({ expect }) => {
    await expect(runCommand()).commandSuccess();

    expect(console.log).toHaveBeenCalledTimes(1);
    const [[data]] = mockedConsoleLog.mock.calls;
    expect(data).toMatch(/^Detected 2 tabs in .+:\n1. tab0\n2. tab1$/);
  });

  test('Running command when tabs directory has no tabs', async ({ expect }) => {
    mockedResolveAllTabs.mockResolvedValueOnce({
      severity: 'success',
      tabs: {}
    });
    await expect(runCommand()).commandExit();

    expect(console.error).toHaveBeenCalledTimes(1);
    const [[data]] = mockedConsoleError.mock.calls;
    expect(data).toMatch(/^No tabs in .+$/);
  });

  test('Running command in a directory that doesn\'t have a tab', ({ expect }) => {
    mockedResolveSingleTab.mockResolvedValueOnce(undefined);
    return expect(runCommand('somewhere')).commandExit();
  });

  test('Running command in a directory that has a tab', async ({ expect }) => {
    await expect(runCommand(`${testMocksDir}/tabs/tab0`)).commandSuccess();

    expect(console.log).toHaveBeenCalledTimes(1);
    const [[data]] = mockedConsoleLog.mock.calls;
    expect(data).toMatch(/^Tab 'tab0' found in .+$/);
  });
});
