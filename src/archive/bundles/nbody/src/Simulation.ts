import { InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import context from 'js-slang/context';
import { RecordingVisualizer3D, RecordingVisualizer, Simulation, type Universe, type VisType } from 'nbody';
import type { Visualizer } from 'nbody/dist/types/src/Visualizer';
import type { RecordInfo } from './types';

/**
 * Create a new simulation.
 * @param universes The universes to simulate.
 * @param visType The visualization type.
 * @param record Whether to record the simulation.
 * @param looped Whether to loop the simulation.
 * @param showTrails Whether to show trails.
 * @param maxTrailLength The maximum length of trails.
 * @returns A new simulation.
 * @category Simulation
 */
export function createSimulation(
  universes: Universe[],
  visType: VisType,
  record?: boolean,
  looped?: boolean,
  showTrails?: boolean,
  maxTrailLength?: number
): Simulation {
  return new Simulation(universes, {
    visType,
    record,
    looped,
    controller: 'code',
    showTrails,
    maxTrailLength,
  });
}

const simulations: Simulation[] = [];
const recordInfo: RecordInfo = {
  isRecording: false,
  recordFor: 0,
  recordSpeed: 0,
};

context.moduleContexts.nbody.state = {
  simulations,
  recordInfo
};

function isRecordingBased(visualizer: Visualizer) {
  return visualizer instanceof RecordingVisualizer || visualizer instanceof RecordingVisualizer3D;
}

/**
 * Play a simulation.
 * @param sim The simulation to play.
 * @category Simulation
 */
export function playSim(sim: Simulation): void {
  while (simulations.length > 0) {
    simulations.pop()!.stop();
  }
  if (isRecordingBased(sim.visualizer)) {
    throw new InvalidParameterTypeError('non-recording simulation', sim, playSim.name);
  }
  recordInfo.isRecording = false;
  simulations.push(sim);
}

/**
 * Record and play a simulation.
 * @param sim simulation to record and play.
 * @param recordFor time to record for.
 * @param recordSpeed speed to record at.
 * @category Simulation
 */
export function recordSim(sim: Simulation, recordFor: number, recordSpeed: number): void {
  while (simulations.length > 0) {
    simulations.pop()!.stop();
  }
  if (!isRecordingBased(sim.visualizer)) {
    throw new InvalidParameterTypeError('recording simulation', sim, recordSim.name);
  }
  recordInfo.isRecording = true;
  recordInfo.recordFor = recordFor;
  recordInfo.recordSpeed = recordSpeed;
  simulations.push(sim);
}
