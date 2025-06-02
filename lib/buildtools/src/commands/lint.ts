import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { getGitRoot } from '../getGitRoot';
import { runEslint } from '../prebuild/lint';

export const getLintCommand = () => new Command('lint')
  .description('Run ESLint for the given directory, or the entire repository if no directory is specified')
  .argument('[directory]')
  .option('--fix')
  .option('--ci')
  .action(async (directory, { fix, ci }) => {
    const fullyResolved = directory === undefined ? await getGitRoot() : pathlib.resolve(directory);
    const { severity, formatted } = await runEslint(fullyResolved, Boolean(fix));
    let errStr: string;

    if (severity === 'error') errStr = chalk.cyanBright('with ') + chalk.redBright('errors');
    else if (severity === 'warn') errStr = chalk.cyanBright('with ') + chalk.yellowBright('warnings');
    else errStr = chalk.greenBright('successfully');

    console.log(`${chalk.cyanBright('Linting completed ')}${errStr}:\n${formatted}`);

    switch (severity) {
      case 'warn': {
        if (!ci) return;
      }
      case 'error': {
        process.exit(1);
      }
    }
  });
