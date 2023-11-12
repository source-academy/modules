import { type PhysicsObject } from '../physics/physics_object_controller';
import { type Vector } from '../../primitives/cachedVector';


export class UltrasonicSensor {
  physicsObject: PhysicsObject;
  displacement: Vector;
  direction:Vector;

  constructor(physicsObject: PhysicsObject, displacement: Vector, direction: Vector) {
    this.physicsObject = physicsObject;
    this.displacement = displacement;
    this.direction = direction;
  }

  sense() {

  }
}
