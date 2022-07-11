/* [Imports] */
import { clone, Geom3 } from '@jscad/modeling/src/geometries/geom3';
import { ModuleContext, ModuleState } from 'js-slang';
import { ModuleContexts, ReplResult } from '../../typings/type_helpers.js';
import { AlphaColor, Color, Solid } from './jscad/types.js';

/* [Exports] */
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
  private componentCounter: number = 0;

  readonly renderGroupManager: RenderGroupManager;

  constructor() {
    this.renderGroupManager = new RenderGroupManager();
  }

  // Returns the new component number
  nextComponent() {
    return ++this.componentCounter;
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

export function colorToAlphaColor(
  color: Color,
  opacity: number = 1
): AlphaColor {
  return [...color, opacity];
}

export function hexToAlphaColor(hex: string): AlphaColor {
  return colorToAlphaColor(hexToColor(hex));
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
