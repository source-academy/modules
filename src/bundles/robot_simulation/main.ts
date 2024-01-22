/* eslint-disable @typescript-eslint/naming-convention */
import {
  chassisConfig,
  colorSensorConfig,
  meshConfig,
  motorDisplacements,
  motorPidConfig,
  physicsConfig,
  renderConfig,
  sceneCamera,
  wheelDisplacements,
  wheelPidConfig,
} from './config';
import { Environment, type DefaultEv3, Program } from './controllers';
import { type Motor } from './controllers/ev3/components/Motor';
import { createDefaultEv3 } from './controllers/ev3/ev3/default';
import { type ColorSensor } from './controllers/ev3/sensor/ColorSensor';
import { Physics, Renderer, Timer, World } from './engine';

import context from 'js-slang/context';

type MotorFunctionReturnType = Motor | null;

const storedWorld = context.moduleContexts.robot_simulation.state?.world;

// Helpers

export function getWorld(): World {
  const world = context.moduleContexts.robot_simulation.state?.world;
  if (world === undefined) {
    throw new Error('World not initialized');
  }
  return world as World;
}

export function getEv3(): DefaultEv3 {
  const ev3 = context.moduleContexts.robot_simulation.state?.ev3;
  if (ev3 === undefined) {
    throw new Error('ev3 not initialized');
  }
  return ev3 as DefaultEv3;
}

// Initialization

export function init_simulation() {
  console.log(storedWorld, 'storedWorld');
  if (storedWorld !== undefined) {
    return;
  }

  const code = context.unTypecheckedCode[0];

  const scene = Renderer.scene();
  const camera = Renderer.camera(sceneCamera);
  camera.translateY(2);
  camera.translateZ(-2);
  const renderer = new Renderer(scene, camera, renderConfig);

  const physics = new Physics(physicsConfig);

  const timer = new Timer();
  const world = new World(physics, renderer, timer);

  const environmentController = new Environment(physics, renderer);
  world.addController(environmentController);

  const program = new Program(code);
  world.addController(program);

  const config = {
    chassis: chassisConfig,
    motor: {
      displacements: motorDisplacements,
      pid: motorPidConfig,
    },
    wheel: {
      displacements: wheelDisplacements,
      pid: wheelPidConfig,
    },
    colorSensor: {
      displacement: colorSensorConfig.displacement,
    },
    mesh: meshConfig,
  };

  const ev3 = createDefaultEv3(physics, renderer, config);

  world.addController(ev3);
  world.init();

  context.moduleContexts.robot_simulation.state = {
    world,
    ev3,
  };

  throw new Error('Interrupt');
}

// Utility
export function ev3_pause(duration: number): void {
  const world = getWorld();
  // TODO: Fix the way we get reference to the program, Maybe use ControllerMap
  const program = world.controllers.controllers[1] as Program;
  console.log(world.controllers, program, duration);
  program.pause(duration);
}

// Motor
export function ev3_motorA(): MotorFunctionReturnType {
  const ev3 = getEv3();
  return ev3.get('leftMotor');
}

export function ev3_motorB(): MotorFunctionReturnType {
  const ev3 = getEv3();
  return ev3.get('rightMotor');
}

export function ev3_motorC(): MotorFunctionReturnType {
  return null;
}

export function ev3_motorD(): MotorFunctionReturnType {
  return null;
}

export function ev3_runToRelativePosition(
  motor: MotorFunctionReturnType,
  position: number,
  speed: number,
): void {
  if (motor === null) {
    return;
  }

  motor.setVelocity(speed);
}

// Color Sensor

export function ev3_colorSensor() {
  const ev3 = getEv3();
  return ev3.get('colorSensor');
}

export function ev3_colorSensorRed(colorSensor: ColorSensor) {
  return colorSensor.sense().r;
}

export function ev3_colorSensorGreen(colorSensor: ColorSensor) {
  return colorSensor.sense().g;
}

export function ev3_colorSensorBlue(colorSensor: ColorSensor) {
  return colorSensor.sense().b;
}
