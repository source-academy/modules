const fs = require('fs').promises;
const paths = require('./paths');
const print = require('./print');
const utilities = require('./utilities');
const manifest = require('../modules.json');

async function addNew() {
  const moduleName = await askModuleName();
  const bundleDestination = `${paths.root}/src/bundles/${moduleName}`;
  await fs.mkdir(bundleDestination, { recursive: true });
  await fs.copyFile(paths.bundleTemplate, `${bundleDestination}/index.ts`);
  await fs.writeFile(
    paths.manifest,
    JSON.stringify({ ...manifest, [moduleName]: { tabs: [] } })
  );
  print.success(
    `Bundle for module ${moduleName} created at ${bundleDestination}.`
  );
}

async function askModuleName() {
  const name = await print.askQuestion(
    'What is the name of your new module? (eg. binary_tree)'
  );
  if (utilities.isSnakeCase(name) === false) {
    print.warn('Module names must be in snake case. (eg. binary_tree)');
    return askModuleName();
  }
  if (check(name) === true) {
    print.warn('A module with the same name already exists.');
    return askModuleName();
  }
  return name;
}

function check(moduleName) {
  return Object.keys(manifest).includes(moduleName);
}

module.exports = {
  addNew,
  check,
};
