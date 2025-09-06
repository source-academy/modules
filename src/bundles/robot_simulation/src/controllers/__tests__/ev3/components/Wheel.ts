import * as THREE from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Wheel } from '../../../ev3/components/Wheel';

vi.mock(import('../../../../engine/Render/debug/DebugArrow'), () => ({
  DebugArrow: vi.fn().mockImplementation(() => ({
    getMesh: vi.fn().mockReturnValue({}),
    update: vi.fn(),
  })),
}));

describe(Wheel, () => {
  let wheel;
  let mockChassisWrapper;
  let mockPhysics;
  let mockRenderer;
  let mockConfig;

  beforeEach(() => {
    mockPhysics = {
      castRay: vi.fn(),
    };
    mockRenderer = {
      add: vi.fn(),
    };
    mockChassisWrapper = {
      getEntity: vi.fn().mockReturnValue({
        worldTranslation: vi.fn().mockImplementation(() => new THREE.Vector3()),
        transformDirection: vi.fn().mockImplementation(() => new THREE.Vector3()),
        applyImpulse: vi.fn(),
        getMass: vi.fn().mockReturnValue(1),
        getCollider: vi.fn().mockReturnValue({}),
      }),
    };
    mockConfig = {
      displacement: { x: 1, y: 0, z: 0 },
      pid: {
        proportionalGain: 1,
        integralGain: 0.1,
        derivativeGain: 0.01,
      },
      gapToFloor: 0.5,
      maxRayDistance: 5,
      debug: true,
    };
    wheel = new Wheel(
      mockChassisWrapper,
      mockPhysics,
      mockRenderer,
      mockConfig
    );
  });

  it('should initialize with a debug arrow if debug is true', () => {
    expect(wheel.arrowHelper).toBeDefined();
    expect(mockRenderer.add).toHaveBeenCalled();
  });

  it('should correctly calculate physics interactions in fixedUpdate', () => {
    const timingInfo = { timestep: 16 }; // 16 ms timestep
    const mockResult = {
      distance: 0.3,
      normal: new THREE.Vector3(0, 1, 0),
    };
    mockPhysics.castRay.mockReturnValue(mockResult);

    wheel.fixedUpdate(timingInfo);

    expect(mockPhysics.castRay).toHaveBeenCalledWith(
      expect.any(THREE.Vector3),
      expect.any(THREE.Vector3),
      mockConfig.maxRayDistance,
      expect.anything()
    );
    expect(mockChassisWrapper.getEntity().applyImpulse).toHaveBeenCalled();
    expect(wheel.arrowHelper.update).toHaveBeenCalled();
  });

  it('should handle null result from castRay indicating no ground contact', () => {
    const timingInfo = { timestep: 16 };
    mockPhysics.castRay.mockReturnValue(null);

    wheel.fixedUpdate(timingInfo);

    expect(mockChassisWrapper.getEntity().applyImpulse).not.toHaveBeenCalled();
  });

  it('if wheelDistance is 0, the normal should be pointing up', () => {
    const timingInfo = { timestep: 16 }; // 16 ms timestep
    const mockResult = {
      distance: 0,
      normal: new THREE.Vector3(0, 0, 0),
    };
    mockPhysics.castRay.mockReturnValue(mockResult);

    wheel.fixedUpdate(timingInfo);

    expect(mockChassisWrapper.getEntity().applyImpulse).toHaveBeenCalledWith(
      expect.objectContaining({ x: 0, z: 0 }), // y value can be anything
      expect.any(THREE.Vector3)
    );
  });
});
