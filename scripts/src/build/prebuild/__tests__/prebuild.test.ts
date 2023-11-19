import type { MockedFunction } from 'jest-mock';

import getLintCommand, * as lintModule from '../lint';
import getTscCommand, * as tscModule from '../tsc';
import getPrebuildCommand from '..';

jest.spyOn(lintModule, 'runEslint')
jest.spyOn(tscModule, 'runTsc');

const asMock = <T extends (...any: any[]) => any>(func: T) => func as MockedFunction<typeof func>;
const mockedTsc = asMock(tscModule.runTsc);
const mockedEslint = asMock(lintModule.runEslint);

describe('test eslint command', () => {
  const runCommand = (...args: string[]) => getLintCommand().parseAsync(args, { from: 'user' });

  test('regular command function', async () => {
    mockedEslint.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        formatted: '',
        results: [],
        severity: 'success',
      }
    });

    await runCommand();

    expect(lintModule.runEslint)
      .toHaveBeenCalledTimes(1);
  });

  it('should only lint specified bundles and tabs', async () => {
    mockedEslint.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        formatted: '',
        results: [],
        severity: 'success',
      }
    });

    await runCommand('-m', 'test0', '-t', 'tab0');

    expect(lintModule.runEslint)
      .toHaveBeenCalledTimes(1);

    const lintCall = mockedEslint.mock.calls[0];
    expect(lintCall[1])
      .toMatchObject({
        bundles: ['test0'],
        tabs: ['tab0']
      });
  });

  it('should exit with code 1 if there are linting errors', async () => {
    mockedEslint.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        formatted: '',
        results: [],
        severity: 'error',
      }
    });

    try {
      await runCommand();
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'))
    }
    expect(lintModule.runEslint)
      .toHaveBeenCalledTimes(1);

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  });
});

describe('test tsc command', () => {
  const runCommand = (...args: string[]) => getTscCommand().parseAsync(args, { from: 'user' });

  test('regular command function', async () => {
    mockedTsc.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        results: [],
        severity: 'success',
      }
    });

    await runCommand();

    expect(tscModule.runTsc)
      .toHaveBeenCalledTimes(1);
  });

  it('should only typecheck specified bundles and tabs', async () => {
    mockedTsc.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        results: [],
        severity: 'success',
      }
    });

    await runCommand('-m', 'test0', '-t', 'tab0');

    expect(tscModule.runTsc)
      .toHaveBeenCalledTimes(1);

    const tscCall = mockedTsc.mock.calls[0];
    expect(tscCall[1])
      .toMatchObject({
        bundles: ['test0'],
        tabs: ['tab0']
      });
  });

  it('should exit with code 1 if there are type check errors', async () => {
    mockedTsc.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        results: [],
        severity: 'error',
      }
    });

    try {
      await runCommand();
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'))
    }

    expect(tscModule.runTsc)
      .toHaveBeenCalledTimes(1);

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  });
});

describe('test prebuild command', () => {
  const runCommand = (...args: string[]) => getPrebuildCommand().parseAsync(args, { from: 'user' });

  test('regular command function', async () => {
    mockedTsc.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        results: [],
        severity: 'success',
      }
    });

    mockedEslint.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        formatted: '',
        results: [],
        severity: 'success',
      }
    });

    await runCommand();

    expect(tscModule.runTsc)
      .toHaveBeenCalledTimes(1);

    expect(lintModule.runEslint)
      .toHaveBeenCalledTimes(1);
  });

  it('should only run on specified bundles and tabs', async () => {
    mockedTsc.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        results: [],
        severity: 'success',
      }
    });

    mockedEslint.mockResolvedValueOnce({
      elapsed: 0,
      result: { 
        formatted: '',
        results: [],
        severity: 'success',
      }
    });

    await runCommand('-m', 'test0', '-t', 'tab0');

    expect(tscModule.runTsc)
      .toHaveBeenCalledTimes(1);

    const tscCall = mockedTsc.mock.calls[0];
    expect(tscCall[1])
      .toMatchObject({
        bundles: ['test0'],
        tabs: ['tab0']
      });

    expect(lintModule.runEslint)
    .toHaveBeenCalledTimes(1);

    const lintCall = mockedEslint.mock.calls[0];
    expect(lintCall[1])
      .toMatchObject({
        bundles: ['test0'],
        tabs: ['tab0']
      });
  });

  describe('test error functionality', () => {
    it('should exit with code 1 if there are type check errors', async () => {
      mockedTsc.mockResolvedValueOnce({
        elapsed: 0,
        result: { 
          results: [],
          severity: 'error',
        }
      });

      mockedEslint.mockResolvedValueOnce({
        elapsed: 0,
        result: { 
          formatted: '',
          results: [],
          severity: 'success',
        }
      });

      try {
        await runCommand();
      } catch (error) {
        expect(error)
          .toEqual(new Error('process.exit called with 1'))
      }

      expect(tscModule.runTsc)
        .toHaveBeenCalledTimes(1);

      expect(lintModule.runEslint)
        .toHaveBeenCalledTimes(1);

      expect(process.exit)
        .toHaveBeenCalledWith(1);
    });
    
    it('should exit with code 1 if there are lint errors', async () => {
      mockedTsc.mockResolvedValueOnce({
        elapsed: 0,
        result: { 
          results: [],
          severity: 'success',
        }
      });

      mockedEslint.mockResolvedValueOnce({
        elapsed: 0,
        result: { 
          formatted: '',
          results: [],
          severity: 'error',
        }
      });

      try {
        await runCommand();
      } catch (error) {
        expect(error)
          .toEqual(new Error('process.exit called with 1'))
      }

      expect(tscModule.runTsc)
        .toHaveBeenCalledTimes(1);

      expect(lintModule.runEslint)
        .toHaveBeenCalledTimes(1);

      expect(process.exit)
        .toHaveBeenCalledWith(1);
    });

    it('should exit with code 1 and not run tsc if there are unfixable linting errors and --fix was specified', async () => {
      mockedEslint.mockResolvedValueOnce({
        elapsed: 0,
        result: { 
          formatted: '',
          results: [],
          severity: 'error',
        }
      });

      try {
        await runCommand('--fix');
      } catch (error) {
        expect(error)
          .toEqual(new Error('process.exit called with 1'))
      }

      expect(tscModule.runTsc)
        .toHaveBeenCalledTimes(0);

      expect(lintModule.runEslint)
        .toHaveBeenCalledTimes(1);

      expect(process.exit)
        .toHaveBeenCalledWith(1);
    });
  });
});
