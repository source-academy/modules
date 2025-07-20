import fs from 'fs/promises';
import { describe, expect, it, test, vi } from 'vitest';
import { expectIsError, expectIsSuccess, testMocksDir } from '../../__tests__/fixtures.js';
import { getBundleManifest, getBundleManifests, resolveAllBundles, resolveSingleBundle, type GetBundleManifestResult } from '../manifest.js';

vi.mock(import('../../getGitRoot.js'));

describe('Test bundle manifest schema validation succeeds', () => {
  const mockedReadFile = vi.spyOn(fs, 'readFile');

  test('Valid Schema', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": [] }');
    mockedReadFile.mockResolvedValueOnce('{ "version": "1.0.0" }');

    const expected: GetBundleManifestResult = {
      severity: 'success',
      manifest: {
        tabs: [],
        version: '1.0.0'
      }
    };

    await expect(getBundleManifest('yes'))
      .resolves
      .toMatchObject(expected);
  });

  test('Valid Schema with tabs without verification succeeds', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"] }');
    mockedReadFile.mockResolvedValueOnce('{ "version": "1.0.0" }');

    const expected: GetBundleManifestResult = {
      severity: 'success',
      manifest: {
        tabs: ['tab0', 'tab1'],
        version: '1.0.0'
      }
    };

    await expect(getBundleManifest('yes', false))
      .resolves
      .toMatchObject(expected);
  });

  test('Valid schema with tabs and verification succeeds', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0"] }');
    mockedReadFile.mockResolvedValueOnce('{}');

    const expected: GetBundleManifestResult = {
      severity: 'success',
      manifest: {
        tabs: ['tab0']
      }
    };

    await expect(getBundleManifest('yes', true))
      .resolves
      .toMatchObject(expected);
  });

  test('Valid schema with invalid tab verification', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab2"] }');
    mockedReadFile.mockResolvedValueOnce('{}');

    const result = await getBundleManifest('yes', true);
    expect(result).not.toBeUndefined();
    expectIsError(result!.severity);

    expect(result!.errors.length).toEqual(1);
    const [err] = result!.errors;
    expect(err).toEqual('Unknown tab tab2');
  });

  test('Schema with additional properties', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"], "unknown": true }');
    mockedReadFile.mockResolvedValueOnce('{}');

    const result = await getBundleManifest('yes');
    expect(result).not.toBeUndefined();
    expectIsError(result!.severity);

    expect(result!.errors.length).toEqual(1);
    const [err] = result!.errors;
    expect(err).toMatchInlineSnapshot(`"instance is not allowed to have the additional property "unknown""`);
  });

  test('Schema with invalid requires', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"], "requires": "yes" }');
    mockedReadFile.mockResolvedValueOnce('{}');

    const result = await getBundleManifest('yes');
    expect(result).not.toBeUndefined();
    expectIsError(result!.severity);

    expect(result!.errors.length).toEqual(1);
    const [err] = result!.errors;
    expect(err).toMatchInlineSnapshot(`"instance.requires is not one of enum values: 1,2,3,4"`);
  });
});

describe('Test getBundleManifests', () => {
  const mockedReadDir = vi.spyOn(fs, 'readdir');

  it('should return the error if readdir throws an error', async () => {
    const errorObject = new class extends Error {
      code = 'ENOENT';
    };

    mockedReadDir.mockRejectedValueOnce(errorObject);

    const result = await getBundleManifests('/src/bundles');
    expectIsError(result.severity);
  });
});

describe('Test resolveSingleBundle', () => {
  it('Properly detects a bundle with the src/index.ts entrypoint', async () => {
    const resolved = await resolveSingleBundle(`${testMocksDir}/bundles/test0`);

    expect(resolved).not.toBeUndefined();
    expectIsSuccess(resolved!.severity);

    expect(resolved!.bundle.name).toEqual('test0');
    expect(resolved!.bundle.manifest.tabs).toEqual(['tab0']);
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
    expect(resolved).toMatchObject({
      severity: 'error',
      errors: [expect.any(String)]
    });

    const stats = await fs.stat(path);
    expect(stats.isDirectory()).toEqual(false);
  });
});

describe('Test resolveAllBundles', () => {
  it('Properly detects bundles and non-bundles', async () => {
    const resolved = await resolveAllBundles(`${testMocksDir}/bundles`);

    expectIsSuccess(resolved.severity);

    expect(resolved.bundles.test0).toMatchObject({
      name: 'test0',
      directory: `${testMocksDir}/bundles/test0`,
      manifest: {
        tabs: ['tab0']
      }
    });

    expect(resolved.bundles.test1).toMatchObject({
      name: 'test1',
      directory: `${testMocksDir}/bundles/test1`,
      manifest: {}
    });

    expect(resolved).not.toHaveProperty('not_bundle');
    expect(resolved).not.toHaveProperty('tsconfig.json');
  });
});
