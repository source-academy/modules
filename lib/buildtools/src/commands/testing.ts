import pathlib from 'path';
import { Command, InvalidOptionArgumentError, Option } from '@commander-js/extra-typings';
import { gitRoot } from '@sourceacademy/modules-repotools/getGitRoot';
import { getAllTestConfigurations, getTestConfiguration } from '@sourceacademy/modules-repotools/testing';
import { isBundleOrTabDirectory } from '@sourceacademy/modules-repotools/utils';
import chalk from 'chalk';
import type { VitestRunMode } from 'vitest/node';
import { runVitest } from '../testing.js';
import { logCommandErrorAndExit } from './commandUtils.js';

const vitestModeOption = new Option('--mode <mode>', 'Vitest Run Mode. See https://vitest.dev/guide/cli.html#mode')
  .choices(['test', 'benchmark'] as VitestRunMode[])
  .default('test');

const watchOption = new Option('-w, --watch', 'Run tests in watch mode');
const updateOption = new Option('-u, --update', 'Update snapshots');
const coverageOption = new Option('--coverage', 'Run coverage testing');

export const silentOption = new Option('--silent [option]', 'Silent mode')
  .choices(['passed-only', 'false', 'true'] as const)
  .argParser(value => {
    switch (value.toLowerCase()) {
      case 'passed-only':
        return 'passed-only';
      case 'false':
        return false;
      case 'true':
      case undefined:
        return true;
      default:
        throw new InvalidOptionArgumentError(`Invalid value for silent: ${value}`);
    }
  })
  .default('passed-only');

export const getTestCommand = () => new Command('test')
  .description('Run test for the specific bundle or tab at the specified directory.')
  .addOption(vitestModeOption)
  .addOption(watchOption)
  .addOption(updateOption)
  .addOption(coverageOption)
  .addOption(silentOption)
  .option('--no-allow-only', 'Allow the use of .only in tests', !process.env.CI)
  .option('-p, --project <directory>', 'Path to the directory that is the root of your test project')
  .argument('[patterns...]', 'Test patterns to filter by.')
  .action(async (patterns, { mode, project, ...options }) => {
    const relative = pathlib.relative(project ?? process.cwd(), gitRoot);

    if (relative && !relative.startsWith('..') && !pathlib.isAbsolute(relative)) {
      logCommandErrorAndExit('Cannot be run from a parent directory of the git root');
    }

    const fullyResolvedProject = pathlib.resolve(project ?? process.cwd());
    const fullyResolvedPatterns = patterns.map(each => pathlib.resolve(process.cwd(), each));

    const configResult = await getTestConfiguration(fullyResolvedProject, !!options.watch);

    if (configResult.severity === 'error') {
      logCommandErrorAndExit(configResult);
    }

    if (configResult.config === null) {
      // Just ignore it if a bundle doesn't or tab doesn't have tests
      if (!await isBundleOrTabDirectory(fullyResolvedProject)) {
        console.log(chalk.yellowBright(`No tests found for ${fullyResolvedProject}`));
      }
      return;
    }

    await runVitest(mode, fullyResolvedPatterns, [configResult.config], options);
  });

export const getTestAllCommand = () => new Command('testall')
  .description('Run all tests based on the configuration of the root vitest file')
  .argument('[patterns...]', 'Test patterns to filter by.')
  .addOption(vitestModeOption)
  .addOption(watchOption)
  .addOption(updateOption)
  .addOption(coverageOption)
  .addOption(silentOption)
  .option('--no-allow-only', 'Allow the use of .only in tests', !process.env.CI)
  .action(async (patterns, { mode, ...options }) => {
    const configs = await getAllTestConfigurations(!!options.watch);
    if (configs.length === 0) {
      console.log(chalk.yellowBright('No tests found.'));
      return;
    }

    await runVitest(mode, patterns, configs, options);
  });
