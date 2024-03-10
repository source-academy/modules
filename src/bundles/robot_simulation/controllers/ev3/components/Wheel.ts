import { type Renderer, type Controller, type Physics } from '../../../engine';
import { type SimpleVector } from '../../../engine/Math/Vector';
import { vec3 } from '../../../engine/Math/Convert';
import { NumberPidController } from '../feedback_control/PidController';
import * as THREE from 'three';
import { type ChassisWrapper } from './Chassis';
import type { PhysicsTimingInfo } from '../../../engine/Physics';

type WheelConfig = {
  pid: {
    proportionalGain: number;
    derivativeGain: number;
    integralGain: number;
  };
  gapToFloor: number;
  maxRayDistance:number;
  debug: boolean;
};

export class Wheel implements Controller {
  chassisWrapper: ChassisWrapper;
  physics: Physics;
  render: Renderer;
  config: WheelConfig;

  pid: NumberPidController;
  displacementVector: THREE.Vector3;
  downVector: THREE.Vector3;
  arrowHelper: THREE.ArrowHelper;

  constructor(
    chassisWrapper: ChassisWrapper,
    physics: Physics,
    render: Renderer,
    displacement: SimpleVector,
    config: WheelConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.physics = physics;
    this.render = render;
    this.displacementVector = vec3(displacement);
    this.config = config;

    this.pid = new NumberPidController(config.pid);
    this.downVector = vec3({
      x: 0,
      y: -1,
      z: 0,
    });

    // Debug arrow.
    this.arrowHelper = new THREE.ArrowHelper();
    this.arrowHelper.visible = config.debug;
    this.arrowHelper.setColor('red');
    render.add(this.arrowHelper);
  }

  fixedUpdate(timingInfo: PhysicsTimingInfo): void {
    const chassis = this.chassisWrapper.getEntity();

    const globalDisplacement = chassis.worldTranslation(
      this.displacementVector.clone(),
    );
    const globalDownDirection = chassis.transformDirection(
      this.downVector.clone(),
    );

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

    let { distance: wheelDistance, normal } = result;

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

    this.arrowHelper.setLength(force.length() * 1000);
    this.arrowHelper.setDirection(force.normalize());
    this.arrowHelper.position.copy(globalDisplacement);
  }
}
