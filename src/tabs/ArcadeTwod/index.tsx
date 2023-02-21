import React from 'react';
import Phaser from 'phaser';
import { DebuggerContext } from '../../typings/type_helpers';

/**
 * Game display tab for user-created games made with the Arcade2D module.
 * 
 * @module arcade_two_d
 * @author Xenos Fiorenzo Anong
 * @author Titus Chew Xuan Jun
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
class GameCanvas extends React.Component<Props, State> {
  componentDidMount() {
    const config = this.props.context.context?.moduleContexts?.arcade_two_d?.state?.gameConfig;
    const game = new Phaser.Game(config);
  }

  shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (
      <div id="phaser-game" />
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
  toSpawn(context: DebuggerContext) {
    const config = context.context?.moduleContexts?.arcade_two_d?.state?.gameConfig;
    return config !== null;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: any) => <GameCanvas context={context} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Arcade2D Tab',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'shapes',
};