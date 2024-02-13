import {
  BoxGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import {
  type Behaviours,
  LightModel,
  RenderWithinDistance,
  ShapeModel,
  InterfaceModel,
  RotationClass,
  parseRotation,
  RenderClass,
  parseRender,
  parseMovement,
  MovementClass,
} from "./Behaviour";
import ARObjectComponent from "./ARObjectComponent";
import { parseVector3 } from "../calibration_library/Misc";

/**
 * Abstract class for an AR object.
 * Extend this class to create your AR object.
 *
 * When converting to JSON, the object's class name will be stored in the 'class' key.
 * This can be used for identifying and restoring the object's class after parsing the JSON.
 */
export class ARObject {
  type: string = ""; // Unique identifier for class
  id: string;
  position: Vector3;
  behaviours: Behaviours;
  uuid: string | undefined = undefined;
  isHighlighted = false;
  onSelect?: (object: ARObject) => void;
  constructor(
    id: string,
    position: Vector3,
    behaviours: Behaviours,
    onSelect?: (object: ARObject) => void
  ) {
    this.id = id;
    this.position = position;
    this.behaviours = behaviours;
    this.onSelect = onSelect;
  }
  toJSON = () => {
    let object = Object.assign({}, this) as any;
    let behavioursClone = Object.assign({}, this.behaviours) as any;
    delete behavioursClone.model;
    object.behaviours = behavioursClone;
    return object;
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

const CUBE_OBJECT_TYPE = "CubeObject";
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
    onSelect?: (object: ARObject) => void
  ) {
    super(
      id,
      position,
      {
        model: new ShapeModel(
          new BoxGeometry(width, height, depth),
          new MeshStandardMaterial({ color: color })
        ),
        render: render,
        rotation: rotation,
        movement: movement,
      },
      onSelect
    );
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
  }
  static parseObject(object: any, onSelect?: () => void): ARObject | undefined {
    if (!object || object.type !== CUBE_OBJECT_TYPE) return undefined;
    let id = object.id;
    let position = parseVector3(object.position);
    let render = parseRender(object.behaviours?.render);
    let rotation = parseRotation(object.behaviours?.rotation);
    let movement = parseMovement(object.behaviours?.movement);
    let width = object.width;
    let height = object.height;
    let depth = object.depth;
    let color = object.color;
    if (
      typeof id === "string" &&
      position instanceof Vector3 &&
      typeof width === "number" &&
      typeof height === "number" &&
      typeof depth === "number" &&
      typeof color === "number"
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
        onSelect
      );
    }
    return undefined;
  }
}

const SPHERE_OBJECT_TYPE = "SphereObject";
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
    onSelect?: (object: ARObject) => void
  ) {
    super(
      id,
      position,
      {
        model: new ShapeModel(
          new SphereGeometry(radius, 20, 20),
          new MeshStandardMaterial({ color: color })
        ),
        render: render,
        rotation: rotation,
        movement: movement,
      },
      onSelect
    );
    this.radius = radius;
    this.color = color;
  }
  static parseObject(object: any, onSelect?: () => void): ARObject | undefined {
    if (!object || object.type !== SPHERE_OBJECT_TYPE) return undefined;
    let id = object.id;
    let position = parseVector3(object.position);
    let render = parseRender(object.behaviours?.render);
    let rotation = parseRotation(object.behaviours?.rotation);
    let movement = parseMovement(object.behaviours?.movement);
    let radius = object.radius;
    let color = object.color;
    if (
      typeof id === "string" &&
      position instanceof Vector3 &&
      typeof radius === "number" &&
      typeof color === "number"
    ) {
      return new SphereObject(
        id,
        position,
        radius,
        color,
        render,
        rotation,
        movement,
        onSelect
      );
    }
    return undefined;
  }
}

const UI_OBJECT_TYPE = "UIObject";
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
    onSelect?: (object: ARObject) => void
  ) {
    super(
      id,
      position,
      {
        model: new InterfaceModel(uiJson),
        render: render,
        rotation: rotation,
        movement: movement,
      },
      onSelect
    );
    this.uiJson = uiJson;
  }
  static parseObject(object: any, onSelect?: () => void): ARObject | undefined {
    if (!object || object.type !== UI_OBJECT_TYPE) return undefined;
    let id = object.id;
    let position = parseVector3(object.position);
    let render = parseRender(object.behaviours?.render);
    let rotation = parseRotation(object.behaviours?.rotation);
    let movement = parseMovement(object.behaviours?.movement);
    let uiJson = object.uiJson;
    if (
      typeof id === "string" &&
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
        onSelect
      );
    }
    return undefined;
  }
}

const LIGHT_OBJECT_TYPE = "LightObject";
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
    let id = object.id;
    let position = parseVector3(object.position);
    let intensity = object.intensity;
    if (
      typeof id === "string" &&
      position instanceof Vector3 &&
      typeof intensity === "number"
    ) {
      return new LightObject(id, position, intensity);
    }
    return undefined;
  }
}
