import type {
  Ev3ChassisConfig,
  Ev3ColorSensorConfig,
  Ev3Config,
  Ev3MeshConfig,
  Ev3MotorsConfig,
  Ev3UltrasonicSenorConfig,
  Ev3WheelsConfig,
} from './types';

const noRotation = {
  x: 0,
  y: 0,
  z: 0,
  w: 1,
};

const tinyConstant = 0.012;

export const chassisConfig: Ev3ChassisConfig = {
  orientation: {
    position: {
      x: 0,
      y: 0.0775,
      z: 0,
    },
    rotation: noRotation,
  },
  dimension: {
    height: 0.095,
    width: 0.145,
    length: 0.18,
  },
  mass: 0.6,
  type: 'dynamic',
  debug: true,
};

export const meshConfig: Ev3MeshConfig = {
  url: 'https://keen-longma-3c1be1.netlify.app/6_remove_wheels.gltf',
  dimension: chassisConfig.dimension,
  offset: {
    y: 0.02,
  },
};

export const wheelConfig: Ev3WheelsConfig = {
  displacements: {
    frontLeftWheel: {
      x: -(chassisConfig.dimension.width / 2),
      y: -(chassisConfig.dimension.height / 2),
      z: chassisConfig.dimension.length / 2 - tinyConstant,
    },

    frontRightWheel: {
      x: chassisConfig.dimension.width / 2,
      y: -(chassisConfig.dimension.height / 2),
      z: chassisConfig.dimension.length / 2 - tinyConstant,
    },
    backLeftWheel: {
      x: -(chassisConfig.dimension.width / 2),
      y: -(chassisConfig.dimension.height / 2),
      z: -(chassisConfig.dimension.length / 2 - tinyConstant),
    },
    backRightWheel: {
      x: chassisConfig.dimension.width / 2,
      y: -(chassisConfig.dimension.height / 2),
      z: -(chassisConfig.dimension.length / 2 - tinyConstant),
    },
  },
  config: {
    pid: {
      proportionalGain: 27,
      integralGain: 8,
      derivativeGain: 40,
    },
    gapToFloor: 0.03,
    maxRayDistance: 0.05,
    debug: true,
  },
};

export const motorConfig: Ev3MotorsConfig = {
  config: {
    pid: {
      proportionalGain: 0.25,
      derivativeGain: 0,
      integralGain: 0,
    },
    mesh: {
      dimension: {
        width: 0.028,
        height: 0.0575,
        length: 0.0575,
      },
      url: 'https://keen-longma-3c1be1.netlify.app/6_wheel.gltf',
    },
  },
  displacements: {
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
  },
};

export const colorSensorConfig: Ev3ColorSensorConfig = {
  tickRateInSeconds: 0.1,
  displacement: {
    x: 0.04,
    y: -(chassisConfig.dimension.height / 2),
    z: 0.01,
  },
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
  debug: true,
};

const ultrasonicSensorConfig: Ev3UltrasonicSenorConfig = {
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

export const ev3Config: Ev3Config = {
  chassis: chassisConfig,
  motors: motorConfig,
  wheels: wheelConfig,
  colorSensor: colorSensorConfig,
  ultrasonicSensor: ultrasonicSensorConfig,
  mesh: meshConfig,
};
