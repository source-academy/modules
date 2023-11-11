import * as THREE from 'three';

export type Vector = { x: number; y: number; z: number };

export class CachedVector implements Vector {
  initial_vector: Vector;
  cached_three_vector: THREE.Vector3;
  x: number;
  y:number;
  z: number;

  constructor(vector: Vector) {
    this.initial_vector = vector;
    this.cached_three_vector = new THREE.Vector3();
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
  }
}


export class ImmutableVector implements Vector {
  initial_vector: Vector;
  cached_three_vector: THREE.Vector3;
  x: number;
  y:number;
  z: number;

  constructor(vector: Vector) {
    this.initial_vector = vector;
    this.cached_three_vector = new THREE.Vector3();
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
  }
}
