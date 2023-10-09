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
  context.runtime.break = true;
}

export function in_simulation() {
  const simulation = getSimulation();
  return simulation.state === 'ready';
}

export function is_ready() {
  const simulation = getSimulation();
  return simulation.state === 'ready';
}

const mag = 0.2;

export function forward() {
  const simulation = getSimulation();
  if (simulation.state !== 'ready') {
    console.log('Not ready');
    return;
  }
  const robot = simulation.robot;
  if (!robot) {
    throw new Error('AHHH');
  }

  robot.chassisPhysicsObject.rigidBody.applyImpulse({
    x: 0,
    y: 0,
    z: mag,
  }, true);
}
export function backward() {
  const simulation = getSimulation();
  if (simulation.state !== 'ready') {
    console.log('Not ready');
    return;
  }

  const robot = simulation.robot;
  if (!robot) {
    throw new Error('AHHH');
  }

  robot.chassisPhysicsObject.rigidBody.applyImpulse({
    x: 0,
    y: 0,
    z: -mag,
  }, true);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function ev3_runToRelativePosition(motor: number, position:number, speed:number) {
  const simulation = getSimulation();
  if (simulation.state !== 'ready') {
    console.log('Not ready');
    return;
  }

  const robot = simulation.robot;
  if (!robot) {
    console.log('NO robot');
    throw new Error('AHHH');
  }

  const rb = robot.chassisPhysicsObject.rigidBody;
  console.log(speed, rb.mass());

  robot.chassisPhysicsObject.rigidBody.applyImpulse({
    x: 0,
    y: 0,
    z: speed * rb.mass(),
  }, true);

  setTimeout(() => {
    console.log('AHH');
    robot.chassisPhysicsObject.rigidBody.applyImpulse({
      x: 0,
      y: 0,
      z: -speed * rb.mass(),
    }, true);
  }, position / speed * 1000);
}
