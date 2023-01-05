import chalk from 'chalk';
import { Table } from 'console-table-printer';
import fs from 'fs/promises';
import type {
  DeclarationReflection,
  IntrinsicType,
  ProjectReflection,
  ReferenceReflection,
  ReferenceType,
} from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';
import { divideAndRound, fileSizeFormatter, findSeverity, wrapWithTimer } from '../buildUtils';
import type { BuildResult, Severity } from '../types';

const buildJson = wrapWithTimer(async (bundle: string, moduleDocs: DeclarationReflection | undefined, buildOpts: BuildOptions): Promise<BuildResult> => {
  try {
    if (!moduleDocs) {
      return {
        severity: 'error',
        error: `Could not find generated docs for ${bundle}`,
      };
    }

    const [sevRes, result] = moduleDocs.children.reduce(([{ severity, errors }, decls], decl) => {
      try {
        switch (decl.kindString) {
          case 'Variable': {
            const { comment: { summary } } = decl;
            return [{
              severity,
              errors,
            }, {
              ...decls,
              [decl.name]: {
                kind: 'variable',
                type: (decl.type as IntrinsicType | ReferenceType).name,
                description: summary.map(({ text }) => text)
                  .join(''),
              },
            }];
          }
          case 'Function': {
            const { signatures: [signature] } = decl as ReferenceReflection;

            const { comment: { summary } } = signature;

            // const paramTags = signature.comment.getTags('@param');
            return [{
              severity,
              errors,
            }, {
              ...decls,
              [signature.name]: {
                description: summary.map(({ text }) => text)
                  .join(''),
                returnType: (signature.type as IntrinsicType | ReferenceType)?.name ?? 'void',
                parameters: signature.parameters.reduce((res, param) => ({
                  ...res,
                  [param.name]: {
                    type: (param.type as IntrinsicType | ReferenceType).name,
                    // description: paramTags.find(tag => 'test'),
                  },
                }), {}),
              },
            }];
          }
          default: {
            return [{
              severity: 'warn' as Severity,
              errors: [...errors, `Could not find parser for type ${decl.kindString}`],
            }, decls];
          }
        }
      } catch (error) {
        return [{
          severity: 'warn' as Severity,
          errors: [...errors, `Could not parse declaration for ${decl.name}: ${error}`],
        }];
      }
    }, [
      {
        severity: 'success',
        errors: [],
      },
      {},
    ] as [
      {
        severity: Severity,
        errors: any[]
      },
      Record<string, ({
        description: string;
      } & ({
        kind: 'function',
        returnType: string;
        parameters: {
          name: string;
          type: string;
        }[],
      } | {
        kind: 'variable',
        type: string;
      }))>,
    ]);

    if (!result) {
      return {
        elapsed: 0,
        severity: 'warn',
        error: `No json generated for ${bundle}`,
        fileSize: 0,
      };
    }

    const outFile = `${buildOpts.outDir}/jsons/${bundle}.json`;
    await fs.writeFile(outFile, JSON.stringify(result, null, 2));
    const { size } = await fs.stat(outFile);

    const errorStr = sevRes.errors.length > 1 ? `${sevRes.errors[0]} +${sevRes.errors.length - 1}` : sevRes.errors[0];

    return {
      severity: sevRes.severity,
      fileSize: size,
      error: errorStr,
    };
  } catch (error) {
    return {
      severity: 'error',
      error,
    };
  }
});

export default async (project: ProjectReflection, buildOpts: BuildOptions) => {
  const bundles = buildOpts.modules;

  if (bundles.length === 0) return false;
  if (bundles.length === 1) {
    const jsonStartTime = performance.now();
    const [bundle] = buildOpts.modules;
    const result = await buildJson(bundle, project as any, buildOpts);
    return {
      elapsed: performance.now() - jsonStartTime,
      results: { [bundle]: result },
      severity: result.result.severity,
    };
  }

  const jsonStartTime = performance.now();
  const results = await Promise.all(
    bundles.map(async (bundle) => [bundle, await buildJson(bundle, project.getChildByName(bundle) as DeclarationReflection, buildOpts)] as [string, { elapsed: number, result: BuildResult }]),
  );
  const resultObj = results.reduce((res, [bundle, result]) => ({
    ...res,
    [bundle]: result,
  }), {} as Record<string, { elapsed: number, result: BuildResult }>);
  const jsonEndTime = performance.now();

  return {
    severity: findSeverity(results, ([,{ result: { severity } }]) => severity),
    results: resultObj,
    elapsed: jsonEndTime - jsonStartTime,
  };
};

export const logJsonResults = (jsonResults: { elapsed: number, severity: Severity, results: Record<string, { elapsed: number, result: BuildResult }> } | false) => {
  if (typeof jsonResults === 'boolean') return;

  const { elapsed: jsonTime, severity: jsonSeverity, results } = jsonResults;
  const entries = Object.entries(results);
  if (entries.length === 0) return;

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
        name: 'fileSize',
        title: 'File Size',
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

  entries.forEach(([moduleName, { elapsed, result: { severity, error, fileSize } }]) => {
    if (severity === 'error') {
      jsonTable.addRow({
        jsonSeverity: 'Error',
        jsonTime: '-',
        jsonError: error,
        fileSize: '-',
      }, { color: 'red' });
    } else {
      jsonTable.addRow({
        bundle: moduleName,
        jsonSeverity: severity === 'warn' ? 'Warning' : 'Success',
        jsonTime: divideAndRound(elapsed, 1000, 2),
        jsonError: error || '-',
        fileSize: fileSizeFormatter(fileSize),
      }, { color: severity === 'warn' ? 'yellow' : 'green' });
    }
  });

  const jsonTimeStr = `${divideAndRound(jsonTime, 1000, 2)}s`;
  if (jsonSeverity === 'success') {
    console.log(`${chalk.cyanBright('JSONS built')} ${chalk.greenBright('successfully')} in ${jsonTimeStr}:\n${jsonTable.render()}\n`);
  } else if (jsonSeverity === 'warn') {
    console.log(`${chalk.cyanBright('JSONS built with')} ${chalk.yellowBright('warnings')} in ${jsonTimeStr}:\n${jsonTable.render()}\n`);
  } else {
    console.log(`${chalk.cyanBright('JSONS failed with')} ${chalk.redBright('errors')}:\n${jsonTable.render()}\n`);
  }
};
