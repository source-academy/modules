import fs from 'fs/promises';
import { parse } from 'acorn';
import { generate } from 'astring';
import type { BuildOptions as ESBuildOptions, OutputFile } from 'esbuild';
import type es from 'estree';
import type { BundleResultEntry, TabResultEntry } from '../../types.js';
import type { Severity } from '../../utils.js';

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

export async function outputBundleOrTab({ text }: OutputFile, name: string, type: 'bundle', outDir: string): Promise<BundleResultEntry>;
export async function outputBundleOrTab({ text }: OutputFile, name: string, type: 'tab', outDir: string): Promise<TabResultEntry>;
export async function outputBundleOrTab({ text }: OutputFile, name: string, type: 'bundle' | 'tab', outDir: string): Promise<BundleResultEntry | TabResultEntry> {
  const createEntry = (severity: Severity, message: string): BundleResultEntry | TabResultEntry => ({
    severity,
    message,
    assetType: type,
    inputName: name
  });

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
    return createEntry(
      'error',
      `parse failure: Expected a CallExpression, got ${callExpression?.type ?? callExpression}`,
    );
  }

  const moduleCode = callExpression.callee;

  if (moduleCode.type !== 'FunctionExpression' && moduleCode.type !== 'ArrowFunctionExpression') {
    return createEntry('error',`${type} ${name} parse failure: Expected a function, got ${moduleCode.type}`);
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
    const outPath = `${outDir}/${type}s/${name}.js`;
    file = await fs.open(outPath, 'w');
    const writeStream = file.createWriteStream();
    generate(output, { output: writeStream });

    return createEntry('success', `${type} written to ${outPath}`);
  } finally {
    await file?.close();
  }
}
