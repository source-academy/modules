import * as THREE from 'three';
import {
  addCuboidPhysicsObject,
  type PhysicsObject,
} from '../primitives/physics_object';
import { type Vector } from './physics/types';
import { type Ray } from '@dimforge/rapier3d-compat';
import { RAPIER } from './physics/physics_controller';
import { nullVector } from './physics/helpers';
import { vec3 } from '../controllers/physics/helpers';
import { instance } from '../world';
import { SpeedController } from './physics/speed_controller';

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

class Wheel {
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

export class CarController {
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

  runToRelativePosition(motor:number, position:number, speed:number) {
    console.log('RUN TO RELATIVE POSITION', motor, position, speed);
    const selectedMotor = motor === 0 ? this.leftMotor : this.rightMotor;
    const time = Math.abs(position / speed) * 1000;
    selectedMotor!.setSpeed(speed, time);
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

  step(timestamp: number) {
    this.chassis!.removeForcesAndTorques();
    this.wheels.forEach((wheel) => {
      wheel.step();
    });
    this.leftMotor!.step(timestamp);
    this.rightMotor!.step(timestamp);
  }
}
