import getBuildTabsCommand, * as tabModule from '../tab';
import fs from 'fs/promises';
import pathlib from 'path';

jest.spyOn(tabModule, 'buildTabs');

jest.mock('esbuild', () => ({
  build: jest.fn().mockResolvedValue({ outputFiles: [] }),
}));

const runCommand = (...args: string[]) => getBuildTabsCommand().parseAsync(args, { from: 'user' });

describe('test tab command', () => {
  it('should create the output directories, and copy the manifest', async () => {
    await runCommand();

    expect(fs.mkdir)
      .toBeCalledWith('build', { recursive: true })

    expect(fs.copyFile)
      .toBeCalledWith('modules.json', pathlib.join('build', 'modules.json'));
  })

  it('should only build specific tabs when manually specified', async () => {
    await runCommand('tab0');

    expect(tabModule.buildTabs)
      .toHaveBeenCalledTimes(1);

    const buildModulesCall = (tabModule.buildTabs as jest.MockedFunction<typeof tabModule.buildTabs>).mock.calls[0];
    expect(buildModulesCall[0])
      .toEqual(['tab0']);
  });
});