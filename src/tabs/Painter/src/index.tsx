import type { LinePlot } from '@sourceacademy/bundle-painter/painter';
import Modal from '@sourceacademy/modules-lib/tabs/ModalDiv';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types/index';
import { useState } from 'react';

export const Painter: ModuleTab = ({ context }) => {
  const [selectedPainter, setSelectedPainter] = useState<LinePlot | null>( null);
  const { context: { moduleContexts: { painter: { state: { drawnPainters } } } } } = context;

  return (
    <div>
      <Modal
        open={selectedPainter !== null}
        height='20rem'
        width='20rem'
        handleClose={() => setSelectedPainter(null)}
      >
        <div
          id="modalDiv"
          ref={() => {
            if (selectedPainter) {
              selectedPainter.draw('modalDiv');
            }
          }}
          style={{
            height: '20rem',
            width: '20rem'
          }}
        />
      </Modal>
      {
        drawnPainters.map((drawnPainter: any, id: number) => {
          const divId = `plotDiv${id}`;
          return (
            <>
              <div onClick={() => setSelectedPainter(drawnPainter)}
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
              />
            </>
          );
        })
      }

    </div>
  );
};

export default defineTab({
  toSpawn(context) {
    const drawnPainters = context.context?.moduleContexts?.painter.state.drawnPainters;
    console.log(drawnPainters);
    return drawnPainters.length > 0;
  },
  body: debuggerContext => <Painter context={debuggerContext} />,
  label: 'Painter Test Tab',
  iconName: 'scatter-plot'
});
