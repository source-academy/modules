import { type PhysicsObject } from '../../primitives/physics_object';
import { type Vector } from '../../primitives/cachedVector';
import { type Steppable } from '../../types';


export class UltrasonicSensor implements Steppable {
  physicsObject: PhysicsObject;
  displacement: Vector;
  direction:Vector;

  constructor(physicsObject: PhysicsObject, displacement: Vector, direction: Vector) {
    this.physicsObject = physicsObject;
    this.displacement = displacement;
    this.direction = direction;
  }


  step(timstamp: number):void {

  }
}
