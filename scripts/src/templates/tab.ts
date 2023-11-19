/* eslint-disable no-await-in-loop */
import { promises as fs } from 'fs';

import { type ModuleManifest, retrieveManifest } from '../scriptUtils.js';

import { check as _check } from './module.js';
import { askQuestion, success, warn } from './print.js';
import { type Options, isPascalCase } from './utilities.js';

export function check(manifest: ModuleManifest, tabName: string) {
  return Object.values(manifest)
    .flatMap((x) => x.tabs)
    .includes(tabName);
}

async function askModuleName(manifest: ModuleManifest) {
  while (true) {
    const name = await askQuestion('Add a new tab to which module?');
    if (!_check(manifest, name)) {
      warn(`Module ${name} does not exist.`);
    } else {
      return name;
    }
  }
}

async function askTabName(manifest: ModuleManifest) {
  while (true) {
    const name = await askQuestion(
      'What is the name of your new tab? (eg. BinaryTree)',
    );
    if (!isPascalCase(name)) {
      warn('Tab names must be in pascal case. (eg. BinaryTree)');
    } else if (check(manifest, name)) {
      warn('A tab with the same name already exists.');
    } else {
      return name;
    }
  }
}

export async function addNew(buildOpts: Options) {
  const manifest = await retrieveManifest(buildOpts.manifest);

  const moduleName = await askModuleName(manifest);
  const tabName = await askTabName(manifest);

  // Copy module tab template into correct destination and show success message
  const tabDestination = `${buildOpts.srcDir}/tabs/${tabName}`;
  await fs.mkdir(tabDestination, { recursive: true });
  await fs.copyFile(
    './scripts/src/templates/templates/__tab__.tsx',
    `${tabDestination}/index.tsx`,
  );
  await fs.writeFile(
    'modules.json',
    JSON.stringify(
      {
        ...manifest,
        [moduleName]: { tabs: [...manifest[moduleName].tabs, tabName] },
      },
      null,
      2,
    ),
  );
  success(
    `Tab ${tabName} for module ${moduleName} created at ${tabDestination}.`,
  );
}
