import { FocusStyleManager } from '@blueprintjs/core';
import { Enable, Resizable, ResizableProps, ResizeCallback } from 're-resizable';
import * as React from 'react';

import ControlBar, { ControlBarProps } from './controlBar/ControlBar';
import EditorContainer, { EditorContainerProps } from './EditorContainer';
import Repl, { ReplProps } from '../repl/Repl';
import SideContent, { SideContentProps } from '../sideContent/SideContent';
import { useDimensions } from './utils/Hooks';

export type WorkspaceProps = DispatchProps & StateProps;

type DispatchProps = {
  handleSideContentHeightChange: (height: number) => void;
};

type StateProps = {
  // Either editorProps or mcqProps must be provided
  controlBarProps: ControlBarProps;
  editorContainerProps?: EditorContainerProps;
  hasUnsavedChanges?: boolean;
  replProps: ReplProps;
  sideContentHeight?: number;
  sideContentProps: SideContentProps;
  sideContentIsResizeable?: boolean;
};

const Workspace: React.FC<WorkspaceProps> = props => {
  const contentContainerDiv = React.useRef<HTMLDivElement | null>(null);
  const editorDividerDiv = React.useRef<HTMLDivElement | null>(null);
  const leftParentResizable = React.useRef<Resizable | null>(null);
  const maxDividerHeight = React.useRef<number | null>(null);
  const sideDividerDiv = React.useRef<HTMLDivElement | null>(null);
  const [contentContainerWidth] = useDimensions(contentContainerDiv);

  FocusStyleManager.onlyShowFocusOnTabs();

  React.useEffect(() => {
    if (props.sideContentIsResizeable && maxDividerHeight.current === null) {
      maxDividerHeight.current = sideDividerDiv.current!.clientHeight;
    }
  });

  const editorResizableProps = () => {
    return {
      className: 'resize-editor left-parent',
      enable: rightResizeOnly,
      minWidth: 0,
      onResize: toggleEditorDividerDisplay,
      ref: leftParentResizable,
      defaultSize: { width: '50%', height: '100%' },
      as: undefined as any // re-resizable bug - wrong typedef
    } as ResizableProps;
  };

  const sideContentResizableProps = () => {
    const onResizeStop: ResizeCallback = (_a, _b, ref) =>
      props.handleSideContentHeightChange(ref.clientHeight);
    return {
      bounds: 'parent',
      className: 'resize-side-content',
      enable: bottomResizeOnly,
      onResize: toggleDividerDisplay,
      onResizeStop
    } as ResizableProps;
  };

  /**
   * Snaps the left-parent resizable to 100% or 0% when percentage width goes
   * above 95% or below 5% respectively. Also changes the editor divider width
   * in the case of < 5%.
   */
  const toggleEditorDividerDisplay: ResizeCallback = (_a, _b, ref) => {
    const leftThreshold = 5;
    const rightThreshold = 95;
    const editorWidthPercentage =
      ((ref as HTMLDivElement).clientWidth / contentContainerWidth) * 100;
    // update resizable size
    if (editorWidthPercentage > rightThreshold) {
      leftParentResizable.current!.updateSize({ width: '100%', height: '100%' });
    } else if (editorWidthPercentage < leftThreshold) {
      leftParentResizable.current!.updateSize({ width: '0%', height: '100%' });
    }
  };

  /**
   * Hides the side-content-divider div when side-content is resized downwards
   * so that it's bottom border snaps flush with editor's bottom border
   */
  const toggleDividerDisplay: ResizeCallback = (_a, _b, ref) => {
    maxDividerHeight.current =
      sideDividerDiv.current!.clientHeight > maxDividerHeight.current!
        ? sideDividerDiv.current!.clientHeight
        : maxDividerHeight.current;
    const resizableHeight = (ref as HTMLDivElement).clientHeight;
    const rightParentHeight = (ref.parentNode as HTMLDivElement).clientHeight;
    if (resizableHeight + maxDividerHeight.current! + 2 > rightParentHeight) {
      sideDividerDiv.current!.style.display = 'none';
    } else {
      sideDividerDiv.current!.style.display = 'initial';
    }
  };

  const sideContent = <SideContent {...props.sideContentProps} />;
  const resizableSideContent = (
    <Resizable {...sideContentResizableProps()}>
      {sideContent}
      <div className="side-content-divider" ref={sideDividerDiv} />
    </Resizable>
  );

  return (
    <div className="workspace">
      <ControlBar {...props.controlBarProps} />
      <div className="workspace-parent">
        <div className="row content-parent" ref={contentContainerDiv}>
          <div className="editor-divider" ref={editorDividerDiv} />
          <Resizable {...editorResizableProps()}>
            <EditorContainer {...props.editorContainerProps} />;
          </Resizable>
          <div className="right-parent">
            {props.sideContentIsResizeable === undefined || props.sideContentIsResizeable
              ? resizableSideContent
              : sideContent}
            <Repl {...props.replProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

const rightResizeOnly: Enable = { right: true };
const bottomResizeOnly: Enable = { bottom: true };
const noResize: Enable = {};

export default Workspace;