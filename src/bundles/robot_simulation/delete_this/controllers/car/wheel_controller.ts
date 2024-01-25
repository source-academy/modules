import { Vector3, type Ray } from '@dimforge/rapier3d-compat';
import { type Steppable } from '../../types';
import { type CarSettings } from './car_controller';
import { type PhysicsObject } from '../physics/physics_object_controller';
import { RAPIER } from '../physics/physics_controller';
import { vec3, type Vector } from '../physics/helpers';
import { instance } from '../../world';
import type * as THREE from 'three';
import { NumberPidController } from './pid_controller';

export class WheelController implements Steppable {
  pidController: NumberPidController;

  carSettings: CarSettings;
  displacement: Vector;
  ray: Ray;
  chassis: PhysicsObject;

  displacementVector: THREE.Vector3;
  downVector: THREE.Vector3;

  constructor(
    displacement: Vector,
    chassis: PhysicsObject,
    carSettings: CarSettings,
  ) {
    this.carSettings = carSettings;
    this.displacement = displacement;
    this.ray = new RAPIER.Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    this.chassis = chassis;

    this.displacementVector = vec3(this.displacement);
    this.downVector = vec3({
      x: 0,
      y: -1,
      z: 0,
    });
    this.pidController = new NumberPidController({
      proportionalGain: 0.7,
      derivativeGain: 3,
      integralGain: 0.002,
    });
  }

  step() {
    const wheelSettings = this.carSettings.wheel;

    const globalDisplacement = this.chassis.worldTranslation(
      this.displacementVector.clone(),
    );
    const globalDownDirection = this.chassis.transformDirection(this.downVector.clone());

    this.ray.origin = globalDisplacement;
    this.ray.dir = globalDownDirection;

    const result = instance.castRay(this.ray, wheelSettings.maxSuspensionLength);

    // Wheels are not touching the ground
    if (result === null) {
      return;
    }

    const { distance: wheelDistance, normal } = result;
    const error = this.pidController.calculate(wheelDistance, wheelSettings.restHeight + this.carSettings.chassis.height / 2);

    const force = vec3(normal)
      .normalize()
      .multiplyScalar(error * this.chassis.getMass());

    this.chassis.applyImpulse(
      force,
      globalDisplacement,
    );
  }
}
