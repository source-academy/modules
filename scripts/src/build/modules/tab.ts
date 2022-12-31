import { parse } from 'acorn';
import { generate } from 'astring';
import { Table } from 'console-table-printer';
import { build as esbuild } from 'esbuild';
import type {
  BlockStatement, ExpressionStatement,
  FunctionExpression,
  Identifier,
  Literal,
  MemberExpression,
  Program,
  ReturnStatement,
  VariableDeclaration,
} from 'estree';
import { promises as fs } from 'fs';
import pathlib from 'path';

import type { BuildOptions } from '../../scriptUtils';
import { divideAndRound, esbuildOptions, wrapWithTimer } from '../buildUtils';
import type { BuildResult, Severity } from '../types';

import { requireCreator } from './moduleUtils';

export const outputTab = async (outFile: string, text: string): Promise<BuildResult> => {
  try {
    const parsed = parse(text, { ecmaVersion: 6 }) as unknown as Program;
    const declStatement = parsed.body[1] as VariableDeclaration;

    const newTab = {
      type: 'ExpressionStatement',
      expression: {
        type: 'FunctionExpression',
        params: [
          {
            type: 'Identifier',
            name: '_react',
          } as Identifier,
          {
            type: 'Identifier',
            name: 'ReactDOM',
          } as Identifier,
        ],
        body: {
          type: 'BlockStatement',
          body: [
            requireCreator({
              'react': '_react',
              'react-dom': 'ReactDOM',
            }),
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

export default wrapWithTimer(async (buildOpts: BuildOptions, tabs: string[]): Promise<[Severity, Table]> => {
  let tabSeverity: Severity = 'success';
  const tabTable = new Table();
  await esbuild({
    ...esbuildOptions,
    entryPoints: tabs.map((tabName) => `${buildOpts.srcDir}/tabs/${tabName}/index.tsx`),
    outdir: `${buildOpts.outDir}/tabs`,
    plugins: [
      {
        name: 'tabPlugin',
        setup(pluginBuild) {
          pluginBuild.onEnd(({ outputFiles }) => {
            outputFiles.forEach(async ({ path, text }) => {
              const { dir } = pathlib.parse(path);
              const tabName = pathlib.basename(dir);

              const { severity, error, fileSize } = await outputTab(`${buildOpts.outDir}/tabs/${tabName}.js`, text);
              if (severity === 'success') {
                tabTable.addRow({
                  'Tab': tabName,
                  'Status': 'Success',
                  'File Size': `${divideAndRound(fileSize, 1000, 2)}KB`,
                  'Error': '-',
                }, { color: 'green' });
              } else {
                tabSeverity = 'error';
                tabTable.addRow({
                  'Tab': tabName,
                  'Status': 'Error',
                  'File Size': '-',
                  'Error': error,
                }, { color: 'red' });
              }
            });
          });
        },
      },
    ],
  });

  return [tabSeverity, tabTable];
});
