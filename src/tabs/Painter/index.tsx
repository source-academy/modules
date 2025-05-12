import type { LinePlot } from '@sourceacademy/bundle-painter/painter';
import Modal from '@sourceacademy/modules-lib/tabs/ModalDiv';
import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
import React from 'react';

type Props = {
  children?: never
  className?: string
  debuggerContext: any
};

type State = {
  modalOpen: boolean
  selectedPainter: any | null
};

class Painter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedPainter: null
    };
  }

  handleOpen = (selectedPainter: LinePlot) => {
    this.setState({
      modalOpen: true,
      selectedPainter
    });
  };

  public render() {
    const { context: { moduleContexts: { painter: { state: { drawnPainters } } } } } = this.props.debuggerContext;

    return (
      <div>
        <Modal
          open={this.state.modalOpen}
          height={'20rem'}
          width={'20rem'}
          handleClose={() => this.setState({ modalOpen: false })}
        >
          <div
            id="modalDiv"
            ref={() => {
              if (this.state.selectedPainter) {
                this.state.selectedPainter.draw('modalDiv');
              }
            }}
            style={{
              height: '20rem',
              width: '20rem'
            }}
          >
          </div>
        </Modal>
        {
          drawnPainters.map((drawnPainter: any, id:number) => {
            const divId = `plotDiv${id}`;
            return (
              <>
                <div onClick={() => this.handleOpen(drawnPainter)}
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
                  ref={() => {
                    console.log(drawnPainter);
                    drawnPainter.draw(divId);
                  }}
                >
                </div>
              </>
            );
          })
        }

      </div>
    );
  }
}

export default {
  toSpawn(context: DebuggerContext) {
    const drawnPainters = context.context?.moduleContexts?.painter.state.drawnPainters;
    console.log(drawnPainters);
    return drawnPainters.length > 0;
  },
  body: (debuggerContext: any) => <Painter debuggerContext={debuggerContext} />,
  label: 'Painter Test Tab',
  iconName: 'scatter-plot'
};
