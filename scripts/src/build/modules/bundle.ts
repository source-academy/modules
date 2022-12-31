import { parse } from 'acorn';
import { generate } from 'astring';
import { Table } from 'console-table-printer';
import { build as esbuild } from 'esbuild';
import type {
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
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

export const outputBundle = async (outFile: string, bundleText: string): Promise<BuildResult> => {
  try {
    const parsed = parse(bundleText, { ecmaVersion: 6 }) as unknown as Program;
    const exprStatement = parsed.body[1] as unknown as VariableDeclaration;
    const varDeclarator = exprStatement.declarations[0];
    const callExpression = varDeclarator.init as CallExpression;
    const moduleCode = callExpression.callee as ArrowFunctionExpression;

    callExpression.callee = {
      type: 'FunctionExpression',
      body: {
        type: 'BlockStatement',
        body: [
          requireCreator({
            'js-slang/moduleHelpers': 'moduleHelpers',
          }),
          ...(moduleCode.body as BlockStatement).body,
        ],
      },
      params: [
        {
          type: 'Identifier',
          name: 'moduleHelpers',
        } as Identifier,
      ],
    } as FunctionExpression;

    let newCode = generate(callExpression);
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

export default wrapWithTimer(async (
  buildOpts: BuildOptions,
  project: ProjectReflection,
  bundlesToBuild: string[],
): Promise<Record<'bundles' | 'jsons', [Severity, Table]>> => {
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

  const jsonTable = new Table({
    columns: [
      {
        name: 'bundle',
        title: 'Bundle',
      },
      {
        name: 'jsonSeverity',
        title: 'Status',
      },
      {
        name: 'jsonTime',
        title: 'Build Time(s)',
      },
      {
        name: 'jsonError',
        title: 'Errors',
      },
    ],
  });

  let bundleSeverity: Severity = 'success';
  let jsonSeverity: Severity = 'success';
  await esbuild({
    ...esbuildOptions,
    entryPoints: bundlesToBuild.map((module) => `${buildOpts.srcDir}/bundles/${module}/index.ts`),
    outdir: `${buildOpts.outDir}/bundles`,
    plugins: [
      {
        name: 'bundlePlugin',
        setup(pluginBuild) {
          pluginBuild.onEnd(async ({ outputFiles }) => {
            outputFiles.map(async ({ path, text }) => {
              const { dir } = pathlib.parse(path);
              const moduleName = pathlib.basename(dir);

              const [bundleResult, jsonResult] = await Promise.all([
                outputBundle(`${buildOpts.outDir}/bundles/${moduleName}.js`, text),
                buildJson(moduleName, project, buildOpts),
              ]);

              if (bundleResult.severity === 'error') {
                bundleSeverity = 'error';
                bundleTable.addRow({
                  bundle: moduleName,
                  severity: 'Error',
                  fileSize: '-',
                  error: bundleResult.error,
                }, { color: 'red' });
              } else {
                bundleTable.addRow({
                  bundle: moduleName,
                  severity: 'Success',
                  fileSize: `${divideAndRound(bundleResult.fileSize, 1000, 2)} KB`,
                  error: '-',
                }, { color: 'green' });
              }

              if (jsonResult.result.severity === 'error') {
                jsonSeverity = 'error';
                jsonTable.addRow({
                  jsonSeverity: 'Error',
                  jsonTime: '-',
                  jsonError: jsonResult.result.error,
                }, { color: 'red' });
              } else {
                if (jsonResult.result.severity === 'warn' && jsonSeverity === 'success') {
                  jsonSeverity = 'warn';
                }

                jsonTable.addRow({
                  bundle: moduleName,
                  jsonSeverity: jsonResult.result.severity === 'warn' ? 'Warning' : 'Success',
                  jsonTime: divideAndRound(jsonResult.elapsed, 1000, 2),
                  jsonError: jsonResult.result.error || '-',
                }, { color: jsonResult.result.severity === 'warn' ? 'yellow' : 'green' });
              }
            });
          });
        },
      },
    ],
  });

  return {
    bundles: [bundleSeverity, bundleTable],
    jsons: [jsonSeverity, jsonTable],
  };
});
