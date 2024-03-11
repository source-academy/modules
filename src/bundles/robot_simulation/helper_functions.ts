import { Program } from './controllers/program/Program';
import {
  createDefaultEv3,
  type DefaultEv3,
} from './controllers/ev3/ev3/default/ev3';
import { type Controller, Physics, Renderer, Timer, World } from './engine';

import context from 'js-slang/context';
import { interrupt } from './interrupt';
import { RobotConsole } from './engine/Core/RobotConsole';
import { getCamera, type CameraOptions } from './engine/Render/helpers/Camera';
import { createScene } from './engine/Render/helpers/Scene';
import { Paper, type PaperConfig } from './controllers/environment/Paper';
import type { PhysicsConfig } from './engine/Physics';
import { isRigidBodyType, type RigidBodyType } from './engine/Entity/EntityFactory';
import { Cuboid, type CuboidConfig } from './controllers/environment/Cuboid';
import { ev3Config } from './controllers/ev3/ev3/default/config';
import { sceneConfig } from './config';
import type { RenderConfig } from './engine/Render/Renderer';

const storedWorld = context.moduleContexts.robot_simulation.state?.world;

// Helper functions to get objects from context
export function getWorldFromContext(): World {
  const world = context.moduleContexts.robot_simulation.state?.world;
  if (world === undefined) {
    throw new Error('World not initialized');
  }
  return world as World;
}

export function getEv3FromContext(): DefaultEv3 {
  const ev3 = context.moduleContexts.robot_simulation.state?.ev3;
  if (ev3 === undefined) {
    throw new Error('ev3 not initialized');
  }
  return ev3 as DefaultEv3;
}

// Physics
export function createCustomPhysics(
  gravity: number,
  timestep: number,
): Physics {
  const physicsConfig: PhysicsConfig = {
    gravity: {
      x: 0,
      y: gravity,
      z: 0,
    },
    timestep,
  };
  const physics = new Physics(physicsConfig);
  return physics;
}

export function createPhysics(): Physics {
  return createCustomPhysics(-9.81, 1 / 20);
}

// Renderer
export function createRenderer(): Renderer {
  const sceneCameraOptions: CameraOptions = {
    type: 'perspective',
    aspect: sceneConfig.width / sceneConfig.height,
    fov: 75,
    near: 0.1,
    far: 1000,
  };

  const renderConfig: RenderConfig = {
    width: sceneConfig.width,
    height: sceneConfig.height,
    control: 'orbit',
  };

  const scene = createScene();
  const camera = getCamera(sceneCameraOptions);
  const renderer = new Renderer(scene, camera, renderConfig);
  return renderer;
}

// Timer
export function createTimer(): Timer {
  const timer = new Timer();
  return timer;
}

// Robot console
export function createRobotConsole() {
  const robot_console = new RobotConsole();
  return robot_console;
}

// Create world
export function createWorld(
  physics: Physics,
  renderer: Renderer,
  timer: Timer,
  robotConsole: RobotConsole,
) {
  const world = new World(physics, renderer, timer, robotConsole);
  return world;
}

// Environment
export function createCuboid(
  physics: Physics,
  renderer: Renderer,
  position_x: number,
  position_y: number,
  position_z: number,
  width: number,
  length: number,
  height: number,
  mass: number,
  color: string | number,
  bodyType: string,
) {
  if (isRigidBodyType(bodyType) === false) {
    throw new Error('Invalid body type');
  }

  const narrowedBodyType = bodyType as RigidBodyType;

  const config: CuboidConfig = {
    position: {
      x: position_x,
      y: position_y,
      z: position_z,
    },
    dimension: {
      height,
      width,
      length,
    },
    mass,
    color,
    type: narrowedBodyType,
  };

  const cuboid = new Cuboid(physics, renderer, config);
  return cuboid;
}

export function createFloor(physics: Physics, renderer: Renderer) {
  const floor = createCuboid(
    physics,
    renderer,
    0, // position_x
    -0.5, // position_y
    0, // position_z
    20, // width
    20, // length
    1, // height
    1, // mass
    'white', // color
    'fixed', // bodyType
  );
  return floor;
}

export function createWall(physics: Physics, renderer: Renderer) {
  const wall = createCuboid(
    physics,
    renderer,
    0, // position_x
    1, // position_y
    1, // position_z
    1, // width
    0.1, // length
    2, // height
    1, // mass
    'yellow', // color
    'fixed', // bodyType
  );
  return wall;
}

export function createPaper(
  render: Renderer,
  url: string,
  width: number,
  height: number,
) {
  const paperConfig: PaperConfig = {
    url,
    dimension: {
      width,
      height,
    },
  };
  const paper = new Paper(render, paperConfig);
  return paper;
}

export function createCSE() {
  const code = context.unTypecheckedCode[0];
  const program = new Program(code);
  return program;
}


export function addControllerToWorld(controller: Controller, world: World) {
  world.addController(controller);
}

export function saveToContext(key: string, value: any) {
  if (!context.moduleContexts.robot_simulation.state) {
    context.moduleContexts.robot_simulation.state = {};
  }
  context.moduleContexts.robot_simulation.state[key] = value;
}

export function createEv3(physics: Physics, renderer: Renderer): DefaultEv3 {
  const ev3 = createDefaultEv3(physics, renderer, ev3Config);
  return ev3;
}

// Initialization
export function init_simulation(worldFactory: () => World) {
  if (storedWorld !== undefined) {
    return;
  }
  const world = worldFactory();
  world.init();
  interrupt();
}
