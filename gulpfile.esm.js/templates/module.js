import { promises as fs } from 'fs';
import { askQuestion, warn, success } from './print';
import { isSnakeCase } from './utilities';
import manifest from '../../modules.json';
import { cjsDirname } from '../utilities';

export function check(moduleName) {
  return Object.keys(manifest).includes(moduleName);
}

async function askModuleName() {
  const name = await askQuestion(
    'What is the name of your new module? (eg. binary_tree)'
  );
  if (isSnakeCase(name) === false) {
    warn('Module names must be in snake case. (eg. binary_tree)');
    return askModuleName();
  }
  if (check(name) === true) {
    warn('A module with the same name already exists.');
    return askModuleName();
  }
  return name;
}

export async function addNew() {
  const moduleName = await askModuleName();
  const bundleDestination = `src/bundles/${moduleName}`;
  await fs.mkdir(bundleDestination, { recursive: true });
  await fs.copyFile(
    `${cjsDirname()}/__bundle__.ts`,
    `${bundleDestination}/index.ts`
  );
  await fs.writeFile(
    'modules.json',
    JSON.stringify({ ...manifest, [moduleName]: { tabs: [] } }, null, 2)
  );
  success(`Bundle for module ${moduleName} created at ${bundleDestination}.`);
}
