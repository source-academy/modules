import { Classes, Intent, OverlayToaster, type ToastProps } from '@blueprintjs/core';
import { RunnerStatus } from '@sourceacademy/conductor/types';
import languageDir from '@sourceacademy/language-directory/dist/directory.json' with { type: 'json' };
import type { IEvaluatorDefinition, ILanguageDefinition } from '@sourceacademy/language-directory/dist/types';
import { getEvaluatorDefinition, getLanguageDefinition } from '@sourceacademy/language-directory/dist/util';
import classNames from 'classnames';
import { throttle } from 'es-toolkit';
import type * as monaco from 'monaco-editor';
import React from 'react';
import type { InterpreterOutput } from '../types';
import type { WorkspaceProps } from './Workspace';
import Workspace from './Workspace';
import { createPreparedConductor, type PreparedConductor } from './conductor';
import { languageMap } from './conductor/evaluators';
import { ControlBarClearButton } from './controlBar/ControlBarClearButton';
import { ControlBarRunButton } from './controlBar/ControlBarRunButton';
import ControlBarSelect from './controlBar/ControlBarSelect';
import sideContentManager from './sideContent/SideContentManager';
import testTabContent from './sideContent/TestTab';

const errorToast: ToastProps = {
  intent: Intent.DANGER,
  message: 'An error occurred!'
};

const evalSuccessToast: ToastProps = {
  intent: Intent.SUCCESS,
  message: 'Code evaluated successfully!'
};

const updateEditorLocalStorageValue = throttle((newValue: string) => {
  localStorage.setItem('editorValue', newValue);
}, 100);

/**
 * Retrieves the previously selected language from `localStorage`. If the given
 * language doesn't exist in the current language map, return `null`.
 */
function getLangIdFromLocalStorage() {
  const storedId = localStorage.getItem('langId');

  if (storedId == null) return null;
  if (!getLanguageDefinition(languageMap, storedId)) return null;

  return storedId;
}

/**
 * Retrieves the previously selected evaluator from `localStorage`. If there is
 * no current language, or if the current language doesn't support the evaluator,
 * return `null`.
 */
function getEvalIdFromLocalStorage(currentLang: ILanguageDefinition | null | undefined) {
  if (!currentLang) return null;

  const storedId = localStorage.getItem('evaluatorId');
  if (storedId == null) return null;

  if (!getEvaluatorDefinition(currentLang, storedId)) return null;
  return storedId;
}

async function prepareConductor(
  evaluator: IEvaluatorDefinition,
  editor: monaco.editor.IStandaloneCodeEditor | null,
  consoleOutputRef: React.RefObject<string[]>,
  finishCallback: (output: InterpreterOutput) => void
) {
  const conductor = await createPreparedConductor(
    evaluator.path,
    () => Promise.resolve(editor?.getModel()?.getValue())
  );

  conductor.hostPlugin.receiveOutput = msg => {
    consoleOutputRef.current.push(msg);
  };

  conductor.hostPlugin.receiveError = error => {
    finishCallback({
      type: 'errors',
      errors: [error],
      consoleLogs: consoleOutputRef.current,
    });
  };

  conductor.hostPlugin.receiveResult = result => {
    finishCallback({
      type: 'result',
      consoleLogs: consoleOutputRef.current,
      value: result
    });
  };

  return conductor;
}

function translateLanguageName(oldName: string) {
  oldName = oldName.toLowerCase();

  if (oldName.startsWith('python')) return 'python';
  if (oldName.startsWith('source')) return 'javascript';
  if (oldName.startsWith('scheme')) return 'scheme';

  return '';
}

export default function Playground() {
  const toaster = React.useRef<OverlayToaster>(null);

  const showToast = (props: ToastProps) => {
    if (toaster.current) {
      toaster.current.show({
        ...props,
        timeout: 15000
      });
    }
  };

  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [languageId, rawSetLanguageId] = React.useState<string | null>(getLangIdFromLocalStorage());

  function setLanguageId(newId: string) {
    if (newId === languageId) return;
    rawSetLanguageId(newId);
    localStorage.setItem('langId', newId);

    const newLangDef = getLanguageDefinition(languageMap, newId)!;

    if (evaluatorId !== null) {
      const currentEvaluator = getEvaluatorDefinition(newLangDef, evaluatorId);
      if (!currentEvaluator) {
        // We changed to a language that doesn't contain the current evaluator
        setEvaluatorId(null);
      }
    }
  }

  const languageDef = languageId === null ? null : getLanguageDefinition(languageMap, languageId);

  const [evaluatorId, rawSetEvaluatorId] = React.useState<string | null>(getEvalIdFromLocalStorage(languageDef));
  const [replOutput, setReplOutput] = React.useState<InterpreterOutput | null>(null);
  const [conductor, setConductor] = React.useState<
    | PreparedConductor
    | 'loading'
    | 'error'
    | 'not-loaded'
  >('not-loaded');

  React.useEffect(() => {
    if (languageDef == null || evaluatorId == null) return;

    const evaluator = getEvaluatorDefinition(languageDef, evaluatorId)!;

    prepareConductor(
      evaluator,
      editorRef.current,
      consoleOutputRef,
      output => {
        setReplOutput(output);

        if (output.type === 'errors') showToast(errorToast);
        else showToast(evalSuccessToast);
      }
    )
      .then(setConductor)
      .catch(err => {
        console.error(err);
        setConductor('error');
      });
  }, [evaluatorId]);

  const consoleOutputRef = React.useRef<string[]>([]);

  function setEvaluatorId(newId: string | null) {
    if (newId === null) {
      // Clearing evaluator setting should
      rawSetEvaluatorId(null);
      localStorage.removeItem('evaluatorId');

      // clear conductor
      setConductor('not-loaded');
      return;
    }

    if (newId === evaluatorId || languageDef == null) return;
    rawSetEvaluatorId(newId);
    localStorage.setItem('evaluatorId', newId);
    setConductor('loading');
  }

  function evalCode() {
    if (typeof conductor === 'string' || replOutput?.type === 'running') return;

    consoleOutputRef.current = [];

    setReplOutput({
      type: 'running',
      consoleLogs: consoleOutputRef.current
    });

    // File path here doesn't really matter since the fileGetter
    // just returns the current editor value no matter what
    conductor.hostPlugin.startEvaluator('/main.txt');
  }

  function resetEditor() {
    let defaultValue = '';
    if (languageDef) {
      if (evaluatorId !== null) {
        const evaluator = getEvaluatorDefinition(languageDef, evaluatorId)!;
        defaultValue = evaluator.defaultProgram ?? '';
      }
    }
    editorRef.current?.getModel()?.setValue(defaultValue);
    localStorage.setItem('editorValue', defaultValue);
  }

  const [selectedTabId, setSelectedTabId] = React.useState('test');
  const dynamicTabs = React.useSyncExternalStore(sideContentManager.subscribe, () => sideContentManager.getTabs());

  function getEvalTooltip(): string {
    if (languageId === null) return 'Select a language first';
    if (evaluatorId === null) return 'Select an evaluator first';

    switch (conductor) {
      case 'not-loaded':
        return 'Select an evaluator first';
      case 'loading':
        return 'Loading conductor...';
      case 'error':
        return 'Failed to load conductor';
      default: {
        if (conductor.hostPlugin.isStatusActive(RunnerStatus.RUNNING)) return 'Evaluator is running...';
        if (conductor.hostPlugin.isStatusActive(RunnerStatus.ERROR)) return 'Evaluator encountered an error';
        return 'Evaluate the program';
      }
    }
  }

  const workspaceProps: WorkspaceProps = {
    controlBarProps: {
      editorButtons: [
        <ControlBarRunButton
          key="eval"
          handleEditorEval={evalCode}
          disabled={typeof conductor === 'string' || !conductor.hostPlugin.isStatusActive(RunnerStatus.EVAL_READY)}
          tooltip={getEvalTooltip()}
        />,
        <ControlBarClearButton
          onClick={resetEditor}
          key="clear"
        />,
        <ControlBarSelect
          key="langSelect"
          items={Object.values(languageDir)}
          selected={languageId}
          onChange={({ id }) => setLanguageId(id)}
        />,
        <ControlBarSelect
          key="evalSelect"
          disabled={languageDef == null}
          items={languageDef?.evaluators ?? []}
          selected={evaluatorId}
          onChange={({ id }) => setEvaluatorId(id)}
        />
      ]
    },
    replProps: {
      output: replOutput
    },
    handleEditorEval: evalCode,
    handleEditorValueChange(newValue) {
      updateEditorLocalStorageValue(newValue);
    },
    sideContentProps: {
      dynamicTabs: [testTabContent, ...dynamicTabs],
      selectedTabId,
      onChange: setSelectedTabId,
      alerts: []
    },
    editorProps: {
      defaultValue: localStorage.getItem('editorValue') ?? '',
      language: languageDef ? translateLanguageName(languageDef.name) : '',
      ref: editorRef
    },
  };

  return (
    <div className={classNames('Playground', Classes.DARK)}>
      <OverlayToaster ref={toaster} />
      <Workspace {...workspaceProps} />
    </div>
  );
}
