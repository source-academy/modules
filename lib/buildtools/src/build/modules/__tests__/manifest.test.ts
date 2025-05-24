import fs from 'fs/promises';
import pathlib from 'path';
import { describe, expect, test, vi, type MockedFunction } from 'vitest';
import * as utils from '../../../utils';
import { getBundleManifest, resolveSingleBundle } from '../../manifest';

vi.unmock('fs/promises');
vi.spyOn(fs, 'readFile');

const mockedReadFile = fs.readFile as MockedFunction<typeof fs.readFile>;

const testMocksDir = pathlib.resolve(import.meta.dirname, '../../../', '__test_mocks__');
vi.spyOn(utils, 'getTabsDir').mockResolvedValue(`${testMocksDir}/tabs`);

describe('Test schema validation', () => {
  test('Valid Schema', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": [] }');

    await expect(getBundleManifest('yes'))
      .resolves
      .toMatchObject({
        tabs: []
      });
  });

  test('Valid Schema with tabs', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"] }');

    await expect(getBundleManifest('yes'))
      .resolves
      .toMatchObject({
        tabs: ['tab0', 'tab1']
      });
  });

  test('Valid schema with tabs and verification', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0"] }');

    await expect(getBundleManifest('yes', true))
      .resolves
      .toMatchObject({
        tabs: ['tab0']
      });
  });

  test('Valid schema with invalid tab verification', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab1"] }');

    await expect(getBundleManifest('yes', true))
      .rejects.toThrow();
  });

  test('Schema with additional properties', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"], "unknown": true }');

    await expect(getBundleManifest('yes'))
      .rejects
      .toThrow();
  });

  test('Schema with invalid requires', async () => {
    mockedReadFile.mockResolvedValueOnce('{ "tabs": ["tab0", "tab1"], "requires": "yes" }');

    await expect(getBundleManifest('yes'))
      .rejects
      .toThrow();
  });
});

describe('Test resolving bundles', () => {
  test('resolveSingleBundle with an actual bundle', async () => {
    const bundleDir = pathlib.join(testMocksDir, 'bundles/test0');
    const promise = resolveSingleBundle(bundleDir);
    await expect(promise).resolves.toMatchObject({
      directory: bundleDir,
      entryPoint: `${bundleDir}/index.ts`,
      manifest: {
        tabs: ['tab0']
      },
      name: 'test0'
    });
  });

  test('resolveSingleBundle with a non-existent bundle', async () => {
    const bundleDir = pathlib.join(testMocksDir, 'bundles/not_bundle');
    await expect(resolveSingleBundle(bundleDir)).resolves.toBeUndefined();
  });
});
