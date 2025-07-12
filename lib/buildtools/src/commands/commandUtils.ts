import { InvalidArgumentError, Option } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { LogLevel } from 'typedoc';
import type { LintResult } from '../prebuild/lint.js';
import type { TscResult } from '../prebuild/tsc.js';
import type { ErrorResult, Severity } from '../types.js';

export const lintOption = new Option('--lint', 'Run ESLint when building')
  .default(false);

export const tscOption = new Option('--tsc', 'Run tsc when building')
  .default(false);

export const logLevelOption = new Option('--logLevel <level>', 'Log level that Typedoc should use')
  .choices(objectKeys(LogLevel))
  .default(LogLevel.Error)
  .argParser((val): LogLevel => {
    if (val in LogLevel) {
      // @ts-expect-error Enums kind of behave weirdly in Typescript
      return LogLevel[val];
    }

    throw new InvalidArgumentError(`Invalid log level: ${val}`);
  });

type ValuesOfRecord<T> = T extends Record<any, infer U> ? U : never;

export type EntriesOfRecord<T extends Record<any, any>> = ValuesOfRecord<{
  [K in keyof T]: [K, T[K]]
}>;

export function objectEntries<T extends Record<any, any>>(obj: T) {
  return Object.entries(obj) as EntriesOfRecord<T>[];
}

export function objectValues<T>(obj: Record<string | number | symbol, T>) {
  return Object.values(obj) as T[];
}

export function objectKeys<T extends string | number | symbol>(obj: Record<T, unknown>) {
  return Object.keys(obj) as T[];
}

/**
 * Iterate through the entire results object, checking for errors. This will call `process.exit(1)` if there
 * are errors, or if there are warnings and `errorOnWarning` has been given as `true`.\
 * Mainly intended for use with CI pipelines so that processes can exit with non-zero codes
 */
export function processResult({ results, tsc, lint }: { results?: { severity: Severity }, tsc?: TscResult, lint?: LintResult }, errorOnWarning: boolean) {
  const severities: Severity[] = [];

  if (results) {
    severities.push(results.severity);
  }

  if (tsc) {
    severities.push(tsc.severity);
  }

  if (lint) {
    severities.push(lint.severity);
  }

  for (const severity of severities) {
    switch (severity) {
      case 'warn': {
        if (!errorOnWarning) continue;
      }
      case 'error':
        process.exit(1);
    }
  }
}

export function logCommandErrorAndExit(errorObject: ErrorResult | string, code: number = 1): never {
  if (typeof errorObject === 'string') {
    console.error(chalk.redBright(errorObject));
  } else {
    const errStr = errorObject.errors.join('\n');
    console.error(chalk.redBright(errStr));
  }
  process.exit(code);
}
