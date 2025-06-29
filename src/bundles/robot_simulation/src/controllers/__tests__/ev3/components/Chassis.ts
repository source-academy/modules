import * as THREE from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityFactory, MeshFactory, Physics, Renderer } from '../../../../engine';

import { ChassisWrapper } from '../../../ev3/components/Chassis';

vi.mock('../../../../engine', () => ({
  Physics: vi.fn(),
  Renderer: vi.fn(),
  EntityFactory: { addCuboid: vi.fn() },
  MeshFactory: { addCuboid: vi.fn() }
}));
vi.mock('../../../../engine/Entity/EntityFactory');

vi.mock('three', async importOriginal => {
  return {
    ...await importOriginal(),
    Mesh: vi.fn().mockImplementation(() => ({
      position: { copy: vi.fn() },
      quaternion: { copy: vi.fn() },
      visible: false,
    })),
    Color: vi.fn()
  };
});

const mockedMeshFactory = vi.mocked(MeshFactory);
const mockedEntityFactory = vi.mocked(EntityFactory);

describe('ChassisWrapper', () => {
  let physicsMock;
  let rendererMock;
  let chassisWrapper;
  let config;

  beforeEach(() => {
    physicsMock = vi.fn() as unknown as Physics;
    rendererMock = {add:vi.fn()} as unknown as Renderer;
    config = {
      dimension: { width: 1, height: 1, depth: 1 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      debug: true
    };

    mockedMeshFactory.addCuboid.mockReturnValue(new THREE.Mesh());
    chassisWrapper = new ChassisWrapper(physicsMock, rendererMock, config);

  });

  it('should initialize with a debug mesh if debug is true', () => {
    expect(MeshFactory.addCuboid).toHaveBeenCalledWith({
      orientation: config.orientation,
      dimension: config.dimension,
      color: expect.any(THREE.Color),
      debug: true
    });
    expect(rendererMock.add).toBeCalled();
    expect(chassisWrapper.debugMesh.visible).toBe(true);
  });

  it('should throw if getEntity is called before chassis is initialized', () => {
    expect(chassisWrapper.chassis).toBe(null);
    expect(() => chassisWrapper.getEntity()).toThrow('Chassis not initialized');
  });

  it('should correctly initialize the chassis entity on start', async () => {
    const mockEntity = { getTranslation: vi.fn(), getRotation: vi.fn() };
    mockedEntityFactory.addCuboid.mockReturnValue(mockEntity as any);
    await chassisWrapper.start();

    expect(chassisWrapper.chassis).toBe(mockEntity);
    expect(EntityFactory.addCuboid).toHaveBeenCalledWith(physicsMock, config);
  });

  it('should update the position and orientation of the debug mesh to match the chassis entity', () => {
    const mockEntity = {
      getTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
      getRotation: vi.fn().mockReturnValue(new THREE.Quaternion())
    };
    mockedEntityFactory.addCuboid.mockReturnValue(mockEntity as any);
    chassisWrapper.chassis = mockEntity;

    chassisWrapper.update();

    expect(chassisWrapper.debugMesh.position.copy).toHaveBeenCalledWith(mockEntity.getTranslation());
    expect(chassisWrapper.debugMesh.quaternion.copy).toHaveBeenCalledWith(mockEntity.getRotation());
  });
});
