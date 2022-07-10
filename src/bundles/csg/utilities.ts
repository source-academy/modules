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
import { ModuleContexts, ReplResult } from '../../typings/type_helpers.js';
import {
  ACE_GUTTER_TEXT_COLOR,
  BP_TEXT_COLOR,
  GRID_PADDING,
  MAIN_TICKS,
  ROUND_UP_INTERVAL,
  SUB_TICKS,
} from './constants.js';
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
export class MultiGridEntity implements MultiGridEntityType {
  visuals: {
    drawCmd: 'drawGrid';
    show: boolean;
    color?: RGBA;
    subColor?: RGBA;
  } = {
    drawCmd: 'drawGrid',
    show: true,

    color: hexToRgba(BP_TEXT_COLOR),
    subColor: hexToRgba(ACE_GUTTER_TEXT_COLOR),
  };

  ticks: [number, number] = [MAIN_TICKS, SUB_TICKS];

  size: [number, number];

  constructor(size: number) {
    this.size = [size, size];
  }
}

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

export class Shape implements ReplResult {
  constructor(public solid: Solid) {}

  toReplString(): string {
    return '<Shape>';
  }

  clone(): Shape {
    return new Shape(clone(this.solid as Geom3));
  }
}

export class RenderGroup implements ReplResult {
  constructor(public canvasNumber: number) {}

  render: boolean = false;
  hasGrid: boolean = true;
  hasAxis: boolean = true;

  shapes: Shape[] = [];

  toReplString(): string {
    return `<Render #${this.canvasNumber}>`;
  }
}

export class RenderGroupManager {
  private canvasTracker: number = 1;
  private renderGroups: RenderGroup[] = [];

  constructor() {
    this.addRenderGroup();
  }

  private addRenderGroup(): void {
    // Passes in canvasTracker as is, then increments it
    this.renderGroups.push(new RenderGroup(this.canvasTracker++));
  }

  private getCurrentRenderGroup(): RenderGroup {
    return this.renderGroups.at(-1) as RenderGroup;
  }

  // Returns the old render group
  nextRenderGroup(
    oldHasGrid: boolean = false,
    oldHasAxis: boolean = false
  ): RenderGroup {
    let oldRenderGroup: RenderGroup = this.getCurrentRenderGroup();
    oldRenderGroup.render = true;
    oldRenderGroup.hasGrid = oldHasGrid;
    oldRenderGroup.hasAxis = oldHasAxis;

    this.addRenderGroup();

    return oldRenderGroup;
  }

  storeShape(shape: Shape): void {
    this.getCurrentRenderGroup().shapes.push(shape);
  }

  shouldRender(): boolean {
    return this.getGroupsToRender().length > 0;
  }

  getGroupsToRender(): RenderGroup[] {
    return this.renderGroups.filter(
      (renderGroup: RenderGroup) => renderGroup.render
    );
  }
}

export class CsgModuleState implements ModuleState {
  componentCounter: number = 0;

  readonly renderGroupManager: RenderGroupManager;

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

  lastX = -1;

  lastY = -1;

  rotateX = 0;

  rotateY = 0;

  panX = 0;

  panY = 0;

  getZoomTicks(): number {
    return this.zoomTicks;
  }

  changeZoomTicks(wheelDelta: number) {
    this.zoomTicks += Math.sign(wheelDelta);
  }

  setZoomToFit() {
    this.zoomToFitOnce = true;
  }

  unsetLastCoordinates() {
    this.lastX = -1;
    this.lastY = -1;
  }

  setHeldPointer(mouseEventButton: number) {
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

  unsetHeldPointer() {
    this.heldPointer = MousePointer.NONE;
  }

  shouldZoom(): boolean {
    return this.zoomTicks !== 0;
  }

  didZoom() {
    this.zoomTicks = 0;
  }

  shouldZoomToFit(): boolean {
    return this.zoomToFitOnce;
  }

  didZoomToFit() {
    this.zoomToFitOnce = false;
  }

  shouldRotate(): boolean {
    return this.rotateX !== 0 || this.rotateY !== 0;
  }

  didRotate() {
    this.rotateX = 0;
    this.rotateY = 0;
  }

  shouldPan(): boolean {
    return this.panX !== 0 || this.panY !== 0;
  }

  didPan() {
    this.panX = 0;
    this.panY = 0;
  }

  shouldIgnorePointerMove(): boolean {
    return [MousePointer.NONE, MousePointer.RIGHT].includes(this.heldPointer);
  }

  isPointerPan(isShiftKey: boolean): boolean {
    return (
      this.heldPointer === MousePointer.MIDDLE ||
      (this.heldPointer === MousePointer.LEFT && isShiftKey)
    );
  }
}

// Used as options when setting camera projection
export class CameraViewportDimensions {
  constructor(public width: number, public height: number) {}
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

export function colorToRgba(color: Color, opacity: number = 1): RGBA {
  return [...color, opacity];
}

export function hexToRgba(hex: string): RGBA {
  return colorToRgba(hexToColor(hex));
}

export function clamp(value: number, lowest: number, highest: number): number {
  value = Math.max(value, lowest);
  value = Math.min(value, highest);
  return value;
}

// When the object's class and the class used for comparison are from different
// contexts, they may appear identical, but are not recognised as such.
// This check acts as a useful yet not foolproof instanceof
export function looseInstanceof(
  object: object | null | undefined,
  c: any
): boolean {
  const objectName: string | undefined = object?.constructor?.name;
  const className: string | undefined = c?.name;
  return (
    objectName !== undefined &&
    className !== undefined &&
    objectName === className
  );
}

export function neatGridDistance(rawDistance: number) {
  let paddedDistance: number = rawDistance + GRID_PADDING;
  let roundedDistance: number =
    Math.ceil(paddedDistance / ROUND_UP_INTERVAL) * ROUND_UP_INTERVAL;
  return roundedDistance;
}
