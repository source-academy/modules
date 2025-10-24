import * as THREE from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Renderer } from '../../../../engine';
import { loadGLTF } from '../../../../engine/Render/helpers/GLTF';
import { ChassisWrapper } from '../Chassis';
import { Mesh } from '../Mesh';

vi.mock(import('three'), async importOriginal => {
  return {
    ...await importOriginal(),
    GLTF: vi.fn().mockImplementation(() => ({
      scene: {},
    })),
  };
});

vi.mock(import('../../../../engine/Render/helpers/GLTF'), () => ({
  loadGLTF: vi.fn().mockResolvedValue({
    scene: {
      position: {
        copy: vi.fn(),
      },
      quaternion: {
        copy: vi.fn(),
      },
    },
  }),
}));

vi.mock(import('../Chassis'), () => ({
  ChassisWrapper: vi.fn().mockImplementation(() => ({
    getEntity: vi.fn().mockReturnValue({
      getTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
      getRotation: vi.fn().mockReturnValue(new THREE.Quaternion()),
    }),
  })),
}));

vi.mock(import('../../../../engine'), () => ({
  Renderer: vi.fn().mockImplementation(() => ({
    add: vi.fn(),
  })),
}) as any);

describe(Mesh, () => {
  let mesh;
  let mockChassisWrapper;
  let mockRenderer;
  let mockConfig;

  beforeEach(() => {
    mockRenderer = { add: vi.fn() } as unknown as Renderer;
    mockChassisWrapper = {
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
        },
      }
    } as unknown as ChassisWrapper;
    mockConfig = {
      url: 'path/to/mesh',
      dimension: { width: 1, height: 2, depth: 3 },
      offset: { x: 0.5, y: 0.5, z: 0.5 },
    };

    // mockLoadGLTF.mockResolvedValue({
    //   scene: new THREE.GLTF().scene
    // } as any);

    mesh = new Mesh(mockChassisWrapper, mockRenderer, mockConfig);
  });

  it('should initialize correctly with given configurations', () => {
    expect(mesh.config.url).toBe(mockConfig.url);
    expect(mesh.offset.x).toBe(0.5);
  });

  it('should load the mesh and add it to the renderer on start', async () => {
    await mesh.start();
    expect(loadGLTF).toHaveBeenCalledWith(mockConfig.url, mockConfig.dimension);
    expect(mockRenderer.add).toHaveBeenCalledWith(expect.any(Object)); // Checks if mesh scene is added to renderer
  });

  it('should update mesh position and orientation according to chassis', async () => {
    await mesh.start();
    mesh.update({ residualFactor: 0.5 });

    expect(mesh.mesh.scene.position.copy).toHaveBeenCalled();
    expect(mesh.mesh.scene.quaternion.copy).toHaveBeenCalled();
  });
});
