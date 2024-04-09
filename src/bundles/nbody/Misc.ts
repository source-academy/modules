import type { CelestialBody, State, Universe, Vector3 } from "nbody";

/**
 * Deep clone an object.
 * @param obj The object to clone.
 * @returns The cloned object.
 * @category Celestial Body
 * @category State
 * @category Universe
 * @category Vector
 */
export function clone(obj: CelestialBody | State | Universe | Vector3): CelestialBody | State | Universe | Vector3 {
  return obj.clone();
}
