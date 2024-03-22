import pathlib from 'path'
import fs from 'fs/promises'
import { generate } from 'astring'
import { parse } from 'acorn'
import type { BuildOptions as ESBuildOptions, OutputFile } from 'esbuild';
import type { ArrowFunctionExpression, CallExpression, ExportDefaultDeclaration, Program, VariableDeclaration } from 'estree';
import type { OperationResult } from '../utils';

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
}

export async function outputBundleOrTab({ path, text }: OutputFile, outDir: string): Promise<OperationResult> {
  const [type, name] = path.split(pathlib.sep)
    .slice(-3, -1)
  let file: fs.FileHandle | null = null
  try {
    const parsed = parse(text, { ecmaVersion: 6 }) as unknown as Program

    // Account for 'use strict'; directives
    let declStatement: VariableDeclaration;
    if (parsed.body[0].type === 'VariableDeclaration') {
      declStatement = parsed.body[0];
    } else {
      declStatement = parsed.body[1] as unknown as VariableDeclaration;
    }
    const varDeclarator = declStatement.declarations[0];
    const callExpression = varDeclarator.init as CallExpression;
    const moduleCode = callExpression.callee as ArrowFunctionExpression;

    const output: ExportDefaultDeclaration = {
      type: 'ExportDefaultDeclaration',
      declaration: {
        ...moduleCode,
        params: [{
          type: 'Identifier',
          name: 'require'
        }]
      }
    }

    file = await fs.open(`${outDir}/${type}/${name}.js`, 'w')
    const writeStream = file.createWriteStream()
    generate(output, { output: writeStream })
    return {
      severity: 'success',
      name
    }
  } catch (error) {
    return {
      name,
      severity: 'error',
      error
    }
  } finally {
    await file?.close()
  }
}
