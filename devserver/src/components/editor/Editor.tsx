import MonacoEditor from '@monaco-editor/react';
import { SOURCE_MONACO_THEME } from './setupMonaco';

interface EditorProps {
  defaultValue?: string;
  language?: string;
  handleEditorValueChange?: (newValue: string) => void;
}

export default function Editor(props: EditorProps) {
  return <MonacoEditor
    defaultValue={props.defaultValue}
    path='file:///main.js'
    language='javascript'
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
    onChange={newValue => props.handleEditorValueChange?.(newValue ?? '')}
  />
}
