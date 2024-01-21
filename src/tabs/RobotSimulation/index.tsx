import React from 'react';
import { type DebuggerContext } from '../../typings/type_helpers';
import Main from './components/Main';

/**
 * Robot Simulation
 * @author Joel Chan
 */

/**
 * React Component props for the Tab.
 */
type Props = {
  children?: never;
  className?: never;
  context?: any;
};

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn(context: DebuggerContext) {
    const worldState = context.context.moduleContexts.robot_simulation.state?.world?.state;
    return (
      worldState !== undefined
    );
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: DebuggerContext) => <Main context={context} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Sample Tab',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'build',
};
