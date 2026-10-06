import { vec3 } from '../../../engine/Math/Convert';
import type { SimpleVector } from '../../../engine/Math/Vector';
import type { Physics } from '../../../engine/Physics';
import type { ChassisWrapper } from '../components/Chassis';
import type { Sensor } from './types';

export type UltrasonicSensorConfig = {
  displacement: SimpleVector;
  direction: SimpleVector;
  debug: boolean;
};

/** The pre-migration debug arrow is dropped - see Chassis.ts's doc comment. Sensing itself
  (a physics raycast) was already worker-safe and is unchanged. */
export class UltrasonicSensor implements Sensor<number> {
  chassisWrapper: ChassisWrapper;
  physics: Physics;
  displacement: ReturnType<typeof vec3>;
  direction: ReturnType<typeof vec3>;
  distanceSensed: number = 0;
  config: UltrasonicSensorConfig;

  constructor(
    chassis: ChassisWrapper,
    physics: Physics,
    config: UltrasonicSensorConfig,
  ) {
    this.chassisWrapper = chassis;
    this.physics = physics;
    this.displacement = vec3(config.displacement);
    this.direction = vec3(config.direction);
    this.config = config;
  }

  sense(): number {
    return this.distanceSensed * 100;
  }

  fixedUpdate(): void {
    const chassis = this.chassisWrapper.getEntity();
    const globalDisplacement = chassis.worldTranslation(this.displacement.clone(),);
    const globalDirection = chassis.transformDirection(this.direction.clone());

    const result = this.physics.castRay(
      globalDisplacement,
      globalDirection,
      1,
      this.chassisWrapper.getEntity()
        .getCollider(),
    );

    if (result === null) {
      return;
    }

    const { distance: wheelDistance } = result;

    this.distanceSensed = wheelDistance;
  }
}
