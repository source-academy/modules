import { type PhysicsObject } from '../../primitives/physics_object';
import { vec3 } from '../physics/helpers';
import { type Vector } from '../physics/types';

import { instance } from '../../world';
import { type Steppable } from '../../types';

export class SpeedController implements Steppable {
  physicsObject: PhysicsObject;
  displacement: Vector;

  speed: number;

  displacementVector: THREE.Vector3;
  targetVelocity: THREE.Vector3;

  constructor(physicsObject: PhysicsObject, displacement: Vector) {
    this.physicsObject = physicsObject;
    this.displacement = displacement;
    this.speed = 0;

    this.displacementVector = vec3(this.displacement);
    this.targetVelocity = vec3({
      x: 0,
      y: 0,
      z: this.speed,
    });
  }

  setSpeed(speed: number, duration: number) {
    this.speed = speed;

    instance.setTimeout(() => {
      this.speed = 0;
    }, duration);
  }

  step(_: number) {
    this.displacementVector.copy(this.displacement as THREE.Vector3);
    this.targetVelocity.copy({
      x: 0,
      y: 0,
      z: this.speed,
    } as THREE.Vector3);

    const worldVelocity = this.physicsObject.worldVelocity(
      this.displacementVector.clone(),
    );

    const velocityDelta = this.physicsObject
      .worldDirection(this.targetVelocity.clone())
      .sub(worldVelocity);

    const impulse = velocityDelta
      .multiplyScalar(this.physicsObject.getMass() / 5)
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
