import { Vector3 } from "three";
import {
  ARObject,
  CubeObject,
  LightObject,
  SphereObject,
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
import type { UIBasicComponent } from "./libraries/object_state_library/ui_component/UIComponent";
import UIRowComponent, {
  VerticalAlignment,
} from "./libraries/object_state_library/ui_component/UIRowComponent";
import UIColumnComponent, {
  HorizontalAlignment,
} from "./libraries/object_state_library/ui_component/UIColumnComponent";
import UITextComponent from "./libraries/object_state_library/ui_component/UITextComponent";
import UIImageComponent from "./libraries/object_state_library/ui_component/UIImageComponent";
import { callARCallback } from "./AR";

// Objects

export function createCubeObject(
  position: Vector3,
  width: number,
  height: number,
  depth: number,
  color: number,
  onSelect?: () => {}
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
    (_: ARObject) => {
      onSelect?.();
    }
  );
}

export function createSphereObject(
  position: Vector3,
  radius: number,
  color: number,
  onSelect?: () => {}
): SphereObject {
  return new SphereObject(
    uniqid(),
    position,
    radius,
    color,
    undefined,
    undefined,
    undefined,
    (_: ARObject) => {
      onSelect?.();
    }
  );
}

export function createInterfaceObject(
  position: Vector3,
  rootComponent: UIBasicComponent,
  onSelect?: () => {}
): UIObject {
  return new UIObject(
    uniqid(),
    position,
    rootComponent.toJSON(),
    undefined,
    undefined,
    undefined,
    (_: ARObject) => {
      onSelect?.();
    }
  );
}

export function createLightObject(
  position: Vector3,
  intensity: number
): LightObject {
  return new LightObject(uniqid(), position, intensity);
}

// Interface

export function createInterfaceRow(
  children: UIBasicComponent[],
  verticalAlignment: VerticalAlignment,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number,
  backgroundColor: number
): UIRowComponent {
  return new UIRowComponent({
    children: children,
    verticalAlignment: verticalAlignment,
    padding: {
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
    },
    background: backgroundColor,
    id: uniqid(),
  });
}

export function createInterfaceColumn(
  children: UIBasicComponent[],
  horizontalAlignment: HorizontalAlignment,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number,
  backgroundColor: number
): UIColumnComponent {
  return new UIColumnComponent({
    children: children,
    horizontalAlignment: horizontalAlignment,
    padding: {
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
    },
    background: backgroundColor,
    id: uniqid(),
  });
}

export function createInterfaceText(
  text: string,
  textSize: number,
  textWidth: number,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number,
  color: number
): UITextComponent {
  return new UITextComponent({
    text: text,
    textSize: textSize,
    textWidth: textWidth,
    padding: {
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
    },
    color: color,
    id: uniqid(),
  });
}

export function createInterfaceImage(
  src: string,
  imageWidth: number,
  imageHeight: number,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number
): UIImageComponent {
  return new UIImageComponent({
    src: src,
    imageWidth: imageWidth,
    imageHeight: imageHeight,
    padding: {
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
    },
    id: uniqid(),
  });
}

// Rotation

export function setFixedRotation(object: ARObject, radians: number) {
  object.behaviours.rotation = new FixRotation(radians);
  callARCallback();
}

export function setRotateToUser(object: ARObject) {
  object.behaviours.rotation = new RotateToUser();
  callARCallback();
}

export function setRotateAroundY(object: ARObject) {
  object.behaviours.rotation = new RotateAroundY();
  callARCallback();
}

// Render

export function setAlwaysRender(object: ARObject) {
  object.behaviours.render = new AlwaysRender();
  callARCallback();
}

export function setRenderDistance(object: ARObject, distance: number) {
  object.behaviours.render = new RenderWithinDistance(distance);
  callARCallback();
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
  callARCallback();
}

export function setOrbitMovement(
  object: ARObject,
  radius: number,
  duration: number
) {
  object.behaviours.movement = new OrbitMovement(radius, duration);
  callARCallback();
}

export function setSpringMovement(object: ARObject) {
  object.behaviours.movement = new SpringMovement();
  callARCallback();
}

export function clearMovement(object: ARObject) {
  object.behaviours.movement = undefined;
  callARCallback();
}
