import { useRef, type CSSProperties, useEffect, useState } from 'react';
import type { DebuggerContext } from '../../../../typings/type_helpers';

import {
  type SimulationStates,
  type World,
} from '../../../../bundles/robot_simulation/simulation/world';

const CanvasWrapperStyle: CSSProperties = {
  width: 800,
  height: 600,
  backgroundColor: 'black',
};

export default function SimulationCanvas({
  context,
  isOpen,
}: {
  context: DebuggerContext;
  isOpen: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [currentState, setCurrentState]
    = useState<SimulationStates>('unintialized');
  const world = context.context.moduleContexts.robot_simulation.state
    .world as World;

  useEffect(() => {
    const startThreeAndRapierEngines = async () => {
      setCurrentState(world.state);
    };

    const attachRenderDom = () => {
      if (ref.current) {
        world.setRendererOutput(ref.current);
      }
    };

    if (currentState === 'unintialized') {
      startThreeAndRapierEngines();
    }

    if (currentState === 'ready' || currentState === 'running') {
      attachRenderDom();
    }
    if (currentState === 'loading') {
      setTimeout(() => {
        setCurrentState('unintialized');
      }, 500);
    }
  }, [currentState]);

  useEffect(() => {
    if (isOpen) {
      world.startSimulation();
    } else {
      world.stopSimulation();
    }
  }, [isOpen]);

  return (
    <>
      <div style={CanvasWrapperStyle} ref={ref}>
        {currentState}
      </div>
    </>
  );
}
