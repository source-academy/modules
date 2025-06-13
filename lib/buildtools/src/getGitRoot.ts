import { execFile } from 'child_process';
import pathlib from 'path';
import memoize from 'lodash/memoize.js';

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
export const getTabsDir = memoize(async () => pathlib.join(await getGitRoot(), 'src', 'tabs'));
export const getOutDir = memoize(async () => pathlib.join(await getGitRoot(), 'build'));
