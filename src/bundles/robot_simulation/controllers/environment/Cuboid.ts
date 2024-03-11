import * as THREE from 'three';

import {
  EntityFactory,
  MeshFactory,
  type Physics,
  type Renderer,
} from '../../engine';
import type { Dimension, SimpleVector } from '../../engine/Math/Vector';
import type { RenderCuboidOptions } from '../../engine/Render/helpers/MeshFactory';
import type {
  EntityCuboidOptions,
  RigidBodyType,
} from '../../engine/Entity/EntityFactory';

export type CuboidConfig = {
  position: SimpleVector;
  dimension: Dimension;
  mass: number;
  color: string | number;
  type: RigidBodyType;
};

const noRotation = {
  x: 0,
  y: 0,
  z: 0,
  w: 1,
};

export class Cuboid {
  physics: Physics;
  render: Renderer;
  config: CuboidConfig;

  constructor(physics: Physics, renderer: Renderer, config: CuboidConfig) {
    this.physics = physics;
    this.render = renderer;
    this.config = config;

    const renderCuboidOption: RenderCuboidOptions = {
      orientation: {
        position: config.position,
        rotation: noRotation,
      },
      dimension: config.dimension,
      color: new THREE.Color(config.color),
      debug: false,
    };

    const mesh = MeshFactory.addCuboid(renderCuboidOption);
    this.render.add(mesh);
  }

  start() {
    const entityCuboidOption: EntityCuboidOptions = {
      orientation: {
        position: this.config.position,
        rotation: noRotation,
      },
      dimension: this.config.dimension,
      mass: this.config.mass,
      type: this.config.type,
    };

    EntityFactory.addCuboid(this.physics, entityCuboidOption);
  }
}
