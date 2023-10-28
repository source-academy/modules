import React from 'react';
import { type DrawnPlot } from '../../bundles/plotly/plotly';
import { type DebuggerContext } from '../../typings/type_helpers';
import Modal from '../common/ModalDiv';

type Props = {
  children?: never
  className?: string
  debuggerContext: any
};

type State = {
  modalOpen: boolean
  selectedPlot: any | null
};

class Plotly extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedPlot: null,
    };
  }

  handleOpen = (selectedPlot: DrawnPlot) => {
    this.setState({
      modalOpen: true,
      selectedPlot,
    });
  };

  public render() {
    const { context: { moduleContexts: { plotly: { state: { drawnPlots } } } } } = this.props.debuggerContext;

    return (
      <div>
        <Modal
          open={this.state.modalOpen}
          height={'90vh'}
          width={'80vw'}
          handleClose={() => this.setState({ modalOpen: false })}
        >
          <div
            id="modalDiv"
            ref={() => {
              if (this.state.selectedPlot) {
                this.state.selectedPlot.draw('modalDiv');
              }
            }}
            style={{ height: '80vh' }}
          ></div>
        </Modal>
        {
          drawnPlots.map((drawnPlot: any, id:number) => {
            const divId = `plotDiv${id}`;
            return (
              <div style={{ height: '80vh' }} key={divId}>
                <div onClick={() => this.handleOpen(drawnPlot)}>Click here to open Modal</div>
                <div
                  id={divId}
                  style={{ height: '80vh' }}
                  ref={() => {
                    drawnPlot.draw(divId);
                  }}
                ></div>
              </div>
            );
          })
        }

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
  iconName: 'scatter-plot',
};
