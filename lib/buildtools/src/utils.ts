import { Severity, type ResolvedBundle, type ResolvedTab } from './types.js';

export type AwaitedReturn<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export function compareSeverity(lhs: Severity, rhs: Severity): Severity {
  switch (lhs) {
    case Severity.SUCCESS:
      return rhs;
    case Severity.WARN:
      return rhs === 'error' ? Severity.ERROR : Severity.WARN;
    case Severity.ERROR:
      return Severity.ERROR;
  }
}

/**
 * Given an array of items, map them to {@link Severity | Severity} objects and then
 * determine the overall severity of all the given items
 */
export function findSeverity<T>(items: T[], mapper: (each: T) => Severity): Severity {
  let output: Severity = Severity.SUCCESS;

  for (const item of items) {
    const severity = mapper(item);
    output = compareSeverity(output, severity);
    if (output === Severity.ERROR) return Severity.ERROR;
  }

  return output;
}

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

export const divideAndRound = (n: number, divisor: number) => (n / divisor).toFixed(2);

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
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
