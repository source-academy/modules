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
  ultrasonicSensorConfig,
  wheelMeshConfig,
} from './config';

import { Program } from './controllers/program/Program';
import { Floor, type DefaultEv3, Wall } from './controllers';
import { createDefaultEv3, type Ev3Config } from './controllers/ev3/ev3/default/defaultEv3';
import { type Controller, Physics, Renderer, Timer, World } from './engine';

import context from 'js-slang/context';
import { interrupt } from './interrupt';
import { RobotConsole } from './engine/Core/RobotConsole';
import { getCamera } from './engine/Render/helpers/Camera';
import { createScene } from './engine/Render/helpers/Scene';
import { Paper, type PaperConfig } from './controllers/environment/Paper';


const storedWorld = context.moduleContexts.robot_simulation.state?.world;


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

// Initialization functions
export function createRenderer(): Renderer {
  const scene = createScene();
  const camera = getCamera(sceneCamera);
  const renderer = new Renderer(scene, camera, renderConfig);
  return renderer;
}

export function createPhysics(): Physics {
  const physics = new Physics(physicsConfig);
  return physics;
}

export function createTimer(): Timer {
  const timer = new Timer();
  return timer;
}

export function createWorld(physics: Physics, renderer: Renderer, timer: Timer, robotConsole: RobotConsole) {
  const world = new World(physics, renderer, timer, robotConsole);
  return world;
}

export function createEv3(physics: Physics, renderer: Renderer): DefaultEv3 {
  const config:Ev3Config = {
    chassis: chassisConfig,
    motor: {
      displacements: motorDisplacements,
      pid: motorPidConfig,
      mesh: {
        ...wheelMeshConfig,
        url: 'https://keen-longma-3c1be1.netlify.app/6_wheel.gltf',
      },
    },
    wheel: {
      displacements: wheelDisplacements,
      pid: wheelPidConfig,
      gapToFloor: 0.03,
      maxRayDistance: 0.05,
    },
    colorSensor: {
      displacement: colorSensorConfig.displacement,
      config: colorSensorConfig.config,
    },
    ultrasonicSensor: ultrasonicSensorConfig,
    mesh: {
      ...meshConfig,
      url: 'https://keen-longma-3c1be1.netlify.app/6_remove_wheels.gltf',
    },
  };

  const ev3 = createDefaultEv3(physics, renderer, config);
  return ev3;
}

export function createFloor(physics: Physics, renderer: Renderer) {
  const environment = new Floor(physics, renderer);
  return environment;
}

export function createWall(physics: Physics, renderer: Renderer) {
  const environment = new Wall(physics, renderer);
  return environment;
}

export function createPaper(render:Renderer, url:string, width: number, height: number) {
  const paperConfig: PaperConfig = {
    url,
    mesh: {
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

export function createRobotConsole() {
  const robot_console = new RobotConsole();
  return robot_console;
}

export function addControllerToWorld(controller: Controller, world:World) {
  world.addController(controller);
}

export function saveToContext(key:string, value:any) {
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
