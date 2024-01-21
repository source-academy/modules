import { type Physics, type Controller, EntityFactory, type Entity } from '../../../engine';
import { type EntityCuboidOptions } from '../../../engine/Entity/EntityFactory';

export class ChassisWrapper implements Controller {
  private physics: Physics;
  private config: EntityCuboidOptions;

  private chassis: Entity | null = null;

  constructor(physics: Physics, config: EntityCuboidOptions) {
    this.physics = physics;
    this.config = config;
  }

  async start() {
    this.chassis = EntityFactory.addCuboid(this.physics, this.config);
  }

  getEntity() {
    if (this.chassis === null) {
      throw new Error('Chassis not initialized');
    }
    return this.chassis;
  }
}
