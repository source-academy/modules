/* [Imports] */
import {
  clone as _clone,
  transform as _transform,
  type Geom3,
} from '@jscad/modeling/src/geometries/geom3';
import mat4, { type Mat4 } from '@jscad/modeling/src/maths/mat4';
import {
  rotate as _rotate,
  scale as _scale,
  translate as _translate,
} from '@jscad/modeling/src/operations/transforms';
import type { ModuleContext } from 'js-slang';
import type { ModuleContexts, ReplResult } from '../../typings/type_helpers.js';
import { Core } from './core.js';
import type { AlphaColor, Color, Solid } from './jscad/types.js';
import { type List } from './types';

/* [Exports] */

export interface Entity {
  clone: () => Entity;
  store: (newTransforms?: Mat4) => void;
  translate: (offset: [number, number, number]) => Entity;
  rotate: (offset: [number, number, number]) => Entity;
  scale: (offset: [number, number, number]) => Entity;
}

export class Group implements ReplResult, Entity {
  children: Entity[];
  constructor(
    public childrenList: List,
    public transforms: Mat4 = mat4.create(),
  ) {
    this.children = listToArray(childrenList);
  }

  toReplString(): string {
    return '<Group>';
  }

  clone(): Group {
    return new Group(arrayToList(this.children.map((child) => child.clone())));
  }

  store(newTransforms?: Mat4): void {
    this.transforms = mat4.multiply(
      mat4.create(),
      newTransforms || mat4.create(),
      this.transforms,
    );

    this.children.forEach((child) => {
      child.store(this.transforms);
    });
  }

  translate(offset: [number, number, number]): Group {
    return new Group(
      this.childrenList,
      mat4.multiply(
        mat4.create(),
        mat4.fromTranslation(mat4.create(), offset),
        this.transforms,
      ),
    );
  }

  rotate(offset: [number, number, number]): Group {
    const yaw = offset[2];
    const pitch = offset[1];
    const roll = offset[0];

    return new Group(
      this.childrenList,
      mat4.multiply(
        mat4.create(),
        mat4.fromTaitBryanRotation(mat4.create(), yaw, pitch, roll),
        this.transforms,
      ),
    );
  }

  scale(offset: [number, number, number]): Group {
    return new Group(
      this.childrenList,
      mat4.multiply(
        mat4.create(),
        mat4.fromScaling(mat4.create(), offset),
        this.transforms,
      ),
    );
  }
}

export class Shape implements ReplResult, Entity {
  constructor(public solid: Solid) {}

  toReplString(): string {
    return '<Shape>';
  }

  clone(): Shape {
    return new Shape(_clone(this.solid as Geom3));
  }

  store(newTransforms?: Mat4): void {
    Core.getRenderGroupManager()
      .storeShape(
        new Shape(_transform(newTransforms || mat4.create(), this.solid)),
      );
  }

  translate(offset: [number, number, number]): Shape {
    return new Shape(_translate(offset, this.solid));
  }

  rotate(offset: [number, number, number]): Shape {
    return new Shape(_rotate(offset, this.solid));
  }

  scale(offset: [number, number, number]): Shape {
    return new Shape(_scale(offset, this.solid));
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

  private addRenderGroup() {
    // Passes in canvasTracker as is, then increments it
    this.renderGroups.push(new RenderGroup(this.canvasTracker++));
  }

  private getCurrentRenderGroup(): RenderGroup {
    return this.renderGroups.at(-1) as RenderGroup;
  }

  // Returns the old render group
  nextRenderGroup(
    oldHasGrid: boolean = false,
    oldHasAxis: boolean = false,
  ): RenderGroup {
    let oldRenderGroup: RenderGroup = this.getCurrentRenderGroup();
    oldRenderGroup.render = true;
    oldRenderGroup.hasGrid = oldHasGrid;
    oldRenderGroup.hasAxis = oldHasAxis;

    this.addRenderGroup();

    return oldRenderGroup;
  }

  storeShape(shape: Shape) {
    this.getCurrentRenderGroup().shapes.push(shape);
  }

  shouldRender(): boolean {
    return this.getGroupsToRender().length > 0;
  }

  getGroupsToRender(): RenderGroup[] {
    return this.renderGroups.filter(
      (renderGroup: RenderGroup) => renderGroup.render,
    );
  }
}

export class CsgModuleState {
  private componentCounter: number = 0;

  public readonly renderGroupManager: RenderGroupManager;

  public constructor() {
    this.renderGroupManager = new RenderGroupManager();
  }

  // Returns the new component number
  public nextComponent(): number {
    return ++this.componentCounter;
  }
}

export function getModuleContext(
  moduleContexts: ModuleContexts,
): ModuleContext | null {
  let potentialModuleContext: ModuleContext | undefined = moduleContexts.csg;
  return potentialModuleContext ?? null;
}

export function hexToColor(hex: string): Color {
  let regex: RegExp
    = /^#?(?<red>[\da-f]{2})(?<green>[\da-f]{2})(?<blue>[\da-f]{2})$/iu;
  let potentialGroups: { [key: string]: string } | undefined
    = hex.match(regex)?.groups;
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
  opacity: number = 1,
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

function length(list: List): number {
  let counter = 0;
  while (!(list === null)) {
    list = list[1];
    counter++;
  }
  return counter;
}

function listToArray(list: List): Entity[] {
  let retArr = new Array(length(list));
  let pointer = 0;
  while (!(list === null)) {
    retArr[pointer++] = list[0];
    list = list[1];
  }
  return retArr;
}

function arrayToList(arr: Entity[]): List {
  let retList: List = null;
  for (let i = arr.length - 1; i >= 0; --i) {
    retList = [arr[i], retList];
  }
  return retList;
}
