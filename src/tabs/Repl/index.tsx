/**
 * Tab for Source Academy Programmable REPL module
 * @module repl
 * @author Wang Zihan
 */

import { Button } from '@blueprintjs/core';
import { FONT_MESSAGE, MINIMUM_EDITOR_HEIGHT } from '@sourceacademy/bundle-repl/config';
import type { ProgrammableRepl } from '@sourceacademy/bundle-repl/programmable_repl';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
import { throttle } from 'es-toolkit';
import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import type { IAceEditor } from 'react-ace/lib/types';

interface Props {
  context: DebuggerContext;
}

interface State {
  editorHeight: number;
  editorText: string;
  isDraggingDragBar: boolean;
}

type Context = DebuggerContext['context'];

const BOX_PADDING_VALUE = 4;

const updateSavedCode = throttle((code: string) => {
  localStorage.setItem('programmable_repl_saved_editor_code', code);
}, 100);

class ProgrammableReplGUI extends React.Component<Props, State> {
  public readonly replInstance: ProgrammableRepl;
  private readonly evalContext: Context;

  private editorAreaRect?: DOMRect;
  private editorInstance?: IAceEditor;

  constructor(data: Props) {
    super(data);

    this.evalContext = data.context.context;
    this.replInstance = getModuleState<ProgrammableRepl>(data.context, 'repl')!;
    this.replInstance.tabRerenderer = () => this.setState({});
    this.replInstance.updateUserCode = this.onCodeChanged;

    let initialText: string;
    if (this.replInstance.defaultCode) {
      initialText = this.replInstance.defaultCode;
      localStorage.setItem('programmable_repl_saved_editor_code', initialText);
    } else {
      initialText = localStorage.getItem('programmable_repl_saved_editor_code') ?? '';
    }

    this.state = {
      editorHeight: this.replInstance.editorHeight,
      isDraggingDragBar: false,
      editorText: initialText
    };
  }

  private dragBarOnMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    this.setState({ isDraggingDragBar: true });
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.state.isDraggingDragBar && this.editorAreaRect) {
      const height = Math.max(e.clientY - this.editorAreaRect.top - BOX_PADDING_VALUE * 2, MINIMUM_EDITOR_HEIGHT);
      this.replInstance.editorHeight = height;
      this.setState({ editorHeight: height });
      this.editorInstance?.resize();
    }
  };

  private onMouseUp = () => {
    this.setState({ isDraggingDragBar: false });
  };

  override componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  override componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onCodeChanged = (newCode: string) => {
    this.setState({ editorText: newCode });
    updateSavedCode(newCode);
  };

  public override render() {
    const { editorHeight, editorText } = this.state;
    const outputDivs = this.replInstance.outputStrings.map((str): React.JSX.Element => {
      if (str.outputMethod === 'richtext') {
        if (str.color === '') {
          return <div style={FONT_MESSAGE} dangerouslySetInnerHTML={{ __html: str.content }} />;
        } else {
          return (<div style={{
            ...FONT_MESSAGE,
            color: str.color
          }} dangerouslySetInnerHTML={{ __html: str.content }} />);
        }
      }

      if (str.color === '') return <div style={FONT_MESSAGE}>{str.content}</div>;

      return <div style={{
        ...FONT_MESSAGE,
        ...{ color: str.color }
      }}>
        {str.content}
      </div>;
    });

    return (
      <div>
        <Button
          className="programmable-repl-button"
          icon='play'
          active
          onClick={() => this.replInstance.runCode(editorText, this.evalContext)}
          text="Run"
        />
        <div
          ref={e => {
            this.editorAreaRect = e?.getBoundingClientRect();
          }}
          style={{
            padding: `${BOX_PADDING_VALUE}px`,
            border: '2px solid #6f8194'
          }}
        >
          <AceEditor
            ref={e => {
              if (e) {
                this.editorInstance = e.editor;
                this.editorInstance.setOptions({ fontSize: `${this.replInstance.customizedEditorProps.fontSize}pt` });
              }
            }}
            style={{
              width: '100%',
              height: `${editorHeight}px`,
              ...this.replInstance.customizedEditorProps.backgroundImageUrl !== null && {
                backgroundImage: `url(${this.replInstance.customizedEditorProps.backgroundImageUrl})`,
                backgroundColor: `rgba(20, 20, 20, ${this.replInstance.customizedEditorProps.backgroundColorAlpha})`,
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat'
              }
            }}
            mode="javascript"
            theme="twilight"
            onChange={this.onCodeChanged}
            value={editorText}
          />
        </div>
        <div onMouseDown={this.dragBarOnMouseDown} style={{
          cursor: 'row-resize',
          height: '8px'
        }} />
        <div style={{
          padding: `${BOX_PADDING_VALUE}px`,
          border: '2px solid #6f8194'
        }}>
          <div id="output_strings">{outputDivs}</div>
        </div>
      </div>
    );
  }
}

export default defineTab({
  body(context) {
    return <ProgrammableReplGUI context={context} />;
  },
  label: 'Programmable Repl Tab',
  iconName: 'code'
});
