import * as THREE from 'three';
import type Rapier from '@dimforge/rapier3d-compat';
import { type Orientation, type SimpleQuaternion, type SimpleVector } from '../Math/Vector';
import { vec3, quat } from '../Math/Convert';

type BodyConfiguration = {
  rapierRigidBody: Rapier.RigidBody;
  rapierCollider: Rapier.Collider;
};

export class Entity {
  #rapierRigidBody: Rapier.RigidBody;
  #rapierCollider: Rapier.Collider;

  constructor(configuration: BodyConfiguration) {
    this.#rapierRigidBody = configuration.rapierRigidBody;
    this.#rapierCollider = configuration.rapierCollider;
  }

  getCollider(): Rapier.Collider {
    return this.#rapierCollider;
  }

  getRigidBody(): Rapier.RigidBody {
    return this.#rapierRigidBody;
  }

  getPosition(): SimpleVector {
    return this.#rapierRigidBody.translation();
  }

  getRotation(): SimpleQuaternion {
    return this.#rapierRigidBody.rotation();
  }

  setOrientation(orientation: Orientation) {
    this.#rapierRigidBody.setTranslation(orientation.position, true);
    this.#rapierRigidBody.setRotation(orientation.rotation, true);
  }

  setMass(mass: number) {
    this.#rapierCollider.setMass(mass);
  }

  getMass(): number {
    return this.#rapierCollider.mass();
  }

  applyImpulse(
    impulse: THREE.Vector3,
    point: THREE.Vector3 = new THREE.Vector3(),
  ) {
    return this.#rapierRigidBody.applyImpulseAtPoint(impulse, point, true);
  }

  rotation(): THREE.Quaternion {
    return quat(this.#rapierRigidBody.rotation());
  }

  velocity(): THREE.Vector3 {
    return vec3(this.#rapierRigidBody.linvel());
  }

  angularVelocity(): THREE.Vector3 {
    return vec3(this.#rapierRigidBody.angvel());
  }

  translation(): THREE.Vector3 {
    return vec3(this.#rapierRigidBody.translation());
  }

  worldTranslation(
    localTranslation: THREE.Vector3 = new THREE.Vector3(),
  ): THREE.Vector3 {
    const rotation = this.rotation();
    const translation = this.translation();

    return localTranslation.applyQuaternion(rotation)
      .add(translation);
  }

  transformDirection(localDirection: THREE.Vector3): THREE.Vector3 {
    const rotation = this.rotation();
    return localDirection.clone()
      .applyQuaternion(rotation);
  }

  distanceVectorOfPointToRotationalAxis(
    localPoint: THREE.Vector3 = new THREE.Vector3(),
  ) {
    return localPoint
      .clone()
      .projectOnVector(this.angularVelocity())
      .negate()
      .add(localPoint);
  }

  /**
   * Calculates the tangential velocity of a point in a rotating system.
   * @param {THREE.Vector3} localPoint - The point for which to calculate the tangential velocity.
   * @returns {THREE.Vector3} The tangential velocity vector of the point.
   */
  tangentialVelocityOfPoint(localPoint = new THREE.Vector3()): THREE.Vector3 {
    // Calculate the distance vector from the point to the rotational axis
    const distanceVector
      = this.distanceVectorOfPointToRotationalAxis(localPoint);

    // Retrieve the angular velocity of the system
    const angularVelocity = this.angularVelocity();

    // Calculate the magnitude of the tangential velocity
    const velocityMagnitude
      = distanceVector.length() * angularVelocity.length();

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
    localPoint: THREE.Vector3 = new THREE.Vector3(),
  ): THREE.Vector3 {
    return this.tangentialVelocityOfPoint(localPoint)
      .add(this.velocity());
  }
}
