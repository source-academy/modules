/* [Imports] */
import { RGBA } from '@jscad/modeling/src/colors';
import {
  cameras,
  controls as _controls,
  drawCommands,
  entitiesFromSolids as _entitiesFromSolids,
  prepareRender as _prepareRender,
} from '@jscad/regl-renderer';
import {
  Color,
  Controls,
  ControlsState,
  EntitiesFromSolids,
  Entity,
  GridEntity,
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
export namespace AxisEntity {
  // @jscad\regl-renderer\src\rendering\commands\drawAxis\index.js
  // @jscad\regl-renderer\demo-web.js
  export type Type = Entity & {
    visuals: {
      drawCmd: 'drawAxis';
    };

    xColor?: RGBA;
    yColor?: RGBA;
    zColor?: RGBA;
    size?: number;
    alwaysVisible?: boolean;

    // Deprecated
    lineWidth?: number;
  };

  export class Class implements Type {
    public visuals: {
      drawCmd: 'drawAxis';
      show: boolean;
    } = {
      drawCmd: 'drawAxis',
      show: true,
    };

    public alwaysVisible: boolean = false;
  }
}

export namespace MultiGridEntity {
  // @jscad\regl-renderer\src\rendering\commands\drawGrid\multi.js
  // @jscad\regl-renderer\demo-web.js
  // @jscad\web\src\ui\views\viewer.js
  // @jscad\regl-renderer\src\index.js
  export type Type = Omit<GridEntity, 'ticks'> & {
    // Entity#visuals gets stuffed into the nested DrawCommand as Props.
    // The Props get passed on wholesale by makeDrawMultiGrid()'s returned lambda,
    // where the following properties then get used
    // (rather than while setting up the DrawCommands)
    visuals: {
      subColor?: RGBA; // As color
    };

    // First number used on the main grid, second number on sub grid
    ticks?: [number, number];
  };

  export class Class implements Type {
    public visuals: {
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

    public size: [number, number] = [0, 0];

    public ticks: [number, number] = [10, 1];
  }
}

export class Shape {
  constructor(public solid: Solid) {}

  toReplString(): string {
    return '<Shape>';
  }
}

export class RenderGroup {
  constructor(public canvasNumber: number) {}

  hasAxis: boolean = false;
  hasGrid: boolean = false;

  shapes: Shape[] = [];

  toReplString(): string {
    return `<Render #${this.canvasNumber}>`;
  }
}

//TODO is module context per module API call / page refresh, or per run?
// This only works properly if it's per run, or errors will make unrendered shapes spill over
export class RenderGroupManager {
  canvasTracker: number = 1;
  renderGroups: RenderGroup[] = [];

  nextRenderGroup(): void {
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

  getRenderGroups(): RenderGroup[] {
    return [...this.renderGroups];
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

// When the object's class and the class used for comparison are from different
// contexts, they may appear identical, but are not recognised as such.
// This check acts as a useful but unconfirmed instanceOf
export function looseInstanceOf(object: Object, c: any): boolean {
  const objectName: string | undefined = object?.constructor?.name;
  const className: string | undefined = c?.name;
  return (
    objectName !== undefined &&
    className !== undefined &&
    objectName === className
  );
}

/* eslint-disable no-bitwise */
// Eg 0x00ffaa into [0, 1, 2/3]
export function hexToColor(hex: number): Color {
  const red = (hex & 0xff0000) >>> 16;
  const green = (hex & 0x00ff00) >>> 8;
  const blue = hex & 0x0000ff;

  return [red / 0xff, green / 0xff, blue / 0xff];
}
/* eslint-enable no-bitwise */
