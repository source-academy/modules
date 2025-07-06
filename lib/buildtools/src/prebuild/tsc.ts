import fs from 'fs/promises';
import pathlib from 'path';
import chalk from 'chalk';
import ts from 'typescript';
import type { ResolvedBundle, ResolvedTab } from '../types.js';
import { findSeverity, type Severity } from '../utils.js';
import { createPrebuilder } from './prebuildUtils.js';

type TsconfigResult = {
  severity: 'error',
  error: any
} | {
  severity: 'error',
  results: ts.Diagnostic[]
} | {
  severity: 'success',
  results: ts.CompilerOptions
  fileNames: string[]
};

export type TscResult = {
  input: ResolvedBundle | ResolvedTab
} & ({
  severity: Extract<Severity, 'error'>
  error: any
} | {
  severity: Severity
  results: ts.Diagnostic[]
});

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

export const {
  builder: runTsc,
  formatter: formatTscResult
} = createPrebuilder<TscResult, [noEmit: boolean]>(async (input, noEmit) => {
  const tsconfigRes = await getTsconfig(input.directory);
  if (tsconfigRes.severity === 'error') {
    return {
      ...tsconfigRes,
      input
    };
  }

  const { results: tsconfig, fileNames } = tsconfigRes;

  try {
    const typecheckProgram = ts.createProgram({
      rootNames: fileNames,
      options: {
        ...tsconfig,
        noEmit: true
      }});
    const results = typecheckProgram.emit();
    const diagnostics = ts.getPreEmitDiagnostics(typecheckProgram)
      .concat(results.diagnostics);

    const severity = findSeverity(diagnostics, ({ category }) => {
      switch (category) {
        case ts.DiagnosticCategory.Error:
          return 'error';
        case ts.DiagnosticCategory.Warning:
          return 'warn';
        default:
          return 'success';
      }
    });

    noEmit = tsconfig.noEmit || noEmit;
    if (severity !== 'error' && !noEmit) {
      // If noEmit isn't specified, then run tsc again without including test
      // files and actually output the files
      const filesWithoutTests = fileNames.filter(p => {
        const segments = p.split(pathlib.sep);
        return !segments.includes('__tests__');
      });
      const compileProgram = ts.createProgram({
        rootNames: filesWithoutTests,
        options: tsconfig,
        oldProgram: typecheckProgram
      });
      compileProgram.emit();
    }

    return {
      severity,
      results: diagnostics,
      input
    };
  } catch (error) {
    return {
      severity: 'error',
      input,
      error
    };
  }
}, tscResult => {
  const prefix = `${chalk.blueBright(`[${tscResult.input.type} ${tscResult.input.name}]`)}: ${chalk.cyanBright('tsc completed')}`;
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
});
