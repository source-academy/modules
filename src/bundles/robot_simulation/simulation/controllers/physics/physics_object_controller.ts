import type Rapier from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { RAPIER } from './physics_controller';

import { instance } from '../../world';
import { quat, vec3 } from './helpers';
import { type Steppable } from '../../types';

type Orientation = {
  translation: THREE.Vector3;
  rotation: THREE.Quaternion;
};

export class PhysicsObject implements Steppable {
  #rigidBody: Rapier.RigidBody;
  #mesh: THREE.Mesh;
  #collider: Rapier.Collider;

  #previousState?: Orientation;

  constructor(
    mesh: THREE.Mesh,
    rigidBody: Rapier.RigidBody,
    collider: Rapier.Collider,
  ) {
    this.#rigidBody = rigidBody;
    this.#mesh = mesh;
    this.#collider = collider;
  }

  // This is a bypass for development.
  getRigidBody() {
    return this.#rigidBody;
  }

  setMass(mass: number) {
    this.#collider.setMass(mass);
  }

  getMass(): number {
    return this.#collider.mass();
  }

  addForce(
    force: THREE.Vector3,
    point: THREE.Vector3 = new THREE.Vector3(),
  ): void {
    return this.#rigidBody.addForceAtPoint(force, point, true);
  }

  applyImpulse(
    impulse: THREE.Vector3,
    point: THREE.Vector3 = new THREE.Vector3(),
  ) {
    return this.#rigidBody.applyImpulseAtPoint(impulse, point, true);
  }

  removeForcesAndTorques() {
    this.#rigidBody.resetForces(true);
    this.#rigidBody.resetTorques(true);
  }

  rotation(): THREE.Quaternion {
    return quat(this.#rigidBody.rotation());
  }

  velocity(): THREE.Vector3 {
    return vec3(this.#rigidBody.linvel());
  }

  angularVelocity(): THREE.Vector3 {
    return vec3(this.#rigidBody.angvel());
  }

  translation(): THREE.Vector3 {
    return vec3(this.#rigidBody.translation());
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
    return localDirection.applyQuaternion(rotation);
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

  savePreviousState() {
    this.#previousState = {
      translation: this.translation()
        .clone(),
      rotation: this.rotation()
        .clone(),
    };
  }

  getInterpolatedState(): Orientation {
    if (!this.#previousState) {
      return {
        translation: this.translation(),
        rotation: this.rotation(),
      };
    }

    const interpolationFactor = instance.getResidualTime();

    return {
      translation: this.#previousState.translation.clone()
        .lerp(this.translation(), interpolationFactor),
      rotation: this.#previousState.rotation.clone()
        .slerp(this.rotation(), interpolationFactor),
    };
  }

  /**
   * Syncs the mesh's position and quaternion with the physics world.
   * Usually called after a physics step
   */
  step(_: number) {
    const interpolatedState = this.getInterpolatedState();
    this.#mesh.position.copy(interpolatedState.translation);
    this.#mesh.quaternion.copy(interpolatedState.rotation);
  }
}

export class PhysicsObjectController implements Steppable {
  physicsObjects: Array<PhysicsObject>;

  constructor() {
    this.physicsObjects = [];
  }

  add(physicsObject: PhysicsObject) {
    this.physicsObjects.push(physicsObject);
  }

  saveLocation() {
    for (const physicsObject of this.physicsObjects) {
      physicsObject.savePreviousState();
    }
  }

  step(_) {
    for (const physicsObject of this.physicsObjects) {
      physicsObject.step(_);
    }
  }
}

type Cuboid = {
  width: number;
  height: number;
  length: number;
  position?: THREE.Vector3;
  color?: THREE.Color;
  dynamic?: boolean;
};

export const addCuboidPhysicsObject = ({
  width,
  height,
  length,
  position = new THREE.Vector3(0, 0, 0),
  color = new THREE.Color('blue'),
  dynamic = true,
}: Cuboid): PhysicsObject => {
  const geometry = new THREE.BoxGeometry(width, height, length);
  const material = new THREE.MeshPhysicalMaterial({
    color,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);

  const rigidBodyDesc = dynamic
    ? RAPIER.RigidBodyDesc.dynamic()
    : RAPIER.RigidBodyDesc.fixed();

  rigidBodyDesc.translation.x = mesh.position.x;
  rigidBodyDesc.translation.y = mesh.position.y;
  rigidBodyDesc.translation.z = mesh.position.z;

  const colliderDesc = RAPIER.ColliderDesc.cuboid(
    width / 2,
    height / 2,
    length / 2,
  );

  return instance.addRigidBody(mesh, rigidBodyDesc, colliderDesc);
};
