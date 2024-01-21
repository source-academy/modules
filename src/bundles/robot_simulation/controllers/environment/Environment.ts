import { type Physics, type Controller, type Renderer, EntityFactory, MeshFactory } from '../../engine';
import * as THREE from 'three';

import { type EntityCuboidOptions } from '../../engine/Entity/EntityFactory';
import { type RenderCuboidOptions } from '../../engine/Render/MeshFactory';

export const floorConfig: EntityCuboidOptions & RenderCuboidOptions = {
  debug: false,
  orientation: {
    position: {
      x: 0,
      y: -0.5,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
    },
  },
  mass: 1,
  height: 1,
  width: 20,
  length: 20,
  color: new THREE.Color('white'),
  type: 'fixed',
};


export class Environment implements Controller {
  private physics: Physics;
  private renderer: Renderer;
  private mesh: THREE.Mesh;

  constructor(physics:Physics, renderer: Renderer) {
    this.physics = physics;
    this.renderer = renderer;

    this.mesh = MeshFactory.addCuboid(floorConfig);
  }

  async start(): Promise<void> {
    EntityFactory.addCuboid(this.physics, floorConfig);

    // Load the texture
    const texture = new THREE.TextureLoader()
      .load('https://www.shutterstock.com/image-vector/black-white-stripes-260nw-785326606.jpg');

    // Create a material with the texture
    const material = new THREE.MeshStandardMaterial({ map: texture });

    // Apply the material to the mesh
    this.mesh.material = material;

    this.renderer.add(this.mesh);
  }
}
