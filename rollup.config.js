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
  .forEach((__tabs) => {
    Array.prototype.push.apply(moduleTabs, __tabs);
  });

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
