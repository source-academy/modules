import * as THREE from 'three';

import type Rapier from '@dimforge/rapier3d-compat';
import initRapier from './render/physics/RAPIER';
import { physicsOptions, sceneOptions } from './options';
import { type PhysicsObject } from './render/physics/physics';
import { type SimulationStates } from './constants/states';
import TickManager from './render/controllers/tickManager';
import { setSimulation } from '../functions';

let RAPIER: typeof Rapier;

export type RobotSimulation = {
  state: Extract<SimulationStates, 'idle' | 'loading'>;
} | {
  state: 'ready'
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  renderWidth: number,
  renderHeight: number,
  renderAspectRatio: number,
  RAPIER: typeof Rapier,
  physicsWorld: Rapier.World,
  physicsObjects: Array<PhysicsObject>,
};

export const initEngines = async () => {
  setSimulation({ state: 'loading' });
  RAPIER = await initRapier();

  const renderTickManager = new TickManager();
  const physicsWorld = new RAPIER.World(physicsOptions.GRAVITY);

  const physicsObjects:Array<PhysicsObject> = [];

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const renderWidth = sceneOptions.width;
  const renderHeight = sceneOptions.height;
  const renderAspectRatio = renderWidth / renderHeight;

  const camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.01, 1000);
  camera.position.z = 7;

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
  };

  setSimulation(robotSimulation);

  renderTickManager.startLoop();
};

export { RAPIER };
