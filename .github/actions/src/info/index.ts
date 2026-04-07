import fs from 'fs/promises';
import pathlib from 'path';
import * as core from '@actions/core';
import { mapAsync, mapValues } from 'es-toolkit';
import packageJson from '../../../../package.json' with { type: 'json' };
import {
  checkDirForChanges,
  runYarnWorkspacesList,
  type PackageRecord,
  type RawPackageRecord,
  type YarnWorkspaceRecord
} from '../commons.js';
import { gitRoot } from '../gitRoot.js';
import { getPackagesWithResolutionChanges, hasLockFileChanged } from '../lockfiles.js';
import { topoSortPackages } from './sorter.js';

type SummaryTableRow = Parameters<(typeof core['summary']['addTable'])>[0][number];

const packageNameRE = /^@sourceacademy\/(.+?)-(.+)$/u;

/**
 * Retrieves the information for all packages in the repository, but in
 * an unprocessed format
 */
export async function getRawPackages(gitRoot: string) {
  core.info('Beginning to load all raw packages.');
  let packagesWithResolutionChanges: string[] | null = null;

  // If there are lock file changes we need to set hasChanges to true for
  // that package even if that package's directory has no changes
  if (await hasLockFileChanged()) {
    try {
      packagesWithResolutionChanges = await getPackagesWithResolutionChanges();
    } catch (error) {
      core.info(`Error occurred while getting packagesWithResolutionChanges: ${error}`);
      throw error;
    }
  }
  core.info(`Determined if lockfile has changed: ${packagesWithResolutionChanges !== null}`);

  const stdout = await runYarnWorkspacesList();
  const output: Record<string, RawPackageRecord> = {};

  await mapAsync(stdout.trim().split('\n'), async line => {
    const { location } = JSON.parse(line) as YarnWorkspaceRecord;
    const currentDir = pathlib.join(gitRoot, location);
    core.info(`Determining state for ${currentDir}`);

    const [hasChanges, packageJson] = await Promise.all([
      checkDirForChanges(currentDir),
      fs.readFile(pathlib.join(currentDir, 'package.json'), 'utf-8')
        .then(JSON.parse)
    ]);

    let type: RawPackageRecord['type'] = null;
    if (location.startsWith('src/bundles')) {
      type = 'bundle';
    } else if (location.startsWith('src/tabs')) {
      type = 'tab';
    } else if (location.startsWith('lib')) {
      type = 'lib';
    }

    output[packageJson.name] = {
      directory: currentDir,
      hasChanges: hasChanges || !!packagesWithResolutionChanges?.includes(packageJson.name),
      package: packageJson,
      type
    };

    core.info(`Finished determining state for ${currentDir}`);
  });

  core.info('Loaded all raw packages.');
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
  return mapValues(lhs, (_, key) => rhs[key]);
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
  const packages = await getRawPackages(gitRoot);

  const bundles: Record<string, RawPackageRecord> = {};
  const tabs: Record<string, RawPackageRecord> = {};
  const libs: Record<string, RawPackageRecord> = {};

  Object.entries(packages).forEach(([name, pkgInfo]) => {
    switch (pkgInfo.type) {
      case 'bundle': {
        bundles[name] = pkgInfo;
        break;
      }
      case 'tab': {
        tabs[name] = pkgInfo;
        break;
      }
      case 'lib': {
        libs[name] = pkgInfo;
        break;
      }
    }
  });

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
  core.info('Retrieved all packages');

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

  core.info('Outputs written');

  const workflows = await checkDirForChanges(pathlib.join(gitRoot, '.github/workflows'));

  core.info('Dirs checked for changes');
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
