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
import type { MeshConfig } from './Mesh';

export class ChassisWrapper implements Controller {
  private physics: Physics;
  private config: EntityCuboidOptions;

  private chassis: Entity | null = null;
  debugMesh: THREE.Mesh;

  constructor(physics: Physics, render: Renderer, config: EntityCuboidOptions) {
    this.physics = physics;
    this.config = config;

    // Debug mesh
    const meshConfig: MeshConfig = {
      orientation: config.orientation,
      width: config.width,
      height: config.height,
      length: config.length,
      color: new THREE.Color(0x00ff00),
      debug: true,
    };

    this.debugMesh = MeshFactory.addCuboid(meshConfig);
    render.add(this.debugMesh);
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

  update() {
    const chassisEntity = this.getEntity();
    this.debugMesh.position.copy(chassisEntity.getPosition());
    this.debugMesh.quaternion.copy(
      chassisEntity.getRotation(),
    );
  }
}
