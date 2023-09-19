import { Vector3 } from 'three';

export const physicsOptions = {
  GRAVITY: new Vector3(0.0, -9.81, 0.0),
} as const;

export const sceneOptions = {
  height: 600,
  width: 800,
} as const;
