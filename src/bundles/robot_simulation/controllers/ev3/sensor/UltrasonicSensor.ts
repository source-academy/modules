import { type SimpleVector } from '../../../engine/Math/Vector';
import { type ChassisWrapper } from '../components/Chassis';
import { type Sensor } from './types';
import { vec3 } from '../../../engine/Math/Convert';
import { type Physics } from '../../../engine';

export class UltrasonicSensor implements Sensor<number> {
  chassisWrapper: ChassisWrapper;
  physics: Physics;
  displacement: THREE.Vector3;
  direction: THREE.Vector3;
  distanceSensed: number = 0;

  constructor(
    chassis: ChassisWrapper,
    physics: Physics,
    displacement: SimpleVector,
    direction: SimpleVector,
  ) {
    this.chassisWrapper = chassis;
    this.physics = physics;
    this.displacement = vec3(displacement);
    this.direction = vec3(direction);
  }

  sense(): number {
    return this.distanceSensed;
  }

  fixedUpdate(_: number): void {
    const chassis = this.chassisWrapper.getEntity();
    const globalDisplacement = chassis.worldTranslation(
      this.displacement.clone(),
    );
    const globalDirection = chassis.transformDirection(this.direction.clone());

    const result = this.physics.castRay(
      globalDisplacement,
      globalDirection,
      0.2,
    );

    if (result === null) {
      return;
    }

    const { distance: wheelDistance } = result;

    this.distanceSensed = wheelDistance;
  }
}
