import fs from 'fs/promises'
import pathlib from 'path'
import ts from 'typescript'

type TsconfigResult = {
  severity: 'error',
  results?: ts.Diagnostic[]
  error?: any
} | {
  severity: 'success',
  results: ts.CompilerOptions
};

type TscResult = {
  severity: 'error'
  results?: ts.Diagnostic[]
  error?: any
} | {
  severity: 'success',
  results: ts.Diagnostic[]
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

export async function runTsc(srcDir: string): Promise<TscResult> {
  const tsconfigRes = await getTsconfig(srcDir);
  if (tsconfigRes.severity === 'error') {
    return tsconfigRes;
  }

  try {
    const tsc = ts.createProgram([], tsconfigRes.results);
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
}
