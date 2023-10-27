import {
  type Ray,
  type ColliderDesc,
  type RigidBodyDesc,
} from '@dimforge/rapier3d-compat';
import { PhysicsController } from './controllers/physics/physics_controller';
import { ProgramController } from './controllers/program_controller';
import { RenderController } from './controllers/render_controller';
import {
  PhysicsObject,
  addCuboidPhysicsObject,
} from './primitives/physics_object';
import * as THREE from 'three';
import { settings, CarController } from './controllers/car_controller';

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
  physicsObjects: Array<PhysicsObject>;
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
      physicsObjects: [],
    };
    this.carController = new CarController(settings);
  }

  async init(code: string) {
    if (this.state === 'running') {
      return;
    }


    this.state = 'loading';

    const {
      physicsController,
      renderController,
      programController,
    } = this.#internals;

    await physicsController.init();
    renderController.init();
    programController.init(code);
    this.carController.init();
    this.addFloor();
    this.state = 'ready';
  }

  addFloor() {
    addCuboidPhysicsObject({
      width: 20,
      height: 1,
      length: 20,
      color: new THREE.Color('white'),
      dynamic: false,
      position: new THREE.Vector3(0, 0, 0),
    });
  }

  setRendererOutput(domElement: HTMLDivElement) {
    console.log('Setting renderer output');
    this.#internals.renderController.setRendererOutput(domElement);
  }

  startSimulation() {
    if (this.state === 'ready') {
      this.state = 'running';
    }
    window.requestAnimationFrame(this.#step.bind(this));
  }

  stopSimulation() {
    if (this.state === 'running') {
      this.state = 'ready';
    }
  }

  castRay(ray: Ray, maxDistance: number) {
    const { physicsController } = this.#internals;
    return physicsController.castRay(ray, maxDistance);
  }

  addRigidBody(
    mesh: THREE.Mesh,
    rigidBodyDesc: RigidBodyDesc,
    colliderDesc: ColliderDesc,
  ) {
    const { physicsController, renderController, physicsObjects }
      = this.#internals;

    renderController.addMesh(mesh);
    const rigidBody = physicsController.createRigidBody(rigidBodyDesc);
    const collider = physicsController.createCollider(colliderDesc, rigidBody);
    const physicsObject = new PhysicsObject(mesh, rigidBody, collider);
    physicsObjects.push(physicsObject);
    return physicsObject;
  }

  #step(timestamp:number): void {
    const {
      programController,
      physicsController,
      renderController,
      physicsObjects,
    } = this.#internals;

    programController.step(timestamp);

    // Apply the forces of the car
    this.carController.step(timestamp);

    // Calculate the new location of each physics object (including the car)
    physicsController.step(timestamp);

    // Update the location of the mesh
    for (const physicsObject of physicsObjects) {
      physicsObject.step(timestamp);
    }

    // Render the scene
    renderController.step(timestamp);

    if (this.state === 'running') {
      window.requestAnimationFrame(this.#step.bind(this));
    }
  }
}
export { instance };
