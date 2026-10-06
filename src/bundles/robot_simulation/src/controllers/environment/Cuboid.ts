import * as THREE from 'three';

import { EntityFactory, type Physics } from '../../engine';
import type {
  EntityCuboidOptions,
  RigidBodyType,
} from '../../engine/Entity/EntityFactory';
import type { Dimension, SimpleVector } from '../../engine/Math/Vector';
import type { SceneRegistry } from '../../engine/Render/SceneRegistry';

export type CuboidConfig = {
  position: SimpleVector;
  dimension: Dimension;
  mass: number;
  color: number | string;
  type: RigidBodyType;
};

const noRotation = {
  x: 0,
  y: 0,
  z: 0,
  w: 1,
};

/** `THREE.Color` accepts numbers/named strings/hex strings; the tab only ever gets a plain hex
  string over the wire (a `THREE.Color` instance itself isn't cheaply serializable). */
function toHexColor(color: number | string): string {
  return `#${new THREE.Color(color).getHexString()}`;
}

export class Cuboid {
  physics: Physics;
  config: CuboidConfig;

  constructor(physics: Physics, registry: SceneRegistry, config: CuboidConfig) {
    this.physics = physics;
    this.config = config;

    const handle = registry.add({
      kind: 'cuboid',
      dimension: config.dimension,
      color: toHexColor(config.color),
    });
    handle.position.copy(config.position);
    handle.quaternion.copy(noRotation);
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

    const entity = EntityFactory.addCuboid(this.physics, entityCuboidOption);
    this.physics.registerColor(entity.getCollider(), toHexColor(this.config.color));
  }
}
