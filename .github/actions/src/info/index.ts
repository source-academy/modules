import fs from 'fs/promises';
import pathlib from 'path';
import utils from 'util';
import * as core from '@actions/core';
import { checkForChanges, getGitRoot } from './git.js';
import { topoSortPackages } from './sorter.js';
import type { PackageRecord, RawPackageRecord } from './utils.js';

const packageNameRE = /^@sourceacademy\/(.+?)-(.+)$/u;

/**
 * Retrieves the information for all packages in the repository, but in
 * an unprocessed format
 */
export async function getRawPackages(gitRoot: string, maxDepth?: number) {
  const output: Record<string, RawPackageRecord> = {};

  async function recurser(currentDir: string, currentDepth: number) {
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
              hasChanges,
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
          if (packages[name].hasChanges) {
            packageInfo.hasChanges = true;
            break;
          }
        }
      }

      if (!packageInfo.hasChanges && packageInfo.package.devDependencies) {
        for (const name of Object.keys(packageInfo.package.devDependencies)) {
          if (packages[name].hasChanges) {
            packageInfo.hasChanges = true;
            break;
          }
        }
      }
    }

    const needsPlaywright =
      packageInfo.package.devDependencies !== undefined &&
      'playwright' in packageInfo.package.devDependencies;

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
  // Remove the root packages from the bundles and tabs collection
  // of packages cause they're not supposed be used like that
  delete bundles['@sourceacademy/bundles'];
  delete tabs['@sourceacademy/tabs'];

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
  core.setOutput('bundles', bundles);
  core.setOutput('tabs', tabs);
  core.setOutput('libs', libs);
  core.setOutput('devserver', devserver);
  core.setOutput('docserver', docserver);
}

async function main() {
  const gitRoot = await getGitRoot();
  const { packages, bundles, tabs, libs } = await getAllPackages(gitRoot);

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

  setOutputs(
    Object.values(bundles),
    Object.values(tabs),
    Object.values(libs),
    packages['@sourceacademy/modules-devserver'],
    packages['@sourceacademy/modules-docserver']
  );

  const workflows = await checkForChanges(pathlib.join(gitRoot, '.github/workflows'));
  core.setOutput('workflows', workflows);
}

if (process.env.GITHUB_ACTIONS) {
  // Only automatically execute when running in github actions
  try {
    await main();
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
