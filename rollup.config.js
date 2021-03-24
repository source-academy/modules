import chalk from 'chalk';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

import modules from './modules.json';

const suppressedWarnings = ['MISSING_NAME_OPTION_FOR_IIFE_EXPORT'];

const defaultConfigurations = {
  onwarn(warning, warn) {
    if (suppressedWarnings.includes(warning.code)) return;
    warn(warning);
  },
  plugins: [
    json(),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      include: ['src/**/*'],
    }),
    resolve(),
    commonJS({
      include: 'node_modules/**',
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

const moduleBundles = Object.keys(modules);

const buildBundles = (name) => ({
  ...defaultConfigurations,
  input: `./src/bundles/${name}/index.ts`,
  output: {
    file: `./build/bundles/${name}.js`,
    format: 'iife',
  },
});

let moduleTabs = [];
moduleBundles
  .map((modulePackage) => modules[modulePackage].tabs)
  .forEach((__tabs) => Array.prototype.push.apply(moduleTabs, __tabs));

moduleTabs = [...new Set(moduleTabs)];

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

// eslint-disable-next-line no-console
console.log(chalk.blueBright('Building modules with tabs:'));
moduleBundles.forEach((modulePackage) => {
  // eslint-disable-next-line no-console
  console.log(
    chalk.green(`Module ${modulePackage}`),
    'with',
    chalk.yellow(`tabs ${modules[modulePackage].tabs}`)
  );
});

export default [
  ...moduleBundles.map(buildBundles),
  ...moduleTabs.map(buildTabs),
];
