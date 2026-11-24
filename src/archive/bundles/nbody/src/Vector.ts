import { Vector3 } from 'nbody';

/**
 * Create a new 3D vector.
 * @param x x component of the vector.
 * @param y y component of the vector.
 * @param z z component of the vector.
 * @returns A new 3D vector.
 * @category Vector
 */
export function createVector(x: number, y: number, z: number): Vector3 {
  return new Vector3(x, y, z);
}

/**
 * Get the x component of a vector.
 * @param v The vector.
 * @returns The x component of the vector.
 * @category Vector
 */
export function getX(v: Vector3): number {
  return v.x;
}

/**
 * Get the y component of a vector.
 * @param v The vector.
 * @returns The y component of the vector.
 * @category Vector
 */
export function getY(v: Vector3): number {
  return v.y;
}

/**
 * Get the z component of a vector.
 * @param v The vector.
 * @returns The z component of the vector.
 * @category Vector
 */
export function getZ(v: Vector3): number {
  return v.z;
}

/**
 * Set the x component of a vector.
 * @param v The vector.
 * @param x The new x component.
 * @category Vector
 */
export function setX(v: Vector3, x: number): void {
  v.x = x;
}

/**
 * Set the y component of a vector.
 * @param v The vector.
 * @param y The new y component.
 * @category Vector
 */
export function setY(v: Vector3, y: number): void {
  v.y = y;
}

/**
 * Set the z component of a vector.
 * @param v The vector.
 * @param z The new z component.
 * @category Vector
 */
export function setZ(v: Vector3, z: number): void {
  v.z = z;
}

/**
 * Add two vectors.
 * @param v1 The first vector.
 * @param v2 The second vector.
 * @returns The sum of the two vectors.
 * @category Vector
 */
export function addVectors(v1: Vector3, v2: Vector3): Vector3 {
  return new Vector3()
    .addVectors(v1, v2);
}

/**
 * Subtract two vectors.
 * @param v1 The first vector.
 * @param v2 The second vector.
 * @returns The difference of the two vectors.
 * @category Vector
 */
export function subVectors(v1: Vector3, v2: Vector3): Vector3 {
  return new Vector3()
    .subVectors(v1, v2);
}

/**
 * Multiply a vector by a scalar.
 * @param v vector to multiply.
 * @param s scalar to multiply by.
 * @returns The vector multiplied by the scalar.
 * @category Vector
 */
export function multiplyScalar(v: Vector3, s: number): Vector3 {
  return new Vector3()
    .multiplyScalar(s);
}
