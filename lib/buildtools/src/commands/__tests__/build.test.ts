import fs from 'fs/promises';
import type { Command } from '@commander-js/extra-typings';
import { beforeEach, describe, expect, test, vi, type MockInstance } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import * as docs from '../../build/docs/index.js';
import * as modules from '../../build/modules/index.js';
import * as lintRunner from '../../prebuild/lint.js';
import * as tscRunner from '../../prebuild/tsc.js';
import type { ResultEntry } from '../../types.js';
import type { Severity } from '../../utils.js';
import * as commands from '../build.js';
import * as commandUtils from '../commandUtils.js';
import { expectCommandExit, expectCommandSuccess, getCommandRunner } from './testingUtils.js';

vi.unmock(import('fs/promises'));
vi.spyOn(fs, 'mkdir').mockResolvedValue(undefined);

const mockedRunEslint = vi.spyOn(lintRunner, 'runEslint');
const mockedRunTsc = vi.spyOn(tscRunner, 'runTsc');

vi.mock(import('../../getGitRoot.js'));
vi.spyOn(commandUtils, 'getResultString').mockReturnValue('');

/**
 * Convenience function for mocking return values
 */
function mockResolvedValueOnce<T extends ResultEntry>(
  mockInstance: MockInstance<(...args: any[]) => Promise<T[]>>,
  severity: Severity
) {
  mockInstance.mockResolvedValueOnce([{
    severity,
    messages: []
  } as any]);
}

type BuildFunctionsFilter<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<ResultEntry | ResultEntry[]> ? K : never
};

function testBuildCommand<T extends Record<string, any>>(
  commandName: string,
  getter: () => Command<any>,
  obj: T,
  funcName: BuildFunctionsFilter<T>[keyof BuildFunctionsFilter<T>],
  prebuild: boolean | { tsc?: boolean, lint?: boolean } = false,
  directories: string[] = [],
  ...cmdArgs: string[]
) {
  function assertDirectories(created: boolean) {
    for (const directory of directories) {
      if (created) {
        expect(fs.mkdir).toHaveBeenCalledWith(`/build/${directory}`, { recursive: true });
      } else {
        expect(fs.mkdir).not.toHaveBeenCalledWith(`/build/${directory}`, { recursive: true });
      }
    }
  }

  describe(`Testing ${commandName} command`, () => {
    const mockedBuilder = vi.spyOn(obj, funcName as any);
    const builder = obj[funcName];
    const runCommand = getCommandRunner(getter);

    test('Regular command execution', async () => {
      mockResolvedValueOnce(mockedBuilder, 'success');
      await expectCommandSuccess(runCommand(...cmdArgs));
      expect(builder).toHaveBeenCalledTimes(1);
      assertDirectories(true);
    });

    test('Command execution that returns errors', async () => {
      mockResolvedValueOnce(mockedBuilder, 'error');
      await expectCommandExit(runCommand(...cmdArgs));
      expect(builder).toHaveBeenCalledTimes(1);
      assertDirectories(true);
    });

    test('Command execution that returns warnings', async () => {
      mockResolvedValueOnce(mockedBuilder, 'warn');
      expect(process.env.CI).toBeUndefined();
      await expectCommandSuccess(runCommand(...cmdArgs));
      expect(builder).toHaveBeenCalledTimes(1);
      assertDirectories(true);
    });

    test('Command execution that returns warnings in CI mode', async () => {
      vi.stubEnv('CI', 'yeet');
      try {
        mockResolvedValueOnce(mockedBuilder, 'warn');
        await expectCommandExit(runCommand(...cmdArgs));
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
      ;({ tsc, lint } = prebuild);
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
          await expectCommandSuccess(runCommand(...cmdArgs, '--lint'));

          expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(1);
          assertDirectories(true);
        });

        test('Bundle command with linting errors', async () => {
          mockedRunEslint.mockResolvedValueOnce({
            severity: 'error',
            formatted: '',
            input: {} as any
          });
          await expectCommandExit(runCommand(...cmdArgs, '--lint'));
          expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(0);
          assertDirectories(false);
        });

        test('Bundle command with linting warnings', async () => {
          mockedRunEslint.mockResolvedValueOnce({
            severity: 'warn',
            formatted: '',
            input: {} as any
          });
          expect(process.env.CI).toBeUndefined();
          await expectCommandSuccess(runCommand(...cmdArgs, '--lint'));
          expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(1);
          assertDirectories(true);
        });

        test('Bundle command with linting warnings in CI mode', async () => {
          vi.stubEnv('CI', 'yeet');
          try {
            mockedRunEslint.mockResolvedValueOnce({
              severity: 'warn',
              formatted: '',
              input: {} as any
            });
            await expectCommandExit(runCommand(...cmdArgs, '--lint'));
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
          await expectCommandSuccess(runCommand(...cmdArgs, '--tsc'));
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
          await expectCommandExit(runCommand(...cmdArgs, '--tsc'));
          expect(tscRunner.runTsc).toHaveBeenCalledTimes(1);
          expect(mockedBuilder).toHaveBeenCalledTimes(0);
          assertDirectories(false);
        });

        test('Testing command with tsc warnings', async () => {
          mockedRunTsc.mockResolvedValueOnce({
            severity: 'warn',
            results: [],
            input: {} as any
          });
          await expectCommandSuccess(runCommand(...cmdArgs, '--tsc'));
          expect(process.env.CI).toBeUndefined();
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
            await expectCommandExit(runCommand(...cmdArgs, '--tsc'));
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
        await expectCommandSuccess(runCommand(...cmdArgs, '--lint', '--tsc'));

        expect(lintRunner.runEslint).toHaveBeenCalledTimes(1);
        expect(tscRunner.runTsc).toHaveBeenCalledTimes(1);
        expect(mockedBuilder).toHaveBeenCalledTimes(1);
        assertDirectories(true);
      });
    }
  });
}

testBuildCommand('JSON', commands.getBuildJsonCommand, docs, 'buildJson', { tsc: true }, ['jsons'], `${testMocksDir}/bundles/test0`);
testBuildCommand('Docs', commands.getBuildDocsCommand, docs, 'buildDocs', false, ['jsons']);
testBuildCommand('Bundles', commands.getBuildBundleCommand, modules, 'buildBundle', true, ['bundles'], `${testMocksDir}/bundles/test0`);
testBuildCommand('Tabs', commands.getBuildTabCommand, modules, 'buildTab', true, ['tabs'], `${testMocksDir}/tabs/tab0`);
