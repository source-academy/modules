/**
 * Tab for Source Academy Programmable REPL module
 * @module repl
 * @author Wang Zihan
 */

import React from 'react';
import type { DebuggerContext } from '../../typings/type_helpers';
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import type { ProgrammableRepl } from '../../bundles/repl/programmable_repl';
import { FONT_MESSAGE, MINIMUM_EDITOR_HEIGHT } from '../../bundles/repl/config';
// If I use import for AceEditor it will cause runtime error and crash Source Academy when spawning tab in the new module building system.
// import AceEditor from 'react-ace';
const AceEditor = require('react-ace').default;

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

type Props = {
  programmableReplInstance: ProgrammableRepl;
};

type State = {
  editorHeight: number,
  isDraggingDragBar: boolean,
};

const BOX_PADDING_VALUE = 4;

class ProgrammableReplGUI extends React.Component<Props, State> {
  public replInstance : ProgrammableRepl;
  private editorAreaRect;
  private editorInstance;
  constructor(data: Props) {
    super(data);
    this.replInstance = data.programmableReplInstance;
    this.replInstance.setTabReactComponentInstance(this);
    this.state = {
      editorHeight: this.replInstance.editorHeight,
      isDraggingDragBar: false,
    };
  }
  private dragBarOnMouseDown = (e) => {
    e.preventDefault();
    this.setState({ isDraggingDragBar: true });
  };
  private onMouseMove = (e) => {
    if (this.state.isDraggingDragBar) {
      const height = Math.max(e.clientY - this.editorAreaRect.top - BOX_PADDING_VALUE * 2, MINIMUM_EDITOR_HEIGHT);
      this.replInstance.editorHeight = height;
      this.setState({ editorHeight: height });
      this.editorInstance.resize();
    }
  };
  private onMouseUp = (_e) => {
    this.setState({ isDraggingDragBar: false });
  };
  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
  public render() {
    const { editorHeight } = this.state;
    const outputDivs : JSX.Element[] = [];
    const outputStringCount = this.replInstance.outputStrings.length;
    for (let i = 0; i < outputStringCount; i++) {
      const str = this.replInstance.outputStrings[i];
      if (str.outputMethod === 'richtext') {
        if (str.color === '') {
          outputDivs.push(<div style={ FONT_MESSAGE } dangerouslySetInnerHTML={ { __html: str.content }} />);
        } else {
          outputDivs.push(<div style={{
            ...FONT_MESSAGE,
            ...{ color: str.color },
          }} dangerouslySetInnerHTML={ { __html: str.content }} />);
        }
      } else if (str.color === '') {
        outputDivs.push(<div style={ FONT_MESSAGE }>{ str.content }</div>);
      } else {
        outputDivs.push(<div style={{
          ...FONT_MESSAGE,
          ...{ color: str.color },
        }}>{ str.content }</div>);
      }
    }
    return (
      <div>
        <Button
          className="programmable-repl-button"
          icon={IconNames.PLAY}
          active={true}
          onClick={() => this.replInstance.runCode()}// Note: Here if I directly use "this.replInstance.RunCode" instead using this lambda function, the "this" reference will become undefined and lead to a runtime error when user clicks the "Run" button
          text="Run"
        />
        <Button
          className="programmable-repl-button"
          icon={IconNames.FLOPPY_DISK}
          active={true}
          onClick={() => this.replInstance.saveEditorContent()}// Note: Here if I directly use "this.replInstance.RunCode" instead using this lambda function, the "this" reference will become undefined and lead to a runtime error when user clicks the "Run" button
          text="Save"
        />
        <div ref = { (e) => { this.editorAreaRect = e?.getBoundingClientRect(); }} style = {{
          padding: `${BOX_PADDING_VALUE}px`,
          border: '2px solid #6f8194',
        }}>
          <AceEditor
            ref={ (e) => { this.editorInstance = e?.editor; this.replInstance.setEditorInstance(e?.editor); }}
            style= { {
              width: '100%',
              height: `${editorHeight}px`,
              ...(this.replInstance.customizedEditorProps.backgroundImageUrl !== 'no-background-image' && {
                backgroundImage: `url(${this.replInstance.customizedEditorProps.backgroundImageUrl})`,
                backgroundColor: `rgba(20, 20, 20, ${this.replInstance.customizedEditorProps.backgroundColorAlpha})`,
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat',
              }),
            } }
            mode="javascript" theme="twilight"
            onChange={ (newValue) => this.replInstance.updateUserCode(newValue) }
            value={this.replInstance.userCodeInEditor.toString()}
          />
        </div>
        <div onMouseDown = {this.dragBarOnMouseDown} style = {{
          cursor: 'row-resize',
          height: '8px',
        }} />
        <div style = {{
          padding: `${BOX_PADDING_VALUE}px`,
          border: '2px solid #6f8194',
        }}>
          <div id="output_strings">{outputDivs}</div>
        </div>
      </div>
    );
  }
}


export default {
  /**
   * This function will be called to determine if the component will be
   * rendered.
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn(_context: DebuggerContext) {
    return true;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    return <ProgrammableReplGUI programmableReplInstance={context.context.moduleContexts.repl.state} />;
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Programmable Repl Tab',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'code',
};
