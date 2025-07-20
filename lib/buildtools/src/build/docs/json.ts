// Code for building JSON documentation specifically

import fs from 'fs/promises';
import * as td from 'typedoc';
import type { BuildResult, ResolvedBundle } from '../../types.js';
import drawdown from './drawdown.js';

const typeToName = (type: td.SomeType) => type.stringify(td.TypeContext.none);

const parsers: {
  [K in td.ReflectionKind]?: (obj: td.DeclarationReflection) => ({
    error: string
  } | {
    obj: unknown,
    warnings: string[],
  })
} = {
  [td.ReflectionKind.Function](obj) {
    const warnings: string[] = [];

    if (!obj.signatures) {
      return {
        error: `${obj.name} has 0 signatures!`
      };
    }

    if (obj.signatures.length > 1) {
      // Functions should have only 1 signature
      warnings.push(`${obj.name} has more than 1 signature; only using the first one`);
    }

    const [signature] = obj.signatures;

    let description: string;
    if (signature.comment) {
      description = drawdown(signature.comment.summary.map(({ text }) => text)
        .join(''));
    } else {
      description = 'No description available';
    }

    const params = signature.parameters?.map(({ type, name }) => [name, typeToName(type!)] as [string, string]);

    return {
      obj: {
        kind: 'function',
        name: obj.name,
        description,
        params: params ?? [],
        retType: typeToName(signature.type!)
      },
      warnings
    };
  },
  [td.ReflectionKind.Variable](obj) {
    let description: string;
    if (obj.comment) {
      description = drawdown(obj.comment.summary.map(({ text }) => text)
        .join(''));
    } else {
      description = 'No description available';
    }

    return {
      obj: {
        kind: 'variable',
        name: obj.name,
        description,
        type: typeToName(obj.type!)
      },
      warnings: []
    };
  }
};

/**
 * Converts a Typedoc reflection into the format as expected by the frontend and write it to disk as a JSON file
 */
export async function buildJson(bundle: ResolvedBundle, outDir: string, reflection: td.ProjectReflection): Promise<BuildResult> {
  const [jsonData, warnings, errors] = reflection.children!.reduce<
    [Record<string, unknown>, string[], string[]]
  >(([res, warnings, errors], element) => {
    const parser = parsers[element.kind];

    if (!parser) {
      return [
        {
          ...res,
          [element.name]: { kind: 'unknown' }
        },
        [
          ...warnings,
          `No parser found for ${element.name} which is of type ${element.kind}.`
        ],
        errors
      ];
    }

    const result = parser(element);
    if ('error' in result) {
      return [res, warnings, [...errors, result.error]];
    }

    const { obj, warnings: parsedWarnings } = result;
    return [
      {
        ...res,
        [element.name]: obj
      },
      [
        ...warnings,
        ...parsedWarnings
      ],
      errors
    ];
  }, [{}, [], []]);

  if (errors.length > 0) {
    return {
      type: 'docs',
      severity: 'error',
      errors,
      input: bundle
    };
  }

  const outpath = `${outDir}/jsons/${bundle.name}.json`;
  await fs.writeFile(outpath, JSON.stringify(jsonData, null, 2));

  if (warnings.length > 0) {
    return {
      type: 'docs',
      severity: 'warn',
      warnings,
      path: outpath,
      input: bundle
    };
  }

  return {
    type: 'docs',
    severity: 'success',
    path: outpath,
    input: bundle
  };
}
