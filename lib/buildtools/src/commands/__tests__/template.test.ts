import fs from 'fs/promises';
import { expect, describe, test, it, vi, beforeEach, type MockedFunction } from 'vitest';

import * as manifest from '../../build/manifest';
import { askQuestion } from '../../templates/print';
import * as utils from '../../utils';
import getTemplateCommand from '../template';

vi.spyOn(utils, 'getBundlesDir').mockResolvedValue('/src/bundles');
vi.spyOn(utils, 'getTabsDir').mockResolvedValue('/src/tabs');

vi.mock('../../templates/print', async importActual => {
  const actualTemplates: any = await importActual();
  return ({
    ...actualTemplates,
    askQuestion: vi.fn(),
    error(x: string) {
      // The command has a catch-all for errors,
      // so we rethrow the error to observe the value
      throw new Error(x);
    },
    // Because the functions run in perpetual while loops
    // We need to throw an error to observe what value warn
    // was called with
    warn(x: string) {
      throw new Error(x);
    }
  });
});

vi.spyOn(manifest, 'getBundleManifests').mockResolvedValue({
  test0: { tabs: ['tab0'] },
  test1: {},
});

const asMock = <T extends (...args: any[]) => any>(func: T) => func as MockedFunction<T>;

const mockedAskQuestion = asMock(askQuestion);

function runCommand(...args: string[]) {
  return getTemplateCommand()
    .parseAsync(args, { from: 'user' });
}

function expectCall<T extends(...args: any) => any>(
  func: T,
  ...expected: Parameters<T>[]) {
  const mocked = asMock(func);

  expect(func)
    .toHaveBeenCalledTimes(expected.length);

  mocked.mock.calls.forEach((actual, i) => {
    expect(actual)
      .toEqual(expected[i]);
  });
}

async function expectCommandFailure(msg: string) {
  await expect(runCommand())
    .rejects
    .toThrowError(`ERROR: ${msg}`);

  expect(fs.writeFile).not.toHaveBeenCalled();
  expect(fs.copyFile).not.toHaveBeenCalled();
  expect(fs.mkdir).not.toHaveBeenCalled();
}

describe('Test adding new module', () => {
  beforeEach(() => {
    mockedAskQuestion.mockResolvedValueOnce('module');
  });

  it('should require camel case for module names', async () => {
    mockedAskQuestion.mockResolvedValueOnce('camelCase');
    await expectCommandFailure('Module names must be in snake case. (eg. binary_tree)');
  });

  it('should check for existing modules', async () => {
    mockedAskQuestion.mockResolvedValueOnce('test0');
    await expectCommandFailure('A module with the same name already exists.');
  });

  test('successfully adding a new module', async () => {
    mockedAskQuestion.mockResolvedValueOnce('new_module');
    await runCommand();

    expectCall(
      fs.mkdir,
      ['/src/bundles', { recursive: true }]
    );

    expectCall(
      fs.cp,
      [
        expect.any(String),
        '/src/bundles/new_module'
      ]
    );

    expect(fs.writeFile).toHaveBeenCalledTimes(2);

    const [
      [packagePath, rawPackage],
      [manifestPath, rawManifest]
    ] = asMock(fs.writeFile).mock.calls;

    expect(packagePath).toEqual('/src/bundles/new_module/package.json');
    const packageJson = JSON.parse(rawPackage as string);
    expect(packageJson.name).toEqual('@sourceacademy/bundle-new_module');

    expect(manifestPath).toEqual('/src/bundles/new_module/manifest.json');
    const manifest = JSON.parse(rawManifest as string);
    expect(manifest).toMatchObject({
      tabs: []
    });
  });
});

describe('Test adding new tab', () => {
  beforeEach(() => {
    mockedAskQuestion.mockResolvedValueOnce('tab');
  });

  it('should require pascal case for tab names', async () => {
    mockedAskQuestion.mockResolvedValueOnce('test0');
    mockedAskQuestion.mockResolvedValueOnce('unknown_tab');
    await expectCommandFailure('Tab names must be in pascal case. (eg. BinaryTree)');
  });

  it('should check if the given tab already exists', async () => {
    mockedAskQuestion.mockResolvedValueOnce('test0');
    mockedAskQuestion.mockResolvedValueOnce('tab0');
    await expectCommandFailure('A tab with the same name already exists.');
  });

  it('should check if the given module exists', async () => {
    mockedAskQuestion.mockResolvedValueOnce('unknown_module');
    await expectCommandFailure('Module unknown_module does not exist.');
  });

  test('Successfully adding new tab', async () => {
    mockedAskQuestion.mockResolvedValueOnce('test0');
    mockedAskQuestion.mockResolvedValueOnce('TabNew');

    await runCommand();

    expectCall(
      fs.mkdir,
      ['/src/tabs', { recursive: true }]
    );

    // Expect the entire template directory to be copied over
    expectCall(fs.cp, [expect.any(String), '/src/tabs/TabNew']);

    const [
      [packagePath, packageJsonRaw],
      [bundleManifestPath, manifestRaw]
    ] = asMock(fs.writeFile).mock.calls;

    // Expect that a package json was created
    expect(packagePath)
      .toEqual('/src/tabs/TabNew/package.json');

    const packageJson = JSON.parse(packageJsonRaw as string);
    expect(packageJson.name).toEqual('@sourceacademy/tab-TabNew');

    // Check that the corresponding bundle manifest was updated
    expect(bundleManifestPath).toEqual('/src/bundles/test0/manifest.json');
    const manifest = JSON.parse(manifestRaw as string);
    expect(manifest.tabs).toContain('TabNew');
  });
});
