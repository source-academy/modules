import * as THREE from 'three';
import { type Dimension, type Orientation } from '../../Math/Vector';

export type RenderCuboidOptions = {
  orientation: Orientation;
  dimension: Dimension;
  color: THREE.Color;
  debug: boolean;
};

export function addCuboid(options: RenderCuboidOptions): THREE.Mesh {
  const { orientation, dimension, color } = options;
  const geometry = new THREE.BoxGeometry(
    dimension.width,
    dimension.height,
    dimension.length,
  );
  const material = options.debug
    ? new THREE.MeshPhysicalMaterial({
      color,
      wireframe: true,
    })
    : new THREE.MeshPhysicalMaterial({
      color,
      side: THREE.DoubleSide,
    });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.copy(orientation.position);
  mesh.quaternion.copy(orientation.rotation);

  return mesh;
}
