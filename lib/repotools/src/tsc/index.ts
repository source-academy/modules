import pathlib from 'path';
import ts from 'typescript';
import type { FormattableTscResult } from './types.js';
import { getDiagnosticSeverity, runWithTsconfig } from './utils.js';

export type TypecheckResult = FormattableTscResult<{ program: ts.Program }>;

/**
 * Run the Typescript compiler only for type checking
 */
export function runTypechecking(tsconfig: ts.CompilerOptions, fileNames: string[]): TypecheckResult {
  const typecheckProgram = ts.createProgram(
    fileNames,
    {
      ...tsconfig,
      // Insist that we do not emit anything
      noEmit: true
    }
  );
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
  const compileProgram = ts.createProgram(filesWithoutTests, {
    ...tsconfig,
    // Insist that we emit files
    noEmit: false
  }, undefined, program);

  const { diagnostics } = compileProgram.emit();
  const compileSeverity = getDiagnosticSeverity(diagnostics as ts.Diagnostic[]);

  return {
    severity: compileSeverity,
    results: diagnostics as ts.Diagnostic[]
  };
}

export function runTypecheckingFromTsconfig(directory: string) {
  return runWithTsconfig(directory, runTypechecking);
}

export function runTscCompileFromTsconfig(directory: string) {
  return runWithTsconfig(directory, runTscCompile, true);
}

export * from './types.js';
export * from './utils.js';
