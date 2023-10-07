import * as THREE from 'three';
// @ts-ignore-next-line

import type Rapier from '@dimforge/rapier3d-compat';
import context from 'js-slang/context';

import initRapier from './render/physics/RAPIER';
import { physicsOptions, sceneOptions } from './options';
import { type PhysicsObject } from './render/physics/physics';
import { type SimulationStates } from './constants/states';
import TickManager from './render/controllers/tickManager';
import { init_meshes } from './mesh/init_meshes';
import { RayCastedVehicleController } from './render/controllers/RayCastedVehicleController';
import { carSettings } from './render/controllers/RayCastedVehicleController/carTuning';
import { runECEvaluatorByJoel, type IOptions } from 'js-slang';
import { getSimulation, setSimulation } from './render/simulation';

let RAPIER: typeof Rapier;


export type RobotSimulation = {
  state: Extract<SimulationStates, 'idle' | 'loading' | 'error'>;
} | {
  state: Exclude<SimulationStates, 'idle' | 'loading' | 'error'>,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  renderWidth: number,
  renderHeight: number,
  renderAspectRatio: number,
  RAPIER: typeof Rapier,
  physicsWorld: Rapier.World,
  physicsObjects: Array<PhysicsObject>,
  robot?: RayCastedVehicleController,
  EceIterator: Generator<number, void, undefined>
};

export const initEngines = async (code:string) => {
  const currentSimulation = getSimulation();

  if (currentSimulation.state !== 'idle') {
    console.log('Engine already initialized. Skipping initialization');
    return;
  }

  const options : Partial<IOptions> = {
    originalMaxExecTime: 1000,
    scheduler: 'preemptive',
    stepLimit: 1000,
    throwInfiniteLoops: false,
    useSubst: false,
  };
  const it = runECEvaluatorByJoel(code, context, options);

  setSimulation({ state: 'loading' });
  RAPIER = await initRapier();

  const renderTickManager = new TickManager();
  const physicsWorld = new RAPIER.World(physicsOptions.GRAVITY);

  const physicsObjects:Array<PhysicsObject> = [];

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  const renderWidth = sceneOptions.width;
  const renderHeight = sceneOptions.height;
  const renderAspectRatio = renderWidth / renderHeight;

  const camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.01, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(renderWidth, renderHeight);
  renderer.setPixelRatio(window.devicePixelRatio * 1.5);

  const robotSimulation :RobotSimulation = {
    state: 'ready',
    scene,
    camera,
    renderer,
    renderWidth,
    renderHeight,
    renderAspectRatio,
    RAPIER,
    physicsWorld,
    physicsObjects,
    EceIterator: it,
  };

  setSimulation(robotSimulation);

  renderTickManager.startLoop();

  init_meshes();

  const robot = new RayCastedVehicleController(carSettings);
  setSimulation({
    ...robotSimulation,
    robot,
  });
};

export { RAPIER };
