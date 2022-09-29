import { promises as fs } from 'fs';

import { SOURCE_PATH } from '../constants';
import { cjsDirname, modules as manifest } from '../utilities';

import { askQuestion, success, warn } from './print';
import { isSnakeCase } from './utilities';

export function check(moduleName: string) {
  return Object.keys(manifest)
    .includes(moduleName);
}

async function askModuleName() {
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const name = await askQuestion(
      'What is the name of your new module? (eg. binary_tree)',
    );
    if (isSnakeCase(name) === false) {
      warn('Module names must be in snake case. (eg. binary_tree)');
    } else if (check(name)) {
      warn('A module with the same name already exists.');
    } else {
      return name;
    }
  }
}

export async function addNew() {
  const moduleName = await askModuleName();
  const bundleDestination = `${SOURCE_PATH}/bundles/${moduleName}`;
  await fs.mkdir(bundleDestination, { recursive: true });
  await fs.copyFile(
    `${cjsDirname(import.meta.url)}/__bundle__.ts`,
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
