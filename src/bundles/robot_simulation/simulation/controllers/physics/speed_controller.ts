import { type PhysicsObject } from '../../primitives/physics_object';
import { vec3 } from './helpers';
import { type Vector } from './types';

export class SpeedController {
  physicsObject: PhysicsObject;
  displacement: Vector;
  time:number;

  speed: number;
  endTime:number;

  displacementVector:THREE.Vector3;
  targetVelocity: THREE.Vector3;


  constructor(physicsObject: PhysicsObject, displacement: Vector) {
    this.physicsObject = physicsObject;
    this.displacement = displacement;
    this.speed = 0;
    this.endTime = Infinity;
    this.time = 0;

    this.displacementVector = vec3(this.displacement);
    this.targetVelocity = vec3({
      x: 0,
      y: 0,
      z: this.speed,
    });
  }


  setSpeed(speed: number, duration: number) {
    this.speed = speed;
    this.endTime = this.time + duration;
  }

  step(timestamp: number) {
    console.log(this.speed, this.endTime, this.time);
    this.time = timestamp;
    if (this.time > this.endTime) {
      console.log('UNSET SPEED');
      this.speed = 0;
      this.endTime = Infinity;
    }

    this.displacementVector.copy(this.displacement as THREE.Vector3);
    this.targetVelocity.copy({
      x: 0,
      y: 0,
      z: this.speed,
    } as THREE.Vector3);

    const worldVelocity = this.physicsObject.worldVelocity(this.displacementVector.clone());
    const velocityDelta = this.physicsObject.worldDirection(this.targetVelocity.clone())
      .sub(worldVelocity);


    const impulse = velocityDelta.multiplyScalar(this.physicsObject.getMass() / 50);

    this.physicsObject.getRigidBody()
      .applyImpulseAtPoint(impulse, this.physicsObject.worldTranslation(this.displacementVector.clone()), true);
  }
}
