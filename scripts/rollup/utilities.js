/* [Imports] */
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import chalk from 'chalk';
import commonJS from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import filesize from 'rollup-plugin-filesize';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import modules from '../../modules.json';
import {
  BUILD_PATH,
  MODULES_PATH,
  NODE_MODULES_PATTERN,
  SOURCE_PATH,
  SOURCE_PATTERN,
  SUPPRESSED_WARNINGS,
} from './constants.js';

/* [Main] */
function removeDuplicates(array) {
  return [...new Set(array)];
}

function makeDefaultConfig() {
  return {
    onwarn(warning, warn) {
      if (SUPPRESSED_WARNINGS.includes(warning.code)) return;

      warn(warning);
    },
    plugins: [
      typescript(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.tsx'],
        include: [SOURCE_PATTERN],
      }),
      resolve({
        // Source Academy's modules run in a browser environment. The default setting (false) may
        // cause compilation issues when using some imported packages.
        // https://github.com/rollup/plugins/tree/master/packages/node-resolve#browser
        browser: true,
        // Tells rollup to look for locally installed modules instead of preferring built-in ones.
        // Node's built-in modules include `fs` and `path`, which the jsdom browser environment does
        // not have.
        // https://github.com/rollup/plugins/tree/master/packages/node-resolve#preferbuiltins
        preferBuiltins: false,
      }),
      commonJS({
        include: NODE_MODULES_PATTERN,
      }),
      injectProcessEnv({
        NODE_ENV: process.env.NODE_ENV,
      }),
      filesize({
        showMinifiedSize: false,
        showGzippedSize: false,
      }),
      copy({
        targets: [{ src: MODULES_PATH, dest: BUILD_PATH }],
      }),
    ],
  };
}

function bundleNameToSourceFolder(bundleName) {
  return `${SOURCE_PATH}bundles/${bundleName}/`;
}

function tabNameToSourceFolder(tabName) {
  return `${SOURCE_PATH}tabs/${tabName}/`;
}

/* [Exports] */
//TODO timestamp-based
export function getRollupBundleNames(skipUnmodified) {
  // All module bundles
  let moduleNames = Object.keys(modules);
  moduleNames = removeDuplicates(moduleNames);

  // All module tabs
  let tabNames = moduleNames.flatMap((moduleName) => modules[moduleName].tabs);
  tabNames = removeDuplicates(tabNames);

  return {
    bundleNames: moduleNames,
    tabNames,
  };
}

export function bundleNamesToConfigs(names) {
  let defaultConfig = makeDefaultConfig();

  console.log(chalk.greenBright('Configured module bundles:'));
  let configs = names.map((bundleName) => {
    console.log(chalk.blueBright(bundleName));

    return {
      ...defaultConfig,

      input: `${bundleNameToSourceFolder(bundleName)}index.ts`,
      output: {
        file: `${BUILD_PATH}bundles/${bundleName}.js`,
        format: 'iife',
      },
    };
  });

  return configs;
}

export function tabNamesToConfigs(names) {
  let defaultConfig = makeDefaultConfig();

  console.log(chalk.greenBright('Configured module tabs:'));
  let configs = names.map((tabName) => {
    console.log(chalk.blueBright(tabName));

    return {
      ...defaultConfig,

      input: `${tabNameToSourceFolder(tabName)}index.tsx`,
      output: {
        file: `${BUILD_PATH}tabs/${tabName}.js`,
        format: 'iife',

        globals: {
          react: 'React',
          'react-dom': 'ReactDom',
        },
      },
      external: ['react', 'react-dom'],
    };
  });

  return configs;
}
