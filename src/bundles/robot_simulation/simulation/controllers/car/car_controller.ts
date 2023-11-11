import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {
  addCuboidPhysicsObject,
  type PhysicsObject,
} from '../../primitives/physics_object';

import { instance } from '../../world';
import { type Steppable } from '../../types';
import { type Vector } from '../../primitives/cachedVector';
import { MotorController } from './motor_controller';
import { WheelController } from './wheel_controller';

export type CarSettings = {
  chassis: {
    length: number;
    height: number;
    width: number;
    mass: number;
  };
  wheel: {
    restHeight: number;
    diameter: number;
    maxSuspensionLength: number;
    suspension: { stiffness: number; damping: number };
    buffer: number;
  };
  turning: { sensitivity: number };
};

export const settings: CarSettings = {
  chassis: {
    length: 0.18, // in meters
    height: 0.095, // in meters
    width: 0.145, // in meters
    mass: 0.6, // in kg
  },
  wheel: {
    restHeight: 0.03,
    diameter: 0.056,
    maxSuspensionLength: 0.1,
    suspension: {
      stiffness: 70,
      damping: 3,
    },
    buffer: 0.02,
  },
  turning: {
    sensitivity: 0.5,
  },
} as const;

const motors = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
} as const;

const motorDisplacements = [
  {
    x: 0.058,
    y: 0,
    z: 0.055,
  },
  {
    x: -0.058,
    y: 0,
    z: 0.055,
  },
];

export type MotorsOptions = (typeof motors)[keyof typeof motors];

export class CarController implements Steppable {
  carSettings: CarSettings;
  chassis: PhysicsObject | null;
  wheelDisplacements: Vector[];

  wheels: WheelController[];
  leftMotor: MotorController | null;
  rightMotor: MotorController | null;

  constructor(carSettings: CarSettings) {
    this.carSettings = carSettings;
    this.chassis = null;
    this.rightMotor = null;
    this.leftMotor = null;
    this.wheels = [];
    this.wheelDisplacements = this.#getWheelDisplacements();
  }

  init() {
    this.chassis = this.#createChassis();
    this.#createWheels(this.chassis);
    this.rightMotor = new MotorController(
      this.chassis,
      motorDisplacements[0],
    );
    this.leftMotor = new MotorController(
      this.chassis,
      motorDisplacements[1],
    );
  }

  #createChassis() {
    const { width, height, length, mass } = this.carSettings.chassis;

    const chassis = addCuboidPhysicsObject({
      width,
      height,
      length,
      position: new THREE.Vector3(0, 0.5564785599708557, 0),
    });

    chassis.setMass(mass);

    return chassis;
  }

  #createWheels(chassis: PhysicsObject) {
    const wheelDisplacements = this.wheelDisplacements;
    this.wheels = wheelDisplacements.map(
      (d) => new WheelController(d, chassis, this.carSettings),
    );
  }

  #getWheelDisplacements() {
    const { width, length } = this.carSettings.chassis;
    const buffer = this.carSettings.wheel.buffer;

    return [
      {
        x: width / 2 + buffer,
        y: 0,
        z: length / 2,
      },
      {
        x: -(width / 2 + buffer),
        y: 0,
        z: length / 2,
      },
      {
        x: width / 2 + buffer,
        y: 0,
        z: -length / 2,
      },
      {
        x: -(width / 2 + buffer),
        y: 0,
        z: -length / 2,
      },
    ];
  }

  #getMotor(motor: MotorsOptions): MotorController | null {
    const motorMapping: Record<MotorsOptions, MotorController | null> = {
      0: null,
      1: this.leftMotor,
      2: this.rightMotor,
      3: null,
    };

    return motorMapping[motor];
  }

  // EV3 Functions
  motorA(): MotorsOptions {
    return motors.A;
  }

  motorB(): MotorsOptions {
    return motors.B;
  }

  motorC(): MotorsOptions {
    return motors.C;
  }

  motorD(): MotorsOptions {
    return motors.D;
  }

  /**
   *
   * @param motor
   * @param position in degrees
   * @param speed in degrees per second
   */
  runToRelativePosition(motor: MotorsOptions, position: number, speed: number) {
    const selectedMotor = this.#getMotor(motor);
    if (!selectedMotor) {
      return;
    }

    const speedInMetersPerSecond
      = (speed / 360) * Math.PI * this.carSettings.wheel.diameter;
    const distanceInMetersPerSecond
      = (position / 360) * Math.PI * this.carSettings.wheel.diameter;

    selectedMotor!.setSpeedDistance(
      speedInMetersPerSecond,
      distanceInMetersPerSecond,
    );
  }

  motorGetSpeed(motor: MotorsOptions) {
    const selectedMotor = this.#getMotor(motor);
    if (!selectedMotor) {
      return 0;
    }
    return selectedMotor!.speed;
  }

  pause(time: number) {
    instance.pauseProgramController(time);
  }

  step(timestamp: number) {
    this.chassis!.removeForcesAndTorques();
    this.wheels.forEach((wheel) => {
      wheel.step();
    });
    this.leftMotor!.step(timestamp);
    this.rightMotor!.step(timestamp);
  }
}
