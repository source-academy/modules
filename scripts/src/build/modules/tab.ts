import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import { type OutputFile, build as esbuild } from 'esbuild';
import type {
  BlockStatement,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  Literal,
  MemberExpression,
  Program,
  ReturnStatement,
  VariableDeclaration,
} from 'estree';
import { promises as fs } from 'fs';
import uniq from 'lodash/uniq.js';
import pathlib from 'path';

import { printList } from '../../scriptUtils.js';
import { createBuildCommand, logResult, retrieveBundlesAndTabs, tabNameExpander } from '../buildUtils.js';
import { type LintCommandInputs, logLintResult } from '../prebuild/eslint.js';
import { preBuild } from '../prebuild/index.js';
import { logTscResults } from '../prebuild/tsc.js';
import type { BuildCommandInputs, BuildOptions, BuildResult, UnreducedResult } from '../types';

import { esbuildOptions, requireCreator } from './moduleUtils.js';

/**
 * Imports that are provided at runtime
 */
const externals = {
  'react': '_react',
  'react-dom': 'ReactDOM',
};

const outputTab = async (tabName: string, text: string, outDir: string): Promise<Omit<BuildResult, 'elapsed'>> => {
  try {
    const parsed = parse(text, { ecmaVersion: 6 }) as unknown as Program;
    const declStatement = parsed.body[1] as VariableDeclaration;

    const newTab = {
      type: 'ExpressionStatement',
      expression: {
        type: 'FunctionExpression',
        params: uniq(Object.values(externals))
          .map((name) => ({
            type: 'Identifier',
            name,
          }) as Identifier),
        body: {
          type: 'BlockStatement',
          body: [
            requireCreator(externals),
            {
              type: 'ReturnStatement',
              argument: {
                type: 'MemberExpression',
                object: declStatement.declarations[0].init,
                property: {
                  type: 'Literal',
                  value: 'default',
                } as Literal,
                computed: true,
              } as MemberExpression,
            } as ReturnStatement,
          ],
        } as BlockStatement,
      } as FunctionExpression,
    } as ExpressionStatement;

    let newCode = generate(newTab);
    if (newCode.endsWith(';')) newCode = newCode.slice(0, -1);

    const outFile = `${outDir}/tabs/${tabName}.js`;
    await fs.writeFile(outFile, newCode);
    const { size } = await fs.stat(outFile);
    return {
      severity: 'success',
      fileSize: size,
    };
  } catch (error) {
    return {
      severity: 'error',
      error,
    };
  }
};

export const buildTabs = async (tabs: string[], { srcDir, outDir }: BuildOptions) => {
  const { outputFiles } = await esbuild({
    ...esbuildOptions,
    entryPoints: tabs.map(tabNameExpander(srcDir)),
    outbase: outDir,
    outdir: outDir,
    external: Object.keys(externals),
    jsx: 'transform',
  });
  return outputFiles;
};

export const reduceTabOutputFiles = (outputFiles: OutputFile[], startTime: number, outDir: string) => Promise.all(outputFiles.map(async ({ path, text }) => {
  const [rawType, name] = path.split(pathlib.sep)
    .slice(-3, -1);

  if (rawType !== 'tabs') {
    throw new Error(`Expected only tabs, got ${rawType}`);
  }

  const result = await outputTab(name, text, outDir);
  return ['tab', name, {
    elapsed: performance.now() - startTime,
    ...result,
  }] as UnreducedResult;
}));

const buildTabsCommand = createBuildCommand('tabs', true)
  .argument('[tabs...]', 'Manually specify which tabs to build', null)
  .description('Build only tabs')
  .action(async (tabs: string[] | null, opts: BuildCommandInputs & LintCommandInputs) => {
    const assets = await retrieveBundlesAndTabs(opts.manifest, [], tabs);
    const { lintResult, tscResult, proceed } = await preBuild(opts, assets);

    logLintResult(lintResult);
    logTscResults(tscResult, opts.srcDir);

    if (!proceed) return;

    printList(`${chalk.magentaBright('Building the following tabs:')}\n`, assets.tabs);
    const startTime = performance.now();
    const results = await buildTabs(assets.tabs, opts);
    const reducedRes = await reduceTabOutputFiles(results, startTime, opts.outDir);
    logResult(reducedRes, opts.verbose);
  });


export default buildTabsCommand;
