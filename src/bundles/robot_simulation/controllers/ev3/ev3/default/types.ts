import type { SimpleVector } from '../../../../engine/Math/Vector';
import type { ChassisWrapper, ChassisWrapperConfig } from '../../components/Chassis';
import type { Mesh, MeshConfig } from '../../components/Mesh';
import type { Motor, MotorConfig } from '../../components/Motor';
import type { Wheel, WheelConfig } from '../../components/Wheel';
import type { ColorSensor, ColorSensorConfig } from '../../sensor/ColorSensor';
import type { UltrasonicSensor, UltrasonicSensorConfig } from '../../sensor/UltrasonicSensor';

// ######################### Controller Types #########################
// Wheels
export const wheelNames = [
  'frontLeftWheel',
  'frontRightWheel',
  'backLeftWheel',
  'backRightWheel',
] as const;
export type WheelNames = (typeof wheelNames)[number];
export type WheelControllers = Record<WheelNames, Wheel>;

// Motors
export const motorNames = ['leftMotor', 'rightMotor'] as const;
export type MotorNames = (typeof motorNames)[number];
export type MotorControllers = Record<MotorNames, Motor>;

// Chassis
export const chassisNames = ['chassis'] as const;
export type ChassisNames = (typeof chassisNames)[number];
export type ChassisControllers = Record<ChassisNames, ChassisWrapper>;

// Mesh
export const meshNames = ['mesh'] as const;
export type MeshNames = (typeof meshNames)[number];
export type MeshControllers = Record<MeshNames, Mesh>;

// ColorSensor
export const colorSensorNames = ['colorSensor'] as const;
export type ColorSensorNames = (typeof colorSensorNames)[number];
export type ColorSensorControllers = Record<ColorSensorNames, ColorSensor>;

// UltrasonicSensor
export const ultrasonicSensorNames = ['ultrasonicSensor'] as const;
export type UltrasonicSensorNames = (typeof ultrasonicSensorNames)[number];
export type UltrasonicSensorControllers = Record<
UltrasonicSensorNames,
UltrasonicSensor
>;

// Aggregate
export const controllerNames = [
  ...wheelNames,
  ...motorNames,
  ...chassisNames,
  ...meshNames,
  ...colorSensorNames,
  ...ultrasonicSensorNames,
] as const;
export type DefaultEv3ControllerNames = (typeof controllerNames)[number];
export type DefaultEv3Controller = WheelControllers &
MotorControllers &
ColorSensorControllers &
UltrasonicSensorControllers &
ChassisControllers &
MeshControllers;


// ######################### Config Types #########################
export type Ev3ChassisConfig = ChassisWrapperConfig;
export type Ev3MeshConfig = MeshConfig;
export type Ev3WheelsConfig = {
  displacements: Record<WheelNames, SimpleVector>;
  config: Omit<WheelConfig, 'displacement'>;
};
export type Ev3MotorsConfig = {
  displacements: Record<MotorNames, SimpleVector>;
  config: Omit<MotorConfig, 'displacement'>;
};
export type Ev3ColorSensorConfig = ColorSensorConfig;
export type Ev3UltrasonicSenorConfig = UltrasonicSensorConfig;

export type Ev3Config = {
  chassis: Ev3ChassisConfig
  mesh: Ev3MeshConfig;
  wheels: Ev3WheelsConfig;
  motors: Ev3MotorsConfig;
  colorSensor: Ev3ColorSensorConfig;
  ultrasonicSensor: Ev3UltrasonicSenorConfig;
};
