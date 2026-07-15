import fs from 'fs/promises';
import * as td from 'typedoc';
import { buildJson } from './json';
import { validateModuleEntry } from './validation';

/**
 * Default entry point for the plugin
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
    if (signature.type?.type === 'predicate') {
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
    if (tags?.length) {
      // If there was a defaultValue tag used, then keep the value in the output
      // but remove the tags so the weird defaultValue block
      // doesn't get rendered

      decl.comment?.removeTags('@defaultValue');
      return;
    }

    decl.defaultValue = undefined;
  });

  // Conduct the validation after the project has been processed
  app.on(td.Application.EVENT_VALIDATE_PROJECT, project => {
    project.children?.forEach(each => validateModuleEntry(each, app.logger));
  });
}
