import { copyFile } from 'fs/promises';
import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { Table } from 'console-table-printer';
import { lintFixOption, lintOption, manifestOption, objectEntries, outDirOption, retrieveBundlesAndTabs, srcDirOption } from '@src/commandUtils';
import { htmlLogger, type buildHtml } from './docs/html';
import prebuild, { formatPrebuildResults } from './prebuild';

export interface BuildInputs {
  bundles?: string[] | null
  tabs?: string[] | null
  modulesSpecified?: boolean
}

export interface BuildOptions {
  srcDir: string
  outDir: string
  manifest: string
  lint?: boolean
  fix?: boolean
  tsc?: boolean
  verbose?: boolean
}

export interface SuccessResult {
  name: string
  severity: 'success',
}

export interface WarnResult {
  name: string,
  severity: 'warn',
  error: any
}

export interface ErrorResult {
  name: string,
  severity: 'error',
  error: any
}

export type OperationResult = ErrorResult | SuccessResult | WarnResult;
export type Severity = OperationResult['severity'];

export const isSuccessResult = (obj: OperationResult): obj is SuccessResult => obj.severity === 'success';
export const isWarnResult = (obj: OperationResult): obj is WarnResult => obj.severity === 'warn';

export function findSeverity<T extends object>(results: T[], mapper?: (item: T) => Severity): Severity {
  let overallSev: Severity = 'success';

  for (const result of results) {
    let severity: Severity;
    if ('severity' in result) {
      severity = result.severity as Severity;
    } else {
      if (!mapper) throw new Error(`Mapping function required to convert ${result} to severity`);
      severity = mapper(result);
    }

    if (severity === 'error') return 'error';
    if (severity === 'warn') {
      overallSev = 'warn';
    }
  }

  return overallSev;
}

export const expandBundleNames = (srcDir: string, bundles: string[]) => bundles.map(bundle => `${srcDir}/bundles/${bundle}/index.ts`);
export const expandTabNames = (srcDir: string, tabNames: string[]) => tabNames.map(tabName => `${srcDir}/tabs/${tabName}/index.tsx`);

export type AwaitedReturn<T> = T extends (...args: any) => Promise<infer U> ? U : never;

export const divideAndRound = (n: number, divisor: number) => (n / divisor).toFixed(2);

type AssetType = 'bundles' | 'jsons' | 'tabs';
type LogType = Partial<Record<AssetType, OperationResult[]> & { html: Awaited<ReturnType<typeof buildHtml>> }>;

export type BuildTask = (inputs: BuildInputs, opts: BuildOptions) => Promise<LogType>;

function processResults(
  results: LogType,
  verbose: boolean
) {
  const notSuccessFilter = (result: OperationResult): result is Exclude<OperationResult, SuccessResult> => result.severity !== 'success';

  const logs = objectEntries(results)
    .map(([label, results]): [Severity, string] => {
      if (label === 'html') {
        return [results.result.severity, htmlLogger(results)];
      }

      const overallSev = findSeverity(results);
      const upperCaseLabel = label[0].toUpperCase() + label.slice(1);
      if (!verbose) {
        if (overallSev === 'success') {
          return ['success', `${chalk.cyanBright(`${upperCaseLabel} built`)} ${chalk.greenBright('successfully')}\n`];
        }
        if (overallSev === 'warn') {
          return ['warn', chalk.cyanBright(`${upperCaseLabel} built with ${chalk.yellowBright('warnings')}:\n${results
            .filter(isWarnResult)
            .map(({ name: bundle, error }, i) => chalk.yellowBright(`${i + 1}. ${bundle}: ${error}`))
            .join('\n')}\n`)];
        }

        return ['error', chalk.cyanBright(`${upperCaseLabel} build ${chalk.redBright('failed')} with errors:\n${results
          .filter(notSuccessFilter)
          .map(({ name: bundle, error, severity }, i) => (severity === 'error'
            ? chalk.redBright(`${i + 1}. Error ${bundle}: ${error}`)
            : chalk.yellowBright(`${i + 1}. Warning ${bundle}: ${error}`)))
          .join('\n')}\n`)];
      }

      const outputTable = new Table({
        columns: [{
          name: 'name',
          title: upperCaseLabel
        },
        {
          name: 'severity',
          title: 'Status'
        },
        {
          name: 'error',
          title: 'Errors'
        }]
      });
      results.forEach(result => {
        if (isWarnResult(result)) {
          outputTable.addRow({
            ...result,
            severity: 'Warning'
          }, { color: 'yellow' });
        } else if (isSuccessResult(result)) {
          outputTable.addRow({
            ...result,
            error: '-',
            severity: 'Success'
          }, { color: 'green' });
        } else {
          outputTable.addRow({
            ...result,
            severity: 'Error'
          }, { color: 'red' });
        }
      });

      if (overallSev === 'success') {
        return ['success', `${chalk.cyanBright(`${upperCaseLabel} built`)} ${chalk.greenBright('successfully')}:\n${outputTable.render()}\n`];
      }
      if (overallSev === 'warn') {
        return ['warn', `${chalk.cyanBright(`${upperCaseLabel} built`)} with ${chalk.yellowBright('warnings')}:\n${outputTable.render()}\n`];
      }
      return ['error', `${chalk.cyanBright(`${upperCaseLabel} build ${chalk.redBright('failed')} with errors`)}:\n${outputTable.render()}\n`];
    });

  console.log(logs.map(x => x[1])
    .join('\n'));

  const overallOverallSev = findSeverity(logs, ([sev]) => sev);
  if (overallOverallSev === 'error') {
    process.exit(1);
  }
}

export function logInputs(
  { bundles, tabs }: BuildInputs,
  { tsc, lint }: Partial<Record<'lint' | 'tsc', boolean>>,
  ignore?: 'bundles' | 'tabs'
) {
  const output: string[] = [];
  if (tsc) {
    output.push(chalk.yellowBright('--tsc specified, will run typescript checker'));
  }

  if (lint) {
    output.push(chalk.yellowBright('Linting specified, will run ESlint'));
  }

  if (bundles.length > 0 && ignore !== 'bundles') {
    output.push(chalk.magentaBright('Processing the following bundles:'));
    bundles.forEach((bundle, i) => output.push(`${i + 1}. ${bundle}`));
  }

  if (tabs.length > 0 && ignore !== 'tabs') {
    output.push(chalk.magentaBright('Processing the following tabs:'));
    tabs.forEach((tab, i) => output.push(`${i + 1}. ${tab}`));
  }

  return output.join('\n');
}

export function createBuildCommandHandler(func: BuildTask, ignore?: 'bundles' | 'tabs') {
  return async (
    opts: BuildOptions & { bundles: string[] | null, tabs: string[] | null }
  ) => {
    const inputs = await retrieveBundlesAndTabs(opts, ignore === undefined);

    if (ignore) {
      inputs[ignore] = [];
    }

    console.log(logInputs(inputs, opts, ignore));
    const prebuildResult = await prebuild(inputs.bundles, inputs.tabs, opts);

    if (prebuildResult !== null) {
      const prebuildResultFormatted = formatPrebuildResults(prebuildResult);
      console.log(prebuildResultFormatted);

      if (prebuildResult.severity === 'error') process.exit(1);
    }

    const result = await func(inputs, opts);
    processResults(result, opts.verbose);
    await copyFile(opts.manifest, `${opts.outDir}/modules.json`);
  };
}

export function createBuildCommand(
  commandName: string,
  description: string
) {
  return new Command(commandName)
    .description(description)
    .addOption(srcDirOption)
    .addOption(outDirOption)
    .addOption(lintOption)
    .addOption(lintFixOption)
    .addOption(manifestOption)
    .option('--tsc', 'Run tsc before building');
}
