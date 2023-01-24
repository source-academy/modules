import chalk from 'chalk';
import { Command } from 'commander';
import { existsSync, promises as fs } from 'fs';
import pathlib from 'path';
import ts from 'typescript';

import { wrapWithTimer } from '../../scriptUtils.js';
import { createLogger, divideAndRound, expandBundleName, expandTabName, retrieveBundlesAndTabs } from '../buildUtils.js';
import type { CommandHandler, CommandInputs, OverallResult, Severity } from '../types.js';

type TscResult = {
  severity: Severity,
  results: ts.Diagnostic[];
  error?: any;
};

export type TscOpts = Omit<CommandInputs, 'outDir' | 'modulesSpecified' | 'verbose' | 'manifest'>;

/**
 * @param bundles Bundles to run tsc over
 * @param tabs Tabs to run tsc over
 */
export const runTsc = wrapWithTimer((async ({ srcDir }, { bundles, tabs }): Promise<TscResult> => {
  const fileNames: string[] = [];

  if (bundles.length > 0) {
    console.log(`${chalk.magentaBright('Running tsc on the following bundles')}:\n${
      bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')
    }`);

    bundles.forEach((bundle) => fileNames.push(expandBundleName(srcDir)(bundle)));
  }

  if (tabs.length > 0) {
    console.log(`${chalk.magentaBright('Running tsc on the following tabs')}:\n${
      tabs.map((tabName, i) => `${i + 1}. ${tabName}`)
        .join('\n')
    }`);

    tabs.forEach((tabName) => fileNames.push(expandTabName(srcDir)(tabName)));
  }

  // Step 1: Read the text from tsconfig.json
  const tsconfigLocation = pathlib.join(srcDir, 'tsconfig.json');
  if (!existsSync(tsconfigLocation)) {
    return {
      severity: 'error',
      results: [],
      error: `Could not locate tsconfig.json at ${tsconfigLocation}`,
    };
  }

  // Step 2: Parse the raw text into a json object
  const configText = await fs.readFile(tsconfigLocation, 'utf-8');
  const { error: configJsonError, config: configJson } = ts.parseConfigFileTextToJson(tsconfigLocation, configText);
  if (configJsonError) {
    return {
      severity: 'error',
      results: [configJsonError],
    };
  }

  // Step 3: Parse the json object into a config object for use by tsc
  const { errors: parseErrors, options: tsconfig } = ts.parseJsonConfigFileContent(configJson, ts.sys, srcDir);
  if (parseErrors.length > 0) {
    return {
      severity: 'error',
      results: parseErrors,
    };
  }

  const tsc = ts.createProgram(fileNames, tsconfig);
  const results = tsc.emit();

  return {
    severity: 'success',
    results: ts.getPreEmitDiagnostics(tsc)
      .concat(results.diagnostics),
  };
}) as CommandHandler<TscOpts, OverallResult<ts.Diagnostic[]>>);

export const logTscResults = createLogger(({ elapsed, result: { severity, results, error } }: Awaited<ReturnType<typeof runTsc>>, srcDir: string) => {
  if (error) {
    console.log(`${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')}:`)} ${error}`);
    return;
  }

  const diagStr = ts.formatDiagnosticsWithColorAndContext(results, {
    getNewLine: () => '\n',
    getCurrentDirectory: () => srcDir,
    getCanonicalFileName: (name) => pathlib.basename(name),
  });

  if (severity === 'error') {
    console.log(`${diagStr}\n${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')} in ${divideAndRound(elapsed, 1000)}s`)}`);
  } else {
    console.log(`${diagStr}\n${chalk.cyanBright(`tsc completed ${chalk.greenBright('successfully')} in ${divideAndRound(elapsed, 1000)}s`)}`);
  }
});

export type TscCommandInputs = CommandInputs;

export const tscCommand = new Command('typecheck')
  .description('Run tsc to perform type checking')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('-m, --modules [modules...]', 'Manually specify which modules to check')
  .option('-t, --tabs [tabs...]', 'Manually specify which tabs to check')
  .action(async ({ modules, tabs, manifest, ...opts }: TscCommandInputs) => {
    const assets = await retrieveBundlesAndTabs(manifest, modules, tabs);
    const tscResults = await runTsc(opts, assets);
    logTscResults(tscResults, opts.srcDir);
  });
