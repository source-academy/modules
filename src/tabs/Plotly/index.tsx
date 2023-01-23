import React from 'react';
import { DebuggerContext } from '../../typings/type_helpers';
import Modal from '../common/modal_div';

type Props = {
  children?: never
  className?: string
  debuggerContext: any
};

type State = {
  modalOpen: boolean
  modalDiv: any
};

class Plotly extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalDiv: <div></div>,
    };
  }

  handleOpen = () => {
    this.setState({ modalOpen: true });
    const plotlyDiv = document.getElementById('myDiv')?.innerHTML;
    if (plotlyDiv) {
      this.setState({ modalDiv: plotlyDiv });
    }
  };

  public render() {
    const { context: { moduleContexts: { plotly: { state: { drawnPlots } } } } } = this.props.debuggerContext;

    return (
      <div>
        <Modal
          open={this.state.modalOpen}
          height={'80vh'}
          width={'50vw'}
          handleClose={() => this.setState({ modalOpen: false })}
        >
          <div
          id='modalDiv'
          ref={(r) => {
            drawnPlots[0].draw('modalDiv');
          }}
        ></div>
        </Modal>
        <div onClick={() => this.handleOpen()}>Click here to open Modal</div>
        <div
          id='myDiv'
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
