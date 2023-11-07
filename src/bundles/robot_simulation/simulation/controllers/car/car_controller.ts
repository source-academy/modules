import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {
  addCuboidPhysicsObject,
  type PhysicsObject,
} from '../../primitives/physics_object';
import { type Vector } from '../physics/types';
import { type Ray } from '@dimforge/rapier3d-compat';
import { RAPIER } from '../physics/physics_controller';
import { nullVector, vec3 } from '../physics/helpers';
import { SpeedController } from './speed_controller';

import { instance } from '../../world';
import { type Steppable } from '../../types';



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
    sideForceMultiplier: number;
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
    diameter: 0.055,
    maxSuspensionLength: 0.1,
    suspension: {
      stiffness: 70,
      damping: 10,
    },
    buffer: 0.02,
    sideForceMultiplier: -20,
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

export type MotorsOptions = (typeof motors)[keyof typeof motors];

class Wheel implements Steppable {
  static downDirection = {
    x: 0,
    y: -1,
    z: 0,
  };

  carSettings: CarSettings;
  displacement: Vector;
  ray: Ray;
  chassis: PhysicsObject;

  displacementVector: THREE.Vector3;
  downVector: THREE.Vector3;
  forceVector: THREE.Vector3;

  constructor(
    displacement: Vector,
    chassis: PhysicsObject,
    carSettings: CarSettings,
  ) {
    this.carSettings = carSettings;
    this.displacement = displacement;
    this.ray = new RAPIER.Ray(nullVector.RAPIER, nullVector.RAPIER);
    this.chassis = chassis;

    this.displacementVector = vec3(this.displacement);
    this.downVector = vec3(Wheel.downDirection);
    this.forceVector = vec3(nullVector.RAPIER);
  }

  step() {
    const velocityY = this.chassis.velocity().y;

    // Reset vectors for memory efficiency
    this.displacementVector.copy(this.displacement as THREE.Vector3);
    this.downVector.copy(Wheel.downDirection as THREE.Vector3);
    this.forceVector.set(0, 0, 0);

    // Convert local vectors to global/world space
    const globalDisplacement = this.chassis.worldTranslation(
      this.displacementVector,
    );
    const globalDownDirection = this.chassis.worldDirection(this.downVector);

    this.ray.origin = globalDisplacement;
    this.ray.dir = globalDownDirection;

    const result = instance.castRay(
      this.ray,
      settings.wheel.maxSuspensionLength,
    );

    if (result === null) {
      return;
    }

    const wheelDistance = result;
    const wheelSettings = this.carSettings.wheel;

    // Calculate suspension force
    const force
      = wheelSettings.suspension.stiffness
        * (wheelSettings.restHeight
          - wheelDistance
          + this.carSettings.chassis.height / 2)
      - wheelSettings.suspension.damping * velocityY;

    this.forceVector.y = force;

    // Apply force at the wheel's global displacement
    this.chassis.addForce(
      this.chassis.worldDirection(this.forceVector),
      globalDisplacement,
    );
  }
}

export class CarController implements Steppable {
  carSettings: CarSettings;
  chassis: PhysicsObject | null;
  wheelDisplacements: Vector[];

  wheels: Wheel[];
  leftMotor: SpeedController | null;
  rightMotor: SpeedController | null;

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
    this.rightMotor = new SpeedController(
      this.chassis,
      this.wheelDisplacements[0],
    );
    this.leftMotor = new SpeedController(
      this.chassis,
      this.wheelDisplacements[1],
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
      (d) => new Wheel(d, chassis, this.carSettings),
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

  #getMotor(motor: MotorsOptions): SpeedController | null {
    const motorMapping: Record<MotorsOptions, SpeedController | null> = {
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

    const tuningAmount = 3;

    const time = Math.abs(position / speed) * 1000;

    const speedInMetersPerSecond
      = (speed / 360) * Math.PI * this.carSettings.wheel.diameter * tuningAmount;

    selectedMotor!.setSpeed(speedInMetersPerSecond, time);
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
