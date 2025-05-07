import * as THREE from 'three';
import { ColorSensor } from '../../../ev3/sensor/ColorSensor';

jest.mock('three', () => {
  const three = jest.requireActual('three');
  return {
    ...three,
  };
});

jest.mock('../../../../engine', () => ({
  Renderer: jest.fn().mockImplementation(() => ({
    scene: jest.fn(),
    render: jest.fn(),
    getElement: jest.fn(() => document.createElement('canvas')),
  })),
}));

jest.mock('../../../../engine/Render/helpers/Camera', () => ({
  getCamera: jest.fn().mockImplementation(() => {
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
      getEntity: jest.fn(() => ({
        worldTranslation: jest.fn().mockReturnValue(new THREE.Vector3()),
      })),
    };
    mockRenderer = {
      add: jest.fn(),
      scene: jest.fn(),
      render: jest.fn(),
      getElement: jest.fn(() => document.createElement('canvas')),
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
      getImageData: jest.fn(() => ({
        data: new Uint8ClampedArray([255, 255, 255, 255]),
      })),
      putImageData: jest.fn(),
      drawImage: jest.fn(),
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      canvas: {},
    };

    HTMLCanvasElement.prototype.getContext = jest
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
