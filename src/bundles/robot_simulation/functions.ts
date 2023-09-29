/**
 * Robot simulation
 * @module robot_simulation
 */

import context from 'js-slang/context';
import { type RobotSimulation, initEngines } from './three-rapier-controller/init';

const initial_simulation: RobotSimulation = { state: 'idle' };
const contextState = context.moduleContexts.robot_simulation.state;
if (contextState === null) {
  context.moduleContexts.robot_simulation.state = { simulation: initial_simulation };
}

export const getSimulation = ():RobotSimulation => context.moduleContexts.robot_simulation.state.simulation;
export const setSimulation = (newSimulation:RobotSimulation):void => {
  context.moduleContexts.robot_simulation.state.simulation = newSimulation;
  console.log('Setting new value into simulation', newSimulation);
};


export function show() {
  console.log('show function called');
}

export function init_simulation() {
  initEngines();
}
