import pathlib from 'path';
import partition from 'lodash/partition.js';
import ts from 'typescript';
import { findSeverity } from '../../utils.js';
import type { FormattableTscResult } from './types.js';
import { convertTsDiagnostic, getDiagnosticSeverity, runWithTsconfig } from './utils.js';

/**
 * Represents the result of running the typecheck operation
 */
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
    .concat(results.diagnostics)
    .map(convertTsDiagnostic);

  const [errDiags, nonErrDiags] = partition(diagnostics, each => each.severity === 'error');
  if (errDiags.length > 0) {
    return { severity: 'error', diagnostics };
  }

  const severity = findSeverity(nonErrDiags);

  return {
    severity,
    diagnostics: nonErrDiags,
    program: typecheckProgram
  };
}

export type TscCompileResult = FormattableTscResult;

/**
 * Run the Typescript compiler but for producing Javascript files from Typescript
 */
export function runTscCompile(tsconfig: ts.CompilerOptions, fileNames: string[], program?: ts.Program): TscCompileResult {
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
    // @ts-expect-error Typescript can't narrow the types properly
    diagnostics: diagnostics.map(convertTsDiagnostic)
  };
}

/**
 * Run the typescript compiler for typechecking at the given directory
 */
export function runTypecheckingFromTsconfig(directory: string) {
  return runWithTsconfig(directory, runTypechecking);
}

/**
 * Run the typescript compiler to convert Typescript into Javascript and
 * Typescript declaration files for the bundle at the given directory
 */
export function runTscCompileFromTsconfig(directory: string) {
  return runWithTsconfig(directory, runTscCompile, true);
}

export * from './types.js';
export * from './utils.js';
