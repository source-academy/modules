import { Card } from '@blueprintjs/core';
import MonacoReactEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import modulesManifest from '../../../../build/modules.json' with { type: 'json ' };
import { SOURCE_MONACO_THEME } from './setupMonaco';

interface EditorProps {
  editorValue: string;
  handleEditorValueChange: (newValue: string) => void;
  handlePromptAutocomplete: (
    row: number,
    col: number,
  ) => Promise<monaco.languages.CompletionList>;
}

const moduleSuggestions = Object.keys(modulesManifest).map((each): Partial<monaco.languages.CompletionItem> => ({
  kind: monaco.languages.CompletionItemKind.Module,
  label: each,
  insertText: `import { } from '${each}';`,
  documentation: `${each} module`,
  detail: `${each} module`,
}));

export default function Editor(props: EditorProps) {
  return (
    <div className="editor-container">
      <Card className="Editor">
        <div className="row editor-react-ace" data-testid="Editor">
          <MonacoReactEditor
            className="react-ace"
            height="100%"
            width="100%"
            path='file:///source.js'
            value={props.editorValue}
            onChange={value => {
              props.handleEditorValueChange(value ?? '');
            }}
            language='javascript'
            options={{
              fontFamily: "'Inconsolata', 'Consolas', monospace",
              fontSize: 17,
              folding: false,
              glyphMargin: false,
              // hover: { enabled: false },
              lineHeight: 17,
              lineNumbersMinChars: 4,
              minimap: { enabled: false },
              renderLineHighlight: 'none',
              scrollBeyondLastLine: false,
              suggest: {
                showKeywords: false
              }
            }}
            theme={SOURCE_MONACO_THEME}
            beforeMount={(m: typeof monaco) => {
              m.typescript.javascriptDefaults.setEagerModelSync(true);
              m.typescript.javascriptDefaults.setCompilerOptions({
                module: monaco.typescript.ModuleKind.ESNext,
                target: monaco.typescript.ScriptTarget.ES2020,
                allowJs: true,
                noLib: true
              });

              m.languages.registerCompletionItemProvider('javascript', {
                async provideCompletionItems(model, position) {
                  const results = await props.handlePromptAutocomplete(position.lineNumber, position.column);
                  return {
                    suggestions: [
                      ...results.suggestions,
                    ],
                    incomplete: results.incomplete
                  };
                },
              });
            }}
          />
        </div>
      </Card>
    </div>
  );
}
