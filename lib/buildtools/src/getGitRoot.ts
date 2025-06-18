import { execFile } from 'child_process';
import pathlib from 'path';
import memoize from 'lodash/memoize.js';

/*
 * Due to the multi-level directory structure in the repository, some commands can be run anywhere
 * but their outputs must be created relative to the repository root. This little hack using git
 * returns us the repository root and allows to resolve paths as needed.
 */
function rawGetGitRoot() {
  return new Promise<string>((resolve, reject) => {
    execFile('git', ['rev-parse', '--show-toplevel'], (err, stdout, stderr) => {
      const possibleError = err || stderr;
      if (possibleError) {
        reject(possibleError);
      }

      resolve(stdout.trim());
    });
  });
}

/**
 * Get the path to the root of the git repository
 */
export const getGitRoot = memoize(rawGetGitRoot);

/**
 * Get the path to the directory within which bundles are stored
 */
export const getBundlesDir = memoize(async () => pathlib.join(await getGitRoot(), 'src', 'bundles'));

/**
 * Get the path to the directory within which tabs are stored
 */
export const getTabsDir = memoize(async () => pathlib.join(await getGitRoot(), 'src', 'tabs'));

/**
 * Get the path to the default output directory
 */
export const getOutDir = memoize(async () => pathlib.join(await getGitRoot(), 'build'));
