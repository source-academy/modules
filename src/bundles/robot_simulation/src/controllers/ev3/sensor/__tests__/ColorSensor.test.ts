import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import type { Physics } from '../../../../engine';
import type { ChassisWrapper } from '../../components/Chassis';
import { ColorSensor, type ColorSensorConfig } from '../ColorSensor';

describe(ColorSensor, () => {
  const it = baseIt
    .extend('mockChassisWrapper', {
      getEntity: vi.fn(() => ({
        worldTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
        getCollider: vi.fn().mockReturnValue({}),
      })),
    } as unknown as ChassisWrapper)
    .extend('mockPhysics', {
      castRay: vi.fn(),
      getColor: vi.fn(),
    } as unknown as Physics)
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
      camera: {},
      debug: true,
    } as ColorSensorConfig)
    .extend(
      'sensor',
      ({ mockChassisWrapper, mockPhysics, mockConfig }) => new ColorSensor(mockChassisWrapper, mockPhysics, mockConfig)
    );

  it('should default to white before the first sensed tick', ({ sensor }) => {
    expect(sensor.sense()).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('should not update color until accumulating sufficient time', ({ sensor, mockPhysics }) => {
    const timingInfo = { timestep: 50 };
    sensor.fixedUpdate(timingInfo as any);
    expect(mockPhysics.castRay).not.toHaveBeenCalled();
  });

  it('should sample the raycast-hit surface color once enough time accumulates', ({ sensor, mockPhysics }) => {
    vi.mocked(mockPhysics.castRay).mockReturnValue({ distance: 0.1, normal: { x: 0, y: 1, z: 0 }, collider: {} as any });
    vi.mocked(mockPhysics.getColor).mockReturnValue('#ff0000');

    const timingInfo = { timestep: 200 };
    sensor.fixedUpdate(timingInfo as any);

    expect(mockPhysics.castRay).toHaveBeenCalled();
    const result = sensor.sense();
    expect(result.r).toBeCloseTo(255);
    expect(result.g).toBeCloseTo(0);
    expect(result.b).toBeCloseTo(0);
  });

  it('should fall back to white when the raycast hits nothing', ({ sensor, mockPhysics }) => {
    vi.mocked(mockPhysics.castRay).mockReturnValue(null);

    const timingInfo = { timestep: 200 };
    sensor.fixedUpdate(timingInfo as any);

    expect(sensor.sense()).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('should give correct response for sense', ({ sensor }) => {
    const colorSensed = { r: 10, g: 20, b: 30 };
    sensor.colorSensed = colorSensed;
    const result = sensor.sense();
    expect(result).toEqual(colorSensed);
  });
});
