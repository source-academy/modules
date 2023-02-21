import React from 'react';
import Phaser from 'phaser';
import { DebuggerContext } from '../../typings/type_helpers';

/**
 * Game display tab for user-created games made with the Arcade2D module.
 *
 * @module arcade_two_d
 * @author Titus Chew Xuan Jun
 * @author Xenos Fiorenzo Anong
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
  time: number;
};

/**
 * The main React Component of the Tab.
 */
class GameCanvas extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      time: Date.now(),
    };
    if (this.props.context?.result?.value?.init !== undefined) {
      this.props.context.result.value.init(); // pass the initialized GameObjects and the update function to the phaser canvas
    }
    if (this.props.context?.result?.value?.update !== undefined) {
      this.props.context.result.value.update(); // the actual update function that can be specified in the SA program
    }
  }

  componentDidMount() {
    const config = this.props.context.context?.moduleContexts?.arcade_two_d?.state?.gameConfig;
    // Initialise game
    const game = new Phaser.Game(config);
  }

  shouldComponentUpdate() {
    // Component itself is a wrapper & should not update - Phaser handles the game updates
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
   * rendered. Currently spawns when there is a stored game config, or if
   * the string in the REPL is "[Arcade2D]".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn(context: DebuggerContext) {
    const config = context.context?.moduleContexts?.arcade_two_d?.state?.gameConfig;
    if (config !== null) {
      return true;
    }

    // toReplString() may not exist, which causes the page to crash
    // testing
    console.log(context);
    if (context.result.value !== undefined && context.result.value.toReplString !== undefined) {
      console.log('successful detection of repl string'); // works
      console.log(context.result.value.toReplString());
      return context.result.value.toReplString() === '[Arcade 2D]';
    }
    console.log('undefined: buildGame not last function');
    return false;
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
