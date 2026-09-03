import { describe, expect, it, vi } from 'vitest';

import { ControllerMap, Physics } from '../../../../../engine';
import type { SceneRegistry } from '../../../../../engine/Render/SceneRegistry';
import { ChassisWrapper } from '../../../components/Chassis';
import { Mesh } from '../../../components/Mesh';
import { Motor } from '../../../components/Motor';
import { Wheel } from '../../../components/Wheel';
import { ColorSensor } from '../../../sensor/ColorSensor';
import { UltrasonicSensor } from '../../../sensor/UltrasonicSensor';
import { ev3Config } from '../config';
import { createDefaultEv3 } from '../ev3';

vi.mock(import('../../../components/Chassis'), () => ({ ChassisWrapper: vi.fn(class { }) } as any));
vi.mock(import('../../../components/Mesh'), () => ({ Mesh: vi.fn(class { }) } as any));
vi.mock(import('../../../components/Motor'), () => ({ Motor: vi.fn(class {}) } as any));
vi.mock(import('../../../components/Wheel'), () => ({ Wheel: vi.fn(class {}) } as any));
vi.mock(import('../../../sensor/ColorSensor'), () => ({ ColorSensor: vi.fn(class {}) } as any));
vi.mock(import('../../../sensor/UltrasonicSensor'), () => ({ UltrasonicSensor: vi.fn(class {}) } as any));
vi.mock(import('../../../../../engine'), () => {
  return {
    Physics: vi.fn(),
    ControllerMap: vi.fn(class {
      add = vi.fn();
    })
  } as any;
});

describe(createDefaultEv3, () => {
  const mockPhysics = new Physics({ gravity:{ x:0, y:-1, z:0 }, timestep: 0.01 });
  const mockRegistry = vi.fn() as unknown as SceneRegistry;
  const mockConfig = ev3Config;

  it('should correctly create all components and return a controller map', () => {
    createDefaultEv3(mockPhysics, mockRegistry, mockConfig);

    expect(ChassisWrapper).toHaveBeenCalledWith(mockPhysics, mockConfig.chassis);
    expect(Mesh).toHaveBeenCalledWith(expect.any(ChassisWrapper), mockRegistry, mockConfig.mesh);
    expect(Wheel).toHaveBeenCalledTimes(4);
    expect(Motor).toHaveBeenCalledTimes(2);
    expect(ColorSensor).toHaveBeenCalledWith(expect.any(ChassisWrapper), mockPhysics, mockConfig.colorSensor);
    expect(UltrasonicSensor).toHaveBeenCalledWith(expect.any(ChassisWrapper), mockPhysics, mockConfig.ultrasonicSensor);

    expect(ControllerMap).toHaveBeenCalled();
  });
});
