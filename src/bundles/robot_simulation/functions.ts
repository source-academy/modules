/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Robot simulation
 * @module robot_simulation
 */

import context from 'js-slang/context';

import { getWorld } from './simulation';
import { type MotorsOptions } from './simulation/controllers/car/car_controller';

export function show() {
  console.log('This is the show function');
}

export function init_simulation() {
  const code = context.unTypecheckedCode[0];
  const world = getWorld();
  world.init(code);
  if (world.state === 'loading') {
    throw new Error('Interrupt execution by module');
  }
}

export function ev3_motorA() {
  const world = getWorld();
  if (world.state === 'loading') {
    return -1;
  }

  return world.carController.motorA();
}

export function ev3_motorB() {
  const world = getWorld();
  if (world.state === 'loading') {
    return -1;
  }

  return world.carController.motorB();
}

export function ev3_motorC() {
  const world = getWorld();
  if (world.state === 'loading') {
    return -1;
  }

  return world.carController.motorC();
}

export function ev3_motorD() {
  const world = getWorld();
  if (world.state === 'loading') {
    return -1;
  }

  return world.carController.motorD();
}

export function ev3_runToRelativePosition(
  motor: MotorsOptions,
  position: number,
  speed: number,
) {
  const world = getWorld();
  if (world.state === 'loading') {
    return;
  }

  world.carController.runToRelativePosition(motor, position, speed);
}

export function ev3_pause(time: number) {
  const world = getWorld();
  if (world.state === 'loading') {
    return;
  }

  world.carController.pause(time);
}
