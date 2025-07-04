import React from 'react';
import type { DebuggerContext } from '../../typings/type_helpers';
import MazeSimulation from './MazeSimulation';

/**
 * Renders the maze simulation in the assessment workspace
 * @author Koh Wai Kei
 * @author Justin Cheng
 */

/**
 * React Component props for the Tab.
 */
interface MainProps {
  context?: DebuggerContext
}

/**
 * The main React Component of the Tab.
 */
const Maze : React.FC<MainProps> = ({ context }) => {
  return (
    <MazeSimulation state={context?.context.moduleContexts.maze.state}></MazeSimulation>
  );
};

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: (context: DebuggerContext) => context.context?.moduleContexts?.maze.state.isInit,

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: DebuggerContext) => <Maze context={context} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Maze',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'layout-grid',
};
