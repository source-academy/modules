import React from 'react';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils'

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

export default defineTab({
  toSpawn: (context: any) => context.result.value === 'test',

  body: (context: any) => <Repeat context={context} />,

  label: 'Sample Tab',

  iconName: 'build',
});