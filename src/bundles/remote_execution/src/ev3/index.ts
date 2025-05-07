import { Chapter } from 'js-slang/dist/types';

const ev3DeviceType = {
  id: 'EV3',
  name: 'Lego Mindstorms EV3',
  // This list must be in the same order as the list here:
  // https://github.com/source-academy/sinter/blob/master/devices/ev3/src/ev3_functions.c#L891
  internalFunctions: [
    'ev3_pause',
    'ev3_connected',
    'ev3_motorA',
    'ev3_motorB',
    'ev3_motorC',
    'ev3_motorD',
    'ev3_motorGetSpeed',
    'ev3_motorSetSpeed',
    'ev3_motorStart',
    'ev3_motorStop',
    'ev3_motorSetStopAction',
    'ev3_motorGetPosition',
    'ev3_runForTime',
    'ev3_runToAbsolutePosition',
    'ev3_runToRelativePosition',
    'ev3_colorSensor',
    'ev3_colorSensorRed',
    'ev3_colorSensorGreen',
    'ev3_colorSensorBlue',
    'ev3_reflectedLightIntensity',
    'ev3_ambientLightIntensity',
    'ev3_colorSensorGetColor',
    'ev3_ultrasonicSensor',
    'ev3_ultrasonicSensorDistance',
    'ev3_gyroSensor',
    'ev3_gyroSensorAngle',
    'ev3_gyroSensorRate',
    'ev3_touchSensor1',
    'ev3_touchSensor2',
    'ev3_touchSensor3',
    'ev3_touchSensor4',
    'ev3_touchSensorPressed',
    'ev3_hello',
    'ev3_waitForButtonPress',
    'ev3_speak',
    'ev3_playSequence',
    'ev3_ledLeftGreen',
    'ev3_ledLeftRed',
    'ev3_ledRightGreen',
    'ev3_ledRightRed',
    'ev3_ledGetBrightness',
    'ev3_ledSetBrightness'
  ],
  languageChapter: Chapter.SOURCE_3
};

export default ev3DeviceType;
