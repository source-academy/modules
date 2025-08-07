import fs from 'fs/promises';
import pathlib from 'path';
import utils from 'util';
import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';
import getGitRoot from './gitRoot.js';

interface RawPackageRecord<T = boolean | null> {
  directory: string
  hasChanges: T
  package: {
    name: string
    devDependencies: Record<string, string>
    dependencies: Record<string, string>
  }
}

interface BasePackageRecord {
  /**
   * Directory within which the `package.json` file was found
   */
  directory: string
  /**
   * Full scoped package name
   */
  name: string
  /**
   * `true` if git detected changes from within the package's subdirectories,
   * `false` otherwise
   */
  changes: boolean
  /**
   * `true` if playwright is present under devDependencies. This means that the package
   * might need playwright for its tests
   */
  needsPlaywright: boolean
}

interface BundlePackageRecord extends BasePackageRecord {
  bundleName: string;
}

interface TabPackageRecord extends BasePackageRecord {
  tabName: string;
}

type PackageRecord = BundlePackageRecord | TabPackageRecord | BasePackageRecord;

/**
 * Returns `true` if there are changes present in the given directory relative to
 * the master branch\
 * Used to determine, particularly for libraries if running tests and tsc are necessary
 */
export async function checkForChanges(directory: string) {
  const { exitCode } = await getExecOutput(
    'git',
    ['--no-pager', 'diff', '--quiet', 'origin/master', '--', directory],
    {
      failOnStdErr: false,
      ignoreReturnCode: true
    }
  );
  return exitCode !== 0;
}

/**
 * Retrieves the information for all packages in the repository
 */
export async function getAllPackages(gitRoot: string, maxDepth?: number) {
  const output: Record<string, RawPackageRecord> = {};

  async function recurser(currentDir: string, currentDepth: number) {
    if (maxDepth !== undefined && currentDepth > maxDepth) return;

    const items = await fs.readdir(currentDir, { withFileTypes: true });
    await Promise.all(items.map(async item => {
      if (item.isFile()) {
        if (item.name === 'package.json') {
          try {
            const [hasChanges, packageJson] = await Promise.all([
              checkForChanges(currentDir),
              fs.readFile(pathlib.join(currentDir, 'package.json'), 'utf-8')
                .then(JSON.parse)
            ]);

            output[packageJson.name] = {
              directory: currentDir,
              hasChanges: hasChanges ? true : null,
              package: packageJson.name
            };
          } catch (error) {
            if (!utils.types.isNativeError(error)) {
              core.error(`Unknown error occurred ${error}`);
              throw error;
            }

            if ('code' in error && error.code !== 'ENOENT') {
              core.error(error);
              throw error;
            }
          }
        }
        return;
      }

      if (item.isDirectory() && item.name !== 'node_modules' && !item.name.startsWith('__')) {
        const fullPath = pathlib.join(currentDir, item.name);
        await recurser(fullPath, currentDepth + 1);
      }
    }));
  }

  /**
   * Recursively determine if the package has changes that call for
   * it to be rebuilt
   */
  function populateChanges(packageName: string): boolean {
    const packageInfo = output[packageName];
    if (packageInfo.hasChanges !== null) return packageInfo.hasChanges;

    const { dependencies, devDependencies } = packageInfo.package;
    if (dependencies) {
      for (const name of Object.keys(dependencies)) {
        if (!name.startsWith('@sourceacademy')) continue;

        const hasChanges = populateChanges(name);
        if (hasChanges) {
          packageInfo.hasChanges = true;
          return true;
        }
      }
    }

    if (devDependencies) {
      for (const name of Object.keys(devDependencies)) {
        if (name.startsWith('@sourceacademy')) continue;

        const hasChanges = populateChanges(name);
        if (hasChanges) {
          packageInfo.hasChanges = true;
          return true;
        }
      }
    }

    packageInfo.hasChanges = false;
    return false;
  }

  await recurser(gitRoot, 0);
  Object.keys(output).forEach(populateChanges);

  return Object.entries(output)
    .reduce<Record<string, PackageRecord>>((res, [key, value]) => ({
      ...res,
      [key]: rawRecordToFullRecord(key, value as RawPackageRecord<boolean>)
    }), {});
}

const packageNameRE = /^@sourceacademy\/(.+?)-(.+)$/u;
function rawRecordToFullRecord(
  packageName: string,
  {
    hasChanges,
    directory,
    package: { devDependencies }
  }: RawPackageRecord<boolean>
): PackageRecord {
  const needsPlaywright = !!devDependencies && 'playwright' in devDependencies;
  if (
    packageName !== '@sourceacademy/modules' &&
    packageName !== '@sourceacademy/bundles' &&
    packageName !== '@sourceacademy/tabs'
  ) {
    const match = packageNameRE.exec(packageName);
    if (!match) throw new Error(`Unknown package ${packageName}`);

    const [, packageType, baseName] = match;

    switch (packageType) {
      case 'bundle':
        return {
          changes: hasChanges,
          directory: directory,
          name: packageName,
          needsPlaywright,
          bundleName: baseName,
        };
      case 'tab':
        return {
          changes: hasChanges,
          directory: directory,
          name: packageName,
          needsPlaywright,
          tabName: baseName,
        };
    }
  }

  return {
    changes: hasChanges,
    directory: directory,
    name: packageName,
    needsPlaywright
  };
}

async function main() {
  const gitRoot = await getGitRoot();

  const [
    bundles,
    tabs,
    libs,
    rootPackages
  ] = await Promise.all([
    getAllPackages(pathlib.join(gitRoot, 'src', 'bundles')),
    getAllPackages(pathlib.join(gitRoot, 'src', 'tabs')),
    getAllPackages(pathlib.join(gitRoot, 'lib')),
    getAllPackages(pathlib.join(gitRoot), 1)
  ]);

  const packages = {
    ...rootPackages,
    ...bundles,
    ...tabs,
    ...libs
  };

  const summaryItems = Object.values(packages).map(packageInfo => {
    const relpath = pathlib.relative(gitRoot, packageInfo.directory);
    return `<div>
        <h2>${packageInfo.name}</h2>
        <ul>
          <li>Directory: <code>${relpath}</code></li>
          <li>Changes: <code>${packageInfo.changes}</code></li>
          <li>Needs Playwright: <code>${packageInfo.needsPlaywright}</code></li>
        </ul>
      </div>`;
  });

  core.summary.addList(summaryItems);
  await core.summary.write();

  core.setOutput('bundles', Object.values(bundles));
  core.setOutput('tabs', Object.values(tabs));
  core.setOutput('libs', Object.values(libs));
  core.setOutput('devserver', rootPackages['@sourceacademy/devserver']);
  core.setOutput('docserver', rootPackages['@sourceacademy/docserver']);

  const workflows = await checkForChanges(pathlib.join(gitRoot, '.github/workflows'));
  core.setOutput('workflows', workflows);
}

if (process.env.GITHUB_ACTIONS) {
  try {
    await main();
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
