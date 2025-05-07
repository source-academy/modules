import rapier from '@dimforge/rapier3d-compat';

import type * as THREE from 'three';

import { TypedEventTarget } from './Core/Events';
import type { FrameTimingInfo } from './Core/Timer';
import type { SimpleVector } from './Math/Vector';

export type PhysicsTimingInfo = FrameTimingInfo & {
  stepCount: number;
  timestep: number;
  residualFactor: number;
};

export class TimeStampedEvent extends Event {
  frameTimingInfo: PhysicsTimingInfo;

  constructor(type: string, frameTimingInfo: PhysicsTimingInfo) {
    super(type);
    this.frameTimingInfo = frameTimingInfo;
  }
}

type PhysicsEventMap = {
  beforePhysicsUpdate: TimeStampedEvent;
  afterPhysicsUpdate: TimeStampedEvent;
};

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
  stepCount: number;
};

type PhysicsInternals = InitializedInternals | NotInitializedInternals;

export class Physics extends TypedEventTarget<PhysicsEventMap> {
  RAPIER: typeof rapier;
  configuration: PhysicsConfig;
  internals: PhysicsInternals;

  constructor(configuration: PhysicsConfig) {
    super();
    this.configuration = configuration;
    this.RAPIER = rapier;

    this.internals = { initialized: false };
  }

  async start() {
    await rapier.init();

    this.RAPIER = rapier;

    const world = new rapier.World(this.configuration.gravity);
    world.timestep = this.configuration.timestep;

    this.internals = {
      initialized: true,
      world,
      accumulator: world.timestep,
      stepCount: 0,
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

  step(timing: FrameTimingInfo): PhysicsTimingInfo {
    if (this.internals.initialized === false) {
      throw Error("Physics engine hasn't been initialized yet");
    }

    const maxFrameTime = 0.05;
    const frameDuration = timing.frameDuration / 1000;
    this.internals.accumulator += Math.min(frameDuration, maxFrameTime);

    const currentPhysicsTimingInfo = {
      ...timing,
      stepCount: this.internals.stepCount,
      timestep: this.configuration.timestep * 1000,
      residualFactor: this.internals.accumulator / this.configuration.timestep,
    };

    while (this.internals.accumulator >= this.configuration.timestep) {
      this.dispatchEvent(
        'beforePhysicsUpdate',
        new TimeStampedEvent('beforePhysicsUpdate', currentPhysicsTimingInfo),
      );

      this.internals.world.step();

      this.internals.stepCount += 1;
      currentPhysicsTimingInfo.stepCount = this.internals.stepCount;

      this.dispatchEvent(
        'afterPhysicsUpdate',
        new TimeStampedEvent('afterPhysicsUpdate', currentPhysicsTimingInfo),
      );

      this.internals.accumulator -= this.configuration.timestep;
      currentPhysicsTimingInfo.residualFactor = this.internals.accumulator / this.configuration.timestep;
    }

    return currentPhysicsTimingInfo;
  }
}
