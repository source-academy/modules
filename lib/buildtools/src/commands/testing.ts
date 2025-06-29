import { resolve } from 'path';
import { Command, Option } from '@commander-js/extra-typings';
import type { VitestRunMode } from 'vitest/node';
import { formatResolveBundleErrors } from '../build/manifest/formatters.js';
import { resolveEitherBundleOrTab } from '../build/manifest/index.js';
import { runIndividualVitest } from '../testing.js';
import { logCommandErrorAndExit } from './commandUtils.js';

const vitestModeOption = new Option('--mode <mode>', 'Vitest Run Mode. See https://vitest.dev/guide/cli.html#mode')
  .choices(['test', 'benchmark'] as VitestRunMode[])
  .default('test');

const watchOption = new Option('-w, --watch', 'Run tests in watch mode');

const updateOption = new Option('-u, --update', 'Update snapshots');

const coverageOption = new Option('--coverage');

export const getTestCommand = () => new Command('test')
  .description('Run test for the specific bundle or tab at the specified directory.')
  .addOption(vitestModeOption)
  .addOption(watchOption)
  .addOption(updateOption)
  .addOption(coverageOption)
  .argument('[directory]', 'Directory to search for tests. If no directory is specified, the current working directory is used')
  .action(async (directory, { mode, ...options }) => {
    const fullyResolved = resolve(directory ?? process.cwd());
    const resolveResult = await resolveEitherBundleOrTab(fullyResolved);

    if (resolveResult.severity === 'error') {
      if (resolveResult.errors.length === 0 ) {
        logCommandErrorAndExit(`No tab or bundle found at ${fullyResolved}`);
      }

      logCommandErrorAndExit(formatResolveBundleErrors(resolveResult));
    }

    await runIndividualVitest(mode, resolveResult.asset, options);
  });
