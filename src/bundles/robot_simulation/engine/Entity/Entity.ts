import type Rapier from '@dimforge/rapier3d-compat';
import type * as THREE from 'three';
import { vec3 } from '../Math/Convert';
import {
  simpleVectorLength,
  type Orientation,
  type SimpleQuaternion,
  type SimpleVector,
} from '../Math/Vector';

type EntityConfig = {
  rapierRigidBody: Rapier.RigidBody;
  rapierCollider: Rapier.Collider;
};

export class Entity {
  #rapierRigidBody: Rapier.RigidBody;
  #rapierCollider: Rapier.Collider;

  constructor(configuration: EntityConfig) {
    this.#rapierRigidBody = configuration.rapierRigidBody;
    this.#rapierCollider = configuration.rapierCollider;
  }

  getCollider(): Rapier.Collider {
    return this.#rapierCollider;
  }

  getRigidBody(): Rapier.RigidBody {
    return this.#rapierRigidBody;
  }

  getTranslation(): SimpleVector {
    return this.#rapierRigidBody.translation();
  }

  getRotation(): SimpleQuaternion {
    return this.#rapierRigidBody.rotation();
  }

  setOrientation(orientation: Orientation): void {
    this.#rapierRigidBody.setTranslation(orientation.position, true);
    this.#rapierRigidBody.setRotation(orientation.rotation, true);
  }

  setMass(mass: number): void {
    this.#rapierCollider.setMass(mass);
  }

  getMass(): number {
    return this.#rapierCollider.mass();
  }
  getVelocity(): SimpleVector {
    return this.#rapierRigidBody.linvel();
  }

  getAngularVelocity(): SimpleVector {
    return this.#rapierRigidBody.angvel();
  }

  applyImpulse(impulse: SimpleVector, point: SimpleVector): void {
    return this.#rapierRigidBody.applyImpulseAtPoint(impulse, point, true);
  }

  worldTranslation(
    localTranslation: THREE.Vector3,
  ): THREE.Vector3 {
    const rotation = this.getRotation();
    const translation = this.getTranslation();

    return localTranslation.applyQuaternion(rotation)
      .add(translation);
  }

  transformDirection(localDirection: THREE.Vector3): THREE.Vector3 {
    const rotation = this.getRotation();
    return localDirection.clone()
      .applyQuaternion(rotation);
  }

  distanceVectorOfPointToRotationalAxis(
    localPoint: THREE.Vector3,
  ): SimpleVector {
    return localPoint
      .clone()
      .projectOnVector(vec3(this.getAngularVelocity()))
      .negate()
      .add(localPoint);
  }

  /**
   * Calculates the tangential velocity of a point in a rotating system.
   * @param {THREE.Vector3} localPoint - The point for which to calculate the tangential velocity.
   * @returns {THREE.Vector3} The tangential velocity vector of the point.
   */
  tangentialVelocityOfPoint(localPoint): THREE.Vector3 {
    // Calculate the distance vector from the point to the rotational axis
    const distanceVector
      = this.distanceVectorOfPointToRotationalAxis(localPoint);

    // Retrieve the angular velocity of the system
    const angularVelocity = this.getAngularVelocity();

    // Calculate the magnitude of the tangential velocity
    const velocityMagnitude
      = simpleVectorLength(distanceVector) * simpleVectorLength(angularVelocity);

    // Calculate the tangential velocity vector
    const tangentialVelocity = this.transformDirection(localPoint)
      .cross(angularVelocity)
      .negate()
      .normalize()
      .multiplyScalar(velocityMagnitude);

    // Return the tangential velocity vector
    return tangentialVelocity;
  }

  worldVelocity(
    localPoint: THREE.Vector3,
  ): THREE.Vector3 {
    return this.tangentialVelocityOfPoint(localPoint)
      .add(this.getVelocity());
  }
}
