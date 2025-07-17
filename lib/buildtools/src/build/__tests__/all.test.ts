import { afterEach, describe, expect, test, vi } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import * as docs from '../../build/docs/index.js';
import * as modules from '../../build/modules/index.js';
import { getCommandRunner } from '../../commands/__tests__/testingUtils.js';
import { getBuildAllCommand } from '../../commands/build.js';
import * as lint from '../../prebuild/lint.js';
import * as tsc from '../../prebuild/tsc.js';
import { Severity } from '../../types.js';
import * as all from '../all.js';

vi.mock(import('../../getGitRoot.js'));

vi.spyOn(all, 'buildAll');
const mockedBuildBundle = vi.spyOn(modules, 'buildBundle');
const mockedBuildTab = vi.spyOn(modules, 'buildTab');
const mockedBuildSingleBundleDocs = vi.spyOn(docs, 'buildSingleBundleDocs');

const mockedRunTsc = vi.spyOn(tsc, 'runTsc').mockResolvedValue({
  severity: Severity.SUCCESS,
  input: {} as any,
  results: [],
});

const mockedRunEslint = vi.spyOn(lint, 'runEslint').mockResolvedValue({
  severity: Severity.SUCCESS,
  formatted: '',
  input: {} as any
});

describe('Test the buildAll command', () => {
  const runCommand = getCommandRunner(getBuildAllCommand);

  afterEach(() => {
    expect(all.buildAll).toHaveBeenCalledTimes(1);
  });

  describe('Test command with a bundle', () => {
    const bundlePath = `${testMocksDir}/bundles/test0`;

    test('Regular execution for a bundle', async () => {
      mockedBuildBundle.mockResolvedValueOnce({
        severity: Severity.SUCCESS,
        type: 'bundle',
        path: '/build/bundles',
        input: {} as any
      });

      mockedBuildSingleBundleDocs.mockResolvedValueOnce({
        type: 'docs',
        severity: Severity.SUCCESS,
        path: '/build/jsons',
        input: {} as any,
      });

      await expect(runCommand(bundlePath)).commandSuccess();
    });

    test('Regular execution for a bundle with --tsc', async () => {
      mockedBuildBundle.mockResolvedValueOnce({
        severity: Severity.SUCCESS,
        type: 'bundle',
        path: '/build/bundles',
        input: {} as any
      });

      mockedBuildSingleBundleDocs.mockResolvedValueOnce({
        type: 'docs',
        severity: Severity.SUCCESS,
        path: '/build/jsons',
        input: {} as any,
      });

      await expect(runCommand(bundlePath, '--tsc')).commandSuccess();
      expect(tsc.runTsc).toHaveBeenCalledTimes(1);
    });

    test('Regular execution for a bundle with --lint', async () => {
      mockedBuildBundle.mockResolvedValueOnce({
        severity: Severity.SUCCESS,
        type: 'bundle',
        path: '/build/bundles',
        input: {} as any
      });

      mockedBuildSingleBundleDocs.mockResolvedValueOnce({
        type: 'docs',
        severity: Severity.SUCCESS,
        path: '/build/jsons',
        input: {} as any,
      });

      await expect(runCommand(bundlePath, '--lint')).commandSuccess();
      expect(lint.runEslint).toHaveBeenCalledTimes(1);
    });

    test('Lint error should avoid building bundle and json', async () => {
      mockedRunEslint.mockResolvedValueOnce({
        severity: Severity.ERROR,
        input: {} as any,
        formatted: ''
      });

      await expect(runCommand(bundlePath, '--lint')).commandExit();

      expect(lint.runEslint).toHaveBeenCalledTimes(1);
      expect(modules.buildBundle).not.toHaveBeenCalled();
      expect(docs.buildSingleBundleDocs).not.toHaveBeenCalled();
    });

    test('Tsc error should avoid building bundle and json', async () => {
      mockedRunTsc.mockResolvedValueOnce({
        severity: Severity.ERROR,
        input: {} as any,
        results: []
      });

      await expect(runCommand(bundlePath, '--tsc')).commandExit();

      expect(tsc.runTsc).toHaveBeenCalledTimes(1);
      expect(modules.buildBundle).not.toHaveBeenCalled();
      expect(docs.buildSingleBundleDocs).not.toHaveBeenCalled();
    });

    test('Bundle error doesn\'t affect building json', async () => {
      mockedBuildBundle.mockResolvedValueOnce({
        severity: Severity.ERROR,
        type: 'bundle',
        input: {} as any,
        errors: []
      });

      mockedBuildSingleBundleDocs.mockResolvedValueOnce({
        type: 'docs',
        severity: Severity.SUCCESS,
        path: '/build/jsons',
        input: {} as any,
      });

      await expect(runCommand(bundlePath)).commandExit();

      expect(modules.buildBundle).toHaveBeenCalledTimes(1);
      expect(docs.buildSingleBundleDocs).toHaveBeenCalledTimes(1);
    });

    test('JSON error doesn\'t affect building bundle', async () => {
      mockedBuildBundle.mockResolvedValueOnce({
        severity: Severity.SUCCESS,
        type: 'bundle',
        path: '/build/bundles',
        input: {} as any
      });

      mockedBuildSingleBundleDocs.mockResolvedValueOnce({
        type: 'docs',
        severity: Severity.ERROR,
        errors: [],
        input: {} as any,
      });

      await expect(runCommand(bundlePath)).commandExit();

      expect(modules.buildBundle).toHaveBeenCalledTimes(1);
      expect(docs.buildSingleBundleDocs).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test command with a tab', () => {
    const tabPath = `${testMocksDir}/tabs/tab0`;

    test('Regular execution for a tab', async () => {
      mockedBuildTab.mockResolvedValueOnce({
        type: 'tab',
        severity: Severity.SUCCESS,
        input: {} as any,
        path: '/build/tabs',
      });

      await expect(runCommand(tabPath)).commandSuccess();
    });

    test('Regular execution for a tab with --tsc', async () => {
      mockedBuildTab.mockResolvedValueOnce({
        type: 'tab',
        severity: Severity.SUCCESS,
        input: {} as any,
        path: '/build/tabs',
      });

      await expect(runCommand(tabPath, '--tsc')).commandSuccess();
      expect(tsc.runTsc).toHaveBeenCalledTimes(1);
    });

    test('Regular execution for a tab with --lint', async () => {
      mockedBuildTab.mockResolvedValueOnce({
        type: 'tab',
        severity: Severity.SUCCESS,
        input: {} as any,
        path: '/build/tabs',
      });

      await expect(runCommand(tabPath, '--lint')).commandSuccess();
      expect(lint.runEslint).toHaveBeenCalledTimes(1);
    });

    test('Lint error should avoid building tab', async () => {
      mockedRunEslint.mockResolvedValueOnce({
        severity: Severity.ERROR,
        input: {} as any,
        formatted: ''
      });

      await expect(runCommand(tabPath, '--lint')).commandExit();

      expect(lint.runEslint).toHaveBeenCalledTimes(1);
      expect(modules.buildTab).not.toHaveBeenCalled();
    });

    test('Tsc error should avoid building tab', async () => {
      mockedRunTsc.mockResolvedValueOnce({
        severity: Severity.ERROR,
        input: {} as any,
        results: []
      });

      await expect(runCommand(tabPath, '--tsc')).commandExit();

      expect(tsc.runTsc).toHaveBeenCalledTimes(1);
      expect(modules.buildTab).not.toHaveBeenCalled();
    });
  });
});
