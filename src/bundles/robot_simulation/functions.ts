/**
 * Robot simulation
 * @module robot_simulation
 */

import context from 'js-slang/context';

import { getWorld } from './simulation';


export function show() {
  console.log('This is the show function');
}


export function init_new_simulation() {
  const code = context.unTypecheckedCode[0];
  const world = getWorld();
  world.init(code);
}

export function ev3_runToRelativePosition(motor:number, position: number, speed:number) {
  const world = getWorld();
  if (world.state === 'loading') {
    return;
  }

  world.carController.runToRelativePosition(motor, position, speed);
}
