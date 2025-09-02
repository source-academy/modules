import { DrawnPlot } from '@sourceacademy/bundle-plotly/plotly';
import Modal from '@sourceacademy/modules-lib/tabs/ModalDiv';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types/index';
import { useState } from 'react';

export const Plotly: ModuleTab = ({ context }) => {
  const [selectedPlot, setSelectedPlot] = useState<DrawnPlot | null>(null);
  const { context: { moduleContexts: { plotly: { state: { drawnPlots } } } } } = context;

  return <div>
    <Modal
      open={selectedPlot !== null}
      height='90vh'
      width='80vw'
      handleClose={() => setSelectedPlot(null)}
    >
      <div
        id="modalDiv"
        ref={() => {
          if (selectedPlot) {
            selectedPlot.draw('modalDiv');
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
            <div onClick={() => setSelectedPlot(drawnPlot)}
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

  </div>;
};

export default defineTab({
  toSpawn(context) {
    const drawnPlots = context.context?.moduleContexts?.plotly.state.drawnPlots;
    return drawnPlots.length > 0;
  },
  body: debuggerContext => <Plotly context={debuggerContext} />,
  label: 'Plotly',
  iconName: 'scatter-plot'
});
