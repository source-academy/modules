import pathlib from 'path';
import chalk from 'chalk';
import partition from 'lodash/partition.js';
import ts from 'typescript';
import type { OverallResultType, FormattableTscResult, JsonResult } from '@sourceacademy/modules-repotools/build';

interface ResultsObject {
  tsc?: FormattableTscResult;
  lint: LintResult;
  results?: OverallResultType;
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

/**
 * Formats a single result object into a string
 */
export function formatResult(result: OverallResultType) {
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
export function formatResultObject(results: ResultsObject): string {
  const args: string[] = [];

  if (results.tsc) {
    args.push(formatTscResult(results.tsc));
  }

  if (results.lint) {
    args.push(formatLintResult(results.lint));
  }

  if (results.results !== undefined) {
    args.push(formatResult(results.results));
  }

  return args.join('\n');
}
