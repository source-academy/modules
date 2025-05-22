import { execFile } from 'child_process';
import pathlib from 'path';
import _ from 'lodash';

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
export const getGitRoot = _.memoize(rawGetGitRoot);
export const getBundlesDir = _.memoize(async () => pathlib.join(await getGitRoot(), 'src', 'bundles'));
export const getTabsDir = _.memoize(async () => pathlib.join(await getGitRoot(), 'src', 'tabs'));
export const getOutDir = _.memoize(async () => pathlib.join(await getGitRoot(), 'build'));

export type AwaitedReturn<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export type Severity = 'error' | 'success' | 'warn';

export function findSeverity<T>(items: T[], mapper: (each: T) => Severity): Severity {
  let output: Severity = 'success';
  for (const item of items) {
    const severity = mapper(item);
    if (severity === 'error') return 'error';
    if (severity === 'warn') {
      output = 'warn';
    }
  }

  return output;
}

export const divideAndRound = (n: number, divisor: number) => (n / divisor).toFixed(2);
