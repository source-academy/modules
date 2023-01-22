import React from 'react';
import { DebuggerContext } from '../../typings/type_helpers';

type Props = {
  children?: never
  className?: string
  debuggerContext: any
};

class Plotly extends React.PureComponent<Props> {
  public render() {
    const { context: { moduleContexts: { plotly: { state: { drawnPlots } } } } } = this.props.debuggerContext;
    return (
      <div>
        <div
          id="myDiv"
          ref={(r) => {
            drawnPlots[0].draw();
          }}
        ></div>
      </div>
    );
  }
}

export default {
  toSpawn(context: DebuggerContext) {
    const drawnPlots = context.context?.moduleContexts?.plotly.state.drawnPlots;
    return drawnPlots.length > 0;
  },
  body: (debuggerContext: any) => <Plotly debuggerContext={debuggerContext} />,
  label: 'Plotly Test Tab',
  iconName: 'build',
};
