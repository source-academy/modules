/* eslint-disable no-await-in-loop */
import { promises as fs } from 'fs';
import { askQuestion, warn, success } from './print';
import { isPascalCase } from './utilities';
import { check as _check } from './module';
import { modules as manifest, cjsDirname } from '../utilities';
import { SOURCE_PATH } from '../constants';

const existingTabs = Object.values(manifest)
  .flatMap((value) => value.tabs);

export function check(tabName: string) {
  return existingTabs.includes(tabName);
}

async function askModuleName() {
  while (true) {
    const name = await askQuestion('Add a new tab to which module?');
    if (!_check(name)) {
      warn(`Module ${name} does not exist.`);
    } else {
      return name;
    }
  }
}

async function askTabName() {
  while (true) {
    const name = await askQuestion(
      'What is the name of your new tab? (eg. BinaryTree)',
    );
    if (!isPascalCase(name)) {
      warn('Tab names must be in pascal case. (eg. BinaryTree)');
    } else if (check(name)) {
      warn('A tab with the same name already exists.');
    } else {
      return name;
    }
  }
}

export async function addNew() {
  const moduleName = await askModuleName();
  const tabName = await askTabName();

  // Copy module tab template into correct destination and show success message
  const tabDestination = `${SOURCE_PATH}/tabs/${tabName}`;
  await fs.mkdir(tabDestination, { recursive: true });
  await fs.copyFile(
    `${cjsDirname(import.meta.url)}/templates/__templates__.ts`,
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
