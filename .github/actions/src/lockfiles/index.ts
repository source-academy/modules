import { getExecOutput } from '@actions/exec';
import memoize from 'lodash/memoize.js';
import { getPackageDiffs, getPackageReason } from './utils.js';

/**
 * Returns `true` if there are changes present in the given directory relative to
 * the master branch\
 * Used to determine, particularly for libraries, if running tests and tsc are necessary
 */
export const hasLockFileChanged = memoize(async () => {
  const { exitCode } = await getExecOutput(
    'git --no-pager diff --quiet origin/master -- yarn.lock',
    [],
    {
      failOnStdErr: false,
      ignoreReturnCode: true
    }
  );
  return exitCode !== 0;
});

/**
 * Gets a list of packages that have had some dependency of theirs
 * change according to the lockfile but not their package.json
 */
export async function getPackagesWithResolutionChanges() {
  const packages = [...await getPackageDiffs()];
  const workspaces = await Promise.all(packages.map(getPackageReason));
  return new Set(workspaces.flat());
}
