import { resolve } from 'path';
import { Command, Option } from '@commander-js/extra-typings';
import chalk from 'chalk';
import type { VitestRunMode } from 'vitest/node';
import { runVitest } from '../testing/runner.js';
import { getAllTestConfigurations, getTestConfiguration } from '../testing/utils.js';
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
    const configResult = await getTestConfiguration(fullyResolved, !!options.watch);

    if (configResult.severity === 'error') {
      logCommandErrorAndExit(configResult);
    }

    if (configResult.config === null) {
      console.log(chalk.yellowBright(`No tests found for in ${fullyResolved}`));
      return;
    }

    await runVitest(mode, [fullyResolved], [configResult.config], options);
  });

export const getTestAllCommand = () => new Command('testall')
  .description('Run all tests based on the configuration of the root vitest file')
  .addOption(vitestModeOption)
  .addOption(watchOption)
  .addOption(updateOption)
  .addOption(coverageOption)
  .action(async ({ mode, ...options }) => {
    const configs = await getAllTestConfigurations(!!options.watch);
    await runVitest(mode, undefined, configs, options);
  });
