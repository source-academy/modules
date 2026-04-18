import { DrawnPlot } from '@sourceacademy/bundle-plotly/plotly';
import Modal from '@sourceacademy/modules-lib/tabs/ModalDiv';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types/index';
import { useState } from 'react';

interface PlotlyModuleState {
  drawnPlots: DrawnPlot[];
}

export const Plotly: ModuleTab = ({ debuggerCtx: context }) => {
  const [selectedPlot, setSelectedPlot] = useState<DrawnPlot | null>(null);
  const { drawnPlots } = getModuleState<PlotlyModuleState>(context, 'plotly')!;

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
      drawnPlots.map((drawnPlot, id) => {
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
    const state = getModuleState<PlotlyModuleState>(context, 'plotly');
    return !!state && state.drawnPlots.length > 0;
  },
  body: debuggerContext => <Plotly debuggerCtx={debuggerContext} />,
  label: 'Plotly',
  iconName: 'scatter-plot'
});
