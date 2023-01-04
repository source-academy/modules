import chalk from 'chalk';
import { Table } from 'console-table-printer';
import fs from 'fs/promises';
import type { DeclarationReflection, IntrinsicType, ProjectReflection, ReferenceReflection, ReferenceType } from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';
import { divideAndRound, wrapWithTimer } from '../buildUtils';
import type { BuildResult, Severity } from '../types';

const buildJson = wrapWithTimer(async (bundle: string, project: ProjectReflection, buildOpts: BuildOptions): Promise<BuildResult> => {
  try {
    const moduleDocs = project.getChildByName(bundle) as DeclarationReflection;
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
            const { comment: { summary: [{ text }] } } = decl;
            return [{
              severity,
              errors,
            }, {
              ...decls,
              [decl.name]: {
                kind: 'variable',
                type: (decl.type as IntrinsicType | ReferenceType).name,
                description: text,
              },
            }];
          }
          case 'Function': {
            const { signatures: [signature] } = decl as ReferenceReflection;
            const { comment: { summary: [{ text }] } } = signature;

            return [{
              severity,
              errors,
            }, {
              ...decls,
              [signature.name]: {
                description: text,
                returnType: (signature?.type as IntrinsicType | ReferenceType)?.name ?? 'void',
                parameters: signature.parameters.map((param) => ({
                  name: param.name,
                  type: (param.type as IntrinsicType | ReferenceType).name,
                })),
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

export default buildJson;

export const logJsonResults = ({ overall: jsonSeverity, results }: { overall: Severity, results: Record<string, { elapsed: number, result: BuildResult }> }) => {
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
        fileSize: `${divideAndRound(fileSize, 1000, 2)} KB`,
      }, { color: severity === 'warn' ? 'yellow' : 'green' });
    }
  });

  if (jsonSeverity === 'success') {
    console.log(`${chalk.cyanBright('JSONS built')} ${chalk.greenBright('successfully')}:\n${jsonTable.render()}`);
  } else if (jsonSeverity === 'warn') {
    console.log(`${chalk.cyanBright('JSONS built with')} ${chalk.yellowBright('warnings')}:\n${jsonTable.render()}`);
  } else {
    console.log(`${chalk.cyanBright('JSONS failed with')} ${chalk.redBright('errors')}:\n${jsonTable.render()}`);
  }
};
