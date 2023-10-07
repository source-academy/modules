/**
 * Robot simulation
 * @module robot_simulation
 */

import { initEngines } from './three-rapier-controller/init';
import context from 'js-slang/context';
import { getSimulation } from './three-rapier-controller/render/simulation';


export function show() {
  console.log('hi');
}

export function init_simulation() {
  const code = context.unTypecheckedCode[0];
  initEngines(code);
}

export function is_ready() {
  const simulation = getSimulation();
  return simulation.state === 'ready';
}

export function forward() {
  const simulation = getSimulation();
  if (simulation.state !== 'ready') {
    console.log('Not ready');
    return 'Not ready';
  }
  console.log('Ready');
  return 'Ready';
}
