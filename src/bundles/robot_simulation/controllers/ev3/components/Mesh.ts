import {
  type Entity,
  type Controller,
  MeshFactory,
  Renderer,
} from '../../../engine';
import * as THREE from 'three';
import { type Orientation } from '../../../engine/Entity/Entity';
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { type ChassisWrapper } from './Chassis';

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
  debugMesh: THREE.Mesh;
  chassisWrapper: ChassisWrapper;
  mesh: GLTF | null = null;

  constructor(
    chassisWrapper: ChassisWrapper,
    render: Renderer,
    meshConfig: MeshConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.debugMesh = MeshFactory.addCuboid(meshConfig);
    this.meshConfig = meshConfig;
    this.render = render;
    render.add(this.debugMesh);
  }

  async start(): Promise<void> {
    this.mesh = await Renderer.loadGTLF(
      'https://keen-longma-3c1be1.netlify.app/2_colors_corrected.gltf',
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
    if (this.meshConfig.debug || this.mesh === null) {
      this.debugMesh.visible = true;
    } else {
      this.debugMesh.visible = false;
    }

    this.debugMesh.position.copy(chassisEntity.getPosition() as THREE.Vector3);
    this.debugMesh.quaternion.copy(
      chassisEntity.getRotation() as THREE.Quaternion,
    );

    this.mesh?.scene.position.copy(
      chassisEntity.getPosition() as THREE.Vector3,
    );
    this.mesh?.scene.quaternion.copy(
      chassisEntity.getRotation() as THREE.Quaternion,
    );
  }
}
