import fs from 'fs/promises';
import type { MockedFunction } from 'jest-mock';
import { retrieveManifest } from '@src/manifest';

import getTemplateCommand from '..';
import { askQuestion } from '../print';

jest.mock('../print', () => ({
  ...jest.requireActual('../print'),
  askQuestion: jest.fn(),
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
}));

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

async function expectCommandFailure(snapshot: string) {
  await expect(runCommand())
    .rejects
    // eslint-disable-next-line jest/no-interpolation-in-snapshots
    .toMatchInlineSnapshot(`[Error: ERROR: ${snapshot}]`);

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
      ['src/bundles/new_module', { recursive: true }]
    );

    expectCall(
      fs.copyFile,
      [
        './scripts/src/templates/templates/__bundle__.ts',
        'src/bundles/new_module/index.ts'
      ]
    );

    const oldManifest = await retrieveManifest('modules.json');
    const [[manifestPath, newManifest]] = asMock(fs.writeFile).mock.calls;
    expect(manifestPath)
      .toEqual('modules.json');

    expect(JSON.parse(newManifest as string))
      .toMatchObject({
        ...oldManifest,
        new_module: { tabs: [] }
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
      ['src/tabs/TabNew', { recursive: true }]
    );

    expectCall(
      fs.copyFile,
      [
        './scripts/src/templates/templates/__tab__.tsx',
        'src/tabs/TabNew/index.tsx'
      ]
    );

    const oldManifest = await retrieveManifest('modules.json');
    const [[manifestPath, newManifest]] = asMock(fs.writeFile).mock.calls;
    expect(manifestPath)
      .toEqual('modules.json');

    expect(JSON.parse(newManifest as string))
      .toMatchObject({
        ...oldManifest,
        test0: {
          tabs: ['tab0', 'TabNew']
        }
      });
  });
});
