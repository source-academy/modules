import type { Motor } from './controllers/ev3/components/Motor';
import { motorConfig } from './controllers/ev3/ev3/default/config';
import type { DefaultEv3 } from './controllers/ev3/ev3/default/ev3';
import type { ColorSensor } from './controllers/ev3/sensor/ColorSensor';
import type { UltrasonicSensor } from './controllers/ev3/sensor/UltrasonicSensor';
import {
  program_controller_identifier,
  type Program,
} from './controllers/program/Program';
import type { World } from './engine/World';

type MotorFunctionReturnType = Motor | null;

/**
 * @categoryDescription EV3
 * These functions are mocking the the normal EV3 functions found
 * at https://docs.sourceacademy.org/EV3/global.html
 * @module robot_simulation
 */

/**
 * The `ev3_*` API needs to be reachable from two entirely different call paths:
 *
 *  - As ordinary `BaseModulePlugin` methods, when the *setup* program (any Conductor language -
 *    Source, Python, Scheme) calls them directly. Those go through `TypedValue`/`opaque_get`
 *    wrapping (see index.ts).
 *  - As plain synchronous native builtins, when the robot's *control* program (a `Program`
 *    controller's own private shadow CSE machine - see pythonRuntime.ts) calls them. That machine
 *    is not driven through Conductor's evaluator at all, so it needs the exact same underlying
 *    logic as a bare, synchronous function.
 *
 * Both paths need to read/write the *same* world/ev3 instance for one running program, which -
 * now that this bundle is a plugin instance rather than a `context.moduleContexts` singleton -
 * lives on that plugin instance. Rather than duplicate the logic once per call path, this factory
 * takes small accessors for "the current world" / "the current ev3" and returns bound functions
 * both call paths can share unchanged.
 */
export function createEv3Functions(deps: {
  getWorld: () => World;
  getEv3: () => DefaultEv3;
}) {
  const { getWorld, getEv3 } = deps;

  return {
    /**
     * Pauses for a period of time.
     * @param duration The time to wait, in milliseconds.
     */
    ev3_pause(duration: number): void {
      const world = getWorld();
      const program = world.controllers.controllers.find((controller) => controller.name === program_controller_identifier) as Program;
      program.pause(duration);
    },

    /** Gets the motor connected to port A. */
    ev3_motorA(): MotorFunctionReturnType {
      return getEv3().get('leftMotor');
    },

    /** Gets the motor connected to port B. */
    ev3_motorB(): MotorFunctionReturnType {
      return getEv3().get('rightMotor');
    },

    /** Gets the motor connected to port C. */
    ev3_motorC(): MotorFunctionReturnType {
      return null;
    },

    /** Gets the motor connected to port D. */
    ev3_motorD(): MotorFunctionReturnType {
      return null;
    },

    /**
     * Causes the motor to rotate until the position reaches ev3_motorGetPosition() + position
     * with the given speed. Note: this works by sending instructions to the motors. This will
     * return almost immediately, without waiting for the motor to reach the given absolute
     * position. If you wish to wait, use ev3_pause.
     */
    ev3_runToRelativePosition(
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
    },

    /** Gets the colour sensor connected any of ports 1, 2, 3 or 4. */
    ev3_colorSensor(): ColorSensor {
      return getEv3().get('colorSensor');
    },

    /** Gets the amount of red seen by the colour sensor. */
    ev3_colorSensorRed(colorSensor: ColorSensor): number {
      return colorSensor.sense().r;
    },

    /** Gets the amount of green seen by the colour sensor. */
    ev3_colorSensorGreen(colorSensor: ColorSensor): number {
      return colorSensor.sense().g;
    },

    /** Gets the amount of blue seen by the colour sensor. */
    ev3_colorSensorBlue(colorSensor: ColorSensor): number {
      return colorSensor.sense().b;
    },

    /** Gets the ultrasonic sensor connected any of ports 1, 2, 3 or 4. */
    ev3_ultrasonicSensor(): UltrasonicSensor {
      return getEv3().get('ultrasonicSensor');
    },

    /** Gets the distance read by the ultrasonic sensor in centimeters. */
    ev3_ultrasonicSensorDistance(ultraSonicSensor: UltrasonicSensor): number {
      return ultraSonicSensor.sense();
    },

    /** Checks if the peripheral is connected. */
    ev3_connected(obj: unknown): boolean {
      return obj !== null;
    },
  };
}

export type Ev3Functions = ReturnType<typeof createEv3Functions>;
