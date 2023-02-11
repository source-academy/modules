/**
 * Tab for Source Academy Programmable REPL module
 * @module programmable_repl
 * @author Wang Zihan
 */


/*
Requires Node Modules:
ace-builds
react-ace
diff-match-patch
lodash.isequal
lodash.get
*/

import React from 'react';
import { type DebuggerContext } from '../../typings/type_helpers';
import { Button, ButtonGroup, Divider, NumericInput } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { type ProgrammableRepl } from '../../bundles/programmable_repl/programmable_repl';
// import './ace-builds/src-noconflict/ace';
// import AceEditor from './react-ace';
// import { Ace } from 'ace-builds';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';
// import './styles.css';


type GUI_Data = {
  programmableReplInstance: ProgrammableRepl;
};

class ProgrammableReplGUI extends React.Component<GUI_Data> {
  public replInstance : ProgrammableRepl;
  // private _editorInstance : any;
  constructor(data: GUI_Data) {
    super(data);
    this.replInstance = data.programmableReplInstance;
    this.replInstance.setTabReactComponentInstance(this);
    // this._editorInstance = null;
  }
  public render() {
    const outputDivs : JSX.Element[] = [];
    const outputStringCount = this.replInstance.outputStrings.length;
    for (let i = 0; i < outputStringCount; i++) {
      // outputDivs.push( <div style={{ color: this.replInstance.outputStrings[i].color }} >{this.replInstance.outputStrings[i].content}</div> );
      outputDivs.push(<div style={{ color: this.replInstance.outputStrings[i].color }} dangerouslySetInnerHTML={ { __html: this.replInstance.outputStrings[i].content }} />);
    }
    /*  const styles=CSS`.ace_gutter-cell.ace_breakpoint{
    border-radius: 20px 0px 0px 20px;
    box-shadow: 0px 0px 1px 1px #248c46 inset;
    }`;*/
    return (
      <div>
        <Button
          className="programmable-repl-button"
          icon={IconNames.PLAY}
          active={true}
          onClick={() => this.replInstance.RunCode()}// Note: Here if I directly use "this.replInstance.RunCode" instead using this lambda function, the "this" reference will become undefined and lead to a runtime error when user clicks the "Run" button
          text="Run"
        />
        <Button
          className="programmable-repl-button"
          icon={IconNames.FLOPPY_DISK}
          active={true}
          onClick={() => this.replInstance.saveEditorContent()}// Note: Here if I directly use "this.replInstance.RunCode" instead using this lambda function, the "this" reference will become undefined and lead to a runtime error when user clicks the "Run" button
          text="Save"
        />
        <AceEditor
          ref={ (e) => this.replInstance.SetEditorInstance(e?.editor)}
          style= { {
            width: '100%',
            height: '375px',
            ...(this.replInstance.customizedEditorProps.backgroundImageUrl != 'no-background-image' && {
              backgroundImage: `url(${this.replInstance.customizedEditorProps.backgroundImageUrl})`,
              backgroundColor: `rgba(20, 20, 20, ${this.replInstance.customizedEditorProps.backgroundColorAlpha})`,
              backgroundSize: '100%',
              backgroundRepeat: 'no-repeat',
            }),
          } }
          mode="javascript" theme="twilight"
          onChange={ (newValue) => this.replInstance.UpdateUserCode(newValue) }
          value={this.replInstance.userCodeInEditor.toString()}
          // editorProps = { {fontSize: 17} }
        />
        <div id="output_strings">{outputDivs}</div>
      </div>
    );
    // <AceEditor style= { { width: '720px', height: '375px' } } mode='javascript' theme='twilight' onChange={ newValue => this.replInstance.UpdateUserCode(newValue) } value={this.replInstance.userCodeInEditor.toString()} />;
    // value={this.replInstance.userCodeInEditor.toString()}
    // <textarea style= { { width: '720px', height: '375px' } } onChange={e => this.replInstance.UpdateUserCode(e.target.value) } />
  }
}


export default {
  /**
   * This function will be called to determine if the component will be
   * rendered.
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn(context: DebuggerContext) {
    return true;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    return <ProgrammableReplGUI programmableReplInstance={context.context.moduleContexts.programmable_repl.state} />;
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Programmable REPL Tab',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'code',
};
