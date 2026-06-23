import { Card } from '@blueprintjs/core';
import MonacoReactEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { SOURCE_MONACO_THEME } from './setupMonaco';

interface EditorProps {
  editorValue: string;
  handleEditorValueChange: (newValue: string) => void;
  handlePromptAutocomplete: (
    row: number,
    col: number,
  ) => Promise<monaco.languages.CompletionList>;
}

export default function Editor(props: EditorProps) {
  return (
    <div className="editor-container">
      <Card className="Editor">
        <div className="row editor-react-ace" data-testid="Editor">
          <MonacoReactEditor
            className="react-ace"
            height="100%"
            width="100%"
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
              hover: { enabled: false },
              lineHeight: 17,
              lineNumbersMinChars: 4,
              minimap: { enabled: false },
              renderLineHighlight: 'none',
              scrollBeyondLastLine: false,
              suggest: {
                showKeywords: true
              }
              // suggest: {
              //   showClasses: false,
              //   showInterfaces: false,
              // },
              // wordBasedSuggestions: 'currentDocument'
            }}
            theme={SOURCE_MONACO_THEME}
            beforeMount={(m: typeof monaco) => {
              m.typescript.javascriptDefaults.setCompilerOptions({
                target: monaco.typescript.ScriptTarget.ES2020,
                noLib: true
              });

              // m.languages.registerCompletionItemProvider('javascript', {
              //   provideCompletionItems(_model, position) {
              //     return props.handlePromptAutocomplete(position.lineNumber, position.column);
              //   },
              // });
            }}
          />
        </div>
      </Card>
    </div>
  );
}
