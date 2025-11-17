import fs from 'fs/promises';
import pathlib from 'path';
import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import type { BuildOptions as ESBuildOptions, OutputFile, Plugin as ESBuildPlugin } from 'esbuild';
import type es from 'estree';
import type { BuildDiagnostic, DiagnosticWithoutWarn } from '../../types.js';
import type { InputAsset } from '../../types.js';

export const commonEsbuildOptions = {
  bundle: true,
  format: 'iife',
  define: {
    process: JSON.stringify({
      env: {
        NODE_ENV: 'production'
      },
    }),
    global: 'globalThis'
  },
  external: ['js-slang*'],
  globalName: 'module',
  platform: 'browser',
  target: 'es6',
  write: false
} satisfies ESBuildOptions;

type ConvertAstDiagnostic = DiagnosticWithoutWarn<{ output: es.Node }, { error: string }>;

function convertAst(parsed: es.Program): ConvertAstDiagnostic {
  // Account for 'use strict'; directives
  let declStatement: es.VariableDeclaration;
  if (parsed.body[0].type === 'VariableDeclaration') {
    declStatement = parsed.body[0];
  } else {
    declStatement = parsed.body[1] as es.VariableDeclaration;
  }

  const { init: callExpression } = declStatement.declarations[0];
  if (callExpression?.type !== 'CallExpression') {
    return {
      severity: 'error',
      error: `parse failure: Expected a CallExpression, got ${callExpression?.type ?? callExpression}`
    };
  }

  const moduleCode = callExpression.callee;

  if (moduleCode.type !== 'FunctionExpression' && moduleCode.type !== 'ArrowFunctionExpression') {
    return {
      severity: 'error',
      error: `parse failure: Expected a function, got ${moduleCode.type}`,
    };
  }

  const output: es.ExportDefaultDeclaration = {
    type: 'ExportDefaultDeclaration',
    declaration: {
      ...moduleCode,
      params: [{
        type: 'Identifier',
        name: 'require'
      }]
    }
  };

  return {
    severity: 'success',
    output
  };
}

/**
 * Write the compiled output from ESBuild to the file system after performing AST transformation
 */
export async function outputBundleOrTab({ text }: OutputFile, input: InputAsset, outDir: string): Promise<BuildDiagnostic> {
  const parsed = parse(text, { ecmaVersion: 6 }) as es.Program;

  const astResult = convertAst(parsed);
  if (astResult.severity === 'error') {
    return {
      severity: 'error',
      error: `${input.type} ${input.name} ${astResult.error}`,
      input
    };
  }

  const { output } = astResult;
  const outputDirectory = pathlib.join(outDir, `${input.type}s`);
  await fs.mkdir(outputDirectory, { recursive: true });

  let file: fs.FileHandle | null = null;
  const outpath = pathlib.join(outputDirectory, `${input.name}.js`);

  try {
    file = await fs.open(outpath, 'w');
    const writeStream = file.createWriteStream();
    generate(output, { output: writeStream });

    return {
      severity: 'success',
      input,
      outpath
    };
  } finally {
    await file?.close();
  }
}

/**
 * The output step for bundles and tabs, but as an esbuild plugin that can be used
 * with watch mode
 */
export function builderPlugin(input: InputAsset, outDir: string): ESBuildPlugin {
  return {
    name: 'Builder Plugin',
    async setup({ initialOptions, onEnd }) {
      if (initialOptions.write !== false) {
        throw new Error('Plugin must be used with write: false');
      }

      const outpath = pathlib.join(outDir, `${input.name}.js`);
      const file = await fs.open(outpath, 'w');
      const writeStream = file.createWriteStream();

      onEnd(result => {
        const [{ text }] = result.outputFiles!;
        const parsed = parse(text, { ecmaVersion: 6 }) as es.Program;
        const astResult = convertAst(parsed);
        if (astResult.severity === 'success') {
          generate(astResult.output, { output: writeStream });
        } else {
          console.error(chalk.redBright(astResult.error));
        }
      });
    }
  };
}
