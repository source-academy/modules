import { promises as fs } from 'fs';

import { type ModuleManifest, retrieveManifest } from '../scriptUtils.js';

import { askQuestion, success, warn } from './print.js';
import { type Options, isSnakeCase } from './utilities.js';

export const check = (manifest: ModuleManifest, name: string) => Object.keys(manifest)
  .includes(name);

async function askModuleName(manifest: ModuleManifest) {
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const name = await askQuestion(
      'What is the name of your new module? (eg. binary_tree)',
    );
    if (isSnakeCase(name) === false) {
      warn('Module names must be in snake case. (eg. binary_tree)');
    } else if (check(manifest, name)) {
      warn('A module with the same name already exists.');
    } else {
      return name;
    }
  }
}

export async function addNew(buildOpts: Options) {
  const manifest = await retrieveManifest(buildOpts.manifest);
  const moduleName = await askModuleName(manifest);

  const bundleDestination = `${buildOpts.srcDir}/bundles/${moduleName}`;
  await fs.mkdir(bundleDestination, { recursive: true });
  await fs.copyFile(
    './scripts/src/templates/templates/__bundle__.ts',
    `${bundleDestination}/index.ts`,
  );
  await fs.writeFile(
    'modules.json',
    JSON.stringify({
      ...manifest,
      [moduleName]: { tabs: [] },
    }, null, 2),
  );
  success(`Bundle for module ${moduleName} created at ${bundleDestination}.`);
}
