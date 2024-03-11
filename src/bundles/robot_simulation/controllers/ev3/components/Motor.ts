import { type Controller, type Physics, type Renderer } from '../../../engine';
import { type Dimension, type SimpleVector } from '../../../engine/Math/Vector';
import { vec3 } from '../../../engine/Math/Convert';
import { VectorPidController } from '../feedback_control/PidController';
import type * as THREE from 'three';
import { type ChassisWrapper } from './Chassis';
import { CallbackHandler } from '../../../engine/Core/CallbackHandler';

// eslint-disable-next-line import/extensions
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { PhysicsTimingInfo } from '../../../engine/Physics';
import { loadGLTF } from '../../../engine/Render/helpers/GLTF';

type WheelSide = 'left' | 'right';

export type MotorConfig = {
  displacement: SimpleVector;
  pid: {
    proportionalGain: number;
    derivativeGain: number;
    integralGain: number;
  };
  mesh: {
    url: string;
    dimension: Dimension;
  };
};
/**
 * This represents the motor of the robot and is responsible for moving the robot. It is also
 * responsible for the visual representation of the wheel and the friction.
 */
export class Motor implements Controller {
  chassisWrapper: ChassisWrapper;
  physics: Physics;
  render: Renderer;
  displacementVector: THREE.Vector3;
  config: MotorConfig;

  motorVelocity: number;
  meshRotation: number;
  pid: VectorPidController;

  callbackHandler = new CallbackHandler();
  wheelSide: WheelSide;

  mesh: GLTF | null = null;

  constructor(
    chassisWrapper: ChassisWrapper,
    physics: Physics,
    render: Renderer,
    config: MotorConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.physics = physics;
    this.render = render;
    this.displacementVector = vec3(config.displacement);
    this.config = config;

    this.pid = new VectorPidController(config.pid);
    this.motorVelocity = 0;
    this.meshRotation = 0;
    this.wheelSide = config.displacement.x > 0 ? 'right' : 'left';
  }

  setSpeedDistance(speed: number, distance: number) {
    this.motorVelocity = speed;

    this.callbackHandler.addCallback(() => {
      this.motorVelocity = 0;
    }, (distance / speed) * 1000);
  }

  async start(): Promise<void> {
    this.mesh = await loadGLTF(this.config.mesh.url, this.config.mesh.dimension);
    this.render.add(this.mesh.scene);
  }

  fixedUpdate(timingInfo: PhysicsTimingInfo): void {
    this.callbackHandler.checkCallbacks(timingInfo);
    const chassis = this.chassisWrapper.getEntity();

    // Calculate the target motor velocity from the chassis perspective
    const targetMotorVelocity = vec3({
      x: 0,
      y: 0,
      z: this.motorVelocity,
    });

    // Transform it to the global perspective
    const targetMotorGlobalVelocity
      = chassis.transformDirection(targetMotorVelocity);

    // Calculate the actual motor velocity from the global perspective
    const actualMotorGlobalVelocity = chassis.worldVelocity(
      this.displacementVector.clone(),
    );

    // Calculate the PID output with the PID controller
    const pidOutput = this.pid.calculate(
      actualMotorGlobalVelocity,
      targetMotorGlobalVelocity,
    );

    // Find the global position of the motor
    const motorGlobalPosition = chassis.worldTranslation(
      this.displacementVector.clone(),
    );

    // Calculate the impulse to apply to the chassis
    const impulse = pidOutput
      .projectOnPlane(
        vec3({
          x: 0,
          y: 1,
          z: 0,
        }),
      )
      .multiplyScalar(chassis.getMass());

    // Apply the impulse to the chassis
    chassis.applyImpulse(impulse, motorGlobalPosition);
  }

  update(timingInfo: PhysicsTimingInfo): void {
    const chassisEntity = this.chassisWrapper.getEntity();

    // Calculate the new wheel position, adjusting the y-coordinate to half the mesh height
    const wheelPosition = chassisEntity.worldTranslation(this.displacementVector.clone());
    wheelPosition.y = this.config.mesh.dimension.height / 2; // Ensure the wheel is placed correctly vertically

    // If mesh is loaded, update its position and orientation
    if (this.mesh) {
      this.mesh.scene.position.copy(wheelPosition);
      this.mesh.scene.quaternion.copy(chassisEntity.getRotation());

      // Calculate rotation adjustment based on motor velocity and frame duration
      const radiansPerFrame = 2 * (this.motorVelocity / this.config.mesh.dimension.height) * timingInfo.frameDuration / 1000;

      // Apply rotation changes to simulate wheel turning
      this.meshRotation += radiansPerFrame;
      this.mesh.scene.rotateX(this.meshRotation);

      // If the wheel is on the left side, flip it to face the correct direction
      if (this.wheelSide === 'left') {
        this.mesh.scene.rotateZ(Math.PI);
      }
    }
  }
}
