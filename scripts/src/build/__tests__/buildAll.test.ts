import { buildAllCommand } from '..';
import * as modules from '../modules';
import fs from 'fs/promises';
import pathlib from 'path';
import * as docsModule from '../docs';
import type { Application, ProjectReflection } from 'typedoc';
import { MockedFunction } from 'jest-mock';

jest.mock('../../scriptUtils', () => ({
  ...jest.requireActual('../../scriptUtils'),
  retrieveManifest: jest.fn((_manifest: string) => Promise.resolve({
    test0: {
      tabs: ['tab0'],
    },
    test1: { tabs: [] },
    test2: {
      tabs: ['tab1'],
    },
  })),
}));

jest.mock('../prebuild/tsc', () => ({
  logTscResults: jest.fn(),
  runTsc: jest.fn().mockResolvedValue({ result: {
    severity: 'error',
    results: [],
  }})
}));

jest.mock('fs/promises', () => ({
  copyFile: jest.fn(() => Promise.resolve()),
  mkdir: jest.fn(() => Promise.resolve()),
  stat: jest.fn().mockResolvedValue({ size: 10 }),
  writeFile: jest.fn(() => Promise.resolve()),
}))

jest.mock('esbuild', () => ({
  build: jest.fn().mockResolvedValue({ outputFiles: [] }),
}));

jest.mock('esbuild', () => ({
  build: jest.fn().mockResolvedValue({ outputFiles: [ ]}),
}));

jest.spyOn(modules, 'buildModules');

jest.spyOn(docsModule, 'initTypedoc').mockImplementation(() => {
  const proj = {
    getChildByName: () => ({
      children: [],
    }),
    path: '',
  } as unknown as ProjectReflection;

  return Promise.resolve({
    elapsed: 0,
    result: [{
      convert: jest.fn()
        .mockReturnValue(proj),
      generateDocs: jest.fn(() => Promise.resolve()),
    } as unknown as Application, proj],
  });
});
jest.spyOn(docsModule, 'buildJsons');
jest.spyOn(docsModule, 'buildHtml');

jest.spyOn(process, 'exit').mockImplementation();

const runCommand = (...args: string[]) => buildAllCommand.parseAsync(args, { from: 'user' });

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
    await runCommand('--tsc');

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  })

  it('should exit with code 1 if buildJsons returns with an error', async () => {
    await runCommand();

    (docsModule.buildJsons as MockedFunction<typeof docsModule.buildJsons>).mockResolvedValueOnce([['json', 'test0', { severity: 'error' }]])

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  })
  it('should exit with code 1 if buildModules returns with an error', async () => {
    await runCommand();

    (modules.buildModules as MockedFunction<typeof modules.buildModules>).mockResolvedValueOnce([['bundle', 'test0', { severity: 'error' }]])

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  }); 

  // it('should exit with code 1 if buildJsons returns with an error', async () => {
  //   await runCommand();

  //   (docsModule.buildJsons as MockedFunction<typeof docsModule.buildJsons>).mockResolvedValueOnce([['json', 'test0', { severity: 'error' }]])

  //   expect(process.exit)
  //     .toHaveBeenCalledWith(1);
  // })
});
