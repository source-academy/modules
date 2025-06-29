import { Button, Classes, Intent, OverlayToaster, Popover, Tooltip, type ToastProps } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import { SourceDocumentation, getNames, runInContext, type Context } from 'js-slang';
// Importing this straight from js-slang doesn't work for whatever reason
import createContext from 'js-slang/dist/createContext';
import { Chapter, Variant } from 'js-slang/dist/types';
import { stringify } from 'js-slang/dist/utils/stringify';
import React from 'react';
import mockModuleContext from '../mockModuleContext';
import type { InterpreterOutput } from '../types';
import SettingsPopup from './SettingsPopup';
import Workspace, { type WorkspaceProps } from './Workspace';
import { ControlBarClearButton } from './controlBar/ControlBarClearButton';
import { ControlBarRefreshButton } from './controlBar/ControlBarRefreshButton';
import { ControlBarRunButton } from './controlBar/ControlBarRunButton';
import testTabContent from './sideContent/TestTab';
import loadDynamicTabs from './sideContent/importers';
import type { SideContentTab } from './sideContent/types';

const refreshSuccessToast: ToastProps = {
  intent: Intent.SUCCESS,
  message: 'Refresh Successful!'
};

const errorToast: ToastProps = {
  intent: Intent.DANGER,
  message: 'An error occurred!'
};

const evalSuccessToast: ToastProps = {
  intent: Intent.SUCCESS,
  message: 'Code evaluated successfully!'
};

const createContextHelper = (onConsoleLog: (arg: string) => void) => {
  const tempContext = createContext(Chapter.SOURCE_4, Variant.DEFAULT, {}, [], undefined, {
    rawDisplay(value: any, str: string | undefined) {
      const valueStr = typeof value === 'string' ? value : stringify(value);
      if (str !== undefined) {
        onConsoleLog(`${valueStr} ${str}`);
      } else {
        onConsoleLog(valueStr);
      }
    },
  } as any);
  return tempContext;
};

const Playground: React.FC = () => {
  const consoleLogs = React.useRef<string[]>([]);
  const [moduleBackend, setModuleBackend] = React.useState<string | null>(null);
  const [useCompiledTabs, setUseCompiledTabs] = React.useState(false);

  const [dynamicTabs, setDynamicTabs] = React.useState<SideContentTab[]>([]);
  const [selectedTabId, setSelectedTab] = React.useState(testTabContent.id);
  const [codeContext, setCodeContext] = React.useState<Context>(createContextHelper(str => consoleLogs.current.push(str)));
  const [editorValue, setEditorValue] = React.useState(localStorage.getItem('editorValue') ?? '');
  const [replOutput, setReplOutput] = React.useState<InterpreterOutput | null>(null);
  const [alerts, setAlerts] = React.useState<string[]>([]);

  const toaster = React.useRef<OverlayToaster>(null);

  const showToast = (props: ToastProps) => {
    if (toaster.current) {
      toaster.current.show({
        ...props,
        timeout: 15000
      });
    }
  };

  const getAutoComplete = React.useCallback((row: number, col: number, callback: any) => {
    getNames(editorValue, row, col, codeContext)
      .then(([editorNames, displaySuggestions]) => {
        if (!displaySuggestions) {
          callback();
          return;
        }

        const editorSuggestions = editorNames.map((editorName: any) => ({
          ...editorName,
          caption: editorName.name,
          value: editorName.name,
          score: editorName.score ? editorName.score + 1000 : 1000,
          name: undefined
        }));

        const builtins: Record<string, any> = SourceDocumentation.builtins[Chapter.SOURCE_4];
        const builtinSuggestions = Object.entries(builtins)
          .map(([builtin, thing]) => ({
            ...thing,
            caption: builtin,
            value: builtin,
            score: 100,
            name: builtin,
            docHTML: thing.description
          }));

        callback(null, [
          ...builtinSuggestions,
          ...editorSuggestions
        ]);
      });
  }, [editorValue, codeContext]);

  const loadTabs = async () => {
    try {
      const tabs = await loadDynamicTabs(codeContext, useCompiledTabs);
      setDynamicTabs(tabs);

      const newIds = tabs.map(({ id }) => id);
      // If the currently selected tab no longer exists,
      // switch to the default test tab
      if (!newIds.includes(selectedTabId)) {
        setSelectedTab(testTabContent.id);
      }
      setAlerts(newIds);

    } catch (error) {
      showToast(errorToast);
      console.log(error);
    }
  };

  const evalCode = () => {
    codeContext.errors = [];
    codeContext.moduleContexts = mockModuleContext.moduleContexts = {};
    consoleLogs.current = [];

    runInContext(editorValue, codeContext, {
      importOptions: {
        loadTabs: useCompiledTabs
      }
    })
      .then((result) => {
        if (codeContext.errors.length > 0) {
          showToast(errorToast);
        } else {
          loadTabs()
            .then(() => showToast(evalSuccessToast));
        }

        if (result.status === 'finished') {
          setReplOutput({
            type: 'result',
            // code: editorValue,
            consoleLogs: consoleLogs.current,
            value: stringify(result.value)
          });
        } else if (result.status === 'error') {
          setReplOutput({
            type: 'errors',
            errors: codeContext.errors,
            consoleLogs: consoleLogs.current
          });
        }
      });
  };

  const resetEditor = () => {
    setCodeContext(createContextHelper(str => consoleLogs.current.push(str)));
    consoleLogs.current = [];

    setEditorValue('');
    localStorage.setItem('editorValue', '');
    setDynamicTabs([]);
    setSelectedTab(testTabContent.id);
    setReplOutput(null);
  };

  const onRefresh = () => {
    loadTabs()
      .then(() => showToast(refreshSuccessToast))
      .catch(() => showToast(errorToast));
  };

  const workspaceProps: WorkspaceProps = {
    controlBarProps: {
      editorButtons: [
        <Popover
          key='settings'
          interactionKind='click'
          placement="right"
          content={<SettingsPopup
            backend={moduleBackend ?? ''}
            onBackendChange={setModuleBackend}
            useCompiledForTabs={useCompiledTabs}
            onUseCompiledChange={setUseCompiledTabs}
          />}
          renderTarget={({ isOpen: _isOpen, ...targetProps }) => {
            return (
              <Tooltip content="Settings">
                <Button
                  {...targetProps}
                  icon={IconNames.SETTINGS}
                />
              </Tooltip>
            );
          }}
        />,
        <ControlBarRunButton handleEditorEval={evalCode} key="eval" />,
        <ControlBarClearButton onClick={resetEditor}
          key="clear"
        />,
        <ControlBarRefreshButton
          onClick={onRefresh}
          key="refresh"
        />

      ]
    },
    replProps: {
      output: replOutput
    },
    handlePromptAutocomplete: getAutoComplete,
    handleEditorEval: evalCode,
    handleEditorValueChange(newValue) {
      setEditorValue(newValue);
      localStorage.setItem('editorValue', newValue);
    },
    editorValue,
    sideContentProps: {
      dynamicTabs: [testTabContent, ...dynamicTabs],
      selectedTabId,
      onChange: React.useCallback((newId: string) => {
        setSelectedTab(newId);
        setAlerts(alerts.filter((id) => id !== newId));
      }, [alerts]),
      alerts
    }
  };

  return (
    <div className={classNames('Playground', Classes.DARK)}>
      <OverlayToaster ref={toaster} />
      <Workspace {...workspaceProps} />
    </div>
  );
};

export default Playground;
