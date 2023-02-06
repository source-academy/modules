import chalk from 'chalk';
import { Command } from 'commander';
import { existsSync, promises as fs } from 'fs';
import pathlib from 'path';
import ts, { type CompilerOptions } from 'typescript';

import { printList, wrapWithTimer } from '../../scriptUtils.js';
import { bundleNameExpander, divideAndRound, retrieveBundlesAndTabs, tabNameExpander } from '../buildUtils.js';
import type { AssetInfo, CommandInputs, Severity } from '../types.js';

type TscResult = {
  severity: Severity,
  results: ts.Diagnostic[];
  error?: any;
};

export type TscOpts = {
  srcDir: string;
};

type TsconfigResult = {
  severity: 'error';
  error?: any;
  results: ts.Diagnostic[];
} | {
  severity: 'success';
  results: CompilerOptions;
};

const getTsconfig = async (srcDir: string): Promise<TsconfigResult> => {
  // Step 1: Read the text from tsconfig.json
  const tsconfigLocation = pathlib.join(srcDir, 'tsconfig.json');
  if (!existsSync(tsconfigLocation)) {
    return {
      severity: 'error',
      results: [],
      error: `Could not locate tsconfig.json at ${tsconfigLocation}`,
    };
  }
  const configText = await fs.readFile(tsconfigLocation, 'utf-8');

  // Step 2: Parse the raw text into a json object
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

  return {
    severity: 'success',
    results: tsconfig,
  };
};

/**
 * @param params_0 Source Directory
 */
export const runTsc = wrapWithTimer((async (srcDir: string, { bundles, tabs }: Omit<AssetInfo, 'modulesSpecified'>): Promise<TscResult> => {
  const fileNames: string[] = [];

  if (bundles.length > 0) {
    printList(`${chalk.magentaBright('Running tsc on the following bundles')}:\n`, bundles);
    bundles.forEach((bundle) => fileNames.push(bundleNameExpander(srcDir)(bundle)));
  }

  if (tabs.length > 0) {
    printList(`${chalk.magentaBright('Running tsc on the following tabs')}:\n`, tabs);
    tabs.forEach((tabName) => fileNames.push(tabNameExpander(srcDir)(tabName)));
  }

  const tsconfigRes = await getTsconfig(srcDir);
  if (tsconfigRes.severity === 'error') {
    return {
      severity: 'error',
      results: tsconfigRes.results,
    };
  }

  const tsc = ts.createProgram(fileNames, tsconfigRes.results);
  const results = tsc.emit();

  return {
    severity: 'success',
    results: ts.getPreEmitDiagnostics(tsc)
      .concat(results.diagnostics),
  };
}));

export const logTscResults = (input: Awaited<ReturnType<typeof runTsc>> | null, srcDir: string) => {
  if (!input) return;

  const { elapsed, result: { severity, results, error } } = input;
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
};

export type TscCommandInputs = CommandInputs;

export const tscCommand = new Command('typecheck')
  .description('Run tsc to perform type checking')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('-m, --modules [modules...]', 'Manually specify which modules to check', null)
  .option('-t, --tabs [tabs...]', 'Manually specify which tabs to check', null)
  .option('-v, --verbose', 'Display more information about the build results', false)
  .action(async ({ modules, tabs, manifest, srcDir }: TscCommandInputs) => {
    const assets = await retrieveBundlesAndTabs(manifest, modules, tabs);
    const tscResults = await runTsc(srcDir, assets);
    logTscResults(tscResults, srcDir);
  });
