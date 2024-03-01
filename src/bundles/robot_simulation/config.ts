import * as THREE from 'three';

import { type PhysicsConfig } from './engine/Physics';
import { type CameraOptions } from './engine/Render/Camera';
import { type RenderConfig } from './engine/Render/Renderer';
import { type EntityCuboidOptions } from './engine/Entity/EntityFactory';
import { type SimpleVector } from './engine/Math/Vector';
import { type MeshConfig } from './controllers/ev3/components/Mesh';

const tinyBuffer = 0.02;

export const physicsConfig: PhysicsConfig = {
  gravity: {
    x: 0,
    y: -9.81,
    z: 0,
  },
  timestep: 1 / 20,
};

export const renderConfig: RenderConfig = {
  width: 900,
  height: 500,
  control: 'orbit',
};

export const sceneCamera: CameraOptions = {
  type: 'perspective',
  aspect: renderConfig.width / renderConfig.height,
  fov: 75,
  near: 0.1,
  far: 1000,
};

export const chassisConfig: EntityCuboidOptions = {
  orientation: {
    position: {
      x: 0,
      y: 0.0775,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
    },
  },
  mass: 0.6,
  height: 0.095,
  width: 0.145,
  length: 0.18,
  type: 'dynamic',
};

export const meshConfig: MeshConfig = {
  orientation: chassisConfig.orientation,
  width: chassisConfig.width,
  height: chassisConfig.height + 0.02,
  length: chassisConfig.length,
  color: new THREE.Color('blue'),
  debug: true,
};


export const wheelDisplacements: Record<string, SimpleVector> = {
  frontLeftWheel: {
    x: -(chassisConfig.width / 2 + tinyBuffer),
    y: 0,
    z: chassisConfig.length / 2 - tinyBuffer,
  },

  frontRightWheel: {
    x: chassisConfig.width / 2 + tinyBuffer,
    y: 0,
    z: chassisConfig.length / 2 - tinyBuffer,
  },
  backLeftWheel: {
    x: -(chassisConfig.width / 2 + tinyBuffer),
    y: 0,
    z: -(chassisConfig.length / 2 - tinyBuffer),
  },
  backRightWheel: {
    x: chassisConfig.width / 2 + tinyBuffer,
    y: 0,
    z: -(chassisConfig.length / 2 - tinyBuffer),
  },
};

export const wheelPidConfig = {
  proportionalGain: 27,
  integralGain: 8,
  derivativeGain: 40,
};

export const motorDisplacements = {
  leftMotor: {
    x: 0.058,
    y: 0,
    z: 0.03,
  },
  rightMotor: {
    x: -0.058,
    y: 0,
    z: 0.03,
  },
};

export const motorPidConfig = {
  proportionalGain: 0.25,
  derivativeGain: 0,
  integralGain: 0,
};


export const colorSensorConfig = {
  displacement: {
    x: 0.04,
    y: -(chassisConfig.height / 2),
    z: 0.01,
  },
};

export const ultrasonicSensorConfig = {
  displacement: {
    x: 0.04,
    y: 0,
    z: 0.01,
  },
  direction: {
    x: 0,
    y: 0,
    z: 1,
  },
  debug: true,
};
