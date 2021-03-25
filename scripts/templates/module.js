const fs = require('fs').promises;
const paths = require('./paths');
const print = require('./print');
const utilities = require('./utilities');
const manifest = require('../../modules.json');

function check(moduleName) {
  return Object.keys(manifest).includes(moduleName);
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

async function addNew() {
  const moduleName = await askModuleName();
  const bundleDestination = `${paths.root}/src/bundles/${moduleName}`;
  await fs.mkdir(bundleDestination, { recursive: true });
  await fs.copyFile(paths.bundleTemplate, `${bundleDestination}/index.ts`);
  await fs.writeFile(
    paths.manifest,
    JSON.stringify({ ...manifest, [moduleName]: { tabs: [] } }, null, 2)
  );
  print.success(
    `Bundle for module ${moduleName} created at ${bundleDestination}.`
  );
}

module.exports = {
  addNew,
  check,
};
