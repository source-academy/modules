import { Euler, Quaternion, Vector3 } from 'three';
import type { SimpleQuaternion, SimpleVector } from './Vector';

export const quat = ({ x, y, z, w }: SimpleQuaternion) => new Quaternion(x, y, z, w);
export const vec3 = ({ x, y, z }: SimpleVector) => new Vector3(x, y, z);
export const euler = ({ x, y, z }: SimpleVector) => new Euler(x, y, z);
