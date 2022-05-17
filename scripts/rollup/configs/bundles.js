import chalk from 'chalk';
import modules from '../../../modules.json';
import { makeDefaultConfiguration } from '../utilities.js';

export default (args) => {
  let moduleBundles;

  if (args.module !== undefined) {
    if (typeof args.module === 'string') {
      moduleBundles = args.module.split(',');
    } else {
      moduleBundles = args.module;
    }

    const unknowns = moduleBundles.filter(
      (x) => !Object.keys(modules).includes(x)
    );

    if (unknowns.length > 0) {
      throw new Error(`Unknown modules: ${unknowns.join(', ')}`);
    }

    delete args.module;
  } else {
    moduleBundles = Object.keys(modules);
  }

  const buildBundle = (name) => ({
    ...makeDefaultConfiguration(),
    input: `./src/bundles/${name}/index.ts`,
    output: {
      file: `./build/bundles/${name}.js`,
      format: 'iife',
    },
  });

  // eslint-disable-next-line no-console
  console.log(chalk.blueBright('Building bundles:'));
  moduleBundles.forEach((module) => console.log(chalk.green(module)));

  return moduleBundles.map(buildBundle);
};
