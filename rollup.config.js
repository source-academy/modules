import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import copy from 'rollup-plugin-copy';

import modules from './modules.json';

const defaultConfigurations = {
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
    filesize(),
    copy({
      targets: [{ src: './modules.json', dest: './build' }],
    }),
  ],
};

const _packages = Object.keys(modules);

const buildPackages = (name) => ({
  ...defaultConfigurations,
  input: `./src/packages/${name}/index.ts`,
  output: {
    file: `./build/packages/${name}.js`,
    format: 'iife',
  },
});

let _contents = [];
_packages
  .map((_package) => modules[_package].contents)
  .forEach((__contents) =>
    __contents.forEach((__content) => _contents.push(__content))
  );
_contents = [...new Set(_contents)];

const buildContents = (name) => ({
  ...defaultConfigurations,
  input: `./src/contents/${name}/index.tsx`,
  output: {
    file: `./build/contents/${name}.js`,
    format: 'iife',
    globals: {
      react: 'React',
    },
  },
  external: ['react'],
});

export default [
  ..._packages.map(buildPackages),
  ..._contents.map(buildContents),
];
