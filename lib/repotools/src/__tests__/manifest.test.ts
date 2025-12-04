import type { PathLike } from 'fs';
import fs, { type FileHandle } from 'fs/promises';
import pathlib from 'path';
import { describe, expect, it as baseIt, test, vi } from 'vitest';
import { bundlesDir, tabsDir } from '../getGitRoot.js';
import * as manifest from '../manifest.js';

const bundle0Path = pathlib.join(bundlesDir, 'test0');

const tab0Path = pathlib.join(tabsDir, 'tab0');
const tab1Path = pathlib.join(tabsDir, 'tab1');

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
    const resolved = await manifest.resolveSingleTab(tab0Path);

    expect(resolved).not.toBeUndefined();
    expect(resolved).toMatchObject({
      entryPoint: pathlib.join(tab0Path, 'src', 'index.tsx'),
      directory: tab0Path,
      name: 'tab0'
    });
  });

  it('properly detects a bundle with the index.tsx entrypoint', async () => {
    const resolved = await manifest.resolveSingleTab(tab1Path);

    expect(resolved).not.toBeUndefined();
    expect(resolved).toMatchObject({
      entryPoint: pathlib.join(tab1Path, 'index.tsx'),
      directory: tab1Path,
      name: 'tab1'
    });
  });

  it('doesn\'t consider a non-directory a tab', async () => {
    mockedFsStat.mockResolvedValueOnce({
      isDirectory: () => false
    } as any);

    await expect(manifest.resolveSingleTab(tab1Path)).resolves.toBeUndefined();
    expect(fs.stat).toHaveBeenCalledOnce();
  });

  it('returns undefined when the specified path doesn\'t exist', async ({ ENOENT }) => {
    mockedFsStat.mockRejectedValueOnce(ENOENT);
    await expect(manifest.resolveSingleTab('/')).resolves.toBeUndefined();
    expect(fs.stat).toHaveBeenCalledOnce();
  });

  it('throws the error when the error is of an unknown type', async () => {
    mockedFsStat.mockRejectedValueOnce({});
    await expect(manifest.resolveSingleTab('/')).rejects.toEqual({});
    expect(fs.stat).toHaveBeenCalledOnce();
  });
});

describe(manifest.getBundleManifest, () => {
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
    expect(path0).toEqual(tab0Path);
    expect(path1).toEqual(pathlib.join(tab0Path, 'src', 'index.tsx'));
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

    await expect(manifest.getBundleManifest(bundle0Path, true))
      .resolves
      .toEqual({
        severity: 'error',
        errors: [
          'test0: instance is not allowed to have the additional property "unknown"'
        ]
      });
    expect(fs.stat).not.toHaveBeenCalled();
  });

  test('invalid package name should not pass', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "requires": 1, "tabs": ["unknown"] }');
    mockedReadFile.mockResolvedValueOnce('{ "name": "invalid_name" }');

    const result = await manifest.getBundleManifest(bundle0Path, false);
    expect(result).toEqual({
      severity: 'error',
      errors: ['test0: The package name "invalid_name" does not follow the correct format!']
    });
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
      errors: ['test0: Unknown tab "unknown"']
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
        'test0: Unknown tab "unknown1"',
        'test0: Unknown tab "unknown2"',
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
  test('normal function', () => {
    return expect(manifest.resolveSingleBundle(bundle0Path)).resolves.toEqual({
      severity: 'success',
      bundle: {
        type: 'bundle',
        name: 'test0',
        manifest: {
          tabs: ['tab0'],
          version: '1.0.0'
        },
        directory: bundle0Path
      }
    });
  });

  it('doesn\'t consider a non-directory a bundle', async () => {
    mockedFsStat.mockResolvedValueOnce({
      isDirectory: () => false
    } as any);

    await expect(manifest.resolveSingleBundle(bundle0Path)).resolves.toEqual({
      severity: 'error',
      errors: [`${bundle0Path} is not a directory!`]
    });

    expect(fs.stat).toHaveBeenCalledOnce();
  });

  it('returns the error message if stat throws an error that isn\'t ENOENT', async () => {
    mockedFsStat.mockRejectedValueOnce(new Error('Unknown message'));

    await expect(manifest.resolveSingleBundle(bundle0Path)).resolves.toEqual({
      severity: 'error',
      errors: [`An error occurred while trying to read from ${bundle0Path}: Error: Unknown message`]
    });

    expect(fs.stat).toHaveBeenCalledOnce();
  });

  it('returns a different error message if stat throws ENOENT', async ({ ENOENT }) => {
    mockedFsStat.mockRejectedValueOnce(ENOENT);

    await expect(manifest.resolveSingleBundle(bundle0Path)).resolves.toEqual({
      severity: 'error',
      errors: [`${bundle0Path} does not exist!`]
    });

    expect(fs.stat).toHaveBeenCalledOnce();
  });

  describe('test resolving the entrypoint', () => {
    it('returns the appropriate error message if the entrypoint isn\'t a file', async () => {
      mockedFsStat.mockResolvedValueOnce({ isDirectory: () => true } as any)
        .mockResolvedValueOnce({ isFile: () => false } as any);

      await expect(manifest.resolveSingleBundle(bundle0Path)).resolves.toEqual({
        severity: 'error',
        errors: [`${pathlib.join(bundle0Path, 'src', 'index.ts')} is not a file!`]
      });

      expect(fs.stat).toHaveBeenCalledTimes(2);
    });

    it('throws the error if it isn\'t ENOENT', async () => {
      mockedFsStat.mockResolvedValueOnce({ isDirectory: () => true } as any)
        .mockRejectedValueOnce({});

      await expect(manifest.resolveSingleBundle(bundle0Path)).rejects.toEqual({});
      expect(fs.stat).toHaveBeenCalledTimes(2);
    });

    it('returns a different error message stat throws ENOENT', async ({ ENOENT }) => {
      mockedFsStat.mockResolvedValueOnce({ isDirectory: () => true } as any)
        .mockRejectedValueOnce(ENOENT);

      await expect(manifest.resolveSingleBundle(bundle0Path)).resolves.toEqual({
        severity: 'error',
        errors: ['Could not find entrypoint!']
      });

      expect(fs.stat).toHaveBeenCalledTimes(2);
    });
  });
});

describe(manifest.resolveEitherBundleOrTab, () => {
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

  test('resolving bundle with manifest error returns the error', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "unknown": true }');

    await expect(manifest.resolveEitherBundleOrTab(bundle0Path)).resolves.toEqual({
      severity: 'error',
      errors: ['test0: instance is not allowed to have the additional property "unknown"']
    });

    expect(fs.readFile).toHaveBeenCalledOnce();
  });

  test('resolving tab', () => {
    return expect(manifest.resolveEitherBundleOrTab(tab0Path)).resolves.toEqual({
      severity: 'success',
      asset: {
        type: 'tab',
        directory: tab0Path,
        entryPoint: pathlib.join(tab0Path, 'src', 'index.tsx'),
        name: 'tab0',
      }
    });
  });

  test('resolving to nothing returns error severity and empty errors array', () => {
    return expect(manifest.resolveEitherBundleOrTab('/')).resolves.toEqual({
      severity: 'error',
      errors: []
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
      entryPoint: pathlib.join(tab0Path, 'src', 'index.tsx'),
      directory: tab0Path,
      name: 'tab0'
    });

    expect(tabs).toHaveProperty('tab1');
    expect(tabs.tab1).toMatchObject({
      entryPoint: pathlib.join(tab1Path, 'index.tsx'),
      directory: tab1Path,
      name: 'tab1'
    });
  });
});
