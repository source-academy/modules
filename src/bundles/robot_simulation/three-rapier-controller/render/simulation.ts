import context from 'js-slang/context';
import { type RobotSimulation } from '../init';

console.log('Simulation is being initialized');

const initial_simulation: RobotSimulation = { state: 'idle' };
const contextState = context.moduleContexts.robot_simulation.state;

if (contextState === null) {
  context.moduleContexts.robot_simulation.state = { simulation: initial_simulation };
  console.log('simulation is being set to initial state');
}

export const getSimulation = ():RobotSimulation => context.moduleContexts.robot_simulation.state.simulation;
export const setSimulation = (newSimulation:RobotSimulation):void => {
  context.moduleContexts.robot_simulation.state.simulation = newSimulation;
  console.log('Setting new value into simulation', newSimulation);
};
