import { Vector3 } from "three";
import { ARObject } from "./libraries/object_state_library/ARObject";
import { OverlayHelper, Toggle } from "./OverlayHelper";

export class ARState {
  arObjects: ARObject[] = [];
  overlay = new OverlayHelper();
}

export function initAR() {
  (window as any).arController = new ARState();
}

export function getModuleState(): ARState {
  return (window as any).arController as ARState;
}

export function callARCallback() {
  let f = (window as any).arControllerCallback as Function;
  if (f) {
    f();
  }
}

// Overlay

export function setLeftToggle(text: string, callback: () => void) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleLeft = new Toggle(text, callback);
}

export function setCenterToggle(text: string, callback: () => void) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleCenter = new Toggle(text, callback);
}

export function setRightToggle(text: string, callback: () => void) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleRight = new Toggle(text, callback);
}

export function removeLeftToggle() {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleLeft = undefined;
}

export function removeCenterToggle() {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleCenter = undefined;
}

export function removeRightToggle() {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.overlay.toggleRight = undefined;
}

// Objects

export function createVector3(x: number, y: number, z: number): Vector3 {
  return new Vector3(x, y, z);
}

export function addARObject(object: ARObject) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  if (
    moduleState.arObjects.find((item) => {
      return item.id === object.id;
    })
  ) {
    return; // Already in array
  }
  let newArray = Object.assign([], moduleState.arObjects);
  newArray.push(object);
  moduleState.arObjects = newArray;
  callARCallback();
}

export function removeARObject(object: ARObject) {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.arObjects = moduleState.arObjects.filter((item) => {
    return item.id !== object.id;
  });
  callARCallback();
}

export function clearARObjects() {
  let moduleState = getModuleState();
  if (!moduleState) return;
  moduleState.arObjects = [];
  callARCallback();
}

