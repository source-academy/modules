import * as THREE from 'three';

import {
  type Physics,
  type Controller,
  EntityFactory,
  type Entity,
  MeshFactory,
  type Renderer,
} from '../../../engine';
import { type EntityCuboidOptions } from '../../../engine/Entity/EntityFactory';

export type ChassisWrapperConfig = EntityCuboidOptions & {
  debug: boolean;
};

/**
 * Wrapper for the chassis entity. It is needed because the chassis entity can only be initialized
 * after the physics engine has been started. Therefore, the chassis entity needs to be wrapped in
 * a controller.
 *
 * We also use this class to add an optional debug mesh to the chassis.
 */
export class ChassisWrapper implements Controller {
  physics: Physics;
  render: Renderer;
  config: ChassisWrapperConfig;

  chassis: Entity | null = null;
  debugMesh: THREE.Mesh;

  constructor(
    physics: Physics,
    render: Renderer,
    config: ChassisWrapperConfig,
  ) {
    this.physics = physics;
    this.render = render;
    this.config = config;

    // Debug mesh.
    this.debugMesh = MeshFactory.addCuboid({
      orientation: config.orientation,
      dimension: config.dimension,
      color: new THREE.Color(0x00ff00),
      debug: true,
    });
    // Set visible based on config.
    this.debugMesh.visible = config.debug;
    render.add(this.debugMesh);
  }

  getEntity(): Entity {
    if (this.chassis === null) {
      throw new Error('Chassis not initialized');
    }
    return this.chassis;
  }

  async start(): Promise<void> {
    this.chassis = EntityFactory.addCuboid(this.physics, this.config);
  }

  update(): void {
    const chassisEntity = this.getEntity();
    this.debugMesh.position.copy(chassisEntity.getPosition());
    this.debugMesh.quaternion.copy(chassisEntity.getRotation());
  }
}
