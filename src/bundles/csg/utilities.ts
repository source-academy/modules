/* [Imports] */
import { RGBA } from '@jscad/modeling/src/colors';
import { clone, Geom3 } from '@jscad/modeling/src/geometries/geom3';
import {
  cameras,
  controls as _controls,
  drawCommands,
  entitiesFromSolids as _entitiesFromSolids,
  prepareRender as _prepareRender,
} from '@jscad/regl-renderer';
import { ModuleContext, ModuleState } from 'js-slang';
import { ModuleContexts } from '../../typings/type_helpers.js';
import {
  AxisEntityType,
  Color,
  Controls,
  ControlsState,
  EntitiesFromSolids,
  MultiGridEntityType,
  PerspectiveCamera,
  PerspectiveCameraState,
  PrepareRender,
  Solid,
  WrappedRenderer,
} from './types';

/* [Exports] */

// [Proper typing for JS in regl-renderer]
export const perspectiveCamera: PerspectiveCamera = cameras.perspective;
export const perspectiveCameraStateDefaults: PerspectiveCameraState =
  perspectiveCamera.defaults;

export const controls: Controls = (_controls.orbit as unknown) as Controls;
export const controlsStateDefaults: ControlsState = controls.defaults;

export const prepareRender: PrepareRender.Function = _prepareRender;

export const entitiesFromSolids: EntitiesFromSolids.Function = (_entitiesFromSolids as unknown) as EntitiesFromSolids.Function;
export const prepareDrawCommands: WrappedRenderer.PrepareDrawCommands = drawCommands;

// [Custom]
export class AxisEntity implements AxisEntityType {
  visuals: {
    drawCmd: 'drawAxis';
    show: boolean;
  } = {
    drawCmd: 'drawAxis',
    show: true,
  };

  alwaysVisible: boolean = false;

  constructor(public size?: number) {}
}

export class MultiGridEntity implements MultiGridEntityType {
  visuals: {
    drawCmd: 'drawGrid';
    show: boolean;
    color?: RGBA;
    subColor?: RGBA;
  } = {
    drawCmd: 'drawGrid',
    show: true,
    color: [0, 0, 0, 1],
    subColor: [0.5, 0.5, 0.5, 1],
  };

  size: [number, number] = [0, 0];

  ticks: [number, number] = [10, 1];

  constructor(size: number) {
    this.size = [size, size];
  }
}

export class Shape {
  constructor(public solid: Solid) {}

  clone(): Shape {
    return new Shape(clone(this.solid as Geom3));
  }

  toReplString(): string {
    return '<Shape>';
  }
}

export class RenderGroup {
  constructor(public canvasNumber: number) {}

  render: boolean = false;
  hasAxis: boolean = true;
  hasGrid: boolean = true;

  shapes: Shape[] = [];

  toReplString(): string {
    return `<Render #${this.canvasNumber}>`;
  }
}

export class RenderGroupManager {
  canvasTracker: number = 1;
  renderGroups: RenderGroup[] = [];

  nextRenderGroup(
    currentAxis: boolean = true,
    currentGrid: boolean = true
  ): void {
    if (this.renderGroups.length >= 1) {
      let currentRenderGroup: RenderGroup = this.renderGroups.at(
        -1
      ) as RenderGroup;
      currentRenderGroup.render = true;
      currentRenderGroup.hasAxis = currentAxis;
      currentRenderGroup.hasGrid = currentGrid;
    }

    // Passes in canvasTracker as is, then increments it
    this.renderGroups.push(new RenderGroup(this.canvasTracker++));
  }

  storeShape(shape: Shape): void {
    if (this.renderGroups.length <= 0) this.nextRenderGroup();

    let currentRenderGroup: RenderGroup = this.renderGroups.at(
      -1
    ) as RenderGroup;
    currentRenderGroup.shapes.push(shape);
  }

  render(): boolean {
    return this.getGroupsToRender().length > 0;
  }

  getGroupsToRender(): RenderGroup[] {
    return this.renderGroups.filter(
      (renderGroup: RenderGroup) => renderGroup.render
    );
  }
}

export class CsgModuleState implements ModuleState {
  renderGroupManager: RenderGroupManager;

  constructor() {
    this.renderGroupManager = new RenderGroupManager();
  }
}

// To track the processing to be done between frames
export enum MousePointer {
  NONE = -1,
  LEFT = 0,
  RIGHT = 2,
  MIDDLE = 1,
  OTHER = 7050,
}
export class FrameTracker {
  private zoomTicks = 0;

  // Start off the first frame by initially zooming to fit
  private zoomToFitOnce = true;

  private heldPointer: MousePointer = MousePointer.NONE;

  public lastX = -1;

  public lastY = -1;

  public rotateX = 0;

  public rotateY = 0;

  public panX = 0;

  public panY = 0;

  public getZoomTicks(): number {
    return this.zoomTicks;
  }

  public changeZoomTicks(wheelDelta: number) {
    this.zoomTicks += Math.sign(wheelDelta);
  }

  public setZoomToFit() {
    this.zoomToFitOnce = true;
  }

  public unsetLastCoordinates() {
    this.lastX = -1;
    this.lastY = -1;
  }

  public setHeldPointer(mouseEventButton: number) {
    switch (mouseEventButton) {
      case MousePointer.LEFT:
      case MousePointer.RIGHT:
      case MousePointer.MIDDLE:
        this.heldPointer = mouseEventButton;
        break;
      default:
        this.heldPointer = MousePointer.OTHER;
        break;
    }
  }

  public unsetHeldPointer() {
    this.heldPointer = MousePointer.NONE;
  }

  public shouldZoom(): boolean {
    return this.zoomTicks !== 0;
  }

  public didZoom() {
    this.zoomTicks = 0;
  }

  public shouldZoomToFit(): boolean {
    return this.zoomToFitOnce;
  }

  public didZoomToFit() {
    this.zoomToFitOnce = false;
  }

  public shouldRotate(): boolean {
    return this.rotateX !== 0 || this.rotateY !== 0;
  }

  public didRotate() {
    this.rotateX = 0;
    this.rotateY = 0;
  }

  public shouldPan(): boolean {
    return this.panX !== 0 || this.panY !== 0;
  }

  public didPan() {
    this.panX = 0;
    this.panY = 0;
  }

  public ignorePointerMove(): boolean {
    return [MousePointer.NONE, MousePointer.RIGHT].includes(this.heldPointer);
  }

  public isPointerPan(isShiftKey: boolean): boolean {
    return (
      this.heldPointer === MousePointer.MIDDLE ||
      (this.heldPointer === MousePointer.LEFT && isShiftKey)
    );
  }
}

// Used as options when setting camera projection
export class CameraViewportDimensions {
  public constructor(public width: number, public height: number) {}
}

export function getModuleContext(
  moduleContexts: ModuleContexts
): ModuleContext | null {
  let potentialModuleContext: ModuleContext | undefined = moduleContexts.get(
    'csg'
  );
  return potentialModuleContext ?? null;
}

export function hexToColor(hex: string): Color {
  let regex: RegExp = /^#?(?<red>[\da-f]{2})(?<green>[\da-f]{2})(?<blue>[\da-f]{2})$/iu;
  let potentialGroups: { [key: string]: string } | undefined = hex.match(regex)
    ?.groups;
  if (potentialGroups === undefined) return [0, 0, 0];
  let groups: { [key: string]: string } = potentialGroups;

  return [
    parseInt(groups.red, 16) / 0xff,
    parseInt(groups.green, 16) / 0xff,
    parseInt(groups.blue, 16) / 0xff,
  ];
}

export function clamp(value: number, lowest: number, highest: number): number {
  value = Math.max(value, lowest);
  value = Math.min(value, highest);
  return value;
}

// When the object's class and the class used for comparison are from different
// contexts, they may appear identical, but are not recognised as such.
// This check acts as a useful yet not foolproof instanceof
export function looseInstanceof(object: Object, c: any): boolean {
  const objectName: string | undefined = object?.constructor?.name;
  const className: string | undefined = c?.name;
  return (
    objectName !== undefined &&
    className !== undefined &&
    objectName === className
  );
}
