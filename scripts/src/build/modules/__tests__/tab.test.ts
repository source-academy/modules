import buildTabsCommand, * as tabModule from '../tab';
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

jest.spyOn(tabModule, 'buildTabs');

jest.mock('fs/promises', () => ({
  copyFile: jest.fn(() => Promise.resolve()),
  mkdir: jest.fn(() => Promise.resolve()),
  stat: jest.fn().mockResolvedValue({ size: 10 }),
  writeFile: jest.fn(() => Promise.resolve()),
}))

jest.mock('esbuild', () => ({
  build: jest.fn().mockResolvedValue({ outputFiles: [] }),
}));

const runCommand = (...args: string[]) => buildTabsCommand.parseAsync(args, { from: 'user' });

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
      .toHaveBeenCalledTimes(2);

    const buildModulesCall = (tabModule.buildTabs as jest.MockedFunction<typeof tabModule.buildTabs>).mock.calls[1];
    expect(buildModulesCall[0])
      .toEqual(['tab0']);
  });
});