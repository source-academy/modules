import * as THREE from 'three';
import { vec3 } from '../../../engine/Math/Convert';
import type { SimpleVector } from '../../../engine/Math/Vector';
import type { Physics , PhysicsTimingInfo } from '../../../engine/Physics';
import type { ChassisWrapper } from '../components/Chassis';
import type { Sensor } from './types';

type Color = { r: number, g: number, b: number };

export type ColorSensorConfig = {
  size: {
    height: number;
    width: number;
  };
  displacement: SimpleVector;
  camera: unknown;
  tickRateInSeconds: number;
  debug: boolean;
};

/** Returned when the sensor's downward raycast doesn't hit any registered surface (e.g. hovering
 * over the edge of the floor) - matches the white background the pre-migration renderer cleared
  to. */
const DEFAULT_COLOR: Color = { r: 255, g: 255, b: 255 };

/**
 * Pre-migration, this sensor worked by literally rendering the scene from a tiny camera mounted
 * where the sensor sits, then averaging the rendered pixels - real GPU work, which needs the same
 * WebGL context the main view uses. That's no longer available here: this class now runs inside
 * Conductor's runner Worker, which has no WebGL (see SceneRegistry's doc comment for why the
 * module can't own any rendering at all any more).
 *
 * Replaced with a physics raycast straight down from the sensor to the nearest registered
 * surface (see `Physics.registerColor`/`Cuboid.ts`), returning that surface's flat color. This is
 * worker-safe and keeps the sensor meaningfully reactive to floor/wall colors (e.g. line-following
 * programs against a colored floor still work), but it is a real behavioural narrowing versus the
 * original: `Paper` (create_paper) has no physics collider (see Paper.ts), so a colored/textured
 * paper placed on the floor is invisible to this sensor, where the original GPU-rendered version
 * would have picked it up. Restoring that would mean either giving Paper a (non-solid) collider
 * carrying its texture's dominant color, or routing sense() through a tab-side render-and-readback
 * round trip once per sensor tick (~10/s here) - either is a real follow-up, not attempted in this
 * migration.
 */
export class ColorSensor implements Sensor<Color> {
  chassisWrapper: ChassisWrapper;
  physics: Physics;
  displacement: THREE.Vector3;
  config: ColorSensorConfig;
  accumulator = 0;
  colorSensed: Color = DEFAULT_COLOR;

  constructor(
    chassisWrapper: ChassisWrapper,
    physics: Physics,
    config: ColorSensorConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.physics = physics;
    this.displacement = vec3(config.displacement);
    this.config = config;
  }

  getColorSensorPosition() {
    const chassis = this.chassisWrapper.getEntity();
    return chassis.worldTranslation(this.displacement.clone());
  }

  sense(): Color {
    return this.colorSensed;
  }

  // Even though sensing no longer renders, we use fixedUpdate because the student's code can be
  // affected by the values of sense() and could affect the determinism of the simulation.
  fixedUpdate(timingInfo: PhysicsTimingInfo) {
    this.accumulator += timingInfo.timestep;

    const tickRateInMilliseconds = this.config.tickRateInSeconds * 1000;
    if (this.accumulator < tickRateInMilliseconds) {
      return;
    }
    this.accumulator -= tickRateInMilliseconds;

    const chassis = this.chassisWrapper.getEntity();
    const position = this.getColorSensorPosition();
    const down = vec3({ x: 0, y: -1, z: 0 });

    const result = this.physics.castRay(position, down, 1, chassis.getCollider());
    if (result === null) {
      this.colorSensed = DEFAULT_COLOR;
      return;
    }

    const hex = this.physics.getColor(result.collider);
    if (hex === undefined) {
      this.colorSensed = DEFAULT_COLOR;
      return;
    }

    const color = new THREE.Color(hex);
    this.colorSensed = {
      r: color.r * 255,
      g: color.g * 255,
      b: color.b * 255,
    };
  }
}
