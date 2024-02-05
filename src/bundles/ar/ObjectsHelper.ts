import { Vector3 } from "three";
import {
  ARObject,
  CubeObject,
  LightObject,
  UIObject,
} from "./libraries/object_state_library/ARObject";
import {
  AlwaysRender,
  FixRotation,
  MovementStyle,
  OrbitMovement,
  type PathItem,
  PathMovement,
  RenderWithinDistance,
  RotateAroundY,
  RotateToUser,
  SpringMovement,
} from "./libraries/object_state_library/Behaviour";
import uniqid from "uniqid";

// Objects

export function createCubeObject(
  position: Vector3,
  width: number,
  height: number,
  depth: number,
  color: number,
  onSelect?: (object: ARObject) => {}
): CubeObject {
  return new CubeObject(
    uniqid(),
    position,
    width,
    height,
    depth,
    color,
    undefined,
    undefined,
    undefined,
    onSelect
  );
}

export function createInterfaceObject(
  position: Vector3,
  uiJson: any,
  onSelect?: (object: ARObject) => {}
): UIObject {
  return new UIObject(
    uniqid(),
    position,
    uiJson,
    undefined,
    undefined,
    undefined,
    onSelect
  );
}

export function createLightObject(
  position: Vector3,
  intensity: number
): LightObject {
  return new LightObject(uniqid(), position, intensity);
}

// Rotation

export function setFixedRotation(object: ARObject, radians: number) {
  object.behaviours.rotation = new FixRotation(radians);
}

export function setRotateToUser(object: ARObject) {
  object.behaviours.rotation = new RotateToUser();
}

export function setRotateAroundY(object: ARObject) {
  object.behaviours.rotation = new RotateAroundY();
}

// Render

export function setAlwaysRender(object: ARObject) {
  object.behaviours.render = new AlwaysRender();
}

export function setRenderDistance(object: ARObject, distance: number) {
  object.behaviours.render = new RenderWithinDistance(distance);
}

// Movement

export function createPathItem(
  start: Vector3,
  end: Vector3,
  duration: number
): PathItem {
  return {
    start: start,
    end: end,
    duration: duration,
    style: MovementStyle.Linear,
  };
}

export function setPathMovement(object: ARObject, path: PathItem[]) {
  object.behaviours.movement = new PathMovement(path);
}

export function setOrbitMovement(
  object: ARObject,
  radius: number,
  duration: number
) {
  object.behaviours.movement = new OrbitMovement(radius, duration);
}

export function setSpringMovement(object: ARObject) {
  object.behaviours.model = new SpringMovement();
}

