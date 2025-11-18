import pathlib from 'path';
import chalk from 'chalk';
import partition from 'lodash/partition.js';
import ts from 'typescript';
import type { OverallResultType, FormattableTscResult } from '@sourceacademy/modules-repotools/build';
import type { LintResult } from '@sourceacademy/modules-repotools/prebuild/lint';

interface ResultsObject {
  tsc?: FormattableTscResult;
  lint: LintResult;
}

export function formatLintResult({ severity, formatted, input }: LintResult): string {
  const prefix = `${chalk.blueBright(`[${input.type} ${input.name}]:`)} ${chalk.cyanBright('Linting completed')}`;

  switch (severity) {
    case 'error':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.redBright('errors')}:\n${formatted}`;
    case 'warn':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.yellowBright('warnings')}:\n${formatted}`;
    case 'success':
      return `${prefix} ${chalk.greenBright('successfully')}`;
  }
}

export function formatTscResult(tscResult: FormattableTscResult): string {
  const prefix = chalk.cyanBright('tsc completed');

  if (tscResult.severity === 'success') {
    return `${prefix} ${chalk.greenBright('successfully')}`;
  }
 
  const host: ts.FormatDiagnosticsHost = {
    getNewLine: () => '\n',
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: name => pathlib.basename(name)
  };

  if (tscResult.severity === 'warn') {
    const diagStr = ts.formatDiagnosticsWithColorAndContext(tscResult.diagnostics, host);
    return `${prefix} ${chalk.cyanBright('with')} ${chalk.yellowBright('warnings')}\n${diagStr}`;
  }

  const [errDiags, tsDiags] = partition(tscResult.diagnostics, each => 'errors' in each)

  let errStr: string = '';

  if (tsDiags.length > 0) {
    errStr = ts.formatDiagnosticsWithColorAndContext(tsDiags, host);
  }
  
  if (errDiags.length > 0) {
    errStr += errDiags.flatMap(diag => diag.errors).join('\n')
  }
  
  return `${prefix} ${chalk.cyanBright('with')} ${chalk.redBright('errors')}\n${errStr}`;
}

/**
 * Formats a larger result object, particularly one with prebuild results too.
 */
export function formatResultObject({ tsc, lint }: ResultsObject, result: OverallResultType): string {
  const args: string[] = [];

  if (tsc) {
    args.push(formatTscResult(tsc));
  }

  if (lint) {
    args.push(formatLintResult(lint));
  }

  if (result.severity === 'error') {
    result.diagnostics !== undefined
  }

  if (result.diagnostics !== undefined) {
    args.push(formatResult(results.results));
  }

  return args.join('\n');
}
