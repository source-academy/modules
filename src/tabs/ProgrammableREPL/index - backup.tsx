/**
 * Tab for Source Academy Programmable REPL module
 * @module programmable_repl
 * @author Wang Zihan
 */

import React from 'react';
import { DebuggerContext } from '../../typings/type_helpers';
import { Button, ButtonGroup, Divider, NumericInput } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ProgrammableRepl } from '../../bundles/programmable_repl/programmable_repl';


type GUI_Data = {
  programmableREPLInstance: ProgrammableRepl;
};

class ProgrammableREPLGUI extends React.Component<GUI_Data> {
  public replInstance : ProgrammableRepl;
  constructor(data: GUI_Data) {
    super(data);
    this.replInstance = data.programmableREPLInstance;
  }
  public render() {
    const outputDivs : JSX.Element[] = [];
    const outputStringCount = this.replInstance.outputStrings.length;
    for ( let i = 0; i < outputStringCount; i++ ) {
      //outputDivs.push( <div style={{ color: this.replInstance.outputStrings[i].color }} >{this.replInstance.outputStrings[i].content}</div> );
      outputDivs.push( <div style={{ color: this.replInstance.outputStrings[i].color }}  dangerouslySetInnerHTML={ { __html: this.replInstance.outputStrings[i].content }} /> );
    }
    return (
      <div>
        <Button
          className="programmable-repl-run-button"
          icon={IconNames.PLAY}
          active={true}
          onClick={()=>this.replInstance.RunCode()}//Note: Here if I directly use "this.replInstance.RunCode" instead using this lambda function, the "this" reference will become undefined and lead to a runtime error when user clicks the "Run" button
          text="Run"
        />
        <textarea style= { { width: '720px', height: '375px' } } onChange={e => this.replInstance.UpdateUserCode(e.target.value) } />
        <div id="output_strings">{outputDivs}</div>
      </div>
    );
    //value={this.replInstance.userCodeInEditor.toString()}
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
    return <ProgrammableREPLGUI programmableREPLInstance={context.context.moduleContexts.programmable_repl.state} />;
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
  iconName: 'info-sign',
};



