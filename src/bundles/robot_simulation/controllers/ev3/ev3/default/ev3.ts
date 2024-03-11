import { type Physics, type Renderer, ControllerMap } from '../../../../engine';

import { ChassisWrapper } from '../../components/Chassis';
import { Mesh } from '../../components/Mesh';
import { Wheel, type WheelConfig } from '../../components/Wheel';
import { Motor, type MotorConfig } from '../../components/Motor';
import { ColorSensor } from '../../sensor/ColorSensor';
import { UltrasonicSensor } from '../../sensor/UltrasonicSensor';

import {
  wheelNames,
  motorNames,
  type DefaultEv3Controller,
  type Ev3Config,
  type WheelControllers,
  type MotorControllers,
} from './types';

export type DefaultEv3 = ControllerMap<DefaultEv3Controller>;

export const createDefaultEv3 = (
  physics: Physics,
  render: Renderer,
  config: Ev3Config,
): DefaultEv3 => {
  const chassis = new ChassisWrapper(physics, render, config.chassis);
  const mesh = new Mesh(chassis, render, config.mesh);

  const wheelControllers = wheelNames.reduce((acc, name) => {
    const displacement = config.wheels.displacements[name];
    const wheelConfig: WheelConfig = {
      ...config.wheels.config,
      displacement,
    };
    const wheel = new Wheel(chassis, physics, render, wheelConfig);
    return {
      ...acc,
      [name]: wheel,
    };
  }, {} as WheelControllers);

  // Motors
  const motorControllers = motorNames.reduce((acc, name) => {
    const displacement = config.motors.displacements[name];
    const motorConfig: MotorConfig = {
      ...config.motors.config,
      displacement,
    };
    const motor = new Motor(chassis, physics, render, motorConfig);
    return {
      ...acc,
      [name]: motor,
    };
  }, {} as MotorControllers);

  // Sensors
  const colorSensor = new ColorSensor(chassis, render, config.colorSensor);

  const ultrasonicSensor = new UltrasonicSensor(
    chassis,
    physics,
    render,
    config.ultrasonicSensor,
  );

  const ev3: DefaultEv3 = new ControllerMap<DefaultEv3Controller>({
    ...wheelControllers,
    ...motorControllers,
    colorSensor,
    ultrasonicSensor,
    mesh,
    chassis,
  });

  return ev3;
};
