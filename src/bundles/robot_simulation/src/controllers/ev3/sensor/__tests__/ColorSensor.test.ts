import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import type { Renderer } from '../../../../engine';
import type { ChassisWrapper } from '../../components/Chassis';
import { ColorSensor, type ColorSensorConfig } from '../ColorSensor';

vi.mock(import('../../../../engine'), () => ({
  Renderer: vi.fn(class {
    scene = vi.fn();
    render = vi.fn();
    getElement = vi.fn(() => document.createElement('canvas'));
  }),
}) as any);

vi.mock(import('../../../../engine/Render/helpers/Camera'), () => ({
  getCamera: vi.fn().mockImplementation(() => {
    return new THREE.PerspectiveCamera();
  }),
}));

describe(ColorSensor, () => {
  const it = baseIt
    .extend('mockChassisWrapper', {
      getEntity: vi.fn(() => ({
        worldTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
      })),
    } as unknown as ChassisWrapper)
    .extend('mockRenderer', {
      add: vi.fn(),
      scene: vi.fn(),
      render: vi.fn(),
      getElement: vi.fn(() => document.createElement('canvas')),
    } as unknown as Renderer)
    .extend('mockConfig', {
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
    } as ColorSensorConfig)
    .extend(
      'sensor',
      ({ mockChassisWrapper, mockRenderer, mockConfig }) => new ColorSensor(mockChassisWrapper, mockRenderer, mockConfig)
    );

  it.beforeEach(() => {
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

  it('should initialize correctly', ({ sensor, mockRenderer }) => {
    expect(sensor).toBeDefined();
    expect(mockRenderer.add).toHaveBeenCalled();
  });

  it('should update color only after accumulating sufficient time', ({ sensor, mockRenderer }) => {
    const timingInfo = { timestep: 50 };
    sensor.fixedUpdate(timingInfo as any);
    expect(mockRenderer.render).not.toHaveBeenCalled();
    sensor.fixedUpdate(timingInfo as any);
  });

  it('should give correct response for sense', ({ sensor }) => {
    const colorSensed = { r: 10, g: 20, b: 30 };
    sensor.colorSensed = colorSensed;
    const result = sensor.sense();
    expect(result).toEqual(colorSensed);
  });
});
