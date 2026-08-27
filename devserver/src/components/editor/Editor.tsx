import { Card } from '@blueprintjs/core';
import { require as acequire, type Ace } from 'ace-builds';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'js-slang/dist/editors/ace/theme/source';
import React from 'react';
import AceEditor, { type IAceEditorProps } from 'react-ace';
import { modeString, selectMode } from '../utils/AceHelper';
import type { KeyFunction } from './EditorHotkeys';

export type EditorKeyBindingHandlers = { [key in KeyFunction]?: () => void };

type Position = {
  row: number;
  column: number;
};

type DispatchProps = {
  handleDeclarationNavigate: (cursorPosition: Position) => void;
  handleEditorEval: () => void;
  handlePromptAutocomplete: (row: number, col: number, callback: any) => void;
  handleSendReplInputToOutput?: (newOutput: string) => void;
};

export type EditorStateProps = {
  newCursorPosition?: Position;
  editorValue: string;
  handleEditorValueChange: (newCode: string) => void;
};

export type EditorProps = DispatchProps & EditorStateProps;

const makeCompleter = (handlePromptAutocomplete: DispatchProps['handlePromptAutocomplete']) => ({
  getCompletions(
    _editor: Ace.Editor,
    _session: Ace.EditSession,
    pos: Ace.Point,
    prefix: string,
    callback: () => void
  ) {
    // Don't prompt if prefix starts with number
    if (prefix && /\d/u.test(prefix.charAt(0))) {
      callback();
      return;
    }

    // Cursor col is insertion location i.e. last char col + 1
    handlePromptAutocomplete(pos.row + 1, pos.column, callback);
  }
});

const moveCursor = (editor: AceEditor['editor'], position: Position) => {
  editor.selection.clearSelection();
  editor.moveCursorToPosition(position);
  editor.renderer.showCursor();
  editor.renderer.scrollCursorIntoView(position, 0.5);
};

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
  const reactAceRef: React.MutableRefObject<AceEditor | null> = React.useRef(null);

  // Refs for things that technically shouldn't change... but just in case.
  const handlePromptAutocompleteRef = React.useRef(props.handlePromptAutocomplete);

  const editor = reactAceRef.current?.editor;

  // this function defines the Ace language and highlighting mode for the
  // given combination of chapter, variant and external library. it CANNOT be
  // put in useEffect as it MUST be called before the mode is set on the Ace
  // editor, and use(Layout)Effect runs after that happens.
  //
  // this used to be in useMemo, but selectMode now checks if the mode is
  // already defined and doesn't do it, so it is now OK to keep calling this
  // unconditionally.
  selectMode();

  React.useLayoutEffect(() => {
    if (editor === undefined) {
      return;
    }
    // NOTE: Everything in this function is designed to run exactly ONCE per instance of react-ace.
    // The () => ref.current() are designed to use the latest instance only.

    // Start autocompletion
    acequire('ace/ext/language_tools')
      .setCompleters([
        makeCompleter((...args) => handlePromptAutocompleteRef.current(...args))
      ]);
  }, [editor]);

  React.useLayoutEffect(() => {
    if (editor === undefined) {
      return;
    }
    const newCursorPosition = props.newCursorPosition;
    if (newCursorPosition) {
      moveCursor(editor, newCursorPosition);
    }
  }, [editor, props.newCursorPosition]);

  const aceEditorProps: IAceEditorProps = {
    className: 'react-ace',
    editorProps: {
      $blockScrolling: Infinity
    },
    fontSize: 17,
    height: '100%',
    highlightActiveLine: false,
    mode: modeString,
    theme: 'source',
    value: props.editorValue,
    width: '100%',
    setOptions: {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontFamily: "'Inconsolata', 'Consolas', monospace"
    },
    // keyboardHandler: props.editorBinding,
    onChange(newCode) {
      if (reactAceRef.current) props.handleEditorValueChange(newCode);
    },
    commands: [
      {
        name: 'evaluate',
        bindKey: {
          win: 'Shift-Enter',
          mac: 'Shift-Enter'
        },
        exec: props.handleEditorEval
      }
    ]
  };

  return (
    <div className="editor-container">
      <Card className="Editor">
        <div className="row editor-react-ace" data-testid="Editor">
          <AceEditor {...aceEditorProps} ref={reactAceRef} />
        </div>
      </Card>
    </div>
  );
};

export default Editor;
