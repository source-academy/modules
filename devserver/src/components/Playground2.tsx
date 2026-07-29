import { Classes, OverlayToaster } from '@blueprintjs/core';
import type { ILanguageDefinition } from '@sourceacademy/language-directory/dist/types';
import { getLanguageDefinition } from '@sourceacademy/language-directory/dist/util';
import classNames from 'classnames';
import { throttle } from 'es-toolkit';
import type * as monaco from 'monaco-editor';
import React from 'react';
import type { WorkspaceProps } from './Workspace';
import Workspace from './Workspace';
import { createPreparedConductor, type PreparedConductor } from './conductor';
import { evaluatorDefinitionsByLanguage, languageMap } from './conductor/evaluators';
import { ControlBarClearButton } from './controlBar/ControlBarClearButton';
import { ControlBarRunButton } from './controlBar/ControlBarRunButton';

const updateEditorLocalStorageValue = throttle((newValue: string) => {
  localStorage.setItem('editorValue', newValue);
}, 100);

const languageNames = Object.keys(evaluatorDefinitionsByLanguage);

function useLanguageAndEvaluator(
  editor: monaco.editor.IStandaloneCodeEditor | null,
): [ILanguageDefinition, PreparedConductor | null, (lang: string) => void, (index: number) => void] {
  const [language, setLanguage] = React.useState(localStorage.getItem('defaultLang') ?? languageNames[0]);
  const [conductor, setConductor] = React.useState<PreparedConductor | null>(null);

  const setNewEvaluator = (lang: string, idx: number) => {
    const evaluator = evaluatorDefinitionsByLanguage[lang][idx];
    createPreparedConductor(
      evaluator.path,
      () => Promise.resolve(editor?.getModel()?.getValue())
    ).then(setConductor);
  };

  React.useEffect(() => {
    // Load defaultLang on mount
    setNewEvaluator(languageNames[0], 0);
  }, []);

  return [
    getLanguageDefinition(languageMap, language)!,
    conductor,
    lang => {
      if (lang === language) return;
      setLanguage(lang);
      setNewEvaluator(lang, 0);
      localStorage.setItem('defaultLang', lang);
    },
    idx => setNewEvaluator(language, idx)
  ];
}

export default function Playground2() {
  const toaster = React.useRef<OverlayToaster>(null);

  const [editorValue, setEditorValue] = React.useState(localStorage.getItem('editorValue') ?? '');
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const [
    language,
    conductor,
    setLanguage,
    setEvaluatorIndex
  ] = useLanguageAndEvaluator(editorRef.current);

  function evalCode() {
    if (!conductor) return;

    conductor.hostPlugin.startEvaluator('/main.py');
  }

  function resetEditor() {
    setEditorValue('');
    localStorage.removeItem('editorValue');

    // editorRef?.current?.getModel()?.setValue();
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
