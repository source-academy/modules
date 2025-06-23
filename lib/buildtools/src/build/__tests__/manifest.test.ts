import fs from 'fs/promises';
import { describe, expect, it, test, vi } from 'vitest';
import { testMocksDir } from '../../__tests__/fixtures.js';
import { getBundleManifest, getBundleManifests, resolveAllBundles, resolveSingleBundle } from '../manifest.js';

vi.mock(import('../../getGitRoot.js'));

describe('Test bundle manifest schema validation', () => {
  const mockedReadFile = vi.spyOn(fs, 'readFile');

  test('Valid Schema', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": [] }');
    mockedReadFile.mockResolvedValueOnce('{ version: "1.0.0" }');

    await expect(getBundleManifest('yes'))
      .resolves
      .toMatchObject({
        tabs: [],
        version: '1.0.0'
      });
  });

  test('Valid Schema with tabs without verification', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"] }');
    mockedReadFile.mockResolvedValueOnce('{ version: "1.0.0" }');

    await expect(getBundleManifest('yes', false))
      .resolves
      .toMatchObject({
        tabs: ['tab0', 'tab1'],
        version: '1.0.0'
      });
  });

  test('Valid schema with tabs and verification', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0"] }');
    mockedReadFile.mockResolvedValueOnce('{}');

    await expect(getBundleManifest('yes', true))
      .resolves
      .toMatchObject({
        tabs: ['tab0']
      });
  });

  test('Valid schema with invalid tab verification', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab2"] }');
    mockedReadFile.mockResolvedValueOnce('{}');

    await expect(getBundleManifest('yes', true))
      .rejects.toThrow();
  });

  test('Schema with additional properties', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"], "unknown": true }');
    mockedReadFile.mockResolvedValueOnce('{}');

    await expect(getBundleManifest('yes'))
      .rejects
      .toThrow();
  });

  test('Schema with invalid requires', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"], "requires": "yes" }');
    mockedReadFile.mockResolvedValueOnce('{}');

    await expect(getBundleManifest('yes'))
      .rejects
      .toThrow();
  });
});

describe('Test getBundleManifests', () => {
  const mockedReadDir = vi.spyOn(fs, 'readdir');

  it('should return undefined when the bundles directory doesn\'t exist', async () => {
    mockedReadDir.mockRejectedValueOnce(new class extends Error {
      code = 'ENOENT';
    });

    await expect(getBundleManifests('/src/bundles')).resolves.toEqual({});
  });

  it('should throw the error if the error code isn\'t ENOENT', async () => {
    mockedReadDir.mockRejectedValueOnce(new class extends Error {
      code = 'ENOPERM';
    });

    await expect(getBundleManifests('/src/bundles')).rejects.toThrowError();
  });

  it('should throw any other error', async () => {
    const err = new Error('help me');
    mockedReadDir.mockRejectedValueOnce(err);

    await expect(getBundleManifests('/src/bundles')).rejects.toThrowError(err);
  });
});

describe('Test resolveSingleBundle', () => {
  it('Properly detects a bundle with the src/index.ts entrypoint', async () => {
    const resolved = await resolveSingleBundle(`${testMocksDir}/bundles/test0`);

    expect(resolved).not.toBeUndefined();
    expect(resolved!.name).toEqual('test0');
    expect(resolved!.manifest.tabs).toEqual(['tab0']);
  });

  it('Doesn\'t consider a directory missing a manifest as a bundle', async () => {
    const path = `${testMocksDir}/bundles/not_bundle`;
    const resolved = await resolveSingleBundle(path);
    expect(resolved).toBeUndefined();

    const stats = await fs.stat(path);
    expect(stats.isDirectory()).toEqual(true);
  });

  it('Doesn\'t consider a non-directory a bundle', async () => {
    const path = `${testMocksDir}/bundles/tsconfig.json`;
    const resolved = await resolveSingleBundle(path);
    expect(resolved).toBeUndefined();

    const stats = await fs.stat(path);
    expect(stats.isDirectory()).toEqual(false);
  });
});

describe('Test resolveAllBundles', () => {
  it('Properly detects bundles and non-bundles', async () => {
    const resolved = await resolveAllBundles(`${testMocksDir}/bundles`);

    expect(resolved.test0).toMatchObject({
      name: 'test0',
      directory: `${testMocksDir}/bundles/test0`,
      manifest: {
        tabs: ['tab0']
      }
    });

    expect(resolved.test1).toMatchObject({
      name: 'test1',
      directory: `${testMocksDir}/bundles/test1`,
      manifest: {}
    });

    expect(resolved).not.toHaveProperty('not_bundle');
    expect(resolved).not.toHaveProperty('tsconfig.json');
  });
});
