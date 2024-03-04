import { type Controller, type Physics, Renderer } from '../../../engine';
import { type SimpleVector } from '../../../engine/Math/Vector';
import { vec3 } from '../../../engine/Math/Convert';
import { VectorPidController } from '../feedback_control/PidController';
import * as THREE from 'three';
import { type ChassisWrapper } from './Chassis';
import { CallbackHandler } from '../../../engine/Core/CallbackHandler';

// eslint-disable-next-line import/extensions
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { PhysicsTimingInfo } from '../../../engine/Physics';

type WheelSide = 'left' | 'right';

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
  callbackHandler = new CallbackHandler();
  wheelSide: WheelSide;

  physics: Physics;
  render: Renderer;
  chassisWrapper: ChassisWrapper;
  meshRotation: number;

  mesh: GLTF | null = null;

  constructor(chassisWrapper: ChassisWrapper, physics: Physics, renderer: Renderer, displacement: SimpleVector, config: MotorConfig) {
    this.chassisWrapper = chassisWrapper;
    this.physics = physics;
    this.pid = new VectorPidController(config.pid);
    this.displacementVector = vec3(displacement);
    this.motorVelocity = 0;
    this.render = renderer;
    this.wheelSide = displacement.x > 0 ? 'right' : 'left';
    this.meshRotation = 0;
  }

  setVelocity(velocity: number) {
    this.motorVelocity = velocity;
  }

  setSpeedDistance(speed: number, distance: number) {
    this.motorVelocity = speed;

    this.callbackHandler.addCallback(() => {
      this.motorVelocity = 0;
    }, distance / speed * 1000);
  }

  async start(): Promise<void> {
    this.mesh = await Renderer.loadGTLF(
      'https://keen-longma-3c1be1.netlify.app/6_wheel.gltf',
    );

    const box = new THREE.Box3()
      .setFromObject(this.mesh.scene);

    const size = new THREE.Vector3();

    box.getSize(size);

    const scaleX = 0.028 / size.x;
    const scaleY = 0.0575 / size.y;
    const scaleZ = 0.0575 / size.z;

    this.mesh.scene.scale.set(scaleX, scaleY, scaleZ);

    this.render.add(this.mesh.scene);
  }

  fixedUpdate(): void {
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


  update(timingInfo: PhysicsTimingInfo): void {
    this.callbackHandler.checkCallbacks(timingInfo);
    const chassisEntity = this.chassisWrapper.getEntity();
    const wheelPosition = chassisEntity.worldTranslation(this.displacementVector.clone());
    wheelPosition.y = 0.0575 / 2;
    this.mesh?.scene.position.copy(
      wheelPosition,
    );
    this.mesh?.scene.quaternion.copy(
      chassisEntity.getRotation(),
    );

    const frameDuration = timingInfo.frameDuration;
    const radiansPerSecond = this.motorVelocity / 0.0575 * 2 * frameDuration / 1000;

    this.meshRotation += radiansPerSecond;

    this.mesh?.scene.rotateX(this.meshRotation);
    if (this.wheelSide === 'left') {
      this.mesh?.scene.rotateZ(Math.PI);
    }
  }

  toString() {
    return 'Motor';
  }
}
