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
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

type Props = {
  programmableReplInstance: ProgrammableRepl;
};

class ProgrammableReplGUI extends React.Component<Props> {
  public replInstance : ProgrammableRepl;
  constructor(data: Props) {
    super(data);
    this.replInstance = data.programmableReplInstance;
    this.replInstance.setTabReactComponentInstance(this);
  }
  public render() {
    const outputDivs : JSX.Element[] = [];
    const outputStringCount = this.replInstance.outputStrings.length;
    for (let i = 0; i < outputStringCount; i++) {
      const str = this.replInstance.outputStrings[i];
      if (str.outputMethod === 'richtext') {
        if (str.color === '') {
          outputDivs.push(<div dangerouslySetInnerHTML={ { __html: str.content }} />);
        } else {
          outputDivs.push(<div style={{ color: str.color }} dangerouslySetInnerHTML={ { __html: str.content }} />);
        }
      } else if (str.color === '') {
        outputDivs.push(<div>{ str.content }</div>);
      } else {
        outputDivs.push(<div style={{ color: str.color }}>{ str.content }</div>);
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
        <AceEditor
          ref={ (e) => this.replInstance.setEditorInstance(e?.editor)}
          style= { {
            width: '100%',
            height: '375px',
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
        <div id="output_strings">{outputDivs}</div>
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
