import React from 'react';
import { type DebuggerContext } from '../../typings/type_helpers';
import Canvas from "./canvas"

/**
 * <Brief description of the tab>
 * @author <Author Name>
 * @author <Author Name>
 */

/**
 * React Component props for the Tab.
 */
type Props = {
  children?: never;
  className?: never;
  context?: any;
};

/**
 * React Component state for the Tab.
 */
type State = {
  counter: number;
};

/**
 * The main React Component of the Tab.
 */
class RobotMaze extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { context: { moduleContexts: { robot_minigame } } } = this.props.context;

    return (
      <Canvas state={robot_minigame.state}></Canvas>
    );
  }
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
    toSpawn(context: DebuggerContext) {
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