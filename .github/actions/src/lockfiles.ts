import fs from 'fs/promises';
import pathlib from 'path';
import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';
import memoize from 'lodash/memoize.js';
import { extractPkgsFromYarnLockV2 } from 'snyk-nodejs-lockfile-parser';
import { gitRoot } from './gitRoot.js';

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
 * Parses and lockfile's contents and extracts all the different dependencies and
 * versions
 */
function processLockFileText(contents: string) {
  const lockFile = extractPkgsFromYarnLockV2(contents);
  const mappings = new Set<string>();
  for (const [pkgSpecifier, { resolution }] of Object.entries(lockFile)) {
    mappings.add(`${pkgSpecifier} -> ${resolution}`);
  }
  return mappings;
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
 * Retrieves the contents of the lockfile on the master branch
 */
async function getMasterLockFile() {
  const { stdout, stderr, exitCode } = await getExecOutput(
    'git',
    [
      '--no-pager',
      'show',
      'origin/master:yarn.lock'
    ],
    { silent: true }
  );

  if (exitCode !== 0) {
    core.error(stderr);
    throw new Error('git show exited with non-zero error-code');
  }

  return processLockFileText(stdout);
}

interface ResolutionSpec { pkgSpecifier: string, pkgName: string }

/**
 * Parsed output entry returned by `yarn why`
 */
interface YarnWhyOutput {
  value: string;
  children: {
    [locator: string]: {
      locator: string;
      descriptor: string;
    };
  };
}

/**
 * Run `yarn why <package_name>` to see why a package is included
 * Don't use recursive (-R) since we want to build the graph ourselves
 * @function
 */
const runYarnWhy = memoize(async (pkgName: string) => {
  // Memoize the call so that we don't need to call yarn why multiple times for each package
  const { stdout: output, exitCode, stderr } = await getExecOutput('yarn', ['why', pkgName, '--json'], { silent: true });
  if (exitCode !== 0) {
    core.error(stderr);
    throw new Error(`yarn why for ${pkgName} failed!`);
  }

  return output.split('\n').reduce<YarnWhyOutput[]>((res, each) => {
    each = each.trim();
    if (each === '') return res;

    const pkg = JSON.parse(each) as YarnWhyOutput;
    return [...res, pkg];
  }, []);
});

/**
 * Determines the names of the packages that have changed versions
 */
export async function getPackagesWithResolutionChanges() {
  const [currentLockFileMappings, masterLockFileMappings] = await Promise.all([
    getCurrentLockFile(),
    getMasterLockFile()
  ]);

  const changes = new Set(masterLockFileMappings);
  for (const edge of currentLockFileMappings) {
    changes.delete(edge);
  }

  const frontier: ResolutionSpec[] = [];
  const changedDeps = new Set<string>();
  for (const edge of changes) {
    const [pkgSpecifier] = edge.split(' -> ');
    changedDeps.add(pkgSpecifier);
    frontier.push({
      pkgSpecifier,
      pkgName: extractPackageName(pkgSpecifier)
    });
  }

  while (frontier.length > 0) {
    const { pkgName, pkgSpecifier } = frontier.shift()!;

    const reasons = await runYarnWhy(pkgName);
    reasons.forEach(pkg => {
      if (changedDeps.has(pkg.value)) {
        // If we've already added this pkg specifier, don't need to explore it again
        return;
      }

      const childrenSpecifiers = Object.values(pkg.children).map(({ descriptor }) => descriptor);
      if (!childrenSpecifiers.includes(pkgSpecifier)) return;

      frontier.push({ pkgSpecifier: pkg.value, pkgName: extractPackageName(pkg.value) });
      changedDeps.add(pkg.value);
    });
  }

  core.info('=== Summary of dirty monorepo packages ===\n');
  const pkgsToRebuild = [...changedDeps].filter(pkgSpecifier => pkgSpecifier.includes('@workspace:'));
  for (const pkgName of pkgsToRebuild) {
    core.info(`- ${pkgName}`);
  }

  return pkgsToRebuild.map(extractPackageName);
}

/**
 * Returns `true` if there are changes present in the given directory relative to
 * the master branch\
 * Used to determine if the lockfile has changed
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
