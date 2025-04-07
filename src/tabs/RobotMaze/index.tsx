import React from 'react';
import type { DebuggerContext } from '../../typings/type_helpers';
import RobotSimulation from './components/RobotSimulation';

/**
 * Renders the robot minigame in the assessment workspace
 * @author Koh Wai Kei
 * @author Justin Cheng
 */

/**
 * React Component props for the Tab.
 */
interface MainProps {
  children?: never
  className?: never
  context?: DebuggerContext
}

/**
 * The main React Component of the Tab.
 */
const RobotMaze : React.FC<MainProps> = ({ context }) => {
  return (
    <RobotSimulation state={context?.context.moduleContexts.robot_minigame.state}></RobotSimulation>
  );
};

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn(context: DebuggerContext) {
    // !!! TEMPORARY DEBUGGING FUNCTION, REMOVE ONCE MODULE IS COMPLETE !!!
    console.log(context.context?.moduleContexts?.robot_minigame.state);

    return context.context?.moduleContexts?.robot_minigame.state.isInit;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: any) => <RobotMaze context={context} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Robot Maze',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'build',
};
