import { describe, expect, it as baseIt, vi } from 'vitest';
import { EntityFactory, type Physics } from '../../../../engine';

import { ChassisWrapper, type ChassisWrapperConfig } from '../Chassis';

vi.mock(import('../../../../engine/Entity/EntityFactory'));

const mockedEntityFactory = vi.mocked(EntityFactory);

describe(ChassisWrapper, () => {
  const it = baseIt
    .extend('physicsMock', () => vi.fn() as unknown as Physics)
    .extend('config', {
      dimension: { width: 1, height: 1, depth: 1 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      debug: true
    } as unknown as ChassisWrapperConfig)
    .extend('chassisWrapper', ({ physicsMock, config }) => new ChassisWrapper(physicsMock, config));

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
});
