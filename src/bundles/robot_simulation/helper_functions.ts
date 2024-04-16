import context from 'js-slang/context';
import { interrupt } from '../../common/specialErrors';
import { sceneConfig } from './config';
import { Cuboid, type CuboidConfig } from './controllers/environment/Cuboid';
import { Paper, type PaperConfig } from './controllers/environment/Paper';
import { ev3Config } from './controllers/ev3/ev3/default/config';
import {
  createDefaultEv3,
  type DefaultEv3,
} from './controllers/ev3/ev3/default/ev3';
import { Program } from './controllers/program/Program';
import { type Controller, Physics, Renderer, Timer, World } from './engine';

import { RobotConsole } from './engine/Core/RobotConsole';
import {
  isRigidBodyType,
  type RigidBodyType,
} from './engine/Entity/EntityFactory';
import type { PhysicsConfig } from './engine/Physics';
import type { RenderConfig } from './engine/Render/Renderer';
import { getCamera, type CameraOptions } from './engine/Render/helpers/Camera';
import { createScene } from './engine/Render/helpers/Scene';

/**
 * @categoryDescription Configuration
 * These functions are use to configure the simulation world.
 * @module
 */

/**
 * A helper function that retrieves the world from the context
 *
 * @private
 * @category helper
 */
export function getWorldFromContext(): World {
  const world = context.moduleContexts.robot_simulation.state?.world;
  if (world === undefined) {
    throw new Error('World not initialized');
  }
  return world as World;
}

/**
 * A helper function that retrieves the EV3 from context
 *
 * @private
 * @category helper
 */
export function getEv3FromContext(): DefaultEv3 {
  const ev3 = context.moduleContexts.robot_simulation.state?.ev3;
  if (ev3 === undefined) {
    throw new Error('ev3 not initialized');
  }
  return ev3 as DefaultEv3;
}

/**
 * Create a physics engine with the provided gravity and timestep. A physics engine
 * with default gravity and timestep can be created using {@link createPhysics}.
 *
 * The returned Physics object is designed to be passed into {@link createWorld}.
 *
 * **This is a configuration function and should be called within {@link init_simulation}.**
 *
 * @param gravity The gravity of the world
 * @param timestep The timestep of the world
 * @returns Physics
 *
 * @category Configuration
 */
export function createCustomPhysics(
  gravity: number,
  timestep: number
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

/**
 * Create a physics engine with default gravity and timestep. Default gravity is -9.81 and timestep is 1/20.
 * A custom physics engine can be created using {@link createCustomPhysics}.
 *
 * The returned Physics object is designed to be passed into {@link createWorld}.
 *
 * **This is a configuration function and should be called within {@link init_simulation}.**
 *
 * @returns Physics
 *
 * @category Configuration
 */
export function createPhysics(): Physics {
  return createCustomPhysics(-9.81, 1 / 20);
}

/**
 * Creates a renderer for the simulation.
 *
 * The returned Renderer object is designed to be passed into {@link createWorld}.
 *
 * **This is a configuration function and should be called within {@link init_simulation}.**
 *
 * @returns Renderer
 *
 * @category Configuration
 */
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

/**
 * Creates a Timer for the simulation.
 *
 * The returned Timer object is designed to be passed into {@link createWorld}.
 *
 * **This is a configuration function and should be called within {@link init_simulation}.**
 *
 * @returns Timer
 *
 * @category Configuration
 */
export function createTimer(): Timer {
  const timer = new Timer();
  return timer;
}

/**
 * Creates a RobotConsole for the simulation.
 *
 * The RobotConsole is used to display messages and errors to the user. The console
 * messages can be seen in the console tab of the simulator.
 *
 * The returned RobotConsole object is designed to be passed into {@link createWorld}.
 *
 * **This is a configuration function and should be called within {@link init_simulation}.**
 *
 * @returns RobotConsole
 *
 * @category Configuration
 */
export function createRobotConsole(): RobotConsole {
  const robot_console = new RobotConsole();
  return robot_console;
}

/**
 * Creates a custom world with the provided {@link createPhysics | physics}, {@link createRenderer | renderer}, {@link createTimer | timer} and {@link createRobotConsole | console} .
 *
 * A world is responsible for managing the physics, rendering, timing and console of the simulation.
 * It also manages the controllers that are added to the world, ensuring that the appropriate functions
 * are called at the correct time.
 *
 * The returned World object is designed to be returned by the {@link init_simulation} callback.
 *
 * You can add controllers to the world using {@link addControllerToWorld}.
 *
 * **This is a configuration function and should be called within {@link init_simulation}.**
 *
 * @example
 * An empty simulation
 * ```
 * init_simulation(() => {
 *     const physics = createPhysics();
 *     const renderer = createRenderer();
 *     const timer = createTimer();
 *     const robot_console = createRobotConsole();
 *     const world = createWorld(physics, renderer, timer, robot_console);
 *
 *     return world;
 *   });
 * ```
 *
 * @param physics The physics engine of the world. See {@link createPhysics}
 * @param renderer  The renderer engine of the world. See {@link createRenderer}
 * @param timer The timer of the world. See {@link createTimer}
 * @param robotConsole The console of the world. See {@link createRobotConsole}
 * @returns World
 *
 * @category Configuration
 */
export function createWorld(
  physics: Physics,
  renderer: Renderer,
  timer: Timer,
  robotConsole: RobotConsole
): World {
  const world = new World(physics, renderer, timer, robotConsole);
  return world;
}

/**
 * Creates a cuboid. joel-todo: The dynamic version wont work
 *
 * This function is used to create the {@link createFloor | floor} and {@link createWall | wall} controllers.
 *
 * The returned Cuboid object is designed to be added to the world using {@link addControllerToWorld}.
 *
 * **This is a Controller function and should be called within {@link init_simulation}.**
 *
 * @param physics The physics engine passed to the world
 * @param renderer  The renderer engine of the world. See {@link createRenderer}
 * @param position_x The x position of the cuboid
 * @param position_y The y position of the cuboid
 * @param position_z The z position of the cuboid
 * @param width The width of the cuboid in meters
 * @param length The length of the cuboid in meters
 * @param height The height of the cuboid in meters
 * @param mass The mass of the cuboid in kg
 * @param color The color of the cuboid. Can be a hex code or a string. {@see https://threejs.org/docs/#api/en/math/Color}
 * @param bodyType "rigid" or "dynamic". Determines if the cuboid is fixed or can move.
 * @returns Cuboid
 *
 * @example
 * ```
 * init_simulation(() => {
 *     const physics = createPhysics();
 *     const renderer = createRenderer();
 *     const timer = createTimer();
 *     const robot_console = createRobotConsole();
 *     const world = createWorld(physics, renderer, timer, robot_console);
 *
 *     const cuboid = createCuboid(...);
 *     addControllerToWorld(cuboid, world);
 *
 *     return world;
 *   });
 * ```
 *
 * @category Controller
 */
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
  bodyType: string
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

/**
 * Create a floor. This function is a wrapper around {@link createCuboid}.
 *
 * The returned Cuboid object is designed to be added to the world using {@link addControllerToWorld}.
 *
 * **This is a Controller function and should be called within {@link init_simulation}.**
 *
 * @param physics The physics engine of the world. See {@link createPhysics}
 * @param renderer  The renderer engine of the world. See {@link createRenderer}
 * @returns Cuboid
 *
 * @category Controller
 */
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
    'fixed' // bodyType
  );
  return floor;
}

/**
 * Creates a wall. This function is a wrapper around {@link createCuboid}.
 *
 * The returned Cuboid object is designed to be added to the world using {@link addControllerToWorld}.
 *
 * **This is a Controller function and should be called within {@link init_simulation}.**
 *
 * @param physics The physics engine of the world. See {@link createPhysics}
 * @param renderer  The renderer engine of the world. See {@link createRenderer}
 * @returns Cuboid
 *
 * @category Controller
 */
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
    'fixed' // bodyType
  );
  return wall;
}

/**
 * Creates a paper on the floor.
 *
 * The returned Paper object is designed to be added to the world using {@link addControllerToWorld}.
 *
 *  **This is a Controller function and should be called within {@link init_simulation}.**
 *
 * @param render The renderer engine of the world. See {@link createRenderer}
 * @param url The url of the image to be displayed on the paper.
 * @param width The width of the paper in meters.
 * @param height The height of the paper in meters.
 *
 * @returns Paper
 *
 * @category Controller
 */
export function createPaper(
  render: Renderer,
  url: string,
  width: number,
  height: number,
  x: number,
  y: number,
  rotation: number
) {
  const paperConfig: PaperConfig = {
    url,
    dimension: {
      width,
      height,
    },
    position: {x, y},
    rotation: rotation * Math.PI / 180,
  };
  const paper = new Paper(render, paperConfig);
  return paper;
}

/**
 * Creates a CSE machine as a Program Object. The CSE machine is used to evaluate the code written
 * by the user. The execution of the code will be automatically synchronized with the simulation
 * to ensure that the code is executed at the correct time.
 *
 * The returned Program object is designed to be added to the world using {@link addControllerToWorld}.
 *
 * **This is a Controller function and should be called within {@link init_simulation}.**
 *
 * @returns Program
 *
 * @category Controller
 *
 */
export function createCSE() {
  const code = context.unTypecheckedCode[0];
  const program = new Program(code);
  return program;
}

/**
 * Add a controller to the world.
 *
 * The controller is a unit of computation modelled after Unity's MonoBehaviour. It is used to
 * encapsulate the logic of the simulation. Controllers can be used to create robots, sensors,
 * actuators, and other objects in the simulation.
 *
 * The controller should be added to the world using this function in order for the simulation to
 * access the controller's logic.
 *
 * **This is a Utility function and should be called within {@link init_simulation}.*
 *
 * @param controller
 * @param world
 *
 * @category Utility
 */
export function addControllerToWorld(controller: Controller, world: World) {
  world.addController(controller);
}

/**
 * Save a value to the context.
 *
 * There are 2 important values to be saved. The world and the ev3.
 * The world needs to be saved in order for the simulation to access the physics, renderer, timer and console.
 * The ev3 needs to be saved in order for the "ev3_" functions to access the EV3
 *
 * @param key The key to save the value as
 * @param value The value to save
 *
 * @returns void
 */
export function saveToContext(key: string, value: any) {
  if (!context.moduleContexts.robot_simulation.state) {
    context.moduleContexts.robot_simulation.state = {};
  }
  context.moduleContexts.robot_simulation.state[key] = value;
}

/**
 * Create an EV3.
 *
 * The resulting EV3 should be saved to the context using {@link saveToContext}.
 *
 * The returned EV3 object is designed to be added to the world using {@link addControllerToWorld}.
 *
 * **This is a Controller function and should be called within {@link init_simulation}.**
 *
 * @example
 * ```
 * init_simulation(() => {
 *   ...
 *   const ev3 = createEv3(physics, renderer);
 *   saveToContext('ev3', ev3);
 * })
 * ```
 *
 * @param physics The physics engine of the world. See {@link createPhysics}
 * @param renderer The renderer engine of the world. See {@link createRenderer}
 * @returns EV3
 */
export function createEv3(physics: Physics, renderer: Renderer): DefaultEv3 {
  const ev3 = createDefaultEv3(physics, renderer, ev3Config);
  return ev3;
}

/**
 * Initialize the simulation world. This function is to be called before the robot code.
 * This function is used to describe the simulation environment and the controllers.
 *
 * The callback function takes in no parameters and returns a world created by {@link createWorld}.
 * The world should be configured with the physics, renderer, timer and console.
 * The controllers should be added to the world using {@link addControllerToWorld}.
 * The world should be saved to the context using {@link saveToContext}.
 *
 * @param worldFactory A callback function that returns the world object. Type signature: () => World
 * @returns void
 */
export function init_simulation(worldFactory: () => World) {
  const storedWorld = context.moduleContexts.robot_simulation.state?.world;
  if (storedWorld !== undefined) {
    return;
  }
  const world = worldFactory();
  world.init();
  interrupt();
}
