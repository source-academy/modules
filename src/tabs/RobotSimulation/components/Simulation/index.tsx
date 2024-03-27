import { Tabs } from '@blueprintjs/core';
import { useRef, type CSSProperties, useEffect, useState } from 'react';

import { type World } from '../../../../bundles/robot_simulation/engine';
import { type WorldState } from '../../../../bundles/robot_simulation/engine/World';
import type { DebuggerContext } from '../../../../typings/type_helpers';

const WrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const CanvasStyle: CSSProperties = {
  width: 900,
  height: 500,
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
};

const bottomPanelStyle: CSSProperties = {
  width: 900,
  height: 200,
  backgroundColor: '#1a2530',
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
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
    = useState<WorldState>('unintialized');
  const world = context.context.moduleContexts.robot_simulation.state
    .world as World;

  useEffect(() => {
    const startThreeAndRapierEngines = async () => {
      setCurrentState(world.state);
    };

    const attachRenderDom = () => {
      if (ref.current) {
        ref.current.replaceChildren(world.render.getElement());
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
      world.start();
    } else {
      world.pause();
    }
  }, [isOpen]);

  return (
    <div style={WrapperStyle}>
      <div style={CanvasStyle}>
        <div ref={ref}>{currentState}</div>
      </div>
      <div style={bottomPanelStyle}>
        <Tabs id="TabsExample">
          {/* This will be added in part 2 */}
        </Tabs>
      </div>
    </div>
  );
}
