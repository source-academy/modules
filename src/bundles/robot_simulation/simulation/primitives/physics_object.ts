import Rapier, { type Vector3 } from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { RAPIER } from '../controllers/physics/physics_controller';

import { instance } from '../world';
import { nullVector, quat, vec3 } from '../controllers/physics/helpers';

type PhysicsObjectCache = {
  rotation?: THREE.Quaternion;
  linearVelocity?: THREE.Vector3;
  translation?: THREE.Vector3;
  worldVelocity?: THREE.Vector3;
  angularVelocity?: THREE.Vector3;
};


export class PhysicsObject {
  #rigidBody: Rapier.RigidBody;
  #mesh: THREE.Mesh;
  #collider: Rapier.Collider;
  #cache: PhysicsObjectCache = {};

  constructor(
    mesh: THREE.Mesh,
    rigidBody: Rapier.RigidBody,
    collider: Rapier.Collider,
  ) {
    this.#rigidBody = rigidBody;
    this.#mesh = mesh;
    this.#collider = collider;
  }

  getRigidBody() {
    return this.#rigidBody;
  }

  setMass(mass: number) {
    this.#collider.setMass(mass);
  }

  getMass():number {
    return this.#collider.mass();
  }

  removeForcesAndTorques() {
    this.#rigidBody.resetForces(true);
    this.#rigidBody.resetTorques(true);
  }

  rotation(): THREE.Quaternion {
    if (this.#cache.rotation) {
      return this.#cache.rotation;
    }
    this.#cache.rotation = quat(this.#rigidBody.rotation());
    return this.#cache.rotation;
  }

  velocity(): THREE.Vector3 {
    if (this.#cache.linearVelocity) {
      return this.#cache.linearVelocity;
    }
    this.#cache.linearVelocity = vec3(this.#rigidBody.linvel());
    return this.#cache.linearVelocity;
  }

  angularVelocity(): THREE.Vector3 {
    if (this.#cache.angularVelocity) {
      return this.#cache.angularVelocity;
    }
    this.#cache.angularVelocity = vec3(this.#rigidBody.angvel());
    return this.#cache.angularVelocity;
  }

  translation(): THREE.Vector3 {
    if (this.#cache.translation) {
      return this.#cache.translation;
    }
    this.#cache.translation = vec3(this.#rigidBody.translation());
    return this.#cache.translation;
  }

  invalidateCache() {
    this.#cache = {};
  }

  worldTranslation(localTranslation: THREE.Vector3 = nullVector.THREE): THREE.Vector3 {
    const rotation = this.rotation();
    const translation = this.translation();

    return localTranslation.applyQuaternion(rotation)
      .add(translation);
  }

  worldDirection(localDirection: THREE.Vector3): THREE.Vector3 {
    const rotation = this.rotation();

    return localDirection.applyQuaternion(rotation);
  }

  distanceVectorOfPointToRotationalAxis(localPoint: THREE.Vector3 = nullVector.THREE) {
    // TODO: Rewrite this such that it doesn't use clone()!

    return localPoint.clone()
      .projectOnVector(this.angularVelocity())
      .negate()
      .add(localPoint);
  }

  tangentialVelocityOfPoint(localPoint: THREE.Vector3 = nullVector.THREE): THREE.Vector3 {
    const distanceVector = this.distanceVectorOfPointToRotationalAxis(localPoint);
    const angularVelocity = this.angularVelocity();
    const velocityMagnitude = distanceVector.length() * angularVelocity.length();

    const tangentialVelocity = this.worldDirection(localPoint)
      .cross(angularVelocity)
      .negate()
      .normalize()
      .multiplyScalar(velocityMagnitude);

    return tangentialVelocity;
  }


  worldVelocity(localPoint: THREE.Vector3 = nullVector.THREE): THREE.Vector3 {
    return this.tangentialVelocityOfPoint(localPoint)
      .add(this.velocity());
  }

  addForce(force: Vector3, point: Vector3 = nullVector.RAPIER) {
    return this.#rigidBody.addForceAtPoint(force, point, true);
  }

  /**
   * Syncs the mesh's position and quaternion with the physics world.
   * Usually called after a physics step
   */
  step(_: number) {
    this.#mesh.position.copy(this.#collider.translation() as THREE.Vector3);
    this.#mesh.quaternion.copy(this.#collider.rotation() as THREE.Quaternion);
    this.invalidateCache();
  }
}

type Cuboid = {
  width: number;
  height: number;
  length: number;
  position? : THREE.Vector3;
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

  const rigidBodyDesc = dynamic ? RAPIER.RigidBodyDesc.dynamic() : Rapier.RigidBodyDesc.fixed();

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
