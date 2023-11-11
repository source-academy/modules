import { type PhysicsObject } from '../../primitives/physics_object';
import { vec3 } from '../physics/helpers';

import { type Steppable } from '../../types';
import { type Vector } from '../../primitives/cachedVector';
import { instance } from '../../world';


export class MotorController implements Steppable {
  physicsObject: PhysicsObject;
  displacement: Vector;

  speed: number;
  distance: number;

  distanceTraveled: number;
  previousLocation: THREE.Vector3;

  displacementVector: THREE.Vector3;
  targetVelocity: THREE.Vector3;

  constructor(physicsObject: PhysicsObject, displacement: Vector) {
    this.physicsObject = physicsObject;
    this.displacement = displacement;
    this.speed = 0;
    this.distance = 0;

    this.displacementVector = vec3(this.displacement);
    this.targetVelocity = vec3({
      x: 0,
      y: 0,
      z: this.speed,
    });

    this.distanceTraveled = 0;
    this.previousLocation = this.physicsObject
      .worldTranslation(vec3(this.displacementVector.clone()))
      .clone();
  }

  setSpeedDistance(speed: number, distance: number) {
    this.distance = distance;
    this.speed = speed;
    console.log(distance);
    const beforeDistance = this.distanceTraveled;
    instance.setTimeout(() => {
      this.speed = 0;
      console.log(this.distanceTraveled - beforeDistance);
    }, distance / speed * 1000);
  }

  #updateDistance() {
    const worldTranslation = this.physicsObject.worldTranslation(
      this.displacementVector.clone(),
    );

    const translationDelta = worldTranslation
      .clone()
      .sub(this.previousLocation);
    this.previousLocation.copy(worldTranslation);
    translationDelta.y = 0;
    this.distanceTraveled += translationDelta.length();
  }

  step(_: number) {
    this.displacementVector.copy(this.displacement as THREE.Vector3);
    this.targetVelocity.copy({
      x: 0,
      y: 0,
      z: this.speed,
    } as THREE.Vector3);

    this.#updateDistance();

    const worldVelocity = this.physicsObject.worldVelocity(
      this.displacementVector.clone(),
    );

    const velocityDelta = this.physicsObject
      .transformDirection(this.targetVelocity.clone())
      .sub(worldVelocity);

    const impulse = velocityDelta
      .multiplyScalar(this.physicsObject.getMass() / 4)
      .projectOnPlane(
        vec3({
          x: 0,
          y: 1,
          z: 0,
        }),
      );

    this.physicsObject
      .getRigidBody()
      .applyImpulseAtPoint(
        impulse,
        this.physicsObject.worldTranslation(this.displacementVector.clone()),
        true,
      );
  }
}
