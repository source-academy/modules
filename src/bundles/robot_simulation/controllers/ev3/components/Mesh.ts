import { type Controller, type Renderer } from '../../../engine';
// eslint-disable-next-line import/extensions
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { type ChassisWrapper } from './Chassis';
import { loadGLTF } from '../../../engine/Render/helpers/GLTF';
import type { Dimension, SimpleVector } from '../../../engine/Math/Vector';

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
  }

  async start(): Promise<void> {
    this.mesh = await loadGLTF(this.config.url, this.config.dimension);

    this.render.add(this.mesh.scene);
  }

  update() {
    const chassisEntity = this.chassisWrapper.getEntity();
    const chassisPosition = chassisEntity.getPosition();

    chassisPosition.x -= this.offset.x / 2;
    chassisPosition.y -= this.offset.y / 2;
    chassisPosition.z -= this.offset.z / 2;

    this.mesh?.scene.position.copy(chassisPosition);
    this.mesh?.scene.quaternion.copy(chassisEntity.getRotation());
  }
}
