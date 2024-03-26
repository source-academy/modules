import { ARObject } from 'saar/libraries/object_state_library/ARObject';
import { fixSpring } from 'saar/libraries/misc/index';
import { OverlayHelper, Toggle } from './OverlayHelper';
import { Vector3 } from 'saar/libraries/misc';

export class ARState {
  arObjects: ARObject[] = [];
  highlightFrontObject: boolean = false;
  selectedObjectId: string | undefined = undefined;
  overlay = new OverlayHelper();
  clickCallbacks = new Map<string, () => void>();
  onClickCallback = (id: string) => {
    const callback = this.clickCallbacks.get(id);
    callback?.();
  };
}

// Fix issue with React Spring, but spams console log.
// https://github.com/pmndrs/react-spring/issues/1586#issuecomment-870778191
fixSpring();

/**
 * Initialize AR.
 */
export function initAR() {
  (window as any).arController = new ARState();
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
  const f = (window as any).arControllerCallback as Function;
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
  const moduleState = getModuleState();
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
  const moduleState = getModuleState();
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
  const moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleRight = new Toggle(text, callback);
}

/**
 * Resets and hides the left toggle.
 */
export function removeLeftToggle() {
  const moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleLeft = undefined;
}

/**
 * Resets and hides the center toggle.
 */
export function removeCenterToggle() {
  const moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleCenter = undefined;
}

/**
 * Resets and hides the right toggle.
 */
export function removeRightToggle() {
  const moduleState = getModuleState();
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
export function addARObject(arObject: ARObject) {
  const moduleState = getModuleState();
  if (!moduleState) return;
  if (moduleState.arObjects.find((item) => item.id === arObject.id)) {
    return; // Already in array
  }
  if (arObject.onSelect) {
    moduleState.clickCallbacks.set(arObject.id, () => {
      arObject.onSelect?.(arObject);
    });
  }
  moduleState.arObjects.push(arObject);
  callARCallback();
}

/**
 * Removes the specified object from the augmented world.
 *
 * @param arObject ARObject to remove.
 */
export function removeARObject(arObject: ARObject) {
  const moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.arObjects = moduleState.arObjects.filter(
    (item) => item.id !== arObject.id,
  );
  callARCallback();
}

/**
 * Obtains the current ARObjects.
 */
export function getARObjects(): ARObject[] {
  const moduleState = getModuleState();
  if (!moduleState) return [];
  return moduleState.arObjects;
}

/**
 * Sets AR objects from json.
 */
export function setAsARObjects(json: any) {
  const moduleState = getModuleState();
  if (!moduleState) return;
  if (!(json instanceof Object)) return;
  const objects: ARObject[] = [];
  for (const [_, item] of Object.entries(json)) {
    const parsedObject = ARObject.fromObject(item);
    if (parsedObject) {
      objects.push(parsedObject);
    }
  }
  moduleState.arObjects = objects;
  callARCallback();
}

/**
 * Removes all objects in the augmented world.
 */
export function clearARObjects() {
  const moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.arObjects = [];
  callARCallback();
}

/**
 * Obtains the position of the specified object on the x-axis.
 *
 * @param arObject AR object to check.
 * @returns Value of position on the x-axis.
 */
export function getXPosition(arObject: ARObject): number {
  return arObject.position.x;
}
/**
 * Obtains the position of the specified object on the y-axis.
 *
 * @param arObject AR object to check.
 * @returns Value of position on the y-axis.
 */
export function getYPosition(arObject: ARObject): number {
  return arObject.position.y;
}

/**
 * Obtains the position of the specified object on the z-axis.
 *
 * @param arObject AR object to check.
 * @returns Value of position on the z-axis.
 */
export function getZPosition(arObject: ARObject): number {
  return arObject.position.z;
}

/**
 * Moves the specified object to a new position.
 *
 * @param arObject AR object to move.
 * @param position Position to move to.
 */
export function moveARObject(arObject: ARObject, position: Vector3) {
  const moduleState = getModuleState();
  if (!moduleState) return;
  arObject.position = position;
  callARCallback();
}

// Highlight

/**
 * Turn on highlighting of object that the user is facing.
 *
 * @param isEnabled Whether to highlight object in front.
 */
export function setHighlightFrontObject(isEnabled: boolean) {
  const moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.highlightFrontObject = isEnabled;
  callARCallback();
}

/**
 * Updates the object in line of sight.
 *
 * @param arObject New object to set.
 */
export function setFrontObject(arObject: ARObject | undefined) {
  const moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.selectedObjectId = arObject?.id;
}

/**
 * Obtains the first object in the user's line of sight, if any.
 *
 * @returns ARObject in front of user if found, undefined if not.
 */
export function getFrontObject() {
  const moduleState = getModuleState();
  if (!moduleState) return undefined;
  return moduleState.arObjects.find(
    (arObject) => arObject.id === moduleState.selectedObjectId,
  );
}

/**
 * Sets the select state for the specified AR object.
 *
 * @param arObject AR object to select/unselect.
 * @param isSelected Whether the object is selected.
 */
export function selectObject(arObject: ARObject, isSelected: boolean) {
  arObject.isSelected = isSelected;
  callARCallback();
}

// JSON

/**
 * Obtains the value of a json object at the key.
 */
export function getJsonChild(object: any, key: string) {
  if (!(object instanceof Object)) return undefined;
  return object[key];
}
