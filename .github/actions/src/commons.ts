import { getExecOutput } from '@actions/exec';
import { memoize } from 'es-toolkit';

type PackageType = 'bundle' | 'tab' | 'lib' | null;

export interface RawPackageRecord {
  directory: string;
  hasChanges: boolean;
  package: {
    name: string;
    devDependencies: Record<string, string>;
    dependencies: Record<string, string>;
  };
  type: PackageType;
}

interface BasePackageRecord<T extends PackageType> {
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

  type: T;
}

export interface BundlePackageRecord extends BasePackageRecord<'bundle'> {
  bundleName: string;
}

export interface TabPackageRecord extends BasePackageRecord<'tab'> {
  tabName: string;
}

export type PackageRecord = BundlePackageRecord | TabPackageRecord | BasePackageRecord<'lib' | null>;

export function isPackageRecord(obj: unknown): obj is PackageRecord {
  if (typeof obj !== 'object' || obj === null) return false;

  if (!('directory' in obj) || typeof obj.directory !== 'string') return false;
  if (!('name' in obj) || typeof obj.name !== 'string') return false;
  if (!('changes' in obj) || typeof obj.changes !== 'boolean') return false;
  if (!('needsPlaywright' in obj) || typeof obj.needsPlaywright !== 'boolean') return false;

  if ('bundleName' in obj) {
    if ('tabName' in obj || typeof obj.bundleName !== 'string') return false;
  } else if ('tabName' in obj) {
    if (typeof obj.tabName !== 'string') return false;
  }

  return true;
}

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
      ignoreReturnCode: true
    }
  );
  return exitCode !== 0;
});

/**
 * Format of each entry produced when running the command `yarn workspaces list --json`.
 */
export interface YarnWorkspaceRecord {
  location: string;
  name: string;
}

export async function runYarnWorkspacesList() {
  const { stdout } = await getExecOutput('yarn workspaces list --json', [], { silent: true });
  return stdout.trim();
}
