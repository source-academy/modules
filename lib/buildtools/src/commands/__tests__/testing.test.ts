import pathlib from 'path';
import { describe, expect, test, vi } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import * as runner from '../../testing/runner.js';
import * as configs from '../../testing/utils.js';
import { getTestCommand } from '../testing.js';
import { getCommandRunner } from './testingUtils.js';

vi.spyOn(process, 'cwd').mockReturnValue(testMocksDir);
vi.spyOn(runner, 'runVitest').mockResolvedValue();

describe('Test regular test command', () => {
  const mockedTestConfiguration = vi.spyOn(configs, 'getTestConfiguration');
  const runCommand = getCommandRunner(getTestCommand);

  test('Providing both the project directory and pattern', async () => {
    const mockConfig: configs.GetTestConfigurationResult = {
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
    expect(configs.getTestConfiguration).toHaveBeenCalledExactlyOnceWith(projectPath, false);
    expect(runner.runVitest).toHaveBeenCalledExactlyOnceWith('test', [filterPath], [mockConfig.config], { allowOnly: expect.any(Boolean) });
  });

  test('Providing both the project directory but no patterns', async () => {
    const projectPath = pathlib.join(testMocksDir, 'dir');
    const mockConfig: configs.GetTestConfigurationResult = {
      severity: 'success',
      config: {
        test: {
          name: 'Test0'
        }
      }
    };

    mockedTestConfiguration.mockResolvedValueOnce(mockConfig);

    await expect(runCommand('--project', projectPath)).commandSuccess();
    expect(configs.getTestConfiguration).toHaveBeenCalledExactlyOnceWith(projectPath, false);
    expect(runner.runVitest).toHaveBeenCalledExactlyOnceWith('test', [], [mockConfig.config], { allowOnly: expect.any(Boolean) });
  });

  test('Expect command to exit with no issues if no tests were found', async () => {
    const projectPath = pathlib.join(testMocksDir, 'dir');
    mockedTestConfiguration.mockResolvedValueOnce({
      severity: 'success',
      config: null
    });

    await expect(runCommand('--project', projectPath)).commandSuccess();
  });

  test('Command should error if the command was called from beyond the git root', async () => {
    const projectPath = pathlib.join(testMocksDir,'..');
    await expect(runCommand('--project', projectPath)).commandExit();
  });

  test('--no-allow-only should not allow only', async () => {
    const mockConfig: configs.GetTestConfigurationResult = {
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
      { allowOnly: false }
    );
  });

  test('--no-allow-only should be true when CI', async () => {
    vi.stubEnv('CI', 'yeet');
    try {
      const mockConfig: configs.GetTestConfigurationResult = {
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
        { allowOnly: false }
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
