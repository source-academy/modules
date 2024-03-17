import { Vector3 } from 'three';

/**
 * Converts object to a Vector3.
 *
 * @param object Object to parse
 * @returns Vector3 if successful, undefined if failed
 */
export function parseVector3(object: any) {
  if (!object) return undefined;
  const x = object.x;
  const y = object.y;
  const z = object.z;
  if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
    return new Vector3(x, y, z);
  }
  return undefined;
}
