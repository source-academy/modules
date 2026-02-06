import type { Dirent } from 'fs';
import fs from 'fs/promises';
import pathlib from 'path';
import * as core from '@actions/core';
import { describe, expect, test, vi } from 'vitest';
import * as commons from '../../commons.js';
import * as git from '../../gitRoot.js';
import * as lockfiles from '../../lockfiles.js';
import { getAllPackages, getRawPackages, main } from '../index.js';

const mockedCheckChanges = vi.spyOn(commons, 'checkDirForChanges');

vi.mock(import('path'), async importOriginal => {
  const { posix } = await importOriginal();

  return {
    default: posix,
    posix,
  };
});

vi.mock(import('../../gitRoot.js'), () => ({
  gitRoot: 'root'
}));

class NodeError extends Error {
  constructor(public readonly code: string) {
    super();
  }
}

const mockDirectory: Record<string, string | Record<string, unknown>> = {
  'package.json': JSON.stringify({
    name: '@sourceacademy/modules'
  }),
  lib: {
    'modules-lib': {
      'package.json': JSON.stringify({
        name: '@sourceacademy/modules-lib'
      }),
    }
  },
  src: {
    bundles: {
      bundle0: {
        'package.json': JSON.stringify({
          name: '@sourceacademy/bundle-bundle0',
          devDependencies: {
            '@sourceacademy/modules-lib': 'workspace:^',
          }
        })
      },
    },
    tabs: {
      tab0: {
        'package.json': JSON.stringify({
          name: '@sourceacademy/tab-Tab0',
          dependencies: {
            lodash: '^4.1.1',
            '@sourceacademy/bundle-bundle0': 'workspace:^',
          },
          devDependencies: {
            playwright: '^1.54.0'
          }
        })
      }
    }
  }
};

function mockReaddir(path: string) {
  function recurser(segments: string[], obj: string | Record<string, unknown>): Promise<Dirent[]> {
    if (segments.length === 0) {
      if (typeof obj === 'string') throw new NodeError('ENOTDIR');

      const dirents = Object.entries(obj)
        .map(([name, each]): Dirent => {
          if (typeof each === 'string') {
            return {
              isFile: () => true,
              isDirectory: () => false,
              name,
            } as Dirent;
          }

          return {
            isFile: () => false,
            isDirectory: () => true,
            name
          } as Dirent;
        });

      return Promise.resolve(dirents);
    }

    if (typeof obj === 'string') throw new NodeError('ENOENT');

    const [seg0, ...remainingSegments] = segments;
    return recurser(remainingSegments, obj[seg0] as string | Record<string, unknown>);
  }

  const segments = path.split(pathlib.sep);
  return recurser(segments, { root: mockDirectory });
}

function mockReadFile(path: string) {
  function recurser(segments: string[], obj: string | Record<string, unknown>): Promise<string> {
    if (segments.length === 0) {
      if (typeof obj !== 'string') throw new NodeError('EISDIR');
      return Promise.resolve(obj);
    }

    if (typeof obj === 'string') throw new NodeError('ENOENT');

    const [seg0, ...remainingSegments] = segments;
    return recurser(remainingSegments, obj[seg0] as string | Record<string, unknown>);
  }

  const segments = path.split(pathlib.sep);
  return recurser(segments, { root: mockDirectory });
}

vi.spyOn(fs, 'readdir').mockImplementation(mockReaddir as any);
vi.spyOn(fs, 'readFile').mockImplementation(mockReadFile as any);
vi.spyOn(lockfiles, 'hasLockFileChanged').mockResolvedValue(false);

describe(getRawPackages, () => {
  test('maxDepth = 1', async () => {
    mockedCheckChanges.mockResolvedValueOnce(true);
    const results = Object.entries(await getRawPackages('root', 1));
    expect(fs.readdir).toHaveBeenCalledTimes(3);
    expect(results.length).toEqual(1);

    const [[name, packageData]] = results;
    expect(name).toEqual('@sourceacademy/modules');
    expect(packageData.hasChanges).toEqual(true);
    expect(commons.checkDirForChanges).toHaveBeenCalledOnce();
  });

  test('maxDepth = 3', async () => {
    mockedCheckChanges.mockResolvedValue(true);
    const results = await getRawPackages('root', 3);
    expect(Object.values(results).length).toEqual(4);
    expect(fs.readdir).toHaveBeenCalledTimes(8);

    expect(results).toHaveProperty('@sourceacademy/bundle-bundle0');
    const bundleResult = results['@sourceacademy/bundle-bundle0'];
    expect(bundleResult.hasChanges).toEqual(true);

    expect(results).toHaveProperty('@sourceacademy/tab-Tab0');
    const tabResult = results['@sourceacademy/tab-Tab0'];
    expect(tabResult.hasChanges).toEqual(true);

    expect(results).toHaveProperty('@sourceacademy/modules-lib');
    const libResult = results['@sourceacademy/modules-lib'];
    expect(libResult.hasChanges).toEqual(true);
  });

  test('hasChanges fields accurately reflects value returned from checkChanges', async () => {
    mockedCheckChanges.mockImplementation(p => {
      switch (p) {
        case 'root/src/bundles/bundle0':
          return Promise.resolve(false);
        case 'root/src/tabs/tab0':
          return Promise.resolve(false);
        case 'root':
          return Promise.resolve(true);
      }

      return Promise.resolve(false);
    });

    const results = await getRawPackages('root');
    expect(Object.keys(results).length).toEqual(4);

    expect(results).toHaveProperty('@sourceacademy/modules');
    expect(results['@sourceacademy/modules'].hasChanges).toEqual(true);

    expect(results).toHaveProperty('@sourceacademy/bundle-bundle0');
    expect(results['@sourceacademy/bundle-bundle0'].hasChanges).toEqual(false);

    expect(results).toHaveProperty('@sourceacademy/tab-Tab0');
    expect(results['@sourceacademy/tab-Tab0'].hasChanges).toEqual(false);

    expect(results).toHaveProperty('@sourceacademy/modules-lib');
    expect(results['@sourceacademy/modules-lib'].hasChanges).toEqual(false);
  });
});

describe(getAllPackages, () => {
  test('Transitive change dependencies', async () => {
    mockedCheckChanges.mockImplementation(p => {
      switch (p) {
        case 'root/lib/modules-lib':
          return Promise.resolve(true);
        case 'root/src/bundles/bundle0':
          return Promise.resolve(false);
        case 'root/src/tabs/tab0':
          return Promise.resolve(false);
        case 'root':
          return Promise.resolve(false);
      }

      return Promise.resolve(false);
    });

    const { packages: results } = await getAllPackages('root');
    expect(Object.keys(results).length).toEqual(4);

    expect(results).toHaveProperty('@sourceacademy/modules');
    expect(results['@sourceacademy/modules'].changes).toEqual(false);

    expect(results).toHaveProperty('@sourceacademy/bundle-bundle0');
    expect(results['@sourceacademy/bundle-bundle0'].changes).toEqual(true);

    expect(results).toHaveProperty('@sourceacademy/tab-Tab0');
    expect(results['@sourceacademy/tab-Tab0'].changes).toEqual(true);

    expect(results).toHaveProperty('@sourceacademy/modules-lib');
    expect(results['@sourceacademy/modules-lib'].changes).toEqual(true);
  });
});

describe(main, () => {
  vi.spyOn(git, 'gitRoot', 'get').mockResolvedValue('root');
  const mockedSetOutput = vi.spyOn(core, 'setOutput');

  vi.spyOn(core.summary, 'addHeading').mockImplementation(() => core.summary);
  vi.spyOn(core.summary, 'addTable').mockImplementation(() => core.summary);
  vi.spyOn(core.summary, 'write').mockImplementation(() => Promise.resolve(core.summary));

  test('Does not write packages with no changes to the output', async () => {
    mockedCheckChanges.mockImplementation(path => {
      return Promise.resolve(path === 'root/src/tabs/tab0');
    });

    await main();
    const { mock: { calls } } = mockedSetOutput;

    expect(mockedSetOutput).toHaveBeenCalledTimes(6);

    expect(calls[0]).toEqual(['bundles', []]);
    expect(calls[1]).toEqual(['tabs', [expect.objectContaining({ changes: true })]]);
    expect(calls[2]).toEqual(['libs', []]);

    // These next two are undefined because the mock implementations
    // don't return any info about them
    expect(calls[3]).toEqual(['devserver', undefined]);
    expect(calls[4]).toEqual(['docserver', undefined]);

    expect(calls[5]).toEqual(['workflows', false]);
  });
});
