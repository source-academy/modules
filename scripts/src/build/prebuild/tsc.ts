import fs from 'fs/promises';
import pathlib from 'path';
import chalk from 'chalk';
import ts from 'typescript';
import { retrieveBundlesAndTabs, wrapWithTimer } from '@src/commandUtils';
import { expandBundleNames, expandTabNames, divideAndRound, type AwaitedReturn } from '../utils';
import { createPrebuildCommand, createPrebuildCommandHandler, type PrebuildOptions } from './utils';

type TsconfigResult = {
  severity: 'error';
  results?: ts.Diagnostic[];
  error?: any;
} | {
  severity: 'success';
  results: ts.CompilerOptions;
};

type TscResult = {
  severity: 'error';
  results?: ts.Diagnostic[];
  error?: any;
} | {
  severity: 'success';
  results: ts.Diagnostic[];
};

async function getTsconfig(srcDir: string): Promise<TsconfigResult> {
  // Step 1: Read the text from tsconfig.json
  const tsconfigLocation = pathlib.join(srcDir, 'tsconfig.json');
  try {
    const configText = await fs.readFile(tsconfigLocation, 'utf-8');

    // Step 2: Parse the raw text into a json object
    const { error: configJsonError, config: configJson } = ts.parseConfigFileTextToJson(tsconfigLocation, configText);
    if (configJsonError) {
      return {
        severity: 'error',
        results: [configJsonError]
      };
    }

    // Step 3: Parse the json object into a config object for use by tsc
    const { errors: parseErrors, options: tsconfig } = ts.parseJsonConfigFileContent(configJson, ts.sys, srcDir);
    if (parseErrors.length > 0) {
      return {
        severity: 'error',
        results: parseErrors
      };
    }

    return {
      severity: 'success',
      results: tsconfig
    };
  } catch (error) {
    return {
      severity: 'error',
      error
    };
  }
}

export const runTsc = wrapWithTimer(async ({ bundles, tabs, srcDir }: Omit<PrebuildOptions, 'manifest'>): Promise<TscResult> => {
  const tsconfigRes = await getTsconfig(srcDir);
  if (tsconfigRes.severity === 'error') {
    return tsconfigRes;
  }

  const fileNames: string[] = [];

  if (bundles.length > 0) {
    expandBundleNames(srcDir, bundles)
      .forEach(name => fileNames.push(name));
  }

  if (tabs.length > 0) {
    expandTabNames(srcDir, tabs)
      .forEach(name => fileNames.push(name));
  }

  try {
    const tsc = ts.createProgram(fileNames, tsconfigRes.results);
    const results = tsc.emit();
    const diagnostics = ts.getPreEmitDiagnostics(tsc)
      .concat(results.diagnostics);

    return {
      severity: diagnostics.length > 0 ? 'error' : 'success',
      results: diagnostics
    };
  } catch (error) {
    return {
      severity: 'error',
      error
    };
  }
});

export function tscResultsLogger({ elapsed, result: tscResult }: AwaitedReturn<typeof runTsc>) {
  if (tscResult.severity === 'error' && tscResult.error) {
    return `${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')} in ${divideAndRound(elapsed, 1000)}s: ${tscResult.error}`)}`;
  }

  const diagStr = ts.formatDiagnosticsWithColorAndContext(tscResult.results, {
    getNewLine: () => '\n',
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: name => pathlib.basename(name)
  });

  if (tscResult.severity === 'error') {
    return `${diagStr}\n${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')} in ${divideAndRound(elapsed, 1000)}s`)}`;
  }
  return `${diagStr}\n${chalk.cyanBright(`tsc completed ${chalk.greenBright('successfully')} in ${divideAndRound(elapsed, 1000)}s`)}`;
}

const tscCommandHandler = createPrebuildCommandHandler(
  (...args) => runTsc(...args),
  tscResultsLogger
);

export const getTscCommand = () => createPrebuildCommand('tsc', 'Run the typescript compiler to perform type checking')
  .action(async opts => {
    const inputs = await retrieveBundlesAndTabs(opts.manifest, opts.bundles, opts.tabs, true);
    await tscCommandHandler({ ...opts, ...inputs });
  });
