/**
 * Robot simulator for EV3.
 *
 * @module robot_simulation
 * @author Joel Chan
 */

export {
  ev3_motorA,
  ev3_motorB,
  ev3_motorC,
  ev3_motorD,
  ev3_runToRelativePosition,
  ev3_colorSensorRed,
  ev3_colorSensorGreen,
  ev3_pause,
  ev3_colorSensor,
  ev3_colorSensorBlue,
  ev3_ultrasonicSensor,
  ev3_ultrasonicSensorDistance,
} from './ev3_functions';

export {
  createCustomPhysics,
  createPhysics,
  createRenderer,
  init_simulation,
  createCuboid,
  createTimer,
  createWorld,
  createWall,
  createEv3,
  createPaper,
  createFloor,
  createCSE,
  addControllerToWorld,
  createRobotConsole,
  saveToContext,
} from './helper_functions';
