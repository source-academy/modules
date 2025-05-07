import { Physics, Renderer, ControllerMap } from '../../../../../engine';
import { ChassisWrapper } from '../../../../ev3/components/Chassis';
import { Mesh } from '../../../../ev3/components/Mesh';
import { Motor } from '../../../../ev3/components/Motor';
import { Wheel } from '../../../../ev3/components/Wheel';
import { ev3Config } from '../../../../ev3/ev3/default/config';
import { createDefaultEv3 } from '../../../../ev3/ev3/default/ev3';
import { ColorSensor } from '../../../../ev3/sensor/ColorSensor';
import { UltrasonicSensor } from '../../../../ev3/sensor/UltrasonicSensor';

jest.mock('../../../../ev3/components/Chassis', () => {
  return { ChassisWrapper: jest.fn() };
});
jest.mock('../../../../ev3/components/Mesh', () => {
  return { Mesh: jest.fn() };
});
jest.mock('../../../../ev3/components/Motor', () => {
  return { Motor: jest.fn() };
});
jest.mock('../../../../ev3/components/Wheel', () => {
  return { Wheel: jest.fn() };
});
jest.mock('../../../../ev3/sensor/ColorSensor', () => {
  return { ColorSensor: jest.fn() };
});
jest.mock('../../../../ev3/sensor/UltrasonicSensor', () => {
  return { UltrasonicSensor: jest.fn() };
});
jest.mock('../../../../../engine', () => {
  return {
    Physics: jest.fn(),
    Renderer: jest.fn(),
    ControllerMap: jest.fn().mockImplementation(() => {
      return { add: jest.fn() };
    })
  };
});

describe('createDefaultEv3', () => {
  const mockPhysics = new Physics({gravity:{x:0, y:-1, z:0}, timestep: 0.01});
  const mockRenderer = jest.fn() as unknown as Renderer;
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
