import { Argument, Option } from '@commander-js/extra-typings';
import { formatHtmlResult } from '../build/docs/html.js';
import { formatJsonResult } from '../build/docs/json.js';
import { formatManifestResult } from '../build/manifest.js';
import { formatBundleResult } from '../build/modules/bundle.js';
import { formatTabResult } from '../build/modules/tab.js';
import { formatLintResult } from '../prebuild/lint.js';
import { formatTscResult } from '../prebuild/tsc.js';
import type { FullResult, ResultEntry } from '../types.js';
import type { Severity } from '../utils.js';

export const bundleDirArg = new Argument('[bundle]', 'Directory in which the bundle\'s source files are located')
  .default(process.cwd());

export const tabDirArg = new Argument('[tab]', 'Directory in which the tab\'s source files are located')
  .default(process.cwd());

export const lintOption = new Option('--lint', 'Run ESLint when building')
  .default(false);

export const tscOption = new Option('--tsc', 'Run tsc when building')
  .default(false);

type ValuesOfRecord<T> = T extends Record<any, infer U> ? U : never;

export type EntriesOfRecord<T extends Record<any, any>> = ValuesOfRecord<{
  [K in keyof T]: [K, T[K]]
}>;

export function objectEntries<T extends Record<any, any>>(obj: T) {
  return Object.entries(obj) as EntriesOfRecord<T>[];
}

/**
 * Convert the provided result object into a single string
 */
export function getResultString<T extends (ResultEntry | ResultEntry[])>({ results, tsc, lint }: FullResult<T>): string {
  function resultMapper(result: ResultEntry) {
    switch (result.assetType) {
      case 'bundle':
        return formatBundleResult(result);
      case 'html':
        return formatHtmlResult(result);
      case 'json':
        return formatJsonResult(result);
      case 'manifest':
        return formatManifestResult(result);
      case 'tab':
        return formatTabResult(result);
    }
  }

  const output: string[] = [];

  if (tsc) {
    output.push(formatTscResult(tsc));
  }

  if (lint) {
    output.push(formatLintResult(lint));
  }

  if (results !== undefined) {
    if (Array.isArray(results)) {
      results.forEach(result => {
        output.push(resultMapper(result));
      });
    } else {
      output.push(resultMapper(results));
    }
  }

  return output.join('\n');
}

/**
 * Iterate through the entire results object, checking for errors. This will call `process.exit(1)` if there
 * are errors, or if there are warnings and `errorOnWarning` has been given as `true`.\
 * Mainly intended for use with CI pipelines so that processes can exit with non-zero codes
 */
export function resultsProcessor<T extends (ResultEntry | ResultEntry[])>({ results, tsc, lint }: FullResult<T>, errorOnWarning: boolean) {
  const severities: Severity[] = [];

  if (results !== undefined) {
    if (Array.isArray(results)) {
      results.forEach(({ severity }) => severities.push(severity));
    } else {
      severities.push(results.severity);
    }
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
