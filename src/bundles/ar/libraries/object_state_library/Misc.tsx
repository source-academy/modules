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

/**
 * Converts Vector3 to array [x, y, z].
 *
 * @param vector Vector3 to convert
 * @returns Vector in array form
 */
export function vector3ToArray(vector: Vector3) {
  return [vector.x, vector.y, vector.z] as [number, number, number];
}
