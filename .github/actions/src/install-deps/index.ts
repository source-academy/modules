import * as core from '@actions/core';
import { exec } from '@actions/exec';

async function main() {
  const packageName = core.getInput('packageName');
  const directory = core.getInput('directory');
  const testRequired = core.getBooleanInput('testRequired');

  const args = ['workspaces', 'focus', packageName];
  if (!testRequired) {
    args.push('--production');
  }

  await exec('yarn', args);

  const { default: packageJson } = await import(`${directory}/package.json`, { with: { type: 'json' }});
  if (testRequired && packageJson.devDependecies) {
    core.info(`Playwright is necessary for ${packageName}, installing`);
    await exec('yarn', ['playwright', 'install', '--with-deps']);
  }
}

await main();
