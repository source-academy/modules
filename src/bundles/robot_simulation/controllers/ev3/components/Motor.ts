import { type Controller, type Physics } from '../../../engine';
import { type SimpleVector } from '../../../engine/Math/Vector';
import { vec3 } from '../../../engine/Math/Convert';
import { VectorPidController } from '../feedback_control/PidController';
import type * as THREE from 'three';
import { type ChassisWrapper } from './Chassis';


type MotorConfig = {
  pid: {
    proportionalGain: number;
    derivativeGain: number;
    integralGain: number;
  }
};

export class Motor implements Controller {
  pid: VectorPidController;
  displacementVector: THREE.Vector3;
  motorVelocity: number;

  physics: Physics;
  chassisWrapper: ChassisWrapper;

  constructor(chassisWrapper: ChassisWrapper, physics: Physics, displacement: SimpleVector, config: MotorConfig) {
    this.chassisWrapper = chassisWrapper;
    this.physics = physics;
    this.pid = new VectorPidController(config.pid);
    this.displacementVector = vec3(displacement);
    this.motorVelocity = 0;
  }

  setVelocity(velocity: number) {
    this.motorVelocity = velocity;
  }

  fixedUpdate(_: number): void {
    const chassis = this.chassisWrapper.getEntity();
    const targetMotorVelocity = vec3({
      x: 0,
      y: 0,
      z: this.motorVelocity,
    });

    const targetMotorGlobalVelocity = chassis.transformDirection(targetMotorVelocity);
    const actualMotorGlobalVelocity = chassis.worldVelocity(this.displacementVector.clone());

    const error = this.pid.calculate(actualMotorGlobalVelocity, targetMotorGlobalVelocity);

    const motorGlobalPosition = chassis.worldTranslation(this.displacementVector.clone());

    const impulse = error.projectOnPlane(vec3({
      x: 0,
      y: 1,
      z: 0,
    }))
      .multiplyScalar(chassis.getMass());

    chassis.applyImpulse(impulse, motorGlobalPosition);
  }

  toString() {
    return 'Motor';
  }
}
