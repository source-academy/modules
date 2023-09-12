// Necessary to prevent "ReferenceError: ace is not defined" error.
// See https://github.com/securingsincity/react-ace/issues/1233 (although there is no explanation).
import 'ace-builds/src-noconflict/ace';
// For webpack to resolve properly during lazy loading (see https://github.com/source-academy/frontend/issues/2543)
import 'ace-builds/webpack-resolver';

import _ from 'lodash';
import React from 'react';

import { EditorTabState } from '../workspace/WorkspaceTypes';
import { WorkspaceSettingsContext } from '../WorkspaceSettingsContext';
import Editor, { EditorProps, EditorTabStateProps } from './Editor';

type OwnProps = {
  baseFilePath?: string;
  isFolderModeEnabled: boolean;
  activeEditorTabIndex: number | null;
  setActiveEditorTabIndex: (activeEditorTabIndex: number | null) => void;
  removeEditorTabByIndex: (editorTabIndex: number) => void;
  editorTabs: EditorTabStateProps[];
};

export type EditorContainerProps = Omit<EditorProps, keyof EditorTabStateProps> &
  OwnProps & {
    editorVariant: 'normal';
  };


export const convertEditorTabStateToProps = (
  editorTab: EditorTabState,
  editorTabIndex: number
): EditorTabStateProps => {
  return {
    editorTabIndex,
    editorValue: editorTab.value,
    ..._.pick(editorTab, 'filePath', 'highlightedLines', 'breakpoints', 'newCursorPosition')
  };
};

const createNormalEditorTab =
  (editorProps: Omit<EditorProps, keyof EditorTabStateProps>) =>
  (editorTabStateProps: EditorTabStateProps) => {
    return <Editor {...editorProps} {...editorTabStateProps} />;
  };

const EditorContainer: React.FC<EditorContainerProps> = (props: EditorContainerProps) => {

  const createEditorTab = createNormalEditorTab(editorProps);
  return (
    <div className="editor-container">
      {createEditorTab(editorTabs[activeEditorTabIndex])}
    </div>
  );
};

export default EditorContainer;
