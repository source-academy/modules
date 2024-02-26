import { Vector3 } from 'three';
import { type ARObject } from './libraries/object_state_library/ARObject';
import { OverlayHelper, Toggle } from './OverlayHelper';
import { Globals } from '@react-spring/three';

export class ARState {
  arObjects: ARObject[] = [];
  overlay = new OverlayHelper();
  clickCallbacks = new Map<string, () => void>();
}

// Fix issue with React Spring, but spams console log.
// https://github.com/pmndrs/react-spring/issues/1586#issuecomment-870778191
Globals.assign({
  frameLoop: 'always',
});

/**
 * Initialize AR.
 */
export function initAR() {
  let controller = new ARState();
  (window as any).arController = controller;
  (window as any).arOnClickCallback = (id: string) => {
    let callback = controller.clickCallbacks.get(id);
    callback?.();
  };
}

/**
 * Obtains AR module state.
 *
 * @returns Current AR state.
 */
export function getModuleState(): ARState {
  return (window as any).arController as ARState;
}

/**
 * Calls callback to update AR context in tab.
 */
export function callARCallback() {
  let f = (window as any).arControllerCallback as Function;
  if (f) {
    f();
  }
}

// Overlay

/**
 * Sets the left toggle.
 *
 * @param text Label on toggle.
 * @param callback Function to call when toggle is clicked.
 */
export function setLeftToggle(text: string, callback: () => void) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleLeft = new Toggle(text, callback);
}

/**
 * Sets the center toggle.
 *
 * @param text Label on toggle.
 * @param callback Function to call when toggle is clicked.
 */
export function setCenterToggle(text: string, callback: () => void) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleCenter = new Toggle(text, callback);
}

/**
 * Sets the right toggle.
 *
 * @param text Label on toggle.
 * @param callback Function to call when toggle is clicked.
 */
export function setRightToggle(text: string, callback: () => void) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleRight = new Toggle(text, callback);
}

/**
 * Resets and hides the left toggle.
 */
export function removeLeftToggle() {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleLeft = undefined;
}

/**
 * Resets and hides the center toggle.
 */
export function removeCenterToggle() {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleCenter = undefined;
}

/**
 * Resets and hides the right toggle.
 */
export function removeRightToggle() {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleRight = undefined;
}

// Objects

/**
 * Creates an instance of Vector3.
 *
 * @param x Value of x-axis.
 * @param y Value of y-axis.
 * @param z Value of z-axis.
 * @returns Vector3 created from specified values.
 */
export function createVector3(x: number, y: number, z: number): Vector3 {
  return new Vector3(x, y, z);
}

/**
 * Adds the specified object to the augmented world.
 *
 * @param object ARObject to add. (E.g. cube, sphere, etc..)
 */
export function addARObject(object: ARObject) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  if (moduleState.arObjects.find((item) => item.id === object.id)) {
    return; // Already in array
  }
  if (object.onSelect) {
    moduleState.clickCallbacks.set(object.id, () => {
      object.onSelect?.(object);
    });
  }
  let newArray = Object.assign([], moduleState.arObjects);
  newArray.push(object);
  moduleState.arObjects = newArray;
  callARCallback();
}

/**
 * Removes the specified object from the augmented world.
 *
 * @param object ARObject to remove.
 */
export function removeARObject(object: ARObject) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.arObjects = moduleState.arObjects.filter(
    (item) => item.id !== object.id,
  );
  callARCallback();
}

/**
 * Removes all objects in the augmented world.
 */
export function clearARObjects() {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.arObjects = [];
  callARCallback();
}

/**
 * Obtains the position of the specified object on the x-axis.
 *
 * @param object AR object to check.
 * @returns Value of position on the x-axis.
 */
export function getXPosition(object: ARObject): number {
  return object.position.x;
}
/**
 * Obtains the position of the specified object on the y-axis.
 *
 * @param object AR object to check.
 * @returns Value of position on the y-axis.
 */
export function getYPosition(object: ARObject): number {
  return object.position.y;
}

/**
 * Obtains the position of the specified object on the z-axis.
 *
 * @param object AR object to check.
 * @returns Value of position on the z-axis.
 */
export function getZPosition(object: ARObject): number {
  return object.position.z;
}

/**
 * Moves the specified object to a new position.
 *
 * @param object AR object to move.
 * @param position Position to move to.
 */
export function moveARObject(object: ARObject, position: Vector3) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  object.position = position;
  callARCallback();
}
