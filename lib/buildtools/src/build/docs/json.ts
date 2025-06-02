import fs from 'fs/promises';
import * as td from 'typedoc';
import type { BuildResult } from '../../utils';
import drawdown from './drawdown';

const typeToName = (type: td.SomeType) => type.stringify(td.TypeContext.none);

const parsers: {
  [K in td.ReflectionKind]?: (obj: td.DeclarationReflection) => ({
    error: any
  } | {
    obj: any,
    meta: {
      warnings: string[],
    }
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

    const params = signature.parameters!.map(({ type, name }) => [name, typeToName(type!)] as [string, string]);

    return {
      obj: {
        kind: 'function',
        name: obj.name,
        description,
        params,
        retType: typeToName(signature.type!)
      },
      meta: {
        warnings: []
      }
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
      meta: {
        warnings: []
      }
    };
  }
};

/**
 * Build the JSON documentation for a single bundle using the output from
 * typedoc
 */
export async function buildJson(bundleName: string, reflection: td.ProjectReflection, outDir: string): Promise<BuildResult> {
  const [jsonData, warnings, errors] = reflection.children!.reduce(([res, warnings, errors], element) => {
    if (element.name === 'type_map') {
      // console.warn(`${chalk.yellowBright('[warning]')}: type_map present in output for ${bundleName}! Did you forget a @hidden tag?`);
      return [
        res,
        [
          ...warnings,
          `type_map present in output for ${bundleName}! Did you forget a @hidden tag?`
        ],
        errors
      ];
    }

    const parser = parsers[element.kind];
    if (parser) {
      const result = parser(element);
      if ('error' in result) {
        return [res, warnings, [...errors, result.error]];
      }

      const { obj, meta } = result;

      return [
        {
          ...res,
          [element.name]: obj
        },
        [
          ...warnings,
          ...meta.warnings
        ],
        errors
      ];
    } else {
      return [
        {
          ...res,
          [element.name]: { kind: 'unknown' }
        }, [
          ...warnings,
          `No parser found for ${element.name} which is of type ${element.kind}.`
        ], errors];
    }
  }, [{}, [], []] as [Record<string, any>, string[], string[]]);

  await fs.writeFile(`${outDir}/jsons/${bundleName}.json`, JSON.stringify(jsonData, null, 2));

  if (errors.length > 0) {
    return {
      severity: 'error',
      errors,
      warnings
    };
  }

  if (warnings.length > 0) {
    return {
      severity: 'warn',
      warnings,
      errors
    };
  }

  return {
    severity: 'success',
    warnings: [],
    errors: []
  };
}
