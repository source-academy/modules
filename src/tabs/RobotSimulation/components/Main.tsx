import TabUi from './TabUi';
import { Modal } from './Modal';
import { useState } from 'react';
import SimulationCanvas from './Simulation';

export default function Main(): JSX.Element {
  const [isCanvasShowing, setIsCanvasShowing] = useState<boolean>(false);

  return (
    <div>
      <TabUi
        onOpenCanvas={() => {
          setIsCanvasShowing(true);
        }}
      />
      <Modal
        isOpen={isCanvasShowing}
        onClose={() => {
          setIsCanvasShowing(false);
        }}
      >
        <SimulationCanvas/>
      </Modal>
    </div>
  );
}
