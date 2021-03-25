const fs = require('fs').promises;
const paths = require('./paths');
const print = require('./print');
const utilities = require('./utilities');
const modules = require('./module');
const manifest = require('../../modules.json');

const existingTabs = Object.keys(manifest).reduce(
  (accumulator, current) => accumulator.concat(manifest[current].tabs),
  []
);

function check(tabName) {
  return existingTabs.includes(tabName);
}

async function askModuleName() {
  const name = await print.askQuestion('Add a new tab to which module?');
  if (modules.check(name) === false) {
    print.warn(`Module ${name} does not exist.`);
    return askModuleName();
  }
  return name;
}

async function askTabName() {
  const name = await print.askQuestion(
    'What is the name of your new tab? (eg. BinaryTree)'
  );
  if (utilities.isPascalCase(name) === false) {
    print.warn('Tab names must be in pascal case. (eg. BinaryTree)');
    return askTabName();
  }
  if (check(name)) {
    print.warn('A tab with the same name already exists.');
    return askTabName();
  }
  return name;
}

async function addNew() {
  const moduleName = await askModuleName();
  const tabName = await askTabName();

  // Copy module tab template into correct destination and show success message
  const tabDestination = `${paths.root}/src/tabs/${tabName}`;
  await fs.mkdir(tabDestination, { recursive: true });
  await fs.copyFile(paths.tabTemplate, `${tabDestination}/index.tsx`);
  await fs.writeFile(
    paths.manifest,
    JSON.stringify(
      {
        ...manifest,
        [moduleName]: { tabs: [...manifest[moduleName].tabs, tabName] },
      },
      null,
      2
    )
  );
  print.success(
    `Tab ${tabName} for module ${moduleName} created at ${tabDestination}.`
  );
}

module.exports = {
  addNew,
  check,
};
