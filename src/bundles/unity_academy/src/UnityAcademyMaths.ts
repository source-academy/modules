/**
 * Maths functions for Source Academy's Unity Academy module
 * @module unity_academy
 * @author Wang Zihan
 */

import { InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';

export class Vector3 {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) { }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  equals(other: Vector3): boolean {
    return Math.abs(this.x - other.x) < 0.00001
      && Math.abs(this.y - other.y) < 0.00001
      && Math.abs(this.z - other.z) < 0.00001;
  }
}

export function checkVector3Parameter(parameter: unknown, func_name: string, param_name?: string): asserts parameter is Vector3 {
  if (typeof parameter === 'object' && parameter !== null
    && 'x' in parameter && typeof parameter.x === 'number'
    && 'y' in parameter && typeof parameter.y === 'number'
    && 'z' in parameter && typeof parameter.z === 'number'
  ) {
    return;
  }
  throw new InvalidParameterTypeError('3D vector', parameter, func_name, param_name);
}

/**
 * Creates a new {@link Vector3}.
 */
export function makeVector3D(x: number, y: number, z: number): Vector3 {
  return new Vector3(x, y, z);
}

/**
 * Scales the given vector by the given factor.
 */
export function scaleVector(vector: Vector3, factor: number): Vector3 {
  return new Vector3(vector.x * factor, vector.y * factor, vector.z * factor);
}

export function addVectors(vectorA: Vector3, vectorB: Vector3): Vector3 {
  return new Vector3(vectorA.x + vectorB.x, vectorA.y + vectorB.y, vectorA.z + vectorB.z);
}

export function vectorDifference(vectorA: Vector3, vectorB: Vector3): Vector3 {
  return new Vector3(vectorA.x - vectorB.x, vectorA.y - vectorB.y, vectorA.z - vectorB.z);
}

export function dotProduct(vectorA: Vector3, vectorB: Vector3): number {
  return vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z;
}

export function crossProduct(vectorA: Vector3, vectorB: Vector3): Vector3 {
  return new Vector3(
    vectorA.y * vectorB.z - vectorB.y * vectorA.z,
    vectorB.x * vectorA.z - vectorA.x * vectorB.z,
    vectorA.x * vectorB.y - vectorB.x * vectorA.y
  );
}

export function vectorMagnitude(vector: Vector3): number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

/**
 * Returns a "normalized" version of the provided vector, i.e the vector that has the
 * same direction as the original one but with a magnitude of 1.
 */
export function normalizeVector(vector: Vector3): Vector3 {
  const magnitude = vectorMagnitude(vector);
  if (magnitude === 0) return new Vector3(0, 0, 0); // If the parameter is a zero vector, then return a new zero vector.
  return new Vector3(vector.x / magnitude, vector.y / magnitude, vector.z / magnitude);
}

export function zeroVector(): Vector3 {
  return new Vector3(0, 0, 0);
}

export function pointDistance(pointA: Vector3, pointB: Vector3): number {
  return Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2 + (pointB.z - pointA.z) ** 2);
}
