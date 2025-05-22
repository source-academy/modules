import * as THREE from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ColorSensor } from '../../../ev3/sensor/ColorSensor';

vi.mock('../../../../engine', () => ({
  Renderer: vi.fn().mockImplementation(() => ({
    scene: vi.fn(),
    render: vi.fn(),
    getElement: vi.fn(() => document.createElement('canvas')),
  })),
}));

vi.mock('../../../../engine/Render/helpers/Camera', () => ({
  getCamera: vi.fn().mockImplementation(() => {
    return new THREE.PerspectiveCamera();
  }),
}));

describe('ColorSensor', () => {
  let sensor;
  let mockChassisWrapper;
  let mockRenderer;
  let mockConfig;

  beforeEach(() => {
    mockChassisWrapper = {
      getEntity: vi.fn(() => ({
        worldTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
      })),
    };
    mockRenderer = {
      add: vi.fn(),
      scene: vi.fn(),
      render: vi.fn(),
      getElement: vi.fn(() => document.createElement('canvas')),
    };
    mockConfig = {
      tickRateInSeconds: 0.1,
      displacement: {
        x: 0.04,
        y: 0.2,
        z: 0.01,
      },
      size: {
        height: 16,
        width: 16,
      },
      camera: {
        type: 'perspective',
        aspect: 1,
        fov: 10,
        near: 0.01,
        far: 1,
      },
      debug: true,
    };

    sensor = new ColorSensor(mockChassisWrapper, mockRenderer, mockConfig);

    const mockCtx = {
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([255, 255, 255, 255]),
      })),
      putImageData: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      canvas: {},
    };

    HTMLCanvasElement.prototype.getContext = vi
      .fn()
      .mockImplementation((_) => {
        return mockCtx;
      });
  });

  it('should initialize correctly', () => {
    expect(sensor).toBeDefined();
    expect(mockRenderer.add).toHaveBeenCalled();
  });

  it('should update color only after accumulating sufficient time', () => {
    const timingInfo = { timestep: 50 };
    sensor.fixedUpdate(timingInfo);
    expect(mockRenderer.render).not.toHaveBeenCalled();
    sensor.fixedUpdate(timingInfo);
  });

  it('should give correct response for sense', () => {
    const colorSensed = { r: 10, g: 20, b: 30 };
    sensor.colorSensed = colorSensed;
    const result = sensor.sense();
    expect(result).toEqual(colorSensed);
  });
});
