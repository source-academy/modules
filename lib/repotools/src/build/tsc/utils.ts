import fs from 'fs/promises';
import pathlib from 'path';
import ts from 'typescript';
import { resolveSingleBundle } from '../../manifest.js';
import type { ResultType } from '../../types.js';
import { findSeverity } from '../../utils.js';
import type { FormattableTscResult, TSDiagnostic } from './types.js';

export function getDiagnosticSeverity(diagnostics: ts.Diagnostic[]) {
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

export function convertTsDiagnostic(diagnostic: ts.Diagnostic): TSDiagnostic {
  switch (diagnostic.category) {
    case ts.DiagnosticCategory.Error:
      return {
        severity: 'error',
        ...diagnostic,
      };
    case ts.DiagnosticCategory.Warning:
      return {
        severity: 'warn',
        ...diagnostic
      };
    default:
      return {
        severity: 'success',
        ...diagnostic
      };
  }
}

/**
 * Wrapper for running the tsc functions that also resolves the tsconfig
 */
export async function runWithTsconfig<T extends ResultType<any, any, any>>(
  srcDir: string,
  func: (tsconfig: ts.CompilerOptions, fileNames: string[]) => T,
  requireBundle?: boolean
) {
  if (requireBundle) {
    const resolveResult = await resolveSingleBundle(srcDir);
    if (resolveResult === undefined) {
      return {
        severity: 'error',
        diagnostics: [{
          severity: 'error',
          error: `${func.name} can only be used with bundles!`
        }]
      };
    }

    if (resolveResult.severity === 'error') return resolveResult;
  }

  const tsconfigResult = await getTsconfig(srcDir);
  if (tsconfigResult.severity === 'error') {
    return tsconfigResult;
  }

  const { tsconfig, fileNames } = tsconfigResult;
  return func(tsconfig, fileNames);
}

/**
 * Result of trying to resolve a tsconfig file and its options
 */
export type TsconfigResult = FormattableTscResult<{ fileNames: string[], tsconfig: ts.CompilerOptions }>;

/**
 * Load and resolves the tsconfig at the given directory
 */
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
        diagnostics: [convertTsDiagnostic(configJsonError)]
      };
    }

    // Step 3: Parse the json object into a config object for use by tsc
    const { errors: parseErrors, options: tsconfig, fileNames } = ts.parseJsonConfigFileContent(configJson, ts.sys, srcDir);
    if (parseErrors.length > 0) {
      return {
        severity: 'error',
        diagnostics: parseErrors.map(convertTsDiagnostic)
      };
    }

    return {
      severity: 'success',
      tsconfig,
      fileNames
    };
  } catch (error) {
    return {
      severity: 'error',
      diagnostics: [{
        severity: 'error',
        errors: [`Error while reading ${srcDir}/tsconfig.json: ${error}`]
      }]
    };
  }
}
