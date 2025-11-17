import pathlib from 'path';
import type { FormattableTscResult, TypecheckResult } from '@sourceacademy/modules-repotools/tsc';
import type { BuildResult, ResultTypeWithWarn } from '@sourceacademy/modules-repotools/types';
import chalk from 'chalk';
import ts from 'typescript';
import { formatLintResult, type LintResult } from '../prebuild/lint.js';

interface ResultsObject {
  tsc?: TypecheckResult;
  lint?: LintResult;
  docs?: BuildResult;
  results?: BuildResult;
}

/**
 * Formats a single result object into a string
 */
export function formatResult(result: ResultTypeWithWarn, type?: 'docs' | 'bundle' | 'tab' | 'html') {
  if (result.severity === 'error') {
    return result.errors.join('\n');
  }

  const typeStr = type ?? 'output';
  const successStr = chalk.greenBright(`${typeStr} written to ${result.path}`);

  if (result.severity === 'warn') {
    return [
      ...result.warnings,
      successStr
    ].join('\n');
  }

  return successStr;
}

export function formatTscResult(tscResult: FormattableTscResult): string {
  const prefix = chalk.cyanBright('tsc completed');

  if (tscResult.severity === 'error' && 'errors' in tscResult) {
    return formatResult(tscResult);
  }

  const diagStr = ts.formatDiagnosticsWithColorAndContext(tscResult.results, {
    getNewLine: () => '\n',
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: name => pathlib.basename(name)
  });

  switch (tscResult.severity) {
    case 'error':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.redBright('errors')}\n${diagStr}`;
    case 'warn':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.yellowBright('warnings')}\n${diagStr}`;
    case 'success':
      return `${prefix} ${chalk.greenBright('successfully')}`;
  }
}

/**
 * Formats a larger result object, particularly one with prebuild results too.
 */
export function formatResultObject(results: ResultsObject): string {
  const args: string[] = [];

  if (results.tsc) {
    args.push(formatTscResult(results.tsc));
  }

  if (results.lint) {
    args.push(formatLintResult(results.lint));
  }

  if (results.docs) {
    args.push(formatResult(results.docs, 'docs'));
  }

  if (results.results !== undefined) {
    args.push(formatResult(results.results, results.results.type));
  }

  return args.join('\n');
}
