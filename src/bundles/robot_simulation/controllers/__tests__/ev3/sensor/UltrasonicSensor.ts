import * as THREE from 'three';
import { UltrasonicSensor } from '../../../ev3/sensor/UltrasonicSensor';

jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation(() => ({
    clone: jest.fn().mockReturnThis(),
    normalize: jest.fn().mockReturnThis(),
    copy: jest.fn()
  })),
  ArrowHelper: jest.fn().mockImplementation(() => ({
    visible: false,
    position: {
      copy: jest.fn()
    },
    setDirection: jest.fn()
  }))
}));

describe('UltrasonicSensor', () => {
  let sensor: UltrasonicSensor;
  let mockChassisWrapper;
  let mockPhysics;
  let mockRenderer;
  let mockConfig;

  beforeEach(() => {
    mockChassisWrapper = {
      getEntity: jest.fn(() => ({
        worldTranslation: jest.fn().mockReturnValue(new THREE.Vector3()),
        transformDirection: jest.fn().mockReturnValue(new THREE.Vector3()),
        getCollider: jest.fn()
      }))
    };
    mockPhysics = {
      castRay: jest.fn().mockReturnValue({ distance: 5 })
    };
    mockRenderer = {
      add: jest.fn()
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
