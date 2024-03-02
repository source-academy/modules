import { type Physics, type Controller, type Renderer, EntityFactory, MeshFactory } from '../../engine';
import * as THREE from 'three';

import { type EntityCuboidOptions } from '../../engine/Entity/EntityFactory';
import { type RenderCuboidOptions } from '../../engine/Render/MeshFactory';

export const wallConfig: EntityCuboidOptions & RenderCuboidOptions = {
  debug: false,
  orientation: {
    position: {
      x: 0,
      y: 1,
      z: 1,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
    },
  },
  mass: 1,
  height: 2,
  width: 1,
  length: 0.1,
  color: new THREE.Color('yellow'),
  type: 'fixed',
};


export class Wall implements Controller {
  private physics: Physics;
  private renderer: Renderer;
  private mesh: THREE.Mesh;

  constructor(physics:Physics, renderer: Renderer) {
    this.physics = physics;
    this.renderer = renderer;
    this.mesh = MeshFactory.addCuboid(wallConfig);
  }

  async start(): Promise<void> {
    EntityFactory.addCuboid(this.physics, wallConfig);
    this.renderer.add(this.mesh);
  }
}
