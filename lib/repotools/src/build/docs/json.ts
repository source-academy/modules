// Code for building JSON documentation specifically
import fs from 'fs/promises';
import pathlib from 'path';
import * as td from 'typedoc';
import type { JsonResult } from '../../types.js';
import type { ResolvedBundle } from '../../types.js';
import drawdown from './drawdown.js';

interface VariableDocEntry {
  kind: 'variable';
  name: string;
  type: string;
  description: string;
};

interface FunctionDocEntry {
  kind: 'function';
  name: string;
  retType: string;
  description: string;
  params: [string, string][];
}

type DocEntry = VariableDocEntry | FunctionDocEntry;

export interface ParserSuccess {
  obj: DocEntry;
  warnings: string[];
}

export interface ParserError {
  error: string;
}

export type ParserResult = ParserError | ParserSuccess;

const typeToName = (type: td.SomeType) => type.stringify(td.TypeContext.none);
export const parsers: {
  [K in td.ReflectionKind]?: (obj: td.DeclarationReflection) => ParserResult
} = {
  [td.ReflectionKind.Function](obj) {
    const warnings: string[] = [];

    if (!obj.signatures) {
      return {
        error: `Function ${obj.name} has 0 signatures!`
      };
    }

    if (obj.signatures.length > 1) {
      // Functions should have only 1 signature
      warnings.push(`Function ${obj.name} has more than 1 signature; only using the first one`);
    }

    const [signature] = obj.signatures;
    if (!signature.type) {
      return {
        error: `Signature for ${obj.name} did not have a valid return type`
      };
    }

    let description: string;
    if (signature.comment) {
      description = drawdown(signature.comment.summary.map(({ text }) => text)
        .join(''));
    } else {
      description = '<p>No description available</p>';
    }

    const params = signature.parameters?.map(({ type, name }) => [name, typeToName(type!)] as [string, string]);

    return {
      obj: {
        kind: 'function',
        name: obj.name,
        description,
        params: params ?? [],
        retType: typeToName(signature.type)
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
      description = '<p>No description available</p>';
    }

    if (!obj.type) {
      return {
        error: `Variable ${obj.name} does not have a valid type`
      };
    }

    return {
      obj: {
        kind: 'variable',
        name: obj.name,
        description,
        type: typeToName(obj.type)
      },
      warnings: []
    };
  }
};

/**
 * Converts a Typedoc reflection into the format as expected by the frontend and write it to disk as a JSON file
 */
export async function buildJson(bundle: ResolvedBundle, outDir: string, reflection: td.ProjectReflection): Promise<JsonResult> {
  const [jsonData, warnings, errors] = reflection.children!.reduce<
    [Record<string, unknown>, string[], string[]]
  >(([res, warnings, errors], element) => {
    if (element.kind === td.ReflectionKind.TypeAlias) {
      // Ignore Type Aliases for JSON documentation
      return [res, warnings, errors];
    }

    const parser = parsers[element.kind];

    if (!parser) {
      const kindString = td.ReflectionKind[element.kind];
      return [
        {
          ...res,
          [element.name]: { kind: 'unknown' }
        },
        [
          ...warnings,
          `No parser found for ${element.name} which is of type ${kindString}.`
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
      severity: 'error',
      diagnostics: errors.map(each => ({
        severity: 'error',
        error: each
      })),
    };
  }

  const outpath = pathlib.join(outDir, 'jsons', `${bundle.name}.json`);
  await fs.writeFile(outpath, JSON.stringify(jsonData, null, 2));

  if (warnings.length > 0) {
    return {
      severity: 'warn',
      diagnostics: warnings.map(each => ({
        severity: 'warn',
        warning: each
      })),
      outpath,
    };
  }

  return {
    severity: 'success',
    outpath,
  };
}
