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


export class Floor implements Controller {
  private physics: Physics;
  private renderer: Renderer;
  private mesh: THREE.Mesh;
  private paper: THREE.Mesh;

  constructor(physics:Physics, renderer: Renderer) {
    this.physics = physics;
    this.renderer = renderer;

    this.mesh = MeshFactory.addCuboid(floorConfig);

    const plane = new THREE.PlaneGeometry(1, 1); // Creating a 1x1 plane for the carpet
    this.paper = new THREE.Mesh(plane);
  }

  async start(): Promise<void> {
    EntityFactory.addCuboid(this.physics, floorConfig);

    // Load the texture
    const texture = new THREE.TextureLoader()
      .load('https://www.shutterstock.com/image-vector/black-white-stripes-260nw-785326606.jpg');

    // Create a material with the texture
    const material = new THREE.MeshStandardMaterial({ map: texture });
    this.paper.scale.set(2, 2, 2); // Scale the plane to the size of the floor
    this.paper.position.set(0, 0.001, 0); // Position the plane at the floor
    this.paper.rotation.x = -Math.PI / 2; // Rotate the plane to be parallel to the floor
    this.paper.material = material;

    // Apply the material to the mesh
    this.renderer.add(this.mesh);
    this.renderer.add(this.paper);
  }
}
