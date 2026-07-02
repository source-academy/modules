import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import { EntityFactory, MeshFactory, type Physics, type Renderer } from '../../../../engine';

import { ChassisWrapper, type ChassisWrapperConfig } from '../Chassis';

// @ts-expect-error not a complete mock of engine
vi.mock(import('../../../../engine'), () => ({
  Physics: vi.fn(),
  Renderer: vi.fn(),
  EntityFactory: { addCuboid: vi.fn() },
  MeshFactory: { addCuboid: vi.fn() }
}));

vi.mock(import('../../../../engine/Entity/EntityFactory'));

vi.mock(import('three'), async importOriginal => {
  // @ts-expect-error Not a complete mock of three.js
  return {
    ...await importOriginal(),
    Mesh: vi.fn(class {
      position = { copy: vi.fn() };
      quaternion = { copy: vi.fn() };
      visible = false;
    }),
    Color: vi.fn()
  } as typeof THREE;
});

const mockedMeshFactory = vi.mocked(MeshFactory);
mockedMeshFactory.addCuboid.mockReturnValue(new THREE.Mesh());

const mockedEntityFactory = vi.mocked(EntityFactory);

describe(ChassisWrapper, () => {
  const it = baseIt
    .extend('physicsMock', () => vi.fn() as unknown as Physics)
    .extend('rendererMock', { add:vi.fn() } as unknown as Renderer)
    .extend('config', {
      dimension: { width: 1, height: 1, depth: 1 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      debug: true
    } as unknown as ChassisWrapperConfig)
    .extend('chassisWrapper', ({ physicsMock, rendererMock, config }) => new ChassisWrapper(physicsMock, rendererMock, config));

  it('should initialize with a debug mesh if debug is true', ({ rendererMock, chassisWrapper, config }) => {
    expect(MeshFactory.addCuboid).toHaveBeenCalledWith({
      orientation: config.orientation,
      dimension: config.dimension,
      color: expect.any(THREE.Color),
      debug: true
    });
    expect(rendererMock.add).toHaveBeenCalledOnce();
    expect(chassisWrapper.debugMesh.visible).toBe(true);
  });

  it('should throw if getEntity is called before chassis is initialized', ({ chassisWrapper }) => {
    expect(chassisWrapper.chassis).toBe(null);
    expect(() => chassisWrapper.getEntity()).toThrow('Chassis not initialized');
  });

  it('should correctly initialize the chassis entity on start', async ({ chassisWrapper, physicsMock, config }) => {
    const mockEntity = { getTranslation: vi.fn(), getRotation: vi.fn() };
    mockedEntityFactory.addCuboid.mockReturnValue(mockEntity as any);
    await chassisWrapper.start();

    expect(chassisWrapper.chassis).toBe(mockEntity);
    expect(EntityFactory.addCuboid).toHaveBeenCalledWith(physicsMock, config);
  });

  it('should update the position and orientation of the debug mesh to match the chassis entity', ({ chassisWrapper }) => {
    const mockEntity = {
      getTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
      getRotation: vi.fn().mockReturnValue(new THREE.Quaternion())
    } as any;

    mockedEntityFactory.addCuboid.mockReturnValue(mockEntity);
    chassisWrapper.chassis = mockEntity;

    chassisWrapper.update();

    expect(chassisWrapper.debugMesh.position.copy).toHaveBeenCalledWith(mockEntity.getTranslation());
    expect(chassisWrapper.debugMesh.quaternion.copy).toHaveBeenCalledWith(mockEntity.getRotation());
  });
});
