/**
 * Module for creating and interacting with augmented reality content.
 *
 * Allows starting of an XR context within Source Academy.
 * Currently only works on Android.
 * Desktop version of Chrome can be used to run an emulator via WebXR API Emulator plugin.
 * @module ar
 * @author Chong Wen Hao
 */

/*
  To access things like the context or module state you can just import the context
  using the import below
 */

export {
  setLeftToggle,
  setCentreToggle,
  setRightToggle,
  removeLeftToggle,
  removeCentreToggle,
  removeRightToggle,
  createVector3,
  addARObject,
  removeARObject,
  clearARObjects,
} from "./AR";

export {
  createCubeObject,
  createInterfaceObject,
  createLightObject,
  setFixedRotation,
  setRotateToUser,
  setRotateAroundY,
  setAlwaysRender,
  setRenderDistance,
  createPathItem,
  setPathMovement,
  setOrbitMovement,
  setSpringMovement,
} from "./ObjectsHelper";
