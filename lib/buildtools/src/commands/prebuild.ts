import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { formatResolveBundleErrors } from '../build/manifest/formatters.js';
import { resolveEitherBundleOrTab } from '../build/manifest/index.js';
import { runPrebuild } from '../prebuild/index.js';
import { formatLintResult, lintGlobal, runEslint } from '../prebuild/lint.js';
import { formatTscResult, runTsc } from '../prebuild/tsc.js';
import { divideAndRound } from '../utils.js';
import { logCommandErrorAndExit } from './commandUtils.js';

/*
 * The lint command is provided as part of buildtools so that each bundle and tab doesn't
 * have to install its own copy of ESLint
 */

export const getLintCommand = () => new Command('lint')
  .description('Run ESLint for the given directory, or the current directory if no directory is specified')
  .argument('[directory]', 'Directory to run ESLint in', process.cwd())
  .option('--fix', 'Output linting fixes', false)
  .option('--ci', process.env.CI)
  .action(async (directory, { fix, ci }) => {
    const fullyResolved = pathlib.resolve(directory);
    const resolveResult = await resolveEitherBundleOrTab(fullyResolved);

    if (resolveResult.severity === 'error') {
      if (resolveResult.errors.length === 0 ) {
        logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
      }

      logCommandErrorAndExit(formatResolveBundleErrors(resolveResult));
    }

    const result = await runEslint(resolveResult.asset, fix);
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
  .option('--ci', process.env.CI)
  .action(async ({ fix, ci }) => {
    const result = await lintGlobal(fix);
    const prefix = chalk.blueBright('[lintglobal]');
    const logs = [
      `${prefix} Took ${divideAndRound(result.filesElapsed, 1000)}s to find files`,
      `${prefix} Took ${divideAndRound(result.lintElapsed, 1000)}s to lint files`,
      result.fixElapsed === undefined
        ? `${prefix} No fixes output`
        : `${prefix} Took ${divideAndRound(result.fixElapsed, 1000)}s to output fixes`,
      result.formatted
    ];

    console.log(logs.join('\n'));

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
  .description('Run tsc for the given directory, or the current directory if no directory is specified')
  .argument('[directory]', 'Directory to run tsc in', process.cwd())
  .option('--no-emit', 'Prevent the typescript compiler from outputting files regardless of the tsconfig setting')
  .option('--ci', process.env.CI)
  .action(async (directory, { emit, ci }) => {
    const fullyResolved = pathlib.resolve(directory);
    const resolveResult = await resolveEitherBundleOrTab(fullyResolved);

    if (resolveResult.severity === 'error') {
      if (resolveResult.errors.length === 0 ) {
        logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
      }

      logCommandErrorAndExit(formatResolveBundleErrors(resolveResult));
    }

    const result = await runTsc(resolveResult.asset, !emit);
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
  .argument('[directory]', 'Directory to prebuild tasks in', process.cwd())
  .option('--ci', process.env.CI)
  .action(async (directory, { ci }) => {
    const fullyResolved = pathlib.resolve(directory);
    const resolveResult = await resolveEitherBundleOrTab(fullyResolved);

    if (resolveResult.severity === 'error') {
      if (resolveResult.errors.length === 0 ) {
        logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
      }

      logCommandErrorAndExit(formatResolveBundleErrors(resolveResult));
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
