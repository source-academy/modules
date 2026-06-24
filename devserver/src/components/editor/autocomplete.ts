import type { ImportDeclaration } from 'acorn';
import { parse } from 'acorn-loose';
import { parseError, type Context } from 'js-slang';
import * as monaco from 'monaco-editor';
import curveDocs from '../../../../build/jsons/curve.json' with { type: 'json' };

export async function getAutocompletes(
  code: string,
  context: Context,
  line: number,
  col: number
): Promise<monaco.languages.CompletionItem[]> {
  const ast = parse(code, {
    sourceType: 'module',
    ecmaVersion: 6,
    locations: true
  });

  if (!ast) {
    const errStr = parseError(context.errors);
    console.error(errStr);

    return [];
  }

  const importedModules: Record<string, ImportDeclaration> = {};

  for (const stmt of ast.body) {
    if (stmt.type === 'ImportDeclaration') {
      const source = stmt.source.value;
      if (typeof source !== 'string') continue;

      if (!(source in importedModules)) {
        importedModules[source] = stmt;
      }
    }
  }

  const { specifiers } = importedModules['curve'];
  const firstSpecifier = specifiers[specifiers.length - 1];
  console.log('specifier is', firstSpecifier);

  const output: monaco.languages.CompletionItem[] = [];
  Object.entries(curveDocs).forEach(([name, value]) => output.push({
    kind: monaco.languages.CompletionItemKind.Constant,
    label: name,
    insertText: name,
    documentation: {
      supportHtml: true,
      // @ts-expect-error hidden property
      value: value.docHTML
    },
    detail: 'Import from curve',
    range: {
      startColumn: col,
      startLineNumber: line,
      endColumn: col + name.length,
      endLineNumber: line
    },
    additionalTextEdits: [{
      range: {
        startColumn: firstSpecifier.loc!.end.column,
        startLineNumber: importedModules['curve'].loc!.start.line,
        endLineNumber: importedModules['curve'].loc!.start.line,
        endColumn: firstSpecifier.loc!.end.column + name.length + 2,
      },
      forceMoveMarkers: true,
      text: `, ${name}`
    }]
  }));

  // await Promise.all([...importedModules].map(async moduleName => {
  //   if (moduleName === 'curve') {

  //   }

  //   const { default: docs } = await import(/* @vite-ignore */ `../../../../build/jsons/${moduleName}.json`, { with: { type: 'json' } });
  //   Object.entries(docs).forEach(([name, value]) => output.push({
  //     kind: monaco.languages.CompletionItemKind.Constant,
  //     label: name,
  //     insertText: name,
  //     documentation: {
  //       supportHtml: true,
  //       // @ts-expect-error hidden property
  //       value: value.docHTML
  //     },
  //     detail: `Import from ${moduleName}`,
  //   }));
  // }));

  return output;
}
