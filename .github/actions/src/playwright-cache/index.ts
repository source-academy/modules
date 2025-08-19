import * as cache from '@actions/cache';
import * as core from '@actions/core';
import { exec, getExecOutput } from '@actions/exec';
import * as io from '@actions/io';

interface YarnWhyEntry {
  value: string;
  children: {
    [name: string]: {
      locator: string;
      description: string;
    };
  };
}

const playwrightDir = '~/.cache/ms-playwright';

/**
 * Given the output from `yarn why`, figure out what the installed version is
 */
function findInstalledVersion(entry: YarnWhyEntry) {
  const RE = /^playwright@npm:(.+)$/;

  for (const each of Object.keys(entry.children)) {
    const match = RE.exec(each);
    if (match) return match[1];
  }

  throw new Error('Failed to find version');
}

const RE = /^(@sourceacademy\/.+)@.+/;

async function main() {
  const { exitCode, stderr, stdout } = await getExecOutput('yarn', ['why', 'playwright', '--json']);

  if (exitCode !== 0) {
    core.setFailed(stderr);
    return;
  }

  const entries = stdout.trim().split('\n').map(each => JSON.parse(each.trim()) as YarnWhyEntry);
  const packageName = core.getInput('package-name', { required: true });

  core.info(`Finding playwright version for ${packageName}`);

  const entry = entries.find(each => {
    const match = RE.exec(each.value);
    if (!match) return false;
    const [, entryName] = match;
    return entryName === packageName;
  });

  if (!entry) throw new Error(`${packageName} does not have playwright listed as a dependency.`);

  const version = findInstalledVersion(entry);
  core.info(`playwright version for ${packageName} is ${version}`);

  await io.mkdirP(playwrightDir);
  const cacheHit = await cache.restoreCache([playwrightDir], `playwright-${version}`);
  if (!cacheHit) {
    core.info('playwright directory cache not located, installing');

    const exitCode = await exec('yarn', ['workspaces', 'foreach', '-A', '--include', packageName, 'run', 'playwright', 'install', 'chromium', '--with-deps', '--only-shell'], { silent: true });
    if (exitCode !== 0) {
      core.setFailed('Failed to install playwright');
      return;
    }

    await cache.saveCache([playwrightDir], `playwright-${version}`);
  } else {
    core.info('Playwright cache hit');
  }

  core.addPath(playwrightDir);

  await exec('yarn', ['workspaces', 'foreach', '-A', '--include', packageName, 'run', 'playwright', '--version']);
}

try {
  await main();
} catch (error) {
  core.setFailed(error as Error);
}
