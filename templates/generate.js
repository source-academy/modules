const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const modules = require('../modules.json');

const args = process.argv.slice(2);
const rootDir = path.resolve(__dirname, '..');
const modulesJson = path.resolve(rootDir, 'modules.json');
const packageTemplatePath = path.resolve(
  rootDir,
  './templates/templates/package.ts'
);
const contentTemplatePath = path.resolve(
  rootDir,
  './templates/templates/content.tsx'
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const snakeCaseRegex = /\b[a-z]+(_[a-z]+)*\b/;
const pascalCaseRegex = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/;

async function main() {
  try {
    if (args.length > 1)
      throw new Error('The command only expected at most one argument.');
    let moduleName = args[0];
    if (moduleName == null) moduleName = await askModuleName();
    if (snakeCaseRegex.test(moduleName) === false)
      throw new Error('Module names must be snake case. (eg. binary_tree)');
    if (Object.keys(modules).includes(moduleName))
      throw new Error('A module with the same name already exists.');

    const destination = `${rootDir}/src/packages/${moduleName}`;
    await fs.mkdir(destination, { recursive: true });
    await fs.copyFile(packageTemplatePath, `${destination}/index.ts`);
    await fs.writeFile(
      modulesJson,
      JSON.stringify({ ...modules, [moduleName]: { contents: [] } })
    );
    // eslint-disable-next-line no-console
    console.log(chalk.green(`Module ${moduleName} created at ${destination}`));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.red(error.message));
  } finally {
    rl.close();
  }
}

async function askModuleName() {
  return new Promise((resolve, _) => {
    rl.question(
      chalk.blueBright(
        'What is the name of your new module? (eg. binary_tree)\n'
      ),
      resolve
    );
  });
}

async function askContentName() {
  return new Promise((resolve, _) => {
    rl.question(
      chalk.blueBright(
        'What is the name of your new side content? (eg. BinaryTree)\n'
      ),
      resolve
    );
  });
}

main();
