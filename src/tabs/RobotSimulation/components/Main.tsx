import { useState } from 'react';
import { type DebuggerContext } from '../../../typings/type_helpers';
import { Modal } from './Modal';
import SimulationCanvas from './Simulation';
import TabUi from './TabUi';

export default function Main({ context }: { context:DebuggerContext }): JSX.Element {
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
        <SimulationCanvas context={context} isOpen={isCanvasShowing}/>
      </Modal>
    </div>
  );
}
