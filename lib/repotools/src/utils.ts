import fs from 'fs/promises';
import pathlib from 'path';
import util from 'util';
import { bundlesDir, tabsDir } from './getGitRoot.js';
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

/**
 * Beginning from the current directory, recurse upwards until a `package.json` is located or the git root is reached.\
 * Returns the name of the bundle/tab that the directory belongs to if it exists, null otherwise.
 */
export async function isBundleOrTabDirectory(directory: string) {
  const RE = /^@sourceacademy\/(bundle|tab)-(.+)$/u;

  async function recurser(directory: string): Promise<['bundle' | 'tab', string] | null> {
    try {
      const packageJson = JSON.parse(await fs.readFile(pathlib.join(directory, 'package.json'), 'utf-8'));
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

type DeconstructRecord<T extends Record<string | symbol | number, unknown>> = {
  [K in keyof T]: [K, T[K]]
}[keyof T];

/**
 * Type safe `Object.entries`
 */
export function objectEntries<T extends Record<string | symbol | number, unknown>>(obj: T) {
  return Object.entries(obj) as DeconstructRecord<T>[];
}

/**
 * Type safe `Object.values`
 */
export function objectValues<T>(obj: Record<string | symbol | number, T>): T[] {
  return Object.values(obj);
}

export function objectKeys<T extends string | symbol | number>(obj: Record<T, unknown>) {
  return Object.keys(obj) as T[];
}

type ArrayOfLength<T extends number, U = unknown, V extends U[] = []> =
  V['length'] extends T ? V : ArrayOfLength<T, U, [...V, U]>;

export function arrayIsLength<T extends number>(obj: unknown, length: T): obj is ArrayOfLength<T> {
  return Array.isArray(obj) && obj.length === length;
}

/**
 * If the provided path is already a posix path, then this function does nothing.\
 * Otherwise, it will return Windows paths with the path separators replaced.
 */
export function convertToPosixPath(p: string) {
  return pathlib.posix.join(...p.split(pathlib.sep));
}

/**
 * Returns `true` if both paths refer to the same location.
 */
export function isSamePath(lhs: string, rhs: string) {
  const relpath = pathlib.relative(lhs, rhs);
  return relpath === '';
}
