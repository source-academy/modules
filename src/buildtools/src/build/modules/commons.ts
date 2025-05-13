import fs from 'fs/promises';
import pathlib from 'path';
import { parse } from 'acorn';
import { generate } from 'astring';
import type { BuildOptions as ESBuildOptions, OutputFile } from 'esbuild';
import type es from 'estree';

export const commonEsbuildOptions: ESBuildOptions = {
  bundle: true,
  format: 'iife',
  define: {
    process: JSON.stringify({
      env: {
        NODE_ENV: 'production'
      }
    })
  },
  external: ['js-slang*'],
  globalName: 'module',
  platform: 'browser',
  target: 'es6',
  write: false
};

export async function outputBundleOrTab({ path, text }: OutputFile, outDir: string) {
  const [, type, name] = path.split(pathlib.posix.sep)
  const parsed = parse(text, { ecmaVersion: 6 }) as es.Program;

  // Account for 'use strict'; directives
  let declStatement: es.VariableDeclaration;
  if (parsed.body[0].type === 'VariableDeclaration') {
    declStatement = parsed.body[0];
  } else {
    declStatement = parsed.body[1] as es.VariableDeclaration;
  }

  const { init: callExpression } = declStatement.declarations[0];
  if (callExpression.type !== 'CallExpression') {
    throw new Error(`Expected a CallExpression, got ${callExpression.type}`);
  }

  const moduleCode = callExpression.callee;

  if (moduleCode.type !== 'FunctionExpression' && moduleCode.type !== 'ArrowFunctionExpression') {
    throw new Error(`Expected a function, got ${moduleCode.type}`);
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

  await fs.mkdir(`${outDir}/${type}`, { recursive: true })
  const file = await fs.open(`${outDir}/${type}/${name}.js`, 'w');
  const writeStream = file.createWriteStream();
  generate(output, { output: writeStream });
}
