import fs from 'fs/promises';
import pathlib from 'path';
import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';

interface PackageRecord {
  directory: string
  name: string
  changes: boolean
  needsPlaywright: boolean
}

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

/**
 * Recursively locates the packages present in a directory, up to an optional max depth
 */
async function findPackages(directory: string, maxDepth?: number) {
  const output: PackageRecord[] = [];
  async function* recurser(currentDir: string, currentDepth: number): AsyncGenerator<PackageRecord> {
    if (maxDepth !== undefined && currentDepth >= maxDepth) return;

    const items = await fs.readdir(currentDir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = pathlib.join(currentDir, item.name);
      if (item.isFile()) {
        if (item.name === 'package.json') {
          try {
            const { default: { name, devDependencies } } = await import(fullPath, { with: { type: 'json' }});
            const changes = await checkForChanges(currentDir);
            yield {
              directory: currentDir,
              changes,
              name,
              needsPlaywright: 'playwright' in devDependencies
            };
            return;
          } catch {}
        }
        continue;
      }

      if (item.isDirectory() && item.name !== 'node_modules' && !item.name.startsWith('__')) {
        yield* recurser(fullPath, currentDepth + 1);
      }
    }
  }

  for await (const each of recurser(directory, 0)) {
    output.push(each);
  }

  return output;
}

async function main() {
  const { stdout } = await getExecOutput('git rev-parse --show-toplevel');
  const gitRoot = stdout.trim();

  const results = await Promise.all(
    Object.entries({
      libs: pathlib.join(gitRoot, 'lib'),
      bundles: pathlib.join(gitRoot, 'src', 'bundles'),
      tabs: pathlib.join(gitRoot, 'src', 'tabs')
    }).map(async ([packageType, dirPath]): Promise<[string, PackageRecord[]]> => {
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
}

try {
  await main();
} catch (error: any) {
  core.setFailed(error.message);
}
