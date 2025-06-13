import fs from 'fs/promises';
import * as td from 'typedoc';
import type { JsonResultEntry, ResolvedBundle } from '../../types.js';
import type { Severity } from '../../utils.js';
import { createBuilder } from '../buildUtils.js';
import drawdown from './drawdown.js';

const typeToName = (type: td.SomeType) => type.stringify(td.TypeContext.none);

const parsers: {
  [K in td.ReflectionKind]?: (obj: td.DeclarationReflection) => ({
    error: any
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
      warnings: []
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

export const {
  builder: buildJson,
  formatter: formatJsonResult
} = createBuilder<[bundle: ResolvedBundle, reflection: td.ProjectReflection], JsonResultEntry>(async (outDir, { name: bundleName }, reflection) => {
  const createEntry = (severity: Severity, message: string): JsonResultEntry => ({
    severity,
    assetType: 'json',
    message,
    inputName: bundleName
  });

  try {
    const [jsonData, resultEntries] = reflection.children!.reduce<[
      Record<string, unknown>,
      JsonResultEntry[]
    ]>(([res, results], element) => {
      const parser = parsers[element.kind];

      if (parser) {
        const result = parser(element);
        if ('error' in result) {
          return [res, [...results, createEntry('error', `${result.error}`)]];
        }

        const { obj, warnings } = result;

        return [
          {
            ...res,
            [element.name]: obj
          },
          [
            ...results,
            ...warnings.map(warning => createEntry('warn', warning))
          ]
        ];
      } else {
        return [
          {
            ...res,
            [element.name]: { kind: 'unknown' }
          }, [
            ...results,
            createEntry('warn', `No parser found for ${element.name} which is of type ${element.kind}.`)
          ]];
      }
    }, [{}, []]);

    const outpath = `${outDir}/jsons/${bundleName}.json`;
    await fs.writeFile(outpath, JSON.stringify(jsonData, null, 2));

    return resultEntries.length === 0 ? [ createEntry('success', `JSON written to ${outpath}`) ] : resultEntries;
  } catch (error) {
    return [{
      severity: 'error',
      inputName: bundleName,
      assetType: 'json',
      message: `${error}`
    }];
  }
});
