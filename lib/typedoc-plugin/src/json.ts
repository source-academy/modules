// Code for building JSON documentation specifically
import type { ModuleDocsEntry, ParamSpecifier } from 'js-slang/dist/modules/moduleTypes';
import * as td from 'typedoc';
import drawdown from './drawdown';

<<<<<<< HEAD
export interface VariableDocEntry {
  kind: 'variable';
  name: string;
  type: string;
  description: string;
};

export interface FunctionDocEntry {
  kind: 'function';
  name: string;
  retType: string;
  description: string;
  params: [string, string][];
}

export interface UnknownDocEntry {
  kind: 'unknown';
}

export type DocEntry = VariableDocEntry | FunctionDocEntry | UnknownDocEntry;

=======
>>>>>>> cee7ad2f2df2efb382777b4fa086e107646a325a
export interface ParserSuccess {
  obj: ModuleDocsEntry;
  warnings: string[];
}

export interface ParserError {
  error: string;
}

const typeToName = (type: td.SomeType) => type.stringify(td.TypeContext.none);
export const parsers = {
  [td.ReflectionKind.Function](obj) {
    const [signature] = obj.signatures!;

    let description: string;
    if (signature.comment) {
      description = drawdown(signature.comment.summary.map(({ text }) => text)
        .join(''));
    } else {
      description = '<p>No description available</p>';
    }

    const params = signature.parameters?.map(({ type, name, defaultValue, flags }): ParamSpecifier => {
      const typeName = typeToName(type!);
      if (flags.isRest) {
        return {
          paramType: 'rest',
          type: typeName,
          name
        };
      }

      if (flags.isOptional) {
        return {
          paramType: 'optional',
          type: typeName,
          name
        };
      }

      return {
        paramType: 'regular',
        type: typeName,
        name,
        defaultValue
      };
    });

    return {
      kind: 'function',
      name: obj.name,
      description,
      params: params ?? [],
      retType: typeToName(signature.type!)
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

    return {
      kind: 'variable',
      name: obj.name,
      description,
      type: typeToName(obj.type!)
    };
  }
} satisfies {
  [K in td.ReflectionKind]?: (obj: td.DeclarationReflection) => ModuleDocsEntry
};

/**
 * Converts a Typedoc reflection into the format as expected by the frontend and write it to disk as a JSON file
 */
export function buildJson(reflection: td.ProjectReflection): Record<string, ModuleDocsEntry> {
  const jsonData = reflection.children!.reduce<Record<string, ModuleDocsEntry>>((res, element) => {
    if (element.kind === td.ReflectionKind.TypeAlias) {
      // Ignore Type Aliases for JSON documentation
      return res;
    }

    // @ts-expect-error If element.kind isn't present parser will be undefined
    const parser = parsers[element.kind];
    return {
      ...res,
      [element.name]: parser ? parser(element) : { kind: 'unknown' }
    };
  }, {});

  return jsonData;
}
