/*
 * This command is provided as part of buildtools so that each bundle and tab doesn't
 * have to install its own copy of ESLint
 */

import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';
import { resolveEitherBundleOrTab } from '../build/manifest.js';
import { formatLintResult, runEslint } from '../prebuild/lint.js';
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
