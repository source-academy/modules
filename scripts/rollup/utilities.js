/* [Imports] */
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonJS from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { SUPPRESSED_WARNINGS } from './constants.js';

/* [Exports] */
export function makeDefaultConfiguration() {
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
        include: ['src/'],
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
        include: 'node_modules/**',
      }),
      injectProcessEnv({
        NODE_ENV: process.env.NODE_ENV,
      }),
      filesize({
        showMinifiedSize: false,
        showGzippedSize: false,
      }),
    ],
  };
}
