import { Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Ace, Range } from 'ace-builds';
import { FSModule } from 'browserfs/dist/node/core/FS';
import classNames from 'classnames';
import { Chapter, Variant } from 'js-slang/dist/types';
import { isEqual } from 'lodash';
import { decompressFromEncodedURIComponent } from 'lz-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { useDispatch, useStore } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { AnyAction, Dispatch } from 'redux';
import {
  beginDebuggerPause,
  beginInterruptExecution,
  debuggerReset,
  debuggerResume
} from 'src/commons/application/actions/InterpreterActions';
import {
  loginGitHub,
  logoutGitHub,
  logoutGoogle
} from 'src/commons/application/actions/SessionActions';
import {
  setEditorSessionId,
  setSharedbConnected
} from 'src/commons/collabEditing/CollabEditingActions';
import { useResponsive, useTypedSelector } from 'src/commons/utils/Hooks';
import {
  showFullJSWarningOnUrlLoad,
  showFulTSWarningOnUrlLoad,
  showHTMLDisclaimer
} from 'src/commons/utils/WarningDialogHelper';
import {
  addEditorTab,
  addHtmlConsoleError,
  browseReplHistoryDown,
  browseReplHistoryUp,
  changeExecTime,
  changeSideContentHeight,
  changeStepLimit,
  chapterSelect,
  clearReplOutput,
  evalEditor,
  evalRepl,
  navigateToDeclaration,
  promptAutocomplete,
  removeEditorTab,
  removeEditorTabsForDirectory,
  sendReplInputToOutput,
  setEditorBreakpoint,
  setEditorHighlightedLines,
  setFolderMode,
  toggleEditorAutorun,
  toggleFolderMode,
  toggleUpdateEnv,
  toggleUsingEnv,
  toggleUsingSubst,
  updateActiveEditorTabIndex,
  updateEditorValue,
  updateEnvSteps,
  updateEnvStepsTotal,
  updateReplValue
} from 'src/commons/workspace/WorkspaceActions';
import { WorkspaceLocation } from 'src/commons/workspace/WorkspaceTypes';
import EnvVisualizer from 'src/features/envVisualizer/EnvVisualizer';
import {
  githubOpenFile,
  githubSaveFile,
  githubSaveFileAs
} from 'src/features/github/GitHubActions';
import {
  persistenceInitialise,
  persistenceOpenPicker,
  persistenceSaveFile,
  persistenceSaveFileAs
} from 'src/features/persistence/PersistenceActions';
import {
  generateLzString,
  playgroundConfigLanguage,
  shortenURL,
  updateShortURL
} from 'src/features/playground/PlaygroundActions';

import {
  getDefaultFilePath,
  getLanguageConfig,
  isSourceLanguage,
  OverallState,
  ResultOutput,
  SALanguage
} from '../../commons/application/ApplicationTypes';
import { ExternalLibraryName } from '../../commons/application/types/ExternalTypes';
import { ControlBarAutorunButtons } from '../../commons/controlBar/ControlBarAutorunButtons';
import { ControlBarChapterSelect } from '../../commons/controlBar/ControlBarChapterSelect';
import { ControlBarClearButton } from '../../commons/controlBar/ControlBarClearButton';
import { ControlBarEvalButton } from '../../commons/controlBar/ControlBarEvalButton';
import { ControlBarExecutionTime } from '../../commons/controlBar/ControlBarExecutionTime';
import { ControlBarGoogleDriveButtons } from '../../commons/controlBar/ControlBarGoogleDriveButtons';
import { ControlBarSessionButtons } from '../../commons/controlBar/ControlBarSessionButton';
import { ControlBarShareButton } from '../../commons/controlBar/ControlBarShareButton';
import { ControlBarStepLimit } from '../../commons/controlBar/ControlBarStepLimit';
import { ControlBarToggleFolderModeButton } from '../../commons/controlBar/ControlBarToggleFolderModeButton';
import { ControlBarGitHubButtons } from '../../commons/controlBar/github/ControlBarGitHubButtons';
import {
  convertEditorTabStateToProps,
  NormalEditorContainerProps
} from '../../commons/editor/EditorContainer';
import { Position } from '../../commons/editor/EditorTypes';
import { overwriteFilesInWorkspace } from '../../commons/fileSystem/utils';
import FileSystemView from '../../commons/fileSystemView/FileSystemView';
import MobileWorkspace, {
  MobileWorkspaceProps
} from '../../commons/mobileWorkspace/MobileWorkspace';
import { SideBarTab } from '../../commons/sideBar/SideBar';
import { SideContentTab, SideContentType } from '../../commons/sideContent/SideContentTypes';
import { Links } from '../../commons/utils/Constants';
import { generateLanguageIntroduction } from '../../commons/utils/IntroductionHelper';
import { convertParamToBoolean, convertParamToInt } from '../../commons/utils/ParamParseHelper';
import { IParsedQuery, parseQuery } from '../../commons/utils/QueryHelper';
import Workspace, { WorkspaceProps } from '../../commons/workspace/Workspace';
import { initSession, log } from '../../features/eventLogging';
import {
  CodeDelta,
  Input,
  SelectionRange
} from '../../features/sourceRecorder/SourceRecorderTypes';
import { WORKSPACE_BASE_PATHS } from '../fileSystem/createInBrowserFileSystem';
import {
  dataVisualizerTab,
  desktopOnlyTabIds,
  makeEnvVisualizerTabFrom,
  makeHtmlDisplayTabFrom,
  makeIntroductionTabFrom,
  makeRemoteExecutionTabFrom,
  makeSubstVisualizerTabFrom,
  mobileOnlyTabIds
} from './PlaygroundTabs';

export type PlaygroundProps = {
  isSicpEditor?: boolean;
  initialEditorValueHash?: string;
  prependLength?: number;
  handleCloseEditor?: () => void;
};

const keyMap = { goGreen: 'h u l k' };

const Playground: React.FC<PlaygroundProps> = props => {
  const { isSicpEditor } = props;
  const workspaceLocation: WorkspaceLocation = isSicpEditor ? 'sicp' : 'playground';

  const [lastEdit, setLastEdit] = useState(new Date());
  const [isGreen, setIsGreen] = useState(false);
  const [selectedTab, setSelectedTab] = useState();



  const playgroundIntroductionTab: SideContentTab = useMemo(
    () => makeIntroductionTabFrom(generateLanguageIntroduction(languageConfig)),
    [languageConfig]
  );
  // const tabs = useMemo(() => {
  //   const tabs: SideContentTab[] = [playgroundIntroductionTab];

  //   const currentLang = languageConfig.chapter;
  //   if (currentLang === Chapter.HTML) {
  //     // For HTML Chapter, HTML Display tab is added only after code is run
  //     if (output.length > 0 && output[0].type === 'result') {
  //       tabs.push(
  //         makeHtmlDisplayTabFrom(output[0] as ResultOutput, errorMsg =>
  //           dispatch(addHtmlConsoleError(errorMsg, workspaceLocation))
  //         )
  //       );
  //     }
  //     return tabs;
  //   }

  //   if (!usingRemoteExecution) {
  //     // Don't show the following when using remote execution
  //     if (shouldShowDataVisualizer) {
  //       tabs.push(dataVisualizerTab);
  //     }
  //     if (shouldShowEnvVisualizer) {
  //       tabs.push(makeEnvVisualizerTabFrom(workspaceLocation));
  //     }
  //     if (shouldShowSubstVisualizer) {
  //       tabs.push(makeSubstVisualizerTabFrom(output));
  //     }
  //   }

  //   if (!isSicpEditor) {
  //     tabs.push(remoteExecutionTab);
  //   }

  //   return tabs;
  // }, [
  //   playgroundIntroductionTab,
  //   languageConfig.chapter,
  //   output,
  //   usingRemoteExecution,
  //   isSicpEditor,
  //   dispatch,
  //   workspaceLocation,
  //   shouldShowDataVisualizer,
  //   shouldShowEnvVisualizer,
  //   shouldShowSubstVisualizer,
  //   remoteExecutionTab
  // ]);

  const onLoadMethod = useCallback(
    (editor: Ace.Editor) => {
      const addFold = () => {
        editor.getSession().addFold('    ', new Range(1, 0, props.prependLength!, 0));
        editor.renderer.off('afterRender', addFold);
      };

      editor.renderer.on('afterRender', addFold);
    },
    [props.prependLength]
  );


  const replDisabled = !languageConfig.supports.repl || usingRemoteExecution;

  const editorContainerHandlers = useMemo(() => {
    return {
      handleDeclarationNavigate: (cursorPosition: Position) =>
        dispatch(navigateToDeclaration(workspaceLocation, cursorPosition)),
      handlePromptAutocomplete: (row: number, col: number, callback: any) =>
        dispatch(promptAutocomplete(workspaceLocation, row, col, callback)),
      handleSendReplInputToOutput: (code: string) =>
        dispatch(sendReplInputToOutput(code, workspaceLocation)),
      handleSetSharedbConnected: (connected: boolean) =>
        dispatch(setSharedbConnected(workspaceLocation, connected)),
      setActiveEditorTabIndex: (activeEditorTabIndex: number | null) =>
        dispatch(updateActiveEditorTabIndex(workspaceLocation, activeEditorTabIndex)),
      removeEditorTabByIndex: (editorTabIndex: number) =>
        dispatch(removeEditorTab(workspaceLocation, editorTabIndex))
    };
  }, [dispatch, workspaceLocation]);

  const editorContainerProps: NormalEditorContainerProps = {
    editorSessionId,
    isEditorAutorun,
    editorVariant: 'normal',
    baseFilePath: WORKSPACE_BASE_PATHS[workspaceLocation],
    isFolderModeEnabled,
    activeEditorTabIndex,
    setActiveEditorTabIndex: editorContainerHandlers.setActiveEditorTabIndex,
    removeEditorTabByIndex: editorContainerHandlers.removeEditorTabByIndex,
    editorTabs: editorTabs.map(convertEditorTabStateToProps),
    handleDeclarationNavigate: editorContainerHandlers.handleDeclarationNavigate,
    handleEditorEval: autorunButtonHandlers.handleEditorEval,
    handlePromptAutocomplete: editorContainerHandlers.handlePromptAutocomplete,
    handleSendReplInputToOutput: editorContainerHandlers.handleSendReplInputToOutput,
    handleSetSharedbConnected: editorContainerHandlers.handleSetSharedbConnected,
    onChange: onChangeMethod,
    onCursorChange: onCursorChangeMethod,
    onSelectionChange: onSelectionChangeMethod,
    onLoad: isSicpEditor && props.prependLength ? onLoadMethod : undefined,
    sourceChapter: languageConfig.chapter,
    externalLibraryName,
    sourceVariant: languageConfig.variant,
    handleEditorValueChange: onEditorValueChange,
    handleEditorUpdateBreakpoints: handleEditorUpdateBreakpoints
  };

  const replHandlers = useMemo(() => {
    return {
      handleBrowseHistoryDown: () => dispatch(browseReplHistoryDown(workspaceLocation)),
      handleBrowseHistoryUp: () => dispatch(browseReplHistoryUp(workspaceLocation)),
      handleReplValueChange: (newValue: string) =>
        dispatch(updateReplValue(newValue, workspaceLocation))
    };
  }, [dispatch, workspaceLocation]);
  const replProps = {
    output,
    replValue,
    handleReplEval,
    usingSubst,
    handleBrowseHistoryDown: replHandlers.handleBrowseHistoryDown,
    handleBrowseHistoryUp: replHandlers.handleBrowseHistoryUp,
    handleReplValueChange: replHandlers.handleReplValueChange,
    sourceChapter: languageConfig.chapter,
    sourceVariant: languageConfig.variant,
    externalLibrary: ExternalLibraryName.NONE, // temporary placeholder as we phase out libraries
    hidden:
      selectedTab === SideContentType.substVisualizer ||
      selectedTab === SideContentType.envVisualizer,
    inputHidden: replDisabled,
    replButtons: [replDisabled ? null : evalButton, clearButton],
    disableScrolling: isSicpEditor
  };


  const workspaceProps: WorkspaceProps = {
    controlBarProps: {
      editorButtons: [
        autorunButtons,
        languageConfig.chapter === Chapter.FULL_JS ? null : shareButton,
        chapterSelectButton,
        isSicpEditor ? null : sessionButtons,
        languageConfig.supports.multiFile ? toggleFolderModeButton : null,
        persistenceButtons,
        githubButtons,
        usingRemoteExecution || !isSourceLanguage(languageConfig.chapter)
          ? null
          : usingSubst || usingEnv
          ? stepperStepLimit
          : executionTime
      ]
    },
    editorContainerProps: editorContainerProps,
    handleSideContentHeightChange: useCallback(
      change => dispatch(changeSideContentHeight(change, workspaceLocation)),
      [dispatch, workspaceLocation]
    ),
    replProps: replProps,
    sideBarProps: sideBarProps,
    sideContentHeight: sideContentHeight,
    sideContentProps: {
      selectedTabId: selectedTab,
      onChange: onChangeTabs,
      tabs: {
        beforeDynamicTabs: tabs,
        afterDynamicTabs: []
      },
      workspaceLocation: workspaceLocation,
      sideContentHeight: sideContentHeight
    },
    sideContentIsResizeable:
      selectedTab !== SideContentType.substVisualizer &&
      selectedTab !== SideContentType.envVisualizer
  };

  return (
    <HotKeys
      className={classNames('Playground', Classes.DARK, isGreen ? 'GreenScreen' : undefined)}
      keyMap={keyMap}
      // handlers={handlers}
    >
      <Workspace {...workspaceProps} />
    </HotKeys>
  );
};

// react-router lazy loading
// https://reactrouter.com/en/main/route/lazy
export const Component = Playground;
Component.displayName = 'Playground';

export default Playground;
