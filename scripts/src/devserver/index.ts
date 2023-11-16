import chalk from 'chalk';
import { Command } from 'commander';
import { ESLint } from 'eslint';
import pathlib from 'path';

// Separate command for running ESlint because running it straight
// from yarn tends not to work properly
const lintDevServerCommand = new Command('lint')
  .option('--fix', 'Fix auto fixable issues', false)
  .action(async ({ fix }: { fix: boolean }) => {
    const srcDir = pathlib.resolve('./devserver/src');
    const linter = new ESLint({
      cwd: srcDir,
      extensions: ['ts', 'tsx'],
    });

    const results = await linter.lintFiles('**/*.ts*');

    if (fix) {
      console.log(chalk.magentaBright('Running eslint autofix...'));
      await ESLint.outputFixes(results);
    }

    const outputFormatter = await linter.loadFormatter('stylish');
    const formatterOutput = outputFormatter.format(results);

    console.log(formatterOutput);

    const isError = results.find(({ errorCount }) => errorCount > 0);
    if (isError) process.exit(1);
  });

const devserverCommand = new Command('devserver')
  .addCommand(lintDevServerCommand);

export default devserverCommand;
