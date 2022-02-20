/* [Imports] */
import { cssColors } from '@jscad/modeling/src/colors';
import { Geom3 } from '@jscad/modeling/src/geometries/types';
import {
  cameras,
  drawCommands,
  entitiesFromSolids as _entitiesFromSolids,
  prepareRender as _prepareRender,
} from '@jscad/regl-renderer';
import {
  EntitiesFromSolids,
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

export const entitiesFromSolids: EntitiesFromSolids.Function = (_entitiesFromSolids as unknown) as EntitiesFromSolids.Function;
export const prepareDrawCommands: WrappedRenderer.PrepareDrawCommands = drawCommands;

// [Custom]
export class Shape {
  public getSolid: () => Geom3;

  public constructor(
    solidCallback: () => Geom3,
    // Whether a Source program that results in this Shape should spawn the CSG
    // tab
    public spawnsTab: boolean = false,
    // Whether to add the axis entity when rendering
    public addAxis: boolean = false,
    // Whether to add the multi grid entity when rendering
    public addMultiGrid: boolean = false
  ) {
    this.getSolid = solidCallback;
  }

  public static toReplString(): string {
    return '<Shape>';
  }
}

export class CameraViewportDimensions {
  public constructor(public width: number, public height: number) {}
}

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
