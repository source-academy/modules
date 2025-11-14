import pathlib from 'path';
import { Command, InvalidArgumentError, Option } from '@commander-js/extra-typings';
import { outDir } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveEitherBundleOrTab } from '@sourceacademy/modules-repotools/manifest';
import { divideAndRound } from '@sourceacademy/modules-repotools/utils';
import chalk from 'chalk';
import { ESLint } from 'eslint';
import { formatTscResult, runTypechecking, runWithTsconfig } from '../../../repotools/src/tsc.js';
import { runPrebuild } from '../prebuild/index.js';
import { formatLintResult, lintGlobal, runEslint } from '../prebuild/lint.js';
import { logCommandErrorAndExit } from './commandUtils.js';

export const concurrencyOption = new Option('--concurrency <value>')
  .argParser((value): Exclude<ESLint.Options['concurrency'], undefined> => {
    switch (value) {
      case 'auto':
      case 'off':
        return value;
      default: {
        const count = parseInt(value);

        if (Number.isNaN(count)) {
          throw new InvalidArgumentError(`Expected auto, off or a number, got ${value}`);
        }

        return count;
      }
    }
  })
  .default('auto');

/*
 * The lint command is provided as part of buildtools so that each bundle and tab doesn't
 * have to install its own copy of ESLint
 */

export const getLintCommand = () => new Command('lint')
  .description('Run ESLint for the given directory, or the current directory if no directory is specified')
  .argument('[directory]', 'Directory to run ESLint in', process.cwd())
  .option('--fix', 'Output linting fixes', false)
  .option('--stats', 'Output linting stats', false)
  .option('--ci', process.env.CI)
  .addOption(concurrencyOption)
  .action(async (directory, { ci, ...opts }) => {
    const fullyResolved = pathlib.resolve(directory);
    const resolveResult = await resolveEitherBundleOrTab(fullyResolved);

    if (resolveResult.severity === 'error') {
      if (resolveResult.errors.length === 0) {
        logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
      }

      logCommandErrorAndExit(resolveResult);
    }

    const prefix = chalk.blueBright('[lint]');
    console.log(`${prefix} ${chalk.cyanBright(`Running ESLint v${ESLint.version}`)}`);
    const { asset } = resolveResult;

    console.log(`${prefix} ${chalk.cyanBright(`Linting ${asset.name} ${asset.type}`)}`);

    const result = await runEslint(asset, opts);
    console.log(formatLintResult(result));

    switch (result.severity) {
      case 'warn': {
        if (!ci) return;
      }
      case 'error': {
        process.exit(1);
      }
    }
  });

export const getLintGlobalCommand = () => new Command('lintglobal')
  .description('Lints everything except tabs and bundles')
  .option('--fix', 'Output linting fixes', false)
  .option('--stats', 'Output linting stats', false)
  .option('--ci', process.env.CI)
  .addOption(concurrencyOption)
  .action(async ({ ci, ...opts }) => {
    const prefix = chalk.blueBright('[lintglobal]');

    console.log(`${prefix} ${chalk.cyanBright(`Running ESLint v${ESLint.version}`)}`);
    console.log(`${prefix} ${chalk.cyanBright('Beginning linting with the following options:')}`);
    Object.entries(opts).forEach(([key, value], i) => {
      console.log(`  ${i + 1}. ${chalk.greenBright(key)}: ${chalk.cyanBright(value)}`);
    });

    const result = await lintGlobal(opts);
    const logs = [
      `${prefix} Took ${divideAndRound(result.filesElapsed, 1000)}s to find files`,
      `${prefix} Took ${divideAndRound(result.lintElapsed, 1000)}s to lint files`,
      result.fixElapsed === undefined
        ? `${prefix} No fixes output`
        : `${prefix} Took ${divideAndRound(result.fixElapsed, 1000)}s to output fixes`,
      result.formatted
    ];

    console.log(logs.join('\n'));

    if (opts.stats) {
      const statPath = pathlib.join(outDir, 'lintstats.csv');
      console.log(chalk.greenBright(`Stats written to ${statPath}`));
    }

    switch (result.severity) {
      case 'warn': {
        if (!ci) return;
      }
      case 'error': {
        process.exit(1);
      }
    }
  });

// This command is provided as an augmented way to run tsc, automatically
// filtering out test files
export const getTscCommand = () => new Command('tsc')
  .description('Run type checking for the given directory, or the current directory if no directory is specified')
  .argument('[directory]', 'Directory to run tsc in', process.cwd())
  .option('--ci', process.env.CI)
  .action(async (directory, { ci }) => {
    const fullyResolved = pathlib.resolve(directory);
    const resolveResult = await resolveEitherBundleOrTab(fullyResolved);

    if (resolveResult.severity === 'error') {
      if (resolveResult.errors.length === 0) {
        logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
      }

      logCommandErrorAndExit(resolveResult);
    }

    const result = await runWithTsconfig(resolveResult.asset.directory, runTypechecking);
    console.log(formatTscResult(result));

    switch (result.severity) {
      case 'warn': {
        if (!ci) return;
      }
      case 'error': {
        process.exit(1);
      }
    }
  });

export const getPrebuildAllCommand = () => new Command('prebuild')
  .argument('[directory]', 'Directory to run prebuild tasks in', process.cwd())
  .option('--ci', process.env.CI)
  .action(async (directory, { ci }) => {
    const fullyResolved = pathlib.resolve(directory);
    const resolveResult = await resolveEitherBundleOrTab(fullyResolved);

    if (resolveResult.severity === 'error') {
      if (resolveResult.errors.length === 0) {
        logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
      }

      logCommandErrorAndExit(resolveResult);
    }

    const { tsc, lint } = await runPrebuild(resolveResult.asset);
    console.log(formatTscResult(tsc));
    console.log(formatLintResult(lint));

    [tsc, lint].forEach(({ severity }) => {
      switch (severity) {
        case 'warn': {
          if (!ci) return;
        }
        case 'error': {
          process.exit(1);
        }
      }
    });
  });
