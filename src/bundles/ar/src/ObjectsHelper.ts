import type { Vector3 } from 'saar/libraries/misc';
import {
  CubeObject,
  GltfObject,
  LightObject,
  SphereObject,
  UIObject,
  type ARObject,
} from 'saar/libraries/object_state_library/ARObject';
import {
  AlwaysRender,
  FixRotation,
  MovementStyle,
  OrbitMovement,
  PathMovement,
  RenderWithinDistance,
  RotateAroundY,
  RotateToUser,
  SpringMovement,
  type PathItem,
} from 'saar/libraries/object_state_library/Behaviour';
import UIBase64ImageComponent from 'saar/libraries/object_state_library/ui_component/UIBase64ImageItem';
import UIColumnItem, {
  type HorizontalAlignment,
} from 'saar/libraries/object_state_library/ui_component/UIColumnItem';
import UIImageItem from 'saar/libraries/object_state_library/ui_component/UIImageItem';
import type { UIBasicItem } from 'saar/libraries/object_state_library/ui_component/UIItem';
import UIRowItem, {
  type VerticalAlignment,
} from 'saar/libraries/object_state_library/ui_component/UIRowItem';
import UITextItem from 'saar/libraries/object_state_library/ui_component/UITextItem';
import uniqid from 'uniqid';
import { callARCallback } from './AR';

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
  onSelect?: () => any
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
    },
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
  onSelect?: () => any
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
    },
  );
}

/**
 * Creates an instance of 3D object with GLTF model.
 * Build it with `createInterfaceRow`, `createInterfaceColumn`, `createInterfaceText` and `createInterfaceImage`.
 *
 * @param position Position of object in augmented world.
 * @param src URL of GLTF resources.
 * @param scale Scale of loaded object.
 * @param onSelect Function to call when object is tapped.
 * @returns Created AR interface object.
 */
export function createGltfObject(
  position: Vector3,
  src: string,
  scale: number,
  onSelect?: () => any,
): GltfObject {
  return new GltfObject(
    uniqid(),
    position,
    src,
    scale,
    undefined,
    undefined,
    undefined,
    (_: ARObject) => {
      onSelect?.();
    },
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
  rootComponent: UIBasicItem,
  onSelect?: () => any
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
    },
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
  intensity: number,
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
  children: UIBasicItem[],
  verticalAlignment: VerticalAlignment,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number,
  backgroundColor: number,
): UIRowItem {
  return new UIRowItem({
    children,
    verticalAlignment,
    padding: {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    },
    backgroundColor,
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
  children: UIBasicItem[],
  horizontalAlignment: HorizontalAlignment,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number,
  backgroundColor: number,
): UIColumnItem {
  return new UIColumnItem({
    children,
    horizontalAlignment,
    padding: {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    },
    backgroundColor,
    id: uniqid(),
  });
}

/**
 * Creates a text component for UI object.
 *
 * @param text Text to show.
 * @param textSize Size of text in metres.
 * @param textWidth Width of text.
 * @param textAlign Horizontal alignment of text. Use `alignmentLeft`, `alignmentCenter` or `alignmentRight`.
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
  textAlign: HorizontalAlignment,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number,
  color: number,
): UITextItem {
  return new UITextItem({
    text,
    textSize,
    textWidth,
    textAlign,
    padding: {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    },
    color,
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
  paddingBottom: number,
): UIImageItem {
  return new UIImageItem({
    src,
    imageWidth,
    imageHeight,
    padding: {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    },
    id: uniqid(),
  });
}

/**
 * Creates an image component for UI object, using Base64 string.
 * Crops the image to the specified size.
 *
 * @param base64 Base64 string containing the image.
 * @param imageWidth Width of the image.
 * @param imageHeight Height of the image.
 * @param paddingLeft Size of padding on the left.
 * @param paddingRight Size of padding on the right.
 * @param paddingTop Size of padding on the top.
 * @param paddingBottom Size of padding on the bottom.
 * @returns Created interface component.
 */
export function createInterfaceBase64Image(
  base64: string,
  imageWidth: number,
  imageHeight: number,
  paddingLeft: number,
  paddingRight: number,
  paddingTop: number,
  paddingBottom: number,
): UIBase64ImageComponent {
  return new UIBase64ImageComponent({
    base64,
    imageWidth,
    imageHeight,
    padding: {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
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
  duration: number,
): PathItem {
  return {
    start,
    end,
    duration,
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
  duration: number,
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
