// Code for building JSON documentation specifically
import type { ModuleDocsEntry, ParamSpecifier } from 'js-slang/dist/modules/moduleTypes';
import * as td from 'typedoc';
import drawdown from './drawdown';

export interface ParserSuccess {
  obj: ModuleDocsEntry;
  warnings: string[];
}

export interface ParserError {
  error: string;
}

const typeToName = (type: td.SomeType) => type.stringify(td.TypeContext.none);

// Shared by both Function and Method reflections - a class method's signature shape is the same
// as a standalone function's, so a bundle whose public surface is a class (e.g. sound_matrix's
// BaseModulePlugin subclass) documents its methods identically to how a plain-function bundle
// documents its exports. See buildJson's Class handling below.
function parseFunctionLike(obj: td.DeclarationReflection) {
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
    kind: 'function' as const,
    name: obj.name,
    description,
    params: params ?? [],
    retType: typeToName(signature.type!)
  };
}

export const parsers = {
  [td.ReflectionKind.Function]: parseFunctionLike,
  [td.ReflectionKind.Method]: parseFunctionLike,
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

    if (element.kind === td.ReflectionKind.Class) {
      // The class itself isn't a documentable entry (there's no single function signature to
      // describe) - flatten its own public methods into individual entries instead, exactly as
      // if each had been exported as a standalone function. Non-method members (the constructor,
      // public fields like `id`/`exportedNames`) aren't part of the student-facing API and are
      // skipped, same as they always were when this bundle style didn't exist.
      return (element.children ?? [])
        // Only the class's own methods, not ones inherited from BaseModulePlugin (e.g.
        // `initialise`) - those aren't part of this bundle's own exportedNames surface.
        .filter(child => child.kind === td.ReflectionKind.Method && !child.inheritedFrom)
        .reduce<Record<string, ModuleDocsEntry>>((withMethods, method) => ({
          ...withMethods,
          [method.name]: parseFunctionLike(method)
        }), res);
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
