import {
  type Entity,
  type Controller,
  Renderer,
} from '../../../engine';
import * as THREE from 'three';
// eslint-disable-next-line import/extensions
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { type ChassisWrapper } from './Chassis';
import type { Orientation } from '../../../engine/Math/Vector';

export type MeshConfig = {
  orientation: Orientation;
  width: number;
  height: number;
  length: number;
  color: THREE.Color;
  debug: boolean;
};

export class Mesh implements Controller {
  chassis: Entity | null = null;
  render: Renderer;
  meshConfig: MeshConfig;
  chassisWrapper: ChassisWrapper;
  mesh: GLTF | null = null;

  constructor(
    chassisWrapper: ChassisWrapper,
    render: Renderer,
    meshConfig: MeshConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.meshConfig = meshConfig;
    this.render = render;
  }

  async start(): Promise<void> {
    this.mesh = await Renderer.loadGTLF(
      'https://keen-longma-3c1be1.netlify.app/6_remove_wheels.gltf',
    );

    const box = new THREE.Box3()
      .setFromObject(this.mesh.scene);

    const size = new THREE.Vector3();
    box.getSize(size);

    const scaleX = this.meshConfig.width / size.x;
    const scaleY = this.meshConfig.height / size.y;
    const scaleZ = this.meshConfig.length / size.z;

    this.mesh.scene.scale.set(scaleX, scaleY, scaleZ);

    this.render.add(this.mesh.scene);
  }

  update() {
    const chassisEntity = this.chassisWrapper.getEntity();

    const chassisPosition = chassisEntity.getPosition();

    chassisPosition.y -= 0.02 / 2;

    this.mesh?.scene.position.copy(chassisPosition);
    this.mesh?.scene.quaternion.copy(
      chassisEntity.getRotation(),
    );
  }
}
