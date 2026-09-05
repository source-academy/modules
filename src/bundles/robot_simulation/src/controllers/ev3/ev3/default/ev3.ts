import { ControllerMap, type Physics } from '../../../../engine';
import type { SceneRegistry } from '../../../../engine/Render/SceneRegistry';

import { ChassisWrapper } from '../../components/Chassis';
import { Mesh } from '../../components/Mesh';
import { Motor, type MotorConfig } from '../../components/Motor';
import { Wheel, type WheelConfig } from '../../components/Wheel';
import { ColorSensor } from '../../sensor/ColorSensor';
import { UltrasonicSensor } from '../../sensor/UltrasonicSensor';

import {
  motorNames,
  wheelNames,
  type DefaultEv3Controller,
  type Ev3Config,
  type MotorControllers,
  type WheelControllers,
} from './types';

export type DefaultEv3 = ControllerMap<DefaultEv3Controller>;

export const createDefaultEv3 = (
  physics: Physics,
  registry: SceneRegistry,
  config: Ev3Config,
): DefaultEv3 => {
  const chassis = new ChassisWrapper(physics, config.chassis);
  const mesh = new Mesh(chassis, registry, config.mesh);

  const wheelControllers = wheelNames.reduce((acc, name) => {
    const displacement = config.wheels.displacements[name];
    const wheelConfig: WheelConfig = {
      ...config.wheels.config,
      displacement,
    };
    const wheel = new Wheel(chassis, physics, wheelConfig);
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
    const motor = new Motor(chassis, physics, registry, motorConfig);
    return {
      ...acc,
      [name]: motor,
    };
  }, {} as MotorControllers);

  // Sensors
  const colorSensor = new ColorSensor(chassis, physics, config.colorSensor);

  const ultrasonicSensor = new UltrasonicSensor(
    chassis,
    physics,
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
