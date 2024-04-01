import fs from 'fs/promises';

import type { Interface } from 'readline/promises';
import { promiseAll } from '@src/commandUtils';
import { type ModuleManifest, retrieveManifest } from '@src/manifest';

import { askQuestion, success, warn } from './print';
import { type Options, isSnakeCase } from './utilities';

export const check = (manifest: ModuleManifest, name: string) => Object.keys(manifest)
  .includes(name);

async function askModuleName(manifest: ModuleManifest, rl: Interface) {
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const name = await askQuestion('What is the name of your new module? (eg. binary_tree)', rl);
    if (isSnakeCase(name) === false) {
      warn('Module names must be in snake case. (eg. binary_tree)');
    } else if (check(manifest, name)) {
      warn('A module with the same name already exists.');
    } else {
      return name;
    }
  }
}

export async function addNew({ srcDir, manifest: manifestFile }: Options, rl: Interface) {
  const manifest = await retrieveManifest(manifestFile);
  const moduleName = await askModuleName(manifest, rl);

  const bundleDestination = `${srcDir}/bundles/${moduleName}`;
  await fs.mkdir(bundleDestination, { recursive: true });
  await promiseAll(
    fs.copyFile(
      './scripts/src/templates/templates/__bundle__.ts',
      `${bundleDestination}/index.ts`
    ),
    fs.writeFile(
      manifestFile,
      JSON.stringify({
        ...manifest,
        [moduleName]: { tabs: [] }
      }, null, 2)
    )
  );
  success(`Bundle for module ${moduleName} created at ${bundleDestination}.`);
}
