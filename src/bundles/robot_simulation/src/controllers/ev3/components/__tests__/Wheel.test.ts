import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import type { Physics, Renderer } from '../../../../engine';
import type { ChassisWrapper } from '../Chassis';
import { Wheel, type WheelConfig } from '../Wheel';

vi.mock(import('../../../../engine/Render/debug/DebugArrow'), () => ({
  DebugArrow: class {
    getMesh = vi.fn().mockReturnValue({});
    update = vi.fn();
  },
} as any));

describe(Wheel, () => {
  const it = baseIt
    .extend('mockPhysics', { castRay: vi.fn() } as unknown as Physics)
    .extend('mockRenderer', { add: vi.fn() } as unknown as Renderer)
    .extend('mockChassisWrapper', {
      getEntity: vi.fn().mockReturnValue({
        worldTranslation: vi.fn().mockImplementation(() => new THREE.Vector3()),
        transformDirection: vi.fn().mockImplementation(() => new THREE.Vector3()),
        applyImpulse: vi.fn(),
        getMass: vi.fn().mockReturnValue(1),
        getCollider: vi.fn().mockReturnValue({}),
      }),
    } as unknown as ChassisWrapper)
    .extend('mockConfig', {
      displacement: { x: 1, y: 0, z: 0 },
      pid: {
        proportionalGain: 1,
        integralGain: 0.1,
        derivativeGain: 0.01,
      },
      gapToFloor: 0.5,
      maxRayDistance: 5,
      debug: true,
    } as WheelConfig)
    .extend(
      'wheel',
      ({ mockChassisWrapper, mockPhysics, mockRenderer, mockConfig }) => new Wheel(mockChassisWrapper, mockPhysics, mockRenderer, mockConfig)
    );

  it('should initialize with a debug arrow if debug is true', ({ wheel, mockRenderer }) => {
    expect(wheel.arrowHelper).toBeDefined();
    expect(mockRenderer.add).toHaveBeenCalled();
  });

  it('should correctly calculate physics interactions in fixedUpdate', ({ mockPhysics, wheel, mockChassisWrapper, mockConfig }) => {
    const timingInfo = { timestep: 16 }; // 16 ms timestep
    const mockResult = {
      distance: 0.3,
      normal: new THREE.Vector3(0, 1, 0),
    };
    vi.mocked(mockPhysics.castRay).mockReturnValue(mockResult);

    wheel.fixedUpdate(timingInfo as any);

    expect(mockPhysics.castRay).toHaveBeenCalledWith(
      expect.any(THREE.Vector3),
      expect.any(THREE.Vector3),
      mockConfig.maxRayDistance,
      expect.anything()
    );
    expect(mockChassisWrapper.getEntity().applyImpulse).toHaveBeenCalled();
    expect(wheel.arrowHelper.update).toHaveBeenCalled();
  });

  it('should handle null result from castRay indicating no ground contact', ({ mockPhysics, mockChassisWrapper, wheel }) => {
    const timingInfo = { timestep: 16 };
    vi.mocked(mockPhysics.castRay).mockReturnValue(null);

    wheel.fixedUpdate(timingInfo as any);

    expect(mockChassisWrapper.getEntity().applyImpulse).not.toHaveBeenCalled();
  });

  it('if wheelDistance is 0, the normal should be pointing up', ({ wheel, mockPhysics, mockChassisWrapper }) => {
    const timingInfo = { timestep: 16 }; // 16 ms timestep
    const mockResult = {
      distance: 0,
      normal: new THREE.Vector3(0, 0, 0),
    };
    vi.mocked(mockPhysics.castRay).mockReturnValue(mockResult);

    wheel.fixedUpdate(timingInfo as any);

    expect(mockChassisWrapper.getEntity().applyImpulse).toHaveBeenCalledWith(
      expect.objectContaining({ x: 0, z: 0 }), // y value can be anything
      expect.any(THREE.Vector3)
    );
  });
});
