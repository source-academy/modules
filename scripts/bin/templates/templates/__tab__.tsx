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
};

/**
 * The main React Component of the Tab.
 */
class Repeat extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    };
  }

  public render() {
    const { counter } = this.state;
    return (
      <div>This is spawned from the repeat package. Counter is {counter}</div>
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
  toSpawn: (context: any) => context.result.value === 'test',

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