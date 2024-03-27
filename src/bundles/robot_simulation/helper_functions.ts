import context from 'js-slang/context';
import { interrupt } from '../../common/specialErrors';
import { sceneConfig } from './config';
import { Cuboid, type CuboidConfig } from './controllers/environment/Cuboid';
import { type Controller, Physics, Renderer, Timer, World } from './engine';

import { RobotConsole } from './engine/Core/RobotConsole';
import { isRigidBodyType, type RigidBodyType } from './engine/Entity/EntityFactory';
import type { PhysicsConfig } from './engine/Physics';
import type { RenderConfig } from './engine/Render/Renderer';
import { getCamera, type CameraOptions } from './engine/Render/helpers/Camera';
import { createScene } from './engine/Render/helpers/Scene';

const storedWorld = context.moduleContexts.robot_simulation.state?.world;

// Helper functions to get objects from context
export function getWorldFromContext(): World {
  const world = context.moduleContexts.robot_simulation.state?.world;
  if (world === undefined) {
    throw new Error('World not initialized');
  }
  return world as World;
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
  color: number | string,
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

export function addControllerToWorld(controller: Controller, world: World) {
  world.addController(controller);
}

export function saveToContext(key: string, value: any) {
  if (!context.moduleContexts.robot_simulation.state) {
    context.moduleContexts.robot_simulation.state = {};
  }
  context.moduleContexts.robot_simulation.state[key] = value;
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
