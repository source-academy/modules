import Rapier, { type Vector, type Ray, type RigidBody } from '@dimforge/rapier3d-compat';
import { type Steppable } from '../../types';
import { instance } from '../../world';

let RAPIER: typeof Rapier;

export const physicsOptions = {
  GRAVITY: new Rapier.Vector3(0.0, -9.81, 0.0),
  timestep: 1 / 60,
} as const;

export class PhysicsController implements Steppable {
  RAPIER: typeof Rapier | null;

  #world: Rapier.World | null;
  #accumulator: number;
  #residual: number;

  constructor() {
    this.RAPIER = null;
    this.#world = null;
    this.#accumulator = 0;
    this.#residual = 0;
  }

  async init() {
    let r = await import('@dimforge/rapier3d-compat');
    await r.init();

    this.RAPIER = r;
    RAPIER = r;

    this.#world = new r.World(physicsOptions.GRAVITY);
    this.#world.timestep = physicsOptions.timestep;
  }

  createCollider(colliderDesc: Rapier.ColliderDesc, rigidBody: RigidBody) {
    return this.#world!.createCollider(colliderDesc, rigidBody);
  }

  createRigidBody(rigidBodyDesc: Rapier.RigidBodyDesc) {
    return this.#world!.createRigidBody(rigidBodyDesc);
  }

  castRay(ray: Ray, maxDistance: number): { distance:number, normal: Vector } | null {
    const result = this.#world!.castRayAndGetNormal(ray, maxDistance, true);

    if (result === null) {
      return null;
    }

    return {
      distance: result.toi,
      normal: result.normal,
    };
  }

  getResidualTime() {
    return this.#residual;
  }

  /**
   * Advances the physics simulation in discrete steps based on the frame time.
   * Inspired by: https://gafferongames.com/post/fix_your_timestep/
   * @param {number} _ - Unused parameter, can be removed if not required elsewhere.
   */
  step(_) {
    // Limit the frame time to a maximum value to avoid spiral of death.
    const maxFrameTime = 0.05;
    this.#accumulator += Math.min(instance.getFrameTime(), maxFrameTime);

    // Update the physics world in fixed time steps
    while (this.#accumulator >= physicsOptions.timestep) {
      instance.savePhysicsObjectState();
      this.#world!.step(); // Advance the physics simulation
      this.#accumulator -= physicsOptions.timestep;
    }

    // Calculate the residual for interpolations
    this.#residual = this.#accumulator / physicsOptions.timestep;
  }
}

export { RAPIER };
