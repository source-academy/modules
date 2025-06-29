export type AwaitedReturn<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export type Severity = 'error' | 'success' | 'warn';

export function compareSeverity(lhs: Severity, rhs: Severity) {
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
