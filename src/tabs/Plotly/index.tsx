import type { DrawnPlot } from '@sourceacademy/bundle-plotly/plotly';
import Modal from '@sourceacademy/modules-lib/tabs/ModalDiv';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import type { DebuggerContext } from '@sourceacademy/modules-lib/types/index';
import React from 'react';

type Props = {
  debuggerContext: DebuggerContext;
};

type State = {
  modalOpen: boolean;
  selectedPlot: any | null;
};

class Plotly extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedPlot: null
    };
  }

  handleOpen = (selectedPlot: DrawnPlot) => {
    this.setState({
      modalOpen: true,
      selectedPlot
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
          />
        </Modal>
        {
          drawnPlots.map((drawnPlot: any, id: number) => {
            const divId = `plotDiv${id}`;
            return (
              <div style={{
                height: '80vh',
                marginBottom: '5vh'
              }} key={divId}>
                <div onClick={() => this.handleOpen(drawnPlot)}
                  style={{
                    cursor: 'pointer',
                    padding: '5px 10px',
                    backgroundColor: '#474F5E',
                    border: '1px solid #aaa',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}
                >Popout plot</div>
                <div
                  id={divId}
                  style={{ height: '80vh' }}
                  ref={() => {
                    drawnPlot.draw(divId);
                  }}
                />
              </div>
            );
          })
        }

      </div>
    );
  }
}

export default defineTab({
  toSpawn(context) {
    const drawnPlots = context.context?.moduleContexts?.plotly.state.drawnPlots;
    return drawnPlots.length > 0;
  },
  body: debuggerContext => <Plotly debuggerContext={debuggerContext} />,
  label: 'Plotly',
  iconName: 'scatter-plot'
});
