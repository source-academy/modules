import { type Vector } from '../physics/helpers';
import { type PhysicsObject } from '../physics/physics_object_controller';


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
