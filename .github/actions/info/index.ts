import fs from 'fs/promises';
import pathlib from 'path';
import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';

interface PackageRecord {
  directory: string
  name: string
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
            const { default: { name } } = await import(fullPath, { with: { type: 'json' }});
            if (name) {
              yield { name, directory: currentDir };
              return;
            };
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
  const { stdout } = await getExecOutput('git', ['rev-parse', '--show-toplevel']);
  const gitRoot = stdout.trim();

  const packageType = core.getInput('type', { required: true });

  let dirPath: string;
  switch (packageType) {
    case 'libs': {
      dirPath = pathlib.join(gitRoot, 'lib');
      break;
    }
    case 'bundles': {
      dirPath = pathlib.join(gitRoot, 'src', 'bundles');
      break;
    }
    case 'tabs': {
      dirPath = pathlib.join(gitRoot, 'src', 'tabs');
      break;
    }
    default: {
      core.error(`Invalid package type: ${packageType}. Must be lib, bundles or tabs`);
      return;
    }
  }

  const packages = await findPackages(dirPath);
  core.setOutput(packageType, packages);
  core.summary.addHeading(`Found ${packageType}`);
  core.summary.addList(packages.map(({ name }) => name));
  core.summary.write();
}

try {
  await main();
} catch (error: any) {
  core.setFailed(error.message);
}
