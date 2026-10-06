import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import type { SceneRegistry } from '../../../../engine/Render/SceneRegistry';
import { ChassisWrapper } from '../Chassis';
import { Mesh, type MeshConfig } from '../Mesh';

vi.mock(import('../Chassis'), () => ({
  ChassisWrapper: vi.fn().mockImplementation(() => ({
    getEntity: vi.fn().mockReturnValue({
      getTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
      getRotation: vi.fn().mockReturnValue(new THREE.Quaternion()),
    }),
  })),
}));

describe(Mesh, () => {
  const it = baseIt
    .extend('mockRegistry', {
      add: vi.fn().mockReturnValue(new THREE.Object3D()),
    } as unknown as SceneRegistry)
    .extend('mockChassisWrapper', {
      getEntity: vi.fn().mockReturnValue({
        getTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
        getRotation: vi.fn().mockReturnValue(new THREE.Quaternion()),
      }),
      config: {
        orientation: {
          position: {
            x: 0,
            y: 0.0775,
            z: 0,
          },
          rotation: {
            x: 0,
            y: 0,
            z: 0,
            w: 1,
          },
        }
      }
    } as unknown as ChassisWrapper)
    .extend('mockConfig', {
      url: 'path/to/mesh',
      dimension: { width: 1, height: 2, depth: 3 },
      offset: { x: 0.5, y: 0.5, z: 0.5 },
    } as unknown as MeshConfig)
    .extend('mesh', ({ mockChassisWrapper, mockRegistry, mockConfig }) => new Mesh(mockChassisWrapper, mockRegistry, mockConfig));

  it('should initialize correctly with given configurations', ({ mesh, mockConfig }) => {
    expect(mesh.config.url).toBe(mockConfig.url);
    expect(mesh.offset.x).toBe(0.5);
  });

  it('should register a transform handle in the scene registry on start', ({ mesh, mockConfig, mockRegistry }) => {
    mesh.start();
    expect(mockRegistry.add).toHaveBeenCalledWith({
      kind: 'gltf',
      url: mockConfig.url,
      dimension: mockConfig.dimension,
      offsetY: mesh.offset.y,
    });
    expect(mesh.mesh).toBeInstanceOf(THREE.Object3D);
  });

  it('should update mesh position and orientation according to chassis', ({ mesh }) => {
    mesh.start();
    const positionCopy = vi.spyOn(mesh.mesh!.position, 'copy');
    const quaternionCopy = vi.spyOn(mesh.mesh!.quaternion, 'copy');
    mesh.fixedUpdate();
    mesh.update({ residualFactor: 0.5 } as any);

    expect(positionCopy).toHaveBeenCalled();
    expect(quaternionCopy).toHaveBeenCalled();
  });
});
