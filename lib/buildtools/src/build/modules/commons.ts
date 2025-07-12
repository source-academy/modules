import fs from 'fs/promises';
import { parse } from 'acorn';
import { generate } from 'astring';
import type { BuildOptions as ESBuildOptions, OutputFile } from 'esbuild';
import type es from 'estree';
import { Severity, type BuildResult, type InputAsset } from '../../types.js';

// The region tag is used in the developer documentation. DON'T REMOVE
// #region esbuildOptions
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
// #endregion esbuildOptions

/**
 * Write the compiled output from ESBuild to the file system after performing AST transformation
 */
export async function outputBundleOrTab({ text }: OutputFile, input: InputAsset, outDir: string): Promise<BuildResult> {
  const parsed = parse(text, { ecmaVersion: 6 }) as es.Program;

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
      type: input.type,
      severity: Severity.ERROR,
      input,
      errors: [`parse failure: Expected a CallExpression, got ${callExpression?.type ?? callExpression}`]
    } as BuildResult;
  }

  const moduleCode = callExpression.callee;

  if (moduleCode.type !== 'FunctionExpression' && moduleCode.type !== 'ArrowFunctionExpression') {
    return {
      type: input.type,
      severity: Severity.ERROR,
      input,
      errors: [`${input.type} ${input.name} parse failure: Expected a function, got ${moduleCode.type}`]
    } as BuildResult;
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

  const outputDirectory = `${outDir}/${input.type}s`;
  await fs.mkdir(outputDirectory, { recursive: true });

  let file: fs.FileHandle | null = null;
  const outpath = `${outputDirectory}/${input.name}.js`;

  try {
    file = await fs.open(outpath, 'w');
    const writeStream = file.createWriteStream();
    generate(output, { output: writeStream });

    return {
      type: input.type,
      severity: Severity.SUCCESS,
      input,
      path: outpath
    } as BuildResult;
  } finally {
    await file?.close();
  }
}
