import { Command } from "@commander-js/extra-typings";
import { runEslint } from "../prebuild/lint";
import type { AwaitedReturn } from "../utils";
import { runTsc } from "../prebuild/typecheck";
import pathlib from 'path';
import chalk from "chalk";
import ts from 'typescript'

export const getLintCommand = () => new Command('lint')
  .argument('<directory>')
  .option('--fix')
  .action(async (directory, { fix }) => {
    const results = await runEslint(directory, fix)
    console.log(eslintResultsLogger(results))
  })

export const getTscCommand = () => new Command('typecheck')
  .argument('<directory>')
  .action(async directory => {
    const results = await runTsc(directory)
    console.log(tscResultsLogger(results))
  })

function tscResultsLogger(tscResult: AwaitedReturn<typeof runTsc>) {
  if (tscResult.severity === 'error' && tscResult.error) {
    return `${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')}: ${tscResult.error}`)}`;
  }

  const diagStr = ts.formatDiagnosticsWithColorAndContext(tscResult.results, {
    getNewLine: () => '\n',
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: name => pathlib.basename(name)
  });

  if (tscResult.severity === 'error') {
    return `${diagStr}\n${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')}}`)}`;
  }
  return `${diagStr}\n${chalk.cyanBright(`tsc completed ${chalk.greenBright('successfully')}`)}`;
}

function eslintResultsLogger({ formatted, severity }: AwaitedReturn<typeof runEslint>) {
  let errStr: string;

  if (severity === 'error') errStr = chalk.cyanBright('with ') + chalk.redBright('errors');
  else if (severity === 'warn') errStr = chalk.cyanBright('with ') + chalk.yellowBright('warnings');
  else errStr = chalk.greenBright('successfully');

  return `${chalk.cyanBright(`Linting completed:`)}\n${formatted}`;
}