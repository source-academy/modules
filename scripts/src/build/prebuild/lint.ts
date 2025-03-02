import chalk from 'chalk';
import { loadESLint, type ESLint } from 'eslint';
import { lintFixOption, retrieveBundlesAndTabs, wrapWithTimer } from '@src/commandUtils';
import { divideAndRound, findSeverity, type AwaitedReturn, type Severity } from '../utils';
import { createPrebuildCommand, createPrebuildCommandHandler, type PrebuildOptions } from './utils';

interface LintResults {
  formatted: string
  severity: Severity
}

interface LintOptions extends Omit<PrebuildOptions, 'manifest'> {
  fix?: boolean
}

export const runEslint = wrapWithTimer(async ({ bundles, tabs, srcDir, fix }: LintOptions): Promise<LintResults> => {
  const ESlint = await loadESLint({ useFlatConfig: true });
  const linter: ESLint = new ESlint({ fix });

  const fileNames = [
    ...bundles.map(bundleName => `${srcDir}/bundles/${bundleName}/**/*.ts`),
    ...tabs.map(tabName => `${srcDir}/tabs/${tabName}/**/*.ts*`)
  ];

  try {
    const linterResults = await linter.lintFiles(fileNames);
    if (fix) {
      await ESlint.outputFixes(linterResults);
    }

    const outputFormatter = await linter.loadFormatter('stylish');
    const formatted = await outputFormatter.format(linterResults);
    const severity = findSeverity(linterResults, ({ warningCount, errorCount, fatalErrorCount }) => {

      if (!fix && (fatalErrorCount + errorCount) > 0) return 'error';
      if (fix && fatalErrorCount > 0) {
        return 'error';
      }
      if (warningCount > 0) return 'warn';
      return 'success';
    });

    return {
      formatted,
      severity
    };
  } catch (error) {
    return {
      severity: 'error',
      formatted: error.toString()
    };
  }
});

export function eslintResultsLogger({ elapsed, result: { formatted, severity } }: AwaitedReturn<typeof runEslint>) {
  let errStr: string;

  if (severity === 'error') errStr = chalk.cyanBright('with ') + chalk.redBright('errors');
  else if (severity === 'warn') errStr = chalk.cyanBright('with ') + chalk.yellowBright('warnings');
  else errStr = chalk.greenBright('successfully');

  return `${chalk.cyanBright(`Linting completed in ${divideAndRound(elapsed, 1000)}s ${errStr}:`)}\n${formatted}`;
}

const lintCommandHandler = createPrebuildCommandHandler((...args) => runEslint(...args), eslintResultsLogger);

export function getLintCommand() {
  return createPrebuildCommand('lint', 'Run eslint')
    .addOption(lintFixOption)
    .action(async opts => {
      const inputs = await retrieveBundlesAndTabs(opts.manifest, opts.bundles, opts.tabs, false);
      await lintCommandHandler({ ...opts, ...inputs });
    });
}
