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

/**
 * Creates an instance of an AR cube object.
 *
 * @param position Position of object in augmented world.
 * @param width Width of the cube in metres.
 * @param height Height of the cube in metres.
 * @param depth Depth of the cube in metres.
 * @param color Decimal representation of hex color.
 * @param onSelect Function to call when object is tapped.
 * @returns Created AR cube object.
 */
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

/**
 * Creates an instance of an AR sphere object.
 *
 * @param position Position of object in augmented world.
 * @param radius Radius of sphere in metres.
 * @param color Decimal representation of hex color.
 * @param onSelect Function to call when object is tapped.
 * @returns Created AR sphere object.
 */
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

/**
 * Creates an instance of AR user interface.
 * Build it with `createInterfaceRow`, `createInterfaceColumn`, `createInterfaceText` and `createInterfaceImage`.
 *
 * @param position Position of object in augmented world.
 * @param rootComponent Root UI component containing other components. Can be row, column, image or text.
 * @param onSelect Function to call when object is tapped.
 * @returns Created AR interface object.
 */
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

/**
 * Creates an instance of light source in augmented world.
 * Shines in all direction from a point.
 *
 * @param position Position of object in augmented world.
 * @param intensity Intensity of light.
 * @returns Created AR light source object.
 */
export function createLightObject(
  position: Vector3,
  intensity: number
): LightObject {
  return new LightObject(uniqid(), position, intensity);
}

// Interface

/**
 * Creates a row component for UI object.
 *
 * @param children Components within this row.
 * @param verticalAlignment Vertical alignment of content. Use `alignmentTop`, `alignmentMiddle` or `alignmentBottom`.
 * @param paddingLeft Size of padding on the left.
 * @param paddingRight Size of padding on the right.
 * @param paddingTop Size of padding on the top.
 * @param paddingBottom Size of padding on the bottom.
 * @param backgroundColor Background color of row.
 * @returns Created row component.
 */
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

/**
 * Creates a row component for UI object.
 *
 * @param children Components within this column.
 * @param horizontalAlignment Horizontal alignment of content. Use `alignmentLeft`, `alignmentCenter` or `alignmentRight`.
 * @param paddingLeft Size of padding on the left.
 * @param paddingRight Size of padding on the right.
 * @param paddingTop Size of padding on the top.
 * @param paddingBottom Size of padding on the bottom.
 * @param backgroundColor Background color of column.
 * @returns Created column component.
 */
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

/**
 * Creates a text component for UI object.
 *
 * @param text Text to show.
 * @param textSize Size of text in metres.
 * @param textWidth Width of text.
 * @param paddingLeft Size of padding on the left.
 * @param paddingRight Size of padding on the right.
 * @param paddingTop Size of padding on the top.
 * @param paddingBottom Size of padding on the bottom.
 * @param color Color of text.
 * @returns Created text component.
 */
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

/**
 * Creates an image component for UI object.
 * Crops the image to the specified size.
 *
 * @param src Link to the image.
 * @param imageWidth Width of the image.
 * @param imageHeight Height of the image.
 * @param paddingLeft Size of padding on the left.
 * @param paddingRight Size of padding on the right.
 * @param paddingTop Size of padding on the top.
 * @param paddingBottom Size of padding on the bottom.
 * @returns Created interface component.
 */
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

/**
 * Fix the rotation of the object at the specified angle around the vertical axis.
 *
 * @param object Object to modifiy.
 * @param radians Rotation angle in radians.
 */
export function setFixedRotation(object: ARObject, radians: number) {
  object.behaviours.rotation = new FixRotation(radians);
  callARCallback();
}

/**
 * Always rotate the object to where the user is facing.
 *
 * @param object Object to modifiy.
 */
export function setRotateToUser(object: ARObject) {
  object.behaviours.rotation = new RotateToUser();
  callARCallback();
}

/**
 * Rotates the object continuously around the vertical axis.
 *
 * @param object Object to modifiy.
 */
export function setRotateAroundY(object: ARObject) {
  object.behaviours.rotation = new RotateAroundY();
  callARCallback();
}

// Render

/**
 * Always render the object.
 *
 * @param object Object to modifiy.
 */
export function setAlwaysRender(object: ARObject) {
  object.behaviours.render = new AlwaysRender();
  callARCallback();
}

/**
 * Only render the object when in range.
 *
 * @param object Object to modifiy.
 * @param distance Range of object in metres.
 */
export function setRenderDistance(object: ARObject, distance: number) {
  object.behaviours.render = new RenderWithinDistance(distance);
  callARCallback();
}

// Movement

/**
 * Creates an instance of a path item, to specify movement path.
 *
 * @param start Start position.
 * @param end End position
 * @param duration Duration of transition from start to end position.
 * @returns Created instance of path item.
 */
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

/**
 * Moves object in the specified path, repeat when ended.
 *
 * @param object Object to modifiy.
 * @param path Path to move. Use `createPathItem` to create a path segment.
 */
export function setPathMovement(object: ARObject, path: PathItem[]) {
  object.behaviours.movement = new PathMovement(path);
  callARCallback();
}

/**
 * Orbits the object around its current position.
 *
 * @param object Object to modifiy.
 * @param radius Radius of orbit.
 * @param duration Duration per round of orbit.
 */
export function setOrbitMovement(
  object: ARObject,
  radius: number,
  duration: number
) {
  object.behaviours.movement = new OrbitMovement(radius, duration);
  callARCallback();
}

/**
 * Animates movement when the position of the object changes.
 *
 * @param object Object to modifiy.
 */
export function setSpringMovement(object: ARObject) {
  object.behaviours.movement = new SpringMovement();
  callARCallback();
}

/**
 * Removes the movement of the object.
 *
 * @param object Object to modifiy.
 */
export function clearMovement(object: ARObject) {
  object.behaviours.movement = undefined;
  callARCallback();
}
