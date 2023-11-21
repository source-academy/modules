import * as THREE from 'three';

import {
  type Ray,
  type ColliderDesc,
  type RigidBodyDesc,
} from '@dimforge/rapier3d-compat';

import {
  PhysicsObject, PhysicsObjectController,
  addCuboidPhysicsObject,
} from './controllers/physics/physics_object_controller';

import { PhysicsController } from './controllers/physics/physics_controller';
import { ProgramController } from './controllers/program_controller';
import { RenderController } from './controllers/render_controller';
import {
  TimeController,
  type TimeoutCallback,
} from './controllers/time_controller';
import { settings, CarController } from './controllers/car/car_controller';
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export const simulationStates = [
  'unintialized',
  'loading',
  'ready',
  'running',
] as const;
export type SimulationStates = (typeof simulationStates)[number];

export type Internals = {
  physicsController: PhysicsController;
  renderController: RenderController;
  programController: ProgramController;
  physicsObjects: PhysicsObjectController;
  timeController: TimeController;
};

let instance: World;

export class World {
  state: SimulationStates;
  #internals: Internals;
  carController: CarController;

  constructor() {
    if (instance) {
      throw new Error('Only one instance of world is allowed');
    }
    // eslint-disable-next-line consistent-this
    instance = this;

    // initialization
    this.state = 'unintialized';
    this.#internals = {
      physicsController: new PhysicsController(),
      renderController: new RenderController(),
      programController: new ProgramController(),
      physicsObjects: new PhysicsObjectController(),
      timeController: new TimeController(),
    };
    this.carController = new CarController(settings);
  }

  async init(code: string): Promise<void> {
    if (this.state === 'running') {
      return;
    }

    this.state = 'loading';

    const { physicsController, renderController, programController }
      = this.#internals;

    await physicsController.init();
    renderController.init();
    programController.init(code);
    this.carController.init();
    this.addFloor();
    this.state = 'ready';
  }

  startSimulation(): void {
    if (this.state === 'ready') {
      this.state = 'running';
    }
    window.requestAnimationFrame(this.#step.bind(this));
  }

  stopSimulation(): void {
    if (this.state === 'running') {
      this.state = 'ready';
      this.#internals.timeController.pause();
    }
  }

  // Physics Controller
  addFloor(): void {
    addCuboidPhysicsObject({
      width: 20,
      height: 1,
      length: 20,
      color: new THREE.Color('white'),
      dynamic: false,
      position: new THREE.Vector3(0, 0, 0),
    });
  }

  castRay(ray: Ray, maxDistance: number): ReturnType<typeof physicsController.castRay> {
    const { physicsController } = this.#internals;
    return physicsController.castRay(ray, maxDistance);
  }

  addRigidBody(
    mesh: THREE.Mesh,
    rigidBodyDesc: RigidBodyDesc,
    colliderDesc: ColliderDesc,
  ): PhysicsObject {
    const { physicsController, renderController, physicsObjects }
      = this.#internals;

    renderController.addMesh(mesh);
    const rigidBody = physicsController.createRigidBody(rigidBodyDesc);
    const collider = physicsController.createCollider(colliderDesc, rigidBody);
    const physicsObject = new PhysicsObject(mesh, rigidBody, collider);
    physicsObjects.add(physicsObject);
    return physicsObject;
  }

  getResidualTime(): number {
    return this.#internals.physicsController.getResidualTime();
  }

  // Render Controller
  setRendererOutput(domElement: HTMLDivElement) {
    console.log('Setting renderer output');
    this.#internals.renderController.setRendererOutput(domElement);
  }

  loadGTLF(url: string): Promise<GLTF> {
    return this.#internals.renderController.loadGTLF(url);
  }

  // Time controller
  getElapsedTime(): number {
    return this.#internals.timeController.getElapsedTime();
  }

  setTimeout(callback: TimeoutCallback, delay: number): void {
    this.#internals.timeController.setTimeout(callback, delay);
  }

  getFrameTime(): number {
    return this.#internals.timeController.getDeltaTime() / 1000;
  }

  // Program Controller
  pauseProgramController(time: number): void {
    this.#internals.programController.pause(time);
  }

  // Physic Object Controller
  savePhysicsObjectState() {
    this.#internals.physicsObjects.saveLocation();
  }

  #step(timestamp: number): void {
    const {
      programController,
      physicsController,
      renderController,
      physicsObjects,
      timeController,
    } = this.#internals;

    programController.step(timestamp);

    // Apply the forces of the car
    this.carController.step(timestamp);

    // Calculate the new location of each physics object (including the car)
    physicsController.step(timestamp);

    // Update the location of the mesh
    physicsObjects.step(timestamp);

    // Render the scene
    renderController.step(timestamp);

    if (this.state === 'running') {
      timeController.step(timestamp);
      window.requestAnimationFrame(this.#step.bind(this));
    }
  }
}

export { instance };
