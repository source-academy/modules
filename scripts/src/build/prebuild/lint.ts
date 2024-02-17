import chalk from 'chalk';
import { Command } from 'commander';
import { ESLint } from 'eslint';
import pathlib from 'path';

import { findSeverity, printList, wrapWithTimer } from '../../scriptUtils.js';
import { divideAndRound, exitOnError, retrieveBundlesAndTabs } from '../buildUtils.js';
import type { AssetInfo, BuildCommandInputs, Severity } from '../types.js';

export type LintCommandInputs = ({
  lint: false;
  fix: false;
} | {
  lint: true;
  fix: boolean;
}) & {
  srcDir: string;
};

export type LintOpts = Omit<LintCommandInputs, 'lint'>;

type LintResults = {
  formatted: string;
  results: ESLint.LintResult[],
  severity: Severity;
};

/**
 * Run eslint programmatically
 * Refer to https://eslint.org/docs/latest/integrate/nodejs-api for documentation
 */
export const runEslint = wrapWithTimer(async (opts: LintOpts, { bundles, tabs }: Partial<AssetInfo>): Promise<LintResults> => {
  const linter = new ESLint({
    cwd: pathlib.resolve(opts.srcDir),
    extensions: ['ts', 'tsx'],
    fix: opts.fix,
  });

  const promises: Promise<ESLint.LintResult[]>[] = [];
  if (bundles?.length > 0 || tabs?.length > 0) {
    // Lint specific bundles and tabs
    if (bundles.length > 0) {
      printList(`${chalk.magentaBright('Running eslint on the following bundles')}:\n`, bundles);
      bundles.forEach((bundle) => promises.push(linter.lintFiles(pathlib.join('bundles', bundle))));
    }

    if (tabs.length > 0) {
      printList(`${chalk.magentaBright('Running eslint on the following tabs')}:\n`, tabs);
      tabs.forEach((tabName) => promises.push(linter.lintFiles(pathlib.join('tabs', tabName))));
    }
  } else {
    // Glob all source files, then lint files based on eslint configuration
    promises.push(linter.lintFiles('**/*.ts'));
    console.log(`${chalk.magentaBright('Linting all files in')} ${opts.srcDir}`);
  }

  // const [lintBundles, lintTabs, lintMisc] = await Promise.all(promises);
  const lintResults = (await Promise.all(promises)).flat();

  if (opts.fix) {
    console.log(chalk.magentaBright('Running eslint autofix...'));
    await ESLint.outputFixes(lintResults);
  }

  const lintSeverity = findSeverity(lintResults, ({ errorCount, warningCount }) => {
    if (errorCount > 0) return 'error';
    if (warningCount > 0) return 'warn';
    return 'success';
  });

  const outputFormatter = await linter.loadFormatter('stylish');
  const formatterOutput = outputFormatter.format(lintResults);

  return {
    formatted: typeof formatterOutput === 'string' ? formatterOutput : await formatterOutput,
    results: lintResults,
    severity: lintSeverity,
  };
});

export const logLintResult = (input: Awaited<ReturnType<typeof runEslint>> | null) => {
  if (!input) return;

  const { elapsed, result: { formatted, severity } } = input;
  let errStr: string;

  if (severity === 'error') errStr = chalk.cyanBright('with ') + chalk.redBright('errors');
  else if (severity === 'warn') errStr = chalk.cyanBright('with ') + chalk.yellowBright('warnings');
  else errStr = chalk.greenBright('successfully');

  console.log(`${chalk.cyanBright(`Linting completed in ${divideAndRound(elapsed, 1000)}s ${errStr}:`)}\n${formatted}`);
};

const getLintCommand = () => new Command('lint')
  .description('Run eslint')
  .option('--fix', 'Ask eslint to autofix linting errors', false)
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('-m, --modules <modules...>', 'Manually specify which modules to check', null)
  .option('-t, --tabs <tabs...>', 'Manually specify which tabs to check', null)
  .option('-v, --verbose', 'Display more information about the build results', false)
  .action(async ({ modules, tabs, manifest, ...opts }: BuildCommandInputs & LintCommandInputs) => {
    const assets = modules !== null || tabs !== null
      ? await retrieveBundlesAndTabs(manifest, modules, tabs)
      : {
        modules: undefined,
        tabs: undefined,
      };

    const result = await runEslint(opts, assets);
    logLintResult(result);
    exitOnError([], result.result);
  });

export default getLintCommand;
