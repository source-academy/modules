import { Argument, Option } from '@commander-js/extra-typings';
import { formatHtmlResult } from '../build/docs/html.js';
import { formatJsonResult } from '../build/docs/json.js';
import { formatManifestResult } from '../build/manifest.js';
import { formatBundleResult } from '../build/modules/bundle.js';
import { formatTabResult } from '../build/modules/tab.js';
import { formatLintResult } from '../prebuild/lint.js';
import { formatTscResult } from '../prebuild/tsc.js';
import type { FullResult } from '../types.js';

export const bundleDirArg = new Argument('[bundle]', 'Directory in which the bundle\'s source files are located')
  .default(process.cwd());

export const tabDirArg = new Argument('[tab]', 'Directory in which the tab\'s source files are located')
  .default(process.cwd());

export const outDirOption = new Option('--outDir <outDir>', 'Location of output directory')
  .default('build');

export const lintOption = new Option('--lint', 'Run ESLint when building')
  .default(false);

export const lintFixOption = new Option('--fix', 'Fix automatically fixable linting errors')
  .implies({ lint: true });

export const tscOption = new Option('--tsc', 'Run tsc when building')
  .default(false);

type ValuesOfRecord<T> = T extends Record<any, infer U> ? U : never;

export type EntriesOfRecord<T extends Record<any, any>> = ValuesOfRecord<{
  [K in keyof T]: [K, T[K]]
}>;

export function objectEntries<T extends Record<any, any>>(obj: T) {
  return Object.entries(obj) as EntriesOfRecord<T>[];
}

export function getResultString([entries, { tsc, lint }]: FullResult) {
  const results = entries.map(result => {
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
  });

  if (tsc) {
    results.unshift(formatTscResult(tsc));
  }

  if (lint) {
    results.unshift(formatLintResult(lint));
  }

  return results.join('\n');
}

export function resultsProcessor([entries, { tsc, lint }]: FullResult, errorOnWarning: boolean) {
  const severities = entries.map(({ severity }) => severity);
  if (tsc) {
    severities.unshift(tsc.severity);
  }

  if (lint) {
    severities.unshift(lint.severity);
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
