import chalk from 'chalk';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
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

const modulePackages = Object.keys(modules);

const buildPackages = (name) => ({
  ...defaultConfigurations,
  input: `./src/bundles/${name}/index.ts`,
  output: {
    file: `./build/bundles/${name}.js`,
    format: 'iife',
  },
});

let moduleContents = [];
modulePackages
  .map((modulePackage) => modules[modulePackage].contents)
  .forEach((__contents) =>
    Array.prototype.push.apply(moduleContents, __contents)
  );
moduleContents = [...new Set(moduleContents)];

const buildContents = (name) => ({
  ...defaultConfigurations,
  input: `./src/tabs/${name}/index.tsx`,
  output: {
    file: `./build/tabs/${name}.js`,
    format: 'iife',
    globals: {
      react: 'React',
    },
  },
  external: ['react'],
});

// eslint-disable-next-line no-console
console.log(chalk.blueBright('Building modules with tabs:'));
modulePackages.forEach((modulePackage) => {
  // eslint-disable-next-line no-console
  console.log(
    chalk.green(`Module ${modulePackage}`),
    'with',
    chalk.yellow(`tabs ${modules[modulePackage].contents}`)
  );
});

export default [
  ...modulePackages.map(buildPackages),
  ...moduleContents.map(buildContents),
];
