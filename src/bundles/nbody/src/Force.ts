import { CentripetalForce, CombinedForce, Gravity, type CelestialBody, type Force, type Vector3, LambdaForce } from 'nbody';

/**
 * Create a force that applies to all bodies using the provided higher order/lambda/arrow/anonymous function.
 * @param fn A function that takes an array of bodies and returns an array of forces of the same length.
 * @returns A new lambda force.
 * @category Forces
 */
export function createForce(fn: (bodies: CelestialBody[]) => Vector3[]): Force {
  return new LambdaForce(fn);
}

/**
 * Create a force that applies to all bodies.
 * @param G The gravitational constant.
 * @returns A new gravity force.
 * @category Forces
 */
export function createGravity(G?: number): Gravity {
  return new Gravity(G);
}

/**
 * Create a centripetal force that pulls bodies towards a center.
 * @param center The center of the centripetal force.
 * @returns A new centripetal force.
 * @category Forces
 */
export function createCentripetalForce(center?: Vector3): CentripetalForce {
  return new CentripetalForce(center);
}

/**
 * Create a combined force that is an additive combination of all the given forces.
 * @param forces The forces to combine.
 * @returns A new combined force.
 * @category Forces
 */
export function createCombinedForce(forces: Force[]): CombinedForce {
  return new CombinedForce(forces);
}
