import type { PathLike } from 'fs';
import fs, { type FileHandle } from 'fs/promises';
import pathlib from 'path';
import { describe, expect, it as baseIt, test, vi } from 'vitest';
import { bundlesDir, tabsDir } from '../getGitRoot.js';
import * as manifest from '../manifest.js';

const testMocksDir = pathlib.resolve(import.meta.dirname, '../../../__test_mocks__');
const mockedFsStat = vi.spyOn(fs, 'stat');
const mockedReadFile = vi.spyOn(fs, 'readFile');

vi.mock(import('../getGitRoot.js'));

function expectSuccess(obj: unknown): asserts obj is 'success' {
  expect(obj).toEqual('success');
}

interface Fixtures {
  ENOENT: Error;
}

const it = baseIt.extend<Fixtures>({
  ENOENT: new class extends Error {
    code = 'ENOENT';
  }
});

describe(manifest.resolveSingleTab, () => {
  it('properly detects a tab with the src/index.tsx entrypoint', async () => {
    const resolved = await manifest.resolveSingleTab(pathlib.join(tabsDir, 'tab0'));

    expect(resolved).not.toBeUndefined();
    expect(resolved).toMatchObject({
      entryPoint: pathlib.join(tabsDir, 'tab0', 'src', 'index.tsx'),
      directory: pathlib.join(tabsDir, 'tab0'),
      name: 'tab0'
    });
  });

  it('properly detects a bundle with the index.tsx entrypoint', async () => {
    const resolved = await manifest.resolveSingleTab(pathlib.join(tabsDir, 'tab1'));

    expect(resolved).not.toBeUndefined();
    expect(resolved).toMatchObject({
      entryPoint: pathlib.join(tabsDir, 'tab1', 'index.tsx'),
      directory: pathlib.join(tabsDir, 'tab1'),
      name: 'tab1'
    });
  });

  it('doesn\'t consider a non-directory a tab', () => {
    mockedFsStat.mockResolvedValueOnce({
      isDirectory: () => false
    } as any);

    return expect(manifest.resolveSingleTab(pathlib.join(tabsDir, 'tab1'))).resolves.toBeUndefined();
  });

  it('returns undefined when the specified path doesn\'t exist', async ({ ENOENT }) => {
    mockedFsStat.mockRejectedValueOnce(ENOENT);
    await expect(manifest.resolveSingleTab('/')).resolves.toBeUndefined();
    expect(fs.stat).toHaveBeenCalledOnce();
  });

  it('throws the error when the error is of an unknown type', () => {
    mockedFsStat.mockRejectedValueOnce({});
    return expect(manifest.resolveSingleTab('/')).rejects.toEqual({});
  });
});

describe(manifest.getBundleManifest, () => {
  const bundle0Path = pathlib.join(bundlesDir, 'test0');

  test('valid manifest with tab check', async () => {
    const result = await manifest.getBundleManifest(bundle0Path, true);
    expect(result).toEqual({
      severity: 'success',
      manifest: {
        tabs: ['tab0'],
        version: '1.0.0'
      }
    });

    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(fs.stat).toHaveBeenCalledTimes(2);

    const [[path0], [path1]] = vi.mocked(fs.stat).mock.calls;
    expect(path0).toEqual(pathlib.join(tabsDir, 'tab0'));
    expect(path1).toEqual(pathlib.join(tabsDir, 'tab0', 'src', 'index.tsx'));
  });

  test('valid manifest without tab check', async () => {
    const result = await manifest.getBundleManifest(bundle0Path);
    expect(result).toEqual({
      severity: 'success',
      manifest: {
        tabs: ['tab0'],
        version: '1.0.0'
      }
    });

    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(fs.stat).not.toHaveBeenCalled();
  });

  test('invalid manifest should not execute tab check (tabCheck true)', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "unknown": true, "tabs": ["unknown"] }');

    const result = await manifest.getBundleManifest(bundle0Path, true);
    expect(result).toEqual({
      severity: 'error',
      errors: ['instance is not allowed to have the additional property "unknown"']
    });

    expect(fs.stat).not.toHaveBeenCalled();
  });

  test('unknown tabs should pass without tab check', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["unknown"] }');

    const result = await manifest.getBundleManifest(bundle0Path, false);
    expect(result).toEqual({
      severity: 'success',
      manifest: {
        tabs: ['unknown'],
        version: '1.0.0'
      }
    });

    expect(fs.stat).not.toHaveBeenCalled();
  });

  test('unknown tab cannot pass tab check', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["unknown"] }');

    const result = await manifest.getBundleManifest(bundle0Path, true);
    expect(result).toEqual({
      severity: 'error',
      errors: ['Unknown tab "unknown"']
    });

    expect(fs.stat).toHaveBeenCalledTimes(1);
    const [[path0]] = vi.mocked(fs.stat).mock.calls;
    expect(path0).toEqual(pathlib.join(tabsDir, 'unknown'));
  });

  test('unknown tabs cannot pass tab check', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["unknown1", "unknown2"] }');

    const result = await manifest.getBundleManifest(bundle0Path, true);
    expect(result).toEqual({
      severity: 'error',
      errors: [
        'Unknown tab "unknown1"',
        'Unknown tab "unknown2"',
      ]
    });

    expect(fs.stat).toHaveBeenCalledTimes(2);
    const [[path0], [path1]] = vi.mocked(fs.stat).mock.calls;
    expect(path0).toEqual(pathlib.join(tabsDir, 'unknown1'));
    expect(path1).toEqual(pathlib.join(tabsDir, 'unknown2'));
  });

  test('no tabs passes with tab check', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": [] }');

    const result = await manifest.getBundleManifest(bundle0Path, true);
    expect(result).toEqual({
      severity: 'success',
      manifest: {
        tabs: [],
        version: '1.0.0'
      }
    });

    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(fs.stat).not.toHaveBeenCalled();
  });
});

describe(manifest.getBundleManifests, () => {
  test('regular function', () => {
    return expect(manifest.getBundleManifests(bundlesDir, true))
      .resolves
      .toEqual({
        severity: 'success',
        manifests: {
          test0: {
            tabs: ['tab0'],
            version: '1.0.0'
          },
          test1: {
            tabs: ['tab1'],
            version: '1.0.0'
          }
        }
      });
  });

  it('collects resolution errors', async ({ ENOENT }) => {
    try {
      mockedReadFile.mockImplementation((p: PathLike | FileHandle) => {
        if (typeof p !== 'string') throw new Error('readFile should been called with string');

        if (p.includes('not_bundle')) {
          throw ENOENT;
        }

        if (p.endsWith('manifest.json')) {
          return Promise.resolve('{ "unknown": false }');
        }
        if (p.endsWith('package.json')) {
          return Promise.resolve('{ "version": "1.0.0", "name": "@sourceacademy/bundle-something" }');
        }

        throw new Error('Should not get here');
      });

      await expect(manifest.getBundleManifests(bundlesDir)).resolves.toEqual({
        severity: 'error',
        errors: [
          'test0: instance is not allowed to have the additional property "unknown"',
          'test1: instance is not allowed to have the additional property "unknown"',
        ]
      });
    } finally {
      mockedReadFile.mockReset();
    }
  });
});

describe(manifest.resolveSingleBundle, () => {
  const bundlePath = pathlib.join(bundlesDir, 'test0');

  test('normal function', () => {
    return expect(manifest.resolveSingleBundle(bundlePath)).resolves.toEqual({
      severity: 'success',
      bundle: {
        type: 'bundle',
        name: 'test0',
        manifest: {
          tabs: ['tab0'],
          version: '1.0.0'
        },
        directory: bundlePath
      }
    });
  });

  it('doesn\'t consider a non-directory a bundle', async () => {
    mockedFsStat.mockResolvedValueOnce({
      isDirectory: () => false
    } as any);

    await expect(manifest.resolveSingleBundle(pathlib.join(bundlePath))).resolves.toEqual({
      severity: 'error',
      errors: [`${bundlePath} is not a directory!`]
    });

    expect(fs.stat).toHaveBeenCalledOnce();
  });

  it('returns the error message if stat throws an error that isn\'t ENOENT', async () => {
    mockedFsStat.mockRejectedValueOnce(new Error('Unknown message'));

    await expect(manifest.resolveSingleBundle(bundlePath)).resolves.toEqual({
      severity: 'error',
      errors: [`An error occurred while trying to read from ${bundlePath}: Error: Unknown message`]
    });

    expect(fs.stat).toHaveBeenCalledOnce();
  });

  it('returns a different error message if stat throws ENOENT', async ({ ENOENT }) => {
    mockedFsStat.mockRejectedValueOnce(ENOENT);

    await expect(manifest.resolveSingleBundle(bundlePath)).resolves.toEqual({
      severity: 'error',
      errors: [`${bundlePath} does not exist!`]
    });

    expect(fs.stat).toHaveBeenCalledOnce();
  });

  describe('test resolving the entrypoint', () => {
    it('returns the appropriate error message if the entrypoint isn\'t a file', async () => {
      mockedFsStat.mockResolvedValueOnce({ isDirectory: () => true } as any)
        .mockResolvedValueOnce({ isFile: () => false } as any);

      await expect(manifest.resolveSingleBundle(bundlePath)).resolves.toEqual({
        severity: 'error',
        errors: [`${pathlib.join(bundlePath, 'src', 'index.ts')} is not a file!`]
      });

      expect(fs.stat).toHaveBeenCalledTimes(2);
    });

    it('throws the error if it isn\'t ENOENT', async () => {
      mockedFsStat.mockResolvedValueOnce({ isDirectory: () => true } as any)
        .mockRejectedValueOnce({});

      await expect(manifest.resolveSingleBundle(bundlePath)).rejects.toEqual({});
      expect(fs.stat).toHaveBeenCalledTimes(2);
    });

    it('returns a different error message stat throws ENOENT', async ({ ENOENT }) => {
      mockedFsStat.mockResolvedValueOnce({ isDirectory: () => true } as any)
        .mockRejectedValueOnce(ENOENT);

      await expect(manifest.resolveSingleBundle(bundlePath)).resolves.toEqual({
        severity: 'error',
        errors: ['Could not find entrypoint!']
      });

      expect(fs.stat).toHaveBeenCalledTimes(2);
    });
  });
});

describe(manifest.resolveEitherBundleOrTab, () => {
  const bundle0Path = pathlib.join(bundlesDir, 'test0');
  test('resolving bundle', () => {
    return expect(manifest.resolveEitherBundleOrTab(bundle0Path)).resolves.toEqual({
      severity: 'success',
      asset: {
        type: 'bundle',
        manifest: {
          tabs: ['tab0'],
          version: '1.0.0',
        },
        directory: bundle0Path,
        name: 'test0',
      }
    });
  });

  test('resolving bundle with manifest error returns the error', () => {
    mockedReadFile.mockResolvedValueOnce('{ "unknown": true }');

    return expect(manifest.resolveEitherBundleOrTab(bundle0Path)).resolves.toEqual({
      severity: 'error',
      errors: ['instance is not allowed to have the additional property "unknown"']
    });
  });

  const tab0OPath = pathlib.join(tabsDir, 'tab0');
  test('resolving tab', () => {
    return expect(manifest.resolveEitherBundleOrTab(tab0OPath)).resolves.toEqual({
      severity: 'success',
      asset: {
        type: 'tab',
        directory: tab0OPath,
        entryPoint: pathlib.join(tab0OPath, 'src', 'index.tsx'),
        name: 'tab0',
      }
    });
  });

  test('resolving to nothing returns error severity and empty errors array', () => {
    return expect(manifest.resolveEitherBundleOrTab(testMocksDir)).resolves.toEqual({
      severity: 'error',
      errors : []
    });
  });
});

describe(manifest.resolveAllTabs, () => {
  test('regular function', async () => {
    const resolved = await manifest.resolveAllTabs(bundlesDir, tabsDir);
    expectSuccess(resolved.severity);

    const { tabs } = resolved;

    expect(tabs).toHaveProperty('tab0');
    expect(tabs.tab0).toMatchObject({
      entryPoint: pathlib.join(testMocksDir, 'tabs', 'tab0', 'src', 'index.tsx'),
      directory: pathlib.join(testMocksDir, 'tabs', 'tab0'),
      name: 'tab0'
    });

    expect(tabs).toHaveProperty('tab1');
    expect(tabs.tab1).toMatchObject({
      entryPoint: pathlib.join(testMocksDir, 'tabs', 'tab1', 'index.tsx'),
      directory: pathlib.join(testMocksDir, 'tabs', 'tab1'),
      name: 'tab1'
    });
  });
});
