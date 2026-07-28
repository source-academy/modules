import { Classes, OverlayToaster } from '@blueprintjs/core';
import languageDefinitions from '@sourceacademy/language-directory/dist/directory.json' with { type: 'json' };
import { generateLanguageMap, getEvaluatorDefinition, getLanguageDefinition } from '@sourceacademy/language-directory/dist/util';
import classNames from 'classnames';
import { throttle } from 'es-toolkit';
import type * as monaco from 'monaco-editor';
import React, { useRef } from 'react';
import type { WorkspaceProps } from './Workspace';
import Workspace from './Workspace';
import { ControlBarClearButton } from './controlBar/ControlBarClearButton';
import { ControlBarRunButton } from './controlBar/ControlBarRunButton';

const updateEditorLocalStorageValue = throttle((newValue: string) => {
  localStorage.setItem('editorValue', newValue);
}, 100);

const languageMap = generateLanguageMap(languageDefinitions);

export default function Playground2() {
  const toaster = React.useRef<OverlayToaster>(null);

  const [language, setLanguage] = React.useState('source');
  const [editorValue, setEditorValue] = React.useState(localStorage.getItem('editorValue') ?? '');
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  function evalCode() {
    const langDef = getLanguageDefinition(languageMap, language);
    const evaluator = getEvaluatorDefinition(langDef!, 'pyvml');
  }

  function resetEditor() {
    setEditorValue('');
    localStorage.removeItem('editorValue');

    editorRef?.current?.getModel()?.setValue();
  }

  const workspaceProps: WorkspaceProps = {
    controlBarProps: {
      editorButtons: [
        <ControlBarRunButton handleEditorEval={evalCode} key="eval" />,
        <ControlBarClearButton onClick={resetEditor}
          key="clear"
        />,
      ]
    },
    replProps: {
      output: null
    },
    handleEditorEval: evalCode,
    handleEditorValueChange(newValue) {
      setEditorValue(newValue);
      updateEditorLocalStorageValue(newValue);
    },
    editorValue,
    sideContentProps: {} as any,
    editorRef
    // sideContentProps: {
    //   dynamicTabs: [testTabContent, ...dynamicTabs],
    //   selectedTabId,
    //   onChange: React.useCallback((newId: string) => {
    //     setSelectedTab(newId);
    //     setAlerts(alerts.filter((id) => id !== newId));
    //   }, [alerts]),
    //   alerts
    // }
  };

  return (
    <div className={classNames('Playground', Classes.DARK)}>
      <OverlayToaster ref={toaster} />
      <Workspace {...workspaceProps} />
    </div>
  );
}
