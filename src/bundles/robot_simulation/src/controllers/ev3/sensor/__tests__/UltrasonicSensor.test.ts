import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import type { Physics, Renderer } from '../../../../engine';
import type { ChassisWrapper } from '../../components/Chassis';
import { UltrasonicSensor } from '../UltrasonicSensor';

vi.mock(import('three'), () => ({
  Vector3: vi.fn(class {
    clone = vi.fn().mockReturnThis();
    normalize = vi.fn().mockReturnThis();
    copy = vi.fn();
  }),
  ArrowHelper: class {
    visible = false;
    position = {
      copy: vi.fn()
    };
    setDirection = vi.fn();
  }
}) as any);

describe(UltrasonicSensor, () => {
  const it = baseIt
    .extend('mockChassisWrapper', {
      getEntity: vi.fn(() => ({
        worldTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
        transformDirection: vi.fn().mockReturnValue(new THREE.Vector3()),
        getCollider: vi.fn()
      }))
    } as unknown as ChassisWrapper)
    .extend('mockPhysics', { castRay: vi.fn().mockReturnValue({ distance: 5 }) } as unknown as Physics)
    .extend('mockRenderer', { add: vi.fn() } as unknown as Renderer)
    .extend('mockConfig', {
      displacement: { x: 1, y: 1, z: 1 },
      direction: { x: 0, y: 1, z: 0 },
      debug: true
    })
    .extend(
      'sensor',
      ({ mockChassisWrapper, mockPhysics, mockRenderer, mockConfig }) => new UltrasonicSensor(mockChassisWrapper, mockPhysics, mockRenderer, mockConfig)
    );

  it('should create instances and set initial properties', ({ sensor, mockRenderer }) => {
    expect(sensor).toBeDefined();
    expect(THREE.Vector3).toHaveBeenCalledTimes(2); // Called for displacement and direction
    expect(mockRenderer.add).toHaveBeenCalledWith(sensor.debugArrow);
  });

  it('should return initial distance sensed as 0', ({ sensor }) => {
    expect(sensor.sense()).toEqual(0);
  });

  it('should calculate distance when fixedUpdate is called', ({ sensor, mockPhysics }) => {
    sensor.fixedUpdate();
    expect(sensor.distanceSensed).toEqual(5);
    expect(mockPhysics.castRay).toHaveBeenCalled();
    expect(sensor.debugArrow.visible).toBeTruthy();
    expect(sensor.debugArrow.setDirection).toHaveBeenCalled();
  });

  it('should handle null results from castRay indicating no collision detected', ({ sensor, mockPhysics }) => {
    vi.mocked(mockPhysics.castRay).mockReturnValue(null);
    sensor.fixedUpdate();
    expect(sensor.distanceSensed).toEqual(0);
    expect(mockPhysics.castRay).toHaveBeenCalled();
  });
});
