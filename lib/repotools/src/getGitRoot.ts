import { execFile } from 'child_process';
import pathlib from 'path';

/*
 * Due to the multi-level directory structure in the repository, some commands can be run anywhere
 * but their outputs must be created relative to the repository root. This little hack using git
 * returns us the repository root and allows to resolve paths as needed.
 */
function rawGetGitRoot() {
  return new Promise<string>((resolve, reject) => {
    // When run from a git hook, git sets GIT_DIR (and friends), which makes rev-parse
    // report the current directory instead of the repository root
    const env = { ...process.env };
    delete env.GIT_DIR;
    delete env.GIT_WORK_TREE;
    delete env.GIT_INDEX_FILE;
    execFile('git', ['rev-parse', '--show-toplevel'], { env }, (err, stdout, stderr) => {
      const possibleError = err || stderr;
      if (possibleError) {
        reject(possibleError);
      }

      resolve(stdout.trim());
    });
  });
}

/**
 * Path to the root of the git repository
 */
export const gitRoot = await rawGetGitRoot();

/**
 * Path to the directory within which bundles are defined
 */
export const bundlesDir = pathlib.join(gitRoot, 'src', 'bundles');

/**
 * Path to the directory within which tabs are defined
 */
export const tabsDir = pathlib.join(gitRoot, 'src', 'tabs');

/**
 * Path to the default output directory
 */
export const outDir = pathlib.join(gitRoot, 'build');

/**
 * Path to the `vitest.config.ts` file at the root of the repository.
 */
export const rootVitestConfigPath = pathlib.join(gitRoot, 'vitest.config.ts');
