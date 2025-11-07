import fs from 'fs/promises';
import pathlib from 'path';
import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';
import { extractPkgsFromYarnLockV2 } from 'snyk-nodejs-lockfile-parser';
import { gitRoot } from '../gitRoot.js';

const packageNameRE = /^(.+)@.+$/;

/**
 * Lockfile specifications come in the form of package_name@resolution, but
 * we only want the package name. This function extracts that package name,
 * accounting for the fact that package names might start with '@'
 */
export function extractPackageName(raw: string) {
  const match = packageNameRE.exec(raw);
  if (!match) {
    throw new Error(`Invalid package name: ${raw}`);
  }

  return match[1];
}

/**
 * Using `yarn why`, determine why the given package is present in the
 * lockfile.
 */
export async function getPackageReason(pkg: string) {
  const { stdout, stderr, exitCode } = await getExecOutput('yarn why', [pkg, '-R', '--json'], { silent: true });
  if (exitCode !== 0) {
    core.error(stderr);
    throw new Error(`yarn why for '${pkg}' exited with non-zero exit code!`);
  }

  return stdout.trim().split('\n').map(each => {
    const entry = JSON.parse(each).value;
    return extractPackageName(entry);
  });
}

/**
 * Determines the names of the packages that have changed versions
 */
export async function getPackageDiffs() {
  const [currentLockFile, masterLockFile] = await Promise.all([
    getCurrentLockFile(),
    getMasterLockFile()
  ]);

  const packages = new Set<string>();

  for (const [depName, versions] of Object.entries(currentLockFile)) {
    if (packages.has(depName)) continue;

    if (!(depName in masterLockFile)) {
      core.info(`${depName} in current lockfile, not in master lock file`);
      continue;
    }

    let needToAdd = false;
    for (const version of versions) {
      if (!masterLockFile[depName].has(version)) {
        core.info(`${depName} has ${version} in current lockfile but not in master`);
        needToAdd = true;
      }
    }

    for (const version of masterLockFile[depName]) {
      if (!versions.has(version)) {
        core.info(`${depName} has ${version} in master lockfile but not in current`);
        needToAdd = true;
      }
    }

    if (needToAdd) packages.add(depName);
  }

  return packages;
}

/**
 * Retrieves the contents of the lockfile in the repo
 */
export async function getCurrentLockFile() {
  const lockFilePath = pathlib.join(gitRoot, 'yarn.lock');
  const contents = await fs.readFile(lockFilePath, 'utf-8');
  return processLockFileText(contents);
}

/**
 * Retrieves the contents of the lockfile on the master branch
 */
export async function getMasterLockFile() {
  const { stdout, exitCode } = await getExecOutput(
    'git',
    [
      '--no-pager',
      'show',
      'origin/master:yarn.lock'
    ],
    { silent: true }
  );

  if (exitCode !== 0) {
    throw new Error('git show exited with non-zero error-code');
  }

  return processLockFileText(stdout);
}

/**
 * Parses and lockfile's contents and extracts all the different dependencies and
 * versions
 */
export function processLockFileText(contents: string) {
  const lockFile = extractPkgsFromYarnLockV2(contents);
  return Object.entries(lockFile).reduce<Record<string, Set<string>>>((res, [key, { version }]) => {
    const newKey = extractPackageName(key);

    if (!(newKey in res)) {
      res[newKey] = new Set();
    }

    res[newKey].add(version);
    return res;
  }, {});
}
