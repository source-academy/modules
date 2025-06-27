import { describe, expect, test, vi } from 'vitest';
import * as html from '../../build/docs/html.js';
import * as json from '../../build/docs/json.js';
import * as manifest from '../../build/manifest/index.js';
import * as bundles from '../../build/modules/bundle.js';
import * as tabs from '../../build/modules/tab.js';
import * as lint from '../../prebuild/lint.js';
import * as tsc from '../../prebuild/tsc.js';
import type { Severity } from '../../utils.js';
import { getBuildAllCommand } from '../build.js';
import { getCommandRunner } from './testingUtils.js';

vi.mock(import('../../getGitRoot.js'));

vi.spyOn(bundles, 'buildBundle').mockImplementation((outDir, bundle) => Promise.resolve({
  severity: 'success',
  assetType: 'bundle',
  inputName: bundle.name,
  message: ''
}));

vi.spyOn(tabs, 'buildTab').mockImplementation((outDir, tab) => Promise.resolve({
  severity: 'success',
  assetType: 'tab',
  inputName: tab.name,
  message: ''
}));

vi.spyOn(json, 'buildJson').mockResolvedValue([]);
vi.spyOn(html, 'buildHtml').mockResolvedValue({
  severity: 'success',
  assetType: 'html',
  message: ''
});

vi.spyOn(manifest, 'writeManifest').mockResolvedValue({
  severity: 'success',
  assetType: 'manifest',
  message: ''
});

const mockedEslint = vi.spyOn(lint, 'runEslint').mockImplementation(input => Promise.resolve({
  severity: 'success',
  formatted: '',
  input
}));

const mockedTsc = vi.spyOn(tsc, 'runTsc').mockImplementation(input => Promise.resolve({
  severity: 'success',
  results: [],
  input
}));

describe('Test build:all command', () => {
  const runCommand = getCommandRunner(getBuildAllCommand);

  test('Regular command execution', { timeout: 10000 }, async () => {
    await expect(runCommand()).commandSuccess();

    // Two bundles, so two calls to buildBundle
    expect(bundles.buildBundle).toHaveBeenCalledTimes(2);

    // Two tabs, so two calls to buildTab
    expect(tabs.buildTab).toHaveBeenCalledTimes(2);

    // Two bundles, so two calls to buildJson
    expect(json.buildJson).toHaveBeenCalledTimes(2);

    expect(html.buildHtml).toHaveBeenCalledTimes(1);
    expect(manifest.writeManifest).toHaveBeenCalledTimes(1);
  });

  test('Regular command execution with lint', async () => {
    await expect(runCommand('--lint')).commandSuccess();

    // Two bundles, so two calls to buildBundle
    expect(bundles.buildBundle).toHaveBeenCalledTimes(2);

    // Two tabs, so two calls to buildTab
    expect(tabs.buildTab).toHaveBeenCalledTimes(2);

    // Two bundles, so two calls to buildJson
    expect(json.buildJson).toHaveBeenCalledTimes(2);

    expect(html.buildHtml).toHaveBeenCalledTimes(1);
    expect(manifest.writeManifest).toHaveBeenCalledTimes(1);

    // Called 4 times, 2 bundles + 2 tabs
    expect(lint.runEslint).toHaveBeenCalledTimes(4);
  });

  test('Regular command execution with tsc', async () => {
    await expect(runCommand('--tsc')).commandSuccess();

    // Two bundles, so two calls to buildBundle
    expect(bundles.buildBundle).toHaveBeenCalledTimes(2);

    // Two tabs, so two calls to buildTab
    expect(tabs.buildTab).toHaveBeenCalledTimes(2);

    // Two bundles, so two calls to buildJson
    expect(json.buildJson).toHaveBeenCalledTimes(2);

    expect(html.buildHtml).toHaveBeenCalledTimes(1);
    expect(manifest.writeManifest).toHaveBeenCalledTimes(1);

    // Called 4 times, 2 bundles + 2 tabs
    expect(tsc.runTsc).toHaveBeenCalledTimes(4);
  });

  test('Command execution with linting error', async () => {
    mockedEslint.mockImplementationOnce(input => Promise.resolve({
      severity: 'error' as Severity,
      input,
      formatted: ''
    }));

    await expect(runCommand('--lint')).commandExit();
  });

  test('Command execution with tsc error', async () => {
    mockedTsc.mockImplementationOnce(input => Promise.resolve({
      severity: 'error' as Severity,
      input,
      results: []
    }));

    await expect(runCommand('--tsc')).commandExit();
  });
});
