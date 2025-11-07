import fs from 'fs/promises';
import pathlib from 'path';
import utils from 'util';
import * as core from '@actions/core';
import type { SummaryTableRow } from '@actions/core/lib/summary.js';
import packageJson from '../../../../package.json' with { type: 'json' };
import { checkDirForChanges, type PackageRecord, type RawPackageRecord } from '../commons.js';
import { gitRoot } from '../gitRoot.js';
import { getPackagesWithResolutionChanges, hasLockFileChanged } from '../lockfiles/index.js';
import { topoSortPackages } from './sorter.js';

const packageNameRE = /^@sourceacademy\/(.+?)-(.+)$/u;

/**
 * Retrieves the information for all packages in the repository, but in
 * an unprocessed format
 */
export async function getRawPackages(gitRoot: string, maxDepth?: number) {
  let packagesWithResolutionChanges: string[] = [];

  // If there are lock file changes we need to set hasChanges to true for
  // that package even if that package's directory has no changes
  if (await hasLockFileChanged()) {
    packagesWithResolutionChanges = await getPackagesWithResolutionChanges();
  }

  const output: Record<string, RawPackageRecord> = {};

  /**
   * Search the given directory for package.json files
   */
  async function recurser(currentDir: string, currentDepth: number) {
    const items = await fs.readdir(currentDir, { withFileTypes: true });
    await Promise.all(items.map(async item => {
      if (item.isFile()) {
        if (item.name === 'package.json') {
          try {
            const [hasChanges, packageJson] = await Promise.all([
              checkDirForChanges(currentDir),
              fs.readFile(pathlib.join(currentDir, 'package.json'), 'utf-8')
                .then(JSON.parse)
            ]);

            output[packageJson.name] = {
              directory: currentDir,
              hasChanges: hasChanges || packagesWithResolutionChanges.includes(packageJson.name),
              package: packageJson
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
            console.error(error);
          }
        }
        return;
      }

      if (
        (maxDepth === undefined || currentDepth < maxDepth) &&
        item.isDirectory() &&
        item.name !== 'node_modules' &&
        !item.name.startsWith('__')
      ) {
        const fullPath = pathlib.join(currentDir, item.name);
        await recurser(fullPath, currentDepth + 1);
      }
    }));
  }

  await recurser(gitRoot, 0);
  return output;
}

/**
 * Combines the two objects by using the keys from the LHS
 * to index the RHS object. The result will have the keys of the LHS
 * mapped to the values on the RHS object.
 */
function mergeObjects<
  RHS extends Record<string | symbol | number, any>,
  LHS extends Record<keyof RHS, any>
>(lhs: LHS, rhs: RHS) {
  return Object.keys(lhs).reduce((res, key) => ({
    ...res,
    [key]: rhs[key]
  }), {} as Record<keyof LHS, RHS[keyof LHS]>);
}

/**
 * Iterate through the packages in topological order to determine, based on its dependencies, if it
 * has changes and thus needs to be rebuilt
 */
export function processRawPackages(topoOrder: string[], packages: Record<string, RawPackageRecord>) {
  return topoOrder.reduce<Record<string, PackageRecord>>((res, packageName) => {
    const packageInfo = packages[packageName];

    // Check each dependency if it has changes. Because this is done in topological order
    // these fields should already be their most accurate values
    if (!packageInfo.hasChanges) {
      if (packageInfo.package.dependencies) {
        for (const name of Object.keys(packageInfo.package.dependencies)) {
          if (packages[name]?.hasChanges) {
            packageInfo.hasChanges = true;
            break;
          }
        }
      }

      // If hasChanges still hasn't been set yet, we can proceed to iterate
      // through devDependencies as well
      if (!packageInfo.hasChanges && packageInfo.package.devDependencies) {
        for (const name of Object.keys(packageInfo.package.devDependencies)) {
          if (packages[name]?.hasChanges) {
            packageInfo.hasChanges = true;
            break;
          }
        }
      }
    }

    const needsPlaywright =
      packageInfo.package.devDependencies !== undefined &&
      'playwright' in packageInfo.package.devDependencies;

    if (packageName !== '@sourceacademy/modules') {
      const match = packageNameRE.exec(packageName);
      if (!match) throw new Error(`Unknown package ${packageName}`);

      const [, packageType, baseName] = match;

      switch (packageType) {
        case 'bundle':
          return {
            ...res,
            [packageName]: {
              changes: packageInfo.hasChanges,
              directory: packageInfo.directory,
              name: packageName,
              needsPlaywright,
              bundleName: baseName,
            }
          };
        case 'tab':
          return {
            ...res,
            [packageName]: {
              changes: packageInfo.hasChanges,
              directory: packageInfo.directory,
              name: packageName,
              needsPlaywright,
              tabName: baseName,
            }
          };
      }
    }

    return {
      ...res,
      [packageName]: {
        changes: packageInfo.hasChanges,
        directory: packageInfo.directory,
        name: packageName,
        needsPlaywright
      }
    };
  }, {});
}

/**
 * Retrieve all packages from within the git repository, sorted into the different types
 */
export async function getAllPackages(gitRoot: string) {
  const [
    bundles,
    tabs,
    libs,
    rootPackages
  ] = await Promise.all([
    getRawPackages(pathlib.join(gitRoot, 'src', 'bundles')),
    getRawPackages(pathlib.join(gitRoot, 'src', 'tabs')),
    getRawPackages(pathlib.join(gitRoot, 'lib')),
    getRawPackages(pathlib.join(gitRoot), 1)
  ]);

  const packages = {
    ...rootPackages,
    ...bundles,
    ...tabs,
    ...libs
  };

  const sort = topoSortPackages(packages);
  const processed = processRawPackages(sort, packages);

  return {
    bundles: mergeObjects(bundles, processed),
    tabs: mergeObjects(tabs, processed),
    libs: mergeObjects(libs, processed),
    packages: processed
  };
}

/**
 * Use the Github actions core.setOutput function, but this is just here
 * for type safety
 */
function setOutputs(
  bundles: PackageRecord[],
  tabs: PackageRecord[],
  libs: PackageRecord[],
  devserver: PackageRecord,
  docserver: PackageRecord
) {
  core.setOutput('bundles', bundles.filter(x => x.changes));
  core.setOutput('tabs', tabs.filter(x => x.changes));
  core.setOutput('libs', libs.filter(x => x.changes));
  core.setOutput('devserver', devserver);
  core.setOutput('docserver', docserver);
}

export async function main() {
  const { packages, bundles, tabs, libs } = await getAllPackages(gitRoot);

  const { repository } = packageJson;
  const repoUrl = repository.substring(0, repository.length - 4); // Remove the .git at the end

  const summaryItems = Object.values(packages).map((packageInfo): SummaryTableRow => {
    const relpath = pathlib.relative(gitRoot, packageInfo.directory);
    const url = new URL(relpath, `${repoUrl}/tree/master/`);

    return [
      `<code>${packageInfo.name}</code>`,
      `<a href="${url}">${relpath}</a>`,
      `<code>${packageInfo.changes ? 'true' : 'false'}</code>`,
      `<code>${packageInfo.needsPlaywright ? 'true' : 'false'}</code>`
    ];
  });

  summaryItems.unshift([
    {
      data: 'Package Name',
      header: true,
    },
    {
      data: 'Package Path',
      header: true
    },
    {
      data: 'Has Changes',
      header: true
    },
    {
      data: 'Needs Playwright',
      header: true
    }
  ]);

  core.summary.addHeading('Package Information');
  core.summary.addTable(summaryItems);
  await core.summary.write();

  setOutputs(
    Object.values(bundles),
    Object.values(tabs),
    Object.values(libs),
    packages['@sourceacademy/modules-devserver'],
    packages['@sourceacademy/modules-docserver']
  );

  const workflows = await checkDirForChanges(pathlib.join(gitRoot, '.github/workflows'));
  core.setOutput('workflows', workflows);
}

if (process.env.GITHUB_ACTIONS) {
  // Only automatically execute when running in github actions
  try {
    await main();
  } catch (error: any) {
    core.setFailed(error);
  }
}
