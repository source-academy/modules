import * as THREE from 'three';

import type { Controller } from '../../../engine';
import type { Dimension, SimpleQuaternion, SimpleVector } from '../../../engine/Math/Vector';
import type { PhysicsTimingInfo } from '../../../engine/Physics';
import type { SceneRegistry } from '../../../engine/Render/SceneRegistry';
import type { ChassisWrapper } from './Chassis';

export type MeshConfig = {
  url: string;
  dimension: Dimension;
  offset?: Partial<SimpleVector>;
};

/**
 * This represents the mesh of the robot. In reality, the mesh could be part of the chassis,
 * but for the sake of clarity it is split into its own controller.
 *
 * The GLTF itself is no longer loaded here (worker code can't reach the network/DOM APIs
 * `GLTFLoader` needs the same way it always could as ordinary main-thread code) - `registry.add`
 * only allocates a transform handle and tells the tab, over the state channel, to load and
 * position the real model. See SceneRegistry's doc comment.
 */
export class Mesh implements Controller {
  chassisWrapper: ChassisWrapper;
  registry: SceneRegistry;
  config: MeshConfig;
  offset: SimpleVector;

  mesh: THREE.Object3D | null = null;

  previousTranslation: SimpleVector | null = null;
  previousRotation: SimpleQuaternion | null = null;
  currentTranslation: SimpleVector;
  currentRotation: SimpleQuaternion;

  constructor(
    chassisWrapper: ChassisWrapper,
    registry: SceneRegistry,
    config: MeshConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.registry = registry;
    this.config = config;
    this.offset = {
      x: this.config?.offset?.x || 0,
      y: this.config?.offset?.y || 0,
      z: this.config?.offset?.z || 0,
    };
    this.currentTranslation = this.chassisWrapper.config.orientation.position;
    this.currentRotation = new THREE.Quaternion(0, 0, 0, 1);
  }

  start(): void {
    this.mesh = this.registry.add({
      kind: 'gltf',
      url: this.config.url,
      dimension: this.config.dimension,
      offsetY: this.offset.y,
    });
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

    this.mesh?.position.copy(estimatedTranslation);
    this.mesh?.quaternion.copy(estimatedRotation);
  }
}
