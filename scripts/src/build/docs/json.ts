import fs from 'fs/promises';
import type { DeclarationReflection, IntrinsicType, ProjectReflection, ReferenceReflection, ReferenceType } from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';
import { wrapWithTimer } from '../buildUtils';
import type { BuildResult, Severity } from '../types';

const buildJson = wrapWithTimer(async (bundle: string, project: ProjectReflection, buildOpts: BuildOptions): Promise<BuildResult> => {
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
            description: text,
            returnType: (signature?.type as IntrinsicType | ReferenceType)?.name ?? 'void',
            parameters: signature.parameters.map((param) => ({
              name: param.name,
              type: (param.type as IntrinsicType | ReferenceType).name,
            })),
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
        [name: string]: string;
      },
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
  await fs.writeFile(outFile, JSON.stringify(result));
  const { size } = await fs.stat(outFile);

  const errorStr = sevRes.errors.length > 1 ? `${sevRes.errors[0]} +${sevRes.errors.length - 1}` : sevRes.errors[0];

  return {
    severity: sevRes.severity,
    fileSize: size,
    error: errorStr,
  };
});

export default buildJson;
