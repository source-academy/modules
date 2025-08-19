import { getExecOutput } from '@actions/exec';
import memoize from 'lodash/memoize.js';

export interface RawPackageRecord {
  directory: string;
  hasChanges: boolean;
  package: {
    name: string;
    devDependencies: Record<string, string>;
    dependencies: Record<string, string>;
  };
}

interface BasePackageRecord {
  /**
   * Directory within which the `package.json` file was found
   */
  directory: string;

  /**
   * Full scoped package name
   */
  name: string;
  /**
   * `true` if git detected changes from within the package's subdirectories,
   * `false` otherwise
   */
  changes: boolean;
  /**
   * `true` if playwright is present under devDependencies. This means that the package
   * might need playwright for its tests
   */
  needsPlaywright: boolean;
}

export interface BundlePackageRecord extends BasePackageRecord {
  bundleName: string;
}

export interface TabPackageRecord extends BasePackageRecord {
  tabName: string;
}

export type PackageRecord = BundlePackageRecord | TabPackageRecord | BasePackageRecord;

export function isPackageRecord(obj: unknown): obj is PackageRecord {
  if (typeof obj !== 'object' || obj === null) return false;

  if (!('directory' in obj) || typeof obj.directory !== 'string') return false;
  if (!('name' in obj) || typeof obj.name !== 'string') return false;
  if (!('changes' in obj) || typeof obj.changes !== 'boolean') return false;
  if (!('needsPlaywright' in obj) || typeof obj.needsPlaywright !== 'boolean') return false;

  if ('bundleName' in obj && typeof obj.bundleName !== 'string') return false;
  if ('tabName' in obj && typeof obj.tabName !== 'string') return false;

  return true;
}

export function isPackageRecordArray(obj: unknown): obj is PackageRecord[] {
  return Array.isArray(obj) && !obj.some(each => !isPackageRecord(each));
}

// Not using the repotools version since this uses @action/exec instead of
// calling execFile from child_process

export async function getGitRoot() {
  const { stdout } = await getExecOutput('git rev-parse --show-toplevel');
  return stdout.trim();
}

/**
 * Returns `true` if there are changes present in the given directory relative to
 * the master branch\
 * Used to determine, particularly for libraries if running tests and tsc are necessary
 */
export const checkForChanges = memoize(async (directory: string) => {
  const { exitCode } = await getExecOutput(
    'git',
    ['--no-pager', 'diff', '--quiet', 'origin/master', '--', directory],
    {
      failOnStdErr: false,
      ignoreReturnCode: true
    }
  );
  return exitCode !== 0;
});
