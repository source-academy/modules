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

// List of command IDs to retain within the
// context menu
const commandsIdsToKeep = [
  'editor.action.goToReferences',
  'editor.action.clipboardCopyAction',
  'editor.action.clipboardCutAction',
  'editor.action.clipboardPasteAction',
  'editor.action.rename',
  'editor.action.revealDefinition',
  'vs.actions.separator'
];

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
                showKeywords: false,
                showModules: false
              },
              wordBasedSuggestions: 'off',
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
                async provideCompletionItems(_model, position) {
                  const items = await props.handlePromptAutocomplete(position.lineNumber, position.column);
                  console.log(items);
                  return items;
                },
              });
            }}
            onMount={editor => {
              // Remove unnecessary context menu options
              // Solution taken from here: https://github.com/microsoft/monaco-editor/issues/1280
              const contextmenu: any = editor.getContribution('editor.contrib.contextmenu');
              const originalMethod = contextmenu._getMenuActions;
              contextmenu._getMenuActions = (...args: any[]) => {
                const items = originalMethod.apply(contextmenu, args);
                console.log(items);
                return items.filter(({ id }: any) => commandsIdsToKeep.includes(id));
              };

              // Remove the command palette keyboard shortcut
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => { });
            }}
          />
        </div>
      </Card>
    </div>
  );
}
