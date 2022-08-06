// /* [Imports] */
import fs from 'fs';
import babel from '@rollup/plugin-babel';
import rollupResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import chalk from 'chalk';
import commonJS from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import {
  DATABASE_NAME,
  NODE_MODULES_PATTERN,
  SOURCE_PATTERN,
  SUPPRESSED_WARNINGS,
} from './constants';

/**
 * Default configuration used by rollup for transpiling both tabs and bundles
 */
export const defaultConfig = {
  onwarn(warning, warn) {
    if (SUPPRESSED_WARNINGS.includes(warning.code)) return;

    warn(warning);
  },
  plugins: [
    typescript({
      tsconfig: 'src/tsconfig.json',
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      include: [SOURCE_PATTERN],
    }),
    rollupResolve({
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
  ],
};

// Function takes in relative paths, for cleaner logging
export function isFolderModified(relativeFolderPath, storedTimestamp) {
  function toFullPath(rootRelativePath) {
    return join(process.cwd(), rootRelativePath);
  }

  let fullFolderPath = toFullPath(relativeFolderPath);

  let contents = fs.readdirSync(fullFolderPath);
  for (let content of contents) {
    let relativeContentPath = join(relativeFolderPath, content);
    let fullContentPath = join(fullFolderPath, content);

    let stats = fs.statSync(fullContentPath);

    // If is folder, recurse. If found something modified, stop early
    if (
      stats.isDirectory() &&
      isFolderModified(relativeContentPath, storedTimestamp)
    ) {
      return true;
    }

    // Is file. Compare timestamps to see if stop early
    if (stats.mtimeMs > storedTimestamp) {
      console.log(chalk.grey(`• File modified: ${relativeContentPath}`));
      return true;
    }
  }

  return false;
}

/**
 * Function to replicate the functionality of `__dirname` in CJS code
 */
export function cjsDirname() {
  return dirname(fileURLToPath(import.meta.url));
}

/**
 * Get the path to the database file
 */
export function getDbPath() {
  return join(dirname(fileURLToPath(import.meta.url)), `${DATABASE_NAME}.json`);
}

/**
 * Get a new Lowdb instance
 */
export function getDb() {
  return Low(new FileAsync(getDbPath()));
}

export function removeDuplicates(arr) {
  return [...new Set(arr)];
}

/**
 * Checks if the given output directory is empty, to determine
 * if the given build script should execute regardless of the last build time
 */
export const shouldBuildAll = (outputDir) => {
  if (process.argv[3] === '--force') return true;

  if (!fs.existsSync(`build/${outputDir}`)) return true;

  return fs.readdirSync(`build/${outputDir}`).length === 0;
};
