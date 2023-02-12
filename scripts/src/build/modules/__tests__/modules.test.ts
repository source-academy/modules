import buildModulesCommand, * as modules from '..';
import fs from 'fs/promises';
import pathlib from 'path';

jest.mock('../../../scriptUtils', () => ({
  ...jest.requireActual('../../../scriptUtils'),
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

jest.spyOn(modules, 'buildModules');

jest.mock('fs/promises', () => ({
  copyFile: jest.fn(() => Promise.resolve()),
  mkdir: jest.fn(() => Promise.resolve()),
  stat: jest.fn().mockResolvedValue({ size: 10 }),
  writeFile: jest.fn(() => Promise.resolve()),
}))

jest.mock('esbuild', () => ({
  build: jest.fn().mockResolvedValue({ outputFiles: [] }),
}));

const runCommand = (...args: string[]) => buildModulesCommand.parseAsync(args, { from: 'user' });

describe('test modules command', () => {
  it('should create the output directories, and copy the manifest', async () => {
    await runCommand();

    expect(fs.mkdir)
      .toBeCalledWith('build', { recursive: true })

    expect(fs.copyFile)
      .toBeCalledWith('modules.json', pathlib.join('build', 'modules.json'));
  })

  it('should only build specific modules and tabs when manually specified', async () => {
    await runCommand('test0');

    expect(modules.buildModules)
      .toHaveBeenCalledTimes(2);

    const buildModulesCall = (modules.buildModules as jest.MockedFunction<typeof modules.buildModules>).mock.calls[1];
    expect(buildModulesCall[1])
      .toMatchObject({
        bundles: ['test0'],
        tabs: ['tab0'],
        modulesSpecified: true,
      })
  });
})