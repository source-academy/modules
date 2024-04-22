import * as THREE from 'three';

import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { type Controller, type Renderer } from '../../../engine';
// eslint-disable-next-line import/extensions
import type { Dimension, SimpleQuaternion, SimpleVector } from '../../../engine/Math/Vector';
import type { PhysicsTimingInfo } from '../../../engine/Physics';
import { loadGLTF } from '../../../engine/Render/helpers/GLTF';
import { type ChassisWrapper } from './Chassis';

export type MeshConfig = {
  url: string;
  dimension: Dimension;
  offset?: Partial<SimpleVector>;
};

/**
 * This represents the mesh of the robot. In reality, the mesh could be part of the chassis,
 * but for the sake of clarity it is split into its own controller.
 */
export class Mesh implements Controller {
  chassisWrapper: ChassisWrapper;
  render: Renderer;
  config: MeshConfig;
  offset: SimpleVector;

  mesh: GLTF | null = null;

  previousTranslation: SimpleVector | null= null;
  previousRotation: SimpleQuaternion | null = null;
  currentTranslation: SimpleVector;
  currentRotation: SimpleQuaternion;

  constructor(
    chassisWrapper: ChassisWrapper,
    render: Renderer,
    config: MeshConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.render = render;
    this.config = config;
    this.offset = {
      x: this.config?.offset?.x || 0,
      y: this.config?.offset?.y || 0,
      z: this.config?.offset?.z || 0,
    };
    this.currentTranslation = this.chassisWrapper.config.orientation.position;
    this.currentRotation = new THREE.Quaternion(0,0,0,1);
  }

  async start(): Promise<void> {
    this.mesh = await loadGLTF(this.config.url, this.config.dimension);

    this.render.add(this.mesh.scene);
  }

  fixedUpdate(): void {
    this.previousTranslation = this.currentTranslation;
    this.previousRotation = this.currentRotation;
    this.currentRotation = this.chassisWrapper.getEntity().getRotation();
    this.currentTranslation = this.chassisWrapper.getEntity().getTranslation();
  }

  update(timingInfo: PhysicsTimingInfo) {
    const vecCurrentTranslation = new THREE.Vector3().copy(this.currentTranslation);
    const vecPreviousTranslation = new THREE.Vector3().copy(this.previousTranslation || this.currentTranslation);
    const quatCurrentRotation = new THREE.Quaternion().copy(this.currentRotation);
    const quatPreviousRotation = new THREE.Quaternion().copy(this.previousRotation || this.currentRotation);

    const estimatedTranslation = vecPreviousTranslation.lerp(vecCurrentTranslation, timingInfo.residualFactor);
    const estimatedRotation = quatPreviousRotation.slerp(quatCurrentRotation, timingInfo.residualFactor);

    estimatedTranslation.x -= this.offset.x / 2;
    estimatedTranslation.y -= this.offset.y / 2;
    estimatedTranslation.z -= this.offset.z / 2;

    this.mesh?.scene.position.copy(estimatedTranslation);
    this.mesh?.scene.quaternion.copy(estimatedRotation);
  }
}
