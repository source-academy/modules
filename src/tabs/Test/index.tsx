import React from 'react';

type State = {};
type Props = {};

class Test extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public render() {
    return <div>This is spawned from the test package</div>;
  }
}

export default {
  toSpawn: () => true,
  body: () => <Test />,
  label: 'Test Tab',
  iconName: 'build',
};
