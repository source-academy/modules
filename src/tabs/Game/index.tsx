import React from 'react';

type Props = {
  children?: never;
  className?: string;
  debuggerContext?: any;
};

class Game extends React.PureComponent<Props> {
  public render() {
    return (
      <div>
        Info: You need to visit your room in order to see the effect of your
        program. Remember to save your room code in the <q>My Room</q>{' '}
        assessment first.
      </div>
    );
  }
}

export default {
  toSpawn: () => true,
  body: (debuggerContext: any) => <Game debuggerContext={debuggerContext} />,
  label: 'Game Info Tab',
  iconName: 'info-sign',
};
