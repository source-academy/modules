import {
  type BufferGeometry,
  type Material,
  type NormalBufferAttributes,
  Vector3,
} from 'three';
import { type UIBasicItem } from './ui_component/UIItem';
import { parseVector3 } from './Misc';

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
  scale: number;
  callAnimation?: (actionName: string) => void;
  constructor(resource: string, scale: number) {
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
    material: Material | Material[] | undefined,
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
  rootComponent: UIBasicItem | undefined;
  constructor(rootComponent: any) {
    this.rootComponent = rootComponent;
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

// Rotation

const ROTATION_USER = 'RotateToUser';
const ROTATION_Y = 'RotateAroundY';
const ROTATION_FIX = 'FixRotation';

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

// Movement

const MOVEMENT_PATH = 'PathMovement';
const MOVEMENT_ORBIT = 'OrbitMovement';
const MOVEMENT_SPRING = 'SpringMovement';

/**
 * Base class for a movement behaviour.
 *
 * @param startTime Reference time for the start of movement, for syncing
 */
export abstract class MovementClass implements Behaviour {
  type: string = '';
}

export enum MovementStyle {
  Linear,
  FastToSlow,
  SlowToFast,
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
  const result: PathItem[] = [];
  for (let i = 0; i < path.length; i++) {
    const item = path[i];
    const start = parseVector3(item.start);
    const end = parseVector3(item.end);
    const duration = item.duration;
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
        start,
        end,
        duration,
        style: movementStyle,
      });
    }
  }
  return result;
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
    getCurrentTime?: () => number,
  ) {
    super();
    this.path = path;
    this.totalDuration = 0;
    if (startTime) {
      this.startTime = startTime;
    } else {
      const currentDate = new Date();
      this.startTime = currentDate.getTime();
    }
    if (getCurrentTime) {
      this.getCurrentTime = getCurrentTime;
    } else {
      this.getCurrentTime = () => {
        const currentDate = new Date();
        return currentDate.getTime();
      };
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
        1,
      );
      switch (currentItem.style) {
        case MovementStyle.SlowToFast: {
          ratio **= 5;
          break;
        }
        case MovementStyle.FastToSlow: {
          let negative = 1 - ratio;
          negative **= 5;
          ratio = 1 - negative;
          break;
        }
      }
      const x =
        position.x +
        currentItem.start.x +
        ratio * (currentItem.end.x - currentItem.start.x);
      const y =
        position.y +
        currentItem.start.y +
        ratio * (currentItem.end.y - currentItem.start.y);
      const z =
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
    getCurrentTime?: () => number,
  ) {
    super();
    this.radius = radius;
    this.duration = duration;
    if (startTime) {
      this.startTime = startTime;
    } else {
      let currentDate = new Date();
      this.startTime = currentDate.getTime();
    }
    if (getCurrentTime) {
      this.getCurrentTime = getCurrentTime;
    } else {
      this.getCurrentTime = () => {
        let currentDate = new Date();
        return currentDate.getTime();
      };
    }
  }
  public getOffsetPosition(position: Vector3) {
    const currentFrame =
      (this.getCurrentTime() - this.startTime) % (this.duration * 1000);
    const ratio = Math.min(
      Math.max(0, currentFrame / (this.duration * 1000)),
      1,
    );
    const angle = ratio * Math.PI * 2;
    const x = position.x + this.radius * Math.sin(angle);
    const y = position.y;
    const z = position.z + this.radius * Math.cos(angle);
    return new Vector3(x, y, z);
  }
}

export class SpringMovement extends MovementClass {
  type = MOVEMENT_SPRING;
}

export function parseMovement(movement: any, getCurrentTime?: () => number) {
  if (!movement) return undefined;
  switch (movement.type) {
    case MOVEMENT_PATH: {
      const startTime = movement.startTime;
      const pathItems = movement.path;
      if (
        (startTime === undefined || typeof startTime === 'number') &&
        Array.isArray(pathItems)
      ) {
        const parsedPathItems = parsePathItems(pathItems);
        return new PathMovement(parsedPathItems, startTime, getCurrentTime);
      }
      break;
    }
    case MOVEMENT_ORBIT: {
      const radius = movement.radius;
      const duration = movement.duration;
      const startTime = movement.startTime;
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
