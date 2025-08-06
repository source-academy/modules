import { describe, expect, it, vi } from 'vitest';

import { ControllerMap, Physics, Renderer } from '../../../../../engine';
import { ChassisWrapper } from '../../../../ev3/components/Chassis';
import { Mesh } from '../../../../ev3/components/Mesh';
import { Motor } from '../../../../ev3/components/Motor';
import { Wheel } from '../../../../ev3/components/Wheel';
import { ev3Config } from '../../../../ev3/ev3/default/config';
import { createDefaultEv3 } from '../../../../ev3/ev3/default/ev3';
import { ColorSensor } from '../../../../ev3/sensor/ColorSensor';
import { UltrasonicSensor } from '../../../../ev3/sensor/UltrasonicSensor';

vi.mock(import('../../../../ev3/components/Chassis'), () => {
  return { ChassisWrapper: vi.fn() };
});
vi.mock(import('../../../../ev3/components/Mesh'), () => {
  return { Mesh: vi.fn() };
});
vi.mock(import('../../../../ev3/components/Motor'), () => {
  return { Motor: vi.fn() };
});
vi.mock(import('../../../../ev3/components/Wheel'), () => {
  return { Wheel: vi.fn() };
});
vi.mock(import('../../../../ev3/sensor/ColorSensor'), () => {
  return { ColorSensor: vi.fn() };
});
vi.mock(import('../../../../ev3/sensor/UltrasonicSensor'), () => {
  return { UltrasonicSensor: vi.fn() };
});
vi.mock(import('../../../../../engine'), () => {
  return {
    Physics: vi.fn(),
    Renderer: vi.fn(),
    ControllerMap: vi.fn().mockImplementation(() => {
      return { add: vi.fn() };
    })
  } as any;
});

describe('createDefaultEv3', () => {
  const mockPhysics = new Physics({ gravity:{ x:0, y:-1, z:0 }, timestep: 0.01 });
  const mockRenderer = vi.fn() as unknown as Renderer;
  const mockConfig =ev3Config;

  it('should correctly create all components and return a controller map', () => {
    createDefaultEv3(mockPhysics, mockRenderer, mockConfig);

    expect(ChassisWrapper).toHaveBeenCalledWith(mockPhysics, mockRenderer, mockConfig.chassis);
    expect(Mesh).toHaveBeenCalledWith(expect.any(ChassisWrapper), mockRenderer, mockConfig.mesh);
    expect(Wheel).toHaveBeenCalledTimes(4);
    expect(Motor).toHaveBeenCalledTimes(2);
    expect(ColorSensor).toHaveBeenCalledWith(expect.any(ChassisWrapper), mockRenderer, mockConfig.colorSensor);
    expect(UltrasonicSensor).toHaveBeenCalledWith(expect.any(ChassisWrapper), mockPhysics, mockRenderer, mockConfig.ultrasonicSensor);

    expect(ControllerMap).toHaveBeenCalled();
  });
});
