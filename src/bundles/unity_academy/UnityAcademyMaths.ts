/**
 * Maths functions for Source Academy's Unity Academy module
 * @module unity_academy
 * @author Wang Zihan
 */

export class Vector3 {
  x = 0;
  y = 0;
  z = 0;
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export function checkVector3Parameter(parameter : any) : void {
  if (typeof (parameter) !== 'object') {
    throw new Error(`The given parameter is not a valid 3D vector! Wrong parameter type: ${typeof (parameter)}`);
  }
  if (typeof (parameter.x) !== 'number' || typeof (parameter.y) !== 'number' || typeof (parameter.z) !== 'number') {
    throw new Error('The given parameter is not a valid 3D vector!');
  }
}

export function makeVector3D(x : number, y : number, z : number) : Vector3 {
  return new Vector3(x, y, z);
}

export function scaleVector(vector : Vector3, factor : number) : Vector3 {
  return new Vector3(vector.x * factor, vector.y * factor, vector.z * factor);
}

export function addVectors(vectorA : Vector3, vectorB : Vector3) : Vector3 {
  return new Vector3(vectorA.x + vectorB.x, vectorA.y + vectorB.y, vectorA.z + vectorB.z);
}

export function vectorDifference(vectorA : Vector3, vectorB : Vector3) : Vector3 {
  return new Vector3(vectorA.x - vectorB.x, vectorA.y - vectorB.y, vectorA.z - vectorB.z);
}

export function dotProduct(vectorA : Vector3, vectorB : Vector3) : number {
  return vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z;
}

export function crossProduct(vectorA : Vector3, vectorB : Vector3) : Vector3 {
  return new Vector3(vectorA.y * vectorB.z - vectorB.y * vectorA.z, vectorB.x * vectorA.z - vectorA.x * vectorB.z, vectorA.x * vectorB.y - vectorB.x * vectorA.y);
}

export function vectorMagnitude(vector : Vector3) : number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

export function normalizeVector(vector : Vector3) : Vector3 {
  const magnitude = vectorMagnitude(vector);
  if (magnitude === 0) return new Vector3(0, 0, 0); // If the parameter is a zero vector, then return a new zero vector.
  return new Vector3(vector.x / magnitude, vector.y / magnitude, vector.z / magnitude);
}

export function zeroVector() : Vector3 {
  return new Vector3(0, 0, 0);
}

export function pointDistance(pointA : Vector3, pointB : Vector3) : number {
  return Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2 + (pointB.z - pointA.z) ** 2);
}
