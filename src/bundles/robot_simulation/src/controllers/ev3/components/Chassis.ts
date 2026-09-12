import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';

import {
  EntityFactory,
  type Controller,
  type Entity,
  type Physics,
} from '../../../engine';
import type { EntityCuboidOptions } from '../../../engine/Entity/EntityFactory';

export type ChassisWrapperConfig = EntityCuboidOptions & {
  debug: boolean;
};

/**
 * Wrapper for the chassis entity. It is needed because the chassis entity can only be initialized
 * after the physics engine has been started. Therefore, the chassis entity needs to be wrapped in
 * a controller.
 *
 * The pre-migration debug wireframe mesh (drawn from `config.debug`) is dropped: it was a
 * dev-only visual aid layered on top of the chassis's real GLTF body (see Mesh.ts), not something
 * the simulation's behaviour depends on, and rendering now happens entirely on the tab.
 */
export class ChassisWrapper implements Controller {
  physics: Physics;
  config: ChassisWrapperConfig;

  chassis: Entity | null = null;

  constructor(physics: Physics, config: ChassisWrapperConfig) {
    this.physics = physics;
    this.config = config;
  }

  getEntity(): Entity {
    if (this.chassis === null) {
      throw new EvaluatorRuntimeError('Chassis not initialized');
    }
    return this.chassis;
  }

  async start(): Promise<void> {
    this.chassis = EntityFactory.addCuboid(this.physics, this.config);
  }
}
