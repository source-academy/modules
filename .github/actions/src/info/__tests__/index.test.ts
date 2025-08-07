import fs from 'fs/promises';
import * as exec from '@actions/exec';
import { describe, expect, it, test, vi } from 'vitest';
import { checkForChanges, getPackageInfo } from '../index.js';

const mockedExecOutput = vi.spyOn(exec, 'getExecOutput');
const mockedFsReadFile = vi.spyOn(fs, 'readFile');

describe('Test checkForChanges', () => {
  it('should return true if program exits with non zero code', async () => {
    mockedExecOutput.mockResolvedValueOnce({
      exitCode: 1, stdout: '', stderr: ''
    });

    await expect(checkForChanges('/')).resolves.toEqual(true);
    expect(mockedExecOutput).toHaveBeenCalledOnce();
  });

  it('should return false if program exits with 0', async () => {
    mockedExecOutput.mockResolvedValueOnce({
      exitCode: 0, stdout: '', stderr: ''
    });

    await expect(checkForChanges('/')).resolves.toEqual(false);
    expect(mockedExecOutput).toHaveBeenCalledOnce();
  });
});

describe('Test getPackageInfo', () => {
  /**
   * Use for momentarily mocking the loading of a package.json
   * file
   */
  function mockPackageJson(name: string, needsPlaywright: boolean, changes: boolean) {
    const data: Record<string, unknown> = {
      name
    };

    if (needsPlaywright) {
      data.devDependencies = {
        playwright: '^1.54.0'
      };
    }

    mockedFsReadFile.mockResolvedValueOnce(JSON.stringify(data));
    mockedExecOutput.mockResolvedValueOnce({
      exitCode: changes ? 1 : 0, stdout: '', stderr: ''
    });
  }

  test('regular loading of bundle', async () => {
    mockPackageJson('@sourceacademy/bundle-bundle0', false, true);

    return expect(getPackageInfo('/')).resolves.toMatchObject({
      directory: '/',
      changes: true,
      needsPlaywright: false,
      bundleName: 'bundle0'
    });
  });

  test('regular loading of tab without playwright', () => {
    mockPackageJson('@sourceacademy/tab-Tab0', false, true);
    return expect(getPackageInfo('/')).resolves.toMatchObject({
      directory: '/',
      changes: true,
      needsPlaywright: false,
      tabName: 'Tab0'
    });
  });

  test('regular loading of a library without playwright', () => {
    mockPackageJson('@sourceacademy/modules-lib', false, true);
    return expect(getPackageInfo('/')).resolves.toMatchObject({
      directory: '/',
      changes: true,
      needsPlaywright: false,
    });
  });

  test('loading a library without changes', () => {
    mockPackageJson('@sourceacademy/modules-lib', false, false);
    return expect(getPackageInfo('/')).resolves.toMatchObject({
      directory: '/',
      changes: false,
      needsPlaywright: false,
    });
  });

  test('loading a library that needs playwright', () => {
    mockedExecOutput.mockResolvedValueOnce({
      exitCode: 1, stdout: '', stderr: ''
    });

    mockPackageJson('@sourceacademy/modules-lib', true, true);
    return expect(getPackageInfo('/')).resolves.toMatchObject({
      directory: '/',
      changes: true,
      needsPlaywright: true,
    });
  });

  test('loading an unknown package', () => {
    mockPackageJson('unknown-package', false, false);
    return expect(getPackageInfo('/')).rejects.toThrowError('Failed to match package name: unknown-package');
  });
});
