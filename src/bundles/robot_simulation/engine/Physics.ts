import rapier, { QueryFilterFlags } from '@dimforge/rapier3d-compat';

import { type SimpleVector } from './Math/Vector';
import { type FrameTimingInfo } from './Core/Timer';

export type PhysicsConfig = {
  gravity: SimpleVector;
  timestep: number;
};

type NotInitializedInternals = {
  initialized: false;
};

type InitializedInternals = {
  initialized: true;
  world: rapier.World;
  accumulator: number;
};

type PhysicsInternals = NotInitializedInternals | InitializedInternals;

export class Physics {
  RAPIER: typeof rapier;
  configuration: PhysicsConfig;
  internals: PhysicsInternals;

  constructor(configuration: PhysicsConfig) {
    this.configuration = configuration;
    this.RAPIER = rapier;

    this.internals = { initialized: false };
  }

  async start() {
    await rapier.init();
    console.log('Physics started');

    this.RAPIER = rapier;

    const world = new rapier.World(this.configuration.gravity);
    world.timestep = this.configuration.timestep;

    this.internals = {
      initialized: true,
      world,
      accumulator: 0,
    };
  }

  createRigidBody(rigidBodyDesc: rapier.RigidBodyDesc): rapier.RigidBody {
    if (this.internals.initialized === false) {
      throw Error("Physics engine hasn't been initialized yet");
    }

    return this.internals.world.createRigidBody(rigidBodyDesc);
  }

  createCollider(
    colliderDesc: rapier.ColliderDesc,
    rigidBody: rapier.RigidBody,
  ): rapier.Collider {
    if (this.internals.initialized === false) {
      throw Error("Physics engine hasn't been initialized yet");
    }
    return this.internals.world.createCollider(colliderDesc, rigidBody);
  }

  castRay(
    globalPosition: THREE.Vector3,
    globalDirection: THREE.Vector3,
    maxDistance: number,
    excludeCollider?: rapier.Collider,
  ): {
      distance: number;
      normal: SimpleVector;
    } | null {
    if (this.internals.initialized === false) {
      throw Error("Physics engine hasn't been initialized yet");
    }

    const ray = new this.RAPIER.Ray(globalPosition, globalDirection);

    // https://rapier.rs/javascript3d/classes/World.html#castRayAndGetNormal
    const result = this.internals.world.castRayAndGetNormal(
      ray,
      maxDistance,
      true,
      undefined,
      undefined,
      excludeCollider,
    );

    this.internals.world.castRay(ray, maxDistance, false);

    if (result === null) {
      return null;
    }

    return {
      distance: result.toi,
      normal: result.normal,
    };
  }

  step(timing: FrameTimingInfo): void {
    if (this.internals.initialized === false) {
      throw Error("Physics engine hasn't been initialized yet");
    }

    const maxFrameTime = 0.05;
    const frameDuration = timing.frameDuration / 1000;
    this.internals.accumulator += Math.min(frameDuration, maxFrameTime);

    while (this.internals.accumulator >= this.configuration.timestep) {
      this.internals.world.step();
      this.internals.accumulator -= this.configuration.timestep;
    }
  }
}
