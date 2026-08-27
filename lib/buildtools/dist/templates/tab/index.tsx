import React from 'react';
import { defineTab } from '@sourceacademy/modules-lib/tabs'

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
function Repeat(props: Props) {
  const [counter] = React.useState(0);
  return (
    <div>This is spawned from the repeat package. Counter is {counter}</div>
  );
}

export default defineTab({
  toSpawn: (context: any) => context.result.value === 'test',
  body: (context: any) => <Repeat context={context} />,
  label: 'Sample Tab',
  iconName: 'build',
});
