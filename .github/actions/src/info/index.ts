import fs from 'fs/promises';
import pathlib from 'path';
import utils from 'util';
import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';

interface BasePackageRecord {
  directory: string
  name: string
  changes: boolean
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
async function checkForChanges(directory: string) {
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

const packageNameRE = /^@sourceacademy\/(.+?)-(.+)$/u;

/**
 * Retrieves the information for a given package.
 * @param directory The directory containing the `package.json` for the given package.
 */
async function getPackageInfo(directory: string): Promise<PackageRecord> {
  const { default: { name, devDependencies } } = await import(`${directory}/package.json`, { with: { type: 'json' } });
  const match = packageNameRE.exec(name);

  if (!match) {
    throw new Error(`Failed to match package name: ${name}`);
  }

  const changes = await checkForChanges(directory);
  const [,packageType, packageBaseName] = match;

  switch (packageType) {
    case 'bundle':
      return {
        directory: directory,
        changes,
        name,
        needsPlaywright: false,
        bundleName: packageBaseName,
      };

    case 'tab':
      return {
        directory: directory,
        changes,
        name,
        needsPlaywright: 'playwright' in devDependencies,
        tabName: packageBaseName,
      };
    default: {
      return {
        directory: directory,
        changes,
        name,
        needsPlaywright: 'playwright' in devDependencies
      };
    }
  }
}

/**
 * Recursively locates the packages present in a directory, up to an optional max depth
 */
async function findPackages(directory: string, maxDepth?: number) {
  const output: BasePackageRecord[] = [];

  async function* recurser(currentDir: string, currentDepth: number): AsyncGenerator<PackageRecord> {
    if (maxDepth !== undefined && currentDepth >= maxDepth) return;

    const items = await fs.readdir(currentDir, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile()) {
        if (item.name === 'package.json') {
          try {
            yield await getPackageInfo(currentDir);
          } catch (error) {
            if (!utils.types.isNativeError(error)) {
              core.error(`Unknown error occurred ${error}`);
              throw error;
            }

            if ('code' in error && error.code !== 'ERR_MODULE_NOT_FOUND') {
              core.error(error);
              throw error;
            }
          }
        }
        continue;
      }

      if (item.isDirectory() && item.name !== 'node_modules' && !item.name.startsWith('__')) {
        const fullPath = pathlib.join(currentDir, item.name);
        yield* recurser(fullPath, currentDepth + 1);
      }
    }
  }

  for await (const each of recurser(directory, 0)) {
    output.push(each);
  }

  return output;
}

async function runForAllPackages(gitRoot: string) {
  const results = await Promise.all(
    Object.entries({
      libs: pathlib.join(gitRoot, 'lib'),
      bundles: pathlib.join(gitRoot, 'src', 'bundles'),
      tabs: pathlib.join(gitRoot, 'src', 'tabs')
    }).map(async ([packageType, dirPath]): Promise<[string, BasePackageRecord[]]> => {
      const packages = await findPackages(dirPath);
      core.info(`Found ${packages.length} ${packageType} packages`);
      return [packageType, packages];
    })
  );

  for (const [packageType, packages] of results) {
    core.summary.addHeading(`${packageType} packages`);
    const summaryItems = packages.map(packageInfo => {
      return `<div>
        <h2>${packageInfo.name}</h2>
        <ul>
          <li>Directory: <code>${packageInfo.directory}</code></li>
          <li>Changes: <code>${packageInfo.changes}</code></li>
          <li>Needs Playwright: <code>${packageInfo.needsPlaywright}</code></li>
        </ul>
      </div>`;
    });

    core.summary.addList(summaryItems);
    core.setOutput(packageType, packages);
  }
  await core.summary.write();

  const devserver = await getPackageInfo(pathlib.join(gitRoot, 'devserver'));
  core.setOutput('devserver', devserver);
}

async function main() {
  const { stdout } = await getExecOutput('git rev-parse --show-toplevel');
  const gitRoot = stdout.trim();

  await runForAllPackages(gitRoot);
  // const fullPath = pathlib.join(gitRoot, query);
  // const packageInfo = await getPackageInfo(fullPath);
  // core.setOutput()
}

try {
  await main();
} catch (error: any) {
  core.setFailed(error.message);
}
