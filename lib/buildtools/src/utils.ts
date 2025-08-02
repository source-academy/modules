import fs from 'fs/promises';
import pathlib from 'path';
import util from 'util';
import { getBundlesDir, getTabsDir } from './getGitRoot.js';
import type { Severity } from './types.js';

export type AwaitedReturn<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

/**
 * Check if the given object is a severity value.
 */
export function isSeverity(obj: unknown): obj is Severity {
  if (typeof obj !== 'string') return false;

  return obj === 'error' || obj === 'warn' || obj === 'success';
}

/**
 * Given two severity values, determine which is more severe.
 */
export function compareSeverity(lhs: Severity, rhs: Severity): Severity {
  switch (lhs) {
    case 'success':
      return rhs;
    case 'warn':
      return rhs === 'error' ? 'error' : 'warn';
    case 'error':
      return 'error';
  }
}

/**
 * Given an array of items, map them to {@link Severity | Severity} objects and then
 * determine the overall severity of all the given items
 */
export function findSeverity<T>(items: T[], mapper: (each: T) => Severity): Severity {
  let output: Severity = 'success';

  for (const item of items) {
    const severity = mapper(item);
    output = compareSeverity(output, severity);
    if (output === 'error') return 'error';
  }

  return output;
}

/*
export function processSeverities(items: { severity: Severity }[]) {
  return findSeverity(items, ({ severity }) => severity);
}

type CollatedResult<T> = {
  [k: `bundle-${string}`]: T
} | {
  [k: `tab-${string}`]: T
};

export function collateResults<T extends { bundle: ResolvedBundle } | { tab: ResolvedTab }>(results: T[]) {
  return results.reduce<CollatedResult<T>>((res, each) => {
    if ('bundle' in each) {
      return {
        ...res,
        [`bundle-${each.bundle.name}`]: each
      };
    }

    return {
      ...res,
      [`tab-${each.tab.name}`]: each
    };
  }, {});
}
*/

export const divideAndRound = (n: number, divisor: number) => (n / divisor).toFixed(2);

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return util.types.isNativeError(error);
}

/**
 * `Array.map` but with a mapping function that returns a promise
 */
export function mapAsync<T, U>(items: T[], mapper: (item: T, index: number) => Promise<U>) {
  return Promise.all(items.map(mapper));
}

/**
 * `Array.flatMap` but with a mapping function that returns a promise
 */
export async function flatMapAsync<T, U>(items: T[], mapper: (item: T, index: number) => Promise<U[]>) {
  const results = await Promise.all(items.map(mapper));
  return results.flat();
}

/**
 * `Array.filter`, but with a filtering function that returns a promise
 */
export async function filterAsync<T>(items: T[], filter: (item: T, index: number) => Promise<boolean>): Promise<T[]> {
  const results = await Promise.all(items.map(filter));

  return items.reduce((res, item, i) => results[i] ? [...res, item] : res, [] as T[]);
}

export async function isBundleOrTabDirectory(directory: string) {
  const RE = /^@sourceacademy\/(bundle|tab)-(.+)$/u;
  const bundlesDir = await getBundlesDir();
  const tabsDir = await getTabsDir();

  async function recurser(directory: string): Promise<['bundle' | 'tab', string] | null> {
    try {
      const packageJson = JSON.parse(await fs.readFile(`${directory}/package.json`, 'utf-8'));
      const match = RE.exec(packageJson.name);

      if (match) {
        const [, type, name] = match;
        return [type as 'bundle' | 'tab', name];
      }
    } catch (error) {
      if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
    }

    if (directory === bundlesDir || directory === tabsDir) return null;
    const parentDir = pathlib.resolve(directory, '..');
    return recurser(parentDir);
  }

  return recurser(directory);
}
