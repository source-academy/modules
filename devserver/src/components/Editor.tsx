/* eslint-disable simple-import-sort/imports */
import { Ace, createEditSession, require as acequire } from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'js-slang/dist/editors/ace/theme/source';

import { Chapter, Variant } from 'js-slang/dist/types';
import * as React from 'react';
import AceEditor, { IAceEditorProps, IEditorProps } from 'react-ace';
import * as AceBuilds from 'ace-builds';
import { HotKeys } from 'react-hotkeys';

import { keyBindings, KeyFunction } from './EditorHotkeys';
import { AceMouseEvent, HighlightedLines, Position } from './EditorTypes';

import { getModeString, selectMode } from './utils/AceHelper';
import { EditorBinding } from '../WorkspaceSettingsContext';

export type EditorKeyBindingHandlers = { [name in KeyFunction]?: () => void };

export type EditorProps = DispatchProps & EditorStateProps & EditorTabStateProps & OnEvent;

type DispatchProps = {
  handleDeclarationNavigate: (cursorPosition: Position) => void;
  handleEditorEval: () => void;
  handleEditorValueChange: (editorTabIndex: number, newEditorValue: string) => void;
  handlePromptAutocomplete: (row: number, col: number, callback: any) => void;
  handleSendReplInputToOutput?: (newOutput: string) => void;
};

type EditorStateProps = {
  editorSessionId: string;
  isEditorAutorun: boolean;
  sourceChapter?: Chapter;
  externalLibraryName?: string;
  sourceVariant?: Variant;
  editorBinding?: EditorBinding;
};

export type EditorTabStateProps = {
  editorTabIndex: number;
  filePath?: string;
  editorValue: string;
  breakpoints: string[];
  newCursorPosition?: Position;
};

type OnEvent = {
  onSelectionChange?: (value: any, event?: any) => void;
  onCursorChange?: (value: any, event?: any) => void;
  onInput?: (event?: any) => void;
  onLoad?: (editor: Ace.Editor) => void;
  onValidate?: (annotations: Ace.Annotation[]) => void;
  onBeforeLoad?: (ace: typeof AceBuilds) => void;
  onChange?: (value: string, event?: any) => void;
  onSelection?: (selectedText: string, event?: any) => void;
  onCopy?: (value: string) => void;
  onPaste?: (value: string) => void;
  onFocus?: (event: any, editor?: Ace.Editor) => void;
  onBlur?: (event: any, editor?: Ace.Editor) => void;
  onScroll?: (editor: IEditorProps) => void;
};

const EventT: Array<keyof OnEvent> = [
  'onSelectionChange',
  'onCursorChange',
  'onInput',
  'onLoad',
  'onValidate',
  'onBeforeLoad',
  'onChange',
  'onSelection',
  'onCopy',
  'onPaste',
  'onFocus',
  'onBlur',
  'onScroll'
];

const makeCompleter = (handlePromptAutocomplete: DispatchProps['handlePromptAutocomplete']) => ({
  getCompletions: (
    editor: Ace.Editor,
    session: Ace.EditSession,
    pos: Ace.Point,
    prefix: string,
    callback: () => void
  ) => {
    // Don't prompt if prefix starts with number
    if (prefix && /\d/.test(prefix.charAt(0))) {
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

/* Override handler, so does not trigger when focus is in editor */
const handlers = {
  goGreen: () => {}
};

const EditorBase = React.memo((props: EditorProps) => {
  const reactAceRef: React.MutableRefObject<AceEditor | null> = React.useRef(null);
  const [filePath, setFilePath] = React.useState<string | undefined>(undefined);

  // Refs for things that technically shouldn't change... but just in case.
  const handlePromptAutocompleteRef = React.useRef(props.handlePromptAutocomplete);

  const editor = reactAceRef.current?.editor;
  // Set edit session history when switching to another editor tab.
  if (editor !== undefined) {
    if (filePath !== props.filePath) {
      // Unfortunately, the current editor sets the mode globally.
      // The side effects make it very hard to ensure that the correct
      // mode is set for every EditSession. As such, we add this one
      // line to always propagate the mode whenever we set a new session.
      // See AceHelper#selectMode for more information.
      props.session.setMode(editor.getSession().getMode());
      editor.setSession(props.session);
      /* eslint-disable */

      // Add changeCursor event listener onto the current session.
      // In ReactAce, this event listener is only bound on component
      // mounting/creation, and hence changing sessions will need rebinding.
      // See react-ace/src/ace.tsx#263,#460 for more details. We also need to
      // ensure that event listener is only bound once to prevent memory leaks.
      // We also need to check non-documented property _eventRegistry to
      // see if the changeCursor listener event has been added yet.

      // @ts-ignore
      if (editor.getSession().selection._eventRegistry.changeCursor.length < 2) {
        editor.getSession().selection.on('changeCursor', reactAceRef.current!.onCursorChange);
      }

      /* eslint-enable */
      // Give focus to the editor tab only after switching from another tab.
      // This is necessary to prevent 'unstable_flushDiscreteUpdates' warnings.
      if (filePath !== undefined) {
        editor.focus();
      }
      setFilePath(props.filePath);
    }
  }

  React.useEffect(() => {
    handlePromptAutocompleteRef.current = props.handlePromptAutocomplete;
  }, [props.handlePromptAutocomplete]);

  // Handles input into AceEditor causing app to scroll to the top on iOS Safari
  React.useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  const [sourceChapter, sourceVariant, externalLibraryName] = [
    props.sourceChapter || Chapter.SOURCE_1,
    props.sourceVariant || Variant.DEFAULT,
    props.externalLibraryName || 'NONE'
  ];

  // this function defines the Ace language and highlighting mode for the
  // given combination of chapter, variant and external library. it CANNOT be
  // put in useEffect as it MUST be called before the mode is set on the Ace
  // editor, and use(Layout)Effect runs after that happens.
  //
  // this used to be in useMemo, but selectMode now checks if the mode is
  // already defined and doesn't do it, so it is now OK to keep calling this
  // unconditionally.
  selectMode(sourceChapter, sourceVariant, externalLibraryName);

  React.useLayoutEffect(() => {
    if (editor === undefined) {
      return;
    }
    // NOTE: Everything in this function is designed to run exactly ONCE per instance of react-ace.
    // The () => ref.current() are designed to use the latest instance only.

    // Start autocompletion
    acequire('ace/ext/language_tools').setCompleters([
      makeCompleter((...args) => handlePromptAutocompleteRef.current(...args))
    ]);
  }, [editor, props.editorTabIndex]);

  React.useLayoutEffect(() => {
    if (editor === undefined) {
      return;
    }
    const newCursorPosition = props.newCursorPosition;
    if (newCursorPosition) {
      moveCursor(editor, newCursorPosition);
    }
  }, [editor, props.newCursorPosition]);

  const {
    handleEditorValueChange,
    isEditorAutorun,
    handleEditorEval
  } = props;
  const keyHandlers: EditorKeyBindingHandlers = {
    evaluate: handleEditorEval
  };

  const aceEditorProps: IAceEditorProps = {
    className: 'react-ace',
    editorProps: {
      $blockScrolling: Infinity
    },
    // markers: React.useMemo(() => getMarkers(props.highlightedLines), [props.highlightedLines]),
    fontSize: 17,
    height: '100%',
    highlightActiveLine: false,
    mode: getModeString(sourceChapter, sourceVariant, externalLibraryName),
    theme: 'source',
    value: props.editorValue,
    width: '100%',
    setOptions: {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontFamily: "'Inconsolata', 'Consolas', monospace"
    },
    keyboardHandler: props.editorBinding
  };

  const { onChange } = aceEditorProps;

  aceEditorProps.onChange = React.useCallback(
    (newCode: string, delta: Ace.Delta) => {
      if (!reactAceRef.current) {
        return;
      }

      // Write editor state for the active editor tab to the store.
      handleEditorValueChange(props.editorTabIndex, newCode);

      const annotations = reactAceRef.current.editor.getSession().getAnnotations();
      if (isEditorAutorun && annotations.length === 0) {
        handleEditorEval();
      }
      if (onChange !== undefined) {
        onChange(newCode, delta);
      }
    },
    [
      handleEditorValueChange,
      props.editorTabIndex,
      isEditorAutorun,
      onChange,
      handleEditorEval
    ]
  );

  aceEditorProps.commands = Object.entries(keyHandlers)
    .filter(([_, exec]) => exec)
    .map(([name, exec]) => ({ name, bindKey: keyBindings[name], exec: exec! }));

  // Merge in .onEvent ace editor props
  // This prevents user errors such as
  // TRYING TO ADD AN ONCHANGE PROP WHICH KILLS THE ABOVE ONCHANGE.
  // **triggered**
  EventT.forEach(eventT => {
    const propFn = props[eventT];
    if (propFn) {
      /* eslint-disable */

      const currFn = aceEditorProps[eventT];
      if (!currFn) {
        // Typescript isn't smart enough to know that the types of both LHS/RHS are the same.
        // @ts-ignore
        aceEditorProps[eventT] = propFn;
      } else {
        aceEditorProps[eventT] = function (...args: any[]) {
          // Impossible to define a function which takes in the arbitrary number of correct arguments...
          // @ts-ignore
          currFn(...args);
          // @ts-ignore
          propFn(...args);
        };
      }
      /* eslint-enable */
    }
  });

  return (
    <HotKeys className="Editor bp4-card bp4-elevation-0" handlers={handlers}>
      <div className="row editor-react-ace" data-testid="Editor">
        <AceEditor {...aceEditorProps} ref={reactAceRef} />
      </div>
    </HotKeys>
  );
});

const Editor: React.FC<EditorProps> = (props: EditorProps) => {
  // const [sessions, setSessions] = React.useState<Record<string, Ace.EditSession>>({});
  const [editorValue, setEditorValue] = React.useState('');

  const reactAceRef: React.MutableRefObject<AceEditor | null> = React.useRef(null);

  // Create new edit session.
  const defaultMode = acequire('ace/mode/javascript').Mode();
  const defaultEditSession = createEditSession(props.editorValue, defaultMode);

  const aceEditorProps: IAceEditorProps = {
    className: 'react-ace',
    editorProps: {
      $blockScrolling: Infinity
    },
    // markers: React.useMemo(() => getMarkers(props.highlightedLines), [props.highlightedLines]),
    fontSize: 17,
    height: '100%',
    highlightActiveLine: false,
    mode: getModeString(Chapter.SOURCE_4, Variant.DEFAULT, ''),
    theme: 'source',
    value: editorValue,
    width: '100%',
    setOptions: {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontFamily: "'Inconsolata', 'Consolas', monospace"
    },
    keyboardHandler: props.editorBinding,
    onChange: (newCode) => {
      if (reactAceRef.current) setEditorValue(newCode);
    },
  };


  return (
    <HotKeys className="Editor bp4-card bp4-elevation-0" handlers={handlers}>
      <div className="row editor-react-ace" data-testid="Editor">
        <AceEditor {...aceEditorProps} ref={reactAceRef} />
      </div>
    </HotKeys>
  );
};

export default Editor;
