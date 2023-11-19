import React from 'react';

type Props = {
  children?: never;
  className?: string;
  debuggerContext?: any;
};

class Repeat extends React.PureComponent<Props> {
  public render() {
    return <div>This is spawned from the repeat package</div>;
  }
}

export default {
  toSpawn: () => true,
  body: (debuggerContext: any) => <Repeat debuggerContext={debuggerContext} />,
  label: 'Repeat Test Tab',
  iconName: 'build',
};
