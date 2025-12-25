import fs from 'fs/promises';
import pathlib from 'path';
import type { InputAsset, ResolvedBundle, Severity } from '@sourceacademy/modules-repotools/types';
import { findSeverity } from '@sourceacademy/modules-repotools/utils';
import chalk from 'chalk';
import ts from 'typescript';

type TsconfigResult = {
  severity: 'error';
  error: any;
} | {
  severity: 'error';
  results: ts.Diagnostic[];
} | {
  severity: 'success';
  results: ts.CompilerOptions;
  fileNames: string[];
};

export type TscResult = {
  input: InputAsset;
} & ({
  severity: 'error';
  error: any;
} | {
  severity: Severity;
  results: ts.Diagnostic[];
});

/**
 * Find a tsconfig.json in the given directory, then read and parse it.
 */
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
    const { errors: parseErrors, options: tsconfig, fileNames } = ts.parseJsonConfigFileContent(configJson, ts.sys, srcDir);
    if (parseErrors.length > 0) {
      return {
        severity: 'error',
        results: parseErrors
      };
    }

    return {
      severity: 'success',
      results: tsconfig,
      fileNames
    };
  } catch (error) {
    return {
      severity: 'error',
      error
    };
  }
}

/**
 * Convert a collection of Typescript diagnostics to a Severity
 */
function processDiagnostics(diagnostics: ts.Diagnostic[]) {
  return findSeverity(diagnostics, ({ category }) => {
    switch (category) {
      case ts.DiagnosticCategory.Error:
        return 'error';
      case ts.DiagnosticCategory.Warning:
        return 'warn';
      default:
        return 'success';
    }
  });
}

/**
 * Run tsc but only for typechecking
 */
export async function runTypechecking(input: InputAsset): Promise<TscResult> {
  try {

    const tsconfigRes = await getTsconfig(input.directory);
    if (tsconfigRes.severity === 'error') {
      return {
        ...tsconfigRes,
        input
      };
    }

    const { results: tsconfig, fileNames } = tsconfigRes;
    // tsc instance that only does typechecking
    // Type checking for both tests and source code is performed
    const typecheckProgram = ts.createProgram({
      rootNames: fileNames,
      options: {
        ...tsconfig,
        noEmit: true
      }
    });
    const results = typecheckProgram.emit();
    const diagnostics = ts.getPreEmitDiagnostics(typecheckProgram)
      .concat(results.diagnostics);

    const severity = processDiagnostics(diagnostics);
    return {
      severity,
      input,
      results: diagnostics
    };
  } catch (error) {
    return {
      severity: 'error',
      error,
      input
    };
  }
}

/**
 * Run tsc but for compiling bundles
 */
export async function runTscCompile(input: ResolvedBundle, oldProgram?: ts.Program): Promise<TscResult> {
  try {
    const tsconfigRes = await getTsconfig(input.directory);
    if (tsconfigRes.severity === 'error') {
      return {
        ...tsconfigRes,
        input
      };
    }

    const { results: tsconfig, fileNames } = tsconfigRes;
    const filesWithoutTests = fileNames.filter(p => {
      const segments = p.split(pathlib.posix.sep);
      return !segments.includes('__tests__') && !segments.includes('__mocks__');
    });
    // tsc instance that does compilation
    // only compiles non test files
    const compileProgram = ts.createProgram({
      rootNames: filesWithoutTests,
      options: {
        ...tsconfig,
        noEmit: false
      },
      oldProgram
    });
    compileProgram.emit();

    const results = compileProgram.emit();
    const diagnostics = ts.getPreEmitDiagnostics(compileProgram)
      .concat(results.diagnostics);

    const severity = processDiagnostics(diagnostics);
    return {
      severity,
      input,
      results: diagnostics
    };
  } catch (error) {
    return {
      severity: 'error',
      error,
      input
    };
  }
}

export function formatTscResult(tscResult: TscResult): string {
  const prefix = chalk.cyanBright('tsc completed');

  if (tscResult.severity === 'error' && 'error' in tscResult) {
    return `${prefix} ${chalk.cyanBright('with')} ${chalk.redBright('errors')}: ${tscResult.error}`;
  }

  const diagStr = ts.formatDiagnosticsWithColorAndContext(tscResult.results, {
    getNewLine: () => '\n',
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: name => pathlib.basename(name)
  });

  switch (tscResult.severity) {
    case 'error':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.redBright('errors')}\n${diagStr}`;
    case 'warn':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.yellowBright('warnings')}\n${diagStr}`;
    case 'success':
      return `${prefix} ${chalk.greenBright('successfully')}`;
  }
}
