import { type PhysicsConfig } from './engine/Physics';
import { type CameraOptions } from './engine/Render/helpers/Camera';
import { type RenderConfig } from './engine/Render/Renderer';
import { type SimpleVector } from './engine/Math/Vector';
import { type MeshConfig } from './controllers/ev3/components/Mesh';
import type { ChassisWrapperConfig } from './controllers/ev3/components/Chassis';
import type { MotorConfig } from './controllers/ev3/components/Motor';
import type { ColorSensorConfig } from './controllers/ev3/sensor/ColorSensor';

const tinyConstant = 0.012;

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

export const chassisConfig: ChassisWrapperConfig = {
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
  debug: true,
};

export const meshConfig: Omit<MeshConfig, 'url'> = {
  width: chassisConfig.width,
  height: chassisConfig.height,
  length: chassisConfig.length,
  offset: {
    y: 0.02,
  },
};


export const wheelDisplacements: Record<string, SimpleVector> = {
  frontLeftWheel: {
    x: -(chassisConfig.width / 2),
    y: -(chassisConfig.height / 2),
    z: chassisConfig.length / 2 - tinyConstant,
  },

  frontRightWheel: {
    x: chassisConfig.width / 2,
    y: -(chassisConfig.height / 2),
    z: chassisConfig.length / 2 - tinyConstant,
  },
  backLeftWheel: {
    x: -(chassisConfig.width / 2),
    y: -(chassisConfig.height / 2),
    z: -(chassisConfig.length / 2 - tinyConstant),
  },
  backRightWheel: {
    x: chassisConfig.width / 2,
    y: -(chassisConfig.height / 2),
    z: -(chassisConfig.length / 2 - tinyConstant),
  },
};

export const wheelPidConfig = {
  proportionalGain: 27,
  integralGain: 8,
  derivativeGain: 40,
};

export const wheelMeshConfig: Omit<MotorConfig['mesh'], 'url'> = {
  width: 0.028,
  height: 0.0575,
  length: 0.0575,
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


export const colorSensorConfig: { displacement: SimpleVector, config: ColorSensorConfig } = {
  displacement: {
    x: 0.04,
    y: -(chassisConfig.height / 2),
    z: 0.01,
  },
  config: {
    size: {
      height: 16,
      width: 16,
    },
    camera: {
      type: 'perspective',
      aspect: 1,
      fov: 10,
      near: 0.01,
      far: 1,
    },
    tickRateInSeconds: 0.1,
    debug: true,
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
