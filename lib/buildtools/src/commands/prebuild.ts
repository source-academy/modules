/*
 * This command is provided as part of buildtools so that each bundle and tab doesn't
 * have to install its own copy of ESLint
 */

import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';
import { resolveEitherBundleOrTab } from '../build/manifest.js';
import { runPrebuild } from '../prebuild/index.js';
import { formatLintResult, runEslint } from '../prebuild/lint.js';
import { formatTscResult, runTsc } from '../prebuild/tsc.js';
import { logCommandErrorAndExit } from './commandUtils.js';

export const getLintCommand = () => new Command('lint')
  .description('Run ESLint for the given directory, or the current directory if no directory is specified')
  .argument('[directory]', 'Directory to run ESLint in', process.cwd())
  .option('--fix', 'Output linting fixes', false)
  .option('--ci')
  .action(async (directory, { fix, ci }) => {
    const fullyResolved = pathlib.resolve(directory);
    const asset = await resolveEitherBundleOrTab(fullyResolved);

    if (!asset) {
      logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
    }

    const result = await runEslint(asset, fix);
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

// This command is provided as an augmented way to run tsc, automatically
// filtering out test files
export const getTscCommand = () => new Command('tsc')
  .description('Run tsc for the given directory, or the current directory if no directory is specified')
  .argument('[directory]', 'Directory to run tsc in', process.cwd())
  .option('--no-emit', 'Prevent the typescript compiler from outputting files regardless of the tsconfig setting')
  .option('--ci')
  .action(async (directory, { emit, ci }) => {
    const fullyResolved = pathlib.resolve(directory);
    const asset = await resolveEitherBundleOrTab(fullyResolved);

    if (!asset) {
      logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
    }

    const result = await runTsc(asset, !emit);
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
  .option('--ci')
  .action(async (directory, { ci }) => {
    const fullyResolved = pathlib.resolve(directory);
    const asset = await resolveEitherBundleOrTab(fullyResolved);

    if (!asset) {
      logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
    }

    const { tsc, lint } = await runPrebuild(asset);
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
