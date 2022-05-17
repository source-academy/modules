import chalk from 'chalk';
import modules from '../../../modules.json';
import { makeDefaultConfiguration } from '../utilities.js';

export default (args) => {
  const definedTabs = Array.from(
    new Set(Object.keys(modules).flatMap((module) => modules[module].tabs))
  );

  let moduleTabs;

  if (args.tab !== undefined) {
    if (typeof args.tab === 'string') {
      moduleTabs = args.tab.split(',');
    } else {
      moduleTabs = args.tab;
    }

    const undefineds = moduleTabs.filter((val) => !definedTabs.includes(val));

    if (undefineds.length > 0) {
      throw new Error(`Unknown tabs: ${undefineds.join(', ')}`);
    }

    delete args.tab;
  } else {
    moduleTabs = definedTabs;
  }

  const buildTabs = (name) => ({
    ...makeDefaultConfiguration(),
    input: `./src/tabs/${name}/index.tsx`,
    output: {
      file: `./build/tabs/${name}.js`,
      format: 'iife',
      globals: {
        react: 'React',
        'react-dom': 'ReactDom',
      },
    },
    external: ['react', 'react-dom'],
  });

  console.log(chalk.blueBright('Building tabs:'));
  moduleTabs.forEach((tab) => console.log(chalk.yellow(tab)));

  return moduleTabs.map(buildTabs);
};
