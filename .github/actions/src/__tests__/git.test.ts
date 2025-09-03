import * as exec from '@actions/exec';
import { describe, expect, it, vi } from 'vitest';
import * as git from '../commons.js';

vi.mock(import('lodash/memoize.js'), () => ({
  default: (x: any) => x
}) as any);

const mockedExecOutput = vi.spyOn(exec, 'getExecOutput');

describe(git.checkForChanges, () => {
  function mockChanges(value: boolean) {
    mockedExecOutput.mockResolvedValueOnce({
      exitCode: value ? 1 : 0, stdout: '', stderr: ''
    });
  }

  it('should return true if git diff exits with non zero code', async () => {
    mockChanges(true);
    await expect(git.checkForChanges('/')).resolves.toEqual(true);
    expect(mockedExecOutput).toHaveBeenCalledOnce();
  });

  it('should return false if git diff exits with 0', async () => {
    mockChanges(false);

    await expect(git.checkForChanges('/')).resolves.toEqual(false);
    expect(mockedExecOutput).toHaveBeenCalledOnce();
  });
});
