import { type SimpleVector } from '../../../engine/Math/Vector';
import { type ChassisWrapper } from '../components/Chassis';
import { type Sensor } from './types';
import { vec3 } from '../../../engine/Math/Convert';
import { type Renderer, type Physics } from '../../../engine';
import * as THREE from 'three';

export type UltrasonicSensorConfig = {
  displacement: SimpleVector;
  direction: SimpleVector;
  debug: boolean;
};

export class UltrasonicSensor implements Sensor<number> {
  chassisWrapper: ChassisWrapper;
  physics: Physics;
  displacement: THREE.Vector3;
  direction: THREE.Vector3;
  distanceSensed: number = 0;
  render: Renderer;
  config: UltrasonicSensorConfig;
  debugArrow: THREE.ArrowHelper;

  constructor(
    chassis: ChassisWrapper,
    physics: Physics,
    render: Renderer,
    config: UltrasonicSensorConfig,
  ) {
    this.chassisWrapper = chassis;
    this.physics = physics;
    this.render = render;
    this.displacement = vec3(config.displacement);
    this.direction = vec3(config.direction);
    this.config = config;

    // Debug arrow
    this.debugArrow = new THREE.ArrowHelper();
    this.debugArrow.visible = false;
    this.render.add(this.debugArrow);
  }

  sense(): number {
    return this.distanceSensed;
  }

  fixedUpdate(): void {
    const chassis = this.chassisWrapper.getEntity();
    const globalDisplacement = chassis.worldTranslation(
      this.displacement.clone(),
    );
    const globalDirection = chassis.transformDirection(this.direction.clone());

    const result = this.physics.castRay(
      globalDisplacement,
      globalDirection,
      1,
      this.chassisWrapper.getEntity()
        .getCollider(),
    );

    if (this.config.debug) {
      this.debugArrow.visible = true;
      this.debugArrow.position.copy(globalDisplacement);
      this.debugArrow.setDirection(globalDirection.normalize());
    }

    if (result === null) {
      return;
    }

    const { distance: wheelDistance } = result;

    this.distanceSensed = wheelDistance;
  }
}
