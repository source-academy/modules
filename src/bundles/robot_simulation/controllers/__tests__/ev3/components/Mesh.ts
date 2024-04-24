import * as THREE from 'three';
import { Renderer } from '../../../../engine';
import { loadGLTF } from '../../../../engine/Render/helpers/GLTF';
import { ChassisWrapper } from '../../../ev3/components/Chassis';
import { Mesh } from '../../../ev3/components/Mesh';

jest.mock('three', () => {
  const three = jest.requireActual('three');
  return {
    ...three,
    GLTF: jest.fn().mockImplementation(() => ({
      scene: {},
    })),
  };
});

jest.mock('../../../../engine/Render/helpers/GLTF', () => ({
  loadGLTF: jest.fn().mockResolvedValue({
    scene: {
      position: {
        copy: jest.fn(),
      },
      quaternion: {
        copy: jest.fn(),
      },
    },
  }),
}));

jest.mock('../../../ev3/components/Chassis', () => ({
  ChassisWrapper: jest.fn().mockImplementation(() => ({
    getEntity: jest.fn().mockReturnValue({
      getTranslation: jest.fn().mockReturnValue(new THREE.Vector3()),
      getRotation: jest.fn().mockReturnValue(new THREE.Quaternion()),
    }),
  })),
}));

jest.mock('../../../../engine', () => ({
  Renderer: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
  })),
}));

describe('Mesh', () => {
  let mesh;
  let mockChassisWrapper;
  let mockRenderer;
  let mockConfig;

  beforeEach(() => {
    mockRenderer = { add: jest.fn() } as unknown as Renderer;
    mockChassisWrapper = {
      getEntity: jest.fn().mockReturnValue({
        getTranslation: jest.fn().mockReturnValue(new THREE.Vector3()),
        getRotation: jest.fn().mockReturnValue(new THREE.Quaternion()),
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
    mesh.update({residualFactor: 0.5});

    expect(mesh.mesh.scene.position.copy).toHaveBeenCalled();
    expect(mesh.mesh.scene.quaternion.copy).toHaveBeenCalled();
  });
});
