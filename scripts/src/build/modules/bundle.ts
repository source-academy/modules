import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import { Table } from 'console-table-printer';
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

import { divideAndRound, fileSizeFormatter } from '../buildUtils';
import type { BuildResult, OperationResult } from '../types';

import { requireCreator } from './moduleUtils';

const HELPER_NAME = 'moduleHelpers';

export const outputBundle = async (name: string, bundleText: string, outDir: string): Promise<Omit<BuildResult, 'elapsed'>> => {
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

    const outFile = `${outDir}/bundles/${name}.js`;
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

export const logBundleResults = (bundleResults: OperationResult, verbose: boolean) => {
  if (typeof bundleResults === 'boolean') return;

  const { severity: bundleSeverity, results } = bundleResults;
  const entries = Object.entries(results);
  if (entries.length === 0) return;

  if (!verbose) {
    if (bundleSeverity === 'success') {
      console.log(chalk.greenBright('Successfully built all bundles!\n'));
      return;
    }

    console.log(chalk.cyanBright(`Bundle building ${chalk.redBright('failed')} with errors:\n${
      Object.entries(results)
        .filter(([, { severity }]) => severity === 'error')
        .map(([bundle, { error }], i) => chalk.redBright(`${i + 1}. ${bundle}: ${error}`))
        .join('\n')
    }\n`));

    return;
  }

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
      name: 'elapsed',
      title: 'Build Time (s)',
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

  entries.forEach(([moduleName, { elapsed, severity, error, fileSize }]) => {
    if (severity === 'error') {
      bundleTable.addRow({
        bundle: moduleName,
        elapsed: '-',
        error,
        fileSize: '-',
        severity: 'Error',
      }, { color: 'red' });
    } else {
      bundleTable.addRow({
        bundle: moduleName,
        elapsed: divideAndRound(elapsed, 1000, 2),
        error: '-',
        fileSize: fileSizeFormatter(fileSize),
        severity: 'Success',
      }, { color: 'green' });
    }
  });

  if (bundleSeverity === 'success') {
    console.log(`${chalk.cyanBright('Bundles built')} ${chalk.greenBright('successfully')}:\n${bundleTable.render()}\n`);
  } else {
    console.log(`${chalk.cyanBright('Bundles failed with')} ${chalk.redBright('errors')}:\n${bundleTable.render()}\n`);
  }
};
