import { ESLint } from 'eslint';
import { beforeEach, vi, expect, describe, test } from 'vitest';
import * as manifest from '../../build/manifest/index.js';
import * as utils from '../../getGitRoot.js';
import { getLintCommand } from '../prebuild.js';
import { getCommandRunner } from './testingUtils.js';

const lintFilesMock = vi.hoisted(() => vi.fn());

vi.spyOn(utils, 'getGitRoot').mockResolvedValue('/');

const mockedResolveEither = vi.spyOn(manifest, 'resolveEitherBundleOrTab');

vi.mock(import('eslint'), async importActual => {
  const actualEslint = await importActual();
  return {
    ...actualEslint,
    ESLint: class {
      public fix: boolean;

      constructor({ fix }: { fix: boolean }) {
        this.fix = fix;
      }

      static outputFixes = vi.fn(() => Promise.resolve());
      lintFiles = lintFilesMock;
      loadFormatter = () => Promise.resolve({
        format: () => Promise.resolve('')
      });
    } as any
  };
});

const runCommand = getCommandRunner(getLintCommand);
describe('Test Lint Command', () => {
  beforeEach(() => {
    mockedResolveEither.mockResolvedValueOnce({
      type: 'bundle',
      directory: '',
      manifest: {},
      name: 'test0'
    });
  });

  test('Fatal errors without --fix cause errors', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      fatalErrorCount: 1
    }]);

    await expect(runCommand()).commandExit();
  });

  test('Fatal errors with --fix cause errors', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      fatalErrorCount: 1
    }]);

    await expect(runCommand('--fix')).commandExit();
    expect(ESLint.outputFixes).toHaveBeenCalledTimes(1);
  });

  test('Non fatal errors without --fix cause errors', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      errorCount: 1
    }]);

    await expect(runCommand()).commandExit();
  });

  test('Non fatal errors with --fix does not call process.exit', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      errorCount: 1
    }]);

    await expect(runCommand('--fix')).commandSuccess();
    expect(ESLint.outputFixes).toHaveBeenCalledTimes(1);
  });

  test.skipIf(!!process.env.CI)('Warnings outside of ci mode should not error out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 0
    }]);

    await expect(runCommand()).commandSuccess();
  });

  test('Warnings in ci mode should error out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 0
    }]);

    await expect(runCommand('--ci')).commandExit();
  });

  test.skipIf(!!process.env.CI)('Fixable Warnings outside of ci mode should not error out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 1
    }]);

    await expect(runCommand()).commandSuccess();
  });

  test('Fixable Warnings with --fix do not errors out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 1
    }]);

    await expect(runCommand('--fix')).commandSuccess();
    expect(ESLint.outputFixes).toHaveBeenCalledTimes(1);
  });

  test('Fixable Warnings with --fix and --ci do not error out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 1
    }]);

    await expect(runCommand('--fix', '--ci')).commandSuccess();
    expect(ESLint.outputFixes).toHaveBeenCalledTimes(1);
  });
});

describe('Test Lint command directory resolution', () => {
  test('Lint command resolving a tab', async () => {
    mockedResolveEither.mockResolvedValueOnce({
      type: 'tab',
      directory: '',
      entryPoint: '',
      name: 'tab0'
    });
    lintFilesMock.mockResolvedValueOnce([{ warningCount: 0 }]);
    await expect(runCommand()).commandSuccess();
  });

  test('Lint command resolving neither', async () => {
    mockedResolveEither.mockResolvedValueOnce(undefined);
    await expect(runCommand()).commandExit();
    expect(lintFilesMock).not.toHaveBeenCalled();
  });
});
