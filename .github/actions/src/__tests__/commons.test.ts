import * as exec from '@actions/exec';
import { describe, expect, it, test, vi } from 'vitest';
import * as commons from '../commons.js';

vi.mock(import('lodash/memoize.js'), () => ({
  default: (x: any) => x
}) as any);

const mockedExecOutput = vi.spyOn(exec, 'getExecOutput');

describe('checkForChanges', () => {
  function mockChanges(value: boolean) {
    mockedExecOutput.mockResolvedValueOnce({
      exitCode: value ? 1 : 0, stdout: '', stderr: ''
    });
  }

  it('should return true if git diff exits with non zero code', async () => {
    mockChanges(true);
    await expect(commons.checkForChanges('/')).resolves.toEqual(true);
    expect(mockedExecOutput).toHaveBeenCalledOnce();
  });

  it('should return false if git diff exits with 0', async () => {
    mockChanges(false);

    await expect(commons.checkForChanges('/')).resolves.toEqual(false);
    expect(mockedExecOutput).toHaveBeenCalledOnce();
  });
});

describe(commons.isPackageRecord, () => {
  test('no bundleName or tabName property is ok', () => {
    expect(commons.isPackageRecord({
      directory: '',
      name: '',
      changes: false,
      needsPlaywright: false
    })).toEqual(true);
  });

  test('string bundleName property is ok', () => {
    expect(commons.isPackageRecord({
      directory: '',
      name: '',
      changes: false,
      needsPlaywright: false,
      bundleName: ''
    })).toEqual(true);
  });

  test('non-string bundleName property is not ok', () => {
    expect(commons.isPackageRecord({
      directory: '',
      name: '',
      changes: false,
      needsPlaywright: false,
      bundleName: 0
    })).toEqual(false);
  });

  test('string tabName property is ok', () => {
    expect(commons.isPackageRecord({
      directory: '',
      name: '',
      changes: false,
      needsPlaywright: false,
      tabName: ''
    })).toEqual(true);
  });
  
  test('non-string tabName property is not ok', () => {
    expect(commons.isPackageRecord({
      directory: '',
      name: '',
      changes: false,
      needsPlaywright: false,
      tabName: 0
    })).toEqual(false);
  });

  test('having both bundleName and tabName property is not ok', () => {
    expect(commons.isPackageRecord({
      directory: '',
      name: '',
      changes: false,
      needsPlaywright: false,
      tabName: '',
      bundleName: ''
    })).toEqual(false);
  });
});
