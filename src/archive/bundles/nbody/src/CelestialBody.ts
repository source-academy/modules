import { CelestialBody, type Vector3 } from 'nbody';

/**
 * Create a new celestial body.
 * @param label label of the body.
 * @param mass mass of the body.
 * @param position position of the body.
 * @param velocity velocity of the body.
 * @param acceleration acceleration of the body.
 * @returns A new celestial body.
 * @category Celestial Body
 */
export function createCelestialBody(label: string, mass: number, radius?: number, position?: Vector3, velocity?: Vector3, acceleration?: Vector3): CelestialBody {
  return new CelestialBody(label, mass, radius, position, velocity, acceleration);
}

/**
 * Get the label of a celestial body.
 * @param body The celestial body.
 * @returns The label of the celestial body.
 * @category Celestial Body
 */
export function getLabel(body: CelestialBody): string {
  return body.label;
}

/**
 * Get the mass of a celestial body.
 * @param body The celestial body.
 * @returns The mass of the celestial body.
 * @category Celestial Body
 */
export function getMass(body: CelestialBody): number {
  return body.mass;
}

/**
 * Get the radius of a celestial body.
 * @param body The celestial body.
 * @returns The radius of the celestial body.
 * @category Celestial Body
 */
export function getRadius(body: CelestialBody): number {
  return body.radius;
}

/**
 * Get the position of a celestial body.
 * @param body The celestial body.
 * @returns The position of the celestial body.
 * @category Celestial Body
 */
export function getPosition(body: CelestialBody): Vector3 {
  return body.position;
}

/**
 * Get the velocity of a celestial body.
 * @param body The celestial body.
 * @returns The velocity of the celestial body.
 * @category Celestial Body
 */
export function getVelocity(body: CelestialBody): Vector3 {
  return body.velocity;
}

/**
 * Get the acceleration of a celestial body.
 * @param body The celestial body.
 * @returns The acceleration of the celestial body.
 * @category Celestial Body
 */
export function getAcceleration(body: CelestialBody): Vector3 {
  return body.acceleration;
}
