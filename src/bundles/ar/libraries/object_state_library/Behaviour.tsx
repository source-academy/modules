import {
  BufferGeometry,
  Material,
  type NormalBufferAttributes,
  Vector3,
} from 'three';
import { UIBasicComponent } from './ui_component/UIComponent';
import { parseVector3 } from '../calibration_library/Misc';

export type Behaviours = {
  model: ModelClass;
  render?: RenderClass;
  rotation?: RotationClass;
  movement?: MovementClass;
};

export interface Behaviour {}

// Model

/**
 * Base class for a model behaviour.
 */
export abstract class ModelClass implements Behaviour {}

/**
 * Behaviour for a glTF model.
 *
 * @param resource Path to glTF file
 * @param scale Scale to render model
 */
export class GltfModel implements ModelClass {
  resource: string;
  scale: Vector3;
  callAnimation?: (actionName: string) => void;
  constructor(resource: string, scale: Vector3) {
    this.resource = resource;
    this.scale = scale;
  }
}

/**
 * Behaviour for ThreeJS shapes model.
 *
 * @param geometry ThreeJS geometry
 * @param material ThreeJS material
 */
export class ShapeModel implements ModelClass {
  geometry: BufferGeometry<NormalBufferAttributes> | undefined;
  material: Material | Material[] | undefined;
  constructor(
    geometry: BufferGeometry<NormalBufferAttributes> | undefined,
    material: Material | Material[] | undefined
  ) {
    this.geometry = geometry;
    this.material = material;
  }
}

export class TextModel implements ModelClass {
  text: string;
  width: number;
  constructor(text: string, width: number) {
    this.text = text;
    this.width = width;
  }
}

export class ImageModel implements ModelClass {
  src: string;
  width: number;
  height: number;
  constructor(src: string, width: number, height: number) {
    this.src = src;
    this.width = width;
    this.height = height;
  }
}

export class InterfaceModel implements ModelClass {
  uiJson: UIBasicComponent | undefined;
  constructor(uiJson: any) {
    this.uiJson = uiJson;
  }
}

export class LightModel implements ModelClass {
  intensity: number;
  constructor(intensity: number) {
    this.intensity = intensity;
  }
}

// Render

const RENDER_DISTANCE = 'RenderWithinDistance';
const RENDER_ALWAYS = 'AlwaysRender';

export function parseRender(render: any): RenderClass | undefined {
  if (!render) return undefined;
  switch (render.type) {
    case RENDER_ALWAYS: {
      return new AlwaysRender();
    }
    case RENDER_DISTANCE: {
      let distance = 5;
      if (typeof render.distance === 'number') {
        distance = render.distance as number;
      }
      return new RenderWithinDistance(distance);
    }
  }
  return undefined;
}

export abstract class RenderClass implements Behaviour {
  type: string = '';
}

export class RenderWithinDistance implements RenderClass {
  type = RENDER_DISTANCE;
  distance: number;
  constructor(distance: number) {
    this.distance = distance;
  }
}

export class AlwaysRender implements RenderClass {
  type = RENDER_ALWAYS;
}

// Rotation

const ROTATION_USER = 'RotateToUser';
const ROTATION_Y = 'RotateAroundY';
const ROTATION_FIX = 'FixRotation';

export function parseRotation(rotation: any): RotationClass | undefined {
  if (!rotation) return undefined;
  switch (rotation?.type) {
    case ROTATION_USER: {
      return new RotateToUser();
    }
    case ROTATION_Y: {
      return new RotateAroundY();
    }
    case ROTATION_FIX: {
      let angle = 0;
      if (typeof rotation.rotation === 'number') {
        angle = rotation.rotation as number;
      }
      return new FixRotation(angle);
    }
  }
  return undefined;
}

/**
 * Base class for a rotation behaviour.
 */
export abstract class RotationClass implements Behaviour {
  type: string = '';
}

/**
 * Behaviour where object will always rotate to the user.
 */
export class RotateToUser implements RotationClass {
  type = ROTATION_USER;
}

/**
 * Behaviour where object will keep spinning around the y-axis.
 */
export class RotateAroundY implements RotationClass {
  type = ROTATION_Y;
}

/**
 * Behaviour where object will stay in a fixed rotation.
 */
export class FixRotation implements RotationClass {
  type = ROTATION_FIX;
  rotation: number;
  constructor(radians: number) {
    this.rotation = radians;
  }
}

// Movement

const MOVEMENT_PATH = 'PathMovement';
const MOVEMENT_ORBIT = 'OrbitMovement';
const MOVEMENT_SPRING = 'SpringMovement';

export function parseMovement(movement: any, getCurrentTime?: () => number) {
  if (!movement) return undefined;
  switch (movement.type) {
    case MOVEMENT_PATH: {
      let startTime = movement.startTime;
      let pathItems = movement.path;
      if (
        (startTime === undefined || typeof startTime === 'number') &&
        Array.isArray(pathItems)
      ) {
        let parsedPathItems = parsePathItems(pathItems);
        return new PathMovement(parsedPathItems, startTime, getCurrentTime);
      }
      break;
    }
    case MOVEMENT_ORBIT: {
      let radius = movement.radius;
      let duration = movement.duration;
      let startTime = movement.startTime;
      if (
        typeof radius === 'number' &&
        typeof duration === 'number' &&
        (startTime === undefined || typeof startTime === 'number')
      ) {
        return new OrbitMovement(radius, duration, startTime, getCurrentTime);
      }
      break;
    }
    case MOVEMENT_SPRING:
      return new SpringMovement();
  }
  return undefined;
}

/**
 * Base class for a movement behaviour.
 *
 * @param startTime Reference time for the start of movement, for syncing
 */
export abstract class MovementClass implements Behaviour {
  type: string = '';
}

/**
 * Defines movement in a straight line for a path.
 */
export type PathItem = {
  start: Vector3;
  end: Vector3;
  duration: number;
  style: MovementStyle;
};

function parsePathItems(path: any[]) {
  let result: PathItem[] = [];
  for (let i = 0; i < path.length; i++) {
    let item = path[i];
    let start = parseVector3(item.start);
    let end = parseVector3(item.end);
    let duration = item.duration;
    if (
      start instanceof Vector3 &&
      end instanceof Vector3 &&
      (duration === undefined || typeof duration === 'number')
    ) {
      let movementStyle = MovementStyle.Linear;
      if (item.style === MovementStyle.FastToSlow) {
        movementStyle = MovementStyle.FastToSlow;
      } else if (item.style === MovementStyle.SlowToFast) {
        movementStyle = MovementStyle.SlowToFast;
      }
      result.push({
        start: start,
        end: end,
        duration: duration,
        style: movementStyle,
      });
    }
  }
  return result;
}

export enum MovementStyle {
  Linear,
  FastToSlow,
  SlowToFast,
}

/**
 * Behaviour where the object moves in the defined path.
 * Cycles through the path array repeatedly.
 *
 * @param path Array of path items defining movement of object
 * @param startTime Reference time for the start of movement, for syncing
 */
export class PathMovement extends MovementClass {
  type = MOVEMENT_PATH;
  path: PathItem[];
  totalDuration: number;
  startTime: number;
  getCurrentTime: () => number;
  constructor(
    path: PathItem[],
    startTime?: number,
    getCurrentTime?: () => number
  ) {
    super();
    this.path = path;
    this.totalDuration = 0;
    if (startTime) {
      this.startTime = startTime;
    } else {
      this.startTime = new Date().getTime();
    }
    if (getCurrentTime) {
      this.getCurrentTime = getCurrentTime;
    } else {
      this.getCurrentTime = () => new Date().getTime();
    }
    path.forEach((item) => {
      this.totalDuration += item.duration;
    });
  }

  public getOffsetPosition(position: Vector3) {
    let currentFrame =
      (this.getCurrentTime() - this.startTime) % (this.totalDuration * 1000);
    let currentMovementIndex = 0;
    while (currentFrame > 0 && currentMovementIndex < this.path.length) {
      let currentItem = this.path[currentMovementIndex];
      if (currentFrame >= currentItem.duration * 1000) {
        currentFrame -= currentItem.duration * 1000;
        currentMovementIndex++;
        continue;
      }
      let ratio = Math.min(
        Math.max(0, currentFrame / (currentItem.duration * 1000)),
        1
      );
      switch (currentItem.style) {
        case MovementStyle.SlowToFast: {
          ratio = Math.pow(ratio, 5);
          break;
        }
        case MovementStyle.FastToSlow: {
          let negative = 1 - ratio;
          negative = Math.pow(negative, 5);
          ratio = 1 - negative;
          break;
        }
      }
      let x =
        position.x +
        currentItem.start.x +
        ratio * (currentItem.end.x - currentItem.start.x);
      let y =
        position.y +
        currentItem.start.y +
        ratio * (currentItem.end.y - currentItem.start.y);
      let z =
        position.z +
        currentItem.start.z +
        ratio * (currentItem.end.z - currentItem.start.z);
      return new Vector3(x, y, z);
    }
    return position;
  }
}

/**
 * Behaviour where the object orbits around its position at a specified radius.
 *
 * @param radius Radius of orbit
 * @param duration Duration of a single orbit
 * @param startTime Reference time for the start of movement, for syncing
 */
export class OrbitMovement extends MovementClass {
  type = MOVEMENT_ORBIT;
  radius: number;
  duration: number;
  startTime: number;
  getCurrentTime: () => number;
  constructor(
    radius: number,
    duration: number,
    startTime?: number,
    getCurrentTime?: () => number
  ) {
    super();
    this.radius = radius;
    this.duration = duration;
    if (startTime) {
      this.startTime = startTime;
    } else {
      this.startTime = new Date().getTime();
    }
    if (getCurrentTime) {
      this.getCurrentTime = getCurrentTime;
    } else {
      this.getCurrentTime = () => new Date().getTime();
    }
  }
  public getOffsetPosition(position: Vector3) {
    let currentFrame =
      (this.getCurrentTime() - this.startTime) % (this.duration * 1000);
    let ratio = Math.min(Math.max(0, currentFrame / (this.duration * 1000)), 1);
    let angle = ratio * Math.PI * 2;
    let x = position.x + this.radius * Math.sin(angle);
    let y = position.y;
    let z = position.z + this.radius * Math.cos(angle);
    return new Vector3(x, y, z);
  }
}

export class SpringMovement extends MovementClass {
  type = MOVEMENT_SPRING;
}
