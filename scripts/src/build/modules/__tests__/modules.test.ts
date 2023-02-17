import getBuildModulesCommand, * as modules from '..';
import fs from 'fs/promises';
import pathlib from 'path';

jest.spyOn(modules, 'buildModules');

jest.mock('esbuild', () => ({
  build: jest.fn().mockResolvedValue({ outputFiles: [] }),
}));

jest.mock('../../prebuild/tsc');

const runCommand = (...args: string[]) => getBuildModulesCommand().parseAsync(args, { from: 'user' });
const buildModulesMock = modules.buildModules as jest.MockedFunction<typeof modules.buildModules>

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
      .toHaveBeenCalledTimes(1);

    const buildModulesCall = buildModulesMock.mock.calls[0];
    expect(buildModulesCall[1])
      .toMatchObject({
        bundles: ['test0'],
        tabs: ['tab0'],
        modulesSpecified: true,
      })
  });

  it('should exit with code 1 if tsc returns with an error', async () => {
    try {
      await runCommand('--tsc');
    } catch (error) {
      expect(error)
        .toEqual(new Error('process.exit called with 1'));
    }

    expect(modules.buildModules)
      .toHaveBeenCalledTimes(0);

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  });
})