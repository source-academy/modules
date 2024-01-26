import { parse } from 'acorn';
import { generate } from 'astring';
import {
  type BuildOptions as ESBuildOptions,
  type OutputFile,
  build as esbuild,
} from 'esbuild';
import type {
  ArrowFunctionExpression,
  CallExpression,
  ExportDefaultDeclaration,
  Identifier,
  Program,
  VariableDeclaration,
} from 'estree';
import fs from 'fs/promises';
import pathlib from 'path';

import { bundleNameExpander } from '../buildUtils.js';
import type { BuildOptions, BuildResult, UnreducedResult } from '../types.js';

import { esbuildOptions } from './moduleUtils.js';

export const outputBundle = async (name: string, bundleText: string, outDir: string): Promise<Omit<BuildResult, 'elapsed'>> => {
  try {
    const parsed = parse(bundleText, { ecmaVersion: 6 }) as unknown as Program;

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
        params: [
          {
            type: 'Identifier',
            name: 'require',
          } as Identifier,
        ],
      },
    };

    const outFile = `${outDir}/bundles/${name}.js`;
    await fs.writeFile(outFile, generate(output));
    const { size } = await fs.stat(outFile);
    return {
      severity: 'success',
      fileSize: size,
    };
  } catch (error) {
    console.log(error);
    return {
      severity: 'error',
      error,
    };
  }
};

export const getBundleOptions = (bundles: string[], { srcDir, outDir }: Record<'srcDir' | 'outDir', string>): ESBuildOptions => {
  const nameExpander = bundleNameExpander(srcDir);
  return {
    ...esbuildOptions,
    entryPoints: bundles.map(nameExpander),
    outbase: outDir,
    outdir: outDir,
    tsconfig: `${srcDir}/tsconfig.json`,
    plugins: [{
      name: 'Assert Polyfill',
      setup(build) {
        // Polyfill the NodeJS assert module
        build.onResolve({ filter: /^assert/u }, () => ({
          path: 'assert',
          namespace: 'bundleAssert',
        }));

        build.onLoad({
          filter: /^assert/u,
          namespace: 'bundleAssert',
        }, () => ({
          contents: `
          export default function assert(condition, message) {
            if (condition) return;

            if (typeof message === 'string' || message === undefined) {
              throw new Error(message);
            }

            throw message;
          }
          `,
        }));
      },
    }],
  };
};

export const buildBundles = async (bundles: string[], options: BuildOptions) => {
  const { outputFiles } = await esbuild(getBundleOptions(bundles, options));
  return outputFiles;
};

export const reduceBundleOutputFiles = (outputFiles: OutputFile[], startTime: number, outDir: string) => Promise.all(outputFiles.map(async ({ path, text }) => {
  const [rawType, name] = path.split(pathlib.sep)
    .slice(-3, -1);

  if (rawType !== 'bundles') {
    throw new Error(`Expected only bundles, got ${rawType}`);
  }

  const result = await outputBundle(name, text, outDir);
  return ['bundle', name, {
    elapsed: performance.now() - startTime,
    ...result,
  }] as UnreducedResult;
}));
