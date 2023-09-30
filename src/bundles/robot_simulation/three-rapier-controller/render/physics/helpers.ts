import { Euler, Quaternion, Vector3 } from 'three';

export const quat = ({ x, y, z, w }) => new Quaternion(x, y, z, w);
export const vec3 = ({ x, y, z }) => new Vector3(x, y, z);
export const euler = ({ x, y, z }) => new Euler(x, y, z);
