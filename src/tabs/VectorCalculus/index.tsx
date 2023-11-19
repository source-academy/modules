import React from 'react'
import { ConePlot } from '../../bundles/vector_calculus/vector_calculus'
import {type  DebuggerContext } from '../../typings/type_helpers'
import Modal from '../common/ModalDiv'

type Props = {
  children?: never
  className?: string
  debuggerContext: any
}

type State = {
  modalOpen: boolean
  selectedVectorPlot: any | null
}

class VectorCalculus extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      modalOpen: false,
      selectedVectorPlot: null,
    }
  }

  handleOpen = (selectedVectorPlot: ConePlot) => {
    this.setState({
      modalOpen: true,
      selectedVectorPlot,
    })
  }

  public render() {
    const {
      context: {
        moduleContexts: {
          vector_calculus: {
            state: { drawnVectors },
          },
        },
      },
    } = this.props.debuggerContext

    return (
      <div>
        <Modal
          open={this.state.modalOpen}
          height={'80vh'}
          width={'80vw'}
          handleClose={() => this.setState({ modalOpen: false })}
        >
          <div
            id="modalDiv"
            ref={() => {
              if (this.state.selectedVectorPlot) {
                this.state.selectedVectorPlot.draw('modalDiv')
              }
            }}
            style={{ height: '80vh', width: '80vw' }}
          ></div>
        </Modal>
        {drawnVectors.map((drawnVector: any, id: number) => {
          const divId = `plotDiv${id}`
          return (
            <>
              <div onClick={() => this.handleOpen(drawnVector)}>
                Click here to open Modal
              </div>
              <div
                id={divId}
                ref={() => {
                  drawnVector.draw(divId)
                }}
              ></div>
            </>
          )
        })}
        <div>
          <canvas width={500} height={250}id="simulation"></canvas>
        </div>
      </div>
    )
  }
}

export default {
  toSpawn(context: DebuggerContext) {
    const drawnVectors =
      context.context?.moduleContexts?.vector_calculus.state.drawnVectors
    return drawnVectors.length > 0
  },
  body: (debuggerContext: any) => (
    <VectorCalculus debuggerContext={debuggerContext} />
  ),
  label: 'Vector Calculus Test Tab',
  iconName: 'scatter-plot',
}
