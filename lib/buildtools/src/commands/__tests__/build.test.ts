import fs from 'fs/promises';
import pathlib from 'path';
import type { Command } from '@commander-js/extra-typings';
import type { BuildResult, Severity } from '@sourceacademy/modules-repotools/types';
import { beforeEach, describe, expect, test, vi, type MockInstance } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import * as json from '../../build/docs/json.js';
import * as modules from '../../build/modules/index.js';
import * as lintRunner from '../../prebuild/lint.js';
import * as tscRunner from '../../../../repotools/src/tsc.js';
import * as commands from '../build.js';
import { getCommandRunner } from './testingUtils.js';

const mockedRunEslint = vi.spyOn(lintRunner, 'runEslint');
const mockedRunTsc = vi.spyOn(tscRunner, 'runTsc');

vi.mock(import('typedoc'), async importOriginal => {
  const original = await importOriginal();

  // @ts-expect-error Just ignore the fact that the class isn't supposed to be extended :)
  class NewApplication extends original.Application {
    static bootstrapWithPlugins: typeof original.Application.bootstrapWithPlugins = async (options, readers) => {
      const app = await original.Application.bootstrapWithPlugins(options, readers);
      app.generateJson = () => Promise.resolve();
      return app;
    };
  }

  return {
    ...original,
    Application: NewApplication
  };
});

/**
 * Convenience function for mocking return values
 */
function mockResolvedValueOnce<T extends BuildResult>(
  mockInstance: MockInstance<(...args: any[]) => Promise<T>>,
  severity: Severity
) {
  mockInstance.mockResolvedValueOnce({
    severity,
    warnings: [],
    errors: []
  } as any);
}

type BuildFunctionsFilter<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<BuildResult> ? K : never
};

/**
 * @param commandName Descriptive string name used in `describe`.
 * @param getter Function that returns the command handler
 * @param obj Import object
 * @param funcName Name of the function to test
 * @param prebuild Prebuild options. Use to configure whether to test with tsc or ESLint.
 * @param directories List of directories that we expect to be have been created with fs.mkdir
 * @param cmdArgs Arguments to pass to the command handler
 */
function testBuildCommand<T extends Record<string, any>>(
  commandName: string,
  getter: () => Command<any>,
  obj: T,
  funcName: BuildFunctionsFilter<T>[keyof BuildFunctionsFilter<T>],
  prebuild: boolean | { tsc?: boolean, lint?: boolean } = false,
  directories: string[] = [],
  ...cmdArgs: string[]
) {
  /**
   * Assert that the given directories were created/not created
   */
  function assertDirectories(created: boolean) {
    const { calls } = vi.mocked(fs.mkdir).mock;
    for (const directory of directories) {
      const callFound = calls.find(([actual]) => {
        const relpath = pathlib.relative(actual as string, `/build/${directory}`);
        return relpath === '';
      });

      if (created) {
        expect(callFound).not.toBeUndefined();
        expect(callFound![1]).toEqual({ recursive: true });
      } else {
        expect(callFound).toBeUndefined();
      }
    }
  }

  describe(`Testing ${commandName} command`, { timeout: 10000 }, () => {
    const mockedBuilder = vi.spyOn(obj, funcName as any) as MockInstance<() => Promise<BuildResult>>;
    const builder = obj[funcName];
    const runCommand = getCommandRunner(getter);

    test('Regular command execution', async () => {
      mockResolvedValueOnce(mockedBuilder, 'success');
      await expect(runCommand(...cmdArgs)).commandSuccess();
      expect(builder).toHaveBeenCalledTimes(1);
      assertDirectories(true);
    });

    test('Command execution that returns errors', async () => {
      mockResolvedValueOnce(mockedBuilder, 'error');
      await expect(runCommand(...cmdArgs)).commandExit();
      expect(builder).toHaveBeenCalledTimes(1);
      assertDirectories(true);
    });

    test.skipIf(!!process.env.CI)('Command execution that returns warnings', async () => {
      mockResolvedValueOnce(mockedBuilder, 'warn');
      await expect(runCommand(...cmdArgs)).commandSuccess();
      expect(builder).toHaveBeenCalledTimes(1);
      assertDirectories(true);
    });

    test('Command execution that returns warnings in CI mode', async () => {
      vi.stubEnv('CI', 'yeet');
      try {
        mockResolvedValueOnce(mockedBuilder, 'warn');
        await expect(runCommand(...cmdArgs)).commandExit();
        expect(builder).toHaveBeenCalledTimes(1);
        assertDirectories(true);
      } finally {
        vi.unstubAllEnvs();
      }
    });

    let tsc: boolean | undefined;
    let lint: boolean | undefined;
    if (typeof prebuild === 'boolean') {
      tsc = lint = prebuild;
    } else {
      ; ({ tsc, lint } = prebuild);
    }

    if (lint) {
      describe('Testing command with --lint', () => {
        beforeEach(() => {
          mockResolvedValueOnce(mockedBuilder, 'success');
        });

        test('Command execution with --lint', async () => {
          mockedRunEslint.mockResolvedValueOnce({
            severity: 'success',
            formatted: '',
            input: {} as any
          });
          await expect(runCommand(...cmdArgs, '--lint')).commandSuccess();

          expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(1);
          assertDirectories(true);
        });

        test('Command execution with linting errors', async () => {
          mockedRunEslint.mockResolvedValueOnce({
            severity: 'error',
            formatted: '',
            input: {} as any
          });
          await expect(runCommand(...cmdArgs, '--lint')).commandExit();
          expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(0);
          assertDirectories(false);
        });

        test.skipIf(!!process.env.CI)('Command execution with linting warnings', async () => {
          mockedRunEslint.mockResolvedValueOnce({
            severity: 'warn',
            formatted: '',
            input: {} as any
          });
          await expect(runCommand(...cmdArgs, '--lint')).commandSuccess();
          expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(1);
          assertDirectories(true);
        });

        test('Command execution with linting warnings in CI mode', async () => {
          vi.stubEnv('CI', 'yeet');
          try {
            mockedRunEslint.mockResolvedValueOnce({
              severity: 'warn',
              formatted: '',
              input: {} as any
            });
            await expect(runCommand(...cmdArgs, '--lint')).commandExit();
            expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
            expect(mockedBuilder).toHaveBeenCalledTimes(0);
            assertDirectories(false);
          } finally {
            vi.unstubAllEnvs();
          }
        });
      });
    }

    if (tsc) {
      describe('Testing command with --tsc', () => {
        beforeEach(() => {
          mockResolvedValueOnce(mockedBuilder, 'success');
        });

        test('Testing command with --tsc', async () => {
          mockedRunTsc.mockResolvedValueOnce({
            severity: 'success',
            results: [],
            input: {} as any
          });
          await expect(runCommand(...cmdArgs, '--tsc')).commandSuccess();
          expect(tscRunner.runTsc).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(1);
          assertDirectories(true);
        });

        test('Testing command with tsc errors', async () => {
          mockedRunTsc.mockResolvedValueOnce({
            severity: 'error',
            results: [],
            input: {} as any
          });
          await expect(runCommand(...cmdArgs, '--tsc')).commandExit();
          expect(tscRunner.runTsc).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(0);
          assertDirectories(false);
        });

        test.skipIf(!!process.env.CI)('Testing command with tsc warnings', async () => {
          mockedRunTsc.mockResolvedValueOnce({
            severity: 'warn',
            results: [],
            input: {} as any
          });
          await expect(runCommand(...cmdArgs, '--tsc')).commandSuccess();
          expect(tscRunner.runTsc).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(1);
          assertDirectories(true);
        });

        test('Testing command with tsc warnings in CI mode', async () => {
          vi.stubEnv('CI', 'yeet');
          try {
            mockedRunTsc.mockResolvedValueOnce({
              severity: 'warn',
              results: [],
              input: {} as any
            });
            await expect(runCommand(...cmdArgs, '--tsc')).commandExit();
            expect(tscRunner.runTsc).toHaveBeenCalledTimes(1);
            expect(mockedBuilder).toHaveBeenCalledTimes(0);
            assertDirectories(false);
          } finally {
            vi.unstubAllEnvs();
          }
        });
      });
    }

    if (lint && tsc) {
      test('Check that specifying both --tsc and --lint works', async () => {
        mockResolvedValueOnce(mockedBuilder, 'success');
        mockedRunTsc.mockResolvedValueOnce({
          severity: 'success',
          results: [],
          input: {} as any
        });
        mockedRunEslint.mockResolvedValueOnce({
          severity: 'success',
          formatted: '',
          input: {} as any
        });
        await expect(runCommand(...cmdArgs, '--lint', '--tsc')).commandSuccess();

        expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
        expect(tscRunner.runTsc).toHaveBeenCalledTimes(1);
        expect(mockedBuilder).toHaveBeenCalledTimes(1);
        assertDirectories(true);
      });
    }
  });
}

testBuildCommand('Docs', commands.getBuildDocsCommand, json, 'buildJson', false, ['jsons'], `${testMocksDir}/bundles/test0`);
testBuildCommand('Bundles', commands.getBuildBundleCommand, modules, 'buildBundle', true, ['bundles'], `${testMocksDir}/bundles/test0`);
testBuildCommand('Tabs', commands.getBuildTabCommand, modules, 'buildTab', true, ['tabs'], `${testMocksDir}/tabs/tab0`);
