import { Classes, Intent, OverlayToaster, type ToastProps } from '@blueprintjs/core';
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
  consoleOutputRef: React.RefObject<InterpreterOutput[]>,
  finishCallback: (error?: any) => void
) {
  const conductor = await createPreparedConductor(
    evaluator.path,
    () => Promise.resolve(editor?.getModel()?.getValue())
  );

  conductor.hostPlugin.receiveOutput = msg => {
    consoleOutputRef.current.push({
      type: 'running',
      consoleLogs: [msg]
    });
  };

  conductor.hostPlugin.receiveError = error => {
    consoleOutputRef.current.push({
      type: 'errors',
      errors: [error as any],
      consoleLogs: []
    });
    finishCallback(error);
  };

  conductor.hostPlugin.receiveResult = result => {
    consoleOutputRef.current.push({
      type: 'result',
      value: result,
      consoleLogs: []
    });

    finishCallback();
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
      error => {
        setIsRunningCode(false);

        if (error) showToast(errorToast);
        else showToast(evalSuccessToast);
      }
    )
      .then(setConductor)
      .catch(err => {
        console.error(err);
        setConductor('error');
      });
  }, [evaluatorId]);

  const [isRunningCode, setIsRunningCode] = React.useState(false);

  const consoleOutputRef = React.useRef<InterpreterOutput[]>([]);

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
    if (typeof conductor === 'string') return;

    setIsRunningCode(true);
    consoleOutputRef.current = [];

    // File path here doesn't really matter since the fileGetter
    // just returns the current editor value no matter what
    conductor.hostPlugin.startEvaluator('/main.txt');
  }

  function resetEditor() {
    localStorage.removeItem('editorValue');
    editorRef.current?.getModel()?.setValue('');
  }

  const workspaceProps: WorkspaceProps = {
    controlBarProps: {
      editorButtons: [
        <ControlBarRunButton
          key="eval"
          handleEditorEval={evalCode}
          disabled={typeof conductor === 'string' || isRunningCode}
          tooltip={
            isRunningCode
              ? 'Currently evaluating...'
              : languageId === null
                ? 'Select a language first'
                : evaluatorId === null || conductor === 'not-loaded'
                  ? 'Select an evaluator first'
                  : conductor === 'loading'
                    ? 'Loading conductor...'
                    : conductor === 'error'
                      ? 'Failed to load conductor'
                      : undefined
          }
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
      output: null
    },
    handleEditorEval: evalCode,
    handleEditorValueChange(newValue) {
      updateEditorLocalStorageValue(newValue);
    },
    sideContentProps: {
      dynamicTabs: [testTabContent],
      selectedTabId: '',
      onChange: () => { },
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
