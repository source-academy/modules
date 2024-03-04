/**
 * Module for creating and interacting with augmented reality content.
 *
 * Allows starting of an XR context within Source Academy.
 * Currently only works on Android.
 * Desktop version of Chrome can be used to run an emulator via WebXR API Emulator plugin.
 * @module ar
 * @author Chong Wen Hao
 */

import { HorizontalAlignment } from './libraries/object_state_library/ui_component/UIColumnComponent';
import { VerticalAlignment } from './libraries/object_state_library/ui_component/UIRowComponent';

/*
  To access things like the context or module state you can just import the context
  using the import below
 */

export {
  initAR,
  setLeftToggle,
  setCenterToggle,
  setRightToggle,
  removeLeftToggle,
  removeCenterToggle,
  removeRightToggle,
  createVector3,
  addARObject,
  removeARObject,
  getARObjectsJsonString,
  setARObjectsFromJsonString,
  clearARObjects,
  getXPosition,
  getYPosition,
  getZPosition,
  moveARObject,
} from './AR';

export {
  createCubeObject,
  createSphereObject,
  createGltfObject,
  createInterfaceObject,
  createLightObject,
  createInterfaceRow,
  createInterfaceColumn,
  createInterfaceText,
  createInterfaceImage,
  createInterfaceBase64Image,
  setFixedRotation,
  setRotateToUser,
  setRotateAroundY,
  setAlwaysRender,
  setRenderDistance,
  createPathItem,
  setPathMovement,
  setOrbitMovement,
  setSpringMovement,
  clearMovement,
} from './ObjectsHelper';

export const alignmentTop = VerticalAlignment.Top;
export const alignmentMiddle = VerticalAlignment.Middle;
export const alignmentBottom = VerticalAlignment.Bottom;

export const alignmentLeft = HorizontalAlignment.Left;
export const alignmentCenter = HorizontalAlignment.Center;
export const alignmentRight = HorizontalAlignment.Right;
