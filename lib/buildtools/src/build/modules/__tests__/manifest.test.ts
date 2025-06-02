import fs from 'fs/promises';
import pathlib from 'path';
import { describe, expect, it, test, vi, type MockedFunction } from 'vitest';
import { writeManifest } from '..';
import * as dirUtils from '../../../getGitRoot';
import { getBundleManifest, getBundleManifests, resolveSingleBundle } from '../../manifest';

vi.unmock('fs/promises');
vi.spyOn(fs, 'readFile');

const asMockedFunc = <T extends (...args: any[]) => any>(func: T) => func as MockedFunction<T>;

const testMocksDir = pathlib.resolve(import.meta.dirname, '../../../', '__test_mocks__');
vi.spyOn(dirUtils, 'getTabsDir').mockResolvedValue(`${testMocksDir}/tabs`);

describe('Test schema validation', () => {
  const mockedReadFile = asMockedFunc(fs.readFile);
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

describe('Test writing manifest', () => {
  vi.spyOn(fs, 'writeFile').mockResolvedValue();

  test('Manifest', async () => {
    await writeManifest({
      test0: {
        manifest: {
          tabs: ['tab0']
        }
      },
      test1: {
        manifest: {}
      }
    } as any, '/build');

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    const [[path, data]] = asMockedFunc(fs.writeFile).mock.calls;

    expect(path).toEqual('/build/modules.json');
    expect(JSON.parse(data as string)).toMatchObject({
      test0: { tabs: ['tab0'] },
      test1: {}
    });
  });
});

describe('Test getBundleManifests', () => {
  vi.spyOn(fs, 'readdir');

  const mockedReadDir = asMockedFunc(fs.readdir);
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
