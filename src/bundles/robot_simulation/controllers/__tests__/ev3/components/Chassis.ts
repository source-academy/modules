import * as THREE from 'three';
import { Physics, Renderer, EntityFactory , MeshFactory } from '../../../../engine';

import { ChassisWrapper } from '../../../ev3/components/Chassis';

jest.mock('../../../../engine', () => ({
  Physics: jest.fn(),
  Renderer: jest.fn(),
  EntityFactory: { addCuboid: jest.fn() },
  MeshFactory: { addCuboid: jest.fn() }
}));
jest.mock('../../../../engine/Entity/EntityFactory');

jest.mock('three', () => {
  const three = jest.requireActual('three');
  return {
    ...three,
    Mesh: jest.fn().mockImplementation(() => ({
      position: { copy: jest.fn() },
      quaternion: { copy: jest.fn() },
      visible: false,
    })),
    Color: jest.fn()
  };
});

const mockedMeshFactory = MeshFactory as jest.Mocked<typeof MeshFactory>;
const mockedEntityFactory = EntityFactory as jest.Mocked<typeof EntityFactory>;

describe('ChassisWrapper', () => {
  let physicsMock;
  let rendererMock;
  let chassisWrapper;
  let config;

  beforeEach(() => {
    physicsMock = jest.fn() as unknown as Physics;
    rendererMock = {add:jest.fn()} as unknown as Renderer;
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
    const mockEntity = { getTranslation: jest.fn(), getRotation: jest.fn() };
    mockedEntityFactory.addCuboid.mockReturnValue(mockEntity as any);
    await chassisWrapper.start();

    expect(chassisWrapper.chassis).toBe(mockEntity);
    expect(EntityFactory.addCuboid).toHaveBeenCalledWith(physicsMock, config);
  });

  it('should update the position and orientation of the debug mesh to match the chassis entity', () => {
    const mockEntity = {
      getTranslation: jest.fn().mockReturnValue(new THREE.Vector3()),
      getRotation: jest.fn().mockReturnValue(new THREE.Quaternion())
    };
    mockedEntityFactory.addCuboid.mockReturnValue(mockEntity as any);
    chassisWrapper.chassis = mockEntity;

    chassisWrapper.update();

    expect(chassisWrapper.debugMesh.position.copy).toHaveBeenCalledWith(mockEntity.getTranslation());
    expect(chassisWrapper.debugMesh.quaternion.copy).toHaveBeenCalledWith(mockEntity.getRotation());
  });
});
