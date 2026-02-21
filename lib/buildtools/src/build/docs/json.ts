// Code for building JSON documentation specifically
import fs from 'fs/promises';
import pathlib from 'path';
import type { BuildResult, ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import { Parser } from 'acorn';
import { tsPlugin } from 'acorn-typescript';
import * as td from 'typedoc';
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

const markdownRegex = /^```[jt]sx?([\s\S]*)```\s*$/;

/**
 * Checks the declaration's comment for `@example` tags and validates their contents
 * to make sure that they are valid Javascript
 *
 * @returns True if there is an example that doesn't validate, false otherwise
 */
function getInvalidExamples(parts: td.CommentTag[]): string[] {
  // @ts-expect-error Idk what the type error here is
  const parser = Parser.extend(tsPlugin());

  return parts.flatMap(part => part.content.map(content => {
    if (content.kind !== 'code') return false;

    const match = markdownRegex.exec(content.text);
    const text = match ? match[1] : content.text;

    try {
      parser.parse(text, { ecmaVersion: 6, sourceType: 'module' });
      return false;
    } catch {
      return text;
    }
  }))
    .filter(x => x !== false);
}

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
      const invalidExamples = getInvalidExamples(signature.comment.blockTags);
      invalidExamples.forEach(example => {
        warnings.push(`${obj.name} has an example tag that did not validate: ${example}`);
      });
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
    const warnings: string[] = [];
    if (obj.signatures) {
      warnings.push(`${obj.name} is typed as a Variable, but function signatures were detected. Did you forget a @function tag?`);
    }

    let description: string;
    if (obj.comment) {
      description = drawdown(obj.comment.summary.map(({ text }) => text)
        .join(''));
      const invalidExamples = getInvalidExamples(obj.comment.blockTags);
      invalidExamples.forEach(example => {
        warnings.push(`${obj.name} has an example tag that did not validate: ${example}`);
      });
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
      warnings
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
      type: 'docs',
      severity: 'error',
      errors,
      input: bundle
    };
  }

  const outpath = pathlib.join(outDir, 'jsons', `${bundle.name}.json`);
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
