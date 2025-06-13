/*
 * This command is provided as part of buildtools so that each bundle and tab doesn't
 * have to install its own copy of ESLint
 */

import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';
import { resolveSingleBundle } from '../build/manifest.js';
import { resolveSingleTab } from '../build/modules/tab.js';
import { formatLintResult, runEslint } from '../prebuild/lint.js';
import type { ResolvedBundle, ResolvedTab } from '../types.js';

export const getLintCommand = () => new Command('lint')
  .description('Run ESLint for the given directory, or the current directory if no directory is specified')
  .argument('[directory]', 'Directory to run ESLint in', process.cwd())
  .option('--fix', 'Output linting fixes', false)
  .option('--ci')
  .action(async (directory, { fix, ci }) => {
    const fullyResolved = pathlib.resolve(directory);

    let input: ResolvedBundle | ResolvedTab | undefined = await resolveSingleBundle(fullyResolved);
    if (!input) {
      input = await resolveSingleTab(fullyResolved);
    }

    if (!input) {
      throw new Error(`No tab or bundle found at ${fullyResolved}`);
    }

    const result = await runEslint(input, fix);
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
