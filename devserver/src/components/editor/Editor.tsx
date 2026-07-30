import MonacoEditor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import { forwardRef } from 'react';
import { SOURCE_MONACO_THEME } from './setupMonaco';

interface EditorProps {
  defaultValue?: string;
  language?: string;
  handleEditorValueChange?: (newValue: string) => void;
}

const Editor = forwardRef<monaco.editor.IStandaloneCodeEditor, EditorProps>((props, ref) => {
  return <MonacoEditor
    defaultValue={props.defaultValue}
    path='file:///main.txt'
    language={props.language}
    theme={SOURCE_MONACO_THEME}
    options={{
      fontFamily: "'Inconsolata', 'Consolas', monospace",
      fontSize: 17,
      minimap: {
        enabled: false
      },
      scrollbar: {
        useShadows: false
      }
    }}
    onMount={editor => {
      if (typeof ref === 'function') ref(editor);
      else if (ref) ref.current = editor;
    }}
    onChange={newValue => props.handleEditorValueChange?.(newValue ?? '')}
  />;
});

Editor.displayName = 'Editor';

export default Editor;
