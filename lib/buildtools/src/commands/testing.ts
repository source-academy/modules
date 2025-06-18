import { resolve } from 'path';
import { Command, Option } from '@commander-js/extra-typings';
import type { VitestRunMode } from 'vitest/node';
import { resolveEitherBundleOrTab } from '../build/manifest.js';
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
    const asset = await resolveEitherBundleOrTab(fullyResolved);
    if (asset === undefined) {
      logCommandErrorAndExit(`No bundle or tab found at ${fullyResolved}`);
    }

    await runIndividualVitest(mode, asset, options);
  });
