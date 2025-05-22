import { vi, expect, describe, test } from 'vitest';
import * as utils from '../../utils';
import { getLintCommand } from '../lint';

const lintFilesMock = vi.hoisted(() => vi.fn());

vi.spyOn(utils, 'getGitRoot').mockResolvedValue('/');

vi.mock('eslint', async importActual => {
  const actualEslint: any = await importActual();
  return {
    ...actualEslint,
    ESLint: class {
      public fix: boolean;

      constructor({ fix }) {
        this.fix = fix;
      }

      static outputFixes = () => Promise.resolve();
      lintFiles = lintFilesMock;
      loadFormatter = () => Promise.resolve({
        format: () => Promise.resolve('')
      });
    }
  };
});

describe('Test Lint Command', () => {
  async function runCommand(...args: string[]) {
    const command = getLintCommand();
    await command.parseAsync(args, { from: 'user' });
  }

  test('Fatal errors without --fix cause errors', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      fatalErrorCount: 1
    }]);

    await expect(runCommand()).rejects.toThrow('process.exit called with 1');
  });

  test('Fatal errors with --fix cause errors', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      fatalErrorCount: 1
    }]);

    await expect(runCommand('--fix')).rejects.toThrow('process.exit called with 1');
  });

  test('Non fatal errors without --fix cause errors', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      errorCount: 1
    }]);

    await expect(runCommand()).rejects.toThrow('process.exit called with 1');
  });

  test('Non fatal errors with --fix does not call process.exit', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      errorCount: 1
    }]);

    await expect(runCommand('--fix')).resolves.not.toThrow();
  });

  test('Warnings outside of ci mode should not error out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 0
    }]);

    await expect(runCommand()).resolves.not.toThrow();
  });

  test('Warnings in ci mode should error out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 0
    }]);

    await expect(runCommand('--ci')).rejects.toThrow('process.exit called with 1');
  });

  test('Fixable Warnings outside of ci mode should not error out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 1
    }]);

    await expect(runCommand()).resolves.not.toThrow();
  });

  test('Fixable Warnings with --fix do not errors out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 1
    }]);

    await expect(runCommand('--fix')).resolves.not.toThrow();
  });

  test('Fixable Warnings with --fix and --ci do not errors out', async () => {
    lintFilesMock.mockResolvedValueOnce([{
      warningCount: 1,
      fixableWarningCount: 1
    }]);

    await expect(runCommand('--fix', '--ci')).resolves.not.toThrow();
  });
});
