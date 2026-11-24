/**
 * Visualize n-body simulations.
 * @author Yeluri Ketan
 */

import { Button, ButtonGroup, Checkbox, NumericInput, Tooltip } from '@blueprintjs/core';
import type { NBodyModuleState } from '@sourceacademy/bundle-nbody/types';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay';
import PlayButton from '@sourceacademy/modules-lib/tabs/PlayButton';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types/index';
import type { Simulation } from 'nbody';
import { useState } from 'react';

/**
 * React component props for the control buttons.
 */
interface SimControlProps {
  sim: Simulation;
};

/**
 * Compoennt for displaying the button controls that affect the parameters of
 * the simulations
 */
function SimulationControls({ sim }: SimControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showTrails, setShowTrails] = useState(sim.getShowTrails());
  const [showUniverse, setShowUniverse] = useState(sim.universes.map(() => true));

  return <>
    <ButtonGroup style={{ width: '100%', margin: '4px auto' }}>
      <PlayButton
        isPlaying={isPlaying}
        active={false}
        onClick={() => {
          setIsPlaying(!isPlaying);
          if (isPlaying) {
            sim.pause();
          } else {
            sim.resume();
          }
        }}
        style={{ margin: '4px' }}
      />
      <Button
        className="nbody-trails-toggle-button"
        icon='route'
        active={showTrails}
        onClick={() => {
          setShowTrails(!showTrails);
          sim.setShowTrails(!showTrails);
        }}
        style={{ margin: '4px' }}
        text={(showTrails ? 'Hide' : 'Show') + ' Trails'}
      />
    </ButtonGroup>
    <Tooltip content="Sim Speed">
      <NumericInput
        value={speed}
        onValueChange={value => {
          if (value < 0) value = 0;

          setSpeed(value);
          sim.setSpeed(value);
        }}
        style={{
          margin: '4px auto'
        }}
      />
    </Tooltip>
    <ButtonGroup style={{
      margin: '4px auto'
    }}>
      {sim.universes.map((universe, i) => (
        <Checkbox
          key={i}
          className={`"nbody-show-universe-${i}-button"`}
          checked={showUniverse[i]}
          onClick={() => {
            // TODO: Figure out why this doesn't update when the sim isn't playing
            sim.setShowUniverse(universe.label, !showUniverse[i]);
            setShowUniverse(showUniverse.map((v, j) => i === j ? !v : v));
          }}
          style={{ margin: '4px' }}
        >
          Show {universe.label}
        </Checkbox>
      ))}
    </ButtonGroup>
  </>;
}

/**
 * The main React Component of the Tab.
 */
const Nbody: ModuleTab = ({ debuggerCtx: context }) => {
  const { simulations, recordInfo } = getModuleState<NBodyModuleState>(context, 'nbody')!;

  return <MultiItemDisplay
    elements={simulations.map((sim, i) => {
      const divId = `nbody-${i}`;
      return <div>
        <SimulationControls sim={sim} />
        <div style={{
          height: '80vh',
          marginBottom: '5vh',
        }} key={divId}
        >
          <div
            id={divId}
            style={{
              height: '500px',
              width: '500px',
            }}
            ref={() => {
              if (recordInfo.isRecording) {
                sim.start(divId, 500, 500, 1, true, recordInfo.recordFor, recordInfo.recordSpeed);
              } else {
                sim.start(divId, 500, 500, 1, true);
              }
            }}
          />
        </div>
      </div>;
    })}
  />;
};

export default defineTab({
  toSpawn(context) {
    const state = getModuleState<NBodyModuleState>(context, 'nbody');
    return !!state && state.simulations.length > 0;
  },
  body: (context) => <Nbody debuggerCtx={context} />,
  label: 'Nbody Viz Tab',
  iconName: 'clean',
});
