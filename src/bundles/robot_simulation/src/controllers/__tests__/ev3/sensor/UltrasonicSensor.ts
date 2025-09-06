import * as THREE from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UltrasonicSensor } from '../../../ev3/sensor/UltrasonicSensor';

vi.mock(import('three'), () => ({
  Vector3: vi.fn().mockImplementation(() => ({
    clone: vi.fn().mockReturnThis(),
    normalize: vi.fn().mockReturnThis(),
    copy: vi.fn()
  })),
  ArrowHelper: vi.fn().mockImplementation(() => ({
    visible: false,
    position: {
      copy: vi.fn()
    },
    setDirection: vi.fn()
  }))
}) as any);

describe(UltrasonicSensor, () => {
  let sensor: UltrasonicSensor;
  let mockChassisWrapper;
  let mockPhysics;
  let mockRenderer;
  let mockConfig;

  beforeEach(() => {
    mockChassisWrapper = {
      getEntity: vi.fn(() => ({
        worldTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
        transformDirection: vi.fn().mockReturnValue(new THREE.Vector3()),
        getCollider: vi.fn()
      }))
    };
    mockPhysics = {
      castRay: vi.fn().mockReturnValue({ distance: 5 })
    };
    mockRenderer = {
      add: vi.fn()
    };
    mockConfig = {
      displacement: { x: 1, y: 1, z: 1 },
      direction: { x: 0, y: 1, z: 0 },
      debug: true
    };

    sensor = new UltrasonicSensor(mockChassisWrapper, mockPhysics, mockRenderer, mockConfig);
  });

  it('should create instances and set initial properties', () => {
    expect(sensor).toBeDefined();
    expect(THREE.Vector3).toHaveBeenCalledTimes(2); // Called for displacement and direction
    expect(mockRenderer.add).toHaveBeenCalledWith(sensor.debugArrow);
  });

  it('should return initial distance sensed as 0', () => {
    expect(sensor.sense()).toEqual(0);
  });

  it('should calculate distance when fixedUpdate is called', () => {
    sensor.fixedUpdate();
    expect(sensor.distanceSensed).toEqual(5);
    expect(mockPhysics.castRay).toHaveBeenCalled();
    expect(sensor.debugArrow.visible).toBeTruthy();
    expect(sensor.debugArrow.setDirection).toHaveBeenCalled();
  });

  it('should handle null results from castRay indicating no collision detected', () => {
    mockPhysics.castRay.mockReturnValue(null);
    sensor.fixedUpdate();
    expect(sensor.distanceSensed).toEqual(0);
    expect(mockPhysics.castRay).toHaveBeenCalled();
  });
});
