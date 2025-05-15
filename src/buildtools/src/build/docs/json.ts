import fs from 'fs/promises';
import * as td from 'typedoc';
import drawdown from './drawdown';

const typeToName = (type?: td.SomeType) => type.stringify(td.TypeContext.none);

const parsers = {
  [td.ReflectionKind.Function](obj) {
    // Functions should have only 1 signature
    if (obj.signatures.length > 1) {
      console.warn(`${obj.name} has more than 1 signature; only using the first one`)
    }

    const [signature] = obj.signatures;

    let description: string;
    if (signature.comment) {
      description = drawdown(signature.comment.summary.map(({ text }) => text)
        .join(''));
    } else {
      description = 'No description available';
    }

    const params = signature.parameters.map(({ type, name }) => [name, typeToName(type)] as [string, string]);

    return {
      kind: 'function',
      name: obj.name,
      description,
      params,
      retType: typeToName(signature.type)
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
      kind: 'variable',
      name: obj.name,
      description,
      type: typeToName(obj.type)
    };
  }
} satisfies Partial<Record<td.ReflectionKind, (element: td.DeclarationReflection) => any>>;

export async function buildJson(bundleName: string, reflection: td.ProjectReflection, outDir: string) {
  const jsonData = reflection.children.reduce((res, element) => {
    // Ignore 'type_map' exports if they are present
    if (element.name === 'type_map') {
      return res;
    }

    const parser = parsers[element.kind];
    return {
      ...res,
      [element.name]: parser
        ? parser(element)
        : { kind: 'unknown' }
    };
  }, {});

  await fs.writeFile(`${outDir}/json/${bundleName}.json`, JSON.stringify(jsonData, null, 2));
}
