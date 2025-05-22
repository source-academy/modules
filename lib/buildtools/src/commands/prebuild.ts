import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import ts from 'typescript';
import { runEslint } from '../prebuild/lint';
import { runTsc } from '../prebuild/typecheck';
import { getGitRoot } from '../utils';

export const getLintCommand = () => new Command('lint')
  .description('Run ESLint for the given directory, or the entire repository if no directory is specified')
  .argument('[directory]')
  .option('--fix')
  .option('--ci')
  .action(async (directory, { fix, ci }) => {
    const fullyResolved = directory === undefined ? await getGitRoot() : pathlib.resolve(directory);
    const { severity, formatted } = await runEslint(fullyResolved, fix);
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

export const getTscCommand = () => new Command('typecheck')
  .description('Run tsc for the given directory, or the entire repository if no directory is specified')
  .argument('[directory]')
  .action(async directory => {
    const fullyResolved = directory === undefined ? await getGitRoot() : pathlib.resolve(directory);
    const tscResult = await runTsc(fullyResolved);
    if (tscResult.severity === 'error' && tscResult.error) {
      console.log(`${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')}: ${tscResult.error}`)}`);
      process.exit(1);
    }

    const diagStr = ts.formatDiagnosticsWithColorAndContext(tscResult.results, {
      getNewLine: () => '\n',
      getCurrentDirectory: () => process.cwd(),
      getCanonicalFileName: name => pathlib.basename(name)
    });

    if (tscResult.severity === 'error') {
      console.log(`${diagStr}\n${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')}}`)}`);
      process.exit(1);
    }
    console.log(`${diagStr}\n${chalk.cyanBright(`tsc completed ${chalk.greenBright('successfully')}`)}`);
  });
