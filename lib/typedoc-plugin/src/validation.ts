import { Parser } from 'acorn';
import { tsPlugin } from 'acorn-typescript';
import * as td from 'typedoc';

const markdownRegex = /^`{3}(?:[jt]sx?)?([\s\S]*)`{3}\s*$/gm;
const parser = Parser.extend(tsPlugin() as any);

/**
 * Checks the declaration's comment for `@example` tags and validates their contents
 * to make sure that they are valid Javascript
 *
 * @returns Array of examples that didn't validate properly
 */
export function getInvalidExamples(comment: td.Comment): string[] {
  const parts = comment.blockTags;

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

/**
 * Checks that the given Declaration:
 * 1. If it is a function, has exactly 1 signature
 * 2. If it is a variable, it or its type doesn't have function signatures
 * 3. If there are code examples, that the code in the example is valid Typescript
 */
export function validateModuleEntry(decl: td.DeclarationReflection, logger: td.Logger) {
  switch (decl.kind) {
    case td.ReflectionKind.Function: {
      if (decl.signatures === undefined) {
        logger.error(`Function ${decl.name} has 0 signatures!`);
        return;
      }

      if (decl.signatures.length > 1) {
        logger.validationWarning(`Function ${decl.name} has more than 1 signature; only using the first one`);
        return;
      }

      const [signature] = decl.signatures;

      if (signature.comment) {
        const invalidExamples = getInvalidExamples(signature.comment);
        invalidExamples.forEach(example => {
          logger.validationWarning(`${decl.name} has an example tag that did not validate:\n ${example}`);
        });
      }
      break;
    }
    case td.ReflectionKind.Variable: {
      if (!decl.type) {
        logger.error(`Variable ${decl.name} has no type!`);
        return;
      }

      if (decl.signatures?.length) {
        logger.validationWarning(`${decl.name} is typed as a Variable, but function signatures were detected. Did you forget a @function tag?`);
      }

      if (decl.comment) {
        const invalidExamples = getInvalidExamples(decl.comment);
        invalidExamples.forEach(example => {
          logger.validationWarning(`${decl.name} has an example tag that did not validate: ${example}`);
        });
      }

      if (decl.type.type === 'reflection') {
        const { declaration: { signatures } } = decl.type;
        if (signatures?.length) {
          logger.validationWarning(`${decl.name} is typed as a Variable, but function signatures were detected. Did you forget a @function tag?`);
        }
      }
      break;
    }
    default: {
      const kindName = td.ReflectionKind[decl.kind];
      logger.validationWarning(`${decl.name} is a ${kindName}, which is not supported.`);
      break;
    }
  }
}
