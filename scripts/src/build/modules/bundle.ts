import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import { Table } from 'console-table-printer';
import { type OutputFile, build as esbuild } from 'esbuild';
import type {
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  Program,
  VariableDeclaration,
} from 'estree';
import { promises as fsPromises } from 'fs';
import pathlib from 'path';
import type { ProjectReflection } from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';
import { divideAndRound, esbuildOptions, wrapWithTimer } from '../buildUtils';
import buildJson from '../docs/json';
import type { BuildResult, Severity } from '../types';

import { requireCreator } from './moduleUtils';

const HELPER_NAME = 'moduleHelpers';

const outputBundle = async (outFile: string, bundleText: string): Promise<BuildResult> => {
  try {
    const parsed = parse(bundleText, { ecmaVersion: 6 }) as unknown as Program;
    const exprStatement = parsed.body[1] as unknown as VariableDeclaration;
    const varDeclarator = exprStatement.declarations[0];
    const callExpression = varDeclarator.init as CallExpression;
    const moduleCode = callExpression.callee as ArrowFunctionExpression;

    const output = {
      type: 'FunctionExpression',
      body: {
        type: 'BlockStatement',
        body: [
          requireCreator({
            'js-slang/moduleHelpers': HELPER_NAME,
          }),
          ...(moduleCode.body.type === 'BlockStatement'
            ? (moduleCode.body as BlockStatement).body
            : [{
              type: 'ExpressionStatement',
              expression: moduleCode.body,
            } as ExpressionStatement]),
        ],
      },
      params: [
        {
          type: 'Identifier',
          name: HELPER_NAME,
        } as Identifier,
      ],
    } as FunctionExpression;

    let newCode = generate(output);
    if (newCode.endsWith(';')) newCode = newCode.slice(0, -1);

    await fsPromises.writeFile(outFile, newCode);
    const { size } = await fsPromises.stat(outFile);
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

const afterBundleBuild = async (outputFiles: OutputFile[], buildOpts: BuildOptions, project: ProjectReflection,
  callback: (name: string, bundleResult: BuildResult, jsonResult: { elapsed: number, result: BuildResult }) => void) => Promise.all(outputFiles.map(async ({ path, text }) => {
  const { dir } = pathlib.parse(path);
  const moduleName = pathlib.basename(dir);

  const [bundleResult, jsonResult] = await Promise.all([
    outputBundle(`${buildOpts.outDir}/bundles/${moduleName}.js`, text),
    buildJson(moduleName, project, buildOpts),
  ]);

  callback(moduleName, bundleResult, jsonResult);
})) as unknown as Promise<void>;

export const logBundleResults = (bundleTime: number, { overall: bundleSeverity, results }: { overall: Severity, results: Record<string, BuildResult> }) => {
  const entries = Object.entries(results);
  if (entries.length === 0) return;

  const bundleTable = new Table({
    columns: [{
      name: 'bundle',
      title: 'Bundle',
    },
    {
      name: 'severity',
      title: 'Status',
    },
    {
      name: 'fileSize',
      title: 'File Size',
    },
    {
      name: 'error',
      title: 'Errors',
    }],
  });

  entries.forEach(([moduleName, { severity, error, fileSize }]) => {
    if (severity === 'error') {
      bundleTable.addRow({
        bundle: moduleName,
        severity: 'Error',
        fileSize: '-',
        error,
      }, { color: 'red' });
    } else {
      bundleTable.addRow({
        bundle: moduleName,
        severity: 'Success',
        fileSize: `${divideAndRound(fileSize, 1000, 2)} KB`,
        error: '-',
      }, { color: 'green' });
    }
  });

  const bundleTimeStr = `${divideAndRound(bundleTime, 1000, 2)}s`;
  if (bundleSeverity === 'success') {
    console.log(`${chalk.cyanBright('Bundles built')} ${chalk.greenBright('successfully')} in ${bundleTimeStr}:\n${bundleTable.render()}`);
  } else {
    console.log(`${chalk.cyanBright('Bundles failed with')} ${chalk.redBright('errors')} in ${bundleTimeStr}:\n${bundleTable.render()}`);
  }
};

export const buildBundles = wrapWithTimer(async (
  buildOpts: BuildOptions,
  project: ProjectReflection,
  bundlesToBuild: string[],
): Promise<{
  bundles: {
    overall: Severity,
    results: Record<string, BuildResult>,
  }
  jsons: {
    overall: Severity,
    results: Record<string, { elapsed: number, result: BuildResult }>,
  }
}> => {
  const bundleResults: Record<string, BuildResult> = {};
  let bundleSeverity: Severity = 'success';

  const jsonResults: Record<string, { elapsed: number, result: BuildResult }> = {};
  let jsonSeverity: Severity = 'success';

  await Promise.all([
    fsPromises.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }),
    fsPromises.mkdir(`${buildOpts.outDir}/jsons`, { recursive: true }),
  ]);

  await esbuild({
    ...esbuildOptions,
    entryPoints: bundlesToBuild.map((module) => `${buildOpts.srcDir}/bundles/${module}/index.ts`),
    outdir: `${buildOpts.outDir}/bundles`,
    plugins: [
      {
        name: 'bundlePlugin',
        setup(pluginBuild) {
          if (buildOpts.docs) {
            pluginBuild.onEnd(({ outputFiles }) => afterBundleBuild(outputFiles, buildOpts, project, (moduleName, bundleResult, jsonResult) => {
              bundleResults[moduleName] = bundleResult;
              if (bundleResult.severity === 'error') bundleSeverity = 'error';

              jsonResults[moduleName] = jsonResult;
              if (jsonResult.result.severity === 'error') jsonSeverity = 'error';
              else if (jsonSeverity === 'success' && jsonResult.result.severity === 'warn') jsonSeverity = 'warn';
            }));
          } else {
            // pluginBuild.onEnd(({ outputFiles }) => Promise.all(outputFiles.map(async ({ path, text}) => {
            //   bundleResults[moduleName] = bundleResult;
            //   if (bundleResult.severity === 'error') bundleSeverity = 'error';
            // })));
          }
        },
      },
    ],
  });

  return {
    bundles: {
      overall: bundleSeverity,
      results: bundleResults,
    },
    jsons: {
      overall: jsonSeverity,
      results: jsonResults,
    },
  };
});

export const watchBundles = (
  buildOpts: BuildOptions,
  docsProject: ProjectReflection,
  bundlesToWatch: string[],
) => Promise.all([
  fsPromises.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }),
  fsPromises.mkdir(`${buildOpts.outDir}/jsons`, { recursive: true }),
])
  .then(() => esbuild({
    ...esbuildOptions,
    entryPoints: bundlesToWatch.map((module) => `${buildOpts.srcDir}/bundles/${module}/index.ts`),
    outdir: `${buildOpts.outDir}/bundles`,
    watch: {
      onRebuild: (_, { outputFiles }) => afterBundleBuild(outputFiles, buildOpts, docsProject, (
        moduleName,
        { error: bundleError, severity: bundleSeverity },
        { elapsed: jsonTime, result: { error: jsonError, severity: jsonSeverity } },
      ) => {
        const bundleStr = bundleSeverity === 'error'
          ? `${chalk.cyanBright(`Build of ${moduleName}`)} ${chalk.redBright('failed')}: ${bundleError}`
          : `${chalk.cyanBright(`Rebuilt ${moduleName}`)} ${chalk.greenBright('successfully')}`;

        const jsonTimeStr = `in ${divideAndRound(jsonTime, 1000, 2)}s`;
        let jsonStr: string;
        if (jsonSeverity === 'error') {
          jsonStr = `${chalk.cyanBright(`Build of ${moduleName} json`)} ${chalk.redBright('failed')}: ${jsonError}`;
        } else if (jsonSeverity === 'warn') {
          jsonStr = `${chalk.cyanBright(`Rebuilt json of ${moduleName} ${jsonTimeStr} with`)} ${chalk.yellowBright('warnings')}: ${jsonError}`;
        } else {
          jsonStr = `${chalk.cyanBright(`Rebuilt ${moduleName} json ${jsonTimeStr}`)} ${chalk.greenBright('successfully')}`;
        }

        console.log(`${bundleStr}\n${jsonStr}`);
      }),
    },
  }));
