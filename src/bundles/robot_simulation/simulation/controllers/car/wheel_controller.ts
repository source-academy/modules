import { type Ray } from '@dimforge/rapier3d-compat';
import { type Vector } from '../../primitives/cachedVector';
import { type Steppable } from '../../types';
import { type CarSettings } from './car_controller';
import { type PhysicsObject } from '../../primitives/physics_object';
import { RAPIER } from '../physics/physics_controller';
import { nullVector, vec3 } from '../physics/helpers';
import { instance } from '../../world';

export class WheelController implements Steppable {
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
    this.downVector = vec3(WheelController.downDirection);
    this.forceVector = vec3(nullVector.RAPIER);
  }

  step() {
    // Reset vectors for memory efficiency
    this.displacementVector.copy(this.displacement as THREE.Vector3);
    this.downVector.copy(WheelController.downDirection as THREE.Vector3);
    this.forceVector.set(0, 0, 0);

    const velocityY = this.chassis.worldVelocity(this.displacementVector.clone()).y;

    // Convert local vectors to global/world space
    const globalDisplacement = this.chassis.worldTranslation(
      this.displacementVector,
    );
    const globalDownDirection = this.chassis.transformDirection(this.downVector);

    this.ray.origin = globalDisplacement;
    this.ray.dir = globalDownDirection;

    const result = instance.castRay(
      this.ray,
      this.carSettings.wheel.maxSuspensionLength,
    );

    // Wheels are not touching the ground
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
      this.chassis.transformDirection(this.forceVector),
      globalDisplacement,
    );
  }
}
