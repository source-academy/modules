import pathlib from 'path';
import { bundlesDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { ResolvedBundle, ResolvedTab } from '@sourceacademy/modules-repotools/types';
import { describe, expect, test, vi } from 'vitest';
import * as tsc from '../../build/modules/tsc.js';
import { getCompileCommand } from '../build.js';
import { getCommandRunner } from './testingUtils.js';

const mockedTscCompile = vi.spyOn(tsc, 'runTscCompile');

describe('Test compile command', () => {
  const runCommand = getCommandRunner(getCompileCommand);

  test('Compile a bundle successfully', async () => {
    const inputBundle: ResolvedBundle = {
      directory: pathlib.join(bundlesDir, 'test0'),
      name: 'test0',
      manifest: {},
      type: 'bundle'
    };

    mockedTscCompile.mockResolvedValueOnce({
      severity: 'success',
      results: [],
      input: inputBundle
    });

    await expect(runCommand(inputBundle.directory)).commandSuccess();
    expect(mockedTscCompile).toHaveBeenCalledOnce();
  });

  test('Compile a tab', async () => {
    const tabDir = pathlib.join(tabsDir, 'tab0');
    const inputTab: ResolvedTab = {
      type: 'tab',
      directory: tabDir,
      entryPoint: pathlib.join(tabDir, 'src', 'index.tsx'),
      name: 'tab0'
    };

    await expect(runCommand(inputTab.directory)).commandExit();
    expect(mockedTscCompile).not.toHaveBeenCalled();
  });
});
