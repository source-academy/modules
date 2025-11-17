import pathlib from 'path';
import ts from 'typescript';
import { describe, expect, test, vi } from 'vitest';
import { testMocksDir } from '../../../testing/fixtures.js';
import { runTscCompileFromTsconfig, runTypecheckingFromTsconfig } from '../index.js';

const mockedWriteFile = vi.hoisted(() => vi.fn<(arg0: string, arg1: string) => void>(() => undefined));

// Set a longer timeout just for this file
vi.setConfig({
  testTimeout: 20000
});

vi.mock(import('typescript'), async importOriginal => {
  const { default: original } = await importOriginal();

  // @ts-expect-error createProgram has two overloads but we can only really define 1
  const createProgram: typeof original.createProgram = vi.fn((fileNames: string[], opts: ts.CompilerOptions) => {
    const program = original.createProgram(fileNames, opts);
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

describe(runTypecheckingFromTsconfig, () => {
  test('on a bundle', async () => {
    const bundlePath = pathlib.join(testMocksDir, 'bundles', 'test0');
    await expect(runTypecheckingFromTsconfig(bundlePath)).resolves.toMatchObject({
      severity: 'success',
      diagnostics: expect.any(Array),
      program: expect.any(Object)
    });

    expect(ts.createProgram).toHaveBeenCalledTimes(1);
    const [[, programOpts]] = vi.mocked(ts.createProgram).mock.calls;
    expect(programOpts).toHaveProperty('noEmit', true);
    expect(mockedWriteFile).toHaveBeenCalledTimes(0);
  });

  test('on a tab', async () => {
    const tabPath = pathlib.join(testMocksDir, 'tabs', 'tab0');
    const result = await runTypecheckingFromTsconfig(tabPath);

    expect(result).toMatchObject({
      severity: 'success',
      diagnostics: expect.any(Array),
      program: expect.any(Object)
    });

    expect(ts.createProgram).toHaveBeenCalledTimes(1);
    const [[, programOpts]] = vi.mocked(ts.createProgram).mock.calls;
    expect(programOpts).toHaveProperty('noEmit', true);
    expect(mockedWriteFile).toHaveBeenCalledTimes(0);
  });
});

describe(runTscCompileFromTsconfig, () => {
  test('on a bundle', async () => {
    const bundlePath = pathlib.join(testMocksDir, 'bundles', 'test0');
    await expect(runTscCompileFromTsconfig(bundlePath)).resolves.toMatchObject({
      severity: 'success',
      diagnostics: expect.any(Array),
    });

    expect(ts.createProgram).toHaveBeenCalledTimes(1);
    const [[fileNames, programOpts]] = vi.mocked(ts.createProgram).mock.calls;
    expect(programOpts).toHaveProperty('noEmit', false);
    expect(fileNames).not.toContain(expect.stringContaining('__tests__'));

    // 2 times, one for the js and 1 for the declaration
    expect(mockedWriteFile).toHaveBeenCalledTimes(2);
  });

  test('on a tab', async () => {
    const tabPath = pathlib.join(testMocksDir, 'tabs', 'tab0');
    return expect(runTscCompileFromTsconfig(tabPath)).resolves.toMatchObject({
      severity: 'error',
      diagnostics: [{
        severity: 'error',
        error: 'runTscCompile can only be used with bundles!'
      }]
    });
  });
});
