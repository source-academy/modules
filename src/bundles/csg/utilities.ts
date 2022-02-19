import { cssColors } from '@jscad/modeling/src/colors';
import { Geom3 } from '@jscad/modeling/src/geometries/types';
import {
  cameras,
  drawCommands,
  controls,
  entitiesFromSolids as _entitiesFromSolids,
  prepareRender as _prepareRender,
} from '@jscad/regl-renderer';
import {
  EntitiesFromSolids,
  OrbitControls,
  OrbitControlsState,
  PerspectiveCamera,
  PerspectiveCameraState,
  PrepareRender,
  WrappedRenderer,
} from './types';

/* [Exports] */
// [Proper typing for JS in regl-renderer]
export const prepareRender: PrepareRender.Function = _prepareRender;

export const perspectiveCamera: PerspectiveCamera = cameras.perspective;
export const perspectiveCameraStateDefaults: PerspectiveCameraState =
  perspectiveCamera.defaults;

export const orbitControls: OrbitControls = controls.orbit;
export const orbitControlsStateDefaults: OrbitControlsState =
  orbitControls.defaults;

export const entitiesFromSolids: EntitiesFromSolids.Function = (_entitiesFromSolids as unknown) as EntitiesFromSolids.Function;
export const prepareDrawCommands: WrappedRenderer.PrepareDrawCommands = drawCommands;

export class Shape {
  public getSolid: () => Geom3;

  public constructor(
    solidCallback: () => Geom3,
    // Whether a Source program that results in this Shape should spawn the CSG tab
    public spawnsTab: boolean = false,
    public axis: boolean = false,
    public grid: boolean = false,
    private shapeName: string = 'Shape'
  ) {
    this.getSolid = solidCallback;
  }

  public toReplString(): string {
    return `<${this.shapeName}>`;
  }
}

// [Custom]
export function looseInstanceOf(object: Object, c: any): boolean {
  const objectName: string | undefined = object?.constructor?.name;
  const className: string | undefined = c?.name;
  return (
    objectName !== undefined &&
    className !== undefined &&
    objectName === className
  );
}

export const {
  black,
  navy,
  green,
  teal,
  purple,
  orange,
  silver,
  grey,
  blue,
  lime,
  cyan,
  pink,
  yellow,
  white,
} = cssColors;
