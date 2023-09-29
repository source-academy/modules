import { useRef, type CSSProperties, useEffect, useState } from 'react';
import { type SimulationStates } from '../../../../bundles/robot_simulation/three-rapier-controller/constants/states';
import type { DebuggerContext } from '../../../../typings/type_helpers';

const CanvasWrapperStyle: CSSProperties = {
  width: 800,
  height: 600,
  backgroundColor: 'black',
};


export default function SimulationCanvas({ context }: { context:DebuggerContext }) {
  const ref = useRef<HTMLDivElement>(null);
  const [currentState, setCurrentState] = useState<SimulationStates>('idle');
  const simulation = context.context.moduleContexts.robot_simulation.state.simulation;

  useEffect(() => {
    const startThreeAndRapierEngines = async () => {
      console.log(simulation.state, currentState);
      setCurrentState(simulation.state);
    };

    const attachRenderDom = () => {
      if (simulation.state !== 'ready') {
        throw new Error('Tried to attach dom to an unavailable simulation');
      }
      const renderer = simulation.renderer;
      if (ref.current && renderer) {
        ref.current.replaceChildren(renderer.domElement);
      }
    };

    if (currentState === 'idle') {
      startThreeAndRapierEngines();
    }

    if (currentState === 'ready') {
      attachRenderDom();
    }
    if (currentState === 'loading') {
      setTimeout(() => {
        setCurrentState('idle');
      }, 500);
    }
  }, [currentState]);

  return <>
    <div style={CanvasWrapperStyle} ref={ref}>{currentState}</div>
  </>;
}
