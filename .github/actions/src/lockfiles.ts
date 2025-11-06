import fs from 'fs/promises';
import pathlib from 'path';
import memoize from 'lodash/memoize';
import uniq from 'lodash/uniq';
import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';
import { extractPkgsFromYarnLockV2 } from "snyk-nodejs-lockfile-parser";
import { gitRoot } from './gitRoot.js';

/**
 * Parses and lockfile's contents and extracts all the different dependencies and
 * versions
 */
function processLockFileText(contents: string) {
  const lockFile = extractPkgsFromYarnLockV2(contents);
  return Object.entries(lockFile).reduce<Record<string, Set<string>>>((res, [key, { version }]) => {
    const newKey = key.split('@')[0];

    if (!(newKey in res)) {
      res[newKey] = new Set()
    }

    res[newKey].add(version);
    return res;
  }, {});
}

/**
 * Retrieves the contents of the lockfile on the master branch
 */
async function getMasterLockFile() {
  const { stdout, exitCode } = await getExecOutput(
    'git',
    [
      '--no-pager',
      'show',
      'origin/master:yarn.lock'
    ],
  );

  if (exitCode !== 0) {
    throw new Error('git show exited with non-zero error-code');
  }

  return processLockFileText(stdout);
}

/**
 * Retrieves the contents of the lockfile in the repo
 */
async function getCurrentLockFile() {
  const lockFilePath = pathlib.join(gitRoot, 'yarn.lock');
  const contents = await fs.readFile(lockFilePath, 'utf-8');
  return processLockFileText(contents);
}

/**
 * Determines the names of the packages that have changed versions
 */
async function getPackageDiffs() {
  const [currentLockFile, masterLockFile] = await Promise.all([
    getCurrentLockFile(),
    getMasterLockFile()
  ]);

  const packages = [];
  for (const [depName, versions] of Object.entries(currentLockFile)) {
    if (!(depName in masterLockFile)) {
      core.info(`${depName} in current lockfile, not in master lock file`);
      continue;
    }

    const args = depName.split('@');
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
    
    if (needToAdd) {
      packages.push(args[0]);
    }
  }

  return uniq(packages);
}

/**
 * Using `yarn why`, determine why the given package is present in the
 * lockfile.
 */
async function getPackageReason(pkg: string) {
  const packageNameRE = /^(@?sourceacademy\/.+)@.+$/ 
 
  const { stdout, exitCode } = await getExecOutput('yarn why', [pkg, '-R', '--json']);
  if (exitCode !== 0) {
    throw new Error('yarn why exited with non-zero exit code!');
  }

  return stdout.trim().split('\n').map(each => {
    const entry = JSON.parse(each).value;
    const match = packageNameRE.exec(entry);
    if (!match) {
      throw new Error('failed to identify a package!');
    }
    
    return match[1];
  });
}

/**
 * Returns `true` if there are changes present in the given directory relative to
 * the master branch\
 * Used to determine, particularly for libraries, if running tests and tsc are necessary
 */
export const hasLockFileChanged = memoize(async () => {
  const { exitCode } = await getExecOutput(
    'git',
    ['--no-pager', 'diff', '--quiet', 'origin/master', '--', 'yarn.lock'],
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
  const packages = await getPackageDiffs();
  const workspaces = await Promise.all(packages.map(getPackageReason));
  return uniq(workspaces.flat());
}
