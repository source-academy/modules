import {
  BoxGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import {
  type Behaviours,
  LightModel,
  RenderWithinDistance,
  ShapeModel,
  InterfaceModel,
  type RotationClass,
  parseRotation,
  type RenderClass,
  parseRender,
  parseMovement,
  type MovementClass,
  GltfModel,
} from './Behaviour';
import ARObjectComponent from './ARObjectComponent';
import { parseVector3 } from './Misc';
import { parseJsonInterface } from './model_components/InterfaceComponent';

/**
 * Abstract class for an AR object.
 * Extend this class to create your AR object.
 *
 * When converting to JSON, the object's class name will be stored in the 'class' key.
 * This can be used for identifying and restoring the object's class after parsing the JSON.
 */
export class ARObject {
  type: string = ''; // Unique identifier for class
  id: string;
  position: Vector3;
  behaviours: Behaviours;
  uuid: string | undefined = undefined;
  isInFront = false;
  isSelected = false;
  onSelect?: (object: ARObject) => void;
  constructor(
    id: string,
    position: Vector3,
    behaviours: Behaviours,
    onSelect?: (object: ARObject) => void,
  ) {
    this.id = id;
    this.position = position;
    this.behaviours = behaviours;
    this.onSelect = onSelect;
  }
  toJSON = () => {
    const object = { ...this };
    const behavioursClone = { ...this.behaviours } as any;
    delete behavioursClone.model;
    object.behaviours = behavioursClone;
    object.isInFront = false;
    return object;
  };
  static fromObject = (object: any) => {
    if (!object) return;
    let isSelected = false;
    const tempSelected = object.isSelected;
    if (typeof tempSelected === 'boolean') {
      isSelected = tempSelected;
    }
    let newObject = CubeObject.parseObject(object);
    if (newObject) {
      newObject.isSelected = isSelected;
      return newObject;
    }
    newObject = SphereObject.parseObject(object);
    if (newObject) {
      newObject.isSelected = isSelected;
      return newObject;
    }
    newObject = GltfObject.parseObject(object);
    if (newObject) {
      newObject.isSelected = isSelected;
      return newObject;
    }
    newObject = UIObject.parseObject(object);
    if (newObject) {
      newObject.isSelected = isSelected;
      return newObject;
    }
    newObject = LightObject.parseObject(object);
    if (newObject) {
      newObject.isSelected = isSelected;
      return newObject;
    }
    return undefined;
  };
  getComponent(getUserPosition: () => Vector3) {
    return (
      <ARObjectComponent
        key={this.id}
        arObject={this}
        getUserPosition={getUserPosition}
        setUUID={(uuid: string) => {
          this.uuid = uuid;
        }}
        onSelect={this.onSelect}
      />
    );
  }
}

const CUBE_OBJECT_TYPE = 'CubeObject';
export class CubeObject extends ARObject {
  type = CUBE_OBJECT_TYPE;
  width: number;
  height: number;
  depth: number;
  color: number;
  constructor(
    id: string,
    position: Vector3,
    width: number,
    height: number,
    depth: number,
    color: number,
    render?: RenderClass,
    rotation?: RotationClass,
    movement?: MovementClass,
    onSelect?: (object: ARObject) => void,
  ) {
    super(
      id,
      position,
      {
        model: new ShapeModel(
          new BoxGeometry(width, height, depth),
          new MeshStandardMaterial({ color }),
        ),
        render,
        rotation,
        movement,
      },
      onSelect,
    );
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
  }
  static parseObject(object: any, onSelect?: () => void): ARObject | undefined {
    if (!object || object.type !== CUBE_OBJECT_TYPE) return undefined;
    const id = object.id;
    const position = parseVector3(object.position);
    const render = parseRender(object.behaviours?.render);
    const rotation = parseRotation(object.behaviours?.rotation);
    const movement = parseMovement(object.behaviours?.movement);
    const width = object.width;
    const height = object.height;
    const depth = object.depth;
    const color = object.color;
    if (
      typeof id === 'string' &&
      position instanceof Vector3 &&
      typeof width === 'number' &&
      typeof height === 'number' &&
      typeof depth === 'number' &&
      typeof color === 'number'
    ) {
      return new CubeObject(
        id,
        position,
        width,
        height,
        depth,
        color,
        render,
        rotation,
        movement,
        onSelect,
      );
    }
    return undefined;
  }
}

const SPHERE_OBJECT_TYPE = 'SphereObject';
export class SphereObject extends ARObject {
  type = SPHERE_OBJECT_TYPE;
  radius: number;
  color: number;
  constructor(
    id: string,
    position: Vector3,
    radius: number,
    color: number,
    render?: RenderClass,
    rotation?: RotationClass,
    movement?: MovementClass,
    onSelect?: (object: ARObject) => void,
  ) {
    super(
      id,
      position,
      {
        model: new ShapeModel(
          new SphereGeometry(radius, 20, 20),
          new MeshStandardMaterial({ color }),
        ),
        render,
        rotation,
        movement,
      },
      onSelect,
    );
    this.radius = radius;
    this.color = color;
  }
  static parseObject(object: any, onSelect?: () => void): ARObject | undefined {
    if (!object || object.type !== SPHERE_OBJECT_TYPE) return undefined;
    const id = object.id;
    const position = parseVector3(object.position);
    const render = parseRender(object.behaviours?.render);
    const rotation = parseRotation(object.behaviours?.rotation);
    const movement = parseMovement(object.behaviours?.movement);
    const radius = object.radius;
    const color = object.color;
    if (
      typeof id === 'string' &&
      position instanceof Vector3 &&
      typeof radius === 'number' &&
      typeof color === 'number'
    ) {
      return new SphereObject(
        id,
        position,
        radius,
        color,
        render,
        rotation,
        movement,
        onSelect,
      );
    }
    return undefined;
  }
}

const GLTF_OBJECT_TYPE = 'GltfObject';
export class GltfObject extends ARObject {
  type = GLTF_OBJECT_TYPE;
  src: string;
  scale: number;
  constructor(
    id: string,
    position: Vector3,
    src: string,
    scale: number,
    render?: RenderClass,
    rotation?: RotationClass,
    movement?: MovementClass,
    onSelect?: (object: ARObject) => void,
  ) {
    super(
      id,
      position,
      {
        model: new GltfModel(src, scale),
        render,
        rotation,
        movement,
      },
      onSelect,
    );
    this.src = src;
    this.scale = scale;
  }
  static parseObject(object: any, onSelect?: () => void): ARObject | undefined {
    if (!object || object.type !== GLTF_OBJECT_TYPE) return undefined;
    const id = object.id;
    const position = parseVector3(object.position);
    const render = parseRender(object.behaviours?.render);
    const rotation = parseRotation(object.behaviours?.rotation);
    const movement = parseMovement(object.behaviours?.movement);
    const src = object.src;
    const scale = object.scale;
    if (
      typeof id === 'string' &&
      position instanceof Vector3 &&
      typeof src === 'string' &&
      typeof scale === 'number'
    ) {
      return new GltfObject(
        id,
        position,
        src,
        scale,
        render,
        rotation,
        movement,
        onSelect,
      );
    }
    return undefined;
  }
}

const UI_OBJECT_TYPE = 'UIObject';
export class UIObject extends ARObject {
  type = UI_OBJECT_TYPE;
  uiJson: any;
  constructor(
    id: string,
    position: Vector3,
    uiJson: any,
    render?: RenderClass,
    rotation?: RotationClass,
    movement?: MovementClass,
    onSelect?: (object: ARObject) => void,
  ) {
    super(
      id,
      position,
      {
        model: new InterfaceModel(uiJson),
        render,
        rotation,
        movement,
      },
      onSelect,
    );
    this.uiJson = uiJson;
  }
  static parseObject(object: any, onSelect?: () => void): ARObject | undefined {
    if (!object || object.type !== UI_OBJECT_TYPE) return undefined;
    const id = object.id;
    const position = parseVector3(object.position);
    const render = parseRender(object.behaviours?.render);
    const rotation = parseRotation(object.behaviours?.rotation);
    const movement = parseMovement(object.behaviours?.movement);
    const uiJson = parseJsonInterface(object.uiJson);
    if (
      typeof id === 'string' &&
      position instanceof Vector3 &&
      uiJson !== undefined
    ) {
      return new UIObject(
        id,
        position,
        uiJson,
        render,
        rotation,
        movement,
        onSelect,
      );
    }
    return undefined;
  }
}

const LIGHT_OBJECT_TYPE = 'LightObject';
export class LightObject extends ARObject {
  type = LIGHT_OBJECT_TYPE;
  intensity: number;
  constructor(id: string, position: Vector3, intensity: number) {
    super(id, position, {
      model: new LightModel(intensity),
      render: new RenderWithinDistance(20),
    });
    this.intensity = intensity;
  }
  static parseObject(object: any): ARObject | undefined {
    if (!object || object.type !== LIGHT_OBJECT_TYPE) return undefined;
    const id = object.id;
    const position = parseVector3(object.position);
    const intensity = object.intensity;
    if (
      typeof id === 'string' &&
      position instanceof Vector3 &&
      typeof intensity === 'number'
    ) {
      return new LightObject(id, position, intensity);
    }
    return undefined;
  }
}
