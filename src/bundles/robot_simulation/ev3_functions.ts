/* eslint-disable @typescript-eslint/naming-convention */

import { type Motor } from './controllers/ev3/components/Motor';
import { motorConfig } from './controllers/ev3/ev3/default/config';
import { type ColorSensor } from './controllers/ev3/sensor/ColorSensor';
import { type UltrasonicSensor } from './controllers/ev3/sensor/UltrasonicSensor';
import {
  program_controller_identifier,
  type Program,
} from './controllers/program/Program';

import { getEv3FromContext, getWorldFromContext } from './helper_functions';

type MotorFunctionReturnType = Motor | null;

/**
 * @categoryDescription EV3
 * These functions are mocking the the normal EV3 functions found
 * at https://docs.sourceacademy.org/EV3/global.html
 * @module robot_simulation
 */

/**
 * Pauses for a period of time.
 *
 * @param duration The time to wait, in milliseconds.
 *
 * @category EV3
 */
export function ev3_pause(duration: number): void {
  const world = getWorldFromContext();
  const program = world.controllers.controllers.find(
    (controller) => controller.name === program_controller_identifier
  ) as Program;
  program.pause(duration);
}

/**
 * Gets the motor connected to port A.
 *
 * @returns The motor connected to port A
 *
 * @category EV3
 */
export function ev3_motorA(): MotorFunctionReturnType {
  const ev3 = getEv3FromContext();
  return ev3.get('leftMotor');
}

/**
 * Gets the motor connected to port B.
 *
 * @returns The motor connected to port B
 *
 * @category EV3
 */
export function ev3_motorB(): MotorFunctionReturnType {
  const ev3 = getEv3FromContext();
  return ev3.get('rightMotor');
}

/**
 * Gets the motor connected to port C.
 *
 * @returns The motor connected to port C
 *
 * @category EV3
 */
export function ev3_motorC(): MotorFunctionReturnType {
  return null;
}

/**
 * Gets the motor connected to port D.
 *
 * @returns The motor connected to port D
 *
 * @category EV3
 */
export function ev3_motorD(): MotorFunctionReturnType {
  return null;
}

/**
 * Causes the motor to rotate until the position reaches ev3_motorGetPosition() + position with the given speed.
 * Note: this works by sending instructions to the motors.
 * This will return almost immediately, without waiting for the motor to reach the given absolute position.
 * If you wish to wait, use ev3_pause.
 *
 * @param motor The motor
 * @param position The amount to turn
 * @param speed The speed to run at, in tacho counts per second
 *
 * @category EV3
 */
export function ev3_runToRelativePosition(
  motor: MotorFunctionReturnType,
  position: number,
  speed: number
): void {
  if (motor === null) {
    return;
  }

  const wheelDiameter = motorConfig.config.mesh.dimension.height;
  const speedInMetersPerSecond = (speed / 360) * Math.PI * wheelDiameter;
  const distanceInMetersPerSecond = (position / 360) * Math.PI * wheelDiameter;

  motor.setSpeedDistance(speedInMetersPerSecond, distanceInMetersPerSecond);
}

/**
 * Causes the motor to rotate for a specified duration at the specified speed.
 *
 * Note: this works by sending instructions to the motors. This will return almost immediately,
 * without waiting for the motor to actually run for the specified duration.
 * If you wish to wait, use ev3_pause.
 *
 * @param motor
 * @param time
 * @param speed
 * @returns void
 *
 * @category EV3
 */
export function ev3_runForTime(
  motor: MotorFunctionReturnType,
  time: number,
  speed: number
) {
  if (motor === null) {
    return;
  }
  const wheelDiameter = motorConfig.config.mesh.dimension.height;
  const speedInMetersPerSecond = (speed / 360) * Math.PI * wheelDiameter;
  const distanceInMetersPerSecond = speedInMetersPerSecond * time;

  motor.setSpeedDistance(speedInMetersPerSecond, distanceInMetersPerSecond);
}

/**
 * Gets the motor's current speed, in tacho counts per second.
 *
 * Returns 0 if the motor is not connected.
 *
 * @param motor
 * @returns number
 *
 * @category EV3
 */
export function ev3_motorGetSpeed(motor: MotorFunctionReturnType): number {
  if (motor === null) {
    return 0;
  }

  return motor.motorVelocity;
}

/**
 * Gets the colour sensor connected any of ports 1, 2, 3 or 4.
 *
 * @returns The colour sensor
 *
 * @category EV3
 */
export function ev3_colorSensor() {
  const ev3 = getEv3FromContext();
  return ev3.get('colorSensor');
}

/**
 * Gets the amount of red seen by the colour sensor.
 *
 * @param colorSensor The color sensor
 * @returns The amount of blue, in sensor-specific units.
 *
 * @category EV3
 */
export function ev3_colorSensorRed(colorSensor: ColorSensor) {
  return colorSensor.sense().r;
}

/**
 * Gets the amount of green seen by the colour sensor.
 *
 * @param colorSensor The color sensor
 * @returns The amount of green, in sensor-specific units.
 *
 * @category EV3
 */
export function ev3_colorSensorGreen(colorSensor: ColorSensor) {
  return colorSensor.sense().g;
}

/**
 * Gets the amount of blue seen by the colour sensor.
 *
 * @param colorSensor The color sensor
 * @returns The amount of blue, in sensor-specific units.
 *
 * @category EV3
 */
export function ev3_colorSensorBlue(colorSensor: ColorSensor) {
  return colorSensor.sense().b;
}

/**
 * Gets the ultrasonic sensor connected any of ports 1, 2, 3 or 4.
 *
 * @returns The ultrasonic sensor
 *
 * @category EV3
 */
export function ev3_ultrasonicSensor() {
  const ev3 = getEv3FromContext();
  return ev3.get('ultrasonicSensor');
}
/**
 * Gets the distance read by the ultrasonic sensor in centimeters.
 *
 * @param ultraSonicSensor The ultrasonic sensor
 * @returns The distance, in centimeters.
 *
 * @category EV3
 */
export function ev3_ultrasonicSensorDistance(
  ultraSonicSensor: UltrasonicSensor
): number {
  return ultraSonicSensor.sense();
}

/**
 * Checks if the peripheral is connected.
 *
 * @param obj The peripheral to check.
 * @returns boolean
 *
 * @category EV3
 */
export function ev3_connected(obj: any) {
  return obj !== null;
}
