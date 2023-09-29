/**
 * Robot simulation
 * @module robot_simulation
 */

import { initEngines } from './three-rapier-controller/init';

export function show() {
  console.log('show function called');
}

export function init_simulation() {
  initEngines();
}
