import type { Identifier, ImportDeclaration } from 'acorn';
import { parse } from 'acorn-loose';
import type { Program } from 'estree';
import { parseError, type Context } from 'js-slang';
import * as monaco from 'monaco-editor';
import { getBundleDocsUsingVite } from '../sideContent/importers/importers';
import { getProgramNames } from './name-extractor';

export interface FunctionDocumentation {
  kind: 'function';
  retType: string;
  description: string;
  params: [name: string, type: string][];
}

export interface VariableDocumentation {
  kind: 'variable';
  type: string;
  description: string;
}

export interface UnknownDocumentation {
  kind: 'unknown';
}
export type ModuleDocsEntry = FunctionDocumentation | VariableDocumentation | UnknownDocumentation;

type SuggestionItem = Omit<monaco.languages.CompletionItem, 'range'>;

function docsToHtml(importedName: string, obj: ModuleDocsEntry): string {
  switch (obj.kind) {
    case 'function': {
      let paramStr: string;

      if (obj.params.length === 0) {
        paramStr = '()';
      } else {
        paramStr = `(${obj.params.map(([name, type]: any) => `${name}: ${type}`).join(', ')})`;
      }

      const header = `${importedName}${paramStr} → {${obj.retType}}`;
      return header;
      // return `<div><h4>${header}</h4><div class="description">${nameStr}${obj.description}</div></div>`;
    }
    case 'variable':
      return `const ${importedName}: ${obj.type}`;
    case 'unknown':
      return 'Import';
  }
}

async function getSuggestionsForModule(
  moduleName: string,
  { specifiers, loc }: ImportDeclaration
): Promise<SuggestionItem[]> {
  const { default: docs } = await getBundleDocsUsingVite(moduleName);
  const alreadyImportedNames = specifiers
    .filter(each => each.type === 'ImportSpecifier')
    .map(({ imported }) => (imported as Identifier).name);

  const docEntries = Object.entries(docs as Record<string, ModuleDocsEntry>);
  const lastSpecifier = specifiers[specifiers.length - 1];

  return docEntries.map(([name, value]): any => ({
    kind: value.kind === 'function'
      ? monaco.languages.CompletionItemKind.Function
      : monaco.languages.CompletionItemKind.Constant,
    label: name,
    insertText: name,
    filterText: name,
    sortText: name,
    documentation: {
      supportHtml: true,
      value: (value as any).description ?? 'No description available'
    },
    detail: docsToHtml(name, value),
    additionalTextEdits:
      specifiers.length === 0
        ? [{
          range: {
            startColumn: loc!.start.column,
            startLineNumber: loc!.start.line,
            endColumn: loc!.end.column,
            endLineNumber: loc!.end.line,
          },
          text: `import { ${name} } from '${moduleName}';`
        }]
        : alreadyImportedNames.includes(name)
          ? []
          : [{
            range: {
              startColumn: lastSpecifier.loc!.end.column + 1,
              startLineNumber: loc!.start.line,
              endLineNumber: loc!.start.line,
              endColumn: lastSpecifier.loc!.end.column + 1,
            },
            forceMoveMarkers: true,
            text: `, ${name}`
          }]
  }));
}

export async function getAutocompletes(row: number, col: number, code: string, context: Context): Promise<SuggestionItem[]> {
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

  const [codeSuggestions, display] = getProgramNames(ast as Program, [], { line: row, column: col }, context);

  if (!display) return [];

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

  const moduleSuggestions = await Promise.all(
    Object.entries(importedModules).map(async ([moduleName, node]) => {
      const suggestions = await getSuggestionsForModule(moduleName, node);
      // console.log(moduleName, suggestions);
      return suggestions;
    })
  );

  return moduleSuggestions.flat().concat(
    codeSuggestions.map((each): SuggestionItem => ({
      ...each,
      sortText: each.score?.toString(),
      insertText: each.label
    }))
  );
}
