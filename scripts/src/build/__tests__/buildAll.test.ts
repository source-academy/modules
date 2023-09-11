import { getBuildAllCommand } from '..';
import * as modules from '../modules';
import * as docsModule from '../docs';
import * as lintModule from '../prebuild/lint';
import * as tscModule from '../prebuild/tsc';
import { MockedFunction } from 'jest-mock';

import fs from 'fs/promises';
import pathlib from 'path';

jest.mock('../prebuild/tsc');
jest.mock('../prebuild/lint');

jest.mock('esbuild', () => ({
  build: jest.fn().mockResolvedValue({ outputFiles: [] }),
}));

jest.spyOn(modules, 'buildModules');
jest.spyOn(docsModule, 'buildJsons');
jest.spyOn(docsModule, 'buildHtml');

const asMock = <T extends (...any: any[]) => any>(func: T) => func as MockedFunction<typeof func>;
const runCommand = (...args: string[]) => getBuildAllCommand().parseAsync(args, { from: 'user' });

describe('test build all command', () => {
  it('should create the output directories, copy the manifest, and call all build functions', async () => {
    await runCommand();

    expect(fs.mkdir)
      .toBeCalledWith('build', { recursive: true })

    expect(fs.copyFile)
      .toBeCalledWith('modules.json', pathlib.join('build', 'modules.json'));
    
    expect(docsModule.initTypedoc)
      .toHaveBeenCalledTimes(1);

    expect(docsModule.buildJsons)
      .toHaveBeenCalledTimes(1);

    expect(docsModule.buildHtml)
      .toHaveBeenCalledTimes(1);

    expect(modules.buildModules)
      .toHaveBeenCalledTimes(1);
  });

  it('should exit with code 1 if tsc returns with an error', async () => {
    try {
      await runCommand('--tsc');
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'));
    }

    expect(process.exit)
      .toHaveBeenCalledWith(1);

    expect(tscModule.runTsc)
      .toHaveBeenCalledTimes(1);
  });

  it('should exit with code 1 if eslint returns with an error', async () => {
    try {
      await runCommand('--lint');
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'));
    }

    expect(lintModule.runEslint)
      .toHaveBeenCalledTimes(1);

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  });

  it('should exit with code 1 if buildJsons returns with an error', async () => {
    asMock(docsModule.buildJsons).mockResolvedValueOnce([['json', 'test0', { severity: 'error' }]])
    try {
      await runCommand();
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'));
    }

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  })

  it('should exit with code 1 if buildModules returns with an error', async () => {
    asMock(modules.buildModules).mockResolvedValueOnce([['bundle', 'test0', { severity: 'error' }]])
    try {
      await runCommand();
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'))
    }

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  });

  it('should exit with code 1 if buildHtml returns with an error', async () => {
    asMock(docsModule.buildHtml).mockResolvedValueOnce({
      elapsed: 0,
      result: {
        severity: 'error',
      }
    });

    try {
      await runCommand();
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'))
    }

    expect(process.exit)
      .toHaveBeenCalledWith(1);

    expect(docsModule.buildHtml)
      .toHaveBeenCalledTimes(1);
  });
});
