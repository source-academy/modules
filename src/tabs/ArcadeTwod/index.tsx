import React from 'react';

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
  time: number;
};

/**
 * The main React Component of the Tab.
 */
class Repeat extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      time: Date.now(),
    };
    console.log('inside repeat react component');
    if (this.props.context?.result?.value?.init !== undefined) {
      this.props.context.result.value.init(); // pass the initialized GameObjects and the update function to the phaser canvas
    }
    if (this.props.context?.result?.value?.update !== undefined) {
      this.props.context.result.value.update(); // the actual update function that can be specified in the SA program
    }
  }

  // timer

  public render() {
    const { counter } = this.state;
    return (
      <div>
        <div>This is spawned from the repeat package. Counter is {counter}</div>
      </div>
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
  // toReplString() may not exist, which causes the page to crash
  toSpawn(context: any) {
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
  body: (context: any) => <Repeat context={context} />,

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
