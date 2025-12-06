import { getExecOutput } from '@actions/exec';
import memoize from 'lodash/memoize.js';

/**
 * Returns `true` if there are changes present in the given directory relative to
 * the master branch\
 * Used to determine, particularly for libraries, if running tests and tsc are necessary
 */
export const checkDirForChanges = memoize(async (directory: string) => {
  const { exitCode } = await getExecOutput(
    'git',
    ['--no-pager', 'diff', '--quiet', 'origin/master', '--', directory],
    {
      failOnStdErr: false,
      ignoreReturnCode: true,
      silent: true
    }
  );
  return exitCode !== 0;
});
