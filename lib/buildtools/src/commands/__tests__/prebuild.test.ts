import type { MockedFunction } from 'jest-mock';
import * as tc from '../../prebuild/typecheck';
import { getLintCommand, getTscCommand } from '../prebuild';

const lintFilesMock = jest.fn();

jest.mock('eslint', () => ({
  ...jest.requireActual('eslint'),
  ESLint: class {
    fix: boolean;

    constructor({ fix }) {
      this.fix = fix;
    }

    lintFiles = lintFilesMock;
    loadFormatter = () => Promise.resolve({
      format: () => Promise.resolve('')
    });
    static outputFixes = () => Promise.resolve();
  }
}));

jest.spyOn(tc, 'getTsconfig');

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

describe('Test Typecheck Command', () => {
  const mockedGetTsconfig = tc.getTsconfig as MockedFunction<typeof tc.getTsconfig>;

  async function runCommand(...args: string[]) {
    const command = getTscCommand();
    await command.parseAsync(args, { from: 'user' });

    expect(tc.getTsconfig).toHaveBeenCalledTimes(1);
  }

  test('tsc errors should error out', async () => {
    mockedGetTsconfig.mockResolvedValueOnce({ severity: 'error' });
    await expect(runCommand()).rejects.toThrow('process.exit called with 1');
  });
});
