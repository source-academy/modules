/* eslint-disable @typescript-eslint/naming-convention */

import {
  program_controller_identifier,
  type Program,
} from './controllers/program/Program';

import { type Motor } from './controllers/ev3/components/Motor';
import { type ColorSensor } from './controllers/ev3/sensor/ColorSensor';
import { type UltrasonicSensor } from './controllers/ev3/sensor/UltrasonicSensor';

import { getEv3FromContext, getWorldFromContext } from './helper_functions';

type MotorFunctionReturnType = Motor | null;

// Utility
export function ev3_pause(duration: number): void {
  const world = getWorldFromContext();
  const program = world.controllers.controllers.find(
    (controller) => controller.name === program_controller_identifier,
  ) as Program;
  program.pause(duration);
}

// Motor
export function ev3_motorA(): MotorFunctionReturnType {
  const ev3 = getEv3FromContext();
  return ev3.get('leftMotor');
}

export function ev3_motorB(): MotorFunctionReturnType {
  const ev3 = getEv3FromContext();
  return ev3.get('rightMotor');
}

export function ev3_motorC(): MotorFunctionReturnType {
  return null;
}

export function ev3_motorD(): MotorFunctionReturnType {
  return null;
}

export function ev3_runToRelativePosition(
  motor: MotorFunctionReturnType,
  position: number,
  speed: number,
): void {
  if (motor === null) {
    return;
  }

  const wheelDiameter = 0.0575;

  const speedInMetersPerSecond = (speed / 360) * Math.PI * wheelDiameter;

  const distanceInMetersPerSecond = (position / 360) * Math.PI * wheelDiameter;

  motor.setSpeedDistance(speedInMetersPerSecond, distanceInMetersPerSecond);
}

// Color Sensor

export function ev3_colorSensor() {
  const ev3 = getEv3FromContext();
  return ev3.get('colorSensor');
}

export function ev3_colorSensorRed(colorSensor: ColorSensor) {
  return colorSensor.sense().r;
}

export function ev3_colorSensorGreen(colorSensor: ColorSensor) {
  return colorSensor.sense().g;
}

export function ev3_colorSensorBlue(colorSensor: ColorSensor) {
  return colorSensor.sense().b;
}

// Ultrasonic Sensor

export function ev3_ultrasonicSensor() {
  const ev3 = getEv3FromContext();
  return ev3.get('ultrasonicSensor');
}

export function ev3_ultrasonicSensorDistance(
  ultraSonicSensor: UltrasonicSensor,
): number {
  return ultraSonicSensor.sense();
}
