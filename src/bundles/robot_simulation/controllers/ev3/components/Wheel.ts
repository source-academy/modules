import { type Controller, type Physics, type Renderer } from '../../../engine';
import { type SimpleVector } from '../../../engine/Math/Vector';
import { vec3 } from '../../../engine/Math/Convert';
import { NumberPidController } from '../feedback_control/PidController';
import * as THREE from 'three';
import { type ChassisWrapper } from './Chassis';

type WheelConfig = {
  pid: {
    proportionalGain: number;
    derivativeGain: number;
    integralGain: number;
  };
  debug: boolean;
};

export class Wheel implements Controller {
  chassisWrapper: ChassisWrapper;
  pid: NumberPidController;
  displacement: SimpleVector;
  displacementVector: THREE.Vector3;
  downVector: THREE.Vector3;
  physics: Physics;
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
    this.pid = new NumberPidController(config.pid);
    this.displacement = displacement;
    this.displacementVector = vec3(this.displacement);
    this.downVector = vec3({
      x: 0,
      y: -1,
      z: 0,
    });
    this.arrowHelper = new THREE.ArrowHelper();
    this.arrowHelper.visible = config.debug;
    this.arrowHelper.setColor('red');
    render.add(this.arrowHelper);
  }

  fixedUpdate(_: number): void {
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
      0.2,
    );

    // Wheels are not touching the ground
    if (result === null) {
      return;
    }

    const { distance: wheelDistance, normal } = result;
    const error = this.pid.calculate(wheelDistance, 0.03 + 0.095 / 2);

    const force = vec3(normal)
      .normalize()
      .multiplyScalar(error * chassis.getMass());


    chassis.applyImpulse(force, globalDisplacement);

    this.arrowHelper.setLength(force.length() * 5000);
    this.arrowHelper.setDirection(force.normalize());
    this.arrowHelper.position.copy(globalDisplacement);
  }
}
