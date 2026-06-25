import fs from 'fs/promises';
import { Parser } from 'acorn';
import { tsPlugin } from 'acorn-typescript';
import * as td from 'typedoc';
import { buildJson } from './json';

const markdownRegex = /^```[jt]sx?([\s\S]*)```\s*$/;
const parser = Parser.extend(tsPlugin() as any);

/**
 * Checks the declaration's comment for `@example` tags and validates their contents
 * to make sure that they are valid Javascript
 *
 * @returns True if there is an example that doesn't validate, false otherwise
 */
function getInvalidExamples(comment: td.Comment): string[] {
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
function validateModuleEntry(decl: td.DeclarationReflection, logger: td.Logger) {
  if (decl.kind === td.ReflectionKind.Function) {
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
        logger.validationWarning(`${decl.name} has an example tag that did not validate: ${example}`);
      });
    }
  } else if (decl.kind === td.ReflectionKind.Variable) {
    if (decl.signatures?.length) {
      logger.validationWarning(`${decl.name} is typed as a Variable, but function signatures were detected. Did you forget a @function tag?`);
    }

    if (decl.comment) {
      const invalidExamples = getInvalidExamples(decl.comment);
      invalidExamples.forEach(example => {
        logger.validationWarning(`${decl.name} has an example tag that did not validate: ${example}`);
      });
    }

    if (decl.type instanceof td.ReflectionType) {
      const { declaration: { signatures } } = decl.type;
      if (signatures?.length) {
        logger.validationWarning(`${decl.name} is typed as a Variable, but function signatures were detected. Did you forget a @function tag?`);
      }
    }
  }
}

/**
 * Default entry point for Typedoc plugins
 */
export default function load(app: td.Application) {
  app.options.addDeclaration({
    name: 'source-json',
    outputShortcut: 'source-json',
    help: () => td.i18n.help_out(),
    hint: td.ParameterHint.File,
    type: td.ParameterType.Path
  });

  app.outputs.addOutput('source-json', async (path, project) => {
    const jsonData = buildJson(project);
    await fs.writeFile(path, JSON.stringify(jsonData, null, 2));
  });

  // Make sure that type guards get replaced with the appropriate intrinsic types
  app.converter.on(td.Converter.EVENT_CREATE_SIGNATURE, (_ctx, signature) => {
    if (signature.type instanceof td.PredicateType) {
      if (signature.type.asserts) {
        signature.type = new td.IntrinsicType('void');
      } else {
        signature.type = new td.IntrinsicType('boolean');
      }
    }
  });

  // Removes defaultValues unless the tag is specified
  app.converter.on(td.Converter.EVENT_CREATE_DECLARATION, (_ctx, decl) => {
    if (decl.kind !== td.ReflectionKind.Variable) return;
    const tags = decl.comment?.getTags('@defaultValue');
    // If there was a defaultValue tag used, then keep the value in the output
    if (tags?.length) return;

    decl.defaultValue = undefined;
  });

  // Conduct the validation after the project has been processed
  app.on(td.Application.EVENT_VALIDATE_PROJECT, project => {
    project.children?.forEach(each => validateModuleEntry(each, app.logger));
  });
}
