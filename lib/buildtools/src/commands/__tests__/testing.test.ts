import { describe, expect, test, vi } from 'vitest';
import * as runner from '../../testing/runner.js';
import * as configs from '../../testing/utils.js';
import { getTestCommand } from '../testing.js';
import { getCommandRunner } from './testingUtils.js';

vi.spyOn(process, 'cwd').mockReturnValue('/');
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

    await expect(runCommand('/dir', '/dir/dir1')).commandSuccess();
    expect(configs.getTestConfiguration).toHaveBeenCalledExactlyOnceWith('/dir', false);
    expect(runner.runVitest).toHaveBeenCalledExactlyOnceWith('test', ['/dir/dir1'], [mockConfig.config], {});
  });

  test('Providing both the project directory but no patterns', async () => {
    const mockConfig: configs.GetTestConfigurationResult = {
      severity: 'success',
      config: {
        test: {
          name: 'Test0'
        }
      }
    };

    mockedTestConfiguration.mockResolvedValueOnce(mockConfig);

    await expect(runCommand('/dir')).commandSuccess();
    expect(configs.getTestConfiguration).toHaveBeenCalledExactlyOnceWith('/dir', false);
    expect(runner.runVitest).toHaveBeenCalledExactlyOnceWith('test', [], [mockConfig.config], {});
  });

  test('Expect command to exit with no issues if no tests were found', async () => {
    mockedTestConfiguration.mockResolvedValueOnce({
      severity: 'success',
      config: null
    });

    await expect(runCommand('/dir')).commandSuccess();
  });
});
