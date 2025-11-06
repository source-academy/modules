import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';
import * as testing from '@sourceacademy/modules-repotools/testing';
import * as utils from '@sourceacademy/modules-repotools/utils';
import { describe, expect, test, vi } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import * as runner from '../../testing.js';
import { getTestCommand, silentOption } from '../testing.js';
import { getCommandRunner } from './testingUtils.js';

vi.spyOn(process, 'cwd').mockReturnValue(testMocksDir);
vi.spyOn(runner, 'runVitest').mockResolvedValue();

describe('Test regular test command', () => {
  const mockedTestConfiguration = vi.spyOn(testing, 'getTestConfiguration');
  const runCommand = getCommandRunner(getTestCommand);

  test('Providing both the project directory and pattern', async () => {
    const mockConfig: testing.GetTestConfigurationResult = {
      severity: 'success',
      config: {
        test: {
          name: 'Test0'
        }
      }
    };

    mockedTestConfiguration.mockResolvedValueOnce(mockConfig);
    const projectPath = pathlib.join(testMocksDir, 'dir');
    const filterPath = pathlib.join(projectPath, 'dir1');

    await expect(runCommand('--project', projectPath, filterPath)).commandSuccess();
    expect(testing.getTestConfiguration).toHaveBeenCalledExactlyOnceWith(projectPath, false);
    expect(runner.runVitest).toHaveBeenCalledExactlyOnceWith(
      'test',
      [filterPath],
      [mockConfig.config],
      {
        allowOnly: expect.any(Boolean),
        silent: 'passed-only'
      }
    );
  });

  test('Providing both the project directory but no patterns', async () => {
    const projectPath = pathlib.join(testMocksDir, 'dir');
    const mockConfig: testing.GetTestConfigurationResult = {
      severity: 'success',
      config: {
        test: {
          name: 'Test0'
        }
      }
    };

    mockedTestConfiguration.mockResolvedValueOnce(mockConfig);

    await expect(runCommand('--project', projectPath)).commandSuccess();
    expect(testing.getTestConfiguration).toHaveBeenCalledExactlyOnceWith(projectPath, false);
    expect(runner.runVitest).toHaveBeenCalledExactlyOnceWith(
      'test',
      [],
      [mockConfig.config],
      {
        allowOnly: expect.any(Boolean),
        silent: 'passed-only'
      }
    );
  });

  test('Expect command to exit with no issues if no tests were found', async () => {
    vi.spyOn(utils, 'isBundleOrTabDirectory').mockResolvedValueOnce(null);

    const projectPath = pathlib.join(testMocksDir, 'dir');
    mockedTestConfiguration.mockResolvedValueOnce({
      severity: 'success',
      config: null
    });

    await expect(runCommand('--project', projectPath)).commandSuccess();
  });

  test('Command should error if the command was called from beyond the git root', async () => {
    const projectPath = pathlib.join(testMocksDir, '..');
    await expect(runCommand('--project', projectPath)).commandExit();
  });

  test('--no-allow-only should not allow only', async () => {
    const mockConfig: testing.GetTestConfigurationResult = {
      severity: 'success',
      config: {
        test: {
          name: 'Test0'
        }
      }
    };
    mockedTestConfiguration.mockResolvedValueOnce(mockConfig);

    await expect(runCommand('--no-allow-only')).commandSuccess();
    expect(runner.runVitest).toHaveBeenCalledExactlyOnceWith(
      'test',
      [],
      [mockConfig.config],
      {
        allowOnly: false,
        silent: 'passed-only'
      }
    );
  });

  test('--no-allow-only should be true when CI', async () => {
    vi.stubEnv('CI', 'yeet');
    try {
      const mockConfig: testing.GetTestConfigurationResult = {
        severity: 'success',
        config: {
          test: {
            name: 'Test0'
          }
        }
      };
      mockedTestConfiguration.mockResolvedValueOnce(mockConfig);

      await expect(runCommand()).commandSuccess();
      expect(runner.runVitest).toHaveBeenCalledExactlyOnceWith(
        'test',
        [],
        [mockConfig.config],
        {
          allowOnly: false,
          silent: 'passed-only'
        }
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

describe('Test silent option', () => {
  const runCommand = (...args: string[]) => new Promise<undefined | boolean | 'passed-only'>(
    (resolve, reject) => {
      const command = new Command()
        .exitOverride()
        .addOption(silentOption)
        .configureOutput({ writeErr: () => { } })
        .action(option => {
          resolve(option.silent);
        });

      try {
        command.parse(args, { from: 'user' });
      } catch (error) {
        reject(error);
      }
    }
  );

  test('running command without option', async () => {
    const value = await runCommand();
    expect(value).toEqual('passed-only');
  });

  test('running command with without value', async () => {
    const value = await runCommand('--silent');
    expect(value).toEqual(true);
  });

  test('running command with \'true\'', async () => {
    const value = await runCommand('--silent', 'true');
    expect(value).toEqual(true);
  });

  test('running command with \'false\'', async () => {
    const value = await runCommand('--silent', 'false');
    expect(value).toEqual(false);
  });

  test('running command with \'passed-only\'', async () => {
    const value = await runCommand('--silent', 'passed-only');
    expect(value).toEqual('passed-only');
  });

  test('running command with invalid option', () => {
    return expect(runCommand('--silent', 'unknown'))
      .rejects
      .toThrowError('Invalid value for silent: unknown');
  });
});
