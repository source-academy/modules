require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      });
    }
    return to;
  };
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var remote_execution_exports = {};
  __export(remote_execution_exports, {
    EV3: () => ev3_default
  });
  var import_types = __require("js-slang/dist/types");
  var ev3DeviceType = {
    id: "EV3",
    name: "Lego Mindstorms EV3",
    internalFunctions: ["ev3_pause", "ev3_connected", "ev3_motorA", "ev3_motorB", "ev3_motorC", "ev3_motorD", "ev3_motorGetSpeed", "ev3_motorSetSpeed", "ev3_motorStart", "ev3_motorStop", "ev3_motorSetStopAction", "ev3_motorGetPosition", "ev3_runForTime", "ev3_runToAbsolutePosition", "ev3_runToRelativePosition", "ev3_colorSensor", "ev3_colorSensorRed", "ev3_colorSensorGreen", "ev3_colorSensorBlue", "ev3_reflectedLightIntensity", "ev3_ambientLightIntensity", "ev3_colorSensorGetColor", "ev3_ultrasonicSensor", "ev3_ultrasonicSensorDistance", "ev3_gyroSensor", "ev3_gyroSensorAngle", "ev3_gyroSensorRate", "ev3_touchSensor1", "ev3_touchSensor2", "ev3_touchSensor3", "ev3_touchSensor4", "ev3_touchSensorPressed", "ev3_hello", "ev3_waitForButtonPress", "ev3_speak", "ev3_playSequence", "ev3_ledLeftGreen", "ev3_ledLeftRed", "ev3_ledRightGreen", "ev3_ledRightRed", "ev3_ledGetBrightness", "ev3_ledSetBrightness"],
    languageChapter: import_types.Chapter.SOURCE_3
  };
  var ev3_default = ev3DeviceType;
  return __toCommonJS(remote_execution_exports);
}