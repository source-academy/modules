import fs from 'fs/promises';
import pathlib from 'path';
import { bundlesDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { BuildResult, InputAsset } from '@sourceacademy/modules-repotools/types';
import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import type { BuildOptions as ESBuildOptions, OutputFile, Plugin as ESBuildPlugin } from 'esbuild';
import type es from 'estree';

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
 * Returns an ESBuild plugin that enforces that only
 * the current bundle can import 'js-slang/context'
 */
export function getBundleContextPlugin(currentBundle: string) {
  return {
    name: 'context-plugin',
    setup({ onResolve }) {
      onResolve({ filter: /js-slang\/context/ }, args => {
        const relpath = pathlib.relative(bundlesDir, args.importer);

        if (relpath.startsWith('..')) {
          return {
            errors: [{
              text: 'js-slang/context can only be imported by bundles.'
            }]
          };
        }

        const [importerBundle] = relpath.split(pathlib.sep);
        if (importerBundle !== currentBundle) {
          return {
            errors: [{
              text: `Bundle "${importerBundle}" is attempting to import js-slang/context via bundle "${currentBundle}", which is not allowed.`
            }]
          };
        }
        return undefined;
      });
    }
  } satisfies ESBuildPlugin;
}

type ConvertAstResult = {
  severity: 'error';
  error: string;
} | {
  severity: 'success';
  output: es.Node;
};

function convertAst(parsed: es.Program): ConvertAstResult {
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
export async function outputBundleOrTab({ text }: OutputFile, input: InputAsset, outDir: string): Promise<BuildResult> {
  const parsed = parse(text, { ecmaVersion: 6 }) as es.Program;

  const astResult = convertAst(parsed);
  if (astResult.severity === 'error') {
    return {
      type: input.type,
      severity: 'error',
      input,
      errors: [`${input.type} ${input.name} ${astResult.error}`]
    } as BuildResult;
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
      type: input.type,
      severity: 'success',
      input,
      path: outpath
    } as BuildResult;
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
