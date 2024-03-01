import { type Controller, type Physics, Renderer } from '../../../engine';
import { type SimpleVector } from '../../../engine/Math/Vector';
import { vec3 } from '../../../engine/Math/Convert';
import { VectorPidController } from '../feedback_control/PidController';
import * as THREE from 'three';
import { type ChassisWrapper } from './Chassis';
import { CallbackHandler } from '../../../engine/Core/CallbackHandler';

// eslint-disable-next-line import/extensions
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

  mesh: GLTF | null = null;

  constructor(chassisWrapper: ChassisWrapper, physics: Physics, renderer: Renderer, displacement: SimpleVector, config: MotorConfig) {
    this.chassisWrapper = chassisWrapper;
    this.physics = physics;
    this.pid = new VectorPidController(config.pid);
    this.displacementVector = vec3(displacement);
    this.motorVelocity = 0;
    this.render = renderer;
    this.wheelSide = displacement.x > 0 ? 'right' : 'left';
  }

  setVelocity(velocity: number) {
    this.motorVelocity = velocity;
  }

  setSpeedDistance(speed: number, distance: number) {
    // TODO: Tune this
    this.motorVelocity = speed * 500;
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
    const scaleY = 0.055 / size.y;
    const scaleZ = 0.055 / size.z;

    this.mesh.scene.scale.set(scaleX, scaleY, scaleZ);

    this.render.add(this.mesh.scene);
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


  update(deltaTime): void {
    this.callbackHandler.checkCallbacks(deltaTime);
    const chassisEntity = this.chassisWrapper.getEntity();
    const wheelPosition = chassisEntity.worldTranslation(this.displacementVector.clone()) as THREE.Vector3;
    wheelPosition.y = 0.055 / 2;
    this.mesh?.scene.position.copy(
      wheelPosition,
    );
    this.mesh?.scene.quaternion.copy(
      chassisEntity.getRotation() as THREE.Quaternion,
    );
    this.mesh?.scene.rotateX(90 / 180 * Math.PI);
    if (this.wheelSide === 'left') {
      this.mesh?.scene.rotateZ(Math.PI);
    }
  }

  toString() {
    return 'Motor';
  }
}
