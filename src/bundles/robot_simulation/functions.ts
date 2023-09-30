/**
 * Robot simulation
 * @module robot_simulation
 */

import { getSimulation, initEngines } from './three-rapier-controller/init';

export function show() {
  console.log('show function called');
}

export function init_simulation() {
  initEngines();
}


export function getRobot() {
  const simulation = getSimulation();
  return simulation.state;
}
