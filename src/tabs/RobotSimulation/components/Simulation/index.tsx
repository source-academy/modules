import { useRef, type CSSProperties, useEffect, useState } from 'react';
import { getRenderer, initEngines } from '../../../../bundles/robot_simulation/three-rapier-controller/init';

const CanvasWrapperStyle: CSSProperties = {
  width: 800,
  height: 600,
  backgroundColor: 'black',
};

const simulationCanvasStates = ['idle', 'loading', 'ready', 'error'] as const;

type SimulationCanvasStates = typeof simulationCanvasStates[number];

export default function SimulationCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [currentState, setCurrentState] = useState<SimulationCanvasStates>('idle');

  useEffect(() => {
    const startThreeAndRapierEngines = async () => {
      setCurrentState('loading');
      initEngines()
        .then(() => {
          setCurrentState('ready');
        })
        .catch(() => {
          setCurrentState('error');
        });
    };

    const attachRenderDom = () => {
      const renderer = getRenderer();
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
  }, [currentState]);

  return <div style={CanvasWrapperStyle} ref={ref}>{currentState}</div>;
}
