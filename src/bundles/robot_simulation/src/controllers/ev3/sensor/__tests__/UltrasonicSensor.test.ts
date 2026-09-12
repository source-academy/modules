import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import type { Physics } from '../../../../engine';
import type { ChassisWrapper } from '../../components/Chassis';
import { UltrasonicSensor } from '../UltrasonicSensor';

describe(UltrasonicSensor, () => {
  const it = baseIt
    .extend('mockChassisWrapper', {
      getEntity: vi.fn(() => ({
        worldTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
        transformDirection: vi.fn().mockReturnValue(new THREE.Vector3()),
        getCollider: vi.fn()
      }))
    } as unknown as ChassisWrapper)
    .extend('mockPhysics', { castRay: vi.fn().mockReturnValue({ distance: 5, normal: { x: 0, y: 1, z: 0 }, collider: {} as any }) } as unknown as Physics)
    .extend('mockConfig', {
      displacement: { x: 1, y: 1, z: 1 },
      direction: { x: 0, y: 1, z: 0 },
      debug: true
    })
    .extend(
      'sensor',
      ({ mockChassisWrapper, mockPhysics, mockConfig }) => new UltrasonicSensor(mockChassisWrapper, mockPhysics, mockConfig)
    );

  it('should create instances and set initial properties', ({ sensor }) => {
    expect(sensor).toBeDefined();
  });

  it('should return initial distance sensed as 0', ({ sensor }) => {
    expect(sensor.sense()).toEqual(0);
  });

  it('should calculate distance when fixedUpdate is called', ({ sensor, mockPhysics }) => {
    sensor.fixedUpdate();
    expect(sensor.distanceSensed).toEqual(5);
    expect(mockPhysics.castRay).toHaveBeenCalled();
  });

  it('should handle null results from castRay indicating no collision detected', ({ sensor, mockPhysics }) => {
    vi.mocked(mockPhysics.castRay).mockReturnValue(null);
    sensor.fixedUpdate();
    expect(sensor.distanceSensed).toEqual(0);
    expect(mockPhysics.castRay).toHaveBeenCalled();
  });
});
