import { Classes, Intent, OverlayToaster, type ToastProps, Toaster } from '@blueprintjs/core';
import classNames from 'classnames';
import { Chapter, Variant } from 'js-slang/dist/types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';

import Workspace, { type WorkspaceProps } from './Workspace';
import { ControlBarRunButton } from './controlBar/ControlBarRunButton';
import { type Context, createContext, runInContext } from 'js-slang';
import { getDynamicTabs } from './sideContent/utils';
import type { SideContentTab } from './sideContent/types';
import testTabContent from './sideContent/TestTab';
import { ControlBarClearButton } from './controlBar/ControlBarClearButton';
import { ControlBarRefreshButton } from './controlBar/ControlBarRefreshButton';

const refreshSuccessToast: ToastProps = {
  intent: Intent.SUCCESS,
  message: 'Refresh Successful!',
}

const errorToast: ToastProps = {
  intent: Intent.DANGER,
  message: 'An error occurred!',
}

const evalSuccessToast: ToastProps = {
  intent: Intent.SUCCESS,
  message: 'Code evaluated successfully!'
}

const createContextHelper = () => createContext(Chapter.SOURCE_4, Variant.DEFAULT);

const Playground: React.FC<{}> = () => {
  const [dynamicTabs, setDynamicTabs] = React.useState<SideContentTab[]>([]);
  const [selectedTabId, setSelectedTab] = React.useState(testTabContent.id)
  const [codeContext, setCodeContext] = React.useState<Context>(createContextHelper())
  const [editorValue, setEditorValue] = React.useState(localStorage.getItem('editorValue') ?? '');

  const toaster = React.useRef<Toaster | null>(null);

  const loadTabs = () => getDynamicTabs(codeContext)
    .then((tabs) => {
      setDynamicTabs(tabs)
      
      // If the currently selected tab no longer exists,
      // switch to the default test tab
      const ids = tabs.map(({ id }) => id)
      if (!ids.includes(selectedTabId)) {
        setSelectedTab(testTabContent.id)
      }
    })
    .catch(() => showToast(errorToast))

  const evalCode = () => {
    runInContext(editorValue, codeContext).then(() => {
      if (codeContext.errors.length > 0) {
        showToast(errorToast);
      } else {
        loadTabs().then(() => showToast(evalSuccessToast))
      }
    })
  }

  const resetEditor = () => {
    setCodeContext(createContextHelper())
    setEditorValue('')
    localStorage.setItem('editorValue', '')
    setDynamicTabs([])
    setSelectedTab(testTabContent.id)
  }

  const showToast = (props: ToastProps) => {
    if (toaster.current) toaster.current.show({
      ...props,
      timeout: 1500,
    })
  }

  const onRefresh = () => {
    loadTabs()
      .then(() => showToast(refreshSuccessToast))
      .catch(() => showToast(errorToast))
  }

  // const replHandlers = useMemo(() => {
  //   return {
  //     handleBrowseHistoryDown: () => dispatch(browseReplHistoryDown(workspaceLocation)),
  //     handleBrowseHistoryUp: () => dispatch(browseReplHistoryUp(workspaceLocation)),
  //     handleReplValueChange: (newValue: string) =>
  //       dispatch(updateReplValue(newValue, workspaceLocation))
  //   };
  // }, [dispatch, workspaceLocation]);

  const workspaceProps: WorkspaceProps = {
    controlBarProps: {
      editorButtons: [
        <ControlBarRunButton handleEditorEval={evalCode} key='eval' />,
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
      handleBrowseHistoryDown: () => {},
      handleBrowseHistoryUp: () => {},
      replButtons: [],
      output: [],
    },
    handleEditorEval: evalCode,
    handleEditorValueChange: (newValue) => {
      setEditorValue(newValue)
      localStorage.setItem('editorValue', newValue);
    },
    editorValue,
    sideContentProps: {
      dynamicTabs: [testTabContent, ...dynamicTabs],
      selectedTabId,
      onChange: setSelectedTab,
    }
  };

  return (
    <HotKeys
      className={classNames('Playground', Classes.DARK)}
    >
      <OverlayToaster ref={toaster} />
      <Workspace {...workspaceProps} />
    </HotKeys>
  );
};

export default Playground;
