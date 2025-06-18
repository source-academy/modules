import chalk from 'chalk';
import { ESLint } from 'eslint';
import { getGitRoot } from '../getGitRoot.js';
import type { ResolvedBundle, ResolvedTab } from '../types.js';
import { findSeverity, type Severity } from '../utils.js';
import { createPrebuilder } from './prebuildUtils.js';

export interface LintResults {
  formatted: string
  severity: Severity
  input: ResolvedBundle | ResolvedTab
}

export const {
  builder: runEslint,
  formatter: formatLintResult
} = createPrebuilder<LintResults, [fix: boolean]>(async (input, fix) => {
  const linter = new ESLint({
    fix,
    cwd: await getGitRoot()
  });

  try {
    const linterResults = await linter.lintFiles(input.directory);
    if (fix) {
      await ESLint.outputFixes(linterResults);
    }

    const outputFormatter = await linter.loadFormatter('stylish');
    const formatted = await outputFormatter.format(linterResults);

    const severity = findSeverity(linterResults, ({ warningCount, errorCount, fatalErrorCount, fixableWarningCount }) => {

      if (fatalErrorCount > 0) return 'error';
      if (!fix && errorCount > 0) return 'error';

      if (warningCount > 0) {
        if (fix && fixableWarningCount === warningCount) {
          return 'success';
        }
        return 'warn';
      }
      return 'success';
    });

    console.log(severity);

    return {
      formatted,
      severity,
      input
    };
  } catch (error) {
    return {
      severity: 'error',
      formatted: `${error}`,
      input
    };
  }
}, ({ severity, formatted, input }) => {
  const inputType = 'entryPoint' in input ? 'tab' : 'bundle';
  const prefix = `${chalk.blueBright(`[${inputType} ${input.name}]:`)} ${chalk.cyanBright('Linting completed')}`;

  switch (severity) {
    case 'error':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.redBright('errors')}:\n${formatted}`;
    case 'warn':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.yellowBright('warnings')}:\n${formatted}`;
    case 'success':
      return `${prefix} ${chalk.greenBright('successfully')}`;
  }
});
