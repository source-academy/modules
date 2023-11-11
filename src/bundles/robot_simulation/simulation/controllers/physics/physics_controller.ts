import Rapier, { type Ray, type RigidBody } from '@dimforge/rapier3d-compat';
import { type Steppable } from '../../types';
import { instance } from '../../world';

let RAPIER: typeof Rapier;

export const physicsOptions = {
  GRAVITY: new Rapier.Vector3(0.0, -9.81, 0.0),
  timestep: 1 / 60,
} as const;


// Heavily inspired by https://gafferongames.com/post/fix_your_timestep/
export class PhysicsController implements Steppable {
  isInitialized = false;
  accumulator: number;

  RAPIER: typeof Rapier | null;
  #world: Rapier.World | null;

  constructor() {
    this.RAPIER = null;
    this.#world = null;
    this.accumulator = 0;
  }

  async init() {
    let r = await import('@dimforge/rapier3d-compat');
    await r.init();

    this.RAPIER = r;
    RAPIER = r;
    this.isInitialized = true;
    this.#world = new r.World(physicsOptions.GRAVITY);
    this.#world.timestep = physicsOptions.timestep;
  }

  createCollider(colliderDesc: Rapier.ColliderDesc, rigidBody: RigidBody) {
    return this.#world!.createCollider(colliderDesc, rigidBody);
  }

  createRigidBody(rigidBodyDesc: Rapier.RigidBodyDesc) {
    return this.#world!.createRigidBody(rigidBodyDesc);
  }

  castRay(ray: Ray, maxDistance: number): number | null {
    const result = this.#world!.castRay(ray, maxDistance, true);
    if (result === null) {
      return null;
    }
    return result.toi;
  }

  step(_: number) {
    this.accumulator += Math.min(instance.getFrameTime(), 0.05);

    while (this.accumulator >= physicsOptions.timestep) {
      this.#world!.step();
      this.accumulator -= physicsOptions.timestep;
    }
  }
}

export { RAPIER };
