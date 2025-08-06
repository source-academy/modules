import * as THREE from 'three';

import type { Renderer } from '../../engine';

export type PaperConfig = {
  url: string;
  dimension: {
    width: number;
    height: number;
  };
  position: { x: number, y: number };
  rotation: number,
};

export class Paper {
  render: Renderer;
  config: PaperConfig;
  paper: THREE.Mesh;

  constructor(render: Renderer, config: PaperConfig) {
    this.render = render;
    this.config = config;

    const plane = new THREE.PlaneGeometry(this.config.dimension.width, this.config.dimension.height); // Creating a 1x1 plane for the carpet
    this.paper = new THREE.Mesh(plane);
  }

  async start() {
    const texture = new THREE.TextureLoader()
      .load(this.config.url);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    this.paper.position.set(this.config.position.x, 0.001, this.config.position.y);
    this.paper.rotation.x = -Math.PI / 2;
    this.paper.rotation.z = this.config.rotation;
    this.paper.material = material;
    this.render.add(this.paper);
  }
}
