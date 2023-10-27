import TabUi from './TabUi';
import { Modal } from './Modal';
import { useState } from 'react';
import SimulationCanvas from './Simulation';
import { type DebuggerContext } from '../../../typings/type_helpers';

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
