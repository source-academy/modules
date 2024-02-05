import { Vector3 } from "three";
import { ARObject } from "./libraries/object_state_library/ARObject";
import { OverlayHelper, Toggle } from "./OverlayHelper";

import context from "js-slang/context";

export class ARState {
  arObjects: ARObject[] = [];
  overlay = new OverlayHelper();

  constructor() {
    (window as any).arController = this;
  }
}

let moduleState = new ARState();

export function getModuleState(): ARState {
  return (window as any).arController as ARState;
}

// Overlay

export function setLeftToggle(text: string, callback: () => void) {
  moduleState.overlay.toggleLeft = new Toggle(text, callback);
}

export function setCentreToggle(text: string, callback: () => void) {
  moduleState.overlay.toggleCentre = new Toggle(text, callback);
}

export function setRightToggle(text: string, callback: () => void) {
  moduleState.overlay.toggleRight = new Toggle(text, callback);
}

export function removeLeftToggle() {
  moduleState.overlay.toggleLeft = undefined;
}

export function removeCentreToggle() {
  moduleState.overlay.toggleCentre = undefined;
}

export function removeRightToggle() {
  moduleState.overlay.toggleRight = undefined;
}

// Objects

export function createVector3(x: number, y: number, z: number): Vector3 {
  return new Vector3(x, y, z);
}

export function addARObject(object: ARObject) {
  if (
    moduleState.arObjects.find((item) => {
      item.id === object.id;
    })
  ) {
    return; // Already in array
  }
  let newArray = Object.assign([], moduleState.arObjects);
  newArray.push(object);
  moduleState.arObjects = newArray;
}

export function removeARObject(object: ARObject) {
  moduleState.arObjects = moduleState.arObjects.filter((item) => {
    item.id !== object.id;
  });
}

export function clearARObjects() {
  moduleState.arObjects = [];
}

