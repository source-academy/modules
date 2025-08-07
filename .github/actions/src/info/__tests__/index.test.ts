import * as exec from '@actions/exec';
import { describe, expect, it, vi } from 'vitest';
import { checkForChanges } from '../index.js';

vi.mock(import('lodash/memoize.js'), () => ({
  default: (x: any) => x
}) as any);

const mockedExecOutput = vi.spyOn(exec, 'getExecOutput');

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
