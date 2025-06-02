import fs from 'fs/promises';
import { parse } from 'acorn';
import { generate } from 'astring';
import type { BuildOptions as ESBuildOptions, OutputFile } from 'esbuild';
import type es from 'estree';
import type { BuildResult } from '../../utils';

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

export async function outputBundleOrTab({ text }: OutputFile, name: string, type: 'bundle' | 'tab', outDir: string): Promise<BuildResult> {
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
      severity: 'error',
      warnings: [],
      errors: [`${type} ${name} parse failure: Expected a CallExpression, got ${callExpression?.type ?? callExpression}`],
    };
  }

  const moduleCode = callExpression.callee;

  if (moduleCode.type !== 'FunctionExpression' && moduleCode.type !== 'ArrowFunctionExpression') {
    return {
      severity: 'error',
      warnings: [],
      errors: [`${type} ${name} parse failure: Expected a function, got ${moduleCode.type}`]
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

  await fs.mkdir(`${outDir}/${type}s`, { recursive: true });
  let file: fs.FileHandle | null = null;
  try {
    file = await fs.open(`${outDir}/${type}s/${name}.js`, 'w');
    const writeStream = file.createWriteStream();
    generate(output, { output: writeStream });

    return {
      severity: 'success',
      warnings: [],
      errors: []
    };
  } finally {
    await file?.close();
  }
}
