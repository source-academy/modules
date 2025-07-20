import ts from 'typescript';
import { describe, expect, test, vi } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import { runTsc } from '../tsc.js';

const mockedWriteFile = vi.hoisted(() => vi.fn<(arg0: string, arg1: string) => void>(() => undefined));

vi.mock(import('typescript'), async importOriginal => {
  const { default: original } = await importOriginal();

  // @ts-expect-error createProgram has two overloads but we can only really define 1
  const createProgram: typeof original.createProgram = vi.fn((opts: ts.CreateProgramOptions) => {
    const program = original.createProgram(opts);
    const emit: typeof program.emit = (sourceFile, _, cancelToken, emitDts, transformers) => {
      // We mock create program so that we can check what the writeFile callback is called with
      return program.emit(sourceFile, mockedWriteFile, cancelToken, emitDts, transformers);
    };

    return {
      ...program,
      emit
    };
  });

  return {
    default: {
      ...original,
      createProgram,
    }
  };
});

describe('Test the augmented tsc functionality', () => {
  test('tsc on a bundle', { timeout: 15000 }, async () => {
    await runTsc({
      type: 'bundle',
      directory: `${testMocksDir}/bundles/test0`,
      name: 'test0',
      manifest: {}
    }, false);

    expect(ts.createProgram).toHaveBeenCalledTimes(2);
    expect(mockedWriteFile).toHaveBeenCalledTimes(1);
    const [[writePath]] = mockedWriteFile.mock.calls;

    expect(writePath).not.toEqual(`${testMocksDir}/bundles/test0/__tests__/test0.test.js`,);
  });

  test('tsc on a bundle with --noEmit', { timeout: 15000 }, async () => {
    await runTsc({
      type: 'bundle',
      directory: `${testMocksDir}/bundles/test0`,
      name: 'test0',
      manifest: {}
    }, true);

    expect(ts.createProgram).toHaveBeenCalledTimes(1);
    expect(mockedWriteFile).not.toBeCalled();
  });

  test('tsc on a bundle with noEmit in its tsconfig', async () => {
    const originalTs: typeof ts = await vi.importActual('typescript');

    vi.spyOn(ts, 'parseJsonConfigFileContent').mockImplementationOnce((...args) => {
      const rawResult = originalTs.parseJsonConfigFileContent(...args);
      rawResult.options.noEmit = true;
      return rawResult;
    });

    await runTsc({
      type: 'bundle',
      directory: `${testMocksDir}/bundles/test0`,
      name: 'test0',
      manifest: {}
    }, false);

    expect(ts.createProgram).toHaveBeenCalledTimes(1);
    expect(mockedWriteFile).not.toBeCalled();
  });

  test('tsc on a tab', { timeout: 10000 }, async () => {
    await runTsc({
      type: 'tab',
      directory: `${testMocksDir}/tabs/tab0`,
      entryPoint: `${testMocksDir}/tabs/tab0/src/index.tsx`,
      name: 'tab0'
    }, false);

    expect(ts.createProgram).toHaveBeenCalledTimes(1);
    expect(mockedWriteFile).not.toBeCalled();
  });
});
