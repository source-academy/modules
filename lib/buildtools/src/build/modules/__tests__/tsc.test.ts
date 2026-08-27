import pathlib from 'path';
import { bundlesDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import ts from 'typescript';
import { describe, expect, test, vi } from 'vitest';
import { runTscCompile, runTypechecking } from '../tsc.js';

const mockedWriteFile = vi.hoisted(() => vi.fn<(arg0: string, arg1: string) => void>(() => undefined));

// Set a longer timeout just for this file
vi.setConfig({
  testTimeout: 20000
});

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

describe(runTypechecking, () => {
  test('tsc on a bundle', async () => {
    const bundlePath = pathlib.join(bundlesDir, 'test0');
    await runTypechecking({
      type: 'bundle',
      directory: bundlePath,
      name: 'test0',
      manifest: {}
    });

    expect(ts.createProgram).toHaveBeenCalledTimes(1);
    expect(mockedWriteFile).not.toHaveBeenCalled();
  });

  test('tsc on a tab', async () => {
    const tabPath = pathlib.join(tabsDir, 'tab0');
    await runTypechecking({
      type: 'tab',
      directory: tabPath,
      entryPoint: pathlib.join(tabPath, 'src', 'index.tsx'),
      name: 'tab0'
    });

    expect(ts.createProgram).toHaveBeenCalledTimes(1);
    expect(mockedWriteFile).not.toHaveBeenCalled();
  });
});

describe(runTscCompile, () => {
  const bundlePath = pathlib.join(bundlesDir, 'test0');

  test('tsc compile for bundle', async () => {
    await runTscCompile({
      type: 'bundle',
      directory: bundlePath,
      name: 'test0',
      manifest: {}
    });

    expect(ts.createProgram).toHaveBeenCalledOnce();
    expect(mockedWriteFile).toHaveBeenCalledOnce();

    const [[writePath]] = mockedWriteFile.mock.calls;

    const testOutPath = pathlib.relative(
      pathlib.join(bundlesDir, 'dist'),
      '__tests__/test0.test.js'
    );
    expect(writePath).not.toMatchPath(testOutPath);

    const indexOutPath = pathlib.relative(pathlib.join(bundlesDir, 'dist'), 'index.js');
    expect(writePath).not.toMatchPath(indexOutPath);
  });
});
