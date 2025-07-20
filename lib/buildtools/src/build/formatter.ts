import chalk from 'chalk';
import { formatLintResult, type LintResult } from '../prebuild/lint.js';
import { formatTscResult, type TscResult } from '../prebuild/tsc.js';
import type { BuildResult, ResultTypeWithWarn } from '../types.js';

interface ResultsObject {
  tsc?: TscResult
  lint?: LintResult
  docs?: BuildResult
  results?: BuildResult
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
