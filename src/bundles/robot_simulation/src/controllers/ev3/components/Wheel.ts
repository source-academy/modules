import type * as THREE from 'three';
import type { Controller, Physics } from '../../../engine';
import { vec3 } from '../../../engine/Math/Convert';
import type { SimpleVector } from '../../../engine/Math/Vector';
import type { PhysicsTimingInfo } from '../../../engine/Physics';
import { NumberPidController } from '../feedback_control/PidController';
import type { ChassisWrapper } from './Chassis';

export type WheelConfig = {
  pid: {
    proportionalGain: number;
    derivativeGain: number;
    integralGain: number;
  };
  displacement: SimpleVector;
  gapToFloor: number;
  maxRayDistance: number;
  debug: boolean;
};

/** The pre-migration debug arrow (visualising the suspension force) is dropped along with all
  other DOM-touching debug helpers - see Chassis.ts's doc comment. */
export class Wheel implements Controller {
  chassisWrapper: ChassisWrapper;
  physics: Physics;
  config: WheelConfig;

  pid: NumberPidController;
  displacementVector: THREE.Vector3;
  downVector: THREE.Vector3;

  constructor(
    chassisWrapper: ChassisWrapper,
    physics: Physics,
    config: WheelConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.physics = physics;
    this.displacementVector = vec3(config.displacement);
    this.config = config;

    this.pid = new NumberPidController(config.pid);
    this.downVector = vec3({
      x: 0,
      y: -1,
      z: 0,
    });
  }

  fixedUpdate(timingInfo: PhysicsTimingInfo): void {
    const chassis = this.chassisWrapper.getEntity();

    const globalDisplacement = chassis.worldTranslation(this.displacementVector.clone(),);
    const globalDownDirection = chassis.transformDirection(this.downVector.clone(),);

    const result = this.physics.castRay(
      globalDisplacement,
      globalDownDirection,
      this.config.maxRayDistance,
      chassis.getCollider(),
    );

    // Wheels are not touching the ground
    if (result === null) {
      return;
    }

    const wheelDistance = result.distance;
    let normal = result.normal;

    // If distance is zero, the ray originate from inside the floor/wall.
    // If that is true, we assume the normal is pointing up.
    if (wheelDistance === 0) {
      normal = {
        x: 0,
        y: 1,
        z: 0,
      };
    }

    const error = this.pid.calculate(wheelDistance, this.config.gapToFloor);

    const force = vec3(normal)
      .normalize()
      .multiplyScalar((error * chassis.getMass() * timingInfo.timestep) / 1000);

    chassis.applyImpulse(force, globalDisplacement);
  }
}
