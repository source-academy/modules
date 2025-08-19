import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';
import * as tc from '@actions/tool-cache';

interface YarnWhyEntry {
  value: string;
  children: {
    [name: string]: {
      locator: string;
      description: string;
    };
  };
}

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
  const { exitCode, stderr, stdout } = await getExecOutput('yarn', ['why', 'playwright', '--json'], { silent: true });

  if (exitCode !== 0) {
    core.setFailed(stderr);
    return;
  }

  const entries = stdout.trim().split('\n').map(each => JSON.parse(each) as YarnWhyEntry);
  const packageName = core.getInput('package-name', { required: true });
  // const packageName = '@sourceacademy/tab-Curve';

  const entry = entries.find(each => {
    const match = RE.exec(each.value);
    if (!match) return false;
    const [, entryName] = match;
    return entryName === packageName;
  });

  if (!entry) throw new Error(`${packageName} does not have playwright listed as a dependency.`);

  const version = findInstalledVersion(entry);
  const playwrightDir = tc.find('playwright', version);

  console.log(playwrightDir);
}

await main();
