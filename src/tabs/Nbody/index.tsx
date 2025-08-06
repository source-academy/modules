import { Button, ButtonGroup, NumericInput } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import type { Simulation } from 'nbody';
import React from 'react';

/**
 * Visualize n-body simulations.
 * @author Yeluri Ketan
 */

/**
 * React Component props for the Tab.
 */
type Props = {
  children?: never;
  className?: never;
  context?: any;
};

/**
 * React component state for the viz tab.
 */
type State = {};

/**
 * React component props for the control buttons.
 */
type SimControlProps = {
  children?: never;
  className?: never;
  context?: any;
  sim: Simulation;
};

/**
 * React component state for the control buttons.
 */
type SimControlState = {
  isPlaying: boolean;
  speed: number;
  showTrails: boolean;
  showUniverse: boolean[];
};

/**
 * Component for UI buttons within tab e.g play/pause.
 */
class SimulationControl extends React.Component<SimControlProps, SimControlState> {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      speed: 1,
      showTrails: props.sim.getShowTrails(),
      showUniverse: props.sim.universes.map(() => true),
    };
  }

  toggleSimPause(): void {
    const currentState = this.state.isPlaying;
    this.setState({ isPlaying: !currentState });
    if (currentState) {
      this.props.sim.pause();
    } else {
      this.props.sim.resume();
    }
  }

  toggleShowTrails(): void {
    const currentState = this.state.showTrails;
    this.setState({ showTrails: !currentState });
    this.props.sim.setShowTrails(!currentState);
  }

  setSpeed(speed: number): void {
    this.setState({ speed });
    this.props.sim.setSpeed(speed);
  }

  toggleShowUniverse(label: string, i: number): void {
    this.props.sim.setShowUniverse(label, !this.state.showUniverse[i]);
    this.setState({
      showUniverse: this.state.showUniverse.map((v, j) => (i === j) ? !v : v)
    });

  }

  public render() {
    return (
      <>
        <ButtonGroup style={{ width: '100%', margin: '4px auto' }}>
          <Button
            className="nbody-pause-toggle-button"
            icon={this.state.isPlaying ? IconNames.PAUSE : IconNames.PLAY}
            active={false}
            onClick={() => this.toggleSimPause()}
            text={this.state.isPlaying ? 'Pause' : 'Play'}
            style={{ margin: '4px' }}
          />

          <Button
            className="nbody-trails-toggle-button"
            icon={IconNames.ROUTE}
            active={this.state.showTrails}
            onClick={() => this.toggleShowTrails()}
            style={{ margin: '4px' }}
            text={(this.state.showTrails ? 'Hide' : 'Show') + ' Trails'} />
        </ButtonGroup>
        <NumericInput defaultValue={this.state.speed} onValueChange={(value) => this.setSpeed(value)} style={{
          margin: '4px auto'
        }} />
        <ButtonGroup style={{
          margin: '4px auto'
        }}>
          {
            this.props.sim.universes.map((universe, i) => {
              return (
                <Button
                  key={i}
                  className={`"nbody-show-universe-${i}-button"`}
                  active={this.state.showUniverse[i]}
                  onClick={() => this.toggleShowUniverse(universe.label, i)}
                  text={(this.state.showUniverse[i] ? 'Hide' : 'Show') + ' ' + universe.label}
                  style={{ margin: '4px' }}
                />
              );
            })
          }
        </ButtonGroup>
      </>
    );
  }
}

/**
 * The main React Component of the Tab.
 */
/**
 * The main React Component of the Tab.
 */
class Nbody extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { };
  }

  public render() {
    const { context: { moduleContexts: { nbody: { state: { simulations, recordInfo } } } } } = this.props.context;

    return (
      <div>
        {(simulations.length === 0)
          ? <div>No simulations found</div>
          : <SimulationControl sim={simulations[0]} />
        }
        {
          simulations.map((sim, i) => {
            const divId = `nbody-${i}`;
            return (
              <div style={{
                height: '80vh',
                marginBottom: '5vh',
              }} key={divId}>
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
            );
          })
        }

      </div>
    );
  }
}

export default defineTab({
  toSpawn(context) {
    console.log('Nbody tospawn');
    const simulations = context.context?.moduleContexts?.nbody.state.simulations;
    return simulations.length > 0;
  },
  body: (context) => <Nbody context={context} />,
  label: 'Nbody Viz Tab',
  iconName: 'clean',
});
