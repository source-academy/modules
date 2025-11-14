import fs from 'fs/promises';
import pathlib from 'path';
import chalk from 'chalk';
import ts from 'typescript';
import { findSeverity } from './utils.js';

type FormattableTscResult<TSuccess extends object = object> = {
  severity: 'error';
  error: any;
} | {
  severity: 'error';
  results: ts.Diagnostic[];
} | ({
  severity: 'success' | 'warn';
  results: ts.Diagnostic[];
} & TSuccess);

function getDiagnosticSeverity(diagnostics: ts.Diagnostic[]) {
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
 * Result of trying to resolve a tsconfig file and its options
 */
export type TsconfigResult = FormattableTscResult<{ fileNames: string[], tsconfig: ts.CompilerOptions }>;

export async function getTsconfig(srcDir: string): Promise<TsconfigResult> {
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
      results: [],
      tsconfig,
      fileNames
    };
  } catch (error) {
    return {
      severity: 'error',
      error
    };
  }
}

export type TypecheckResult = FormattableTscResult<{ program: ts.Program }>;

/**
 * Run the Typescript compiler only for type checking
 */
export function runTypechecking(tsconfig: ts.CompilerOptions, fileNames: string[]): TypecheckResult {
  const typecheckProgram = ts.createProgram({
    rootNames: fileNames,
    options: {
      ...tsconfig,
      // Insist that we do not emit anything
      noEmit: true
    }
  });
  const results = typecheckProgram.emit();
  const diagnostics = ts.getPreEmitDiagnostics(typecheckProgram)
    .concat(results.diagnostics);

  const severity = getDiagnosticSeverity(diagnostics);

  if (severity === 'error') {
    return { severity, results: diagnostics };
  }

  return {
    severity,
    results: diagnostics,
    program: typecheckProgram
  };
}

/**
 * Run the Typescript compiler but for producing Javascript files from Typescript
 */
export function runTscCompile(tsconfig: ts.CompilerOptions, fileNames: string[], program?: ts.Program) {
  const filesWithoutTests = fileNames.filter(p => {
    const segments = p.split(pathlib.posix.sep);
    return !segments.includes('__tests__');
  });

  // tsc instance that does compilation
  // only compiles non test files
  const compileProgram = ts.createProgram({
    rootNames: filesWithoutTests,
    options: {
      ...tsconfig,
      // Insist that we emit files
      noEmit: false
    },
    oldProgram: program
  });

  const { diagnostics } = compileProgram.emit();
  const compileSeverity = getDiagnosticSeverity(diagnostics as ts.Diagnostic[]);

  return {
    severity: compileSeverity,
    results: diagnostics as ts.Diagnostic[]
  };
}

/**
 * Wrapper for running the tsc functions that also resolves the tsconfig
 */
async function runWithTsconfig<T>(
  srcDir: string,
  func: (tsconfig: ts.CompilerOptions, fileNames: string[]) => T,
) {
  const tsconfigResult = await getTsconfig(srcDir);
  if (tsconfigResult.severity === 'error') {
    return tsconfigResult;
  }

  const { tsconfig, fileNames } = tsconfigResult;
  return func(tsconfig, fileNames);
}

export function runTypecheckingFromTsconfig(directory: string) {
  return runWithTsconfig(directory, runTypechecking);
}

export function runTscCompileFromTsconfig(directory: string) {
  return runWithTsconfig(directory, runTscCompile);
}

export function formatTscResult(tscResult: FormattableTscResult): string {
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
