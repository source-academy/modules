import chalk from 'chalk';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import filesize from 'rollup-plugin-filesize';
import copy from 'rollup-plugin-copy';

import modules from './modules.json';

const suppressedWarnings = ['MISSING_NAME_OPTION_FOR_IIFE_EXPORT'];

const defaultConfigurations = {
  onwarn(warning, warn) {
    if (suppressedWarnings.includes(warning.code)) return;
    warn(warning);
  },
  plugins: [
    typescript(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      include: ['src/**/*'],
    }),
    resolve({
      // Source Academy's modules run in a browser environment. This setting when
      // set to false can cause problems with some imported packages that depend
      // on this setting to compile properly.
      // @see https://github.com/rollup/plugins/tree/master/packages/node-resolve#browser
      browser: true,
      // If true, the plugin will prefer built-in modules (e.g. fs, path).
      // The broswer's environment (jsdom), unlike node environment, does not
      // have built-in modules such as fs or path.
      // @see https://github.com/rollup/plugins/tree/master/packages/node-resolve#preferbuiltins
      preferBuiltins: false,
    }),
    commonJS({
      include: 'node_modules/**',
    }),
    injectProcessEnv({
      NODE_ENV: process.env.NODE_ENV,
    }),
    filesize({
      showMinifiedSize: false,
      showGzippedSize: false,
    }),
    copy({
      targets: [{ src: './modules.json', dest: './build' }],
    }),
  ],
};

export default (args) => {
  // Get desired modules to build
  const definedModules = Array.from(Object.keys(modules));

  let moduleBundles;
  if (args.module !== undefined) {
    if (typeof args.moduleBundles === 'string') {
      moduleBundles = [args.module];
    } else {
      moduleBundles = args.module.split(',');
    }

    const undefineds = moduleBundles.filter(
      (val) => !definedModules.includes(val)
    );
    if (undefineds.length > 0) {
      throw new Error(`Unknown modules: ${undefineds.join(', ')}`);
    }

    delete args.module;
  } else {
    moduleBundles = definedModules;
  }

  // Get desired tabs to build
  const definedTabs = Array.from(
    new Set(definedModules.flatMap((module) => modules[module].tabs))
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
    ...defaultConfigurations,
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

  const buildBundle = (name) => ({
    ...defaultConfigurations,
    input: `./src/bundles/${name}/index.ts`,
    output: {
      file: `./build/bundles/${name}.js`,
      format: 'iife',
    },
  });
  console.log(chalk.blueBright('Building bundles:'));
  moduleBundles.forEach((module) => console.log(chalk.green(module)));

  console.log(chalk.blueBright('Building tabs:'));
  moduleTabs.forEach((tab) => console.log(chalk.yellow(tab)));

  return [...moduleBundles.map(buildBundle), ...moduleTabs.map(buildTabs)];
};
