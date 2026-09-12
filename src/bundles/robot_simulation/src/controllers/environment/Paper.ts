import type * as THREE from 'three';
import type { SceneRegistry } from '../../engine/Render/SceneRegistry';

export type PaperConfig = {
  url: string;
  dimension: {
    width: number;
    height: number;
  };
  position: { x: number, y: number };
  rotation: number;
};

/**
 * A purely visual overlay - unlike Cuboid, it has no physics collider, so (like before this
 * migration) it is invisible to raycasts, including the color sensor's - see ColorSensor.ts's doc
 * comment for the known follow-up this implies.
 */
export class Paper {
  config: PaperConfig;
  handle: THREE.Object3D;

  constructor(registry: SceneRegistry, config: PaperConfig) {
    this.config = config;
    this.handle = registry.add({
      kind: 'paper',
      width: config.dimension.width,
      height: config.dimension.height,
      url: config.url,
    });
  }

  start() {
    this.handle.position.set(this.config.position.x, 0.001, this.config.position.y);
    this.handle.rotation.x = -Math.PI / 2;
    this.handle.rotation.z = this.config.rotation;
  }
}
