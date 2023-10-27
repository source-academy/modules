import Rapier, { type Ray, type RigidBody } from '@dimforge/rapier3d-compat';

let RAPIER: typeof Rapier;


export const physicsOptions = {
  GRAVITY: new Rapier.Vector3(0.0, -9.81, 0.0),
} as const;

export class PhysicsController {
  isInitialized = false;

  RAPIER: typeof Rapier | null;
  #world: Rapier.World | null;

  constructor() {
    this.RAPIER = null;
    this.#world = null;
  }

  async init() {
    let r = await import('@dimforge/rapier3d-compat');
    await r.init();

    this.RAPIER = r;
    RAPIER = r;
    this.isInitialized = true;
    this.#world = new r.World(physicsOptions.GRAVITY);
  }

  createCollider(colliderDesc: Rapier.ColliderDesc, rigidBody: RigidBody) {
    return this.#world!.createCollider(colliderDesc, rigidBody);
  }

  createRigidBody(rigidBodyDesc: Rapier.RigidBodyDesc) {
    return this.#world!.createRigidBody(rigidBodyDesc);
  }

  castRay(ray:Ray, maxDistance:number):number | null {
    const result = this.#world!.castRay(ray, maxDistance, true);
    if (result === null) {
      return null;
    }
    return result.toi;
  }

  step(_: number) {
    this.#world!.step();
  }
}

export { RAPIER };
